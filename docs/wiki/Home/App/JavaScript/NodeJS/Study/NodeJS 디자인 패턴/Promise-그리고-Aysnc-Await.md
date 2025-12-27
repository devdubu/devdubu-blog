---
종료 날짜: 2025-04-10
시작 날짜: 2025-04-10
분류: 공부
카테고리: Architech
세부 카테고리:
  - JavaScript
특징:
  - Book
sticker: vault//이미지/개발 로고/TechIconSVG/Node.js.svg

slug: "Promise-그리고-Aysnc-Await"
---

NodeJS 에서 콜백은 비동기 프로그래밍의 기본적인 방식이지만, 개발자 친화적인 것과는 거리가 멀어 보입니다.
실제로 이 전장에서 콜백을 사용하여, 다양한 제어 흐름을 구현하기 위해 기술을 배웠습니다.
그리고 그것은 우리가 해결하려는 문제에 비해서 매우 복잡하고 장황하다고 볼 수 있습니다.

특히, 우리가 작성하는 대부분의 제어 흐름 구조는 순차적인 함수의 실행인데 이에 익숙하지 않은 개발자들에게 콜백 지옥이라는 문제를 일으키게 만듭니다.
게다가 제대로 구현된 경우라 해도 콜백을 통한 순차적인(serial) 실행 흐름은 불필요하게 복잡하고 오류가 발생하기 쉽습니다.
또한 콜백을 사용한 오류의 관리가 얼마나 취약한지 이미 알고 있을 것 입니다.

오류를 다음 실행으로 전달하는 것을 잊으면 해당 오류에 대한 컨트롤을 잃게 되며, 동기적 코드에서 발행한 에러 코드를 탐지하지 못하면, 프로그램이 망가집니다.

또한 Zalgo를 조심하지 않으면, 언제나 우리를 괴롭히며 따라 다닐 것입니다.

NodeJS와 JavaScript는 수 년간 일반적이고, 흔히 발생하는 문제에 대한 네이티브 솔루션의 부재로 인해 지탄을 받아왔습니다.

운좋게도 여러 해 동안 커뮤니티에서 그 문제에 대한 새로운 솔루션을 찾기 위해 노력해 왔습니다.
그리고 마침내 수 많은 방복과 논쟁을 거치며 몇 년을 기다린 끝에 콜백 이슈에 대한 적절한 솔루션을 갖게 되었습니다.

더 나은 비동기 코드를 만들기 위한 해법의 첫 번째 Promise 인데, 이것은 상태를 **전달**하는 객체로 비동기식 작업의 최종 결과를 나타냅니다.

프라미스는 순차 실행 흐름을 구현하기 위해 쉽게 연결할 수 있으며, 다른 객체들처럼 전달할 수 있습니다.

Promise는 많은 비동기 코드를 단순하게 만듭니다.
그러나 아직 개선의 여지가 존재합니다.

Promise는 많은 비동기 코드를 단순하게 만듭니다. 그러나 아직 개선의 여지가 존재합니다.
따라서 흔히 사용되는 순차 실행 흐름을 가능한 간단하게 만들기 위해 비동기 코드를 동기 코드 처럼 보이게 할 수 있는 `async/await` 라는 새로운 구조가 도입되었습니다.

오늘날 현대적인 NodeJS 프로그래밍에서 `async/await` 는 비동기 코드를 처리할 때 선호 되는 구성입니다.
그러나 `async/await` 는 Promise가 콜백을 기반으로 만들어진 것처럼 `Promise` 를 가지고 만들어졌습니다.
따라서 올바른 접근과 함께 비동기 프로그래밍의 문제를 다루기 위해서는 이 모든 것을 이해할 필요가 있습니다.

- Promise가 어떻게 동작하는지 또 우리가 이미 알고 있는 주된 제어 흐름 구조를 구현하기 위해서 어떻게 효과적으로 사용할 수 있는지를 배워 봅시다.
- NodeJS 에서 비동기 코드를 다룰 때, 우리의 주된 도구가 될 `async/await` 문법을 배워봅시다.

이 장을 끝내게 될 때, 우리는 JavaScript 에서 비동기 코드를 제어하기 위한 가장 중요한 이 두 컴포넌트에 대해 이해하게 될 것입니다.

# Promise
Promise는 표준 ECMA 2015의 일부이며, Node 버전 4부터는 NodeJS 에서 기본적으로 사용 할 수 있습니다.
Promise 의 역사는 초기의 다른 특징들과 동작을 하는 수 십 여 개의 구현채들이 있던 몇년 전으로 거슬러 올라갑니다.
결과적으로 이들 대부분의 구현체들이 `Promise/A+` 라고 불리는 표준에 도달하였습니다.

Promise는 비동기 결과를 전파하기 위해서 사용한 연속 전달 방식(CPS: Continuation-passing style)의 콜백을 대신할 강력한 대안으로 큰 발걸음을 내딛게 됩니다.
앞으로 보게 되겟지만, Promise는 모든 주요 비동기 흐름을 제어하는 대부분의 콜백 기반의 대안들에 비해 더 읽기 쉽고, 덜 장황하며, 더 강력하게 만들 것입니다.

## Promise 란 무엇인가

Promise 비동기 작업의 최종적인 결과를 담고 있는 객체 입니다.
Promise의 용어로, 비동기 작업이 아직 완료되지 않았을 때 대기 중(`pending`)이라고 하며, 작업이 성공적으로 끝날을 때 이행됨(`fulfilled`)라고 하며, 작어빙 에러와 함께 종료되었을 때 거부됨(`rejected`)이라고 합니다.
프라미스가 이행되거나 거부 되면 결정된(`settled`)것으로 간주 됩니다.

이행(`fulfillment`) 값이나 거부(rejection) 와 관련된 에러(원인)를 받기 위해 Promise 인스턴스의 then() 함수를 사용할 수 있습니다.
그 다음은 형식입니다.

```js
promise.then(onFulfilled, onRejected)
```

위의 형식에서 `onFulfilled` 는 최종적인 Promise의 이행 값(`fulfillment value`) 을 받는 콜백이며, `onRejected`는 (이유가 있을 때) 거부 이유를 받는 콜백 입니다.

두 콜백 모두 선택 사항이빈다. 프라미스가 어떻게 우리의 코드를 변화시킬 수 있는지 보기 위해 다음과 같은 콜백 기반 코드를 생각해보겠습니다.

```js
asyncOperation(arg, (err, result)=>{
	if(err){
		// 에러 처리
	}
	// 결과 처리
})
```

다음과 같이 `Promise`는 전형적인 연속 전달 방식(CPS)의 코드를 보다 체계적이고 우아한 코드로 바꿀 수 있게 해줍니다.
```js
asyncOperationPromise(arg)
	.then(result=>{
		// 결과 처리
	}, err->{
		// 결과 처리
	})
```

위의 코드에서 `asyncOperationPromise()` 는 프라미스를 반환하니다.
우리는 함수의 최종적인 결과인 이행 값(`fulfillment value`)이나 거부 사유(`reject reason`)를 받기 위해 반환된 프라미스를 사용할 수 있습니다.

지금까지는 중대한 일이 없는 것처럼 보이지만, 매우 중요한 `then()` 함수의 특성은 또 다른 프라미스를 동기적으로 반환한다는 것입니다.

게다가 `onFulfilled`나 `onRejected` 함수가 x 라는 값을 반환한다면, `then()` 메소드에 의해 반환된 프라미스는 다음과 같이 동작합니다.
- x가 값이면, x를 가지고 이행(`fulfill`)합니다.
- x가 프라미스라면 프라미스 x의 이행값으로 가지고 이행(`fulfill`) 합니다.
- x가 프라미스라면 프라미스x의 거부 사유를 최종적인 거부 사유로 하여 reject 합니다.

이러한 동작으로 여러가지 환경에서 비동기 작업들을 손쉽게 통합하고 배치할 수 있게 해주는 Promise 체인을 구성할 수 있습니다.
또한 `onFulfilled` 또는 `onRejected` 핸들러를 명시하지 않는다면, 이행값 또는 거부 사유는 자동으로 체인 다음 Promise 로 전달됩니다.
예를 들어, `onRejected` 핸들러에 의해서 에러가 catch 될 때까지 에러는 전체 체인을 통과하면서 전파 됩니다.
Promise 체인은 비동기 작업들의 순차 실행을 손쉽게 만들어줍니다.
```js
asyncOperationPromise(arg)
	.then(result1=>{
		// 다른 프라미스를 반환
		return asyncOperationPromise(arg2)
	})
	.then(result2=>{
		// 값을 반환
		return 'done'
	})
	.then(undefined, err=>{
		// 체인내의 에러를 여기서 catch 함
	})
```

