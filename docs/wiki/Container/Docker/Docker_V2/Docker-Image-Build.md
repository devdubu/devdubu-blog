---
slug: "Docker-Image-Build"
---
- [Docker Image Build](#Docker Image Build)
	- [Docker Image Structure](#Docker Image Build#Docker Image Structure)
	- [Dockerfile 없이 이미지 생성](#Docker Image Build#Dockerfile 없이 이미지 생성)
		- [실습](#Dockerfile 없이 이미지 생성#실습)
	- [Dockerfile을 이용하여 이미지 생성](#Docker Image Build#Dockerfile을 이용하여 이미지 생성)
		- [Dockerfile로 Image build](#Dockerfile을 이용하여 이미지 생성#Dockerfile로 Image build)
			- [실습](#Dockerfile로 Image build#실습)
				- [app](#실습#app)
		- [build context](#Dockerfile을 이용하여 이미지 생성#build context)
	- [.dockerignore](#Docker Image Build#.dockerignore)

# Docker Image Build

## Docker Image Structure
![Pasted-image-20230102094559.png](/img/이미지 창고/Pasted-image-20230102094559.png)
- Nginx는 Ubuntu를 기반으로, web app은 Nginx를 기반으로 만들어진 Image로 예시를 들어보자
- 그림과 같이 docker의 Image 는 layer가 쌓이는 구조로 진행된다.

- 아래의 사진에서는 Layers가 sha256의 형태로 Layer가 나뉘어진 모습을 알 수 있다.
![Pasted-image-20230102095006.png](/img/이미지 창고/Pasted-image-20230102095006.png)

## Dockerfile 없이 이미지 생성
- 기존의 컨테이너를 기반으로 새 이미지를 생성할 수 있다.
```bash
# docker commit [OPTION] CONTAINER [REPOSITORY[:TAG]]
# ubuntu 컨테이너의 현재 상태를 my_ubuntu:v1

docker commit -a fastcampus -m "First Commit" ubuntu my ubnutu:v1
```

### 실습
```bash
docker run -it --name my_ubuntu ubuntu:focal

# Bash 진입 후
cat > my_file
Hello Fastcampus
^C
```
- 후에 `ctrl+p+q` 를 누르게 된다면 종료 없이 실행 중인 Docker에서 빠져나올 수 있다.

```bash
docker commit -a fastcampus -m "Add my_file" my_ubuntu my-ubuntu:v1
```
- 해당 명령어를 작성하게 된다면, sha256이라는 값을 출력받을 수 있습니다.
- 해당 명령어를 통해서 docker container를 image로 빌드를 시킬 수 있다.
	- `-a` : auth를 의미하고, 누가 history를 만드는지에 대한 옵션입니다.
	- `-m` : commit message
- `docker inspect [container]` 명령어를 이용하면 layer에 대한 정보를 알 수 있습니다.

## Dockerfile을 이용하여 이미지 생성
- Dockerfile을 기반으로 새 이미지를 생성할 수 있다.
```dockerfile
FROM node:12-alpine
RUN apk add --no-cache python3 g++ make
WORKDIR /app
COPY . .
RUN yarn install --production
CMD ["node", src/index.js]
```

### Dockerfile로 Image build
- Dockerfile을 기반으로 새 이미지 생성하기
```bash
# docker build [OPTIONS] PATH
# ./ 디렉토리를 빌드 컨텍스트로 my_app:v1 이미지 빌드(Dockerfile 이용)
docker build -t my_app:v1 ./

# ./ 디렉토리를 빌드 컨텍스트로 my_app:v1 이미지 빌드(example/MyDockerfile 이용)
docker build -t my_app:v1 -f example/MyDockerfile ./
```
- `-t` : tag
- `-f` : dockerfile의 경로

#### 실습
`/fastcampus-devops/3-docker-kubernetes/3-dockerfile`
![Pasted-image-20230102101405.png](/img/이미지 창고/Pasted-image-20230102101405.png)

##### app
```dockerfile
FROM node:12-alpine
RUN apk add --no-cache python3 g++ make
WORKDIR /app
COPY . .
RUN yarn install --production
CMD ["node", "src/index.js"]
```
`Dockerfile`
- Dockerfile 실행 방법
```bash
docker build -t my-app:v1 ./
```

### build context
- Docker build 명령 수행 시 현재 디렉토리 (Current Working Directory)를 빌드 컨텍스트(Build Context)라고 한다.
- Dockerfile로부터 image build에 필요한 정보를 Docker Daemon에게 전달하기 위한 목적이다.
![Pasted-image-20230102101746.png](/img/이미지 창고/Pasted-image-20230102101746.png)

## .dockerignore
- .gitignore와 동일한 문법을 가지고 있습니다.
- 특정 디렉토리 혹은 파일 목록을 빌드 컨텍스트에서 제외하기 위한 목적이다.
![Pasted-image-20230102102013.png](/img/이미지 창고/Pasted-image-20230102102013.png)



---

#Container #Docker 

---
