---
slug: "1-JS-Basic-Syntax"
title: "기초 문법 및 함수"
---

# 기초 문법 및 함수

:::info 개요
JavaScript의 함수 선언 방식(Arrow Function, IIFE)과 실행 컨텍스트의 핵심인 **Hoisting**, 그리고 타이머 함수에 대해 다룹니다.
:::

## 1. 함수 선언 방식

### 1.1 화살표 함수 (Arrow Function)
ES6부터 도입된 간결한 함수 선언 방식입니다. `function` 키워드 대신 `=>`를 사용합니다.

```js
const double = x => x * 2;
console.log(double(2)); // 4
```

- **객체 반환 시 주의**: 객체 리터럴 `{}`을 반환할 때는 소괄호 `()`로 감싸야 합니다.
  ```js
  const getObj = () => ({ name: 'Kim' }); // O
  const wrongObj = () => { name: 'Kim' }; // X (undefined)
  ```

### 1.2 즉시 실행 함수 (IIFE)
정의되자마자 즉시 실행되는 함수입니다. 전역 스코프 오염을 방지하기 위해 사용합니다.

```js
(function() {
  console.log('Immediate Execution');
})();
```

---

## 2. 호이스팅 (Hoisting)

:::tip 개념
**Hoisting**은 변수 및 함수 선언부가 유효 범위(Scope)의 최상단으로 끌어올려지는 듯한 현상을 말합니다.
:::

### 2.1 함수 호이스팅
**함수 선언문**은 완전히 호이스팅되어, 선언 전 호출이 가능합니다.

```js
double(); // Works perfectly

function double() {
  console.log('doubled');
}
```

반면, **함수 표현식**(`const`, `let` 할당)은 변수 호이스팅 규칙을 따르므로 선언 전 호출 시 에러가 발생합니다.

```js
// double(); // Error: Cannot access 'double' before initialization
const double = function() { ... };
```

---

## 3. 타이머 함수

- `setTimeout(func, delay)`: 일정 시간(`delay` ms) 후 함수 실행.
- `setInterval(func, delay)`: 일정 시간 간격마다 함수 반복 실행.
- `clearTimeout(id)` / `clearInterval(id)`: 타이머 실행 취소.

```js
const timer = setTimeout(() => console.log('3초 후 실행'), 3000);
clearTimeout(timer); // 실행 취소
```

---

## 4. 에러 처리와 Safe Navigation

JavaScript는 `null`과 `undefined`에 매우 관대하면서도 엄격합니다. 특히 객체 접근 시 주의해야 합니다.

### 4.1 undefined vs null
- **undefined**: 변수가 선언되었으나 값이 할당되지 않음.
- **null**: 개발자가 의도적으로 "값이 없음"을 명시함.

### 4.2 옵셔널 체이닝 (Optional Chaining) `?.`
객체의 속성이 존재하는지 확인하지 않고 접근하면 에러가 발생합니다. 이를 방지하기 위해 사용합니다.

```js
const user = {};
// console.log(user.profile.name); // Error: Cannot read properties of undefined
console.log(user.profile?.name); // undefined (에러 없음)
```

### 4.3 Null 병합 연산자 (Nullish Coalescing) `??`
왼쪽 피연산자가 `null` 또는 `undefined`일 때만 오른쪽 피연산자를 반환합니다. (`||`와 다름)

```js
const foo = null ?? 'default string';
console.log(foo); // "default string"

const count = 0;
const num = count || 10; // 10 (0은 falsy)
const num2 = count ?? 10; // 0 (0은 null/undefined가 아님)
```

