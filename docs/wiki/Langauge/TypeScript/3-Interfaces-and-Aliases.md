---
slug: "3-Interfaces-and-Aliases"
title: "3. 인터페이스와 타입 별칭"
---

# 인터페이스와 타입 별칭

:::info 개요
객체의 구조를 정의하는 두 가지 방법인 **Interface**와 **Type Alias**의 차이점과 사용법을 다룹니다.
:::

## 1. 인터페이스 (Interface)

객체의 타입(Spec)을 정의하는 역할을 합니다. 컴파일 시점에만 존재하며 JS로 컴파일되면 사라집니다.

```ts
interface Person {
  name: string;
  age: number;
  sex?: string; // 선택적 속성 (Optional)
  readonly id: number; // 읽기 전용
}

const user: Person = {
  id: 1,
  name: "Mark",
  age: 35
};
```

### 확장 (Extends)
`extends` 키워드를 사용하여 상속받을 수 있습니다.

```ts
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}
```

---

## 2. 타입 별칭 (Type Alias)

타입에 이름을 붙여 재사용할 수 있게 합니다. 객체뿐만 아니라 유니온, 튜플 등 모든 타입을 정의할 수 있습니다.

```ts
type ID = string | number; // Union Type
type User = {
  name: string;
  age: number;
};
```

### Intersection (&)
인터페이스의 extends와 유사하게 타입을 합칠 수 있습니다.

```ts
type Animal = { name: string };
type Dog = Animal & { breed: string };
```

---

## 3. Interface vs Type Alias

| 특징 | Interface | Type Alias |
| --- | --- | --- |
| **목적** | 객체의 구조 정의 | 타입에 이름 부여 |
| **확장** | `extends` 사용 | Intersection (`&`) 사용 |
| **선언 병합** | 가능 (같은 이름으로 선언 시 합쳐짐) | 불가능 |
| **주 사용처** | 객체, 클래스 구현, 라이브러리 타입 | 유니온, 튜플, 함수 타입 |

공식 문서에서는 가능한 경우 **Interface** 사용을 권장하지만, 유니온 타입 등이 필요할 때는 **Type Alias**를 사용합니다.
