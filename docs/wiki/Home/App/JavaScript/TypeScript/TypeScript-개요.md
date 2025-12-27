---
시작 날짜: 2025-05-02
종료 날짜: 2025-05-02
sticker: vault//이미지/개발 로고/TechIconSVG/TypeScript.svg

slug: "TypeScript-개요"
---

# Primitive Type

- 오브젝트와 레퍼런스 형태가 아닌 실제 값을 저장하는 자료형이다.
- primitive 형의 내장 함수를 사용 가능한 것은 JavaScript 처리 방식 덕분이다.
	- boolean
	- number
	- string
	- symbol
	- null
	- undefined
- literal 값으로 Primitive 타입의 서브 타입을 나타낼 수 있다.
## Type Casing

:::tip TypeScript 핵심 primitive types은 모두 소문자 이다.
- Number, String, Boolean 또는 Object 유형이 위에서 권장한 소문자 버전과 동일하다고 생각하고 싶을 수 있다.
- 그러나 이러한 유형은 primitives를 나타내지 않으며, 타입으로 더 이상 사용해서는 안된다.

:::

- 아래는 잘 못된 primitive type이다. -> 모두 소문자여야 한다.
```typescript
function reverse(s:String): String{
	return s.split("").reverse().join("");
}
reverse("hello world");
```

```typescript
function reverse(s:string):string{
	return s.split("").reverse().join("");
}
reverse("hello world");
```

## TypeScript Type

[TypeScript의 Type](../../../../1. App/NodeJS/TypeScript/TypeScript 문법/TypeScript의-Type.md)


# Type Annotation

- Type Annotation은 JavaScript에서는 없었던 type을 지정해주는 문법이다.
- 아래와 같이 타입을 지정하거나, 혹은 typescript가 타입을 추측하여 지정하는 경우도 있다 아래의 예시를 보면
```typescript
let a = "Mark";

a = 39;
// JavaScript 상에는 문제가 없는 코드 이지만, 
// TypeScript 에서는 Type이 위에서 String으로 명시되어있기에, 해당 코드는 에러를 발생한다.

let b:number

a = 39;
//b의 변수 선언과 같이, 초기 값이 없으면 무조건 type을 지정해줘야한다.
```


# Type System

:::tip 컴파일러에게 사용하는 타입을 명시적으로 지정하는 시스템
- 컴파일러가 자동으로 타입을 추론하는 시스템

:::

[TypeScript의 추론](../../../../1. App/NodeJS/TypeScript/TypeScript 문법/TypeScript의-추론.md)

# Type Alias

:::tip Type Alias?
- Interface랑 비슷 해 보인다.
- Primitive, Union Type, Tuple, Function
- 기타 직접 작성해야하는 타입을 다른 이름으로 지정할 수 있다.
- 만들어진 타입의 refer로 사용하는 것이지 타입을 만드는 것은 아니다.


:::

# TypeScript Complier
---

[TypeScript Compiler](../../../../1. App/NodeJS/TypeScript/TypeScript 문법/TypeScript Complier/TypeScript-Compiler.md)



# Interfaces
## What are Interfaces?

:::note JS에서 Interface?
- JS로 컴파일 될때는 Interface가 적용되지 않는다.
- 하지만, 컴파일 과정에서 타입 체크 및 검사를 통해서 해당 interface에 대입하여, 검사를 진행합니다.


:::

```ts
function hello(person: { name: string; age: number; }): void {
    console.log(`안녕하세요! ${person.name} 입니다.`);
}

const p: { name: string; age: number; } = {
    name: 'Mark',
    age: 35
};

hello(p); // 안녕하세요! Mark 입니다.

///////////////////////////////////////////////////////////////

interface Person {
    name: string;
    age: number;
}

function hello(person: Person): void {
    console.log(`안녕하세요! ${person.name} 입니다.`);
}

const p: Person = {
    name: 'Mark',
    age: 35
};

hello(p); // 안녕하세요! Mark 입니다.
```
`interface.ts`

[TypeScript Interface](../../../../1. App/NodeJS/TypeScript/TypeScript 문법/TypeScript-Interface.md)


# Classes

:::note What are Classes??
- object를  만드는 blueprint(청사진, 설계도)
- 클래스 이전에 object를 만드는 기본적인 방법 function
-  JavaScript 에도 class 를 es6 부터 사용 가능
- OOP을 위한 초석
- TypeScript 에서는 클래스도 사용자가 만드는 타입의 하나


:::

[TypeScript Class](../../../../1. App/NodeJS/TypeScript/TypeScript 문법/TypeScript-Class.md)


---

#NodeJS #TypeScript #JavaScript 

---


