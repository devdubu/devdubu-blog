---
sticker: vault//이미지/개발 로고/TechIconSVG/JavaScript.svg
---

```bash
npm init -y
npm i parcel-bundler -D
```

- 초반 프로젝트 설정
```json
{
  "name": "regexp",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev" : "parcel index.html",
    "build" : "parcel build index.html"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "parcel-bundler": "^1.12.5"
  }
}
```
-> `script` 부분에서 `"dev" : ~, "build": ~` 부분 수정


# 정규표현식
## 정규표현식(Regular Expression)이란
:::tip 정규표현식이란?
- 문자열을 검색하고 대체하는 데 사용 가능한 일종의 형식 언어(패턴) 입니다.
- 간단한 문자 검색 부터 이메일 패스워드 검사 등의 복잡한 문자 일치 기능 등을 정규식 패턴으로 빠르게 수행 가능하다.
- 단 정규식 패턴이 수행 내용과 매치가 잘 안 되어 가독성이 많이 떨어진다.

:::

- 정규 표현식은 다음과 같은 역할을 한다.

1. 문자 검색(Search)
2. 문자 대체(replace)
3. 문자 추출(extract)

JavaScript는 직접 빌드된 정규 표현식을 지원하는 언어 중 하나로, JS에서 사용되는 정규식을 기준으로 살펴보겠습니다.

## 정규 표현식 테스트 사이트
- 아래의 사이트들을 이용하여 정규식 테스트를 할 수 있습니다.
	- 사이트 별로 설정된 환경이 다르기에, 일부 작동되지 않거나, JS에서 다루는 정규식과 다를 수도 있습니다.
	- 테스트는 필수 입니다.
