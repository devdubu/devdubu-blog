---
slug: "JavaScript-자주-사용되는-함수"
---
# String
## Method

### `String.prototype.indexOf()`
- `indexOf()` 메서드는 호출한 `String`객체에서 주어잔 값과 일치하는 첫 번째 인덱스를 반환한다.
- 일치하는 값이 없으면 `-1`을 반환한다.

#### ex1
```javascript
const paragraph = 'The quick brown fox jumps over the lazy dog. If the dog barked, was it really lazy ...';

const searchTerm = 'dog';
const indexOfFirst = paragraph.indexOf(searchTerm);


console.log('The index of the first "${searchTerm}" from the begining is ${indexOfFirst}' );
//expected output : The index of the first "dog" from begining is 40

// 특정 단어의 시작점 index 추출
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

// 특정 단어 자르기(시작점, 끝점)
console.log(str.slice(6,11));

// expected output : world

// 특정 단어 교체하기(특정단어, 교체할 단어)
console.log(str.replace(' world!', ''));

// expected output : Hello

```

### `String.prototype.match()`
- `match()`에는 안에 정규 표현식을 넣는다.
```javascript
const str = 'thesecon@gmail.com'

console.log(str.match(/.+(?=@)/))

console.log(str.match(/.+(?=@)/)[0])

// expected output : thescon
```

![Screenshot-2023-04-21-at-10.26.28-PM.png](/img/이미지 창고/Screenshot-2023-04-21-at-10.26.28-PM.png)
- 위와 같이 출력 된다.

### String.prototype.trim()

```javascript
const str = '    Hello world!   '

console.log(str.trim(str))

//expected output : Hello world!
```

# Number


## Math

### 수학적 함수

```js
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




### 자릿수 지정

:::tip 해당 함수들을 사용 시에 return 값은 string 입니다.
- 공통적으로 소수점을 잘라야 할 상황이 생긴다면, 반올림은 진행합니다.

:::

#### `.toFixed()`

소수점을 표기를 고정적으로 하는 함수 입니다.

```js
// 소수 자릿수 지정
const num = 3.14159;

console.log(num.toFixed(2)); // 출력 결과: "3.14" 
console.log(num.toFixed(4)); // 출력 결과: "3.1416" 
console.log(num.toFixed(0)); // 출력 결과: "3"

const num1 = 30
console.log(num.toFixed(2)) // 출력 결과 : 30.00
```

#### `toPrecision()`

지정된 숫자를 기준으로 자릿수를 표기합니다. 
소수 점이 아닌 해당 숫자의 자릿수를 표현하는 것입니다.

```js
const num = 123.456;

console.log(num.toPrecision(4)); // 출력 결과: "123.5" 
console.log(num.toPrecision(6)); // 출력 결과: "123.456" 
console.log(num.toPrecision(2)); // 출력 결과: "1.2e+2" 
console.log(num.toPrecision(7)); // 출력 결과: "123.4560"
```

`toExpontential()`

숫자를 <mark>지수 표현</mark>식으로 표기 해줍니다.

```js
const num = 13.215123
console.log(num.toExponential(3)) // 출력 결과 : 1.322e+1
console.log(num.toExponential(4)) // 출력 결과 : 1.3215e+1
```


### 소수점 컨트롤

:::warning JS에서의 반올림은 소숫점 1자릿수 이상 부터는 부정확한 값이 나옵니다.

:::

실제 1.05와 1.04를 테스트 해봐도 다르다는 것을 알 수 있습니다.

:::note 해결방안
- 반올림을 진행할 때는 <mark>임의로</mark> 소숫점 1자리로 맞춰 놓고, 반올림이 된 후에는 다시 해당 계산을 원복 하는 방식입니다.

:::

```js
// x를 소수 3자리에서 반올림
const x = 1.0156

const result = (Math.round(x * 100))/100
```


#### 소숫점 반올림

```js
// 1.반올림
console.log(Math.round(1)); // 1
console.log(Math.round(1.222)); // 1
console.log(Math.round(1.5)); // 2
console.log(Math.round(1.777)); // 2

// 2. null 또는 0인 경우
console.log(Math.round(null)); // 0
console.log(Math.round(0)); // 0

// 3. 음수인 경우
console.log(Math.round(-1)); // -1
console.log(Math.round(-1.111)); // -1
console.log(Math.round(-1.5)); // -1
console.log(Math.round(-1.777)); // -2
```

#### 소숫점 올림
```js
// 1.올림
console.log(Math.ceil(1)); // 1
console.log(Math.ceil(1.222)); // 2
console.log(Math.ceil(1.5)); // 2
console.log(Math.ceil(1.777)); // 2

// 2. null 또는 0인 경우
console.log(Math.ceil(null)); // 0
console.log(Math.ceil(0)); // 0

// 3. 음수인 경우
console.log(Math.ceil(-1)); // -1
console.log(Math.ceil(-1.111)); // -1
console.log(Math.ceil(-1.5)); // -1
console.log(Math.ceil(-1.777)); // -1
```

#### 소숫점 내림

```js
// 1.내림
console.log(Math.floor(1)); // 1
console.log(Math.floor(1.222)); // 1
console.log(Math.floor(1.5)); // 1
console.log(Math.floor(1.777)); // 1

// 2. null 또는 0인 경우
console.log(Math.floor(null)); // 0
console.log(Math.floor(0)); // 0

