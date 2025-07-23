#!/usr/bin/env node

/**
 * 🌸 高木酒造株式会社 - 環境変数自動設定スクリプト
 * AIサクラの動作に必要なAPIキーを対話的に設定
 */

const readline = require('readline');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 色付きログ関数
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

function createInterface() {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
}

function question(rl, query) {
    return new Promise(resolve => {
        rl.question(query, resolve);
    });
}

async function checkNetlifyCLI() {
    try {
        execSync('netlify --version', { stdio: 'ignore' });
        return true;
    } catch (error) {
        return false;
    }
}

async function installNetlifyCLI() {
    log('yellow', '⚠️  Netlify CLIがインストールされていません');
    console.log('');
    
    const rl = createInterface();
    const install = await question(rl, '📦 Netlify CLIをインストールしますか？ (y/n): ');
    rl.close();
    
    if (install.toLowerCase() === 'y' || install.toLowerCase() === 'yes') {
        log('blue', '📦 Netlify CLIをインストール中...');
        try {
            execSync('npm install -g netlify-cli', { stdio: 'inherit' });
            log('green', '✅ Netlify CLIのインストールが完了しました');
            return true;
        } catch (error) {
            log('red', '❌ Netlify CLIのインストールに失敗しました');
            return false;
        }
    }
    
    return false;
}

async function getAPIKeys() {
    const rl = createInterface();
    
    log('cyan', '🔑 APIキーを設定します');
    console.log('');
    
    // OpenAI APIキー
    let openaiKey = '';
    while (!openaiKey) {
        openaiKey = await question(rl, '🤖 OpenAI APIキーを入力してください (sk-で始まる): ');
        if (!openaiKey.startsWith('sk-')) {
            log('red', '❌ 無効なOpenAI APIキーです。sk-で始まる必要があります。');
            openaiKey = '';
        }
    }
    
    // DeepL APIキー（オプション）
    console.log('');
    const deeplKey = await question(rl, '🌐 DeepL APIキー (オプション、空白でスキップ): ');
    
    rl.close();
    
    return { openaiKey, deeplKey };
}

async function setNetlifyEnvVars(openaiKey, deeplKey) {
    log('blue', '⚙️  Netlify環境変数を設定中...');
    
    try {
        // OpenAI APIキーを設定
        execSync(`netlify env:set OPENAI_API_KEY "${openaiKey}"`, { stdio: 'inherit' });
        log('green', '✅ OPENAI_API_KEY を設定しました');
        
        // DeepL APIキー（存在する場合）
        if (deeplKey && deeplKey.trim()) {
            execSync(`netlify env:set DEEPL_API_KEY "${deeplKey}"`, { stdio: 'inherit' });
            log('green', '✅ DEEPL_API_KEY を設定しました');
        }
        
        // NODE_ENVを設定
        execSync('netlify env:set NODE_ENV "production"', { stdio: 'inherit' });
        log('green', '✅ NODE_ENV を設定しました');
        
        return true;
    } catch (error) {
        log('red', '❌ 環境変数の設定に失敗しました');
        console.error(error.message);
        return false;
    }
}

async function createLocalEnvFile(openaiKey, deeplKey) {
    const envContent = `# 高木酒造株式会社 - 環境変数設定
# このファイルは自動生成されました

OPENAI_API_KEY=${openaiKey}
${deeplKey ? `DEEPL_API_KEY=${deeplKey}` : '# DEEPL_API_KEY='}
NODE_ENV=production

# 生成日時: ${new Date().toISOString()}
`;
    
    try {
        fs.writeFileSync('.env', envContent);
        log('green', '✅ .env ファイルを作成しました');
    } catch (error) {
        log('red', '❌ .env ファイルの作成に失敗しました');
    }
}

async function main() {
    console.log('');
    log('magenta', '🌸🍶 高木酒造株式会社 - AIサクラ環境設定 🍶🌸');
    log('cyan', '================================================');
    console.log('');
    
    // Netlify CLIの確認
    const hasNetlifyCLI = await checkNetlifyCLI();
    
    if (!hasNetlifyCLI) {
        const installed = await installNetlifyCLI();
        if (!installed) {
            log('red', '❌ Netlify CLIが必要です。手動でインストールしてから再実行してください。');
            process.exit(1);
        }
    }
    
    // APIキーの取得
    const { openaiKey, deeplKey } = await getAPIKeys();
    
    // 環境変数の設定
    const success = await setNetlifyEnvVars(openaiKey, deeplKey);
    
    if (success) {
        // ローカル.envファイルの作成
        await createLocalEnvFile(openaiKey, deeplKey);
        
        console.log('');
        log('green', '🎉 環境変数の設定が完了しました！');
        console.log('');
        log('cyan', '次のステップ:');
        console.log('1. npm run deploy - サイトをデプロイ');
        console.log('2. サイトでAIサクラをテスト');
        console.log('3. 多言語翻訳機能をテスト');
        console.log('');
        log('yellow', '📝 APIキーは安全に保管され、Gitリポジトリには含まれません');
    } else {
        log('red', '❌ 設定に失敗しました');
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
    log('yellow', '⚠️  設定をキャンセルしました');
    process.exit(0);
});

// 実行
if (require.main === module) {
    main();
}