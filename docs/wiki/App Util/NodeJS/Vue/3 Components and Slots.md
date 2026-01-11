---
slug: "3-Components-and-Slots"
title: "컴포넌트와 슬롯 (Components & Slots)"
---

# 컴포넌트와 슬롯

:::info 개요
Vue 컴포넌트 시스템의 유연성을 극대화해주는 **Slot(슬롯)** 메커니즘을 상세히 알아봅니다.
:::

## 1. 슬롯 (Slot) 기초

### 1.1 슬롯이란?
컴포넌트의 태그 사이에 있는 컨텐츠를 **자식 컴포넌트의 특정 위치**에 끼워 넣을 수 있게 해주는 기능입니다. 이를 통해 컴포넌트의 재사용성을 높이고 레이아웃을 유연하게 구성할 수 있습니다.

**부모 컴포넌트**
```html
<MyComponent>
  <p>여기 사람 살아요~</p> <!-- 이 내용이 슬롯으로 전달됨 -->
</MyComponent>
```

**자식 컴포넌트 (MyComponent)**
```html
<template>
  <div class="container">
    <slot></slot> <!-- 부모가 전달한 내용이 여기 렌더링됨 -->
  </div>
</template>
```

![Slot Diagram](/img/Pasted%20image%2020240308155024.png)

---

## 2. 슬롯의 종류

### 2.1 이름이 있는 슬롯 (Named Slots)
여러 개의 슬롯이 필요할 때, `<slot>` 태그에 `name` 속성을 부여하여 각기 다른 내용을 전달할 수 있습니다.

**자식 컴포넌트**
```html
<div class="layout">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot> <!-- 기본(default) 슬롯 -->
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

**부모 컴포넌트 (`<template #name>` 문법 사용)**
```html
<BaseLayout>
  <template #header>
    <h1>헤더 영역</h1>
  </template>

  <p>메인 컨텐츠 영역 (기본)</p>

  <template #footer>
    <p>푸터 영역</p>
  </template>
</BaseLayout>
```

### 2.2 범위가 있는 슬롯 (Scoped Slots)
자식 컴포넌트의 데이터(State)를 부모가 접근해서 렌더링하고 싶을 때 사용합니다. "하위 컴포넌트의 데이터를 상위로 올려보내 렌더링을 제어"하는 강력한 패턴입니다.

**자식 컴포넌트**
```html
<ul>
  <li v-for="item in items">
    <slot :item="item" :index="index"></slot> <!-- 데이터를 슬롯 속성으로 전달 -->
  </li>
</ul>
```

**부모 컴포넌트**
```html
<MyList>
  <template #default="{ item, index }">
    <span>{{ index }} - {{ item.text }}</span> <!-- 자식의 데이터를 받아 커스텀 렌더링 -->
  </template>
</MyList>
```

:::tip 활용 사례
테이블 라이브러리, 리스트 라이브러리 같은 **Headless UI** 컴포넌트를 설계할 때 Scoped Slot은 필수적인 패턴입니다. UI(껍데기)는 부모가 결정하고, 데이터와 로직은 자식이 관리하기 때문입니다.
:::
