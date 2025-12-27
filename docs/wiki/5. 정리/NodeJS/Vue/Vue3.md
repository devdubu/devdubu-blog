
:::info 기본적으로 NodeJs 설치와 JavaScript의 선수 지식이 있다는 가정 하에 진행하겠습니다.
- 만약 위 선수 지식이 필요하다면, 아래의 링크로 우선적으로 선수 지식을 익히고 봐주세요
:::

# 설치 방법

기본적으로 JavaScript는 Script언어이기에, Shell 로 쉽게 프로젝트를 생성할 수 있습니다.
```shell
yarn global add @vue/cli
# 또는 
npm install -g @vue/cli

# Vue3 기반 설치
npm init vue
```



![Pasted-image-20250411162500.png](/img/이미지 창고/Pasted-image-20250411162500.png)

위와 같은 화면이 나오게 됩니다. 
그리고 Select feature to include your project 란은 프로젝트에 필요한 npm 패지키를 미리 설치하고, Defualt로 구성해주겠다는 소리 입니다.

특별한 일이 아니라면 위에 선택란 처럼 선택하시고 Enter를 눌러주시면 됩니다.

## 설치 후 Dir 구조

![Pasted-image-20250411162540.png](/img/이미지 창고/Pasted-image-20250411162540.png)

위 구조는 Vue를 설치하면 기본적으로 보이는 vsCode의 디렉터리 구조 입니다.

# 시작 하기

Vue는 React 와 마찬가지로 [SPA](../Util/SPA.md) 프레임워크 입니다.

그렇기 때문에 눈 여겨 볼 파일들은 대략적으로 두 가지를 볼 수 있습니다.

`index.html` 파일과 `main.js` 파일 입니다.
위 파일은 Vue 프로젝트의 EntryPoint(진입점)라고 생각하시면 됩니다.

그 이후에 `components/`, `asstes/` 파일을 기본적으로 만들어줍니다.
Vue에서는 강제적으로 디렉터리 명 마다 역할을 강제로 설정되어있지 않습니다.

그렇지만, 관습적으로 프론트 엔드 개발자라면, 디렉토리 명으로 해당 역할 들을 지정 해놓고 사용합니다.
아래의 표를 정리해두었으니 참고 바랍니다.

:::tip SSR 프레임워크인 Nuxt는 디렉토리명에 대한 역할을 강제 지정합니다.

:::

| 디렉토리 명             | 역할                                                                                                  |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| `components/`      | Vue에서 재사용이 필요한 컴포넌트들을 담아 놓는 디렉토리 입니다.                                                               |
| `views/`, `pages/` | 실제 페이지의 역할을 하는 파일들을 모아둔 디렉토리 입니다.                                                                   |
| `asstes/`          | 해당 프로젝트 내부에서 사용하는 css 혹은 image 파일들을 담는 디렉토리 입니다.                                                    |
| `public/`          | url을 통해서 외부에서도 접근 해야 하는 파일들을 모아두는 디렉토리 입니다.                                                         |
| `router/`          | vue-router 라는 패키지를 사용할 경우 router 관련 정보를 넣는 디렉토리 입니다.<br />npm 패키지로 선택 사항이지만, 대부분은 거의 <mark>필수적으로 사용</mark>합니다. |
| `stores/`          | [Pinia](Pinia.md) Store에 대한 정보를 넣는 디렉토리 입니다.                                                                |
크게는 위 7개의 디렉토리가 암묵적인 룰에 해당합니다.
그 외에 디렉토리는 생성한 개발자의 취향대로 구성하는 경우가 대부분입니다.

:::quote Cypress 라는 디렉토리는 추후에 E2E 테스트를 위함으로 생성된 디렉토리 입니다.
- 추후 따로 정리 하겠습니다.
:::

## 실행하기

NodeJS 기반으로 만들어진 FrameWork 의 경우에는 대부분은 CMD 에 스크립트를 작성하여 실행하는 것이 일반적입니다.

실제로 어떤 명령어를 작성해야지 실행을 할 수 있냐면, 대부분 초기 셋팅 시에, 기본 개발모드 실행 script 명령어는 

```shell
npm run dev
```

입니다. 이를 아는 방법은 `package.json` 파일을 보시게 된다면, 해당 내용이 표기가 되어잇는 것을 볼 수 있습니다.

