---
slug: "TypeScript-Class"
---

# Quick Start - Class
```ts
class Person {}

const p1 = new Person();

console.log(p1);
```
- `Class`는 es6 부터 나온 문법이기에, ES6와 똑같이 출력된다.
- 하지만, ES5밑 버전은 `class`라는 개념이 없기 때문에, 해당 부분은 `function`으로 대체된다.

```ts
class Person {
  name: string;

  constructor(name: string) {
    this.name = string;
  }
}

const p1 = new Person('Mark');

console.log(p1);
```

> class 이름은 보통 **대문자**를 **이용**한다.
> new를 이용하여 class 를 통해 object를 만들 수 있다.
> **constructor**를 이용하여 object를 생성하며 값을 전달 할 수 있다.
> **this**를 이용해서 만들어진 **object**를 가리킬 수 있다.


# constructor & initialize 
```ts
// strictPropertyInitialization : false
class Person {
  name: string;
  age: number;
} // 위 값을 에러이다. -> initialliz가 되지 않았다.

const p1: Person = new Person();
console.log(p1); // Person1 {}
person.age = 39;
console.log(person.name); // undefined
```

```ts
class Person {
	name: string = 'Mark';
	age: number;

	constructor(age? : number){
		if(age === undefined){
			this.age = 20;
		}else{
			this.age = age;
		}
	}
	async init(){}
}

const p1: Person = new Person(39);
const p2: Person = new Person(); // 위와 같이 지원하려면 ?를 매개변수에 붙여야한다.


```

:::tip Construct
- 생성자 함수가 없으면, 디폴트 생성자가 불린다.
- 프로그래머가 만든 생성자가 하나라도 있으면, 디폴트 생성자는 사라진다.
- strict 모드에서 프로퍼티를 선언하는 곳 또는 생성자에서 값을 할당해야 한다.
- 프로퍼티를 선언하는 곳 또는 생성자에서 **값을 할당하지 않는** 경우에는 **!를 붙여서 위험을 표현한다.**
- 클래스의 프로퍼티가 정의되어 있지만, 값을 대입하지 않으면 `undefined` 이다.
- 생성자에는 `async` 를 설정할 수 없다.




:::

# Access Modifiers

```ts
public class Person {
	public name: string = 'Mark';
	public age: number;

	public constructor(age? : number){
		if(age === undefined){
			this.age = 20;
		}else{
			this.age = age;
		}
	}
	public async init(){ }
}

const p1: Person = new Person(39);

```


:::tip 접근제어자(public, private, protected)
- 접근 제어자에는 public, private, protected가 있다.
- 설정하지 않으면 public
- 클래스 내부의 모든 곳(생성자, 프로퍼티, 메서드) 설정 가능하다.
- private 으로 설정하면 클래스 외부에서 접근할 수 없다.
- JavaScript에서 private 지원하지 않아 오랜동안 **프로퍼티나 메서드 이름 앞에 _ 를 붙여서 표현**했다.

:::

# initialization in constructor parameters

```ts
public class Person {
	name: string = 'Mark';
	age: number;

	constructor(name: string, age : number){
		this. name = name;
		this.age = age;
	}
}

----------

class Person{
	public constructor(public name: string, public age: number){}
	const p1:Person = new Person("Mark", 39);
	console.log(p1)
}

```



# Getters & Setters

```ts
class Person{
	public constructor(private _name: string, private age: _number){}

	get name(){
		console.log("get") // getter를 사용하게 된다면, getter를 호출하기 전에 해당 작업을 미리 할 수 있다.
		return this._name;
	}

	set name(n : string){
		this._name = n;
	}
}

const p1: Person = new Person("Mark", 39);
console.log(p1.name); // get 을 하는 함수 getter
p1.name = "Woongjae"// set을 하는 하수 setter
```


# readonly properties

```ts
class Person{
	public readonly name: string = "Mark"

	public constructor(public _name: string, public age: number){}
}
```
- ReadOnly는 말 그대로 read만 가능한 함수이다.
- 즉, 중간에 값을 변경하는 건 허용되지 않는다.
- 절대 변하지 않는 값에 할당하면 된다.


