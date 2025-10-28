// =======================================
// 報告送信 - Chatwork + Google Spreadsheets
// =======================================

export default async function handler(req, res) {
  // CORSヘッダーを設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONSリクエスト（プリフライト）への対応
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 環境変数から認証情報を取得
  const CHATWORK_API_TOKEN = process.env.CHATWORK_API_TOKEN;
  const CHATWORK_ROOM_ID = process.env.CHATWORK_ROOM_ID;
  const GOOGLE_APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

  const { name, type, attendance, date, time, message } = req.body;

  if (!name || !type) {
    return res.status(400).json({ error: '名前と種別は必須です' });
  }

  const results = {
    chatwork: { success: false, message: '' },
    spreadsheet: { success: false, message: '' }
  };

  // 1. Chatworkに送信
  if (CHATWORK_API_TOKEN && CHATWORK_ROOM_ID) {
    try {
      const chatworkResponse = await fetch(
        `https://api.chatwork.com/v2/rooms/${CHATWORK_ROOM_ID}/messages`,
        {
          method: 'POST',
          headers: {
            'X-ChatWorkToken': CHATWORK_API_TOKEN,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `body=${encodeURIComponent(message)}`,
        }
      );

      if (chatworkResponse.ok) {
        results.chatwork.success = true;
        results.chatwork.message = 'Chatworkに送信しました';
      } else {
        const errorText = await chatworkResponse.text();
        results.chatwork.message = `Chatworkエラー: ${chatworkResponse.status} - ${errorText}`;
      }
    } catch (error) {
      results.chatwork.message = 'Chatwork送信失敗: ' + error.message;
    }
  } else {
    results.chatwork.message = 'Chatwork設定がありません（スキップ）';
  }

  // 2. Google Spreadsheetsに記録
  if (GOOGLE_APPS_SCRIPT_URL) {
    try {
      const spreadsheetResponse = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          type,
          attendance,
          date,
          time
        }),
      });

      const spreadsheetData = await spreadsheetResponse.json();

      if (spreadsheetData.success) {
        results.spreadsheet.success = true;
        results.spreadsheet.message = 'スプレッドシートに記録しました';
      } else {
        results.spreadsheet.message = 'スプレッドシートエラー: ' + (spreadsheetData.error || '不明なエラー');
      }
    } catch (error) {
      results.spreadsheet.message = 'スプレッドシート記録失敗: ' + error.message;
    }
  } else {
    results.spreadsheet.message = 'スプレッドシート設定がありません（スキップ）';
  }

  // 結果を返す
  const overallSuccess = results.chatwork.success || results.spreadsheet.success;

  return res.status(overallSuccess ? 200 : 500).json({
    success: overallSuccess,
    results
  });
}
