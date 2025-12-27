---
sticker: vault//이미지/개발 로고/TechIconSVG/Vue.js.svg

slug: "Composable-함수"
---
# Composable 함수

:::tip Composable?
- Vue의 반응형 시스템과 생명주기 훅을 활용하여 상태를 갖는 로직을 캡슐화 하고 재사용하기 위해서 만들어진 함수

:::

결론적으로는 일반적인 함수와 크게 차이가 있진 않다.
대신 결정적인 차이점은, Vue반응형 시스템 혹은 생명주기 훅을 내부에서 활용하느냐 안하느냐의 차이점이다.

## 일반 함수

```js
// utils/useCounter.js

// 이름은 use로 시작하지만 Vue API가 없어서 컴포저블이 아님!
export function useCounter() {
  let count = 0; // 일반 변수 (Not Reactive)

  const increment = () => {
    count++;
    // 콘솔에는 찍히지만, 화면은 절대 바뀌지 않음
    console.log(`Current count: ${count}`);
  };

  return { count, increment };
}
```

## Composable 함수
```js
// composables/useCounter.js
import { ref } from 'vue'; // <-- ✨ Vue의 심장을 이식하는 단 한 줄의 코드

// 이제 이 함수는 명백한 컴포저블입니다.
export function useCounter() {
  const count = ref(0); // <-- '규칙' 적용: Vue의 반응성 API를 사용함

  const increment = () => {
    count.value++; // .value로 접근
  };

  return { count, increment };
}
```