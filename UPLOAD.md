# GitHubへのアップロード手順

このZIPファイルは、**フォルダごとそのままアップロードできる**ように作られています。

## 手順

### 1. 既存のファイルを削除

1. GitHubのリポジトリ `wakayama_attendance_report` を開く
2. `chatwork-final` フォルダを削除
   - フォルダをクリック
   - 右上の「...」メニュー → 「Delete directory」
   - 「Commit changes」をクリック

### 2. ZIPを解凍

ダウンロードした `wakayama-ready.zip` を解凍

### 3. フォルダの中身をアップロード

1. `wakayama-ready` **フォルダの中身だけ**を選択
   - `api/` フォルダ
   - `app.js`
   - `index.html`
   - `package.json`
   - `vercel.json`
   - `google-apps-script.gs`
   - `README.md`
   - `SETUP.md`
   - `.gitignore`（隠しファイル）

2. GitHubのリポジトリページで「Add file」→「Upload files」

3. 選択したファイルをドラッグ&ドロップ

4. 「Commit changes」をクリック

### 4. 完成！

アップロード後、リポジトリのルート直下は以下のようになります：

```
wakayama_attendance_report/
├── .gitignore
├── README.md
├── SETUP.md
├── api/
│   └── send_report.js
├── app.js
├── google-apps-script.gs
├── index.html
├── package.json
└── vercel.json
```

### 5. Vercelの設定を戻す

**重要**: Vercelで「Root Directory」を設定した場合は、元に戻してください。

1. Vercelダッシュボード → Settings → General
2. 「Root Directory」を **空欄** にする
3. 「Save」をクリック
4. Deployments → 最新のデプロイ → 「Redeploy」

### 6. GitHub Pagesの再デプロイ

GitHub Pagesは自動的に再デプロイされます。数分待ってからアクセスしてください。

---

## 確認

- ✅ GitHub Pages: https://bp-nari.github.io/wakayama_attendance_report/
- ✅ Vercel: https://wakayama-attendance-report.vercel.app/

両方とも正常に表示されるはずです！

