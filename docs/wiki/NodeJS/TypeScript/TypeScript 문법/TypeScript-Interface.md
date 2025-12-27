---
slug: "TypeScript-Interface"
---


# optional property
## interface - optional property(1)

```ts
interface Person {
    name: string;
    age?: number;
}

function hello(person: Person): void {
    console.log(`안녕하세요! ${person.name} 입니다.`);
}

const p1: Person = {
    name: 'Mark',
    age: 35
};

const p2: Person = {
    name: 'Anna'
};

hello(p1); // 안녕하세요! Mark 입니다.
hello(p2); // 안녕하세요! Anna 입니다.
```
`interface1.ts`



 
# optional property
## interface - optional property(2)

:::note indexable type
- 어떤 타입이 오더라도 혹은, 어떤 key, value가 오더라도 괜찮은 타입이다.

:::

```ts
interface Person3{
	name: string;
	age?: number;
	[index: string]: any;
}
function hello3(person: Person3):void {
	console.log(`안녕하세요! ${person.name} 입니다.`)
}

const p31: Person3{
	name: "Mark",
	age: 39,
}

const p32: Person3{
	name: "Anna",
	systers: ["Sung",Chan"]
}

const p33: Person3{
	name: "Bokdaengi",
	father: p31,
	mother: p32,
}

hello(p31)


```


# function in interface

## interface - function in interface

```ts
interface Person4{
	name: string;
	age: number;
	hello(): void;
}

const p41: Person4 = {
	name = 'Mark',
	age: 39,
	hello: function(): void{
		console.log(`안녕하세요! ${this.name} 입니다.`);
	}
}

const p42: Person4 = {
	name = 'Mark',
	age: 39,
	hello(): void{
		console.log(`안녕하세요! ${this.name} 입니다.`)
	}
};

const p43: Person4 = {
	name = 'Mark',
	age: 39,
	hello(): void =>{
		console.log(`안녕하세요! ${this.name} 입니다.`)
	}
} // Arrow function에서의 this는 무조건 전역 변수를 가르키기 때문에, 해당 this는 arrow fn에서는 사용 불가능하다.
```

# class implements 
## class implements interface

```ts
interface IPerson1 {
    name: string;
    age?: number;
    hello(): void;
}

class Person implements IPerson1 {
    name: string;
	age?: number | undefined;

    constructor(name: string) {
        this.name = name;
    }// name은 반드시 받아야하는 값이기 때문에, 해당 값을 constructor(매개 변수 받듯이)

    hello(): void {
        console.log(`안녕하세요! ${this.name} 입니다.`);
    }
}

const person = new Person('Mark');
person.hello(); // 안녕하세요! Mark 입니다.
```


# function interface

## interface extends interface
```ts
interface IPerson2 {
	name: string;
	age?: number;
}

interface IKorean extends IPerson2{
	city: string;
}

const k:IKorea={
	name: "이웅재",
	city: "서울",
};


```

## function interface

```ts
interface HelloPerson {
    // (name: string, age: number): void;
    (name: string, age?: number): void;
}

const helloPerson: HelloPerson = function (name: string) {
    console.log(`안녕하세요! ${name} 입니다.`);
};

const helloPerson: HelloPerson = function (name: string, age: number) {
    console.log(`안녕하세요! ${name} 입니다.`);
}; // 에러 발생
// interface 상에서 적혀있는 age와 현재 함수에 있는 매개변수 age와 맞지 않는다.


helloPerson('Mark'); // 안녕하세요! Mark 입니다.

/*

함수의 타입 체크는 할당할때가 아니라 사용할때 한다는 점을 명심

*/
```
# Readonly Interface Properties

:::tip readonly
- 상수에 대한 부분을 readonly로 적용하게 된다면, 값을 변경할 수 없다.

:::

```ts
interface Person8{
	name: string;
	age? : number;
	readonly gender: string;
}

const p81: Person8 = {
	name: "Mark",
	gender: "male",
};

p81.gender = "female"; // 에러 발생 -> readonly를 적용하게 된다면, 중간에 값을 바꿀 수 없다.
```

# type alias vs interface
## function
```ts
// type alias
type EatType = (food: string) => void;

// interface
interface IEat {
  (food: string): void;
}
```

## array
```ts
// type alias
type PersonList = string[];

// interface
interface IPersonList {
  [index: number]: string;
}
```

## interface
```ts
interface ErrorHandling {
  success: boolean;
  error?: { message: string };
}

interface ArtistsData {
  artists: { name: string }[];
}

// type alias
type ArtistsResponseType = ArtistsData & ErrorHandling;

// interface
interface IArtistsResponse extends ArtistsData, ErrorHandling {}

let art: ArtistsResponseType;
let iar: IArtistsResponse;

```

## union types

:::success type alias에서만 가능

:::

```ts
interface Bird {
  fly(): void;
  layEggs(): void;
}

interface Fish {
  swim(): void;
  layEggs(): void;
}

type PetType = Bird | Fish;

interface IPet extends PetType {} // error TS2312: An interface can only extend an object type or intersection of object types with statically known members.

class Pet implements PetType {} // error TS2422: A class can only implement an object type or intersection of object types with statically known members.

```

## Declaration Merging - interface

:::success interface만 가능

:::

```ts
interface MergingInterface {
  a: string;
}

interface MergingInterface {
  b: string;
}

let mi: MergingInterface;
mi.
```

![Screenshot-2023-06-01-at-11.06.50-PM.png](/img/이미지 창고/Screenshot-2023-06-01-at-11.06.50-PM.png)

## Declaration Merging  - type alias
:::error type alias에서는 불가능

:::

```ts
type MergingType = {
  a: string;
};

type MergingType = {
  b: string;
};
```

![Screenshot-2023-06-01-at-11.08.03-PM.png](/img/이미지 창고/Screenshot-2023-06-01-at-11.08.03-PM.png)

---

#NodeJS #TypeScript 

---