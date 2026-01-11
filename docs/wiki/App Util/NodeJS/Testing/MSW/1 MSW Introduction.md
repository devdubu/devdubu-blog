---
slug: "1-MSW-Introduction"
title: "MSW 소개 및 브라우저 연동"
---

# MSW (Mock Service Worker)

:::info 개요
**MSW**는 API Mocking 라이브러리로, Service Worker를 사용하여 네트워크 요청을 가로채고 모의 응답(Mock Response)을 보내줍니다.
백엔드 API가 완성되지 않은 상태에서도 프론트엔드 개발을 진행할 수 있게 해줍니다.
:::

## 1. 작동 원리
Service Worker가 브라우저의 네트워크 레벨에서 요청을 가로채기 때문에, 애플리케이션 코드(Axios, fetch 등)를 수정하지 않고도 Mocking이 가능합니다.

![MSW Architecture](/img/Pasted%20image%2020240520080640.png)

---

## 2. 브라우저 연동 (React)

### 2.1 설치 및 초기화
MSW 패키지를 설치하고 Service Worker 스크립트를 생성합니다.

```bash
npm install msw --save-dev
npx msw init public/ # public 폴더 지정
```

### 2.2 핸들러 작성 (`src/mocks/handlers.js`)

```js
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/resource', () => {
    return HttpResponse.json({ id: 'abc-123', name: 'John Maverick' })
  }),
]
```

### 2.3 워커 설정 (`src/mocks/browser.js`)

```js
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
```

### 2.4 애플리케이션 시작 (React)

:::warning 주의사항
`worker.start()`는 비동기 함수입니다. `Promise`가 완료된 후에 `ReactDOM.render`를 호출해야 실제 네트워크 요청과 충돌하지 않습니다.
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
  return worker.start()
}

enableMocking().then(() => {
  ReactDOM.render(<App />, document.getElementById('root'))
})
```
