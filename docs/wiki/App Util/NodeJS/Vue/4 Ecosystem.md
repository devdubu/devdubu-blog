---
slug: "4-Ecosystem"
title: "생태계 (Ecosystem)"
---

# Vue.js 생태계

:::info 개요
Vue.js 개발 생산성을 높여주는 공식 라이브러리와 필수 패키지를 소개합니다.
:::

## 1. 공식 라이브러리 (Official)

### 1.1 Vue Router
SPA(Single Page Application) 구축을 위한 공식 라우터입니다. URL 경로에 따라 컴포넌트를 매핑해줍니다.
- [공식 문서](https://router.vuejs.org/)

### 1.2 Pinia (상태 관리)
Vue.js 팀이 공식적으로 권장하는 차세대 상태 관리 라이브러리입니다. (구 Vuex 대체)
- **특징**: 직관적인 API, DevTools 지원, 완벽한 TypeScript 지원, 가벼운 용량.
- [공식 문서](https://pinia.vuejs.org/)

---

## 2. 유용한 Nuxt 모듈

Nuxt.js 환경에서 자주 사용되는 모듈 모음입니다.

- **[nuxt-prometheus](https://nuxt.com/modules/prometheus)**: Prometheus 메트릭 수집을 위한 모듈.
- **[Pinia](https://pinia.vuejs.org/ssr/nuxt.html)**: Nuxt용 Pinia 모듈. (SSR 상태 수 c화 지원)
- **[VueUse](https://vueuse.org/)**: Vue 컴포지션 유틸리티 모음집. (마우스 좌표, 다크모드 등 수백 개의 유틸리티 제공)

:::tip 팁
Nuxt 프로젝트를 시작할 때 [Nuxt Modules](https://nuxt.com/modules) 공식 사이트에서 필요한 기능을 검색해보세요. 대부분의 기능(인증, 이미지 최적화, PWA 등)이 이미 모듈로 잘 만들어져 있습니다.
:::
