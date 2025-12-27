---
slug: "TypeScript의-추론"
---

# TypeScript에 추론에 의지하는 경우

```ts
// 타입 스크립트 코드 지만,
// a의 타입을 명시적으로 지정하지 않는 경우이기에 a는 any로 추론 됩니다.
// 함수의 리턴 타입은 number로 추론됩니다. (NaN 도 Number의 하나입니다.)

function f3(a){
	return a*8;	
}

// 사용자가 a가 any이기 때문에, 사용법에 맞게 문자열을 사용하여 함수를 실행했습니다.
console.log(f3); // 380
console.log(f3('Mark') + 5); // NaN
```
- 위의 코드를 보게 된다면, a는 any라는 타입이 된다.
- 해당 코드는 NaN과 같은 에러를 발생시키게 될 수도 있다
- 이를 막기 위해 아래의 옵션이 있다.

:::warning noImplicitAny
- 타입을 명시적으로 지정하지 않는 경우, TS가 추론중에 **any** 라고 판단하게 되면,
- 컴파일 에러를 발생시켜 명시적으로 지정하도록 유도한다.

:::

- 타입을 명시적으로 지정한 경우
```ts
// 매개변수의 타입은 명시적으로 지정했습니다.
// 명시적으로 지정하지 않는 함수의 리턴 타입은 number로 추론됩니다.
function f4(a:number){
	if(a > 0){
		return a * 38;
	}
}
// 사용자는 사용법에 맞게 숫자형을 사용하여 함수를 실행했습니다.
// 해당 함수의 리턴 타입은 number이기 때문에, 타입에 따르면 이어진 연산을 바로 할 수 있습니다.
// 하지만, 실제 undefined + 5가 실행되어 NaN이 출력됩니다.

console.log(f4(5)); // 190
console.log(f4(-5) + 5); // NaN
```
- 위의 코드 처럼 타입을 명시적으로 작성한 경우에서 undefined라는 타입을 출력했습니다.
- 에러를 뱉은것이 아닌 `undefined`가 나온 이유는 결국 모든 타입에 자동으로 `null`과 `undefined`가 포함 되어있기 때문입니다.

:::warning strictNullChecks
- 모든 타입에 자동으로 포함되어 있는 `null`과 `undefined`를 제거해준다.
:::

- 해당 옵션을 킨 후 아래의 코드 결과

```ts
// 매개변수의 타입은 명시적으로 지정했습니다.
// 명시적으로 지정하지 않은 함수의 리턴 타입은 number | undefined 로 추론됩니다.
function f4(a: number){
	if( a > 0 ){
		return a * 38;
	}
}

// 사용자는 사용법에 맞게 숫자형을 사용하여 함수를 실행했습니다.
// 해당 함수의 리턴타입은 number | undefined 이기 때문에, 
// 타입에 따르면 이어진 연산을 바로 할 수 없습니다.
// 컴파일 에러를 고쳐야하기 때문에, 사용자와 작성자가 의논을 해야합니다.

console.log(f4(5));
console.log(f4(-5) + 5) // error TS2523: Object is possibley 'undefined'. 

```

## 명시적으로 리턴 타입 지정하기
```ts
// 매개변수의 타입과 함수의 리턴 타입을 명시적으로 지정했습니다.
// 실제 함수 구현부의 리턴 타입과 명시적으로 지정한 타입이 일치하지 않아 컴파일 에러가 발생합니다.
// error TS2366: Function lacks ending return statement and return type does not icre...
function f5(a: number):number {
	if(a>0){
		return a * 38;
	}
}
```

:::warning noImplicitReturns
- 함수 내에서 모든 코드가 값을 리턴하지 않으면, 컴파일 에러를 발생시킨다.


:::

```ts
// if가 아닌 경우 return을 직접하지 않고 코드가 종료된다.
// error TS7030: Not all code path return a value
function f5(a: number){
	if(a>0){
		return a*38;
	}
}
```

## 매개변수가 Object일 때
```js
// JavaScript
function f6(a) {
	return `이름은 ${a.name}이고, 연령대는 ${
	Math.floor(a.age / 10)* 10
	}대 입니다.`;
}

console.log(f6({name : 'Mark', age: 38})); // 이름은 Mark이고, 연령대는 30대 입니다.
console.log(f6('Mark')); // 이름은 undefined이고, 연령대는 NaN 입니다. -> 해당 경우는 잘못된 경우 입니다.
```
- TypeScript의 경우
```ts
function f7(a: { name: string; age: number}): string{
	return `이름은 ${a.name}이고, 연령대는 ${
	Math.floor(a.age / 10)* 10
	}대 입니다.`; 
}

console.log(f6({name : 'Mark', age: 38})); // 이름은 Mark이고, 연령대는 30대 입니다.
console.log(f6('Mark')); // error TS2345 ~ 
```

