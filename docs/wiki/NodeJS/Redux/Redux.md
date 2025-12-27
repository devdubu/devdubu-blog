# Redux
:::note Redux?
- Redux is a predicatable state container for javaScript apps
- 자바스크립트 애플리케이션을 위한 상태 관리 라이브러리 이다.

:::

## 상태 관리

### Props
- properties의 줄임말
- Props는 상위 구성 요소가 서로 통신하는 방법이다.
- 해당 값을 변경하려면 자식 관점에서 Props를 변경할 수 없다.
	- 부모는 내부 상태를 변경해야 한다.
```jsx
<ChatMessages
	messages={messages}
	currendMember={member}
/>
```

### State
- parent component에서 child component를 data를 보내는게 아닌
- 그 component 안에서 데이터를 전달하려면?
	- State로 예를 들면 검색창에 글을 입력할 때 글이 변하는 것은 state로 바꿈
- State is mutable
- State가 변하면 re-render된다.
```jsx
state = {
	message: '',
	attachFile: undefined,
	openMenu: false,
};
```

:::note Redux는 State를 관리하는 곳

:::

![Screenshot-2023-07-09-at-11.17.33-AM.png](/img/이미지 창고/Screenshot-2023-07-09-at-11.17.33-AM.png)

### Redux 데이터 Flow
![Screenshot-2023-07-09-at-11.20.15-AM.png](/img/이미지 창고/Screenshot-2023-07-09-at-11.20.15-AM.png)
- 위의 방식으로 <mark>단 방향</mark>으로 흘러들어간다.

#### Action
:::quote Action
- Action은 간단한 JavaScript 객체입니다.
- 여기에는 우리가 수행하는 작업의 유형을 지정하는 type 속성이 있으며, 
- 선택적으로 redux 저장소에 일부 데이터를 보내는데 사용되는 <mark>payload</mark> 속성을 가질 수 있다.

:::

```json
{ type: 'LIKE_ARTICLE', articleId: 42}
{ type: 'FETCH_USER_SUCCESS', response: { id: 3, name: 'Mary'} }
{ type: 'ADD_TODO', text: 'Read the Redux docs.' }
```

#### Reducer
:::example REDUCER
- Reducer는 애플리케이션 상태의 변경 사항을 결정하고 업데이트 된 상태를 반환하는 함수이다.
- 그들은 인수로 조치를 취하고 store 내부의 상태를 업데이트 한다.

:::

`(previousState, action) => nextState`
- 이전 `State`과 `action object`를 받은 후에 next state를 return 한다.

:::warning Reducer는 pure function이기에 reducer내부에서 할지 말아야 할 것들
- Mutate its arguments
- Perform side effects like eAPI calls and routing transitions
- Call non-pure functions, e.g. `Data.now()` or `Math.random()`


:::

#### Redux Store
:::tip Redux Store
- 이들을 하나로 모으는 객체 저장소는 애플리케이션의 전체 상태 트리를 보유합니다.
- 내부 상태를 변경하는 유일한 방법은 해당 상태에 대한 Action을 전달하는 것입니다.
- Redux Store는 클래스가 아니다, 몇 가지 Methods가 있는 객체일 뿐이다.

:::

# Middleware 없이 Redux 카운터 앱 만들기

## Install React App
```bash
npx create-react-app my-app --template typescript
```

## Install Redux Library
```bash
npm install redux --save
```

### Counter UI 및 함수 생성
```tsx
type Props = {
	value : number;
	onIncrement: () => void;
	onDecrement: () => void;
}

function App({value, onIncrement, onDecrement } : Props){
	return (
		<p>
			Clicked: {value} times
			{' '}
			<button onClick={onIncrement}>
				+
			</button>
			{' '}
			<button onClick={onDecrement}>
				-
			</button>
		</p>
	);
}

export default App;
```
`App.tsx`

