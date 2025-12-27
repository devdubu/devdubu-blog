---
sticker: vault//이미지/개발 로고/TechIconSVG/Nuxt-JS.svg

slug: "Nuxt에서의-JWT-로그인-구현"
---
Nuxt 3에서 NestJS 서버에서 받은 JWT를 `Authorization` 헤더에 담아 요청을 보내고, 새로고침 시에도 인증 상태를 유지하는 방법에 대해 설명해 드릴게요.

### 1. JWT 저장 방식

새로고침 시에도 JWT를 유지하기 위해서는 클라이언트 측에 JWT를 저장해야 합니다. 일반적으로 다음과 같은 두 가지 방법이 사용됩니다.

- **localStorage (권장하지 않음)**:
    - 장점: 간단하게 저장하고 꺼낼 수 있습니다.
    - 단점: XSS (Cross-Site Scripting) 공격에 취약하여 탈취될 위험이 있습니다. 보안상 권장되지 않습니다.
- **HTTP-only Cookie (권장)**:
    - 장점: JavaScript에서 접근할 수 없으므로 XSS 공격으로부터 JWT를 보호할 수 있습니다. 서버에서만 읽고 쓸 수 있습니다.
    - 단점: CSRF (Cross-Site Request Forgery) 공격에 취약할 수 있으므로, CSRF 토큰과 함께 사용하는 것이 좋습니다.

NestJS에서 JWT를 응답으로 보낼 때, `access_token`과 `refresh_token`을 분리하여 관리하는 것이 일반적입니다.

- **`access_token`**: 짧은 유효 기간을 가지고, API 요청 시 `Authorization` 헤더에 사용됩니다.
- **`refresh_token`**: 긴 유효 기간을 가지고, `access_token`이 만료되었을 때 새로운 `access_token`을 발급받는 데 사용됩니다.

**권장하는 저장 방식:**

1. **`access_token`**: Nuxt 3의 전역 상태 관리 (Pinia 또는 `useState`)에 저장합니다. 이는 클라이언트 사이드에서만 사용되므로, 새로고침 시 초기화될 수 있습니다.
2. **`refresh_token`**: NestJS에서 `httpOnly` 및 `secure` (HTTPS 환경) 플래그가 설정된 쿠키로 설정하여 응답합니다. Nuxt 3는 이 쿠키에 직접 접근할 수 없지만, 브라우저가 자동으로 모든 요청에 포함하여 서버로 전송합니다.

### 2. Nuxt 3에서 JWT 처리 및 `Authorization` 헤더 추가

Nuxt 3에서 JWT를 받아 저장하고, 모든 요청에 `Authorization` 헤더를 추가하는 방법을 단계별로 설명합니다.

#### 2.1. 로그인 처리 및 JWT 저장

로그인 요청을 보내고 JWT를 받는 부분입니다.

```ts
// pages/login.vue
<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth'; // Pinia store 사용 예시

const email = ref('');
const password = ref('');
const authStore = useAuthStore();
const router = useRouter();

async function login() {
  try {
    const response = await $fetch('/api/auth/login', { // Nuxt 3 서버 API 라우트 (proxy 역할)
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
      },
    });

    // NestJS에서 응답받은 JWT (body에 access_token, refresh_token 포함)
    // refresh_token은 httpOnly 쿠키로 설정되어 있다면, Nuxt.js가 직접 받지 않고 브라우저가 처리
    // 여기서는 access_token만 body에서 추출하여 Pinia store에 저장한다고 가정
    const { access_token, user_info } = response; // 예시 응답 구조

    // access_token을 Pinia store에 저장
    authStore.setAccessToken(access_token);
    authStore.setUser(user_info);

    // 로그인 성공 후 리다이렉트
    router.push('/');

  } catch (error) {
    console.error('Login failed:', error);
    // 에러 처리 (사용자에게 메시지 표시 등)
  }
}
</script>

<template>
  <div>
    <input type="email" v-model="email" placeholder="Email" />
    <input type="password" v-model="password" placeholder="Password" />
    <button @click="login">Login</button>
  </div>
</template>
```

**Nuxt 3 서버 API 라우트 (`/api/auth/login`) (선택적이지만 권장)**

NestJS API가 직접 노출되지 않도록 Nuxt 3 서버 라우트를 프록시로 사용하는 것이 좋습니다. 여기서 NestJS로 요청을 보내고, 받은 JWT (특히 `refresh_token`을 쿠키로 설정)를 처리 합니다.

