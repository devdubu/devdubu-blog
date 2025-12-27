# Types

```ts
let boolean: boolean
let falseBoolean: boolean = false

let number: number
let integer: number = 6
let float: number = 1.234

let string : string
let firstName: string = 'Doe';

/*

Array

*/

let names1:string[] = ['John', 'Kim']
let names1:Array<string> = ['John', 'Kim']

// 여러 타입을 가지는 배열(유니언 타입 사용)
let array1: (string | number) [] = ['John', 1, 2]
let array2: Array<string|number> = ['John', 1, 2]

// 읽기 전용 배열 생성
let stringArray: readonly string[] = ['A','B']
let numberArray: ReadonlyArray<number> = [1,2]

stringArray.push('C') // X 해당 Type은 읽기 전용이기에, 허용 되지 않음
numberArray[0] = 3  // X 해당 Type은 읽기 전용이기에, 허용 되지 않음

/*

Tuple

*/

let tuple1: [string, number]
tuple1 = ['a', 1]
tuple1 = ['a', 1, 2] // X 튜플은 길이가 정해진 배열 타입이므로, 3개는 허용되지 않음

let users: [number, string][]
users = [1, 'John'], [2, 'Doe'](1, 'John'], [2, 'Doe')

let tuple2: [string, number]
tuple2 = ['a', 1]
tuple2.push(2)
console.log(tuple2) 
// ['a', 1, 2] => 즉, push 메서드를 못사용하는 것은 아니다.
// 하지만 이런 사용은 tuple의 사용성을 희석하기에 그리 좋진 않다.

/*

Any

*/

let any:any = 'abc';
any = 1
any = []

let unknown: unknown
unknown = 'abc'
unknown = 1

// any와 unknown은 둘이 비슷해보이지만, 기본적으로 ts는 any를 싫어하므로 정 필요하면 any 보단 unknown이 낫다

/*

Object

*/

let obj: object = {}
let arr: object = []
let nul: object = null 
// 해당 부분은 javascript에서 typeof 를 진행하면, 나오지만, strict: true를 넣으면 해당 부분에서 오류가 나온다
let data: object = new Date();

const obj1 : {
	id:number,
	title: string,
	description: string
} = {
	id:1,
	title: 'title',
	description: 'description1'
}

/*

Union

*/
let union: (string | number)
union = 'hi'
union = 123
union = [] // X union 타입에 해당 되지 않음

/*

funcion

*/

let func1:(arg1: number, arg2: number)=> number

func1 = function(x,y){
	return x*y
}

let func2 = ()=>void
func2 = function(){
	console.log('hi')
}


// Null, undefined
let number1 : number = undefined 
// 해당 부분에서 에러가 나는 건 strictNullChecks: true와 연관이 있습니다.
// 기본적으로 null 과 undefined는 다른 타입 값에 들어가는 것에 대해서는 문제가 없지만, 
// strict 모드를 true넣는 순간 에러를 뱉을 뿐입니다.

// never

function throwError(){
	throw new Error('error')
}

// 무한 루프 이므로 절대 리턴하지 않음
function keepProcessing():never{
	while(true){
		console.loog('hi')
	}
}

// 실제로 아래와 같은 현상이 많이 일어납니다.
const never: [] = []
never.push(1)

// 이때는 never변수는 never[] 타입이 되므로 push가 불가능합니다.


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