### Reducer 생성
![Screenshot-2023-07-09-at-11.38.20-AM.png](/img/이미지 창고/Screenshot-2023-07-09-at-11.38.20-AM.png)
```tsx
const counter = ( state = 0, actions {type : string}) =>{
	switch(action.type){
		case 'INCREMENT':
			return state + 1
		case 'DECREMENT':
			return state - 1
		default:
			return state
	}
}

export default counter;
```
`./src/reducers/index.tsx`

### Create Store
- 앱의 전체 상태 트리를 보유하는 Redux 저장소를 만듭니다.
- 앱에는 하나의 스토어만 있어야합니다.
```tsx
import counter from './reducers';
import { createStore } from 'redux';

const store = createStore(counter)

ReactDOM.render(
	<React.StricMode>
		<App
			value={store.getState()}
			onIncrement = { () => store.dispatch({ type : 'INCREMENT' })}
			onDecrement = { () => store.dispatch({ type : 'DECREMENT' })}
		/>
	<React.StrictMode>,
	document.getElementById('root')
);
```
`./src/index.tsx`

### getState()
[getstate](https:/redux.js.org/api/store#getstate)

- 애플리케이션의 현재 상태 트리를 반환합니다.
- 스토어의 리듀서가 반환한 마지막 값과 같습니다.
```tsx
const render = () => ReactDOM.render(
	<React.StrictMode
		value={store.getState()}
		onIncrement = { () => store.dispatch({ type : 'INCREMENT' })}
		onDecrement = { () => store.dispatch({ type : 'DECREMENT' })}
	/>
	document.getElementById('root')
);

render()
store.subscibe(render)
```

### subscribe()
[subscribe](https://redux.js.org/api/store#subscribelistener)

- changelistener를 추가합니다.
- 작업이 전달될 때마다 호출되며, 상태 트리의 일부가 잠재적으로 변경되었을 수 있습니다.
- 그런 다음 `getState()`를 호출하여 콜백 내부의 현재 상태 트리를 읽을 수 있습니다.

# combineReducers
:::note root reducer와 sub reducer
- 현재까지 counter 리듀서만 있는데 하나를 더 추가해주려면, 
- Root reducer를 만들어서 그 아래 counter와 todos라는 서브(sub)리듀서를 넣어주면 됩니다.
- Root 리듀서 를 만들 때 사용하는 것이 `combineReducers` 입니다.

:::

![Screenshot-2023-07-09-at-4.08.09-PM.png](/img/이미지 창고/Screenshot-2023-07-09-at-4.08.09-PM.png)

```tsx
import { combineReducers } from 'redux'
import todos from './todos'
import counter from './counter'

const rootReducer = combineReducers({
	todo,
	counter
})

export default rootReducer;
```
`reducers/index.tsx`

```tsx
const counter = (state = 0, action: { type: string }) => {
	switch(action.type){
		case "INCREMENT":
			return state + 1;
		case "DECREMENT":
			return state - 1;
		default:
			return state;
	}
}

export default counter;
```
`reducers/counter.tsx`

```tsx
enum ActionType{
	ADD_TODO = "ADD_TODO",
	DELETE_TODO = "DELETE_TODO"
}

interface Action{
	type: ActionType;
	text: string;
}

const todos = (state = [], action: Action) =>{
	switch (action.type){
		case 'ADD_TODO':
			return [...action, action.text]
		default:
			return state
	}
}

export default todos;
```
`reducers/todo.tsx`

#### createStore에 Root Reducer로 대체
```tsx
import counter from './reducers';
import { createStore } from 'redux';

const store = createStore(counter)
```

```tsx
import rootReducer from './reducers';
import { createStore } from 'redux';

const store = createStore(rootReducer)

store.dispatch({
	type: 'ADD_TODO',
	text: 'Use Redux'
})

console.log('store.getState()', store.getState());
```
`App.tsx`
![Screenshot-2023-07-09-at-4.22.14-PM.png](/img/이미지 창고/Screenshot-2023-07-09-at-4.22.14-PM.png)

# Redux Provider
:::note Provider?
- 구성 요소는 <mark>Redux Store 저장소</mark>에 <mark>액세스</mark> 해야 하는 <mark>모든 중첩 구성 요소</mark>에서 Redux Store 저장소를 사용할 수 있도록 합니다.
- React Redux앱의 <mark>모든 React 구성요소</mark>는 <mark>저장소에 연결</mark>할 수 있으므로,
- 대부분의 응용 프로그램은 전체 앱의 구성 요소 트리가 내부에 있는 최상위 수준에서 `<Provider>`를 렌더링 합니다.
- 그런 다음 <mark>Hooks 및 연결 API</mark>는 <mark>React의 컨텍스트 매커니즘</mark>을 통해 제공된 <mark>저장소 인스턴스에 엑세스 가능</mark>합니다.

:::

### 예시
```tsx
const store = createStore(rootReducer)

store.dispatch({
	type: 'ADD_TODO',
	text: 'Use Redux'
})

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<App
				onIncerment={() => store.dispatch({ type: 'INCREMENT' })}
				onDecrement={() => store.dispatch({ type: 'DECREMENT' })}
			/>
		</Provider>
	</React.StrictMode>
	document.getElementById('root')
);
```
`index.tsx`

```tsx
type Props = {
	value : number;
	onIncrement: () => void;
	onDecrement: () => void;
}

function App({value, onIncrement, onDecrement } : Props){
	const [todoValue, setTodoValue] = useState("");
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTodoValue(e.target.value);
	}
	const addTodo = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setTodoValue("");
	}
	
	return (
		<div className="App">
		{ /* Clicked: {value} times */}
			
			<button onClick={onIncrement}>
				+
			</button>
			{' '}
			<button onClick={onDecrement}>
				-
			</button>
			<form onSubmit={addTodo}>
				<input type="text" value={todoValue} onChange={handleChange}/>
				<input type="submit" />
			</form>
		</div>
	);
}

export default App;
```

# useSelector & useDispatch

:::tip provider로 둘러 쌓인 컴포넌트에서 store 접근
- React에 Hooks가 있듯이 Redux에도 Hooks가 있는데 그게 바로 useSelector와 useDispatch입니다.
- 이 두 개를 이용해서 provider로 둘러싸인 컴포넌트에서 store에 접근이 가능합니다.

:::

## useSelector
- useSelector Hooks를 이용해서 store에 값을 가져올 수 있습니다.
```tsx
const counter = useSelector((state) => state.counter)
```
`Property 'counter' dose not exist on type 'DefaultRootState' ts(2339)`
	-> 해당하는 것처럼 TypeError가 나온다. 이를 해결하기 위해서는 아래의 방법을 적용하면 된다.

### 에러 해결 방법
#### 1. Root Reducer에 RootState 타입을 생성하기
```tsx
const rootRedeucer = combineReducers({
	todos,
	counter
})

export defualt rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
```
`reducers/index.tsx`

#### 2. 생성한 RootState을 State 객체에 제공하기
```tsx
const todos: string[] = useSelector ((state: RootState) => state.todos)
const counter = useSelector((state: RootState) => state.counter)
```






## useDispatch
- store에 있는 dispatch 함수에 접근하는 hooks 입니다.
```tsx
const addTodo = (e: React.FormEvent<HTMLFormElement>):void => {
	e.preventDefault();
	// store.dispatch({ type: 'ADD_TODO', text: todoValue });
	dispatch({ type: 'ADD_TODO', text: todoValue })
	setTodoValue("");
}


...
<ul>
	{todos.map((todo, index) => <li key={index}>}{todo}</li>)}
</ul>

<form onSubmit={addTodo}>
	<input type="text" value={todoValue} onChange={handleChange} />
	<input type="submit" />
</form>
...


```
`App.tsx`

![Screenshot-2023-07-16-at-8.12.13-PM.png](/img/이미지 창고/Screenshot-2023-07-16-at-8.12.13-PM.png)

# Redux Middleware

:::note Redux Middleware?
- Redux 미들웨는 액션을 dispatch 전달하고 Reducer에 도달하는 순간 사이에 사전에 지정된 작업을 실행할 수 있게 해주는 중간자 입니다.
- 로깅, 충돌 보고, 비동기 API와 통신, 라우팅 등을 위해 Redux 미들웨어를 사용합니다.

:::

![Screenshot-2023-07-16-at-8.17.30-PM.png](/img/이미지 창고/Screenshot-2023-07-16-at-8.17.30-PM.png)

## Redux Logging Middleware 생성하기
[참조](https://www.freecodecamp.org/news/what-is-redux-middleware-and-how-to-create-one-from-scratch/)
- 리덕스를 이용할 때 나오는 로그를 찍어주는 미들웨어를 생성

### Loggin Middleware 함수 생성

```tsx
const loggerMiddleware = (store) => (next) => (action) => {
	// your code
}

// 위 함수를 풀어서 표현하면 아래와 같게 됩니다.
// 아래와 위는 같은 함수 입니다.

const loggerMiddleware = function(store){
	return function(next){
		return function(action){
			// your code
		}
	}
}
```

#### 예시
```tsx
const loggerMiddleware = (store : any) => ( next: any ) => ( action: any ) =>{
	console.log("store", store);
	console.log("action", action);
	next(action)
}
```
![Screenshot-2023-07-16-at-8.24.46-PM.png](/img/이미지 창고/Screenshot-2023-07-16-at-8.24.46-PM.png)
- `applyMiddleware`는 하나 혹은 더 많은 미들웨어를 받은 후에 함수를 리턴하는 함수 입니다.


![Screenshot-2023-07-16-at-8.24.59-PM.png](/img/이미지 창고/Screenshot-2023-07-16-at-8.24.59-PM.png)

# Redux Thunk
:::note Redux Thunk?
- 리덕스르 사용하는 앱에서 비동기 작업을 할 때 많이 사용하는 방법이 redux-thunk 입니다.
- 이것도 앞서 만들어본 logger 미들웨어 처럼 리덕스 미들웨어이며, redux를 개발한 DanAbramov가 만들었습니다.

:::

## Thunk 용어는?
- `thunk`라는 단어는 <mark>일부 지연된 작업을 수행하는 코드 조각</mark>을 의미하는 프로그래밍 용어 입니다.
- 지금 일부 로직을 실행하는 대신 나중에 작업을 수행하는 데 사용할 수 있는 함수 본문이나 코드를 작성할 수 있습니다.
```tsx
// calculation of 1 + 2 is immdeiate
// x === 3
let x = 1 + 2

// calculation of 1 + 2 is delayed
// foo can be called later to perform. the calculation
// foo is a thunk!
let foo = () => 1 + 2
```

:::question 비동기 작업을  해야할 때는?
- 서버에서 요청을 보내서 데이털르 가져올 때 주로 비동기 요청을 보냅니다.

:::

![Screenshot-2023-07-16-at-8.33.49-PM.png](/img/이미지 창고/Screenshot-2023-07-16-at-8.33.49-PM.png)
```tsx
enum ActionType {
	FETCH_POSTS = "FETCH_POSTS",
	DELETE_POSTS = "DELETE_POSTS",
}

interface Post{
	userId: number;
	id: number;
	title: string;
}

interface Action{
	type: ActionType;
	payload: Post[];
}

const posts = (state = [], action: Action) => {
	switch(action.type) {
		case 'FETCH_POSTS':
			return [...state, ...action.payload]
		default:
			return state
	}
}

export default posts;
```


---

#NodeJS #FrontEnd #React #Redux

---