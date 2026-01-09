---
slug: "3-Classes-and-Prototypes"
title: "3. 클래스와 프로토타입"
---

# 클래스와 프로토타입

:::info 개요
JavaScript의 객체 지향 프로그래밍 핵심인 **Prototype Chain**과 이를 현대적으로 구현한 **ES6 Class**, 그리고 생성자 함수(Constructor Function)의 관계를 상세히 설명합니다.
:::

## 1. 생성자 함수 (Constructor Functions)

객체를 생성하기 위한 템플릿(붕어빵 틀) 역할을 하는 함수입니다. 관례적으로 **PascalCase**를 사용하며 `new` 연산자로 호출합니다.

```js
function Person(name) {
  this.name = name;
}

const user = new Person('Kim');
console.log(user.name); // 'Kim'
```

### Prototype의 필요성
메서드를 생성자 함수 내부(`this.method = ...`)에 정의하면, 인스턴스마다 함수가 새로 생성되어 메모리를 낭비합니다.
이를 해결하기 위해 **Prototype**을 사용하여 메서드를 모든 인스턴스가 공유하게 합니다.

```js
Person.prototype.greet = function() {
  return `Hello, ${this.name}`;
};
```

---

## 2. ES6 Class

`class` 문법은 내부적으로 Prototype 기반으로 작동하지만, 더 명확하고 간결한 문법(Syntactic Sugar)을 제공합니다.

```js
class Person {
  constructor(name) {
    this.name = name;
  }

  // 메서드는 자동으로 Prototype에 저장됨
  greet() {
    return `Hello, ${this.name}`;
  }
}
```

### 2.1 Static Method
인스턴스가 아닌 클래스 자체에서 호출되는 메서드입니다. 유틸리티 함수 제작에 주로 쓰입니다.

```js
class MathUtils {
  static add(x, y) {
    return x + y;
  }
}
console.log(MathUtils.add(1, 2)); // 3
```

### 2.2 상속 (Inheritance)
`extends`와 `super` 키워드를 사용하여 쉽게 상속을 구현할 수 있습니다.

```js
class Animal {
  eat() { console.log('Eating...'); }
}

class Dog extends Animal {
  bark() { console.log('Bark!'); }
}

const dog = new Dog();
dog.eat(); // 상속받은 메서드
dog.bark();
```

---

## 3. 프로토타입 체인 (Prototype Chain)

객체의 프로퍼티나 메서드에 접근할 때, 해당 객체에 없으면 `__proto__`(링크)를 따라 상위 프로토타입에서 검색하는 메커니즘입니다.

1. `instance.method()` 호출.
2. 인스턴스 내부에 `method`가 있는가? -> 실행.
3. 없으면 `instance.__proto__` (즉 `Class.prototype`)에서 탐색.
4. 최상위 `Object.prototype`까지 탐색 후 없으면 에러 또는 undefined.
