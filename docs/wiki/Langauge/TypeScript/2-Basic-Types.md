---
slug: "2-Basic-Types"
title: "2. 기본 타입 (Basic Types)"
---

# 기본 타입

:::info 개요
TypeScript에서 제공하는 기본 데이터 타입과 특수한 타입들(`any`, `unknown`, `never`, `void`)을 알아봅니다.
:::

## 1. 기본 타입 (Primitives)

JavaScript의 기본 타입을 그대로 사용합니다. 반드시 **소문자**(`string`, `number` 등)를 사용해야 합니다.

```ts
let name: string = "Mark";
let age: number = 36;
let isDone: boolean = false;
```

### 배열 (Array)
```ts
let list: number[] = [1, 2, 3];
let list2: Array<number> = [1, 2, 3]; // 제네릭 문법
```

### 튜플 (Tuple)
길이와 타입이 고정된 배열입니다.
```ts
let x: [string, number];
x = ["hello", 10];
```

---

## 2. 특수 타입

### any
어떤 타입이든 허용합니다. 타입 검사를 무력화하므로 사용을 지양해야 합니다.

```ts
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false;
```

### unknown
`any`와 비슷하지만 더 안전합니다. 값을 사용하기 전에 타입을 좁혀야(Narrowing) 합니다. (TS 3.0+)

```ts
let value: unknown = 4;
// value.toFixed(); // Error: Object is of type 'unknown'.

if (typeof value === 'number') {
  value.toFixed(); // OK
}
```

### void
값을 반환하지 않는 함수의 반환 타입으로 주로 사용됩니다.

```ts
function warnUser(): void {
  console.log("This is my warning message");
}
```

### never
절대 발생하지 않는 값의 타입입니다. (예: 항상 에러를 던지거나 무한 루프).

```ts
function error(message: string): never {
  throw new Error(message);
}
```
