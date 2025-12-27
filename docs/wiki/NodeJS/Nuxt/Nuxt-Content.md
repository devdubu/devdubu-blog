---
slug: "Nuxt-Content"
---
Nuxt Content가 쓰이는 환경은 주로, md 파일로 이루어진 홈페이지에서 많이 사용되는 Nuxt Offcial 라이브러리 이다.

하지만, 해당 content 를 mock 서버 처럼 활용하는 방법도 있다.
해당 방법을 사용하려면 아래와 같이 `nuxt.config.ts`를 맞춰줘야한다.
```ts
...
	modules: [
		"@nuxt/eslint",
		"@nuxtjs/tailwindcss",
		"@pinia/nuxt",
		"nuxt-primevue",
		"@nuxt/test-utils/module",
		"@nuxt/content",
		"@nuxt/image",
	],

	routeRules: {
		"/api/**": {
			proxy: `${apiBaseUrl}/api/**`,
			cors: true,
		},
	},
	content: {
		api: {
			baseURL: "/_content", // queryContent 함수응답용 API base URL 변경(default: '/api/_content')
		},
		watch: false, // websocket 기능 끄기
	},
...
```

그리고 content 디렉토리 밑에 `mocks` 라는 디렉토리를 두고 아래에 차곡 파일들을 배치하면 된다.

해당 api는 postman으로 공개된 것은 아니고, mock 서버의 정의 처럼, nuxt3에서 요청이 들어오면 해당 요청을 가로채는 형식인 것 같다.
이 부분은 조금더 만져볼 필요가 있어보인다.

---

#NodeJS #Nuxt #JavaScript #Nuxt3 #FrontEnd 

---