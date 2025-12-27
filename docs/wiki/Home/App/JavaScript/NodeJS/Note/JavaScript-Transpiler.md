---
sticker: vault//이미지/개발 로고/TechIconSVG/Node.js.svg

slug: "JavaScript-Transpiler"
---
# Transpiler의 Func 변환 함수 예시

## Arrow Function (화살표 함수) 변환 과정 예시

화살표 함수는 ES6(ECMAScript 2015)에서 도입된 문법으로, 기존 `function` 키워드보다 더 간결하게 함수를 정의할 수 있게 해주고, 특히 **`this` 바인딩 방식**이 다르다는 특징이 있습니다. Babel은 이러한 두 가지 측면을 고려하여 변환을 수행합니다.

**1. 간결한 문법의 변환**

가장 기본적인 화살표 함수의 변환입니다.

**원본 코드 (ES6+):**

```js
// src/input.js
const add = (a, b) => a + b;
const greet = (name) => {
  console.log(`Hello, ${name}!`);
};
```

**Babel 변환 후 코드 (ES5):**

Babel의 `@babel/preset-env`를 사용하여 변환하면 다음과 같이 바뀝니다.

```js
// dist/output.js (Babel 변환 후)
"use strict"; // 엄격 모드 (Babel이 자동으로 추가할 수 있음)

var add = function add(a, b) {
  return a + b;
};
var greet = function greet(name) {
  console.log("Hello, ".concat(name, "!")); // 템플릿 리터럴도 문자열 연결로 변환
};
```

해당 구조가 바뀌는 과정에서 Bable의 코드 예제는 아래와 같다.

### Babel의 내부 작동 원리 및 AST 조작 코드 예시

Babel은 크게 다음 3단계로 작동합니다.

1. **Parse (파싱):** 코드를 읽어와서 AST(추상 구문 트리)로 변환합니다.
2. **Transform (변환):** 플러그인이 이 AST를 순회하며 노드를 추가, 삭제, 수정합니다.
3. **Generate (코드 생성):** 변환된 AST를 다시 JavaScript 코드로 변환합니다.

여기서 핵심은 **Transform (변환)** 단계이며, Babel 플러그인이 바로 이 변환을 담당합니다. 플러그인은 특정 AST 노드를 "방문(visit)"하고, 그 노드를 원하는 형태로 "변경(mutate)"하는 방식으로 작동합니다.

**예시: `const` 키워드를 `var` 키워드로 변환하는 Babel 플러그인의 개념적 코드**

실제 Babel 플러그인 코드는 `@babel/core`의 API를 사용하며, `babel-traverse`와 `babel-types` 같은 모듈의 도움을 받습니다.

