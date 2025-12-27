- [Docker Compose](#Docker Compose)
- [프로젝트/서비스/컨테이너](#프로젝트/서비스/컨테이너)
	- [프로젝트(Project)](#프로젝트/서비스/컨테이너#프로젝트(Project))
	- [서비스(Service)](#프로젝트/서비스/컨테이너#서비스(Service))
	- [컨테이너(Container)](#프로젝트/서비스/컨테이너#컨테이너(Container))
- [docker-compose.yaml](#docker-compose.yaml)
	- [버전(version)](#docker-compose.yaml#버전(version))
	- [Docker compose 실행](#docker-compose.yaml#Docker compose 실행)
		- [docker-compose 명령어 : 실행 및 종료](#Docker compose 실행#docker-compose 명령어 : 실행 및 종료)
	- [docker network 설정하기 - wordpress](#docker-compose.yaml#docker network 설정하기 - wordpress)
	- [project 내에서 활용 가능한 명령어](#docker-compose.yaml#project 내에서 활용 가능한 명령어)
- [Docker compose 주요 사용 목적](#Docker compose 주요 사용 목적)
	- [로컬 개발 환경 구성](#Docker compose 주요 사용 목적#로컬 개발 환경 구성)
	- [자동화된 테스트 환경 구성](#Docker compose 주요 사용 목적#자동화된 테스트 환경 구성)
	- [단일 호스트 내 컨테이너를 선언적으로 관리](#Docker compose 주요 사용 목적#단일 호스트 내 컨테이너를 선언적으로 관리)


# Docker-Compose

![Untitled.png](/img/이미지 창고/Untitled.png)
# Docker Compose

- 단일 서버에서 여러 컨테이너를 프로젝트 단위로 묶어서 관리
- docker-compose.yaml YAML 파일을 통해 명시적 관리

- 프로젝트 단위로 도커 네트워크와 볼륨 관리
- 프로젝트 내 서비스 간 의존성 정의 가능
- 프로젝트 내 서비스 디스커버리 자동화
- 손 쉬운 수평 확장

# 프로젝트/서비스/컨테이너

![Untitled-1.png](/img/이미지 창고/Untitled-1.png)

## 프로젝트(Project)

- Docker compose에서 다루는 워크 스페이스 단위
- 함께 관리하는 서비스 컨테이너의 묶음
- 프로젝트 단위로 기본 도커 네트워크가 생성됨

## 서비스(Service)

- docker compose에서 컨테이너를 관리하기 위한 단위
- scale을 통해 서비스 컨테이너의 수 확장 가능

## 컨테이너(Container)

- 서비스를 통해 컨테이너 관리

# docker-compose.yaml

docker-compose.yaml 파일은 총 4가지의 최상위 옵션을 제공함

version, service, networks, volumes를 제공한다. 

## 버전(version)

가능한 최신 버전 사용 권장

Docker Engine 및 docker-compose 버전에 따른 호환성 매트릭스 참조

버전 3부터는 Docker Swarm과 호환

→ Swarm 서비스를 docker-compose.yml로 정의 가능

- 즉 docker-compose.yml 파일을 작성 할 때 주의 사항은 해당 문법이 docker-compose 문법인지, docker swarm 문법인지 구별하여 작성 해야한다.

## Docker compose 실행

![Untitled-2.png](/img/이미지 창고/Untitled-2.png)

Docker compose를 실행하기 위해서는 우선 `docker-compose up` 명령어를 사용하면 된다.

![Untitled-3.png](/img/이미지 창고/Untitled-3.png)

상단에 Network를 만드는 과정이 있다. 이유인 즉, docker-compose를 만들게 된다면, defualt로 docker bridge network를 만들게 된다.

만약에 프로젝트 명을 바꾸려고 한다면, -p 옵션을 넣으면 된다.

```bash
docker-compose -p my-project up -d
```

### docker-compose 명령어 : 실행 및 종료

```bash
# Foreground로 docker-compose 프로젝트 실행
docker-compose up

# Background로 docker-compose 프로젝트 실행
docker-compose up -d

# 프로젝트 이름 my-project로 변경하여 docker-compose 프로젝트 실행
docker-compose -p my-project up -d

# 프로젝트 내 컨테이너, 네트워크 및 볼륨 종료 및 제거
docker-compose down -v
```

## docker network 설정하기 - wordpress

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

```bash
docker-compose up -d
```

![Untitled-4.png](/img/이미지 창고/Untitled-4.png)

```bash
docker compose down -v
```

![Untitled-5.png](/img/이미지 창고/Untitled-5.png)

## project 내에서 활용 가능한 명령어

```bash
# 프로젝트 내 서비스 로그 확인
docker-compose logs

# 프로젝트 내 컨테이너 이벤트 확인
docker-compose envents

# 프로젝트 내 이미지 목록
docker-compose images

# 프로젝트 내 컨테이너 목록
docker-compose ps

# 프로젝트 내 실행중인 프로세스 목록
docker-compose top
```

# Docker compose 주요 사용 목적

## 로컬 개발 환경 구성

- 특정 프로젝트의 로컬 개발 환경 구성 목적으로 사용
- 프로젝트의 의존성(Redis, MySQL, Kafka등)을 쉽게 띄울 수 있음

## 자동화된 테스트 환경 구성

- CI/CD 파이프라인 중 쉽게 격리된 테스트 환경을 구성하여 테스트 수행 가능

## 단일 호스트 내 컨테이너를 선언적으로 관리

- 단일 서버에서 컨테이너를 관리할 때 YAML 파일을 통해 선언적으로 관리 가능

---

#Container #Docker 

---
