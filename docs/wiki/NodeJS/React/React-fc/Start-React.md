---
slug: "Start-React"
---
# React Concept

## Component
```html
<!-- HTMLElement -->

<img src="이미지 주소"/>
  
<button class="클래스 이름">버튼</button>

<!-- 내가 만든 컴포넌트 -->

<내가지은이름1 name="Mark" />

<내가지은이름 prop={false}>내용</내가지은이름>

<!--

- src, class, name, props 밖에서 넣어주는 데이터
- 문서(HTML), 스타일(CSS), 동작(JS) 를 합쳐서 내가 만든 일종의 태그

-->
```

## Component Tree === DOM Tree
![Screenshot-2023-06-11-at-10.16.31-AM.png](/img/이미지 창고/Screenshot-2023-06-11-at-10.16.31-AM.png)
- React에서 사용하는 컴포넌트의 형태는 DOM Tree와 유사한 구조는 갖는다.

## Why Virtual DOM?
- **DOM을 직접 제어하는 경우**
	- 바뀐 부분만 정확히 바꿔야 한다.
- **DOM을 직접 제어하지 않는 경우**
	- 가상의 돔 트리를 사용해서,
	- 이전 상태와 이후 상태를 비교하여,
	- 바뀐 부분을 찾아내서 자동으로 바꾼다.

## Virtual DOM - diff로 변경
![Screenshot-2023-06-11-at-10.20.54-AM.png](/img/이미지 창고/Screenshot-2023-06-11-at-10.20.54-AM.png)

## React Client Side Rendering
![Screenshot-2023-06-11-at-10.22.46-AM.png](/img/이미지 창고/Screenshot-2023-06-11-at-10.22.46-AM.png)
![Screenshot-2023-06-11-at-10.23.13-AM.png](/img/이미지 창고/Screenshot-2023-06-11-at-10.23.13-AM.png)

:::note CSR
- JS가 전부 다운로드 되어 리액트 애플리케이션이 정상 실행되기 전까지는 화면이 보이지 않음
- JS가 전부 다운로드 되어 리액트 애플리케이션이 정상 실행된 후, 화명이 보이면서 유저가 인터렉션 가능

:::

:::note SSR
- JS가 전부 다운로드 되지 않아도, 일단 화면은 보임 - 하지만 유저가 사용은 안됨
- JS가 전부 다운로드 외어 리액트 애플리케이션이 정상 실행된 후, 유저가 사용 가능


:::

# React 라이브러리
## React가 하는 일

```js
// 1. 리액트 컴포넌트 => HTML Element 연결하기
import ReactDOM from 'react-dom';

// 2. 리액트 컴포넌트 만들기
import React from 'react';
```

![Screenshot-2023-06-11-at-10.33.48-AM.png](/img/이미지 창고/Screenshot-2023-06-11-at-10.33.48-AM.png)

```js
ReactDOM.render(
  <HelloMessage name="Taylor" />,
  
  document.getElementById('hello-example'),
);
```

```html
class HelloMessage extends React.Component {
  render() {
    return (
      <div>
        Hello {this.props.name}
      </div>
    );
  }
}

ReactDOM.render(
  <HelloMessage name="Taylor" />,
  document.getElementById('hello-example')
);
```
![Screenshot-2023-06-11-at-10.36.50-AM.png](/img/이미지 창고/Screenshot-2023-06-11-at-10.36.50-AM.png)
![Screenshot-2023-06-11-at-10.37.16-AM.png](/img/이미지 창고/Screenshot-2023-06-11-at-10.37.16-AM.png)
![Screenshot-2023-06-11-at-11.04.03-AM.png](/img/이미지 창고/Screenshot-2023-06-11-at-11.04.03-AM.png)

```bash
mkdir what-is-react
cd what-is-react
npm init -y
npx serve
```

```html
<!-- ex1.html : CDN 을 통해 React, ReactDOM 가져오기 -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>
  <body>
    <script
      crossorigin
      src="https://unpkg.com/react@17/umd/react.development.js"
    ></script>
    <script
      crossorigin
      src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"
    ></script>
    <script type="text/javascript">
      // Global 에 React 와 ReactDOM 객체가 생성
      console.log(React);
      console.log(ReactDOM);
    </script>
  </body>
</html>
```

![Screenshot-2023-06-11-at-11.04.45-AM.png](/img/이미지 창고/Screenshot-2023-06-11-at-11.04.45-AM.png)
```html
<!-- ex2.html : 고전 프론트엔드 -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
    <style>
      * {margin: 0;padding: 0;border: 0;}
      #root p {color: white;font-size: 20px;background-color: green;text-align: center;width: 200px;}
      #btn_plus {background-color: red;border: 2px solid #000000;font-size: 15px;width: 200px;}
    </style>
  </head>
  <body>
    <div id="root"></div>
    <button id="btn_plus">+</button>
    <script type="text/javascript">
      const root = document.querySelector("#root");
      const btn_plus = document.querySelector("#btn_plus");

      let i = 0;

      root.innerHTML = `<p>init : 0</p>`;

      btn_plus.addEventListener("click", () => {
        root.innerHTML = `<p>init : ${++i}</p>`;
      });
    </script>
  </body>
</html>

```

![Screenshot-2023-06-11-at-11.26.59-AM.png](/img/이미지 창고/Screenshot-2023-06-11-at-11.26.59-AM.png)

```html
<!-- ex3.html : 컴포넌트를 만들고, 실제 DOM 에 그린다. -->
<!DOCTYPE html>
<html lang="en">
  <head>...</head>
  <body>
    <div id="root"></div>
    <button id="btn_plus">+</button>
    <script type="text/javascript">
      // react 라이브러리가 하는 일
      const component = {
        message: "init",
        count: 0,
        render() {
          return `<p>${this.message} : ${this.count}</p>`;
        }
      };

      // react-dom 라이브러리가 하는 일
      function render(dom, component) {
        // 컴포넌트를 render 하고, DOM 에 그려준다.
        root.innerHTML = component.render();
      }

      render(document.querySelector("#root"), component);

      document.querySelector("#btn_plus").addEventListener("click", () => {
        // 외부에서 컴포넌트의 값을 변경하는 행위
        component.message = "update";
        component.count = component.count + 1;

        render(document.querySelector("#root"), component);
      });
    </script>
  </body>
</html>
```


---

#React #FrontEnd 

---