**목표:** `const a = 1;`을 `var a = 1;`로 변환하기
```js
// 이 코드는 실제 Babel 플러그인 구성의 '개념적인 예시'입니다.
// 실제 플러그인은 훨씬 더 복잡하며, 모든 엣지 케이스를 처리해야 합니다.

// --- Babel 플러그인의 기본 구조 (개념적) ---
// const myBabelPlugin = function({ types: t }) { // 't'는 babel-types 모듈의 별칭
//   return {
//     visitor: {
//       // AST 노드 타입별로 '방문자(visitor)' 함수를 정의합니다.
//       // 여기에선 'VariableDeclaration' 노드를 방문합니다.
//       VariableDeclaration(path) {
//         // 'path' 객체는 현재 AST 노드와 관련된 정보, 부모 노드 등에 접근할 수 있게 해줍니다.
//         const node = path.node; // 현재 방문 중인 AST 노드

//         // 만약 현재 노드의 'kind' (변수 선언 종류)가 'const'라면
//         if (node.kind === 'const') {
//           // 해당 노드의 'kind' 속성을 'var'로 변경합니다.
//           node.kind = 'var';

//           // 추가적인 처리: 예를 들어, const의 불변성 특성을 에뮬레이션해야 한다면
//           // 더 복잡한 로직이 필요할 수 있습니다.
//           // 여기서는 단순하게 키워드만 변경하는 것으로 가정합니다.
//         }
//       }
//     }
//   };
// };

// export default myBabelPlugin; // Babel에 플러그인으로 등록

// --- 위 플러그인이 적용되었을 때의 작동 예시 ---

// 1. 원본 ES6 코드
const code = `const myVar = 10; let myLet = 20;`;

// 2. 파싱: Babel의 파서(@babel/parser)가 코드를 AST로 변환
//    (실제 AST는 훨씬 방대합니다. 여기서는 핵심 부분만 상상)
/*
   AST (간략화된 형태):
   {
     "type": "File",
     "program": {
       "type": "Program",
       "body": [
         {
           "type": "VariableDeclaration", // <-- 이 노드를 플러그인이 방문!
           "kind": "const",             // <-- 'const'
           "declarations": [
             {
               "type": "VariableDeclarator",
               "id": { "type": "Identifier", "name": "myVar" },
               "init": { "type": "NumericLiteral", "value": 10 }
             }
           ]
         },
         {
           "type": "VariableDeclaration",
           "kind": "let",
           "declarations": [
             // ...
           ]
         }
       ]
     }
   }
*/

// 3. 변환 (Transform): 위에서 정의한 플러그인이 AST를 순회하며 변경
//    - VariableDeclaration 노드에 도달
//    - `node.kind`가 'const'임을 확인
//    - `node.kind`를 'var'로 변경

/*
   변환된 AST (간략화된 형태):
   {
     "type": "File",
     "program": {
       "type": "Program",
       "body": [
         {
           "type": "VariableDeclaration",
           "kind": "var",             // <-- 'var'로 변경됨!
           "declarations": [
             {
               "type": "VariableDeclarator",
               "id": { "type": "Identifier", "name": "myVar" },
               "init": { "type": "NumericLiteral", "value": 10 }
             }
           ]
         },
         // ... let 노드는 변경되지 않음
       ]
     }
   }
*/

// 4. 코드 생성 (Generate): 변환된 AST를 다시 JavaScript 코드로 변환
//    (실제 @babel/generator 사용)
const transformedCode = `var myVar = 10; let myLet = 20;`; // <- 최종 ES5 (또는 대상) 결과

console.log("Original Code:", code);
console.log("Transformed Code (Conceptual Result):", transformedCode);
```

### 화살표 함수(`=>`) 변환의 더 구체적인 플러그인 관점

화살표 함수는 `this` 바인딩이라는 더 복잡한 특성을 가지고 있기 때문에, 단순히 노드 타입을 바꾸는 것을 넘어섭니다.

**Babel이 화살표 함수를 변환하는 과정의 개념 (플러그인 관점):**

1. **`ArrowFunctionExpression` 노드 방문:** Babel 플러그인은 AST를 순회하다가 `ArrowFunctionExpression` 타입의 노드를 발견합니다.
    
2. **`this` 컨텍스트 저장:** 화살표 함수가 선언된 **부모 스코프(parent scope)**의 `this` 값을 캡처해야 합니다. 이를 위해 Babel은 해당 부모 스코프의 시작 부분에 `var _this = this;`와 같은 코드를 삽입하거나, 이미 존재하는 경우 재활용합니다.
    
    - **어떻게?** `path.scope.generateUidIdentifier("this")`와 같은 Babel API를 사용하여 `_this`와 같은 고유한 변수 이름을 생성하고, `path.scope.push({ id: _thisIdentifier, init: t.thisExpression() });`와 같이 해당 스코프에 변수 선언(VariableDeclaration) 노드를 추가합니다.
3. **`ArrowFunctionExpression`을 `FunctionExpression`으로 변환:** 현재 `ArrowFunctionExpression` 노드를 일반 `FunctionExpression` 노드로 바꿉니다. 이때, 원래 화살표 함수가 가지고 있던 `params` (매개변수)와 `body` (본문)를 새로운 `FunctionExpression`에 복사합니다.
    
