기본적으로 Nuxt는 많은 use case로 구성됩니다.
`nuxt.config.ts` 파일은 overrride를 할 수 있으며 또는 상속 받을 수 있다. 기본적인 configureation을 통해서

# Nuxt Configuration
`nuxt.config.ts` 파일은 Nuxt 프로젝트의 root에 위치 해 있습니다.
Nuxt 프로젝트는 override 또는 어플리케이션의 구성들을 상속 할수 있습니다.

최소한의 configuration 파일은 `defineNuxtConfig` function에 너의 configuration file을 포함해서export를 하고 있다.
`defineNuxtConfig` helper는 전역적으로 import 없이 가능하다.

```ts
export default defineNuxtConfig({
  // My Nuxt config
})
```

:::tip 해당 파일은 자주 언급이 될 것이다. 커스텀 script, modules 등록 또는 렌더링 모드를 바꾸는 것 등등으로

:::

:::info 너가 Nuxt build시 TypeScript 가 필요 없다고 할 수도 있다.
하지만, `nuxt.config`파일의 `.ts` 상속은 매우 강력하게 권장하고 있는 요소이다.\
이 방식을 사용하면 너는 IDE를 통해서 type과 실수를 피할 수 있다. 너가 configuration을 수정하는 동안에

:::

## 환경 overrides
완전히 유형 화 된 환경 별로 재 정의가 가능하다. 너의 `nuxt.config` 파일을 통해서

```ts
export default defineNuxtConfig({
  $production: {
    routeRules: {
      '/**': { isr: true }
    }
  },
  $development: {
    //
  }
})

```

:::info `$meta` 레이어를 작성하는 경우 키를 사용하여 사용자 또는 레이어 소비자가 사용할 수 있는 메타 데이터를 제공할 수도 있습니다.

:::

## 환경 변수 및 개인 토큰
`runtimeConfig` API는 환경 변수와 같은 애플리케이션의 나머지 부분에 노출한다.
기본적으로 이러한 키는 **서버 측에서만 사용**할 수 있다.
내부 키는 `runtimeConfig.public` 클라이언트 측에서도 사용할 수 있다.

```ts
export default defineNuxtConfig({
  runtimeConfig: {
    // The private keys which are only available server-side
    apiSecret: '123',
    // Keys within public are also exposed client-side
    public: {
      apiBase: '/api'
    }
  }
})
```
`nuxt.config.ts`
```env
# This will override the value of apiSecret
NUXT_API_SECRET=api_secret_token
```
`.env`

이러한 변수는 `useRuntimeConfig()` composable을 사용하여 애플리케이션의 나머지 부분에 노출 합니다.
```vue
<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
</script>

```

# App Configuration
`app.config.ts` 파일은 source 파일(root 디텍토리)에 위치해 있다.
이건 빌드 시 결정 될 수 있는 공용 변수를 노출하는데 사용됩니다.

`runtimeConfig`의 옵션과 달리 이는 환경 변수의 재정의가 불가능하다 

최소한의 configuratoin file은  너의 configuration을 포함한 `defineAppConfig` function을 export 한다
```ts
export default defineAppConfig({
  title: 'Hello Nuxt',
  theme: {
    dark: true,
    colors: {
      primary: '#ff0000'
    }
  }
})

```

이 변수는 `useAppConfig` Composable을 사용함으로서 어플리케이션의 나머지에서 노출 할 수 잇다.
```vue
<script setup lang="ts">
const appConfig = useAppConfig()
</script>

```

# `runtimeConfig` vs `app.config`
위에서 설명한 대로, `runtimeConfig` 및 `app.config` 둘 다 변수를 애플리케이션의 나머지 부분에 노출하는데 사용됩니다.
둘 중 하나를 사용해야 하는지 결정하려면 다음 몇 가지를 따르면 됩니다.\

- `runtimeConfig` : 환경 변수를 사용하여 빌드 후 지정해야 하는 개인 또는 공용 토큰 입니다.
- `app.config` : 빌드 시 결정되는 공개 토큰, 테마 변형과 같은 웹 사이트 구성 제목 및 민감하지 않는 프로젝트 구성입니다.

| 특징                     | `runtimeConfig` | `app.config` |
| ---------------------- | --------------- | ------------ |
| Client Side            | Hydrated        | Bundled      |
| 환경 변수                  | ✅ Yes           | ❌ No         |
| 반응성                    | ✅ Yes           | ✅ Yes        |
| 타입 지원                  | ✅ Partial       | ✅ Yes        |
| 요청 별 구성 가능             | ❌ No            | ✅ Yes        |
| 빠른 모듈 교체               | ❌ No            | ✅ Yes        |
| Non primitivie JS type | ❌ No            | ✅ Yes        |
# 외부 구성 파일
Nuxt는 파일을 구성에 대한 단일 정보 소스로 사용하고, 외부 구성 파일 읽기는 건너 뜁니다.
프로젝트를 빌드 하는 동안 이를 구성할 수도 있습니다.
아래는 일반적인 구성과 해당 되는 경우 Nuxt로 구성할 수 있는 방법이 강조 되어있습니다.

| 이름      | 구성 파일               | 구성 방법                               |
| ------- | ------------------- | ----------------------------------- |
| Nitro   | `nitro.config.ts`   | `nuxt.config`에서 nitro 키를 사용해서 구성    |
| PostCSS | `postcss.config.js` | `nuxt.config`에서 postcss 키를 사용해서 구성  |
| Vite    | `vite.cofnig.ts`    | `nuxt.config`에서 vite를 키로 사용해서 구성    |
| Webpack | `webpack.config.ts` | `nuxt.config`에서 webpakc을 키로 사용해서 구성 |

다른 공통 config 파일은 아래에 있습니다.

| 이름              | 구성 파일                | 구성 방법                                                            |
| --------------- | -------------------- | ---------------------------------------------------------------- |
| **TypeScript**  | `tsconfig.json`      | https://nuxt.com/docs/guide/concepts/typescript#nuxttsconfigjson |
| **ESLint**      | `eslint.config.js`   | https://eslint.org/docs/latest/use/configure/configuration-files |
| **Prettier**    | `.prettierrc.json`   | https://prettier.io/docs/en/configuration.html                   |
| **Stylelint**   | `.stylelintrc.json`  | https://stylelint.io/user-guide/configure                        |
| **TailwindCSS** | `tailwind.config.ts` | https://tailwindcss.nuxtjs.org/tailwind/config                   |
| **Vitest**      | `vitest.config.ts`   | https://vitest.dev/config                                        |

---

#NodeJS #Nuxt #JavaScript #Nuxt3 #FrontEnd 

---