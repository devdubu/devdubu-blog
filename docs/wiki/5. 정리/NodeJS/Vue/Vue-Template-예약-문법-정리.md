---
slug: "Vue-Template-예약-문법-정리"
---
# Template 조건문

## `v-if`

`v-if` 디렉티브는 조건부로 블록을 렌더링하는 데 사용됩니다. 
블록은 디렉티브 표현식이 truthy 값을 반환하는 경우에만 렌더링됩니다.

```vue
<h1 v-if="awesome">Vue는 정말 멋지죠!</h1>
```

## `v-else`

`v-else` 디렉티브를 사용하여 `v-if`에 대한 "else 블록"을 나타낼 수 있습니다.

```vue
<button @click="awesome = !awesome">전환</button>

<h1 v-if="awesome">Vue는 정말 멋지죠!</h1>
<h1 v-else>아닌가요? 😢</h1>
```

## `v-else-if`

`v-else-if`는 이름에서 알 수 있듯이 `v-if`에 대한 "else if 블록" 역할을 합니다. 여러 번 연결될 수도 있습니다

```vue
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  A/B/C 아님
</div>
```

`v-else`와 마찬가지로 `v-else-if` 엘리먼트는 `v-if` 또는 `v-else-if` 엘리먼트 바로 다음에 와야 합니다.

## `v-show`

엘리먼트를 조건부로 표시하는 다른 옵션은 `v-show` 디렉티브입니다. 사용법은 대체로 동일합니다:

```vue
<h1 v-show="ok">안녕!</h1>
```

차이점은 `v-show`가 있는 엘리먼트는 항상 렌더링되고 DOM에 남아 있다는 것입니다.
`v-show`는 엘리먼트의 `display` CSS 속성만 전환합니다.

:::warning `v-show`는 `<template>` 엘리먼트를 지원하지 않으며 `v-else`와 상호작용하지 않습니다.


:::

:::note `v-if` vs `v-else`
- 이 둘의 차이점은 명확합니다.
- `v-if`는 `display:none` vs `display:block` 으로 작용하고,
- `v-show`는 굳이 예를 들자면, `opacitiy: 0` vs `opacity:1` 의 차이 입니다.
- 즉, 렌더링이 실제로 되느냐 안되느냐의 차이점이기에, 이 차이점을 알고 사용하시면 됩니다.

:::

# Template 반복문

## `v-for`

`v-for` 디렉티브를 사용하여 배열을 리스트로 렌더링할 수 있습니다. 
`v-for` 디렉티브는 `item in items` 형식의 특별한 문법이 필요합니다. 

여기서 `items`는 배열이고, `item`(이하 아이템)은 배열 내 반복되는 앨리먼트의 **별칭(alias)입니다.

```js
const items = ref([{ message: 'Foo' }, { message: 'Bar' }])
```


```vue
<li v-for="item in items">
  {{ item.message }}
</li>
```

`v-for` 범위 내 템플릿 표현식은 모든 상위 범위 속성에 접근할 수 있습니다. 
또한 `v-for`는 현재 **아이템의 인덱스**를 가리키는 선택적 두 번째 별칭도 지원합니다.

```js
const parentMessage = ref('Parent')
const items = ref([{ message: 'Foo' }, { message: 'Bar' }])
```


```vue
<li v-for="(item, index) in items">
  {{ parentMessage }} - {{ index }} - {{ item.message }}
</li>
```

### 객체에서의 `v-for`

`v-for`를 객체의 속성을 반복하는 데 사용할 수 있습니다. 
순회 순서는 해당 객체를 `Object.keys()`를 호출한 결과에 기반합니다.

```js
const myObject = reactive({
  title: 'Vue에서 목록을 작성하는 방법',
  author: '홍길동',
  publishedAt: '2016-04-10'
})
```

```vue
<ul>
  <li v-for="value in myObject">
    {{ value }}
  </li>
</ul>
```

속성명을 가리키는 두 번째 별칭를 사용할 수도 있습니다

```vue
<li v-for="(value, key) in myObject">
  {{ key }}: {{ value }}
</li>
```

그리고 인덱스를 가리키는 세 번째 별칭를 사용할 수도 있습니다:

```vue
<li v-for="(value, key, index) in myObject">
  {{ index }}. {{ key }}: {{ value }}
</li>
```

### 숫자를 사용한 `v-for`

`v-for`는 정수를 사용할 수도 있습니다. 이 경우 `1...n` 범위를 기준으로 템플릿을 여러 번 반복합니다.

```vue
<span v-for="n in 10">{{ n }}</span>
```

여기서 `n`의 값은 `0`이 아니라 `1`부터 시작합니다.


### `v-if`와 `v-for`

이것들이 같은 노드에 존재할 때 `v-if`가 `v-for`보다 우선순위가 높기 때문에 
`v-if` 조건 문에서 `v-for` 변수에 접근할 수 없습니다.

```vue
<!--
"todo" 속성이 인스턴스에 정의되어 있지 않기 때문에 에러가 발생합니다.
-->
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo.name }}
</li>
```

`<template>` 태그로 감싼 후, `v-for`를 옮겨서 해결할 수 있습니다(더 명시적이기도 함)

```vue
<template v-for="todo in todos">
  <li v-if="!todo.isComplete">
    {{ todo.name }}
  </li>
</template>
```


:::warning v-if와 v-for를 같은 요소에 사용하는 것은 **암묵적인 우선순위 문제** 때문에 권장되지 않습니다.
- 다음과 같은 두 가지 일반적인 경우에서 이를 사용하고 싶을 수 있습니다: 업데이트합니다.
- 리스트에서 항목을 필터링하는 경우(예: `v-for="user in users" v-if="user.isActive"`). 
- 이러한 경우 `users`를 반환하는 새로운 계산된 속성으로 바꿔서 필터링된 리스트를 반환하십시오(예: `activeUsers`).  
- 리스트를 숨기려는 경우(예: `v-for="user in users" v-if="shouldShowUsers"`). 이러한 경우 `v-if`를 컨테이너 엘리먼트(예: `ul`, `ol`)로 이동하십시오.

:::

더 다양한 정보를 원한다면 [Vue 공식 사이트 `v-for`편](https://ko.vuejs.org/guide/essentials/list.html)을 확인하시길 바랍니다.
