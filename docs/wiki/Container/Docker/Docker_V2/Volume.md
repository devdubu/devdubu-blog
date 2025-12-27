- [Docker Layer Architecture](#Docker Layer Architecture)
	- [실습 코드](#Docker Layer Architecture#실습 코드)
		- [html](#실습 코드#html)
	- [Host Volume](#Docker Layer Architecture#Host Volume)
		- [실습](#Host Volume#실습)
	- [Volume Container](#Docker Layer Architecture#Volume Container)
		- [실습](#Volume Container#실습)
	- [Docker Volume](#Docker Layer Architecture#Docker Volume)
		- [실습](#Docker Volume#실습)
	- [Read-only Volume 연결](#Docker Layer Architecture#Read-only Volume 연결)
		- [실습](#Read-only Volume 연결#실습)


# Docker Layer Architecture
![Screenshot-2023-01-01-at-9.14.21-PM.png](/img/이미지 창고/Screenshot-2023-01-01-at-9.14.21-PM.png)

## 실습 코드
`/fastcampus-devops/3-docker-kubernetes/2-docker-volume`
![Screenshot-2023-01-01-at-9.21.19-PM.png](/img/이미지 창고/Screenshot-2023-01-01-at-9.21.19-PM.png)

### html
```html
<h1>Hello fastcampus!!</h1>
```
`index.html`


## Host Volume
- Host의 디렉토리를 Container의 특정 경로에 마운트 한다.
```bash
# 호스트의 /opt/html 디렉토리를 Nginx의 웹 루트 디렉토리로 마운트
docker run -d \
--name nginx \
-v /opt/html:/usr/share/nginx/html \
nginx
```

### 실습

```bash
#!/usr/bin/env sh

docker run \
  -d \
  -v $(pwd)/html:/usr/share/nginx/html \
  -p 80:80 \
  nginx
```
`host-volume.sh`

## Volume Container
![Screenshot-2023-01-01-at-9.23.43-PM.png](/img/이미지 창고/Screenshot-2023-01-01-at-9.23.43-PM.png)
- 특정 컨테이너의 볼륨 마운트를 공유할 수 있다.
```bash
docker run -d \
--name my-volume \
-it \
-v /opt/html:/usr/share/nginx \
html \
ubuntu:focal

# my-volume 컨테이너의 볼륨 공유
docker run -d \
--name nginx \
--volumes-from my-volumes \
nginx
```

### 실습
`/fastcampus-devops/3-docker-kubernetes/2-docker-volume`
```bash
#!/usr/bin/env sh

docker run \
  -d \
  -it \
  -v $(pwd)/html:/usr/share/nginx/html \
  --name web-volume \
  ubuntu:focal

docker run \
  -d \
  --name fastcampus-nginx \
  --volumes-from web-volume \
  -p 80:80 \
  nginx

docker run \
  -d \
  --name fastcampus-nginx2 \
  --volumes-from web-volume \
  -p 8080:80 \
  nginx
```
`volume-container.sh`

## Docker Volume
- docker가 제공하는 볼륨 관리 기능을 활용하여 데이터를 보존한다.
- 기본적으로 `/var/lib/docker/volumes/${volume-name}/_data` 에 저장됩니다.
```bash
# web-volume 도커 볼륨 생성
docker volume create --name db

# docker의 web-volume 볼륨을 DB의 웹 루트 디렉토리로 마운트
docker run -d \
--name fastcampus-mysql \
-v db:/var/lib/mysql \
-p 3306:3306 \
mysql:5.7
```

### 실습
`/fastcampus-devops/3-docker-kubernetes/2-docker-volume`
```bash
#!/usr/bin/env sh

docker volume create --name db

docker volume ls

docker run \
  -d \
  --name fastcampus-mysql \
  -e MYSQL_DATABASE=fastcampus \
  -e MYSQL_ROOT_PASSWORD=fastcampus \
  -v db:/var/lib/mysql \
  -p 3306:3306 \
  mysql:5.7
```
`docker-volume.sh`

## Read-only Volume 연결
- 볼륨 연결 설정에 :ro 옵션을 통해 읽기 전용 마운트 옵션을 설정할 수 있다.
```bash
# docker의 web-volume 볼륨을 Nginx의 웹 루트 디렉토리로 읽기 전용 마운트
docker run -d \
--name nginx \
-v web-volume:/usr/share/nginx/html:ro \
nginx
```

### 실습
`/fastcampus-devops/3-docker-kubernetes/2-docker-volume`
```bash
#!/usr/bin/env sh

docker run \
  -d \
  -v $(pwd)/html:/usr/share/nginx/html:ro \
  -p 80:80 \
  --name ro-nginx \
  nginx

docker exec ro-nginx touch /usr/share/nginx/html/hello
```
`readonly-volume.sh`



---

#Container #Docker 

---
