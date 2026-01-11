---
slug: "4-Classes-and-Generics"
title: "클래스와 제네릭 (Classes & Generics)"
---

# 클래스와 제네릭

:::info 개요
객체 지향 프로그래밍을 위한 **Class**의 심화 기능(접근 제어자)과 재사용성을 극대화하는 **Generic**을 다룹니다.
:::

## 1. 클래스 (Class)

TypeScript는 ES6 클래스에 타입 기능과 접근 제어자를 추가했습니다.

### 1.1 접근 제어자 (Access Modifiers)
- **public**: 어디서나 접근 가능 (기본값).
- **private**: 클래스 내부에서만 접근 가능 (`#` 문법과 유사하나 컴파일 타임 체크).
- **protected**: 클래스 내부 및 상속받은 자식 클래스에서 접근 가능.

```ts
class Car {
  private speed: number = 0;
  protected brand: string;

  constructor(brand: string) {
    this.brand = brand;
  }

  public accelerate() {
    this.speed += 10;
  }
}
```

---

## 2. 제네릭 (Generics)

타입을 변수처럼 사용하여 컴포넌트(함수, 클래스, 인터페이스)를 다양한 타입에 대해 재사용할 수 있게 합니다.

### 2.1 제네릭 함수
타입 `T`를 인자로 받아, 입력과 출력의 타입을 연결합니다.

```ts
function identity<T>(arg: T): T {
  return arg;
}

const output = identity<string>("myString"); // 타입은 string
const outputNumber = identity(100); // 타입 추론(number)
```

### 2.2 제네릭 인터페이스
같은 구조형태 이지만 내부 속성의 타입만 다를 때 유용합니다.

```ts
interface ResponseData<T> {
  success: boolean;
  data: T;
}

const userRes: ResponseData<{ name: string }> = {
  success: true,
  data: { name: "Mark" }
};
```

### 2.3 제네릭 제약조건 (Constraints)
특정 속성을 가진 타입만 허용하도록 제한할 수 있습니다.

```ts
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); // length가 있음을 보장
  return arg;
}
```
