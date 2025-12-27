---
slug: "React-Lifecylce"
---
:::tip React Component는 탄생부터 죽음까지 여러 지점에서 개발자가 작업이 가능하도록 메서드를 오버라이딩 할 수 있게 해준다.

:::

## Declarative
![Screenshot-2023-06-13-at-10.21.18-PM.png](/img/이미지 창고/Screenshot-2023-06-13-at-10.21.18-PM.png)

## Component 생성 및 마운트 (&lt; v16.3)
```jsx
class App extends React.Component{
	state = {
		age: 39,
	};
	constructor(props){
		super(props);
		console.log("constructor", props);
	}
	render(){
		console.log("render");
		return(
			<div>
				<h2>
					Hello {this.props.name} - {this.state.age}
				</h2>
			</div>
		);
	}
	componentWillMount(){
		console.log("componentWillMount")
	}
	compcomponentDidMount(){
		console.log('compcomponentDidMount')
		
		setInterval(()=>{
			console.log("setInterval")
			this.setState(state =>({...state, age: state.age + 1}))
		}, 1000)
	}
}
ReactDOM.render(<App name="Mark" />, document.querySelector("#root"))
```
### 결과
```js
/*

constructor
compcomponentWillMount
render
compcomponentDidMount

*/

//만약 setInterval을 통해서 state값을 변경한다면?
// render 
// 함수가 돌게 된다.
```

## Component props, state 변경(&lt; v16.3)
### 예시
```jsx
class App extends React.Component{
	state = {
		age: 39,
	};
	constructor(props){
		super(props);
		console.log("constructor", props);
	}
	render(){
		console.log("render");
		return(
			<div>
				<h2>
					Hello {this.props.name} - {this.state.age}
				</h2>
			</div>
		);
	}
	componentWillMount(){
		console.log("componentWillMount")
	}
	compcomponentDidMount(){
		console.log('compcomponentDidMount')
		
		setInterval(()=>{
			console.log("setInterval")
			this.setState(state =>({...state, age: state.age + 1}))
		}, 1000)
	}

	componentWillReceiveProps(nextProps){
		console.log('componentWillReceiveProps', nextProps)
	}
	shouldComponentUpdate(nextProps, nextState){
		console.log('shouldComponentUpdate', nextProps, nextState)
		return true; // true를 하게 된다면, render를 그대로 통과하여 다을 render를 준비
		return false; // false를 하게 된다면, 그 다음 단계로 넘어가지 않아서, render되지 않는다.
	}

	componentWillUpdate(nextProps, nextState){
		console.log('componentWillUpdate', nextProps, nextState)
	}
	componentDidUpdate(prevProps, prevState){
		console.log('componentDidUpdate', prevProps, prevState)
	}
}
ReactDOM.render(<App name="Mark" />, document.querySelector("#root"))
```
:::note componetWillRecieveProps
- props를 새로 지정했을 때 바로 호출된다.
- 여기는 state의 변경에 반응하지 않는다.
- setState를 이용해 state를 변경한다.
- 그렇게 된다면, 하나의 lifecycle에서 두개 모두 동시에 변경 가능하다
	 

:::

:::info shouldComponentUpdate
- props, state 둘 중 한개만 변경되어도 실행된다.
- newProps와 newState를 인자로 해서 호출
- return type이 boolean이다.
- true면 render
- false면 render가 호출되지 않는다.
- 이 함수를 구현하지 않으면, default는 true

:::

:::danger componentWillUpdate
- 컴포넌트가 재 랜더링 되기 직전에 불립니다.
- 여기선 setState 같은 것을 쓰면 안된다.

:::

:::tip componetDidUpdate
- 컴포넌트가 재 랜더링을 마치면 불린다.

:::

## Component Unmount ( &lt; v16.3 )
```jsx
class App extends React.Component{
	state = {
		age: 39,
	};
	interval=null
	constructor(props){
		super(props);
		console.log("constructor", props);
	}
	render(){
		console.log("render");
		return(
			<div>
				<h2>
					Hello {this.props.name} - {this.state.age}
				</h2>
			</div>
		);
	}
	componentWillMount(){
		console.log("componentWillMount")
	}
	componentDidMount(){
		console.log('compcomponentDidMount')
		
		this.interval = setInterval(()=>{
			console.log("setInterval")
			this.setState(state =>({...state, age: state.age + 1}))
		}, 1000)
	}

	componentWillReceiveProps(nextProps){
		console.log('componentWillReceiveProps', nextProps)
	}
	shouldComponentUpdate(nextProps, nextState){
		console.log('shouldComponentUpdate', nextProps, nextState)
		return true; // true를 하게 된다면, render를 그대로 통과하여 다을 render를 준비
		return false; // false를 하게 된다면, 그 다음 단계로 넘어가지 않아서, render되지 않는다.
	}

	componentWillUpdate(nextProps, nextState){
		console.log('componentWillUpdate', nextProps, nextState)
	}
	componentDidUpdate(prevProps, prevState){
		console.log('componentDidUpdate', prevProps, prevState)
	}
	// Unmount
	componentWillUnmount(){
		clearInterval(this.interval)
	}

	//
}
ReactDOM.render(<App name="Mark" />, document.querySelector("#root"))
```

