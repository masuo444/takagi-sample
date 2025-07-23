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
    const { message, systemPrompt } = JSON.parse(event.body);
    
    if (!message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'メッセージが必要です' })
      };
    }

    // APIキーの確認
    if (!process.env.OPENAI_API_KEY) {
      return {
        statusCode: 503,
        headers,
        body: JSON.stringify({ 
          success: false,
          error: 'OpenAI API key not configured',
          fallback: 'AIサクラは高木酒造株式会社について何でもお答えします。十四代について詳しくお聞かせください。'
        })
      };
    }

    const defaultSystemPrompt = `あなたは「高木酒造株式会社」の専門AIアシスタント「AIサクラ」です。

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

丁寧で専門的、かつ親しみやすい口調で、十四代と高木酒造について詳しく案内してください。`;

    // OpenAI API呼び出し
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
            content: systemPrompt || defaultSystemPrompt
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
      const errorData = await openaiResponse.json().catch(() => ({}));
      console.error('OpenAI API Error:', errorData);
      
      return {
        statusCode: openaiResponse.status,
        headers,
        body: JSON.stringify({ 
          success: false,
          error: 'OpenAI API request failed',
          details: errorData.error?.message || 'Unknown error',
          fallback: 'AIサクラは一時的にご利用いただけません。高木酒造株式会社について基本的なことでしたらお答えできます。'
        })
      };
    }

    const openaiData = await openaiResponse.json();
    const response = openaiData.choices[0]?.message?.content || 'すみません、回答を生成できませんでした。';

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        response,
        timestamp: new Date().toISOString(),
        model: 'gpt-3.5-turbo'
      })
    };

  } catch (error) {
    console.error('OpenAI Chat error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false,
        error: 'AIサクラは一時的にご利用いただけません。',
        fallback: '高木酒造株式会社について何かご質問がございましたら、お電話（0237-57-2131）でもお気軽にお問い合わせください。',
        details: error.message
      })
    };
  }
};