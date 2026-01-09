# Vite

:::question Vite란?
- 프랑스어로 빠르다 라는 의미를 가지며, 빠르고 간결한 개발 경험에 초점을 둡니다.

:::

## Vite의 구동 방식

### 기존 Bundler 구조
- 기존 번들러는 애플리케이션의 <mark>모든 소스코드</mark>에 대한 <mark>빌드 과정</mark>을 <mark>마친</mark> 후 페이지를 제공했습니다.
- 때문에 빌드 후, 서버를 구동 또는 재 구동하는 과정에서 꽤나 많은 시간을 소요했습니다.[DOM](../../../App-Util/HTML/DOM.md)
![Pasted-image-20240205104432.png](/img/이미지 창고/Pasted-image-20240205104432.png)
### Vite의 구조
![Pasted-image-20240205104639.png](/img/이미지 창고/Pasted-image-20240205104639.png)
- vite는 현재 페이지에 변경점이 생기면 해당 페이지에서 필요로 하는 모듈만을 수정한 뒤 갱신합니다.
- ESM을 모듈 시스템으로 사용하고 있기 때문에, 브라우저에서 어떤 모듈에 대한 교체를 요청하면 클라이언트는 해당 모듈을 전달하기만 하면 되기 때문에,
- 앱의 크기와 상관 없이 HMR을 포함한 갱신 시간에는 크게 영향을 받지 않습니다.

:::tip ESM?
- ES6부터 표준화된 브라우저 환경에서 사용 가능한 모듈 시스템

[!tip | green] HMR?
- 브라우저를 새로고침하지 않아도 웹팩으로 빌드한 결과물이 웹 애플리케이션에 실시간으로 반영될 수 있게 도와주는 설정


:::

## Webpack
webpack의 핵심 개념은 Entry, Output, Loaders, Plugins 등이라 한다.
- Entry : 디펜던시 그래프를 생성하기 위해 사용해야 하는 모듈(어플리케이션의 entry포인트 / 일반적으로 `./src/index.js`)
- Output: 생성된 번들을 내보내는 위치와 파일의 이름을 지정
- Loader: webpack은 기본적으로 JS와 JSON파일만 이해하기 때문에 Loader를 사용하ㅕㅇ, 다른 유형의 파일을 처리하거나 유효한 모듈로 변환하여 사용하거나 디펜던시 크래프에 추가(v5.89.0 기준 트랜스파일링을 위해 Bable-loader 등을 사용)
- Plugins: Loader는 특정 유형의 모듈을 변환하는네 사용하지만, 플러그인은 번들의 최적화, 애셋의 관리, 환경 변수 주입등과 같은 작업을 수행
![Pasted-image-20240205110305.png](/img/이미지 창고/Pasted-image-20240205110305.png)

![Pasted-image-20240205110843.png](/img/이미지 창고/Pasted-image-20240205110843.png)
전통적인 Bundle기반 방식은 위 그림과 같은 과정을 통해 서버를 실행한다.
엔트리부터 시작하여 번들링을 수행한 뒤 결과물을 가지고 서버를 구동했다.
만약 소스 코드를 업데이트 하게 되면, 번들링 과정을 다시 수행해야 했으며, 서비스가 커질수록 갱신 시간 또한 증가하게 되었다.
이를 해결하기 위해 일부 번들러는 메모리에서 작업을 수행하며, 실제로 갱신에 영향을 받는 파일들만 새롭게 번들링 하도록 했지만,(HMR) 결국 처음에는 모든 파일에 대한 번들링이 필요했다.

![Pasted-image-20240205134833.png](/img/이미지 창고/Pasted-image-20240205134833.png)
- 현재 점유율


## 번들러란?
:::tip 여러개의 파일들을 하나의 파일로 묶어주는 도구 입니다

:::

### 번들러가 필요해진 이유
태초에, 브라우저는 ES Modules를 지원하지 않는다.
다른 말로 ES6 import 문법을 사용할 수 없었으며 `<script>` 간 모듈을 내보낼 수 없다는 것입니다.
개발자들은 다양한 전략으로 코드를 여러 파일로 분리했고, `window` `jQuery` 와 같은 전역 객체를 활용하여 통해 스크립트 파일 간 모듈을 공유 했습니다.

