/**
 * AI十四代 - 高木酒造株式会社専用チャットボット
 * GPT API と DeepL API を統合した高度なチャットボット
 */

class AIJuyondaiChatbot {
    constructor() {
        this.isOpen = false;
        this.apiKey = null; // 環境変数またはユーザー設定から取得
        this.deepLApiKey = null; // DeepL API キー
        this.conversationHistory = [];
        this.supportedLanguages = ['ja', 'en', 'ko', 'zh'];
        this.currentLanguage = 'ja';
        this.breweryInfo = null;
        
        this.init();
    }

    async init() {
        await this.loadBreweryConfig();
        this.setupEventListeners();
        this.createChatInterface();
        await this.checkAPIStatus();
        console.log('🍶 AI十四代が起動しました');
    }

    async loadBreweryConfig() {
        try {
            const response = await fetch('./brewery-template-config.json');
            this.breweryInfo = await response.json();
        } catch (error) {
            console.error('設定ファイルの読み込みに失敗:', error);
        }
    }

    createChatInterface() {
        const chatContainer = document.getElementById('chatbotWindow');
        if (!chatContainer) return;

        chatContainer.innerHTML = `
            <div class="ai-sakura-header">
                <div class="ai-sakura-avatar">
                    <img src="ai-juyondai-icon.png" alt="AI十四代" class="juyondai-avatar-img">
                </div>
                <div class="ai-sakura-info">
                    <div class="ai-name-container">
                        <h3>AI十四代</h3>
                        <div class="api-status-indicators">
                            <div class="status-light" id="gptStatus" title="GPT API Status">
                                <span class="status-dot gpt-dot"></span>
                                <span class="status-label">GPT</span>
                            </div>
                            <div class="status-light" id="deeplStatus" title="DeepL API Status">
                                <span class="status-dot deepl-dot"></span>
                                <span class="status-label">DeepL</span>
                            </div>
                        </div>
                    </div>
                    <p class="ai-status" id="aiStatus">高木酒造株式会社のご案内をいたします</p>
                </div>
                <div class="ai-sakura-controls">
                    <button class="chatbot-close" onclick="toggleChatbot()">×</button>
                </div>
            </div>
            
            <div class="ai-sakura-messages" id="aiSakuraMessages">
                <div class="welcome-message">
                    <div class="ai-message">
                        <div class="ai-avatar">
                            <img src="ai-juyondai-icon.png" alt="AI十四代" class="juyondai-mini-avatar">
                        </div>
                        <div class="ai-text">
                            <p>こんにちは！AI十四代です🍶</p>
                            <p>元和元年（1615年）創業の高木酒造株式会社について、何でもお聞きください。</p>
                            <div class="ai-features">
                                <span class="feature-badge">🤖 GPT搭載</span>
                                <span class="feature-badge">🌐 多言語対応</span>
                                <span class="feature-badge">🍶 十四代専門知識</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="ai-sakura-quick-actions">
                <div class="quick-actions-grid">
                    <button class="quick-action-btn" onclick="aiJuyondai.sendQuickMessage('十四代について教えて')">
                        🍶 十四代について
                    </button>
                    <button class="quick-action-btn" onclick="aiJuyondai.sendQuickMessage('商品ラインナップを見せて')">
                        📋 商品一覧
                    </button>
                    <button class="quick-action-btn" onclick="aiJuyondai.sendQuickMessage('歴史について詳しく')">
                        📚 酒造の歴史
                    </button>
                </div>
            </div>

            <div class="ai-sakura-input-area">
                <div class="input-container">
                    <input type="text" 
                           id="aiSakuraInput" 
                           placeholder="メッセージを入力..." 
                           onkeypress="aiJuyondai.handleKeyPress(event)"
                           autocomplete="off">
                    <button class="voice-btn" onclick="aiJuyondai.toggleVoiceInput()" title="音声入力">🎤</button>
                    <button class="send-btn" onclick="aiJuyondai.sendMessage()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/>
                        </svg>
                    </button>
                </div>
                <div class="input-status" id="inputStatus"></div>
            </div>
        `;

        this.setupLanguageSelector();
    }

