// =======================================
// Google Apps Script - 欠勤報告log用（CORS対応版）
// =======================================

function doPost(e) {
  try {
    const SPREADSHEET_ID = '1q7A83jB0EXPDIeEE9Ps-MWs-Aw2ktKZKxne7st2HDXk';
    const SHEET_NAME = '欠勤報告log';
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error('シート "' + SHEET_NAME + '" が見つかりません');

    const data = JSON.parse(e.postData.contents);
    const timestamp = new Date();

    // 1行目がヘッダー行でなければ追加
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'タイムスタンプ',
        '氏名',
        '種別',
        '出勤予定',
        '日付',
        '報告時刻'
      ]);
    }

    sheet.appendRow([
      timestamp,
      data.name || '',
      data.type || '',
      data.attendance || '',
      data.date || '',
      data.time || ''
    ]);

    // ✅ CORS対応ヘッダーを追加
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: '記録しました',
        row: sheet.getLastRow()
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*") // ←これが重要
      .setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
      .setHeader("Access-Control-Allow-Headers", "Content-Type");
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*");
  }
}

// ✅ GETリクエストにもCORS対応（ブラウザ確認用）
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      message: 'Google Apps Script is running!',
      spreadsheetId: '1q7A83jB0EXPDIeEE9Ps-MWs-Aw2ktKZKxne7st2HDXk',
      sheetName: '欠勤報告log'
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*");
}
