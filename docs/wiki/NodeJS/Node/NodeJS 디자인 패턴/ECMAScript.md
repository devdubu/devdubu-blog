# ESM
ESM명세는 CommonJS나 AMD 와 같은 기존의 모듈 시스템에 있는 좋은 방안들은 유지하려고 애썼습니다.
문법은 매우 간단하면서, 짜임새를 갖추고 있습니다.
순환 종속성에 대한 지원과 비동기적으로 모듈을 로드할 수 있는 방법을 제공합니다.

ESM과 CommonJS 사이의 가장 큰 차이점은 ES 모듈은 static이라는 것입니다.
즉, import가 모든 모듈의 가장 상위 레벨과 제어 흐름 구문의 바깥 쪽에 기술 됩니다.
또한 import 할 모듈의 이름을 코드를 이용하여, 실행 시에 동적으로 생성할 수 없으며, 상수 문자열만이 허용됩니다.

예를 들어, 다음의 코드는 ES 모둘 사용시에 적합하지 않습니다.
```js
if(condition){
	import module1 form 'module1'
}else{
	import module2 form 'module2'
}
```

반면, CommonJS에서는 다음과 같이 작성하는 것이 전혀 문제 될 것이 없습니다.

```js
let module = null
if(condition){
	module = require('module1')
}else{
	module = require('module2')
}
```

얼핏 보기에 ESM의 이러한 특성이 불필요한 제약으로 보일 수도 있지만, static import를 사용하면, CommonJS의 동적인 특성으로 구현했을 때 비효율적인 여러가지 시나리오가 가능해집니다.

예를 들어, static import는 사용하지 않는 코드 제거와 같이 코드 최적화를 해줄 수 있는 종속성 트리의 정적 분석이 가능해진다.

# NodeJS 에서 ESM의 사용
NodeJS는 모든 `.js` 파일이 CommonJS 문법을 기본으로 사용한다고 생각합니다.
따라서 우리가 `.js` 파일에 ESM 문법을 사용한다면, 인터프리터는 에러를 낼 것입니다.
NodeJS CommonJS 모듈 대신 ES 모듈을 받아 들일 수 있는 몇가지 방법이 있습니다.

:::note 
- 모듈 파일의 확장자를 `.mjs` 로 합니다.
- 모듈과 가장 근접한 `package.json`의 type 필드에 module 을 기재합니다.

:::

## `exports`와 `imports` 지정하기

ESM 은 export 키워드를 통해 모듈의 기능을 export 하게 해줍니다.
:::tip ESM 은 CommonJS에서 여러 방법(export 와 module.export)을 사용하는 것과는 다르게 export한 단어만 사용합니다.

:::

ES 모듈에서는 기본적으로 모든 것이 `private` 이며, `export` 된 개체들만 다른 모듈에서 접근 가능합니다.

`export` 키워드는 우리가 모듈 사용자에게 접근을 허용하는 개체 앞에 사용합니다.
예제를 보겠습니다.
```js
// logger.js

// log 로서 함수를 export
export function log(message){
	console.log(message)
}

// DEFAULT_LEVEL 로서 상수를 export
export const DEFAULT_LEVEL = 'info'

// LEVEL 로서 객체를 export
export const LEVELS = {
	error: 0,
	debug: 1,
	warn: 2,
	data: 3,
	info: 4,
	verbose: 5
}

// Logger 로서 클래스 export
export class Logger{
	constructor(name){
		this.name = name
	}

	log(message){
		console.log(`[${this.name} ${message}]`)
	}
}
```

우리가 모듈로부터 원하는 개체를 `import` 하고 싶다면, `import ` 키워드를 사용합니다.
문법은 꽤나 유연하고, 하나 이상의 개체를 `import`할 수 있으며, 다른 이름으로도 지정 가능합니다.

```js
import * as loggerModule from './logger.js'
console.log(loggerModule)
```

