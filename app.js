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

    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][now.getDay()];

    document.getElementById('currentDate').textContent = 
        `${year}年${month}月${date}日（${dayOfWeek}）`;

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    document.getElementById('currentTime').textContent = 
        `${hours}:${minutes}:${seconds}`;
}

updateDateTime();
setInterval(updateDateTime, 1000);

// ========================================
// 出勤予定時刻の選択肢を生成
// ========================================
function generateTimeOptions() {
    const timeGrid = document.getElementById('timeGrid');
    const times = [];

    for (let hour = 9; hour <= 14; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
            if (hour === 14 && minute > 0) continue;
            const timeValue = hour * 100 + minute;
            if (timeValue >= 1030 && timeValue <= 1300) continue;

            const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
            times.push(timeStr);
        }
    }

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
            const firstTimeOption = document.querySelector('input[name="attendanceTime"]');
            if (firstTimeOption && !document.querySelector('input[name="attendanceTime"]:checked')) {
                firstTimeOption.checked = true;
            }
        } else {
            timeSelectGroup.style.display = 'none';
            const checkedTime = document.querySelector('input[name="attendanceTime"]:checked');
            if (checkedTime) checkedTime.checked = false;
        }
    });
});

// ========================================
// フォーム送信処理
// ========================================
document.getElementById('reportForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const staffName = document.getElementById('staffName').value.trim();
    const reportType = document.querySelector('input[name="reportType"]:checked')?.value;
    const attendanceTime = document.querySelector('input[name="attendanceTime"]:checked')?.value || '';

    // --- 入力チェック ---
    if (!staffName) return alert('⚠️ お名前を入力してください。');
    if (!reportType) return alert('⚠️ 種別を選択してください。');
    if (reportType === '遅刻' && !attendanceTime) return alert('⚠️ 出勤予定時刻を選択してください。');

    // --- 現在日時（JST固定） ---
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][now.getDay()];
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    // --- Chatworkメッセージ ---
    let message = `[info][title]${reportType}の報告[/title]`;
    message += `氏名: ${staffName}\n`;
    message += `日付: ${year}年${month}月${date}日(${dayOfWeek})\n`;
    message += `報告時刻: ${hours}:${minutes}\n`;
    message += `種別: ${reportType}\n`;
    if (reportType === '遅刻' && attendanceTime) {
        message += `出勤予定: ${attendanceTime}\n`;
    }
    message += `[/info]`;

    // --- UI制御 ---
    const submitBtn = document.getElementById('submitBtn');
    const loading = document.getElementById('loading');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    submitBtn.disabled = true;
    loading.style.display = 'block';
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';

    try {
        if (CHATWORK_API_TOKEN.includes('YOUR_API_TOKEN') || CHATWORK_ROOM_ID.includes('YOUR_ROOM_ID')) {
            throw new Error('ChatworkのAPIトークンまたはルームIDが未設定です。');
        }

        const response = await fetch(`https://api.chatwork.com/v2/rooms/${CHATWORK_ROOM_ID}/messages`, {
            method: 'POST',
            headers: {
                'X-ChatWorkToken': CHATWORK_API_TOKEN,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `body=${encodeURIComponent(message)}`
        });

        console.log('Chatwork API Response:', response);

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Chatwork APIエラー: ${response.status} (${text})`);
        }

        loading.style.display = 'none';
        successMessage.style.display = 'block';
        document.getElementById('reportForm').reset();
        timeSelectGroup.style.display = 'none';
        setTimeout(() => successMessage.style.display = 'none', 3000);

        // スクロール位置調整（スマホ対応）
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

    } catch (error) {
        console.error('送信エラー:', error);
        loading.style.display = 'none';
        errorMessage.style.display = 'block';
        errorMessage.textContent = `❌ 送信に失敗しました: ${error.message}`;
        setTimeout(() => errorMessage.style.display = 'none', 5000);
    } finally {
        setTimeout(() => { submitBtn.disabled = false; }, 2000); // 二重送信防止
    }
});

// ========================================
// デバッグ用警告
// ========================================
if (CHATWORK_API_TOKEN === 'YOUR_API_TOKEN_HERE' || CHATWORK_ROOM_ID === 'YOUR_ROOM_ID_HERE') {
    console.warn('⚠️ Chatwork APIトークンとルームIDを設定してください。');
}
