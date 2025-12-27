---
sticker: vault//이미지/개발 로고/TechIconSVG/Next.js.svg

slug: "NextJS-기초"
---
# 설치

```shell
npx create-next-app@latest

npx create next-app --typescript
```

![스크린샷-2025-07-18-오후-5.28.39.png](/img/이미지 창고/스크린샷-2025-07-18-오후-5.28.39.png)

## 폴더 구조

![스크린샷-2025-07-18-오후-5.29.38.png](/img/이미지 창고/스크린샷-2025-07-18-오후-5.29.38.png)

:::note 기본적으로 Nuxt와 개념은 비슷합니다.
- `_app.tsx` 는 공통 레이아웃을 작성하니다.
- `next.config.js`
- NextJS는 웹팩을 기본 번들러로 사용
- 웹팩에 관한 설정들을 해당 파일에서 설정 가능합니다.

:::

:::note Pre-Rendering
- NextJS 모든 페이지를 사전에 pre-rendering 합니다.
- 이 pre-renderer 한다는 의미는 모든 페이지를 위한 HTML 을 Client 사이드에서 JS 처리전, 사전에 생성한다는 뜻입니다.
- 이렇게 하기 때문에, SEO 검색엔진 최적화가 좋아집니다.

:::

## NextJS Data Fetch
:::tip NextJS 에서 데이터 가져오는 방법
- 보통 리엑트에서는 데이터를 가져올 때, `useEffect()` 안에서 가져옵니다.
- 하지만, `NextJS` 에서는 다른 방법을 사용해서 가져오는데 하나식 봐보겠습니다.

:::

### `getStaticProps`
- `Static Generation` 으로 빌드(Build)할 때 데이터를 불러옵니다.
- Application에서 build 할 때 데이터를 불러오는 함수이다.

```js
export async function getStaticProps(context){
	return {
		props: {}, // will be passed to the page component as props
	}
}
```
- `getStaticProps` 함수를 `async`로 `export` 하면, `getStaticProps`에서 리턴되는 `props`를 가지고 페이지를 `pre-render` 합니다.  `build time`에 페이지를 렌더링 합니다.   
- useEffect로 데이터를 가져왔을 때 보다 훨씬 빠르게 가져오게 됩니다.

![Pasted-image-20250721090915.png](/img/이미지 창고/Pasted-image-20250721090915.png)

:::note `getStaticProps`를 사용할 때
- 페이지를 렌더링하는 데 필요한 데이터를 사용자의 요청보다 먼저 build 시간에 가져올 수 있을 때 
-  데이터를 headless CMS에서 가져올 때   
- 모든 사용자에게 같은 데이터를 보여줄 때  
- 페이지는 미리 렌더링되어야 하고(SEO의 경우) 매우 빨라할 때.  
- (`getStaticProps`는 성능을 위해 CDN에서 캐시할 수 있는 HTML 및 JSON 파일을 생성합니다



:::

### `getStaticPaths`
- `Static Generation`으로 데이터에 기반하여 `pre-render` 시 특정한 동적 라우팅 구현(`pages/posts/[id.js]`)
- 동적 라우팅 구현시 필요한 함수

```js
export async function getStaticPaths(){
	return{
		paths:[
			{ params: { ... }}
		],
		fallback: true // false or 'blocking'
	}
}
```

- 동적 라우팅이 필요할 때 `getStaticPaths`로 경로 리스트를 정의하고, HTML에 build 시간에 렌더 됩니다. 
- Nextjs는 pre-render에서 정적으로 getStaticPaths 에서 호출하는 경로들을 가져옵니다.

### Paths
:::tip `paths`
- 어떠한 경로가 pre-render 될지를 결정합니다.   
- 만약 pages/posts/[id].js 이라는 이름의 동적 라우팅을 사용하는 페이지가 있다면 아래와 같이 됩니다.

:::

```js
return {
	paths:[
		{ params : { id: '1' }},
		{ params : { id: '2' }},
	],
	fallback : ...
}
```
1. 빌드하는 동안  `/posts/1`과  `/posts/2`를 생성하게 됩니다. 
2. 이렇게 경로가 생성되면 `getStaticProps`를 이용해서 해당 페이지들의 HTML을 생성하게 됩니다.
![Pasted-image-20250721091917.png](/img/이미지 창고/Pasted-image-20250721091917.png)
### Params
- 페이지 이름이 `pages/posts/[postId]/[commentId]` 라면 , `params`은 `postId`와 `commentId`입니다.
- 만약 페이지 이름이 `pages/[...slug]` 와 같이 모든 경로를 사용한다면, params는 slug가 담긴 배열이어야한다.  `['postId', 'commentId']`

![Pasted-image-20250721092346.png](/img/이미지 창고/Pasted-image-20250721092346.png)

### fallback
:::note 만약 들어간 페이지의 경로가 getStaticPaths에서 리턴하는 paths에 없을 때 어떻게 처리할 것인가...

:::

- `false` 라면 `getStaticPaths`로 리턴되지 않는 것은 모두 <mark>404 페이지</mark>가 뜹니다.
(빌드시점에 없는 페이지는 404 페이지로 넘어가게 됩니다.)  
- `true` 라면 `getStaticPaths`로 리턴되지 않는 것은 404로 뜨지 않고, fallback 페이지가 뜨게 됩니다. 
* 그래서 먼저 사용자에게 fallback 페이지를 보여줍니다.
* 그리고 서버에서 static 하게 페이지를 생성합니다.
* 그 후에 서버에서 생성한 해당 페이지를 사용자에게 보여줍니다.
* 그 다음부터는 해당 페이지로 접속하는 사용자에게는 static 한 페이지를 보여줍니다.

```jsx
import { useRouter } from 'nuxt/router';
const router = useRouter();

if(router.isFallback){
	return <div>Loading...<div>
}
```

![Pasted-image-20250721092736.png](/img/이미지 창고/Pasted-image-20250721092736.png)
### `getServerSideProps`
- `Server Side Rendering`으로 요청이 있을 때, 데이터를 불러옵니다.
- `getServerSideProps` 함수를 `async`로 `export` 하면, Next는 각 요청마다 리턴되는 데이터를 `getServerSideProps`로 `pre-render`합니다.
```js
function Page({ data }){
	// Render data...
}

// This gets called on every request
export async function getServerSideProps(){
	// Fetch data from external API
	const res = await fetch(`https://.../data`)
	const data = await res.json()

	// Pass data to the page via props
	return { props: { data } }
}

export default Page
```

![Pasted-image-20250721093154.png](/img/이미지 창고/Pasted-image-20250721093154.png)


:::tip `getServerSideProps`를 사용할 때
- 요청할 때 데이터를 가져와야하는 페이지를 미리 렌더해야 할 때 사용합니다.  
- 서버가 모든 요청에 대한 결과를 계산하고, 추가 구성없이 CDN에 의해 결과를 캐시할 수 없기 때문에 첫번째 바이트 까지의 시간은 `getStaticProps`보다 느립니다.   
- (TTFB-Time to first byte, HTTP요청 이후 처음 데이터가 도달하는 시간)

:::

:::question CSR은
- 사용자별 비공개 페이지처럼 SEO가 중요하지 않을 때!
- 처음 화면을 보여 줄 때의 로딩 시간 빼고는 사용 중 빠른 사용자경험 인터렉션이 더 중요할 때

:::

:::quote SSR은
- SEO가 중요할 때!
- 처음 화면을 빠르게 보여주는 것이 중요한 경우


:::
