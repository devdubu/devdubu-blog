- [Container port 노출](#Container port 노출)
	- [Expose vs Publish](#Container port 노출#Expose vs Publish)
- [Docker Network Driver](#Docker Network Driver)
	- [Single Host Networking](#Docker Network Driver#Single Host Networking)
	- [Multi Host Networking](#Docker Network Driver#Multi Host Networking)
- [실습](#실습)
	- [none](#실습#none)
	- [host](#실습#host)
	- [bridge](#실습#bridge)

# docker network 구조
![Screenshot-2023-01-01-at-6.07.43-PM.png](/img/이미지 창고/Screenshot-2023-01-01-at-6.07.43-PM.png)
> veth: virtual eth
- docker0 : Docker engine에 의해 기본 생성되는 브릿지 네트워크
	- veth와 eth 간 다리 역할
	- eth : host 컴이 사용하는 기본 IP

# Container port 노출
- 컨테이너의 포트를 host의 IP:PORT와 연결하여 서비스를 노출합니다.
```bash
docker run -p [HOST IP:PORT] : [CONTAINER PORT] [container]

# nginx container의 80번 포트를 호스트 모든 IP의 80번 Port와 연결하여 실행
docker run -d -p 80:80 nginx

# nginx container의 80번 포트를 host 127.0.0.1 IP의 80번 포트와 연결하여 실행
docker run -d -p 127.0.0.1:80:80 nginx

# nginx container의 80번 포트를 host의 사용 가능한 포트와 연결하여 실행
docker run -d -p 80 nginx
```

## Expose vs Publish
```bash
# expose 옵션은 그저 문서화 용도
docker run -d --expose 80 nginx

# publish 옵션은 실제 포트를 바인딩
docker run -d -p 80 nginx
```

# Docker Network Driver
![Screenshot-2023-01-01-at-6.18.24-PM.png](/img/이미지 창고/Screenshot-2023-01-01-at-6.18.24-PM.png)
- 현재 Docker에서 Native하게 지원해주는 Driver는
	- bridge
	- host
	- none
	- overlay
- 정도가 있습니다.
- 아래의 Remote Drivers는 외부 서드파티 플러그인 들 입니다.

![Screenshot-2023-01-01-at-6.19.41-PM.png](/img/이미지 창고/Screenshot-2023-01-01-at-6.19.41-PM.png)
## Single Host Networking
- Bridge, host, none은 단일 host에서 동작하는 Network Driver입니다.

## Multi Host Networking
- overlay는 여러 서버들이 존재했을 때 여러 서버들을 묶어주는 가상의 네트워크 입니다.
- 또는 오케스트레이션 시스템을 사용할 때 사용합니다. -> dockerswarm을 사용할 때 사용합니다.

# 실습
`fastcampus-devops/3-docker-kubernetes/1-docker-network`

## none
```bash
#!/usr/bin/env sh

docker run -i -t --net none ubuntu:focal
```
`none.sh`

## host
```bash
#!/usr/bin/env sh

docker run -d --network=host grafana/grafana
```
`host.sh`
- host.sh 는 host(grafana)에 설정되어있는 port를 기준으로 portfowarding을 한다.
- 즉, grafana는 기본적으로 3000번 포트를 설정하고 있으므로, 3000번 포트를 사용합니다.

## bridge
```bash
#!/usr/bin/env sh

docker network create --driver=bridge fastcampus

docker run -d --network=fastcampus --net-alias=hello nginx
docker run -d --network=fastcampus --net-alias=grafana grafana/grafana
```
`bridge.sh`
- `--net-alias` 옵션은 bridge network에서 hello 라는 도메인으로 저장되어서 해당 도메인으로 네트워크를 찾아가게끔 설정하는 작업이다.
- 그리고 `--network` 옵션을 통해서 생성된 network로 묶는 작업을 한다.

---

#Container #Docker

---