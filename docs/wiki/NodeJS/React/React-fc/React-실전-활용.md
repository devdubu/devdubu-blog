---
slug: "React-실전-활용"
---
# HOC
- [Higher Order Component](https://legacy.reactjs.org/docs/higher-order-components.html)
![Screenshot-2023-07-05-at-10.43.53-PM.png](/img/이미지 창고/Screenshot-2023-07-05-at-10.43.53-PM.png)
:::tip Higher Order Component?
- advanced technique in React for reusing component logic
- not part of the React API
- a pattern that emerges from React's compositional nature

:::

```jsx
HOC = function(컴포넌트) { return 새로운 컴포넌트; }
```
- HOC는 `<component>`를 인자로 받아 `<new components>`를 리턴하는 **함수**이다.

![Screenshot-2023-07-05-at-10.59.07-PM.png](/img/이미지 창고/Screenshot-2023-07-05-at-10.59.07-PM.png)
- 컴포넌트는 props를 인자로 받으며 그것을 ui로 output한다.
- 하지만, HOC의 경우에는 컴포넌트를 인자로 받으며 새로운 컴포넌트를 output한다.

![Screenshot-2023-07-05-at-11.00.38-PM.png](/img/이미지 창고/Screenshot-2023-07-05-at-11.00.38-PM.png)
- HOC는 재 사용성이 매우 높아서 유용하게 쓰이며, React Redux에서 `connect()` 함수가 해당 HOC의 일종입니다.

![Screenshot-2023-07-05-at-11.01.50-PM.png](/img/이미지 창고/Screenshot-2023-07-05-at-11.01.50-PM.png)
- Relay에서도 `Fragment Container`라는 것에 `createFragmentContainer`라는 함수 안에, `component`를 넣는 란이 존재한다.
- 이미 이전에도 HOC라는 기술은 사용한 적이 있다.

## withRouter()
- 보통 `with`가 붙은 함수가 HOC인 경우가 많다.
```jsx
export default withRouter(LoginButton);
```

```jsx
import React from "react";
import { withRouter } from "react-router-dom";

const LoginButton = props => {
  console.log(props);
  function login() {
    setTimeout(() => {
      props.history.push("/");
    }, 1000);
  }
  return <button onClick={login}>로그인하기</button>;
};

export default withRouter(LoginButton);
```

:::note 사용법
- Use HOCs For** Cross-Cutting Concerns**
- Don't Mutate the Original component. Use Composition.
- Pass Unrelated Props Through to the Wrapped Component
- Maximizing Composability
- Wrap the Display Name for Easy Debugging
:::

- [Cross-Cutting Concerns](https://ko.wikipedia.org/wiki/%ED%9A%A1%EB%8B%A8_%EA%B4%80%EC%8B%AC%EC%82%AC)

![Screenshot-2023-07-06-at-5.59.45-AM.png](/img/이미지 창고/Screenshot-2023-07-06-at-5.59.45-AM.png)
:::warning 주의할 점
- Don't Use HOCs Inside the render Method
- Static Methods Must Be Copied Over
- Refs Aren't Passed Through

:::

### Don't Use HOCs Inside the render Method
```jsx
render() {
  // A new version of EnhancedComponent is created on every render
  // EnhancedComponent1 !== EnhancedComponent2
  const EnhancedComponent = enhance(MyComponent);
  // That causes the entire subtree to unmount/remount each time!
  return <EnhancedComponent />;
}
```

### Static Methods Must Be Copied Over
```jsx
// Define a static method
WrappedComponent.staticMethod = function() {/*...*/}
// Now apply a HOC
const EnhancedComponent = enhance(WrappedComponent);

// The enhanced component has no static method
typeof EnhancedComponent.staticMethod === 'undefined' // true
```

```jsx
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  // Must know exactly which method(s) to copy :(
  Enhance.staticMethod = WrappedComponent.staticMethod;
  return Enhance;
}
```

- static Method는 복사를 해줘야하기 때문에 아래와 같은 라이브러리가 나왔다.
```jsx
import hoistNonReactStatic from 'hoist-non-react-statics';
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  hoistNonReactStatic(Enhance, WrappedComponent);
  return Enhance;
}
```
- 라이브러리를 만들어야하는 입장에서는 중요한 package이다.
![Screenshot-2023-07-06-at-6.05.12-AM.png](/img/이미지 창고/Screenshot-2023-07-06-at-6.05.12-AM.png)

- 아래처럼 `MyComponent`를 사용해도 되지만, export를 `someFunction`으로 한다면, `someFunction`으로도 사용이 가능하다.
```jsx
// Instead of...
MyComponent.someFunction = someFunction;
export default MyComponent;

// ...export the method separately...
export { someFunction };

// ...and in the consuming module, import both
import MyComponent, { someFunction } from './MyComponent.js';
```

# Controlled Component & Uncontrolled Component
```bash
npx create-react-app controlled-uncontrolled-example
```

:::tip 상태를 가지고 있는 엘리먼트
- input
- select
- textarea
- ...

:::

## Element의 상태를 누가 관리 하느냐
- 엘리먼트를 **가지고 있는 컴포넌트가 관리** -> Controlled
- 엘리먼트의  상태를 관리하지 않고, **엘리먼트의 참조만 컴포넌트가 소유** -> Uncontrolled
![Screenshot-2023-07-06-at-6.10.54-AM.png](/img/이미지 창고/Screenshot-2023-07-06-at-6.10.54-AM.png)

## 실습
```jsx
import React from 'react';

class ControlledComponent extends React.Component {
	state = { 
		value: '' 
	};

	render() {
		const { value } = this.state
		return (
			<div>
		        <input value={value}/>
		    </div>
	    );
	}
}
export default ControlledComponent;
```
`components/Controlled.jsx`






---

#React #FrontEnd 

---