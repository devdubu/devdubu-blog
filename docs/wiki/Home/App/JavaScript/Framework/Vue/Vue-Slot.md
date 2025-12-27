---
시작 날짜: 2025-04-10
종료 날짜: 2025-04-10
sticker: vault//이미지/개발 로고/TechIconSVG/Vue.js.svg

slug: "Vue-Slot"
---
# Slot
내가 생각했던 slot과는 괴리감이 있다보니, 정리를 위해서 한번 다시금 정리해보려고 한다.

:::info Slot Content와 Outlet

:::

## Simple한 구조
기본적으로 Vue에서 컴포넌트를 사용하기 위해서는 HTML 태그와 유사한 방법으로 사용됩니다.
```vue
<template>
	<ExampleComponent></ExampleComponent>
</template>
```
위와 같은 형식으로 사용됩니다.
보통은 HTML 태그 안에 컨텐츠를 넣을 때는 `></`안에 넣을 때가 많습니다.
`slot` 자체는 저 해당 내부에 넣으려고 할 때, 만약 컴포넌트라면? 해당 위치에 넣어줘라 라는 것입니다.
즉,
```vue
<template>
	<ExampleComponent![Diagram.svg](/img/이미지 창고/Diagram.svg)>
		여기 사람 살아요~
	</ExampleComponent>
</template>
```
![Pasted-image-20240308155024.png](/img/이미지 창고/Pasted-image-20240308155024.png)
위 그림과 같이 설명이 됩니다.
## Slot에서 함수와 데이터 전달에 대한 부분
![Pasted-image-20240308153046.png](/img/이미지 창고/Pasted-image-20240308153046.png)

실제 `MyComponent.vue`에서 함수를 만든 뒤에 

![이미지 창고/1. App/NodeJS/NestJS/JWT 인증,인가/Diagram-2.svg](/img/이미지 창고/Diagram-2.svg)