위 예제는 모듈의 모든 멤버를 `import` 하고 `loggerModule` 변수에 할당하기 위해서 * 문법(namespace import) 을 사용했습니다.

위에 출력에서 볼 수 있듯이, 우리의 모듈에서 `export`된 모든 개체들을 `loggerModule` nameSpace로 접근 가능합니다.

:::note CommonJS와는 반대로 ESM 에서는 파일의 확장자를 구체적으로 명시해야함
- CommonJS에서는 `./logger` 또는 `./logger.js` 모두 사용 가능하지만, ESM 은 무조건 `./logger.js`만 가능함


:::

만약 우리가 규모가 큰 모듈을 사용하고자 할 때, 모듈의 모든 기능들을 원하지 않고 하나 혹은 몇개의 개체 만을 사용하고 싶을 때 아래와 같은 방법이 있습니다.

```js
import { log } from './logger.js'

log('Hello World')
```

하나 이상의 객체를 `import` 하고 싶을 때는 다음과 같이 합니다.

```js
import { log, Logger } from './logger.js'

log('Hello World')
const logger = new Logger('DEFAULT')
logger.log('Hello World')
```

이와 같은 `import` 구문은 `import`되는 개체가 현재의 스코프로 `import` 되기 때문에, 이름이 충돌 가능성이 있습니다.

```js
import { log } from './logger.js'

const log = console.log
```

이러한 상황에서 우리는 `import` 되는 개체의 이름을 `as` 키워드로 바꾸어주는 것으로 문제를 해결 할 수 있다.

```js
import { log as log2 } from './logger.js'
const log = console.log

log('message from log')
log2('message from log2')
```

이 방법은 서로 다른 모듈에서 같은 이름을 가진 개체의 `import` 로 인해서 충돌이 발생하였을 때, 유용하게 사용되는데, 이 것이 모듈 사용자가 모듈의 원래 이름을 바꾸는 방법을 별도로 고려하지 않아도 되게 해줍니다.

## `export`와 `import` 기본 값 설정하기

CommonJS에서 가장 많이 사용되는 특성이 이름이 없는 개체를 `module.exports`에 할당하여, `export` 할 수 있다는 것입니다.
모듈 개발자에게 단일 책임 원칙을 권장하고 깔끔한 하나의 `interface` 를 노출시킨다는 것이 매우 편리하다는 사실을 확인했습니다.
ESM에서 비슷한 동작을 할 수 있는데, `default export`라고 불립니다.

```js
// logger.js
export default class Logger{
	constructor(name){
		this.name = name
	}

	log(message){
		console.log(`[${this.name} ${message}]`)
	}
}
```

이 경우에 `Logger` 라는 이름은 무시되며, `export` 되는 개체의 default 라는 이름 아래 등록 됩니다.
`export` 된 이름은 특별한 방법으로 다루게 됩니다.

다음의 예제에서 처럼 `import` 됩니다.

```js
// main.js
import MyLogger from './logger.js'
const logger = new MyLogger('info')

logger.log('Hello World')
```


`default export` 는 이름이 없는 것으로 간주되기 때문애, 이름을 명시한 ESM의 `import` 와는 다릅니다.
`import`와 동시에 우리가 지정한 이름으로 할당됩니다.

위의 예제에서는 `MyLogger`를 상황에 맞는 것으로 바꿀 수 있습니다.

이것은 CommonJS 모듈에서 우리가 했던 것과 매우 비슷합니다.
주의할 점은 import 모듈의 이름을 중괄호로 감싸지 않아야하며, 이름을 지정할 때에도 마찬 가지다.

내부적으로 `default export`는 `default` 라는 이름으로 `export` 되는 것과 동일하다.
다음 코드 스니펫을 실행하여, 해당 구문을 쉽게 확인 가능하다.

```js
// showDefault.js
import * as loggerModule from './logger.js'
console.log(loggerModule)
```

