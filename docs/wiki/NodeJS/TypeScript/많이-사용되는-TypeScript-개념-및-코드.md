---
slug: "많이-사용되는-TypeScript-개념-및-코드"
---

# 객체과 배열(참조형 변수의 타입)

:::tip ts(2739), ts(2345) 오류에는 타입 단언 특성을 사용하면 됩니다.


:::

주로 Ts에서는 아래와 같은 패턴을 많이 사용하게 됩니다.

```ts
let exampleString: string

exampleString = 'hello'
```

보통의 경우(참조 변수가 아닌 경우)는 크게 문제가 될 일은 없습니다.
대부분의 경우 문제가 되는 경우는 참조 변수 일 때 입니다.

```ts
interface Foo {
    bar: number
    bas: string
}


const foo:Foo = {}

foo.bar = 123
foo.bas = 'hello'
```

![Pasted-image-20250508154017.png](/img/이미지 창고/Pasted-image-20250508154017.png)

일반 변수와 동일하게 참조 형을 작성 시에 위와 같은 에러가 발생합니다.

:::tip `const` 를 `let`으로 변경해도 되지 않은가?
- JS에서는 `object.key` 라는 값을 변경해도 값을 변경한 것으로 인식하지 않기에, let 보다는 const를 쓰라고 유도 하면서 에러가 뜨게 됩니다.
- 사실상 객체에서 `object.key = value` 형식으로 사용하면, 


:::

```ts
interface Foo {
    bar: number
    bas: string
}


const foo:Foo = {} as Foo

foo.bar = 123
foo.bas = 'hello'
```

![Pasted-image-20250509095300.png](/img/이미지 창고/Pasted-image-20250509095300.png)

위와 같이 코드를 작성하게 되면 문제가 해결 됩니다.

:::question 왜 이런 현상이 일어나느냐?
- 기본적으로 TypeScript는 Type을 지정하지 않으면 추론 이라는 행위를 합니다.
- 하지만, 특히 참조형 변수에서는 아무리 Foo 라는 Type을 지정해도, 
- 결국 내부 `key:value` 값이 초기화 되어있지 않다면, 해당 내부 변수를 추론 할 수 없습니다.
- 이때는 결국은 **추론이 아닌 강제**로 type을 걸어주고, **TypeScript에 확신**을 주어야 할 때, `as` 라는 문법을 사용합니다.

:::

그에 대한 개념은 아래 링크에 자세히 나와 있습니다.

[TypeScript의 Type#타입 단언](TypeScript 문법/TypeScript의-Type.md#타입 단언)


# 특정 타입을 정하기 어려운 경우

기존에는 특정 타입을 정하기 어려운 경우는 기본적으로 `any`를 사용했습니다.
하지만, 기본적으로 이제는 tsconfig.ts 의 any를 에러를 뱉는 옵션이 default 가 true 변경 되어, 에러를 뱉게 됩니다.

이때 사용할 수 있고, ts 측에서도 권장하는 type은 `unknown` 입니다.

기본적으로 `unknown`을 사용하면 any와 비슷한 효과를 줍니다.

## 객체 형태는 맞는데, value 값이 특정해지지 않는 경우

위 경우는 아래와 같은 타입을 사용하면 됩니다.

```ts
const object: Record<string, unknown>
```

위 처럼 사용하면 key 값은 string 이고, value 값은 아무 값이나 와도 됩니다.

같은 의미로 매번 interface를 지정하기 힘들지만, key, value 가 무조건 string으로 오는 객체라면

```ts
const object : Record<string, string>
```

로 지정하면 됩니다.

# interface 지정 시, 외부에서 여러 타입을 지정 해야 하는 경우

대부분의 경우에는 사용되지 않지만, 간혹 가다가 같은 key 값이어도 쓰이는 방면에 따라서 타입이 각기 달라지는 interface를 구축해야할 때가 있습니다.

이때는 그에 맞게 interface를 구축하기 보단, 아래와 같이 Generic 타입을 구축 하는게 훨씬 편하고 직관적입니다.

```ts
interface ExampleType{
	ex1: string
	ex2: number
}

interface ExampleType1{
	ex1: string
	ex2: number
}

const exampleValue: ExampleType = {
	ex1: 'string',
	ex2: 'string'
}

const exampleValue: ExampleType1 = {
	ex1: 'string',
	ex2: {
		ex1: 'string',
		ex2: 'string'
	}
}
```

위 처럼 매번 같은 `key` 값에 매번 value 값이 다르다는 이유로 interface를 생성하기엔 비 효율적이니 아래와 같이 generic 을 사용합니다.

```ts
interface ExampleType<T>{
	ex1: string
	ex2: T
}

const exampleValue: ExampleType<string> = {
	ex1: 'string',
	ex2: 'string'
}

const exampleValue: ExampleType<number> = {
	ex1: 'string',
	ex2: 1
}

```