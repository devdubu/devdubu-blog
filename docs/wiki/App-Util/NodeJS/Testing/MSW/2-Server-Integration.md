---
slug: "2-Server-Integration"
title: "2. 서버 통합 (Nuxt & Node.js)"
---

# 서버 통합 (Node.js / Nuxt)

:::info 개요
Node.js 환경이나 SSR(Server Side Rendering)을 사용하는 프레임워크(Nuxt)에서는 Service Worker 대신 **Express 미들웨어** 방식이나 `setupServer`를 사용하여 Mocking 서버를 구축합니다.
:::

## 1. 전용 Mock 서버 구축 (Express)

Nuxt와 같은 SSR 환경에서 클라이언트/서버 요청을 모두 Mocking하기 위해 별도의 Express 서버를 띄우는 방식을 사용합니다.

### 1.1 설치

```bash
npm i msw cors express @mswjs/http-middleware
npx msw init ./public
```

### 1.2 서버 코드 작성 (`mocks/mockServer.ts`)

`@mswjs/http-middleware`를 사용하여 MSW 핸들러를 Express 미들웨어로 변환합니다.

```ts
import express from "express";
import { createMiddleware } from "@mswjs/http-middleware";
import { handlers } from "./handlers";
import cors from 'cors';

const app = express();
const PORT = 8080;
const corsOptions = { origin: 'http://localhost:3000' }; // 클라이언트 주소

app.use(express.json());
app.use(cors(corsOptions));
app.use(createMiddleware(...handlers));

app.listen(PORT, () => console.log(`Mock server is running on port: ${PORT}`));
```

### 1.3 실행 스크립트

`package.json`에 스크립트를 추가하여 Mock 서버를 실행할 수 있게 합니다.

```json
"scripts": {
  "mock": "npx tsx watch ./mocks/mockServer.ts"
}
```

---

## 2. 핸들러 작성

`http` 모듈을 사용하여 Mock 응답을 정의합니다.

```ts
// mocks/handlers.ts
import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/posts", () => {
    return HttpResponse.json([
      { id: 1, title: 'Mock Post 1' },
      { id: 2, title: 'Mock Post 2' }
    ]);
  }),
];
```
