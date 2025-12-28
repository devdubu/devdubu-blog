---
slug: "2_Docker_Images_and_Dockerfile"
---

# Docker Images & Dockerfile

## 1. Docker Images
도커 이미지는 컨테이너를 생성하기 위한 읽기 전용 템플릿입니다. 계층(Layer) 구조로 이루어져 있어, 변경 사항만 새로운 레이어에 쌓이는 방식(Union File System)으로 효율적으로 관리됩니다.

### 이미지 관리 명령어
- `docker images`: 다운로드된 이미지 목록 확인.
- `docker pull <image_name>:<tag>`: 레지스트리에서 이미지 다운로드.
- `docker rmi <image_id>`: 이미지 삭제.
- `docker tag <source> <target>`: 이미지 태그 생성.
- `docker build`: Dockerfile을 기반으로 이미지 생성.
- `docker history`: 이미지의 히스토리(레이어) 확인.

---

## 2. Dockerfile
Dockerfile은 도커 이미지를 생성하기 위한 설정 파일입니다. DSL(Domain Specific Language) 언어를 사용하며, 지시어(Instruction)와 인자(Argument)로 구성됩니다.

### 주요 지시어
| 지시어 | 설명 |
| --- | --- |
| `FROM` | 베이스 이미지 지정. (반드시 첫 줄에 위치) |
| `LABEL` | 메타데이터(작성자, 버전 등) 기입. |
| `RUN` | 이미지를 빌드하는 과정에서 실행할 명령어. (패키지 설치 등) |
| `CMD` | 컨테이너가 시작될 때 실행할 기본 명령어. (오버라이딩 가능) |
| `ENTRYPOINT` | 컨테이너가 시작될 때 **반드시** 실행할 명령어. (오버라이딩 불가, 인자로 전달됨) |
| `COPY` | 호스트의 파일/디렉토리를 이미지로 복사. |
| `ADD` | COPY 기능 + URL 다운로드 및 압축 해제 기능. |
| `WORKDIR` | 작업 디렉토리 지정. (이후 명령어는 이 경로에서 실행됨) |
| `EXPOSE` | 컨테이너가 리스닝할 포트 지정. (문서화 목적이 강함) |
| `ENV` | 환경변수 설정. |
| `VOLUME` | 볼륨 마운트 포인트 생성. |

### 예시
```dockerfile
# 베이스 이미지
FROM node:14

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 파일 복사 및 설치
COPY package*.json ./
RUN npm install

# 소스 코드 복사
COPY . .

# 포트 노출
EXPOSE 8080

# 실행 명령어
CMD ["node", "server.js"]
```

---

## 3. Build Optimization (Best Practices)
- **가벼운 베이스 이미지 사용**: `alpine` 등 최소한의 OS 이미지를 사용.
- **레이어 수 최소화**: `RUN` 명령어를 `&&`로 연결하여 레이어 수를 줄임.
- **캐시 활용**: 변경이 적은 부분(의존성 설치 등)을 위쪽에, 변경이 잦은 부분(소스 코드)을 아래쪽에 배치.
- **.dockerignore 사용**: 불필요한 파일이 빌드 컨텍스트에 포함되지 않도록 설정.
- **Multi-stage Build**: 빌드 환경과 실행 환경을 분리하여 최종 이미지 크기 감소.

```dockerfile
# Build Stage
FROM maven:3.6 AS build
WORKDIR /app
COPY . .
RUN mvn package

# Run Stage
FROM openjdk:11-jre-slim
COPY --from=build /app/target/myapp.jar /app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
```
