/**
 * Google翻訳API直接実装
 * ページ内容を直接翻訳して表示
 */

// 現在の翻訳状態
let currentLanguage = 'ja';
let originalContent = new Map(); // 元のコンテンツを保存

// 翻訳ドロップダウンの制御
function toggleTranslateDropdown() {
    const dropdown = document.querySelector('.translate-dropdown');
    const options = document.getElementById('translateOptions');
    
    if (options.style.display === 'none' || !options.style.display) {
        options.style.display = 'block';
        dropdown.classList.add('open');
    } else {
        options.style.display = 'none';
        dropdown.classList.remove('open');
    }
}

// 言語選択時の処理
async function translateToLanguage(targetLang) {
    console.log(`Translating to: ${targetLang}`);
    
    // ドロップダウンを閉じる
    const options = document.getElementById('translateOptions');
    const dropdown = document.querySelector('.translate-dropdown');
    options.style.display = 'none';
    dropdown.classList.remove('open');
    
    // 同じ言語の場合は何もしない
    if (currentLanguage === targetLang) return;
    
    // UI更新
    updateLanguageUI(targetLang);
    
    if (targetLang === 'ja') {
        // 日本語に戻す
        restoreOriginalContent();
        currentLanguage = 'ja';
        return;
    }
    
    // 翻訳実行
    await translatePageContent(targetLang);
    currentLanguage = targetLang;
}

// 言語UI更新
function updateLanguageUI(langCode) {
    const langInfo = {
        'ja': { flag: '🇯🇵', name: '日本語' },
        'en': { flag: '🇺🇸', name: 'English' },
        'ko': { flag: '🇰🇷', name: '한국어' },
        'zh': { flag: '🇨🇳', name: '中文' }
    };
    
    const info = langInfo[langCode];
    if (info) {
        document.querySelector('.current-lang-flag').textContent = info.flag;
        document.querySelector('.current-lang-text').textContent = info.name;
    }
}

// ページコンテンツの翻訳
async function translatePageContent(targetLang) {
    // 翻訳対象の要素を取得
    const elementsToTranslate = [
        ...document.querySelectorAll('h1, h2, h3, h4, h5, h6'),
        ...document.querySelectorAll('p'),
        ...document.querySelectorAll('.nav-link'),
        ...document.querySelectorAll('.btn'),
        ...document.querySelectorAll('.product-name'),
        ...document.querySelectorAll('.product-description'),
        ...document.querySelectorAll('.section-title'),
        ...document.querySelectorAll('.hero-subtitle'),
        ...document.querySelectorAll('.feature-tag'),
        ...document.querySelectorAll('.quick-action-btn')
    ];
    
    // 翻訳中表示
    showTranslationLoader();
    
    try {
        // バッチで翻訳処理
        const batchSize = 10;
        for (let i = 0; i < elementsToTranslate.length; i += batchSize) {
            const batch = elementsToTranslate.slice(i, i + batchSize);
            await translateElementsBatch(batch, targetLang);
            
            // プログレス表示
            const progress = Math.min(100, ((i + batchSize) / elementsToTranslate.length) * 100);
            updateTranslationProgress(progress);
        }
    } catch (error) {
        console.error('Translation error:', error);
        showTranslationError();
    } finally {
        hideTranslationLoader();
    }
}

// 要素バッチの翻訳
async function translateElementsBatch(elements, targetLang) {
    const translations = await Promise.all(
        elements.map(async (element) => {
            const originalText = element.textContent.trim();
            if (!originalText || originalText.length < 2) return null;
            
            // 元のコンテンツを保存
            if (!originalContent.has(element)) {
                originalContent.set(element, originalText);
            }
            
            try {
                const translatedText = await translateText(originalText, targetLang);
                return { element, translatedText };
            } catch (error) {
                console.error('Translation failed for:', originalText, error);
                return null;
            }
        })
    );
    
    // 翻訳結果を適用
    translations.forEach(result => {
        if (result && result.translatedText) {
            result.element.textContent = result.translatedText;
        }
    });
}

