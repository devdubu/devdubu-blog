---
slug: "Vue의-프로젝트-셋팅-방법"
---
# Vue 프로젝트의 구성요소
![Pasted-image-20230522095239.png](/img/이미지 창고/Pasted-image-20230522095239.png)
- 처음 Vue를 받게 된다면 위와 같은 사진으로 프로젝트를 기본적으로 구성하게 된다.
- 실질적으로 내가 코드를 작성하는 란은 `compoents` 혹은 해당 `src` 파일이 될 것이다.

# Webpack 기반의 Vue

- 우선 강의를 진행하기 위해서 해당 강의자의 Webpack 예시를 바탕으로 하게 된다.
```shell
npx degit ParkYoungWoong/webpack-template-basic vue3-webpack-template
```
- 위의 명령어를 작성하면, `git clone`과 똑같은 효과를 내지만, 버전에 대한 부분은 삭제가 된다.

![Pasted-image-20230522100452.png](/img/이미지 창고/Pasted-image-20230522100452.png)
- 다운을 받게 된다면, 왼쪽 폴더에서 `js` 폴더를 **삭제**한다.
- 그 후에 `src/main.js`, `src/App.vue` 디렉토리 및 파일을 **생성**한다.

- 후에 해당 webpack은 vue를 동작시키지 못하므로 vue에 관한 package를 설치해야합니다
```bash
# next를 사용하는 이유는 사용하지 않으면 vue2 버전이 설치 되기 때문입니다.
npm i vue@next
# 후에는 현재 강의에서는 개발용으로만 사용할 것이기에, 개발 의존성 패키지를 설치할 것이다. 
# vue/compiler가 vue를 html로 변환 시키는 작업을 하는 패키지 이다.
npm i -D vue-loader@next vue-style-loader @vue/compiler-sfc
```
- 해당 프로젝트는 webpack에서 vue를 연결해야하는 작업이 필요합니다 그렇기 때문에 `webpack.config.js`에서 vue를 추가 해야 합니다.
```js
// path: NodeJS에서 파일 및 디렉토리 경로 작업을 위한 전역 모듈

const path = require('path')
const HtmlPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { VueLoaderPlugin } = reqire('vue-loader') // 추가

module.exports = {
  // 파일을 읽어들이기 시작하는 진입점 설정
  entry: './js/main.js',
  // 결과물(번들)을 반환하는 설정
  output: {
    // 주석은 기본값!, `__dirname`은 현재 파일의 위치를 알려주는 NodeJS 전역 변수
    // path: path.resolve(__dirname, 'dist'),
    // filename: 'main.js',
    clean: true
  },
  // 모듈 처리 방식을 설정
  module: {
    rules: [
    //vue 파일을 받앗기 때문에 해당 부분을 추가하면 됩니다.
    // ++++++++++++++++++++++++++++++++++++++++++++
	  {
		test: /\.vue$/,
		use: 'vue-loader'
	  },
	// ++++++++++++++++++++++++++++++++++++++++++++
      {
        test: /\.s?css$/,
        use: [
          // 순서 중요!
	      'vue-style-loader' // 추가
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/, // 제외할 경로
        use: [
          'babel-loader'
        ]
      }
    ]
  },
  // 번들링 후 결과물의 처리 방식 등 다양한 플러그인들을 설정
  plugins: [
    new HtmlPlugin({
      template: './index.html',
    }),
    new CopyPlugin({
      patterns: [
        { from: 'static' }
      ]
    }),
    new VueLoaderPlugin()
  ],
  // 개발 서버 옵션
  devServer: {
    host: 'localhost',
    port: 8080,
    hot: true
  }
}
```
`webpack.config.js`

### 간단 Vue 예시
```vue
<template>
    <h1></h1>
</template>

<script>
export default{
    data(){
        return {
            message: 'Hello Vue!!!'
        }
    }
}
</script>
```
`src/App.vue`
```js
import Vue from 'vue'
import App from './App.vue'

Vue.createApp(App).mount('#app')
```
`src/`

