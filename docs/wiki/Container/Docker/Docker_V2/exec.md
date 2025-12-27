# docker exec
- 실행중인 컨테이너에 명령어를 실행한다.
```bash
docker exec [container] [command]

# my-nginx container에 bash shell로 접속하기
docker exec -it my-nginx bash

# my-nginx container에 환경변수 확인하기
docker exec my-nginx env
```


---

#Container #Docker

---