---
sticker: vault//이미지/개발 로고/TechIconSVG/Next.js.svg

slug: "NextJS-SSG"
---
### 1. **SSG(Static Site Generation)란?**
Next.js의 **SSG(Static Site Generation)**는 빌드 시점(`npm run build`)에 HTML 페이지를 미리 생성하여 서버에 저장하고, 클라이언트 요청 시 빠르게 제공하는 렌더링 방식입니다. 이는 페이지 콘텐츠가 자주 변경되지 않는 경우에 적합하며, 빠른 로딩 속도와 CDN 캐싱 이점을 제공합니다.

#### SSG의 주요 특징
- **빌드 시 HTML 생성**: `npm run build` 실행 시 모든 페이지의 HTML이 생성됨.
- **데이터 가져오기**: `getStaticProps` 함수로 빌드 시 데이터를 가져와 페이지에 주입.
- **동적 라우팅**: 동적 경로(예: `/posts/[id]`)를 사용하는 경우, `getStaticPaths`로 생성할 경로를 지정.
- **성능**: 사전 생성된 HTML로 초기 로드 속도가 빠르고, 서버 부하 감소.
- **사용 사례**: 블로그, 제품 상세 페이지, 문서 사이트 등 정적 콘텐츠 중심 페이지.

#### SSG와 다른 렌더링 방식 비교
- **SSR(Server-Side Rendering)**: 요청 시 서버에서 HTML 생성(`getServerSideProps`).
- **CSR(Client-Side Rendering)**: 클라이언트에서 JavaScript로 데이터 로드(React `useEffect` 등).
- **ISR(Incremental Static Regeneration)**: SSG에 주기적 갱신(`revalidate`) 추가.

---

### 2. **에러: `getStaticPaths is required for dynamic SSG pages`**
이 에러는 **동적 라우팅** 페이지(예: `pages/posts/[id].js`)에서 SSG를 사용하려고 하지만, `getStaticPaths` 함수가 정의되지 않아 발생합니다. Next.js는 동적 경로의 경우 어떤 경로를 빌드 시 생성해야 하는지 알아야 하며, 이를 `getStaticPaths`로 지정합니다.

#### 에러 발생 상황
- **동적 라우팅**: 파일 이름에 대괄호 사용(예: `pages/[id].js`, `pages/posts/[...slug].js`).
- **SSG 사용**: 페이지에 `getStaticProps` 정의.
- **누락된 `getStaticPaths`**: 동적 경로의 가능한 값을 지정하지 않음.

예시 (에러 발생 코드):
```javascript
// pages/posts/[id].js
export async function getStaticProps({ params }) {
  const post = await fetchPost(params.id); // 예: API 호출
  return {
    props: {
      post,
    },
  };
}

export default function Post({ post }) {
  return <div>{post.title}</div>;
}
```

- **문제**: `/posts/[id]`에 대해 어떤 `id` 값을 생성해야 하는지 Next.js가 알 수 없음.
- **에러**: `getStaticPaths is required for dynamic SSG pages`.

---

### 3. **해결 방법: `getStaticPaths` 구현**
`getStaticPaths`는 동적 라우팅 페이지에서 SSG를 위해 생성할 경로 목록을 정의합니다. 빌드 시 호출되어 어떤 동적 경로(예: `/posts/1`, `/posts/2`)를 생성할지 결정합니다.

#### `getStaticPaths` 구조
```javascript
export async function getStaticPaths() {
  return {
    paths: [
      { params: { id: '1' } }, // 생성할 경로
      { params: { id: '2' } },
    ],
    fallback: false, // 또는 true, 'blocking'
  };
}
```

- **paths**: 빌드 시 생성할 경로 목록. 각 경로는 `params` 객체로 동적 매개변수(예: `id`, `slug`) 지정.
- **fallback**:
  - `false`: `paths`에 없는 경로는 404 반환.
  - `true`: `paths`에 없는 경로에 대해 클라이언트 측에서 동적 렌더링 시도.
  - `'blocking'`: `paths`에 없는 경로에 대해 서버에서 렌더링 후 제공.

#### 수정된 예시
```javascript
// pages/posts/[id].js
async function fetchPosts() {
  // 예: API 호출 또는 데이터베이스 쿼리
  return [{ id: '1', title: 'Post 1' }, { id: '2', title: 'Post 2' }];
}

async function fetchPost(id) {
  // 예: API 호출
  return { id, title: `Post ${id}`, content: `Content for post ${id}` };
}

export async function getStaticPaths() {
  const posts = await fetchPosts();
  const paths = posts.map(post => ({
    params: { id: post.id },
  }));

  return {
    paths,
    fallback: false, // 404 for undefined paths
  };
}

export async function getStaticProps({ params }) {
  const post = await fetchPost(params.id);
  return {
    props: { post },
  };
}

export default function Post({ post }) {
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}
```

