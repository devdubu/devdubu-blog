---
slug: "1-Vue-Basics"
title: "1. Vue.js 기초 (Basic)"
---

# Vue.js 기초

:::info 개요
Vue.js의 **핵심 철학**, **설치 방법**, 그리고 가장 자주 사용되는 **템플릿 문법(v-if, v-for)**을 정리합니다.
:::

## 1. Vue.js 개요

### 1.1 선언적 렌더링 (Declarative Rendering)
Vue는 표준 HTML을 템플릿 문법으로 확장하여 JavaScript 상태(State)를 기반으로 HTML을 선언적으로 설명할 수 있게 해줍니다.

- **명령형(Imperative)**: jQuery처럼 DOM을 직접 선택하고 조작 (`$('#app').text('hello')`)
- **선언형(Declarative)**: 상태만 변경하면 뷰가 자동으로 업데이트 (`message.value = 'hello'`)

### 1.2 프레임워크 비교 (vs React)
- **React**: JSX를 사용하여 JS 내에서 HTML을 작성. 자유도가 높지만 러닝 커브가 있음.
- **Vue**: HTML 템플릿과 JS 로직을 분리(SFC). 직관적이고 입문하기 쉬움.

---

## 2. 설치 방법

### 2.1 NPM (권장)
최신 프론트엔드 도구(Vite 등)를 사용한 스캐폴딩 방식입니다.

```bash
npm create vue@latest
cd <project-name>
npm install
npm run dev
```

### 2.2 CDN (간편 사용)
빌드 도구 없이 HTML 파일 하나로 바로 시작할 때 유용합니다.

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<div id="app">{{ message }}</div>
<script>
  const { createApp, ref } = Vue
  createApp({
    setup() {
      const message = ref('Hello Vue!')
      return { message }
    }
  }).mount('#app')
</script>
```

---

## 3. 템플릿 문법 (Template Syntax)

### 3.1 조건부 렌더링 (`v-if` vs `v-show`)

#### `v-if`
조건이 `true`일 때만 DOM에 요소를 **렌더링**합니다. `false`이면 DOM에서 아예 제거됩니다.

```vue
<h1 v-if="awesome">Vue는 정말 멋지죠!</h1>
<h1 v-else-if="subsom">음.. 쏘쏘?</h1>
<h1 v-else>아닌가요? 😢</h1>
```

#### `v-show`
항상 DOM에는 남아있지만 CSS `display: none` 속성으로 **보임/숨김** 처리만 합니다. 토글이 매우 빈번할 때 유리합니다.

```vue
<h1 v-show="ok">안녕! (DOM엔 항상 존재)</h1>
```

:::note 비교
- **v-if**: 초기 렌더링 비용이 낮지만, 토글 비용이 높음. (조건이 거의 안 바뀔 때 유리)
- **v-show**: 초기 렌더링 비용이 높지만, 토글 비용이 매우 낮음. (자주 바뀔 때 유리)
:::

### 3.2 리스트 렌더링 (`v-for`)

배열이나 객체를 순회하며 요소를 반복 렌더링합니다. `key` 속성을 반드시 제공해야 합니다.

```vue
<ul>
  <li v-for="(item, index) in items" :key="item.id">
    {{ index }} - {{ item.message }}
  </li>
</ul>
```

:::warning 주의: v-if와 v-for 동시 사용 금지
한 태그 내에서 `v-for`와 `v-if`를 같이 쓰지 마세요. `v-if`가 우선순위가 높아 반복 변수(`item`)에 접근할 수 없습니다. 대신 `<template v-for>`로 감싸거나 `computed` 속성으로 필터링된 배열을 사용하는 것이 좋습니다.
:::

#### 예시: `<template>` 활용
```vue
<template v-for="item in items" :key="item.id">
  <li v-if="item.isVisible">
    {{ item.name }}
  </li>
</template>
```
