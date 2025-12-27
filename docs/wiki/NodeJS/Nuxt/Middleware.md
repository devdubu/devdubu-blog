# middleware
Nuxt는 애플리케이션 전체에서 사용할 수 있는 사용 가능한 경로 미들웨어 프레임 워크를 제공합니다.
특정 경로로 이동하기 전에 실행하려는 코드를 추출하는데 이상적입니다.

이름이 지정된 경로 미들웨어로, `middleware/` 페이지에서 사용할 때 비동기 가져오기를 통해 자동으로 로드 되고 배치됩니다.
글로벌 경로 미들웨어는 접미사 `middleware/`와 함께 배치되며, `.global` 모든 경로 변경 시에 실행됩니다.

첫 번째 두 종류의 경로 미들웨어는 `definePageMeta`에서 정의 합니다.

## 사용
미들웨어 라우트는 현재의 라우트와 다음의 라우트의 탐색 역할을 합니다.
```ts
export default defineNuxtRouteMiddleware((to, from) => {
  if (to.params.id === '1') {
    return abortNavigation()
  }
  // In a real app you would probably not redirect every route to `/`
  // however it is important to check `to.path` before redirecting or you
  // might get an infinite redirect loop
  if (to.path !== '/') {
    return navigateTo('/')
  }
})
```
Nuxt는 제공한다 두개의 사용 가능한  미들웨어로 부터 직접적으로 리턴받을 수 있는 도움말을

1. `navigateTo` - 주어진 경로로 redirect 합니다.
2. `abortNavigation` -  선택적으로 오류 메시지를 표시하고 탐색을 중단합니다.

## Middleware Order
미들웨어는 아래의 명령을 따라서 실행됩니다.
1. `Global Middleware`
2. 페이지에서 정의된 명령 - 배열 구문으로 선언된 여러 개의 미들웨어가 있을 경우

```
middleware/
--| analytics.global.ts
--| setup.global.ts
--| auth.ts
```

```vue
<script setup lang="ts">
definePageMeta({
  middleware: [
    function (to, from) {
      // Custom inline middleware
    },
    'auth',
  ],
});
</script>
```
`pages/profile.vue`

- `vue-rotuer`의 탐색 가드와 달리 세 번째 `next()` 인수가 전달되지 않고, redirect 또는 경로 취소가 미들웨어에서 반환하고 대신 처리 합니다.
### 가능한 반환 값
- null
	- 탐색을 차단하지 않으며, 다음 미들웨어 기능으로 이동하거나, 경로 탐색을 완료합니다.
- `return navigateTo('/')`
	- 저장된 경로로 리디렉션 하고 리디렉션이 서버 측에서 발생하는 경우 리디렉션 코드를 `302 Found`로 설정합니다.
- `return navigateTo('.', { redirectCode: 301})`
	- 지정된 경로로 redirect하고 redirect 서버측에서 발생하는 경우 redirect 코드를 영구적으로 이동합니다.
- `return abortNavigation()`
	- 현재 탐색을 중지합니다.
- `return abortNavigation(error)`
	- 오류로 인해 현재 탐색을 거부합니다.

### Global Middleware Order
기본적으로 Global Middleware는 파일 이름을 기준으로 알파벳 순으로 실행됩니다.

그러나 특정 순서를 정의하고 싶을 때가 있습니다.
예를 들면, 마지막 시나리오에서 `setup.global.ts`는 `analytics.global.ts` 전에 실행해야 할 수 있습니다.
그런 경우, 글로벌 미들웨어에 '알파벳' 번호로 접두어를 붙이는 것이 좋습니다.

```
middleware/
--| 01.setup.global.ts
--| 02.analytics.global.ts
--| auth.ts
```

### middleware가 실행 되는 이유
사이트가 server 랜더링 또는 생성된 경우, 초기 페이지의 미들웨어는 페이지가 렌더링 될 때와 클라이언트에서 다시 실행됩니다.
미들웨어에 브라우저 환경이 필요한 경우
- 생성된 사이트가 있는 경우, 응답을 적극적으로 캐시하는 경우 또는 로컬 저장소에서 값을 읽고 싶은 경우
- 이것이 필요할 수도 있습니다.

```ts
export default defineNuxtRouteMiddleware(to => {
  
  if (import.meta.server) // 미들웨어의 server side hook
  
  if (import.meta.client) // 미들웨어 client side hook
  
  const nuxtApp = useNuxtApp()
  if (import.meta.client && nuxtApp.isHydrating && nuxtApp.payload.serverRendered) // 또는 미들웨어가 클라이언트가 초기 로드 될때 hook
})
```
`middleware/example.ts`

:::tip 오류 페이지는 렌더링 하는 것은 완전히 별도의 페이지 로드로, 등록된 모든 미들웨어가 다시 실행됩니다.
`useError` 미들웨어에서 오류가 처리되고 있는지 확인하는데 사용할 수 있습니다.

:::

## 동적으로 미들웨어 추가
플러그인 내에서 `addRouteMiddleware()`와 같이 도우미 함수를 사용하여 전역 또는 명명된 경로 미들웨어를 수동으로 추가할 수 있습니다.

```ts
export default defineNuxtPlugin(() => {
  addRouteMiddleware('global-test', () => {
    console.log('this global middleware was added in a plugin and will be run on every route change')
  }, { global: true })

  addRouteMiddleware('named-test', () => {
    console.log('this named middleware was added in a plugin and would override any existing middleware of the same name')
  })
})
```

### 예
```
-| middleware/
---| auth.ts
```

```vue
<script setup lang="ts">
definePageMeta({
  middleware: ["auth"]
  // or middleware: 'auth'
})
</script>
```

이제 해당 페이지로의 탐색이 완료되기 전에 `auth` 경로 미들웨어가 실행됩니다.

## 빌드 시간에 미들웨어
각 페이지에서 사용하는 대신 `definePageMeta`, hook `pages: extend` 내에 이름이 지정된 경로로 미들웨어를 추가 할 수 있습니다.

```ts
import type { NuxtPage } from 'nuxt/schema'

export default defineNuxtConfig({
  hooks: {
    'pages:extend' (pages) {
      function setMiddleware (pages: NuxtPage[]) {
        for (const page of pages) {
          if (/* some condition */ true) {
            page.meta ||= {}
            // Note that this will override any middleware set in `definePageMeta` in the page
            page.meta.middleware = ['named']
          }
          if (page.children) {
            setMiddleware(page.children)
          }
        }
      }
      setMiddleware(pages)
    }
  }
})
```


---

#NodeJS #Nuxt #JavaScript #Nuxt3 #FrontEnd 

---

