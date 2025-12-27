---
sticker: vault//이미지/개발 로고/TechIconSVG/Vue.js.svg
시작 날짜: 2025-06-10
종료 날짜: 2025-06-10

slug: "Dialog-Movable-Code"
---
```vue
<template>
	<div v-if="props.visible" class="dimmedWrap">
		<div class="popup_overlay" :data-screenid="props.screenid" :style="{ ...dialogStyle, ...dialogSize }">
			<div ref="popupWrapRef" class="popupWrap">
				<div ref="titleRef" class="popupWrap_titleArea" @mousedown="HandleMousedownMoveStart">
				<div class="popup_overlay_title">
					{{ props.title ?? '' }}
				</div>
				<div class="popupWrap_rightArea">
					<button v-show="isMaximalizable" type="button" class="btn_fullScreen screenReset" @click="handleClickFullScreen">
					<span class="hide">fullScreen</span>
					</button>
					<button type="button" class="btn_close" @click="handleClickClose">
						<span class="hide">close</span>
					</button>
				</div>
			</div>
				<div class="popupWrap_contentArea">
					<div class="popupWrap_contentBox">
						<slot />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

  

<script lang="ts" setup>

import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue' // 'ref', 'computed', 'watch', 'onMounted', 'onBeforeUnmount' import 확인
import { UIType } from '../../type-list'
import type { IDialogPopup } from './NDialog.type'

const props = withDefaults(defineProps<IDialogPopup>(), {
	type: UIType.DIALOG,
	name: 'dialogName',
	title: '',
	width: 800,
	height: 600,
	top: 0,
	left: 0,
	visible: false,
	fullscreen: false,
	maximalizable: false,
	dialogCnt: 0,
	dialogIdx: 0,
})

  

const emits = defineEmits(['close'])

// ------------- info ----------------

const dialogVisible = ref(props.visible)
  
// ------------- position & size ----------------
const dialogX = ref(props.left) // props.left 초기값으로 설정
const dialogY = ref(props.top) // props.top 초기값으로 설정

const offsetX = ref(0)
const offsetY = ref(0)

const isDragging = ref(false)

const dialogSize = ref({ width: props.width + 'px', height: props.height + 'px' })
const beforeDialogSize = { width: dialogSize.value.width, height: dialogSize.value.height } // 이 값은 드래그로 변하지 않으므로 const로 유지

const isMaximalizable = ref(true)

// ⭐ popupWrapRef 추가 (실제 다이얼로그 본체를 참조)

const popupWrapRef = ref<HTMLElement | null>(null) // popupWrap 요소를 참조할 ref

const dialogStyle = computed(() => {
	return {
		transform: `translate(${dialogX.value}px, ${dialogY.value}px)`,
	}
})

  

const initPosition = (fullEvent = false) => {
	const dialogEl = popupWrapRef.value // 실제 다이얼로그 본체
	if (!dialogEl) return // 아직 DOM에 마운트되지 않았으면 리턴


	let currentWidth = dialogEl.offsetWidth
	let currentHeight = dialogEl.offsetHeight
	if (fullEvent) {
		dialogSize.value.width = beforeDialogSize.width
		dialogSize.value.height = beforeDialogSize.height
		currentWidth = parseInt(beforeDialogSize.width)
		currentHeight = parseInt(beforeDialogSize.height)
	}

	// 다이얼로그의 실제 너비와 높이를 가져옵니다.
	
	const baseTop = (window.innerHeight - currentHeight) / 2
	const baseLeft = (window.innerWidth - currentWidth) / 2
	
	// props.top, props.left가 있을 경우 해당 값을 사용
	
	dialogY.value = props.top || props.top === 0 ? props.top : baseTop
	dialogX.value = props.left || props.left === 0 ? props.left : baseLeft
	
	dialogY.value -= currentHeight / 2
	dialogX.value -= currentWidth / 2

}

  

const isfullScreen = ref(props.fullscreen ?? false) // ref로 변경

const handleClickFullScreen = () => {
	isfullScreen.value = !isfullScreen.value
	if (isfullScreen.value) {
		setfullScreenPosition()
	} else {
		initPosition(true) // 전체 화면 해제 시 초기 위치로
	}
}

  

const setfullScreenPosition = () => {
	// 전체 화면 시 위치 및 크기 설정
	dialogSize.value.width = window.innerWidth + 'px'
	dialogSize.value.height = window.innerHeight + 'px'
	
	// ⭐ initPosition 로직 변경: dialogX, dialogY를 업데이트하여 computed 속성이 반응하도록
	const dialogEl = popupWrapRef.value // 실제 다이얼로그 본체
	if (!dialogEl) return // 아직 DOM에 마운트되지 않았으면 리턴
	
	// 다이얼로그의 실제 너비와 높이를 가져옵니다.
	const currentWidth = window.innerWidth
	const currentHeight = window.innerHeight
	
	const baseTop = (window.innerHeight - currentHeight) / 2
	const baseLeft = (window.innerWidth - currentWidth) / 2
	// props.top, props.left가 있을 경우 해당 값을 사용
	dialogY.value = props.top || props.top === 0 ? props.top : baseTop
	dialogX.value = props.left || props.left === 0 ? props.left : baseLeft
	
	dialogY.value -= currentHeight / 2
	dialogX.value -= currentWidth / 2
}

const titleRef = ref<HTMLElement | null>(null) // popupWrap_titleArea 요소를 참조할 ref


const HandleMousedownMoveStart = (event: MouseEvent): EventListenerOrEventListenerObject | null => {
	if (!titleRef.value || !titleRef.value.contains(event.target as Node)) {
		return null // 타이틀 바 영역이 아니면 드래그 시작하지 않음
	}

	const dialogEl = popupWrapRef.value // 실제 다이얼로그 본체
	// 다이얼로그의 실제 너비와 높이를 가져옵니다.	
	if (dialogEl !== null) {
		dialogSize.value.width = dialogEl.offsetWidth + 'px'	
		dialogSize.value.height = dialogEl.offsetHeight + 'px'
	}

	isDragging.value = true
	
	offsetX.value = event.clientX - dialogX.value
	offsetY.value = event.clientY - dialogY.value
	
	document.addEventListener('mousemove', doDrag)
	document.addEventListener('mouseup', stopDrag)
	
	event.preventDefault()

	return null
}

const getNumberFromString = (str: string): number => {
	const match = str?.match(/-?\d+/)
	return match ? Number(match[0]) || 0 : 0
}

  

// 드래그 중 함수

const doDrag = (event: MouseEvent) => {

// 타입 수정

if (isDragging.value) {
	// 새로운 다이얼로그 위치 계산
	// 마우스의 현재 위치에서 드래그 시작 시의 오프셋을 빼줍니다.
	dialogX.value = event.clientX - offsetX.value
	dialogY.value = event.clientY - offsetY.value
	}
}

// 드래그 종료 함수 (이전과 동일)
const stopDrag = () => {
	isDragging.value = false
	document.removeEventListener('mousemove', doDrag)
	document.removeEventListener('mouseup', stopDrag)
}

// ------------- actions ----------------

const handleClickClose = () => {
emits('close', false)
}

// ------------- init ----------------

const childParam = ref({})

// props.visible 변화 감지
watch(
	() => props.visible,
	(newVisible) => {
		if (newVisible) {
			childParam.value = { ...props.param }
			// ⭐ 가시성이 true가 될 때만 초기 위치 설정
			if (!isfullScreen.value) {
			// 전체 화면이 아닐 때만
			// DOM이 렌더링된 후에 initPosition 호출을 보장
				nextTick(() => {
					initPosition()
				})
			}
		}
	},
	{ immediate: true }
) // 컴포넌트 초기 렌더링 시에도 watch 실행
  

onBeforeUnmount(() => {
	// 전역 이벤트 리스너는 항상 정리
	document.removeEventListener('mousemove', doDrag)
	document.removeEventListener('mouseup', stopDrag)
})
</script>
```