:::example 정규표현식 사이트
- [https://regex101.com](https://regex101.com)
- [https://regexr.com](https://regexr.com)
- [https://regexper.com](https://regexper.com)

:::

## 정규식 생성
```javascript

//생성자

new RegExp('표현', '옵션');
new RegExp('[a-z]', 'gi');

//리터럴
/표현/옵션
/[a-z]/gi
```

### 실습1
```javascript
const str = `
010-1234-1234
thesecon@gmail.com
https://www.omdbapi.com/?apikey=7035c60c&s=frozen
the quick brown fox jumps over the lazy dog.
abbcccdddd
`
// 1번째 결과
const regexp = new RegExp('the','');
console.log(str.match(regexp));

// 2번째 결과
const regexp2 = new RegExp('the', 'g');
console.log(str.match(regexp2));
// g 옵션은 모두 추출하겠다는 옵션이다.

// 3번째 결과
const regexp3 = new RegExp('the', 'gi');
console.log(str.match(regexp3));

// 리터럴 방식의 정규 표현식
const regexp = /the/gi
console.log(str.match(regexp))
```
#### 1번째 결과
![Pasted-image-20230511092240.png](/img/이미지 창고/Pasted-image-20230511092240.png)

#### 2번째 결과
![Pasted-image-20230511092741.png](/img/이미지 창고/Pasted-image-20230511092741.png)

#### 3번째 결과
![Pasted-image-20230511092502.png](/img/이미지 창고/Pasted-image-20230511092502.png)

# JavaScript RegExp Method

## Method
|메소드|문법|설명|
|--|--|--|
|`exec`| `정규식.exec(문자열)`|일치하는 하나의 정보(Array) 반환|
|`test`| `정규식.test(문자열)`|일치 여부(Boolean) 반환|
|`match`| `문자열.match(정규식)`|일치하는 문자열의 배열(Array) 반환|
|`search`| `문자열.search(정규식)`|일치하는 문자열의 인덱스(Number) 반환|
|`replace`| `문자열.replace(정규식, 대체문자)`|일치하는 문자열을 대체하고 대체된 문자열(String)반환|
|`split`| `문자열.split(정규식)`|일치하는 문자열을 대체하고 대체된 문자열(String)반환|
|`toString`| `생성자_정규식.toString()`|생성자 함수 방식의 정규식을 리터럴 방식의 문자열(String)로 반환|

### test
```javascript
const str = `
010-1234-1234
thesecon@gmail.com
https://www.omdbapi.com/?apikey=7035c60c&s=frozen
The quick brown fox jumps over the lazy dog.
abbcccdddd
`
const regexp = /fox/gi
console.log(regexp.test(str));
// expected output
// true

console.log(str.replace(regexp, 'AAA'))
// expected output
// The quick brown AAA jumps over the lazy dog.
```

## 플래그(Option)
|플래그|설명|
|--|--|
|`g`|모든 문자 일치(global)
|`i`|영어 대소문자를 구분하지 않고 일치(ignore case)|
|`m`|여러줄 일치(multi line)|

```javascript
const str = `
010-1234-1234
thesecon@gmail.com
https://www.omdbapi.com/?apikey=7035c60c&s=frozen
The quick brown fox jumps over the lazy dog.
abbcccdddd
`
// 결과 1
console.log(str.match(/\./gi))

// 결과 2
console.log(str.match(/\.$/gi))
// $는 문장이 끝나는 곳을 의미한다.
// 즉, .$는 완전이 문장이 끝나는 곳에서 마침표를 찾는 것이다.

// 결과 3
console.log(str.match(/\.$/gim))
// 여러줄 옵션을 하게 된다면, 한 라인 마다의 끝부분에서 마침표를 찾는 것이다.
```
![Pasted-image-20230511105836.png](/img/이미지 창고/Pasted-image-20230511105836.png)

## 패턴(표현)
|패턴|설명|
|--|--|
|`^ab`| 줄(line) 시작에 있는 ab와 일치|
|`ab$`| 줄(line) 끝에 있는 ab와 일치|
|`.`| 임의의 한 문자와 일치|
|`a`&verbar;`b` | a또는 b와 일치 (\는 아님)|
|`ab?`| b가 없거나 b와 일치|
|`{3}`| 3개 연속 일치|
|`{3,}`| 3개 이상 연속 일치|
|`{3,5}`| 3개 이상 5개 이하(3~5개) 연속 일치|
|`[abc]`| a 또는 b 또는 c|
|`[a-z]`| a 부터 z 사이의 문자 구간에 일치(영어 소문자)|
|`[A-Z]`| A 부터 Z 사이의 문자 구간에 일치(영어 대문자)|
|`[0-9]`| 0 부터 9 사이의 문자 구간에 일치(숫자)|
|`[가-힣]`| 가 부터 힣 사이의 문자 구간에 일치(한글)|
|`\w`| 63개 문자(Word, 대소영문 52개 + 숫자 10개+ _ )에 일치|
|`\b`| 63개 문자에 잂치하지 않는 문자 경계(Boundary)|
|`\d`| 숫자(Digit)에 일치|
|`\s`| 공백(Space, Tab 등)에 일치|
|`(?=)`| 앞쪽 일치(Lookahead)|
|`(?<=)`| 뒤쪽 일치(Lookbehind|

### 예시
```javascript
const str = `
010-1234-1234
thesecon@gmail.com
https://www.omdbapi.com/?apikey=7035c60c&s=frozen
The quick brown fox jumps over the lazy dog.
abbcccdddd
동해물과 백두산이 마르고 닳도록
`
console.log(
	str.match(/[가-힣]{1,}/g)
)
// expected output
// ["동해물과", "백두산이", "마르고", "닳도록"] 

const h = `   the hello  world   !

`
console.log(
	h.replace(/\s/g, '');
)

// expected output
// thehelloworld!

// 앞쪽 일치
console.log(
	str.match(/.{1,}(?=@)/g)
)
// expected output
// thesecon

// 뒤쪽 일치
console.log(
	str.match(/(?<=@).{1,}/g)
)
// expected output
// gmail.com
```
