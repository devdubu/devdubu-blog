---
slug: "TypeScript-Compiler"
---

# Compilation Context

> The compilation context is basically just fancy term for grouping of the file that Typescript will parse and analyze to determine what is valid and what isn't
> Along with the interface about which files, the compilation context contains information about which compiler options are in use
> A great way to define this logical grouping(we also like to use the term project) is using a tsconfig.json.file


![Screenshot-2023-05-30-at-8.57.55-PM.png](/img/이미지 창고/Screenshot-2023-05-30-at-8.57.55-PM.png)

## tsconfig schema

[tsconfig파일의 스키마 구조 사이트](http://json.schemastore.org/tsconfig)

:::success 최상위 프로퍼티
- compileIOnSave
- extends
- compileOption
- files
- include
- exclude
- references

:::

### tsconfig
[tsconfig](tsconfig.md)



## compileOnSave
```json
{
	...,
	"compileOnSaveDefinition" : {
		"properties" : {
			"compileOnSave" : {
				"description" : "Enable Compile-on-Save for this project.",
				"type": "boolean"
			}
		}
	},
	...
}
```
- 해당 기능은 파일을 Save하게 되면 자동 compile되는 옵션이다.
- true / false (default false) 로 설정할 수 있다.
- Vs 2015 with TypeScript 1.8.4 이상 해당 기능을 지원한다.
- 혹은 [atom-typescript Plugin](https://github.com/TypeStrong/atom-typescript#comile-on-save)가 설치 되어야 한다.

## extends
```json
{
	...,
	"extendsDefinition" : {
		"properties" : {
			"extends" : {
				"description" : "Path to base configuration file to inherit from. Require TypeScript version 2.1 or later",
				"type": "string"
			}
		}
	},
	...
}
```
### 예시
```json
{
	"extends" : "./base.json",
	"compilerOptions": {
		...
		//"strict": true
		...
	}
}
```
`tsconfig.json`

```ts
{
	"compilerOptions": {
		"strict": true
	}
}
```
`base.json`
- 위와 같이 구성하게 된다면, `base.json`에 의해서 `tsconfig.json`에서 활성화 되지 않던 `"strict": true` 옵션이 `base.json`과 함게 활성화 된다.

## files, include, exclude

```json
{
	...,
	"filesDefinition" : {
		"properties" : {
			"files" : {
				"description" : "If no 'file' or 'include' property is persent in a tsconfig.json, the compiler defaults to including all files in the containg directory and subdirectories except those specified by 'exclude'. When a 'files' property is specified, only those files and those specified by 'include' are included. ",
				"type": "array",
				"uniqueItems" : true,
				"items": {
					"type": "string"
				}
			}
		}
	},
	"excludeDefinition" : {
		"properties" : {
			"exclude" : {
				"description" : "Specifies a list of files to be excludeed from compilation. The 'exclude' property only affects the files include via the 'include' property and property and not the 'files' property. Glob patterns require TypeScript version 2.0 or later",
				"type": "array",
				"uniqueItems" : true,
				"items": {
					"type": "string"
				}
			}
		}
	},
	"includeDefinition" : {
		"properties" : {
			"include" : {
				"description" : "Specifies a list of glob patterns that match files to be included in compilation. If no 'files' or 'include' property is present in a tsconfig.json, the compiler defaults to including all files in the containing directory and subdirectories except those specified by 'exclude'. Requires TypeScript version 2.0 or later",
				"type": "array",
				"uniqueItems" : true,
				"items": {
					"type": "string"
				}
			}
		}
	},
	...
}
```

:::tip files, include, exclude
- 셋다 설정이 없으면, 전부다 컴파일 한다.

:::

### files
- 상대 혹은 절대 경로의 리스트 배열 입니다.
- exclude 보다 상위의 개념이다.

### include, exclude
- glob 패턴(마치 `.gitignore`)
#### include
- exclude 보다 하위 개념이다.
- *  같은걸 사용하면, `.ts`, `.tsx`, `.d.ts` 만 include(allow JS)
#### exclude
- 설정 안하면 4가지(`node_modules`, `bower_components`, `jspm_packages`, `<outDir>`)를 default로 제외합니다.
- `<outDir>` 은 항상 제외합니다.(include에 있어도)

# compileOptions
---
## typeRoots, types
## type

```json
{
	...,
	"typeRoots" : {
		"description" : "Specify multiple folders that act like `./node_modules/@types` .",
		"type": "array",
		"uniqueItems" : true,
		"items": {
			"type": "string"
		},
		"markdownDescription" : "Specify multiple folders that act like `./node_modules/@types` .\n\nSee more: https:www.typescriptlang.org/tsconfig#typeRoots"
	},
	"types":{
		"description" : "Specify type package names to be included without being referenced in a source file",
		"type" : "array",
		"uniqueItems" : "array",
		"items":{
			"type": "string"
		},
		"markdownDescription" : "Specify type package names to be included without being referenced in a source file .\n\nSee more: https:www.typescriptlang.org/tsconfig#types"
	},
	...
}
```

:::quote @types
- TypeScript 2.0 부터 사용 가능해진 내장 type definition 시스템
- 아무런 설정을 안한다면, `node_modules/@types `라는 모든 경로를 찾아서 사용
- `typeRoots`를 사용한다면, **배열 안에 들어있는 경로**들 아래서만 가져온다.\
- `types` 를 사용하면, **배열 안의 모듈** 혹은 **./node)modules/@types** 안의 모듈 이름에서 찾아온다.
- [] 빈 배열을 넣는 다는 것은 이 시스템을 이용하지 않겠다는 것이다.
- `typeRoots`와 `types`를 같이 사용하지 않는다.

:::

## target과 lib

### target

:::tip target?
- 빌드의 결과물을 어떤 버전으로 할 것인지
- 지정하지 않으면 default는 es3 입니다.

:::

```json
{
	"target": {
		"description": "Set the JavaScript language version for emittted JavaScript and include compatible library declarations.",
		"type": "string",
		"default": "ES3",
		"anyOf": {
			"enum": [
				"ES3",
				"ES5",
				"ES6",
				"ES2015",
				"ES2016",
				"ES2017",
				"ES2018",
				"ES2019",
				"ES2020",
				"ESNext",
			]
		},
		{
			"pattern": "^([Ee] [Ss] ([356] | (20(1[56789] | 20 )) | [Nn] [Ee] [Xx] [Tt] ))$"
		}
	},
	"markdownDescription": "Set the JavaScript language version for emitteed JavaScript and include compatible library declaration"
}
```

### lib

:::note lib?
- 기본 typedefinition 라이브러리를 어떤 것을 사용할 것인지
- `target`이 `es3`이고, default로 `lib.d.ts`를 사용한다.
- `target`이 `es5`이면, default로 `dom`, `es5`, `scripthost`를 사용한다.
- `target`이 `es6`이면, default로 `dom`, `es6`, `dom.interable`, `scripthost`를 사용한다.
- lib를 지정하면 그 lib 배열로만 라이브러를 사용한다.
- 빈 [] => `no definition found` 어쩌궁,,,

:::

```json
{
  "lib": {
    "description": "Specify a set of bundled library declaration files that describe the target runtime environment.",
    "type": "array",
    "uniqueItems": true,
    "items": {
      "type": "string",
      "anyOf": [
        {
          "enum": [
            "ES5", "ES6", "ES2015", "ES2015.Collection", "ES2015.Core", "ES2015.Generator", "ES2015.Iterable", "ES2015.Promise", "ES2015.Proxy", "ES2015.Reflect", "ES2015.Symbol.WellKnown", "ES2015.Symbol", "ES2016", "ES2016.Array.Include", "ES2017", "ES2017.Intl", "ES2017.Object", "ES2017.SharedMemory", "ES2017.String", "ES2017.TypedArrays", "ES2018", "ES2018.AsyncGenerator", "ES2018.AsyncIterable", "ES2018.Intl", "ES2018.Promise", "ES2018.Regexp", "ES2019", "ES2019.Array", "ES2019.Object", "ES2019.String", "ES2019.Symbol", "ES2020", "ES2020.BigInt", "ES2020.Promise", "ES2020.String", "ES2020.Symbol.WellKnown", "ESNext", "ESNext.Array", "ESNext.AsyncIterable", "ESNext.BigInt", "ESNext.Intl", "ESNext.Promise", "ESNext.String", "ESNext.Symbol", "DOM", "DOM.Iterable", "ScriptHost", "WebWorker", "WebWorker.ImportScripts"
          ]
        },
        {
          "pattern": "^[Ee][Ss]5|[Ee][Ss]6|[Ee][Ss]7$"
        },
        {
          "pattern": "^[Ee][Ss]2015(\\.([Cc][Oo][Ll][Ll][Ee][Cc][Tt][Ii][Oo][Nn]|[Cc][Oo][Rr][Ee]|[Gg][Ee][Nn][Ee][Rr][Aa][Tt][Oo][Rr]|[Ii][Tt][Ee][Rr][Aa][Bb][Ll][Ee]|[Pp][Rr][Oo][Mm][Ii][Ss][Ee]|[Pp][Rr][Oo][Xx][Yy]|[Rr][Ee][Ff][Ll][Ee][Cc][Tt]|[Ss][Yy][Mm][Bb][Oo][Ll].[Ww][Ee][Ll][Ll][Kk][Nn][Oo][Ww][Nn]|[Ss][Yy][Mm][Bb][Oo][Ll]))?$"
        },
        {
          "pattern": "^[Ee][Ss]2016(\\.[Aa][Rr][Rr][Aa][Yy].[Ii][Nn][Cc][Ll][Uu][Dd][Ee])?$"
        },
        {
          "pattern": "^[Ee][Ss]2017(\\.([Ii][Nn][Tt][Ll]|[Oo][Bb][Jj][Ee][Cc][Tt]|[Ss][Hh][Aa][Rr][Ee][Dd][Mm][Ee][Mm][Oo][Rr][Yy]|[Ss][Tt][Rr][Ii][Nn][Gg]|[Tt][Yy][Pp][Ee][Dd][Aa][Rr][Rr][Aa][Yy][Ss]))?$"
        },
        {
          "pattern": "^[Ee][Ss]2018(\\.([Aa][Ss][Yy][Nn][Cc][Ii][Tt][Ee][Rr][Aa][Bb][Ll][Ee]|[Ii][Nn][Tt][Ll]|[Pp][Rr][Oo][Mm][Ii][Ss][Ee]|[Rr][Ee][Gg][Ee][Xx][Pp]))?$"
        },
        {
          "pattern": "^[Ee][Ss]2019(\\.([Aa][Rr][Rr][Aa][Yy]|[Oo][Bb][Jj][Ee][Cc][Tt]|[Ss][Tt][Rr][Ii][Nn][Gg]|[Ss][Yy][Mm][Bb][Oo][Ll]))?$"
        },
        {
          "pattern": "^[Ee][Ss]2020(\\.([Bb][Ii][Gg][Ii][Nn][Tt]|[Pp][Rr][Oo][Mm][Ii][Ss][Ee]|[Ss][Tt][Rr][Ii][Nn][Gg]|[Ss][Yy][Mm][Bb][Oo][Ll].[Ww][Ee][Ll][Ll][Kk][Nn][Oo][Ww][Nn]))?$"
        },
        {
          "pattern": "^[Ee][Ss][Nn][Ee][Xx][Tt](\\.([Aa][Rr][Rr][Aa][Yy]|[Aa][Ss][Yy][Nn][Cc][Ii][Tt][Ee][Rr][Aa][Bb][Ll][Ee]|[Bb][Ii][Gg][Ii][Nn][Tt]|[Ii][Nn][Tt][Ll]|[Ss][Yy][Mm][Bb][Oo][Ll]))?$"
        },
        {
          "pattern": "^[Dd][Oo][Mm](\\.[Ii][Tt][Ee][Rr][Aa][Bb][Ll][Ee])?$"
        },
        {
          "pattern": "^[Ss][Cc][Rr][Ii][Pp][Tt][Hh][Oo][Ss][Tt]$"
        },
        {
          "pattern": "^[Ww][Ee][Bb][Ww][Oo][Rr][Kk][Ee][Rr](\\.[Ii][Mm][Pp][Oo][Rr][Tt][Ss][Cc][Rr][Ii][Pp][Tt][Ss])?$"
        }
      ]
    },
    "markdownDescription": "Specify a set of bundled library declaration files that describe the target runtime environment.\n\nSee more: https://www.typescriptlang.org/tsconfig#lib"
  }
}
```

## outDir, outFile, rootDir

:::tip outDir? outFile?
- 쉽게 말하면, Ts -> Js로 빌드 시에, 해당 작업을 통해서 나오는 파일의 경로를 말한다.

:::

:::note rootDir?
- 우리가 지정한 실제 프로젝트 파일의 위치를 말한다.


:::

```json
{
  "outFile": {
    "description": "Specify a file that bundles all outputs into one JavaScript file. If `declaration` is true, also designates a file that bundles all .d.ts output.",
    "type": "string",
    "markdownDescription": "Specify a file that bundles all outputs into one JavaScript file. If `declaration` is true, also designates a file that bundles all .d.ts output.\n\nSee more: https://www.typescriptlang.org/tsconfig#outFile"
  },
  "outDir": {
    "description": "Specify an output folder for all emitted files.",
    "type": "string",
    "markdownDescription": "Specify an output folder for all emitted files.\n\nSee more: https://www.typescriptlang.org/tsconfig#outDir"
  },
  "rootDir": {
    "description": "Specify the root folder within your source files.",
    "type": "string",
    "markdownDescription": "Specify the root folder within your source files.\n\nSee more: https://www.typescriptlang.org/tsconfig#rootDir"
  }
}
```

## strict
```json
{
  "strict": {
    "description": "Enable all strict type checking options.",
    "type": "boolean",
    "default": false,
    "markdownDescription": "Enable all strict type checking options.\n\nSee more: https://www.typescriptlang.org/tsconfig#strict"
  }
}
```

:::info Enable all strict type checking options
- `--noImplicitAny`
- `--noImplicitThis`
- `--stricNullChecks`
- `--strictFunctionTypes`
- `--strictPropertyInitialization`
- `--strictBindCallApply`
- `--alwaysStrict`

:::

### `--noImplicitAny`

> Raise error on expressions and declarations with an implied any type

- 명시적이지 않게 any 타입을 사용하여, 표현식과 선언에 사용하면, 에러를 발생
![Screenshot-2023-06-01-at-9.16.42-PM.png](/img/이미지 창고/Screenshot-2023-06-01-at-9.16.42-PM.png)
- 타입스크립트가 추론을 실패한 경우, any가 맞으면, any 라고 지정하라.
- 아무것도 쓰지 않으면, 에러를 발생
- 이 오류를 해결하면, any라고 지정되어 있지 않은 경우는 any가 아닌 것이다.

### `--noImplicitThis`

> Raise error on this expressions with an implied any type

- 명시적이지 않게 any 타입을 사용하여, this 표현식에 사용하면, 에러를 발생합니다.
![Screenshot-2023-06-01-at-9.23.41-PM.png](/img/이미지 창고/Screenshot-2023-06-01-at-9.23.41-PM.png)
![Screenshot-2023-06-01-at-9.24.02-PM.png](/img/이미지 창고/Screenshot-2023-06-01-at-9.24.02-PM.png)
- 첫번째 매개변수 자리에 this를 놓고, this에 대한 타입을 어떤 것이라도, `noImplicatAny`가 오류를 발생시킨다.
- JavaScript에서는 매개변수에 this를 넣으면, 이미 예약된 키워드라 `SyntaxError`를 발생시킨다.
- call / apply /bind 와 같이 this를 대체하여 함수 콜 하는 용도로 쓰인다.
- 그래서 this를 any로 명시적으로 지정하는 것은 합리적입니다.(물론 구체적인 사용처가 있는 경우 타입을 표현한다.)

![Screenshot-2023-06-01-at-9.30.57-PM.png](/img/이미지 창고/Screenshot-2023-06-01-at-9.30.57-PM.png)
- Class 에서는 this를 사용하면서, `noImplicitThis` 와 관련한 에러가 나지 않는다.
- Class 에서 constructor를 제외한 멤버 함수의 첫번재 매개변수도 일반 ㅎ마수와 마찬가지로 this를 사용할 수 있다.

### `--strcitNullChecks`

> In strict null checking mode, the null and undefined values are not in the domain of every type and are only assignable to themselves and any (the one exception being that undefined is also assignable to void)
- `strictNullChecks`모드에서는, `null` 및 `undefined` 값이 모든 유형의 도메인 에 속하지 않으며, 그 자신을 타입으로 가지거나, any경우에만 할당이 가능합니다.
- 한 가지 예의는 `undefined`에 `void`할당 가능
![Screenshot-2023-06-01-at-9.43.21-PM.png](/img/이미지 창고/Screenshot-2023-06-01-at-9.43.21-PM.png)
- `strictNullChecks`를 적용하지 않으면,
	- 모든 타입은 `null`, `undefined` 값을 가실 수 있습니다.
	- `string`으로 타입을 지정해도, `null` 혹은 `undefined` 값을 가질 수 있다.
![Screenshot-2023-06-01-at-9.47.40-PM.png](/img/이미지 창고/Screenshot-2023-06-01-at-9.47.40-PM.png)
- `stictNullChecks`를 적용하면,
	- 모든 타입은 `null`, `undefined` 값을 가질 수 없고, 가지려면 union type을 이용해서 직접 명시 해야 합니다.
	- `any` 타입은 `null`과 `undefined`를 가집니다.
	- 예외적으로 void 타입의 경우 `undefined`를 가집니다.
- `strictNullChecks`를 적용하지 않고, 어떤 값이 `null`과 `undefined`를 가진다는 것은 암묵적으로 인정하고 계속 사용하다 보면, 정확히 어떤 타입이 오는 지를 개발자가 스스로 간과할 수 있다.
- 이 옵션을 켜고 사용하는 경우,
- 사용하려는 함수를 선언할 때부터 매개변수와 리턴 값에 정확한 타입을 지정하려는 노력을 기울여야 하고, 기울이게 될 것입니다.

### `--strictFunctionTypes`

> Disable bivariant parameter checking for function types

- 함수 타입에 대한 bivariant 매개변수 검사를 비활성화
	- Question : Which of the following types could be subtypes of `Dog -> Dog`?
		1. `Greyhound -> Greyhound` 
		2. `Greyhound -> Animal`
		3. `Animal -> Animal`
		4. `Animal -> Greyhound`
```ts
(Animal -> Greyhound <: (Dog -> Dog))
```
- 반환 타입은 공변적(convariant)
- 인자 타입은 반공변적(contravariant)
- 그런데 Ts에서 인자 타입은 공변적이면서, 반공변적인게 문제
- 이 문제를 해결하는 옵션이 `strictFunctionTypes`
- 옵션을 켜면, 에러가 안나던걸 에러 나게 함
![Screenshot-2023-06-01-at-10.24.56-PM.png](/img/이미지 창고/Screenshot-2023-06-01-at-10.24.56-PM.png)
- 이전에는 위와 같은 코드도 에러를 발생시키지 않았지만, 이제는 에러가 발생하게 됩니다.

### `--strictPropertyInitialization`

> Ensure non-undefined class properties are initialized in the constructor

- 정의되지 않는 클래스의 속성이 생성자에서 초기화 되었는지 확인합니다.
- 이 옵션을 사용하려면 `--stitNullChecks`를 사용하도록 설정해야 합니다.
![Screenshot-2023-06-01-at-10.30.54-PM.png](/img/이미지 창고/Screenshot-2023-06-01-at-10.30.54-PM.png)
- `constructor` 에서 초기 값을 할당한 경우 => 정상
![Screenshot-2023-06-01-at-10.33.01-PM.png](/img/이미지 창고/Screenshot-2023-06-01-at-10.33.01-PM.png)
- `constructor` 에서 안하는 경우
	- 보통 다른 함수로 이니셜라이즈 하는 경우 (async 함수)
	- `constructor` 에는 `async`를 사용할 수 없다.
![Screenshot-2023-06-01-at-10.35.44-PM.png](/img/이미지 창고/Screenshot-2023-06-01-at-10.35.44-PM.png)

### `--strictBindCallApply`

> Enable stricter checking of of the bind, call, and apply methods on functions
- bind, call, apply 에 대한 더 엄격한 검사 수행
	- Function 의 내장 함수인 bind / call / apply 를 사용할 때, 염격하게 체크하도록 하는 옵션입니다.
	- bind는 해당 함수 안에서 사용할 this와 인자를 설정해주는 역활을 하고, call 과 apply는 this 와 인자를 설정한 후, 실행까지 합니다.
- call 과 apply 는 인자를 설정하는 방식에서 차이점이 있습니다.
	- call은 함수의 인자를 여러 인자를 여러 인자의 나열로 넣어서 사용하고, apply는 모든 인자를 배열 바하로 넣어서 사용 합니다.

###  `--alwaysStrict`

> Parse in strict mode and emit "use strict" for each source file
- 각 소스 파일에 대해 JavaScript의 strict mode 로 코드를 분석하고, "엄격하게 사용"을 해제합니다.
![Screenshot-2023-06-01-at-10.50.04-PM.png](/img/이미지 창고/Screenshot-2023-06-01-at-10.50.04-PM.png)
- syntex 에러가 ts error로 나온다.
![Screenshot-2023-06-01-at-10.50.37-PM.png](/img/이미지 창고/Screenshot-2023-06-01-at-10.50.37-PM.png)
- 컴파일된 JavaScript 파일에 "use strict" 추가 됨
 
---

#NodeJS #TypeScript 

---