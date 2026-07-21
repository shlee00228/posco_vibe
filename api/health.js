module.exports = async (_request, response) => {
  response.status(200).json({
    service: 'VoltGuard API',
    openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
    ttsModel: process.env.OPENAI_TTS_MODEL || 'tts-1'
  });
};
