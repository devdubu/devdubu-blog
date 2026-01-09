---
slug: "1-Nuxt3-Core-Concepts"
title: "1. Nuxt3 핵심 개념 (Core Concepts)"
---

# Nuxt 3 핵심 개념 (Core Concepts)

:::info 개요
이 문서는 Nuxt 3의 핵심 작동 원리인 **유니버설 렌더링(Universal Rendering)**, **하이드레이션(Hydration)**, 그리고 **라이프사이클(Lifecycle)**을 다룹니다.
:::

## 1. 렌더링 모드와 하이드레이션 (Rendering & Hydration)

### 1.1 CSR vs SSR

웹 애플리케이션의 렌더링 방식은 크게 두 가지로 나뉩니다.

- **CSR (Client Side Rendering)**:
    - 초기 로드 시 빈 HTML을 받고, 브라우저에서 JavaScript(JS)를 실행하여 화면을 그립니다 (SPA 방식).
    - **장점**: 초기 로딩 후 사용성은 빠름.
    - **단점**: 검색 엔진 최적화(SEO)에 불리하며, 초기 로딩 속도(FCP)가 느릴 수 있음.
- **SSR (Server Side Rendering)**:
    - 서버에서 미리 완성된 HTML을 만들어 브라우저로 전송합니다.
    - **장점**: SEO에 유리하며, 초기 콘텐츠 노출이 빠름.
    - **단점**: 서버 부하가 있으며, 페이지 이동 시마다 새로고침이 발생할 수 있음 (전통적인 SSR).

### 1.2 유니버설 렌더링 (Universal Rendering)

Nuxt는 **SSR**과 **CSR**의 장점을 결합한 **유니버설 렌더링**을 기본으로 사용합니다.

1. **초기 요청 (Pre-Rendering)**: 서버에서 HTML을 미리 생성하여 브라우저에 전달합니다. (SEO 해결)
2. **하이드레이션 (Hydration)**: 브라우저는 전달받은 정적인 HTML 위에 JS를 실행하여 이벤트 리스너를 붙이고, 동적인 상태(Vue 인스턴스)로 변환합니다.
3. **이후 동작 (SPA)**: 이후의 페이지 이동은 JS로 처리되어 SPA처럼 부드럽게 동작합니다.

> "Hydration은 '마른 땅(정적 HTML)'에 '물(JS)'을 뿌려 동적인 생명력을 불어넣는 과정입니다."

![SSR Flow](/img/Pasted-image-20240829091900.png)

### 1.3 `nuxt.config.ts` 설정
Nuxt는 기본적으로 SSR이 활성화되어 있습니다. 필요에 따라 `ssr: false`로 설정하여 SPA 모드로 전환할 수 있습니다.

```ts title="nuxt.config.ts"
export default defineNuxtConfig({
  ssr: true // false로 설정 시 SPA 모드 (CSR 전용)
})
```

---

# 2. Nuxt 라이프사이클 (Nuxt Lifecycle)

:::warning 주의
Nuxt의 라이프사이클은 물 흐르듯 자연스럽게 이어져야 합니다. 전역 객체를 남용하거나 흐름을 강제로 막으면 예상치 못한 버그(특히 SSR 환경에서)가 발생할 수 있습니다.
:::

### 2.1 주요 훅과 실행 시점

Nuxt는 앱 초기화, 플러그인 로드, 페이지 렌더링 등의 단계에서 다양한 훅(Hook)을 제공합니다.

1. **`setup()` / `<script setup>`**:
    - 컴포넌트가 생성되기 전 실행됩니다.
    - **주의**: `useNuxtApp()`과 같은 컴포저블은 이 단계나 라이프사이클 훅(`onMounted` 등) **내부**에서만 호출해야 안전합니다.

### 2.2 부적절한 전역 사용의 예

Nuxt의 컨텍스트(Context)를 벗어나 전역 변수처럼 컴포저블을 사용하려고 하면 에러가 발생합니다.

**❌ 잘못된 예시 (Bug)**
```ts
// utils/notify.ts
// 전역 스코프에서 useNuxtApp() 호출 -> 에러 발생 가능성 높음
import { useNuxtApp } from '#app'
const { $notyf } = useNuxtApp()
export default $notyf 
```

**✅ 올바른 예시 (Composable)**
함수 내부에서 호출하여 실행 시점에 컨텍스트를 접근하도록 합니다.

```ts title="composables/useNotyf.ts"
import type { Notyf } from 'notyf'

export const useNotyf = () => {
    // 함수가 호출될 때 useNuxtApp()이 실행되므로 안전함
    const { $notyf } = useNuxtApp()
    return $notyf
}
```

### 2.3 SSR 환경에서의 주의점 (Window/Document 접근)
SSR 과정(서버에서 실행) 중에는 브라우저 전용 객체인 `window`, `document`에 접근할 수 없습니다.

- `import.meta.client`: 코드가 클라이언트에서 실행 중인지 확인하는 표준 방법입니다.
- 플러그인이나 컴포넌트에서 브라우저 전용 로직을 실행할 때는 반드시 이를 체크해야 합니다.

```ts
if (import.meta.client) {
  // 브라우저 전용 코드 (예: Toast 알림, LocalStorage 접근)
}
```
