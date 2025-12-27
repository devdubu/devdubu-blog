---
Start Date: 2025-05-13
End Date: 2025-05-13
대분류: Study
구분: NodeJS
tags: [javascript, frontend]

slug: "바닐라-JS-를-통한-multi-framework-지원-설계"
---


## ✅ 목표 정리

- 의존성을 최소화하고,
- Vue/Nuxt 등 다양한 프레임워크에서 재사용 가능하게 만들되,
- 빠르게 개발 가능하고,
- 장기적으로 유지보수 및 하위 호환성도 고려된,
- "UI 컴포넌트 + 옵션 기반 설정 시스템" 패키지

---

## 🧩 당면한 현실적 문제들

|문제|설명|
|---|---|
|❗ 프레임워크 종속|Nuxt/Vue 기능(store 등)을 쓰는 쪽과 분리 안되면 package 확장이 어려움|
|❗ 빠른 개발 필요|실시간 기능, 함수 props 등은 vanilla에선 구현량 ↑|
|❗ 옵션 호환성 문제|옵션 구조가 변경되면 하위 호환 유지, deprecated 관리 필요|
|❗ 의존성 문제|Vue/PrimeVue 등 의존 시 프로젝트 빌드 충돌·중복 가능성|
|❗ 새 프레임워크 대응|React/Nuxt 등 대응을 위한 인터페이스 계층 필요|

---

## 🧱 추천 구조 (의존성 최소 UI 패키지 설계)

### 1. **Core (Vanilla) Layer** - 완전 프레임워크 독립

```bash
packages/ui-core/
├─ components/
│  └─ Button.js / button.css
├─ themes/
│  └─ dark.css / light.css
├─ utils/
│  └─ event.js / dom.js
├─ config/
│  └─ defaultOptions.js
├─ index.js

```
- ✅ HTML/CSS/JS로 구성
- ✅ CustomEvent 기반 인터랙션 제공 (`dispatchEvent`, `addEventListener`)
- ✅ 옵션은 JSON 기반, 내부적으로만 사용


### 2. **Framework Adapter Layer** (Vue, React 등)
```bash
packages/ui-vue/
├─ components/
│  └─ Button.vue ⬅️ 내부적으로 ui-core 버튼 래핑
├─ plugin.ts        ⬅️ Nuxt 플러그인 호환
├─ composables/
├─ types/
├─ index.ts
```

- ✅ core의 DOM 기반 구성 요소를 래핑
- ✅ reactive props → core의 옵션으로 변환
- ✅ Vue만 의존 (core와 분리)
- ✅ 필요 시 Nuxt-specific 기능도 이 레이어에 만 위치


---

## 🧩 옵션 변경 & 하위 호환을 위한 구조

