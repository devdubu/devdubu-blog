---
slug: "1-Intro-and-Setup"
title: "시작하기 및 설정 (Intro & Setup)"
---

# 시작하기 및 설정

:::info 개요
**TypeScript**는 JavaScript에 정적 타입을 추가한 상위 집합(Superset) 언어입니다.
:::

## 1. 설치 및 컴파일

브라우저는 TypeScript를 직접 실행할 수 없으므로, 자바스크립트로 변환하는 컴파일 과정이 필요합니다.

### 1.1 설치
```bash
# 전역 설치
npm install -g typescript

# 프로젝트 내 설치 (권장)
npm install --save-dev typescript
```

### 1.2 컴파일
`tsc` 명령어를 사용하여 `.ts` 파일을 `.js` 파일로 변환합니다.

```bash
tsc index.ts
```

## 2. 프로젝트 설정 (tsconfig.json)

`tsc --init` 명령어로 `tsconfig.json` 파일을 생성할 수 있습니다.

### 2.1 주요 옵션

#### Strict 모드
엄격한 타입 검사를 위해 `strict: true` 사용을 권장합니다. 이는 아래 옵션들을 모두 포함합니다.

*   **noImplicitAny**: 타입을 지정하지 않아 암시적으로 `any`로 추론되는 경우 에러를 발생시킵니다.
*   **strictNullChecks**: `null`과 `undefined`를 별도의 타입으로 취급하여, 의도치 않은 null 참조를 방지합니다.
*   **strictFunctionTypes**: 함수의 매개변수 타입을 더 엄격하게 검사합니다.

#### 기타
*   **target**: 컴파일될 JS 버전 (예: `ES6`, `ES2020`).
*   **module**: 모듈 시스템 (예: `CommonJS`, `ESNext`).
*   **outDir**: 컴파일된 파일이 저장될 경로.

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "strict": true,
    "outDir": "./dist"
  }
}
```
