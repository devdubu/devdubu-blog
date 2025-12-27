---
sticker: emoji//1f945

slug: "SLM,-RAG,-OPA"
---
### 왜 이전 코드가 "단순 문서"처럼 보였나?

- RAG 예시로 PDFLoader를 썼지만, 이는 플레이스홀더예요. LangChain.js는 다양한 데이터 소스(문서, DB, API)를 지원합니다.
- 만약 사이트가 SQL DB 중심이라면, 각 페이지의 데이터가 "DB 조합" (e.g., JOIN된 테이블)으로 구성되듯, RAG 에이전트도 DB 쿼리를 통해 데이터를 끌어올 수 있습니다.
- 기존 API 통제와의 차이: 이전 코드는 파일/문서 메타데이터를 필터링했지만, SQL로 전환하면 쿼리 자체를 OPA로 통제 (e.g., 허용된 쿼리만 실행). 이는 API 통제와 유사: API 엔드포인트 대신 DB 액세스를 "API-like"하게 래핑.

### SQL DB 중심으로 재구상: RAG + SQL 통합

LangChain.js에서 SQL Q&A 시스템을 구축하면 자연어 쿼리를 SQL로 변환 → 실행 → 결과로 RAG 컨텍스트 제공 → Gemma(Ollama)로 답변 생성. 접근 제어는 OPA로 쿼리 필터링 (e.g., 사용자 역할에 따라 테이블 접근 제한).

#### 주요 변경점

- **데이터 소스**: 문서 로더 → SqlDatabase (SQLite, PostgreSQL 등 지원. 기존 SQL DB 연결).
- **RAG 흐름**: 자연어 → SQL 쿼리 생성 (LLM 사용) → OPA 권한 체크 → 쿼리 실행 → 결과 RAG 컨텍스트로 사용 → Gemma 생성.
- **권한 통제**: OPA Rego 정책에서 Redis list (pxAuthTable 스타일: e.g., ["table1", "table2"])를 조회해 허용된 테이블/컬럼만 쿼리에 포함. API 통제처럼, 에이전트가 DB 직접 액세스 대신 "통제된 쿼리"만 실행.
- **보안**: 쿼리 실행 위험을 최소화 위해 OPA로 human-in-the-loop (승인) 추가 가능, 또는 DB 권한 좁히기.

#### 업데이트된 코드 예시 (Node.js 중심)

기존 rag.js, auth.js, app.js를 SQL로 수정. Chinook DB (샘플 SQL DB)를 예로 사용하지만, 실제로는 기존 SQL DB URL로 대체.

1. **환경 추가 설치**:
```shell
npm install typeorm @langchain/groq  # TypeORM for SQL 연결, Groq optional for LLM 보조 (Ollama main).
```
- SQLite Chinook DB 다운로드: curl -o Chinook.db https://www.sqlitetutorial.net/wp-content/uploads/2018/03/chinook.zip && unzip chinook.zip (테스트용).
2. **rag.js 수정 (SQL RAG 체인)**:
```js
import { Ollama } from "@langchain/ollama";
import { SqlDatabase } from "langchain/sql_db";  // SQL 연결.
import { DataSource } from "typeorm";
import { createSqlQueryChain } from "langchain/chains/sql_db";  // 자연어 → SQL 쿼리 체인.
import { QuerySqlTool } from "langchain/tools/sql";  // 쿼리 실행 도구.
import { createRetrievalChain } from "langchain/chains/retrieval";  // RAG 체인.

const llm = new Ollama({ model: "gemma:2b", baseUrl: "http://localhost:11434", temperature: 0.1 });

// SQL DB 연결 (기존 DB로 변경: e.g., type: "postgres", host: "...").
const datasource = new DataSource({
  type: "sqlite",
  database: "Chinook.db",  // 기존 SQL DB 경로.
});
const db = await SqlDatabase.fromDataSourceParams({ appDataSource: datasource });

// RAG 함수: SQL 결과를 RAG 컨텍스트로 사용.
export async function buildSqlRAG(query, allowedTables) {  // allowedTables: OPA로부터 필터링된 테이블 list.
  // 테이블 정보 필터링 (권한 기반).
  const tableInfo = await db.getTableInfo(allowedTables);  // 허용된 테이블만.

  // 자연어 → SQL 쿼리 생성 체인.
  const sqlQueryChain = await createSqlQueryChain({
    llm,
    db,
    dialect: "sqlite",  // 기존 DB dialect로 변경 (e.g., "postgres").
    topK: 10,
  });
  const generatedQuery = await sqlQueryChain.invoke({ question: query, table_info: tableInfo });

  // 쿼리 실행 (권한 체크 후).
  const sqlTool = new QuerySqlTool({ db });
  const result = await sqlTool.invoke(generatedQuery);

  // 결과 → RAG 체인 (SQL 결과를 "문서"처럼 취급해 Gemma 생성).
  const ragChain = await createRetrievalChain({
    retriever: { getRelevantDocuments: () => [{ pageContent: JSON.stringify(result) }] },  // SQL 결과를 임시 문서로.
    combineDocsChain: llm,
  });
  const response = await ragChain.invoke({ input: query });

  return response;
}
```
2. **auth.js 수정 (OPA + SQL 권한)**:
    - OPA Rego 정책 업데이트 (auth.rego): SQL 테이블/컬럼 권한 체크 추가.
