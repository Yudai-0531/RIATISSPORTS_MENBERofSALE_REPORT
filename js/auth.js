// 認証処理 - Supabase連携
import { supabaseClient } from './supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    // 既にログイン済みの場合はリダイレクト
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        window.location.href = 'report.html';
        return;
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // Supabase認証
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });
            
            if (error) {
                showError('ログインに失敗しました: ' + error.message);
                return;
            }

            // ログイン成功
            console.log('Login successful:', data.user);
            window.location.href = 'report.html';
            
        } catch (error) {
            showError('ログインに失敗しました: ' + error.message);
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