```json
{
	"name": "vue-test",
	"version": "0.0.0",
	"private": true,
	"type": "module",
	"scripts": {
		"dev": "vite",
		"build": "run-p type-check \"build-only {@}\" --",		    
		"preview": "vite preview",
		"test:unit": "vitest",
		"prepare": "cypress install",
		"test:e2e": "start-server-and-test preview http://localhost:4173 'cypress run --e2e'",
		"test:e2e:dev": "start-server-and-test 'vite dev --port 4173' http://localhost:4173 'cypress open --e2e'",
		"build-only": "vite build",
		"type-check": "vue-tsc --build",
		"lint:oxlint": "oxlint . --fix -D correctness --ignore-path .gitignore",
		"lint:eslint": "eslint . --fix",
		"lint": "run-s lint:*",
		"format": "prettier --write src/"
	},
	...
}
```

`package.json` 란에 `scripts` 라는 객체 안에 있는 명령어들이 cmd 란에 적용하면 실행할 수 있는 script 명령어 모음 입니다.

```shell

# npm 사용자
npm run [상단 명령어]

# yarn 사용자
yarn start [상단 명령어]
```

위 처럼 사용하시면 됩니다. 처음이시라면,

:::note 
- `npm run dev` : 개발 모드 실행
- `npm run build` : 운영 배포 전 압축 파일 생성
- `npm run preview` : 운영 배포 용으로 만든 압축 파일을 기반으로 실행

:::

를 기억해두시면 되고, 나머지 명령어는 추후에 사용해보시면 됩니다.

# 개념 정리

Vue 는 기본적으로 HTML, CSS, JavaScript로 개발을 했던 예전과는 다르게, 좀 더 효율적, 좀 더 다양한 기능을 지원하기에 만든 프레임워크 입니다.

성능에 민감 했던 예전의 프로그래밍과는 달리, 서버의 성능도, 클라이언트 기기들의 성능도 많이 좋아졌기에, 이제는 좀 더 복잡한 로직들을 수행이 가능하니, 고객들의 니즈도 많이 늘어나기 시작했습니다.

그러다보니, 자연스래 복잡성이 올라가고 효율이 떨어지다보니, 나오게 된 것입니다.

우선 기존 설치 했던 파일을 기준으로 설명 드리겠습니다.
```vue
<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
	<header>
		<img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
		<div class="wrapper">
			<HelloWorld msg="You did it!" />
			<nav>
				<RouterLink to="/">Home</RouterLink>
				<RouterLink to="/about">About</RouterLink>
			</nav>
		</div>
	</header>
	
	<RouterView />
</template>

<style scoped>
header {
	line-height: 1.5;
	max-height: 100vh;
}

.logo {
	display: block;
	margin: 0 auto 2rem;
}

nav {
	width: 100%;
	font-size: 12px;
	text-align: center;
	margin-top: 2rem;
}

nav a.router-link-exact-active {
	color: var(--color-text);
}

nav a.router-link-exact-active:hover {
	background-color: transparent;
}

nav a {
	display: inline-block;
	padding: 0 1rem;
	border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
	border: 0;
}

@media (min-width: 1024px) {
	header {
		display: flex;
		place-items: center;
		padding-right: calc(var(--section-gap) / 2);
	}

	.logo {
		margin: 0 2rem 0 0;
	}

	header .wrapper {
		display: flex;
		place-items: flex-start;
		flex-wrap: wrap;
	}

	nav {
		text-align: left;
		margin-left: -1rem;
		font-size: 1rem;
		padding: 1rem 0;
		margin-top: 1rem;
	}
}

</style>
```

위 코드 처럼 `App.vue` 파일이 셋팅 되어있는 것을 볼 수 있습니다.
이 부분에서 가장 기본적인 구조는 `<template></template>` 영역, `<script></script>` 영역, `<style></style>` 영역 입니다.

각 영역에는 규칙이 존재합니다. 대부분 처음 보는 분들이어도 파악 하시겠지만 모르시는 분들을 위해 알려드린다면,

## `<template></template>` 영역

위 영역은 `HTML` 영역으로, 실제로 화면이 그려지는 영역입니다.
실제 HTML 태그가 적용되기도 하며, 추후에 배워볼 Vue 의 문법 모두 적용됩니다.

대신 모든 형식은 HTML 태그 방식으로만 적용 되며, 이외의 행위는 오류가 나는 영역입니다.

:::warning `<template></template>` 영역은 외 태그를 작성하는 건 오류 입니다.
- 최상위 root 태그는 무조건 `<template></template>` 이어야 하며, 이외 태그는 사용할 수 없습니다.

:::

```vue
<!-- OK -->
<template>
	<div/>
</template>

-----------
<!-- Error -->
<template>
	<div/>
</template>
<div/>
```

위 예시 처럼 `template` 태그 내부에만 사용 가능합니다.

## `<script></script>` 영역

해당 영역은 JavaScript 를 작성할 수 있는 영역 입니다.
Script 영역은 실제로 프론트가 데이터를 핸들링하고, 통신하는 모든 행위들, 실제로 화면을 그리는 행위를 제외한 모든 영역을 제어하는 영역입니다.