사람들은 웹 브라우저에서 더 많은 활동을 하게 되었고, 더 좋은 서비스 경험이 요구 되었습니다.
더 작은 용량의, 더 최적화된 리소스를 제공해주기, 흩어져있는 여러 파이래을 하나로 통합하고 문자를 압축시키기, 다양한 사용자 환경에서도 돌아가도록 코드 변환하기, 안 쓰이는 소스코드 부분을 분석해서 제거하기

## Webpack
![Pasted-image-20240205141055.png](/img/이미지 창고/Pasted-image-20240205141055.png)

2012년 Tobias Koppers에 의해 webpack v1.0이 효율적으로 js파일을 통합해주는 도구로 공개되었습니다.  
2016년 webpack v2.0이 릴리즈되고 ES6를 지원하여 커뮤니티의 큰 관심을 얻게 되었습니다.  
2017년 webpack v3.0이 릴리즈되고 성능 개선, 기능 추가 되면서 사람들이 열광하기 시작했습니다.  
2018년 webpack v4.0이 릴리즈되었는데 동시에 React, Anglular의 등장으로 SPA가 급부상하게 되면서 번들러의 역할 더욱 막중해지자 이른바 "대웹팩시대"가 도래하게 되었습니다.  
현재는 2020-10-10에 릴리즈된 v5에서 지속적으로 업데이트되고 있습니다.

