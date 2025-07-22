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
    const { text, targetLang } = JSON.parse(event.body);
    
    if (!text || !targetLang) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'テキストと対象言語が必要です' })
      };
    }

    let translatedText;

    if (process.env.DEEPL_API_KEY) {
      // DeepL API使用
      const deeplResponse = await fetch('https://api-free.deepl.com/v2/translate', {
        method: 'POST',
        headers: {
          'Authorization': `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          text: text,
          target_lang: targetLang.toUpperCase(),
          source_lang: 'JA'
        })
      });

      if (!deeplResponse.ok) {
        throw new Error('DeepL API request failed');
      }

      const deeplData = await deeplResponse.json();
      translatedText = deeplData.translations[0]?.text || text;

    } else {
      // フォールバック翻訳（基本的な単語のみ）
      const fallbackTranslations = {
        'en': {
          '高木酒造株式会社': 'Takagi Shuzo Co., Ltd.',
          '十四代': 'Juyondai',
          '純米大吟醸': 'Junmai Daiginjo',
          '純米吟醸': 'Junmai Ginjo',
          '吟醸': 'Ginjo',
          '山形県': 'Yamagata Prefecture',
          '村山市': 'Murayama City',
          '詳細を見る': 'View Details',
          '商品紹介': 'Products',
          '蔵元について': 'About Brewery',
          '受賞歴': 'Awards',
          '歴史': 'History',
          'アクセス': 'Access'
        },
        'ko': {
          '高木酒造株式会社': '다카기 주조 주식회사',
          '十四代': '주욘다이',
          '純米大吟醸': '준마이 다이긴조',
          '純米吟醸': '준마이 긴조',
          '吟醸': '긴조',
          '山形県': '야마가타현',
          '村山市': '무라야마시',
          '詳細を見る': '자세히 보기',
          '商品紹介': '제품 소개',
          '蔵元について': '양조장 소개',
          '受賞歴': '수상 경력',
          '歴史': '역사',
          'アクセス': '오시는 길'
        },
        'zh': {
          '高木酒造株式会社': '高木酒造株式会社',
          '十四代': '十四代',
          '純米大吟醸': '纯米大吟酿',
          '純米吟醸': '纯米吟酿',
          '吟醸': '吟酿',
          '山形県': '山形县',
          '村山市': '村山市',
          '詳細を見る': '查看详情',
          '商品紹介': '产品介绍',
          '蔵元について': '关于酒造',
          '受賞歴': '获奖历史',
          '歴史': '历史',
          'アクセス': '交通'
        }
      };

      const langDict = fallbackTranslations[targetLang.toLowerCase()] || {};
      translatedText = langDict[text] || text;
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        translatedText,
        originalText: text,
        targetLanguage: targetLang,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Translation error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: '翻訳サービスが一時的にご利用いただけません。',
        originalText: JSON.parse(event.body).text
      })
    };
  }
};