#!/bin/bash

# 🌸 高木酒造株式会社 - 自動デプロイスクリプト
# AIサクラを動作させるための環境変数設定とデプロイを自動化

set -e

echo "🍶 高木酒造株式会社 - AIサクラ自動デプロイ開始"
echo "=================================================="

# 色付きログ関数
log_info() {
    echo -e "\033[34m[INFO]\033[0m $1"
}

log_success() {
    echo -e "\033[32m[SUCCESS]\033[0m $1"
}

log_error() {
    echo -e "\033[31m[ERROR]\033[0m $1"
}

log_warning() {
    echo -e "\033[33m[WARNING]\033[0m $1"
}

# Netlify CLIの確認
if ! command -v netlify &> /dev/null; then
    log_error "Netlify CLIがインストールされていません"
    echo "以下のコマンドでインストールしてください:"
    echo "npm install -g netlify-cli"
    exit 1
fi

# APIキーの入力
log_info "APIキーを設定します"
echo ""

# OpenAI APIキーの入力
if [ -z "$OPENAI_API_KEY" ]; then
    echo -n "OpenAI APIキーを入力してください (sk-で始まる): "
    read -s OPENAI_API_KEY
    echo ""
    
    if [[ ! "$OPENAI_API_KEY" =~ ^sk- ]]; then
        log_error "無効なOpenAI APIキーです。sk-で始まる必要があります。"
        exit 1
    fi
fi

# DeepL APIキーの入力（オプション）
if [ -z "$DEEPL_API_KEY" ]; then
    echo -n "DeepL APIキー (オプション、空白でスキップ): "
    read -s DEEPL_API_KEY
    echo ""
fi

# Netlifyサイトの確認
log_info "Netlifyサイト情報を確認中..."
SITE_ID=$(netlify sites:list --json | jq -r '.[] | select(.name=="takagi-sample" or .repo_url | contains("takagi-sample")) | .id' | head -1)

if [ -z "$SITE_ID" ]; then
    log_warning "既存のサイトが見つかりません。新しいサイトを作成します。"
    
    echo -n "サイト名を入力してください (takagi-sample): "
    read SITE_NAME
    SITE_NAME=${SITE_NAME:-takagi-sample}
    
    # 新しいサイトの作成
    log_info "新しいNetlifyサイトを作成中..."
    netlify sites:create --name "$SITE_NAME" --account-slug "$(netlify accounts:list --json | jq -r '.[0].slug')"
    SITE_ID=$(netlify sites:list --json | jq -r ".[] | select(.name==\"$SITE_NAME\") | .id")
else
    log_success "既存のNetlifyサイトを検出: $SITE_ID"
fi

# 環境変数の設定
log_info "環境変数を設定中..."

# OpenAI APIキーの設定
if [ -n "$OPENAI_API_KEY" ]; then
    netlify env:set OPENAI_API_KEY "$OPENAI_API_KEY" --site "$SITE_ID"
    log_success "OPENAI_API_KEY を設定しました"
fi

# DeepL APIキーの設定
if [ -n "$DEEPL_API_KEY" ]; then
    netlify env:set DEEPL_API_KEY "$DEEPL_API_KEY" --site "$SITE_ID"
    log_success "DEEPL_API_KEY を設定しました"
fi

# NODE_ENVの設定
netlify env:set NODE_ENV "production" --site "$SITE_ID"
log_success "NODE_ENV を設定しました"

# サイトをリンク
log_info "サイトをリンク中..."
echo "$SITE_ID" > .netlify/state.json

# デプロイの実行
log_info "サイトをデプロイ中..."
netlify deploy --prod --site "$SITE_ID"

if [ $? -eq 0 ]; then
    log_success "デプロイが完了しました！"
    
    # サイトURLの取得
    SITE_URL=$(netlify sites:list --json | jq -r ".[] | select(.id==\"$SITE_ID\") | .url")
    
    echo ""
    echo "🎉 高木酒造株式会社公式サイトが公開されました！"
    echo "🌸 AIサクラが動作開始しました"
    echo ""
    echo "サイトURL: $SITE_URL"
    echo "管理画面: https://app.netlify.com/sites/$(echo $SITE_URL | sed 's|https://||' | sed 's|\.netlify\.app||')"
    echo ""
    echo "✅ AIサクラチャットボットをテストしてください"
    echo "✅ 多言語翻訳機能をテストしてください"
    
else
    log_error "デプロイに失敗しました"
    exit 1
fi

echo ""
echo "🍶 デプロイ完了 - AIサクラが十四代について案内を開始します！"