한가지 불가능 한 것이 있다면, default 개체를 명시적으로 `import` 할 수 없다.

```js
import { default } from './logger.js'
```

이유는 `default`라는 이름의 변수가 사용될 수 없기 때문입니다.
이것은 객체의 속성으로서는 유효하기 때문에, 앞선 예제 `loggerModule.default` 를 사용해도 문제가 없습니다.
하지만, scope 내에서는 `default` 라는 이름의 변수를 직접 사용할 수 없습니다.

## Miexed Import
ES 모듈에서는 이름이 지정된 `export`와 `default export`를 혼합하여 사용 가능합니다.
```js
// logger.js
export default function log(message){
	console.log(message)
}

export function info(message){
	log(`info: ${message}`)
}
```

앞의 코드를 보면 `log()` 함수가 `default export` 로서 내보내지고 `info()` 함수는 이름을 가진 `export`로 내보내집니다.
내부적으로 `info()`가 `log()` 를 참조할 수 있다는 것을 볼 수 있습니다.
`log()`를 `default()`로 호출하는 것은 문법 오류(Unexpected token defualt)를 내기 때문에, 불가능 합니다.

우리가 `default export`와 이름을 가진 `export`를 `import` 하기 원한다면, 다음과 같은 형식을 사용합니다.

```js
import mylog, { info } from './logger.js'
```

이 예제에서 우리는 `logger.js` 로 부터 `default export`를 `mylog` 라는 이름으로, 그리고 `info`를 `import` 합니다

`default export`와 이름을 가진 `export`의 차이점에 대한 몇가지 사항을 알아보자

:::tip 이름을 가진 export 는 명확합니다.
- 지정된 이름을 갖는 것은 IDE 로 하여금, 개발자들에게 자동 import, 자동완성, 리팩토링 툴을 지원할 수 있게 합니다.

:::

:::warning 반대로 `default export` 는 주어진 기능이 서로 다른 파일에서 서로 다른 이름을 가질 수 있다.
- 그러므로, 모든 면에서 좀 더 복잡한 경향을 가집니다.
- 따라서 주어진 이름에 어떠한 모듈이 적용 될 것인지, 추론하기 힘들어집니다.
- `default export` 는 모듈에서 가장 핵심적인 한 가지 기능과 연결하는 편리한 방법이다.

:::

:::note `default export` 장단점
- 또한 사용자 관점에서 볼때는, 바인딩을 위한 정확한 이름을 알 필요 없이 기능의 확실한 부분을 import 할 수 있다.
- `default export`는 특정 상황에서, 사용하지 않는 코드의 제거(tree shaking) 작업을 어렵게 만듭니다. 

:::

이러한 이유로 명확하게 하나의 기능을 export 하고 싶을 때에는 `default export`를 사용하되, 이름을 사용한 `export` 사용에 습관을 들이는 것이 일반적으로 좋은 방법입니다.

특히 하나의 이상의 기능을 내보내고 싶을 때에는 더욱 그렇습니다.

이것은 엄격히 정해진 규칙이 아니며, 위의 제안에 대한 주목할 만한 예외사항이 있습니다.
예를 들어 모든 NodeJS 코어 모듈은 `default export`와 `named export`를 동시에 갖고 있고, `React`역시 혼합된 방식을 사용합니다.

## 모듈 식별자
**모듈 식별자**는 `import` 구문에서 우리가 적재하고 싶은 모듈의 경로를 명시할 때 쓰이는 값이니다.
우리는 지금까지 상대 경로를 사용하였습니다.
하지만, 알아두어야할 다양한 방법이 존재합니다.

- **상대적 식별자(Relative)** 
	- `./logger.js` 또는 `../logger.js`와 같이 직접적이고 명확하게 완전한 경로가 사용됩니다.
