/**
 * 🍶 高木酒造株式会社 - プレミアムモバイル体験
 * 最高レベルのスマホUI/UX機能
 */

class MobilePremiumExperience {
    constructor() {
        this.isTouch = 'ontouchstart' in window;
        this.iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        this.Android = /Android/.test(navigator.userAgent);
        this.isMenuOpen = false;
        
        this.init();
    }

    init() {
        if (window.innerWidth <= 768) {
            this.setupMobileNavigation();
            this.setupTouchOptimizations();
            this.setupScrollOptimizations();
            this.setupGestureHandling();
            this.setupPerformanceOptimizations();
            this.setupAccessibility();
            
            console.log('🍶 プレミアムモバイル体験が起動しました');
        }
    }

    // ===== モバイルナビゲーション =====
    setupMobileNavigation() {
        // オーバーレイ要素を追加
        const overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        overlay.onclick = () => this.closeMobileMenu();
        document.body.appendChild(overlay);

        // メニューボタンの設定
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const nav = document.querySelector('.nav');
        
        if (menuBtn && nav) {
            menuBtn.onclick = (e) => {
                e.preventDefault();
                this.toggleMobileMenu();
            };

            // スワイプでメニューを閉じる
            let startX = 0;
            nav.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            }, { passive: true });

            nav.addEventListener('touchmove', (e) => {
                const currentX = e.touches[0].clientX;
                const diffX = startX - currentX;
                
                if (diffX > 50 && this.isMenuOpen) {
                    this.closeMobileMenu();
                }
            }, { passive: true });
        }

        // メニューリンククリック時の処理
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
                
                // スムーススクロール
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    setTimeout(() => {
                        const target = document.querySelector(href);
                        if (target) {
                            const headerHeight = 70;
                            const targetPosition = target.offsetTop - headerHeight;
                            
                            window.scrollTo({
                                top: targetPosition,
                                behavior: 'smooth'
                            });
                        }
                    }, 300);
                }
            });
        });
    }

    toggleMobileMenu() {
        const nav = document.querySelector('.nav');
        const overlay = document.querySelector('.nav-overlay');
        const body = document.body;

        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            nav.classList.add('active');
            overlay.classList.add('active');
            body.style.overflow = 'hidden';
            this.isMenuOpen = true;
            
            // メニューオープン時のハプティックフィードバック（iOS）
            if (this.iOS && navigator.vibrate) {
                navigator.vibrate(10);
            }
        }
    }

    closeMobileMenu() {
        const nav = document.querySelector('.nav');
        const overlay = document.querySelector('.nav-overlay');
        const body = document.body;

        nav.classList.remove('active');
        overlay.classList.remove('active');
        body.style.overflow = '';
        this.isMenuOpen = false;
    }

    // ===== タッチ最適化 =====
    setupTouchOptimizations() {
        // タッチ可能な要素にリップル効果
        const touchElements = document.querySelectorAll(
            '.product-card, .btn, .btn-outline, .nav-link, .chatbot-button'
        );

        touchElements.forEach(element => {
            this.addRippleEffect(element);
        });

        // iOS Safari のバウンススクロール対策
        if (this.iOS) {
            document.addEventListener('touchmove', (e) => {
                if (e.scale !== 1) {
                    e.preventDefault();
                }
            }, { passive: false });
        }

        // ダブルタップズーム防止
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }

    addRippleEffect(element) {
        element.addEventListener('touchstart', (e) => {
            const ripple = document.createElement('span');
            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.touches[0].clientX - rect.left - size / 2;
            const y = e.touches[0].clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(212, 175, 55, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                z-index: 1;
            `;

            // rippleアニメーションのCSS
            if (!document.querySelector('#ripple-styles')) {
                const style = document.createElement('style');
                style.id = 'ripple-styles';
                style.textContent = `
                    @keyframes ripple {
                        to {
                            transform: scale(2);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }

            element.style.position = element.style.position || 'relative';
            element.style.overflow = 'hidden';
            element.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        }, { passive: true });
    }

    // ===== スクロール最適化 =====
    setupScrollOptimizations() {
        let ticking = false;
        let lastScrollTop = 0;
        const header = document.querySelector('.header');

        const updateHeader = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // ヘッダーの自動非表示/表示
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // 下スクロール - ヘッダーを隠す
                header.style.transform = 'translateY(-100%)';
            } else {
                // 上スクロール - ヘッダーを表示
                header.style.transform = 'translateY(0)';
            }

            // スクロール時の背景透明度調整
            const opacity = Math.min(scrollTop / 100, 1);
            header.style.backgroundColor = `rgba(255, 255, 255, ${0.95 + opacity * 0.05})`;

            lastScrollTop = scrollTop;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }, { passive: true });

        // スクロール位置復元
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
    }

    // ===== ジェスチャー処理 =====
    setupGestureHandling() {
        let startY = 0;
        let startX = 0;
        
        // Pull-to-refresh 防止
        document.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            startX = e.touches[0].clientX;
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            const currentY = e.touches[0].clientY;
            const currentX = e.touches[0].clientX;
            const diffY = currentY - startY;
            const diffX = currentX - startX;

            // 上部での下向きスワイプを制限
            if (window.scrollY === 0 && diffY > 0) {
                e.preventDefault();
            }

            // 横スワイプでメニュー操作
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 50 && !this.isMenuOpen) {
                    // 右スワイプでメニューオープン
                    this.toggleMobileMenu();
                } else if (diffX < -50 && this.isMenuOpen) {
                    // 左スワイプでメニュークローズ
                    this.closeMobileMenu();
                }
            }
        }, { passive: false });
    }

    // ===== パフォーマンス最適化 =====
    setupPerformanceOptimizations() {
        // Intersection Observer で遅延アニメーション
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // アニメーション対象要素を監視
        document.querySelectorAll('.product-card, .section').forEach(el => {
            observer.observe(el);
        });

        // 画像遅延読み込み
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('loading');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }

        // リソースヒント追加
        const preloadLinks = [
            { rel: 'preload', href: '/css/mobile-premium.css', as: 'style' },
            { rel: 'preload', href: '/js/ai-juyondai-chatbot.js', as: 'script' }
        ];

        preloadLinks.forEach(link => {
            const linkEl = document.createElement('link');
            Object.keys(link).forEach(key => {
                linkEl.setAttribute(key, link[key]);
            });
            document.head.appendChild(linkEl);
        });
    }

    // ===== アクセシビリティ =====
    setupAccessibility() {
        // キーボードナビゲーション
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });

        // フォーカス管理
        const focusableElements = document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.style.outline = '2px solid var(--accent-color)';
                element.style.outlineOffset = '2px';
            });

            element.addEventListener('blur', () => {
                element.style.outline = '';
                element.style.outlineOffset = '';
            });
        });

        // 音声読み上げ対応
        document.documentElement.setAttribute('lang', 'ja');
        
        // ARIA属性追加
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const nav = document.querySelector('.nav');
        
        if (menuBtn && nav) {
            menuBtn.setAttribute('aria-label', 'メニューを開く');
            menuBtn.setAttribute('aria-expanded', 'false');
            nav.setAttribute('role', 'navigation');
            nav.setAttribute('aria-label', 'メインナビゲーション');
        }
    }

    // ===== 動的メニュー更新 =====
    updateMenuState(isOpen) {
        const menuBtn = document.querySelector('.mobile-menu-btn');
        if (menuBtn) {
            menuBtn.setAttribute('aria-expanded', isOpen.toString());
            menuBtn.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
        }
    }

    // ===== 公開メソッド =====
    refreshMobileExperience() {
        // 設定を再初期化
        this.init();
    }

    destroy() {
        // イベントリスナーの削除
        const overlay = document.querySelector('.nav-overlay');
        if (overlay) {
            overlay.remove();
        }
        
        document.body.style.overflow = '';
        this.isMenuOpen = false;
    }
}

// ===== 初期化 =====
let mobilePremium = null;

document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth <= 768) {
        mobilePremium = new MobilePremiumExperience();
    }
});

// リサイズ時の再初期化
window.addEventListener('resize', debounce(() => {
    if (window.innerWidth <= 768 && !mobilePremium) {
        mobilePremium = new MobilePremiumExperience();
    } else if (window.innerWidth > 768 && mobilePremium) {
        mobilePremium.destroy();
        mobilePremium = null;
    }
}, 250));

// ユーティリティ関数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// グローバル関数（既存コードとの互換性）
window.toggleMobileMenu = () => {
    if (mobilePremium) {
        mobilePremium.toggleMobileMenu();
    }
};

// パフォーマンス監視
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log(`🍶 ページ読み込み時間: ${Math.round(perfData.loadEventEnd - perfData.loadEventStart)}ms`);
        }, 0);
    });
}