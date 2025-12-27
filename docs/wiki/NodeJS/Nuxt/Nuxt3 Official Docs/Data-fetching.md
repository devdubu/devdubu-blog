---
slug: "Data-fetching"
---
Nuxt에서 데이터를 API로 불러오는 방법은 3개 정도가 존재한다.
axios가 아닌 nuxt에서 권장하는 방식이기 때문에, SSR의 특성을 살려서 개발이 가능하다.

## useFetch
composable API가 나오면서 그에 특화된 데이터 불러오는 함수 입니다.
nuxt의 특성상 setup에 axios를 단순히 배치 하게 된다면, 두 번 불러오게 됩니다.
이에 대한 이유는

:::tip SSR에서 Client와 Back Server와 연결점이 없기에, 해당 로직을 두번 불러오는 것입니다.

:::

이를 방지하기 위해 `useFetch` 를 사용하지만, 이는 주의사항이 있습니다.

:::warning 주의 사항
- setup 에서만 사용할 것
- 그 이외의 곳에서 사용한다면, hook 등 오류가 발생합니다.
- reactivity로 작동됩니다.
- `form` 태그로 묶여있는 computed 변수라면, 해당 변수를 reactivity로 작동되어 reactivity로 api가 날라간다

:::

즉, `useFetch` 자체는 composition api 에서 사용 되는 게 아니라면, 사용하는 것은 어렵다고 생각이 든다.
특히 함수에서 이벤트로 제어되는 경우 `useFetch`는 사용 할 수 없다.

## $fetch
`useFetch`와 유사 해 보이지만, 용도 자체는 명확히 완전히 다르다.
`useFetch` 는 composable API 전용으로 나왔다면, `$fetch` 자체는 함수, 또는 hook에서 사용하라고 나와 있는 것이다.

- 즉, 만약에 `$fetch`를 composable API 쪽에 사용된다면, **두 번** 호출 되게 됩니다.
- 이를 방지하기 위에 아래 `useAsyncData` 를 같이 병행해서 사용하므로 두 번 호출을 막습니다.

## useAsyncData
`useAsyncData` 결과 값이 비동기 로직으로 쌓여져 있을 때 한번만 리턴 합니다 

:::success `useFetch(url)` === `useAsyncData(url, ()=> $fetch(url))`

:::

아래 코드는 `useFetch` 어떤 식으로 사용하는지에 대해서 예시로 나와있습니다.
CMS 또는 외부 라이브러리에서 지공하는 우리의 쿼리 layer에서 


```ts
<script setup lang="ts">
const { data, error } = await useAsyncData('users', () => myGetFunction('users'))

// This is also possible:
const { data, error } = await useAsyncData(() => myGetFunction('users'))
</script>

```

`useAsyncData` 를 감싸서 사용이 가능하다
그리고 컴포저블에서의 이점이 여전히 유지 된다
:::tip `useAsyncData`
- `useAsyncData` 는 unique key를 캐시의 두번째 response 인자를 query 함수로 사용합니다. 
- 해당 키는  직접적으로 전달하는 쿼리 func을 무시 할 수 있다, 해당 키는 자동으로 만들어집니다.
- 자동으로 만들어진 키는 오직 호출된 파일만 고려합니다, 그러므로 사용자 지정 구성이 가능한 랩핑을 만들어 원치 않는 동작을 방지하기 위해 항상 고유한 키를 만드는 것이 좋습니다.
- 키를 설정하면 구성 요소 간에 동일한 데이터를 공유하거나 특정 데이터를 새로 고치는데 유용할 수 있습니다.

:::

```vue
<script setup lang="ts">
const { id } = useRoute().params

const { data, error } = await useAsyncData(`user:${id}`, () => {
  return myGetFunction('users', { id })
})
</script>

```

`useAsyncData` 컴포저블은 좋은 방법이다. 그리고 다중 `$fetch` 요청을 감싸기에 좋은 요청이다.
```vue
<script setup lang="ts">
const { data: discounts, pending } = await useAsyncData('cart-discount', async () => {
  const [coupons, offers] = await Promise.all([
    $fetch('/cart/coupons'),
    $fetch('/cart/offers')
  ])

  return { coupons, offers }
})
// discounts.value.coupons
// discounts.value.offers
</script>

```

## Return Value
`useFetch`와 `useAsyncData` 는 아래의 리턴 값을 가집니다.
### `data`
- 비동기 함수의 결과
### `pending`
- 데이터가 아직 가져오는 중인지에 대한 여부를 나타내는 Boolean 타입의 변수 입니다.
### `refresh / execute`
- 함수에서 반환된 데이터를 새로 고치는 데 사용할 수 잇는 `handler` 함수 입니다.
### `clear`
- `data` => `undefined`
- `error` => `null`

---

#NodeJS #Nuxt #JavaScript #Nuxt3 #FrontEnd 

---