- **절대 식별자(Absolute)**
	- `file://opt/nodejs/config.js`와 같이 직접적이고 명확하게 완전한 경로가 사용됩니다.
	- 이 방법은 유일하게 ESM 에 해당하며, `/` 또는 `//`가 선행하였을 경우에는 동작하지 않습니다.
- **노출 식별자 (Bar)**
	- `fastify` 또는 `http`와 같이 `node_modules` 폴더에서 사용 가능하고, 패키지 매니저를 통해서 설치된 모듈 또는 NodeJS 코어 모듈을 가리킵니다.
- **심층 임포트 식별자(Deep import)**
	- `fastify/lib/logger.js`와 같이 `node_modules`에 있는 패키지의 경로로 가르킵니다.

브라우저 환경에서는 `https://unpkg.com/lodash`와 같이 모듈의 URL을 명시하여 모듈을 직접 import 할수 있습니다.
이것이 NodeJS 에서는 지원되지 않는 특성입니다.

## 비동기 `import`
이전 섹션에서 본 것처럼 `import` 구문은 정적이기에, 두 가지 주요 제약이 존재합니다.
- 모듈 식별자는 실행 중에 생성할 수 없습니다.
- 모듈의 import는 모든 파일의 최상위에 선언되며, 제어 구문 내에 포함될 수 없습니다.

이러한 제약점이 과도한 제약이 되는 경우의 몇몇 유스케이스가 존재합니다.

:::question 예를 들어 우리가 현재 사용자 언어를 위한 특정 번역 모듈을 import 해야하거나, 사용자 운영체제에 의존하는 다양한 모듈을 import 해야 한다고 생각해보자
- 추가적으로 우리가 상대적으로 무거운 모듈을 사용하고자 할 때, 기능의 특정 부분에만 접근하려 한다면, 어떨까요?

:::

ES 모듈은 이러한 제약을 극복하기 위해서 비동기 import 를 제공합니다.
비동기 import 는 특별한 `import()` 연산자를 사용하여, 실행 중에 수행됩니다.

모듈 식별자는 이전 섹션에서 언급된 것 중에서 어떤 것이든지 사용 가능합니다.

우리는 여러 나라 언어로 `"Hello world"`를 출력하는 커맨드라인 애플리케이션을 만들고 싶습니다.
추후에 더 많은 문장과 언어를 지원하고 싶을 수 있기에. 지원되는 언어에 따라 번역을 가지는 파일을 만드는 것이 합당합니다.

우리가 지원하고자 한느 언어를 위한 연습용 모듈을 만들어 봅시다.

```js
// strings-en.js
export const HEELO = 'Hello World'

// strings-es.js
export const HEELO = 'Hola mundo'
```

이제 커맨드 라인에서 사용될 언어 코드를 받고 선택된 언어의 `"Hello World"`를 출력하는 main script를 만들어 보자

```js
const SUPPORTED_LANGUAGES = ['en', 'es']

const selectedLanguage = process.argv[1]

if(!SUPPORTED_LANGAUAGES.include(selectedLanguage)){
	console.error('The specified langauage is not supported')
	prcess.exit(1)
}

const translationModule = `./strings-${selectedLanguage}.js`
import(translationModule)
	.then((string)=>{
		console.log(strings.HELLO)
	})

```

## 모듈 적재 이해하기

ESM이 어떻게 동작하고 어떻게 순환 종속성을 다루는지 이해하기 위해서는 ES 모듈을 사용할 때 JavaScript 코드가 어떻게 파싱되고 평가되는지 좀더 알아봐야합니다.

### 로딩 단계
인터프리터의 목표는 필요한 모든 모듈의 그래프(종속성 그래프)를 만들어 내는 것입니다.

