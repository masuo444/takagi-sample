const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { text, targetLanguage, sourceLanguage } = JSON.parse(event.body);
    
    if (!text || !targetLanguage) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'テキストと対象言語が必要です' })
      };
    }

    // APIキーの確認
    if (!process.env.DEEPL_API_KEY) {
      return {
        statusCode: 503,
        headers,
        body: JSON.stringify({ 
          success: false,
          error: 'DeepL API key not configured',
          originalText: text
        })
      };
    }

    // 言語コードマッピング
    const langMapping = {
      'en': 'EN',
      'ko': 'KO', 
      'zh': 'ZH',
      'ja': 'JA'
    };

    const targetLang = langMapping[targetLanguage.toLowerCase()] || targetLanguage.toUpperCase();
    const sourceLang = sourceLanguage ? langMapping[sourceLanguage.toLowerCase()] || sourceLanguage.toUpperCase() : 'JA';

    // DeepL API呼び出し
    const deeplResponse = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        text: text,
        target_lang: targetLang,
        source_lang: sourceLang
      })
    });

    if (!deeplResponse.ok) {
      const errorData = await deeplResponse.json().catch(() => ({}));
      console.error('DeepL API Error:', errorData);
      
      return {
        statusCode: deeplResponse.status,
        headers,
        body: JSON.stringify({ 
          success: false,
          error: 'DeepL API request failed',
          details: errorData.message || 'Unknown error',
          originalText: text
        })
      };
    }

    const deeplData = await deeplResponse.json();
    const translatedText = deeplData.translations[0]?.text || text;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        translatedText,
        originalText: text,
        targetLanguage: targetLanguage,
        sourceLanguage: sourceLang,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('DeepL Translation error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false,
        error: '翻訳サービスが一時的にご利用いただけません。',
        originalText: JSON.parse(event.body).text || '',
        details: error.message
      })
    };
  }
};