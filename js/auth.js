// 認証処理
// 注意: Supabase CDNを使用する場合、HTMLに<script>タグを追加する必要があります

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // Supabase認証の実装
            // 現在は仮のログイン処理
            console.log('Login attempt:', email);
            
            // TODO: Supabaseの認証APIを呼び出す
            // const { data, error } = await supabase.auth.signInWithPassword({
            //     email: email,
            //     password: password
            // });
            
            // 仮のログイン成功処理
            if (email && password) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);
                window.location.href = 'report.html';
            } else {
                showError('メールアドレスとパスワードを入力してください');
            }
            
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
