---
slug: "Nuxt-Testing-Tools"
---
# Vitest
- Vitest 자체적으로 지원하는 api 들도 있지만, 대부분은 프레임워크에 종속적인 것을 깨닫게 되었다.
- 해당 테스트 옵션을 설정하는 것들은 결국은 nuxt 자체적으로 runtime이 돌아가야하므로, 해당 nuxt를 먼저 설정한 다음에서야 그나마, 돌아간다는것이다.

- 지금은 현재 nuxt3 환경에서 vitest를 사용할 때의 테스트 환경을 작성하고 있다.
```ts
import { defineVitestConfig } from '@nuxt/test-utils/config'
export default defineVitestConfig({
    test: {
        environment: 'nuxt',
        // globals: true,  
        environmentOptions: {
            nuxt: {
                domEnvironment: 'jsdom',
            },
        },
    },
})
```
`vitest.config.ts`

현재는 위의 config 파일을 작성 중이다.

해당되는 옵션들을 보게 된다면, option중에서는 `configFile` 이라는 옵션이 존재한다.
GPT와 이곳 저곳을 둘러보면서 얻은 지식으로 아래의 코드를 작성했더니
```ts
// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { rel: 'stylesheet', href: 'https://example.com/styles.css' }
      ],
      script: [
        { src: 'https://example.com/script.js', async: true }
      ],
      title: 'My Nuxt Application'
    }
  }
});

```
test 코드가 난리가 났다.
상단 `vitest.config.ts` 파일에 위 파일을 명시했더니 난리가 났다.
이유는 nuxt의 공식 문서를 보고 알 수 있었다.

configFile을 작성하지 않으면 기본적으로 `nuxt.config.ts`를 바라본다.
라는 말에 끝나 버렸다.

대부분은 file import error 였는데 당연하게도 해당 `nuxt.config.ts`에 해당 파일에 대한 설정과 auto import 설정까지 쫙 되어
있으니까 그런거다.

즉, 그냥 건들지 말자 ^^
근데 왜 안되냥나ㅣ머;ㅣㅏ러ㅣ망널ㅇㄴㅁ
포기

### 원인 1
- 별 짓을 해도 안되는걸 보고, 근본적으로 mount에 대한 의심이 들기 시작했다.
- vue test util 쪽의 한계로 느껴지는게 보인다.
- 기본적으로 `<template></template>` 안쪽에 있는 것만 렌더링 하는 것이 느껴진다.
- Vue test util 쪽을 찾아봐야겟다.



# JSDOM
우리 gpt 느님께서 자꾸 jsdom 무새를 하길래
뭔지 조사를 좀 해봐야겠다




---

#NodeJS #Test #Vitest #JavaScript 

---