[**`webpack`**](https://webpack.kr/)의 정체성은 번들러의 목적인 "**통합**"에 있습니다.  
'번들을 통합해서 관리할 순 없을까?'에 대한 고민이 webpack이 부상할 수밖에 없게 만들어 주었죠.

**설정이 간편하고 직관적.**  
하나의 설정 파일에서 원하는 번들이 생성 될 수 있도록 컨트롤할 수 있습니다.  
`entry`와 `output`을 명시하고 어떤 `plugin`과 `loader`로 파일들을 다룰 건지 명시하면 됩니다.

```js
const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    home: './pages/home.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js
$
/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin()],
};
```
`webpack.config.js`

**풍부한 plugins과 loaders.**  
webpack은 굉장히 <mark>강력한 개발 커뮤니티</mark>가 뒷 바침해주고 있습니다.  
쉽게 `plugin`과 `loader`를 부착할 수 있기 때문인데요. `loader`를 통해서 파일들을 변환, 번들링, 빌드를 진행하고 `plugin`을 통해서 output 파일을 튜닝 해줍니다.  
필요에 따라 다양한 plugin, loader가 오픈소스로 개발되고 있어

**강력한 개발 서버.**  
webpack은 [Hot Module Replacement(HMR)](https://webpack.kr/guides/hot-module-replacement/)를 처음으로 제안했고 2012년부터 사용되어왔습니다.  
HMR는 소스코드의 변화를 감지하여 브라우저를 직접 새로고침할 필요가 없이 변화를 바로 반영해줍니다. 개발자는 덕분에 더욱 신속하게 개발할 수가 있게 되었죠.  
webpack v2, v3, v4을 거쳐서 다양한 파일(css)의 변화도 감지할 수 있게 되었고 안정화되었습니다.

**Code Splitting.**

webpack의 꽃이라고도 할 수 있는 [Code Splitting](https://webpack.kr/guides/code-splitting/)의 얘기도 빠질 수가 없습니다.

> "Code splitting is one of **the most compelling features** of webpack."

한마디로 설명하자면 **번들 로드 최적화**하는 작업입니다.  
파일들을 여러 번들 파일으로 분리하여 병렬로 스크립트를 로드하여 페이지 로딩속도를 개선할 수 있습니다.  
추가로 초기에 구동될 필요가 없는 코드를 분리하여 lazy loading을 통해 페이지 초기 로딩속도를 개선할 수 있습니다.

끝으로 당시 같이 거론되었던 번들링 라이브러리에 대해서 비교하면서 webpack 설명을 마치겠습니다.

### vs grunt

`grunt`는 `task runner`입니다.  
minifying, 파일 통합, lint 적용 등 등록된 task를 순서대로 실행시켜 줍니다.  
설정이 파편화되고 개발자가 직접 컨트롤해야하는 영역이 많습니다.  
반면 `webpack`은 `module bundler`로 모듈을 통합하는 것에 초첨이 맞춰져 있습니다.

### vs glup

`glup`은 `grunt`와 흡사한 `task runner`입니다.  
다만 stream-based로 파일을 접근하기에 grunt에 비해 성능이 더 우수하다고 평가를 받고 있습니다.

## Rollup
![Pasted-image-20240205141223.png](/img/이미지 창고/Pasted-image-20240205141223.png)
webpack 시대 개막과 함께 2017년부터 개발이 시작된 `module bundler`입니다.  
대세적으론 webpack의 열풍에 가려져 있었지만 점차 그의 매력이 인정을 받아 많은 차세대 번들러가 rollup을 벤치마킹하게 되었습니다.

[`v1.0`](https://github.com/rollup/rollup/blob/master/CHANGELOG.md#100) 2018-12-28  
[`v2.0`](https://github.com/rollup/rollup/blob/master/CHANGELOG.md#200) 2020-03-06  
[`v3.0`](https://github.com/rollup/rollup/blob/master/CHANGELOG.md#300) 2022-10-11

[**`Rollup`**](https://rollupjs.org/)의 정체성은 "**확장**"에 있습니다.

> "compiles small pieces of code into something larger and more complex, such as a library or application"

작은 코드조각들을 거대하고 복잡한 어플리케이션 혹은 라이브러리로 만들어 준다고 스스로 소개합니다.  
같은 소스코드를 다양한 환경에 맞춰 다르게 발드하는 것을 생각하면 될 것 같습니다.  
그러면서 자연스럽게 아래 여론이 형성되었습니다.

> "어플리케이션 만들 땐 webpack으로, **라이브러리 만들 땐 rollup으로!**"

rollup의 사용방식과 구성방식은 webpack과 거의 흡사합니다.  
`input`과 `entry`를 설정하고 번들링에 적용할 기능을 `plugin` 형태로 끼워 넣으면 됩니다.

```js
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/main.js',
  output: {
    file: 'public/bundle.js',
    format: 'iife',
    sourcemap: true,
  },
  plugins: [
    resolve(),
    commonjs(),
    production && terser(),
  ],
};
```
`rollup.config.js`

### vs webpack

한마디로 정리하면,  
webpack은 내부적으로 Commonjs를 사용하고 rollup은 typescript(ES6)를 사용합니다.  
이로 인해서 아래 특성들이 있다고 볼 수 있습니다.

**rollup은 ES6 모듈 형태로 빌드할 수 있습니다.**  
webpack은 CommonJS 형태로만 번들링이 가능했습니다. 물론 webpack v5부턴 ES6로 번들할 수 있습니다.  
라이브러리는 ES6 번들에 생성에 대한 수요가 강합니다.  
ES6 환경에서는 ES6 번들이 사용되고 CommonJS 환경에서는 CommonJS 번들이 사용되도록 해줘야 라이브러리 사용자는 더욱 최적화된 애플리케이션을 빌드해줄 수 있습니다.

**rollup은 좀 더 빠릅니다.**  
webpack은 모듈들을 함수로 감싸서 평가하는 방식을 사용하지만 rollup은 모듈들을 호이스팅하여 한번에 평가하기에 성능상 이점이 있습니다.

**rollup은 더 가벼운 번들을 생성합니다**  
`tree shaking`은 기본적으로 ES6 코드에서 제대로 동작합니다.  
단순히 레퍼런스되지 않는 코드를 제거하는 것이 아닌 사용되는 모듈만 AST 트리에 포함시키는 방식으로 불필요한 코드를 제거하기 때문입니다.  
rollup은 공식 플로그인을 통해서 CommonJS 코드를 ES6 코드로 변환할 수도 있습니다.

**rollup은 CommonJS 코드를 ES6코드에서 사용할 수 있습니다.**  
기본적으로 ES6에서는 CommonJS식의 require를 지원하지 않습니다.  
webpack에서도 공식적으론 ES6 혹은 CommonJS 한 형태의 코드 베이스를 사용하기를 권장합니다.


## ESBuild
![Pasted-image-20240205141316.png](/img/이미지 창고/Pasted-image-20240205141316.png)


앞서 봐왔던 번들러는 모두 내부적으로 JavaScript을 기반으로 번들링을 합니다.  
따라서 JavaScript 언어가 가질 수 밖에 없는 성능상의 한계가 있습니다.  
그 한계를 뿌수고자하는 움직임이 있었으니 그 라이브러리가 바로 ESBuild 입니다.

[**`ESBuild`**](https://github.com/evanw/esbuild)는 내부적으로 [`Go`](https://go.dev/)로 작성되었고 JS 기반의 번들러보다 10배에서 100배까지 빠른 엄청난 퍼포먼스를 보여줬습니다. 빠른 이유에 대해서는 아래와 같이 소개하고 있습니다.

- 네이티브 코드 방식 사용
- 병렬처리 최적화
- 메모리 사용 최적화
- 자체 JavaScript 파서 사용
- [https://esbuild.github.io/faq/](https://esbuild.github.io/faq/)

문제는 2020년도에 파격적으로 등장 했지만 아직까지도 메이저 버전이 릴리즈 되지 못했습니다. (현재 기준 v0.17.3)  
사실 번들러로서 필수적인 기능들이 갖춰졌습니다.

- JavaScript, CSS, TypeScript, and JSX built-in
- Bundles ESM and CommonJS modules
- Tree shaking, minification, and source maps
- Local server, watch mode, and plugins

하지만 설정이 webpack, rollup처럼 유연하지 못하고 아직 안전성 관련 이슈가 있습니다.

- code splitting 및 CSS와 관련된 처리가 아직 미비합니다.
- esbuild는 es5 이하의 문법을 아직 100% 지원하지 않습니다.

## Vite

ESBuild의 단점을 보완시킨 라이브러리 [**`Vite`**](https://vitejs-kr.github.io/)(비트) 입니다.  
`Vue.js`의 창시자인 [Evan You](https://evanyou.me/)가 만든 `frontend build tool` 입니다.

2021년에 등장했지만 벌써 v4가 나온 만큼 굉장히 활발하게 업데이트 되고 있는 라이브러리입니다.  
[`v1 rc`](https://www.npmjs.com/package/vite/v/1.0.0-rc.13?activeTab=versions)에서 바로 v2 alpha로 넘어간 것 같습니다.  
[`v2.0.0`](https://github.com/vitejs/vite/blob/v2.0.5/packages/vite/CHANGELOG.md#200-2021-02-16) 2021-02-16  
[`v3.0.0`](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#300-2022-07-13) 2022-07-13  
[`v4.0.0`](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#400-2022-12-09) 2022-12-09

vite를 2가지 키포인트로 설명할 수 있을 것 같습니다.

- `native ES modules` 기반의 강력한 개발서버
- `esbuild`로 파일들을 통합하고 `rollup`을 통해 번들링

전반적으로 `esbuild`로 성능을 극적을 끌어오고 `rollup`을 통해서 번들링의 유연성을 챙겼다고 볼 수 있습니다.  
[공식문서 (Vite를 사용해야 하는 이유)](https://vitejs-kr.github.io/guide/why.html)에서 자신에 대해 너무 잘 설명하고 있어 꼭 한번 정독해보시길 바랍니다!

특성을 아래와 같이 요약할 수 있을 것 같습니다.

- 개발 서버 구동 시간이 거의 `0`에 가까움,
- 모든 CommonJS 및 UMD 파일을 ESM으로 불러올 수 있도록 변환함
- 별도의 설정이 없이 다양한 리소스 `import` 가능
- [CSS 빌드 최적화](https://vitejs-kr.github.io/guide/features.html#build-optimizations)
    - `Direct Import` 구문에 대해 `Preload` 하도록 함으로써, 네트워크 비용 줄임

### 주의 해야 할 점

**vites는 기본적으로 ES6을 타겟으로 번들을 생성합니다.**  
따라서 ES5이하로 타겟을 잡으려면 별도로 polyfill를 다뤄야 합니다.
그래도 공식적으로 [`@vitejs/plugin-legacy`](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) 플러그인을 제공 해줍니다.

**vite는 기본적으로 `<root>/index.html` 파일이 빌드를 위한 진입점입니다.**  
순수한 JS 번들을 생성하기 위해서는 [`라이브러리 모드`](https://vitejs-kr.github.io/guide/build.html#library-mode)를 설정해야 합니다.  
( 3.2.0 에서야 멀티 entry를 지원하게 되어 고생한 기억이 있습니다... )


---

#NodeJS #Frontend #Vite #React #Vue  

---



