---
slug: "3-Logic-and-Loops"
title: "로직과 반복문 (Logic & Loops)"
---

# 로직과 반복문

:::info 개요
SCSS의 프로그래밍적 요소인 **반복문**(`@for`, `@each`)을 사용하여 반복적인 CSS 코드를 효율적으로 생성하는 방법을 다룹니다.
:::

## 1. @for 반복문

카운터 변수를 이용하여 지정된 횟수만큼 반복합니다.

`from X through Y`: Y를 포함합니다.
`from X to Y`: Y를 포함하지 않습니다.

```scss
// 1부터 3까지 반복
@for $i from 1 through 3 {
  .box:nth-child(#{$i}) {
    width: 100px * $i;
  }
}
```

**컴파일 결과:**
```css
.box:nth-child(1) { width: 100px; }
.box:nth-child(2) { width: 200px; }
.box:nth-child(3) { width: 300px; }
```

---

## 2. @each 반복문 (List & Map)

List나 Map과 같은 순회 가능한 데이터를 반복합니다.

### 2.1 List 순회
```scss
$colors: red, green, blue;

@each $color in $colors {
  .bg-#{$color} {
    background-color: $color;
  }
}
```

### 2.2 Map 순회
Key-Value 쌍으로 이루어진 데이터를 순회할 때 유용합니다.

```scss
$theme-colors: (
  "primary": royalblue,
  "danger": crimson,
  "success": teal
);

@each $key, $value in $theme-colors {
  .btn-#{$key} {
    background-color: $value;
  }
}
```

**컴파일 결과:**
```css
.btn-primary { background-color: royalblue; }
.btn-danger { background-color: crimson; }
.btn-success { background-color: teal; }
```
