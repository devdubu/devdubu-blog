---
slug: "4_Docker_Compose"
---

# Docker Compose

## 1. Overview
도커 컴포즈(Docker Compose)는 다중 컨테이너 도커 애플리케이션을 정의하고 실행하기 위한 도구입니다. `docker-compose.yml` 파일을 사용하여 애플리케이션 서비스, 네트워크, 볼륨 등을 설정하고, 명령어 하나로 모든 서비스를 생성하고 시작할 수 있습니다.

---

## 2. docker-compose.yml Structure
YAML 형식을 사용하며, 서비스(`services`), 네트워크(`networks`), 볼륨(`volumes`) 정의가 포함됩니다.

```yaml
version: "3.8"  # 컴포즈 파일 포맷 버전

services:
  web:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./html:/usr/share/nginx/html
    networks:
      - my_net

  db:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: root
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - my_net

networks:
  my_net:
    driver: bridge

volumes:
  db_data:
```

---

## 3. Basic Commands
- `docker-compose up`: (이미지 빌드), 컨테이너 생성 및 시작.
    - `-d`: 백그라운드 실행.
    - `--build`: 이미지를 강제로 다시 빌드.
- `docker-compose down`: 컨테이너 정지 및 삭제 (네트워크 포함).
    - `-v`: 볼륨까지 함께 삭제.
- `docker-compose ps`: 현재 컴포즈로 실행 중인 컨테이너 목록 확인.
- `docker-compose logs`: 서비스 로그 확인. `docker-compose logs -f` 로 실시간 확인.
- `docker-compose exec`: 실행 중인 서비스 컨테이너에 명령어 실행. (`docker-compose exec web bash`)
- `docker-compose config`: 설정 파일 유효성 검사.

---

## 4. Best Practices
- **Service Name**: 명확하게 명명하여 DNS 호스트네임으로 사용될 수 있게 함.
- **Environment Variables**: `.env` 파일을 사용하여 환경별 변수(비밀번호 등) 관리.
- **Depends On**: `depends_on`을 사용하여 서비스 시작 순서를 제어. (But, 애플리케이션 레벨에서 헬스 체크 권장)
- **Healthcheck**: 컨테이너가 실제로 준비되었는지 확인하는 헬스 체크 설정.
