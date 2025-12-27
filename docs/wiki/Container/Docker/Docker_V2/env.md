
# Docker 환경 변수 주입 방법
```bash
docker run -e MY_HOST=fastcampus.com [container]
docker run --env list .env [container]
docker run --env-file list .env [container]
```

## 예시
### Command 환경 변수
```bash
docker run -it -e MY_HOST=fastcampus.com ubuntu:focal bash
```

### .env 파일
```env
MY_HOST=helloworld.com
MY_VAR=123
MY_VAR2=456
```
`sample.env`
일 때, docker 아래의 명령어를 수행하면 됩니다.

```bash
docker run -it --env-file ./sample.env ubuntu:focal bash
```
위의 명령어로 env 파일을 지정할 수 있다.

---

#Container #Docker

---


