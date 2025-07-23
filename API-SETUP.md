# 🌸 AIサクラ API設定ガイド

高木酒造株式会社公式サイトのAIサクラチャットボットを動作させるためのAPI設定方法です。

## 🔑 必要なAPIキー

### 1. OpenAI API Key (必須)
AIサクラの高度な会話機能に使用します。

**取得方法:**
1. [OpenAI Platform](https://platform.openai.com/api-keys) にアクセス
2. アカウント作成またはログイン
3. "Create new secret key" をクリック
4. キー名を入力（例：takagi-shuzo-website）
5. 生成されたキーをコピー（`sk-proj-xxxxx...` の形式）

**料金:** 従量課金制（月額$5-20程度の使用量を想定）

### 2. DeepL API Key (オプション)
多言語翻訳機能に使用します。設定しない場合は基本的な翻訳のみ利用可能。

**取得方法:**
1. [DeepL Pro](https://www.deepl.com/ja/pro#developer) にアクセス
2. 開発者プランに登録
3. API キーを取得（`xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:fx` の形式）

**料金:** 月額500,000文字まで無料

## 🚀 Netlify環境変数の設定

### ステップ1: Netlifyダッシュボードにアクセス
1. [Netlify](https://app.netlify.com/) にログイン
2. takagi-sample サイトを選択

### ステップ2: 環境変数を追加
1. **Site settings** をクリック
2. 左メニューから **Environment variables** を選択
3. **Add variable** をクリック

### ステップ3: APIキーを設定
以下の環境変数を追加してください：

| Key | Value | 説明 |
|-----|-------|------|
| `OPENAI_API_KEY` | `sk-proj-xxxxx...` | OpenAIのAPIキー（必須） |
| `DEEPL_API_KEY` | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:fx` | DeepLのAPIキー（オプション） |
| `NODE_ENV` | `production` | 本番環境設定 |

### ステップ4: サイトを再デプロイ
1. **Deploys** タブに移動
2. **Trigger deploy** > **Deploy site** をクリック

## 🧪 動作確認

### チャットボットのテスト
1. サイトの右下のAIサクラアイコンをクリック
2. 「こんにちは」とメッセージを送信
3. AIサクラからの返答があれば成功

### 翻訳機能のテスト
1. ヘッダーの言語切り替えボタンをクリック
2. English、한국어、中文 のいずれかを選択
3. サイトが翻訳されれば成功

## 🔍 トラブルシューティング

### AIサクラが応答しない場合
1. OpenAI APIキーが正しく設定されているか確認
2. Netlifyの環境変数に `OPENAI_API_KEY` が追加されているか確認
3. サイトを再デプロイ

### 翻訳が動作しない場合
1. DeepL APIキーが正しく設定されているか確認
2. 基本翻訳機能は動作するが、より高品質な翻訳にはDeepL APIが必要

### API使用量の確認
- **OpenAI:** [Usage dashboard](https://platform.openai.com/usage)
- **DeepL:** [Account usage](https://www.deepl.com/account/usage)

## 📞 サポート

設定でご不明な点がございましたら、以下までお問い合わせください：

- **技術サポート:** GitHub Issues
- **高木酒造株式会社:** 0237-57-2131

## 🔒 セキュリティ注意事項

- APIキーは絶対にGitリポジトリにコミットしないでください
- 定期的にAPIキーをローテーションすることを推奨します
- 使用量を監視し、異常な使用があった場合は即座にキーを無効化してください