```TypeScript
// server/api/auth/login.post.ts
import { setCookie } from 'h3'; // Nuxt 3 서버 헬퍼

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    // NestJS 백엔드로 로그인 요청
    const nestResponse = await $fetch('http://localhost:3000/auth/login', { // NestJS API 엔드포인트
      method: 'POST',
      body: body,
    });

    const { access_token, refresh_token, user_info } = nestResponse; // NestJS 응답

    // refresh_token을 httpOnly 쿠키로 설정
    setCookie(event, 'refreshToken', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // 프로덕션에서는 HTTPS 필수
      maxAge: 60 * 60 * 24 * 7, // 7일 (refresh token 유효 기간에 맞게 설정)
      path: '/',
    });

    // access_token과 사용자 정보는 클라이언트로 반환
    return { access_token, user_info };

  } catch (error) {
    // NestJS에서 받은 에러를 클라이언트로 전달
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Login failed',
    });
  }
});
```

#### 2.2. 전역 상태 관리 (Pinia Store)

`access_token`과 사용자 정보를 저장하고 관리하는 Pinia store를 만듭니다.

```TypeScript
// stores/auth.ts
import { defineStore } from 'pinia';

interface User {
  id: string;
  email: string;
  // 다른 사용자 정보 필드
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    accessToken: null,
    user: null,
    isAuthenticated: false,
  }),
  getters: {
    isLoggedIn: (state) => !!state.accessToken && !!state.user,
    getAccessToken: (state) => state.accessToken,
    getUser: (state) => state.user,
  },
  actions: {
    setAccessToken(token: string) {
      this.accessToken = token;
      this.isAuthenticated = !!token;
    },
    setUser(user: User) {
      this.user = user;
    },
    logout() {
      this.accessToken = null;
      this.user = null;
      this.isAuthenticated = false;
      // refresh_token 쿠키 삭제 로직도 필요 (서버 API 호출)
      // 예: $fetch('/api/auth/logout', { method: 'POST' });
    },
    // 새로고침 시 인증 상태 복원 (아래 2.3에서 설명)
    async initializeAuth() {
      // 서버에서 access_token 재발급 요청 (refresh_token 사용)
      if (!this.accessToken) {
        try {
          const response = await $fetch('/api/auth/refresh-token', { method: 'POST' });
          if (response.access_token) {
            this.setAccessToken(response.access_token);
            this.setUser(response.user_info); // 사용자 정보도 함께 받아옴
          }
        } catch (error) {
          console.error('Failed to refresh token:', error);
          this.logout(); // 토큰 재발급 실패 시 로그아웃
        }
      }
    }
  },
});
```

#### 2.3. 모든 API 요청에 `Authorization` 헤더 추가

Nuxt 3에서는 `plugins` 또는 `middleware`를 사용하여 모든 `Workspace` 요청에 `Authorization` 헤더를 자동으로 추가할 수 있습니다. `axios`를 사용하는 경우 `axios` 인스턴스에 인터셉터를 설정할 수 있습니다. 여기서는 Nuxt 3의 내장 `$fetch`를 기준으로 설명합니다.

**방법 1: `$fetch` 인터셉터 (권장)**

Nuxt 3는 `$fetch`에 대한 요청 인터셉터 기능을 제공합니다.

```TypeScript
// plugins/01.api-interceptor.ts (파일 이름 앞에 숫자를 붙여 로드 순서 제어)
import { useAuthStore } from '~/stores/auth';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:created', () => {
    // 클라이언트 사이드에서만 실행되도록 조건부 처리
    if (process.client) {
      const authStore = useAuthStore();

      // $fetch 요청이 발생하기 전에 실행될 훅
      globalThis.$fetch = $fetch.create({
        onRequest({ options }) {
          const token = authStore.getAccessToken;
          if (token) {
            // 모든 API 요청 헤더에 JWT 추가
            options.headers = {
              ...options.headers,
              Authorization: `Bearer ${token}`,
            };
          }
        },
        onResponseError({ response }) {
          // 401 Unauthorized 응답 처리 (access_token 만료 등)
          if (response.status === 401) {
            const currentRoute = useRoute();
            const router = useRouter();
            // refresh_token으로 access_token 재발급 시도
            authStore.initializeAuth().then(() => {
              // 재발급 성공 시 현재 페이지 새로고침 또는 리다이렉트 (선택 사항)
              if (authStore.isLoggedIn) {
                // 원본 요청을 다시 시도하거나, 사용자에게 알림 후 리다이렉트
                // 여기서는 간단히 리다이렉트
                router.go(0); // 현재 페이지 새로고침
              } else {
                router.push('/login?redirect=' + currentRoute.fullPath); // 로그인 페이지로 리다이렉트
              }
            }).catch(() => {
              // 재발급 실패 시 로그아웃 및 로그인 페이지로 이동
              authStore.logout();
              router.push('/login?redirect=' + currentRoute.fullPath);
            });
          }
        },
      });
    }
  });
});
```

