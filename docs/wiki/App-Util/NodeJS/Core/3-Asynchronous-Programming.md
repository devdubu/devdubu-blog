---
slug: "3-Asynchronous-Programming"
title: "3. 비동기 프로그래밍 (Asynchronous Patterns)"
---

# 비동기 프로그래밍

:::info 개요
Node.js의 비동기 제어 흐름은 **Callback**에서 시작하여 **Promise**, 그리고 **Async/Await**로 진화했습니다.
이 문서에서는 각 패턴의 작동 원리와 장단점, 그리고 실전에서의 활용법을 깊이 있게 다룹니다.
:::

## 1. 콜백 패턴 (Callback Pattern)

JavaScript에서 함수는 일급 객체이므로, 함수의 인자로 전달되어 나중에 실행될 수 있습니다. 이를 **CPS(Continuation-Passing Style)**라고 합니다.

### 1.1 동기 vs 비동기 콜백
- **동기 콜백**: 함수가 반환하기 전에 즉시 실행됩니다. (예: `Array.prototype.map`)
- **비동기 콜백**: 이벤트 루프의 다음 틱이나 I/O 완료 시점에 실행됩니다. (예: `setTimeout`, `fs.readFile`)

:::warning Zalgo Unleashing
API는 일관되게 동기적이거나 비동기적이어야 합니다. 상황에 따라 다르게 동작하면 예측 불가능한 버그(Zalgo)를 유발합니다. 항상 `process.nextTick()` 등을 사용하여 비동기성을 보장하세요.
:::

### 1.2 콜백 지옥 (Callback Hell)
중첩된 콜백은 가독성을 해치고 에러 처리를 어렵게 만듭니다.

```js (bad)
getData(function(a) {
  getMoreData(a, function(b) {
    getMoreData(b, function(c) {
      // ...
    });
  });
});
```

---

## 2. EventEmitter

Node.js 코어 `events` 모듈의 `EventEmitter`는 옵저버 패턴의 구현체입니다. 특정 이벤트가 발생하면 등록된 리스너들에게 알립니다.

```js
const EventEmitter = require('events');
const myEmitter = new EventEmitter();

myEmitter.on('event', () => {
  console.log('이벤트 발생!');
});

myEmitter.emit('event');
```

:::tip Callback vs EventEmitter
- **Callback**: 하나의 작업이 완료되었을 때 알림을 받을 때 적합.
- **EventEmitter**: 같은 이벤트가 여러 번 발생하거나, 여러 리스너가 필요할 때 적합.
:::

---

## 3. Promise

ES6에서 표준화된 **Promise**는 비동기 작업의 최종 성공 또는 실패를 나타내는 객체입니다.

### 3.1 상태 (States)
- **Pending (대기)**: 초기 상태.
- **Fulfilled (이행)**: 작업 성공.
- **Rejected (거부)**: 작업 실패.

### 3.2 체이닝 (Chaining)
`then()`을 사용하여 비동기 작업을 순차적으로 연결할 수 있으며, `catch()`로 에러를 한곳에서 처리할 수 있습니다.

```js
doSomething()
  .then(result => doSomethingElse(result))
  .then(newResult => doThirdThing(newResult))
  .catch(error => console.error(error));
```

---

## 4. Async / Await

ES2017(ES8)에 도입된 문법으로, 비동기 코드를 동기 코드처럼 작성할 수 있게 해줍니다. 내부적으로는 Promise를 사용합니다.

### 4.1 가독성 혁명
```js
async function main() {
  try {
    const result = await doSomething();
    const newResult = await doSomethingElse(result);
    console.log(newResult);
  } catch (error) {
    console.error(error);
  }
}
```

### 4.2 주의사항: 무한 재귀 프로미스 체인
재귀적으로 Promise를 반환하는 함수(`return recursiveFn()`)는 메모리 누수를 유발할 수 있습니다. Promise가 해결되지 않고 체인이 계속 길어지기 때문입니다.
이를 해결하려면 `return` 없이 호출하거나(불필요한 체이닝 방지), `async/await`와 `while` 루프를 사용하는 것이 안전합니다.

```js (good)
async function loop() {
  while(true) {
    await delay(1000);
    console.log('Tick');
  }
}
```
