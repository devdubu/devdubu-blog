---
sticker: vault//이미지/개발 로고/TechIconSVG/Tailwind-CSS.svg

slug: "Tailwind-모듈화-방안"
---
# `@apply` 지시어 활용

Tailwind CSS의 가장 강력한 기능 중 하나인 **`@apply`** 지시어는 중복되는 유틸리티 클래스들을 묶어서 재사용 가능한 커스텀 CSS 클래스를 만들 수 있게 해줍니다. 
이는 CSS 파일 안에 유틸리티 클래스를 추상화하는 방식입니다.

아래의 예시를 들면
```html
<button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
  기본 버튼
</button>
```

위 코드를 아래 처럼 우선 css 파일에 작성합니다.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50;
  }

  .btn-secondary {
    @apply px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50;
  }
}
```

위 처럼 css에서 `@apply`를 작성한 후에 아래 html 에 작성하면 된다.

```html
<button class="btn-primary">
  기본 버튼
</button>
<button class="btn-secondary">
  보조 버튼
</button>
```

## 해당 방식으로 Mobile 반응형 대응 예시

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .responsive-content-container {
    /* 기본(모바일 우선) 스타일 */
    @apply text-center p-4; 
    
    /* md 이상 화면에서 적용될 스타일 */
    @apply md:text-left md:p-8; 
    
    /* lg 이상 화면에서 적용될 스타일 (선택 사항) */
    @apply lg:p-12; 
  }
}
```

```html
<div class="responsive-content-container">
  반응형 텍스트 내용
</div>
```


[공식문서에서 해당 Tailwind를 찐으로 사용하는 방법](https://tailwindcss.com/docs/adding-custom-styles)