아래의 다이어 그램은 Promise 체인이 동작하는 방식을 설명합니다.
![Pasted-image-20250402084657.png](/img/이미지 창고/Pasted-image-20250402084657.png)
위 그림은 우리가 Promise 체인을 사용할 때의 프로그램의 흐름을 보여줍니다.
우리가 프라미스 A의 `then()` 을 호출하면, 그 결과로 동기적으로 Promise B를 받고, Promise B의 `then()` 을 호출하면, 동기적으로 `Promise C` 를 호출의 결과로 받게 됩니다.

결국에는 `Promise A` 가 처리 될 때 그것이 이행 또는 거부 되어, `onFulfilled()` 또는 `onRejected()` 콜백을 호출합니다.

이러한 콜백의 실행 결과가 Promise B의 이행 또는 거부하고 차례로 그 결과가 Promise B의 `then()` 호출 시 전달되는 `onFulfilled()` 또는 `onRejected()` 콜백으로 전파됩니다.

체인 내에서 이와 같은 실행이 Promise C 그리고 또 다른 Promise 에도 계속 됩니다
Promise의 중요 특성은 비록 값을 가지고, Promise를 동기적으로 해결(resolve) 한다 할지라도 적어도 한번 `onFulfilled()`와 `onRejected()` 콜백이 비동기적으로 호출된다는 보장을 한다는 것입니다.
그 뿐만 아니라, 비록 Promise 객체가 `then` 이 호출되는 순간 결정되어 `settled` 있어도 `onFulfilled()`와 `onRejected()` 콜백은 비동기적으로 호출됩니다.

이 동작은 우리가 무심코 Zalgo 를 늘어놓는 모든 상황에서 우리의 코드를 지켜줍니다.
이는 추가적인 노력 없이도 우리의 비동기 코드를 더욱 굳건하고 일관되게 만들어줍니다.

이제 가장 중요한 부분입니다.
`onFulfilled()` 또는 `onRejected()` 핸들러에서 예외를 발생시키면(`throw` 구문을 사용하여), `then()` 메소드에서 반환되는 `Promise` 는 발생된 예외를 거부 사유로 자동 거부 됩니다.
`.then()` 메소드에서 반환되는 `Promise` 는 발생된 예외를 거부 사유로 자동 거부됩니다.
이것은 CPS에 비해 매우 큰 이점이 잇는데, `Promise` 와 함께 예외가 체인 전체에 자동으로 전파되고, 최종적으로 throw 문을 사용할 수 있기 때문입니다.

## Promise / A+ 와 thenable
역사적으로 여러가지 Promise 구현이 존재했으며, 대부분이 서로 호환되지 않았습니다.
즉, 서로 다른 라이브러리의 Promise 객체 간에는 체인을 만들 수 없다는 것을 의미합니다.

JavaScript 커뮤니티는 이러한 한계를 극복하고자 많은 노력을 햇으며, 이러한 노력으로 Promise/A+ 사양을 만들었습니다.
이 사양은 `then()` 함수의 동작을 자세히 설명하여 상호 운용 가능한 기반을 제공함으로써, 서로 다른 라이브러리의 Promise 객체를 바로 사용할 수 있게 하였습니다.

