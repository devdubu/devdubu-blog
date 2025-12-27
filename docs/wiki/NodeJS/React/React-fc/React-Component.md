---
slug: "React-Component"
---
# Class, Function Component
:::warning Hook 이전
- 컴포넌트 내부에 상태가 있다면?
- class 컴포넌트를 사용
- 컴포넌트 내부에 상태가 없다면?
- 라이프사이클을 사용해야하 한다면?
	- class 컴포넌트를 사용
- 라이프사이클에 관계가 없다면?
	- function 컴포넌트를 사용
:::

- 우선은 Hook을 배우기 전의 상태로 가정 하고 class, function 컴포넌트를 알아보겠다.

## Class Component
```js
import React from 'react';

// 정의
class ClassComponent extends React.Component{
	render(){
		return (<div>Hello</div>);
	}
}
// 사용
<ClassComponent/>
```

## Function Component
```js
import React from 'react'

// 정의1
function FunctionComponent(){
	return <div>Hello</div>
}

// 정의2
const FunctionComponent = () => <div>Hello</div>;

// 사용
<FunctionComponent />
```

# React.createElement로 컴포넌트 만들기
```html
<!-- ex5.html : React.createElement 로 컴포넌트를 만들기 -->
<!DOCTYPE html>
<html lang="en">
  <head>...</head>
  <body>
    <div id="root"></div>
    <script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
    <script type="text/javascript">
	    React.createElement(
	        type, // 태그 이름 문자열 | React 컴포넌트 | React.Fragment
	        [props], // 리액트 컴포넌트에 넣어주는 데이터 객체
            [...children] // 자식으로 넣어주는 요소들
	    );

      // 1. 태그 이름 문자열 type
	    ReactDOM.render(
	        React.createElement('h1', null, `type 이 "태그 이름 문자열" 입니다.`),
	        document.querySelector('#root'),
	    );

      // 2. React 컴포넌트 type
	    const Component = props => {
	        return React.createElement('p', null, `type 이 "React 컴포넌트" 입니다.`);
	    };
	    // 결과
	    // <h1>type 이 "React 컴포넌트" 입니다.</h1>

        ReactDOM.render(
	        React.createElement(
		        Component,
		        null,
	            null
	        ),
	        document.querySelector("#root")
        );
        // 결과
        // <Component></Component/>

      // 3. React Fragment type
	    ReactDOM.render(
	        React.createElement(
	            React.Fragment,
	            null,
	            `type 이 "React Fragment" 입니다.`
	        ),
		    document.querySelector("#root")
        );
		/*
			Fragment Type을 통해서 태그가 없이,Child 부분이 나온다.
			필요한 이유는, 최상위 태그에서 태그에 구애 받지 않고, 여러 개를 작성하게 된다.
		*/ 
		
		// 4. 복잡한 리액트 엘리먼트 모음
		ReactDOM.render(
			React.createElement(
				"div",
				null,
				React.createElement(
					'div',
					null,
					React.createElement("h1", null, "주제"),
					React.createElement(
						"ul",
						null,
						ReactCreateElement("li", null, "React"),
						ReactCreateElement("li", null, "Vue")
					)
				)
			),
			document.querySelector('#root'),
		)
		

      // 4. props 를 통해 데이터를 주입
	    const Component = props => {
		    return React.createElement(
	        'p',
	        null,
	        `message 는 "${props.message}" 입니다.`,
		    );
	    };

	    ReactDOM.render(
	        React.createElement(
	            Component,
	            { message: '이것은 메세지 입니다.' },
	            null,
	        ),
	        document.querySelector('#root'),
        );

    </script>
  </body>
</html>
```

# JSX
:::success JSX
- JSX 문법으로 작성된 코드는 순수한 JavaScript로 컴파일 하여 사용한다.
- babel에서 컴파일을 해준다.

:::

