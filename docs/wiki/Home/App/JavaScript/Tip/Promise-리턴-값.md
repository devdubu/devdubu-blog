---
시작 날짜: 2024-11-07
종료 날짜: 2024-11-07
분류: 공부
sticker: vault//이미지/개발 로고/TechIconSVG/JavaScript.svg

slug: "Promise-리턴-값"
---

# 원인
이유는 간단하다.
```ts
import axios from 'axios';

// 비동기 함수 선언
async function fetchData(url: string): Promise {
  const response = await axios.get(url);
  return response.data;
}

// 사용 예시
interface User {
  id: number;
  name: string;
}

async function getUser() {
  const userPromise: Promise<User> = fetchData<User>('https://api.example.com/user/1');
  const user = await userPromise;
  console.log(user.id, user.name);
}

```

위와 같이 작성하게 된다면 js 이자식이 promise 반환값으로 던지게 된다.
~~개자식~~

이를 해결하려면 어쩌냐 계속 보고 있었는데 결국 회사 코드에서 발견해서 해결했다 와 진짜 이걸 이렇게 오래 걸리면서 해결하네
# 해결
```ts
import axios from 'axios';

// 비동기 함수 선언
async function fetchData<T>(url: string): Promise<T> {
  const response = await axios.get<T>(url);
  return response.data;
}

// 사용 예시
interface User {
  id: number;
  name: string;
}

async function getUser() {
  const userPromise: Promise<User> = fetchData<User>('https://api.example.com/user/1');
  const user = await userPromise;
  console.log(user.id, user.name);
}
```
- 위는 GPT의 예시이긴 하다만, `<User>` 쪽에다가 내가 원하는 Type을 붙여주기만 하면 된다.
- 