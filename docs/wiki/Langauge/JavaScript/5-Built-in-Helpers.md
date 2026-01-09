---
slug: "5-Built-in-Helpers"
title: "5. 내장 객체와 정규표현식"
---

# 내장 객체와 정규표현식

:::info 개요
실무에서 자주 사용되는 **Array**, **String** 내장 메서드와 **정규표현식(RegExp)** 활용 예제를 정리합니다.
:::

## 1. 자주 사용되는 Array 함수

### 1.1 `map`
배열의 모든 요소에 대해 함수를 호출하고, 그 결과를 모아 **새로운 배열**을 반환합니다.

```js
const nums = [1, 2, 3];
const doubled = nums.map(n => n * 2); // [2, 4, 6]
```

### 1.2 `filter`
조건을 만족하는 요소만 모아 **새로운 배열**을 반환합니다.

```js
const evens = nums.filter(n => n % 2 === 0); // [2]
```

### 1.3 `reduce`
배열을 순회하며 하나의 결과값(누산값)으로 줄입니다.

```js
const sum = nums.reduce((acc, cur) => acc + cur, 0); // 6
```

---

## 2. 문자열 및 기타 유틸리티

### `replaceAll`
ES2021에 추가된 문자열 치환 메서드입니다. 기존 `replace`는 첫 번째 매칭만 바꾸지만, 이 메서드는 모두 바꿉니다.

```js
const str = "foo-bar-foo";
console.log(str.replaceAll("foo", "qux")); // "qux-bar-qux"
```

---

## 3. 정규표현식 (RegExp)

문자열에서 특정 패턴을 찾거나 교체할 때 사용합니다.

### 3.1 생성 방식
```js
// 1. 리터럴 방식 (권장: 성능상 이점)
const regex = /ab+c/;

// 2. 생성자 함수 방식 (패턴이 동적으로 변할 때 사용)
// 문자열 내 역슬래시(\) 이스케이프 주의 필요
const regex2 = new RegExp("ab+c");
```

### 3.2 주요 메서드
| 메서드 | 설명 | 반환값 |
| --- | --- | --- |
| `regex.exec(str)` | 매칭 결과 검색 | 배열 (정보 포함) or null |
| `regex.test(str)` | 매칭 여부 확인 | boolean |
| `str.match(regex)` | 매칭 결과 검색 | 배열 or null |
| `str.replace(regex, newStr)` | 매칭된 문자열 치환 | 문자열 |
| `str.split(regex)` | 패턴을 기준으로 분할 | 배열 |

### 3.3 플래그 (Flag)
- **g** (global): 전역 검색 (없으면 첫 번째만 찾음)
- **i** (ignoreCase): 대소문자 무시
- **m** (multiline): 여러 줄 검색 (`^`, `$`가 각 줄에 대응)

### 3.4 주요 패턴 문자
- `^`: 시작, `$`: 끝
- `.`: 임의의 한 문자 (개행 제외)
- `*`: 0회 이상, `+`: 1회 이상, `?`: 0 또는 1회
- `{n, m}`: n회 이상 m회 이하
- `[...]`: 문자셋 (예: `[a-z]` 소문자)
- `[^...]`: 부정 문자셋 (예: `[^0-9]` 숫자 제외)
- `\d`: 숫자, `\w`: 문자(알파벳+숫자+_), `\s`: 공백

### 3.5 활용 예시: 이메일 검증
```js
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
console.log(emailRegex.test("example@test.com")); // true
```

