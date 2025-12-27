---
slug: "Vue의-기본-문법"
---
```bash
npx degit ParkYoungWoong/vue3-webpack-template#eslint vue3-test
```

# 기본 Vue의 구조
- Vue의 파일을 가본다면 아래의 코드로 개발을 진행할 수 있다.

```vue
// 아래의 코드는 html 코드를 작성하는 란이다.
<template>
  <h1 @click="increse()">
    {{ count }}
  </h1>
</template>

// 아래 란은 JS의 문법 등, Vue에서 제공하는 Js 문법을 작성하는 란이다.
<script>
export default{
  data(){
    return{
      count: 0
    }
  },
  methods: {
    increse(){
      this.count += 1
    }    
  },
}
</script>
// CSS를 작성하는 란이지만, 필수란은 아니다.
<style>
</style>

```

# 조건문과 반복
```vue
<template>
  <h1 @click="increse()">
    {{ count }}
  </h1>
  <!-- Vue에서 조건문에 해당한다 -->
  <div v-if="count>4">
    4보다 큽니다!
  </div>
  <ul>
  <!-- vue에서 반복문에 해당한다.-->
    <hello
      v-for="fruit in fruits"
      :key="fruit"
      :name="furit">
      {{ fruit }}
    </hello>
  </ul>
</template>


<script>

import Fruit from '~/components/Fruit'
export default{
  components:{
    hello: Fruit
  },
  data(){
    return{
      count: 0,
      fruits: ['Apple', 'Banana', 'Cherry']
    }
  },
  methods: {
    increse(){
      this.count += 1
    }    
  },
}
</script>
<style>
</style>
```

# Vue Lifecycle
![Pasted-image-20230522152231.png](/img/이미지 창고/Pasted-image-20230522152231.png)
```bash
npx degit ParkYoungWoong/vue3-webpack-template#eslint vue3-lifecycle
```

## 실습 코드
```vue
<template>
  <h1>{{ count }}</h1>
</template>

<script> 
export default {
  data() {
    return {
      count: 2
    }
  },
  beforeCreate(){
    console.log('Before Create!', this.count)
    // 변수가 정의되기 전이기 때문에 해당 console.log에는 undefined가 나오게 된다.
  },
  create(){
    console.log('Created!', this.count)
    // 변수가 정의된 후이기에, 해당 console.log에는 제대로된 값이 나오게 된다.
  },
  beforeMount(){
    console.log('Before Mounted!')
    console.log(document.querySelector('h1'))
    // html이 렌더링 되기 전이기 때문에, 해당 console.log는 찍히지 않는다.
  },
  mounted(){
    console.log('Mounted!')
    console.log(document.querySelector('h1'))
    // html이 렌더링 되고 난 후이기 때문에, 해당 console.log에는 count값이 정상적으로 찍힌다.
  }
}
</script>
```
`App.vue`


# 템플릿 문법

## 보간법(Interpolation)

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

### 실습 코드
```vue
<template>
  <h1 @click="add">
    {{ msg }}
  </h1>

  <h1
  v-once
  @click="add">
    {{ msg }}
  </h1>
</template>

<script>
export default {
  data(){
    return{
      msg: 'Hello world'
    }
  },
  methods:{
    add(){
      this.msg += '!'
    }
  }
}
</script>
```

## 원시 HTML

:::tip v-html
- 이중 중괄호는 데이터를 HTML이 아닌 텍스트로 해석 합니다.
- 실제 HTML을 출력하려면 `v-html` 디렉티브를 사용해야 합니다.

:::

```vue
<template>
  <h1 @click="add">
    {{ msg }}
  </h1>

  <h1 v-html="msg"></h1>
</template>

<script>
export default {
  data(){
    return{
      msg: '<div sytle="color:red;">Hello world</div>'
    }
  },
  methods:{
    add(){
      this.msg += '!'
    }
  }
}
</script>
```

## 속성
:::tip v-bind
- 이중 중괄호 구문은 HTML 속성에 사용할 수 없습니다
- 대신 `v-bind` 디렉티브를 사용하면 된다.
- `v-bind`는 귀찮아서 대부분 `:`를 사용한다.

:::

### 약어
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


# Computed

:::note computed?
- 계산된 data 라고 생각하면 된다. 즉, 계산된 변수이기에 무조건 return 값이 존재한다.

:::

```vue
<template>
	<section v-if="hasFruit">
		<h1>Fruits</h1>
		<ul>
			<li
			v-for="fruit in fruits"
			:key="fruit">
				{{ fruit }}
			</li>
		</ul>  
	</section>

	<section v-if="hasFruit">
	   <h1>Reverse Fruits</h1>
	   <ul>
		   <li
		   v-for="fruit in reverseFruits"
		   :key="fruit">
			   {{ fruit }}
		   </li>
		</ul>  
	</section>
</template>

<script>
export default {
	data(){
		return{
			fruits:['Apple', 'Banana', 'Cherry']
				}
	},
	// 계산된 data, 즉, 계산된 변수
	computed:{
		hasFruit(){
			return this.fruits.length > 0
		},
		reverseFruits(){
			return this.fruits.map(fruit =>{
				// 'Apple' -> ['A','p','p','l','e'] => ['e','l','p','p','A']
				return fruit.split('').reverse().join()
			})
		}
	}
}
</script>
```
`Fruites.vue`

```vue
<template>
    <h1>{{ reverseMessage }}</h1>
    <h1>{{ reverseMessage }}</h1>
    <h1>{{ reverseMessage }}</h1>
    <h1>{{ reverseMessage }}</h1>
</template>
 
<script>
import Fruits from '~/components/Fruits'
export default {
    components: {
        Fruits
    },
    data() {
        return {
            msg: 'Hello Computed!'
        }
    },
    methods: {
        reverseMessage(){
            return this.msg.split('').reverse().join('')
        }
    }
}
</script>
```
- 위와 같이 Method를 4번 호출하게 된다면, 같은 로직이 4번 실행 되게 된다.
- 해당 호출이 많아질 수록 부하가 많아질 수밖에 없다.
- 하지만 아래처럼 `computed`를 추가한 후에 아래와 같이 코드를 변경한다면,
```vue
<template>
    <h1>{{ reversedMessage }}</h1>
    <h1>{{ reversedMessage }}</h1>
    <h1>{{ reversedMessage }}</h1>
    <h1>{{ reversedMessage }}</h1>
</template>

<script>
  
import Fruits from '~/components/Fruits'
export default {
    components: {
        Fruits
    },
    data() {
        return {
            msg: 'Hello Computed!'
        }
    },
    computed:{
        reversedMessage(){
            return this.msg.split('').reverse().join('')
        }
    },
    methods: {
        reverseMessage(){
            return this.msg.split('').reverse().join('')
        }
    }
}
</script>
```
`App.vue`

- `computed`자체에 **캐싱** 기능이 있기 때문에, 의미 없는 호출과 반복을 줄 일 수 있어서 최적화가 가능해진다.
:::tip compute의 방식
- compute는 **읽기 전용**이므로 해당 변수로 어떤 작업을 진행 할 수는 없다.

:::

```js
...
compute:{
	reversedMessage(){
		return this.msg.split('').reverse().join('')
	}
},
methods: {
	add(){
		this.reversedMessage += '!?'
		// 해당 로직은 정상적으로 먹지 않는다.
	}
}
```

## Getter, Setter




---

#NodeJS #Vue #FrontEnd  #Vue2 #Vue3

---