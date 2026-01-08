// Report Page JavaScript - Supabase連携
import { supabaseClient, getCurrentUser, getUserProfile } from './supabase.js';

let currentUser = null;
let userProfile = null;

// 今日の名言をSupabaseから取得
async function loadQuote() {
    const today = new Date();
    const dateKey = String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
    
    const { data, error } = await supabaseClient
        .from('quotes')
        .select('*')
        .eq('date_key', dateKey)
        .single();
    
    if (error || !data) {
        // エラーまたはデータがない場合はデフォルト表示
        console.log('Quote not found for today, using default');
        document.getElementById('quoteText').textContent = '"成功は最終的なものではなく、失敗は致命的なものではない。大切なのは続ける勇気だ。"';
        document.getElementById('quoteAuthor').textContent = '- Winston Churchill';
        return;
    }
    
    document.getElementById('quoteText').textContent = `"${data.text_japanese}"`;
    document.getElementById('quoteAuthor').textContent = `- ${data.author}`;
}

// 目標値の読み込み
async function loadGoals() {
    const today = new Date();
    const targetMonth = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-01';
    
    // チーム目標を取得
    const { data: teamTarget, error: teamError } = await supabaseClient
        .from('monthly_targets')
        .select('target_revenue')
        .eq('target_month', targetMonth)
        .is('user_id', null)
        .single();
    
    if (!teamError && teamTarget) {
        document.getElementById('teamGoal').textContent = Number(teamTarget.target_revenue).toLocaleString();
    }
    
    // 個人目標を取得
    if (currentUser) {
        const { data: userTarget, error: userError } = await supabaseClient
            .from('monthly_targets')
            .select('target_revenue')
            .eq('target_month', targetMonth)
            .eq('user_id', currentUser.id)
            .single();
        
        if (!userError && userTarget) {
            document.getElementById('yourGoal').textContent = Number(userTarget.target_revenue).toLocaleString();
        }
    }
}

// フォーム送信処理
async function submitReport(e) {
    e.preventDefault();
    
    if (!currentUser) {
        alert('ログインセッションが切れています。再度ログインしてください。');
        window.location.href = 'index.html';
        return;
    }
    
    const reportData = {
        user_id: currentUser.id,
        report_date: new Date().toISOString().split('T')[0],
        offer_count: parseInt(document.getElementById('offerCount').value),
        negotiation_count: parseInt(document.getElementById('negotiationCount').value),
        closed_deal_count: parseInt(document.getElementById('closedDealCount').value),
        riatis_view_count: parseInt(document.getElementById('riatisViewCount').value),
        crm_operation_time: parseInt(document.getElementById('crmOperationTime').value),
        next_action_text: document.getElementById('nextAction').value
    };
    
    try {
        // Supabaseにデータを保存（upsert: 既存データがあれば更新）
        const { data, error } = await supabaseClient
            .from('daily_reports')
            .upsert(reportData, {
                onConflict: 'user_id,report_date'
            })
            .select();
        
        if (error) {
            console.error('Error submitting report:', error);
            alert('報告の送信に失敗しました: ' + error.message);
            return;
        }
        
        console.log('Report submitted successfully:', data);
        
        // 成功モーダルを表示
        showSuccessModal();
        
        // フォームをリセット
        document.getElementById('reportForm').reset();
        
    } catch (error) {
        console.error('Error submitting report:', error);
        alert('報告の送信に失敗しました。もう一度お試しください。');
    }
}

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
async function logout() {
    if (confirm('ログアウトしますか？')) {
        await supabaseClient.auth.signOut();
        window.location.href = 'index.html';
    }
}

// ページ読み込み時の初期化
async function initializePage() {
    // ログイン確認
    const { data: { session } } = await supabaseClient.auth.getSession();
    
    if (!session) {
        window.location.href = 'index.html';
        return;
    }
    
    currentUser = session.user;
    
    // ユーザープロファイルを取得
    userProfile = await getUserProfile(currentUser.id);
    
    // データを読み込み
    await loadQuote();
    await loadGoals();
    
    // イベントリスナーを設定
    document.getElementById('reportForm').addEventListener('submit', submitReport);
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
}

// ページ読み込み時
document.addEventListener('DOMContentLoaded', initializePage);
