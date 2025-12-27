- MariaDB와 MySQL은 문법이 똑같습니다.

# 기본 문법
MySQL에서 데이터베이스에 대한 작업 명령은 SQL 구문을 이용하여 처리됩니다.
```sql
SELECT * FROM Reservation;
```

- 서버와의 연결을 끊는 구문인 QUIT와 같은 경우를 제외한 일반적읜 구문 뒤에는 세미콜론(;)을 붙입니다.
- 이러한 세미콜론은 SQL 구문을 구분하는 기준이 됩니다.

- MySQL은 키워드와 구문에서 대 소줌ㄴ자를 구분하지 않습니다.
```sql
SELECT * FROM Reservation;
select * from Reservation;
Select * From Reservation;
```

## MySQL 주석
```sql
# 한줄 주석
-- 한줄 주석
/* 두줄 
이상의 
주석*/
```

## MySQL 주요 구문
- 예시를 들기 위해서 아래의 임시적으로 테이블을 만듭니다.
|ID|Name|Date|RoomNum|
|--|--|--|--|
|1|홍길동|2016-01-05|2014|
|2|임꺽정|2016-02-12|918|
|3|장길산|2016-01-16|1208|
|4|홍길동|2016-03-17|504|
- 기본적으로 위의 테이블을 만들기 위해서는 아래와 같은 sql 문이 필요합니다.
```sql
CREATE TABLE Reservation(ID INT, Name VARCHAR(30), ReserveDate DATE, RoomNum INT);
CREATE TABLE Customer (ID INT, Name VARCHAR(30), Age INT, Address VARCHAR(20));

INSERT INTO Reservation(ID, Name, ReserveDate, RoomNum) VALUES(1, '홍길동', '2016-01-05', 2014);
INSERT INTO Reservation(ID, Name, ReserveDate, RoomNum) VALUES(2, '임꺽정', '2016-02-12', 918);
INSERT INTO Reservation(ID, Name, ReserveDate, RoomNum) VALUES(3, '장길산', '2016-01-16', 1208);
INSERT INTO Reservation(ID, Name, ReserveDate, RoomNum) VALUES(4, '홍길동', '2016-03-17', 504);

INSERT INTO Customer (ID, Name, Age, Address) VALUES (1, '홍길동', 17, '서울');
INSERT INTO Customer (ID, Name, Age, Address) VALUES (2, '임꺽정', 11, '인천');
INSERT INTO Customer (ID, Name, Age, Address) VALUES (3, '장길산', 13, '서울');
INSERT INTO Customer (ID, Name, Age, Address) VALUES (4, '전우치', 17, '수원');
```


## CREATE
- MySQL에서는 다음고 같은 CREATE문을 사용하여, 데이터베이스와 테이블을 만들 수 있습니다.
```sql
CREATE DATABASE [데이터베이스 이름]
```

### 데이터 베이스 선택
```sql
USE [데이터베이스 이름]
```

### 테이블 생성
```sql
CREATE TABLE 테이블이름
(
    필드이름1 필드타입1,
    필드이름2 필드타입2,
    ...
)
```
#### 예시
```sql
CREATE TABLE Test
(
    ID INT,
    Name VARCHAR(30),
    ReserveDate DATE,
    RoomNum INT
);
```
#### 실행 결과
|Field|Type|Null|Key|Default|Extra|
|--|--|--|--|--|
|ID|int(11)|YES| | NULL||
|NAME|int(11)|YES| | NULL||
|ReserveDate|date|YES| | NULL||
|RoomNum|int(11)|YES| | NULL||

## 제약 조건(constraint)
- 제약 조건(constraint)이란 데이터의 무결성을 지키기 위해 데이터를 입력 받을 때 실행되는 검사 규칙을 의미한다.
- 이러한 제약 조건은 CREATE 문으로 생성할 때나,ALTER 문으로 필드를 추가할 때도 설정할 수도 있다.

