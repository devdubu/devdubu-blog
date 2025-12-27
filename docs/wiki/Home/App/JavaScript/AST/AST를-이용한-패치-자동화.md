---
sticker: emoji//1f334

slug: "AST를-이용한-패치-자동화"
---
회사에서 `@app` 모듈을 기반으로 핵심 프론트엔드 프로젝트를 개발 중이시고, 패치 시 프로젝트별로 설정된 특수 상수를 유지하면서 `@app`의 특정 부분만 교체하는 과정이 수동으로 이루어져 불편하다는 문제점을 해결하려는 상황이군요. 최근 **AST(추상 구문 트리, Abstract Syntax Tree)**를 알게 되셨고, 이를 활용해 `@app`의 특정 변수나 영역은 건드리지 않고 선택적으로 패치하는 방법을 찾고 계십니다. 질문에서 언급된 Nuxt 3, PrimeVue, Tiptap, 그리고 Vue 관련 맥락(특히 `[Vue warn]: Extraneous non-props attributes` 경고)을 고려하여, AST를 사용한 패치 자동화 방법을 제안하겠습니다. 또한, `@app`가 JavaScript/TypeScript 모듈로 가정하고, 프로젝트별 상수(예: 설정 객체, 상수 변수)와 캐시 문제를 고려한 실용적인 해결책을 제시합니다.

---

### 1. **문제 분석**
#### 상황 정리
- **문제점**:
  - `@app`은 핵심 모듈로, 프로젝트별로 정의된 **특수 상수**가 포함됨.
  - 패치 시 `@app` 전체를 삭제하고 교체하면 특수 상수가 손실됨.
  - 수동 패치는 시간이 오래 걸리고 오류 가능성이 높음.
  - AST를 활용해 특정 변수/영역을 제외하고 패치하는 방법을 찾고자 함.
- **제약 조건**:
  - `@app`은 JavaScript/TypeScript로 작성된 모듈(예: `@app/index.ts`, `@app/constants.ts` 등).
  - 특수 상수는 프로젝트별로 다르며, 특정 변수(예: `const PROJECT_CONFIG = {...}`) 또는 특정 영역(예: 특정 함수, 객체 리터럴)으로 정의.
  - Nuxt 3 환경에서 SSR, 캐시 문제(예: `.nuxt` 캐시, SSR 캐시) 고려 필요.
  - Vue 컴포넌트(`TreeSelect`, `Dropdown`, Tiptap 등)와의 통합 고려.

#### AST의 가능성
AST는 코드의 구조를 트리 형태로 분석하여, 특정 부분(예: 변수 선언, 함수, import 문)을 식별하고 수정할 수 있는 강력한 도구입니다. 이를 사용하면 `@app`의 특정 상수를 유지하면서, 다른 부분(예: 함수 로직, 컴포넌트 로직)을 선택적으로 패치할 수 있습니다. 주요 AST 관련 라이브러리:
- **JavaScript/TypeScript**: `@babel/parser`, `@babel/traverse`, `@babel/generator`.
- **TypeScript 전용**: `ts-morph` 또는 `typescript` 컴파일러 API.
- **Vue 파일**: `vue/compiler-sfc`로 `.vue` 파일의 `<script>` 파싱.

---

### 2. **AST를 활용한 패치 전략**
AST를 사용해 `@app` 모듈의 특정 변수/영역을 제외하고 패치하는 방법은 다음과 같습니다:
1. **특수 상수 식별**: 프로젝트별 상수(예: `const PROJECT_CONFIG = {...}`)를 AST 노드로 식별.
2. **보존 및 패치**: 상수를 유지하고, 나머지 코드(예: 함수, 컴포넌트 로직)를 새로운 코드로 교체.
3. **자동화 스크립트**: Node.js 스크립트로 패치 프로세스 자동화.
4. **Nuxt 3 통합**: 캐시 문제와 SSR 호환성 보장.

#### 가정
- `@app`은 TypeScript 모듈(예: `@app/index.ts`)로, 다음과 같은 구조:

  ```typescript
  // @app/index.ts
  export const PROJECT_CONFIG = {
    apiUrl: 'https://project-specific.com',
    theme: 'dark',
  };

  export function coreLogic() {
    return 'Old logic';
  }

  export const SOME_CONSTANT = 42;
  ```