1. `defaultOptions`를 버전별 관리
```ts
// v1
export const defaultOptionsV1 = { darkMode: false }
// v2
export const defaultOptionsV2 = { darkMode: 'auto' }
```
2. deprecated 옵션 사용 시 warning
```ts
function normalizeOptions(opts) {
  if ('darkMode' in opts && typeof opts.darkMode === 'boolean') {
    console.warn('darkMode: boolean is deprecated. Use "auto" | "dark" | "light" instead.')
  }
  ...
}

```
2. 변경 이력 문서화 & `CHANGELOG.md` 필수 관리  
    → Conventional Commits 방식 + [changesets](https://github.com/changesets/changesets) 도구 추천
    

---

## 🔌 기술 의존성 관리

- `peerDependencies`로 프레임워크만 요구하도록 설정
```json
{
  "peerDependencies": {
    "vue": "^3.0.0"
  }
}
```
- core 레이어는 `dependencies` 없이 빌드 가능하도록 유지
- `vite-plugin-dts` 또는 `rollup` + `tsup` 으로 multi-format 번들링


---

## 📚 참고할 만한 실제 사례들

|프로젝트|특징|
|---|---|
|[Shoelace](https://shoelace.style/)|Web Components 기반의 프레임워크 독립 UI. HTML/JS/CSS로 구성됨|
|[Radix UI](https://www.radix-ui.com/)|Headless UI. React 전용이지만 adapter 구조가 우수함|
|[Vanilla Extract](https://vanilla-extract.style/)|프레임워크 무관한 CSS-in-TypeScript|
|[UNOCSS](https://github.com/unocss/unocss)|Nuxt/Vue/React 등 다중 프레임워크 대응하는 모듈 설계 참고 가능|
|[Bento UI](https://bento.design/) (도입 중)|Web Components + 프레임워크 어댑터 전략 추구|

[실제 구현 JS 예제](https://github.com/unocss/unocss/blob/main/packages-engine/core/src/utils/map.ts)


---

## 🧠 추가 팁

- **Composable Props Pattern**  
    → core에선 `options` JSON을 받게 하고, adapter에서는 각 프레임워크 스타일로 분리된 props로 분해
- **자동 문서화**  
    → 옵션 구조가 복잡해질수록 [Typedoc](https://typedoc.org/)이나 `jsdoc + vitepress` 조합으로 문서 자동화 추천
- **배포 전략**  
    → Lerna/Changesets 기반 Monorepo + 독립 버전 배포

---

## 🔚 결론

현재 상황에선 빠르게 `Vue Adapter → core 구성요소 → 옵션 기반 렌더링` 구조를 도입하면서,  
장기적으로는 Web Component 또는 Custom DOM 기반으로 옮겨가면 "프레임워크 독립 + 재사용 가능 + 적절한 추상화"라는 세 마리 토끼를 잡을 수 있습니다.

---

필요하시면 제가 위에 말한 구조에 대한 샘플 Monorepo를 만들어드릴 수도 있고,  
`Button`, `Modal`, `ConfigProvider` 정도로 샘플 패키지 설계도 도와드릴게요.  
언제든지 말씀 주세요!


좋아요! 여기서 말한 구조를 Vue에서 실제로 사용할 수 있는 형태로 보여드릴게요. 목표는 다음과 같습니다:

- `ui-core` 패키지에 `HTML/JS`로 만든 `<ui-button>` 웹 컴포넌트가 있음.
- Vue에서 이걸 감싸서 사용하고, `v-model`처럼 값이 바뀌면 반영되도록 함.

---

## 📦 1. core: `ui-core/button.js`

```js
// packages/ui-core/button.js
export class UIButton extends HTMLElement {
  constructor() {
    super()
    this._value = 0
    this.addEventListener('click', this._handleClick.bind(this))
  }

  connectedCallback() {
    this.render()
  }

  _handleClick() {
    this._value += 1
    this.dispatchEvent(
      new CustomEvent('update:value', {
        detail: this._value,
        bubbles: true,
        composed: true,
      })
    )
    this.render()
  }

  render() {
    this.innerHTML = `<button>${this.getAttribute('label') || 'Click'} (${this._value})</button>`
  }

  static get observedAttributes() {
    return ['label']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render()
    }
  }
}

customElements.define('ui-button', UIButton)

```

📌 빌드 없이 사용 가능하며, 커스텀 이벤트를 통해 값(`update:value`)을 Vue로 전달합니다.

---

## 💠 2. vue-adapter: `UiButton.vue`

```vue
<!-- packages/ui-vue/UiButton.vue -->
<template>
  <ui-button
    ref="el"
    :label="label"
    @update:value="handleUpdate"
  />
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'

defineProps({
  label: String,
  modelValue: Number
})

const emit = defineEmits(['update:modelValue'])
const el = ref(null)

const handleUpdate = (e) => {
  emit('update:modelValue', e.detail)
}

// 기본값 적용
onMounted(() => {
  if (el.value && typeof modelValue === 'number') {
    el.value._value = modelValue
    el.value.render()
  }
})
</script>

```
---

## 🧪 3. 사용 예시 (Nuxt/Vue 프로젝트)

```vue
<template>
  <div>
    <UiButton v-model="count" label="Add" />
    <p>Count: {{ count }}</p>
  </div>
</template>

<script setup>
import UiButton from 'ui-vue/UiButton.vue'
import { ref } from 'vue'

const count = ref(0)
</script>

```


---

## 🔧 빌드 없이 테스트하려면?

1. 브라우저가 직접 인식하도록 `ui-core` 내 `button.js`를 CDN으로 쓰거나 Vite alias 등록.
2. Nuxt/Vite에선 `vite.config.ts`에 다음처럼 설정:

```ts
export default defineConfig({
  resolve: {
    alias: {
      'ui-core': '/packages/ui-core'
    }
  }
})

```

---

## ✅ 장점 요약

|항목|설명|
|---|---|
|🎯 웹 표준 사용|커스텀 이벤트 + 웹 컴포넌트|
|🧱 Vue와 분리|`ui-core`는 독립 실행 가능|
|🔄 양방향 연동|`v-model`과 `CustomEvent('update:value')` 연결|
|⚙️ 유지보수 분리|디자인/로직을 core에 집중, Vue에선 adapter만 작성|

---

필요하시면 React용 adapter도 비슷한 방식으로 만들어 드릴 수 있어요.  
이 구조가 마음에 들면, Monorepo로 확장하거나 CLI 템플릿까지 도와드릴 수 있습니다!

## 🎯 Store 대체 예시

### 📦 `ui-core/state.js`

```js
// packages/ui-core/state.js
export const createState = (initialValue = 0) => {
  let value = initialValue
  const listeners = new Set()

  return {
    get value() {
      return value
    },
    set(newValue) {
      value = newValue
      listeners.forEach((fn) => fn(value))
    },
    subscribe(fn) {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
  }
}

```

### 🤖 `ui-core/counter.js`

```js
import { createState } from './state.js'

const state = createState(0)

export class UICounter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<button>Count: ${state.value}</button>`
    this._unsubscribe = state.subscribe((val) => {
      this.querySelector('button').innerText = `Count: ${val}`
    })
    this.querySelector('button').addEventListener('click', () => {
      state.set(state.value + 1)
    })
  }

  disconnectedCallback() {
    this._unsubscribe?.()
  }
}

customElements.define('ui-counter', UICounter)

```