```rag
package auth

import future.keywords.in
import data.redis

default allow = false

allow {
  input.method == "QUERY"
  user_role := jwt.decode(input.jwt).role
  permitted_tables := redis.get(input.userId)  // Redis list: ["Employee", "Customer"] (pxAuthTable 스타일).
  input.table in permitted_tables  // 쿼리에 포함된 테이블 체크.
}
```
- JS 코드:
```js
// ... 기존 JWT/Redis 부분 유지 ...
export async function checkAccess(req) {
  // ... 기존 코드 ...
  const permittedTables = await redisClient.lrange(`user:${userId}:auth`, 0, -1);  // 테이블 list 조회.

  const input = {
    jwt: token,
    userId,
    method: "QUERY",
    table: req.body.table || "all",  // 쿼리에 포함된 테이블.
    permittedTables,
  };

  const result = policy.evaluate(input);
  return result[0].result.allow ? permittedTables : [];
}
```

3. **app.js 수정 (API 엔드포인트)**:
```js
// ... 기존 Express 설정 ...
app.post('/sql-query', async (req, res) => {
  const { query } = req.body;

  const allowedTables = await checkAccess(req);  // OPA 체크 → 허용 테이블 list.
  if (allowedTables.length === 0) return res.status(403).json({ error: 'Access denied' });

  try {
    const response = await buildSqlRAG(query, allowedTables);
    res.json({ answer: response });
  } catch (error) {
    res.status(500).json({ error });
  }
});
```

### 어떻게 API 통제와 연결되나?

- 만약 기존 시스템이 API로 DB 데이터를 노출한다면, RAG 에이전트를 "API 호출자"로 변경: LangChain.js의 HttpRequestTool로 API 호출 → 결과 RAG 컨텍스트로 사용. OPA는 API 엔드포인트 권한을 체크 (e.g., Redis list에 허용 API 경로 저장).
- 예: buildRAG에서 API 호출 추가 → OPA로 엔드포인트 필터.
- 이는 "DB 조합" (e.g., 페이지별 JOIN)을 API가 처리하도록 유지하면서, 에이전트가 안전하게 사용.

### 보안 및 최적화 팁

- **위험 관리**: 쿼리 실행 전 OPA로 검증 (e.g., SQL 인젝션 방지). DB 연결 권한을 최소화 (읽기 전용).
- **성능**: 복잡한 DB 조합은 SQL 에이전트 (LangChain.js Agents)로 여러 쿼리 실행.
- **테스트**: node app.js 후 Postman으로 쿼리 (e.g., "How many employees?") 테스트. Redis에 권한 list 세팅: lpush user:123:auth Employee Customer.

### 연동/표준화 방법

1. **RAG request 구조 통일**: 프론트가 RAG 쿼리에 auth 객체를 포함해 보냄 (e.g., \{auth: \{...}, query: "자연어 쿼리"}). 이는 기존 request와 동일 형식으로 표준화.
2. **OPA 체크 통합**: OPA Rego 정책에서 Redis 배열을 조회해 auth와 정확히 매칭되는 객체를 찾음. 매칭 시 해당 action 플래그가 true면 통과. RAG에서 DB 테이블을 "페이지"에 매핑 (e.g., pageCd가 특정 테이블을 가리키도록 메타데이터 추가).
3. **RAG 흐름 통제**:
    - 쿼리 전: OPA로 권한 확인 → 허용된 테이블/컬럼만 필터링 (Redis 배열에서 추출).
    - 쿼리 후: 생성된 응답에 민감 데이터가 포함되지 않도록 OPA 재체크 (선택적).
    - SLM(Gemma) 통제: Ollama 호출 전에 권한 기반 프롬프트 수정 (e.g., "이 데이터만 사용해 응답: [허용된 결과]").
