// Main JavaScript for yodobloom SAKE
// yodobloom SAKE専用メインスクリプト

class YodobloomSAKE {
    constructor() {
        this.companyData = null;
        this.initialized = false;
        
        this.init();
    }
    
    /**
     * 初期化処理
     */
    async init() {
        console.log('Initializing yodobloom SAKE...');
        
        try {
            // 企業データを設定
            this.setupCompanyData();
            
            // UIを更新
            this.updateUI();
            
            // 自動化システムを実行
            await this.runAutomationSystems();
            
            // イベントリスナーを設定
            this.setupEventListeners();
            
            this.initialized = true;
            console.log('yodobloom SAKE initialized successfully');
            
        } catch (error) {
            console.error('Initialization error:', error);
            this.showErrorMessage('システムの初期化に失敗しました。');
        }
    }
    
    /**
     * 企業データ設定
     */
    setupCompanyData() {
        this.companyData = {
            company: {
                name: 'yodobloom SAKE (ヨドブルーム サケ)',
                description: '季節ごとに厳選された１００種類の日本酒を試飲しながら、認定唎酒師®がガイドしてくれる日本酒テーマパークです。個人の好みに合わせたカスタマイズされた日本酒推薦体験とアプリベースの酒チャレンジを提供しています。',
                location: '大阪市北区大深町',
                address: '大阪市北区大深町1-1 2階',
                phone: '06-4802-1010',
                motto: '季節ごとに厳選された１００種類の日本酒テーマパーク',
                features: ['唎酒師®ガイド付き', 'アプリ連動', '個人化推薦', '100種類季節限定'],
                website: 'https://yodobloom.com',
                images: {
                    logo: 'assets/images/yodobloom-logo.png',
                    background: 'assets/images/yodobloom-hero.jpg'
                }
            },
            products: [
                {
                    name: '季節限定100種類日本酒セレクション',
                    type: '試飲体験',
                    description: '全国の優秀な蔵元から季節ごとに厳選された100種類の日本酒をお楽しみいただけます。',
                    features: ['季節限定', '全国蔵元厳選', '100種類', '唎酒師ガイド付き'],
                    image: 'assets/images/yodobloom-selection.jpg'
                },
                {
                    name: '唎酒師®ガイド付き体験',
                    type: '専門サービス',
                    description: '認定唎酒師®による専門的なガイド付きで、日本酒の奥深さを学びながら試飲できます。',
                    features: ['専門ガイド', '教育的体験', '個別対応', '30分体験'],
                    image: 'assets/images/yodobloom-guide.jpg'
                },
                {
                    name: 'カスタマイズ推薦体験',
                    type: '個人化サービス',
                    description: '30分間の個人の好みに合わせたカスタマイズされた日本酒推薦体験。',
                    features: ['個人化', '30分体験', 'カスタマイズ', 'データ保存'],
                    image: 'assets/images/yodobloom-custom.jpg'
                }
            ],
            businessType: 'sake_theme_park',
            specialties: ['唎酒師ガイド付き試飲', 'カスタマイズ推薦', '季節限定100種類'],
            websiteUrl: 'https://yodobloom.com'
        };
        
        // グローバルに設定
        window.companyData = this.companyData;
    }
    
    /**
     * UI更新
     */
    updateUI() {
        const company = this.companyData.company;
        
        // 基本情報の更新
        this.updateElement('companyName', company.name);
        this.updateElement('companyDescription', company.description);
        this.updateElement('location', company.address);
        this.updateElement('phone', company.phone);
        this.updateElement('motto', '平日 12:00-22:00 | 土日祝日 10:00-22:00');
        this.updateElement('features', company.features.join('、'));
        
        // 連絡先情報
        this.updateElement('contactPhone', company.phone);
        this.updateElement('contactAddress', company.address);
        
        // メタ情報の更新
        this.updatePageTitle();
        this.updateMetaDescription();
        
        // 商品情報の更新
        this.updateProducts();
        
        // 画像の更新
        this.updateImages();
    }
    
