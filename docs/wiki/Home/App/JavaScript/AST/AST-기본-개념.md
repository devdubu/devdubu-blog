---
sticker: emoji//1f334

slug: "AST-기본-개념"
---
# 간단 예제 프로젝트

이 작업을 위해 일반적으로 JavaScript/TypeScript의 AST 작업을 위한 라이브러리인 **`Babel`** 또는 **`AST Explorer`** (웹 기반 도구)를 사용합니다. 여기서는 실제 프로젝트에서 많이 사용되는 `Babel`을 기반으로 설명하고, 기본적인 실행 환경 구축까지 다루겠습니다.

### 1단계: AST 변환의 기본 구성 요소 이해

AST 변환은 일반적으로 다음 세 가지 단계로 구성됩니다.

1. **Parse (구문 분석):** 원본 코드(문자열)를 AST로 변환합니다.
2. **Transform (변환):** 생성된 AST를 순회하며 원하는 변경 사항을 적용합니다. 이 단계에서 `alert` 노드를 찾아 `console.log` 노드로 변경합니다.
3. **Generate (코드 생성):** 변환된 AST를 다시 원본 코드(문자열)로 변환합니다.

### 2단계: `alert`를 `console.log`로 변경하는 AST 변환 로직 구상

우리가 변경해야 할 노드는 다음과 같습니다:

- **원본:** `alert("Hello");`
    
    - 이것은 `CallExpression` (함수 호출 표현식) 노드입니다.
    - `CallExpression`의 `callee` (호출 대상)는 `Identifier` (식별자) 노드이며, `name`이 `"alert"`입니다.
    - `CallExpression`의 `arguments` (인수)는 문자열 리터럴 `"Hello"`를 포함하는 배열입니다.
- **변경 후:** `console.log("Hello");`
    
    - 이것 또한 `CallExpression` 노드입니다.
    - `CallExpression`의 `callee`는 `MemberExpression` (멤버 접근 표현식, 예: `object.property`) 노드입니다.
        - `MemberExpression`의 `object`는 `Identifier` 노드이며, `name`이 `"console"`입니다.
        - `MemberExpression`의 `property`는 `Identifier` 노드이며, `name`이 `"log"`입니다.
    - `CallExpression`의 `arguments`는 원본과 동일한 문자열 리터럴을 포함하는 배열입니다.

따라서, 우리가 할 일은 AST를 순회하면서 `callee.name === "alert"`인 `CallExpression` 노드를 찾고, 해당 노드의 `callee`를 `console.log`에 해당하는 `MemberExpression`으로 교체하는 것입니다.

### 3단계: `Babel`을 이용한 AST 변환 코드 작성

`Babel`은 JavaScript/TypeScript 코드를 파싱하고 변환하는 데 널리 사용되는 도구입니다. `Babel` 플러그인을 사용하여 AST 변환 로직을 구현할 수 있습니다.

#### 프로젝트 설정

먼저, 간단한 Node.js 프로젝트를 설정하고 필요한 `Babel` 패키지를 설치합니다.

1. **새 디렉토리 생성 및 이동:**
```Bash
mkdir ast-transform-example
cd ast-transform-example
```
    
2. **`package.json` 초기화:**   
```Bash
npm init -y
```
    
3. **필수 `Babel` 패키지 설치:**
```Bash
npm install @babel/parser @babel/traverse @babel/generator @babel/types
# @babel/core는 필요하면 설치해도 되지만, 여기서는 위 4개면 충분합니다.
```
    - `@babel/parser`: 코드를 AST로 파싱
    - `@babel/traverse`: AST를 순회하고 노드를 방문
    - `@babel/generator`: AST를 다시 코드로 변환
    - `@babel/types`: AST 노드를 생성, 검증, 조작하는 유틸리티 (필수)

#### 변환 로직 파일 (`./plugins/alert-to-console-log.js`)

다음 내용을 `plugins/alert-to-console-log.js` 파일로 저장합니다.

