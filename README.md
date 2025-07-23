# 🌸 高木酒造株式会社 公式サイト

元和元年（1615年）創業の高木酒造株式会社の公式ウェブサイト。十四代をはじめとする高品質な日本酒の情報とAIサクラチャットボットを提供。

## 🚀 自動デプロイ（推奨）

### 方法1: npm スクリプト（最も簡単）
```bash
# リポジトリをクローン
git clone https://github.com/masuo444/takagi-sample.git
cd takagi-sample

# 依存関係をインストール
npm install

# 自動セットアップとデプロイ
npm run deploy:auto
```

### 方法2: 個別実行
```bash
# APIキー設定
npm run setup

# デプロイ実行
npm run deploy
```

### 方法3: ワンクリックデプロイ
[netlify-deploy.html](./netlify-deploy.html) をブラウザで開いてAPIキーを入力

## 🔑 必要なAPIキー

- **OpenAI API Key** (必須): [OpenAI Platform](https://platform.openai.com/api-keys)
- **DeepL API Key** (オプション): [DeepL Pro](https://www.deepl.com/ja/pro#developer)

## 🍶 特徴

- **レスポンシブデザイン**: モバイル、タブレット、デスクトップに最適化
- **AIサクラチャットボット**: OpenAI GPT搭載の専門AI
- **多言語対応**: 日本語、英語、韓国語、中文対応（DeepL API）
- **高品質コンテンツ**: 12種類の十四代シリーズ詳細ページ
- **SEO最適化**: 検索エンジン最適化済み

## 🚀 技術スタック

### フロントエンド
- **HTML5**: セマンティックマークアップ
- **CSS3**: カスタムプロパティ、Grid、Flexbox
- **JavaScript (ES6+)**: モジュラー設計
- **Google Fonts**: Noto Sans JP, Noto Serif JP

### バックエンド（Netlify Functions）
- **Node.js**: サーバーレス関数
- **OpenAI API**: GPT-3.5-turbo チャットボット
- **DeepL API**: 高品質翻訳サービス

### デプロイメント
- **Netlify**: 静的サイトホスティング + Serverless Functions
- **Git**: バージョン管理
- **Domain**: カスタムドメイン対応

## 📦 インストール・セットアップ

### 1. リポジトリのクローン
```bash
git clone https://github.com/takagi-shuzo/official-site.git
cd official-site
```

### 2. 依存関係のインストール
```bash
npm install
```

### 3. 環境変数の設定
`.env.example`を`.env`にコピーして必要なAPIキーを設定：

```bash
cp .env.example .env
```

`.env`ファイルを編集：
```env
OPENAI_API_KEY=your_openai_api_key_here
DEEPL_API_KEY=your_deepl_api_key_here
SITE_URL=https://your-domain.com
```

### 4. ローカル開発サーバーの起動
```bash
# 静的サイト用
npm run dev

# Netlify Functions付き
npm run functions
```

## 🔧 Netlify デプロイメント

### 1. Netlify CLI のインストール
```bash
npm install -g netlify-cli
```

### 2. Netlify にログイン
```bash
netlify login
```

### 3. サイトの初期化
```bash
netlify init
```

### 4. 環境変数の設定
Netlify ダッシュボードで以下の環境変数を設定：

- `OPENAI_API_KEY`: OpenAI APIキー
- `DEEPL_API_KEY`: DeepL APIキー

### 5. デプロイ
```bash
netlify deploy --prod
```

## 📁 プロジェクト構造

```
高木酒造/
├── index.html                 # メインページ
├── 404.html                  # エラーページ
├── netlify.toml              # Netlify設定
├── package.json              # 依存関係
├── README.md                 # このファイル
├── css/                      # スタイルシート
│   ├── japanese-modern.css   # メインスタイル
│   ├── animations.css        # アニメーション
│   ├── mobile-responsive.css # モバイル対応
│   └── ...
├── js/                       # JavaScript
│   ├── ai-juyondai-chatbot.js # チャットボット
│   ├── product-images.js     # 商品画像生成
│   ├── google-translate-api.js # 翻訳機能
│   └── main.js              # メイン機能
├── products/                 # 商品詳細ページ
│   ├── juyondai-kanpyoukai.html
│   ├── juyondai-ryusen.html
│   └── ...
├── netlify/functions/        # Serverless Functions
│   ├── chatbot.js           # チャットボットAPI
│   └── translate.js         # 翻訳API
└── assets/                  # 画像・アイコン
    ├── ai-juyondai-icon.png
    └── ...
```

## 🌐 主要機能

### AI チャットボット「AI十四代」
- OpenAI GPT-3.5-turbo による自然言語処理
- 高木酒造専門知識データベース
- 多言語対応（自動翻訳）
- フォールバック応答機能

### 商品ラインナップ
- 12種類の十四代シリーズ
- 詳細な商品情報ページ
- 技術仕様（精米歩合、アルコール度等）
- 味覚プロファイル

### レスポンシブデザイン
- モバイルファースト設計
- 4列グリッドレイアウト（デスクトップ）
- 2列レイアウト（タブレット）
- 1列レイアウト（モバイル）

## 🔒 セキュリティ

- CSP（Content Security Policy）設定
- XSS保護
- HTTPS強制
- API キーの環境変数管理
- レート制限

## 📊 SEO・パフォーマンス

- 構造化データ（JSON-LD）
- OGPタグ最適化
- 画像圧縮・最適化
- CSS/JS ミニファイ
- CDN配信（Netlify）

## 🛠 メンテナンス

### 商品情報の更新
1. `products/`フォルダ内のHTMLファイルを編集
2. `index.html`の商品リストを更新
3. Git commit & push で自動デプロイ

### API キーの更新
1. Netlify ダッシュボード → Site settings → Environment variables
2. 該当キーを更新
3. 関数の再デプロイ実行

## 📞 サポート

技術的な問題や質問がございましたら、以下までお問い合わせください：

- **高木酒造株式会社**
- 📍 〒995-0111 山形県村山市富並1826
- ☎️ 0237-57-2131
- 🌐 https://takagi-shuzo.netlify.app

## 📄 ライセンス

© 2024 高木酒造株式会社. All rights reserved.

---

*このサイトは、400年の伝統を誇る高木酒造株式会社の「十四代」ブランドを世界に紹介するために作られました。*