---
slug: "CI-CD-소개"
---
- [CI/CD](#CI/CD)
	- [Traditional Development](#CI/CD#Traditional Development)
	- [Modern application development](#CI/CD#Modern application development)
- [CI/CD concept](#CI/CD concept)
	- [CI](#CI/CD concept#CI)
		- [CI 의 척도](#CI#CI 의 척도)
	- [CD](#CI/CD concept#CD)
		- [Deployment cs Delivery](#CD#Deployment cs Delivery)
			- [Deployment](#Deployment cs Delivery#Deployment)
			- [Delivery](#Deployment cs Delivery#Delivery)
			- [차이점](#Deployment cs Delivery#차이점)
- [CI/CD purpose](#CI/CD purpose)


# CI/CD
- 예전 모놀리식 방식에서 사용자가 늘어나면서 생기는 문제를 해결하기 위해 <mark>MSA 방식</mark>을 도입하였다.
- 해당 MSA방식을 도입하다보니 배포 프로세스도 옛날 방식을 따르면 안됐기 때문에, 새로운 개념과 함께 같이 등장한 것이다.

## Traditional Development
![Pasted-image-20221229095917.png](/img/이미지 창고/Pasted-image-20221229095917.png)
- 예전 방식은 각자의 개발자가 각자의 역할을 수행하고, 납기일에 다같이 만나서 같이 코드를 합쳤습니다.
- 위의 작업은 공수를 엄청나게 들이는 방법입니다.

## Modern application development
![Pasted-image-20221229100157.png](/img/이미지 창고/Pasted-image-20221229100157.png)
- 형상 관리가 되기 때문에, 각자의 코드를 모으는 곳에서 공수를 덜 할 수 있습니다.
- 그러다 보니 고객의 요구사항에 빠르게 대응하여, 매 순간 배포를 할 수 있습니다.
- 그렇다보니 생기는 문제가 해당 배포 프로세스 입니다.

# CI/CD concept
> CI(Continuous Integration) - 지속적 통합
> CD(Continous Delivery or Continuous Deployment) - 지속적 전달 / 배포

## CI
- 각자의 개발자들이 자주 Merge를 하는 행위
![Pasted-image-20221229101128.png](/img/이미지 창고/Pasted-image-20221229101128.png)
- CI가 맨 처음 나온 컨셉에서는 전체의 WorkFlow를 다루고 있었습니다.
- 그렇다보니 CI인데도 Deploy까지 다루다가, 추후에 CD의 개념이 나오면서 현재의 CI의 개념으로 바뀌게 된 것입니다.
### CI 의 척도
1. Repository에서 코드가 최신의 상태로 유지 되고 있는가
	1. 추가적인 필수 작업 없이 어플리케이션이 바로 최신 상태로 빌드를 할 수 있는지
2. 빌드의 자동화, 빠른 빌드 프로세스
3. 모든 사람이 baseline으로 매일매일 커밋, 모든 커밋은 빌드 할 수 있다.
4. 모든 버그 픽스는 테스트 케이스와 같이 이루어져야 한다.
5. 테스트는 운영 환경과 유사한 환경에서 이루어져야한다.


## CD
- 소프트웨어 기법이며, 소프트웨어 기능을 자동화하여 빠르게 배포하는 기법을 의미한다.

### Deployment cs Delivery
- D의 2가지 방법에 따라서 약간의 컨셉이 달라집니다.

#### Deployment
![Pasted-image-20221229102444.png](/img/이미지 창고/Pasted-image-20221229102444.png)
- 해당 개념은 완전 자동화된 Deploy(배포)를 담고 있습니다.

#### Delivery
![Pasted-image-20221229102547.png](/img/이미지 창고/Pasted-image-20221229102547.png)
- 해당 개념은 배포가 가능한 상태로 일단 둔 상태에서
- 개발자, 배포 담당자에 의해서 배포가 되는 것을 말합니다.

#### 차이점
- 완전 자동화 vs 결재 라인

![Pasted-image-20221229102749.png](/img/이미지 창고/Pasted-image-20221229102749.png)
- Deployment는 개발자의 측면에서, Delivery는 비즈니스 측면에서 생긴 개념이라고 할 수 있습니다.

# CI/CD purpose
- 고객의 니즈를 빠르게 해소하기 위한 배포 절차를 줄이는 방식
- 빠르게 배포하는 것을 목표로 삼는 것이다.

---

#CICD #DevOps 

---