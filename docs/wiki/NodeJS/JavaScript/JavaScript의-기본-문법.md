---
slug: "JavaScript의-기본-문법"
---
- [Method](#Method)
	- [String.prototype.indexOf()](#Method#String.prototype.indexOf())
		- [ex1](#String.prototype.indexOf()#ex1)
	- [기타 method](#Method#기타 method)
	- [String.prototype.match()](#Method#String.prototype.match())
	- [String.prototype.trim()](#Method#String.prototype.trim())
- [Math](#Math)
- [Method](#Method)
	- [Array.prototype.fine()](#Method#Array.prototype.fine())
	- [기타 Method](#Method#기타 Method)
- [Object.assign()](#Object.assign())
- [Ohter Method](#Ohter Method)
- [lodash](#lodash)
- [Javascript의 import, export 원리](#Javascript의 import, export 원리)
	- [Default export](#Javascript의 import, export 원리#Default export)
	- [Named export](#Javascript의 import, export 원리#Named export)
		- [모든 함수를 한번에 가져오기](#Named export#모든 함수를 한번에 가져오기)
- [_.uique()](#_.uique())

----

# String

:::tip 리터럴 객체
- `new` 라는 키워드 없이 단순히 `'', ""` 과 같은 문자로 해당 자료형을 표현한다.
- 기호를 이용해서 자료형을 만드는 것을 리터럴 방식이다.

:::

## Method

### String.prototype.indexOf()
- `indexOf()` 메서드는 호출한 `String`객체에서 주어잔 값과 일치하는 첫 번째 인득스를 반환한다.
- 일치하는 값이 없으면 `-1`을 반환한다.

#### ex1
```javascript
const paragraph = 'The quick brown fox jumps over the lazy dog. If the dog barked, was it really lazy ...';

const searchTerm = 'dog';
const indexOfFirst = paragraph.indexOf(searchTerm);

console.log('The index of the first "${searchTerm}" from the begining is ${indexOfFirst}' );
//expected output : The index of the first "dog" from begining is 40

const result = 'Hello world!'.indexOf('world');
console.log(result);

// expected output : 6

const result = 'Hello world!'.indexOf('Heropy');
console.log(result);

// expected output : -1


```

### 기타 method
```javascript
const str = 'Hello world!'


console.log(str.indexOf(('HEROPY') !== -1);

// expected output : false

console.log(str.slice(6,11));

// expected output : world

console.log(str.replace(' world!', ''));

// expected output : Hello

```

### String.prototype.match()
- `match()`에는 안에 정규 표현식을 넣는다.
```javascript
const str = 'thesecon@gmail.com'

console.log(str.match(/.+(?=@)/))

console.log(str.match(/.+(?=@)/)[0])

// expected output : thescon
```

![Screenshot-2023-04-21-at-10.26.28-PM.png](/img/이미지 창고/Screenshot-2023-04-21-at-10.26.28-PM.png)
- 위와 같이 출력된다.

### String.prototype.trim()
```javascript
const str = '    Hello world!   '

console.log(str.trim(str))

//expected output : Hello world!
```

# Integer

```javascript
const pi = 3.14159265358979;
console.log(pi);
// expected output : 3.14159265358979

const str = pi.toFixed(2);
console.log(str);
console.log(typeof str);

// expected output : 
// 3.14
// string

const integer = parseInt(str);
const float = parseFloat(str);
console.log(integer);
console.log(float);
console.log(typeof integer, typeof float);

// expected output : 
// 3
// 3.14
// number number
```

## Math
```javascript
console.log('abs: ', Math.abs(-12));
// abs: 12, 절댓 값

console.log('min: ', Math.min(2, 8));
// abs: 2, 최소 값

console.log('max: ', Math.max(2, 8));
// max: 8, 최대 값

console.log('ceil: ', Math.ceil(3.14));
// ceil: 4, 올림 -> Js는 정수 단위로 올림 처리 한다.

console.log('floor: ', Math.floor(3.14))
// round: 3, 내림

console.log('round: ', Math.round(3.14))
// round: 3, 반올림

console.log('random: ', Math.random())
// radnom: 0.12378947, 랜덤 수
```

# Array
```javascript
const numbers = [1,2,3,4];
const fruits = ['Apple', 'Banana', 'Cherry'];

console.log(nubers[1]);
console.log(fruits);
```

## Method

### Array.prototype.fine()
```javascript
const array1 = [5, 12, 8, 130, 44];

const found = array1.find(element => element > 10);
// 콜백함수
// expected output : 12
```
- `find()` 메서드는 주어진 판별 함수를 만족하는 <mark>첫번째 요소의 값</mark>을 반환한다.
- 그런 요소가 없다면 `undefined` 를 반환한다.

### 기타 Method
```javascript
// .lenght

const numbers = [1, 2, 3, 4];
const fruits = ['Apple', 'Banana', 'Cherry'];

console.log(numbers.lenght);
console.log(fruits.lenght);
console.log([1,2].lenght);

// expected output :
// 4
// 3
// 2

//-------------------------------------------------------------

// .concat
// 두개의 배열을 합치는 함수, 각각의 원본 데이터는 손상되지 않음
console.log(numbers.concat(fruits));
console.log(numbers);
console.log(fruits);

// expected outputs:
// [1, 2, 3, 4, 'Apple', 'Banana', 'Cherry']
// [1, 2, 3, 4]
// ['Apple', 'Banana', 'Cherry']

//-------------------------------------------------------------

// .forEach()
// 배열의 갯수만큼 반복된다.
fruits.forEach(function (element, index, array){
	console.log(element, index, array)
})

// expected outputs: 
// Apple 0 ["Apple", "Banana", "Cherry"]
// Banana 1 ["Apple", "Banana", "Cherry"]
// Cherry 2 ["Apple", "Banana", "Cherry"]

//-------------------------------------------------------------

// .map()

const a = fruits.forEach(function (fruit, index){
	console.log(`${fruit}-${index}`);
	//expected outputs:
	// Apple-0
	// Banana-1
	// Cherry-2
});
console.log(a);
// expected outputs:
// undefined


const b = fruits.map(function (fruit, index){
	return `${fruit}-${index}`
});
console.log(b);
// expected outputs:
// ["Apple-0", "Banana-1", "Cherry-2"]

//-------------------------------------------------------------

// .filter()
const a = numbers.map(number =>{
	return < 3; 
});
console.log(a);

// expected outputs:
// [true, true, false, false]

const b = numbers.filter(number =>{
	return number < 3;
});
//위의 코드와 아래의 코드는 같다.
const c = numbers.filter(number => number < 3);

console.log(b);

// expected outputs:
// [1, 2]

//-------------------------------------------------------------

// .find() .findIndex()
const a = fruits.find(fruit => {
	return /^B/.test(fruit);
});

console.log(a);
// expected outputs:
// Banana

const b = fruits.findIndex(fruit => {
	return /^B/.test(fruit);
});

console.log(b);

// expected outputs:
// 1

//-------------------------------------------------------------

// .includes()

const a = numbers.includes(3);
console.log(a);

// expected outputs:
// true

const b = fruits.includes('HEROPY');
console.log(b);

// expected outputs:
// false

//-------------------------------------------------------------

// .push() .unshift()
// 원본 수정됨 주의!

numbers.push(5);
console.log(numbers);

// expected outputs:
// [1,2,3,4,5];

numbers.unshift(0);
console.log(numbers);

// expected outputs:
// [0,1,2,3,4,5]

//-------------------------------------------------------------

// .reverse()
// 원본 수정됨 주의!

numbers.reverse();
fruits.reverse();

console.log(numbers);
console.log(fruits);

// expected outputs:
// [4,3,2,1]
// ["Cherry", "Banana", "Apple"]

//-------------------------------------------------------------

// .splice()
// 원본 수정됨 주의!

numbers.splice(2, 1);
console.log(numbers);

// expected outputs:
// [1, 2, 4]

numbers.splice(2, 0, 999);

// expected outputs:
// [1, 2, 999, 3, 4]

```

# Object

## Object.assign()
- `Object.assign()` 메소드는 열거할 수 잇는 <mark>하나 이상의 출처 객체</mark>로부터 <mark>대상 객체로 속성을 복사</mark>할 때 사용한다.
```javascript
const target = { a:1, b:2 };
const source = { b:4, c:5 };

const returnedTarget = Object.assign(target, source);

console.log(target);
// expected output: Object { a: 1, b: 4, c: 5}

console.log(returnedTarget);
// expected output: Object { a: 1, b: 4, c: 5}
```

## Ohter Method
```javascript
const userAge = {
	// key : value
	name: 'Heropy',
	age: 85
}
const userEmail = {
	name: 'Heropy',
	email: 'thesecon@gmail.com'
}

const target = Object.assign(userAge, userEmail);
console.log(target);
console.log(userAge);
console.log(target === userAge);

// expected outputs:
// {name : "Heropy", age: 85, email: "thesecon@gmail.com"}
// {name : "Heropy", age: 85, email: "thesecon@gmail.com"}
// true

// 원본 데이터는 손상 시키지 않고, assign을 사용하는 방법
const target = Object.assign({}, userAge, userEmail);

const a = { k: 123 };
const b = { k: 123 };
console.log(a === b);

// expected outputs:
// false

//-------------------------------------------------------------

// .keys()

const user = {
	name: 'Heropy',
	age: 85,
	email: 'thesecon@gmail.com'
}

const keys = Object.keys(user);
console.log(keys)

// expected output:
// ["name", "age", "email"]

console.log(user['email']);

// expected output: thesecon@gmail.com

const values = keys.map(key => user[key]);
console.log(values);

// expected output:
// ["Heropy", 85, "thesecon@gmail.com"]

```

# 구조 분해 할당
```javascript
const user = {
	name = 'Heropy',
	age: 85,
	email: 'thesecon@gmail.com'
}

const { name, age, email, address='Korea' } = user;
// name = user.name 으로 구조 분해 된다.

console.log(`사용자의 이름은 ${name} 입니다.`);
// expected output :
// 사용자의 이름은 Herpoy 입니다.
console.log(`${name}의 나이는 ${age}세입니다.`);
// expected output : 
// Heropy의 나이는 85세 입니다.
console.log(`${name}의 이메일 주소는 ${email}입니다.`);
// expected output:
// Heropy의 이메일 주소는 thesecon@gmail.com
console.log(address);
// undefined

const fruits = ['Apple', 'Banana', 'Cherry'];
const [a,b,c,d] = fruits;
console.log(a, b, c, d)
// Apple Banana Cherrry undefined



```

# 전개 연산자
```javascript
const fruits = ['Apple', 'Banana', 'Cherry'];
console.log(fruits);
// exptected output : ["Apple", "Banana","Cherry"];
console.log(...fruits)
// Apple Banana Cherry

function toObject(a, b, c){
	return{
		a: a,
		b: b,
		c: c
	}
}
console.log(toObject(...fruits));
// expected output : {a: "Apple", b:"Banana", c:"Cherry"}

const fruits = ['Apple', 'Banana', 'Cherry', 'Orange'];
console.log(fruits);
// exptected output : ["Apple", "Banana","Cherry"];
console.log(...fruits)
// Apple Banana Cherry

function toObject(a, b, ...c){
	return{
		a: a,
		b: b,
		c: c
	}
}
console.log(toObject(...fruits));
// ...c -> 나머지 매개변수를 의미함
// expected output : {a: "Apple", b:"Banana", c:["Cherry", "Orange"]}


```

# 얕은 복사 & 깊은 복사
```javascript
const user = {
	name: 'Heropy',
	age : 85,
	emails: ['thesecon@gmail.com']
};
const copyUser = user;

console.log(copyUser === user);
// expected output : true

user.age = 22;
console.log('user', user);
// expected output : [name: "Heropy", age: 22, emails: Array(1)];
console.log('copyUser', copyUser);
// expected output : [name: "Heropy", age: 22, emails: Array(1)];

console.log('-----');
console.log('-----');

// 깊은 복사
const copyUser = Object.assign({}, user);
const copyUser = {...user}

// 하지만, Object안에 있는 배열은 깊은 복사가 되지 못하고 얕은 복사가 되기 때문에, 해당 배열까지 고려를 해야한다.
```


## lodash
- 모든 것들을 깊은 복사를 하기에는 구현하기에 너무 복잡하므로, 깊은 복사를 편하게 해주는 Package가 있다.
```bash
npm i lodash
```

```javascript
import _ from 'lodash'

const user = {
	name: 'Heropy',
	age : 85,
	emails: ['thesecon@gmail.com']
};
const copyUser = _.cloneDeep(user); // 깊은 복사

```

# import, export

```javascript
import _ from 'lodash' // From `node_modules`!
import getType from './getType' // getType.js
import getRandom from './getRandom' // getRandom.js

console.log(_.camelCase('the hello world'));
console.log(getType([1,2,3]));
console.log(getRandom(), getRandom());
```
## Javascript의 import, export 원리
![Pasted-image-20230424095137.png](/img/이미지 창고/Pasted-image-20230424095137.png)
- `Import`를 통해서 외부에 있는 Javascript 파일을 가져온다.
- `Export`는 두가지 방안이 있다.
	- `Default export`라고 하여, 이름을 지정하지 않는 `Export`가 있고,
	- `Named export`라고 하여, 이름을 지정하는 `Export`가 있다.

### Default export
```javascript
export default function (data){
	return ...
}
```

```javascript
import getType from './getType.js'
```
- 위와 같이 `default export`는 함수에 이름이 없어도 된다.
- 한개의 함수만 `export`가 가능하다.
- `import` 시에 이름에 대한 제약은 없다



### Named export
```javascript
export function random(){
	return Math.floor(Math.random() * 10);
}
```

```javascript
import { random } from './getRandom.js'
```
- `named export`의 경우에는 반드시 함수의 이름이 있어야합니다.
- 여러개의 함수에서 `export`가 가능합니다
- `import`시에 이름에 대한 제약이 있으며, `{ }`를 반드시 붙여야한다.
#### 모든 함수를 한번에 가져오기
```javascript
import * as R from './getRandom'
```
- 한번에 모든 function을 불러오려고 할 때, 사용하는 문법이다.

:::tip 와일드카드
- 여러 내용을 한꺼번에 지정할 목적으로 사용하는 기호를 가르킵니다.

:::

# Lodash
[Lodash](https://lodash.com/docs/4.17.15)
## _.uique()
```javascript
_.uniq([2,1,2]);
// expected 
```
- 과 같이 유용한 Method를 아래에 소개하겠습니다.

```javascript
import _ from 'lodash'

const userA = [
	{ 
		userId: '1', 
		name: 'HEROPY'
	},
	{ 
		userID: '2', 
		name: 'Neo'
	}
]
const userB = [
	{ 
		userId : '1', 
		name : 'HEROPY' 
	},
	{ 
		userId : '3', 
		name: 'Amy'
	}	
]
const usersC = usersA.concat(usersB)

console.log('concat', usersC)
console.log('uniqBy', _.uinqBy(usersC, 'usersId'))
// 중복을 검사할 배열, 중복 검사를 기준으로할 key 값
// 이미 합친 데이터에 중복을 검사할 시에는 uniqBy를 사용한다.

const usersD = _.unionBy(usersA, usersB, 'userId')
console.log('unionBy', usersD)
// 합치기 전에 중복을 검사하여 중복 제거 후 합치기 위해서는 unionBy를 사용하면 된다.
// 합칠 배열1, 합칠 배열2, 중복을 검사할 key 값

```

### 결과
```javascript
concat
[
	{
		userId: '1', 
		name: 'HEROPY'
	},
	{
		userID: '2', 
		name: 'Neo'
	},
	{
		userId : '1', 
		name : 'HEROPY'
	},
	{
		userId : '3', 
		name: 'Amy'
	}
]
// 중복이 발생한다.

uniqBy
[
	{
		userId: '1', 
		name: 'HEROPY'
	},
	{
		userID: '2', 
		name: 'Neo'
	},
	{
		userId : '3', 
		name: 'Amy'
	}
]

unionBy
[
	{
		userId: '1', 
		name: 'HEROPY'
	},
	{
		userID: '2', 
		name: 'Neo'
	},
	{
		userId : '3', 
		name: 'Amy'
	}
]
```

```javascript
import _ from 'lodash'

const users = [
	{
		userId : '1',
		name : 'HEROPY'
	},
	{
		userId : '2',
		name : 'Neo'
	},
	{
		userId : '3',
		name : 'Amy'
	},
	{
		userId : '4',
		name : 'Evan'
	},
	{
		userId : '5',
		name : 'Lewis'
	}

]

const foundUser = _.find(users, { name: 'Amy' })
const foundUserIndex = _.findIndex(users, { name: 'Amy' })
console.log(foundUser)
// expected output
// { userId: "3", name: "Amy" }
console.log(foundUserIndex)
//expected output
// 2

_.remove(users, { name: 'HEROPY' })
console.log(users)
// expected output
/*
[
	{ userId : '2', name : 'Neo'},
	{ userId : '3',	name : 'Amy'},
	{ userId : '4',	name : 'Evan'},
	{ userId : '5',	name : 'Lewis'}
]
*/
```

# JSON
```javascript
// JSON (JavaScript Object Notation)
// 자바스크립트의 객체 표기법

const user = {
	name: 'HERPOY',
	age : 85,
	emails: [
		'thescon@gmail.com',
		'neo@zillinks.com'
	]
}
console.log('user', user)

const str = JSON.stringify(user)
console.log('str', str)

console.log(typeof str)

const obj = JSON.parse(str)
console.log('obj', obj)


```

# Storage
## LocalStorage & Session Storage
- LocalStorage는 데이터가 만료되지 않고, Session Storage는 브라우저를 닫게 된다면, 데이터가 만료 된다.

```javascript
const user = {
	name: 'HERPOY',
	age : 85,
	emails: [
		'thescon@gmail.com',
		'neo@zillinks.com'
	]
}

localStorage.setItem('user', user)
// 위의 경우에는 제대로 저장이 되지 않는다.
// Storage 같은 경우에는 key-value로 String 값만 저장되므로 Object 형태로는 저장되지 않는다.
// object를 저장하기 위해서는 해당 object의 값을 전부 string으로 바꾸어야한다.

localStorage.setItem('user', JSON.stringify(user))
// 위의 코드를 통해서 Object객체를 String 화를 진행한 다음 넣어줍니다.
console.log(JSON.parse(localStorage.getItem('user')))
// 위의 코드를 통해서 String화 됐던 Object를 JSON parse를 하여, JSON의 형태로 되돌리는 코드 이다.
localStorage.removeItem('user')
// localStorage에 있는 특정 데이터를 지우기 위해서 사용



```

# Class
ES6 부터 추가된 문법이며, 객체지향적인 표현법을 위해 추가된 문법입니다.
그 전에는 Proptotype Chaning 기술을 사용하면서 작동이 되었습니다.
```js
// 생성자
function Person({name, age}) {
   this.name = name;
   this.age = age;
}

Person.prototype.introduce = function() {
   return `안녕하세요, 제 이름은 ${this.name}입니다.`;
};

const person = new Person({name: '윤아준', age: 19});
console.log(person.introduce()); // 안녕하세요, 제 이름은 윤아준입니다.
```

위와 같은 식으로 class 를 비스 무리하게 표현했습니다.
하지만 클래스가 추가된 ES6부터는 아래와 같이 표현이 가능합니다.

```js
// 클래스
class Person {
   // 이전에서 사용하던 생성자 함수는 클래스 안에 `constructor`라는 이름으로 정의합니다.
   constructor({name, age}) { //생성자
     this.name = name;
     this.age = age;
   }
   // 객체에서 메소드를 정의할 때 사용하던 문법을 그대로 사용하면, 메소드가 자동으로 `Person.prototype`에 저장됩니다.
   introduce() {
     return `안녕하세요, 제 이름은 ${this.name}입니다.`;
   }
}

const person = new Person({name: '윤아준', age: 19});
console.log(person.introduce()); // 안녕하세요, 제 이름은 윤아준입니다.
```

## Class Method 정의
클래스의 메소드를 정의 할 때는 객체 리터럴에서 사용하던 문법과 유사한 문법을 사용한다.

```js
class Calculator {
   add(x, y) {
     return x + y;
   }
   subtract(x, y) {
     return x - y;
   }
 }
 
 let calc = new Calculator();
 calc.add(1,10); // 11
```

객체 리터럴의 문법과 마찬가지로 임의의 표현식을 대괄호로 둘러싸서 메소드의 이름을 사용할 수 도 있습니다.
```js
const methodName = 'introduce'; // 클래스 메소드 이름

class Person {
  constructor({name, age}) {
    this.name = name;
    this.age = age;
  }
  
  // 아래 메소드의 이름은 `introduce`가 됩니다.
  [methodName]() {
    return `안녕하세요, 제 이름은 ${this.name}입니다.`;
  }
}

console.log(new Person({name: '윤아준', age: 19}).introduce()); 
// 안녕하세요, 제 이름은 윤아준입니다.
```

## Getter / Setter
클래스 내에서 `Getter` 혹은 `Setter` 를 정의하고 싶을 때는 메소드 이름 앞에 `get` 또는 `set`을 붙여주면 됩니다.

```js
class Account {
  constructor() {
    this._balance = 0;
  }
  get balance() {
    return this._balance;
  }
  set balance(newBalance) {
    this._balance = newBalance;
  }
}

const account = new Account();
account.balance = 10000;
account.balance; // 10000
```

## Static Method
정적 메서드는 클래스의 인스턴스가 아닌 클래스 이름으로 곧바로 호출 되는 메서드 이다.
static 키워드를 메소드 이름 앞에 붙여주면, 해당 메서드는 정적 메소드가 된다.

우리가 랜덤 값을얻기 위해 `Math.random()` 같은 메서드를 쓰듯이, 
따로 `new Math()` 없이 곧바로 클래스명, 메서드 명으로 함수를 호출해서 사용하는 것이 아닌 바로 random 메소드가 static 으로 설정되어있기 때문이다.
```js
class Person {
   constructor({ name, age }) { // 생성자 인스턴스
      this.name = name;
      this.age = age;
   }
   static static_name = 'STATIC'; // 정적 인스턴스

   getName() { // 인스턴스(프로토타입) 메소드
      return this.name;
   }
   static static_getName() { // 정적 메소드
      return this.static_name;
   }
}

const person = new Person({ name: 'jeff', age: 20 });
person.getName(); // jeff
Person.static_getName(); // STATIC
```

```js
class Person {
   constructor({ name, age }) {
      this.name = name;
      this.age = age;
   }
   // 이 메소드는 정적 메소드
   static static_sumAge(...people) {
      /*
         함수 파라미터 people를 전개연산자 ...people를 통해 배열로 만듬
         [ {"name": "윤아준", age": 19}, { "name": "신하경","age": 20 }]   
      */

      // 그리고 각 객체의 age값을 얻어와 합침
      return people.reduce((acc, person) => acc + person.age, 0);
   }
}

const person1 = new Person({ name: '윤아준', age: 19 });
const person2 = new Person({ name: '신하경', age: 20 });

Person.static_sumAge(person1, person2); // 39
```

## 상속
`extends` 키워드는 클래스를 다른 클래스의 하위 클래스로 만들기 위해 사용된다.

```js
class Parent {
  // ...
}

class Child extends Parent {
  // ...
}
```
위 코드에서, `extends` 키워드를 통해 Child 클래스가 Parent 클래스를 상속했다.
이 관계를 보고 부모 클래스 - 자식 클래스 관계 혹은 슈퍼 클래스 - 서브 클래스 관계 라고 말하기도 한다.



```js
class Parent {
  static staticProp = 'staticProp';
  static staticMethod() {
    return 'I\'m a static method.';
  }
  instanceProp = 'instanceProp';
  instanceMethod() {
    return 'I\'m a instance method.';
  }
}

class Child extends Parent {}

// 상속하면 부모의 static요소들을 사용 가능
console.log(Child.staticProp); // staticProp
console.log(Child.staticMethod()); // I'm a static method.

// 상속하면 부모의 인스턴스를 사용 가능
const c = new Child();
console.log(c.instanceProp); // instanceProp
console.log(c.instanceMethod()); // I'm a instance method.
```











---

#NodeJS #JavaScript

---
