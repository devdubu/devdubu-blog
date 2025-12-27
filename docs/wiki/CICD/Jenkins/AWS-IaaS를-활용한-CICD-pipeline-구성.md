---
slug: "AWS-IaaS를-활용한-CICD-pipeline-구성"
---
# Jenkins 개요
- 오픈소스인 자동화 서버를 의미한다.
- 빌드. 테스트, 배포 등을 자동화 시켜줍니다.

## Jenkins의 특징
1. 오픈소스인 자동화 서버 -> reference, document
2. 다양한 플러그인 제공
	1. Pipeline
	2. Authentication. / Authorization
	3. Git
	4. Docker
3. 다양하게 확장

## 실습
```yaml
version: '3.9'
services:
	jenkins:
		image: jenkins/jenkins:latest
		container_name: jenkins
		environment:
			- "TZ=Asia/Seoul"
		ports:
			- "8080:8080"
		volumes:
			- "./data:/var/jenkins_home"
```
`docker-compose.yaml`

## Jenkins pipeline
- jenkins 플러그인 제품입니다.
![Pasted-image-20221229134130.png](/img/이미지 창고/Pasted-image-20221229134130.png)
- 위의 단계를 일련의 과정을 통틀어서 Pipeline이라고 합니다.
- 해당 Jenkins 파일은 두가지 형태로 작성이 가능합니다

### Scriptedpipeline
- groovy script를 주입시킬 수 있음
- Java의 API reference
![Pasted-image-20221229135339.png](/img/이미지 창고/Pasted-image-20221229135339.png)

### Declarative pipeline
- Jenkins DSL을 따릅니다.
![Pasted-image-20221229135349.png](/img/이미지 창고/Pasted-image-20221229135349.png)
`해당 강의는 선언적 형태에 포커싱을 맞출 예정입니다.`

### Jenkins pipeline(Syntex)

#### Section
##### agent
- pipeline or stage가 실행될 노드 지정
	- none
	- any
	- label
	- node
	- docker
	- dockerfile
	- kubernetes
![Pasted-image-20221229161036.png](/img/이미지 창고/Pasted-image-20221229161036.png)

- 아래는 해당 pipeline의 조건을 명시한다.
	1. service or batch 둘 중에 하나가 맞으면 실행
	2. service and batch 둘다 맞으면 실행
	3. service면 실행
	4. batch라면 실행
![Pasted-image-20221229161741.png](/img/이미지 창고/Pasted-image-20221229161741.png)
![Pasted-image-20221229161656.png](/img/이미지 창고/Pasted-image-20221229161656.png)

##### stages & steps

- Stages: 순차적인 작업의 명세인 stage 들의 묶음
- Steps: stage안에서의 실행되는 단계
![Pasted-image-20221229162001.png](/img/이미지 창고/Pasted-image-20221229162001.png)

##### post
- 위치에 따라 Stages들의 작업이 끝난 후 추가적인 steps혹은 stage에 steps들의 작업이 끝난 후 추가적인 step 혹은 stage에 stops들의 작업이 끝난 후 추가적인 step
- Condition
	- always
	- changed
	- fixed
	- regression
	- aborted
	- failure
	- success
	- unstable
	- unsuccessful
	- cleanup

![Pasted-image-20221229162101.png](/img/이미지 창고/Pasted-image-20221229162101.png)

#### Directive
##### parameters
- pipeline을 trigger할 때 입력 받아야할 변수를 정의
- Type
	- string
	- text
	- boolan

##### environments
- key = value
- pipeline 내부에서 사용할 환경변수
- credentials() 를 통해 jenkins credential에 접근 가능


##### when
- stage를 실행 할 조건 설정
![Pasted-image-20221229162101.png](/img/이미지 창고/Pasted-image-20221229162101.png)

## Jenkins의 작업 명세
![Pasted-image-20221229163902.png](/img/이미지 창고/Pasted-image-20221229163902.png)

## 실습
### 실습 예제 코드 주소
[실습 코드 주소](https://github.com/dev-chulbuji/devops_06_03_jenkins)

### Jenkins Architecture
![Pasted-image-20221229165306.png](/img/이미지 창고/Pasted-image-20221229165306.png)

### Network Infra
![Pasted-image-20221229165531.png](/img/이미지 창고/Pasted-image-20221229165531.png)

### Bastion
![Pasted-image-20221229165552.png](/img/이미지 창고/Pasted-image-20221229165552.png)

# Jenkins 설치하기




----

#CICD #AWS 

---