- babel은 현재 사용하고 있는 최신의 문법들을 브라우저가 이해할 수 있는 valina JS로 번역해준다.
[Bable 사이트](https://babeljs.io/)
![Screenshot-2023-06-11-at-6.16.46-PM.png](/img/이미지 창고/Screenshot-2023-06-11-at-6.16.46-PM.png)
```jsx
<!-- ex5.html : React.createElement 로 컴포넌트를 만들기 -->
<!DOCTYPE html>
<html lang="en">
  <head>...</head>
  <body>
    <div id="root"></div>
    <script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script> 
    <script type="text/babel">
	    // 4. 복잡한 리액트 엘리먼트 모음
	    ReactDOM.render(
		    <div>
			    <div>
				    <h1>주제</h1>
				    <ul>
					    <li>React</li>
					    <li>Vue</li>
					</ul>
				</div>
			</div>,
			document.querySelector("#root")
	    );
    </script>
  </body>
</html>
```

:::question JSX를 사용하는 이유
- 가독성이 좋다.
- babel 과 같은 컴파일 과정에서 문법적 오류를 인지하기 쉽다.

:::

## JSX 문법
- <mark>최상위 요소</mark>가 하나여야 합니다.
	- 최상위 요소를 리텅하는 경우, `( )` 로 감싸야 한다. -> 절대적이진 않다.
- 자식들을 바로 랜더링하고 싶으면, `<>자식들</>`를 사용합니다. =>`Fragment`
- JS <mark>표현식을 사용</mark>하려면, `{ 표현식 }`를 이용합니다.
- if 문은 사용할 수 없습니다.
	- <mark>삼항 연산자</mark> 혹은 `&&`를 사용합니다.
- style을 이용해 인라인 스타일링이 가능합니다.
- `class` 대신 `className`을 사용하여 `class`를 적용할 수 있습니다.
- 자식 요소가 있으면, 꼭 닫아야하고, 자식 요소가 없으면 열면서 닫아야합니다.
	- `<p>어쩌구</p>`
	- `<br/>`

# Props와 State
:::tip Props?
- 컴포넌트 <mark>외부</mark>에서 컴포넌트에게 주는 데이터 입니다.

:::

:::tip State?
- 컴포넌트 내부에서 변경할 수 있는 데이터 입니다.
:::

- 둘 다 변경이 발생하면, 랜더가 다시 일어날 수 있습니다.

![Screenshot-2023-06-11-at-6.36.08-PM.png](/img/이미지 창고/Screenshot-2023-06-11-at-6.36.08-PM.png)

## Render 함수
- Props와 State를 바탕으로 컴포넌트를 그립니다.
- 그리고 Propsdhk State가 변경되면, 컴포넌트를 다시 그립니다.
- 컴포넌트를 그리는 방법을 기술하는 함수가 랜더 함수 입니다.
![Screenshot-2023-06-11-at-6.39.02-PM.png](/img/이미지 창고/Screenshot-2023-06-11-at-6.39.02-PM.png)

## Function Component
```jsx
<!-- ex8-1.html : 함수로 리액트 컴포넌트 만들기 -->
<!DOCTYPE html>
<html lang="en">
  <head>...</head>
  <body>
    <div id="root"></div>
    <script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script type="text/babel">
	    function Component(props) {
		    return (
		        <div>
			        <h1>{props.message} 이것은 함수로 만든 컴포넌트 입니다.</h1>
		        </div>
		    );
	    }
	
	    ReactDOM.render(
		    <Component message="안녕하세요!!!" />,
	        document.querySelector('#root'),
	    );
    </script>
  </body>
</html>

```

-> `<Component p="데이터">` 로 <mark>props를 설정</mark>하며, `props.p`로 <mark>사용</mark>합니다.

## Class Component
```jsx
<!-- ex8-2.html : 클래스로 리액트 컴포넌트 만들기 -->
<!DOCTYPE html>
<html lang="en">
  <head>...</head>
  <body>
    <div id="root"></div>
    <script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script type="text/babel">
      class Component extends React.Component {
        render() {
          return (
            <div>
              <h1>
                {this.props.message} 이것은 클래스를 상속하여 만든 컴포넌트
                입니다.
              </h1>
            </div>
          );
        }
      }

      ReactDOM.render(
        <Component message="안녕하세요!!!" />,
        document.querySelector('#root'),
      );
    </script>
  </body>
</html>
```

## Default Props
```jsx
<!-- ex9.html : defaultProps 설정 -->
<!DOCTYPE html>
<html lang="en">
  <head>...</head>
  <body>
    <div id="root"></div>
    <script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script type="text/babel">
	    class Component extends React.Component {
		    static defaultProps = {
		        message: '안녕하세요!!!',
	        };
	        render() {
		        return (
			        <div>
			            {this.props.message} 이것은 클래스를 상속하여 만든 컴포넌트 입니다.
		            </div>
		        );
		    }
	    }
	    
		// state에 위치한 변수를 변경할 때는, 단순한 계산이 아닌 setState()를 이용해서 변경해야 한다.
		componentDidMount(){
		    setTimeout(()=>{
			    this.setState({
				    count: this.state.count+1,
			    })
		    },1000)
	    }
	
      //   Component.defaultProps = {
      //     message: '안녕하세요!!!',
      //   };

      ReactDOM.render(<Component />, document.querySelector('#root'));
    </script>
  </body>
</html>
```
### State 사용법
```jsx
// state 생성 방법 1
class Component extends React.Component {
  state = {
    s: '스테이트'
  };
  render() {
    return (
      <div>{this.state.s}</div>
    );
  }
}

// state 생성 방법 2
class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {s: '스테이트'};
  }
  render() {
    return (
      <div>{this.state.s}</div>
    );
  }
}
```
#### 사용 방법
- `this.state.s ` 로 접근 해서 사용하면 된다.

#### state 값 변경 방법
- `this.setState({s: '새로운 값'})`으로 값을 업데이트 하면 된다.
```jsx
class Component extends React.Component {
  state = {
    s: '스테이트'
  };
  render() {
    return (
      <div onClick={() => {
        this.setState({s: '새 스테이트'});
      }}>{this.state.s}</div>
    );
  }
}
```

# Event Handling
:::tip Event Handling?
- HTML DOM에 클릭하면 이벤트가 발생하고, 발생하면 그에 맞는 변경이 일어나도록 해야한다.
- JSX에 이벤트를 설정할 수 있다.

:::

```jsx
Class Comp extends. React.Component{
	render(){
		return{
			<div>
				<button onClick={()=>{
					console.log('clicked');
				}}>클릭</button>
			</div>
		};
	}
}
```
## 규칙
- camelCaelCase 로만 사용 가능하다
	- `onClick`, `onMouseEnter`
- 이벤트에 연결된 JS 코드는 함수이다.
	- `이벤트={함수}` 와 같이 쓴다.
- 실제 DOM 요소들에만 사용 가능하다.
	- 리액트 컴포넌트에 사용하면 , <mark>props로 전달만</mark> 된다.
### 예시 1
```jsx
class Component extends React.Component{
	state = {
		count:0,
	};
	render(){
		return(
			<div>
				<p>{this.state.count}</p>
				<button
					onMouseEnter(()=>{
						console.log("clicked");
						this.setState((state)=>{
							...state,
							count: state.count + 1,
						})
					})
				>클릭</button>
			</div>
		)
	}
}
```
### 예시 2
```jsx
class Component extends React.Component{
	state = {
		count:0,
	};
	// 첫번째
	constructor(props){
		super(props);
		this.click = this.click.bind(this);
		//위의 코드는 class 자체에 this를 props에 바인드 시켜서 강제로 맵핑 시킨다.
	}
	render(){
		return(
			<div>
				<p>{this.state.count}</p>
				<button
					onMouseEnter={this.click}
				>클릭</button>
			</div>
		)
	}
	//위의 코드를 수정 없이 그냥 사용하면 에러가 나기 때문에 위의 코드를 추가해야한다.
	// 혹은 위의 constructor를 지우고 clock = () => {} 방식으로 바꾼다면 해결된다.
	click(){
		console.log("clicked");
		this.setState((state)=>{
			...state,
			count: state.count + 1,
		})
	}
}
```


---

#React #FrontEnd 

---