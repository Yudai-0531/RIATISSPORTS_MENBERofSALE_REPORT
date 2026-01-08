-- ONE TEAM Database Setup for Supabase
-- このSQLをSupabaseのSQL Editorで実行してください

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

-- インデックスの作成
CREATE INDEX idx_daily_reports_user_date ON daily_reports(user_id, report_date DESC);
CREATE INDEX idx_monthly_targets_user_month ON monthly_targets(user_id, target_month);
CREATE INDEX idx_quotes_date_key ON quotes(date_key);

-- Row Level Security (RLS)の有効化
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- RLSポリシー: usersテーブル
CREATE POLICY "Users can view their own data"
    ON users FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all users"
    ON users FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.user_id = auth.uid()
            AND users.role = 'admin_user'
        )
    );

-- RLSポリシー: daily_reportsテーブル
CREATE POLICY "Users can insert their own reports"
    ON daily_reports FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own reports"
    ON daily_reports FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view all reports"
    ON daily_reports FOR SELECT
    USING (true);

-- RLSポリシー: monthly_targetsテーブル
CREATE POLICY "Users can view targets"
    ON monthly_targets FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage targets"
    ON monthly_targets FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.user_id = auth.uid()
            AND users.role = 'admin_user'
        )
    );

-- RLSポリシー: quotesテーブル
CREATE POLICY "Anyone can view quotes"
    ON quotes FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage quotes"
    ON quotes FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.user_id = auth.uid()
            AND users.role = 'admin_user'
        )
    );

-- サンプルデータの挿入

-- サンプル名言データ（5件）
INSERT INTO quotes (date_key, author, text_japanese) VALUES
('01-08', 'Winston Churchill', '成功は最終的なものではなく、失敗は致命的なものではない。大切なのは続ける勇気だ。'),
('01-09', 'Muhammad Ali', '限界とは、ただの思い込みに過ぎない。'),
('01-10', 'Kobe Bryant', '準備とは、言い訳をなくすことだ。'),
('01-11', 'Walt Disney', '夢を実現する唯一の方法は、それに向かって行動することだ。'),
('01-12', 'Henry Ford', 'できると思えばできる、できないと思えばできない。')
ON CONFLICT (date_key) DO NOTHING;

-- サンプルユーザー（テスト用）
-- 注意: 実際の運用では、Supabase Authを使用してユーザーを作成してください
-- INSERT INTO users (email, name, role) VALUES
-- ('test@example.com', 'テストユーザー', 'sales_user'),
-- ('admin@example.com', '管理者', 'admin_user');

COMMIT;
