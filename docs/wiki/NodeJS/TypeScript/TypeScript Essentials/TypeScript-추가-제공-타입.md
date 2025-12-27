---
slug: "TypeScript-추가-제공-타입"
---
기본적인 Type 들을 제외하고, TypeScript 자체적으로 추가 제공하는 타입이 존재합니다.
Tuple, Enum, Any, Void, Never, Union 타입을 제공합니다.

# Any

```ts
let something :any = "Hello World!";
something = 23
something = true
```

애플리케이션을 만들 때, 잘 알지 못하는 타입을 표현해야 할 수가 있습니다.
이 값들은 사용자로부터 받은 데이터나 서드파티 라이브러리 같은 동적인 컨텐츠에서 올 수도 있습니다.
이 경우 타입 검사를 하지 않고, 그 값들이 컴파일 시간에 검사를 통과하길 원합니다.

이를 위해 any 타입을 사용할 수 있습니다.

:::warning 하지만, 이 타입은 최대한 쓰지 않는 것이 좋습니다.
그래서 `noImplicitAny` 라는 옵션을 주면 any를 썼을 때 오류가 나오게 할 수 있습니다.

:::

# Union
```ts
let code : (string|number)
code = 123;   // OK
code = "ABC"; // OK
code = false // Compiler Error


let empId : string | number;
empId = 111 // OK
empId = 'E111' // OK
empId = true // Compiler Error
```

TypeScript를 사용하면 변수 또는 매개변수에 대해 둘 이상의 데이터 유형을 사용할 수 있습니다.
이것을 유니온 타입이라고 합니다.

# Enum
```ts
enum PrintMedia{
	Newspaper,  // 0
	Newsletter, // 1
	Magazine,   // 2
	Book,       // 3
}

let mediaType: number = PrintMedia.Book // 3

enum PrintMedia{
	Newspaper = 1,
	Newsletter = 50,
	Magazine = 55,
	Book // 55+1
	// PrintMedia 열거형 데이터의 Book 의 값이 숫자 56이기 때문입니다.
}
```

`enum`은 `enumerated type`(열거형)을 의미합니다.
Enum 은 값들의 집합을 명명하고, 이를 사용하도록 만듭니다.
여기서 PrimeMedia라 불리는 집합을 <mark>기억하기 어려운 숫자</mark> 대신 <mark>친숙한 이름으로 사용</mark>하기 위해 enum 을 활용할 수 있습니다.

열거된 PrintMedia의 별도의 값이 설정되지 않는 경우 기본적으로 0부터 시작합니다

꼭 숫자가 아니어도 됩니다. 문자로 하되, 대신 값을 지정만 하면 됩니다.

```ts
enum LanguageCode{
	korean = 'ko',
	english = 'en',
	japaneses = 'ja',
	chinese = 'zh',
	spanish = 'es',
}
```

# Void
Java와 같은 언어와 유사하게 데이터가 없는 경우 void가 사용됩니다.
예를 들어 함수가 값을 반환하지 않으면, 반환 유형으로 void를 지정할 수 있습니다

타입이 없는 상태이며, any와 반대의 의미를 가집니다.
void 소문자로 사용해줘야 하며, 주로 함수의 리턴이 없을 때 사용해주면 됩니다. 

```ts
function syaHi():void{
	console.log('Hi!')
}

let speech: void = sayHi();
console.log(speech) // Output: undefined
```

# Never
TypeScript 는 절대 발생하지 않을 값을 나타내는 새 Type never를 도입 했습니다.
Never 유형은 어떤 일이 절대 일어나지 않을 것이라고 확신 할 때, 사용됩니다.

일반적으로 함수의 리턴 타입으로 사용됩니다.
함수의 리턴 타입으로 never가 사용될 경우 이는 무한 루프에 빠지는 것과 같습니다.

```ts
function throwError(errorMsg: string):never{
	throw new Error(errorMsg)
}

function keepProcessing():never{
	while(true){
		console.log('I always does something and never ends.')
	}
	
}
```

## void와 never의 차이점

:::tip void는 undefined나 null 값을 가질 수 있지만, never는 어떠한 값도 가질 수 없습니다

:::

```ts
let someting: void = null
let noting : never = null // Error: Type 'null' is not assignalbe to type 'never'


function sayHi():void{
	console.log('Hi!')
}

let speech:void = sayHi()
console.log(speech) // undefined
```

TypeScript에서 값을 Return 하지 않는 함수는 실제로 `undefined` 를 반환합니다.
위 예에서 볼 수 있듯이 `sayHi`함수는 반환 유형이 void인 경우에도 내부적으로 `undefined`를 반환하기 때문에, speech() 는 `undefined`가 됩니다.
Never유형을 사용할 경우 void는 Never에 할당할 수 없기 때문에, `Speech:never`는 컴파일 시간 오류를 발생시킵니다.


# Record&lt;>
해당 타입은 key-value로 이루어진 Object일 때 특히, 내용을 알기보단, 해당 내용의 객체로 오는지 아닌지 확정적일때 사용 가능하다.
즉, any 보다낫다

