# MacOS MySQL
```shell
# 시작
mysql.server start

```
# MySQL 사용자 추가
```mysql
# 단순 사용자 추가
create user [사용자명]

# 사용자(user)를 추가하면서 패스워드까지 설정
create user [사용자명]@localhost identified by '비밀번호'

# 외부 접근 권한을 부여하려면, Host를 '%'로 하여 추가
create user [사용자명]@'%' identified by '비밀번호';

# 사용자 삭제
drop user '사용자ID'@localhost;

# 특정 데이터 베이스의 모든 테이블의 접근 권한을 외부 접속 계정 모두 허용하는 명령어
GRANT ALL PRIVILEGES ON [데이터베이스명].* TO [사용자명]@'%';

```

```shell
# 사용자 DB 접속
mysql [-h호스트명] -u [DB계정명] -p [DB이름]
```

# Mysql 외부에서 사용하기
```shell
sudo vi /etc/mysql/mysql.conf.d/mysqld.cnf
```

`bind-address = 127.0.0.1`,  `mysqlx-bind-address = 127.0.0.1` 둘 다 주석처리

# Mysql Root 비번 잊을 때
혹은
```shell
sudo mysql -u root
```
을 하게 된다면 접근 가능하다.

`/etc/mysql/mysql.conf.d/mysqld.cnf` 파일에 아래를 추가 하면
```sqld
skip-grant-tables
```
잠시 root로 비번 없이 들어갈 수 있다.
그 이후 root 비번 변경을 해야한다.

```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY '새로운 비밀번호';
```

대신 외부 접속은 다 막힌다고 보면 된다.
그래서 비번 변경하고 무조건 지우자

---

#DB 