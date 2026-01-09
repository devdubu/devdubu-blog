---
slug: "2-Components-and-State"
title: "2. 컴포넌트와 상태 관리 (Components & State)"
---

# 컴포넌트와 상태 관리

:::info 개요
Vue와 Nuxt 개발의 핵심인 **컴포넌트 재사용성**, **Props 반응성**, 그리고 **상태 관리(State Management)** 패턴을 정리합니다.
:::

## 1. 컴포넌트 재사용성과 상태 공유

### 1.1 상태 관리의 계층
프론트엔드 상태 관리는 크게 세 가지 계층으로 나눌 수 있습니다.

1. **Pinia**: 전역 상태 관리 (Global Store). 앱 전체에서 공유해야 하는 데이터.
2. **useState (Nuxt)**: 페이지 간 혹은 컴포넌트 간 공유 가능한 상태. (SSR 친화적)
3. **ref (Vue)**: 단일 컴포넌트 내부의 지역 상태.

### 1.2 `useState` vs `ref`
Nuxt의 `useState`는 SSR 과정에서 **서버와 클라이언트 간 상태를 공유(Hydration)** 할 수 있게 해주는 핵심 기능입니다. 단순 `ref`를 전역 변수처럼 사용하면 서버와 클라이언트 간 데이터 불일치(Hydration Mismatch)가 발생할 수 있습니다.

```ts
// 올바른 Nuxt 상태 선언
const useCounter = () => useState('counter', () => 0)
```

---

## 2. Props의 반응성 유지 (Props Reactivity)

부모로부터 받은 `props`는 기본적으로 **읽기 전용(Read-only)**입니다. 이를 자식 컴포넌트에서 가공하거나 변경해야 할 때 사용하는 패턴들을 소개합니다.

### 2.1 `computed` 사용 (단순 가공)
props 데이터가 변경될 때 자동으로 재계산됩니다. 가장 권장되는 방식입니다.

```vue
<script setup>
const props = defineProps(['options']);
const transformedOptions = computed(() => {
  return props.options.map(opt => ({ ...opt, label: opt.label.toUpperCase() }));
});
</script>
```

### 2.2 `ref`와 `watch` 사용 (수정 필요 시)
props 데이터를 로컬에서 수정해야 하거나 비동기 처리가 필요할 때 유용합니다.

```vue
<script setup>
const props = defineProps(['data']);
const localData = ref([]);

watch(() => props.data, (newVal) => {
  localData.value = [...newVal]; // 복사하여 로컬 상태로 관리
}, { immediate: true });
</script>
```

:::tip 언제 무엇을 쓸까?
- **단순 가공**: `computed` (깔끔하고 성능 좋음)
- **로컬 수정/비동기**: `watch` + `ref`
:::

---

## 3. Composable과 전역 변수

### 3.1 Composable이란?
Vue의 **Composition API**를 활용하여 로직을 재사용 가능한 함수로 분리한 것입니다. `composables/` 디렉토리에 파일을 만들면 Nuxt가 자동으로 import 해줍니다.

### 3.2 전역 변수 주의사항
`const globalVar = ...` 처럼 모듈 스코프에 전역 변수를 선언하면, 서버 사이드에서 요청 간에 상태가 공유되어버리는 **치명적인 메모리 누수 및 보안 문제(Cross-Request State Pollution)**가 발생할 수 있습니다.

:::danger 절대 금지
SSR 환경에서는 싱글톤 패턴의 전역 변수 사용을 매우 신중히 해야 합니다. 대신 `useState`나 `Pinia Store`를 사용하세요.
:::

---

## 4. 컴포넌트 Lazy Loading
Nuxt는 컴포넌트 이름 앞에 `Lazy`를 붙여서 비동기적으로 로드할 수 있습니다. 초기 번들 사이즈를 줄이는 데 효과적입니다.

```vue
<template>
  <!-- 조건부 렌더링 시 자동으로 코드가 분할되어 로드됩니다 -->
  <LazyModal v-if="showModal" />
</template>
```
