---
slug: "2-Mixins-and-Functions"
title: "2. 재사용성 (Mixins & Functions)"
---

# 재사용성 (Mixins & Functions)

:::info 개요
코드를 재사용하기 위한 **Mixin**과 값을 계산하여 반환하는 **Function**에 대해 다룹니다.
:::

## 1. 믹스인 (Mixin)

스타일 그룹을 정의하고 재사용할 수 있습니다. `@mixin`으로 정의하고 `@include`로 사용합니다.

### 1.1 기본 사용
```scss
@mixin center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.box {
  @include center;
}
```

### 1.2 인수 (Arguments)
함수처럼 인수를 전달받아 동적으로 스타일을 생성할 수 있습니다.

```scss
@mixin box($size, $color: tomato) { // 기본값 설정 가능
  width: $size;
  height: $size;
  background-color: $color;
}

.item {
  @include box(100px);      // color는 tomato
  @include box(200px, red); // color는 red
}
```

### 1.3 컨텐츠 블록 (@content)
Mixin 내부에 추가 스타일 블록을 주입할 수 있습니다. 미디어 쿼리나 가상 요소 처리에 유용합니다.

```scss
@mixin mobile {
  @media (max-width: 768px) {
    @content;
  }
}

.sidebar {
  width: 300px;
  @include mobile {
    width: 100%; // 이 부분이 @content 위치에 들어감
  }
}
```

---

## 2. 함수 (Function)

스타일 코드를 반환하는 Mixin과 달리, 연산된 **값(Value)**을 반환합니다.

```scss
@function ratio($size, $ratio) {
  @return $size * $ratio;
}

.box {
  width: 100px;
  height: ratio(100px, 0.5); // 50px
}
```

---

## 3. 내장 색상 함수

SCSS는 강력한 색상 조작 함수를 내장하고 있습니다.

- `darken($color, 10%)`: 10% 어둡게
- `lighten($color, 10%)`: 10% 밝게
- `saturate($color, 10%)`: 채도 증가
- `desaturate($color, 10%)`: 채도 감소
- `rgba($color, 0.5)`: 투명도 조절
- `mix($color1, $color2)`: 색상 혼합

```scss
$base: royalblue;

.button {
  background: $base;
  &:hover {
    background: darken($base, 10%);
  }
}
```
