---
slug: "5-State-Management-Redux"
title: "상태 관리 (Redux)"
---

# 상태 관리 (Redux)

:::info 개요
**Redux**의 핵심 원리와 **React-Redux** 라이브러리를 통한 연결, **TypeScript** 타입 지정, 그리고 **Middleware(Thunk)**를 활용한 비동기 작업 처리를 상세히 다룹니다.
:::

## 1. Redux 기초

### 1.1 기본 개념
- **Store**: 애플리케이션의 모든 상태를 담고 있는 유일한 저장소입니다.
- **Action**: 상태 변화를 일으키기 위한 신호(객체)입니다. `type` 필드가 필수입니다.
- **Reducer**: 현재 상태와 Action을 받아 새로운 상태를 반환하는 순수 함수입니다.

### 1.2 Provider 설정
`react-redux`의 `<Provider>`로 최상위 컴포넌트를 감싸 Store를 주입합니다.

```tsx
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './reducers';

const store = createStore(rootReducer);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

---

## 2. Hooks & TypeScript

### 2.1 RootState 타입 정의
`rootReducer`로부터 RootState 타입을 추출합니다.

```tsx
// reducers/index.ts
const rootReducer = combineReducers({ todos, counter });
export type RootState = ReturnType<typeof rootReducer>;
```

### 2.2 Typed useSelector
TypeScript에서 `state`의 타입을 매번 지정하지 않으려면 커스텀 훅을 만드는 것이 좋습니다.

```tsx
// useTypedSelector.ts (예시)
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import type { RootState } from './reducers';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### 2.3 useDispatch
Action을 발생시킵니다.

```tsx
const dispatch = useDispatch();

const onIncrement = () => {
  dispatch({ type: 'INCREMENT' });
};
```

---

## 3. 미들웨어 (Middleware)

Action이 Reducer에 도달하기 전에 가로채서 추가 작업(로깅, 비동기 처리 등)을 수행합니다.

### 3.1 Custom Logger 예시
```ts
const loggerMiddleware = store => next => action => {
  console.log('Action:', action);
  console.log('State:', store.getState());
  return next(action); // 다음 미들웨어 또는 리듀서로 전달
};
```

### 3.2 Redux Thunk (비동기 처리)
Action 대신 **함수**를 디스패치할 수 있게 해주는 미들웨어입니다. API 호출과 같은 비동기 로직을 처리할 때 사용합니다.

```ts
// thunk 함수 (Action Creator)
const fetchPosts = () => async (dispatch) => {
  dispatch({ type: 'FETCH_POSTS_REQUEST' });
  try {
    const response = await api.get('/posts');
    dispatch({ type: 'FETCH_POSTS_SUCCESS', payload: response.data });
  } catch (error) {
    dispatch({ type: 'FETCH_POSTS_FAILURE', error });
  }
};

// 사용
dispatch(fetchPosts());
```