:::tip Promise/A+ 명세에 대한 자세한 개요는 [공식 웹 사이트](https://promiseaplus.com) 웹 사이트를 참조 할 수 잇습니다.

:::

Promise/A+ 표준을 채택한 결과, 네이티브 JavaScript Promise의 API 를 포함한 많은 Promise 구현들은 `then()` 함수가 잇는 모든 객체를 `thenable` 이라는 Promise 와 유사한 객체로 간주합니다ㅣ.
이 동작을 통해 서로 다른 Promise 구현들이 서로 원활하게 연결될 수 있습니다.

:::tip 객체의 실제 타입이 아닌 그것들의 외면적 동작을 기반으로 객체를 인식(또는 타입을 결정)하는 기술을 덕 타이핑(duck typing)이라고 하며, JavaScript 에서 널리 사용됩니다.

:::

## Promise API
이제 네이티브 JavaScript Promise API 를 빠르게 살펴보겟습니다.
지금은 Promise 로 무엇을 할 수 있는 지에 대한 아이디어를 주는 개요 부분이기 때문에 지금 이 순간에 명확하지 않다고 해서 걱정할 필요가 없습니다.

이책을 통하여 이 API를 사용할 기회가 충분히 있습니다.

Promise 생성자(`new Promise((resolve, reject)=>{}))`는 새로운 Promise 인스턴스를 생성합니다.
`Promise` 인스턴스는 인자로서 주어진 함수의 동작을 기반하여, 이행(`fulfill`)과 거부(`reject`) 을 합니다.

생성자에 주어지는 함수 두 개의 인자를 받습니다.
- `resolve(obj)` : 이것은 호출 될 때 제공된 이행값으로 Promise 를 이행하는 함수이며, `obj` 가 값이며, `obj` 자체가 전달되고, `obj` 가 Promise 나 `thenable` 이면 `obj` 의 이행 값이 전달 됩니다.
- `reject(err)` : err 사유와 함께 프라미스를 거부합니다.
	- `err` 는 `Error` 인스턴스를 나타내는 규약입니다.
이제 가장 중요한 Promise 객체의 정적 메소드를 살펴보겠습니다.

- `Promise.resolve(obj)` : 
	- 이 함수는 다른 Promise, `thenable` 또는 값에서 새로운 Promise를 생성합니다.
	- Promise가 전달되면 해당 Promise 가 잇는 그대로 반환됩니다.
	- `Thenable` 이 전달되면, 해당 라이브러리의 `Promise`로 변환됩니다.
	- 값이 제공되면 그 값으로 Promise 가 이행됩니다.
- `Promise.reject(err)` : 
	- 이 함수는 err를 이유로 거부하는 `Promise`를 생성합니다.
- `Promise.all(iterable)` :
	- 이 함수는 입력된 반복 가능한 객체(예를 들어 배열) 내의 모든 프라미스가 이행(fulfill)되면 이행된 결과 값들의 배열을 이행값(`fulfillment value`) 으로 하여 이행(`fulfill`) 하는 새로운 프라미스를 생성합니다.
	- 반복 가능한 객체 내의 하나라도 거부(`reject`) 되면 `Promise.all()` 로 반환된 프라미스는 첫 번째 거부 사유를 가지고 거부 될 것입니다.
	- 반복 가능한 객체의 각 항목은 Promise, thenable 또는 값일 수도 있습니다.
- `Promise.allSettled(iterable)`
	- 이 함수는 반복 가능한 객체(`iterable`) 내의 모든 프라미스가 이행되거나 거부될때까지 기다린 다음 입력된 각각의 `Promise` 에 대한 이행 값 또는 거부 사유를 담은 객체의 배열을 반환합니다.
	- 각 객체는 이행됨(`fulfilled`) 또는 거부됨(`rejected`) 같은 status 속성과 이행 값(`fulfillment vlaue`)을 담은 `value` 속성 그리고 거부 사유가 담긴 `reason` 속성이 있습니다.
	- `Promise.all()` 과의 차이점은 `Promise.allSettled()` 는 프라미스 중 하나가 거부 될 때, 즉시 거부되지  않고 모든 프라미스가 이행되거나 거부 될 때까지 기다린다는 것입니다.
- `Promise.race(iterable)`
	- 이 함수는 반복 가능 객체에서 처음으로 결정된(`settled`)프라미스를 반환합니다.

마지막으로 다음 `Promise` 인스턴스에서 사용 가능한 주요 함수들입니다.
- `promise.then(onFulfilled, onRejected)`
	- 이것은 Promise 의 필수 함수입니다.
	- 이 동작은 앞서 언급한 promise/A+ 표준과 호환됩니다.
- `promise.catch(onRejected)`
	- 이 함수는 `promise.then(undefined, onRejected)`에 대한 편리한 버전입니다.
- `promise.finally(onFinally)`
	- 이 함수를 사용하면, Promise 가 결정(이행되거나 거부됨)될 때 호출 되는 onFinally 콜백을 설정할 수 있습니다.
	- `onFulfilled` 및 `onRejected`와 달리 `onFinally` 콜백은 입력으로 인자를 수신하지 않으며, 여기에서 반환된 값은 무시됩니다.
	- `Finally`에서 반환된 프라미스는 현재 프라미스 인스턴스의 이행값 또는 거부 사유로 결정(settle)됩니다.

## Promise 생성하기
이제 생성자를 사용하여, Promise를 만드는 방법을 살펴보겠습니다.
Promise를 처음부터 만드는 것은 저 수준의 작업으로 다른 비동기 형식(예: 콜백 기반 형식)을 사용하는 API 를 변환해야할 경우 필요한 작업입니다.
개발자들의 대부분의 경우 다른 라이브러리에서 생성한 프라미스를 사용하는 사용자이며, 그들이 생성하는 대부분의 Promise 는 then()함수로 획득 가능합니다.

그럼에도 불구하고 일부 고급 시나리오에서는 생성자를 사용하여 수동으로 프라미스를 생성 해야할 필요가 잇습니다

생성자를 사용하는 방법을 보여주기 위해 지정된 밀리초 후에 현재 시간을 이행하는 프라미스를 반환하는 함수를 만들어 보겠습니다.
```js
function delay(millisceconds){
	return new Promise((resolve, rejecte)=>{
		setTimeout(()=>{
			resolve(new Date())
		}, milliseconds)
	})
}
```

이미 짐작하겠지만, Promise 생성자의 `resolve()` 함수를 호출하는데 `setTimeout()` 를 사용했습니다.
함수 본문 전체가 Promise 에 의해 어떻게 감싸졌는지 알 수 있을 것입니다.
이는 Promise를 만들 때 마다 보게 될 흔한 코드 패턴입니다.

우리가 방금 만든 `delay()` 함수는 다음과 같은 코드 처럼 사용될 수 있습니다.

```js
console.log(`Delaying...${new Date().getSeconds}s`)
delay(1000)
	.then(newDate=>{
		console.log(`Done ${newDate.getSeconds()}s`)
	})
```

`then()` 핸들어 안의 `console.log()` 는 `delay()` 호출에서부터 대략 1초 뒤에 실행됩니다.

## Promisification

콜백 기반 함수의 일부 특성을 알고 있을 경우, 콜백 기반 함수를 Promise를 반환하는 동일한 함수로 변환 할수 있스비다.
이 변환을 Promise 화 라고 합니다.

예를 들어, `NodeJS` 방식의 콜백 기반 함수에서 사용되는 규약들을 생각해봅시다.
- 콜백은 함수의 마지막 인자이다.
- 에러(에러가 있다면)는 콜백에 첫 번재 인자로 전달됩니다.
- 모든 반환값은 콜백 함수의 error 인자 다음에 전달됩니다.

이 규칙에 기반하여 NodeJS 방식의 콜백 기반 함수를 Promise 화 하는 일반적인 함수를 쉽게 만들 수 있습니다.
```js
function promisify(callbackBaseApi){
	return function promisified(..args){
		return new Promise((resolve, reject)=>{
			const newArgs = [
				...args,
				function (err, result){
					if(err){
						return reject(err)
					}
					resolve(result)
				}
			]
			callbackBaseApi(...newArgs)
		})
	}
}
```

위의 함수는 promisified() 라는 또 다른 함수를 반환합니다.
반환되는 함수는 입력으로 주어진 `callbackBasedApi`의 Promise 버전입니다.

위 코드는 다음과 같이 동작합니다.
1. `promisified()` 함수는 프라미스 생성자를 사용하여 새로운 프라미스를 생성하고, 즉시 호출자에 그것을 반환합니다.
2. 프라미스 생성자에 전달되는 함수에서 `callbackBasedApi` 에 특별한 콜백을 전달합니다.
	- 우리는 콜백이 항상 마지막에 온다는 것을 알고 잇으므로, promisified() 함수에 전달되는 인자 목록(args) 에 콜백을 추가해주기만 하면 됩니다.
	- 추가한 특별한 콜백에서 에러를 받는다면 즉시 Promise를 거부하고 그렇지 않다면, 주어진 result 를 가지고 이행합니다.
3. 마지막으로 우리가 만든 인자 목록을 가지고 `callbackBasedApi`를 호출합니다.

## 순차 실행과 반복

이제 지금까지의 프라미스에 대한 이해를 가지고 이전 장에서 만들었던 웹 스파이더 애플리케이션을 변환해 보겠습니다.
웹 페이지 링크를 순서대로 다운로드하는 두 번째 버전 부터 시작해보겠습니다.
:::tip fs 모듈의 Promise 객체를 사용하며, 코어 fs API의 Promise화된 버전을 사용할 수 있습니다.
- 이를 위해서는 `import { promises} from 'fs'` 같은 코드를 입력해 import 합니다.

:::

`spider.js` 모듈에서 가장 먼저 필요한 단계는 종속성을 import 하고 사용할 콜백 기반 함수를 promise 로 변환하는 것입니다.

```js
import { promises as fsPromises } from 'fs'
import { dirname } from 'path'
import superagent from 'superagent'
import mkdirp from 'mkdirp'
import { urlToFilename, getPageLinks } from './utils.js'
import { promisify } from 'util'

const mkdirpPromises = promisify(mkdirp)
```

이전 장의 `spider.js` 모듈과 다른 두 가지의 큰 차이점은 다음과 같습니다.
1. 이미 Promise 화 된 fs 함수들에 접근하기 위해서 `fs` 모듈의 promises 객체를 import 합니다.
2. `mkdirp()` 함수는 직접 프라미스로 변환합니다.

이제 `download()` 함수를 변환합니다.
```js
function download(url, filename){
	console.log(`Downloading ${url}`)
	let content
	return superagent.get(url)
		.then((res)=>{
			content = res.text
			return mkdirpPromise(dirname(filename))
		})
		.then(()=> fsPromises.writeFile(filename, content))
		.then(()=>{
			console.log(`Downloaded and saved: ${url}`)
			return content
		})
}
```

Promise를 사용한 순차 비동기 작업의 구현이 가동성이 높다는 것을 바로 알 수 있을 것입니다.
여기서는 단순하고 매우 직관적인 `then()` 호출의 체인을 갖고 있습니다.

이전 버전의 함수에서와는 달리, 이번에는 프라미스를 지원하는 superagent 패키지의 기능을 사용해보겠습니다.
`superagent.get()` 에 의해서 반환되는 요청의 객체의 `end()`를 호출하는 대신, `then()` 를 호출해서 요청을 보내고 결과로 이행하거나 거부하는 Promise를 받습니다.

`download()` 함수의 마지막 반환값은 체인 마지막의 then() 호출이 반환한 promise로 웹 페이지의 content를 결과로 이행합니다.
content의 값은 첫번째 then() 호출의 `onFulfilled` 핸들러에서 초기화 됩니다.
이를 통해 호출자는 모든 작업(`get`, `mkdir`, `writeFile`)이 완료된 후에 `content` 을 가지고 이행하는 `Promise`를 받습니다.

방금 본 `download()` 함수로 이미 알고 있는 일련의 비동기 작업을 순서대로 실행했습니다.
그러나 `spiderLinks()` 함수에서 미리 알 수 없는 동적인 일련의 비동기 작업들을 순차적으로 반복 처리해야 합니다.

이를 구현하는 방법을 살펴보겠습니다.

```js
function spiderLinks(currentUrl, content, nesting){
	let promise = Promise.resolve()
	if(nesting === 0){
		return promise
	}
	const links = getPageLinks(currentUrl, content)
	for(const link of links){
		promise = promise.then(()=> spider(link, nesting-1))
	}
	return promise
}
```

웹 페이지의 모든 링크를 비동기적으로 반복하기 위해 다음과 같이 프라미스 체인을 동적으로 만들어야 햇습니다.
1. 먼저 정의되지 않은 빈 Promise 를 정의합니다.
2. 그런 다음 반복 구문에서 체인의 이전 promise 에서 `then()` 을 호출하여 얻은 새로운 promise 로 promise 변수를 갱신합니다.
	- 이것은 실제로 프라미스를 사용하는 비동기 반복의 패턴입니다.
`for` 루프의 맨 끝에서 promise 변수는 체인에서 마지막 `then()` 함수를 호출하여 얻은 프라미스를 가지고 있으므로, 체인 내의 모든 프라미스들의 해결(resolve) 된 경우에만 해결될 것입니다.

:::tip 패턴(Promise 의 순차 반복)
- 루프를 사용하여 동적으로 프라미스 체인 구축

:::

이제 `spider()` 함수를 변경해봅시다.

```js
export function spider(url, nesting){
	const filename = urlToFilename(url)
	return fsPromises.readFile(filename, 'utf8')
		.catch(err=>{
			if(err.code !== 'ENOENT'){
				throw err
			}
			// 파일이 존재하지 않아, 다운로드를 시작
			return download(url, filename)
		})
		.then(content=>{
			spiderLinks(url, content, nesting)
		})
}
```

우리는 이 새로운 `spider()` 함수에서 `readFile()` 에 의해 발생하는 에러를 다루기 위해 `catch()` 를 사용합니다.
특히 에러에 `ENOENT` 코드가 존재한다면, 파일이 아직 존재하지 않는다는 것을 의미하기 때문에, 해당하는 URL을 다운로드 해야 합니다.
`download()`로부터 반환되는 Promise가 이행되면 URL 에 잇는 내용을 반환할 것입니다.
반면에, 만약 `readFile()` 에 의해 생성된 Promise가 이해된다면, `catch()` 핸들러는 건너뛰고, 바로 다음의 `then()` 으로 이동합니다.

두 경우 모두 마지막 `then()` 호출의 `onFulfilled` 핸들러는 항상 로컬 파일이나 URL로부터 새로 다운로드 한 웹 페이지의 내용을 수신할 것입니다.

이제 `spider()` 함수를 변경했으므로 마침내 `spider-cli.js` 모듈을 수정할 수 있게 되었습니다.

```js
spider(url, nesting)
	.then(()=> console.log('Download complete'))
	.catch((err)=>console.error(err))
```

여기서 catch() 핸들러는 전체 `spider()` 프로세스에서 발생하는 모든 에러를 잡아낼 것입니다.
지금까지 작성한 모든 코드들을 다시 살펴보면 (콜백을 사용할 때 사용자가 직업 수행해야 했던) 오류를 전파하기 위한 로직을 포함하고 있지 않다는 것에 놀랄 것입니다.

이것은 사용해야할 코드의 상용구문들(`boilderplate`) 과 비동기 오류를 놓칠 가능성을 크게 줄여주므로 분명히 엄청난 이점입니다.
이것으로 Promise 를 사용한 웹 스파이더 애플리케이션의 버전2 구현이 끝났습니다.

:::tip 좀 더 간결한 구현을 위한 프라미스의 순차 반복 패턴의 대안은 `reduce()` 함수를 사용하는 것입니다.

:::

```js
const promise = tasks.reduce((prev, task)=>{
	return prev.then(()=>{
		return task()
	})
}, Promise.resolve())
```

## 병렬 실행
Promise 사용으로 간단해지는 또 다른 실행 흐름은 병렬 실행의 흐름이다.
실제로 우리에게 필요한 것은 내장 함수인 `Promise.all()` 뿐입니다.

이 도우미 함수는 입력으로 받은 모든 Promise가 이행됐을 때만 이행하는 도 다른 Promise를 생성합니다.
만약 Promise들에 인과 관계가 없다면 입력으로 주어진 Promise 들은 병렬적으로 실행될 것입니다.
(예를 들어 Promise 들이 동일한 Promise 체인의 일부가 아닌 경우)

```js
function spiderLinks(currentUrl, content, nesting){
	if(nesting === 0){
		return Promise.resolve()
	}
	const links = getPageLinks(currnetUrl, content)
	const promises = links.map(link=> spider(link, nesting-1))

	return Promise.all(promises)
}
```

여기서 패턴은 `links.map()` 루프에서 한번 `spider()` 작업들을 시작하는 것으로 구성됩니다.
동시에 `spider()` 를 호출하여, 각 Promise 는 최종적으로 `promises` 배열에 수집됩니다.

순차 반복 루프와 비교할 때, 이 루프의 중요한 차이점은 새로운 작업을 시작하기 전에 이전 spider() 작업이 완료 될 때까지 기다리지 않는 다는 것입니다.

모든 `spider()` 작업은 이벤트 루프의 동일한 주기에서 한번에 반복적으로 시작됩니다.

모든 Promise들을 확보하게 되면, 이를 `Promise.all()` 함수에 전달하여 배열의 모든 Promise 가 이행되면 그 결과를 가지고 이행 될 새로운 `Promise` 를 반환합니다.

즉, 모든 다운로드 작업이 완료되면 이행 됩니다.
또 `Promise.all()` 에서 반환 된 Promise 중 하나가 거부되면 즉시 거부됩니다.
이것이 바로 이 버전의 웹 스파이더에서 원했던 동작입니다.

## 제한된 병렬 실행
지금까지 `Promise` 는 우리의 기대에 부응해주었습니다.
직렬 및 병렬 실행 모두에서 코드를 크게 개선할 수 있었습니다.

제한된 병렬 실행도 순차 및 병렬 실행 조합이라는 점을 고려해보면 크게 다른 점은 없습닏.

이 섹션에서는 웹 스파이더 작업의 동시성을 애플리케이션 전체에서 제한할 수 있는 해결책을 구현하는 방법을 바로 살펴보겠습니다.
즉, 동일한 애플리케이션 내의 다른 함수들에 전달이 간으한 객체를 인스턴스화 하는데 사용되는 클래스를 구현할 것입니다.

일련의 작업들의 병렬 실행을 로컬로 제한하는 간단한 솔루션을 원하는 경우, 이 섹션에서 보는 것과 동일한 원칙을 적용하여 `Array.map()`의 특별한 비동기 버전을 구현할 수 있습니다

:::tip Promise 및 제한된 동시성을 지원하는 `map()` 함수의 신뢰성 있는 구현체를 찾는다면, `p-map` 패키지를 사용할 수 있습니다.

:::

### Promise 를 사용한 TaskQueue 구현
spider 다운로드 작업의 동시성을 전역적으로 제한하기 위해, 이전 장에서 구현한 TaskQueue 클래슬르 재사용할 것입니다.
동시성 제한에 도달할 때까지 일련의 작업 실행을 호출하는 `next()` 함수부터 시작해봅니다.

```js
next(){
	while(this.running < this.concurrency && this.queue.length){
		const task = this.queue.shift()
		task().finally(()=>{
			this.running --
			this.next()
		})
		this.running++
	}
}
```

`next()` 함수의 핵심적인 변경사항은 `task()` 를 호출하는 곳입니다.
사실 여기서 `task()` 가 Promise 를 반환할 것으로 예상하므로, 우리가 할 일은 해당 Promise 에서 `finally()` 를 호출하는 것입니다. 그러면 실행중인 작업이 이행되거나 거부되는 경우 실행 중인 작업의 수를 재설정 할 수 잇습니다.

이제 새로운 함수인 `runTask()` 를 구현해봅시다.
이 함수는 특수한 래퍼 함수를 대기열에 추가하고 새로 만들어진 Promise 를 반환합니다.
이 Promise 는 기본적으로 `task()` 에 의해 최종적으로 반환된 Promise 의 결과를 전달합니다.

```js
runTask(task){
	return new Promise((resolve, reject)=>{
		this.queue.push(()=>{
			return tasks().then(resolve, reject)
		})
		process.nextTick(this.next.bind(this))
	})
}
```

이 함수의 설명은 다음과 같습니다.
1. 생성자를 사용하여 새로운 Promise를 생성합니다.
2. 작업 대기열에 특수한 래핑 함수를 추가합니다.
	- 이 함수는 다음 `next()` 실행 시 동시성 제한에 여유가 있을 때, 실행될 것입니다.
3. `next()` 를 호출하여 실행할 새로운 일련의 작업을 시작 시킵니다.
	- `runTask()`가 호출될 때, task가 항상 비 동기적으로 호출될 수 있도록 이벤트 루프의 다음 실행으로 이를 연기 시킵니다.(`process.nextTick()`)
	- 실제 `next()` 함수에는 `finally()` 핸들러에서 자신을 호출하는 또 다른 `next()` 호출이 존재하는데, 이것은 항상 비동기 적입니다.
4. 대기열에 넣은 래퍼 함수가 마지막으로 실행되면 입력으로 받은 `task` 를 실행하고 그 결과(이행값 또는 거부 사유)를 `runTask`에서 반환하는 Promise 로 전달합니다.

이것으로 Promise를 사용한 새로운 TaskQueue 클래스의 구현을 마쳤습니다.
다음에는 웹 스파이더 버전 4를 구현하기 위해서 새로운 버전의 TaskQueue를 사용할 것입니다.

### 웹 스파이더 수정

새로운 버전의 `TaskQueue` 클래스를 사용하여, 제한된 병렬 실행 흐름을 구현하도록 웹 스파이더를 수정할 차례 입니다.

우선 `spider()` 함수를 두 개의 함수로 나눌 필요가 있습니다.
하나는 간단하게 새로운 taskQueue 객체를 초기화 하고 다른 하나는 실제로 스파이더 작업을 실행합니다.
두번째 함수를 `spiderTask()` 라고 하겠습니다.

그런 다음 새로 생성된 `spiderTask()` 함수를 호출하고 입력으로 받은 작업 큐 인스턴스를 전달하도록 `spiderLinks()` 함수를 수정해야합니다.

```js
function spiderLinks(currentUrl, content, nesting, queue){
	if(nesting === 0){
		return Promise.resolve()
	}

	const links = getPageLinks(currentUrl, content)
	const promise = links
		.map(link=> spiderTask(link, nesting - 1, queue))

	return Promise.all(promises)
}

const spiderTask(url, nesting, queue){
	if(spidering.has(url)){
		return Promise.resolve()
	}
	spidering.add(url)

	const filename = urlToFilename(url)

	return queue
		.runTask(()=>{
			return fsPromise.readFile(filename, 'utf8')
				.catch((err)=>{
					if(err.code !== 'ENOENT')
				})
		})
	.then(content=>spiderLinks(url, content, nesting, queue))
}

export function spider(url, nesting, concurrency){
	const queue = new TaskQueue(concurrency)
	return spiderTask(url, nesting, queue)
}
```

방금 본 코드에서 중요한 부분은 `queue.runTask()` 를 호출하는 위치 입니다.
여서는 우리가 큐에 넣었던 작업이 로컬 파일 시스템 또는 원격 URL에 있는 URL의 내용을 가져옵니다

우리는 queue에 의해 작업이 실행된 후 웹 페이지 링크들에 대한 스파이더 작업을 계속 진행할 수 있습니다.

의도적으로 `spiderLinks()`를 우리가 제한 하고자 하는 작업의 바깥에 두었다는 것을 주목하시시오
이는 `spiderLinks()`가 더 많은 `spiderTask()` 를 실행할 수 있고, 스파이더 처리의 깊이가 큐의 동시성 제한 보다 커지면 데드락을 초래할 수 있기 때문입니다.

또한 `spiderLinks()`에서 `Promise.all()`을 계속 사용하여 웹 페이지의 모든 링크를 병렬로 다운로드 하는 방법을 볼 수 있습니다.
이는 작업의 동시성을 제한하는 것이 대기열의 책임이기 때문입니다.

:::tip 실제 운영을 위한 코드라면 일련의 작업에 대한 동시성을 제한하기 위해 `p-limit` 패키지를 사용할 수 있습니다.
- 이 패키지는 우리가 봤던 패턴을 기본적으로 구현합니다.
- 하지만 약간 다른 API에 감싸져 있습니다.

:::

이것으로 JavaScript Promise에 대한 탐구를 마칩니다.

# Async/Await

방금 봤던 것처럼 Promise는 콜백에 비해 획기적인 도약입니다.
Promise 는 비동기 코드를 깔끔하게 하고 가독성 있게 작성할 수 잇게 해주며, 콜백 기반의 비동기 코드로 작업을 할 때 상용구코드(보일러플레이트, boilderplate) 를 사용하여, 얻을 수 있었던 일련의 안전장치를 제공합니다.

그러나 Promise 는 순차적 비동기 코드를 작성할 때 여전히 차선책에 불과합니다.

Promise 체인이 콜백 지옥을 갖는 것보다는 낫지만, 우리는 여전히 `then()` 을 호출 해야 하며, 체인에서 각 작업에 대한 새로운 함수를 만들어야 합니다.

일상적인 프로그래밍에서 가장 흔히 사용되는 것이 제어 흐름인데, 그때마다 해야 할 작업으로는 여전히 너무 과합니다.
JavaScript에 흔한 비동기적 순차 실행 흐름을 처리 하기 위한 적절한 방법이 필요했고, 그에 대한 대답으로 `async` 함수 와 `await` 표현에 대한 ECMAScript 표준이 작성되엇습니다.

`async/await` 구문을 사용하면, 각 비동기 작업에서 다음 구문을 실행하기 전에 결과를 기다리며 차단되는 것처럼 보이는 함수를 작성할 수 있습니다.

보게 되겠지만, `async/await` 를 사용한 비동기 코드는 전통적인 동기적 코드에 버금가는  가독성을 가지고 있습니다.

오늘날 `async/await` 는 NodeJS 와 JavaScript 모두에게 비동기 코드를 처리하는데 권장되는 방식입니다.
그러나 `async/awiat` 는 우리가 지금까지 배워왔던 모든 비동기 제어 흐름 패턴을 대신하지 못합니다.
그와 반대로 `async/await`은 Promise 에 크게 의지합니다.

## Async 함수와 Await 표현

async 함수는 주어진 Promise 가 해결될 때까지 함수의 실행을 <mark>일시정지</mark> 하기 위한 표현식인 `await` 를 사용할 수 있는 특별한 유형의 함수입니다.
간단한 예를 들어, 앞서 Promise 생성하기 섹션에서 구현한 `delay()` 함수를 사용해 보겠습니다.
`delay()` 에 의해 반환된 Promise는 주어진 시간(ms) 이후 시점의 현재 날짜(`date`) 를 가지고 해결됩니다.
이 함수는 `async/await` 를 사용해보겠습니다.

```js
async function playingWithDelays(){
	console.log('Delaying...', new Date())

	const dateAfterOneSecond = await delay(1000)
	console.log(dateAfterOneSecond)
	const dateAfterThreeSeconds = await delay(3000)
	console.log(dateAfterThreeSeconds)
	return 'done'
}
```

앞의 함수에서 볼 수 있듯이 `async/await` 는 마법처럼 작동합니다.
코드가 비동기 작업을 포함하는 것처럼 보이지도 않습니다.

그러나 착각해서는 안됩니다.
이 함수는 동기적으로 실행되지 않습니다.(그 때문에 async 함수라고 불립니다.)
각 `await` 표현에서 함수의 실행이 보류되고 상태가 저장되며, 제어가 이벤트 루프로 반환됩니다.
기다리는 Promise가 해결될 때 제어는 `async` 함수로 반환되고 Promise의 이행 값이 반환됩니다.

:::tip await 표현은 Promise 뿐 아니라, 어떠한 값으로도 작동합니다.
- 만약 Promise가 아닌 값이 제공되면 그것의 동작은 `Promise.resolve()`에 전달된 값을 기다리는 것과 비슷합니다.

:::

이제 새로운 비동기 함수를 어떻게 호출하는지 보겠습니다.
```js
playingWithDelays()
	.then(result=>{
		console.log(`After 4 seconds: ${result}`)
	})
```

위의 코드를 보면 `async` 함수가 다른 함수들 처럼 호출이 가능하다는 것이 명백합니다.
그러나 여러분 중에 관찰력이 있는 사람이라면 이미 async 함수의 또 다른 중요한 특성을 짚어냈을 겁니다.
`async` 함수는 항상 Promise를 반환한다는 것입니다.

그것은 `async` 함수의 반환 값이 `Promise.resolve()` 에 전달된 다음 호출자에게 반환된 것과 같습니다.

:::note `async` 함수를 호출하는 것은 다른 비동기 작업과 마찬가지로 즉시 수행됩니다.
- 즉, `async` 함수는 Promise를 동기적으로 반환합니다.
- 이 Promise 함수에 생성된 결과 또는 에러에 따라 결정됩니다.

:::

우리는 `async/await` 와의 첫 번째 만남에서 부터 Promise 가 여전히 우리가 다루는 내용에서 얼마나 중요한지를 알 수 있습니다.
실제로, `async/await` 를 Promise를 더 간단하게 사용하기 위한 문법적인 편리함이라고 생각할 수 있습니다.
앞으로 보겠지만, `async/await` 를 사용한 모든 비동기 제어 흐름 패턴은 비용이 많이 드는 대부분의 작업들을 위해 Promise와 해당 API 를 사용합니다.

## Async/await 에서의 에러 처리
`async/await` 는 일반적인 조건하에 비동기 코드이 가독성을 향상 시킬 뿐만 아니라, 에러를 다룰 때 도움이 됩니다.
실제로 `async/await` 의 가장 큰 장점 중 하나는 `try...catch`블록의 동작을 정규화 하여, 동기적 `thorws` 와 비동기적 Promise 거부 두 상황 모두에서 잘 작동하는 것입니다.

### 통일된 `try...catch` 사용
주어진 밀리초 이후에 에러(Error) 와 함께 거부 하도록 작성된 Promise를 반환하는 함수를 정의해봅시다.
우리가 이미 잘 알고 있는 `delay()` 함수와 매우 비슷합니다.

```js
function delayError(milliseconds){
	return new Promise((resolve, reject)=>{
		setTimeout(()=>{
			reject(new Error(`Error after ${milliseconds}ms`))
		}, milliseconds)
	})
}
```

동기적으로 에러가 throws 되거나 Promise가 거부 될 때까지 기다리는 Async 함수를 구현해봅시다.
이 함수는 동기적인 throw와 Promise 에서의 거부를 어떻게 같은 catch 블록에서 처리 할 수 있는지는 잘 보여줍니다.

```js
async function playingWithErrors(throwSyncError){
	try{
		if(throwSyncError){
			throw new Error('This is a synchronous error')
		}
		await delayError(1000)
	}catch(err){
		console.error(`We have an error: ${err.message}`)
	}finally{
		console.log('Done')
	}
}
```

이제 함수를 다음과 같이 호출합니다.
```js
playingWithErrors(true)
```

콘솔에는 아래와 같이 출력됩니다.
```shell
We have an error: This is a synchronous error
Done
```

반면 false를 입력으로 함수를 다음과 같이 호출하면

```js
playingWithErrors(false)
```

```shell
We have an error: Error after 1000ms
Done
```

에러 처리가 간단하고, 가독성이 좋으며 그리고 무엇보다도 비동기적/동기적 에러 모두 지원해야합니다.

### `return` vs `return await` 함정
흔한 안티패턴 중 하나는 `async/await` 와 함께 에러를 다룰 때 호출자에 거부하는 Promise를 반환하고, Promise를 반환하는 함수의 local `try...catch` 블록에서 에러가 잡히는 것을 예상하는 것입니다.

예를 들어 다음과 같은 코드를 생각해봅시다.
```js
async function errorNotCaught(){
	try{
		return delayError(1000)
	}catch(err){
		console.error('Error caught by the async function: '+ err.message)
	}
}
errorNotCaught()
	.catch(err=> console.error('Error caught by the caller: '+err.message))
```

우리가 한 일은 `return` 키워드 뒤에 await를 추가한 것 뿐입니다.
이것 만으로도 async 함수가 Promise를 로컬에서 처리하고 Promise의 거부를 포착하는데 충분합니다.
이를 확인하기 위해 앞의 코드를 실행시키면 다음과 같은 출력을 볼 수 있습니다.

```shell
Error caught by the async function: Error after 1000s
```

## 순차 실행과 반복

`async/await` 를 사용한 제어 흐름 패턴에 대한 탐구를 순차적 실행과 반복에서 부터 시작해보겠습니다.
이미 여러 번 언급했지만, async/await 의 최대 강점은 비동기적 순차 실행을 쓰기 쉽고 읽기 쉽게 만드는 능력입니다.
우리가 지금까지 작성했던 모든 코드 샘플에서 확인해볼 수 있었습니다.
이제 웹 스파이더 버전 2를 변환해보면 더 확실해질 것입니다.
`async/await` 는 사용하기가 매우 간단해서 이를 사용하기 위해 더 배워야 할 패턴도 이제는 없습니다.
따라서 바로 본론으로 들어가 보겠습니다.

웹 스파이더의 `download()` 함수부터 시작해봅시다.
`async/await` 에서는 다음과 같습니다.

```js
async function download(url, filename){
	console.log(`Downloading ${url}`)
	const { text: content } = await superagent.get(url)
	await mkdirpPromises(dirname(filename))
	await fsPromises.writerFile(filename, content)
	console.log(`Downloaded and saved: ${url}`)
	return content
}
```

`download()` 함수가 얼마나 간단하고 간결해졌는지 잠시 살펴봅시다.
총 19 줄의 코드를 사용하여 두개의 서로 다른 함수에서 콜백으로 동일한 기능이 구현되었던 코드가 지금은 7줄 밖에는 안됩니다.
또한 코드는 중첩 하나 없는 완전히 플랫(`flat`) 한 형태를 가졌습니다.
이것은 `async/await` 가 우리가 코드에 미치는 긍정적인 영향을 보여줍니다.

이제 `async/await` 를 사용해서 배열을 비동기적으로 반복해보겠습니다.
`spiderLinks()` 함수가 좋은 예시가 될 것입니다.

```js
async function spiderLinks(currentUrl, content, nesting){
	if(nesting===0){
		return
	}
	const links = getPageLinks(currentUrl, content)
	for(const link of links){
		await spider(link, nesting - 1)
	}
}
```

여기서는 심지어 우리가 알아야할 패턴도 없습니다.
링크 목록에 대한 간단한 반복이 존재하고 각 항목에 대해 `spider()` 가 반환하는 Promise 를 기다립니다.
다음의 코드는 `async/await` 를 사용하여 구현한 `spider()` 함수 입니다.
코드를 보면 `try...catch` 구문으로 에러를 간단하게 다궜고, 코드가 읽기 쉽게 바뀐 것을 확인 할 수 잇습니다.

```js
export async function spider(url, nesting){
	const filename = urlToFilename(url)
	let content
	try{
		content = await fsPromises.readFile(filename, 'utf8')
	}catch(err){
		if(err.code !== 'ENOENT'){
			throw err
		}
		content = await download(url, filename)
	}
	return spiderLinks(url, content, nesting)
}
```

`spider()` 함수와 함께 웹 스파이더 애플리케이션의 `async/await` 변환을 완료 했습니다.
보는 바와 같이 간단하지만, 결과는 꽤 인상적입니다.

### 안티패턴 - 순차 실행을 위한 `Array.forEach` 와 `async/await`
개발자들이 `Array.forEach()` 또는 `Array.map()`과 함께 `async/await` 를 사용한 순차 비동기 반복을 구현하려고 시도하는 흔한 안티패턴이 존재한다는 점을 언급할 필요가 있습니다.

물론 예상대로 동작하지 않습니다.
그 이유를 알아보기 위해 `spiderLinks()` 함수에서 비동기 반복의 (잘못된) 대체 구현을 살펴보겠습니다

```js
links.forEach(async function iteration(link){
	await spider(link, nesting - 1)
})
```

앞의 코드에서 iteration 함수는 `links` 배열의 각 요소에 대해 한번씩 호출됩니다.
그런 다음 `iteration` 함수에서 `spider()` 가 반환하는 Promise 에 `await` 표현식을 사용합니다.
그러나 `iteration` 함수에 의해 반환된 Promise 는 `forEach()` 에 의해 무시됩니다.
결과적으로 모든 `spider()` 함수는 이벤트 루프의 동일한 라운드에서 호출되므로, 병렬로 시작되며, 모든 `spider()` 작업이 완료 되기를 기다리지 않고 `forEach()` 호출 즉시 연속적으로  실행됩니다.


## 병렬 실행
`async/await` 를 사용하여 일련의 작업들을 병렬로 실행하는 방법은 크게 두가지가 있습니다.
하나는 순수하게 await 표현식을 사용하는 것이고, 다른 하나는 `Promise.all()` 에 의존하는 것입니다.
두가지 모두 구현하기 간단합니다.
그러나 `Promise.all()` 을 사용하는 방법이 권장됩니다.

두 가지 방법에 대한 예를 살펴보겠습니다.
웹 스파이더의 `spiderLinks()` 함수를 생각해봅시다.
순수하게 `await` 표현식을 사용해서 무제한 병렬 비동기 실행 흐름을 구현하려면 다음과 같은 코드로 실행합니다.

```js
async function spiderLinks(currentUrl, content, nesting){
	if(nesting === 0){
		return
	}
	const links = getPageLinks(currentUrl, content)
	const promises = links.map(link=> spider(link, nesting - 1))
	for(const promise of promises){
		await promise
	}
}
```

이게 전부 입니다. 매우 간단합니다.
앞의 코드에서 모든 `spider()` 작업을 병렬로 시작하였고, `map()` 을 사용하여 실행된 작업들의 Promise 를 수집합니다.
그리고 나서 루프를 돌며 각각의 Promise 들을 기다립니다.

처음엔 이것이 깔끔하고 기능적으로 보이지만, 생각하지 않은 작은 부작용이 있습니다.
배열에서 어떤 Promise가 거부되면 `spiderLinks()` 에서 반환된 Promise 도 거부되는데 그 전에 배열 내의 모든 선행 프라미스들의 해결될 때까지 기다려야 합니다.

일반적으로 작업의 실패를 최대한 빨리 알기 원하기 때문에, 이것은 모든 상황에서 최선의 방법이 아닙니다.
다행히도 우리는 이미 원하는 방식으로 정확하게 동작하는 `Promise.all()` 이라는 내장 함수를 가지고 있습니다.

실제로 `Promise.all()` 은 입력 배열에 제공된 Promise 중 하나가 거부되는 즉시 거부합니다.
더욱이 모든 async/await 코드에 대해서도 이 방법을 사용할 수 있습니다.
그리고 Promise.all() 은 또 다른 Promise만 반환하기 때문에 여러 비동기 작업에서 결과를 얻기 위해 await을  호출할 수 있습니다.

```js
const results = await Promise.all(promise)
```

결론적으로, 병렬 실행 및 `async/await` 를 사용하는 `spiderLinks()` 함수의 구현은 Promise를 사용하는 것과 거의 동일하게 보입니다.
유일하게 눈에 띄는 차이점은 항상 Promise를 반환하는 `async` 함수를 사용한다는 사실입니다.

```js
async function spiderLinks(currentUrl, content, nesting){
	if(nesting === 0){
		return
	}

	const links = getPageLinks(currentUrl, content)
	const promise = links.map(link=> spider(link, nesting - 1))

	return Promise.all(promises)
}
```

병렬 실행 및 `async/await`에 대해 방금 배운 내용은 `async/await` 가 Promise와 분리 될 수 없다면, 사실을 다시 강조합니다.
Promise 와 함께 작동하는 대부분의 유틸리티들은 `async/await` 에서도 원할하게 작동하며, `async` 함수에서 이를 활용하는 것을 주저해서는 안됩니다.

### 제한된 병렬 실행
`async/await` 를 사용하여, 제한된 병렬 실행 패턴을 구현하기 위해 Promise 섹션의 제한된 병렬 실행에섬 만들었던 `TaskQueue` 클래스를 간단히 다시 사용할 수 있습니다.
이것을 그대로 사용하거나 내부를 `async/await` 로 변환할 수 있습니다.
어느 쪽이든 TaskQueue 외부 인터페이스는 변경하지 말아야 합니다.

두 구현 모두 대기열에 의해 작업이 실행될 때 해결되는 Promise 를 반환하는 `runTask()` 함수를 갖습니다.
이런 가정에서 시작하면 웹 스파이더 비전 4를 Promise 에서 `async/await` 로 변환하는 것도 간단한 작업이며, 새로운 기술이 필요하지 않으므로 여기서 모든 단계를 보여주지 않을 것입니다.

대신 이 섹션에서는 `async/await` 및 **생산자-소비자(producer-consumer)** 접근 방식을 사용하는 작업 대기열 클래스의 세 번째 변형을 살펴보겠습니다.
이 접근 방식을 우리의 문제에 적용하기 위한 일반적인 아이디어는 다음과 같습니다.
- 한쪽에는 작업을 대기 열에 추가하기 위한 정해지지 않는 일련의 생산자들이 존재합니다.
- 반대쪽에는 미리 정의된 일련의 소비자들이 존재하며, 한번에 하나 씩 대기 열에서 작업을 추출하고 실행할 책임을 가집니다.

다음의 다이어그램은 이러한 구조를 이해하는데 도움이 됩니다.

![Diagram-2-1.svg](/img/이미지 창고/Diagram-2-1.svg)

소비자의 수에 따라 작업이 실행되는 동시성이 결정됩니다.
여기서 문제는 큐가 비어있을 때 소비자를 휴면 상태로 만들고, 실행할 새 작업이 있을 때 다시 깨우는 것입니다.
그러나 다행히도 NodeJS 는 단일 스레드 이므로, 작업을 휴면으로 설정하는 것은 이벤트 루프로 제어 권을 되돌리는 것을 의미하고 작업을 재개하는 것은 콜백을 호출하는 것과 동일합니다.

이를 염두에 두고 몇가지 코드를 살펴봅시다.
이 장에서 이전에 구현한 TaskQueue클래스 중 하나의 유사한 공개(public) 인터페이스를 사용해서 TaskQueuePC 라는 새로운 클래스를 만들겠습니다.
하향식(top-down) 접근 방식으로 어떻게 이 클래스의 생성자를 구현 하는지부터 살펴보겟습니다.
```js
export class TaskQeueuPC{
	constructor(concurrency){
		this.taskQueue = []
		this.consumerQueue = []

		// 소비자를 생성
		for(let i = 0; i < concurrency; i++){
			this.consumer()
		}
	}
}
```

우선 우리는 두 개의 대기열을 갖습니다.
하나는 우리의 작어들(taskQueue)을 저장하며 다른 하나의 사용되지 않는 소비자(`consumerQueue`) 들을 저장하기 위해서 입니다.
이 대기열들이 어떻게 사용되는지 보면 대기열에 대한 이해가 명확해질 것 입니다.
생성자의 두 번째 부분에서는 우리가 도달하고자 하는 동시성 수만큼의 소비자를 생성합니다.

소비자가 어떻게 생겼는지 보겠습니다.

```js
async consumer(){
	while(true){
		try{
			const task = await this.getNextTask()
			await task()
		}catch(err){
			console.error(err)
		}
	}
}
```

소비자는 무한 while 루프 입니다.
반복할 때마다 `getNextTask()` 를 사용하여 대기열 새로운 작업을 조회합니다.

곧 보겠지만, 큐가 비어있으면, 현재 소비자는 휴면 상태로 전환됩니다.
새로운 작업이 사용 가능해지면 깨어나 이를 실행합니다.
작업에서 발생한 오류로 인해 소비자가 중지되면 안되기 때문에, 단순히 로그를 남기고 다음 반복을 계속합니다.
:::note `TaskQueuePc`에 있는 각 소비자는 실질적인 스레드 처럼 보입니다.
- 실제로 우리의 `consumer()` 함수는 무한 루프를 가지며, 다른 스레드에 의해서 깨어나기 전까지는 휴먼 상태로 전환이 가능합니다.
- 실제로는 각 소비자가 단지 Promise callback을 중심으로 구성된 비동기 함수라는 사실을 잊어선 안됩니다.
- while 루프는 지속적으로 cpu 사이클을 소모하는 것처럼 보이겠지만, 전통적인 while 루프에 비해 내부적으로 비동기적인 재귀와 더 유사합니다.

:::

다음 코드로 어떤 동작이 일어나고 있는지에 대한 느낌이 올 것입니다. `getNextTick()` 의 구현을 살펴봅시다.
```js
async getNextTask(){
	return new Promise((resolve)=>{
		if(this.taskQueue.length !== 0){
			return resolve(this.taskQueue.shift())
		}
		this.consumerQueue.push(resolve)
	})
}
```

`getNextTask()` 함수는 큐가 비어있지 않다면, 큐에서 첫번째 작업을 가지고 해결(resolve)되는 새로운 Promise를 반환합니다.
첫 번째 작업은 taskQueue에서 제거되고, resolve를 호출할 때 인자로 사용됩니다.

만약 큐가 비어있다면, 우리는 consumerQueue에 resolve 콜백을 추가하여, Promise의 해결을 연기합니다.
이것은 Promise와 Promise 가 반환되기를 기다리고 있는 소비자를 효과적으로 휴면 상태가 되도록 만들것입니다.

이제 알고리즘의 생산자 측에 해당하는 부분으로 전체 `TaskQueuePC` 클래스를 연결하는 역할을 합니다.
이것은 `runTask()` 함수에 구현됩니다.

```js
runTask(task){
	return new Promise((resolve, reject)=>{
		const taskWrapper = () =>{
			const taskPromise = task()
			taskPromise.then(resolve, reject))
			return taskPromise
		}
		if(this.consumerQueue.length !== 0){
			const consumer = this.consumerQueue.shift()
			consumer(taskWrapper)
		}else{
			this.taskQueue.push(taskWrapper)
		}
	})
}
```

먼저 실행시 입력된 task를 실행하고 `task()` 가 반환한 Promise 의 상태를 `runTask()` 가 반환하는 외부 Promise 로 전달하는 역할을 하는 `taskWrapper` 함수를 만듭니다.
다음으로 consumerQueue가 비어있지 않은 경우인데,

이는 새로운 작업이 실행되기를 기다리는 대기 상태의 소비자가 하나 이상 존재함을 의미합니다.
이 경우 대기열에서 첫번 째 소비자를 끄집어내어(기본적으로 `getNextTask()` 에서 반환한 Promise의 resolve 콜백임을 기억하십시오) taskWrapper를 인자로 바로 호출합니다.
반면 모든 소비자가 이미 실행 중이라면, taskWrapper를 taskQueue에 push 합니다.

이로써 TaskQueuePC 클래스의 구현을 마칩니다.
TaskQueuePc 클래스의 공개 인터페이스는 우리가 Promise 섹션에서 구현한 TaskQueue 클래스에서와 동일합니다.
따라서 우리의 웹 스파이더 코드를 새로운 알고리즘에 마이그레이션 하는 것은 간단한 작업이 될 것입니다.

이것으로 `async/await` 구조에 대한 탐구를 마쳤습니다.
하지만, 이 장을 끝내기 전에 Promise 에 영향을 미치는 미묘한 문제에 대해 살펴보겟습니다.

# 무한 재귀 Promise Resolution 체인의 문제

이 시점에서 여러분은 가장 일반적인 제어 흐름 구조를 구현하기 위해서 Promise가 어떻게 작동하고 이동하고 어떻게 그것을 사용하는지에 대해 잘 이해하고 있어야합니다.

따라서 지금 NodeJS 개발자 모두 알고 이해해야 하는 고급 주제를 말할 좋은 시간입니다.
이 고급 주제는 무한 Promise 해결 체인에 의해 생기는 메모리 누수에 대한 것입니다.

이 버그는 실질적인 Promise/A+ 명세에도 해당하는 것처럼 보입니다.
따라서 명세를 지킨 구현이라고 이 버그에 면역을 가지는 것은 아닙니다.

프로그래밍을 할 때, 작업들이 미리 정해진 결말을 갖고 있지 않거나, 잠재적으로 무한한 데이터 배일을 입력으로 받는 경우는 흔합니다.
스트림 방송중인 오디오/비디오의 인코딩/디코딩, 실시간 가상 화폐 시장 데이터의 처리 그리고 IoT 센서들의 모티너링과 같은 종류가 그 예입니다.
그러나 우리는 사용 빈도가 높은 함수형 프로그래밍을 만들 때 더 사소한 상황에서 문제에 부딪힐 수 있습니다.

쉬운 예를 위해서 다음의 코드와 같이 프라미스를 사용한 간단한 무한 동작을 정의 해보겟습니다.

```js
function leakingLoop(){
	return delay(1)
		.then(()=>{
			console.log(`Tick ${Date.now()}`)
			return leakingLoop()
		})
}
```

방금 정의한 `leakingLoop()` 함수는 비동기 작업을 가정하기 위해서 `delay()`함수를 사용합니다.
주어진 밀리초가 지났을 때, 현재의 시간을 출력하고 다시 작업을 시작하기 위해서 `leakingLoop()`를 재귀적으로 호출하여, 작업을 다시 시작합니다.

흥미로운 부분은 `leakingLoop()`에 의해서 반환되는 Promise 의 상태가 다음 `leakingLoop()` 호출에 따라 달라지기 때문에, 절대로 해결(`resolve`) 되지 않는 다는 것입니다.
이 상황은 결정(`settle`)되지 않는 일련의 Promise 체인을 만들고 JavaScript ES6 Promise를 포함하여 Promise/A+ 스펙을 엄격히 따르는 Promise 구현에서 메모리 누수를 유발하빈다.

이 누수를 보여주기 위해서 leakingLoop() 함수를 매우 많이 실행시켜 누수의 영향을 강조해보겠습니다.
```js
for(let i = 0;i<1e6; i++){
	leakingLoop()
}
```

그리고 나서 선호하는 프로세스 검사기 (process inspector)를 사용하여 메모리 사용량을 살펴보면 그 프로세스가 완전히 충돌 될때까지 메모리 사용량이 계속해서 늘어나는 것을 확인 할수 있습니다.

이 문제에 대한 해결책은 Promise 해결의 체인을 끊는 것입니다.
`leakingLoop()`에 의해 반환된 Promise 의 상태가 다음 `leakingLoop()` 호출에 의해 반환된 Promise에 의존하지 않았는지를 확인하여, 이를 수행할 수 있습니다.

예에서는 `return` 명령을 제거하기만 하면 됩니다.
```js
function nonLeakingLoop(){
	delay(1)
		.then(()=>{
			console.log(`Tick ${Date.now()}`)
			noneLeakingLoop()
		})
}
```

이제 예제 프로그램에서 이 새로운 함수를 사용하면 가비지 컬렉터의 실행 스케줄에 따라서 프로세스의 메모리 사용량이 올라갔다 내려갔다 하는 것을 볼 수 있습니다.

이것은 메모리 누수가 없음을 의미합니다.

그러나 방금 제안한 방법은 원래 `leakingLoop()` 함수의 동작을 근본적으로 변경합니다.
특히, 각각의 Promise들의 상태가 서로 연결되어 있지 않기 때문에 재귀의 깊은 곳에서 생성되는 에러를 전파하지 않습니다.
이러한 애로 사항은 함수에 몇몇의 추가적인 로깅을 넣음으로써 완화 할 수 있습니다.

그러나 때때로 새로운 동작을 하게끔 변경하는 것이 선택지에 없을 수 있습니다.
따라서 가능한 해답은 다음의 코드 샘플과 같이 재귀함수를 Promise 생성자로 감싸는 것입니다.

```js
function nonLeakingLoopWithErrors(){
	return new Promise((resolve, reject)=>{
		(function internalLoop(){
			delay(1)
				.then(()=>{
					console.log(`Tick ${Date.now()}`)
					internalLoop()
				})
				.catch(err=>{
					reject(err)
				})
		})()
	})
}
```

이 경우 여전히 재귀의 여러 단계에서 생성된 Promise 사이에 링크가 없습니다.
그러나 `nonLeakingLoopWidthErrors()` 함수에 의해 반환된 Promise는 발생하는 재귀의 깊이에 관곙 ㅓㅄ이 비동기 작업이 실패하면 바로 거부됩니다.

세번째 해답은 `async/await` 를 사용하여 만드는 것입니다.
실제로 `async/await` 를 사용하면 다음과 같이 간단하게 무한한 while 루프로 재귀 Promise 체인을 실험해 볼 수 있습니다.

```js
async function nonLeakingLoopAsync(){
	while(true){
		await delay(1)
		console.log(`Tick ${Date.now()}`)
	}
}
```
이 함수에서도 원래 재귀 함수의 동작을 보존하면서 비동기 작업(이 경우 `delay()`) 에서 발생한 모든 오류가 함수 호출자에게 전파됩니다.

우리가 주목해야할 것은 while Loop 대신에 다음의 코드와 같이 실제 비동기 재귀 단계로 `async/await` 를 사용하는 구현을 선택한다면, 여전히 메모리 누수가 발생할 수 있다는 것입니다.

```js
async function leakingLoopAsync(){
	await delay(1)
	console.log(`Tick ${Date.now()}`)
	return leakingLoopAsync()
}
```

위의 코드는 결코 해결(resolve)되지 않는 무한 Promise 체인을 계속해서 생성합니다.
그러므로 Promise 기반 구현에서와 같은 메모리 누수에 의한 영향을 받습니다.

따라서 다음에 무한 Promise 체인을 구축할 때 이 섹션에서 배운 것처럼 메모리 누수를 생성하는 조건이 있는지 다시 한번 확인해보아야 합니다.
문제가 있는 경우 상황에 가장 적합한 솔루션으로 여기서 제시된 해결책 중 하나를 적용하여 해결 할 수 잇습니다.

