`composables` 폴더는 Vue 컴포넌트 어플리케이션에 자동으로 import 됩니다.

## Usage
### 방법 1
```ts
export const useFoo = () => {
  return useState('foo', () => 'bar')
}
```
`/composables/useFoo.ts`
해당 `name`을 `export` 하거나 아래처럼 `export default` 로 우선 모듈화를 합니다.
### 방법 2
```ts
// It will be available as useFoo() (camelCase of file name without extension)
export default function () {
  return useState('foo', () => 'bar')
}

```


```vue
<script setup lang="ts">
const foo = useFoo()
</script>

<template>
  <div>
    {{ foo }}
  </div>
</template>
```

`composdables/` 디렉토리는 Nuxt는 코드에 추가적인 반응성을 제공하지 않습니다.
대신, composable 안에 있는 반응 성들(`ref` , `reactive`)은 Vue Composition API 메커니즘을 사용하여 달성 됩니다.
반응성 코드는 또한 `/composables` 디렉토리에 국한 되지 않습니다.

---

#NodeJS #Nuxt #JavaScript #Nuxt3 #FrontEnd 

---