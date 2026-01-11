---
slug: "1-SCSS-Fundamentals"
title: "SCSS 기초 (Fundamentals)"
---

# SCSS 기초

:::info 개요
**SCSS** (Sassy CSS)는 CSS의 상위 호환 전처리기로, 중첩(Nesting), 변수(Variables), 연산(Operations) 등 강력한 기능을 제공합니다.
:::

## 1. 중첩 (Nesting)

CSS 선택자를 중첩하여 구조를 더 명확하게 표현할 수 있습니다.

```scss
.container {
  width: 100%;
  h1 {
    color: red;
  }
}
```

### 1.1 상위 선택자 참조 (`&`)
`&` 키워드는 현재 중첩되어 있는 상위 선택자를 가리킵니다. 가상 클래스나 클래스 결합 시 유용합니다.

```scss
.box {
  background: red;
  &:hover {
    background: blue; // .box:hover
  }
  &.active {
    opacity: 1; // .box.active
  }
}
```

---

## 2. 변수 (Variables)

`$` 기호를 사용하여 재사용 가능한 값을 저장합니다.

```scss
$primary-color: royalblue;
$base-size: 16px;

.box {
  color: $primary-color;
  font-size: $base-size;
}
```

### 2.1 데이터 타입
SCSS는 다양한 데이터 타입을 지원합니다.
- **Numbers**: `1`, `10px`, `1.5`
- **Strings**: `"bold"`, `relative`
- **Colors**: `red`, `#000`, `rgba(0,0,0,0.5)`
- **Booleans**: `true`, `false`
- **Lists**: `10px 20px 30px`, `Helvetica, Arial`
- **Maps**: `(key: value)`

---

## 3. 산술 연산

크기 단위 간의 연산을 지원합니다.

```scss
div {
  width: 100% - 20px; // calc로 컴파일 됨 (단위가 다를 경우 calc 사용 권장)
  height: 500px / 2;
}
```

:::warning 나누기 연산 주의
`/` 연산자는 CSS의 구분자(font shorthand 등)로도 쓰이기 때문에, 괄호로 감싸거나 변수와 함께 써야 산술 연산으로 처리됩니다.
:::

```scss
width: (100px / 2); // 50px
width: $size / 2;   // 50px
```

---

## 4. 가져오기 (Import)

`@import`를 사용하여 파일을 분리하고 관리할 수 있습니다.

```scss
// _variables.scss
$main-color: red;

// main.scss
@import "variables";
body { color: $main-color; }
```