:::tip CREATE TABLE 문에서 사용할 수 있는 제약 조건은 다음과 같습니다.
1. NOT NULL : 해당 필드는 NULL값을 저장할 수 없게 됩니다.
2. UNIQUE : 해당 필드는 서로 다른 값을 가져야만 합니다.
3. PRIMARY KEY : 해당 필드는 서로 다른 값을 가져야만 합니다.
4. FOREIGN KEY : 하나의 테이블을 다른 테이블에 의존하게 만듭니다.
5. DEFAULT : 해당 필드의 기본 값을 설정합니다.

:::

## ALTER
- MySQL에서는 다음과 같이 ALTER문을 사용하여 테이블의 내용을 수정할 수 있습니다.

### 데이터 베이스 수정
`ALTER DATABASE`문은 데이터 베이스의 전체적인 특성을 수정할 수 있게 해줍니다.
```sql
ALTER DATABASE [데이터베이스 이름] CHARACTER SET=[문자집합이름]
ALTER DATABASE [데이터베이스 이름] COLLATE=[콜레이션이름]
```

- 다음 예제는 Hotel 데이터베이스의 문자 집합과 콜레이션을 변경하는 예제입니다.
```sql
ALTER DATABASE Hotel CHARACTER SET=eukr_bin COLLATE=euckr_korean_ci;
```

자주 사용되는 대표적인 CAHRACTER SET은 다음과 같습니다.

### 테이블 수정
#### 문법
```sql
ALTER TABLE 테이블이름 ADD 필드이름 필드타입
```

#### 예제
```sql
ALTER TABLE Reservation
ADD Phone INT;
```
- 다음 예제는 Reservation 테이블에 타입이 INT인 Phone 필드를 추가하는 예제입니다.

| Feild       | Type        | Null | Key | Default | Extra |
| ----------- | ----------- | ---- | --- | ------- | ----- |
| ID          | int(11)     | YES  |     | NULL    |       |
| Name        | varchar(30) | YES  |     | NULL    |       |
| ReserveDate | date        | YES  |     | NULL    |       |
| RoomName    | int(11)     | YES  |     | NULL    |       |
| Phone       | int(11)     | YES  |     | NULL    |       |

### 기존 필드 삭제
```sql
ALTER TABLE 테이블이름 DROP 필드이름
```
- ALTER TABLE 문과 함께 DROP 문을 사용하면, 테이블의 필드를 삭제할 수 있습니다.

#### 예제
```sql
ALTER TABLE Reservation
DROP RoomNum;
```

|Feild|Type|Null|Key|Default|Extra|
|--|--|--|--|--|
|ID|int(11)|YES||NULL||
|Name|varchar(30)|YES||NULL||
|ReserveDate|date|YES||NULL||
|Phone|int(11)|YES||NULL||

### 필드 타입 변경
```sql
ALTER TABLE 테이블이름 MODIFY COLUMN 필드이름 필드타입
```

#### 예제
```sql
ALTER TABLE Reservation
MODIFY COLUMN ReserveDate VARCHAR(20);
```

|Feild|Type|Null|Key|Default|Extra|
|--|--|--|--|--|
|ID|int(11)|YES||NULL||
|Name|varchar(30)|YES||NULL||
|ReserveDate|varchar(20)|YES||NULL||
|Phone|int(11)|YES||NULL||

## Drop
#### 데이터베이스 삭제
```sql
DROP DATABASE 데이터베이스이름
```
-> 데이터 베이스를 삭제하면 해당 모든 테이블이 삭제 됩니다.

#### 테이블 삭제
```sql
DROP TABLE 테이블이름
```
- 해당 테이블을 삭제하려고 할 때, 



:::tip 만약 테이블 자체가 아닌 테이블 내용을 삭제하고 싶다면?
:::

```sql
TRUNCATE TABLE 테이블이름
```

#### 실행 결과
|Feild|Type|Null|Key|Default|Extra|
|--|--|--|--|--|
|ID|int(11)|YES||NULL||
|Name|varchar(30)|YES||NULL||
|ReserveDate|date|YES||NULL||
|RoomNum|int(11)|YES||NULL||
- 마지막으로 SELECT 문을 사용하여 Reservation 테이블의 모든 레코드를 선택하여 확인합니다.
- 위의 예제에서는 이제부터 Reservation 테이블에 레코드를 추가할 때 Name 필드의 값으로 NULL을 사용할 수 없습니다.

