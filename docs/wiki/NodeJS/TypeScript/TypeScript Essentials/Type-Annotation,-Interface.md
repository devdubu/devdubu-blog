---
slug: "Type-Annotation,-Interface"
---
:::note Type Annotation?
- 개발자가 타입을 TS에게 직접 말해주는 것

:::

:::note Type Interface
- TS 가 알아서 타입을 추론하는 것

:::

# Type Annotation이 필요한 경우

## `any` 타입을 리턴하는 경우

`coordinates` hover 해보면 `const coordinates: any` 라고 뜨는 것을 볼 수 있습니다
`JSON.parse`는 json 을 파싱 해줍니다.
인풋 으로 들어가는 json 을 확인하면 대충 어떤 타입이 리턴 될지 개발자는 예상 할 수 있지만, TS는 여기까지 지원하지 않습니다.

리턴 타입이 일정하지 않으므로, `any`를 리턴한다고 추론해버립니다.

그렇기에 해당 경우에는 Type Annotation을 해야합니다.

```ts
const json:string = '{ "x" : 4, :"y" : 7}'
const coordinates = JSON.parse(json)
console.log(coordinates)
```


## 변수 선언 후, 초기화

변수 선언과 동시에 초기화를 하면 타입을 추론하지만, 선언을 먼저하고 나중에 값을 초기화할 때에는 추론하지 못합니다.

```ts
let greeting
greeting = 'hello' // let greeting : any
```

## 변수에 대입 될 값이 일정하지 못할 때
여러 타입이 지정되어야 할 때에는 `| (or statement)` 로 여러 타입을 Annotation 해줍니다

```ts
let num = [-7, -2, 10]
let numAboveZero: boolean | number = false

for(let i = 0; i < num.length; i++){
	if(num[i] > 0){
		numAboveZero = num[i]
	}
}
```