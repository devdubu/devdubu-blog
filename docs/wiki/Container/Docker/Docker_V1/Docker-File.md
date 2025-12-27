---
slug: "Docker-File"
---

- [Docker File](#Docker File)
- [docker file의 기본 명령어](#docker file의 기본 명령어)
	- [from](#docker file의 기본 명령어#from)
	- [ARG](#docker file의 기본 명령어#ARG)
	- [RUN](#docker file의 기본 명령어#RUN)
		- [shell 형식](#RUN#shell 형식)
		- [exec 형식](#RUN#exec 형식)
	- [CMD](#docker file의 기본 명령어#CMD)
		- [Exec 형식으로 기술](#CMD#Exec 형식으로 기술)
		- [Shell 형식으로 기술](#CMD#Shell 형식으로 기술)
		- [ENTRYPOINT 명령의 파라미터로 기술](#CMD#ENTRYPOINT 명령의 파라미터로 기술)
		- [ENTRYPOINT? CMD?](#CMD#ENTRYPOINT? CMD?)
		- [CMD](#CMD#CMD)
		- [ENTRYPOINT](#CMD#ENTRYPOINT)


# Docker File

사실 대부분은 위처럼 docker를 직접 terminal에서 하는 일은 많이 없는 것 같다. 왜냐하면 사실 귀찮기 때문이다. 모든 개발자들의 공통적인 특징이다. 귀찮은거 정말 싫어한다. ㅎ

나 역시도 귀찮을걸 매우 싫어하기에 자동화 이런거에 되게 집착한다. 컴퓨터가 알아서 해주길..

개인적인 생각이지만, 이런 느낌으로 docker file이 나온게 아닌가 싶다(아주 얇은 지식이니,,틀리면 댓글 달아주세요!)

Docker-File에 해당하는 내용은 얄코님의 Docker 수업을 통해서 공부 한 내용입니다!

[가장 쉽게 배우는 도커](https://youtu.be/hWPv9LMlme8)

```dockerfile
FROM node:12.18.4

# 이미지 생성 과정에서 실행할 명령어
RUN npm install -g http-server 

# 이미지 내에서 명령어를 실행할(현 위치로 잡을) 디렉토리 설정
WORKDIR /home/node/app

# 컨테이너 실행시 실행할 명령어
CMD ["http-server", "-p", "8080", "./public"]

# 이미지 생성 명령어 (현 파일과 같은 디렉토리에서)
# docker build -t {이미지명} .

# 컨테이너 생성 & 실행 명령어
# docker run --name {컨테이너명} -v $(pwd):/home/node/app -p 8080:8080 {이미지명}
```

사실 프로그래밍은 공식 문서를 나중에 보고 우선 다른 분들이 프로젝트를 먼저 보고 이해하는게 더 빠른 것 같다. 

그래서 나도, 우선은 docker file의 예시를 보고 이를 통해서 공식 문서를 정리해보려고 한다!

얄코님이 주석으로 잘 처리해주신 것처럼 이런 식으로 작성을 하면 된다.

front는 당연하게도 node를 사용했고, node version 12를 사용하였습니다.

우선 docker파일을 실행하기 전에 docker파일에 필요한 image를 다운 받고, 

컨테이너를 생성한 다음, 실행을 하는 명령어를 입력하면 된다.

```dockerfile
FROM mysql:5.7

# 이미지 환경변수들 세팅
# 실전에서는 비밀번호 등을 이곳에 입력하지 말 것!
# 서버의 환경변수 등을 활용하세요.
ENV MYSQL_USER mysql_user
ENV MYSQL_PASSWORD mysql_password
ENV MYSQL_ROOT_PASSWORD mysql_root_password
ENV MYSQL_DATABASE visitlog

# 도커환경에서 컨테이너 생성시 스크립트를 실행하는 폴더로
# 미리 작성된 스크립트들을 이동
COPY ./scripts/ /docker-entrypoint-initdb.d/

# 이미지 빌드 명령어 (현 파일과 같은 디렉토리에서)
# docker build -t {이미지명} .

# 실행 명령어 (터미널에 로그 찍히는 것 보기)
# docker run --name {컨테이너명} -it -p 3306:3306 {이미지명}

# 실행 명령어 (데몬으로 실행)
# docker run --name {컨테이너명} -p 3306:3306 -d {이미지명}
```

DB에서는 MySQL을 사용했으며, MySQL 5.7버전을 사용했습니다.

우선 이미지의 환경변수들을 셋팅하고,미리 작성해둔 스크립트가 있다면, 해당 스크립트들을 이동시키는 코드를 작성해주면 된다.

위와 마찬가지로 먼저 image를 다운받고, 빌드, 실행하게 된다면, 해당 DB Docker가 실행될 것이다.

```dockerfile
FROM python:3.8.5

# 이미지 생성 과정에서 실행할 명령어
RUN pip3 install flask flask-cors flask-mysql

# 이미지 내에서 명령어를 실행할(현 위치로 잡을) 디렉토리 설정
WORKDIR /usr/src/app

# 컨테이너 실행시 실행할 명령어
CMD ["python3", "backend.py"]

# 이미지 생성 명령어 (현 파일과 같은 디렉토리에서)
# docker build -t {이미지명} .

# 컨테이너 생성 & 실행 명령어
# docker run --name {컨테이너명} -v $(pwd):/usr/src/app -p 5000:5000 {이미지명}
```

Back-End도 마찬가지로, 백엔드는 python flask로 구성했다. 이를 위해서 python 3.8을 설치하고, 

이미지 생성 과정에서 flask를 다운 받고, 기본 디렉토리 설정 후, 실행할 명령어를 입력한다.

그 전에는 python이 깔려있어야하고, container가 실행 되어야 위 해당 코드가 실행된다.

```yaml
version: '3'
services:
  database:
    # Dockerfile이 있는 위치
    build: ./database
    # 내부에서 개방할 포트 : 외부에서 접근할 포트
    ports:
      - "3306:3306"
  backend:
    build: ./backend
    # 연결할 외부 디렉토리 : 컨테이너 내 디렉토리
    volumes:
      - ./backend:/usr/src/app
    ports:
      - "5000:5000"
    # 환경변수 설정
    environment: 
      - DBHOST=database
  frontend:
    build: ./frontend
    # 연결할 외부 디렉토리 : 컨테이너 내 디렉토리
    volumes:
      - ./frontend:/home/node/app
    ports:
      - "8080:8080"
```

이 부분이 셀수 없이 많아진다면, 그에 대한 감당은 개발자의 몫이 된다. 일반적으로 실무에서는 한가지에 컨테이너만 다루는 것이 아닌 수백개의 컨테이너를 다루기 때문에 이 작업이 매우 힘든 작업이 될 수 있다.

여기서는 아주 간단한 예시이지만, 이 yml파일로 한번에 도커 3개의 파일을 실행할 수 있게 도와주는 파일이다. 이를 통해서 3개의 각각의 도커파일을 한꺼번에 제어가 가능하다.

일일이 docker에 대한 부분을 각각 설정하고 run하는 행위는 여간 귀찮은 일이 아니다.

# docker file의 기본 명령어

## from

---

```docker
FROM [--platform=<platform>] <image>[:<tag>] [AS <name>]
FROM python:3.8.5
```

이런식으로 작성할 수 있으며, 조금은 쉽게는

밑의 방식대로 사용할 수 있다. 이미지명:버전 이런식으로도 사용이 가능함.

from은 처음 build 할 때 초기화하는 용도로 사용한다. 쉽게 말하자면, image를 가져오는 용도로 보면 된다. from은 최상단에 맨 처음에 사용해야하지만, form보다 앞서 사용하는 문법이 딱 한가지가 있다.

## ARG

---

arg은 image의 버전을 어떤 버전을 사용할 것인가를 설정하는 것이다.

```docker
ARG  CODE_VERSION=latest
FROM base:${CODE_VERSION}
```

옆의 코드를 보다보면, 원래는 

FROM python:3.8.x 이런식으로 작성을 했다면, arg를 사용하게 된다면, 

왼쪽과 같이 사용할 수 있다. CODE_VERSION을 변수처럼 활용하는 것이다.

## RUN

---

run 말 그대로 실행시키는 함수이다. 이 run을 보다보면 한가지 힌트를 얻을 수 있다.

이미지를 생성할 때 실행할 코드를 지정하는 함수입니다. 

### shell 형식

```docker
RUN pip3 install flask flask-cors flask-mysql
```

이와 같이 자세히 보다보면, RUN 다음에는 pip문을 실행하게 된다. 

결국 RUN 다음 구문은 bash, shell에서 사용하는 구문과 거의 동일하다. 

즉, RUN은 두가지 구문을 사용 가능하다. 먼저 왼쪽 처럼 shell의 형태로 사용하는 방법과

나머지 하나는 []를 이용해서 shell언어를 쓰는 방법이 있습니다.

### exec 형식

```docker
RUN /bin/bash -c 'source $HOME/.bashrc; echo $HOME'
```

```docker
RUN ["/bin/bash", "-c", "echo hello"]
```

```docker
RUN /bin/bash -c 'source $HOME/.bashrc; \
echo $HOME'
```

만약 작성하다가 다음 줄로 넘어 간 후에도 계속해서 입력을 하려면 \를 이용해서 작성하면 된다.

위 두가지는 같은 명령이 실행되는 것이다. shell형식으로 명령을 기술하면, /bin/sh에서 실행되지만, exec 형식으로 기술하며 shell을 경유하지 않고, 직접 실행하게 된다. 즉, shell을 사용하고 싶다면, 위와 같은 경로를 지나서 실행해야한다.

```docker
RUN apt-get install -y nginx
```

```docker
RUN ["/bin/bash", "-c", "apt-get install -y nginx"]
```

## CMD

---

RUN은 이미지를 작성하기 위해 실행하는 명령을 기술하지만, 이미지를 바탕으로 생성된 컨테이너 안에서 명령을 실행하려면 CMD를 사용한다.

Dockerfile에는 하나의 CMD 명령을 기술 할 수 있다. 만일 여러 개를 지정하면, 마지막 명령만 유효하다.

CMD 명령은 세가지 기술 방법이 있다.

### Exec 형식으로 기술

RUN과 비슷하게 쉘을 호출하지 않고, 직접 실행한다. 인수는 json 배열로 지정한다.

```docker
#Dockerfile

#베이스 이미지 설정
FROM ubuntu:16.04

# Nginx 설치
RUN apt-get -y update && apt-get -y upgrade
RUN apt-get -y install nginx

# 포트 지정
EXPOSE 80

# 서버 실행
CMD ["nginx", "-g", "daemon off;"]
```

### Shell 형식으로 기술

RUN 명령의 구문과 같은 형식이다. 운영체제의 쉘을 통하여 명령을 실행할 때 사용한다.

Ubuntu에서 Nginx를 포어그라운드에서 실행할 경우 다음과 같이 기술한다.

```docker
#Dockerfile

#베이스 이미지 설정
FROM ubuntu:16.04

# Nginx 설치
RUN apt-get -y update && apt-get -y upgrade
RUN apt-get -y install nginx

# 포트 지정
EXPOSE 80

# 서버 실행
CMD nginx -g 'daemon off;'
```

### ENTRYPOINT 명령의 파라미터로 기술

ENTRYPOINT 명령의 인수로 CMD 명령을 사용할 수 있다. ENTRYPOINT 명령에서 지정한 명령은 Dockerfile에서 빌드한 이미지로부터 Docker 컨테이너를 시작하기 때문에 docker container run 명령을 실행할 때 실행된다.

```docker
ENTRYPOINT ["nginx", "-g", "daemon off;"]
ENTRYPOINT nginx -g 'daemon off;'
```

ENTRYPOINT 명령 또한 Exec 형식 또는 Shell형식으로 기술 한다.

### ENTRYPOINT? CMD?

ENTRYPOINT 명령과 CMD명령의 차이는 docker container run 명령 실행 시의 동작에 있다.

### CMD

- 컨테이너 시작시에 실행하고 싶은 명령을 정의해도 docker container run 명령 실행 시에 인수로 새로운 명령을 지정한 경우 이것을 우선 실행한다.

### ENTRYPOINT

- 이에 지정된 명령은 방드시 컨테이너에서 실행되는데, 실행 시에 명령 인수를 지정하고 싶을 때는 CMD 명령과 조합해서 사용해야한다.
- ENTRYPOINT 명령으로는 실행하고 싶은 명령 자체를 지정, CMD 명령으로는 그 명령의 인수를 지정하면, 컨테이너를 실행했을 때 기본 작동을 결정할 수 있다.

즉, 차이점은 ENTRYPOINT는 기본 값으로 셋팅을 했을 때, 변경 불가능하고

CMD는 인자를 언제든지 변경 가능하다.

```docker
# 베이스 이미지 설정
FROM ubuntu:16.04

# top 실행
ENTRYPOINT ["top"]
CMD ["-d", "10"]
```

다음은 ENTRYPOINT와 CMD를 조합한 예시이다.

Ubuntu에서 top 명령어를 10초마다 갱신하는 이미지이다. 

옆의 이미지를 CMD 명령에서 지정한 10초 간격으로 갱신한 경우 인수 없이 컨테이너를 실행한다.

```docker
docker container run -it sample-top
```

```docker
docker container run -it sample -d 2
```

만약 2초 간격으로 top를 갱신하기를 원한다면, 다음과 같이 컨테이너를 실행해야한다.

CMD명령은 docker container run 명령 실행 시에 덮어 쓸 수 있다는 구조 때문에 가능하다.

---

#Container #Docker 

---