---
slug: "Constructor-Functions"
---
:::note Constructor Functions?
- 함수 생성자는 여러 프로그래밍 언어에서 클래스와 동의어이다.
- 어떤 경우 사람들은 Reference Types, Class, 데이터 타입을 정의 하도록 해주고, 
- 그 속성과 행동을 통해 여러 객체가 생성될 수 있도록 해주는 생성자라고 이해하면 된다.

:::

```js
function Person(name, position) { 
	this.name = name, 
	this.position = position 
}
```

보통 함수는 괄호화 함께 호출하고 생성자 함수는 `new` 연산자를 사용한다.

```js
const hannah = new Person('Hannah Yoo', 'programmer')
const jisoo = new Person('Jisoo Han', 'student')
```

여기서 우리는 `Person` 이라는 객체를 두 개 생성하고 있다.
`new` 키워드와 함께 생성자 함수가 호출 될 때, `this`는 생성되고 있는 바로 그 객체를 참조한다.

### 단점
#### `prototype` 오염
생성자 함수는 모든 인스턴스가 같은 프로토타입을 공유하는데, 프로토 타입이 변경되면, 모든 인스턴스에 영향을 미칩니다.
#### `this` 바인딩 문제
생성자 함수 내부에서 `this`가 의도한 객체를 가리키지 않는 경우 발생
#### 상속의 복잡성
클래스 기반 상속에 비해서 생성자 함수를 통해 상속을 구현하는 것이 더 복잡한 문제입니다.



## Methods
메소드는 생성자 함수 안에서 속성에 함수를 할당하면서 정의된다.
```js
function Person(name) { 
	this.name = name; 
	this.hi = function () {
		console.log(`Hi, My name is ${this.name}`)
	} 
} 
const hannah = new Person('Hannah Yoo'); 
hannah.hi(); // Hi, My name is Hannah Yoo
```
여기서 `hi` 속성은 할당된 함수이다.
`Person` 객체가 호출 될 때, `this` 키워드는 새로 생성된 `Person` 객체에 응답 할 것이다.

이런 방식으로 메소드가 정의 된다 해도 이런 접근법은 약간 귀찮다.
`Person` 인스턴스가 생성될 때마다 그 객체의 `hi` 프로퍼티에 새로운 함수가 정의되고, 할당된다.

만일 우리가 5개의 Person 객체를 생성한다 치면, 각자 모두가 같은 일을 하는 자신만의 `hi` 메소드를 가지게 된다.
더 효율적인 방법은 `hi` 속성을 한 번만 정의하는 것이다.

그리고 각 `Person` 객체는 같은 함수를 참조하면 된다.
이를 위해서는 함수의 `prototype`을 써볼 수 있다.

```js
function Person(name) {
    this.name = name;
}

Person.prototype.hi = function () {
    console.log('hi my name is' + this.name)
}
const hannah = new Person('Hannah Yoo')
const jisoo = new Person('Jisoo Han')

hannah.hi();
jisoo.hi();
```
여러 번 `Person.prototype`에 새로운 메서드를 추가하는 것보다 그냥 `Person.prototype` 객체를 재 정의하는 게 낫다.
앞서 `prototype`이 거의 빈 객체라고 언급했는데, 정확히 말하자면, `prototype`은 `constructor`라는 속성을 가지고 있고,
이는 생성자 함수를 가리킨다.

우리가 완전히 새로운 객체로 `prototype`을 덮어 씌운다면, 이 `constructor`속성도 `reset`  해야 한다.

### 왜 Prototype에 써야 하는 걸까?
`prototype` 위의 그 어떤 것이든 모든 해당 인스턴스 객체 사이에 공유되기 때문에, 우리는 `prototype`에 선언된 메소드랄지 생성자 객체 위에 저장된 속성 만을 보곤 한다.

메소드는 공유된 행동 양식으로 각 객체는 자신만의 유일한 메소드가 없다.
하지만, 각 객체는 자신만의 속성을 가져야 할 때 도 있는 법이다.

`prototype`이 아니라 객체 자체에 정의된 속성은 `own properties`라고 불린다.

### ES6 classes
ES6 덕분에 우리는 위 생성자 함수를 class 문법으로 쓸 수 있게 되었습니다.
```js
class Person { 
	constructor(name) { 
		this.name = name; 
	} 
	hi() { 
		console.log('..') 
	} 
}
```
여기서 `hi()`는 `Person.prototype`에 저장된다.

### Property Lookups
만일 우리가 객체와 생성자의 prototype에 같은 이름의 속성을 선언하면, 어떤 일이 벌어질까?

```js
function Person(name) { 
	this.name = name; 
	this.walk = function () { 
		console.log('moon walking') 
	} 
} 
Person.prototype.walk = function () { 
	console.log('normal walking') 
}; 

const mj = new Person('Michael Jackson'); 
mj.walk();
```
이 예제에서는, `walk`이라는 메소드가 Person 인스턴스와 `Person.prototype` 에 각각 선언되었다.
콘솔에는 뭐라고 찍힐까?

JavaScript는 우선 객체 자신의 `own property` 부터 찾으려 한다.
만일 `own property`가 존재한다면, 해당 속성이 사용된다.

그렇지 않으면, 해당 객체를 만든 함수의 `prototype`을 찾아보려 할 것이다.
따라서 위 예제에서는 `mj` 객체 자체에서 `walk` 가 발견되고, 콘솔에는 `moon walking`이 찍힐 것이다.
만일 `Person` 객체가 아래처럼 생겼다면, 객체 자체에 `walk` 메서드가 발견되지 않으니,
JS는 `walk` 메서드가 발견되는 `Person.prototype`을 찾게 되고, `normal walking`이 콘솔에 찍힐 것이다.

```js
function Person(name) { 
	this.name = name; 
}
```

### 상속
만일 클래스 기반의 언어를 공부한 사람이라면, 상속이 어떻게 작동하는지 궁금할 것이다.
Animal 이라는 생성자가 있다고 해보자.
```js
function Animal() {} 
Animal.prototype.eat = function () { 
	console.log('eating') 
};
```

이번에는 Cat 생성자가 있다고 해보자

```js
function Cat() { 
	Cat.prototype.meow = function () { 
		console.log('meowing'); 
	} 
};
```

Cat은 동물의 한 중료이니, Animal로부터 확장된 Cat을 갖고자 한다.
상속을 하기 위한 한 가지 방법은 아래와 같다.
```js
function Animal() {} 
Animal.prototype.eat = function () { 
	console.log('eating') 
} 

function Cat(){} 
Cat.prototype = new Animal(); 
Cat.prototype.constructor = Cat; 

Cat.prototype.meow = function () { 
	console.log('meowing'); 
}
```

예전에는 클래스 기반의 언어를 사용한 적이 있다면, 분명 이 대목에서 뭔가 할 것이다.
굉장히 투박해 보이지 않은가?
ES6의 클래스가 이 과정을 깔끔하게 만들어주었다.

```js
class Animal { 
	eat() { 
		console.log('eating') 
	} 
}

class Cat extend Animal () { 
	meow() { 
	console.log('meowing') 
	} 
}
```


----

#NodeJS #JavaScript 

---