4. **`this` 참조 업데이트:** 변환된 `FunctionExpression`의 `body` 내에서 `this` 키워드가 사용된 모든 부분을 찾습니다. 발견된 `this` 키워드 노드들을 2단계에서 생성된 `_this` 변수를 참조하는 `Identifier` 노드로 교체합니다.
    
    - **어떻게?** `path.traverse()`를 사용하여 변환된 함수 내부를 다시 순회하면서, `ThisExpression` 노드를 발견하면 `_thisIdentifier`로 교체합니다.

**가상 코드 (Babel 플러그인 스타일):**

```ts
// @babel/plugin-transform-arrow-functions 플러그인의 핵심 로직 일부를 단순화한 예시
// 실제 코드는 훨씬 더 복잡하고, Edge Case를 처리하며, helper 함수를 사용합니다.

const arrowFunctionPlugin = function({ types: t }) {
  return {
    visitor: {
      ArrowFunctionExpression(path) {
        const node = path.node;

        // 1. 'this' 캡처를 위한 변수 생성 및 삽입 (필요한 경우)
        //    (여기서는 간략하게 'var _this = this;'를 삽입한다고 가정)
        //    실제로는 'path.scope.generateUidIdentifier("this")'를 사용하여 고유 ID를 만들고,
        //    'path.scope.push'를 사용하여 해당 스코프에 VariableDeclaration을 추가합니다.
        const _thisIdentifier = path.scope.generateUidIdentifier("this");
        path.scope.push({
          id: _thisIdentifier,
          init: t.thisExpression() // 'this' 키워드를 나타내는 AST 노드
        });

        // 2. 화살표 함수를 일반 함수 표현식으로 변환
        const newFunction = t.functionExpression(
          null,             // id (함수 이름, 여기서는 익명)
          node.params,      // 원래 화살표 함수의 매개변수
          node.body,        // 원래 화살표 함수의 본문
          false,            // generator
          node.async        // async
        );

        // 3. 변환된 함수 본문 내의 'this' 참조를 '_this'로 교체
        path.traverse({
          ThisExpression(thisPath) {
            thisPath.replaceWith(t.identifier(_thisIdentifier.name));
          }
        });

        // 4. 원래 화살표 함수 노드를 새로운 일반 함수 노드로 교체
        path.replaceWith(newFunction);
      }
    }
  };
};

// 위 플러그인이 실행되면, 다음과 같은 변환이 발생합니다:
/*
  원본:
  (param) => { this.doSomething(); }

  플러그인 처리 후:
  var _this = this;
  function (param) { _this.doSomething(); }
*/
```

이 코드는 Babel 플러그인이 AST를 조작하는 방식의 매우 단순화된 예시입니다. 실제 플러그인은 훨씬 더 많은 예외와 최적화, 그리고 다양한 AST 노드 타입을 처리합니다.

**핵심 Takeaway:**

- **AST (Abstract Syntax Tree):** Babel은 코드를 텍스트로 보지 않고, 컴퓨터가 이해하기 쉬운 트리 구조의 데이터(AST)로 변환합니다.
- **Visitor Pattern:** Babel 플러그인은 "방문자 패턴"을 사용하여 이 AST 트리를 순회합니다. 특정 타입의 노드(예: `ArrowFunctionExpression`, `VariableDeclaration`)를 만나면, 해당 노드에 대한 특정 함수(visitor)가 실행됩니다.
- **Node Mutation:** visitor 함수 내에서 개발자는 `path.node`를 통해 현재 노드에 접근하고, `babel-types`(`t`) 모듈을 사용하여 새로운 노드를 생성하거나, 기존 노드의 속성을 변경하거나, 노드를 삭제/교체하는 등의 작업을 수행합니다.

이러한 방식으로 Babel은 ES6+의 복잡한 문법과 의미론적 특성들을 ES5로 안전하고 정확하게 "번역"해주는 것입니다. 이 과정을 더 깊이 이해하고 싶으시다면, `astexplorer.net` 같은 웹사이트에서 실제 코드가 어떤 AST로 파싱되고, Babel 플러그인 적용 시 AST가 어떻게 변하는지 시각적으로 확인해 보는 것을 강력히 추천합니다.