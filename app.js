// ========================================
// 設定（ここを編集してください）
// ========================================
const CHATWORK_API_TOKEN = 'YOUR_API_TOKEN_HERE';  // チャットワークのAPIトークンを入力
const CHATWORK_ROOM_ID = 'YOUR_ROOM_ID_HERE';      // 送信先のルームIDを入力

// ========================================
// 日時表示の更新
// ========================================
function updateDateTime() {
    const now = new Date();
    
    // 日付の表示
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][now.getDay()];
    
    document.getElementById('currentDate').textContent = 
        `${year}年${month}月${date}日（${dayOfWeek}）`;
    
    // 時刻の表示
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    document.getElementById('currentTime').textContent = 
        `${hours}:${minutes}:${seconds}`;
}

// 1秒ごとに時刻を更新
updateDateTime();
setInterval(updateDateTime, 1000);

// ========================================
// 出勤予定時刻の選択肢を生成
// ========================================
function generateTimeOptions() {
    const timeGrid = document.getElementById('timeGrid');
    const times = [];
    
    // 9:00～14:00まで15分刻み
    for (let hour = 9; hour <= 14; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
            // 14:00より後は除外
            if (hour === 14 && minute > 0) continue;
            
            // 10:30～13:00は除外
            const timeValue = hour * 100 + minute;
            if (timeValue >= 1030 && timeValue <= 1300) continue;
            
            const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
            times.push(timeStr);
        }
    }
    
    // ラジオボタンを生成
    times.forEach((time, index) => {
        const timeOption = document.createElement('div');
        timeOption.className = 'time-option';
        
        const input = document.createElement('input');
        input.type = 'radio';
        input.id = `time${index}`;
        input.name = 'attendanceTime';
        input.value = time;
        
        const label = document.createElement('label');
        label.htmlFor = `time${index}`;
        label.textContent = time;
        
        timeOption.appendChild(input);
        timeOption.appendChild(label);
        timeGrid.appendChild(timeOption);
    });
}

// ページ読み込み時に時刻選択肢を生成
generateTimeOptions();

// ========================================
// 遅刻選択時に出勤予定時刻を表示
// ========================================
const radioButtons = document.querySelectorAll('input[name="reportType"]');
const timeSelectGroup = document.getElementById('timeSelectGroup');

radioButtons.forEach(radio => {
    radio.addEventListener('change', function() {
        if (this.value === '遅刻') {
            timeSelectGroup.style.display = 'block';
            // 最初の時刻を自動選択
            const firstTimeOption = document.querySelector('input[name="attendanceTime"]');
            if (firstTimeOption && !document.querySelector('input[name="attendanceTime"]:checked')) {
                firstTimeOption.checked = true;
            }
        } else {
            timeSelectGroup.style.display = 'none';
            // 選択をクリア
            const checkedTime = document.querySelector('input[name="attendanceTime"]:checked');
            if (checkedTime) {
                checkedTime.checked = false;
            }
        }
    });
});

// ========================================
// フォーム送信処理
// ========================================
document.getElementById('reportForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // フォームデータ取得
    const staffName = document.getElementById('staffName').value;
    const reportType = document.querySelector('input[name="reportType"]:checked').value;
    const attendanceTime = document.querySelector('input[name="attendanceTime"]:checked')?.value || '';
    
    // 現在の日時を取得
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][now.getDay()];
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    // チャットワークメッセージを作成
    let message = `[info][title]${reportType}の報告[/title]`;
    message += `氏名: ${staffName}\n`;
    message += `日付: ${year}年${month}月${date}日(${dayOfWeek})\n`;
    message += `報告時刻: ${hours}:${minutes}\n`;
    message += `種別: ${reportType}\n`;
    
    if (reportType === '遅刻' && attendanceTime) {
        message += `出勤予定: ${attendanceTime}\n`;
    }
    
    message += `[/info]`;

    // UI更新：送信中表示
    const submitBtn = document.getElementById('submitBtn');
    const loading = document.getElementById('loading');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    submitBtn.disabled = true;
    loading.style.display = 'block';
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';

    try {
        // チャットワークAPIに送信
        const response = await fetch(`https://api.chatwork.com/v2/rooms/${CHATWORK_ROOM_ID}/messages`, {
            method: 'POST',
            headers: {
                'X-ChatWorkToken': CHATWORK_API_TOKEN,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `body=${encodeURIComponent(message)}`
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        // 成功時の処理
        loading.style.display = 'none';
        successMessage.style.display = 'block';
        
        // フォームをリセット
        document.getElementById('reportForm').reset();
        timeSelectGroup.style.display = 'none';
        
        // 3秒後に成功メッセージを非表示
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);

    } catch (error) {
        // エラー時の処理
        console.error('送信エラー:', error);
        loading.style.display = 'none';
        errorMessage.style.display = 'block';
        errorMessage.textContent = `❌ 送信に失敗しました: ${error.message}`;
        
        // 5秒後にエラーメッセージを非表示
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    } finally {
        submitBtn.disabled = false;
    }
});

// 設定チェック（開発時のデバッグ用）
if (CHATWORK_API_TOKEN === 'YOUR_API_TOKEN_HERE' || CHATWORK_ROOM_ID === 'YOUR_ROOM_ID_HERE') {
    console.warn('⚠️ チャットワークのAPIトークンとルームIDを設定してください');
}

