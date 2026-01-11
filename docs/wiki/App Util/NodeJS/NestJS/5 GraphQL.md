---
slug: "5-GraphQL"
title: "GraphQL 기초 및 서버 실습"
---

# GraphQL 기초 및 서버 실습

:::info 개요
**GraphQL**은 API를 위한 쿼리 언어입니다. 클라이언트가 필요한 데이터를 정확히 지정하여 요청할 수 있어, Over-fetching과 Under-fetching 문제를 해결합니다.
:::

## 1. GraphQL 기초

### 1.1 REST API vs GraphQL
- **Over-fetching**: REST는 불필요한 데이터까지 모두 받아야 하지만, GraphQL은 필요한 필드만 요청합니다.
- **Under-fetching**: REST는 여러 엔드포인트를 호출해야 할 수 있지만, GraphQL은 한 번의 쿼리로 해결합니다.

### 1.2 장단점
- **장점**: 프론트/백엔드 병렬 작업 가능, 명확한 타입 시스템.
- **단점**: 러닝 커브, 캐싱 복잡성(Url 기반 캐싱 불가).

---

## 2. Express 서버 실습

:::note 참고
NestJS는 `@nestjs/graphql`을 제공하지만, 이 실습은 기본 원리 이해를 위해 **Express**와 `express-graphql`을 사용합니다.
:::

### 2.1 설치
```bash
npm i express express-graphql graphql
```

### 2.2 기본 설정 (server.js)
`graphiql: true` 옵션을 사용하면 브라우저에서 테스트용 UI를 사용할 수 있습니다.

```js
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const root = {
  hello: () => 'Hello world!',
};

const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(4000);
```

### 2.3 모듈화 (GraphQL Tools)

Schema와 Resolver가 커지면 파일을 분리해야 합니다. `@graphql-tools/load-files`와 `@graphql-tools/schema`를 사용합니다.

```bash
npm i @graphql-tools/schema @graphql-tools/load-files
```

**Schema 병합 예시:**
```js
const { loadFilesSync } = require('@graphql-tools/load-files');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const loadedTypes = loadFilesSync("**/*.graphql");
const loadedResolvers = loadFilesSync("**/*.resolver.js");

const schema = makeExecutableSchema({
  typeDefs: loadedTypes,
  resolvers: loadedResolvers
});
```
