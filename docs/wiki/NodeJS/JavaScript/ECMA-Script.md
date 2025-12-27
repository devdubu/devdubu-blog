---
slug: "ECMA-Script"
---
# ECMA Script
:::tip ECMA?
- Java Script를 표준화 해주는 국제 표준 기구

:::

## 실습
### 초기화
```shell
npm init -y

npm i parcel-bundler -D
```
#### package.json
```json
{
	...
	 "scripts": {
		  "dev" : "parcel index.html",
		 "build" : "parcel build index.html"
  },
  ...
}
```

#### index.html
```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Document</title>
		<script src="./main.js"></script>
	</head>
	<body>
		<h1>Hello World!</h1>
	</body>
</html>
```

#### main.js
```js
console.log(typeof 'Hello World');
console.log(typeof 123);
console.log(typeof true);
console.log(typeof undefined);
console.log(typeof null);
console.log(typeof {});
console.log(typeof []);
```
![Pasted-image-20231218102449.png](/img/이미지 창고/Pasted-image-20231218102449.png)
- JS에서는 기본적으로 `null`, `{ }`, `[ ]` 를 구분하지 못한다.

- 만약 이를 구분하기 위해서는 약간의 가미가 필요합니다.
```js
function getType(data){
	return Object.prototyle.toString.call(data)
}

console.log(getType(123))
console.log(getType(false))
```
![Pasted-image-20231218102738.png](/img/이미지 창고/Pasted-image-20231218102738.png)

```js
function getType(data){
	return Object.prototyle.toString.call(data).slice(8,-1)
}

console.log(getType(123))
console.log(getType(false))
console.log(getType(null))
console.log(getType({}))
console.log(getType([]))
```
![Pasted-image-20231218103206.png](/img/이미지 창고/Pasted-image-20231218103206.png)

### getType.js
```js
export default function getType(data){
	return Object.prototyle.toString.call(data).slice(8,-1)
}
```
- `export default` 옵션을 사용한다면, 해당 함수를 전역으로 사용 할 수 있게 해줍니다.
- 해당 함수를 사용하면, 아래와 같이 사용할 파일에서 `import`를 해준다면 사용할 수 있습니다.
### main.js
```js

import getType from './getType.js'
...

```

## JS 유효 범위
```js
// 변수 유효 범위(Variable Scope)
// var, let, const

function scope(){
	if(true){
		const a = 123
		console.log(a)
	}
}

scope()
```
- `const`와 `let`은 블록 레벨에서 변수를 선언합니다.
- 즉, 아래와 같은 코드는 에러가 나오게 됩니다.
```js
function scope(){
	console.log(a) // 2번
	if(true){
		console.log(a) // 1번
		const a = 123
	}
}
```
- `const` 와 `let`은 해당 레벨에서 <mark>2번</mark>에서는 Error를 내뿜습니다.
	- 해당 부분을 <mark>블록 레벨</mark>에서 유효 범위를 갖는다 라고 합니다.
- 하지만, `var` 는 블록 레벨이 아닌 함수 레벨입니다.
	- 그렇기에, 아래의 부분에서 에러를 내지 않습니다.
```js
unction scope(){
	console.log(a) // 2번
	if(true){
		console.log(a) // 1번
		var a = 123
	}
}
```

## JS 형 변환
```js
// Truthy (참 같은 값)
// true, { }, [], 1, 2, 'false', -12, '3.14'

// Falsy(거짓 같은 값)
// false , '', null, undefined, 0, -0, NaN
```

## 함수
### 화살표 함수
```js
const double = function(x){
	return x * 2
}
console.log('double: ', double(7))

const doubleArrow = (x) =>{
	return x * 2
}
// 위 함수와 같은 결과로 출력된다.
const doubleArrow = x => x * 2
console.log('doubleArrow', double)

const doubleArrow = x => { x * 2 }
// 위와 같은 형태로는 반환 할 수 없다.

const doubleArrow = x => false
//와 같이 대부분의 자료형을 위와 같이 넣을 수 있다.
// 하지만, 예외적으로 { } 같은 경우에는 아래와 같이 작성해야합니다.

const doubleArrow = x => ({
	name : 'Kim'
})
```

### IIFE
:::tip IIFE?
- Immediately-Invoked Function Experession
- 즉시 실행 함수

:::

```js
const a = 7
function double(){
	console.log(a * 2)
}

double( );
/**

보통의 경우에는
위와 같이 함수 선언 -> 함수 호출 이런식으로 되어있지만, 
즉시 호출 함수를 사용하면 아래와 같은 형태로 생성 된 즉시 호출이 가능합니다.

*/ 

(function(){
	console.log(a * 2)
})();

```

### Hosting
:::tip Hosting?
- 함수 선언부가 유효범위 최상단으로 끌어올려지는 현상

:::

```js
const a = 7

double() // 1번

const double = function() {
	console.log(a * 2);
}
```

- 1번 일때는 아래와 같이 에러가 발생합니다.
	- 당연하게도 `double()` 이라는 함수가 없기 때문에 발생한 에러 입니다.
![Pasted-image-20231218172641.png](/img/이미지 창고/Pasted-image-20231218172641.png)

- 하지만,
```js
const a = 7

double()

function double(){
	console.log(a * 2)
}
```
- 함수 호이스팅에 의해서 함수로 선언된 곳은 JS 엔진에서 최 상단으로 끌어올리게 됩니다.

### 타이머 함수
- `setTimeout(함수, 시간)` : 일정 시간 후 함수 실행
- `setIntervval(함수, 시간)` : 시간 간격마다 함수 실행
- `clearTimeout( )` : 설정된 Timeout 함수를 종료
- `clearInterval( )` : 설정된 Interval 함수를 종

---

#NodeJS #JavaScript 

---


