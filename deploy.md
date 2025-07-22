# 🚀 Netlify デプロイメントガイド

高木酒造株式会社公式サイトをNetlifyで公開するためのステップバイステップガイドです。

## 📋 事前準備

### 1. 必要なアカウント
- [Netlify](https://www.netlify.com/) アカウント
- [GitHub](https://github.com/) アカウント (推奨)
- [OpenAI](https://openai.com/) APIキー (チャットボット用)
- [DeepL](https://www.deepl.com/pro) APIキー (翻訳用)

### 2. 必要なツール
```bash
npm install -g netlify-cli
```

## 🔧 デプロイメント手順

### Step 1: GitHubリポジトリの作成

1. GitHub で新しいリポジトリ作成
   - リポジトリ名: `takagi-shuzo-official`
   - Public/Private: Public (推奨)

2. ローカルファイルをGitHubにプッシュ
```bash
cd "/Users/masuo/Desktop/高木酒造"
git init
git add .
git commit -m "Initial commit: 高木酒造株式会社公式サイト"
git remote add origin https://github.com/YOUR_USERNAME/takagi-shuzo-official.git
git branch -M main
git push -u origin main
```

### Step 2: Netlify でサイト作成

1. [Netlify](https://app.netlify.com/) にログイン
2. "New site from Git" をクリック
3. GitHub を選択
4. `takagi-shuzo-official` リポジトリを選択
5. ビルド設定:
   - **Build command**: `echo "Static site ready"`
   - **Publish directory**: `.`
   - **Functions directory**: `netlify/functions`

### Step 3: 環境変数の設定

Netlify ダッシュボード → Site settings → Environment variables

```env
OPENAI_API_KEY=sk-your-openai-api-key-here
DEEPL_API_KEY=your-deepl-api-key-here
SITE_URL=https://your-site-name.netlify.app
SITE_NAME=高木酒造株式会社
CONTACT_EMAIL=info@takagi-shuzo.com
CONTACT_PHONE=0237-57-2131
```

### Step 4: カスタムドメインの設定 (オプション)

1. ダッシュボード → Domain settings
2. "Add custom domain" をクリック
3. ドメイン名を入力 (例: `takagi-shuzo.com`)
4. DNS設定:
   ```
   Type: CNAME
   Name: www
   Value: your-site-name.netlify.app
   
   Type: ALIAS/ANAME
   Name: @
   Value: your-site-name.netlify.app
   ```

### Step 5: HTTPS・セキュリティ設定

1. SSL証明書の自動発行を有効化
2. HTTPS リダイレクトを有効化
3. セキュリティヘッダーの確認 (`netlify.toml`で設定済み)

## 🔍 デプロイメント確認

### 機能テスト
- [ ] サイトが正常に表示される
- [ ] レスポンシブデザインが動作する
- [ ] チャットボット「AI十四代」が動作する
- [ ] 翻訳機能が動作する
- [ ] 全ての商品詳細ページにアクセスできる
- [ ] フォームが動作する
- [ ] 404ページが表示される

### パフォーマンステスト
- [ ] PageSpeed Insights スコア 90+ 
- [ ] Core Web Vitals が良好
- [ ] 画像の最適化
- [ ] CSS/JS の圧縮

## 🛠 継続的デプロイメント

### 自動デプロイ設定
GitHub へのプッシュで自動デプロイが実行されます:

```bash
# 変更をコミット・プッシュ
git add .
git commit -m "サイト更新: 商品情報の追加"
git push origin main
```

### Branch Deploy (オプション)
開発ブランチでのプレビュー:

```bash
git checkout -b feature/new-product
# 変更作業
git add .
git commit -m "新商品ページの追加"
git push origin feature/new-product
```

Netlify で自動的にプレビューURLが生成されます。

## 📊 モニタリング・分析

### Netlify Analytics
- ダッシュボードでアクセス解析
- Core Web Vitals の監視
- エラーログの確認

### Google Analytics (推奨)
1. Google Analytics 4 プロパティ作成
2. 測定IDをサイトに追加
3. 環境変数 `GOOGLE_ANALYTICS_ID` を設定

## 🔒 セキュリティ設定

### API キーの保護
- 環境変数でAPIキー管理
- リポジトリに機密情報をコミットしない
- 定期的なAPIキーローテーション

### アクセス制御
```toml
# netlify.toml で設定済み
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    Content-Security-Policy = "default-src 'self'..."
```

## 🚨 トラブルシューティング

### よくある問題

1. **Functions が動作しない**
   ```bash
   netlify functions:list
   netlify functions:invoke chatbot --payload '{"message":"test"}'
   ```

2. **環境変数が認識されない**
   - Netlify ダッシュボードで設定確認
   - サイトの再デプロイ実行

3. **404エラーが多発**
   - `netlify.toml` の redirects 設定確認
   - ファイルパスの大文字小文字確認

### ログ確認
```bash
netlify logs
netlify functions:logs chatbot
```

## 📞 サポート

技術的な問題が発生した場合:

1. [Netlify Community](https://community.netlify.com/)
2. [Netlify Support](https://www.netlify.com/support/)
3. GitHub Issues でバグ報告

---

## 🎉 デプロイ完了後

サイトが正常に公開されたら:

1. ✅ 全機能の最終確認
2. ✅ SEO設定の確認
3. ✅ パフォーマンステスト
4. ✅ モバイル対応確認
5. ✅ アナリティクス設定

**🍶 おめでとうございます！高木酒造株式会社の公式サイトが公開されました！**