- **설명**:
  - `getStaticPaths`: `/posts/1`, `/posts/2`를 빌드 시 생성.
  - `getStaticProps`: 각 경로에 대해 `post` 데이터 가져옴.
  - `fallback: false`: `/posts/3`과 같은 정의되지 않은 경로는 404 반환.

#### 동적 경로가 많은 경우
포스트가 수백 개라면 `paths`를 모두 생성하는 대신 `fallback: 'blocking'`을 사용:
```javascript
export async function getStaticPaths() {
  return {
    paths: [], // 일부 경로만 사전 생성 가능
    fallback: 'blocking', // 나머지 경로는 요청 시 생성
  };
}
```

- **ISR 추가**:
  ```javascript
  export async function getStaticProps({ params }) {
    const post = await fetchPost(params.id);
    return {
      props: { post },
      revalidate: 60, // 60초마다 갱신
    };
  }
  ```

---

### 4. **SSG 동작 확인**
1. **빌드 실행**:
   ```bash
   npm run build
   ```
   - `.next/static` 디렉토리에 `/posts/1`, `/posts/2` 등의 HTML 생성 확인.
2. **로컬 테스트**:
   ```bash
   npm run start
   ```
   - `http://localhost:3000/posts/1` 접속하여 정적 페이지 확인.
3. **배포**:
   - Vercel, Netlify 등으로 배포 시 CDN 캐싱 확인.

---

### 5. **디버깅 가이드**
에러가 지속되거나 문제가 발생할 경우:
1. **파일 이름 확인**:
   - 동적 라우팅 파일인지 확인: `pages/posts/[id].js`, `pages/[...slug].js`.
2. **getStaticPaths 점검**:
   - `paths` 배열이 비어 있지 않은지 확인.
   - `params` 객체가 파일 이름의 동적 매개변수와 일치하는지 확인(예: `[id]` → `{ id: '1' }`).
3. **데이터 소스 확인**:
   - `fetchPosts` 함수가 올바른 데이터를 반환하는지 `console.log(posts)`로 확인.
4. **Fallback 설정**:
   - `fallback: false`로 시작, 필요 시 `true` 또는 `'blocking'`으로 테스트.
5. **빌드 캐시**:
   - `.next` 디렉토리 삭제:
     ```bash
     rm -rf .next && npm run build
     ```
   - 브라우저 캐시 지우기: `Ctrl + Shift + R`.

---

### 6. **추가 팁**
- **동적 라우팅 패턴**:
  - 단일 매개변수: `[id].js` → `/posts/1`.
  - 캐치올 라우팅: `[...slug].js` → `/posts/a/b/c`.
    ```javascript
    // pages/posts/[...slug].js
    export async function getStaticPaths() {
      return {
        paths: [{ params: { slug: ['category', '1'] } }],
        fallback: false,
      };
    }
    ```
- **ISR 활용**:
  - 데이터가 자주 변경되면 `revalidate`로 주기적 갱신:
    ```javascript
    export async function getStaticProps({ params }) {
      return {
        props: { post: await fetchPost(params.id) },
        revalidate: 3600, // 1시간
      };
    }
    ```
- **Next.js 문서 참고**:
  - [Dynamic Routes](https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes)
  - [getStaticPaths](https://nextjs.org/docs/pages/api-reference/functions/get-static-paths)

---

### 7. **요약**
- **SSG**: 빌드 시 HTML을 생성하여 빠르게 제공하는 Next.js 렌더링 방식.
- **에러 원인**: 동적 라우팅 페이지(`/posts/[id]`)에서 `getStaticPaths` 누락.
- **해결 방법**:
  - `getStaticPaths`로 경로 목록(`paths`)과 `fallback` 설정.
  - `getStaticProps`로 각 경로의 데이터 제공.
- **디버깅**:
  - `paths`와 `params` 확인.
  - `.next` 캐시 삭제 및 빌드 재실행.

구체적인 페이지 코드(예: `pages/posts/[id].js`)나 데이터 소스(예: API 엔드포인트), 에러 로그를 공유해 주시면 더 정확한 코드와 디버깅 방법을 제공하겠습니다!