#### 2.4. 새로고침 시 인증 상태 유지 (Refresh Token 사용)

사용자가 새로고침했을 때 `access_token`은 Pinia store에서 사라지지만, `refresh_token`은 HTTP-only 쿠키에 남아있습니다. 이 `refresh_token`을 사용하여 새 `access_token`을 발급받아 인증 상태를 복원해야 합니다.

**Nuxt 3 서버 API 라우트 (`/api/auth/refresh-token`)**

이 라우트는 `refresh_token`을 사용하여 새로운 `access_token`을 NestJS 백엔드로부터 받아옵니다.

```TypeScript
// server/api/auth/refresh-token.post.ts
import { getCookie, setCookie } from 'h3';

export default defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, 'refreshToken');

  if (!refreshToken) {
    throw createError({ statusCode: 401, statusMessage: 'No refresh token available' });
  }

  try {
    // NestJS 백엔드로 refresh_token을 사용하여 access_token 재발급 요청
    const nestResponse = await $fetch('http://localhost:3000/auth/refresh', { // NestJS refresh 엔드포인트
      method: 'POST',
      body: { refreshToken },
    });

    const { access_token, new_refresh_token, user_info } = nestResponse; // NestJS 응답

    // 새로운 refresh_token이 발급되었다면 쿠키 업데이트
    if (new_refresh_token) {
      setCookie(event, 'refreshToken', new_refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });
    }

    // 새로운 access_token과 사용자 정보를 클라이언트로 반환
    return { access_token, user_info };

  } catch (error) {
    // refresh_token이 유효하지 않거나 만료된 경우
    throw createError({
      statusCode: error.statusCode || 401,
      statusMessage: error.statusMessage || 'Failed to refresh token',
    });
  }
});
```

**Nuxt 3 애플리케이션 초기화 시 인증 상태 복원**

Pinia `authStore`의 `initializeAuth` 액션을 `app.vue` 또는 라우터 미들웨어에서 호출하여 애플리케이션 시작 시 인증 상태를 확인하고 복원합니다.

```TypeScript
// app.vue
<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();

// 애플리케이션이 마운트될 때 (클라이언트 사이드에서) 인증 상태 초기화 시도
onMounted(() => {
  if (!authStore.isLoggedIn) {
    authStore.initializeAuth();
  }
});

// SSR 환경에서도 사용자 인증 정보를 가져와야 하는 경우
// Nuxt 3에서는 server/plugins를 사용하여 SSR 시 JWT를 처리할 수 있습니다.
// 이는 초기 로드 시 "깜빡임" (Flash of Unauthenticated Content)을 방지하는 데 도움이 됩니다.
// plugins/auth.server.ts 예시 (선택적)
// 이 플러그인은 서버 사이드에서만 실행됩니다.
// import { getCookie } from 'h3';
// import { useAuthStore } from '~/stores/auth';
//
// export default defineNuxtPlugin(async (nuxtApp) => {
//   if (process.server) {
//     const event = useRequestEvent();
//     const refreshToken = getCookie(event, 'refreshToken');
//     const authStore = useAuthStore();
//
//     if (refreshToken) {
//       try {
//         // 서버에서 직접 NestJS API 호출 (클라이언트 측 $fetch와 다름)
//         const response = await $fetch('http://localhost:3000/auth/refresh', {
//           method: 'POST',
//           body: { refreshToken },
//         });
//         authStore.setAccessToken(response.access_token);
//         authStore.setUser(response.user_info);
//       } catch (error) {
//         console.error('SSR: Failed to refresh token', error);
//         // 에러 발생 시 refresh token 쿠키 삭제 (선택 사항)
//         // deleteCookie(event, 'refreshToken'); // h3에서 deleteCookie 사용
//       }
//     }
//   }
// });

</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

#### 2.5. 라우트 가드 (Middleware)

인증이 필요한 페이지에 대한 접근을 제한하는 라우트 미들웨어를 생성합니다.

```TypeScript
// middleware/auth.ts
import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();

  // 이미 로그인되어 있으면 통과
  if (authStore.isLoggedIn) {
    return;
  }

  // 로그인되지 않은 경우, 새로고침 시도를 위해 initializeAuth 호출
  // SSR에서는 server/plugins/auth.server.ts 에서 처리되므로 클라이언트에서만 필요
  if (process.client) {
    await authStore.initializeAuth();

    // 초기화 후 로그인 상태가 되면 통과
    if (authStore.isLoggedIn) {
      return;
    }
  }

  // 로그인되지 않은 상태에서 인증이 필요한 페이지 접근 시 로그인 페이지로 리다이렉트
  if (to.meta.requiresAuth) { // 라우트 메타 필드 설정
    return navigateTo(`/login?redirect=${to.fullPath}`);
  }
});
```

`nuxt.config.ts` 또는 페이지 컴포넌트에서 미들웨어 적용:

```TypeScript
// nuxt.config.ts
export default defineNuxtConfig({
  // ...
  routeRules: {
    '/dashboard/**': { ssr: false, prerender: false, middleware: 'auth' }, // 예시
    '/profile': { ssr: false, prerender: false, middleware: 'auth' },
  },
});

