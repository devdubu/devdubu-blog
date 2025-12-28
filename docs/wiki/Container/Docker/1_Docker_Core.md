---
slug: "1_Docker_Core"
---

# Docker Core

## 1. Docker Overview
도커(Docker)는 애플리케이션을 신속하게 구축, 테스트 및 배포할 수 있는 소프트웨어 플랫폼입니다. 소프트웨어를 **컨테이너**라는 표준화된 유닛으로 패키징하며, 이 컨테이너에는 라이브러리, 시스템 도구, 코드, 런타임 등 소프트웨어를 실행하는 데 필요한 모든 것이 포함되어 있습니다.

### 핵심 개념
- **이미지(Image)**: 컨테이너 실행에 필요한 파일과 설정값 등을 포함한 불변의 파일.
- **컨테이너(Container)**: 이미지를 실행한 상태. 격리된 공간에서 프로세스가 동작.
- **도커 데몬(Docker Daemon)**: `dockerd`. API 요청을 수신하고 이미지, 컨테이너, 네트워크, 볼륨 같은 도커 객체를 관리.
- **도커 클라이언트(Docker Client)**: `docker` CLI. 사용자가 도커와 상호작용하는 주된 방법.
- **도커 레지스트리(Docker Registry)**: 도커 이미지를 저장하는 저장소 (예: Docker Hub).

---

## 2. Docker Container Lifecycle
컨테이너는 생성, 실행, 정지, 삭제의 생명주기를 가집니다.

### 주요 명령어

| 명령어 | 설명 | 예시 |
| --- | --- | --- |
| `docker run` | 이미지를 내려받고 컨테이너 실행 | `docker run -d -p 80:80 nginx` |
| `docker ps` | 실행 중인 컨테이너 목록 확인 | `docker ps -a` (정지된 것도 포함) |
| `docker stop` | 실행 중인 컨테이너 종료 | `docker stop <container_id>` |
| `docker start` | 정지된 컨테이너 시작 | `docker start <container_id>` |
| `docker restart` | 컨테이너 재시작 | `docker restart <container_id>` |
| `docker rm` | 컨테이너 삭제 (정지 상태여야 함) | `docker rm <container_id>` |
| `docker logs` | 컨테이너 로그 확인 | `docker logs -f <container_id>` |
| `docker exec` | 실행 중인 컨테이너에 명령어 실행 | `docker exec -it <container_id> /bin/bash` |

### run 명령어 옵션
- `-d`: 백그라운드 모드(Detached)로 실행.
- `-p`: 호스트와 컨테이너의 포트 연결 (호스트:컨테이너).
- `-v`: 호스트와 컨테이너의 디렉토리 연결 (마운트).
- `-e`: 컨테이너 내 환경변수 설정.
- `--name`: 컨테이너 이름 지정.
- `--rm`: 컨테이너 종료 시 자동 삭제.

---

## 3. Docker System
도커 시스템 전반을 관리하는 명령어입니다.

- `docker info`: 도커 시스템 정보 확인.
- `docker version`: 도커 버전 확인.
- `docker system prune`: 사용하지 않는 데이터(정지된 컨테이너, 사용 안 하는 네트워크/이미지 등) 일괄 삭제. **주의: 삭제된 데이터는 복구 불가.**
