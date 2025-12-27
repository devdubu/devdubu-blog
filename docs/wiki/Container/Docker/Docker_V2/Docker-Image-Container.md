---
slug: "Docker-Image-Container"
---

- [Docker 구성요소](#Docker 구성요소)
	- [Image](#Docker 구성요소#Image)
	- [Container](#Docker 구성요소#Container)
- [Docker Image & Container](#Docker Image & Container)
	- [Docker Image 이름 구성](#Docker Image & Container#Docker Image 이름 구성)
- [Docker Image Repository](#Docker Image Repository)


# Docker 구성요소
![Pasted-image-20221230125642.png](/img/이미지 창고/Pasted-image-20221230125642.png)
>이미지와 컨테이너는 도커에서 사용하는 가장 기본적인 단위
> 이미지와 컨테이너는 1:N 관계

## Image
- 이미지니는 컨테이너를 생성할 때 필요한 요소로 컨테이너의 목적에 맞는 바이너리와 의존성이 설치되어있다.

## Container
- 호스트와 다른 컨테이너로부터 격리된 시스템 자원과 네트워크를 사용하는 프로세스 이미지는 <mark>읽기 전용</mark>으로 사용하여 변경사항은 <mark>컨테이너 계증에 저장</mark>
	- 컨테이너에서 무엇을 하든 이미지는 영향을 받지 않는다.

# Docker Image & Container
![Pasted-image-20221230130221.png](/img/이미지 창고/Pasted-image-20221230130221.png)

## Docker Image 이름 구성

|의미| 작성 방법|
|--|--|
|<span style={{color: 'green'}}>저장소 이름(Repository Name)/</span> <span style={{color: 'orange'}}>이미지 이름(Image Name)</span> | <span style={{color: 'green'}}>fastcampus</span>/<span style={{color: 'orange'}}>nginx</span> |
|<span style={{color: 'green'}}>저장소 이름(Repository Name)/</span> <span style={{color: 'orange'}}>이미지 이름(Image Name)</span>:이미지 태그(Image Tag)|<span style={{color: 'green'}}>fastcampus</span>/<span style={{color: 'orange'}}>nginx</span>:1.21|
|<span style={{color: 'orange'}}>이미지 이름(Image Name)</span>:이미지 태그(Image Tag)|<span style={{color: 'orange'}}>nginx</span>:latst|
|<span style={{color: 'orange'}}>이미지 이름(Image Name)</span>|<span style={{color: 'orange'}}>nginx</span>|
- docker image Pull/Push시에 저장소 이름은 생략하면 기본 저장소인 도커 허브로 인식
- docker image tag를 생략하면 최신 리비전을 가리키는 lastest로 인

# Docker Image Repository
- 이미지 저장소(Image Repository)
- 도커 이미지를 관리하고 공유하기 위한 서버 어플리케이션
![Pasted-image-20221230131533.png](/img/이미지 창고/Pasted-image-20221230131533.png)

---

#Container #Docker

---