// 또는 페이지 컴포넌트 내부에서
<script setup>
definePageMeta({
  middleware: ['auth'],
  requiresAuth: true // 미들웨어에서 사용할 메타 필드
});
</script>
```

### 요약 및 핵심

1. **JWT 저장**:
    
    - `access_token`: Pinia (또는 `useState`)와 같은 전역 상태에 저장. 새로고침 시 초기화됨.
    - `refresh_token`: `httpOnly` 및 `secure` 쿠키로 서버 (NestJS)에서 설정. 브라우저가 자동으로 관리하며 JavaScript에서 접근 불가.
2. **`Authorization` 헤더 추가**:
    
    - Nuxt 3의 `$fetch` 요청 인터셉터를 사용하여 `access_token`이 존재하면 모든 API 요청의 `Authorization` 헤더에 `Bearer {access_token}` 형식으로 추가.
3. **새로고침 시 인증 유지**:
    
    - 애플리케이션이 로드되거나 라우터 미들웨어에서 `access_token`이 없는 경우 (새로고침으로 인해 초기화된 경우), `refresh_token` (HTTP-only 쿠키)을 사용하여 NestJS 서버에 새로운 `access_token` 발급을 요청하는 Nuxt 3 서버 API 라우트를 호출.
    - NestJS는 `refresh_token`의 유효성을 검사하고, 유효하면 새 `access_token`과 (선택적으로) 새 `refresh_token`을 반환.
    - Nuxt 3는 받은 새 `access_token`을 Pinia store에 저장하여 인증 상태 복원.
4. **보안 고려 사항**:
    
    - `refresh_token`은 반드시 `httpOnly` 및 `secure` (HTTPS 환경) 쿠키로 설정하여 XSS 공격으로부터 보호.
    - CSRF 공격 방지를 위해 NestJS에서 CSRF 토큰을 구현하고, Nuxt 3에서 요청 시 함께 전송하는 것을 고려.
    - `access_token` 만료 시 자동 재발급 로직을 구현하여 사용자 경험 향상.

이러한 방식으로 Nuxt 3와 NestJS 간의 안전하고 효율적인 JWT 인증 흐름을 구축할 수 있습니다.

# Refresh 로 인한 Access Token의 사라짐에 대한 대처

Pinia와 같은 클라이언트 사이드 상태 관리 라이브러리(Vuex, Zustand 등 포함)에 `access_token`을 저장할 경우, **새로고침(Hard Refresh) 시 해당 `access_token`은 메모리에서 사라지므로 날아갑니다.**

이것이 바로 제가 이전 답변에서 **`refresh_token`**의 중요성을 강조하고, `access_token`과 `refresh_token`을 분리하여 관리해야 한다고 설명드린 이유입니다.

### 왜 `access_token`은 날아가도 괜찮은가?

`access_token`은 일반적으로 **짧은 유효 기간**을 가집니다 (예: 15분, 30분, 1시간). 이는 보안상의 이유입니다. 만약 `access_token`이 탈취되더라도 짧은 시간 내에 만료되어 공격자가 이를 악용할 수 있는 시간을 최소화하기 위함입니다.

새로고침 시 `access_token`이 날아가는 것은 의도된 동작이며, 이를 보완하기 위해 `refresh_token`을 사용하는 것입니다.

### 새로고침 시 `access_token`이 날아갔을 때의 처리 흐름

1. **사용자 로그인**:
    
    - NestJS 서버가 `access_token`과 `refresh_token`을 발급합니다.
    - `access_token`은 Nuxt 3의 Pinia 스토어에 저장됩니다.
    - `refresh_token`은 NestJS 서버가 `httpOnly` 쿠키로 설정하여 브라우저에 전송합니다. (이 쿠키는 JavaScript에서 직접 접근할 수 없고, 브라우저가 자동으로 서버로 보냄)
2. **API 요청**:
    
    - Nuxt 3는 Pinia 스토어의 `access_token`을 `Authorization` 헤더에 담아 API 요청을 보냅니다.
3. **새로고침 발생**:
    - 브라우저가 새로고침되면, Pinia 스토어의 데이터(즉, `access_token`)는 초기화되어 사라집니다. 하지만 `httpOnly` 쿠키에 저장된 `refresh_token`은 브라우저에 그대로 남아 있습니다.
4. **인증 상태 복원 시도 (`onMounted` 또는 미들웨어)**:
    - Nuxt 3 애플리케이션이 다시 로드될 때 (`app.vue`의 `onMounted` 훅 또는 라우터 미들웨어에서), Pinia 스토어에 `access_token`이 없는 것을 확인합니다.
    - 이때, `authStore.initializeAuth()`와 같은 함수를 호출하여 `refresh_token`을 사용하여 새로운 `access_token`을 발급받으려고 시도합니다.
5. **`refresh_token`을 이용한 `access_token` 재발급 요청**:
    - Nuxt 3는 `/api/auth/refresh-token`과 같은 Nuxt 3 서버 API 라우트로 요청을 보냅니다. 이 요청 시 브라우저는 `httpOnly` 쿠키에 담긴 `refresh_token`을 자동으로 서버로 전송합니다.
    - Nuxt 3 서버 라우트는 이 `refresh_token`을 NestJS 백엔드로 전달하여 새로운 `access_token`을 요청합니다.
6. **NestJS 서버의 `refresh_token` 처리**:
    - NestJS 서버는 받은 `refresh_token`의 유효성을 검사합니다.
    - `refresh_token`이 유효하다면, 새로운 `access_token` (그리고 필요하다면 새로운 `refresh_token`)을 발급하여 응답합니다.
    - 만약 `refresh_token`이 만료되었거나 유효하지 않다면, 401 Unauthorized 에러를 반환합니다.
7. **`access_token` 복원 및 사용자 경험 유지**:
    - Nuxt 3는 NestJS로부터 받은 새로운 `access_token`을 다시 Pinia 스토어에 저장합니다.
    - 이제 `access_token`이 다시 스토어에 있으므로, 사용자는 로그인 상태가 유지된 것처럼 API 요청을 계속할 수 있습니다.
    - 만약 `refresh_token`마저 만료되어 새로운 `access_token`을 받지 못했다면, 사용자를 로그인 페이지로 리다이렉트하여 다시 로그인하도록 안내해야 합니다.

### Pinia + `persist` (선택적)

일부 Pinia 플러그인(예: `pinia-plugin-persistedstate`)을 사용하여 Pinia 스토어의 특정 상태를 `localStorage`나 `sessionStorage`에 저장하고, 새로고침 시 이를 복원할 수 있습니다.

TypeScript

```
// main.ts (pinia-plugin-persistedstate 설정 예시)
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);

// stores/auth.ts (persistedstate 적용 예시)
export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null as string | null,
    user: null as User | null,
    isAuthenticated: false,
  }),
  // ...
  persist: {
    storage: localStorage, // 또는 sessionStorage
    paths: ['accessToken', 'user'], // 저장할 상태 지정
  },
});
```

**하지만! `access_token`을 `localStorage`에 직접 저장하는 것은 보안상 권장되지 않습니다.** XSS 공격에 매우 취약하며, 공격자가 `localStorage`에 접근하여 `access_token`을 탈취할 경우 심각한 보안 문제가 발생할 수 있습니다.

따라서, `access_token`은 **메모리(Pinia)에만 저장**하고, 새로고침 시에는 **`refresh_token` (HTTP-only 쿠키)을 통한 재발급** 방식을 사용하는 것이 가장 안전하고 일반적인 JWT 인증 흐름입니다.

결론적으로, Pinia에 `access_token`을 저장하면 새로고침 시 날아가는 것이 맞으며, 이는 `refresh_token`을 통해 보완되는 의도적인 설계입니다.