:::note 종속성 그래프?
- 일반적인 용어로 종속성 그래프는 객체 그룹의 종속성을 나타내는 직접 그래프로서 정의 됩니다.
- 이 섹션에서 종속성 그래프를 가리킬 때 우리는 ECMAScript 모듈들 사이의 종속성 관계를 나타낼 것입니다.
- 앞으로 살펴보겠지만, 종속성 그래프를 사용하는 것은 주어진 프로젝트에서 적재되는 모든 모듈의 순서를 결정할 수 있게 해줍니다

:::

인터프리터는 모듈이 실행되어야 할 코드의 순서와 함계 모듈 간에 어떠한 종속성을 갖는지 이해하기 위해서 기본적으로 종속성 그래프를 필요로 합니다.

Node 인터프리터가 실행되면, 일반적으로 JavaScript 파일 형식으로 실행할 코드가 전달됩니다.
파일은 종속성 확인을 위한 **진입점** 입니다.

인터프리터는 진입점에서부터 필요한 모든 코드가 탐색되고 평가 될 때가지 import 구문을 재귀적인 깊이 우선 탐색으로 찾습니다.

좀 더 구체적으로, 3단계에 걸쳐 작업이 진행됩니다.
1. 생성 또는 파싱
	- 모든 `import` 구문을 찾고 재귀적으로 각 파일로부터 모든 모듈의 내용을 적재합니다.
2. 인스턴스화
	- 익스포트된 모든 개체들에 대해 명명된 참조를 메모리에 유지합니다.
	- 또한 모든 `import` 및 `export`문에 대한 참조가 생성되어 이들 간의 종속성 관계를 추적합니다.
	- 이 단계에서는 어떠한 JavaScript 코드도 실행되지 않습니다.
3. 평가
	- NodeJS 는 마지막으로 코드를 실행하여, 이전에 인스턴스화된 모든 개체가 실제 값을 얻을 수 있도록 합니다.
	- 이제 준비가 되었기 때문에, 진입점에서 코드를 실행할 수 있습니다.

쉽게 표현하자면, 1단계는 모든 점들을 찾는 것, 2단계는 각 점들을 연결하여 길을 만드는 것, 3단계는 올바른 순서로 길을 걷는 것입니다.

이러한 접근 방법은 얼핏 보았을 때 `CommonJS` 와 많이 달라 보이지 않지만, 근본적인 차이가 존재합니다.

`CommonJS` 는 동적 성질로 인해서 종속성 그래프가 탐색되기 전에 모든 파일들을 실행시킵니다.
이전에 있던 모든 코드가 이미 실행되고도 새로운 `require`를 사용할 수 있고 변수에 모듈 식별자를 생성할 수 있는 것입니다.

ESM에서는 이러한 3단계가 완전히 분리되어 있습니다.
종속성 그래프가 완전해지기 전까지는 어떠한 코드도 실행되지 않습니다.
그러므로, 모듈 import 와 export는 정적이어야 합니다.

### 읽기 전용 라이브 바인딩
순환 의존성에 도움이 되는 ES 모듈의 또 다른 기본적인 특성은 import 된 모듈이 export 도니 값에 대해 읽기 전용 라이브 바인딩 된다는 개념입니다.

이것이 의미하는 것이 무엇인지 간단한 예제와 함께 알아보겠습니다.

```js
//counter.js
export let count = 0
export function increment(){
	count++
}
```

이 모듈은 두 개의 값을 내보냅니다.
간단한 정수 카운터인 count와 카운터를 1씩 증가시키는 increment 함수 입니다.

이제 이 모듈을 사용하는 코드를 작성해 보겠습니다.
이제 이 모듈을 사용하는 코드를 작성해보겠습니다.

```js
// main.js
import { count, increment } from './counter.js'
console.log(count) // 0을 출력

increment()
console.log(count) // 1을 출력
count++
```

코드에서 우리가 볼 수 있는 것은 우리가 count 값을 언제든지 읽을 수 있으며, `increment()` 함수를 이용하여, 이를 변경할 수 있다는 것입니다.
하지만, count 변수를 직접적으로 변경 시키려 했을 때, 마치 우리가 `const`로 바인딩 된 값을 변경하려 했을 때, 발생하는 에러가 나타나게 됩니다.