    setupEventListeners() {
        // チャットボット表示/非表示の制御
        window.toggleChatbot = () => {
            const chatWindow = document.getElementById('chatbotWindow');
            const button = document.querySelector('.chatbot-button');
            
            if (this.isOpen) {
                chatWindow.style.display = 'none';
                button.innerHTML = '<img src="ai-sakura-icon.png" alt="AIサクラ" class="chatbot-avatar-btn">';
                this.isOpen = false;
            } else {
                chatWindow.style.display = 'flex';
                button.innerHTML = '×';
                this.isOpen = true;
                this.focusInput();
            }
        };
    }

    setupLanguageSelector() {
        // 言語選択機能を削除（Google翻訳を使用するため）
    }

    async updateInterfaceLanguage() {
        const messages = {
            'ja': {
                placeholder: 'メッセージを入力...',
                welcome: 'こんにちは！AIサクラです🌸\n\n安政元年（1854年）創業の吉源酒造場について、何でもお聞きください。',
                status: '吉源酒造場のご案内をいたします'
            },
            'en': {
                placeholder: 'Type your message...',
                welcome: 'Hello! I\'m AI Juyondai 🍶\n\nPlease ask me anything about Takagi Sake Brewery, founded in 1615.',
                status: 'Here to help with Takagi Sake Brewery'
            },
            'ko': {
                placeholder: '메시지를 입력하세요...',
                welcome: '안녕하세요! AI 주요다이입니다 🍶\n\n1615년 창업한 다카기 양조장에 대해 무엇이든 물어보세요.',
                status: '다카기 양조장을 안내해 드립니다'
            },
            'zh': {
                placeholder: '请输入消息...',
                welcome: '您好！我是AI十四代 🍶\n\n请随时询问关于创立于1615年的高木酒造股份有限公司的任何问题。',
                status: '为您介绍高木酒造股份有限公司'
            }
        };

        const currentMessages = messages[this.currentLanguage] || messages['ja'];
        
        document.getElementById('aiSakuraInput').placeholder = currentMessages.placeholder;
        document.getElementById('aiStatus').textContent = currentMessages.status;
    }

    async sendMessage() {
        const input = document.getElementById('aiSakuraInput');
        const message = input.value.trim();
        
        if (!message) return;

        this.addMessage('user', message);
        input.value = '';
        this.showTypingIndicator();

        try {
            const response = await this.getAIResponse(message);
            this.hideTypingIndicator();
            this.addMessage('ai', response);
            
            // メッセージ送信後にAPI状態を再チェック
            setTimeout(() => this.checkAPIStatus(), 1000);
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessage('ai', this.getErrorMessage());
            console.error('AI応答エラー:', error);
            
            // エラー後もAPI状態を再チェック
            setTimeout(() => this.checkAPIStatus(), 1000);
        }
    }

    async sendQuickMessage(message) {
        document.getElementById('aiSakuraInput').value = message;
        await this.sendMessage();
    }

