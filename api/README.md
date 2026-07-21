# VoltGuard 서버 API

OpenAI API 키는 클라이언트 HTML이나 Git 저장소에 넣지 않는다. Vercel 서버 함수만 `OPENAI_API_KEY`를 읽는다.

## 환경변수

Vercel 프로젝트의 **Settings > Environment Variables**에 다음 값을 등록한다.

| 이름 | 필수 | 용도 |
| --- | --- | --- |
| `OPENAI_API_KEY` | 예 | OpenAI 서버 인증 키 |
| `OPENAI_TTS_MODEL` | 아니오 | 기본값 `tts-1` |
| `OPENAI_TTS_VOICE` | 아니오 | 기본값 `shimmer` |

Production, Preview, Development 환경에 필요한 범위로 각각 등록한다. 등록 후 새 배포를 실행해야 적용된다.

## 엔드포인트

- `GET /api/health` - 키 존재 여부만 반환한다. 키 값은 절대 반환하지 않는다.
- `POST /api/tts` - `{ "text": "읽을 문장" }`을 받아 MP3 음성을 반환한다.

`/api/tts`는 키를 등록한 뒤에만 동작한다. 공개 사이트에서 실제 사용으로 연결하기 전에는 로그인 또는 요청 제한을 추가해 무단 음성 생성 비용이 발생하지 않도록 한다.
