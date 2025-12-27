---
slug: "tsconfig.json-설정"
---
TypeScript 코드를 JavaScript로  컴파일하는 과정을 예시로 들어서 구성하겠습니다.

구성 폴더 구조는 아래와 같습니다.
```
| -- build
|	| -- index.html
| -- src
|	| -- main.ts
| -- tsconfig.json
```


`tsconfig.json`
```json
{
	"compilerOptions":{
		"rootDir": "./src",
		"outDir" : "./build/js",
		"target" : "ES6",
		"noEmitOnError": true
	},
	include:[
		"./src/**/*.ts"
	]
}
```

- `compilerOptions`
	- TypeScript에서 컴파일에 해당하는 옵션을 지정하는 공간
	- Ts -> Js 로 컴파일 시에, 해당 `tsconfig.json`을 보고 제어를 하게 됩니다.

```shell
tsc -w
```

명령어를 작성하면 `outDir` 위치에 해당 `js` 이 생성된 것을 볼 수 있습니다.


## CompilerOptions 
| 옵션                 | 설명                                          | 예시                | Type       |
| ------------------ | ------------------------------------------- | ----------------- | ---------- |
| `rootDir`          | 해당 ts의 entry point 가 되는 파일 경로               |                   | `String`   |
| `outDir`           | 빌드 후에 js 로 번역된 파일을 위치 시키는 경로                |                   | `String`   |
| `target`           | 해당 빌드를 진행하는데 사용되는 JS 버전                     | `ES6`             | `String`   |
| `noEmitOnError`    | Error가 존재 시에, **Emit(JS 변환)**을 할지 말지에 대한 옵션 |                   | `Boolean`  |
| `module`           | 컴파일을 마친 후 JS 가 사용하는 모듈 시스템                  | `ESNext`, `ES6`   | `String`   |
| `moduleResolution` |                                             | `Node`, `Classic` | `String`   |
| `esModuleInterop`  | ESM, CommonJS 호환하여 사용 할 것인지                 |                   | `Boolean`  |
| `lib`              | 컴파일 과정에서 사용하는 라이브러리 지정 보통 `E`               | `ESNext`, `DOM`   | `String[]` |
| `strict`           | Ts 파일에 타입을 엄격하게 사용한다는 명시                    |                   | `Boolean`  |

## include

:::tip 간혹 가다, 지정된 `rootDir` 외부에서도 ts를 작성할 때도 존재하기에, 해당 부분에서 에러를 없애기 위해서는 `include` 옵션을 사용합니다.

:::

해당 옵션을 작성하게 된다면, 배열 내부에 있는 경로에서만 ts 파일을 찾기 때문에, 그 외의 경로는 모두 무시 됩니다.
