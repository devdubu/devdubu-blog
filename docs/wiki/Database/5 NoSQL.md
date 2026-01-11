---
slug: "5-NoSQL"
---

# NoSQL Database

## 1. Overview
NoSQL(Not Only SQL) 데이터베이스는 전통적인 관계형 데이터베이스(RDBMS)와 달리, 데이터의 고정된 스키마가 없으며 확장성이 뛰어나 대규모 데이터를 처리하는 데 적합합니다.

### Characteristics
- **Schema-less**: 데이터 구조를 미리 정의하지 않아도 됩니다.
- **Scalability**: 수평적 확장(Scale-out)이 용이합니다.
- **Performance**: 대량의 단순 입출력 처리에 높은 성능을 보입니다.

---

## 2. Types of NoSQL

### Key-Value Store
- 가장 단순한 형태의 NoSQL입니다. Key와 Value의 쌍으로 데이터를 저장합니다.
- **예시**: Redis, AWS DynamoDB, Riak.
- **용도**: 캐싱(Caching), 세션 관리, 장바구니.

### Document Store
- XML, JSON과 같은 문서(Document) 형태로 데이터를 저장합니다.
- **예시**: MongoDB, CouchDB.
- **용도**: 로그 저장, 콘텐츠 관리 시스템(CMS), 유동적인 데이터 구조가 필요한 앱.

### Column Family Store
- 데이터를 행(Row) 대신 열(Column) 기반으로 저장합니다. 읽기/쓰기 성능이 매우 빠릅니다.
- **예시**: Apache Cassandra, HBase.
- **용도**: 대규모 실시간 분석, 시계열 데이터.

### Graph Database
- 데이터 간의 관계를 노드(Node)와 엣지(Edge)로 표현하여 저장합니다.
- **예시**: Neo4j, Amazon Neptune.
- **용도**: 소셜 네트워크, 추천 엔진, 사기 탐지.

---

## 3. GraphQL (Tip)
*(Note: GraphQL is a query language for APIs, not a database, but often discussed in modern data stacks)*
- 클라이언트가 필요한 데이터만 요청할 수 있게 해주는 API 쿼리 언어입니다.
- REST API의 Over-fetching, Under-fetching 문제를 해결합니다.
