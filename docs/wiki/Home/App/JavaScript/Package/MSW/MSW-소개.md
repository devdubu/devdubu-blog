---
시작 날짜: 2025-05-14
종료 날짜: 2025-05-14
sticker: lucide//server

slug: "MSW-소개"
---
백엔드가 없이 프론트엔드가 작업할 수 있는 방법은 여러가지가 존재한다.
여러가지의 방법 중, 그 중에 하나가 MSW이다

> Mock Service Worker

API를 모킹하는 라이브러리이다.
실제 API와 똑같은 명세로 MOCK을 작성하여 HTTP 통신을 가로채게 됩니다.
ServiceWorker로 가로챈 요청을 복사해서 실제 서버가 아닌 클라이언트 사이드에 있는 MSW 라이브러리로 보낸 후, 등록된 핸들러를 통해 모의 응답을 제공받습니다.

# 소개
![Pasted-image-20240520080640.png](/img/이미지 창고/Pasted-image-20240520080640.png)


현재 블로그들의 예시에는 MSW V1.XX 버전으로 소개가 주로 되어있습니다.
저는 현재 2.XX을 기준으로 설명을 드리겠습니다.

제가 삽질 했던 것 위주로..구성하겠습니다.

## 셋팅 방법
![Pasted-image-20240520080531.png](/img/이미지 창고/Pasted-image-20240520080531.png)

> React, Vue와 같은 SPA 특성을 가지고 있는 Application들은 Browser integration에서 제공하는 Doc를 참조해서 개발 해야 합니다.

```shell
npx msw init <PUBLIC_DIR>
```

```js
// src/mocks/browser.js
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers' 

export const worker = setupWorker(...handlers)
```

### React
:::warning 삽질1
- 공식 문서에도 Warning이라고 뜰만큼 빈번히 일어나는 문제인듯 합니다.
- 반드시 `working.start()` 를 진행할 때, 비동기 방식으로 처리해야, 실제 HTTP통신과 충돌이 나지 않습니다.


:::

```jsx
// src/index.jsx
import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './App' 

async function enableMocking() { 
	if (process.env.NODE_ENV !== 'development') {
		 return
	}
	 const { worker } = await import('./mocks/browser') 
	 // `worker.start()` returns a Promise that resolves 
	 // once the Service Worker is up and ready to intercept requests. 
	return worker.start()
} 
enableMocking()
.then(() => { 
	ReactDOM.render(<App />, rootElement)
})
```

## NuxtJS MSW
## 구현 방법

구현 방법은 결국은 현 프로젝트에서 간단한 express 서버를 구현하고 그 express서버에 mock 데이터를 만들며, 해당 mock 서버를 띄우는 것입니다.

즉,,,SSR 서버 한 개와 express 서버 한 개를 띄워서 실행하는 것입니다. 방법은 아래와 같습니다.

먼저 필수 요소를 설치하고, 초기화 해줍니다.

```shell
npm i msw cors express @mswjs/http-middleware 

# msw 초기화 
npx init msw ./public
```

위 init 명령어를 입력하게 된다면, `public` 디렉토리 에 파일이 신규로 생성됩니다.

그 이후에 `package.json`에 아래와 같은 script를 작성해줍니다.

```json
... 
script:
	{ 
		... 
		"mock": "npx tsx watch ./mocks/mockServer.ts", 
		...
	} ,
...
```

```ts
import express from "express"; 
import { createMiddleware } from "@mswjs/http-middleware"; 
import { handler } from "./handler"; 
import cors from 'cors' 

const app = express(); 
const PORT = 8080; 
const corsOptions = { origin: 'http://localhost:3000' } 

app.use(express.json()); 
app.use(cors(corsOptions)) 
app.use(createMiddleware(...handler)); 

app.listen(PORT, () => console.log(`Mock server is running on port: ${PORT}`));
```
`mocks/mockServer.ts`


```ts
import { http, HttpResponse } from "msw"; 
import { data } from "[mock 데이터 경로]"; 

export const handler = [ 
	http.get("/post", () => { 
		return HttpResponse.json(data); 
	}), 
];
```

`mocks/handler.js`

위와 같이 진행하고, 이후, `npm run mock` 명령어 입력하게 된다면, 해당 경로로 서버가 생성됩니다.


