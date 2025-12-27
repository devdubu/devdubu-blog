---
slug: "Node-Package-화"
---
# 차이점

실제 배포를 목적으로 하는 프로젝트와 Package화를 목적으로 하는 프로젝트의 근본적인 차이점은 **build 할 때**의 설정입니다.

사실상 배포 용 build 와 package용 빌드가 따로 있다고 생각해주시면 편합니다.

## `vite.config.ts`

우선 vite 환경에서 build와 가장 직접적인 연관이 있는 `vite.config.ts` 의 설정입니다.

```ts
export default defineConfig({
  ...,
  build: {
        lib: {
          // entry point 파일 지정
          entry: "src/index.ts",
          name: "hui",
          fileName: (format) => `index.${format}.js`,
          // ECAM Script Import 방식을 지원하기 위해서 필수적으로 넣어야할 format입니다.
          formats: ["es", "cjs"],
        },
        rollupOptions: {
          external: ["vue"],
          output: {
            globals: {
              vue: "Vue",
            },
          },
        },
      },
  ...,
})
```

build 설정을 제외한 다른 속성들은 제외하겠습니다.

→ 프로젝트 마다 vite.config.ts 는 다를 수 있기에, build 속성만 봐주시면 됩니다.

실제, Vue3 환경에서 기본적인 Entry Point는 `index.html` → `main.ts` 입니다.

즉, 별다른 속성이 없다면, 기본적을 `main.js`로 설정됩니다.

하지만, package화 에서는 main.js 보다는 component를 export하는 속성이 더 중요하기 때문에, entry point를 따로 지정 해야 합니다.

Entry Point의 파일을 `index.ts` 로 지정할 필요는 없습니다.

다른 파일로 지정해도 무방하나 관례적으로 사용하는 듯 하여, 일부러 index.ts를 기준으로 정하였습니다.

## `index.ts`


```ts
import { App, Plugin } from "vue";
import './assets/scss/base.scss'
import  HInputText  from './components/HInputText/index.vue'

const HUI: Plugin = {
  install(app: App) {
    // 컴포넌트 추가시 아래 처럼 추가 1
    app.component('HInputText', HInputText');
    ...
  }
}

export { 
  // 컴포넌트 추가시 아래 처럼 추가 2
  HInputText,
  ...,
}
export default HUI;
```

위 처럼 `index.ts` 를 지정하게 된다면, `HInputText` 의 컴포넌트를 외부 프로젝트에서 사용 가능하게 등록하게 됩니다.

외부로 노출해야할 컴포넌트들은 Plugin 안에 작성하고, 그 이후에 export 객체 안에도 작성하면 됩니다.

:::warning `export` 객체에 컴포넌트를 작성하지 않을 시에는, package 사용 처에서 등록이 되지 않습니다. 꼭 export 객체에도 작성 바랍니다.

:::

### 실제 사용처의 `main.ts`

#### 전역 등록 방법

사용처의 `main.ts`에서는 아래와 같이 Plugin을 등록 하게 되면, 전역으로 해당 Component들이 자동 등록 됩니다.

```ts
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'hui/dist/hui.css'
import App from './App.vue'
import router from './router'
import HUI from 'hui';

const app = createApp(App)

app.use(createPinia())
app.use(router)
// 전역 등록 시 해당 부분처럼 등록
app.use(HUI)

app.mount('#app')
```

```ts
console.log(app._context.components)
```

![Pasted-image-20250424151140.png](/img/이미지 창고/Pasted-image-20250424151140.png)

#### 부분 사용 등록 방법

```vue

<script setup lang="ts">
import { HInputText } from 'hui';

const inputTextConfig = {
  type: 'input-text',
  label: '키워드',
  name: 'PARAM_SEARCH',
  placeholder: '화면코드, 화면명, 화면 URL',
  width: '100%',
}
</script>

<template>
  <HInputText :conf="inputTextConfig"></HInputText>
</template>
```

만약 전역 등록을 하지 않고, 사용한다면, 위 처럼 Vue 파일 내에서 각자 import를 하면 됩니다.

## `package.json`

해당 파일도 기존 배포되는 프로젝트와는 차이점이 많이 있습니다.

### `dependencies` 의 부재

우선 기본적으로 `dependencies` 역할은 빌드 시에, 필수적으로 필요한 의존 패키지 목록 입니다.

배포가 되어야하는 프로젝트는 해당 `dependencies` 가 나열되어있지만, 패키지 화 해야 하는 프로젝트는 해당 란을 비워놔야합니다.

:::error 이유는 패키지 간 의존성 충돌 현상에 의한 것입니다.
- 간략하게 말하자면, `dependencies` 에 포함된 패키지들이 `npm build` 후에 node_modules에 배치가 되고,  
- 그 이후에 **커스텀 패키지**를 사용처 프로젝트 쪽에서 만약 해당 `dependencies` 와 **동일한 패키지**를 사용 시에,  
- **커스텀 패키지**에 있는 `dependencies` 와 **사용처 프로젝트**의 `dependencies` 간의 **충돌**이 일어나게 됩니다.
    

:::

즉, 패키지화 할 프로젝트는 `dependencies` 목록은 무조건 적으로 비워 놓고, 그 외에 `dependencies` 들만 채워 놓으면 됩니다.

### `devDependencies`