```JavaScript
// plugins/alert-to-console-log.js
const t = require('@babel/types'); // @babel/types 모듈을 t로 별칭

module.exports = function () {
  return {
    visitor: {
      // CallExpression 노드를 방문할 때 실행될 함수
      CallExpression(path) {
        const callee = path.node.callee; // 호출 대상 (예: alert, console.log)

        // 호출 대상이 식별자(Identifier)이고 이름이 'alert'인지 확인
        if (t.isIdentifier(callee, { name: 'alert' })) {
          // console.log에 해당하는 MemberExpression 노드 생성
          const consoleLogMemberExpression = t.memberExpression(
            t.identifier('console'), // object: Identifier('console')
            t.identifier('log')      // property: Identifier('log')
          );

          // 현재 CallExpression 노드의 callee를 새로 생성한 MemberExpression으로 교체
          path.node.callee = consoleLogMemberExpression;

          // (선택 사항) 변환이 일어났음을 로그로 확인
          // console.log(`Transformed 'alert' to 'console.log' at line ${path.node.loc.start.line}`);
        }
      },
    },
  };
};
```

**코드 설명:**
- **`t = require('@babel/types')`**: 
	- `babel/types`는 AST 노드를 생성하고 검사하는 데 필요한 유틸리티 함수들을 제공합니다. 
	- 예를 들어 `t.isIdentifier()`는 노드가 식별자인지 확인하고, `t.memberExpression()`은 멤버 접근 표현식 노드를 생성합니다.
- **`visitor`**: 
	- `Babel` 플러그인의 핵심 부분입니다. 
	- AST를 순회하면서 특정 타입의 노드를 만났을 때 실행될 함수들을 정의합니다.
- **`CallExpression(path)`**: 
	- AST에서 `CallExpression` 타입의 노드를 발견할 때마다 이 함수가 호출됩니다. 
	- `path` 객체는 현재 노드와 그 조상 노드들에 대한 정보, 그리고 노드를 조작할 수 있는 메서드를 제공합니다.
- **`path.node.callee`**: 
	- 현재 `CallExpression` 노드에서 호출되는 함수 또는 멤버를 나타냅니다.
- **`t.isIdentifier(callee, { name: 'alert' })`**: 
	- `callee`가 `alert`라는 이름의 식별자인지 확인합니다.
- **`t.memberExpression(t.identifier('console'), t.identifier('log'))`**: 
	- `console.log`와 같은 멤버 접근 표현식을 나타내는 AST 노드를 생성합니다. 
	- `console`은 객체, `log`는 속성입니다.
- **`path.node.callee = consoleLogMemberExpression;`**: 
	- 현재 `CallExpression` 노드의 `callee`를 우리가 새로 만든 `console.log` 노드로 교체합니다.

### 4단계: AST 변환 실행 코드 작성 (`transform.js`)

이제 이 플러그인을 사용하여 실제 코드를 변환하는 스크립트를 작성합니다.

`transform.js` 파일을 생성합니다.

```JavaScript
// transform.js
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default; // .default 주의
const generate = require('@babel/generator').default; // .default 주의
const alertToConsoleLogPlugin = require('./plugins/alert-to-console-log'); // 위에서 작성한 플러그인 임포트

// 1. 변환할 원본 코드
const code = `
function exampleFunction() {
  alert("Hello from alert!");
  const message = "Another message";
  alert(message + " from second alert.");
  console.log("This is already a console.log.");
  window.alert("Using window.alert"); // 이 경우에는 변환되지 않습니다 (Identifier가 아님)
}
`;

console.log('--- Original Code ---');
console.log(code);
console.log('\n----------------------\n');

// 2. 코드 파싱: AST 생성
const ast = parser.parse(code, {
  sourceType: 'module', // 모듈 코드 (import/export 사용 시)
  plugins: [],          // 필요한 파서 플러그인 (예: 'jsx', 'typescript' 등)
});

// 3. AST 순회 및 변환
// traverse 함수는 플러그인의 visitor 객체를 사용하여 AST를 순회합니다.
traverse(ast, alertToConsoleLogPlugin().visitor); // 플러그인 함수를 호출하고 visitor 속성 전달

// 4. 변환된 AST를 다시 코드로 생성
const { code: transformedCode } = generate(ast, {
  // 제너레이터 옵션 (선택 사항)
  // compact: true, // 코드 압축
  // minified: true, // 최소화
  // comments: false, // 주석 제거
  retainLines: true, // 원본 라인 번호 유지 시도
});

console.log('--- Transformed Code ---');
console.log(transformedCode);
console.log('\n----------------------\n');
```

