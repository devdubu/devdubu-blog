---
sticker: vault//이미지/개발 로고/TechIconSVG/Android.svg

slug: "Gemini-CLI-셋팅하기"
---
## API Key 셋팅하기
- 기존에 Key 가 있다면 생략 가능하고 만약 없다면 [Google AI Studio](https://aistudio.google.com/prompts/new_chat) 에서 셋팅하면 된다.
- 나의 개인 키 값은 아래와 같다.
	- AIzaSyA8tObsrqSO84JmbTOzjXF_PH3pyOjTuyQ

## Gemini 환경 셋팅하기
- 해당 key 값을 Gemini에게 적용하려면 Global env에 나의 설정을 셋팅해놓으면 된다.
```env
GEMINI_MODEL="gemini-2.5-flash"# 혹은 gemini-2.5-pro 원하는 모델 입력 GEMINI_API_KEY="AIzaSyA8tObsrqSO84JmbTOzjXF_PH3pyOjTuyQ"# 확인된 API Key 입력 GOOGLE_CLOUD_PROJECT="gen-lang-client-0717111537"# 확인된 구글 클라우드 Project ID 입력
```


## Gemini-CLI 설치
```shell
# Gemini-CLI를 어떤 경로에서도 실행 되도록 Global 설치 
npm install -g @google/gemini-cli
```
