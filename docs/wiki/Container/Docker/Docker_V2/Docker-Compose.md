---
slug: "Docker-Compose"
---
- [Docker Compose 란?](#Docker Compose 란?)
- [Project](#Project)
	- [Service](#Project#Service)
	- [Container](#Project#Container)
- [docker-compose.yml](#docker-compose.yml)
	- [Version](#docker-compose.yml#Version)
- [Docker Swarm](#Docker Swarm)
- [실습](#실습)
	- [docker-compose 명령어](#실습#docker-compose 명령어)
		- [실행 및 종료](#docker-compose 명령어#실행 및 종료)
		- [서비스 확장](#docker-compose 명령어#서비스 확장)
		- [프로젝트 내 서비스 로그 확인](#docker-compose 명령어#프로젝트 내 서비스 로그 확인)
		- [프로젝트 내 컨테이너 이벤트 확인](#docker-compose 명령어#프로젝트 내 컨테이너 이벤트 확인)
		- [프로젝트 내 이미지 목록](#docker-compose 명령어#프로젝트 내 이미지 목록)
		- [프로젝트 내 컨테이너 목록](#docker-compose 명령어#프로젝트 내 컨테이너 목록)
		- [프로젝트 내 실행 중인 프로세스 목록](#docker-compose 명령어#프로젝트 내 실행 중인 프로세스 목록)
	- [실습](#실습#실습)
- [주요 사용 목적](#주요 사용 목적)

# Docker Compose

## Docker Compose 란?
![Pasted-image-20230103110342.png](/img/이미지 창고/Pasted-image-20230103110342.png)
- 단일 서버에서 여러 컨테이너를 프로젝트 단위로 묶어서 관리
- docker-compose.yml YAML 파일을 통해 명시적으로 관리

- 프로젝트 단위로 docker network와 volume 관리
- 프로젝트 내 서비스 간 의존성 정의 가능
- 프로젝트 내 서비스 디스커버리 자동화
- 손 쉬운 컨테이너 수평 확장

## Project
- docker compose에서 다루는 워크스페이스 단위
- 함께 관리하는 서비스 컨테이너 묶음
- 프로젝트 단위로 기본 도커 네트워크가 생성 됩니다.

### Service
- docker compose에서 컨테이너를 관리하기 위한 단위
- scale을 통해 서비스 컨테이너 수 확장 가능

### Container
- 서비스를 통해 컨테이너 관리


![Pasted-image-20230103110910.png](/img/이미지 창고/Pasted-image-20230103110910.png)

## docker-compose.yml
![Pasted-image-20230103111117.png](/img/이미지 창고/Pasted-image-20230103111117.png)
- version, services, networks, volumes 총 4개의 최상위 옵션

### Version
- 가능한 최신 버전 사용을 권장
- 버전 3부터 Docker Swarm과 호환
	-> Swarm 서비스를 docker-compose.yaml로 정의 가능하다.

## Docker Swarm
- 여러 서버를 기반으로 Swarm Cluster를 형성하여 컨테이너를 관리하는 컨테이너 오케스트레이션 시스템
- K8S와 동일 목적으로 만들어졌지만, 인기를 끌지 못했다.

## 실습
```bash
# 실행중인 프로젝트 목록 확인
docker-compose ls

# 전체 프로젝트 목록 확인
docker-compose ls -a
```

`/fastcampus-devops/3-docker-kubernetes/4-docker-compose`
![Pasted-image-20230103132451.png](/img/이미지 창고/Pasted-image-20230103132451.png)

### docker-compose 명령어
```bash
# docker-compose 실행
docker-compose up
```
- docker-compose로 프로젝트를 실행하게 된다면, 기본적으로 브릿지 네트워크가 기본적으로 생성됩니다.
- 만약 프로젝트 명이 명시되어있지 않다면, 자동으로 디렉토리 명으로 명시가 됩니다.
	- 위의 예시에서도 build가 디렉토리이다보니, `build_default`로 명시되어서 서비스가 생성됩니다.

```bash
docker-compose -p my-project up -d
```
- `-p` : project 이름을 지정하는 옵션


#### 실행 및 종료
```bash
# Foreground로 Docker Compose 프로젝트 실행
docker-compose up

# Background로 Docker Compose 프로젝트 실행
docker-compose up -d

# 프로젝트 이름 my-project로 변경하여, docker-compose 실행
docker-compose -p my-project up -d

# 프로젝트 내 컨테이너 및 네트워크 종료 및 제거
docker-compose down

# 프로젝트 내 컨테이너, 네트워크 및 볼륨 종료 및 제거
docker-compose down -v
```

#### 서비스 확장
```bash
# web 서비스를 3개 확장
docker-compose up --scale web=3
```

#### 프로젝트 내 서비스 로그 확인
```bash
docker-compose logs
```

#### 프로젝트 내 컨테이너 이벤트 확인
```bash
docker-compose evnets
```

#### 프로젝트 내 이미지 목록
```bash
docker-compose images
```

#### 프로젝트 내 컨테이너 목록
```bash
docker-compose ps
```

#### 프로젝트 내 실행 중인 프로세스 목록
```bash
docker-compose top 
```


### 실습
```yaml
version: '3.9'

services:
  db:
    image: mysql:5.7
    volumes:
    - db:/var/lib/mysql
    restart: always
    environment:
    - MYSQL_ROOT_PASSWORD=wordpress
    - MYSQL_DATABASE=wordpress
    - MYSQL_USER=wordpress
    - MYSQL_PASSWORD=wordpress
    networks:
    - wordpress

  wordpress:
    depends_on:
    - db
    image: wordpress:latest
    ports:
    - "8000:80"
    restart: always
    environment:
      WORDPRESS_DB_HOST: db:3306
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD: wordpress
      WORDPRESS_DB_NAME: wordpress
    networks:
    - wordpress

volumes:
  db: {}

networks:
  wordpress: {}
```
- `restart : always` : container가 에러가 날 때, 지속적으로 재시작을 한다.
- `envirment` : 배열 혹은 object 형식을 이용해서 환경 변수 셋팅이 가능합니다.
```yaml
# 배열 방식
environment:
	- MYSQL_ROOT_PASSWORD=wordpress
	- MYSQL_DATABASE=wordpress
# Object 방식
environment:
	WORDPRESS_DB_HOST: db:3306
	WORDPRESS_DB_USER: wordpress

```
- `depends_on` : depends_on 기능을 이용해서 container의 순서를 정할 수 있습니다.
	- depends_on을 통해서 container가 실행 됐음을 보장하지만, <mark>실행 됐음을 보장하지 않습니다.</mark>

## 주요 사용 목적
- **로컬 개발 환경 구성**
	- 특정 프로젝트의 로컬 개발 환경 구성 목적으로 사용
	- 프로젝트 의존성(Redis, MySQL, KafKa 등)을 쉽게 띄울 수 있다.
- **자동화된 테스트 환경 구성**
	- CI/CD 파이프라인 중 수비게 격리된 테스트 환경을 구성하여 테스트 수행 가능
- **단일 호스트 내 컨테이너를 선언적 관리**
	- 단일 서버에서 컨테이너를 관리할 때 YAML 파일을 통해 선언적으로 관리 가능

---

#Container #Docker 

---