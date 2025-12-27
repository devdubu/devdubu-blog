---
slug: "Docker-Daemon-Debugging"
---
- [Docker Daemon 명령어](#Docker Daemon 명령어)
	- [Docker system](#Docker Daemon 명령어#Docker system)
		- [docker system info](#Docker system#docker system info)
		- [docker system events](#Docker system#docker system events)
		- [docker system df](#Docker system#docker system df)
		- [docker system prune](#Docker system#docker system prune)
		- [docker stats](#Docker system#docker stats)
	- [Linux 에서 해당 Docker Event를 확인하는 방법](#Docker Daemon 명령어#Linux 에서 해당 Docker Event를 확인하는 방법)
		- [Ubuntu의 경우에는](#Linux 에서 해당 Docker Event를 확인하는 방법#Ubuntu의 경우에는)

# Docker Daemon 명령어

## Docker system

### docker system info
- 해당 시스템에 대한 많은 정보들을 출력합니다.

### docker system events
- alias 화가 되어있어서 docker events라고 사용해도 된다.
- `docker system events` 라고 cli를 치게 된다면, docker에서 발생되는 모든 이벤트들이 출력됩니다.


### docker system df
- docker의 시스템 용량을 확인 할 수 있는 명령어
```bash
docker system df
```

### docker system prune
- docker내에 사용하지 않는 모든 설정 들을 일괄 삭제하는 명령어
```bash
docker system prune
```


### docker stats
- 각각의 컨테이너별로 어떻게 CPU, 메모리 사용이 되는지 확인 할 수 있습니다.
```bash
docker stats
```


## Linux 에서 해당 Docker Event를 확인하는 방법

### Ubuntu의 경우에는
- journalctl을 사용해서 event를 사용할 수 있다.
```bash
journalctl -u docker 
```
docker daemon의 log를 필터링 걸어서 확인이 가능합니다.


---

#Container #Docker 

---