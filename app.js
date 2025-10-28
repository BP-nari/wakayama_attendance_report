// ========================================
// 日時更新
// ========================================
function updateDateTime() {
    const now = new Date();
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    document.getElementById('currentDate').textContent =
        `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日（${days[now.getDay()]}）`;
    document.getElementById('currentTime').textContent =
        now.toLocaleTimeString('ja-JP', { hour12: false });
}
updateDateTime();
setInterval(updateDateTime, 1000);

// ========================================
// 出勤予定時刻選択肢生成
// ========================================
function generateTimeOptions() {
    const timeGrid = document.getElementById('timeGrid');
    const times = [];
    for (let hour = 9; hour <= 14; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
            if (hour === 14 && minute > 0) continue;
            const t = hour * 100 + minute;
            if (t >= 1030 && t <= 1300) continue;
            times.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
        }
    }
    times.forEach((time, i) => {
        const div = document.createElement('div');
        div.className = 'time-option';
        div.innerHTML = `
            <input type="radio" id="time${i}" name="attendanceTime" value="${time}">
            <label for="time${i}">${time}</label>`;
        timeGrid.appendChild(div);
    });
}
generateTimeOptions();

// ========================================
// 遅刻選択で出勤予定表示
// ========================================
const radioButtons = document.querySelectorAll('input[name="reportType"]');
const timeSelectGroup = document.getElementById('timeSelectGroup');
radioButtons.forEach(r => {
    r.addEventListener('change', function() {
        if (this.value === '遅刻') {
            timeSelectGroup.style.display = 'block';
            const first = document.querySelector('input[name="attendanceTime"]');
            if (first && !document.querySelector('input[name="attendanceTime"]:checked'))
                first.checked = true;
        } else {
            timeSelectGroup.style.display = 'none';
            const checked = document.querySelector('input[name="attendanceTime"]:checked');
            if (checked) checked.checked = false;
        }
    });
});

// ========================================
// フォーム送信（直書きGAS URL版）
// ========================================
document.getElementById('reportForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = document.getElementById('staffName').value.trim();
    const type = document.querySelector('input[name="reportType"]:checked')?.value;
    const attendance = document.querySelector('input[name="attendanceTime"]:checked')?.value || '';

    if (!name || !type) {
        alert('お名前と種別を入力してください');
        return;
    }

    const now = new Date();
    const d = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
    const t = now.toLocaleTimeString('ja-JP', { hour12: false });
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    
    const chatworkMsg = `[info][title]${type}の報告[/title]氏名: ${name}\n日付: ${d}（${days[now.getDay()]}）\n報告時刻: ${t}\n種別: ${type}\n${attendance ? '出勤予定: ' + attendance + '\n' : ''}[/info]`;

    const submitBtn = document.getElementById('submitBtn');
    const loading = document.getElementById('loading');
    const success = document.getElementById('successMessage');
    const error = document.getElementById('errorMessage');

    submitBtn.disabled = true;
    loading.style.display = 'block';
    success.style.display = 'none';
    error.style.display = 'none';

    try {
        // ✅ Google Apps Script の WebアプリURLを直書き
        const GAS_URL = "https://script.google.com/macros/s/AKfycbyFwSY53M5muMPebgFjzgmeH6RbuAdlTHzIbkHRMBweHbAp_RMbn82IbGkiqIU_pNI/exec";

        const res = await fetch(GAS_URL, {
            method: 'POST',
            mode: 'cors', // ← CORS通過必須
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: name,
                type: type,
                attendance: attendance,
                date: d,
                time: t,
                message: chatworkMsg
            })
        });

        if (!res.ok) throw new Error(`HTTPエラー: ${res.status}`);
        const result = await res.json();

        if (!result.success) {
            throw new Error(result.error || 'スプレッドシートへの書き込みに失敗しました');
        }

        loading.style.display = 'none';
        success.style.display = 'block';
        document.getElementById('reportForm').reset();
        timeSelectGroup.style.display = 'none';
        setTimeout(() => success.style.display = 'none', 3000);

    } catch (err) {
        loading.style.display = 'none';
        error.style.display = 'block';
        error.textContent = '❌ 送信に失敗しました: ' + err.message;
        setTimeout(() => error.style.display = 'none', 5000);
    } finally {
        submitBtn.disabled = false;
    }
});
