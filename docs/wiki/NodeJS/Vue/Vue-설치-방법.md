---
slug: "Vue-설치-방법"
---
# CDN
- 프로토 타이핑 또는 학습 목적이라면, 아래 코드로 최신 버전을 사용하면 됩니다.
```javascript
<script src="https://unpkg.com/vue@next"></script>
```

# npm
- Vue를 사용하여, 대규모 애플리케이션을 구축할 때, NPM을 이용한 설치를 권장하고 있습니다. NPM은 WebPack 또는 Browserfiy와 같은 모듈 번들러와 잘 작동합니다.
- Vue는 싱글 파일 컴포넌트를 만들기 위한 도구로 제공합니다.

```bash
# latest stable
npm install vue@next
```

# CLI
- Vue.js는 공식 CLI를 제공합니다.
- Vue3의 경우 `npm`에서 `@vue/cli`로 제공되는 Vue CLI v4.5를 이용해야 합니다.
- 업그레이드를 하려면 최신 버전의 `@vue/cli`를 전역으로 다시 설치해야 합니다.
```bash
yarn global add @vue/cli
# 또는 
npm install -g @vue/cli
vue create [프로젝트명]
```

## Vite 기반 Vue3 프로젝트 만들기
```shell
npm init vue
```

----

#NodeJS #Vue #FrontEnd #Vue2

----