---
slug: "3_Docker_Network_and_Storage"
---

# Docker Network & Storage

## 1. Docker Network
도커 네트워크는 컨테이너 간의 통신 및 외부와의 통신을 관리합니다.

### 네트워크 드라이버 (Network Drivers)
1. **Bridge (기본값)**: 동일한 호스트 내의 컨테이너끼리 통신할 때 사용. `docker0`라는 가상 브릿지에 연결됨.
2. **Host**: 컨테이너가 호스트의 네트워크 스택을 그대로 사용. 포트 포워딩(`-p`) 없이 호스트 포트 사용. 성능상 이점.
3. **None**: 네트워크 인터페이스를 연결하지 않음. 루프백(`lo`)만 존재.
4. **Overlay**: 여러 호스트에 걸쳐 있는 스웜(Swarm) 서비스 간 통신을 위해 사용.
5. **Macvlan**: 컨테이너에 물리적 네트워크 인터페이스의 MAC 주소를 직접 할당.

### 네트워크 명령어
- `docker network create <name>`: 네트워크 생성.
- `docker network ls`: 네트워크 목록 확인.
- `docker network inspect <name>`: 네트워크 상세 정보 확인.
- `docker network connect <network> <container>`: 실행 중인 컨테이너에 네트워크 연결.

---

## 2. Docker Storage
컨테이너의 데이터는 컨테이너가 삭제되면 함께 사라집니다. 데이터를 영구적으로 보존하기 위해 스토리지 옵션을 사용합니다.

### 스토리지 유형
1. **Volumes (권장)**
   - 도커(Linux의 경우 `/var/lib/docker/volumes/`)가 관리하는 호스트 파일 시스템의 일부에 데이터를 저장.
   - 도커 CLI로 관리 용이, 백업/마이그레이션 편리, 여러 컨테이너 간 공유 가능.
   - `docker volume create <name>`
   - `docker run -v my_volume:/data ...`

2. **Bind Mounts**
   - 호스트 시스템의 **특정 경로(파일/디렉토리)**를 컨테이너에 직접 마운트.
   - 개발 환경에서 소스 코드를 실시간으로 반영할 때 유용.
   - 호스트 경로 의존성이 생김.
   - `docker run -v /host/path:/container/path ...`

3. **tmpfs Mounts**
   - 호스트의 메모리에 데이터를 저장. 디스크에 기록되지 않음.
   - 보안상 민감한 정보나 고속 I/O가 필요한 일회성 데이터에 적합.
   - `docker run --tmpfs /app ...`

### 볼륨 관리 명령어
- `docker volume ls`: 볼륨 목록 확인.
- `docker volume create`: 볼륨 생성.
- `docker volume inspect`: 볼륨 상세 정보 확인.
- `docker volume rm`: 볼륨 삭제.
- `docker volume prune`: 사용하지 않는 볼륨 일괄 삭제.
