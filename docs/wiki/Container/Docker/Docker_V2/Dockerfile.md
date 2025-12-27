- [Dockerfile 문법](#Dockerfile 문법)
	- [실습](#Dockerfile 문법#실습)
		- [nodejs-server](#실습#nodejs-server)

# Dockerfile 문법

[docker 공식 레퍼런스](https://docs.docker.com/engine/reference/builder)
- 해당 dockerfile 문법은 위의 레퍼런스를 보고 익히는 것이 가장 자세하게 나와있다.
![Pasted-image-20230102102251.png](/img/이미지 창고/Pasted-image-20230102102251.png)

## 실습
`/fastcampus-devops/3-docker-kubernetes/3-dockerfile`

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
- `LABLE` : 이미지의 MetaData 설정, 관리하는 이미지가 많아진다면 필수이다.
- `WORKDIR` : docker 이미지 내에서 working dir를 설정한다, 즉 `cd /app` 한 것과 동일
- `EXPOSE` : 문서화의 목적으로둔 것이다. 해당 어플리케이션이 8080포트를 사용한다 라는 것을 표현하는 것이다.

---

#Container #Docker 

---
