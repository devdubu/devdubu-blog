---
slug: "2-SSG-and-Routing"
title: "2. 정적 생성과 라우팅 (SSG & Routing)"
---

# 정적 생성과 라우팅

:::info 개요
Next.js의 강력한 기능인 **SSG(Static Site Generation)**의 작동 원리와 **동적 라우팅(Dynamic Routing)** 구현 시 발생하는 `getStaticPaths` 에러 해결법을 다룹니다.
:::

## 1. SSG 심화 (Static Site Generation)

### 1.1 `getStaticProps`
빌드 시점에 실행되어 페이지에 필요한 데이터를 미리 가져옵니다.

```jsx
export async function getStaticProps() {
  const res = await fetch('https://api.example.com/posts');
  const posts = await res.json();

  return {
    props: { posts }, // 컴포넌트의 props로 전달됨
  };
}
```

### 1.2 `getStaticPaths` (동적 라우팅용)
`/posts/[id]`와 같은 동적 페이지를 SSG로 만들 때, **어떤 id 값들을 미리 빌드할지** 지정해야 합니다.

:::warning 에러 해결
`getStaticPaths is required for dynamic SSG pages` 에러는 동적 페이지에서 `getStaticProps`만 쓰고 `getStaticPaths`를 누락했을 때 발생합니다.
:::

```jsx
export async function getStaticPaths() {
  return {
    paths: [
      { params: { id: '1' } },
      { params: { id: '2' } }
    ],
    // false: 정의되지 않은 경로는 404
    // true/'blocking': 정의되지 않은 경로는 요청 시 서버에서 생성
    fallback: false 
  };
}
```

---

## 2. 렌더링 전략 선택 가이드

### 2.1 Fallback 옵션 활용
포스트가 수천 개라면 모든 페이지를 빌드 타임에 생성하기 어렵습니다. 이때 `fallback` 옵션을 사용합니다.

- **fallback: false**: 빌드된 페이지 외에는 404 에러. (소규모 사이트)
- **fallback: true**: 빈 화면을 먼저 보여주고(Skeleton), 클라이언트에서 데이터를 채움.
- **fallback: 'blocking'**: 서버에서 HTML을 생성할 때까지 기다렸다가 응답 (SSR처럼 동작 후 캐싱).

### 2.2 ISR (Incremental Static Regeneration)
SSG의 단점(실시간성 부족)을 보완하기 위해, 일정 주기마다 백그라운드에서 페이지를 **재빌드**합니다.

```jsx
export async function getStaticProps() {
  return {
    props: { ... },
    revalidate: 60, // 60초마다 페이지 갱신 시도
  };
}
```
