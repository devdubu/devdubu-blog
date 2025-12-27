---
slug: "Vue-디자인-패턴"
---
# 디자인 패턴
## 디자인 패턴?
:::question 아키텍처와 클린 코드?
- 서로 독립적인 작은 단위로 기능들을 나누어 잘 합성할 수 있도록 해주는 것이다.
- 잘게 나누어진 기능 등을 합하여 독립적이며 기능적인 의미를 가진 모듈을 만들어 내는 것이다.

:::

궁극적인 목표는 유지보수성과 재사용성이다.
그리고 디자인 패턴은 컴포넌트 개발 및 관리를 위한 모범 사례/기술이다.

UI 컴포넌트라면 독립적인 기능이라 하면 props와 렌더 함수,hooks와 같은 단위를 찾을 수 있겠고,
이를 합성한 모듈은 아토믹 디자인 패턴의 각 유닛이 될 수 있습니다.

:::tip 컴포넌트 디자인 패턴
- 컴포넌트를 개발하면서 마주치게 되는 특정 문제를 해결하면서, 소프트웨어 유지보수성 / 재 사용성을 높이는 개발을 위한 도구다.

:::

즉, 디자인 패턴은 다음과 같은 용도로 사용할 수 있다.
1. 사용 및 유지 관리가 더 쉬운 컴포넌트 개발
2. 컴포넌트를 버그에 취약하게 만드는 일반적인 실수 방지
3. 앱에 가장 적합한 아키텍처 결정

:::warning 물론 디자인 패턴이 만병 통치약이 아니다.
- 특정 패턴을 사용하려면 당신이 속한 개발팀 내의 합의가 필요하다.
- 자바의 GOF에서처럼 장황 하면서 자주 쓰지 않는 패턴들은 코드를 난독화 한다.
:::

1. 이것들은 지침이지, 규칙이 아니다.
2. 팀의 의견과 경험이 중요하다.
3. 당신의 팀에 가장 적합한 것을 선택하라

## Vue3의 컴포넌트 디자인 패턴
![Pasted-image-20240308144842.png](/img/이미지 창고/Pasted-image-20240308144842.png)
# Components 디자인 패턴
## Slots
### Props 중심 컴포넌트의 문제점
![Pasted-image-20240308145245.png](/img/이미지 창고/Pasted-image-20240308145245.png)
:::bug props는 설정 덩어리이다.
- props가 구조를 바꾸고
- props가 정의 순서와 사용 순서가 다르고
- props이 거대해진다면

:::

컴포넌트의 이해와 확장이 어려워진다.

### slot이 무엇인가?
slot은 콘텐츠 배포 outlet 역할을 하는 커스텀 Vue 엘리먼트다.
![Pasted-image-20240308145647.png](/img/이미지 창고/Pasted-image-20240308145647.png)
![Pasted-image-20240308145702.png](/img/이미지 창고/Pasted-image-20240308145702.png)

:::note Slot?
- slot은 표준 html 요소 처럼 컨텐츠를 넘길 수 있도록 해주는 도구다

:::

```vue
<!-- Just passing a string -->
<div>
  This is just normal text
</div>

<!-- Composing text with other HTML elements -->
<div>
  This is text with <strong>other HTML elements</strong>.
</div>
```
즉, 텍스트를 전달하든 다른 엘리먼트를 추가하든 관계 없이
컴포넌트는 화면에서 예상대로 렌더링 된다.
Vue 컴포넌트의 슬롯을 사용하면, 비슷한 효과를 얻을 수 있다.

### Slot을 사용하는 방법
슬록을 사용하는 방법은 어렵지 않다.
추가 설정은 따로 필요 없다.
컴포넌트의 템플릿에 슬롯 요소를 추가하기만 하면 된다.
#### Props 버전
```vue
<template>
  <main>
    <BaseButton text="Cancel" />
    <BaseButton text="Submit" right-icon="right-arrow" />
  </main>
</template>
```
`App.vue` 

#### Slot 버전
```vue
<template>
  <main>
    <BaseButton>Cancel</BaseButton>
    <BaseButton>Submit <span class="icon right-arrow"></span></BaseButton>
  </main>
</template>
```
`App.vue`

### Slot에 Defualt 컨텐츠 적용하기
```vue
<template>
  <button class="button">
    <slot>Submit</slot>
  </button>
</template>
```
`BaseButton.vue`
슬롯에 값을 제공하면 default 컨텐츠를 오버라이드(재정의)한다.


### 여러개의 슬롯을 사용하기
![Pasted-image-20240308152508.png](/img/이미지 창고/Pasted-image-20240308152508.png)
- 이를 위해선 named slot과 template block이 필요하다.
![Pasted-image-20240308153046.png](/img/이미지 창고/Pasted-image-20240308153046.png)
:::question named slot이 뭔가요?
- named slot은 서로 고유하도록 설정하는 방법이다.
- 이를 위해 슬롯에는 사용자 지정 식별자로 지정할 수 있는 name props가 있다.
:::

```vue
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```
그럼 특정 슬롯에 컴포넌트는 어떻게 전달할까

#### template block이 뭔가요?
`<template>` 블록은 SFC의 HTML을 정의하는 방법과 유사하게 슬롯에 전달해야 하는 HTML의 특정 블록을 정의 하는데 사용할 수 도 있다.
이를 위하여 `v-slot` 디렉티브를 적용해야 한다.
![Pasted-image-20240308155024.png](/img/이미지 창고/Pasted-image-20240308155024.png)

---

#NodeJS #Vue #Vue2 #FrontEnd #JavaScript #Vue3

---