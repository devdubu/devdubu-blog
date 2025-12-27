---
slug: "docker-기초"
---
- [docker 기초](#docker 기초)
- [Docker?](#Docker?)
- [docker install](#docker install)
	- [docker 실행](#docker install#docker 실행)
	- [docker 모니터링](#docker install#docker 모니터링)
	- [docker log](#docker install#docker log)
	- [컨테이너 삭제](#docker install#컨테이너 삭제)
	- [docker의 Port forwarding](#docker install#docker의 Port forwarding)
	- [docker shell](#docker install#docker shell)
		- [docker shell/bash shell](#docker shell#docker shell/bash shell)



# Docker?

---

Docker가 무엇일까..왜 필요할까,,라는 해답은 글보다는 영상으로 이해하시는게 편할 듯 하여서, 영상 링크를 드리겠습니다.

[도커의 기초 - 얄코](https://youtu.be/tPjpcsgxgWc)

사실 결론적으로 말씀드리자면, docker는 클라우드 환경에서 주로 사용합니다. 그렇다 보니 클라우드 환경을 사용하는 기업들은 거의 대부분 사용한다고 해도 과언이 아니고, 그게 아니더라도 사용하는 곳은 정말 많습니다. 영상에 보시다 싶이 장점이 매우 많기 때문이죠.

우선 그러면 docker를 설치하러 가볼까요!

# docker install

---

우선 docker를 설치하기 전에 자신의 컴퓨터가 무슨 운영체제, x86, arm 인지 알아야합니다. 각자마다의 환경에 맞게 도커 사이트에서 설치해주시면 됩니다!

[Docker Desktop - Docker](https://www.docker.com/products/docker-desktop/)

이 사이트를 가셔서 docker desktop을 설치하시면 됩니다!

대부분은 그냥 기본적으로 체크 되어있는 항목으로 넘어가주시면 됩니다!

Docker 설치가 완료 되시면, 이제 Docker가 제대로 설치가 되어있는지 확인을 해봐야겠죠.

Mac은 terimal을 Window는 powershell을 키셔서 아래 코드를 입력했을 때, 오류가 나지 않으면 성공적으로 설치가 된 것 입니다!

```docker
docker images
```

docker는 흔히 image라고 하는 것을 사용합니다. 이에 대한 개념을 잡기에는 생활코딩 님의 image pull에 대한 유튜브를 시청해주세요!

[docker image - 생활코딩](https://youtu.be/EbTJtanJUfE)

후에 우선 실습을 위해서 실습하기 좋은 was인 apache를 설치하려고 합니다. 위의 개념에서 나왔듯이 코드로는

```docker
docker pull httpd
```

를 사용하여, apache를 다운받으면 됩니다.

(git pull과 기능이 비슷하다고 생각하시면 됩니다.)

후에 해당 image를 이용해서 docker를 실행하고 싶다면, run을 작성하면된다.

## docker 실행

---

```docker
docker run --name ws2 httpd
```

run —name 컨테이너명 사용image

를 입력하면 설정한 컨테이너명으로 해당 이미지를 이용해서 실행한다. 

당연하게도 컨테이너이기에 여러개의 터미널을 켜서 run이 가능하다.

## docker 모니터링

---

만약 docker conatiner가 돌아갈 가는 것을 보고 싶다면,

```docker
docker ps
docker ps -a
```

해당 코드를 작성하면 된다.

docker ps는 현재 실행 중인 container만 보여주고,

docker ps -a는 실행중, 정지 한 모든 container를 보여준다.

## docker log

---

```docker
docker logs ws2
docker logs -f ws2
```

ws2의 로그가 보고 싶으면 이런 식으로 실행 하면 된다.

만약 실시간으로 보고싶다면, -f를 붙이게 된다면, 실시간으로 볼 수 있다.

## 컨테이너 삭제

---

```docker
docker rm ws2
docker rm --force
```

ws2를 삭제하고 싶다면, rm을 넣으면 된다.

모든 컨테이너를 한꺼번에 삭제하고 싶으면 —force라고 하면 된다.

```docker
docker rmi httpd
```

docker에 설치했던 이미지를 삭제하는 명령어 이다.

## docker의 Port forwarding

---

이 마찬가지로, 생활 코딩님이 쉽게 설명한 영상이 있습니다.

[https://youtu.be/SJFO2w5Q2HI](https://youtu.be/SJFO2w5Q2HI)

port forwading을 이용해서 웹서버를 실행해보겠습니다.

```docker
docker run --name ws3 -p 8080:80 httpd
```

터미널에 이렇게 입력을 하게 된다면, localhost:8080

으로 접속을 하게 된다면, 

It’s Work!

라는 화면이 뜨면 성공이다!

## docker shell

---

docker도 결국 linux기반으로 돌아가기 때문에, linux에서 사용하는 명령어가 어느 정도는 적용이 된다.

그리고 어느 순간은 docker내부를 들여다 봐야할 순간이 생길지 모르기 때문에, 익혀두면 도움이 될 수 있다.

우선, docker에 linux 명령어를 사용하려면,

```docker
docker exec ws3 ls
docker exec ws3 pwd
docker exec ws3 ls -al
```

docker exec 컨테이너명 명령어

이런식으로 작성하면 작동 된다. 하지만, 일일이 docker exec 컨테이명 명령어

이런식으로 작성하는건 너무 힘들기 때문에 docker container shell을 작동시키는 방법이 있다.

### docker shell/bash shell

```docker
docker exec -it ws3 /bin/sh
docker exec -it ws3 /bin/bash
```

위의 코드는 docker 자체 shell 프로그램을 지속적으로(-it) 실행하게 하는 코드이다.

즉, exec ws3 다음명령어 일때 다음 명령어만 치면 그대로 출력된다.

이 부분에 대해서 더 공부 하시거나, 궁금하신 분들은 

[Docker run reference](https://docs.docker.com/engine/reference/run/)

---

#Container #Docker 

---
