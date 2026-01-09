---
slug: "2-ES6-and-Modules"
title: "2. ES6+ 문법 및 모듈 시스템"
---

# ES6+ 문법 및 모듈 시스템

:::info 개요
ECMAScript 2015(ES6) 이후 추가된 주요 문법(`let`/`const`, 구조 분해 할당, 템플릿 리터럴)과 자바스크립트의 표준 모듈 시스템(`import`/`export`)을 다룹니다.
:::

## 1. 변수 선언: let, const

ES6에서는 블록 스코프(Block Scope)를 가지는 `let`, `const`가 도입되었습니다.

- **let**: 재할당 가능.
- **const**: 재할당 불가능 (상수). 단, 객체 내부 속성은 변경 가능.
- **var**: 함수 스코프, 호이스팅 문제로 사용 지양.

## 2. 모듈 시스템 (ES Modules)

자바스크립트 코드를 여러 파일로 분리하고 재사용할 수 있게 해줍니다.

### 2.1 내보내기 (Export)

**Default Export**: 파일당 하나만 가능.
```js
// math.js
export default function add(a, b) {
  return a + b;
}
```

**Named Export**: 여러 개 가능.
```js
// utils.js
export const PI = 3.14;
export function multiply(a, b) { ... }
```

### 2.2 가져오기 (Import)

```js
import add from './math.js'; // Default Import (이름 변경 가능)
import { PI, multiply as mul } from './utils.js'; // Named Import
import * as Utils from './utils.js'; // 전체 가져오기
```

---

## 3. 구조 분해 할당 (Destructuring)

객체나 배열의 값을 해체하여 별도 변수에 담는 방식입니다.

```js
// 객체
const user = { name: 'Kim', age: 30 };
const { name, age } = user;

// 배열
const numbers = [1, 2, 3];
const [first, second] = numbers;
```

## 4. 템플릿 리터럴 (Template Literals)
백틱(`` ` ``)을 사용하여 문자열 내 변수 삽입이 가능합니다.

```js
const greeting = `Hello, ${name}!`;
```
