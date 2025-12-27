---
slug: "SQL-기본-문법"
---



# Join
## Inner Join(내부 조인)
![Pasted-image-20230406090238.png](/img/이미지 창고/Pasted-image-20230406090238.png)
```sql
SELECT <열 목록>
FROM <첫 번째 테이블>
	INNER JOIN<두번째 테이블>
	ON<조인 검색>
[WHERE 검색 조건]
```
- 두 테이블을 연결할 때 가장 많이 사용하는 것이 내부 조인 입니다.
- 보통 조인이라고 하면 내부 조인을 의미합니다.

## Outer Join(외부 조인)
![Pasted-image-20230406090349.png](/img/이미지 창고/Pasted-image-20230406090349.png)
```sql
SELECT <열 목록>
FROM <첫 번째 테이블(LEFT 테이블)
	<LEFT | RIGHT | FULL> OUTER JOIN <두 번째 테이블(RIGHT 테이블>
	ON <조인 조건>
[WHERE 검색 조건]
```
### LEFT Outer Join
- 왼쪽 테이블의 모든 값이 출력되는 조인
### RIGHT Outer Join
- 오른쪽 테이블의 모든 값이 출력되는 조인
### FULL Outer Join
- 왼쪽 또는 오른쪽 테이블의 모든 값이 출력되는 조인




---

#DB #SQL

---

