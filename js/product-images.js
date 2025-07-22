// 商品画像SVGジェネレーター
const ProductImages = {
    // 基本的なボトルSVGテンプレート
    createBottleSVG: function(label, sublabel, color = '#d4af37') {
        return `
            <svg width="200" height="300" viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">
                <!-- ボトルの影 -->
                <ellipse cx="100" cy="295" rx="40" ry="5" fill="rgba(0,0,0,0.2)"/>
                
                <!-- ボトル本体 -->
                <defs>
                    <linearGradient id="bottleGradient_${label}" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.2" />
                        <stop offset="30%" style="stop-color:#ffffff;stop-opacity:0.1" />
                        <stop offset="50%" style="stop-color:${color};stop-opacity:1" />
                        <stop offset="70%" style="stop-color:#b8941f;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#8b6914;stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="bottleShine_${label}" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.6" />
                        <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0" />
                    </linearGradient>
                </defs>
                
                <!-- ボトルの首 -->
                <rect x="85" y="30" width="30" height="40" rx="5" fill="url(#bottleGradient_${label})"/>
                
                <!-- ボトルのキャップ -->
                <rect x="80" y="20" width="40" height="15" rx="3" fill="#2a1810"/>
                <rect x="82" y="22" width="36" height="2" fill="rgba(255,255,255,0.3)"/>
                
                <!-- ボトルの肩 -->
                <path d="M 85 70 Q 85 80, 70 90 L 70 260 Q 70 280, 100 280 Q 130 280, 130 260 L 130 90 Q 115 80, 115 70 Z" 
                      fill="url(#bottleGradient_${label})" />
                
                <!-- ガラスの光沢 -->
                <ellipse cx="85" cy="120" rx="15" ry="40" fill="url(#bottleShine_${label})" opacity="0.5"/>
                
                <!-- ラベル背景 -->
                <rect x="75" y="130" width="50" height="80" rx="3" fill="#f8f6f0" opacity="0.95"/>
                <rect x="75" y="130" width="50" height="80" rx="3" fill="none" stroke="${color}" stroke-width="2"/>
                
                <!-- ラベルテキスト -->
                <text x="100" y="160" font-family="Noto Serif JP, serif" font-size="20" font-weight="700" 
                      text-anchor="middle" fill="#2a1810">十四代</text>
                <text x="100" y="185" font-family="Noto Sans JP, sans-serif" font-size="12" 
                      text-anchor="middle" fill="#3d2518">${sublabel}</text>
                
                <!-- 金箔装飾 -->
                <circle cx="100" cy="200" r="8" fill="none" stroke="${color}" stroke-width="1" opacity="0.7"/>
                <circle cx="100" cy="200" r="5" fill="${color}" opacity="0.5"/>
            </svg>
        `;
    },

    // 各商品に対応するSVGを生成
    generateProductImages: function() {
        const products = [
            { id: 'kanpyoukai', label: '鑑評会出品酒', color: '#d4af37' },
            { id: 'ginsen', label: '吟撰', color: '#c9a026' },
            { id: 'gokujo-morohaku', label: '極上諸白', color: '#f4d03f' },
            { id: 'honmaru', label: '本丸', color: '#b8941f' },
            { id: 'ryusen', label: '龍泉', color: '#ffd700' },
            { id: 'extra', label: 'EXTRA', color: '#e6c84f' },
            { id: 'nanatare-nijukkan', label: '七垂二十貫', color: '#fff8dc' },
            { id: 'daikiwami-nama', label: '大極上生', color: '#87ceeb' },
            { id: 'nakadori-yamadanishiki', label: '山田錦', color: '#daa520' },
            { id: 'nakadori-aizan', label: '愛山', color: '#ff69b4' },
            { id: 'ryu-no-otoshigo', label: '龍の落とし子', color: '#4169e1' },
            { id: 'funetare-honnamazake', label: '槽垂れ本生', color: '#98fb98' }
        ];

        return products.reduce((acc, product) => {
            acc[product.id] = this.createBottleSVG(product.label, product.label, product.color);
            return acc;
        }, {});
    },

    // 商品画像を挿入
    insertProductImages: function() {
        const productImages = this.generateProductImages();
        
        // 各商品カードの画像プレースホルダーを検索してSVGに置き換え
        document.querySelectorAll('.product-placeholder').forEach(placeholder => {
            const productName = placeholder.textContent.trim();
            let productId = '';
            
            // 商品名からIDを判定
            switch(productName) {
                case '鑑評会出品酒': productId = 'kanpyoukai'; break;
                case '吟撰': productId = 'ginsen'; break;
                case '極上諸白': productId = 'gokujo-morohaku'; break;
                case '本丸': productId = 'honmaru'; break;
                case '龍泉': productId = 'ryusen'; break;
                case 'EXTRA': productId = 'extra'; break;
                case '七垂二十貫': productId = 'nanatare-nijukkan'; break;
                case '大極上生': productId = 'daikiwami-nama'; break;
                case '中取り': productId = 'nakadori-yamadanishiki'; break;
                case '中取り愛山': productId = 'nakadori-aizan'; break;
                case '龍の落とし子': productId = 'ryu-no-otoshigo'; break;
                case '槽垂れ本生': productId = 'funetare-honnamazake'; break;
            }
            
            if (productId && productImages[productId]) {
                const imageContainer = placeholder.parentElement;
                imageContainer.innerHTML = productImages[productId];
                imageContainer.classList.add('product-svg-container');
            }
        });
    }
};

// ページ読み込み完了後に商品画像を挿入
document.addEventListener('DOMContentLoaded', function() {
    ProductImages.insertProductImages();
});

// バックアップとして、ウィンドウロード後も実行
window.addEventListener('load', function() {
    setTimeout(() => {
        ProductImages.insertProductImages();
    }, 100);
});

// 追加のバックアップ - インタラクティブ状態で実行
if (document.readyState !== 'loading') {
    ProductImages.insertProductImages();
}