- 그 이후에 `npm run dev` 를 실행하게 된다면, `localhost:8080` 으로 서버가 뜨게 됩니다.
- 하지만 현재는 아래의 사진 처럼 에러가 뜨게 됩니다
- 해당 에러는 위이의 코드에서 확장자(`.js`, `.vue`)를 작성하지 않아서 생기는 이슈입니다.
![Pasted-image-20230522105846.png](/img/이미지 창고/Pasted-image-20230522105846.png)
```js
...
module.exports = {
  resolve:{
    extensions: ['.js', '.vue']
  },
  // 파일을 읽어들이기 시작하는 진입점 설정
  entry: './js/main.js',
  // 결과물(번들)을 반환하는 설정
  output: {
    // 주석은 기본값!, `__dirname`은 현재 파일의 위치를 알려주는 NodeJS 전역 변수
    // path: path.resolve(__dirname, 'dist'),
    // filename: 'main.js',
    clean: true
  },
  ...
```
`webpack.config.js`
- 위의 코드를 추가하게 된다면 해당 확장자를 작성하지 않아도, 알아서 webpack에서 체크 해줍니다.


### componet 생성 및 assets 사용
```vue

```
`componets/HelloWorld.vue`
- 해당 파일을 불러오려면 파일 의존성 패키지를 설치해야합니다.
```bash
npm i -D file-loader
```
- 그 후에 `webpack.config.js` 에서 해당 부분을 수정해야합니다.
```js
...

module.exports = {
  resolve:{
    extensions: ['.js', '.vue']
    // 경로 별칭
    alias:{
      '~' : path.resolve(__dirname, 'src'),
      'assets': path.resolve(__dirname,'src/assets')
    }
  },
  // 파일을 읽어들이기 시작하는 진입점 설정
  entry: './js/main.js',
  // 결과물(번들)을 반환하는 설정
  output: {
    // 주석은 기본값!, `__dirname`은 현재 파일의 위치를 알려주는 NodeJS 전역 변수
    // path: path.resolve(__dirname, 'dist'),
    // filename: 'main.js',
    clean: true
  },
 
 ...
module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.s?css$/,
        use: [
          // 순서 중요!
          'vue-style-loader',
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/, // 제외할 경로
        use: [
          'babel-loader'
        ]
      },
      // file-loader 의존성 패키지 추가
      {
        test: /\.(png |jpe?g|gif|webp)$/,
        use : 'file-loader'
      }
    ]
  },
  ...
```
`webpack.config.js`

### eslint
- 우선 `eslint`에 관한 패키지를 설치해야한다.
```bash
npm i -D eslint eslint-plugin-vue babel-eslint
```
- 설치된 이후에, 해당 프로젝트에 `.eslintrc.js` 라는 파일을 만듭니다.
![Pasted-image-20230522131720.png](/img/이미지 창고/Pasted-image-20230522131720.png) 
```js
module.exports = {
    env:{
	    // 프론트 환경에서 개발 할 시에, 여러가지 전역 개념들에 대한 코드 검사를, 브라우저와 node 단위에서
	    // 설정한다는 코드 입니다.
        browser: true,
        node: true
    },
    extends: [
	    //vue
        // 'plugin:vue/vue3-essential', // LV1
        'plugin:vue/vue3-strongly-recommanded', // LV2
        // 'plugin:vue/vue3-recommnaded', // LV3
        //js
        'eslint:recommanded'
    ],
    parserOptions: {
		// babel은 해당 es6 문법을 es5로 변환해주는 역할을 한다.
	    parser: 'babel-eslint'
    },
    rules: {}
}
```
`.eslintrc.js`
- 더 디테일한 부분은 왼쪽의 사이트에서 확인 가능하다. [eslint-vue3](https://eslint.vuejs.org/rules/)
- 해당되는 eslint의 규칙이 맞지 않는다면 [eslint rule](https://eslint.org/docs/latest/rules/) 에서 살펴보고 확인해보면 된다.
- 해당 `eslint` 규칙의 예를 들자면 아래의 코드와 같습니다.
```js
<template>
    <img 
	    src="~assets/logo.png" 
	    alt="HEORPY"
	>
</template>
```
`src/compontes/HelloWorld.vue`
- 해당 파일에 eslint 경고창이 뜨지 않게 하려면 위의 코드와 같지만, 저희의 코드 규칙과는 좀 다릅니다.
- 해당 규칙을 수정하기 위해서는 해당 [링크](https://eslint.vuejs.org)로 들어가서 살펴봐야합니다.
- 그리고 아래의 화면으로 들어갑니다.
![Pasted-image-20230522140249.png](/img/이미지 창고/Pasted-image-20230522140249.png)
- 그 후에 Open User Settings를 들어간 후 아래의 코드를 넣어줍니다.
```json
{
	...
	"editor.codeActionsOnSave": {
        "source.fixAll.eslint":true
    }
}
```
- 위 설정을 마친다면, vscode에서 저장 할 때, eslint에 맞게끔 자동으로 문법을 수정해줍니다.


---

#NodeJS #Vue #FrontEnd #Vue2

---