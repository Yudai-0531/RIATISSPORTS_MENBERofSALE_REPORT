# 既存ユーザーの修正手順

## 🎯 目的
既に作成されている「鈴木雄大」さんのアカウントを確認済み状態にして、ログインできるようにします。

## 📝 手順

### ステップ1: Supabaseダッシュボードにアクセス
👉 https://supabase.com/dashboard/project/omhucnthjctzyymrgaan

### ステップ2: ユーザー一覧を表示
1. 左側メニューから「**Authentication**」をクリック
2. 「**Users**」タブを選択

### ステップ3: 鈴木雄大さんのユーザーを探す
- メールアドレス: `yudai.hand.0531@gmail.com` を探す

### ステップ4: ユーザーを確認済みにする

#### 方法A: ダッシュボードから（簡単）
1. `yudai.hand.0531@gmail.com` の行をクリック
2. ユーザー詳細画面で「**Email Confirmed**」を確認
3. もし `false` または未確認の場合：
   - 右上の「...」メニューをクリック
   - 「**Confirm Email**」を選択
   - または編集画面で「Email Confirmed」をONにする
4. 変更を保存

#### 方法B: SQL Editorから（上級者向け）
SQL Editorで以下のSQLを実行：

```sql
-- ユーザーのUIDを確認
SELECT id, email, email_confirmed_at 
FROM auth.users 
WHERE email = 'yudai.hand.0531@gmail.com';

-- メール確認済みにする
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'yudai.hand.0531@gmail.com';
```

### ステップ5: usersテーブルを確認
SQL Editorで以下を実行：

```sql
-- usersテーブルにデータがあるか確認
SELECT * FROM users WHERE email = 'yudai.hand.0531@gmail.com';
```

もしデータがない場合は追加：

```sql
-- UIDを確認（Authentication > Users から取得）
INSERT INTO users (user_id, email, name, role)
VALUES (
    '(ユーザーのUID)', 
    'yudai.hand.0531@gmail.com',
    '鈴木雄大',
    'sales_user'
);
```

### ステップ6: ログインテスト
1. ログインページにアクセス
   👉 https://8000-igq8699pazlqejv6zoou0-02b9cc79.sandbox.novita.ai/
2. 以下の情報でログイン：
   ```
   ログインID: yudai.hand.0531@gmail.com
   パスワード: 24680Riatis
   ```
3. ✅ REPORTページに遷移すれば成功！

---

## ✅ 完了後
この手順が完了したら、鈴木雄大さんのアカウントは正常にログインできるようになります。

今後は `ADMIN_GUIDE.md` の手順に従って、新しいユーザーを作成してください（最初から「Auto Confirm User」にチェックを入れることで、この手順は不要になります）。