    async getAIResponse(userMessage) {
        try {
            // Netlify Functions APIエンドポイントを使用
            const response = await fetch('/.netlify/functions/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: userMessage,
                    useOpenAI: true // GPT APIを使用
                })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            let aiResponse = data.response || 'すみません、回答を生成できませんでした。';

            // 必要に応じて回答を翻訳
            if (this.currentLanguage !== 'ja') {
                aiResponse = await this.translateFromJapanese(aiResponse, this.currentLanguage);
            }
            
            return aiResponse;

        } catch (error) {
            console.error('AI API エラー:', error);
            // フォールバック応答
            return this.getLocalResponse(userMessage);
        }
    }

    buildSystemPrompt() {
        const breweryName = this.breweryInfo?.brewery?.name || '高木酒造株式会社';
        const products = this.breweryInfo?.products || [];
        
        return `あなたは「${breweryName}」の専門AIアシスタント「AI十四代」です。

【重要な制限事項】
- あなたは日本酒の知識と高木酒造株式会社の情報のみを専門とします
- 日本酒や酒造り以外の一般的な質問には「申し訳ございませんが、私は日本酒と高木酒造株式会社についてのみお答えできます」と回答してください
- 政治、経済、科学、技術、医療、その他の分野の質問には一切答えません
- 高木酒造株式会社以外の他の酒造場についても詳しい情報は提供しません

【基本情報】
- 創業: 元和元年（1615年）
- 所在地: 山形県村山市富並1826
- 電話: 0237-57-2131
- 代表銘柄: 十四代（じゅうよんだい）
- 蔵元: 高木顕統（たかぎあきのり）

【十四代シリーズ商品】
- 十四代 本丸: 手頃な価格で高品質な定番吟醸酒
- 十四代 吟撰: バランスの取れた味わいの吟醸酒
- 十四代 龍泉: SAKE COMPETITION 2019 Super Premium 1位受賞
- 十四代 極上諸白: 精米歩合23%の最高級純米大吟醸
- 十四代 EXTRA: 雪女神使用のバランス良い純米大吟醸
- 十四代 七垂二十貫: 袋吊りで搾られた究極の限定品
- 十四代 大極上生: フレッシュで爽やかな生酒
- 十四代 中取り純米吟醸 播州山田錦: 中取りの純粋な味わい
- 十四代 中取り純米吟醸 播州愛山: 愛山使用の優雅な味わい
- 十四代 龍の落とし子: 特A地区山田錦使用の大吟醸
- 十四代 槽垂れ本生: 自然に滴り落ちる雫を集めた生原酒
- 十四代 鑑評会出品酒: コンテスト向けの最高級品

【歴史】
- 元和元年（1615年）創業、400年以上の歴史
- 高木家が代々継承する老舗酒造
- 現当主・高木顕統氏による革新的な酒造り
- 「十四代」ブランドで日本酒業界に革命を起こした
- 品質重視の少量生産による希少価値の高い日本酒

【特徴・哲学】
- 「聞こえないものを聞き、見えないものを見る」という理念
- 最高品質の原料米（山田錦、愛山、雪女神など）使用
- 伝統的な手法と革新的な技術の融合
- 徹底した品質管理による安定した品質
- 限定生産による希少性

【日本酒の基本知識】
- 日本酒の種類（純米酒、本醸造酒、吟醸酒、大吟醸酒など）
- 酒造りの工程（米洗い、蒸米、麹作り、仕込み、発酵など）
- 日本酒の味わい表現（甘口、辛口、芳醇、淡麗など）
- 適切な飲み方、保存方法、温度管理

【対応方針】
1. 丁寧で親しみやすく、品格のある口調
2. 日本酒と高木酒造株式会社の専門知識のみ活用
3. 専門外の質問は丁重にお断りする
4. 確認できない情報は推測せず正直に伝える
5. 絵文字を適度に使用（🍶🌸📍✨など）

日本酒と高木酒造株式会社に関する質問にのみ、親切で専門的な回答をしてください。`;
    }

    async callGPTAPI(systemPrompt, userMessage) {
        try {
            // Netlify Functions経由でOpenAI APIを呼び出し
            const response = await fetch('/.netlify/functions/openai-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: userMessage,
                    systemPrompt: systemPrompt
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                const aiResponse = data.message;
                
                // 会話履歴を更新
                this.conversationHistory.push(
                    { role: 'user', content: userMessage },
                    { role: 'assistant', content: aiResponse }
                );
                
                // 履歴が長くなりすぎた場合は古いものを削除
                if (this.conversationHistory.length > 10) {
                    this.conversationHistory = this.conversationHistory.slice(-10);
                }

                return aiResponse;
            } else {
                throw new Error(data.error || 'API response error');
            }
        } catch (error) {
            console.error('GPT API Error:', error);
            return this.getFallbackResponse(userMessage);
        }
    }

    async detectLanguage(text) {
        // 簡易言語検出（実際はより高度な検出を実装）
        if (/[ひらがなカタカナ漢字]/.test(text)) return 'ja';
        if (/[한글]/.test(text)) return 'ko';
        if (/[一-龯]/.test(text)) return 'zh';
        return 'en';
    }

    async translateToJapanese(text) {
        return await this.translate(text, 'ja');
    }

    async translateFromJapanese(text, targetLang) {
        return await this.translate(text, targetLang);
    }

    async translate(text, targetLang) {
        try {
            // Netlify Functions経由でDeepL APIを呼び出し
            const response = await fetch('/.netlify/functions/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: text,
                    targetLang: targetLang
                })
            });

            if (!response.ok) {
                throw new Error(`Translation API error: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                return data.translatedText;
            } else {
                throw new Error(data.error || 'Translation failed');
            }
        } catch (error) {
            console.error('翻訳エラー:', error);
            return text; // 翻訳に失敗した場合は元のテキストを返す
        }
    }

    getFallbackResponse(message) {
        const responses = {
            '十四代': '当蔵の代表銘柄「十四代」は、本丸、吟撰、龍泉、極上諸白など多くの種類をご用意しております。🍶',
            '本丸': '十四代 本丸は手頃な価格で高品質な十四代を代表する定番吟醸酒です。五百万石を使用しています。🍶',
            '龍泉': '十四代 龍泉はSAKE COMPETITION 2019 Super Premium 1位を受賞した最高峰の純米大吟醸です。🏆',
            '極上諸白': '十四代 極上諸白は精米歩合23%まで磨き上げた最高級の純米大吟醸で、繊細な白桃とメロンの香りが特徴です。✨',
            '歴史': '元和元年（1615年）創業、400年以上の歴史を持つ老舗酒造です。現当主・高木顕統氏により革新的な酒造りが行われています。📚',
            'アクセス': '山形県村山市富並1826にございます。お電話は0237-57-2131です。📍',
            '営業': '詳しい営業時間については、お電話（0237-57-2131）でお問い合わせください。🕐'
        };

        for (const [key, response] of Object.entries(responses)) {
            if (message.includes(key)) {
                return response;
            }
        }

        return '申し訳ございません。詳しくはお電話（0237-57-2131）でお問い合わせください。🙏';
    }

    getErrorMessage() {
        const messages = {
            'ja': '申し訳ございません。一時的にAIサービスが利用できません。しばらく後にお試しください。🙏',
            'en': 'Sorry, AI service is temporarily unavailable. Please try again later. 🙏',
            'ko': '죄송합니다. AI 서비스를 일시적으로 사용할 수 없습니다. 나중에 다시 시도해 주세요. 🙏',
            'zh': '抱歉，AI服务暂时不可用。请稍后再试。🙏'
        };
        return messages[this.currentLanguage] || messages['ja'];
    }

    addMessage(sender, text) {
        const messagesContainer = document.getElementById('aiSakuraMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;
        
        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="user-message-content">
                    <div class="user-text">${this.escapeHtml(text)}</div>
                    <div class="user-avatar">👤</div>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="ai-message">
                    <div class="ai-avatar">
                        <img src="ai-juyondai-icon.png" alt="AI十四代" class="juyondai-mini-avatar">
                    </div>
                    <div class="ai-text">${this.formatAIResponse(text)}</div>
                </div>
            `;
        }
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // メッセージにアニメーション効果を追加
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        setTimeout(() => {
            messageDiv.style.transition = 'all 0.3s ease';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 10);
    }

    formatAIResponse(text) {
        // 改行を<br>に変換
        let formatted = text.replace(/\n/g, '<br>');
        
        // URLを自動リンク化
        formatted = formatted.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
        
        return this.escapeHtml(formatted);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('aiSakuraMessages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="ai-message">
                <div class="ai-avatar">
                    <img src="ai-juyondai-icon.png" alt="AI十四代" class="juyondai-mini-avatar">
                </div>
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }

    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.sendMessage();
        }
    }

    focusInput() {
        setTimeout(() => {
            const input = document.getElementById('aiSakuraInput');
            if (input) input.focus();
        }, 100);
    }

    toggleVoiceInput() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            this.startVoiceRecognition();
        } else {
            alert('音声認識がサポートされていません。');
        }
    }

    startVoiceRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = this.currentLanguage === 'ja' ? 'ja-JP' : 
                         this.currentLanguage === 'en' ? 'en-US' :
                         this.currentLanguage === 'ko' ? 'ko-KR' : 'zh-CN';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            document.getElementById('inputStatus').textContent = '🎤 音声入力中...';
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            document.getElementById('aiSakuraInput').value = transcript;
            document.getElementById('inputStatus').textContent = '';
        };

        recognition.onerror = () => {
            document.getElementById('inputStatus').textContent = '音声認識エラー';
        };

        recognition.onend = () => {
            document.getElementById('inputStatus').textContent = '';
        };

        recognition.start();
    }

    // APIキー設定メソッド（管理者用）
    setAPIKeys(openaiKey, deepLKey) {
        this.apiKey = openaiKey;
        this.deepLApiKey = deepLKey;
        localStorage.setItem('aiJuyondai_openai_key', openaiKey);
        localStorage.setItem('aiJuyondai_deepl_key', deepLKey);
    }

    // 保存されたAPIキーを読み込み
    loadAPIKeys() {
        this.apiKey = localStorage.getItem('aiJuyondai_openai_key');
        this.deepLApiKey = localStorage.getItem('aiJuyondai_deepl_key');
    }

    // API接続状態をチェック
    async checkAPIStatus() {
        console.log('Checking API status...');
        
        // GPT API接続テスト
        const gptStatus = await this.testGPTConnection();
        this.updateStatusLight('gpt', gptStatus);
        
        // DeepL API接続テスト
        const deeplStatus = await this.testDeepLConnection();
        this.updateStatusLight('deepl', deeplStatus);
        
        // 全体ステータス更新
        const overallStatus = gptStatus && deeplStatus ? 'フル機能利用可能' : 
                             gptStatus ? 'GPT機能のみ利用可能' :
                             deeplStatus ? 'DeepL翻訳のみ利用可能' : 
                             'API接続エラー - 基本機能のみ';
        
        document.getElementById('aiStatus').textContent = overallStatus;
    }

    // GPT API接続テスト
    async testGPTConnection() {
        try {
            const response = await fetch('/.netlify/functions/openai-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: 'test',
                    systemPrompt: 'You are a test assistant. Respond with just "OK".'
                })
            });

            const data = await response.json();
            console.log('GPT API test result:', data.success);
            return data.success === true;
        } catch (error) {
            console.error('GPT API test failed:', error);
            return false;
        }
    }

    // DeepL API接続テスト
    async testDeepLConnection() {
        try {
            const response = await fetch('/.netlify/functions/deepl-translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: 'test',
                    targetLanguage: 'en',
                    sourceLanguage: 'ja'
                })
            });

            const data = await response.json();
            console.log('DeepL API test result:', data.success);
            return data.success === true;
        } catch (error) {
            console.error('DeepL API test failed:', error);
            return false;
        }
    }

    // ステータスライト更新
    updateStatusLight(apiType, isConnected) {
        const statusElement = document.getElementById(`${apiType}Status`);
        const dotElement = statusElement.querySelector('.status-dot');
        
        if (isConnected) {
            dotElement.classList.remove('disconnected');
            dotElement.classList.add('connected');
        } else {
            dotElement.classList.remove('connected');
            dotElement.classList.add('disconnected');
        }
        
        // ツールチップ更新
        const statusText = isConnected ? 'Connected' : 'Disconnected';
        statusElement.title = `${apiType.toUpperCase()} API: ${statusText}`;
    }
}

// グローバルインスタンスを作成
window.aiJuyondai = new AIJuyondaiChatbot();

// ページ読み込み完了後に初期化
document.addEventListener('DOMContentLoaded', () => {
    window.aiJuyondai.loadAPIKeys();
    
    // 定期的にAPI状態をチェック（5分間隔）
    setInterval(() => {
        if (window.aiJuyondai) {
            window.aiJuyondai.checkAPIStatus();
        }
    }, 300000); // 5分 = 300,000ms
});