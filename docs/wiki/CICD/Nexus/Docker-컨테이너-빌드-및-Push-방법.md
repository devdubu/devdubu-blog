---
slug: "Docker-컨테이너-빌드-및-Push-방법"
---
# Docker Container build & Push

## Nexus vs AWS ECR

### Docker container 빌드 후 Nexus에 이미지 Push 및 Clair 보안 스캔 수행
![스크린샷-2023-01-18-오전-9.26.45.png](/img/Pasted-image-2023-01-18-오전-9.26.45.png)

### Docker Container build 후 AWS ECR에 이미지 Push 및 ECR 보안 스캔 수행
![스크린샷-2023-01-18-오전-9.31.55.png](/img/Pasted-image-2023-01-18-오전-9.31.55.png)

## Nexus Registry
:::todo Nexus Registry 설치 및 설정 실습
- Nexus Registry용 Blob Store 생성
- Nexus Registry용 Repository 생성

:::

:::todo Nexus 대상 Docker 빌드 및 Push & Pull 수행 실습
- Nexus Regsitry URL 설정
- 로컬 docker 데몬
- Gradle > Jib
- Docker build 및 Nexus Registry로 Push 수행
- Nexus Registry에서 로컬로 Docker Pull 수행

:::

### 실습 관련 명령어
```bash
# 로컬 Docker 데몬 내 Nexus Registry 설정 명령어
vi ~/.docker/daemon.json

# Nexus Registry 로그인 명령어
docker login <Nexus Registry 주소>:5000

# Docker 빌드 후 Nexus Registry 로 Push 하기 위한 Gradle -Jib 명령어
gradle jib -DsendCredentialsOverHttp=true --console=plain

# Nexus Registry에서 로컬로 Pull 하기 위한 명령어
docker pull <Nexus Registry 주소>:5000/<Repository명>:<Tag명>
```
### 실습 명령어 코드
- https://github.com/DevOpsR

