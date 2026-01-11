---
slug: "5-Advanced-Types"
title: "고급 타입 기능 (Advanced Types)"
---

# 고급 타입 기능

:::info 개요
**타입 추론**, **타입 단언**, **유틸리티 타입** 등 심화 내용을 다룹니다.
:::

## 1. 타입 추론 (Type Inference)
명시적으로 타입을 지정하지 않아도, 초기값을 통해 타입을 자동으로 결정합니다.

```ts
let x = 3; // number로 추론
```

## 2. 타입 단언 (Type Assertion)
개발자가 컴파일러보다 타입에 대해 더 잘 알고 있을 때, 강제로 타입을 지정합니다. (`as` 키워드)

```ts
// 빈 객체로 시작하지만, 나중에 Person 형태가 될 것임을 확신할 때
const user = {} as Person; 
user.name = "Mark";
```

:::warning 주의
타입 단언은 런타임에 영향을 주지 않으므로, 실제 객체 구조와 다를 경우 오류가 발생할 수 있습니다.
:::

---

## 3. 유틸리티 타입 (Utility Types)

기존 타입을 변형하여 새로운 타입을 만듭니다.

### 3.1 Record
키와 값의 타입을 매핑합니다.

```ts
const scores: Record<string, number> = {
  "math": 100,
  "english": 90
};
```

### 3.2 Pick & Omit
특정 속성만 선택하거나 제외합니다.

```ts
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Pick<Todo, "title" | "completed">; // title, completed만 가짐
type TodoInfo = Omit<Todo, "completed">; // completed 제외
```

### 3.3 Partial & Required
- **Partial&lt;T&gt;**: 모든 속성을 선택적(Optional)으로 만듭니다.
- **Required&lt;T&gt;**: 모든 속성을 필수(Required)로 만듭니다.

---

## 4. 구조적 타이핑 (Structural Typing)
타입의 이름이(Nominal) 아닌 **구조(Member)**가 같으면 호환된다고 판단하는 시스템입니다. (Duck Typing과 유사)

```ts
interface Pet { name: string; }
class Dog { name: string; }

let pet: Pet;
pet = new Dog(); // 구조가 같으므로 호환됨
```
