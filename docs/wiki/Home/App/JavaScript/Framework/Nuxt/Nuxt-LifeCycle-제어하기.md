---
시작 날짜: 2025-05-15
종료 날짜: 2025-05-15
분류: TroubleShooting
카테고리: 프론트
세부 카테고리:
  - Nuxt3
sticker: vault//이미지/개발 로고/TechIconSVG/Nuxt-JS.svg

slug: "Nuxt-LifeCycle-제어하기"
---
# Client Plugin 과 Server Plugin 구분법

nuxt는 plugin을 로딩하는데 두가지 방식으로 로딩하게 된다.
Server plugin과 client plugin 을 고려하고, `filename.ts` 를 선언하면,client, server모두 렌더링
`filename.client.ts`를 선언하면, client 렌더링을 진행하고
`filename.server.ts`를 선언하면, server 렌더링을 진행한다. 이 점은 참고하면 된다.


# `useNuxtApp()` 호출 문제

우선 `useNuxtApp()` 이라는 객체를 먼저 확인할 필요가 있어 보인다.

우리가 흔히 `$fetch` 를 사용할 때, `$` 라고 하는 수식을 사용하는건 거의 주로 전역 변수에서 많이들 사용 한다.

문제점은 아래의 상황에서 나왔다.
대신 이 문제는 꾸준히 제기 될 수 있다보니 기록용으로 남겨야 할 것 같다.

## 순수 JS 라이브러리 등록
nuxt에서는 자체 LifeCycle이 있기 때문에, 아무리 순수 JS로 이루어진 라이브러리라고 해도, 이는 독단적으로 사용이 불가 하다.

Nuxt 가 정해놓은 흐름 대로 사용해야하는 규칙이 있다. ~~개 귀찮다~~

그렇기에 순수 JS로 구성된, Notyf 같은 라이브러리 조차도 Plugin에 등록해서 사용을 해야한다.

해당 등록은 아래의 프로세스를 따르면 된다

```js
import { Notyf } from 'notyf'

import 'notyf/notyf.min.css' // Notyf 스타일시트 임포트

export default defineNuxtPlugin((nuxtApp) => {
	const notyf = new Notyf({
		types: [
			{
				type: 'info',
				background: 'blue',
				icon: false,
			},
			{
				type: 'warn',
				background: 'orange',
				icon: false,
			},
		],
		duration: 3000, // 기본 표시 시간
		position: {
			x: 'right',
			y: 'top',
		},
		dismissible: true, // 사용자가 닫을 수 있도록 설정
		// 추가적인 Notyf 옵션들을 여기에 설정할 수 있습니다.
	})
	
	// Vue 애플리케이션에 $notyf로 주입하여 어디서든 접근 가능하게 합니다.
	nuxtApp.provide('notyf', notyf)
})
```
`notyf.client.js`

만약 객체를 생성 하여 해당 컴포넌트를 띄우는 프로그램은 위 처럼 등록을 시키면 된다.
결국은 전역으로 nuxt에 lifecycle 흐름에 등록하기 위해서는 먼저 객체를 셋팅하고 해당 셋팅한 객체를 
`nuxtApp.provide()`라는 형식으로 등록하게 된다.

그리고 이 파일 자체를 `nuxt.config.ts`  에 등록하면 된다.

:::note `js` 파일로 생성한 이유?
- Type에 대한 에러를 피하기 위해서 JS 파일로 생성한 경우도 많다.
- 이때는 Type을 지정해주면 되지만, 귀찮아서 안할경우는 이렇게 JS 파일로 하던지 혹은 아래 방식처럼 `as any` 라고 하던지 둘중 하나다

:::

아래와 같이 설정하면 된다
```ts

export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },
	modules: ['@nuxt/eslint'],
	components: {
		dirs: [{ path: './components', pathPrefix: false, extensions: ['vue'] }],
	},
	plugins: [{ src: '~/plugins/notyf.client.js' }], // 위 처럼 등록하면 된다.
	app: {
		rootAttrs: {
			id: 'nutUiRoot',
		},
	},
	typescript: {
		typeCheck: true,
		shim: false,
	},
})
```

그리고 중요한 부분은 어떻게 사용하는가 이다.

### 사용법
```vue
<template>
	...
</template>
<script>
import { $notyf } from useNuxtApp()


$notyf.error('message')
</script>
```

위 처럼 사용 해야 합니다.

기본적으로 우리가 plugin 으로 등록한 라이브러리 자체는 해당 방식으로 사용 하는 것이 <mark>기본</mark>입니다.

하지만, 우선 전 맘에 안듭니다 헤헷

일단 매번 `import { $notyf } from useNuxtApp()` 해당 문장을 갈겨야하는 것과 그리고 `useNuxtApp()` 이라는 존재 자체를 모르는 사람들에게는 왜 이걸 써서 사용해야하는지 매일 같이 설명해야하는 함정에 빠지기 때문입니다.

우선 그래서 차선책을 찾다 보니 아래와 같이 단순하게 구현했습니다.

`utils/notyf.ts`
```ts
import { $notyf } from useNuxtApp()

const notify = $notyf

export default notify
```

:::bug 어림도 없지
- 당연하게도 버그 입니다.
- 우선 nuxt 자체에서 사용 방식도 어겼을 뿐만 아니라, Nuxt 자체적으로 해당 hook 을 잡지 못한다는 에러 메시지를 띄웁니다.

:::

2차 대안을 찾은 건 Composable 입니다.

:::success 결론적으로는 성공입니다.
- 아래와 같이 작성하게 된다면 정상적으로 사용 가능합니다.

:::