// テキスト翻訳（Google翻訳API代替）
async function translateText(text, targetLang) {
    // 簡易的な翻訳辞書（デモ用）
    const translations = {
        'en': {
            '吉源酒造場': 'Yoshigen Sake Brewery',
            '寿齢': 'Jurei',
            '長寿を祝う酒': 'Sake to Celebrate Longevity',
            '蔵元について': 'About Yoshigen Brewery',
            '商品一覧': 'Product List',
            '歴史': 'History',
            'アクセス': 'Access',
            '商品を見る': 'View Products',
            '安政元年創業の老舗': 'Established in 1854',
            '特選': 'Special Selection',
            '上撰': 'Premium Selection',
            '本醸造原酒': 'Honjozo Genshu',
            '詳細を見る': 'View Details',
            '芳醇で深みがある味わい': 'Rich and deep flavor',
            '糖無しでスッキリとした飲み口': 'Clean and crisp taste without added sugar',
            'ドライな辛口タイプ': 'Dry and sharp type',
            '地元復活銘柄': 'Locally revived brand'
        },
        'ko': {
            '吉源酒造場': '요시겐 사케 양조장',
            '寿齢': '수령',
            '長寿を祝う酒': '장수를 축하하는 술',
            '蔵元について': '양조장 소개',
            '商品一覧': '제품 목록',
            '歴史': '역사',
            'アクセス': '찾아오시는 길',
            '商品を見る': '제품 보기',
            '安政元年創業の老舗': '1854년 창업의 노포',
            '特選': '특선',
            '上撰': '상선',
            '本醸造原酒': '혼조조 원주',
            '詳細を見る': '자세히 보기'
        },
        'zh': {
            '吉源酒造場': '吉源酒造场',
            '寿齢': '寿龄',
            '長寿を祝う酒': '庆祝长寿的酒',
            '蔵元について': '关于酒厂',
            '商品一覧': '产品列表',
            '歴史': '历史',
            'アクセス': '交通',
            '商品を見る': '查看产品',
            '安政元年創業の老舗': '创立于1854年的老店',
            '特選': '特选',
            '上撰': '上选',
            '本醸造原酒': '本酿造原酒',
            '詳細を見る': '查看详情'
        }
    };
    
    const langTranslations = translations[targetLang];
    if (langTranslations && langTranslations[text]) {
        return langTranslations[text];
    }
    
    // フォールバック: MyMemory APIを使用
    try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ja|${targetLang}`);
        const data = await response.json();
        
        if (data.responseStatus === 200 && data.responseData.translatedText) {
            return data.responseData.translatedText;
        }
    } catch (error) {
        console.error('API translation failed:', error);
    }
    
    // 最終フォールバック
    return `[${targetLang.toUpperCase()}] ${text}`;
}

// 元のコンテンツを復元
function restoreOriginalContent() {
    originalContent.forEach((originalText, element) => {
        element.textContent = originalText;
    });
}

// 翻訳ローダー表示
function showTranslationLoader() {
    const loader = document.createElement('div');
    loader.id = 'translationLoader';
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    loader.innerHTML = `
        <div style="
            background: white;
            padding: 2rem;
            border-radius: 8px;
            text-align: center;
            min-width: 200px;
        ">
            <div style="
                width: 40px;
                height: 40px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid var(--primary-color);
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
            "></div>
            <p style="margin: 0; color: var(--primary-color);">翻訳中...</p>
            <div id="translationProgress" style="
                width: 100%;
                height: 4px;
                background: #f0f0f0;
                border-radius: 2px;
                margin-top: 1rem;
                overflow: hidden;
            ">
                <div id="progressBar" style="
                    height: 100%;
                    background: var(--primary-color);
                    width: 0%;
                    transition: width 0.3s ease;
                "></div>
            </div>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    
    document.body.appendChild(loader);
}

// 翻訳プログレス更新
function updateTranslationProgress(percent) {
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.width = percent + '%';
    }
}

// 翻訳ローダー非表示
function hideTranslationLoader() {
    const loader = document.getElementById('translationLoader');
    if (loader) {
        loader.remove();
    }
}

// エラー表示
function showTranslationError() {
    alert('翻訳に失敗しました。しばらく後に再試行してください。');
}

// ページ外クリックでドロップダウンを閉じる
document.addEventListener('click', (e) => {
    if (!e.target.closest('.translate-dropdown')) {
        const options = document.getElementById('translateOptions');
        const dropdown = document.querySelector('.translate-dropdown');
        if (options && dropdown) {
            options.style.display = 'none';
            dropdown.classList.remove('open');
        }
    }
});

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    console.log('Google Translate API initialized');
});