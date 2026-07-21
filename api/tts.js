const MAX_TEXT_LENGTH = 1200;

module.exports = async (request, response) => {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'POST 요청만 지원합니다.' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return response.status(503).json({
      error: 'OPENAI_API_KEY가 Vercel 환경변수에 등록되지 않았습니다.'
    });
  }

  const text = typeof request.body?.text === 'string' ? request.body.text.trim() : '';
  if (!text || text.length > MAX_TEXT_LENGTH) {
    return response.status(400).json({
      error: `text는 1자 이상 ${MAX_TEXT_LENGTH}자 이하여야 합니다.`
    });
  }

  try {
    const openaiResponse = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.OPENAI_TTS_MODEL || 'tts-1',
        voice: process.env.OPENAI_TTS_VOICE || 'shimmer',
        input: text,
        response_format: 'mp3',
        speed: 1.2
      })
    });

    if (!openaiResponse.ok) {
      console.error('OpenAI TTS request failed:', openaiResponse.status);
      return response.status(502).json({ error: '음성 생성 서비스 요청에 실패했습니다.' });
    }

    const audio = Buffer.from(await openaiResponse.arrayBuffer());
    response.setHeader('Content-Type', 'audio/mpeg');
    response.setHeader('Cache-Control', 'no-store');
    return response.status(200).send(audio);
  } catch (error) {
    console.error('OpenAI TTS connection error:', error);
    return response.status(502).json({ error: '음성 생성 서비스에 연결할 수 없습니다.' });
  }
};