그렇기에, 가장 중요하면서도 가장 제어가 어려운 부분입니다.

단순하게 고민한다면, 어렵지 않지만, 로직 자체가 복잡해지고, 화면에 직접적으로 연결이 되다보니, UI/UX 를 신경써서 고려한다면, 그때 부터는 난이도가 확 올라가게 됩니다.

위 부분은 프로젝트 규모가 커짐으로 인해서 발생되는 현상이니 나중에 설명을 드리겠습니다

:::question 위에는 `<script></script>` 가 아니라 `<script setup lang=ts></script>` 라는데요?
- 이는 Vue가 업데이트 되면서 생긴 옵션 입니다.
- 실제로 `<script></script>` 라고 작성해도 아무 문제가 없습니다.
- 하지만, 이제는 Vue 에서도 공식적으로 `<script setup lang=ts></script>` 를 사용하라고 권장하기에, 우리는 권장 옵션대로 따라가는게 제일 좋죠
- `setup` 
	- 해당 옵션은 [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html) 라는 개념을 도입하여 적용한 것입니다.
	- 쉽게 얘기해서 저는 React화 됐다고 말합니다. 자세한 개념은 추후에 설명할 예정입니다.
- `lang=ts`
	- 해당 옵션은 JavaScript 를 사용하지 않고, TypeScript를 사용한다는 옵션입니다.

:::

:::note 위 설명은 어디까지나 옵션이고, 필수 사항은 아닙니다.
- 편하신 대로 개발을 작성하시면 됩니다!
- 대신 저는 해당 옵션을 모두 킨 상태로 진행하겠습니다
- Composition이 추후에는 Vue3에서 메인으로 작동된다고 하였고(오피셜)
- 실제로 해당 방법으로 구현된 레퍼런스도 적기에, 선택을 하였고
- TypeScript 자체는 이제 앞으로 모든 JS를 TS 로 변경될 것은 기정 사실화가 되고 있으므로, 최신의 트랜드에 맞춰서 진행하겠습니다

:::

## `<style></style>` 영역

해당 영역은 CSS 를 작성할 수 있는 영역입니다.
선택 사항으로 해당 영역을 사용할 순 있지만, <mark>그닥 사용하지 않아서</mark> 제가 작성하는 문서에는 굳이 작성하지 않겠습니다.

이유인 즉, CSS 를 페이지 별로 작성하는 건 그리 좋은 작성법은 아닙니다.
CSS `asstes` 파일에서 퍼블리셔가 관리하는게 제일 유지보수 및 개발하기 용이하기에, 
해당 부분은 예시를 제외한 채 진행하겠습니다.


# 문법

## `<template></template>` 영역 문법

:::error 기본적으로 HTML에 대한 선수지식이 있다는 가정하에 진행합니다.

:::

### 보간법(Interpolation)

:::note 보간법?
- 데이터 바인딩의 가장 기본 형태는 "Mustache"(이중 중괄호 구문)기법을 사용한 문자열 보간법(text interpolation)입니다.

:::

```html
<span> 메시지 : {{ msg }} </span>
```

**v-once** 디렉티브를 사용하여 데이터가 변경되어도 갱신되지 않는 **일회성 보간**을 수행할 수 있다

```html
<span v-once>변하지 않는 변수 : {{ msg }}</span>
```

:::note `<span v-once></span>` 중에 `v-once` 뭔가요?
- 해당 부분은 HTML에서 attribute 라고 불립니다.
- Vue는 이를 문법으로 이용하여, 특정 정해진 예약어를 태그 내부에 작성하게 된다면, 문법으로 작용됩니다.
- 보통 Vue에서는 자체적으로 만들수 있는데 이때는, 이를 <mark>Props</mark> 라고 부릅니다.
- 해당 개념은 매우 많이 나오는 개념이니 참고 해주세요
- 자세한 건 아래에 설명 드릴 예정입니다.

:::

### 실습 코드
`views/HomeView.vue`
```vue
<script setup lang="ts">
	const msg = "Hello Vue!"
</script>

<template>
	<h1 @click="add">
		{{ msg }}
	</h1>

	<h1 v-once @click="add">
		{{ msg }}
	</h1>
</template>
```
위 파일을 그대로 수정하게 된다면 아래의 화면 처럼 나오게 됩니다.
![Pasted-image-20250411172054.png](/img/이미지 창고/Pasted-image-20250411172054.png)

