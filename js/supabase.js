// Supabaseクライアントの初期化
import { supabaseConfig } from './config.js';

const { createClient } = supabase;

// Supabaseクライアントを作成
export const supabaseClient = createClient(
    supabaseConfig.url,
    supabaseConfig.anonKey
);

// 現在のユーザーセッションを取得
export async function getCurrentUser() {
    const { data: { user }, error } = await supabaseClient.auth.getUser();
    if (error) {
        console.error('Error getting user:', error);
        return null;
    }
    return user;
}

// ユーザー情報を取得（usersテーブルから）
export async function getUserProfile(userId) {
    const { data, error } = await supabaseClient
        .from('users')
        .select('*')
        .eq('user_id', userId)
        .single();
    
    if (error) {
        console.error('Error getting user profile:', error);
        return null;
    }
    return data;
}
