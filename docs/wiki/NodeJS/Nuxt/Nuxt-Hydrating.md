---
slug: "Nuxt-Hydrating"
---
- [Nuxt Hydrating](https://nuxt.com/docs/api/composables/use-nuxt-app#ishydrating)

Hydrating이라는 뜻은, 수화라는 뜻이다.
보통은 화장품에서 사용하는 단어인디,,이게 왜 Nuxt에서 사용되었는가에 대한 물음이다.

사실 Nuxt에서 뜻을 찾기 보단 React 관련해서 포스팅 하신 분이 있길래 이 부분을 조금 참조 해서 이해해보려고 노력하려고 한다.
[출처](https://simsimjae.tistory.com/389) 

```ts
ReactDOM.render(element, container[, callback])
```

컨테이너 DOM에 리액트 엘리멘트를 렌더링 하는 함수이다.
이 render 함수는 컨테이너의 자식으로 리액트 컴포넌트를 넣어주는데, 
기존에 이미 렌더링 된 리액트 컴포넌트가 있다면, 새로 렌더링 하는게 아니라 업데이트만 해준다.

즉 ReactDOM의 render메소드는 컴포넌트를 렌더링 한 후에 콜백을 실행한다.

반면에 ReactDOM에는 hydrate라는 메소드도 존재합니다.
```ts
ReactDOM.hydrate(element, container[, callback])
```
보면 메소드 모양이 render와 똑같다.
hydrate는 렌더링 하지 않고 이벤트 핸들러만 붙여준다.

SSR을 해서 이미 마크 업이 채워져 있는 경우 굳이 render 메소드를 사용할 필요가 없다.
SSR을 하는 경우 hydrate로 콜백을 붙여야 한다.

CSR을 하는 경우에는 타겟 컨테이너에 리액트 컴포넌트가 렌더링 된 적이 없을 것이기 때문에 reder 메소드를 사용해야 한다.
하지만 SSR 프레임워크와 함께 React를 사용할 경우 hydrate 사용을 고려해야 한다.

![Pasted-image-20240829091900.png](/img/이미지 창고/Pasted-image-20240829091900.png)
서버가 완성된 HTML을 내려준다.
이때 Dehydrate는 수분을 없앤다는 뜻이다.
다시 말해서 동적인 것을 정적으로 만드는 행위를 Dehydrate라고 표현했습니다.

그리고 나서 JS가 실행되면서 리액트가 정적인 HTML과 store를 동적으로 리액트 컴포넌트 트리와 store로 변환하는 과정이 일어나는데, 이걸 (Re)hydrate라고 한다.

마치 수분기가 없는 정적인 상태에서 수분 넘치는 동적인 상태로 변화한 것이다.
문제는 이렇게 rehydrate가 일어나면서 쓸데 없이 화면이 한번 더 그려지는 현상이 발생한다 것이다.

왜냐면 리액트는 서버에서 완성된 HTML이 내려와서 이미 화면에 제대로 렌더링이 됐는지 안됐는지 모르고 자신이 할 일을 그냥 했을 뿐이다.

# SSR의 핵심
## CSR(클라이언트 사이드 렌더링 ) vs SSR(서버 사이드 렌더링)
CSR은 초기 렌더링 시 내용이 없는 HTML을 받고 그 이후에는 모든 JS로 웹 페이지를 모두 작동 시킵니다.
흔히 React, Vue로 만드는 SPA(Single Page Application)이 이렇게 동작합니다.

SSR은 초기 렌더링시에 내용이 존재하는, 미리 서버에서 랜더링 된 HTML을 받습니다.
그 다음 JS로 웹 페이지를 완전하게 작동 시킵ㄴ다.

SSR이 필요한 가장 큰 이유는 검색 엔진 최적화 입니다.
검색 엔진들의 크롤링 봇들은 HTML 내용 자체를 긁어오기 때문에 처음에 내용이 빈 HTML을 받는 CSR 앱들은 검색 엔진 노출에 불리 합니다.

## PreRendering / hydration

### PreRendering
:::note PreRendering?
- React나 Vue로 만든 기존 SPA위에서 서버에서 브라우저로 전송할 수 있도록 어느 정도 완성된 HTML 파일을 만드는 동작을 의미합니다.

:::

원래 SPA는 라우팅 역시 JS로만 이루어집니다.
SSR 라이브러리를 사용한 앱은 JS로만 라우팅하지 않고, 
빌드 결과물에 작은 서버를 달아서 브라우저의 주소 창으로 들어온 요청에 맞는 페이지 컴포넌트를 PreRendering 해 브라우저에 제공하는 방식으로 라우팅 합니다.

:::note Hydration?
- PreRendering 과정을 마치고 브라우저로 전달된 HTML 파일 위에 JS 코드들을 실행하는 동작이다.
- Hydration 으로 인해 SSR 앱은 기존의 SPA와 동일한 동작과 반응성을 보장 할 수 있게 됩니다.
- 용어 그대로 **불완전한 HTML 파일**이라는 **마른 땅**에 **JS**라는 **물**을 뿌리는 일이라고 비유 합니다. 

:::

이 두 개념은 단언코 SSR의 핵심입니다.
요약하면 PreRendering은 페이지에 내용을 채워 크롤링 봇이 읽을 수 있게 해주고, hydration은 그 이후에 앱이 SPA 와 똑같이 동작할 수 있도록 합니다.

여기서 SSR 앱이 서버를 끼고 빌드 된다는 개념은 SSR앱과 SPA의 배포 방식의 차이를 야기 합니다.
SPA의 빌드 결과물은 HTML 하나랑 JS 파일의 뭉치들입니다.

AWS S3 같은 스토리지에 빌드 결과물을 저장하고, 도메인을 연결 시키면 브라우저가 알아서 HTML과 JS 파일들을 실행합니다.
하지만, SSR앱은 서버를 끼고 있으니, 스토리지에 올려놓는다고 해서 브라우저가 접근해서 실행시킬 수 잇는 자원이 아닙니다.
백엔드 처럼 서버를 계속 해서 구동할 수 잇는 컴퓨팅이 필요합니다.

### Nuxt로 살펴보는 SSR
`nuxt.config.js` build 옵션, 혹은 `package.json` 에 정의된 npm 명령어를 통해 빌드 방식을 달리 할 수 있습니다.
```ts
// nuxt.config.ts

export default({
	build:{
		ssr: true // false
	}
})
```
- `SSR : true` : SSR 앱을 빌드 합니다.
-  `SSR : false` : SPA처럼 빌드 합니다.
- `yarn generate` : 정적 사이트가 빌드를 실행하는 스크립트 명령어 입니다. `pages` 디렉토리의 페이지들의 그 경로 그대로 모든 html이 완성 되어어서 빌드 됩니다.
### `SSR:true` 로 빌드 했을 때 동작 방식
여기서 우리의 관심사는 SSR 방식의 빌드 입니다.

앞에서 언급했던 방식의 SSR을 구현하기 위해서 
SSR을 구현하기 위해서는 두 개의 자원이 필요합니다.

하나는 Vue 인스턴스 프리랜더링 HTML을 만들어 브라우저로 쏴주는 서버코드, 다른 하나는 클라이언트 사이드에서 기존 SPA처럼 동작할 수 있게 하는 JS 뭉치, 즉, 클라이언트 코드 입니다.

빌드 폴더 내부의 dist 폴더를 보시면 두 폴더로 나누어져 빌드 되고 있다는 것을 알 수 있습니다.


---

#NodeJS #Nuxt #JavaScript #Nuxt3 #FrontEnd 

---