:::note `<span @click="add"></span>` 에서 `@click`은 뭔가요
- 해당 옵션도 `v-once`와 마찬가지로, Vue 내부에서 예약어로 사용하고 있습니다.
- 해당 옵션 자체는 해당 태그를 클릭하였을 때 `add()`를 실행시켜 줍니다.
- 이 예약어를 포함하여 자주 사용하는 예약어가 두루 존재합니다. 이는 외우시면 됩니다.
- 또한 역시 Vue 에서 이를 자체적으로 커스텀 하여 사용이 가능합니다 이를 <mark>emit</mark> 이라고 부릅니다.
- 커스텀의 기준은 `click` 속성을 커스텀 한다는 것은 아닙니다

:::

부가 설명이 길었지만, 여하튼 보간법을 이용하면, script에서 저장 혹은 가공한 변수 데이터 들을 화면에 표기할 수 있습니다.

사실 상, `{{ }}` 내부는 html 코드가 아닌 javascript 코드만 인식한다고 생각하시면 됩니다.

가끔 특히, 이제 블로그 처럼 에디터를 사용하여, 해당 데이터를 화면에 뿌리고 싶을 때가 있습니다.
이를 그대로 `{{ }}` 에 뿌리게 된다면 아래와 같이 나오게 됩니다.

`views/HomeView.vue`
```vue
<script setup lang="ts">
const msg = "Hello Vue!"
const htmlMsg = "<h1>Hello Vue!</h1>"
</script>

<template>
	<h1 @click="add">
		{{ msg }}
	</h1>
	<div>
		{{ htmlMsg }}
	</div>

	<h1 v-once @click="add">
		{{ msg }}
	</h1>
</template>
```

![Pasted-image-20250411172408.png](/img/이미지 창고/Pasted-image-20250411172408.png)
배치는 신경쓰지 맙시다!

여하튼 위와 같이 html 태그도 Text로 인식하기에,,고대로 나와버립니다.
이때는 아래와 같은 태그를 작성하게 된다면 해결이 가능합니다.

## 원시 HTML

:::tip v-html
- 이중 중괄호는 데이터를 HTML이 아닌 텍스트로 해석 합니다.
- 실제 HTML을 출력하려면 `v-html` 디렉티브를 사용해야 합니다.

:::

```vue
<script setup lang="ts">
const msg = "Hello Vue!"
const htmlMsg = "<h1>Hello Vue!</h1>"
</script>

<template>
	<h1 @click="add">
		{{ msg }}
	</h1>
	<div v-html="htmlMsg"></div>
	<h1 v-once @click="add">
		{{ msg }}
	</h1>
</template>
```

![Pasted-image-20250411172556.png](/img/이미지 창고/Pasted-image-20250411172556.png)

참 쉽죠? 대신 v-html 은 치명적인 단점이 존재합니다.

