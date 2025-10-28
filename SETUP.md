# セットアップガイド（完全版）

このガイドに従えば、約10分で完全に動作する欠勤・遅刻報告システムが構築できます。

## 概要

- **Chatwork通知**: ルーム `360298518` に自動送信
- **スプレッドシート記録**: 既存のスプレッドシート「欠勤報告log」に自動記録
- **完全無料**: すべて無料プランで利用可能

---

## ステップ1: Google Apps Scriptの設定（5分）

### 1-1. スプレッドシートを開く

https://docs.google.com/spreadsheets/d/1q7A83jB0EXPDIeEE9Ps-MWs-Aw2ktKZKxne7st2HDXk/edit

### 1-2. Apps Scriptエディタを開く

1. メニューから「拡張機能」→「Apps Script」をクリック
2. 新しいタブでエディタが開く

### 1-3. コードを貼り付け

デフォルトのコードを削除し、`google-apps-script.gs` の内容をすべてコピー＆ペースト

### 1-4. 保存

1. プロジェクト名を「欠勤報告API」に変更
2. 💾 保存アイコンをクリック

### 1-5. Webアプリとしてデプロイ

1. 右上の「デプロイ」→「新しいデプロイ」をクリック
2. 「種類の選択」で⚙️歯車アイコン → 「ウェブアプリ」を選択
3. 以下を設定：
   - **説明**: 「欠勤報告API」
   - **次のユーザーとして実行**: 「自分」
   - **アクセスできるユーザー**: **「全員」**（重要！）
4. 「デプロイ」をクリック

### 1-6. 承認

初回デプロイ時に承認が必要です：

1. 「アクセスを承認」をクリック
2. Googleアカウントを選択
3. 「詳細」→「欠勤報告API（安全ではないページ）に移動」をクリック
4. 「許可」をクリック

### 1-7. URLをコピー

デプロイ完了後、以下のようなURLが表示されます：

```
https://script.google.com/macros/s/AKfycby.../exec
```

このURLをコピーしてメモ帳などに保存してください。

---

## ステップ2: GitHubにアップロード（3分）

### 2-1. 新しいリポジトリを作成

1. https://github.com/new にアクセス
2. リポジトリ名を入力（例: `chatwork-report`）
3. **Public** を選択
4. 「Create repository」をクリック

### 2-2. ファイルをアップロード

以下のファイルをアップロード：

- `index.html`
- `app.js`
- `api/send_report.js`
- `vercel.json`
- `package.json`
- `.gitignore`

**方法**: 「Add file」→「Upload files」→ ファイルをドラッグ&ドロップ → 「Commit changes」

---

## ステップ3: Vercelにデプロイ（2分）

### 3-1. Vercelにログイン

1. https://vercel.com/ にアクセス
2. 「Sign Up」→「Continue with GitHub」
3. GitHubアカウントで認証

### 3-2. プロジェクトをインポート

1. 「Add New...」→「Project」をクリック
2. 作成したリポジトリを選択
3. 「Import」をクリック
4. そのまま「Deploy」をクリック

### 3-3. デプロイ完了を待つ

数十秒でデプロイが完了し、URLが発行されます：

```
https://chatwork-report-xxxx.vercel.app
```

このURLをコピーしてメモしてください。

---

## ステップ4: 環境変数を設定（2分）

### 4-1. Vercelダッシュボードで設定

1. デプロイしたプロジェクトのページで「Settings」をクリック
2. 左サイドバーの「Environment Variables」をクリック

### 4-2. 3つの環境変数を追加

#### 変数1: CHATWORK_API_TOKEN

- **Name**: `CHATWORK_API_TOKEN`
- **Value**: `0bbd4c34e04713c17bd88914ac440622`
- **Environment**: すべてチェック
- 「Save」をクリック

#### 変数2: CHATWORK_ROOM_ID

- **Name**: `CHATWORK_ROOM_ID`
- **Value**: `360298518`
- **Environment**: すべてチェック
- 「Save」をクリック

#### 変数3: GOOGLE_APPS_SCRIPT_URL

- **Name**: `GOOGLE_APPS_SCRIPT_URL`
- **Value**: ステップ1-7でコピーしたURL
- **Environment**: すべてチェック
- 「Save」をクリック

### 4-3. 再デプロイ

1. 上部メニューの「Deployments」をクリック
2. 最新のデプロイメントの右側「...」メニュー → 「Redeploy」をクリック

---

## ステップ5: app.jsのURLを更新（1分）

### 5-1. GitHubでapp.jsを編集

1. GitHubリポジトリで `app.js` を開く
2. 鉛筆アイコン（Edit）をクリック
3. 92行目付近を修正：

```javascript
// 修正前
const API_URL = 'YOUR_VERCEL_URL_HERE/api/send_report';

// 修正後（ステップ3-3で取得したURLを使用）
const API_URL = 'https://chatwork-report-xxxx.vercel.app/api/send_report';
```

4. 「Commit changes」をクリック

---

## ステップ6: GitHub Pagesを有効化（1分）

### 6-1. GitHub Pagesを設定

1. GitHubリポジトリの「Settings」をクリック
2. 左サイドバーの「Pages」をクリック
3. **Source**:
   - Branch: `main`
   - Folder: `/ (root)`
4. 「Save」をクリック

### 6-2. URLを確認

数分後、以下のようなURLでサイトが公開されます：

```
https://YOUR_USERNAME.github.io/chatwork-report/
```

---

## ステップ7: 動作確認

### 7-1. サイトにアクセス

GitHub Pages URLにアクセス

### 7-2. フォームをテスト

1. 名前を入力（例: テスト）
2. 種別を選択（欠勤 or 遅刻）
3. 遅刻の場合は出勤予定時刻を選択
4. 「送信する」をクリック

### 7-3. 確認

- ✅ 「報告が正常に送信されました」と表示される
- ✅ Chatworkのルーム `360298518` にメッセージが届く
- ✅ スプレッドシート「欠勤報告log」に記録される

---

## トラブルシューティング

### エラー: 送信に失敗しました

**原因1**: app.jsのAPI URLが間違っている

**解決策**: app.jsの92行目のURLを確認

**原因2**: Vercelの環境変数が設定されていない

**解決策**: Vercelダッシュボード → Settings → Environment Variables を確認して再デプロイ

---

### エラー: スプレッドシートに記録されない

**原因**: Google Apps Scriptのアクセス権限が「全員」になっていない

**解決策**:
1. Apps Scriptエディタ → デプロイ → デプロイを管理
2. 鉛筆アイコンで編集
3. 「アクセスできるユーザー」を「全員」に変更
4. 「デプロイを更新」をクリック

---

### Chatworkに送信されない

**原因**: APIトークンが無効

**解決策**: Chatworkで新しいAPIトークンを発行して、Vercelの環境変数を更新

---

## スプレッドシートの共有

### 閲覧用URLを発行

1. スプレッドシートを開く
2. 右上の「共有」をクリック
3. 「一般的なアクセス」を「リンクを知っている全員」に変更
4. 権限を「閲覧者」に設定
5. URLをコピーして配布

これで、誰でもログを確認できます。

---

## 完了！

これで、Chatwork通知 + スプレッドシート記録の両方が動作します。

**チェックリスト**:

- [ ] Google Apps Scriptをデプロイ
- [ ] GitHubにアップロード
- [ ] Vercelにデプロイ
- [ ] 環境変数を3つ設定
- [ ] app.jsのURLを更新
- [ ] GitHub Pagesを有効化
- [ ] 動作確認完了

何か問題があれば、トラブルシューティングセクションを参照してください。

