---
sticker: vault//이미지/개발 로고/TechIconSVG/JavaScript.svg
---
`FileList`는 배열(Array)처럼 보이지만, 실제로는 배열이 아니기 때문입니다.

`FileList` 객체는 인덱스로 접근할 수 있는 `File` 객체들의 리스트입니다. `Array.prototype.map()` 같은 배열 메서드를 사용하려면, 먼저 `FileList`를 실제 배열로 변환해야 합니다.

### **배열로 변환하는 방법**

가장 일반적인 두 가지 방법은 다음과 같습니다.

---

### **1. `Array.from()` 사용하기**

`Array.from()` 메서드는 유사 배열 객체나 이터러블 객체를 새로운 배열로 만들어줍니다.



```JavaScript
const fileInput = document.getElementById('myFileInput');
const fileList = fileInput.files; // FileList 타입

// FileList를 배열로 변환
const fileArray = Array.from(fileList);

// 이제 map() 함수 사용 가능
fileArray.map(file => {
  console.log(file.name);
});
```

---

### **2. 전개 구문(`...`) 사용하기**

전개 구문을 사용하면 `FileList`의 요소를 새로운 배열로 쉽게 펼칠 수 있습니다.

```JavaScript
const fileInput = document.getElementById('myFileInput');
const fileList = fileInput.files;

// 전개 구문으로 배열 생성
const fileArray = [...fileList];

// 이제 map() 함수 사용 가능
fileArray.map(file => {
  console.log(file.name);
});
```

위 두 가지 방법 중 하나를 선택하여 `FileList`를 배열로 변환한 후, `map()`을 포함한 다양한 배열 메서드들을 자유롭게 활용할 수 있습니다.