4. **표준화 이점**: 모든 API/RAG가 동일 OPA/Redis 로직 사용. Redis 배열을 중앙화해 유지보수 용이. 만약 페이지가 DB 조합을 의미하면, pageCd를 테이블 그룹으로 매핑 (e.g., pageCd:1 = Employee+Customer 테이블).
5. **잠재적 확장**: 복잡한 경우, OPA 정책에 Rego 로직 추가 (e.g., 계층적 체크: pageCd 없으면 menuCd로 fallback).

아래는 Node.js 기반 코드 예시 (이전 응답 확장). LangChain.js + Ollama로 RAG 구현, OPA Wasm SDK로 체크. SQL DB 중심으로 가정 (페이지별 DB 조합 통제).
### 1. 환경 설정 (변경 없음)

- Ollama: ollama pull gemma:2b & ollama serve.
- Redis: 기존 연결.
- OPA: Rego 정책 업데이트 (아래 참조).
- npm: 기존 + typeorm for SQL.

### 2. OPA 정책 업데이트 (Rego: auth.rego)

Redis 배열 구조를 반영. OPA에서 Redis 조회 (외부 HTTP or SDK로 구현, 여기선 입력으로 전달 가정).

```rag
package auth

import future.keywords.in

default allow = false

allow {
  input.action in ["public", "protected", "admin", "print", "delete", "insert", "read"]  # action 유효성.
  
  # Redis 배열에서 auth와 매칭되는 객체 찾기.
  level := input.auth.level  # e.g., "page" (request에 추가).
  permitted := input.redis[level]  # Redis 배열 전달.
  
  some obj in permitted
  obj.orgCd == input.auth.orgCd
  obj.projCd == input.auth.projCd  # "none" 허용.
  obj.menuCd == input.auth.menuCd
  obj.pageCd == input.auth.pageCd
  obj[input.action] == true  # action 플래그 true 체크.
}
```

- OPA는 입력으로 redis 전체 객체를 받음 (JS에서 조회 후 전달).

### 3. auth.js 수정 (OPA + Redis 체크)

Redis에서 전체 JSON 구조 조회 (e.g., key: user:$\{userId}:auth로 저장 가정).
```js
import jwt from 'jsonwebtoken';
import Redis from 'redis';
import * as opa from '@openpolicyagent/opa-wasm';
import fs from 'fs/promises';

const redisClient = Redis.createClient({ url: 'redis://localhost:6379' });
await redisClient.connect();

// OPA 정책 로드.
const policyWasm = await fs.readFile('auth.wasm');  // opa build -t wasm auth.rego.
const policy = await opa.loadPolicy(policyWasm);

export async function checkAccess(req) {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, 'your-secret-key');  // JWT 검증.

  const userId = decoded.userId;
  const authObj = req.body.auth;  // {orgCd, projCd, menuCd, pageCd, action}.

  if (!authObj || !authObj.action) return [];  // 유효성 실패.

  // Redis에서 전체 권한 JSON 조회 (배열 구조).
  const redisKey = `user:${userId}:auth`;
  const redisData = JSON.parse(await redisClient.get(redisKey) || '{}');  // {org: [...], proj: [...], ...}

  // 레벨 결정 (page 우선, fallback to menu/proj/org).
  const level = authObj.pageCd !== "none" ? "page" :
                authObj.menuCd !== "none" ? "menu" :
                authObj.projCd !== "none" ? "proj" : "org";

  // OPA 입력 구성.
  const input = {
    auth: { ...authObj, level },
    redis: redisData,
  };

  const result = policy.evaluate(input);
  if (!result[0].result.allow) return [];  // 권한 없음 → 빈 배열 반환 (RAG 중지).

  // 허용된 테이블/컬럼 추출 (페이지-DB 매핑 가정: e.g., pageCd별 테이블 목록 반환).
  // 실제로는 DB 메타데이터나 config에서 매핑 (e.g., pageCd:1 = ["Employee", "Customer"]).
  const allowedTables = getAllowedTablesFromPage(authObj.pageCd);  // 커스텀 함수 구현.
  return allowedTables;
}

// 예시: pageCd-DB 매핑 함수 (config나 DB에서 로드).
function getAllowedTablesFromPage(pageCd) {
  const mapping = {
    'page1': ['Employee', 'Customer'],  // pageCd별 테이블 그룹.
    // ... 기존 DB 조합 반영.
  };
  return mapping[pageCd] || [];
}
```