`composables/useNotyf.ts`
```ts
// composables/useNotyf.ts

import type { Notyf } from 'notyf' // 타입을 명시적으로 가져오면 좋습니다.

export const useNotyf = () => {
	// useNuxtApp()는 컴포저블 내부에서 호출될 때 안전합니다.
	// 여기에서도 as any를 사용하거나, 타입 선언 파일을 만드세요.
	const { $notyf } = useNuxtApp() as unknown as { $notyf: Notyf }
	
	// $notyf 인스턴스를 직접 반환하거나, 이를 활용하는 함수들을 반환할 수 있습니다.
	return $notyf
	// 또는 Notyf 메소드를 직접 반환하여 더 편리하게 사용할 수 있습니다.
	// return {
	// success: (message: string) => $notyf?.success(message),
	// error: (message: string) => $notyf?.error(message),
	// // 다른 메소드들도 필요하다면 추가
	// };
}
```

우리가 봐야하는건 왜 되는거지..? 입니다.
왜 다른 건 안되는데 composable 구조는 되는거지를 확인해보겠습니다.

우선 Gemini의 답변은 아래와 같다.

- **Nuxt 컴포저블의 호출 시점 제한:** `useNuxtApp()`와 같은 Nuxt 컴포저블은 Vue 컴포넌트의 `setup()` 함수 (또는 `<script setup>`) 내부나 다른 Nuxt 컴포저블 내부에서만 호출될 수 있습니다. `const { $notyf } = useNuxtApp()` 코드는 컴포넌트의 최상위 스크립트 레벨에서 바로 실행되는데, 이때 Nuxt 앱 컨텍스트가 아직 완전히 초기화되지 않았거나 사용할 수 없는 경우가 있습니다.
    
    컴포넌트의 `setup()` 훅이나 `onMounted`, `onBeforeMount` 등의 라이프사이클 훅 내에서 호출되어야 합니다.
    
- **Vue의 반응형 시스템과 `export default`의 오용:** `export default notify`는 JavaScript 모듈의 기본 내보내기 문법입니다. `notify`는 `ref($notyf)`로 반응형으로 선언되었지만, 이렇게 모듈 레벨에서 내보내면 다른 컴포넌트에서 `import notify from '...'` 형태로 가져갈 때, `notify`는 더 이상 반응형 `ref` 객체가 아니라 `ref` 객체의 **값**으로 취급되거나, 또는 모듈이 한 번 로드될 때의 초기 상태로 고정될 수 있습니다. 또한, 모듈 레벨에서 컴포저블을 호출하는 것은 위 1번 이유와 겹쳐서 작동하지 않습니다.



# LifeCycle 파악 결과

기본적으로 Nuxt에서 LifeCycle을 통제하는 방식은 정해져있다.
강이 흘러가듯, 기본적으로 흘러가는 Nuxt의 흐름을 방해하지 않는 선에서 중간에 끼어들기를 해야한다.
즉, Nuxt가 흘러가는 방향을 가로막거나, 방해하면 안된다.

LifeCycle을 제어하는 방법은 여러가지가 있는데, 흔히 이런 문제가 생기는 결정적인 문제들은 대부분 전역으로 사용하고 싶은 객체들이 문제가 생긴다.

전역은 결국은  Nuxt에서는 흐름을 가로막는 방해꾼이 될 가능성이 잇다.
즉, 이유인 즉슨 Nuxt 자체적으로 Auto Import 때문에 Hook을 특정할 수 없는 존재들은 본인들도 가져올 수가 없는 것이다.

현재 그에 대한 예시로 볼만한건 당연하게도 Toast이다. 아래의 코드로 해당 문제를 해결했다.

```ts
// composables/useNotyf.ts

import { Notyf } from 'notyf' // 타입을 명시적으로 가져오면 좋습니다.
import 'notyf/notyf.min.css' // Notyf 스타일시트 임포트

export const useNotify = () => {
	// const { $notyf } = useNuxtApp() as unknown as { $notyf: Notyf }
	let rtnNotify = {
		success: (message: string) => {},
		error: (message: string) => {},
		info: (message: string) => {},
		warn: (message: string) => {},
	}
	
	if (import.meta.client) {
		const notyf = new Notyf({
	types: [
		{
			type: 'success',
			background: '#00bda7',
			icon: false,
		},
		{
			type: 'error',
			background: '#ff1b1b',
			icon: false,
		},
		{
			type: 'info',
			background: '#00ace9',
			icon: false,
		},
			{
			type: 'warn',
			background: '#ff9100',
			icon: false,
		},
		],
		duration: 2000, // 기본 표시 시간
		position: {
			x: 'center',
			y: 'top',
		},
			dismissible: false, // 사용자가 닫을 수 있도록 설정
		})
		
		rtnNotify = {
			success: (message: string) =>
				notyf?.open({
				type: 'success',
				message,
			}),
			error: (message: string) =>
				notyf?.open({
				type: 'error',
				message,
			}),
			info: (message: string) =>
				notyf?.open({
				type: 'info',
				message,
			}),
			warn: (message: string) =>
				notyf?.open({
				type: 'warn',
				message,
			}),
		}
	}
	return rtnNotify
	// $notyf 인스턴스를 직접 반환하거나, 이를 활용하는 함수들을 반환할 수 있습니다.
}
```

사실 왠만하면, composable(함수 호출)이라는 형식으로 해당 부분이 보완이 되지만, 문제는 SSR 특성이라는 것이다.
결국은 Toast의 특징이기도 하지만, 대부분 SSR을 도입하면 문제가 되는 부분이 CSR처럼 초반 렌더에 DOM을 띄우냐 아니냐 에 따라 굉장히 많이 갈린다는 것이다.

이 부분에서는 `import.meta.client` 으로 해결하면 된다.

물론 ts를 사용하니 리턴 값도 신경을 써야한다.