:::bug [XSS 보안 이슈](https://developers.hyundaimotorgroup.com/blog/439)
- 편하게 사용이 가능한 대신 치명적인 단점이 존재합니다. 
- 이 옵션은 위 이슈에서 자유롭지 못하기에, `v-html`은 신중하 사용하길 바랍니다.

:::

## Attr

`HTML` 에서 사용했던 속성 값은 대부분은 static 했습니다. 하지만, 이를 저흰 동적으로 컨트롤을 하고 싶어 할 겁니다.

쉬운 말로, HTML에서의 속성 값은 고정된 값이므로, 
예를 들면 <mark>특정 조건</mark>에 의한 <mark>url 변경</mark> 과 같은 로직이 불가능하죠

하지만, Vue는 이를 가능하게 해줍니다. 거의 모든 HTML attr에 호환되며, 위에 `props`라는 개념에서도 사용이 가능합니다.

:::success 해당 부분은 매우 중요합니다. 충분히 숙지 하시고 넘어가시는게 좋습니다.

:::

:::tip v-bind
- 이중 중괄호 구문은 HTML 속성에 사용할 수 없습니다
- 대신 `v-bind` 디렉티브를 사용하면 된다.
- `v-bind`는 귀찮아서 대부분 `:`를 사용한다.

:::

### 예시
```html
<!-- v-bind -->
<!-- 전체 문법 -->
<a v-bind:href="url"> ... </a>

<!-- 약어 -->
<a :href="url"> ... </a>

<!-- 동적 전달 인자와 함께 쓴 약어 -->
<a :[key]="url">...</a>

<!-- v-on -->
<!-- 전체 문법 -->
<a v-on:click="doSomething"> ... </a>

<!-- 약어 -->
<a @click="doSomething"> ... </a>

<!-- 동적 전달 인자와 함께 쓴 약어 -->
<a @[click]="doSomething">...</a>
```

:::tip 이때 동적인자는 추후에 설명드릴 `props`와 `emits`에 대한 얘기입니다.


:::

이외 많은 attr 예약어가 존재합니다. 
해당 예약어는 외움의 영역입니다. 

[Vue Template 예약 문법 정리](Vue-Template-예약-문법-정리.md) 해당 사이트를 보시면서 Vue의 예약어를 확인하시면 수월하게 진행이 가능할 것 같습니다.

그러니, 해당 부분을 보시고, 필요할 때 사용하시면 됩니다.

# Component

해당 부분은 FrontEnd 개발을 희망하시거나 관심 가지신 분들은 굳이 Vue 아니어도, 많이 들어볼 만한 단어 일겁니다.
실제로도 Vue 이외에 영역에서도 많이 사용하는 언어입니다.

:::note Compnent?
- **프로그래밍에서 재활용 가능한 독립적인 모듈** 라는 뜻 풀이를 가지고 있습니다.

:::

즉, 재활용 성을 매우 높인 것에 대한 결과랄까요
프로그래밍을 하다 보면, 반복되서 나오는 패턴들이 굉장히 많습니다.

해당 작업들을 한땀한땀 만들기엔, 시간이라는 건 정해져있기에, 불가능에 가깝고, 아무리 똑같은 로직이더라도, 
다른 시간, 다른 사람이 만지기 시작하면, 해당 같은 영역 이어도 틀어지기 마련이죠, 즉, <mark>통일성과 정합성이 떨어집니다.</mark>

컴포넌트는 이를 최대한 저지 시킵니다.

공통적으로 사용되는 모듈, 영역을 하나로 정의하고, 이를 재사용 가능하게 해줍니다.

컴포넌트를 구성하는 방법은 꽤 여러개가 있지만, 우선 간략하게 나마 설명 하겠습니다.
기본적으로 현재 코드에서도 컴포넌트를 어떤식으로 활용하는지는 대략적으로 확인이 가능합니다.

`App.vue`
```vue
<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
	<header>
	<img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

	<div class="wrapper">
		<HelloWorld msg="You did it!" />
		<nav>
			<RouterLink to="/">Home</RouterLink>
			<RouterLink to="/about">About</RouterLink>
		</nav>
	</div>
</header>
<RouterView />

</template>
```

`App.vue` 파일을 보게 된다면, `<HelloWorld>`라는 HTML 태그를 볼 수 있습니다.
하지만 아무리 뒤져봐도 `<HelloWorld>` 이라는 태그는 HTML 에서 지원하지 않습니다.

맞아요 이건 Vue에서 자체적으로 <mark>컴포넌트화</mark> 시킨 겁니다.
Vue는 컴포넌트화를 시키게 된다면, 사용하기 위해서는 `<template>` 영역에서 HTML 태그 처럼 사용하면 됩니다.

그리고 script 영역에서 보앗듯 `import HelloWorld from './components/HelloWorld.vue'` 라고 `import` 를 해줘야지, Vue에서는 컴포넌트로 인식됩니다.

특별한 경우가 없다면, 대부분의 Compoent 명은 파일 명으로 적용됩니다.

쉽게 생각하면 저희가 자체적으로 HTML 태그를 개발할 수 있고, 사용도 가능하다 라고 생각하시면 됩니다.


:::warning 이제는 간단한 상황이 아닌, 복잡한 상황에 대해서 대처하는 문법을 설명 드리겠습니다.
- 이때 간단하다는 건 정적으로 사용한다는 것이고, 
- 복잡한 상황은 동적으로 어떤 컴포넌트를 제어한다는 뜻입니다.

:::

## Props

:::Note Props?
- 부모 컴포넌트에서 자식 컴포넌트로 특정 데이터를 **보내고 싶을 때** 사용하는 문법

:::

라고 정의 합니다.



:::tip 부모 자식 컴포넌트?
앞으로 많이 나올 개념임으로 간단히 설명을 드리자면
![Diagram.svg](/img/이미지 창고/Diagram.svg)
- 현재 파일의 구조를 살펴보게 된다면, `App.vue` 파일 내부에 `HelloWorld.vue` 컴포넌트가 존재합니다.
- 이런식으로 바라보았을 때, `App.vue` 내부에 `HelloWorld.vue`가 배치된 구조
- 즉, 상위 컴포넌트는 `App.vue`이고, 하위 컴포넌트는 `HelloWorld.vue` 이를 다른 말로 풀면 부모 자식 관계라고 흔히 말합니다. 
- 이 개념은 이제 많이 나오는 개념이므로, 참고 해서 계속 공부하시면 됩니다.

:::

실제로 코어 개발자, 혹은 많은 현업에 계신 개발자라고 하면 저를 포함해서라도 많이 하는 고민들이 props에서도 많이 있습니다.

어디까지 props로 지정해야할까? 라는 현실적인 고민을 주로 하게 됩니다.

:::question 왜 Props로 고민을 하나요?
- Component의 목적 자체는 결국은 재사용성을 높이는 것입니다.
- 재사용성을 높이기 위해선 결국은 내부에 있는 로직들을 **정적으로 만들면 안되**고 **동적**으로 만들어야합니다.
- 그래야지 추후에 많은 상황 속에서도 충분히 대비가 가능합니다.

:::

즉, 정답은 없습니다 상황마다 props를 어떻게 쓰냐에 따라 다릅니다.
사용 방법은 알려드리되, 활용 방법은 스스로 터득하시는게 제일 좋습니다.

아래 사용 방법을 알려 드리겠습니다.

### 부모 컴포넌트
`App.vue`
```vue
<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
	<header>
	<img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

	<div class="wrapper">
		<HelloWorld msg="You did it!" />
		<nav>
			<RouterLink to="/">Home</RouterLink>
			<RouterLink to="/about">About</RouterLink>
		</nav>
	</div>
</header>
<RouterView />

</template>
```

저희는 여기서 `HelloWorld` 라는 컴포넌트를 집중해서 보시면 됩니다.
해당 컴포넌트에 attr 속성에 `msg="You did it!"` 부분이 보이실까요

해당 부분을 혹시 Hello Props! 라고 수정하시면 어떤 화면이 뜰까요?
![Pasted-image-20250412071617.png](/img/이미지 창고/Pasted-image-20250412071617.png)
아마 위 화면처럼 뜰겁니다.

변화는 잘 캐치 하셧나요?
잘 보셨을거라고 믿고 진도를 나가겠습니다.

위에 `v-once`의 예시를 들었을 때도 설명을 조금 드렸지만, props를 사용하는 방법은 상단 `App.vue` 파일에서 보신 것처럼 작성하면 HTML 태그 내부에 작성하시면 됩니다

:::question Hello Props 말고 동적으로 해당 props를 제어하려면, 변수로 지정해야하는데 안되요
- 이 부분은 `v-on` 이라는 곳을 보시면 힌트를 알 수 있습니다.
- 보통 `msg=""` 이러한 구조를 작성하게 된다면, vue는 `""`안에 데이터를 String으로만 인지합니다.
- 그리고 `:msg=""`라고 작성하게 된다면, vue는 `""`안에 데이터를 JS로 인식합니다.
- 즉, 동적으로 변수로 지정하고 싶다면 `msg=""`가 아닌 `:msg=""`로 작성하셔야 합니다.

:::

위 동적으로 어떤식으로 `App.vue`에서 제어하게 하는지 간단 예시를 보여드리겠습니다.

```vue
<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { ref } from 'vue'

const msg = ref('Hello World')

const changeMsg = () =>{
	msg.value = 'Click Buttons'
}
</script>

<template>
	<header>
	<img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
	
	<div class="wrapper">
		<HelloWorld :msg="msg" />
		<button @click='changeMsg'>Click</button>
		<nav>
			<RouterLink to="/">Home</RouterLink>
			<RouterLink to="/about">About</RouterLink>
		</nav>
	</div>
	</header>
	
	<RouterView />

</template>
```

:::Note ref 변수
- 아마 생소하신 분들이 많으실거라고 생각이 듭니다.
- 보통 reference 변수라고 많이 말 하십니다.
- 대부분의 let 변수들은 화면 자체에서 실시간 성을 보장하지 못합니다.
- 현재 예시에서 ref를 빼고 let 변수로 변경했을 때 체감 하실겁니다.
- 대부분은 데이터는 이미 바뀐 상태로 존재하지만, 화면에서 해당 데이터가 바뀌었다는 이벤트를 주어야지 화면에서 해당 데이터를 변경합니다.
- 즉, 내부 데이터가 바뀌었다는 신호를 줘야지 화면에서 바꾸게 됩니다.
- let 변수는 실시간으로 해당 신호를 주지 못한다고 생각하시면 됩니다.
- 그리고 이를 보통 저희는 reactivity라고 부릅니다. 
- 자세한 내용은 아래 에서 설명 드리겠습니다.

:::

여하튼 위 처럼 사용하시게 된다면, 부모 컴포넌트에서 자식 컴포넌트에 선언된 props를 사용하는 방법을 아시게 된것입니다.

#### 결과
![Pasted-image-20250412072459.png](/img/이미지 창고/Pasted-image-20250412072459.png)

그렇다면, 실질적으로 부모 측에서 사용 방법을 알았으니, 자식쪽에서는 어떤식으로 Props를 작성하였는지 알아보겠습니다.

### 자식 컴포넌트
```vue
<script setup lang="ts">

// 선언 방법 1
defineProps<{
msg: string
}>()

// 선언 방법 2
const props = defineProps({
	msg:{
		type: string,
		default:()=>''
	}
})

</script>

<template>
	<div class="greetings">
		<!-- 선언 방법1 의 사용 방법 -->
		<h1 class="green">{{ msg }}</h1>
		<!-- 선언 방법2 의 사용 방법 -->
		<h1 class="green">{{ props.msg }}</h1>
		<h3>
			You’ve successfully created a project with
			<a href="https://vite.dev/" target="_blank" rel="noopener">
				Vite
			</a> 
			+
			<a href="https://vuejs.org/" target="_blank" rel="noopener">
				Vue 3
			</a>
			. What's next?
		</h3>
	</div>

</template>
```

위 자식 컴포넌트를 선언하는 방식에 따라 내부에서 사용하는 방법이 다릅니다. 
이 점은 체크 해서 사용하시길 바랍니다.

그리고 만약 기존에 Vue2를 하신 분들이 보신다면, 원래는 기존에 Props를 사용하던 방식이 아니라서 조금 낯선 코드 일것입다.

Vue2 라기 보단 근본적으로 TypeScript로 해당 script가 이동하였으니, 그에 걸맞는 패치가 적용됐다고 보시면 됩니다.
<mark>props에 타입을 강제</mark>하고, default 값까지 적용하여, 
혹여라도 props를 부모 컴포넌트에 선언하지 않더라도, 에러가 나지 않게 하는게 <mark>선언 2</mark>의 목적입니다.

각자 취향 껏 사용하시면 됩니다.

## Emit

:::question 그렇다면 자식에서 부모로 데이터를 보내는건 없나요?

:::

Props를 경험하게 된다면, 자연스럽게 고민할 수 있는 요소들입니다.
그리고 여러가지 상황을 대입 했을 때, 부모 -> 자식이 있는데, 자식 -> 부모가 없는게 많이 안되긴 하죠 ㅎㅎ

그걸 보통 Emit으로 처리를 하게 됩니다.
그렇지만, 완전히 props랑 똑같다고 생각하시면 안됩니다.

기본적으로 자식 컴포넌트에서 부모 컴포넌트로 데이터를 전달하는 행위 자체는 Vue의 입장에서는 **정상적인 흐름**은 아닙니다.

예를 들자면
![Pasted-image-20250414191733.png](/img/이미지 창고/Pasted-image-20250414191733.png)
위와 같은 물은 위에서 아래로 흐르지요?
원래의 물의 흐름은 위에서 아래인데, 물을 아래에서 위로 흐르게 하기 위해서는 어떻게 해야할까요?

안된다구요? 무슨소리에요 우리는 현대인이니까 당연히 모터를 쓰면 되는 것을!

예를 들었지만, 우선 독자님이 듣기에도 자연적인 방법으로는 안된다는 것이죠

즉, Emit도 마찬가지로 어쩌면 정상적인 방법은 아닙니다.
자식 -> 부모에게 데이터를 전달해주는 행위 자체가 정상적인 행위는 아니기에, 약간의 조건이 필요합니다.
폭포도 그러하듯 그렇다면, 우선 예시로 보여드리는게 빠를 터이니,,우선 부모 컴포넌트에서 해당 Emit을 어떻게 받는지 알아보겠습니다.

### 부모 컴포넌트

`App.vue`
```vue
<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { ref } from 'vue'

const msg = ref('Hello World')

// 해당 부분 집중
const parentEmitEvent = (data:string) =>{
	alert(`emit Event ===> ${data}`)
}
</script>

<template>

<header>

	<img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
	<div class="wrapper">
		<HelloWorld :msg="msg" @childEmitEvent='parentEmitEvent'/>
		<button>Click</button>
		<nav>
			<RouterLink to="/">Home</RouterLink>
			<RouterLink to="/about">About</RouterLink>
		</nav>
	</div>
</header>
<RouterView />
</template>
```

위 영역에서 `HelloWorld` 컴포넌트를 잘 봐주시길 바랍니다.
해당 부분에서 못보던게 생겼을 것입니다. 네네 맞아요 `@childEmitEvent` 라는 구문이 생겼죠.

이 부분이 바로 Emit을 가르키는 말입니다.

즉, 해당 부분은 `HelloWorld` **컴포넌트에서 선언한 emit 객체 명**을 적는 란입니다.
그리고 그 우항(`parentEmitEvent`)는 실제 부모 컴포넌트에서 사용할 **함수 명**입니다.

:::note Emit 데이터를 받기 위해서는 부모 컴포넌트 측에서는 함수로 받아야합니다.

:::

생각보다 복잡하죠? 당연히 자연을 거스르는 일은 복잡할 수 밖에 없습니다.
그러니 Vue에서도 가급적 사용하지 말라고 하죠 뭐 말이 그렇다는거지, 사용 안 할 수는 없습니다.

대신 사용을 최소화 하는 것이 개발자 입장에서도 헷갈리는 요소를 줄여주는 부분이기에, 가능한 최소화로 사용하는 것을 권장 드립니다.

그리고 아래 코드 쪽에서 `data`라는 함수에 매개변수로 선언되어있는 곳이 있습니다.
```js
// 해당 부분 집중
const parentEmitEvent = (data:string) =>{
	console.log('emit Event ===>', data)
}
```

왜 이렇게 선언하게 된건지는 아래 자식 컴포넌트에서 emit을 선언하는 방법을 알게 된다면, 알수 있습니다.

### 자식 컴포넌트
`HelloWorld.vue`
```vue
<script setup lang="ts">
defineProps<{
	msg: string
}>()

const emits = defineEmits(['childEmitEvent'])

const clickMsg = ()=>{
	emits('childEmitEvent', 'Click Event!!!')
}

</script>

<template>
	<div class="greetings">
	<h1 class="green" @click='clickMsg'>{{ msg }}</h1>
	<h3>
		You’ve successfully created a project with
		<a href="https://vite.dev/" target="_blank" rel="noopener">
			Vite
		</a> 
		+
		<a href="https://vuejs.org/" target="_blank" rel="noopener">
			Vue 3
		</a>
		. What's next?
	</h3>
	</div>

</template>
```

우선 먼저 Emit을 사용하기 위해서는 아래와 같이 emit 객체를 선언 및 정의 해야합니다
```js
// 단건 일 떼
const emits = defineEmits(['childEmitEvent'])

// Emit이 다건일 때
const emits = defineEmits(['emit0', 'emit1', 'emit2'])
```
`defineEmits` 객체 안에 String Array로 적용하면 됩니다.

그리고 그 후에, Emit을 발동 시킬 이벤트가 필요합니다.
말 그대로 물을 위로 쏘아 올려야하므로, 특정한 조건이 필요합니다.
emit은 그 조건이 결국은 **이벤트**를 의미합니다.

특정한 조건이 없다면, Emit을 부모 컴포넌트에서 전달할 타이밍을 알 수 없기에, <mark>강제로 타이밍</mark>을 만들어줘야합니다.
```js
const clickMsg = ()=>{
	emits('childEmitEvent', 'Click Event!!!')
}
```

타이밍을 만들어줄 이벤트 함수를 만들었다면, 위와 같이 `emits` 객체 안에, 첫 파라미터로는 <mark>선언할 Emit 명</mark>, 그 이후 부터는 전달할 데이터 들을 나열해서 작성하면 됩니다.

위 처럼 나열한 데이터는 앞서 부모 컴포넌트에서 아래와 같이 emit을 받을 때 파라미터로 들어가게 됩니다.
```js
const parentEmitEvent = (data:string) =>{
	alert(`emit Event ===> ${data}`)
}
```

즉, 데이터를 두개 전달하고 싶다면
```js
// 자식 컴포넌트

const clickMsg = ()=>{
	emits('childEmitEvent', 'Click Event!!!', 'secondData')
}

// 부모 컴포넌트
const parentEmitEvent = (data:string, data2: string) =>{
	alert(`emit Event ===> ${data} ${data2}`)
}
```

위 처럼 작성하면 됩니다.

무튼 위 코드를 돌리면 아래와 같은 화면이 나와야합니다.

![Screenshot-2025-04-14-at-7.39.23-PM.png](/img/이미지 창고/Screenshot-2025-04-14-at-7.39.23-PM.png)

여기까지 오셨다는 뜻은 기초가 어느정도 다져 졌다는 뜻입니다.

즉, 기본적인 웹 페이지 정도는 다루실 수 있다는 얘기죠!

더 이상을 원한다구요? 우선 프로젝트를 하신 다음에 위에 내용을 어느정도 숙지 되시면 다음 편을 들으셔도 좋습니다!

이 이후부터 진행되는 Vue 관련 포스팅은 이런식의 진행보단, 필요에 의한 지식, 상황을 대처하기 위한 지식을 기반으로 설명할 예정이니, 사실 프로젝트를 안해보면 모르는 지식일 것입니다.

조그마한 것이라도 좋으니 프로젝트를 시작하여 기초를 다지고, 프로젝트를 진행하다 모르는 게 생긴다면 재방문 부탁드립니다 ㅎㅎ
