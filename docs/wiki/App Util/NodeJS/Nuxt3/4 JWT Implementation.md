---
slug: "4-JWT-Implementation"
title: "Nuxt3에서 JWT 로그인 구현 (JWT Auth)"
---

# Nuxt3에서 JWT 로그인 구현 가이드

:::info 개요
Nuxt 3 환경에서 **Pinia**를 이용한 상태 관리와 **JWT** 토큰(Access/Refresh)을 활용한 인증 로직을 구현하는 방법을 단계별로 설명합니다.
:::

## 1. 아키텍처 설계

### 1.1 저장소 전략
- **Access Token**: 메모리(Pinia Store)에 저장하여 XSS 공격을 방지합니다. 새로고침 시 사라지므로 초기화 로직이 필요합니다.
- **Refresh Token**: `httpOnly` 쿠키에 저장하여 자바스크립트 접근을 차단하고 CSRF 공격을 방어합니다.

### 1.2 인증 흐름
1. **로그인**: 서버에서 Access Token(응답 바디)과 Refresh Token(쿠키)을 받습니다.
2. **상태 저장**: Access Token은 Pinia Store에 저장합니다.
3. **API 요청**: Pinia에 저장된 Access Token을 헤더에 실어 요청합니다.
4. **새로고침/재진입**: 앱 초기화 시(`app.vue` 등) Refresh Token으로 Access Token을 재발급받습니다.

---

## 2. 구현 단계

### 2.1 Pinia Store 설정

```ts title="stores/auth.ts"
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null);
  const user = ref<User | null>(null);

  const setToken = (token: string) => {
    accessToken.value = token;
  };

  const setUser = (userData: User) => {
    user.value = userData;
  };

  const logout = () => {
    accessToken.value = null;
    user.value = null;
    // 서버 사이드 로그아웃 API 호출 (쿠키 삭제)
  };

  return { accessToken, user, setToken, setUser, logout };
});
```

### 2.2 API 요청 Composable (Interceptors)

Nuxt의 `useFetch`를 래핑하여 자동으로 토큰을 주입하고, 토큰 만료 시 갱신하는 로직을 추가합니다.

```ts title="composables/useApi.ts"
export const useApi = async (url: string, options: any = {}) => {
  const authStore = useAuthStore();
  
  // 1. 헤더에 토큰 주입
  const headers = {
    ...options.headers,
    Authorization: authStore.accessToken ? `Bearer ${authStore.accessToken}` : undefined,
  };

  try {
    const response = await $fetch(url, { ...options, headers });
    return response;
  } catch (error: any) {
    // 2. 401 에러(토큰 만료) 시 Refresh 로직 수행
    if (error.statusCode === 401) {
      const newToken = await refreshAccessToken(); // 토큰 갱신 함수
      if (newToken) {
        // 토큰 갱신 성공 시 재요청
        authStore.setToken(newToken);
        options.headers.Authorization = `Bearer ${newToken}`;
        return $fetch(url, options); // 재귀 호출
      } else {
        // 갱신 실패 시 로그아웃
        authStore.logout();
        navigateTo('/login');
      }
    }
    throw error;
  }
};
```

---

## 3. 미들웨어 적용

페이지 이동 시마다 로그인 여부를 확인합니다.

```ts title="middleware/auth.global.ts"
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  const publicPages = ['/login', '/register'];

  // 공개 페이지가 아닌데 토큰이 없으면 로그인 페이지로
  if (!authStore.accessToken && !publicPages.includes(to.path)) {
    return navigateTo('/login');
  }
});
```

:::tip 참고
SSR 초기 로드 시에는 쿠키에 있는 Refresh Token을 이용해 서버 사이드에서 Access Token을 발급받아 Pinia 초기 상태로 주입하는 과정(`nuxtServerInit` 대체)이 필요할 수 있습니다.
:::