    /**
     * 要素更新
     */
    updateElement(id, content) {
        const element = document.getElementById(id);
        if (element && content) {
            element.textContent = content;
        }
    }
    
    /**
     * ページタイトル更新
     */
    updatePageTitle() {
        const title = `${this.companyData.company.name} | プレミアム日本酒セレクション`;
        document.title = title;
        
        // OGタイトルも更新
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            ogTitle.setAttribute('content', title);
        }
        
        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        if (twitterTitle) {
            twitterTitle.setAttribute('content', title);
        }
    }
    
    /**
     * メタディスクリプション更新
     */
    updateMetaDescription() {
        const description = this.companyData.company.description;
        
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', description);
        }
        
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) {
            ogDesc.setAttribute('content', description);
        }
        
        const twitterDesc = document.querySelector('meta[name="twitter:description"]');
        if (twitterDesc) {
            twitterDesc.setAttribute('content', description);
        }
    }
    
    /**
     * 商品情報更新
     */
    updateProducts() {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;
        
        // 既存の商品カードは保持（HTMLに記載済み）
        console.log('Products loaded:', this.companyData.products.length);
    }
    
    /**
     * 画像更新
     */
    updateImages() {
        const company = this.companyData.company;
        
        // ヒーロー画像
        const heroImage = document.getElementById('heroImage');
        if (heroImage && company.images?.background) {
            heroImage.src = company.images.background;
            heroImage.alt = `${company.name}のメイン画像`;
        }
        
        // 企業画像
        const companyImage = document.getElementById('companyImage');
        if (companyImage && company.images?.background) {
            companyImage.src = company.images.background;
            companyImage.alt = `${company.name}テーマパーク内部`;
        }
        
        // ロゴの更新（ヘッダー）
        this.updateLogo();
    }
    
    /**
     * ロゴ更新
     */
    updateLogo() {
        const company = this.companyData.company;
        if (!company.images?.logo) return;
        
        const logoH1 = document.querySelector('.logo h1');
        if (logoH1) {
            // ロゴ画像がある場合は背景画像として設定
            logoH1.style.backgroundImage = `url(${company.images.logo})`;
            logoH1.style.backgroundSize = 'contain';
            logoH1.style.backgroundRepeat = 'no-repeat';
            logoH1.style.backgroundPosition = 'center';
            logoH1.style.height = '60px';
            logoH1.style.textIndent = '-9999px';
        }
    }
    
    /**
     * 自動化システム実行
     */
    async runAutomationSystems() {
        console.log('Running automation systems...');
        
        try {
            // 視覚的ブランディング自動化
            if (window.VisualBrandingAutomation) {
                const branding = new window.VisualBrandingAutomation();
                const logoUrl = this.companyData.company.images?.logo;
                if (logoUrl) {
                    await branding.generateBrandingTheme(logoUrl, 'sake_theme_park');
                }
            }
            
            // SEO最適化
            if (window.SEOMultilingualOptimization) {
                const seo = new window.SEOMultilingualOptimization();
                await seo.optimizeSEOAndMultilingual(
                    this.companyData, 
                    'sake_theme_park', 
                    this.companyData.websiteUrl
                );
            }
            
            console.log('Automation systems completed');
            
        } catch (error) {
            console.error('Automation systems error:', error);
        }
    }
    
    /**
     * イベントリスナー設定
     */
    setupEventListeners() {
        // スムーススクロール
        this.setupSmoothScroll();
        
        // レスポンシブナビゲーション
        this.setupResponsiveNav();
        
        // モバイルハンバーガーメニュー
        this.setupMobileMenu();
        
        // 言語切替
        this.setupLanguageSwitcher();
        
        // 商品カテゴリフィルター
        this.setupProductFilter();
        
        // 商品タブ機能
        this.setupProductTabs();
        
        // 商品詳細展開機能
        this.setupProductDetailsToggle();
        
        // AIサポートセクション機能
        this.setupAISupportSection();
        
        // チャットボタンスクロール追従
        this.setupChatButtonScrollBehavior();
    }
    
    /**
     * スムーススクロール設定
     */
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    /**
     * レスポンシブナビゲーション設定
     */
    setupResponsiveNav() {
        // モバイルメニューボタンがある場合の処理
        const navToggle = document.querySelector('.nav-toggle');
        const nav = document.querySelector('.nav ul');
        
        if (navToggle && nav) {
            navToggle.addEventListener('click', () => {
                nav.classList.toggle('active');
            });
        }
    }
    
    /**
     * モバイルハンバーガーメニュー設定
     */
    setupMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
        const mobileMenuClose = document.getElementById('mobileMenuClose');
        const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
        
        if (!mobileMenuToggle || !mobileMenuOverlay || !mobileMenuClose) {
            console.warn('Mobile menu elements not found');
            return;
        }
        
        // ハンバーガーメニューボタンクリック
        mobileMenuToggle.addEventListener('click', () => {
            this.toggleMobileMenu(true);
        });
        
        // メニュー閉じるボタンクリック
        mobileMenuClose.addEventListener('click', () => {
            this.toggleMobileMenu(false);
        });
        
        // オーバーレイクリックで閉じる
        mobileMenuOverlay.addEventListener('click', (e) => {
            if (e.target === mobileMenuOverlay) {
                this.toggleMobileMenu(false);
            }
        });
        
        // メニューリンククリックで閉じる
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.toggleMobileMenu(false);
            });
        });
        
        // ESCキーで閉じる
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenuOverlay.classList.contains('active')) {
                this.toggleMobileMenu(false);
            }
        });
        
        console.log('Mobile hamburger menu initialized');
    }
    
    /**
     * モバイルメニューの開閉
     */
    toggleMobileMenu(open) {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
        
        if (open) {
            mobileMenuToggle.classList.add('active');
            mobileMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // スクロール無効化
        } else {
            mobileMenuToggle.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = ''; // スクロール復活
        }
    }
    
    /**
     * 言語切替設定
     */
    setupLanguageSwitcher() {
        // Google Translateとの連携
        window.addEventListener('DOMContentLoaded', () => {
            const observer = new MutationObserver(() => {
                const googleFrame = document.querySelector('.goog-te-banner-frame');
                if (googleFrame) {
                    this.handleLanguageChange();
                }
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }
    
    /**
     * 商品フィルター設定
     */
    setupProductFilter() {
        const categoryButtons = document.querySelectorAll('.category-btn');
        const productCards = document.querySelectorAll('.product-card');
        
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.getAttribute('data-category');
                
                // アクティブボタンの切り替え
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // 商品の表示・非表示
                this.filterProducts(category, productCards);
            });
        });
    }
    
    /**
     * 商品フィルタリング
     */
    filterProducts(category, productCards) {
        productCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
                card.classList.remove('hidden');
                // アニメーション効果
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.transition = 'all 0.3s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '0';
                card.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    card.style.display = 'none';
                    card.classList.add('hidden');
                }, 300);
            }
        });
        
        // グリッドレイアウトの再計算
        setTimeout(() => {
            const productsGrid = document.getElementById('productsGrid');
            if (productsGrid) {
                productsGrid.style.animation = 'none';
                productsGrid.offsetHeight; // リフロー強制
                productsGrid.style.animation = null;
            }
        }, 400);
    }
    
    /**
     * 言語変更処理
     */
    handleLanguageChange() {
        // AIチャットボットに言語変更を通知
        if (window.modernChatbot) {
            const currentLang = this.detectCurrentLanguage();
            window.modernChatbot.setLanguage(currentLang);
        }
    }
    
    /**
     * 現在の言語を検出
     */
    detectCurrentLanguage() {
        const googleTranslateFrame = document.querySelector('.goog-te-banner-frame');
        if (googleTranslateFrame) {
            const frameDoc = googleTranslateFrame.contentDocument;
            if (frameDoc) {
                const selectElement = frameDoc.querySelector('select');
                if (selectElement) {
                    return selectElement.value || 'ja';
                }
            }
        }
        return 'ja';
    }
    
    /**
     * 商品タブ機能設定
     */
    setupProductTabs() {
        // 各商品カード内のタブボタンにイベントリスナーを追加
        document.querySelectorAll('.product-tab-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                const tabName = button.getAttribute('data-tab');
                const productCard = button.closest('.product-card');
                
                if (!productCard || !tabName) return;
                
                // 同じ商品カード内のタブボタンのアクティブ状態を更新
                const tabButtons = productCard.querySelectorAll('.product-tab-btn');
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // 同じ商品カード内のタブコンテンツを更新
                const tabPanes = productCard.querySelectorAll('.tab-pane');
                tabPanes.forEach(pane => {
                    pane.classList.remove('active');
                    if (pane.getAttribute('data-tab') === tabName) {
                        pane.classList.add('active');
                    }
                });
                
                // アニメーション効果
                const activePane = productCard.querySelector(`.tab-pane[data-tab="${tabName}"]`);
                if (activePane) {
                    activePane.style.opacity = '0';
                    activePane.style.transform = 'translateY(10px)';
                    
                    setTimeout(() => {
                        activePane.style.transition = 'all 0.3s ease-in-out';
                        activePane.style.opacity = '1';
                        activePane.style.transform = 'translateY(0)';
                    }, 10);
                }
            });
        });
        
        console.log('Product tabs initialized');
    }
    
    /**
     * 商品詳細展開・収納機能設定
     */
    setupProductDetailsToggle() {
        // 全ての商品詳細を初期状態では非表示にする
        document.querySelectorAll('.product-details-content').forEach(content => {
            content.classList.remove('expanded');
        });
        
        // グローバル関数として定義 - 個別詳細ページへリダイレクト
        window.toggleProductDetails = (productCard) => {
            // 商品名から酒IDにマッピング
            const productNameMappings = {
                '季節限定100種類日本酒セレクション': 'seasonal-selection',
                '唎酒師®ガイド付き体験': 'kikisake-guide',
                'カスタマイズ推薦体験': 'custom-recommendation'
            };
            
            // 商品カードから商品名を取得
            const productTitle = productCard.querySelector('.product-title, h3, .product-name');
            if (!productTitle) {
                console.error('Product title not found in card');
                return;
            }
            
            const productName = productTitle.textContent.trim();
            const sakeId = productNameMappings[productName];
            
            if (sakeId) {
                // 個別詳細ページにリダイレクト
                window.location.href = `sake-detail-template.html?id=${sakeId}`;
            } else {
                console.error('Unknown product name:', productName);
                // フォールバック: 汎用詳細ページに遷移
                window.location.href = 'sake-detail-template.html';
            }
        };
        
        console.log('Product details toggle initialized');
    }
    
    /**
     * AIサポートセクション機能設定
     */
    setupAISupportSection() {
        // AIサポートチャット開始関数
        window.openAISakuraChat = () => {
            console.log('openAISakuraChat called');
            
            // modernChatbot インスタンスを確認
            if (window.modernChatbot) {
                console.log('modernChatbot found, opening chat...');
                window.modernChatbot.openChat();
                
                // セクションからチャットエリアにスムーズスクロール
                setTimeout(() => {
                    const chatInterface = document.getElementById('chatInterface');
                    if (chatInterface) {
                        chatInterface.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'nearest' 
                        });
                    }
                }, 300);
            } else {
                console.error('No chatbot instance found');
                console.log('Available instances:', {
                    modernChatbot: !!window.modernChatbot,
                    aiConfig: !!window.aiConfig
                });
                
                // エラーメッセージを表示
                const errorDiv = document.createElement('div');
                errorDiv.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #ff4444;
                    color: white;
                    padding: 15px 20px;
                    border-radius: 8px;
                    z-index: 10000;
                    font-size: 14px;
                `;
                errorDiv.textContent = 'チャットボットの初期化に失敗しました。ページを再読み込みしてください。';
                document.body.appendChild(errorDiv);
                
                setTimeout(() => errorDiv.remove(), 5000);
            }
        };
        
        // 例示質問関数
        window.askExample = (question) => {
            console.log('askExample called with:', question);
            
            if (window.modernChatbot) {
                // チャットを開く
                window.modernChatbot.openChat();
                
                // 質問を入力欄に設定
                setTimeout(() => {
                    const messageInput = document.getElementById('messageInput');
                    if (messageInput) {
                        messageInput.value = question;
                        messageInput.focus();
                        
                        // 自動送信
                        setTimeout(() => {
                            window.modernChatbot.sendMessage();
                        }, 500);
                    }
                }, 300);
            } else {
                console.error('No chatbot instance found');
            }
        };
        
        console.log('AI Support section initialized');
        
        // フォールバック: ボタンに直接イベントリスナーも追加
        const mainChatButton = document.getElementById('mainChatButton');
        if (mainChatButton) {
            mainChatButton.addEventListener('click', function(e) {
                console.log('Main chat button clicked (event listener)');
                // onclickが動作しない場合のフォールバック
                if (typeof window.openAISakuraChat === 'function') {
                    window.openAISakuraChat();
                } else {
                    console.error('openAISakuraChat function not found');
                }
            });
            console.log('Main chat button event listener added');
        }
    }
    
    /**
     * チャットボタンスクロール追従設定
     */
    setupChatButtonScrollBehavior() {
        const chatButton = document.getElementById('chatButton');
        if (!chatButton) return;
        
        let lastScrollY = window.scrollY;
        let isScrolling = false;
        let ticking = false;
        
        const handleScroll = () => {
            if (ticking) return;
            
            ticking = true;
            requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;
                const windowHeight = window.innerHeight;
                const documentHeight = document.documentElement.scrollHeight;
                const footerHeight = 100; // フッターのチャットボタン用スペース
                
                // フッター付近にいるかチェック
                const isNearFooter = (currentScrollY + windowHeight) >= (documentHeight - footerHeight);
                
                if (isNearFooter) {
                    // フッター付近では少し控えめに表示
                    chatButton.classList.add('hide-on-bottom');
                } else {
                    chatButton.classList.remove('hide-on-bottom');
                }
                
                // スクロール時にチャットボタンを一時的に小さくする（モバイルでのパフォーマンス向上）
                if (!isScrolling && window.innerWidth > 768) { // デスクトップのみ
                    chatButton.style.transform = 'scale(0.9)';
                    isScrolling = true;
                    
                    // スクロール停止時に元のサイズに戻す
                    clearTimeout(this.scrollTimeout);
                    this.scrollTimeout = setTimeout(() => {
                        chatButton.style.transform = '';
                        isScrolling = false;
                    }, 150);
                }
                
                lastScrollY = currentScrollY;
                ticking = false;
            });
        };
        
        // パッシブリスナーでパフォーマンス向上
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        console.log('Chat button scroll behavior initialized');
    }
    
    /**
     * エラーメッセージ表示
     */
    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 15px;
            border-radius: 8px;
            z-index: 10000;
            max-width: 300px;
        `;
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
    
    /**
     * 成功メッセージ表示
     */
    showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #44aa44;
            color: white;
            padding: 15px;
            border-radius: 8px;
            z-index: 10000;
            max-width: 300px;
        `;
        successDiv.textContent = message;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }
    
    /**
     * デバッグ情報取得
     */
    getDebugInfo() {
        return {
            initialized: this.initialized,
            companyName: this.companyData?.company?.name,
            businessType: this.companyData?.businessType,
            productsCount: this.companyData?.products?.length,
            modernChatbotReady: !!window.modernChatbot,
            companyManagerReady: !!window.yodobloomCompanyManager
        };
    }
}

// グローバルアクセス用
window.YodobloomSAKE = YodobloomSAKE;

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    window.yodobloomSAKE = new YodobloomSAKE();
});

// デバッグ用コンソールコマンド
if (typeof console !== 'undefined') {
    window.debugYodobloom = function() {
        if (window.yodobloomSAKE) {
            console.log('yodobloom SAKE Debug Info:', window.yodobloomSAKE.getDebugInfo());
        } else {
            console.log('yodobloom SAKE not initialized');
        }
    };
}