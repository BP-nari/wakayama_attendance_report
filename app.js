// =======================================
// 日時更新
// =======================================
function updateDateTime() {
    const now = new Date();
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    document.getElementById('currentDate').textContent = 
        `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日（${days[now.getDay()]}）`;
    document.getElementById('currentTime').textContent = 
        `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
}

updateDateTime();
setInterval(updateDateTime, 1000);

// =======================================
// 出勤予定時刻選択生成
// =======================================
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
            <label for="time${i}">${time}</label>
        `;
        timeGrid.appendChild(div);
    });
}

generateTimeOptions();

// =======================================
// 遅刻選択で出勤予定表示
// =======================================
const radioButtons = document.querySelectorAll('input[name="reportType"]');
const timeSelectGroup = document.getElementById('timeSelectGroup');
radioButtons.forEach(r => {
    r.addEventListener('change', function() {
        if (this.value === '遅刻') {
            timeSelectGroup.style.display = 'block';
            const first = document.querySelector('input[name="attendanceTime"]');
            if (first && !document.querySelector('input[name="attendanceTime"]:checked')) {
                first.checked = true;
            }
        } else {
            timeSelectGroup.style.display = 'none';
            const checked = document.querySelector('input[name="attendanceTime"]:checked');
            if (checked) checked.checked = false;
        }
    });
});

// =======================================
// フォーム送信（Google Spreadsheetsのみ）
// =======================================
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
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    const d = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日（${days[now.getDay()]}）`;
    const t = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const submitBtn = document.getElementById('submitBtn');
    const loading = document.getElementById('loading');
    const success = document.getElementById('successMessage');
    const error = document.getElementById('errorMessage');

    submitBtn.disabled = true;
    loading.style.display = 'block';
    success.style.display = 'none';
    error.style.display = 'none';

    try {
        // Google Apps Script の WebアプリURL（正しいURL）
        const GAS_URL = "https://script.google.com/macros/s/AKfycbwBGHSzdF1xLRD59GVOQcXfRiwLTaACyOK40fSEnT7NbwEXV1DsEenp4w4aFtDfkDQq/exec";

        const res = await fetch(GAS_URL, {
            method: 'POST',
            mode: 'no-cors', // CORS回避（Google Apps Scriptの仕様）
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                timestamp: new Date().toLocaleString('ja-JP'),
                name: name,
                type: type,
                attendance: attendance,
                date: d,
                time: t
            })
        });

        // no-corsモードでは常にopaque responseが返るため、成功と見なす
        success.style.display = 'block';
        document.getElementById('reportForm').reset();
        
        // 遅刻選択をリセット
        timeSelectGroup.style.display = 'none';

    } catch (err) {
        error.style.display = 'block';
        console.error('送信失敗:', err);
    } finally {
        loading.style.display = 'none';
        submitBtn.disabled = false;
    }
});
