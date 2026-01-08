# ONE TEAM - 営業日報管理システム

## 📋 概要
ONE TEAMは、株式会社RIATIS Sports様向けの営業マンの日報報告および分析業務を支援するWebアプリケーションです。
義務的な作業からモチベーションを高める体験へと変革し、チーム全体の目標達成を促進します。

## 🎨 デザインコンセプト
- **テーマ**: Energetic & Professional (REDBULLインスパイア)
- **カラー**: Black背景 + Red アクセント
- **コンセプト**: Cool, Motivating, High Performance

## 🚀 機能
### Phase 1（現在の実装）
- ✅ ログイン画面
- ✅ REPORTページ（日報入力）
  - 日替わり名言表示
  - 目標値表示（TEAM GOAL / YOUR GOAL）
  - 日報入力フォーム
  - モチベーション演出（成功モーダル）

### Phase 2（実装予定）
- ⏳ ANALYZEページ（分析機能）
  - 個人分析（YOUR）
  - チーム分析（TEAM）
  - KPI進捗表示
  - グラフ表示（売上推移）

### Phase 3（実装予定）
- ⏳ ADMIN TOOL（管理者機能）
  - アカウント管理
  - 目標値設定
  - KPI設定

## 📁 ファイル構成
```
/home/user/webapp/
├── index.html          # ログイン画面
├── report.html         # 日報入力ページ
├── styles.css          # 共通スタイル
├── css/
│   └── report.css      # REPORTページ専用スタイル
├── js/
│   ├── config.js       # Supabase設定
│   ├── auth.js         # 認証ロジック
│   └── report.js       # REPORTページロジック
└── README.md           # このファイル
```

## 🗄️ データベース構造（Supabase）

### テーブル: users
| カラム名 | 型 | 説明 |
|---------|---|-----|
| user_id | UUID | 主キー |
| email | TEXT | ログイン用メールアドレス |
| name | TEXT | ユーザー名 |
| role | TEXT | 'sales_user' or 'admin_user' |
| created_at | TIMESTAMP | 作成日時 |

### テーブル: daily_reports
| カラム名 | 型 | 説明 |
|---------|---|-----|
| report_id | UUID | 主キー |
| user_id | UUID | 外部キー（users） |
| report_date | DATE | 報告日 |
| offer_count | INTEGER | オファー数 |
| negotiation_count | INTEGER | 商談数 |
| closed_deal_count | INTEGER | 成約数 |
| riatis_view_count | INTEGER | RIATIS視聴数 |
| crm_operation_time | INTEGER | CRM操作時間（分） |
| next_action_text | TEXT | 明日のアクション |
| created_at | TIMESTAMP | 作成日時 |

### テーブル: monthly_targets
| カラム名 | 型 | 説明 |
|---------|---|-----|
| target_id | UUID | 主キー |
| user_id | UUID | 外部キー（NULL=チーム目標） |
| target_month | DATE | 対象月（YYYY-MM-01） |
| target_revenue | DECIMAL | 売上目標 |
| target_offer | INTEGER | オファー数目標 |
| target_negotiation | INTEGER | 商談数目標 |
| target_closed_deal | INTEGER | 成約数目標 |
| target_riatis_view | INTEGER | RIATIS視聴数目標 |
| target_crm_time | INTEGER | CRM操作時間目標 |

### テーブル: quotes
| カラム名 | 型 | 説明 |
|---------|---|-----|
| quote_id | UUID | 主キー |
| date_key | TEXT | 日付キー（MM-DD形式） |
| author | TEXT | 著者名 |
| text_original | TEXT | 原文 |
| text_japanese | TEXT | 日本語訳 |

## 🔧 セットアップ手順

### 1. Supabaseプロジェクト作成
1. [Supabase](https://supabase.com/)にアクセス
2. 新しいプロジェクトを作成
3. プロジェクトのURLとAPIキーを取得

### 2. データベース設定
SupabaseのSQL Editorで以下を実行（別途提供されるSQL文）

### 3. 設定ファイルの更新
`js/config.js`を編集：
```javascript
export const supabaseConfig = {
    url: 'あなたのSupabase URL',
    anonKey: 'あなたのSupabase Anon Key'
};
```

### 4. Vercelデプロイ
1. GitHubリポジトリにプッシュ
2. [Vercel](https://vercel.com/)でプロジェクトをインポート
3. デプロイ完了

## 📱 使い方
1. ログイン画面でメールアドレスとパスワードを入力
2. REPORTページで本日の業務実績を入力
3. 「報告する」ボタンで送信
4. ANALYZEページで分析結果を確認（実装後）

## 🔐 権限
- **営業マン（一般ユーザー）**: 日報入力、自身のデータ閲覧、チームデータ閲覧
- **管理者**: 全機能 + 管理者ツールへのアクセス

## 📝 TODO
- [ ] Supabase認証の実装
- [ ] データ保存機能の実装
- [ ] ANALYZEページの作成
- [ ] グラフ表示機能（Chart.js）
- [ ] ADMIN TOOLの作成
- [ ] 365日分の名言データの追加

## 🎯 開発ポリシー
- 最小構成で開発
- エラーは必ず報告
- GitHubへの自動プッシュなし
- スマートフォン・タブレット対応優先

## 📧 お問い合わせ
株式会社RIATIS Sports様専用システム
