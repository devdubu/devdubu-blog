---
slug: "4-Ecosystem-and-Practice"
title: "생태계와 실전 활용 (Ecosystem & Practice)"
---

# 생태계와 실전 활용

:::info 개요
React 애플리케이션 개발에 필수적인 **Router**와 실전에서 자주 쓰이는 **테이블 라이브러리** 및 **프로젝트 구조** 예시를 살펴봅니다.
:::

## 1. React Router (v5/v6)

SPA(Single Page Application)에서 클라이언트 사이드 라우팅을 담당합니다.

```jsx
import { BrowserRouter, Route, Switch } from 'react-router-dom';

<BrowserRouter>
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/about" component={About} />
  </Switch>
</BrowserRouter>
```

- **BrowserRouter**: HTML5 History API를 사용합니다.
- **Switch**: 경로가 일치하는 첫 번째 Route만 렌더링합니다.

---

## 2. 상태 관리 (State Management)

복잡한 애플리케이션에서는 전역 상태 관리가 필요합니다.

:::tip 상세 가이드
**Redux**에 대한 자세한 내용은 [5. 상태 관리 (Redux)](./5%20State%20Management%20Redux) 문서를 참고하세요.
:::

---

## 3. 유용한 라이브러리

### 3.1 React Table (@tanstack/react-table)
정렬, 필터링, 그룹화 등 복잡한 테이블 기능을 Headless(UI 없는) 방식으로 제공합니다.

### 3.2 스타일 및 유틸리티
- **Axios**: HTTP 클라이언트.
- **React Icons**: 아이콘 모음.

---

## 4. 실전 프로젝트 구조 (쇼핑몰 예시)

대규모 프로젝트에서는 유지보수를 위해 폴더 구조를 체계적으로 관리해야 합니다.

```
src/
  ├── components/   # 재사용 가능한 UI 컴포넌트
  ├── pages/        # 라우트 페이지 컴포넌트
  ├── store/        # Redux 슬라이스 및 스토어 설정
  ├── hooks/        # 커스텀 훅
  ├── utils/        # 유틸리티 함수
  └── assets/       # 이미지, 폰트 등 정적 파일
```
