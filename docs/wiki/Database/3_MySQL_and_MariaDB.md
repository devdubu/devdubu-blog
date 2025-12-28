---
slug: "3-MySQL-and-MariaDB"
---

# MySQL and MariaDB

## 1. Introduction
MySQL과 MariaDB는 가장 널리 사용되는 관계형 데이터베이스 관리 시스템(RDBMS)입니다. MariaDB는 MySQL의 포크(Fork) 버전으로, 문법과 사용법이 거의 동일합니다.

---

## 2. Installation & Basic Setup

### macOS (Homebrew)
```bash
# 설치 (MySQL)
brew install mysql
# 시작
mysql.server start

# 접속
mysql -u root -p
```

### Configuration (`my.cnf` / `mysqld.cnf`)
외부 접속을 허용하려면 바인딩 주소를 변경해야 합니다.
```ini
# /etc/mysql/mysql.conf.d/mysqld.cnf
# bind-address = 127.0.0.1  <-- 주석 처리
```

---

## 3. User Management

### Create User
```sql
-- 단순 사용자 추가
CREATE USER 'username'@'localhost' IDENTIFIED BY 'password';

-- 외부 접속 허용 사용자 추가 (%)
CREATE USER 'username'@'%' IDENTIFIED BY 'password';
```

### Grant Permissions
```sql
-- 모든 데이터베이스에 대한 모든 권한 부여
GRANT ALL PRIVILEGES ON *.* TO 'username'@'%';

-- 권한 적용
FLUSH PRIVILEGES;

-- 권한 확인
SHOW GRANTS FOR 'username'@'%';
```

### Drop User
```sql
DROP USER 'username'@'localhost';
```

---

## 4. Database & Table Management

### Database Operations
```sql
CREATE DATABASE Hotel;
USE Hotel;
ALTER DATABASE Hotel CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
DROP DATABASE Hotel;
```

### Table Operations
```sql
-- 생성
CREATE TABLE Reservation (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(30) NOT NULL,
    ReserveDate DATE,
    RoomNum INT
);

-- 수정 (컬럼 추가)
ALTER TABLE Reservation ADD Phone INT;

-- 수정 (컬럼 타입 변경)
ALTER TABLE Reservation MODIFY COLUMN Name VARCHAR(50);

-- 삭제
DROP TABLE Reservation; -- 테이블 자체 삭제
TRUNCATE TABLE Reservation; -- 데이터만 삭제 (구조 유지)
```

---

## 5. Case Sensitivity (Table Names)
MySQL/MariaDB의 테이블 이름 대소문자 구분은 OS와 `lower_case_table_names` 설정에 따라 다릅니다.

| 설정값 | 설명 | OS |
| :--- | :--- | :--- |
| `0` | 대소문자 구분 (저장 및 비교) | Unix/Linux |
| `1` | 모두 소문자로 저장, 대소문자 구분 안 함 | Windows |
| `2` | 대소문자 유지 저장, 소문자로 비교 | macOS |

> [!TIP] Best Practice
> - 테이블명과 컬럼명은 일관되게 **소문자** 또는 **대문자**를 사용하는 것이 좋습니다.
> - SQL 예약어는 **대문자**로 작성하여 가독성을 높입니다.
