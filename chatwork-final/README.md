# 欠勤・遅刻報告システム

GitHub Pages + Vercel + Chatwork + Google Spreadsheetsを使った報告システムです。

## 機能

✅ **Chatwork通知**: ルーム `360298518` に自動送信  
✅ **スプレッドシート記録**: 「欠勤報告log」シートに自動記録  
✅ **リアルタイム**: 送信と同時に両方に記録  
✅ **完全無料**: すべて無料プランで利用可能  
✅ **UIそのまま**: 既存のデザインを維持

## セットアップ

詳細は **SETUP.md** を参照してください（約10分で完了）。

### クイック手順

1. **Google Apps Scriptをデプロイ** → URLをコピー
2. **GitHubにアップロード**
3. **Vercelにデプロイ** → URLをコピー
4. **環境変数を3つ設定**:
   - `CHATWORK_API_TOKEN`: `0bbd4c34e04713c17bd88914ac440622`
   - `CHATWORK_ROOM_ID`: `360298518`
   - `GOOGLE_APPS_SCRIPT_URL`: Apps ScriptのURL
5. **app.jsのURLを更新**
6. **GitHub Pagesを有効化**

## ファイル構成

```
chatwork-report/
├── index.html              # フロントエンド（UIそのまま）
├── app.js                  # フロントエンドJS
├── api/
│   └── send_report.js      # Vercel Function
├── google-apps-script.gs   # Google Apps Script用コード
├── vercel.json             # Vercel設定
├── package.json            # Node.js設定
├── .gitignore              # Git除外設定
├── SETUP.md                # セットアップガイド
└── README.md               # このファイル
```

## スプレッドシート

- **スプレッドシートID**: `1q7A83jB0EXPDIeEE9Ps-MWs-Aw2ktKZKxne7st2HDXk`
- **シート名**: `欠勤報告log`
- **URL**: https://docs.google.com/spreadsheets/d/1q7A83jB0EXPDIeEE9Ps-MWs-Aw2ktKZKxne7st2HDXk/edit

## 記録される内容

| タイムスタンプ | 氏名 | 種別 | 出勤予定 | 日付 | 報告時刻 |
|--------------|------|------|---------|------|---------|
| 2025-10-28 09:15:30 | 山田 | 遅刻 | 10:30 | 2025年10月28日 | 09:15:30 |

## トラブルシューティング

詳細は **SETUP.md** のトラブルシューティングセクションを参照してください。

## ライセンス

MIT