이것이 입증하는 것은 scope 내에 개체가 import되었을 때, 사용자 코드의 직접적인 제어 밖에 있는 바인딩 값은 그것이 원래 존재하던 모듈(live binding) 에서 바뀌지 않는 한, 원래의 값에 대한 바인딩이 변경 불가(read-only binding)하다는 것입니다.

이러한 접근 방법은 CommonJS와 근본적으로 다릅니다
실제로 CommonJS에서는 모듈로부터 require가 되었을 때, exports 객체 전체가 복사(얕은 복사)됩니다.
이것이 의미하는 것은 숫자나 문자열과 같은 원시 변수(primitive) 변수에 있는 값이 나중에 바뀌었을 때 이것을 제공한 모듈은 변화를 알지 못한다는 것입니다.

### 순환 종속성 분석
이제 순환을 마무리하기 위해서 CommonJS 모듈 섹션에서 보았던 순환 종속성 예제를 ESM 문법을 사용해 재구현 해보겠습니다.

![Diagram-1.svg](/img/이미지 창고/Diagram-1.svg)
먼저 모듈 `a.js` 와 `b.js`를 살펴보겠습니다.

```js
// a.js
import * as dModule from './b.js'

export let loaded = false
export const b = bModule
loaded = true

// b.js
import * as aModule from './a.js'
export let loaded = false
export const a = aModule
loaded = true
```

그리고 `main.js`  파일(진입점)에서 두 모듈을 어떻게 Import 했는지 보겠습니다.

```js
// main.js
import * as from './a.js'
import * as from './b.js'
console.log('a->', a)
console.log('b->', b)
```

이번 예제에서는 `a.js` 와 `b.js`사이에 실질적인 순환 참조가 존재하여 `JSON.stringify`를 사용하면 `TypeError: Converting circular structure to JSON` 에러가 나기 때문에, 이것을 사용하지 않았다는 것을 눈여겨볼 필요가 있습니다.

여기서 흥미로운 점은 서로의 부분적 정보만 가지고 있었던 `CommonJS` 를 사용했을 때와는 다르게 모듈 `a.js`와 `b.js`가 서로에 대한 완전한 내용을 갖는다는 것입니다.

그리고 모든 `loaded` 값이 `true`로 설정된 것을 볼 수 있습니다.
또한 현재 scope 에서 사용 가능한 b 인스턴스가 a 내부의 실제 참조이며, b안의 a 또한 그렇습니다.

이 때문에, 우리가 이 모듈들을 직렬화 시키기 위한 `JSON.stringify()`를 사용할 수 없는 것입니다.
마지막으로 모듈 `a.js`와 `b.js`의 import 순서를 바꿔도, 마지막 결과물은 바뀌지 않습니다.
`CommonJS` 와 동작을 비교할 때, 또 다른 중요한 차이점 입니다.

이 구체적인 예제를 위해 모듈 분석의 3단계(파싱, 인스턴스화, 평가)에서 무슨일이 발생하는지 관찰하는 것에 더 많은 시간을 할애할만한 가치가 있습니다.

### 1단계 - 파싱
파싱 단계에서는 진입점(`main.js`) 에서부터 코드의 탐색이 시작됩니다.
인터프리터는 필요한 모든 모듈을 찾고 모듈 파일로부터 소스코드를 적재하기 위해서 모든 `import` 구문만을 찾습니다.

깊이 우선적으로 종속성 그래프가 탐색 되고 모든 모듈이 한번 씩만 방문 됩니다.
아래와 같이 보는 바와 같이 인터프리터는 트리 구조와 같이 종속성 그래프의 외관을 만듭니다.



![Diagram.svg](/img/이미지 창고/Diagram.svg)


---

#NodeJS #ApplicationArcithecture 

---