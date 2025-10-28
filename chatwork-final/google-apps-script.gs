// =======================================
// Google Apps Script - 欠勤報告log用
// =======================================

function doPost(e) {
  try {
    // スプレッドシートIDとシート名を指定
    const SPREADSHEET_ID = '1q7A83jB0EXPDIeEE9Ps-MWs-Aw2ktKZKxne7st2HDXk';
    const SHEET_NAME = '欠勤報告log';
    
    // スプレッドシートとシートを取得
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error('シート "' + SHEET_NAME + '" が見つかりません');
    }
    
    // リクエストボディをパース
    const data = JSON.parse(e.postData.contents);
    
    // タイムスタンプ
    const timestamp = new Date();
    
    // 1行目がヘッダーかチェック
    const lastRow = sheet.getLastRow();
    if (lastRow === 0) {
      // ヘッダーを追加
      sheet.appendRow([
        'タイムスタンプ',
        '氏名',
        '種別',
        '出勤予定',
        '日付',
        '報告時刻'
      ]);
    }
    
    // データを追加
    sheet.appendRow([
      timestamp,
      data.name || '',
      data.type || '',
      data.attendance || '',
      data.date || '',
      data.time || ''
    ]);
    
    // CORS対応のレスポンス
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        message: '記録しました',
        row: sheet.getLastRow()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// GETリクエスト対応（テスト用）
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ 
      message: 'Google Apps Script is running!',
      spreadsheetId: '1q7A83jB0EXPDIeEE9Ps-MWs-Aw2ktKZKxne7st2HDXk',
      sheetName: '欠勤報告log'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

