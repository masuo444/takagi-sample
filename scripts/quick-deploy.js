#!/usr/bin/env node

/**
 * 🌸 超簡単デプロイ - APIキー貼り付けで全自動実装
 * OpenAI & DeepL APIキーを貼り付けるだけでAIサクラが起動！
 */

const { execSync } = require('child_process');
const fs = require('fs');
const readline = require('readline');

// ==========================================
// 🔥 ここにAPIキーを貼り付けるだけ！ 🔥
// ==========================================

// OpenAI APIキー（必須）sk-proj-で始まる
const OPENAI_API_KEY = "";

// DeepL APIキー（オプション）翻訳機能用
const DEEPL_API_KEY = "";

// ==========================================

const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function log(color, message) {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function showWelcome() {
    console.clear();
    log('magenta', '🌸🍶 高木酒造株式会社 - 超簡単デプロイ 🍶🌸');
    log('cyan', '====================================================');
    log('green', '✨ APIキーを貼り付けるだけで全自動実装！');
    console.log('');
}

function validateAPIKeys() {
    log('blue', '🔍 APIキーを検証中...');
    
    if (!OPENAI_API_KEY) {
        log('red', '❌ OpenAI APIキーが設定されていません');
        log('yellow', '💡 スクリプトの上部でOPENAI_API_KEYを設定してください');
        log('cyan', '   例: const OPENAI_API_KEY = "sk-proj-xxxxx...";');
        return false;
    }
    
    if (!OPENAI_API_KEY.startsWith('sk-')) {
        log('red', '❌ 無効なOpenAI APIキーです（sk-で始まる必要があります）');
        return false;
    }
    
    log('green', '✅ OpenAI APIキー: 有効');
    
    if (DEEPL_API_KEY) {
        log('green', '✅ DeepL APIキー: 設定済み（高品質翻訳が利用可能）');
    } else {
        log('yellow', '⚠️  DeepL APIキー: 未設定（基本翻訳のみ利用可能）');
    }
    
    return true;
}

async function checkNetlifyCLI() {
    log('blue', '🔧 Netlify CLIをチェック中...');
    
    try {
        execSync('netlify --version', { stdio: 'ignore' });
        log('green', '✅ Netlify CLI: インストール済み');
        return true;
    } catch (error) {
        log('yellow', '📦 Netlify CLIをインストール中...');
        try {
            execSync('npm install -g netlify-cli', { stdio: 'inherit' });
            log('green', '✅ Netlify CLI: インストール完了');
            return true;
        } catch (installError) {
            log('red', '❌ Netlify CLIのインストールに失敗しました');
            return false;
        }
    }
}

async function loginToNetlify() {
    log('blue', '🔐 Netlifyにログイン中...');
    
    try {
        // ログイン状態をチェック
        execSync('netlify status', { stdio: 'ignore' });
        log('green', '✅ Netlify: ログイン済み');
        return true;
    } catch (error) {
        log('yellow', '🌐 Netlifyログインページを開きます...');
        log('cyan', '   ブラウザでGitHubアカウントでログインしてください');
        
        try {
            execSync('netlify login', { stdio: 'inherit' });
            log('green', '✅ Netlify: ログイン完了');
            return true;
        } catch (loginError) {
            log('red', '❌ Netlifyログインに失敗しました');
            return false;
        }
    }
}

async function deploySite() {
    log('blue', '🚀 サイトをデプロイ中...');
    
    try {
        // サイトの初期化とデプロイ
        const deployResult = execSync('netlify deploy --prod --open', { 
            stdio: 'pipe', 
            encoding: 'utf-8' 
        });
        
        // サイトURLを抽出
        const urlMatch = deployResult.match(/Website URL: (https:\/\/[^\s]+)/);
        const siteUrl = urlMatch ? urlMatch[1] : 'https://your-site.netlify.app';
        
        log('green', '✅ デプロイ完了！');
        log('cyan', `🌐 サイトURL: ${siteUrl}`);
        
        return siteUrl;
    } catch (error) {
        log('red', '❌ デプロイに失敗しました');
        console.error(error.toString());
        return null;
    }
}

async function setEnvironmentVariables(siteUrl) {
    log('blue', '⚙️  環境変数を設定中...');
    
    try {
        // OpenAI APIキーを設定
        execSync(`netlify env:set OPENAI_API_KEY "${OPENAI_API_KEY}"`, { stdio: 'ignore' });
        log('green', '✅ OPENAI_API_KEY 設定完了');
        
        // DeepL APIキー（存在する場合）
        if (DEEPL_API_KEY && DEEPL_API_KEY.trim()) {
            execSync(`netlify env:set DEEPL_API_KEY "${DEEPL_API_KEY}"`, { stdio: 'ignore' });
            log('green', '✅ DEEPL_API_KEY 設定完了');
        }
        
        // NODE_ENV設定
        execSync('netlify env:set NODE_ENV "production"', { stdio: 'ignore' });
        log('green', '✅ NODE_ENV 設定完了');
        
        return true;
    } catch (error) {
        log('red', '❌ 環境変数の設定に失敗しました');
        console.error(error.toString());
        return false;
    }
}

async function triggerRedeploy() {
    log('blue', '🔄 環境変数適用のため再デプロイ中...');
    
    try {
        execSync('netlify deploy --prod', { stdio: 'ignore' });
        log('green', '✅ 再デプロイ完了');
        return true;
    } catch (error) {
        log('red', '❌ 再デプロイに失敗しました');
        return false;
    }
}

async function showSuccessMessage(siteUrl) {
    console.log('');
    log('green', '🎉 AIサクラの実装が完了しました！');
    console.log('');
    log('cyan', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    log('bright', '🌸 高木酒造株式会社 公式サイト 🌸');
    log('cyan', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    log('green', `🌐 サイトURL: ${siteUrl}`);
    console.log('');
    log('yellow', '✅ 動作確認項目:');
    console.log('   • 右下のAIサクラアイコンをクリック');
    console.log('   • 「こんにちは」とメッセージ送信');
    console.log('   • ヘッダーの言語切り替えボタンをテスト');
    console.log('   • 商品詳細ページを確認');
    console.log('');
    log('magenta', '🍶 AIサクラが十四代について案内を開始します！');
    console.log('');
}

async function createLocalEnvFile() {
    const envContent = `# 🌸 高木酒造株式会社 - 環境変数
# 自動生成: ${new Date().toISOString()}

OPENAI_API_KEY=${OPENAI_API_KEY}
${DEEPL_API_KEY ? `DEEPL_API_KEY=${DEEPL_API_KEY}` : '# DEEPL_API_KEY=未設定'}
NODE_ENV=production

# これらの環境変数はNetlifyに自動設定されました
# ローカル開発用のコピーです
`;
    
    try {
        fs.writeFileSync('.env', envContent);
        log('green', '✅ .env ファイルを作成しました');
    } catch (error) {
        log('yellow', '⚠️  .env ファイルの作成をスキップしました');
    }
}

async function main() {
    try {
        await showWelcome();
        
        // Step 1: APIキー検証
        if (!validateAPIKeys()) {
            process.exit(1);
        }
        
        await sleep(1000);
        
        // Step 2: Netlify CLI確認
        if (!await checkNetlifyCLI()) {
            process.exit(1);
        }
        
        await sleep(1000);
        
        // Step 3: Netlifyログイン
        if (!await loginToNetlify()) {
            process.exit(1);
        }
        
        await sleep(1000);
        
        // Step 4: サイトデプロイ
        const siteUrl = await deploySite();
        if (!siteUrl) {
            process.exit(1);
        }
        
        await sleep(2000);
        
        // Step 5: 環境変数設定
        if (!await setEnvironmentVariables(siteUrl)) {
            process.exit(1);
        }
        
        await sleep(1000);
        
        // Step 6: 再デプロイ
        if (!await triggerRedeploy()) {
            process.exit(1);
        }
        
        await sleep(1000);
        
        // Step 7: ローカル.env作成
        await createLocalEnvFile();
        
        // Step 8: 成功メッセージ
        await showSuccessMessage(siteUrl);
        
    } catch (error) {
        console.error('');
        log('red', '❌ 予期しないエラーが発生しました:');
        console.error(error.message);
        process.exit(1);
    }
}

// エラーハンドリング
process.on('unhandledRejection', (error) => {
    log('red', `❌ 予期しないエラー: ${error.message}`);
    process.exit(1);
});

process.on('SIGINT', () => {
    console.log('');
    log('yellow', '⚠️  デプロイをキャンセルしました');
    process.exit(0);
});

// 実行
if (require.main === module) {
    main();
}