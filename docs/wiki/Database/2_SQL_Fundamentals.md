---
slug: "2-SQL-Fundamentals"
---

# SQL Fundamentals

## 1. SQL Syntax Basics
SQL(Structured Query Language)은 RDBMS에서 데이터를 관리하기 위한 표준 언어입니다.

### Command Types
| 분류 | 의미 | 명령어 |
| :--- | :--- | :--- |
| **DML** (Data Manipulation) | 데이터 조작 | `SELECT`, `INSERT`, `UPDATE`, `DELETE` |
| **DDL** (Data Definition) | 데이터 정의 | `CREATE`, `ALTER`, `DROP`, `TRUNCATE` |
| **DCL** (Data Control) | 권한 제어 | `GRANT`, `REVOKE` |
| **TCL** (Transaction Control) | 트랜잭션 제어 | `COMMIT`, `ROLLBACK` |

---

## 2. Data Retrieval (SELECT)

### Basic Select & Filtering
```sql
-- 모든 컬럼 조회
SELECT * FROM users;

-- 특정 컬럼 조회 및 정렬
SELECT name, email 
FROM users 
WHERE age >= 20 
ORDER BY name ASC;

-- 중복 제거
SELECT DISTINCT country FROM users;
```

### Where Clause Operators
- **Comparison**: `=`, `!=`, `>`, `<`, `>=`, `<=`
- **Logical**: `AND`, `OR`, `NOT`
- **Range**: `BETWEEN a AND b`
- **List**: `IN (a, b, c)`
- **Pattern**: `LIKE 'Kim%'` (Kim으로 시작), `LIKE '%Kim%'` (Kim 포함)
- **Null**: `IS NULL`, `IS NOT NULL`

### Grouping & Aggregation
```sql
SELECT country, COUNT(*) as user_count, AVG(age) as avg_age
FROM users
GROUP BY country
HAVING COUNT(*) > 100; -- 집계 후 필터링
```
> [!NOTE] WHERE vs HAVING
> - `WHERE`: 그룹화 **전**에 데이터를 필터링합니다. (집계함수 사용 불가)
> - `HAVING`: 그룹화 **후**에 집계 결과를 필터링합니다.

---

## 3. Functions

### String Functions
- `CONCAT(a, b)`: 문자열 합치기
- `SUBSTRING(str, pos, len)`: 문자열 자르기
- `LENGTH(str)`: 길이 반환
- `UPPER(str)`, `LOWER(str)`: 대소문자 변환
- `REPLACE(str, from, to)`: 문자열 치환

### Numeric Functions
- `ABS(n)`: 절댓값
- `ROUND(n, d)`: 반올림
- `CEILING(n)`, `FLOOR(n)`: 올림, 내림
- `MOD(n, m)`: 나머지

### Date Functions
- `NOW()`: 현재 날짜와 시간
- `DATE_FORMAT(date, format)`: 날짜 포맷팅 (예: `%Y-%m-%d`)
- `DATEDIFF(date1, date2)`: 날짜 차이 계산

### Conditional Functions
```sql
-- IF (MySQL)
SELECT name, IF(score >= 60, 'Pass', 'Fail') as result FROM exams;

-- CASE (Standard)
SELECT name,
  CASE 
    WHEN score >= 90 THEN 'A'
    WHEN score >= 80 THEN 'B'
    ELSE 'C'
  END as grade
FROM exams;
```

---

## 4. Multi-Table Operations (Joins)

### JOIN Types
- **INNER JOIN**: 두 테이블의 교집합 (공통된 값만)
- **LEFT JOIN**: 왼쪽 테이블 기준 + 오른쪽 테이블 매칭 (없으면 NULL)
- **RIGHT JOIN**: 오른쪽 테이블 기준 + 왼쪽 테이블 매칭
- **FULL JOIN**: 두 테이블의 합집합 (MySQL은 미지원, `UNION`으로 대체)
- **CROSS JOIN**: 모든 경우의 수 결합 (Cartesian Product)

```sql
SELECT u.name, o.order_date
FROM users u
INNER JOIN orders o ON u.id = o.user_id;
```

### UNION
두 쿼리의 결과를 위아래로 합칩니다.
- `UNION`: 중복 제거
- `UNION ALL`: 중복 포함 (더 빠름)

---

## 5. Subqueries
쿼리 내부에 포함된 또 다른 쿼리입니다.

```sql
-- WHERE 절 서브쿼리
SELECT * FROM products 
WHERE price > (SELECT AVG(price) FROM products);

-- FROM 절 서브쿼리 (Derived Table)
SELECT * FROM 
  (SELECT id, name FROM users WHERE active = 1) AS active_users;
```

---

## 6. Data Modification

### Insert
```sql
INSERT INTO users (name, age) VALUES ('Jinmin', 30);
```

### Update
```sql
UPDATE users SET age = 31 WHERE name = 'Jinmin';
```

### Delete
```sql
DELETE FROM users WHERE name = 'Jinmin';
```

---

## 7. Transaction
데이터의 상태를 변경시키는 작업의 단위입니다.

```sql
START TRANSACTION;
UPDATE account SET balance = balance - 1000 WHERE id = 'A';
UPDATE account SET balance = balance + 1000 WHERE id = 'B';
COMMIT; -- 저장
-- 또는
ROLLBACK; -- 취소
```
