---
slug: "Docker-Compose-실습"
---

- [Docker Compose 실습](#Docker Compose 실습)
- [Grafana Docker 가이드](#Grafana Docker 가이드)
- [MySQL Docker 가이드](#MySQL Docker 가이드)
- [실습 코드](#실습 코드)
	- [grafana-only](#실습 코드#grafana-only)
	- [grafana-mysql](#실습 코드#grafana-mysql)


# Docker Compose 실습

생성일: 2022년 11월 7일 오후 5:39

# Grafana Docker 가이드

[Run Grafana Docker image | Grafana documentation](https://grafana.com/docs/grafana/v9.0/setup-grafana/installation/docker/)

# MySQL Docker 가이드

[mysql - Official Image | Docker Hub](https://hub.docker.com/_/mysql)

# 실습 코드

## grafana-only

```yaml
version: '3.9'

services:
  grafana:
    image: grafana/grafana:8.2.2
    restart: unless-stopped
    environment:
      GF_INSTALL_PLUGINS: grafana-clock-panel
    ports:
    - 3000:3000
    volumes:
    - ./files/grafana.ini:/etc/grafana/grafana.ini:ro
    - grafana-data:/var/lib/grafana
    logging:
      driver: "json-file"
      options:
        max-size: "8m"
        max-file: "10"

volumes:
  grafana-data: {}
```

→ `restart` 옵션 중에 흔히 보이는 옵션인 `always` 는 해당 컨테이너가 에러가 났을 때, 

자동으로 restart를 해주는 옵션이다. 하지만 서버가 꺼진 후에는 재시작을 보장해주지 않습니다.

하지만, `unless-stopped` 옵션은 서버가 재시작을 하여도, 다시 해당 docker service가 재시작 할 수 있게끔 보장 해주는 option 입니다.

GF_INSTALL_PLUGINS → grafana 플러그인을 설치하는 항목, 이는 공식문서에 개제되어 있다.

![Untitled.png](/img/이미지 창고/Untitled.png)

![Untitled-1.png](/img/이미지 창고/Untitled-1.png)

```bash
curl localhost:3000
```

위 명령어를 하게 된다면 응답이 있는 것으로 확인 됩니다.

그리고 해당 ip로 들어가게 된다면

![Untitled-2.png](/img/이미지 창고/Untitled-2.png)

위의 화면처럼 출력 되는 것을 확인 할 수 있습니다.

Grafana의 기본 아이디 비밀 번호는 admin/admin 입니다.

## grafana-mysql

```yaml
version: '3.9'

services:
  db:
    image: mysql:5.7
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: grafana
      MYSQL_DATABASE: grafana
      MYSQL_USER: grafana
      MYSQL_PASSWORD: grafana
    volumes:
    - mysql-data:/var/lib/mysql
    logging:
      driver: "json-file"
      options:
        max-size: "8m"
        max-file: "10"

  grafana:
    depends_on:
    - db
    image: grafana/grafana:8.2.2
    restart: unless-stopped
    environment:
      GF_INSTALL_PLUGINS: grafana-clock-panel
    ports:
    - 3000:3000
    volumes:
    - ./files/grafana.ini:/etc/grafana/grafana.ini:ro
    - grafana-data:/var/lib/grafana
    logging:
      driver: "json-file"
      options:
        max-size: "8m"
        max-file: "10"

volumes:
  mysql-data: {}
  grafana-data: {}
```

→ 4가지의 환경 변수는 해당 MySQL Container 공식 문서에 작성이 되어있다.

 - 실제 Mysql container에 어느 경로에 mysql 데이터 쌓이는지 또한 공식 문서에 나와있으니 참고 하면 된다.

```yaml
app_mode = production
instance_name = ${HOSTNAME}

#################################### Server ####################################
[server]
protocol = http
http_addr =
http_port = 3000

#################################### Database ####################################
[database]
type = mysql
host = db:3306
name = grafana
user = grafana
password = grafana

#################################### Logging ##########################
[log]
mode = console
level = info

#################################### Alerting ############################
[alerting]
enabled = true
```

![Untitled-3.png](/img/이미지 창고/Untitled-3.png)

정상적으로 mysql container와 grafana container가 뜬 것을 확인 할 수 있다.

![Untitled-4.png](/img/이미지 창고/Untitled-4.png)

왼쪽과 같이 정상적으로 MySQL과 연결 된 것을 확인 할 수 있습니다.

정상적으로 잡혔는지 테스트를 위해서 USER 추가 실험을 해보도록 하겠습니다.

우선 User 추가 항목을 들어가기 위해서 아래와 같이 실행하여 user를 추가합니다.

![Untitled-5.png](/img/이미지 창고/Untitled-5.png)

![Untitled-6.png](/img/이미지 창고/Untitled-6.png)


왼쪽 아래를 통해서 로그아웃을 진행합니다.

```bash
docker-compose down
```

![Untitled-7.png](/img/이미지 창고/Untitled-7.png)

`docker compose down` 를 실행하게 된다면, container는 내려가지만, volume은 위와 같이 그대로 남아있기 때문에, 기존에 있는 데이터는 살아 있는 것을 알 수 있다.

![Untitled-8.png](/img/이미지 창고/Untitled-8.png)

다시 container를 시작하고 나서 방금 만든 user로 로그인을 하게 된다면, 로그인이 생성되는 것을 확인 할 수 있습니다.

---

#Container #Docker 

---
