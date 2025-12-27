---
sticker: vault//이미지/개발 로고/TechIconSVG/JavaScript.svg

slug: "Parser-함수-예시"
---
# key - key 대조 후 key 변경 로직

```js
const transformObjectKey = (data: any, parserData: Record<string, any>): any => {
	if (!data) {
		return data
	}
	
	if (Array.isArray(data)) {
		return data.map((item) => transformObjectKey(item, parserData))
	}
	
	if (typeof data =<mark> 'object' && data !</mark> null) {
		let result: any = {}
		
		
		Object.keys(data).forEach((originKey) => {
			const originValue = data[originKey]
			
			// 해당 Value가 Array라면 재귀 함수
			if (Array.isArray(originValue)) {
				const hasObjects = originValue.some((item) => typeof item =<mark> 'object' && item !</mark> null)
			if (hasObjects) {
				result[originKey] = transformObjectKey(originValue, parserData)
				return
			}
		}
		
		// 해당 Value가 Object라면 재귀 함수
			else if (typeof originValue =<mark> 'object' && originValue !</mark> null) {
				result[originKey] = transformObjectKey(originValue, parserData)
				return
			}
			
			if (Object.prototype.hasOwnProperty.call(parserData, originKey)) {
				const parserKey = parserData[originKey]
				result = {
					...result,
					[parserKey]: originValue,
				}
			} else {
				result = {
					...result,
					[originKey]: originValue,
				}
			}
		})
		
		return result
	}
		
		// 객체나 배열이 아닌 데이터(예: 문자열, 숫자)는 그대로 반환
	
	return data

}
```

# key-value 대조 후 key 값 변경
```js

```