- 패치 대상: `coreLogic` 함수를 새로운 로직으로 교체, `PROJECT_CONFIG`과 `SOME_CONSTANT`는 유지.
- 새로운 코드(패치 소스):
  ```typescript
  // patch-source/index.ts
  export function coreLogic() {
    return 'New logic';
  }
  ```

---

### 3. **AST 기반 패치 구현**
#### 3.1. **패키지 설치**
AST를 조작하기 위해 필요한 패키지를 설치합니다:
```bash
npm install @babel/parser @babel/traverse @babel/generator @babel/types typescript ts-morph --save-dev
```
- `@babel/parser`: JavaScript/TypeScript 코드를 AST로 파싱.
- `@babel/traverse`: AST 노드를 탐색하고 수정.
- `@babel/generator`: 수정된 AST를 코드로 변환.
- `@babel/types`: AST 노드 생성/조작.
- `ts-morph`: TypeScript 파일 조작(선택 사항, TypeScript 전용).

#### 3.2. **패치 스크립트 작성**
Node.js 스크립트를 작성하여 `@app`의 특정 부분만 패치합니다. 예: `scripts/patch-app.js`.

```javascript
const fs = require('fs').promises;
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

// 설정
const SOURCE_FILE = './node_modules/@app/index.ts'; // 원본 @app 파일
const PATCH_FILE = './patch-source/index.ts'; // 패치 소스 파일
const OUTPUT_FILE = './node_modules/@app/index.ts'; // 출력 파일
const PRESERVE_VARIABLES = ['PROJECT_CONFIG', 'SOME_CONSTANT']; // 보존할 변수 이름

async function patchApp() {
  try {
    // 원본 파일 읽기
    const sourceCode = await fs.readFile(SOURCE_FILE, 'utf-8');
    const patchCode = await fs.readFile(PATCH_FILE, 'utf-8');

    // 원본 파일 AST 파싱
    const sourceAst = parser.parse(sourceCode, {
      sourceType: 'module',
      plugins: ['typescript'],
    });

    // 패치 파일 AST 파싱
    const patchAst = parser.parse(patchCode, {
      sourceType: 'module',
      plugins: ['typescript'],
    });

    // 보존할 노드 수집
    const preservedNodes = [];
    traverse(sourceAst, {
      VariableDeclaration(path) {
        const declarations = path.node.declarations;
        declarations.forEach(decl => {
          if (t.isIdentifier(decl.id) && PRESERVE_VARIABLES.includes(decl.id.name)) {
            preservedNodes.push(path.node);
          }
        });
      },
    });

    // 패치 파일의 노드 수집
    const patchNodes = [];
    traverse(patchAst, {
      ExportNamedDeclaration(path) {
        patchNodes.push(path.node);
      },
    });

    // 새로운 AST 구성: 보존 노드 + 패치 노드
    const newAst = t.program([...preservedNodes, ...patchNodes]);

    // 새로운 코드 생성
    const { code } = generate(newAst, { retainLines: true });
    await fs.writeFile(OUTPUT_FILE, code);
    console.log('Patched @app successfully!');
  } catch (error) {
    console.error('Patching failed:', error);
  }
}

patchApp();
```

- **설명**:
  - **파싱**: `@app/index.ts`와 패치 소스 파일을 `@babel/parser`로 AST로 변환.
  - **보존**: `PRESERVE_VARIABLES`에 명시된 변수(`PROJECT_CONFIG`, `SOME_CONSTANT`)를 수집.
  - **패치**: 패치 파일의 `ExportNamedDeclaration`(예: `coreLogic`)을 추가.
  - **생성**: 새로운 AST를 코드로 변환하여 `@app/index.ts`에 저장.
  - **TypeScript 지원**: `plugins: ['typescript']`로 TypeScript 코드 파싱.

#### 3.3. **실행**
패치 스크립트를 실행:
```bash
node scripts/patch-app.js
```

