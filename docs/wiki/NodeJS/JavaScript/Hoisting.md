# Hoisting
:::tip Hoisting?
- Hoisting이란, 변수나 함수 선언이 실행 전에 scope 최상단으로 끌어올려지는 JS 동작 방식

:::

단적인 예로 들을 수 있는 것은
```js
function Example(){ ... }

const Example1 = ( ) => { ... }
```
`function` 으로 선언 된 `Example` 함수는 해당 함수 선언 전에, 다른 곳에서 사용이 가능하지만, `() => { }` 로 선언된 함수 `Example1`은 호이스팅이 적용되지 않아서 선언 전에는 사용이 불가능 합니다.

자세히 말하자면, 이것은 **변수 자체는 호이스팅되지만** 값(함수)은 할당되지 않기 때문입니다.



---

#NodeJS #JavaScript 

---