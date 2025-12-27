- [Vue2와 Vue3의 차이점](#Vue2와 Vue3의 차이점)
- [Vue3의 코드 작성 방식](#Vue3의 코드 작성 방식)
	- [옵션 API](#Vue3의 코드 작성 방식#옵션 API)
	- [컴포지션 API](#Vue3의 코드 작성 방식#컴포지션 API)
- [개발환경 셋팅](#개발환경 셋팅)
	- [Vue2](#개발환경 셋팅#Vue2)
	- [Vue3](#개발환경 셋팅#Vue3)
- [간단 Vue 시작](#간단 Vue 시작)
	- [Reactivity](#간단 Vue 시작#Reactivity)
		- [Proxy](#Reactivity#Proxy)
			- [Parameters](#Proxy#Parameters)
		- [Vue2 와 Vue3의 차이점](#Reactivity#Vue2 와 Vue3의 차이점)
			- [Data](#Vue2 와 Vue3의 차이점#Data)
			- [문제점](#Vue2 와 Vue3의 차이점#문제점)
	- [Method](#간단 Vue 시작#Method)
		- [Directive](#Method#Directive)
	- [Vue Component](#간단 Vue 시작#Vue Component)
		- [Component 통신 방식](#Vue Component#Component 통신 방식)
			- [Props 전달](#Component 통신 방식#Props 전달)
				- [Props 적용하기](#Props 전달#Props 적용하기)
		- [이벤트 발생](#Vue Component#이벤트 발생)
		- [동일 레벨 컴포넌트 데이터 전달](#Vue Component#동일 레벨 컴포넌트 데이터 전달)
	- [Vue Template 문법](#간단 Vue 시작#Vue Template 문법)
		- [v-if & v-show](#Vue Template 문법#v-if & v-show)
			- [v-if & v-show 차이점](#v-if & v-show#v-if & v-show 차이점)
		- [class & id 바인딩](#Vue Template 문법#class & id 바인딩)
	- [Vue CLI](#간단 Vue 시작#Vue CLI)
		- [Project 폴더 내용](#Vue CLI#Project 폴더 내용)
		- [페이지 로딩 과정](#Vue CLI#페이지 로딩 과정)
	- [Vue Single File Component](#간단 Vue 시작#Vue Single File Component)
		- [실습](#Vue Single File Component#실습)

# Vue.js
:::tip **Vue.js?**
- 간단한 화면 UI 개발 부터 라우팅, SSR 등의 애플리케이션 레벨의 개발을 지원하는 프레임워크
- 리액트와 더불어 실무에서 가장 많이 사용되고 있는 프론트엔드 개발 라이브러리
- 리엑트에 비해 진입 장벽이 낮고 쉽게 배울 수 있다.
- 개발 생산성이 높고 JS 지식이 크게 요구 되진 않는다.
- 프론트엔드, 백엔드 등 점차 직무적으로 전문화되고 있는 상황에서 처음 개발을 시작하는 프론트엔드 개발자 또는 백엔드 개발자에게 선호되는 경향

:::

# Vue2와 Vue3의 차이점
- 라이브러리 내부 로직 재작성
	- <mark>TypeScript</mark>로 작성
- 주요 개발 도구들 변경
	- Vue 개발자 도구, VSCode 플러그인, Vite 기반 프로젝트 생성 등
- 컴포지션 API, Teleport 등 새로운 문법 지원
- 리액티비티 시스템 기반 API 변경
- 공식 문서 변경

# Vue3의 코드 작성 방식

## 옵션 API
```vue
<div id="app">{{ message }}</div>

<script>
	Vue.createApp({
		data(){
			return{
				message: 'hi',
			};
		},
	}).mount('#app');
</script>
```

## 컴포지션 API
```vue
<div id="app">{{ message }}</div>

<script>
	Vue.createApp({
		setup(){
			const message = ref('hi');
			
			return{
				message
			}
		}
	}).mount('#app')
</script>
```

- 위의 옵션에 다라서 Vue의 코드가 달라집니다.
- 실제 <mark>Option API</mark> 쪽은 <mark>처음 접하는 분</mark>들 위주로 셋팅을 하게 되고,
- 많이 접하며, <mark>클린 코드 위주</mark>로 사용하는 개발자들은 <mark>컴포지션 API</mark>를 선호하게 됩니다.

# 개발환경 셋팅
## Vue2
![Pasted-image-20231220100536.png](/img/이미지 창고/Pasted-image-20231220100536.png)
- Vue2 버전의 경우에는 위의 Vutur를 사용하면 되고

## Vue3
![Pasted-image-20231220100654.png](/img/이미지 창고/Pasted-image-20231220100654.png)
- Vue3의 경우에는 위의 `volar`를 설치하면 됩니다.

# 간단 Vue 시작
```vue
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>\
<div id="app">
	   {{ message }}
</div>
<script>
	  Vue.createApp({
		  data() {
			  return {
				message: 'hi'
			}
		},
	}).mount('#app');
</script>
```
- 맨 위에 `script`는 CDN이라고 해서, Vue에 관련된 패키지들을 외부에서 가져오는 작업을 합니다.
- 그 후, 아래 `mount('#app')` 에서는 `id="app"`을 추적하여 해당 부분을 Vue로 Mount 해주게 됩니다.

## Reactivity
![Pasted-image-20231220103433.png](/img/이미지 창고/Pasted-image-20231220103433.png)
- 해당 부분처럼 dev tool 에서 해당 변수를 변경하면 Vue 또한 변경되는 것을 볼 수 있다.
![Pasted-image-20231220103507.png](/img/이미지 창고/Pasted-image-20231220103507.png)
```html
<div id="app"></div>

<script>
	const data = {
		a: 10
	}
	const app = new Proxy(data, {
		get(){
			console.log('값 접근')
		},
		set(){
			console.log('값 갱신')
		}
	})
</script>
```
![Pasted-image-20231220105509.png](/img/이미지 창고/Pasted-image-20231220105509.png)
- 위와 같이 콘솔을 통해서 접근하는 것을 볼 수 있습니다.
### Proxy
:::tip **Proxy?**
- 객체의 기본 동작을 재정의 할 수 있다

:::

간단하게 위의 코드를 화면에 뿌려주는 코드를 작성하겠습니다.

```html
<div id="app">
    <!-- 해당 부분에서 렌더링 됩니다.
    -->
</div> 

<script>
    const data = {
        message: 10
    }
  
    function render(sth){
        const div = document.querySelector('#app');
        div.innerHTML = sth;
    }
  
    const app = new Proxy(data, {
        get(){
            console.log('hi')
        },
        set(target, prop, newValue){
            target[prop] = newValue
            console.log('값 갱신')
            render(newValue)
        }
    })
</script>
```

#### Parameters
- target : 객체
- property : 객체의 속성을 의미합니다.
- value : 새로운 데이터를 의미합니다.
-> `target[prop]` == 객체의 속성 값을 의미합니다.

### Vue2 와 Vue3의 차이점
![Pasted-image-20231220133425.png](/img/이미지 창고/Pasted-image-20231220133425.png)

#### Data
- 값을 가져오는 부분은 `getter`, 값을 내보내는 부분은 `setter` 입니다.

#### 문제점
기본적으로 Vue의 한계이기보다는 `Object.defineProperty`의 한계에 가까웠습니다.
이유는 아래와 같습니다.
```js
var data = {
	a: 10
}

Object.defineProperty(data, 'a', {
	get(){
	},
	set(){
	},
});
```
위와 같이 Data를 가져오고 셋팅하기 위해서 `Object.defineProperty`를 사용합니다.
하지만 만약에 data라는 값이 a -> b로 바뀐다면?
```js
var data = {
	a: 10,
	b: 10
}

Object.defineProperty(data, 'a', {
	get(){
	},
	set(){
	},
});

Object.defineProperty(data, 'b', {
	get(){
	},
	set(){
	},
});
```
위와 같이 모든 속성마다 `Object.defineProperty`를 선언해야합니다.
해당 불편한 점이 있지만, 위의 코드에서는 `data` 라는 객체를 물고 들어가기에, 좀 더 효율적으로 구성이 가능합니다.

## Method
```js
new Vue({
	el: ,
	template: ,
	data: ,
	methods: ,
	created: ,
	watch: ,
})
```
- `el` : 인스턴스가 그려지는 화면의 시작점(특정 HTML 태그)
- `template` : 화면에 표시할 요소(HTML, CSS 등)
- `data` : 뷰의 반응성(Reactivity)이 반영된 데이터 속성
- `methods` : 화면의 동작과 이벤트 로직을 제어하는 메서드
- `created` : 뷰의 LifeCycle 과 관련된 속성
- `watch` : data에서 정의한 속성이 변화했을 때 추가 동작을 수행할 수 있게 정의 하는 속성
```html
<div id="app">
    <p>{{count}}</p>
    <button v-on:click="addCount">+</button>
</div>

<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>

<script>
   Vue.createApp({
        data: function() {
            return{
                count: 0
            }
        },
        methods: {
            addCount(){
                this.count++;
            }
        },
   }).mount('#app')
</script>
```
### Directive
```html
<div id="app">
    <ul>
        <li v-for="item in items">
            {{item}}
        </li>
    </ul>
</div>

<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<script>
   Vue.createApp({
        data: function() {
            return{
                items: ['삼성', '네이버', '인프런']
            }
        }
   }).mount('#app')
</script>
```

## Vue Component
![Pasted-image-20231220145117.png](/img/이미지 창고/Pasted-image-20231220145117.png)
- 왼쪽과 같은 화면을 만들어내는 것은 오른쪽과 같이 컴포넌트의 계층 구조로 만들어지는 것입니다.
- 즉, 최상위 컴포넌트가 있고, 그 아래 컴포넌트들이 존재하며, 해당 컴포넌트끼리의 그룹으로 만들어집니다

```html
<!--html-->
<div id="app">
    <!-- 컴포넌트 표시 -->
    <app-header></app-header>
</div>

<!--javascript-->
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<script>
    Vue.createApp({
        // 인스턴스 옵션 속성 - 옵션 API
        components:{
            // '컴포넌트 이름' : 컴포넌트 내용
            'app-header' : {
                template: '<h1>컴포넌트 등록</h1>'
            }
        }
    }).mount('#app')
</script>
```
- 위의 코드를 짜게 된다면, 아래 사진과 같이 `Components` 배치 됩니다.
![Pasted-image-20231220154420.png](/img/이미지 창고/Pasted-image-20231220154420.png)
- Root라는 컴포넌트 아래에 `AppHeader`라는 컴포넌트를 등록 했고, 컴포넌트를 등록하면 등록할 수록 위 처럼 컴포넌트가 생기게 됩니다.
### Component 통신 방식
![Pasted-image-20231220155632.png](/img/이미지 창고/Pasted-image-20231220155632.png)
데이터는 위에서 아래로 흐르고, 이벤트는 아래에서 위로 흐르게 됩니다.
:::success 상위 -> 하위
- 프롭스 속성

:::

:::warning 하위 -> 상위
- 이벤트 발생

:::

#### Props 전달
- Props 속성은 컴포넌트 간에 데이털르 전달 할 수 있는 컴포넌트 통신 방법 입니다.
- Props 속성을 기억할 때는 상위 컴포넌트에서 하위 컴포넌트로 내려보내는 데이터 속성입니다.

```html
<!--html-->
<div id="app">
    <!-- 컴포넌트 표시 -->
    <app-header></app-header>
</div>

<!--javascript-->
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<script>
    Vue.createApp({
        // 인스턴스 옵션 속성 - 옵션 API
        components:{
            // '컴포넌트 이름' : 컴포넌트 내용
            'app-header' : {
                template: '<h1>컴포넌트 등록</h1>',
                props: ['title']
            }
        }
    }).mount('#app')
</script>
```
##### Props 적용하기
```html
<!--html-->
<div id="app">
    <!-- 컴포넌트 표시 -->
    <!-- <app-header v-bind:프롭스 이름="상위컴포넌트의 데이터 이름"></app-header> -->
    <app-header v-bind:title="appTitle"></app-header>
</div>

<!--javascript-->
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<script>
    Vue.createApp({
        // 인스턴스 옵션 속성 - 옵션 API
        data(){
            return{
                appTitle: '프롭스 넘기기'
            }
        },
        components:{
            // '컴포넌트 이름' : 컴포넌트 내용
            'app-header' : {
                template: '<h1>컴포넌트 등록</h1>',
                props: ['title']
            }
        }
    }).mount('#app')
</script>
```
![Pasted-image-20231220171015.png](/img/이미지 창고/Pasted-image-20231220171015.png)
- 위의 코드처럼 `props`와 부모 data를 생성합니다.

### 이벤트 발생
- 이벤트 발생은 컴포넌트의 통신 방법 중 하위 컴포넌트에서 상위 컴포넌트로 통신하는 방식이다.
```html
<!--html-->
<div id="app">
    <!-- 컴포넌트 표시 -->
    <!-- <app-contents v-on:이벤트 이름="상위 컴포넌트의 메서드 이름"></app-contents> -->
    <app-contents v-on:refresh="showAlert"></app-contents>
</div>

<!--javascript-->

<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<script>
    const appContents = {
        template: `
            <p>
                <button v-on:click="sendEvent">갱신</button>
            </p>
        `,
        methods: {
            sendEvent(){
                this.$emit('refresh');
            }
        },
    }
    // Root 컴포넌트
    Vue.createApp({
        methods:{
            showAlert(){
                alert('새로고침')
            }
        },
        // 인스턴스 옵션 속성 - 옵션 API
        components:{
            // '컴포넌트 이름' : 컴포넌트 내용
            'app-contents' : appContents
        }
    }).mount('#app')
</script>
```
- 위와 같이 셋팅을 한 후에 개발자 도구에서 아래의 상태를 클릭하게 된다면, 현재 Emit 한 상태를 보여주게 됩니다.
![Pasted-image-20231220172636.png](/img/이미지 창고/Pasted-image-20231220172636.png)
- 위 사진과 같게 살펴 볼 수 있습니다.

### 동일 레벨 컴포넌트 데이터 전달
```html
<!-- html -->
<div id="app">
	<!--<app-header v-bind:appTitle="message"></app-header>-->
	<!-- HTML에서는 카멜케이스를 구분 하지 못하므로 하이픈을 넣은 것일뿐 .vue 파일은 구분 가능하니 이부분은 참고만 하면 된다.-->
    <app-header v-bind:app-title="message"></app-header>
    <app-contents v-on:login="receive"></app-contents>
</div>
  
<!-- javascript -->

<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<script>
    const appHeader = {
        props: [ 'appTitle' ],
        template: '<h1>{{ appTitle }}</h1>'
    }
  
    const appContents = {
        template: `
            <p>
                <button v-on:click="sendEvent">로그인</button>
            </p>
        `,
        methods: {
            sendEvent(){
                this.$emit('login');
            }
        },
    }
    // Root 컴포넌트
    Vue.createApp({
        data(){
            return {
                message: ''
            }
        },
        methods:{
            receive(){
                console.log('받았다.')
                this.message = '로그인됨'
            }
        },
        components: {
            // '컴포넌트 이름': 컴포넌트 내용
            'app-header' : appHeader,
            'app-contents' : appContents
        }
    }).mount('#app');
</script>
```
- 아래는 카멜 케이스를 구분 하지 못하였을 때 나오는 현상
![Pasted-image-20231221091325.png](/img/이미지 창고/Pasted-image-20231221091325.png)
- 정상적으로 고치게 된다면 아래의 모습이 나오게 됩니다.
![Pasted-image-20231221091533.png](/img/이미지 창고/Pasted-image-20231221091533.png)


## Vue Template 문법
### v-if & v-show
```html
<!-- HTML -->
<div id="app">
    <!-- v-if -->
    <p v-if="login">로그인 되었습니다.</p>
    <p v-else>로그인 하세요</p>
    <button v-on:click="loginUser">로그인</button>
  
    <hr>

    <!-- v-show -->
    <p v-show="login">로그인 되었습니다.</p>
    <button v-on:click="loginUser">로그인</button>
</div>

<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<script>
    Vue.createApp({
        data(){
            return{
                login: false
            }
        },
        methods: {
            loginUser(){
                this.login = !this.login;
            }
        },
    }).mount('#app');
</script>
```
#### v-if & v-show 차이점
- `v-show`를 사용하면, 해당 속성을 가릴 때 CSS 적으로 `display:none` 처리를 해버립니다.
- 그렇기 때문에, `v-if` 와는 다르게 `v-show`작동 됩니다.

### class & id 바인딩
```html
<style>
    .primary{
        color: coral;
    }
</style>
  
<div id="app">
<!-- HTML -->
    <h1>클래스 바인딩</h1>
    <div v-bind:class="textClass">데이터 바인딩 예제</div>
  
    <!-- id 바인딩 -->
    <h1>아이디 바인딩</h1>
    <section v-bind:id="sectionId" :style="sectionStyle">
        반갑습니다.
    </section>
</div>

<!-- Javacript -->
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<script>
    Vue.createApp({
        data() {
            return {
                textClass: 'primary',
                sectionId: 'tab1',
                sectionStyle: { color: 'red' }
            }
        },
    }).mount('#app');
</script>
```

![Pasted-image-20231221102931.png](/img/이미지 창고/Pasted-image-20231221102931.png)
- 위와 같이 화면이 나오게 됩니다.

## Vue CLI
- Vue3는 Vite로 프로젝트를 구성하는 것이 맞습니다.
- 그렇기 때문에, 우선은 WebPack 프로젝트 우선적으로 시작 후에, 추후에 Vite로 시작을 하겠습니다.

```shell
npm install -g @vue/cli

vue create vue3-cli
```

### Project 폴더 내용

### 페이지 로딩 과정
![Pasted-image-20231221161842.png](/img/이미지 창고/Pasted-image-20231221161842.png)
Vue 프로젝트를 시작 하였을 때, 위의 `script` 태그를 작성합니다.
그렇게 되면, `Network` 창을 눌러보게 된다면, 아래의 사진에 Network 에서 보이게 됩니다.
![Pasted-image-20231221162418.png](/img/이미지 창고/Pasted-image-20231221162418.png)

## Vue Single File Component
:::tip Single File Componet?
- HTML, CSS, JS 코드를 한 파일에서 관리하는 방법 입니다.
- Vue CLI로 프로젝트를 생성하고 나면, App.vue 라는 파일을 확인 할 수 있습니다.
- 이처럼 vue 확장자를 가진 파일을 모두 싱글 파일 컴포넌트라고 합니다.

:::

```js
<!-- .vue 파일 구조 -->
<template>
	<!-- HTM: (뷰 컴포넌트의 표현단, 템플릿 문법) -->
</template>

<script>
	<!-- HTM: (뷰 컴포넌트의 표현단, 템플릿 문법) -->
</script>

<style>
	<!-- HTM: (뷰 컴포넌트의 표현단, 템플릿 문법) -->
</style>
```

### 실습
```vue
<template>
  <form action="" @submit.prevent="submitForm">
    <div>
      <label for="userId">ID : </label>
      <input type="text" id="userId" v-model="username">
    </div>
    <div>
      <label for="password">PW : </label>
      <input type="text" id="password" v-model="password">
    </div>
    <button type="submit">로그인</button>
  </form>
</template>

<script>
import axios from 'axios'

export default {
  data(){
    return{
      username: '',
      password: ''
    }
  },
  methods:{
    submitForm(){
      // event.preventDefault(); // evnet를 작동시켜도 input이 사라지지 않는 속성이다.
      axios.post('https://jsonplaceholder.typicode.com/users/',{
        username: this.username,
        password: this.password
      })
      .then(response =>{
        console.log(response)
      })
      console.log('눌림')
    }
  }
}
</script>

<style>
</style>
```
`App.vue`

[Json PlaceHoder](https://jsonplaceholder.typicode.com/)




---

#NodeJS #FrontEnd #Vue #JavaScript #Vue3

---