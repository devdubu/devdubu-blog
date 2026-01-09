---
slug: "2-Project-Setup-and-Styling"
title: "2. 프로젝트 설정 및 스타일링"
---

# 프로젝트 설정

:::info 개요
**CRA(Create React App)**와 최신 빌드 도구인 **Vite**를 사용한 프로젝트 생성 방법, 그리고 **TypeScript** 설정 및 다양한 **스타일링** 전략을 다룹니다.
:::

## 1. 프로젝트 생성

### 1.1 Vite (권장)
빠르고 가벼운 최신 빌드 도구입니다.

```bash
npm init vite@latest my-app -- --template react-ts # TypeScript
# 또는
npm init vite@latest my-app -- --template react
```

### 1.2 Create React App (CRA)
전통적인 방식이지만 설정이 숨겨져 있어 커스텀이 어렵고 속도가 느릴 수 있습니다.

```bash
npx create-react-app my-app --template typescript
```

---

## 2. 스타일링 전략

### 2.1 CSS Modules
클래스 이름 충돌을 방지하기 위해 파일별로 고유한 이름을 생성합니다. 파일명을 `*.module.css`로 저장합니다.

```jsx
import styles from './Button.module.css';
<button className={styles.error}>Error</button>
```

### 2.2 CSS-in-JS (Styled Components)
JS 파일 내부에 스타일을 정의합니다. Props에 따른 동적 스타일링에 강력합니다.

```bash
npm install styled-components
```

```jsx
const Button = styled.button`
  background: ${props => props.primary ? "blue" : "white"};
`;
```

### 2.3 SASS / SCSS
CSS 전처리기로 변수, 중첩, 믹스인 등을 사용할 수 있습니다.

```bash
npm install sass
```

---

## 3. TypeScript 설정

`tsconfig.json`을 통해 컴파일 옵션을 설정합니다.

### 주요 옵션
- **target**: 컴파일된 JS의 버전 (예: `es5`, `es6`).
- **lib**: 컴파일에 포함할 라이브러리 (예: `dom`, `es2015`).
- **strict**: 엄격한 타입 검사 활성화.
- **jsx**: JSX 코드 처리 방식 (`react-jsx` 등).

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  }
}
```
