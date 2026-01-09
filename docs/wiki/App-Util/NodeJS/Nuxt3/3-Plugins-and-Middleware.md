---
slug: "3-Plugins-and-Middleware"
title: "3. 플러그인과 미들웨어 (Plugins & Middleware)"
---

# 플러그인과 미들웨어

:::info 개요
Nuxt 애플리케이션의 기능을 확장하는 **플러그인(Plugins)**, 라우팅 흐름을 제어하는 **미들웨어(Middleware)**, 그리고 서버 사이드 모듈 설정 방법에 대해 다룹니다.
:::

## 1. Nuxt Plugins

### 1.1 플러그인 등록
`plugins/` 디렉토리에 파일을 생성하면 Nuxt가 자동으로 등록합니다.
파일명에 접미사를 붙여 실행 환경을 제어할 수 있습니다.

- `.server.ts`: 서버 사이드에서만 실행
- `.client.ts`: 클라이언트 사이드에서만 실행
- `.ts`: 양쪽 모두 실행

### 1.2 클라이언트 전용 플러그인 예시 (Toast 라이브러리)
브라우저 API를 사용하는 UI 라이브러리는 반드시 클라이언트에서만 실행되도록 처리해야 합니다.

```ts title="plugins/notyf.client.ts"
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default defineNuxtPlugin((nuxtApp) => {
  const notyf = new Notyf({
    duration: 2000,
    position: { x: 'center', y: 'top' },
  });

  // provide를 사용하면 앱 전역에서 $notyf로 접근 가능해집니다.
  return {
    provide: {
      notyf,
    },
  };
});
```

### 1.3 플러그인 사용 (Composable 패턴)
플러그인을 직접 호출하기보다 Composable로 감싸서 사용하는 것이 타입 안정성과 코드 가독성에 좋습니다.

```ts title="composables/useNotyf.ts"
export const useNotyf = () => {
  const { $notyf } = useNuxtApp();
  return $notyf;
};
```

---

## 2. 미들웨어 (Middleware)

미들웨어는 사용자가 특정 페이지로 이동하기 **전(Before Navigation)**에 실행되는 코드입니다.

### 2.1 미들웨어 종류
1. **익명(Anonymous)**: 페이지 내부에 인라인으로 정의.
2. **지명(Named)**: `middleware/` 디렉토리에 정의하고 페이지에서 이름으로 호출.
3. **전역(Global)**: 파일명에 `.global` 접미사를 붙이면 모든 페이지 이동 시 실행.

### 2.2 인증 미들웨어 예시

```ts title="middleware/auth.ts"
export default defineNuxtRouteMiddleware((to, from) => {
  const user = useUser(); // 가상의 유저 상태

  // 로그인하지 않은 유저가 보호된 페이지 접근 시 로그인 페이지로 리다이렉트
  if (!user.value) {
    return navigateTo('/login');
  }
});
```

---

## 3. 서버 플러그인 (Server Engine)

Nuxt의 서버 엔진(Nitro)을 위한 플러그인은 `server/plugins/`에 위치합니다. 데이터베이스 연결 등 앱 시작 시 한 번만 실행되어야 하는 로직에 적합합니다.

### 3.1 Sequelize (DB) 연결 예시

```ts title="server/plugins/db.ts"
import { Sequelize } from 'sequelize';

export default defineNitroPlugin(async (nitroApp) => {
  const config = useRuntimeConfig();
  
  // DB 연결 초기화
  const sequelize = new Sequelize(config.dbName, config.dbUser, config.dbPass, {
    dialect: 'mysql', // or postgres, sqlite...
  });

  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
```
