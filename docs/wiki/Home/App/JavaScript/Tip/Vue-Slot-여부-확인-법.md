---
sticker: vault//이미지/개발 로고/TechIconSVG/Vue.js.svg
시작 날짜: 2025-05-19
종료 날짜: 2025-05-19
분류: 노트
카테고리:
  - Application
특징:
  - Front

slug: "Vue-Slot-여부-확인-법"
---
# useSlot

```vue
<template>  
	<div>  
	<h1>슬롯 예시</h1>  
	<!-- 슬롯이 전달되었는지 확인 -->  
	<div v-if="slotContent">  
		{{ slotContent }}  
	</div>  
	<!-- 슬롯이 전달되지 않았을 때 표시할 컨텐츠 -->  
	<div v-else>슬롯이 전달되지 않았습니다.</div>  
	</div>  
</template>  
  
<script setup> 
import { useSlots } from 'vue';  

const slots = useSlots();  
const slotContent = slots.default?.()?.toString() || null; 

 
</script>
```