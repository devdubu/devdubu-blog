---
slug: "4-Async-and-Network"
title: "4. 비동기 처리와 네트워크"
---

# 비동기 처리와 네트워크

:::info 개요
JavaScript의 비동기 처리를 위한 **Promise**와 **Async/Await**, 그리고 HTTP 클라이언트 라이브러리인 **Axios** 사용 시 주의사항을 다룹니다.
:::

## 1. Promise와 비동기 패턴

자바스크립트는 싱글 스레드 기반이므로, 네트워크 요청이나 타이머 같은 작업은 비동기로 처리됩니다. ES6 Promise 도입으로 콜백 지옥을 해결했습니다.

```js
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve("Data"), 1000);
  });
};

fetchData().then(data => console.log(data));
```

## 2. Async / Await

Promise를 동기 코드처럼 편하게 작성할 수 있게 해주는 문법입니다. `try-catch`로 에러 처리를 합니다.

```js
async function getData() {
  try {
    const data = await fetchData();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
```

---

## 3. Axios와 Promise 반환 값 문제

Axios는 HTTP 요청을 보내고 **Promise**를 반환합니다. 
초보자가 흔히 하는 실수 중 하나는, 비동기 함수의 반환값을 바로 변수에 할당하려고 하는 것입니다.

### 잘못된 예시
```js
const result = axios.get('/api/user');
console.log(result); // Promise { <pending> } -> 데이터가 아님!
```

### 올바른 처리
`await`를 사용하거나 `.then()` 체이닝을 사용해야 실제 데이터(Response)에 접근할 수 있습니다.

```js
// 방법1: async/await
const response = await axios.get('/api/user');
console.log(response.data);

// 방법2: then
axios.get('/api/user').then(response => {
  console.log(response.data);
});
```

:::tip Promise의 반환값
Promise 객체는 비동기 작업의 **상태**를 가지고 있는 객체입니다. 
따라서 `console.log(promise)`를 하면 데이터가 아닌 `Promise { <pending> }` 상태가 출력됩니다.
내부 값을 사용하려면 반드시 `.then()`을 통해 언박싱(Unboxing)하거나 `await`를 사용해야 합니다.
:::

