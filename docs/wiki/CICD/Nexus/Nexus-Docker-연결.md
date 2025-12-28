---
slug: "Nexus-Docker-연결"
---
# Nexus 실행하기
- 현 사내 서버에서 Docker를 이용해서 Nexus를 설치하고, 실행해서 띄워보는 작업을 하려고 합니다.

## Nexus-data 디렉토리 만들기
- 원하는 경로에 nexus-data 디렉토리를 생성합니다
```bash
mkdir /nexus-data
```

## Nexus Container 생성
#### X86 Version
```bash
docker run --name nexus -d -p 5050:5050 -p 8081:8081 -v /nexus-data:/nexus-data -u root sonatype/nexus3
```
#### ARM Version
```bash
docker run --name nexus --platform linux/arm64 -d -p 5050:5050 -p 8081:8081 -v /nexus-data:/nexus-data -u root klo2k/nexus3
```
- 위 Container는 5000 포트포워딩, 8081 포트포워딩을 진행
- 호스트 운영체제의 /nexus-data와 docker 에서의 /nexus-data의 볼륨 공유를 진행합니다.

### Admin 계정 확인하기
- admin 계정으로 로그인을 해야지 Repository를 만들 수 있습니다.
- admin의 패스워드는 `/nexus-data/admin.password` 에서 확인 가능합니다.

```bash
cat /nexus-data/admin.password
```
- 초반에만 해당 파일이 보이며, 추후에 비밀번호 설정 후에는 보이지 않습니다.

## Docker Registry 생성
- 우선 Registry를 생성하기 위해서는 2가지의 서로 다른 설정의 repository를 알아야한다.
1. Docker Hub
	1. 우리가 흔히 생각하는 docker image 저장소
2. Docker Hosted
	1. 이는 Docker Hub에 접근하기 위한 







###### 참조
[사내 Docker Registry 만들기](https://velog.io/@king/private-docker-registry)