## UNIQUE
- UNIQUE 제약 조건을 설정하면, 해당 필드는 서로 다른 값을 가져야 합니다.
- 즉, 이 제약 조건이 설정된 필드는 중복된 값을 저장할 수 없습니다.

### CREATE 문으로 UNIQUE 설정
- CREATE 문에서 테이블을 생성할 때 다음과 같이 UNIQUE 제약 조건을 설정할 수 있습니다.
- CREATE 문으로 테이블을 생성할 때 해당 필드의 타입 뒤에 UNIQUE를 명시하면, 해당 필드에는 더는 중복된 값을 저장할 수 없습니다.
```sql
-- 1.
CREATE TABLE 테이블이름
(
    필드명 필드타입 UNIQUE,
    ...
)
-- 2.
CREATE TABLE 테이블이름
(
    필드이름 필드타입,
    ...,
    [CONSTRAINT 제약조건이름] UNIQUE (필드이름)
)
```
- 위의 두 문법은 모두 해당 필드에 UNIQUE 제약 조건을 설정합니다.
- 이때 두 번째 문법을 사용하면, 해당 제약 조건에 이름을 설정 할 수 있습니다.

#### 예제
- 다음 예제는 CREATE TABLE 문을 사용하여 Test 테이블을 생성하면서 ID 필드에 UNIQUE 제약 조건을 설정하는 예제입니다.
- 이렇게 ID필드에 UNIQUE 제약 조건을 설정한 후 DESCRIBE 문을 사용하여 Test 테이블의 상세 정보를 확인하면, 다음 실행 셜과와 같이 나타납니다.
```sql
CREATE TABLE Test 
(
    ID INT UNIQUE,
    Name VARCHAR(30),
    ReserveDate DATE,
    RoomNum INT
);
```
|Field|Type|Null|Key|Default|Extra|
|--|--|--|--|--|
|ID|int(11)|YES|UNI|NULL||
|Name|varchar(30)|YES||NULL||
|ReserveDate|date|YES||NULL||
|RoomNum|int(11)|YES||NULL||
- 그리고서 INSERT INTO 문을 사용하여, ID 필드의 값이 1로 같은 2개의 레코드를 추가합니다.
- 마지막으로 SELECT 문을 사용하여 Test 테이블의 모든 레코드를 선택하여 확인합니다.

### ALTER문으로 UNIQUE 설정
- ALTER문으로 테이블에 새로운 필드를 추가하거나 수정할 때도 UNIQUE 제약 조건을 설정할 수 있다.
- 테이블에 새로운 필드를 추가할 때 UNIQUE 제약 조건을 설정하는 문법은 다음과 같습니다.
```sql
-- 1.
ALTER TABLE [테이블 이름]
ADD [필드이름] [필드타입] UNIQUE

-- 2.
ALTER TABLE [테이블 이름]
ADD [CONSTRAINT 제약조건이름] UNIQUE (필드이름)
```

- 기존 필드에 UNIQUE 제약 조건을 설정하는 문법은 아래와 같습니다.
```sql
-- 1.
ALTER TABLE 테이블이름
MODIFY COLUMN 필드이름 필드타입 UNIQUE

-- 2.
ALTER TABLE 테이블이름
MODIFY COLUMN [CONSTRAINT 제약조건이름] UNIQUE (필드이름)
```


## INSERT
### 테이블에 레코드 추가
```sql
-- 1. 
INSERT INTO 테이블이름(필드이름1, 필드이름2, 필드이름3, ...)
VALUES (데이터값1, 데이터값2, 데이터값3, ...)

-- 2.
INSERT INTO 테이블이름
VALUES (데이터값1, 데이터값2, 데이터값3, ...)
```

---

#DB #SQL #MariaDB

---