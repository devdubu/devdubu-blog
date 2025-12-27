---
sticker: vault//이미지/개발 로고/TechIconSVG/Nuxt-JS.svg

slug: "Props의-반응성"
---
# Component 내에서 props의 반응성 챙기기

:::tip 상황
- 기본적으로 `props`는 읽기 전용이다.
- 즉, `props`의 수정은 허용되지 않는다.
- 하지만, `props` 데이터가 수정이 만약 필요할 때는 컴포넌트 상에서 데이터를 가공하지만, 그 순간 `props`의 반응성을 잃어버린다.
- 이를 해결하는 방안을 아래에 작성할 것이다.

:::

## `computed` 속성 사용

```vue
<template>
  <TreeSelect
    :model-value="modelValue"
    :options="transformedOptions"
    @update:modelValue="$emit('update:modelValue', $event)"
    v-bind="$attrs"
  >
    <template v-for="(_, slot) in $slots" :key="slot" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </TreeSelect>
</template>

<script setup>
import { computed } from 'vue';
import TreeSelect from 'primevue/treeselect';

defineProps({
  modelValue: {
    type: [String, Object, Array],
    default: null,
  },
  options: {
    type: Array,
    default: () => [],
  },
});

defineEmits(['update:modelValue']);

// options를 가공하여 레이블을 대문자로 변환
const transformedOptions = computed(() => {
  return options.value.map(node => ({
    ...node,
    label: node.label.toUpperCase(),
    children: node.children?.map(child => ({
      ...child,
      label: child.label.toUpperCase(),
    })),
  }));
});
</script>
```

### 장점
- `props.options`가 변경될 때 `transformedOptions`가 자동으로 업데이트.
- 간단하고 선언적이며, 반응성 유지.
- 복잡한 가공 로직도 쉽게 처리 가능.

### 단점
- 읽기 전용이므로, 가공된 데이터를 수정하려면 별도의 상태 관리 필요.

:::note 데이터 가공이 단순하고, 결과가 읽기 전용으로 사용될 때

:::

## `ref`와 `watch`를 사용하여 반응성 상태 관리

```vue
<template>
  <TreeSelect
    :model-value="modelValue"
    :options="filteredOptions"
    @update:modelValue="$emit('update:modelValue', $event)"
    v-bind="$attrs"
  >
    <template v-for="(_, slot) in $slots" :key="slot" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </TreeSelect>
</template>

<script setup>
import { ref, watch } from 'vue';
import TreeSelect from 'primevue/treeselect';

const props = defineProps({
  modelValue: {
    type: [String, Object, Array],
    default: null,
  },
  options: {
    type: Array,
    default: () => [],
  },
});

defineEmits(['update:modelValue']);

// 가공된 데이터를 저장할 ref
const filteredOptions = ref([]);

// options 변경 감지 및 가공
watch(
  () => props.options,
  (newOptions) => {
    // 예: 레이블에 'Parent'가 포함된 노드만 필터링
    filteredOptions.value = newOptions.filter(node => node.label.includes('Parent')).map(node => ({
      ...node,
      label: `${node.label} (Filtered)`,
    }));
  },
  { immediate: true, deep: true }
);
</script>
```

### 장점
- `ref` 로 가공된 데이터를 수정 가능.
- 복잡한 비동기 가공(예: API 호출)이나 동적 로직 처리 가능.
- `watch`로 `props` 변경을 즉시 감지.

### 단점
- 코드가 `computed`보다 장황할 수 있음.
- `deep: true`는 성능에 영향을 줄 수 있으므로 주의.

:::note 가공된 데이터를 수정하거나, 비동기 작업이 필요한 경우

:::

## `reactive`와 `watch` 조합

```vue
<template>
  <TreeSelect
    :model-value="modelValue"
    :options="reactiveOptions.data"
    @update:modelValue="$emit('update:modelValue', $event)"
    v-bind="$attrs"
  >
    <template v-for="(_, slot) in $slots" :key="slot" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </TreeSelect>
</template>

<script setup>
import { reactive, watch } from 'vue';
import TreeSelect from 'primevue/treeselect';

const props = defineProps({
  modelValue: {
    type: [String, Object, Array],
    default: null,
  },
  options: {
    type: Array,
    default: () => [],
  },
});

defineEmits(['update:modelValue']);

// 반응성 객체
const reactiveOptions = reactive({ data: [] });

// options 변경 감지 및 가공
watch(
  () => props.options,
  (newOptions) => {
    reactiveOptions.data = newOptions.map(node => ({
      ...node,
      label: `Transformed: ${node.label}`,
      metadata: { processed: true },
    }));
  },
  { immediate: true, deep: true }
);
</script>
```

### 장점
- 복잡한 객체 구조를 반응성 있게 관리 가능.
- 객체 내부 속성을 수정해도 반응성 유지.
### 단점
- reactive 객체는 프록시로 관리되므로 디버깅이 약간 복잡할 수 있음.
- watch의 deep: true로 인한 성능 부담 가능.

:::note 가공된 데이터가 복잡한 객체 구조이고, 내부 속성을 수정해야 할 때.






:::
