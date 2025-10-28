function doPost(e) {
  try {
    const SPREADSHEET_ID = '1q7A83jB0EXPDIeEE9Ps-MWs-Aw2ktKZKxne7st2HDXk';
    const SHEET_NAME = '欠勤報告log';
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error('シート "' + SHEET_NAME + '" が見つかりません');

    const data = JSON.parse(e.postData.contents);
    const timestamp = new Date();

    // ヘッダー行がなければ作成
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['タイムスタンプ','氏名','種別','出勤予定','日付','報告時刻']);
    }

    sheet.appendRow([
      timestamp,
      data.name || '',
      data.type || '',
      data.attendance || '',
      data.date || '',
      data.time || ''
    ]);

    // レスポンス
    const output = ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: '記録しました',
        row: sheet.getLastRow()
      })
    );
    output.setMimeType(ContentService.MimeType.JSON);
    return output;

  } catch (error) {
    const output = ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.toString()
      })
    );
    output.setMimeType(ContentService.MimeType.JSON);
    return output;
  }
}

// ✅ OPTIONSリクエスト対応（CORSプリフライト）
function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({
      message: 'Google Apps Script is running!'
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

// ✅ CORS対応用：doOptions を追加（ブラウザが自動送信するプリフライト対策）
function doOptions(e) {
  return HtmlService.createHtmlOutput('')
    .addMetaTag('Access-Control-Allow-Origin', '*')
    .addMetaTag('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .addMetaTag('Access-Control-Allow-Headers', 'Content-Type');
}