#### 3.4. **결과**
패치 후 `@app/index.ts`:
```typescript
export const PROJECT_CONFIG = {
  apiUrl: 'https://project-specific.com',
  theme: 'dark',
};

export const SOME_CONSTANT = 42;

export function coreLogic() {
  return 'New logic';
}
```

- `PROJECT_CONFIG`과 `SOME_CONSTANT`는 유지.
- `coreLogic`은 패치 소스의 새로운 로직으로 교체됨.

#### 3.5. **ts-morph 대안**
TypeScript 프로젝트라면 `ts-morph`를 사용하여 더 직관적으로 처리 가능:

```javascript
const { Project } = require('ts-morph');

const project = new Project();
const sourceFile = project.addSourceFileAtPath('./node_modules/@app/index.ts');
const patchFile = project.addSourceFileAtPath('./patch-source/index.ts');

const PRESERVE_VARIABLES = ['PROJECT_CONFIG', 'SOME_CONSTANT'];

// 기존 변수 보존
const preservedDeclarations = sourceFile.getVariableDeclarations()
  .filter(decl => PRESERVE_VARIABLES.includes(decl.getName()))
  .map(decl => decl.getText());

// 패치 파일의 선언 가져오기
const patchDeclarations = patchFile.getStatements().map(stmt => stmt.getText());

// 새로운 파일 생성
sourceFile.replaceWithText([...preservedDeclarations, ...patchDeclarations].join('\n\n'));

// 저장
sourceFile.saveSync();
console.log('Patched @app successfully!');
```

- **장점**: TypeScript 전용, 타입 안전성, 간단한 API.
- **단점**: 복잡한 조작은 Babel이 더 유연.

---

### 4. **Nuxt 3 및 캐시 문제 해결**
이전 대화에서 언급된 캐시 문제(`Cannot read properties of undefined (reading 'key')`)와 `[Vue warn]: Extraneous non-props attributes` 경고를 고려하여, 패치 후 Nuxt 3 환경에서 안정적으로 동작하도록 조치합니다.

#### 4.1. **Nuxt 3 캐시 문제**
- **빌드 캐시 지우기**:
  ```bash
  rm -rf .nuxt && npm run dev
  ```
- **SSR 캐시 비활성화**:
  ```typescript
  // nuxt.config.ts
  export default defineNuxtConfig({
    routeRules: { '/**': { cache: false } },
  });
  ```
- **브라우저 캐시**:
  - 하드 리프레시: `Ctrl + Shift + R`.

#### 4.2. **Vue 경고와의 연관성**
`formData` 관련 경고는 `@app`에서 컴포넌트(예: `MyTreeSelect`)에 비 props 속성이 전달된 경우 발생합니다. `@app` 패치 시 컴포넌트 코드가 수정되므로, 패치 후 `props` 정의를 확인:
```typescript
// @app/components/MyTreeSelect.ts
defineProps<{
  modelValue: string | null;
  data: any[];
  formData?: string | object; // formData 추가
}>();
```

- 패치 스크립트에서 `formData`가 포함된 컴포넌트를 수정할 경우, AST로 `props` 정의에 `formData` 추가:
  ```javascript
  traverse(sourceAst, {
    CallExpression(path) {
      if (
        t.isIdentifier(path.node.callee, { name: 'defineProps' }) &&
        t.isObjectExpression(path.node.arguments[0])
      ) {
        const propsObject = path.node.arguments[0];
        const formDataProp = t.objectProperty(
          t.identifier('formData'),
          t.tsUnionType([
            t.tsStringType(),
            t.tsTypeReference(t.identifier('object')),
            t.tsUndefinedType(),
          ])
        );
        propsObject.properties.push(formDataProp);
      }
    },
  });
  ```

#### 4.3. **PrimeVue 및 Tiptap 통합**
- **PrimeVue (`TreeSelect`)**: `@app`에 `TreeSelect`가 포함된 경우, 패치 후 `props.data`와 `treeOptions`가 올바르게 유지되는지 확인.
  ```vue
  <!-- @app/components/MyTreeSelect.vue -->
  <template>
    <client-only>
      <TreeSelect :model-value="props.modelValue" :options="treeNodes" />
    </client-only>
  </template>
  ```