# Component Lifecycle의 변경( v16.3 ) 
- ~~componentWillMount~~ -> getDrivedStateFromProps
- ~~componentWillReceiveProps~~ -> getDerivedStateFromProps
- ~~componentWillUpdate~~ -> getSnapshotBeforeUpdate



```jsx
class App extends React.Component{
	state = {
		age: 39,
	};
	interval=null
	constructor(props){
		super(props);
		console.log("constructor", props);
	}
	render(){
		console.log("render");
		return(
			<div>
				<h2>
					Hello {this.props.name} - {this.state.age}
				</h2>
			</div>
		);
	}
	// 특수한 경우에만 사용한다.
	// 추천되는 방식은 아니다. 시간에 흐름에 따라 변하는 props에 state가 의존하는 경우 사용한다.
	static getDrivedStateFromProps(nextProps, prevState){
		// 일반적인 메서드가 아닌 static 메서드이다.
		console.log('getDrivedStateFromProps', nextProps, prevState)
		
		// return 값에 새로운 state 값을 넣을 수 있다.
		// nextProps와 관계 없이도 해당 사항이 변경될 수 있다.
		return {
			age: 390
		};
	}
	componentDidMount(){
		console.log('compcomponentDidMount')
		
		this.interval = setInterval(()=>{
			console.log("setInterval")
			this.setState(state =>({...state, age: state.age + 1}))
		}, 1000)
	} 

	
	shouldComponentUpdate(nextProps, nextState){
		console.log('shouldComponentUpdate', nextProps, nextState)
		return true; // true를 하게 된다면, render를 그대로 통과하여 다을 render를 준비
		return false; // false를 하게 된다면, 그 다음 단계로 넘어가지 않아서, render되지 않는다.
	}

	
	
	componentDidUpdate(prevProps, prevState){
		console.log('componentDidUpdate', prevProps, prevState)
	}
	// Unmount
	componentWillUnmount(){
		clearInterval(this.interval)
	}

	//
}
ReactDOM.render(<App name="Mark" />, document.querySelector("#root"))
```
- 예전 Lifecycle을 섞어쓰게 된다면 에러가 난다.
```jsx
let i = 0;

class App extends React.Component{
	state = { list : [] };

	render(){
		return (
			<div id="list" style={{height: 100, overflow: " scroll"}}>
				{ this.state.list.map((i) =>{
					return <div>{i}</div>;
				})}
			</div>
		);
	}

	componentDidMount(){
		setInterval(()=>{
			this.setState((state) => ({
				list: [...state.list, i++],
			}));
		},1000);
	}

	// 만약 새로운 값이 등장할 때, 스크롤을 자동으로 내리게 하는 로직을 구현하고 싶다면?
	// Render 전과 후의 스크롤 상태를 비교해야한다.
	getSnapshotBeforeUpdate(prevProps, prevState){
		if(prevState.list.length === this.state.list.lenght) return null;
		const list = document.querySelector("#list")
		return list.scrollHeight - list.scrollTop;
	}

	componentDidUpdate(prevProps, prevState, snapshot){
		console.log(snapshot); // 한화면에 떠있으면 snapshot 값은 100이 된다.
		if(snapshot === null) return;
		const list = document.querySelector("#list");
		list.scrollTop = list.scrollHeight - snapshot;
	}
	
}
ReactDOM.render(<App name="Mark" />, document.querySelector("#root"))
```

## Component 에러 캐치
### componentDidCatch
```jsx
class App extends React.Component{
	state = {
		hasError
	}
	render(){
		if(this.state.hasError){
			return <div>예상치 못한 에러</div>
		}
		return <WebService/>
	}
	// 만약 웹 서비스에 문제가 생긴다면 아래의 컴포넌트에서 Catch한다.
	componentDidCatch(error, info){
		this.setState({hasError : true});
	}
}
ReactDOM.render(<App name="Mark" />, document.querySelector("#root"))
```


---

#React #FrontEnd 

---