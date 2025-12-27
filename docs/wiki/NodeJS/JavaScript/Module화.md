# Class
:::tip Js 여전히 P**rototype 기반**으로 클래스 기반이 아닙니다.

:::

## Prototype 이해하기

JS의 모든 객체는 ProtoType 객체로부터 속성과 메소드를 동적으로 상속 받습니다.
`new` 키워드로 호출하는 생성자 함수(Constructor Function)로부터 반환되는 데이터를 인스턴스(Instance)라고 하며, 
인스턴스는 생성자 함수의 `prototype` 객체의 멤버를 참조할 수 있다.

:::note 일반 함수와 생성자 함수(클래스)의 구분을 위해, 생성자 함수 이름은 PascalCase로 작성하는 것이 Convention 입니다.
- 그리고 이렇게 정의 한 생성자 함수를 Class라고 부릅니다.

:::

생성자 함수(클래스)와 인스턴스의 기본 구조는 다음과 같습니다.
```js
function 클래스() { 
	// constructor! 
} 
클래스.prototype.메소드 = function() {
	// ...
 } 
 console.log(클래스.prototype) // { constructor: f, 메소드: f } 
 const 인스턴스A = new 클래스() 
 인스턴스B.메소드() 
 
 const 인스턴스B = new 클래스() 
 인스턴스B.메소드()
```

다음 생성자 함수 예제를 봅시다.
`User` 함수의 `prototype` 속성에 추가한 `great`메소드는, 각 인스턴스(`heropy`, `neo` 객체)에 공유되는 것을 확인 할 수 있습니다.
따라서, 각 인스턴스의 `great` 메소드를 일치 연산자로 비교한 결과 `true`가 됩니다.


:::info 일치 연산자( `===` )는 좌우 피연산자의 메모리 주소가 같은지 비교합니다.

:::

```js
function User(name) { 
	this.name = name 
} 
User.prototype.greet = function() { 
	return `Hello, I'm ${this.name}.` 
} 

const heropy = new User('Heropy') 
console.log(heropy.greet()) // 'Hello, I'm Heropy.' 

const neo = new User('Neo') 
console.log(neo.greet()) // 'Hello, I'm Neo.' 

console.log(heropy.greet === neo.greet) // true
```
각 인스턴스는 `__proto__` 속성으로 자신의 프로토타입 객체 참조를 확인할 수 있으며, 콘솔에서는 `[Prototype](Prototype)` 으로 표시 됩니다.

:::warning `__proto__` 속성은 단순히 브라우저에서 지원하는 비 표준 속성입니다.

:::

```js
console.log(User.prototype === heropy.__proto__) // true 
console.log(heropy.__proto__) 
console.log(neo.__proto__)
```

![Pasted-image-20241021094618.png](/img/이미지 창고/Pasted-image-20241021094618.png)

위 예제와 다르게, 매번 Literal 방식으로 생성한 각 객체의 `great` 메소드는 서로 공유 되지 않습니다.
따라서 각 객체의 `great` 메소드를 일치 연산자로 비교한 결과 `false`가 됩니다.
```js
function createUser(name) { 
	return { 
		name, 
		greet() { 
			return `Hello ${this.name}` 
		} 
	} 
} \
const heropy = createUser('Heropy') 

console.log(heropy.greet()) // 'Hello, I'm Heropy.' 

const neo = createUser('Neo') 

console.log(neo.greet()) // 'Hello, I'm Neo.' 
console.log(heropy.greet === neo.greet) // false
```
![Pasted-image-20241021095825.png](/img/이미지 창고/Pasted-image-20241021095825.png)

## Class 문법
ES2015부터 추가된 클래스 문법은 ProtoType 기반 생성자 함수의 문법적인 간소화 버전 입니다.
따라서 작성하는 문법만 다를 뿐, ProtoType 기반의 코드와 같습니다.

```js
class 클래스 { 
	constructor() { 
		// constructor! 
	} 
	메소드() { 
		// ... 
	} 
} 
console.log(클래스.prototype) // { constructor: f, 메소드: f } 
const 인스턴스A = new 클래스() 
인스턴스A.메소드() 

const 인스턴스B = new 클래스() 
인스턴스B.메소드()
```

## Constructor
:::info `constructor`는 클래스 내부에서 인스턴스 객체를 초기화 하는 특수한 메서드 입니다.
- 클래스 내에 한 개만 존재할 수 있으며, 만약 명시적으로 작성하지 않으면, 암시적으로 빈 `constructor`가 생성됩니다.
- 따라서 초기화 할 내용이 없다면, `constructor`를 작성하지 않아도 됩니다.

:::

```js
class User { 
	constructor(name) { 
		this.name = name 
	} 
	greet() { 
		return `Hello, I'm ${this.name}.` 
	} 
} 

const heropy = new User('Heropy') 
console.log(heropy.greet()) // 'Hello, I'm Heropy.' 

const neo = new User('Neo') 
console.log(neo.greet()) // 'Hello, I'm Neo.' 

console.log(heropy.greet === neo.greet) // true
```

### Getter
`get` 키워드를 통해, 특정한 속성의 값을 얻거나 속성을 계산해 반환하는 메소드를 정의할 수 있습니다.
이렇게 정의한 메소드를 Getter 라고 부르며, 계산된 속성(Computed)으로 이해할 수도 있다.
Getter는 함수지만, 호출하지 않고 속성처럼 사용합니다.

```js
class Counter { 
	constructor(initialValue = 1) { 
		this.value = initialValue 
	} 
	get double() { 
		return this.value * 2 
	} 
	increase() { 
		this.value += 1 
	} 
} 

const counter = new Counter(1) 

console.log(counter.value) // 1 
console.log(counter.double) // 2 

counter.increase() 

console.log(counter.value) // 2 
console.log(counter.double) // 4
```

### Setter
`set` 키워드를 통해, Getter에 값을 할당했을 때, 호출하는 메소드를 정의 할 수 있다.
이렇게 정의한 메소드를 Setter라고 부릅니다.

다음 예제에서, `double` 속성(getter)은 `value`속성을 기준으로 값을 계산해 반환 합니다.

```js
class Counter { 
	constructor(initialValue = 1) { 
		this.value = initialValue 
	} 
	get double() { 
		return this.value * 2 
	} 
	set double(){
		this.value = newValue / 2
	}
	increase() { 
		this.value += 1 
	} 
} 

const counter = new Counter(1) 

console.log(counter.value) // 1 
console.log(counter.double) // 2 

counter.increase() 

console.log(counter.value) // 2 
console.log(counter.double) // 4
```

## Static Method
:::note Static 키워드를 통해, 클래스의 인스턴스 없이 호출하는 메소드를 정의 할 수 있다.
- 이렇게 정의한 메소드를 정적 메소드(Static Method)라고 부릅니다.
- 주로, 클래스 단위로 사용하는 유틸리티(Utilities) 함수를 정의할 때 사용합니다.


:::

---

#NodeJS #JavaScript 

---