**코드 설명:**

- **`parser.parse(code, options)`**: 
	- 원본 `code` 문자열을 파싱하여 AST 객체를 반환합니다. 
	- `sourceType: 'module'`은 ECMAScript 모듈 구문을 파싱할 때 사용합니다. 
	- 다른 문법(JSX, TypeScript 등)을 파싱하려면 `plugins` 옵션에 해당 파서 플러그인을 추가해야 합니다.
- **`traverse(ast, visitor)`**: 
	- 생성된 `ast`를 순회하면서 `visitor` 객체에 정의된 함수들을 호출합니다. 
	- 여기서는 우리가 만든 `alertToConsoleLogPlugin().visitor`를 전달합니다.
- **`generate(ast, options)`**: 
	- 변환된 `ast`를 다시 JavaScript 코드로 변환합니다. 
	- `transformedCode` 변수에 변환된 코드가 문자열로 저장됩니다.

### 5단계: 실행 방법

터미널에서 `transform.js` 파일을 Node.js로 실행합니다.

```Bash
node transform.js
```

**예상 결과:**

```
--- Original Code ---

function exampleFunction() {
  alert("Hello from alert!");
  const message = "Another message";
  alert(message + " from second alert.");
  console.log("This is already a console.log.");
  window.alert("Using window.alert");
}

----------------------

--- Transformed Code ---

function exampleFunction() {
  console.log("Hello from alert!");
  const message = "Another message";
  console.log(message + " from second alert.");
  console.log("This is already a console.log.");
  window.alert("Using window.alert");
}

----------------------
```

보시면 `alert` 호출 두 개가 `console.log`로 성공적으로 변경되었음을 확인할 수 있습니다. 
`window.alert`는 `Identifier`가 아니라 `MemberExpression`이기 때문에 우리의 플러그인에 의해 변환되지 않았습니다. 
이것은 정확히 의도된 동작입니다.
만약 `window.alert`도 변환하고 싶다면 `visitor` 로직을 수정 해야 합니다.

### 추가 고려사항 및 다음 단계

- **`window.alert` 변환:** 
	- 만약 `window.alert`와 같은 멤버 접근 표현식도 변환하고 싶다면, `visitor`에서 `MemberExpression` 노드도 방문하여 `object.name =<mark> 'window'`이고 `property.name </mark>= 'alert'`인 경우를 처리해야 합니다. 
	- 그리고 이를 다시 `console.log`로 바꾸는 로직을 구현해야 합니다.
- **TypeScript 코드 변환:** 
	- TypeScript 코드를 변환하려면 `parser.parse` 옵션에 `plugins: ['typescript']`를 추가해야 합니다.
- **파일 입출력:** 
	- 실제 시나리오에서는 파일에서 코드를 읽어오고 변환된 코드를 다른 파일에 저장하는 로직이 추가될 것입니다 (`fs` 모듈 사용).
- **복잡한 변환:** 
	- 이 예제는 간단한 변환이지만, AST를 사용하면 코드의 의미를 분석하고 훨씬 복잡한 최적화나 코드 변경을 수행할 수 있습니다.
- **AST Explorer:** 
	- 웹 기반 도구인 `AST Explorer` (`https://astexplorer.net/`)는 코드를 붙여넣고 해당 AST를 시각적으로 확인하며, 다양한 변환 플러그인을 테스트해 볼 수 있는 강력한 도구입니다. 
	- 이 도구를 활용하여 AST 구조를 더 깊이 이해하는 데 도움이 될 것입니다.