# Structural Type System
- 구조가 같으면, 같은 타입이다
```ts
interface IPerson{
	name: string;
	age: number;
	speak(): string;
}

type PersonType = {
	name: string;
	age: number;
	speak(): string;
};

// 위 두개의 객체는 똑같은 구조이다.

let personInterface: IPerson = {} as any;
let personType: PersonType = {} as any;

personInterface = personType;
personType = personInterface;
```

# Nominal Type System
- 구조가 같아도, 이름이 다르면 다른 타입니다.
```ts
type personID = string & { readonly brand: unique symbol };

function PersonID(id: string): PersonID{
	return id as PersonID;
}
function getPersonById(id: PersonID) {}
getPersonById(PersonID('id-aaaaaa'));
getPersonById('id-aaaaa'); // error TS2345
```

# duck typing

```python
class Duck:
	def sound(self):
		print u"꽥꽥"
class Dog:
	def sound(self):
		print u"멍멍"
def get_sound(animal):
	animal.sound()
def main:
	bird = Duck()
	dog = Dog()
	get_sound(bird)
	get_sound(dog)

```
- 만약 어떤 새가 오리처럼 걷고, 헤엄치고, 꽥꽥 거리는 소리를 낸다면, 나는 그 새를 오리라고 부를 것이다.

# Type Compatibility
## SubType

```ts
// sub1 타입은 sup1 타입의 서브이다.
let sub1: 1 = 1;
let sup1: number = sub1;
sub1 = sup1; // error! Type 'number' is not assingable to type '1'.

// sub2 타입은 sup2 타입의 서브 타입이다.
let sub2: number[] = [1];
let sup2: object = sub2;
sub2 = sup2; // error! Type '{}' is missing the following properties from type 'number[]': length, pop, push, concat, and 16 more

//sub3 타입은 sup3 타입의 서브 타입이다.
let sub3:  [number, number] = [1,2];
let sup3: number[] = sub3;
sub3 = sup3; // error! Type 'number[]' is not assignable to type '[number, number]'. Target requires 2 element(s) but source may have fewer.

//sub4 타입은 sup4 타입의 서브 타입이다.
let sub4: number = 1;
let sup4: any = sub4;
sub4 = sup4;

// sub5 타입은 sup5 타입의 서브 타입이다.
let sub5: never = 0 as never;
let sup5: number = sub5;
sub5 = sup5; // error! Type 'number' is not assignable to type 'never'

class Animal {}
class Dog extends Animal{
	eat() {}
}// 상속

// sub6 타입은 sup6 타입의 서브 타입이다.
let sub6: Dog = new Dog();
let sup6: Animal = sub6;
sub6 = sup6 // error! Property 'eat' is missing in type 'SubAnimal' but require in type 'SubDog'
```

### 공변

:::note 같거나 서브 타입인 경우, 할당이 가능하다.

:::

```ts
// primitive type
let sub7: string = '';
let sup7: string | number = sub7;

// object - 각각의ㅏ 프로퍼티가 대응하는 프로퍼티와 같거나 서브타입이어야 한다.
let sub8: { a: string; b: number } = { a: '', b: 1 };
let sup8: { a: string | number; b: number} = sub8;

// array - object 와 마찬가지
let sub9: Array<{ a:string; b: number }> = [{a: '', b:1 }];
let sup9: Array<{ a:string | number; b: number }> = sub8;

```

### 반병

:::note 함수의 매개변수 타입만 같거나 슈퍼타입인 경우, 할당이 가능하다.

:::

```ts
class Person()
class Developer extends Person{
	coding(){}
}

class StartupDeveloper extends Developer{
	burning() {}
}

function tellme(f: (d: Developer) => Developer ) {}

// Developer => Developer 에다가 Developer => Developer 를 할당하는 경우
tellme(function pToD(d: Person): Developer){
	   return new Developer();
}

// Developer => Developer 에다가 StartipDeveolper 를 할당하는 경우
tellme(function sToD(d: StartupDeveloper): Developer {
	return new Developer();
}); // 해당 부분은 에러가 나야하지만, 융통성으로 안난다. -> return 값이 매개변수보다 super 타입이기 때문이다.
```

:::warning strictFunctionTypes
- 해당 옵션을 키게 된다면, 함수를 할당할 시에 함수의 매개변수 타입이 같거나 슈퍼타입인 경우가 아닌 경우, 에러를 통해 경고한다.


:::

---

#NodeJS #TypeScript 

---