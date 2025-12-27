---
slug: "Docker-Container-LifeCycle"
---

- [Docker Container LifeCycle](#Docker Container LifeCycle)
	- [실제 LifeCycle](#실제 LifeCycle)
- [Container Start](#Container Start)
		- [컨테이너 생성](#컨테이너 생성)
		- [컨테이너 생성 및 시작](#컨테이너 생성 및 시작)
		- [컨테이너 생성 및 시작](#컨테이너 생성 및 시작)
		- [컨테이너 시작 주요 옵션](#컨테이너 시작 주요 옵션)
	- [컨테이너 상태 확인](#Container Start#컨테이너 상태 확인)
		- [실행중인 컨테이너 상태 확인](#컨테이너 상태 확인#실행중인 컨테이너 상태 확인)
		- [전체 컨테이너 상태 확인](#컨테이너 상태 확인#전체 컨테이너 상태 확인)
		- [컨테이너 상세 정보 확인](#컨테이너 상태 확인#컨테이너 상세 정보 확인)
	- [컨테이너 종료](#Container Start#컨테이너 종료)
		- [컨테이너 종료(SIGTERM) 시그널 전달](#컨테이너 종료#컨테이너 종료(SIGTERM) 시그널 전달)
		- [컨테이너 강제 종료(SIGKILL 시그널 전달)](#컨테이너 종료#컨테이너 강제 종료(SIGKILL 시그널 전달))
		- [모든 컨테이너 종료](#컨테이너 종료#모든 컨테이너 종료)
	- [컨테이너 삭제](#Container Start#컨테이너 삭제)
		- [컨테이너 삭제(실행 중인 컨테이너 불가)](#컨테이너 삭제#컨테이너 삭제(실행 중인 컨테이너 불가))
		- [컨테이너 강제 종료 후 삭제(SIGKILL 시그널 전달)](#컨테이너 삭제#컨테이너 강제 종료 후 삭제(SIGKILL 시그널 전달))
		- [컨테이너 실행 종료 후 자동 삭제](#컨테이너 삭제#컨테이너 실행 종료 후 자동 삭제)
		- [중지된 모든 컨테이너 삭제](#컨테이너 삭제#중지된 모든 컨테이너 삭제)


# Docker Container LifeCycle
![Pasted-image-20221230131806.png](/img/이미지 창고/Pasted-image-20221230131806.png)
###### 실제 LifeCycle
![Pasted-image-20221230131933.png](/img/이미지 창고/Pasted-image-20221230131933.png)

# Container Start
- docker create/run 명령어 모두 이미지가 없을 경우에는 자동으로 pull 먼저 수행하여 이미지를 다운로드 받는다.

### 컨테이너 생성
```bash
docker create [image]
```

### 컨테이너 생성 및 시작
```bash
docker start [container]
```

### 컨테이너 생성 및 시작
```bash
docker run [image]
```

### 컨테이너 시작 주요 옵션
```bash
docker run \
-i \ # 호슽의 표준 입력을 컨테이너와 연결
-t \ # TTY 할당
--rm \ # 컨테이너 실행 종료 후 자동 삭제
-d \ # 백그라운드 모드로 실행
--name hello-world \ # 컨테이너 이름 지정
-p 80:80 \ # 호스트 - 컨테이너 간 포트 바인딩
-v /opt/example:/example # 호스트 - 컨테이너 간 볼륨 바인딩
fastcampus/hello-world:latest \ # 실행할 이미지
my-command # 컨테이너 내에서 실행할 명령어
```

---

## 컨테이너 상태 확인

### 실행중인 컨테이너 상태 확인
```bash
docker ps
```

### 전체 컨테이너 상태 확인
```bash
docker ps -a
```

### 컨테이너 상세 정보 확인
```bash
docker inspect [container_name]
```

---

## 컨테이너 종료

### 컨테이너 종료(SIGTERM) 시그널 전달
```bash
docker stop [container_name]
```

### 컨테이너 강제 종료(SIGKILL 시그널 전달) 
```bash
docker kill [container]
```

### 모든 컨테이너 종료
```bash
docker stop $(docker ps -a -q)
```

---

## 컨테이너 삭제

### 컨테이너 삭제(실행 중인 컨테이너 불가)
```bash
docker rm [container]
```

### 컨테이너 강제 종료 후 삭제(SIGKILL 시그널 전달)
```bash
docker rm -f [container]
```

### 컨테이너 실행 종료 후 자동 삭제
```bash
docker run --rm ...
```

### 중지된 모든 컨테이너 삭제
```bash
docker container prune
```


---

#Container #Docker

---