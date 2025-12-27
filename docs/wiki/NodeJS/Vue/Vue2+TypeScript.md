- [Vue2 + TypeScript](#Vue2 + TypeScript)
- [TypeScript 에서 Class 문법을 권장하지 않는 이유](#TypeScript 에서 Class 문법을 권장하지 않는 이유)
	- [Vue.js 에서 TypeScript 적용하는 방법](#TypeScript 에서 Class 문법을 권장하지 않는 이유#Vue.js 에서 TypeScript 적용하는 방법)
	- [프로젝트 구성](#TypeScript 에서 Class 문법을 권장하지 않는 이유#프로젝트 구성)
	- [실습 프로젝트 내용](#TypeScript 에서 Class 문법을 권장하지 않는 이유#실습 프로젝트 내용)
		- [LocalStorage Input](#실습 프로젝트 내용#LocalStorage Input)
		- [결과](#실습 프로젝트 내용#결과)
		- [v-model을 풀어서 사용하는 이유?](#실습 프로젝트 내용#v-model을 풀어서 사용하는 이유?)
		- [Props의 Validation](#실습 프로젝트 내용#Props의 Validation)
		- [할일 앱 조회](#실습 프로젝트 내용#할일 앱 조회)
	- [이미 구현된 서비스에 TS 점진적으로 적용하는 방법](#TypeScript 에서 Class 문법을 권장하지 않는 이유#이미 구현된 서비스에 TS 점진적으로 적용하는 방법)


# Vue2 + TypeScript
![Pasted-image-20231222163839.png](/img/이미지 창고/Pasted-image-20231222163839.png)

# TypeScript 에서 Class 문법을 권장하지 않는 이유
기존에는 Vue가 Anlgure 처럼 Class 문법을 지향하며, 가길 원했지만 이를 결국은 폐기 시켰습니다.
[클래스 문법에 대한 개발자의 생각](https://github.com/vuejs/rfcs/pull/42)

## Vue.js 에서 TypeScript 적용하는 방법
 1. 서비스를 처음 구축할 때 부터 TypeScript를 적용한다.
 2. 기존에 이미 구현된 서비스에 TypeScript를 점진적으로 적용한다.

## 프로젝트 구성
![Pasted-image-20231226093104.png](/img/이미지 창고/Pasted-image-20231226093104.png)

`shims-vue.d.ts`
```ts
// Vue 파일 안에 들어가잇는 것들은 모두 Vue로 해석해
declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}
```
- TypeScript가 프로젝트를 보고 해석 할 때, TS Language Server가 돌고 있으며, TypeScript의 타입 추론을 해석하기 위해서 내부적으로 돌 수 밖에 없다.

## 실습 프로젝트 내용
:::note 할일 관리 앱
- 할 일 CRUD

:::

:::tip 단축키
- `App.vue` 파일에 `ts` 를 입력해준 후에, `vbase-ts`를 선택 해줍니다. 
- ![Pasted-image-20231226094832.png](/img/이미지 창고/Pasted-image-20231226094832.png)
- 위의 Extension을 설치 해야만 사용 가능합니다.

:::

:::warning TS ESLint Error
- Vue 프로젝트를 진행할 때 아래의 에러가 발생되면, 
![Pasted-image-20231226100523.png](/img/이미지 창고/Pasted-image-20231226100523.png)
- VSCode 하단에 있는 `CLRF`를 클릭 후 아래의 사진처럼 바꾼다면 에러는 없어집니다.
![Pasted-image-20231226100538.png](/img/이미지 창고/Pasted-image-20231226100538.png)
![Pasted-image-20231226100500.png](/img/이미지 창고/Pasted-image-20231226100500.png)


:::

기존에 JS에서 보지 못했던 오류 입니다.
![Pasted-image-20231226101844.png](/img/이미지 창고/Pasted-image-20231226101844.png)
- 아래의 오류는 TypeScript에서 Type을 지정하지 않았다고 하여 생기는 오류 이고, `event`에 대한 값은 자동으로 Any로 지정 되지만, 오류를 내뱉고 있습니다.
- 해당 오류를  없애기 위해서는(어쩌피 자동으로 지정되는데 귀찮게..) 어쩔 수 없지만, `event:any`를 수행해줘야 합니다.

### LocalStorage Input
```vue
<template>
  <div>
    <h1>Vue Todo with Typescript</h1>
    <todo-input :item="todoText" @input="updateTodoText" @add="addTodoItem" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TodoInput from "./components/TodoInput.vue";

export default Vue.extend({
  components: { TodoInput },
  data() {
    return {
      todoText: "hello world",
    };
  },
  methods: {
    updateTodoText(value: any) {
      this.todoText = value;
    },
    addTodoItem() {
      const value = this.todoText;
      localStorage.setItem(value, value);
      this.initTodoText();
    },
    initTodoText() {
      this.todoText = "";
    },
  },
});

</script>

  

<style scoped></style>
```
`App.vue`


```vue
<template>
  <div>
    <label for="todo-input"></label>
    <input type="text" id="todo-input" :value="item" @input="handleInput" />
    <button @click="addTodo">add</button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: ["item"],
  methods: {
    handleInput(e: any) {
      e.target.value;
      this.$emit("input", e.target.value);
    },
    addTodo() {
      this.$emit("add");
    },
  },
});
</script>

<style scoped></style>
```
`TodoInput.vue`

### 결과
![Pasted-image-20231226103713.png](/img/이미지 창고/Pasted-image-20231226103713.png)
![Pasted-image-20231226103722.png](/img/이미지 창고/Pasted-image-20231226103722.png)

:::note 사실 해당 모델은 `v-model`을 사용하면 금방 해결 되는 문제이다.

:::

### v-model을 풀어서 사용하는 이유?
- 빠르게 기능을 구현하고 프로토타이핑 해나갈 대는, `v-model`을 사용해도 상관이 없습니다.
- 다만 현재 시점에서는 IME(한국어, 일본어, 중국어) 에 대해서 한계점이 존재합니다.
- 문제점
	- 한글 입력의 경우 한 글자에 대한 입력이 끝나야지만 `inputText` 데이터가 input box 의 텍스트 값과 동기화 됩니다.


### Props의 Validation
- Props 자체적으로 Validation을 해야지 에러가 덜 발생하게 된다.
```ts
...
props: {
    item: {
      type: String,
      required: true,
    },
  },
 ...
```
- 위와 같이 `props`의 `type` 을 지정할 수 있고, 필수 요소라는 것도 지정 가능합니다.

![Pasted-image-20231226104539.png](/img/이미지 창고/Pasted-image-20231226104539.png)
- 위처럼 `event` 에 대한 type은 `InputEvent` 라는 type이 존재하기에, 해당 Event를 지정할 수 있습니다.
- 하지만, 아래에 `e.target.value`에서 에러가 나는 것을 자세히 보면
	- `target`이라는 값이 만약 <mark>null</mark> 이라면 에러가 발생할 것이다.
- 라는 내용이 됩니다.
- 즉, 앞에서 `target`에 대한 nullable을 확인 해야합니다.
```ts
// 아래의 방식을 사용해도 여전히 에러가 발생합니다.
if(!event.target){
	return ;
}
this.$emit("input", e.target.value);

// 아래의 방식을 사용하면 에러가 발생 되지 않습니다.
const eventTarget = e.target as HTMLInputElement;
this.$emit("input", eventTarget.value);
```
- 위 내용은 그다지 safe한 방법은 아닙니다.
![Pasted-image-20231226105153.png](/img/이미지 창고/Pasted-image-20231226105153.png)
- 위 사진 처럼, `input`을 받는 `value`는 String으로 변경 해주시면 됩니다.

### 할일 앱 조회
```vue
<script>
const STORAGE_KEY = "vue-todo-ts-v1";
const storage = {
  fetch() {
    const todoItems = localStorage.getItem(STORAGE_KEY) || "[]"; // <---
    const result = JSON.parse(todoItems);
  },

};
</script>
```
- JSON parse 자체적으로 String값을 변환하기에, 해당 부분을 굳이 배열 두게 된다면, parse가 해석 할 수 없기 때문에, 위와 같이 둔다.
```vue
<script>
const storage = {

  save(todoItems: any[]) {
    localStorage.setItem(STORAGE_KEY, todoItems);
  },
  fetch() {
    const todoItems = localStorage.getItem(STORAGE_KEY) || "[]";
    const result = JSON.parse(todoItems);
  },
};
</script>
```

![Pasted-image-20231227094342.png](/img/이미지 창고/Pasted-image-20231227094342.png)
- 해당 부분에서 에러가 난 이유는, 아래와 같습니다.
- `todoItems`는 `string` 속성을 지니고 있기 때문에, 해당 속성과 맞지 않는다는 이유로 에러를 뱉고 있습니다.
- 이는 `const parsed = JSON.stringify(todoItems);` 로 해결 해서 json을 string으로 풀어서 줘야합니다.

- computed를 통해서 class에  대한 컨트롤이 가능합니다.
	- `computed`는 무조건 반환 타입을 지정해줘야 합니다

```vue
<template>
  <div>
    <header>
      <h1>Vue Todo with Typescript</h1>
    </header>
    <main>
      <div>
        <todo-input
          :item="todoText"
          @input="updateTodoText"
          @add="addTodoItem"
        />
      </div>
      <ul>
        <TodoListItem
          v-for="(todoItem, index) in todoItems"
          :key="index"
          :todoItem="todoItem"
          :index="index"
          @remove="removeTodoItem"
          @toggle="toggleTodoItemComplete"
        ></TodoListItem>
  
        <!-- <li>아이템 1</li>
        <li>아이템 2</li>
        <li>아이템 3</li> -->
      </ul>
    </main>
  </div>
</template>
  
<script lang="ts">
import Vue from "vue";
import TodoInput from "./components/TodoInput.vue";
import TodoListItem from "./components/TodoListItem.vue";
  
const STORAGE_KEY = "vue-todo-ts-v1";
const storage = {
  save(todoItems: Todo[]) {
    const parsed  JSON.stringify(todoItems);
    localStorage.setItem(STORAGE_KEY, parsed);
  },
  fetch(): Todo[] {
    const todoItems = localStorage.getItem(STORAGE_KEY) || "[]";
    const result = JSON.parse(todoItems);
    return result;
  },
};
  
export interface Todo {
  title: string;
  done: boolean;
}
  
export default Vue.extend({
  components: { TodoInput, TodoListItem },
  data() {
    return {
      todoText: "hello world",
      todoItems: [] as Todo[],
    };
  },
  methods: {
    updateTodoText(value: any) {
      this.todoText = value;
    },
    addTodoItem() {
      const value = this.todoText;
      const todo: Todo = {
        title: value,
        done: false,
      };
  
      this.todoItems.push(todo);
      storage.save(this.todoItems);
      // localStorage.setItem(value, value);
      this.initTodoText();
    },
    initTodoText() {
      this.todoText = "";
    },
    fetchTodoItems() {
      this.todoItems = storage.fetch().sort((a: Todo, b: Todo) => {
        if (a.title < b.title) {
          return -1;
        }
        if (a.title > b.title) {
          return 1;
        }
        return 0;
      });
    },
    removeTodoItem(index: number) {
      console.log("remove", index);
      this.todoItems.splice(index, 1);
      storage.save(this.todoItems);
    },
    toggleTodoItemComplete(todoItem: Todo, index: number) {
      this.todoItems.splice(index, 1, {
        ...todoItem,
        done: !todoItem.done,
      });
      storage.save(this.todoItems);
    },
  },
});
</script>
  
<style scoped></style>
```
`App.vue`

## 이미 구현된 서비스에 TS 점진적으로 적용하는 방법
```shell
# vue3 버전을 설치했다면, 아래의 명령어로 TS를 설치 할 수 있습니다.
vue add typescript
```
- 해당 명령어는 별로 추천되지 않습니다.
- 기본적으로 `App.vue`, `main.js` 부분에서 많은 변경이 일어나며, 해당 부분이 크리티컬 한 데미지를 줍니다.
- `package.json` 에서 예전에 사용했던 버전들의 충돌성도 확답하기 어렵습니다.

---

#NodeJS #Vue #Vue2 #FrontEnd #JavaScript 

---