# Index Signatures in class

```ts
// {mark : 'male', jade : 'male'}
// {chloe : 'femail', alex : 'male', anna: 'female'}

class Students{
	mark: string = 'male' // 해당 방식은 새로운 사람이 들어오게 된다면, 사용이 불가능 하다는 단점을 가지고 있다.
	[index: string] : "male" | "female";
}

const a = new Students();
a.mark = "male";
a.jade = "male";

console.log(a);

const b = new Students();
b.chloe = "female";
b.alex = "male";
b.anna = "female";

console.log(b);
```

:::tip index signature
- 프로퍼티 값이 동적으로 변경되어야할 때 유용한 문법이다.
- 해당 부분은 남발하기에는 조금 리스크가 있을 것 같다

:::

# Static Properties & Methods

```ts
class Person {
	public static CITY = "Seoul";
	public static hello(){
		console.log("안녕하세요", this.CITY)
	}

	public change(){
		CITY = "LA"
	}
}
 
const p1 = new Person();
p1.hello(); // 원래의 방식대로라면 왼쪽의 방식대로, 생성자를 생성후에 사용해야했다.

Person.hello();//하지만, static 선언하는 하는 순간부터는 해당 className.~ 으로 커버가 가능하다.
Person.CITY; // 해당 클래스를 공통적으로 사용해야하는 순간이 오면 그때 static을 사용해서, class 사용이 가능합니다.

const p2 = new Person();
p2.hello();// 안녕하세요 Seoul
p2.change();
p1.change(); // 안녕하세요 LA
// 이처럼 하나의 클래스에서 하나의 변수를 공유할 때 static을 사용한다.

```


# Singletons

:::note Singletons?
- 어플리케이션이 생성되는 중간에 클래스에서 단 하나의 Object만 생성하는 패턴을 말한다.

:::

```ts
class ClassName{
	private static instance : ClassName | null = null;
	public static getInstance() :ClassName(){
		// ClassName으로부터 만든 object가 있으면 그걸 리턴
		// 없으면, 만들어서 리턴
		if(ClassName.instace === n ){
			ClassName.instace = new ClassName();
		}

		return ClassName.instance;
	}
	private constructor() {}; // 외부에서 생성자를 호출 할 수 없도록 막음
}
```

# Inheritance

```ts
class Parent{
	constructor(protected _name: string, private _age: number){}
	public print(): void{
		console.log(`이름은 ${this._name} 이고, 나이는 ${this._age} 입니다.`)
		
	}
}

// public 까지는 접근이 가능하다.
// 생성자를 만들어서 값을 할당하는 것 까지 가능하다.
const p = new Parent("Mark", 39);
p.print();


class Child extends Parent{
	public _name = "Mark Jr";
	// 접근 제어까지도 Override가 된다.

	public gender = "male";
	constructor(age: number){
		super('Mark Jr', age) // 부모의 생성자를 호출 하는 모습
		// 자식 생성자에서는 무조건 super가 먼저 생성되어야 한다.
	}
}

const c = new Child(5);
c.print();
```

:::tip protected
- 상속 관계에 있을 때만 접근 가능


:::

# Abstract Classes

```ts
abstract Class AbstractPerson{
	protected _name: string = 'Mark';
	
	abstract setName(name: string): void;
}

class Person extends AbstractPerson{
	setName(name: string): void{
		this._name = name;
	}
}

const p = new Person();
setName();
```

:::tip Abstract?
- Abstract 타입의 Class 생성자를 생성할 수 없다.
- Abstract 타입의 Class는 Abstract type의 함수가 있어야하며, 상속 받은 Class는 해당 함수를 제일 먼저 설정 해야한다.

:::

# Generics

