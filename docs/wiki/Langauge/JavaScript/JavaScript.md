필자가 JavaScript와 함께한 인연이 어언 5년이 지났다,, 지난 5년동안 Js를 공부하면서도 모르는 내용들이 너무 많아서, 초짜의 마음으로 다시 돌아가서 정리하기로 결심하게 됐습니다.

JavaScript가 인터프리터 언어니 뭐니 하는 그런 상투적인 설명은 이미 다른 곳에서도 많이 있다보니, 저는 담백하게 JavaScript의 문법 위주로 글을 작성하겠습니다

# 자료형

Java에도 자료형이 있듯이, JavaScript에도 자료형 역시 존재합니다.
사실 JavaScript에서 자료형은 있는듯 마는듯 햇지만, TypeScript의 두등장으로 인해서 자료형이 JavaScript단에서부터 배우는 것이 좋다고 판단 됩니다.

## String

:::tip 리터럴 객체
- `new` 라는 키워드 없이 단순히 `'', ""` 과 같은 문자로 해당 자료형을 표현한다.
- 기호를 이용해서 자료형을 만드는 것을 리터럴 방식이다.

:::

```js
const paragraph = 'The quick brown fox jumps over the lazy dog. If the dog barked, was it really lazy ...';
```

이런 것처럼 `''`. `""` 를 이용한 자료형을 말합니다. 흔히 문자열이라고 표현을 하죠
String이라는 것을 <mark>선언</mark> 해야하는 Java와는 달리 최신의 언어일 수록 자료형을 <mark>추론</mark> 하는 능력이 생기기 시작하면서 오히려 자료형을 적지 않는 것을 권장합니다.

~~휴먼은 아무것도 하지 말라는 거죠 휴먼 에러 일어나니까 따흑~~

