# Supabaseセットアップガイド

## 📋 概要
このガイドでは、ONE TEAMアプリのSupabaseデータベースをセットアップする手順を説明します。

## ✅ 前提条件
- Supabaseプロジェクトが作成済みであること
- プロジェクトURL: `https://omhucnthjctzyymrgaan.supabase.co`
- プロジェクトのダッシュボードにアクセスできること

## 🗄️ データベースセットアップ手順

### ステップ 1: SQL Editorを開く
1. Supabaseダッシュボードにログイン
2. 左側メニューから「SQL Editor」をクリック

### ステップ 2: テーブル作成SQLを実行
以下のSQLを実行してテーブルを作成します（`supabase_setup.sql`の内容）

```sql
-- 1. usersテーブル
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('sales_user', 'admin_user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. daily_reportsテーブル
CREATE TABLE IF NOT EXISTS daily_reports (
    report_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    report_date DATE NOT NULL,
    offer_count INTEGER NOT NULL DEFAULT 0,
    negotiation_count INTEGER NOT NULL DEFAULT 0,
    closed_deal_count INTEGER NOT NULL DEFAULT 0,
    riatis_view_count INTEGER NOT NULL DEFAULT 0,
    crm_operation_time INTEGER NOT NULL DEFAULT 0,
    next_action_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, report_date)
);

-- 3. monthly_targetsテーブル
CREATE TABLE IF NOT EXISTS monthly_targets (
    target_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    target_month DATE NOT NULL,
    target_revenue DECIMAL(12, 2),
    target_offer INTEGER,
    target_negotiation INTEGER,
    target_closed_deal INTEGER,
    target_riatis_view INTEGER,
    target_crm_time INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, target_month)
);

-- 4. quotesテーブル
CREATE TABLE IF NOT EXISTS quotes (
    quote_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date_key TEXT UNIQUE NOT NULL,
    author TEXT NOT NULL,
    text_original TEXT,
    text_japanese TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### ステップ 3: インデックス作成
パフォーマンス向上のためのインデックスを作成します。

```sql
CREATE INDEX IF NOT EXISTS idx_daily_reports_user_date ON daily_reports(user_id, report_date DESC);
CREATE INDEX IF NOT EXISTS idx_monthly_targets_user_month ON monthly_targets(user_id, target_month);
CREATE INDEX IF NOT EXISTS idx_quotes_date_key ON quotes(date_key);
```

### ステップ 4: Row Level Security (RLS)の設定

#### RLSを有効化
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
```

#### ポリシーの作成

**usersテーブル:**
```sql
CREATE POLICY "Users can view their own data"
    ON users FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own data"
    ON users FOR INSERT
    WITH CHECK (auth.uid() = user_id);
```

**daily_reportsテーブル:**
```sql
CREATE POLICY "Users can insert their own reports"
    ON daily_reports FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all reports"
    ON daily_reports FOR SELECT
    USING (true);

CREATE POLICY "Users can update their own reports"
    ON daily_reports FOR UPDATE
    USING (auth.uid() = user_id);
```

**monthly_targetsテーブル:**
```sql
CREATE POLICY "Users can view targets"
    ON monthly_targets FOR SELECT
    USING (true);
```

**quotesテーブル:**
```sql
CREATE POLICY "Anyone can view quotes"
    ON quotes FOR SELECT
    USING (true);
```

### ステップ 5: サンプルデータの挿入

#### 名言データ（5件サンプル）
```sql
INSERT INTO quotes (date_key, author, text_japanese) VALUES
('01-08', 'Winston Churchill', '成功は最終的なものではなく、失敗は致命的なものではない。大切なのは続ける勇気だ。'),
('01-09', 'Muhammad Ali', '限界とは、ただの思い込みに過ぎない。'),
('01-10', 'Kobe Bryant', '準備とは、言い訳をなくすことだ。'),
('01-11', 'Walt Disney', '夢を実現する唯一の方法は、それに向かって行動することだ。'),
('01-12', 'Henry Ford', 'できると思えばできる、できないと思えばできない。')
ON CONFLICT (date_key) DO NOTHING;
```

#### テスト用目標データ（2026年1月）
```sql
-- チーム全体の目標
INSERT INTO monthly_targets (user_id, target_month, target_revenue) VALUES
(NULL, '2026-01-01', 5000000)
ON CONFLICT (user_id, target_month) DO NOTHING;
```

### ステップ 6: 認証設定

#### Email認証を有効化
1. Supabaseダッシュボードで「Authentication」→「Providers」に移動
2. 「Email」が有効になっていることを確認
3. 必要に応じて「Confirm email」のチェックを外す（開発中のみ）

#### メールテンプレートの設定（オプション）
1. 「Authentication」→「Email Templates」に移動
2. 「Confirm signup」テンプレートをカスタマイズ

## 🧪 動作確認

### 1. ユーザー登録のテスト
1. アプリのサインアップページにアクセス
2. テストユーザーを作成
3. Supabaseダッシュボードの「Authentication」→「Users」で確認

### 2. データベースの確認
```sql
-- usersテーブルを確認
SELECT * FROM users;

-- quotesテーブルを確認
SELECT * FROM quotes;

-- monthly_targetsテーブルを確認
SELECT * FROM monthly_targets;
```

## 🔐 セキュリティ設定

### APIキーの管理
- **Anon Key**: フロントエンドで使用（公開OK）
- **Service Role Key**: バックエンドのみで使用（絶対に公開しない）

### RLSの重要性
- すべてのテーブルでRLSを有効化済み
- ユーザーは自分のデータのみ操作可能
- 管理者権限は別途実装予定

## 📝 次のステップ

1. ✅ データベースセットアップ完了
2. ✅ 認証設定完了
3. 🔄 ユーザー登録とログインのテスト
4. 🔄 日報投稿のテスト
5. ⏳ 365日分の名言データの追加
6. ⏳ ANALYZEページの開発
7. ⏳ ADMIN TOOLの開発

## ❓ トラブルシューティング

### エラー: "relation does not exist"
→ テーブルが作成されていません。ステップ2を再実行してください。

### エラー: "new row violates row-level security policy"
→ RLSポリシーの設定を確認してください。ステップ4を再実行してください。

### ユーザー登録後にusersテーブルにデータが入らない
→ RLSポリシーで`INSERT`が許可されているか確認してください。

## 📧 サポート
問題が発生した場合は、Supabaseのログを確認するか、開発者にお問い合わせください。
