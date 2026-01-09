---
slug: "2-Module-Systems"
title: "2. 모듈 시스템 (CommonJS & ESM)"
---

# 모듈 시스템

:::info 개요
소프트웨어 엔지니어링의 핵심인 **모듈화**의 역사와 Node.js의 **CommonJS**, 그리고 최신 표준 **ESM(ECMAScript Modules)**을 비교 분석합니다.
:::

## 1. 모듈 시스템의 역사

### 1.1 초기 JavaScript
`script` 태그에 의존하던 시절, 모듈 시스템은 존재하지 않았습니다. 전역 스코프 오염과 의존성 관리 문제는 개발자들의 골칫거리였습니다.

### 1.2 노출식 모듈 패턴 (Revealing Module Pattern)
**IIFE(즉시 실행 함수)**와 **클로저(Closure)**를 사용하여 `private` 변수를 흉내 내고, 공개할 API만 `return`하는 방식입니다. CommonJS의 원형이 되었습니다.

```js
const myModule = (() => {
  const privateVar = 'secret';
  return {
    publicMethod: () => console.log(privateVar)
  };
})();
```

---

## 2. CommonJS (CJS)

Node.js가 채택한 첫 번째 모듈 시스템입니다. 동기적(Synchronous)으로 작동하며 서버 사이드 환경에 적합합니다.

### 2.1 특징
- **require()**: 파일 시스템에서 모듈을 동기적으로 읽고 실행합니다.
- **module.exports**: 모듈의 공개 API를 정의합니다.
- **싱글톤**: 모듈은 처음 로드될 때 캐싱되며, 이후 요청 시 캐시된 객체를 반환합니다.

### 2.2 사용 예시
```js
// math.js
exports.add = (a, b) => a + b;

// main.js
const math = require('./math');
console.log(math.add(1, 2));
```

### 2.3 동작 원리 (래핑)
Node.js는 모듈 코드를 실행하기 전 함수로 감쌉니다. 이 덕분에 전역 변수 오염이 방지됩니다.

```js (가상 코드)
(function (exports, require, module, __filename, __dirname) {
  // 사용자가 작성한 코드가 여기 들어감
});
```

---

## 3. ESM (ECMAScript Modules)

JS 표준(ES6)으로 정의된 모듈 시스템입니다. 브라우저와 서버 모두에서 사용할 수 있는 통합된 표준입니다.

### 3.1 특징
- **import / export**: 정적 분석이 가능한 문법을 사용합니다.
- **비동기 로딩**: 브라우저 환경을 고려하여 비동기적으로 모듈을 로드합니다.
- **엄격 모드**: 기본적으로 `use strict`가 적용됩니다.

### 3.2 사용 예시
```js
// math.mjs
export const add = (a, b) => a + b;

// main.mjs
import { add } from './math.mjs';
console.log(add(1, 2));
```

:::warning CJS와 ESM 혼용
Node.js에서 두 시스템을 혼용할 때는 주의가 필요합니다.
- CJS에서는 ESM을 `require()` 할 수 없습니다 (dynamic import 사용 필요).
- ESM에서는 CJS를 `import` 할 수 있습니다.
:::
