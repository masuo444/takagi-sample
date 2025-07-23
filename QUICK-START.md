# 🌸 超簡単スタートガイド

**APIキーを貼り付けるだけで3分でAIサクラが起動！**

## 🚀 方法1: PASTE-API-KEYS.js を使用（推奨）

### 1. APIキーを取得
- **OpenAI**: https://platform.openai.com/api-keys
- **DeepL**: https://www.deepl.com/ja/pro#developer （オプション）

### 2. APIキーを貼り付け
`PASTE-API-KEYS.js` ファイルを開いて以下を編集：

```javascript
// OpenAI APIキー（必須）
const OPENAI_API_KEY = "sk-proj-xxxxxxxxxxxxx";

// DeepL APIキー（オプション）
const DEEPL_API_KEY = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:fx";
```

### 3. 実行
```bash
npm run paste-deploy
```

**以上！** 🎉

---

## 🚀 方法2: quick-deploy.js を直接編集

### 1. `scripts/quick-deploy.js` を開く

### 2. 上部の変数を編集
```javascript
// OpenAI APIキー（必須）sk-proj-で始まる
const OPENAI_API_KEY = "sk-proj-xxxxxxxxxxxxx";

// DeepL APIキー（オプション）翻訳機能用
const DEEPL_API_KEY = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:fx";
```

### 3. 実行
```bash
npm run quick-deploy
```

---

## ✅ 実行後の確認

デプロイ完了後、以下をテスト：

1. **AIサクラチャットボット**
   - 右下の🌸アイコンをクリック
   - 「こんにちは」と送信
   - AIサクラからの返答を確認

2. **翻訳機能**
   - ヘッダーの言語切り替えボタンをテスト
   - English/한국어/中文を選択

3. **商品詳細ページ**
   - 商品カードの「詳細を見る」をクリック
   - 各商品の詳細情報を確認

---

## 🔒 セキュリティ

- `PASTE-API-KEYS.js` は自動でGitから除外されます
- APIキーが漏洩する心配はありません
- ローカルでのみ使用され、Netlifyに安全に送信されます

---

## 🆘 トラブルシューティング

### エラー: "OpenAI APIキーが設定されていません"
→ `PASTE-API-KEYS.js` でAPIキーが正しく設定されているか確認

### エラー: "Netlify CLIがインストールされていません"
→ 自動でインストールされます。管理者権限が必要な場合があります

### エラー: "デプロイに失敗しました"
→ Netlifyログインページでブラウザ認証を完了してください

---

## 📞 サポート

- **技術サポート**: GitHub Issues
- **高木酒造株式会社**: 0237-57-2131

**🍶 AIサクラがあなたの十四代体験をサポートします！**