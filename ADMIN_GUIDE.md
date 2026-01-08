# 管理者ガイド - ONE TEAM

## 📋 概要
このガイドでは、管理者がユーザーアカウントを作成・管理する方法を説明します。

## 👥 ユーザーアカウントの作成方法

### 方法1: Supabaseダッシュボードから作成（推奨）

#### ステップ1: Authenticationページに移動
1. Supabaseダッシュボードにアクセス
   👉 https://supabase.com/dashboard/project/omhucnthjctzyymrgaan
2. 左側メニューから「**Authentication**」をクリック
3. 「**Users**」タブを選択

#### ステップ2: 新規ユーザーを作成
1. 右上の「**Add user**」または「**Create user**」ボタンをクリック
2. 以下の情報を入力：
   ```
   Email: tanaka@example.com（ログインIDとして使用）
   Password: 任意のパスワード（例: Riatis2024）
   Auto Confirm User: ✅ チェックを入れる（重要！）
   ```
3. 「**Create User**」をクリック

#### ステップ3: usersテーブルにユーザー情報を追加
1. 左側メニューから「**SQL Editor**」をクリック
2. 以下のSQLを実行（ユーザー情報を置き換えてください）：

```sql
-- ユーザー情報をusersテーブルに追加
INSERT INTO users (user_id, email, name, role)
VALUES (
    '(先ほど作成したユーザーのUID)',  -- Authentication > Users で確認
    'tanaka@example.com',
    '田中太郎',
    'sales_user'
);
```

**UIDの確認方法**:
- Authentication > Users でユーザー一覧を表示
- 作成したユーザーの行をクリック
- 「User UID」をコピー

#### ステップ4: 個人目標を設定（オプション）
```sql
-- 個人目標を設定（2026年1月の例）
INSERT INTO monthly_targets (user_id, target_month, target_revenue)
VALUES (
    '(ユーザーのUID)',
    '2026-01-01',
    500000  -- 50万円
);
```

---

### 方法2: SQL Editorから直接作成（上級者向け）

以下のSQLを実行してユーザーを一括作成できます：

```sql
-- 注意: この方法は上級者向けです
-- Supabase Authにユーザーを作成してから、UIDを使ってusersテーブルに追加してください
```

---

## 📝 ユーザーに渡す情報

ユーザーアカウントを作成したら、以下の情報を営業メンバーに伝えてください：

```
ONE TEAM ログイン情報
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【ログインURL】
https://8000-igq8699pazlqejv6zoou0-02b9cc79.sandbox.novita.ai/
（本番環境デプロイ後は変更されます）

【ログインID】
tanaka@example.com

【パスワード】
Riatis2024

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
※ パスワードは初回ログイン後に変更することを推奨します
※ ログインできない場合は管理者にお問い合わせください
```

---

## 🔧 ユーザー管理

### ユーザー情報の確認
```sql
-- 全ユーザーを確認
SELECT * FROM users;

-- 特定ユーザーの日報を確認
SELECT * FROM daily_reports WHERE user_id = '(UID)';
```

### パスワードのリセット
1. Authentication > Users でユーザーを選択
2. 「Reset Password」をクリック
3. 新しいパスワードを設定
4. 設定したパスワードをユーザーに伝える

### ユーザーの削除
1. Authentication > Users でユーザーを選択
2. 「Delete User」をクリック
3. 確認ダイアログで「Delete」をクリック

**注意**: ユーザーを削除すると、関連する日報データも自動的に削除されます（CASCADE設定済み）

---

## 🎯 目標設定

### チーム全体の目標を設定
```sql
-- 2026年1月のチーム目標（500万円）
INSERT INTO monthly_targets (user_id, target_month, target_revenue)
VALUES (NULL, '2026-01-01', 5000000)
ON CONFLICT (user_id, target_month) 
DO UPDATE SET target_revenue = 5000000;
```

### 個人目標を設定
```sql
-- 田中さんの個人目標（50万円）
INSERT INTO monthly_targets (user_id, target_month, target_revenue)
VALUES ('(UID)', '2026-01-01', 500000)
ON CONFLICT (user_id, target_month) 
DO UPDATE SET target_revenue = 500000;
```

---

## 📊 データ確認

### 日報データの確認
```sql
-- 本日の日報を確認
SELECT u.name, dr.* 
FROM daily_reports dr
JOIN users u ON dr.user_id = u.user_id
WHERE dr.report_date = CURRENT_DATE
ORDER BY dr.created_at DESC;

-- 月間集計
SELECT 
    u.name,
    COUNT(*) as report_count,
    SUM(dr.offer_count) as total_offers,
    SUM(dr.closed_deal_count) as total_deals
FROM daily_reports dr
JOIN users u ON dr.user_id = u.user_id
WHERE dr.report_date >= '2026-01-01' 
  AND dr.report_date < '2026-02-01'
GROUP BY u.name;
```

---

## 🔐 セキュリティ

### 重要な注意事項
1. ✅ Supabaseの管理画面へのアクセスは管理者のみに限定
2. ✅ ユーザーには強力なパスワードを設定
3. ✅ パスワードは安全な方法で共有（Slackのダイレクトメッセージなど）
4. ✅ 退職者のアカウントは速やかに削除

### Row Level Security (RLS)
- ✅ すべてのテーブルでRLSが有効化されています
- ✅ ユーザーは自分のデータのみ操作可能
- ✅ 全員が全日報を閲覧可能（チームの透明性）

---

## ❓ トラブルシューティング

### ログインできない
- [ ] ユーザーが作成されているか確認（Authentication > Users）
- [ ] 「Email Confirmed」がONになっているか確認
- [ ] usersテーブルにデータが登録されているか確認
- [ ] パスワードが正しいか確認

### データが表示されない
- [ ] RLSポリシーが正しく設定されているか確認
- [ ] ユーザーのuser_idが正しく設定されているか確認

---

## 📞 サポート
問題が発生した場合は、開発者にお問い合わせください。
