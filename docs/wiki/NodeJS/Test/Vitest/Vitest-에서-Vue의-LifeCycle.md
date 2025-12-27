---
slug: "Vitest-에서-Vue의-LifeCycle"
---
# Vue 환경에서 LifeCycle hook 제어 트러블 슈팅

```ts
import { it, expect, describe } from "vitest";

// ---cut---

// tests/components/SomeComponents.nuxt.spec.ts
import { mountSuspended, renderSuspended } from "@nuxt/test-utils/runtime";
import { shallowMount, mount } from "@vue/test-utils";
import { nextTick } from "vue";

import Grid from "./basic.vue";

describe(" ============<mark> Grid Test </mark>============ ", () => {
	it("can also mount an app", async () => {
		const component = await renderSuspended(Grid);
		const wrapper = mount(Grid);
		
		await nextTick();

		console.log(component.html());
		console.log(wrapper.html());
	}, 10000);
});
```
`grid.spec.ts`

```vue
<template>
	<div>
		{{ mountTest }}
	</div>
</template>

<script setup lang="ts">
const mountTest = ref('')

onMounted(() => {
	mountTest.value = '테스트다 이놈아'
})

</script>
```
![Screenshot-2024-07-01-at-10.27.12-PM.png](/img/이미지 창고/Screenshot-2024-07-01-at-10.27.12-PM.png)


```ts
<template>
	<div>
		{{ mountTest }}
	</div>
</template>

<script setup lang="ts">
let mountTest1 = ‘’
const mountTest = ref('')

onMounted(() => {
	const mountedTest2 = ‘테스트다 이’ // 이 부분에 변수를 생성하면 접근 자체가 되지 않는다.
	mountTest1 = ‘테스트다 이놈‘ // 해당 부분은 테스트에 mounted hook이 적용 되지 않는다.
	mountTest.value = '테스트다 이놈아'
})

</script>
```

---

#NodeJS #Test #Vitest #JavaScript 

---