:::tip [JavaScript 자주 사용되는 함수#String](JavaScript-자주-사용되는-함수.md#String) 편을 보시게 된다면, String 변수를 컨트롤 하는 함수들 모음을 볼 수 있습니다. 참고 하시면 됩니다.

:::

## Number

사실 `int`와 `float` 는 Java 혹은 C언어 기준으로 본다면 익숙하실 것입니다.
그리고 JavaScript를 아시는 분들이라면 Int 형은 없다는 것을 아실 겁니다.

그럼에도 불구하고 Integer라고 소개를 하는 이유는 실제 함수가 생기기도 햇고, 이 부분이 친숙하신 분들이 더 많다고 생각이 들어서 이긴 합니다.

```js
const pi = 3.14159265358979;
console.log(pi);
// expected output : 3.14159265358979
```

실제로 위와 같은 변수를 `typeof()` 로 찍어서 보면, `Number` 타입으로 반환 됩니다.
JavaScript 상에서는 Number 타입 으로 내부적으로 추론되는 것도 사실 입니다.

그러니 실제로는 Number타입으로 선언 하는게 맞겠죠?
실제 JavaScript에서는 부동소수와 정수를 구분하는 자료형은 없습니다.

내부적으로는 Number로 통일해서 구분할 뿐이고,
```js
const integer = parseInt(str);
const float = parseFloat(str);

console.log(typeof integer, typeof float);
// number number
```

위 함수 또한 `typeof()` 를 하게 된다면, 동일하게 number로 찍힙니다.
차이점은 다른 언어에서 처럼 Int와 Float 처럼 작동하게 하는 <mark>함수</mark> 라는 것입니다.

:::tip [JavaScript 자주 사용되는 함수#Number](JavaScript-자주-사용되는-함수.md#Number) 해당 페이지에, Number 관련된 함수들이 나열되어있습니다.

:::

## Array

다른 언어에서도 흔히 있는 맞습니다. 그 Array입니다.
사용법은 다들 안다는 가정 하에 예시만 보여드리겠습니다.
```js
const numbers = [1,2,3,4];
const fruits = ['Apple', 'Banana', 'Cherry'];

console.log(nubers[1]); // 출력 결과 : 2
console.log(fruits); // 출력 결과 : ['Apple', 'Banana', 'Cherry']
```

Array는 실제로 사용 하다 보면 함수와 같이 조합해서 사용하는 경우가 거의 대부분입니다(경험 상)

:::tip 사실상 Array의 본체인 [JavaScript 자주 사용되는 함수#Array](JavaScript-자주-사용되는-함수.md#Array)를 보시면 본체와 마주하게 될겁니다.

:::

## Object

python, java 모두 다 다르게 부릅니다.
딕셔너리 또는 Map 이라고도 부르고 다양하게 부르지만, JavaScript에서는 Object라고 불립니다.

사실 JS에서도 Object는 이거야! 이런 게 정의 된지 얼마 안된 걸로 알고는 있습니다.
그만큼 Object 즉, 객체 라는 의미 자체가 되게 포괄적으로 작용하긴 합니다.

그래도 여기서는 아래와 같은 자료형을 Object라고 하니 혼동 없이 보시면 됩니다.

```js
const target = { a:1, b:2 };
const source = { b:4, c:5 };
```

사실 Object도 Array 와 마찬가지로 고냥 가만 보면 별거 없습니다.
왜냐구요? Object의 본체는 이를 활용하는 함수에 있습니다 ㅎ

:::tip Object의 본체를 마주하시려면 [JavaScript 자주 사용되는 함수#Object](JavaScript-자주-사용되는-함수.md#Object) 를 확인하시면 됩니다.

:::

:::note 위 Reference 객체(Array, Object) 를 다루다 보면 함수를 만드는 것이 귀찮을 때가 많습니다.
- 이럴 때 대안으로 쓰이는 package가 `lodash`라는 패키지 입니다.
- 해당 패키지를 이용하면, Reference 객체를 좀 더 쉽게 다룰 수 있게 됩니다.

:::

# 모듈화

## import, export

JavaScript에서는 기본적으로 private 한 속성을 가지고 있습니다.
그렇기 때문에, 따로 지정하지 않으면, 파일 단위 외부에서 사용이 불가능 합니다.

외부에서 사용하기 위해서는 JavaScript에서의 Export 속성을 붙여 줘야지 만, 해당 함수나 변수를 외부에서 사용할 수 있게 합니다.

그리고 export 선언 후, import를 하면 비로소 외부 파일에 있는 함수 및 변수를 사용 가능합니다.

![Pasted-image-20230424095137.png](/img/Pasted-image-20230424095137.png)


- `Import`를 통해서 외부에 있는 Javascript 파일을 가져옵니다.
- `Export`는 두 가지 방안이 있습니다.
	- `Default export`라고 하여, 이름을 지정하지 않는 `Export`가 있고,
	- `Named export`라고 하여, 이름을 지정하는 `Export`가 있습니다.

### Default export
```javascript
export default function (data){
	return ...
}
```

```javascript
import getType from './getType.js'
```
- 위와 같이 `default export`는 함수에 이름이 없어도 됩니다.
- 한개의 함수만 `export`가 가능합니다.
- `import` 시에 이름에 대한 제약은 없습니다



### Named export
```javascript
export function random(){
	return Math.floor(Math.random() * 10);
}
```

```javascript
import { random } from './getRandom.js'
```
- `named export`의 경우에는 반드시 함수의 이름이 있어야 합니다.
- 여러개의 함수에서 `export`가 가능 합니다
- `import`시에 이름에 대한 제약이 있으며, `{ }`를 반드시 붙여야 합니다.
#### 모든 함수를 한번에 가져오기
```javascript
import * as R from './getRandom'
```
- 한번에 모든 function을 불러오려고 할 때, 사용하는 문법 입니다.

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

:::note 클래스의 메소드를 정의 할 때는 객체 리터럴에서 사용하던 문법과 유사한 문법을 사용합니다.

:::

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
:::note 정적 메서드는 클래스의 인스턴스가 아닌 클래스 이름으로 곧바로 호출 되는 메서드 입니다.

:::

static 키워드를 메소드 이름 앞에 붙여주면, 해당 메서드는 정적 메소드가 됩니다.

우리가 랜덤 값을 얻기 위해 `Math.random()` 같은 메서드를 쓰듯이, 
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

:::note extends 키워드는 클래스를 다른 클래스의 하위 클래스로 만들기 위해 사용됩니다.

:::

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