- **Tiptap**: `TiptapEditor`가 `@app`에 포함된 경우, `<client-only>`와 `editor` 초기화 확인.
  ```vue
  <!-- @app/components/TiptapEditor.vue -->
  <template>
    <div v-bind="$attrs">
      <client-only>
        <editor-content v-if="editor" :editor="editor" />
      </client-only>
    </div>
  </template>
  ```

---

### 5. **추가 최적화**
- **패치 대상 선별**:
  - 특정 함수/컴포넌트만 패치하려면 AST에서 `ExportNamedDeclaration`의 `name`을 필터링:
    ```javascript
    traverse(patchAst, {
      ExportNamedDeclaration(path) {
        if (
          t.isFunctionDeclaration(path.node.declaration) &&
          path.node.declaration.id.name === 'coreLogic'
        ) {
          patchNodes.push(path.node);
        }
      },
    });
    ```
- **프로젝트별 상수 자동 감지**:
  - 상수 목록을 수동으로 지정(`PRESERVE_VARIABLES`)하는 대신, 주석(예: `// @preserve`)으로 보존 대상 표시:
    ```typescript
    // @app/index.ts
    // @preserve
    export const PROJECT_CONFIG = { ... };
    ```
    ```javascript
    traverse(sourceAst, {
      VariableDeclaration(path) {
        if (path.node.leadingComments?.some(comment => comment.value.includes('@preserve'))) {
          preservedNodes.push(path.node);
        }
      },
    });
    ```
- **자동화 워크플로우**:
  - 패치 스크립트를 CI/CD 파이프라인에 통합:
    ```bash
    npm run patch-app
    npm run build
    ```
  - `package.json`에 추가:
    ```json
    "scripts": {
      "patch-app": "node scripts/patch-app.js"
    }
    ```

---

### 6. **디버깅 가이드**
패치 후 문제가 발생하거나 Vue 경고가 지속될 경우:
1. **AST 출력 확인**:
   - `console.log(JSON.stringify(sourceAst, null, 2))`로 파싱된 AST 구조 확인.
   - 보존 변수(`PROJECT_CONFIG`)가 `preservedNodes`에 포함되었는지 확인.
2. **패치 결과 확인**:
   - 패치 후 `@app/index.ts` 파일을 열어 상수와 패치된 코드 확인.
   - 예: `coreLogic`이 새 로직으로 교체되고 `PROJECT_CONFIG` 유지.
3. **Vue 경고 점검**:
   - `formData`가 여전히 비 props 속성으로 전달되는지 확인:
     ```vue
     <MyTreeSelect v-model="value" :data="treeData" /> <!-- formData 제거 -->
     ```
   - `props`에 `formData` 추가 또는 `$attrs`로 처리.
4. **캐시 문제**:
   - `.nuxt` 삭제: `rm -rf .nuxt && npm run dev`
   - SSR 캐시 비활성화 확인: `nuxt.config.ts`.
5. **Nuxt 빌드 확인**:
   - `npm run build` 후 `npm run preview`로 패치된 코드 동작 확인.
   - Vue Devtools로 컴포넌트 상태 점검.

---

### 7. **요약**
- **문제**: `@app` 패치 시 프로젝트별 상수를 유지하면서 수동 작업 최소화.
- **해결책**:
  - AST(Babel 또는 ts-morph)로 `@app`의 상수(예: `PROJECT_CONFIG`) 보존.
  - 패치 소스에서 필요한 코드(예: `coreLogic`)만 교체.
  - 스크립트(`patch-app.js`)로 패치 자동화.
- **Nuxt 3 고려**:
  - `<client-only>`로 SSR 호환성.
  - `:key`와 캐시 지우기로 렌더링 안정화.
  - Vue 경고 해결: `formData`를 `props`로 선언 또는 `$attrs` 처리.
- **권장**:
  - `@app/index.ts`와 패치 소스 파일의 실제 구조 공유.
  - 보존할 상수 목록 또는 주석 패턴(예: `@preserve`) 제공.

`@app`의 구체적인 코드 구조, 상수 정의 방식, 패치 대상 코드, 또는 추가 에러 로그를 공유해 주시면 더 정밀한 AST 스크립트와 디버깅 방법을 제공하겠습니다!