// 3. 음수인 경우
console.log(Math.floor(-1)); // -1
console.log(Math.floor(-1.111)); // -2
console.log(Math.floor(-1.5)); // -2
console.log(Math.floor(-1.777)); // -2
```

# Array

## Method

### `Array.prototype.fine()`
```javascript
const array1 = [5, 12, 8, 130, 44];

const found = array1.find(element => element > 10);
// 콜백함수
// expected output : 12
```
- `find()` 메서드는 주어진 판별 함수를 만족하는 <mark>첫번째 요소의 값</mark>을 반환한다.
- 그런 요소가 없다면 `undefined` 를 반환한다.


### `.lenght`

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
```

### `.concat()`

:::quote 두개의 배열을 합치는 함수, 각각의 원본 데이터는 손상되지 않음

:::

```js
const numbers = [1, 2, 3, 4];
const fruits = ['Apple', 'Banana', 'Cherry'];

console.log(numbers.concat(fruits));
console.log(numbers);
console.log(fruits);

// expected outputs:
// [1, 2, 3, 4, 'Apple', 'Banana', 'Cherry']
// [1, 2, 3, 4]
// ['Apple', 'Banana', 'Cherry']

```

### `.forEach()`

:::queto 반복문의 다른 형태

:::

```js
const numbers = [1, 2, 3, 4];
const fruits = ['Apple', 'Banana', 'Cherry'];

// .forEach()
// 배열의 갯수만큼 반복된다.
fruits.forEach(function (element, index, array){
	console.log(element, index, array)
})

// expected outputs: 
// Apple 0 ["Apple", "Banana", "Cherry"]
// Banana 1 ["Apple", "Banana", "Cherry"]
// Cherry 2 ["Apple", "Banana", "Cherry"]

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

```

### `map()`

:::quote 반복문의 다른 형태

:::

```js
const numbers = [1, 2, 3, 4];
const fruits = ['Apple', 'Banana', 'Cherry'];

const b = fruits.map(function (fruit, index){
	return `${fruit}-${index}`
});
console.log(b);
// expected outputs:
// ["Apple-0", "Banana-1", "Cherry-2"]
```

### `filter()`

:::quote 배열의 특정 조건을 기준으로 추출할 때

:::

```js
const numbers = [1, 2, 3, 4];
const fruits = ['Apple', 'Banana', 'Cherry'];


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

```

### `.find()`, `.findIndex()`

:::quote 배열의 특정 조건을 찾거나 혹은 특정 조건의 index를 return 함

:::

```js
const numbers = [1, 2, 3, 4];
const fruits = ['Apple', 'Banana', 'Cherry'];

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
```

### `.include()`

:::quote 배열의 특정 조건을 있다면 true, 없다면 false

:::

```js
const numbers = [1, 2, 3, 4];
const fruits = ['Apple', 'Banana', 'Cherry'];

const a = numbers.includes(3);
console.log(a);

// expected outputs:
// true

const b = fruits.includes('HEROPY');
console.log(b);

// expected outputs:
// false

```

### `.push()` , `.unshift()`

:::warning 원본 수정 주의

:::

:::quote 배열 내에 변수를 넣는 함수 입니다.
- `push()` : 맨 뒤에 해당 변수를 넣음
- `unshift()` : 맨 앞에 해당 변수를 넣음

:::

```js
const numbers = [1, 2, 3, 4];
const fruits = ['Apple', 'Banana', 'Cherry'];

numbers.push(5);
console.log(numbers);

// expected outputs:
// [1,2,3,4,5];

numbers.unshift(0);
console.log(numbers);

// expected outputs:
// [0,1,2,3,4,5]

```

### `.reverse()`

:::warning 원본 수정 주의

:::

:::quote 배열 내에 배치를 역으로 바꾸는 함수 입니다.

:::

```js
const numbers = [1, 2, 3, 4];
const fruits = ['Apple', 'Banana', 'Cherry'];


numbers.reverse();
fruits.reverse();

console.log(numbers);
console.log(fruits);

// expected outputs:
// [4,3,2,1]
// ["Cherry", "Banana", "Apple"]

```

### `.splice()`

:::warning 원본 수정 주의

:::

:::quote 배열 내에 특정 인덱스, 길이 만큼 자르는 함수 입니다.

:::

```js
const numbers = [1, 2, 3, 4];
const fruits = ['Apple', 'Banana', 'Cherry'];

numbers.splice(2, 1);
console.log(numbers);

// expected outputs:
// [1, 2, 4]

numbers.splice(2, 0, 999);

// expected outputs:
// [1, 2, 999, 3, 4]

```

# Object

## Method

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

```

### `.key()`

:::quote 객체의 key값을 컨트롤하는데 사용되는 함수

:::

```js

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

## 구조 분해 할당

:::question 특정 객체를 여러 개의 변수로 변환 하고 싶을 때

:::

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

## 전개 연산자

:::quote Array 또는 Object의 특성을 없애는 연산자

:::

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

:::warning Object 또는  Array에서 가장 많이 나오는 이슈 입니다.
- Refernece 변수들의 특성과 특징을 가장 잘 보여주는 부분 입니다.
- 해당 부분으로 인해서 버그가 많이 발생될 수 있으니, 반드시 숙지 바랍니다.

:::

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

