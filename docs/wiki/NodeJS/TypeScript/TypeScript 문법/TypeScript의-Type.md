---
slug: "TypeScript의-Type"
---

# Boolean
---

```typescript
let isDone:boolean = false;

isDone = true

console.log(typeof isDone);
// boolean
```
## 실행하는 방법
```bash
# ts를 js로 변환 시켜주는 명령어
npx tsc
node boolean.js
```


# Number / number
---
- Javascript와 같이 TypeScript의 모든 숫자는 부동 소수점 값이다.
- TypeScript는 16진수 및 10진수 리터럴 외에도 ECMAScript 2015에 도입된 2진수 및 8진수도 지원한다.
```typescript
let decimal: number = 6

let hex: number = 0x00d

let binary: number = 0b1010

let octal: number = 0o744

let NotANumber: number = NaN

let underscoreNum: number = 1_000_000;
```

# String
---
- 다른 언어에서와 마찬가지로이 텍스트 형식을 참조하기 위해 string 형식을 사용합니다.
- JavaScript와 마찬가지로, TypeScript는 문자열 데이터를 둘러싸기 위해 큰 따옴표(")나, 작은 따옴표(') 를 사용합니다.
```typescript
let name: string = "mark";

name = 'anna';
```

:::quote Template String
- 행에 걸쳐 있거나, 표현식을 넣을 수 있는 문자열
- 이 문자열은 backtick(=backquote) 기호에 둘러쌓여 있습니다.
- 포함된 표현식은 `${expr}` 와 같은 형태로 사용합니다.

:::

```typescript
let fullName: string = `Bob Bobbington`;
let age: number = 38;

let sentence: string = `Hello, my name is ${ fullName }
I'll be ${ age + 1 } years old next month `

//template string 을 사용하지 않을 경우
let sentence: string = "Hello, my name is " + fullName + ".\n\n" + "I'll be " + (age + 1) + " years old next month"

```

# Symbol
---
:::note Symbol
- primitive type의 값을 담아서 사용한다.
- 고유하고 수정 불가능한 값으로 만들어 준다.
- ECMAScript 2015의 Symbol 입니다.
- `new Symbol`로 사용 할수 없다.
- Symbol을 함수로 사용해서 symbol 타입을 만들 수 있다.

:::

## Symbol을 적용하기 위해서 해야할 사전 작업
```json
...
"lib" : [
	"ES2015",
	"DOM"
]
...
```

# Undefined & Null
---
- TypeScript에서,  undefined와 null은 실제로 각각 undefined와 null이라는 타입을 가진다.
- void와 마찬가지로, 그 자체로 그다지 유용하지 않다.
- 둘다 소문자만 존재한다.
```ts
let u: undefined = undefined
let n: null = null
```
- number에 null 또는 undefine를 할 당 할 수 있다.
- 하지만,  컴파일 옵션에서 `--stricNullChecks`를 사용하면, Null과 nudefined는 void나 자기 자신들에게만 할당 할 수 있다.
	- 혹은 `tsconfig.ts` 에서 `strictNullChecks: false`를 넣으면 해당 부분을 자유롭게 사용 가능합니다.
	- 혹은 `tsconfig.ts` 에서 `strictNullChecks: false`를 넣으면 해당 부분을 자유롭게 사용 가능합니다.
	- 이 경우, `null`과 `undefined`를 할당 할 수 있게 하려면, `union type`을 이용 해야 한다.
```ts
let name: string = null;
let age: number = undefined;

let name: string = null; //(X)

let u: undefined = undefined // (O)

let v: void = undefined // (O)
let union :string | null | undefined = 'str';
```

:::note null in JavaScript
- `null` 이라는 값으로 할당된 것을 null 이라고 한다.
- 무언가가 있는데, 사용할 준비가 덜 된 상태
- null 이라는 타입은 null이라는 값만 가질 수 있다.
- 런타임에서 `typeof` 연산자를 이용해서 알아내면, object 입니다.

:::

:::tip undefined in JavaScript
- 값을 할당하지 않은 변수는 undefined 라는 값을 가진다.
- 무언가가 아예 준비가 안된 상태
- object의 property가 없을 때도 undefined 이다.
- 런타임에서 `typeof` 연산자를 이용해서 알아내면, undefined 이다.

:::

# Object
---
```ts
//create by object literal
const person1 = { name: 'Mark', age: 39 };

// person1 is not "object" type.
// person1 is "{ name: string, age: number}" type

//create by Object.create
const person2 = Object.create({name:"Mark", age:39});
```

# Array
---
- 본래 JS에서 array는 객체이다.
```ts
let list:number[] = [1,2,3];
let list: Array<number> = [1,2,3];

// 여러 타입을 가지는 배열(유니언 타입 사용)
let array1: (string | number) [] = ['John', 1, 2]
let array2: Array<string|number> = ['John', 1, 2]
```

# Tuple
---
```ts
let x: [string, number];

// 순서, 타입, 길이 모두 맞아야함
x = ["hello", 39]

x.push(2)
console.log(x) 
// ['a', 1, 2] => 즉, push 메서드를 못사용하는 것은 아니다.
// 하지만 이런 사용은 tuple의 사용성을 희석하기에 그리 좋진 않다.

```

# Any
---
```ts
function returnAny(message): any{
	console.log(message);
}
const any1 = returnAny("리턴은 아무거나");
any1.toString();
```
- any는 되로록이면 안 쓰는게 좋다.
- 컴파일 타임에 타입 체크가 정상적으로 이루어지지 않기 대문
- 그래서 컴파일 옵션 중에 any를 써야 하는데 쓰지 않으면 오류를 뱉도록 하는 옵션도 있음
	- `numplicityAny`

# unknown
---
:::sucess unknwon
- TypeScript 3.0 버전부터 지원
- any와 짝으로 any보다 Type-safe한 타입
- any와 같이 아무거나 할당 할 수 있다.
- 컴파일러가 타입을 추론할 수 있게끔 타입의 유형을 좁히거나
- 타입을 확정해주지 않으면, 다른 곳에 할당할 수 없고, 사용할 수 없다.
- unknown 타입을 사용하면 runtime error를 줄 일 수 있을 것 같다.
- 사용 전에 데이터의 일부 유형의 검사를 수행해야 함을 알리는 API에 사용할 수 있을 것 같다.


응용 프로그램을 작성할 때는 **모르는 변수의 타입**을 묘사할 수 있다.
이러한 값은 동적 컨텐츠(예 : 사용자로부터, 또는 우리 API의 모든 값을 의도적으로 수락하기를 원할 수 있다.
이 경우, 컴파일러와 미래의 코드를 읽는 사람에게 이 변수가 무엇이든 될 수 있음을 알려주는 타입을 제공하기를 원하므로, unkwon 타입을 제공한다.


:::

```ts
declare const maybe: unknown;

const aNumber: number = maybe;
if(maybe === true){
	const aBoolean: boolean = maybe;
	// 위의 코드에서 이미 maybe가 boolean으로 추정이 됐기 때문애, 아래의 코드에서 에러가 발생한다.
	// 위의 if문 한정해서 boolean이 된다.
	// const aString: string = maybe;
}

if(typeof maybe === 'string'){
	const aString:string = maybe;
}

```

:::tip declare
- 변수, 상수, 함수 또는 클래스가 어딘가에 이미 선언되어 있음을 알린다.
- 즉, JS코드로 컴파일 되지 않고, TypeScript 컴파일러에게 타입 정보를 알리기만 한다.

:::

# never

## 예시
-  **항상 오류**를 출력하거나, **어떠한 형태로도 return 되지 않는다**
```ts
function error(message: string): never{
	throw new Error();
}

function fail(){
	return error("failed");
}

// 무한 루프 이므로 절대 리턴하지 않음
function keepProcessing():never{
	while(true){
		console.loog('hi')
	}
}
```



:::tip never의 특징
- never 타입은 모든 타입의 subtype이며, 모든 타입에 할당 할 수 있습니다.
- 하지만, never에는 그 어떤 것도 할당할 수 없다.
- any 조차도 never에게 할당 할 수 없다.
- 잘못된 타입을 넣는 실수를 막고자 할 때 사용한다.

:::

```ts
let a: string = "hello"

if(typeof !== 'string'){
	a; // a는 여기서 never가 나오게 된다. -> string이 아닐때 a는 never로 리턴 된다
}

declare const a: string | number;

if(typeof a !== "string"){
	a; // 이때는 string을 제외한 타입을 생각하므로, number가 리턴 값이 된다.
}

// 제네릭 타입 -> 조건부 타입
type Indexable<T> = T extends string ? T & { [index: string] : any } : never;

type ObjectIndexable = Indexable<{}>;
```


# Function

:::tip 함수 타입은 대부분은 사용할 일이 없지만, 특정 한 곳에서 사용할 일이 있기에 아래에 작성합니다.
- 함수 타입은 크게, **매개변수 타입, 리턴 타입** 두 개가 제일 중요합니다.

:::

```ts
let func1:(arg1: number, arg2: number)=> number

func1 = function(x,y){
	return x*y
}

let func2 = ()=>void
func2 = function(){
	console.log('hi')
}
```



# Function

:::tip 함수 타입은 대부분은 사용할 일이 없지만, 특정 한 곳에서 사용할 일이 있기에 아래에 작성합니다.
- 함수 타입은 크게, **매개변수 타입, 리턴 타입** 두 개가 제일 중요합니다.

:::

```ts
let func1:(arg1: number, arg2: number)=> number

func1 = function(x,y){
	return x*y
}

let func2 = ()=>void
func2 = function(){
	console.log('hi')
}
```


# 타입 단언

:::note 타입 단언?
- 프로그래머가 컴파일러에게 타입을 지정해주는 것입니다.
- TypeScript에서는 시스템이 추론 및 분석한 타입 내용을 우리가 원하는 대로 얼마든지 바꿀 수 있습니다.
- type assertion을 사용하면 값의 type을 설정하고 컴파일러에 이를 유추하지 않도록 지시할 수 있습니다.
- 이것은 프로그래머로서 TypeScript가 자체적으로 추론할 수 잇는 것보다 변수 유형에 대해 더 잘 이해할 때 사용합니다.

:::

```ts
let foo = {}
foo.bar = 123
foo.bas = 'hello'
```

컴파일러는 foo type이 속성이 없는 `{}` 라고 가정하기 때문에, 위의 예에서는 컴파일러 오류가 발생합니다.
그러나 아래와 같이 `type assertion`을 사용하면 이러한 상황을 피할 수 있습니다.

```ts
interface Foo{
	bar: number;
	bas: string;
}

let foo = { } as Foo;
foo.bar = 123
foo.bas = 'hello'
```

---

#NodeJS #TypeScript 

---