## Generics, Any와 다른 점
- hello의 리턴이 any이기 때문에 타입 헬퍼가 제대로 되지 않음
- helloGeneric을 사용하면 정상적으로 사용 가능
```ts
function helloString(message: string): string {
  return message;
}

function helloNumber(message: number): number {
  return message;
}

// 더 많은 반복된 함수들 ...

function hello(message: any): any {
  return message;
}

// generic 함수 
function helloGeneric<T>(message: T): T {
  return message;
}

console.log(hello('Mark').length);
console.log(hello(38).length); // undefined

console.log(helloGeneric('Mark').length);
// console.log(helloGeneric<number>('Mark').length); (X)

console.log(helloGeneric(38).toString());
// console.log(helloGeneric(36).length); (X)
```


## Generics Basic
- Generic 타입을 쓰지 않으면, T를 추론
- Generic 타입을 쓰면, T를 검증

```ts
function helloBasic<T>(message: T): T {
  return message;
}

console.log(helloBasic<string>('Mark'));
const age = helloBasic(38); //  추론이 된다. -> 가장 타이트한 범위가 추론됨
// helloBasic<number>('38'); (X)

function helloBaisc1<T, U>(message: T, comment: U):T{
	return message
}
helloBasic1<string, number>("Mark", 39);
helloBasic1(36,39) // 해당 방식은 추론됨

```

## Generics Array & Tuple

```ts
function helloArray<T>(messages: T[]): T {
  return messages[0];
}

function helloTuple<T, K>(messages: [T, K]): T {
  return messages[0];
}

console.log(helloArray(['Hello', 'World'])); // string[]
console.log(helloArray(['Hello', 1])); // Array<string | number>
console.log(helloTuple(['Hello', 'World'])); // [string, string]
console.log(helloTuple(['Hello', 1])); // [string, number]
// console.log(helloTuple(['Hello', 'world', 1])); // Error
```


## Generics Function

```ts
type HelloFunctionGeneric = <T>(message: T) => T;

const helloFunction: HelloFunctionGeneric = <T>(message: T): T => {
  return message;
};

console.log(helloFunction<string>('Hello').length);
```

## Generics Class

```ts
class Person<T> {
  private _name: T;

  constructor(name: T) {
    this._name = name;
  }
}

new Person('Mark');
// new Person<string>(38); (X)
```

## Generic with multiple types 

```ts
class Person7<T, K> {
  private _name: T;
  private _age: K;

  constructor(name: T, age: K) {
    this._name = name;
    this._age = age;
  }
}

new Person7('Mark', 38);
```

## Generics with extends

```ts
class Person6<T extends string | number> {
  private _name: T;

  constructor(name: T) {
    this._name = name;
  }
}

new Person6('Mark');
new Person6(38);
// new Person6(true); // T 가 string 또는 number 를 상속받기 때문에 boolean 은 X
```

## keyof & type lookup system

```ts
interface Person8 {
  name: string;
  age: number;
}

const person8: Person8 = {
  name: 'Mark',
  age: 36
};

function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]): void {
  obj[key] = value;
}

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

setProperty(person8, 'name', 'Anna');
// setProperty(person8, 'name', 27);
console.log(getProperty(person8, 'name'));
// console.log(getProperty(person8, 'fullname'));
```

## keyof & type lookup system

```ts
interface IPerson{
	name: string;
	age: number;
}

const person: IPerson = {
	name: "Mark",
	age: 39,
};

// keyof의 타입을 만들어줌
type Keys = keyof IPerson;
// keyof는 해당 값에 대해서 그 중 한개의 타입으로 추론해준다.

function getProp(obj: IPerson, key: "name" | key){
	return obj[key];
}

function setProp(
	obj: IPerson,
	key: "name" | "age",
	value: string | number
): void{
	obj[key] = value;
}
// return을 받는 값은 union 값이 아닌 name, age 등 특정한 값이어야만 한다.

// extends를 사용해서 K를 T로 제한한다.
function getProp<T, K extends keyof T>(obj: T, key: K): T[K]{
	return obj[key];
}

function setProp<T, K extends keyof T>(obj: T, key: K, value: T[K]):void {
	obj[key] = value;
}

```

---

#NodeJS #TypeScript 

---