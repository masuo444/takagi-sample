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
    const { message, useOpenAI } = JSON.parse(event.body);
    
    if (!message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'メッセージが必要です' })
      };
    }

    let response;

    if (useOpenAI && process.env.OPENAI_API_KEY) {
      // OpenAI API使用
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `あなたは「高木酒造株式会社」の専門AIアシスタント「AI十四代」です。

【基本情報】
- 創業: 元和元年（1615年）
- 所在地: 山形県村山市富並1826
- 電話: 0237-57-2131
- 代表銘柄: 十四代（じゅうよんだい）
- 蔵元: 高木顕統（たかぎあきのり）

【特徴】
- 「聞こえないものを聞き、見えないものを見る」という哲学
- 出羽三山の清らかな水使用
- 山田錦、愛山、雪女神などの最高級酒米使用
- 袋吊り、中取り、槽垂れなどの伝統技法
- SAKE COMPETITION 2019 Super Premium 1位受賞（龍泉）

【主要商品】
- 鑑評会出品酒（純米大吟醸）
- 龍泉（純米大吟醸、SAKE COMPETITION 2019受賞）
- 七垂二十貫（純米大吟醸、袋吊り）
- 本丸（吟醸、定番酒）
- EXTRA（純米大吟醸、雪女神使用）
- 龍の落とし子（純米大吟醸、オリジナル酒米）

丁寧で専門的、かつ親しみやすい口調で、十四代と高木酒造について詳しく案内してください。`
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!openaiResponse.ok) {
        throw new Error('OpenAI API request failed');
      }

      const openaiData = await openaiResponse.json();
      response = openaiData.choices[0]?.message?.content || 'すみません、回答を生成できませんでした。';

    } else {
      // フォールバック応答（環境変数がない場合）
      const responses = {
        'こんにちは': 'こんにちは！AI十四代です。高木酒造株式会社の十四代について何でもお聞きください。',
        '十四代': '十四代は、元和元年創業の高木酒造株式会社が醸造する日本酒です。「聞こえないものを聞き、見えないものを見る」という哲学のもと、最高品質の日本酒を造り続けています。',
        '龍泉': '十四代 龍泉は、山田錦を使用した純米大吟醸酒で、SAKE COMPETITION 2019のSuper Premium部門で第1位を受賞した逸品です。',
        '高木酒造': '高木酒造株式会社は元和元年（1615年）創業の老舗酒蔵です。山形県村山市にて400年を超える伝統を継承し、現当主・高木顕統氏のもと最高品質の日本酒を醸造しています。',
        '場所': '高木酒造株式会社は山形県村山市富並1826にございます。お電話でのお問い合わせは0237-57-2131までどうぞ。',
        'アクセス': '高木酒造株式会社は山形県村山市富並1826にございます。お電話でのお問い合わせは0237-57-2131までどうぞ。'
      };

      // キーワードマッチング
      const matchedKey = Object.keys(responses).find(key => 
        message.toLowerCase().includes(key.toLowerCase())
      );

      response = matchedKey ? responses[matchedKey] : 
        'AI十四代です。十四代や高木酒造について、より具体的にお聞かせいただけますでしょうか？商品について、蔵元について、歴史について、どのようなことでもお答いたします。';
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        response,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Chatbot error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'AI十四代は一時的にご利用いただけません。しばらくしてからもう一度お試しください。',
        fallback: '高木酒造株式会社について何かご質問がございましたら、お電話（0237-57-2131）でもお気軽にお問い合わせください。'
      })
    };
  }
};