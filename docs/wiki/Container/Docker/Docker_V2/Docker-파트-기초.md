---
slug: "Docker-파트-기초"
---
- [개요](#개요)
	- [컨테이너 기술 발전](#개요#컨테이너 기술 발전)
		- [Traditional Deployment](#컨테이너 기술 발전#Traditional Deployment)
			- [문제점](#Traditional Deployment#문제점)
		- [Virtualized Deployment](#컨테이너 기술 발전#Virtualized Deployment)
			- [Hypervisor](#Virtualized Deployment#Hypervisor)
			- [문제점](#Virtualized Deployment#문제점)
		- [Container Deployment](#컨테이너 기술 발전#Container Deployment)
		- [Kubernetes Deployment](#컨테이너 기술 발전#Kubernetes Deployment)
	- [컨테이너 기술의 발전](#개요#컨테이너 기술의 발전)


# 개요
## 컨테이너 기술 발전
![Pasted-image-20221230100905.png](/img/이미지 창고/Pasted-image-20221230100905.png)
- 컨테이너의 기술의 발전을 알기 위해서는 기업들이 <mark>어떻게 서비스를 효율적으로 운영</mark>할 것인가에 대한 고민을 해보면 됩니다.
	- 비용효율성
	- 어떻게 하면 컴퓨팅 자원을 잘 활용할까

### Traditional Deployment
- 하나의 서버에서 모든 App을 구동하는 방식

#### 문제점
- 하나의 서버에서 모든 서비스를 돌리게 된다면, 공유하는 라이브러리 때문에, 충돌을 일으킬 수 있다.
- 어플리케이션이 서로 버전이 맞지 않아서 생기는 이슈 등
>어떻게 하면, APP을 격리 할 수 있을까?

### Virtualized Deployment
- 가상머신을 이용한 가상화 방법
- OS 위에, Hypervisor라는 가상 머신을 관리하는 툴이 올라가게 된다.
- 그 위에는 이제 각각의 Virtual Machine이 올라가게 됩니다.

#### Hypervisor
- 해당 컴퓨팅 자원들을 애뮬레이팅 하여 Guest OS에 할당 해준다.
- 컴퓨팅 자원들을 각각의 Virtual Machine에 할당을 해준다.

#### 문제점
- 하드웨어를 애뮬레이션을 거쳐서 들어가기 때문에, 성능의 효율성이 떨어진다.
- Hypervisor를 띄우기위한 컴퓨팅 자원(RAM)에 대한 공수가 꽤 들기 때문에, 해당 자원의 오버헤드가 늘어납니다.

### Container Deployment
- 위의 성능 문제, 자원 문제, 격리 문제 등등을 모두 해결하기 위한 기술이 Container라는 기술입니다.
- Docker 라고 그림에 나와있지만, 실제로는 Docker Engine이며, hypervisor랑 비슷한 개념이라고 생각하면 됩니다.
- Docker = Contaier는 아닙니다.
	- Docker는 Container 기술 중 한개에 불과하지만, 업계애서 Container 기술의 표준이기 때문에 Docker를 Container라고 표기 한 것입니다.
	- Container Engine이 Docker Engine일 경우 Docker라고 부릅니다.
- 추가로 격리 기술이 들어갑니다.
	- chroot를 이용한 파일 격리
	- namespace를 이용한 Network, Process Id를 격리
- 여러가지 Docker를 격리하기 위한 툴인 것이다.
- 자원의 효율도 CPU를 애뮬레이션하는 것이 아니기 때문에 효율성이 매우 높습니다.

### Kubernetes Deployment
- Container orchestration system -> 여러 서버에서 클러스터 환경에서 어떻게 하면 Container를 잘 관리 할 수 있을까에 대한 목적으로 만들어졌습니다.

## 컨테이너 기술의 발전
![Pasted-image-20221230112035.png](/img/이미지 창고/Pasted-image-20221230112035.png)

---

#Container #Docker

---



