---
slug: "2-Vue3-Core-Concepts"
title: "Vue 3 핵심 개념 (Core Concepts)"
---

# Vue 3 핵심 개념

:::info 개요
Vue 3의 가장 큰 변화인 **Composition API**, 그리고 **반응형 시스템(Reactivity)**의 작동 원리를 깊이 있게 다룹니다.
:::

## 1. Composition API

### 1.1 등장 배경
Vue 2의 Options API(`data`, `methods`, `mounted` 등)는 코드가 기능별로 파편화되어 유지보수가 어려웠습니다. Composition API는 **논리적 관심사**별로 코드를 모아 작성할 수 있게 하여, **코드 재사용성**과 **가독성**을 획기적으로 개선했습니다.

### 1.2 Setup 스크립트 (`<script setup>`)
Vue 3에서 가장 권장되는 문법입니다. 보일러플레이트 코드를 줄이고 직관적인 개발이 가능합니다.

```vue
<script setup>
import { ref, onMounted } from 'vue'

const count = ref(0)
const increment = () => count.value++

onMounted(() => {
  console.log('Component mounted!')
})
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>
```

---

## 2. 반응형 시스템 (Reactivity)

Vue 3는 JS의 `Proxy` 객체를 사용하여 반응성을 구현합니다. 가장 자주 쓰이는 두 가지 API인 `ref`와 `reactive`를 비교합니다.

### 2.1 `ref`
- **대상**: 원시값(String, Number, Boolean) 및 객체 모두 사용 가능.
- **접근**: 스크립트 내에서는 `.value`로 접근해야 합니다. (템플릿에서는 자동 언래핑됨)
- **추천**: 대부분의 경우 `ref` 사용을 권장합니다.

```js
const count = ref(0)
console.log(count.value) // 0
```

### 2.2 `reactive`
- **대상**: 객체(Object), 배열(Array), 컬렉션 타입만 가능.
- **접근**: `.value` 없이 속성에 바로 접근 가능.
- **주의**: 구조 분해 할당(Destructuring) 시 반응성이 깨질 수 있습니다(이 경우 `toRefs` 사용 필요).

```js
const state = reactive({ count: 0 })
// const { count } = state // ❌ 반응성 소실
const { count } = toRefs(state) // ✅ OK
```

:::tip ref vs reactive
`reactive`는 ES2015 Proxy 기반이므로 원시값 변경을 감지할 수 없습니다. 따라서 원시값, 객체를 통일성 있게 다루고 싶다면 `ref`를 주력으로 사용하는 것이 정신 건강에 좋습니다.
:::

---

## 3. Composable 함수

### 3.1 Composable이란?
Composition API를 활용하여 **상태가 있는 로직(Stateful Logic)**을 함수로 추출하여 재사용하는 패턴입니다. 리액트의 Custom Hook과 유사합니다.

### 3.2 일반 유틸리티 함수와의 차이
- **일반 함수**: 단순히 입력을 받아 결과를 반환합니다 (Stateless).
- **Composable**: Vue의 **반응형 API(`ref`, `computed` 등)**나 **라이프사이클 훅(`onMounted` 등)**을 내부에서 사용하여 상태를 관리하고, 컴포넌트 간에 그 상태를 연결합니다.

```js title="composables/useCounter.js"
import { ref } from 'vue'

export function useCounter() {
  const count = ref(0) // 반응형 상태
  const increment = () => count.value++

  return { count, increment }
}
```

### 3.3 사용 예시
```vue
<script setup>
import { useCounter } from './composables/useCounter'

const { count, increment } = useCounter()
</script>
```