해당 의존성은 `npm run dev` 처럼 개발 모드 일 때만 적용되는 의존성 패키지로, `npm run build` 시에는 반영되지 않습니다.

그렇기 때문에, package화 진행할 프로젝트에서 주로 `devDependencies`에 필수 패키지를 설치하여 개발을 진행하게 됩니다.

### `peerDependencies`

해당 의존성은 `npm run` 명령어 자체에 반응하는 의존성은 아닙니다.

해당 의존성은 사용처 프로젝트에게 해당 목록에 있는 패키지를 필수적으로 설치 하라는 경고의 의미를 부여해줍니다.

즉, 해당 의존성 목록을 작성하는 것은 옵션이지만, 기본적으로 설치 및 버전 충돌이 일어날 수도 있는 패키지들이 존재한다면, 목록을 작성해주는 것이 좋습니다.

# 현재 HUI `Package.json` 구조

```json
{
  "name": "hui",
    "version": "0.0.2",
    "private": false,
    "publishConfig": {
      "registry": "http://192.168.245.126:9081/repository/npm-hosted/"
    },
    "type": "module",
    "scripts": {
      "dev": "vite",
      "build": "vue-tsc && vite build",
      ...,
    },
    "main": "dist/index.cjs.js",
    "module": "dist/index.es.js",
    "exports": {
      ".": {
        "import": "./dist/index.es.js",
        "require": "./dist/index.cjs.js",
        "style": "./dist/hui.css"
      },
      "./dist/hui.css": "./dist/hui.css"
    },
    "types": "dist/index.d.ts",
    "style": "dist/hui.css",
    "files": [
      "dist",
      "assets",
      "index.ts",
      "README.md"
    ],
    ...
  }
```

## 배포 URL 및 방식 설정

```json
{
  ...,
  "private": false,
    "publishConfig": {
      "registry": "http://192.168.245.126:9081/repository/npm-hosted/"
    },
  ...,
}
```

- `private` : 기본 값은 true 입니다. true일 때는 `npm publish` 라는 명령어가 적용되지 않으니, `false` 로 변경하면 됩니다.
- `publishConfig` : 배포를 할 곳에 대한 설정 정보 입니다. 기본 registry 주소는 [![](https://static-production.npmjs.com/da3ab40fb0861d15c83854c29f5f2962.png)npm | Home](https://www.npmjs.com/) 입니다.


## 각 타입 별 파일 경로 지정

```json
{
  ...,
  "main": "dist/index.cjs.js",
  "module": "dist/index.es.js",
  "types": "dist/index.d.ts",
  "style": "dist/hui.css",
  ...
}
```

위 각 객체들은 package 사용 시, 각 역할이 어떤 파일을 가르키는 지를 설정하는 란 입니다.

- 예를 들면, 해당 프로젝트에서 type들이 분포되어있는 부분은 `dist/index.d.ts` 라는 파일에 위치한다.
    

라는 의미 입니다.

## 외부 노출 옵션

```json
{
  ...,
  "exports": {
    ".": {
      "import": "./dist/index.es.js",
      "require": "./dist/index.cjs.js",
      "style": "./dist/hui.css"
    },
    "./dist/hui.css": "./dist/hui.css"
  },
  ...
}
```

상단 export 옵션은 해당 패키지의 외부 노출 방안을 설정하는 방법입니다.

즉, 사용처 프로젝트가 `import HUI from ‘hui'` 라는 import라는 객체를 사용 시에는, `index.es.js`로 진입점을 지정한다.

라는 의미 입니다.

나머지도 동일한 의미라고 생각하시면 됩니다.

## 업로드 파일 지정

```json
{
  ...,
  "files": [
    "dist",
    "assets",
    "index.ts",
    "README.md"
  ],
  ...
}
```

`files` 는 실제 npm package 에 반영할 때 어떤 파일들이 반영되서 올라갈건지에 대한 리스트 입니다.

즉, 이 부분에서 제외된 파일 및 폴더들은 npm 에 올라가지 않습니다.

이 부분은 `.npmignore` 랑 겹치는 부분이지만, `files`로 선언하는 것이 일반적이라도 합니다.

# 배포 경로 설정

실제 `publishConfig` 만 설정한다고 하여, 배포가 되는 것은 아닙니다.

사내 nexus 라는 Private Repository를 사용하고 있고, 권한 체크도 해야 하기에, 해당 계정 체크가 되어야만 `npm publish`를 통해서 package를 업로드 할 수 있습니다.

이는 `.npmrc` 파일을 최상위에 생성하여 아래와 같은 설정으로 프로젝트 별로 설정도 가능하고,

```
registry=http://192.168.245.126:9081/repository/npm/
http://192.168.245.126:9081/repository/npm/:username=hui
http://192.168.245.126:9081/repository/npm/:_auth=aHVpMDAh
//http://192.168.245.126:9081/repository/npm-hosted/:email=domain@hansol.com
//http://192.168.245.126:9081/repository/npm-hosted/:always-auth=true
```

## 전역 등록 방법

```shell
cat .npmrc
# 해당 명령어 입력 시 오류가 아닌 정상 출력이 뜰 경우 .npmrc를 제거해줍니다.
# 충돌 방지를 위한 제거 입니다.
rm .npmrc

# 이후 전역 토큰 재 등록을 진행합니다.
npm login --registry http://192.168.245.126:9081/repository/npm
```
