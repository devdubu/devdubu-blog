---
slug: "Docker-Entrypoint-Command"
---

# EntryPoint
- Docker Container가 실행할 때 고정적으로 실행되는 스크립트 혹은 명령어
- 생략 가능하며, 생략될 경우 커맨드에 지정된 명령어로 수행


# Command
- Docker Container가 실행할 때 수행할 명령어 혹은 Entrypoint에 지정된 명령어에 대한 인자 값

# Dockerfile의 EntryPoint와 Command
![Screenshot-2023-01-01-at-3.12.07-PM.png](/img/이미지 창고/Screenshot-2023-01-01-at-3.12.07-PM.png)
- CMD는 Docker Image가 실행 될 때 기본적으로 사용될 명령어 입니다.
- Entrypoint는 CMD명령어가 수행됨에 앞서 실행되는 프로그램입니다.

```bash
docker run --entrypoint sh ubuntu:focal
# 기본적으로는 bash이지만, entrypoint를 통해서 sh 쉘로 변경할 수도 있다.
docker run --entrypoint echo ubuntu:focal hello world
# echo 명령어를 통해서 hello world를 사용할 수 있게 할 수도 있습니다.
```

---

#Container #Docker

---
