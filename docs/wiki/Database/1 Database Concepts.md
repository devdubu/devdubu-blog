---
slug: "1-Database-Concepts"
---

# Database Concepts

## 1. Introduction to Database
데이터베이스(Database)는 체계적으로 구성된 데이터의 집합입니다.
현대 애플리케이션에서는 크게 관계형 데이터베이스(RDBMS)와 비관계형 데이터베이스(NoSQL)로 나뉩니다.

### RDBMS (Relational Database Management System)
- **구조**: 데이터를 테이블(Table), 행(Row), 열(Column) 형태로 저장합니다.
- **특징**: 스키마(Schema)가 고정되어 있으며, 데이터 간의 관계(Relation)를 통해 무결성을 보장합니다.
- **언어**: SQL(Structured Query Language)을 사용합니다.
- **종류**: MySQL, PostgreSQL, Oracle, MariaDB, SQL Server 등.

### NoSQL (Not Only SQL)
- **구조**: Key-Value, Document, Column, Graph 등 다양한 형태로 저장합니다.
- **특징**: 유연한 스키마를 가지며, 수평 확장에 유리합니다.
- **종류**: MongoDB, Redis, Cassandra, DynamoDB 등.

---

## 2. Key Terminology

| 용어 | 설명 |
| :--- | :--- |
| **Table** | 데이터를 행과 열로 저장하는 구조 (엑셀 시트와 유사) |
| **Row (Record)** | 테이블의 가로 한 줄 (개별 데이터 객체) |
| **Column (Field)** | 테이블의 세로 한 열 (데이터 속성) |
| **Primary Key (PK)** | 행을 유일하게 식별하는 키 (중복 불가, NULL 불가) |
| **Foreign Key (FK)** | 다른 테이블의 PK를 참조하여 관계를 맺는 키 |
| **Query** | 데이터베이스에 요청하는 명령어 |
