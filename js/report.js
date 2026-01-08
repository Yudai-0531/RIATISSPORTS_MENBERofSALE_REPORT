// Report Page JavaScript

// ログイン確認
if (!localStorage.getItem('isLoggedIn')) {
    window.location.href = 'index.html';
}

// 今日の名言（サンプルデータ）
const quotes = [
    {
        text: "成功は最終的なものではなく、失敗は致命的なものではない。大切なのは続ける勇気だ。",
        author: "Winston Churchill"
    },
    {
        text: "限界とは、ただの思い込みに過ぎない。",
        author: "Muhammad Ali"
    },
    {
        text: "準備とは、言い訳をなくすことだ。",
        author: "Kobe Bryant"
    },
    {
        text: "夢を実現する唯一の方法は、それに向かって行動することだ。",
        author: "Walt Disney"
    },
    {
        text: "できると思えばできる、できないと思えばできない。",
        author: "Henry Ford"
    }
];

// 今日の日付に基づいて名言を表示
function loadQuote() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    const quoteIndex = dayOfYear % quotes.length;
    const quote = quotes[quoteIndex];
    
    document.getElementById('quoteText').textContent = `"${quote.text}"`;
    document.getElementById('quoteAuthor').textContent = `- ${quote.author}`;
}

// 目標値の読み込み（仮データ）
function loadGoals() {
    // TODO: Supabaseから目標値を取得
    // 現在は仮の値を表示
    document.getElementById('teamGoal').textContent = '5,000,000';
    document.getElementById('yourGoal').textContent = '500,000';
}

// フォーム送信処理
document.getElementById('reportForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        date: new Date().toISOString().split('T')[0],
        offerCount: parseInt(document.getElementById('offerCount').value),
        negotiationCount: parseInt(document.getElementById('negotiationCount').value),
        closedDealCount: parseInt(document.getElementById('closedDealCount').value),
        riatisViewCount: parseInt(document.getElementById('riatisViewCount').value),
        crmOperationTime: parseInt(document.getElementById('crmOperationTime').value),
        nextAction: document.getElementById('nextAction').value
    };
    
    try {
        // TODO: Supabaseにデータを保存
        console.log('Report Data:', formData);
        
        // 成功モーダルを表示
        showSuccessModal();
        
        // フォームをリセット
        document.getElementById('reportForm').reset();
        
    } catch (error) {
        console.error('Error submitting report:', error);
        alert('報告の送信に失敗しました。もう一度お試しください。');
    }
});

// 成功モーダルの表示
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.add('show');
}

// モーダルを閉じる
window.closeModal = function() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('show');
};

// ログアウト処理
document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm('ログアウトしますか？')) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        window.location.href = 'index.html';
    }
});

// ページ読み込み時
document.addEventListener('DOMContentLoaded', () => {
    loadQuote();
    loadGoals();
});
