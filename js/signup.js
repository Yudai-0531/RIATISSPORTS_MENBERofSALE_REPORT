// サインアップ処理 - Supabase連携
import { supabaseClient } from './supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
    const signupForm = document.getElementById('signupForm');
    const errorMessage = document.getElementById('errorMessage');

    // 既にログイン済みの場合はリダイレクト
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        window.location.href = 'report.html';
        return;
    }

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // Supabaseでユーザーを作成
            const { data: authData, error: authError } = await supabaseClient.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        name: name
                    }
                }
            });
            
            if (authError) {
                showError('アカウント作成に失敗しました: ' + authError.message);
                return;
            }

            // usersテーブルにユーザー情報を追加
            const { error: insertError } = await supabaseClient
                .from('users')
                .insert([
                    {
                        user_id: authData.user.id,
                        email: email,
                        name: name,
                        role: 'sales_user'
                    }
                ]);
            
            if (insertError) {
                console.error('Error inserting user profile:', insertError);
            }

            // 成功メッセージ
            alert('アカウント作成が完了しました！確認メールをご確認ください。');
            window.location.href = 'index.html';
            
        } catch (error) {
            showError('アカウント作成に失敗しました: ' + error.message);
        }
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
        
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 5000);
    }
});
