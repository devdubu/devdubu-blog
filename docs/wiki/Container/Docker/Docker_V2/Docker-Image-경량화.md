---
slug: "Docker-Image-경량화"
---
- [실습](#실습)
	- [slacktree](#실습#slacktree)
	- [nodejs-server](#실습#nodejs-server)


# Docker Image 경량화
- 꼭 필요한 패키지 및 파일만 추가
- 컨테이너 레이어 수 줄이기
- 경량 베이스 이미지 선택
- 멀티 스테이지 빌드 사용

## 실습
`/fastcampus-devops/3-docker-kubernetes/3-dockerfile`
![Pasted-image-20230102154826.png](/img/이미지 창고/Pasted-image-20230102154826.png)

### slacktree
```dockerfile
#
# slacktee
#
# build:
#   docker build --force-rm -t slacktee .
# run:
#   docker run --rm -it --name slacktee slacktee
#

FROM alpine:3.14
LABEL maintainer="FastCampus Park <fastcampus@fastcampus.com>"
LABEL description="Simple utility to send slack message easily."

# Install needed packages
RUN \
  apk add --no-cache bash curl git && \
  git clone https://github.com/course-hero/slacktee /slacktee && \
  apk del --no-cache git
RUN chmod 755 /slacktee/slacktee.sh

# Run
WORKDIR /slacktee
ENTRYPOINT ["/bin/bash", "-c", "./slacktee.sh"]
```
- 위 상황에서 packages install에서 `&&` 를 통해서 <mark>설치 작업을 하나의 layer</mark>로 통합했습니다.
	- 또한 package를 install 하는 작업에서는 cash를 필요로하지 않습니다.
	- 그렇기 때문에 `--no-cache` 조건으로 해당 작업을 마쳐야한다.

### nodejs-server
```dockerfile
#
# nodejs-server
#
# build:
#   docker build --force-rm -t nodejs-server .
# run:
#   docker run --rm -it --name nodejs-server nodejs-server
#

FROM node:16
LABEL maintainer="FastCampus Park <fastcampus@fastcampus.com>"
LABEL description="Simple server with Node.js"

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "server.js" ]
```
`Dockerfile`
- 위의 node16 버전은 매우 용량이 크다.
- 그렇다보니, 더 작은 용량을 가진 node 이미지를 다운 받아서 하는 것이 유리하다.
- 여기서 nodejs-slim, alpine 버전이 나오게 된다.
```dockerfile
alpine
#
# nodejs-server
#
# build:
#   docker build --force-rm -t nodejs-server .
# run:
#   docker run --rm -it --name nodejs-server nodejs-server
#

FROM node:16-alpine
LABEL maintainer="FastCampus Park <fastcampus@fastcampus.com>"
LABEL description="Simple server with Node.js"

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "server.js" ]
```
`Dockerfile.alpine`

```dockerfile
slim
#
# nodejs-server
#
# build:
#   docker build --force-rm -t nodejs-server .
# run:
#   docker run --rm -it --name nodejs-server nodejs-server
#

FROM node:16-slim
LABEL maintainer="FastCampus Park <fastcampus@fastcampus.com>"
LABEL description="Simple server with Node.js"

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "server.js" ]
```
`Dockerfile.slim`
- 해당 slim, alpine 이미지는 매우 경량화된 이미지로, 활용하여 사용 가능하다.

```dockerfile
alpine-multi
#
# nodejs-server
#
# build:
#   docker build --force-rm -t nodejs-server .
# run:
#   docker run --rm -it --name nodejs-server nodejs-server
#

FROM node:16-alpine AS base
LABEL maintainer="FastCampus Park <fastcampus@fastcampus.com>"
LABEL description="Simple server with Node.js"

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./


FROM base AS build
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production


FROM base AS release
COPY --from=build /app/node_modules ./node_modules
# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "server.js" ]
```
- AS 를 사용하면, FROMd에서부터 다음 FROM 전까지를 하나의 임시 Image화 합니다.
- 즉 위에서는 <mark>base</mark>, <mark>build</mark>, <mark>release</mark> 가 하나의 임시 Image의 역할을 하며, 하나의 Layer가 됩니다.
- 그렇다보니 `--from` 명령어를 통해서 해당 경로에 있는 파일을 가져올 수 있습니다.
- 해당 multi-image 방식을 통해서 docker 용량을 줄일 수 있습니다.



---

#Container #Docker 

---