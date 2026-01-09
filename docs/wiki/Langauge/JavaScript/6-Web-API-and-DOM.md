---
slug: "6-Web-API-and-DOM"
title: "6. Web API와 실전 예제"
---

# Web API와 실전 예제

:::info 개요
브라우저 환경에서 자주 사용되는 **Web API**(File, DOM)와 실전에서 유용한 코드 스니펫을 정리합니다.
:::

## 1. File API 활용

`input[type="file"]`로 얻은 `FileList` 객체는 배열(Array)처럼 보이지만, 실제로는 이터러블 객체입니다. `map` 같은 배열 메서드를 사용하려면 변환이 필요합니다.

### 1.1 FileList를 배열로 변환

```js
const fileInput = document.getElementById('myFileInput');
const fileList = fileInput.files; // FileList 타입

// 방법 1: Array.from() 사용
const fileArray1 = Array.from(fileList);

// 방법 2: 전개 구문(Spread Syntax) 사용
const fileArray2 = [...fileList];

fileArray2.map(file => console.log(file.name));
```

---

## 2. DOM 조작 실전 예제

### 2.1 드래그 가능한 다이얼로그 (Draggable Dialog)
마우스 이벤트를 활용하여 요소를 드래그하는 로직입니다. (Vue 3 Composition API 예시지만, 로직은 순수 JS와 동일합니다)

```ts
const handleMousedown = (event) => {
  isDragging.value = true;
  offsetX.value = event.clientX - dialogX.value;
  offsetY.value = event.clientY - dialogY.value;

  document.addEventListener('mousemove', doDrag);
  document.addEventListener('mouseup', stopDrag);
};

const doDrag = (event) => {
  if (isDragging.value) {
    dialogX.value = event.clientX - offsetX.value;
    dialogY.value = event.clientY - offsetY.value;
  }
};

const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', doDrag);
  document.removeEventListener('mouseup', stopDrag);
};
```

---

## 3. 유용한 유틸리티 함수 (Snippets)

### 3.1 Key 변환 파서 (Object Key Transformer)
API 응답 등의 객체 키를 매핑 규칙(`parserData`)에 따라 변환하는 재귀 함수입니다.

```ts
const transformObjectKey = (data, parserData) => {
  if (!data || typeof data !== 'object') return data;

  if (Array.isArray(data)) {
    return data.map(item => transformObjectKey(item, parserData));
  }

  const result = {};
  Object.keys(data).forEach(originKey => {
    const value = data[originKey];
    // 재귀 호출
    const transformedValue = (typeof value === 'object' && value !== null) 
      ? transformObjectKey(value, parserData) 
      : value;

    // 키 매핑 확인
    const newKey = parserData[originKey] || originKey;
    result[newKey] = transformedValue;
  });

  return result;
};
```

---

## 4. 추천 라이브러리

### 4.1 Notyf
순수 JavaScript로 구현된 가볍고 반응형인 토스트 알림 라이브러리입니다.
- **링크**: [Notyf 공식 문서](https://carlosroso.com/notyf/)