### 4. rag.js 수정 (SQL RAG + 권한 통제)

OPA 체크 후 허용된 테이블만 사용. SLM(Gemma) 호출 시 컨텍스트 제한.
```js
import { Ollama } from "@langchain/ollama";
import { SqlDatabase } from "langchain/sql_db";
import { DataSource } from "typeorm";
import { createSqlQueryChain } from "langchain/chains/sql_db";
import { QuerySqlTool } from "langchain/tools/sql";
import { createRetrievalChain } from "langchain/chains/retrieval";

const llm = new Ollama({ model: "gemma:2b", baseUrl: "http://localhost:11434", temperature: 0.1 });

// DB 연결 (기존 SQL DB).
const datasource = new DataSource({ type: "sqlite", database: "your_db.db" });  // 실제 DB로 변경.
const db = await SqlDatabase.fromDataSourceParams({ appDataSource: datasource });

export async function buildSqlRAG(query, allowedTables) {
  if (allowedTables.length === 0) throw new Error("Access denied");

  // 허용 테이블만 테이블 정보 로드.
  const tableInfo = await db.getTableInfo(allowedTables);

  // 자연어 → SQL 쿼리 체인 (Gemma 사용).
  const sqlQueryChain = await createSqlQueryChain({
    llm,
    db,
    dialect: "sqlite",  // DB dialect.
    topK: 5,
  });
  const generatedQuery = await sqlQueryChain.invoke({ question: query, table_info: tableInfo });

  // 쿼리 실행.
  const sqlTool = new QuerySqlTool({ db });
  const result = await sqlTool.invoke(generatedQuery);

  // RAG: SQL 결과 → Gemma 생성 (컨텍스트 제한으로 SLM 통제).
  const ragChain = await createRetrievalChain({
    retriever: { getRelevantDocuments: () => [{ pageContent: JSON.stringify(result) }] },  // 결과만 문서화.
    combineDocsChain: llm.bind({ prompt: `Use only this data: ${JSON.stringify(result)}. Answer: ${query}` }),  // 프롬프트로 통제.
  });
  const response = await ragChain.invoke({ input: query });

  return response;
}
```

### 5. app.js (Express API: 통합 엔드포인트)

RAG request가 auth 포함하도록.
```js
import express from 'express';
import { buildSqlRAG } from './rag.js';
import { checkAccess } from './auth.js';

const app = express();
app.use(express.json());

app.post('/rag-query', async (req, res) => {
  const { query, auth } = req.body;  // {query: "자연어", auth: {orgCd, ...}}.

  const allowedTables = await checkAccess(req);  // OPA + Redis 체크.
  if (allowedTables.length === 0) return res.status(403).json({ error: 'Access denied' });

  try {
    const response = await buildSqlRAG(query, allowedTables);
    res.json({ answer: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('RAG Agent on port 3000'));
```

### 구현 팁 & 잠재적 문제 해결

- **Redis 적재**: 사용자별 key (e.g., user:123:auth)에 JSON.stringify(권한 객체)로 저장. 조회 시 parse.
- **Fallback 로직**: Rego에서 pageCd "none" 시 상위 레벨 체크 (e.g., menu/proj/org).
- **SLM 통제 강화**: Gemma 프롬프트에 "권한 외 데이터 언급 금지" 추가. 또는 생성 후 OPA로 응답 필터.
- **테스트**: Redis에 샘플 데이터 set (set user:123:auth '\{"org":[...]}'), Postman으로 \{auth: \{... action: 'read'}, query: "직원 수는?"} 테스트.
- **확장**: 만약 페이지가 API 엔드포인트와 매핑되면, allowedTables 대신 allowedApis 반환 → HttpRequestTool로 API 호출.

이 방법으로 RAG가 기존 권한 시스템과 완벽 통합/표준화됩니다. 추가 세부 (e.g., DB 매핑 config) 필요 시 말씀해주세요!