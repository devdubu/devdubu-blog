---
slug: "Lambda-DeepDive"
---
- [Lambda 함수 라이프 사이클](#Lambda 함수 라이프 사이클)
	- [Cold Start](#Lambda 함수 라이프 사이클#Cold Start)
- [동시성](#동시성)
	- [예약된 동시성(Reserved Concuurency)](#동시성#예약된 동시성(Reserved Concuurency))
	- [프로비저닝된 동시성(Provisioned Concurrency)](#동시성#프로비저닝된 동시성(Provisioned Concurrency))
	- [정규화된 ARN](#동시성#정규화된 ARN)
	- [정규화 되지 않은 ARN](#동시성#정규화 되지 않은 ARN)
- [런타임 관리 제어](#런타임 관리 제어)
		- [기본값](#정규화 되지 않은 ARN#기본값)
		- [함수 업데이트](#정규화 되지 않은 ARN#함수 업데이트)
		- [수동](#정규화 되지 않은 ARN#수동)
	- [런타임 롤백 방법](#런타임 관리 제어#런타임 롤백 방법)
	- [Lambda 함수 별칭](#런타임 관리 제어#Lambda 함수 별칭)
- [계층에 대한 .zip 파일 아카이브 컴파일](#계층에 대한 .zip 파일 아카이브 컴파일)
	- [계층 내 라이브러리 종속 항목 포함](#계층에 대한 .zip 파일 아카이브 컴파일#계층 내 라이브러리 종속 항목 포함)
- [배포 패키지](#배포 패키지)
- [Amazon EFS 파일 시스템 생성하기](#Amazon EFS 파일 시스템 생성하기)
- [Lambda함수와 EFS 연동하기](#Lambda함수와 EFS 연동하기)
- [사용 사례](#사용 사례)
	- [Function 오케스트레이션](#사용 사례#Function 오케스트레이션)
	- [브랜칭](#사용 사례#브랜칭)
	- [오류 처리](#사용 사례#오류 처리)
	- [휴먼 인 더 루프](#사용 사례#휴먼 인 더 루프)
	- [병렬 처리](#사용 사례#병렬 처리)
	- [동적 병렬 처리](#사용 사례#동적 병렬 처리)
- [Step Function 권한 설정하기](#Step Function 권한 설정하기)
	- [AWS Lambda](#Step Function 권한 설정하기#AWS Lambda)
	- [Amazon Simple Queue Service](#Step Function 권한 설정하기#Amazon Simple Queue Service)
	- [Amazon Simple Notification Service](#Step Function 권한 설정하기#Amazon Simple Notification Service)
- [아키텍쳐](#아키텍쳐)
	- [Lambda 생성](#아키텍쳐#Lambda 생성)
		- [Step Function](#Lambda 생성#Step Function)
	- [상태 머신 생성](#아키텍쳐#상태 머신 생성)
		- [SQS 대기열 생성](#상태 머신 생성#SQS 대기열 생성)
		- [상태 머신 규칙 생성](#상태 머신 생성#상태 머신 규칙 생성)
				- [샘플 코드 복제](#샘플 코드 복제)


# Lambda 함수의 스케일링과 동시성
- 람다를 오랫동안 사용하지 않고 오랜만에 실행하게 되면 어느정도 딜레이가 발생
- 람다 컨테이너를 띄우기 위해 서버가 켜지고 실행 환경을 구성하는데 시간이 소요된다.

## Lambda 함수 라이프 사이클
![Pasted-image-20230904101646.png](/img/이미지 창고/Pasted-image-20230904101646.png)
- 리소스를 효율적으로 사용하기 위해 오랫동안 사용하지 않고 있을 경우 잠시 컴퓨터 파워를 꺼 둠
- 오랜만에 다시 사용하려고 하면 컴퓨팅 파워를 켜서 실행 환경을 구성하기 위해 약간의 시간이 걸림
### Cold Start
:::warning Code Start?
- 처음 트리거 후 람다 컨테이너(EC2)가 구성됨(평균 0.8초 소요)
- 10분이 지나도 아무런 트리거가 없으면 해당 컨테이너를 다른 사용자에게 넘겨줌
- 10분 이내에 새로운 트리거가 발생 시 해당 컨테이너에서 실행됨

:::

:::success Code Start 해결 방법
- 람다를 지속적으로 호출
- 항상 컨테이너가 준비되어 있도록 람다를 지속적으로 호출
- 호출 될 때마다 비용이 산정되는 방식이기 때문에 비용이  더 듬
- 람다의 메모리를 늘려 스펙을 높임
- Cold Start의 시간을 결정 짓는 가장 중요한 요소는 람다 함수의 코드 사이즈이다.
- 메모리를 더 할당할 수록 컴퓨팅 스펙이 높아지기에 처리 속도가 빨라져서 딜레이가 준다.
- 프로비저닝된 동시성 활성화
- 2019년 Cold Start 문제를 해결하기 위해 나온 옵션
- 함수의 호출에 응답할 수 있게 미리 준비하는 옵션
- 활성화 하면 미리 함수의 환경을 구성해두기에 딜레이가 들지만 추가 비용 발생

:::

## 동시성
:::note 동시성
- 동시성이란 **특정 시각**에 **함수가 제공하는 요청**의 수
- 함수가 호출되면 Lambda는 **함수의 인스턴스를 할당**하여 **이벤트를 처리**하고 실행을 마치면 다른 요청을 처리
- 만약 요청을 처리하는 와중에 함수가 호출 되면 다른 인스턴스가 할당되어 함수의 동시성 증가
:::

### 예약된 동시성(Reserved Concuurency)
- 함수에 대한 최대 동시 인스턴스를 보장
- **한 함수가 동시성을 예약**하면 **다른 함수**는 해당 **동시성을 사용 불가**
- 예약된 동시성을 구성하는 데는 요금이 부과되지 않습니다.
![Pasted-image-20230906093120.png](/img/이미지 창고/Pasted-image-20230906093120.png)
- UnReserved Concurrency에서 100을 뺀 값에서면 Reserve를 할 수 있습니다.
- 예약된 동시성을 0으로 설정하게 된다면, 제한을 제거할 때까지 어떠한 이벤트도 처리되지 않습니다.
- 제한 오류는 해당 풀에 모든 함수가 사용 중일 때 발생하는 오류 입니다.
- 함수의 동시성 풀은 다른 함수가 사용 중인 풀에 영향을 미칠 수 있습니다.

### 프로비저닝된 동시성(Provisioned Concurrency)
- 함수의 호출에  즉시 응답할 준비가 되도록 요청된 수의 실행 환경을 초기화 함
- 프로비저닝된 동시성을 구성하면 AWS 계정에 요금이 부과
![Pasted-image-20230906093925.png](/img/이미지 창고/Pasted-image-20230906093925.png)
- 언제든 AWS 리전당 기본 동시성 한도는 분당 1,000회 호출
- 리전당 기본 버스트 동시성 할당량은 500 ~ 3,000이며, 이는 리전마다 다릅니다.
- Lambda 함수에는 최대 동시성 한도가 없음
- 그러나 한도 증가는 사용 사례에 따라 증가가 필요한 경우에만 허용한다.
- 스로틀을 방치하려면 증가가 필요한 시점보다 최소 2주 전에 한도 증가를 요청합니다.

# 버전 관리와 Alias
:::tip 버전?
- 함수를 게시할 때마다 Lambdad는 함수의 **새 버전**을 생성
- 새 버전은 함수의 게시 되지 않은 버전
- 함수 코드 및 모든 관련 종속성
- 함수에서 사용하는 Lambda 런타임 식별자와 런타임 버전
- 환경 변수를 포함한 모든 함수 설정
- 특정 버전의 함수를 식별하는 Amazon 리소스 이름(ARN)

:::

### 정규화된 ARN
`arn:aws:lambda:aws-region:acct-id:function:helloworld:42`
- 버전 접미사가 포함된 함수 ARN

### 정규화 되지 않은 ARN
`arn:aws:lambda:aws-region:acct-id:function:helloworld`
- 버전 접미사가 포함되지 않은 함수 ARN

## 런타임 관리 제어
:::bug 런타임  업데이트
- 흔하지 않지만, 런타임 업데이트가 기존의 서비스를 부정적 영향을 미칠 수 도 있다.
- 예를 들면 보안 패치가 될 수 있다.
- 따라서 Lambda의 **런타임 관리 제어**를 통해서 최대한 서비스의 **영향을 덜 주는 방향**으로 안내한다.
- 비 호환성 발생 시 워크 로드의 영향을 줄이는 데에 초점이 맞춰져 있다.

:::

#### 기본값
- 2단계 런타임 버전 롤 아웃을 사용하여 가장 최신의 런타임 버전으로 자동 업데이트
	- 첫 번째 단계에서 Lambda는 사용자가 함수를 생성하거나 업데이트할 때마다 새 런타임 버전을 사용
	- 두  번째 단계에서는 Lambda는 자동 런타임 업데이트 모드를 사용하고 아직 새 런타임 버전으로 업데이트 되지 않는 모든 함수를 업데이트

#### 함수 업데이트
- 함수를 업데이트 할 때 Lambda는 함수의 런타임 버전을 가장 최신의 런타임 버전으로 업데이트
- 이 방식은 런타임 업데이트를 함수 배포와 동기화 하여, Lambda가 런타임 업데이트를 하는 시점을 사용자가 제어할 수 있게 해주는 옵션 입니다.
- 해당 옵션을 선택하면 드물게 발생하는  

#### 수동
- 사용자가 함수 구성에서 런타임 버전을 지정
- 만약 최신 버전이 호환되지 않는다면, 해당 옵션을 통해서 롤백하여 사용해도 무관합니다.

### 런타임 롤백 방법

:::note 수동 런타임 업데이트 모드 사용
- **자동** 런타임 버전 업데이트 모드를 사용하거나 <mark>$LATEST</mark> 런타임 버전을 사용하는 경우
- **수동** 모드를 사용하여 런타임 버전을 롤백
- 롤백하려는 함수 버전에 대해 런타임 버전 업데이트 모드를 수동으로 변경 
- 이전 런타임 버전의 ARN을 지정

:::

:::note 게시된 함수 버전 사용
- 함수 업데이트 모드를 사용하여 게시된 함수 버전은 함수 코드, 구성 및 런타임 버전의 정적 스냅샷을 생성
- 함수 버전과 함께 업데이트 모드를 사용하면 런타임 업데이트를 배포와 동기

:::

### Lambda 함수 별칭
- Lambda 함수의 별칭을 하나 이상 생성 가능
- Lambda 별칭은 특정 함수 버전을 가리키는 포인터
- 사용자는 별칭 Amazon 리소스 이름(ARN)을 사용하여 함수 버전에 액세스
![Pasted-image-20230906132209.png](/img/이미지 창고/Pasted-image-20230906132209.png)
- 하단 탭에서 별칭을 선택 > 별칭 생성 페이지에 아래와 같이 구성한다.
![Pasted-image-20230906132248.png](/img/이미지 창고/Pasted-image-20230906132248.png)
![Pasted-image-20230906132307.png](/img/이미지 창고/Pasted-image-20230906132307.png)
- 함수 이름 뒤에 별칭이 추가

# Layer
:::note Layer?
- Lambda의 계층은 Lambda 함수와 함께 사용할 수 있는 **라이브러리** 및 **기타 종속성을 패키징**하는 편리한 방법을 제공합니다.
- 계층은 추가 코드 또는 데이터를 포함할 수 있는 `.zip` 파일 아카이브 입니다.
- 계층에는 **라이브러리**, **사용자 정의 런타임**, **데이터** 또는 **구성 파일**이 포함됩니다.

:::

- `.zip` 파일 아키이브로 배포된 Lambda Lambda수에서만 계층을 사용
- 컨테이너 이미지로 정의된 함수의 경우 컨테이너 이미지를 생성할 때 기본 런타임 및 코드 종속 항목을 패키

## 계층에 대한 .zip 파일 아카이브 컴파일
- 함수 배포 패키지에 사용되는 것과 동일한 절차를 사용하여 계층 코드를 `.zip` 파일 아카이브로 작성
- 계층에 네이티브 코드 라이브러리가 포함되어 있는 경우 바이너리가 Amazon Linux와 호환 되도록 Linux 개발 시스템을 사용하여, 이러한 라이브러리를 컴파일하고 빌드
- 계층을 만들 때 계칭이 명령 세트 아키텍처 중 하나 또는 둘 다와 호환되는지 여부를 지정
- ARM64 아키텍처와 호환되는 계층을 빌드하려면 특정 컴파일 플래그를 설정

### 계층 내 라이브러리 종속 항목 포함
- 각 Lambda 런타임에 대해 PATH 변수는 `/opt` 디렉터리의 특정 폴더를 포함
- Layer.zip 파일 아카이브에 동이리한 폴더 구졸르 정의하면 함수 코드가 경로를 지정하지 않고도 계정 콘텐츠에 액세스

## 배포 패키지
- `my-sourcecode-function` 프로젝트 디렉토리 생성
```bash
mkdir my-sourcecode-function
```
- 디렉토리 구조
```
my-sourcecode-function
| lambda_function.py
```
- 라이브러리를 **새 package** 디렉터리에 설치
```bash
pip install --target ./package <library>
```
- 루트에서 설치된 라이브러리를 포함하는 배포 패키지를 만듦
```bash
cd package
zip -r ./my-deployment-package.zip .
```
- zip 파일의 루트에 lambda_function.py 파일을 추가
```bash
cd ..
zip my-deployment-package.zip lambda_function.py
```

# EFS 파일 시스템을 생성하여 연동하기
![Pasted-image-20230906135138.png](/img/이미지 창고/Pasted-image-20230906135138.png)
- AWS EFS를 이용해서 데이터를 공유하고, 저장하는 등의 행위가 가능해집니다.

## Amazon EFS 파일 시스템 생성하기
- EFS 콘솔로 이동
- 파일 시스템 생성을 선택 후, 기본 VPC와 해당하는 서브 넷을 선택
![Pasted-image-20230906135309.png](/img/이미지 창고/Pasted-image-20230906135309.png)
- 액세스 포인트 메뉴에서 액세스 포인트 생성 버튼을 클릭
- 아래와 같이 세부 정보를 구성합니다.
![Pasted-image-20230906135342.png](/img/이미지 창고/Pasted-image-20230906135342.png)
- 아래와 같이 POSIX 사용자 구성
![Pasted-image-20230906135635.png](/img/이미지 창고/Pasted-image-20230906135635.png)
- 아래와 같이 루트 디렉터리 생성 권한 구성
![Pasted-image-20230906135744.png](/img/이미지 창고/Pasted-image-20230906135744.png)

## Lambda함수와 EFS 연동하기
![Pasted-image-20230906135843.png](/img/이미지 창고/Pasted-image-20230906135843.png)
- Lambda 콘솔로 이동
- Lambda 콘솔에서 새 MessageWall 함수를 생성하고 Python 3.8 런타임 선택
![Pasted-image-20230906135953.png](/img/이미지 창고/Pasted-image-20230906135953.png)
- 함수 생성 후에, IAM Role을 클릭합니다.
- IAM 권한 추가에서 정책 연결을 클릭하고 아래의 Policy를 추가합니다.
	- `AWSLambdaVPCAccessExecutionRole`
	- `AmazonElasticFileSystemClientReadWriteAccess`
![Pasted-image-20230906140122.png](/img/이미지 창고/Pasted-image-20230906140122.png)
- Lambda 콘솔의 VPC애서 기본 보안 그룹을 사용
- MessageWall 함수를 기본 VPC의 모든 서브넷에 연결하도록 VPC 구성 편집
```bash
git clone git@github.com:fastcampus-dev/FastCampus-Online-AWS-DevOps-2022.git
```
- `serverless/ch3_sampleapp/lambda_function.py` 코드를 붙여 넣고 저장
![Pasted-image-20230906141556.png](/img/이미지 창고/Pasted-image-20230906141556.png)
- <mark>트리거 추가</mark>를 구성하고 API Gateway를 선택 후 앞서 생성한 API Gateway를 선택하고 다음과 같이 구성합니다.
![Pasted-image-20230906141649.png](/img/이미지 창고/Pasted-image-20230906141649.png)
- API Gateway 트리거를 선택한 상태에서 API의 엔드포인트를 복사합니다.

```bash
curl https://<endpoint-url>/default/MessageWall
No message yet.

curl -X POST -H "Content-Type: text/plain" -d 'Hello from EFS!' https://<endpoint-url>/default/MessageWall
Hello from EFS!

curl -X POST -H "Content-Type: text/plain" -d 'Hello again :)' https://<endpoint-url>/default/MessageWall
Hello from EFS! Hello again :)

curl https://<endpoint-url>/default/MessageWall
Hello from EFS! Hello again :)

curl -X DELETE https://<endpoint-url>/default/MessageWall
Messages deleted.

curl https://<endpoint-url>/default/MessageWall
No message yet.
```


# AWS Lambda Step Function
![Pasted-image-20230925084415.png](/img/이미지 창고/Pasted-image-20230925084415.png)
:::question AWS Step Funciton?
- 개발자가 AWS 서비스를 사용하여 **분산 애플리케이션**을 구축하고, 
- **프로세스를 자동화**하며, 
- 마이크로 서비스를 **오케스트레이션**하고, 
- **데이터 및 기계 학습(ML)** **파이프라인**을 
- 생성할 수 있도록 지원하는 시각적 워크 플로우 서비스 입니다. 

:::

## 사용 사례
![Pasted-image-20230925085022.png](/img/이미지 창고/Pasted-image-20230925085022.png)
- 여러 개의 장기 실행 ETL작업이 자동으로 순서대로 실행되게 도와준다.
- 보안 인시던트 대응을 위해 자동화된 워크플로를 생성해서 보안과 IT 기능을 자동화 할 수 있습니다
- 여러 AWS Lambda 함수를 서버리스 애플리케이션 및 마이크로서비스로 결합하여 마이크로서비스 오케스트레이션을 할 수 있습니다.
- 대규모 데이터 세트를 반복하고 처리하며, 대규모 트랜젝션도 처리하게 되며, 병렬 워크플로 오케스트레이션을 하게 됩니다.


### Function 오케스트레이션
![Pasted-image-20230925090852.png](/img/이미지 창고/Pasted-image-20230925090852.png)
- 특정 순서로 Lambda 함수(단계) 그룹을 실행하는 워크플로를 생성
- Lambda 함수의 출력이 다음 Lambda 함수의 입력으로 전달
- 워크 플로의 마지막 단계에서 결과를 얻음

### 브랜칭
![Pasted-image-20230925091429.png](/img/이미지 창고/Pasted-image-20230925091429.png)
- Choice상태에서 사용하면 Step Function이 Choice 상태 입력에 따라 결정을 내림
- 조건문과 비슷한 상태라고 보면 된다.

### 오류 처리
![Pasted-image-20230925091541.png](/img/이미지 창고/Pasted-image-20230925091541.png)
- Retry 명령문 사용하여 Setp Function이 요청을 다시 시도 
- Catch Step Functions Functions가 워크 플로의 다른 단계로 이동하여 등록 프로세스를 다시 시도

### 휴먼 인 더 루프
![Pasted-image-20230925092325.png](/img/이미지 창고/Pasted-image-20230925092325.png)
- Step Functions 워크플로우의 Function이 사용자의 요청을 입력 받아 다음 단계를 처리하도록 구성 가능
### 병렬 처리
![Pasted-image-20230925092847.png](/img/이미지 창고/Pasted-image-20230925092847.png)
- Step Functions 워크 플로우의 Functions Parallel 상태를 사용하여 동시에 처리

### 동적 병렬 처리
![Pasted-image-20230925093017.png](/img/이미지 창고/Pasted-image-20230925093017.png)
- Step Function Map 상태를 사용하여, Lambda가 각 항목을 Parallel 처리
- 병렬 처리 구간읨 ㅗ든 함수가 실행되면 Step Function의 워크 플로우의 다음 단계로 넘어감

## Step Function 권한 설정하기
:::note 아래 서비스에 대한 IAM 권한 정책 구성
- AWS Lambda
- Amazon Simple Queue Service
- Amazon Simple Notification Service

:::

### AWS Lambda
- function1 및 function2를 호출하는 2개의 AWS Lambda 작업 상태가 포함된 상태 머신의 경우 두 함수에 대해 lambda:Invoke 권한이 포함된 정책을 사용
```json
{
	"Version" : "2012-10-17",
	"Statement" : [{
		"Effect" : "Allow",
		"Action" : ["lambda:InvokeFunction"],
		"Resource":[
			"arn:aws:lambda:[region](region):[acountId](acountId):function:[function1](function1)",
			"arn:aws:lambda:[region](region):[acountId](acountId):function:[function2](function2)",
		]
	}]
}
```

### Amazon Simple Queue Service
```json
{
	"Version" : "2012-10-17",
	"Statement" : [{
		"Effect" : "Allow",
		"Action" : ["sqs:SendMessage"],
		"Resouce" : [
			"arn:aws:sqs[region](region):[accountId](accountId):[queuName](queuName)"
		]
	}]
}
```

### Amazon Simple Notification Service
```json
{
	"Version" : "2012-10-17",
	"Statement" : [{
		"Effect" : "Allow",
		"Action" : ["sns:Publish"],
		"Resouce" : [
			"arn:aws:sns[region](region):[accountId](accountId):[topicName](topicName)"
		]
	}]
}
```

# 실습
## 아키텍쳐
![Pasted-image-20230925103030.png](/img/이미지 창고/Pasted-image-20230925103030.png)

### Lambda 생성
![Pasted-image-20230925103121.png](/img/이미지 창고/Pasted-image-20230925103121.png)
![Pasted-image-20230925103130.png](/img/이미지 창고/Pasted-image-20230925103130.png)
#### Step Function
- 상단 검색창에서 Step Functions를 입력 후, 콘솔로 이동
- 상태 머신 생성 클릭하고 시각적 워크플로 설계 클릭
- 표준 선택
![Pasted-image-20230925103621.png](/img/이미지 창고/Pasted-image-20230925103621.png)
### 상태 머신 생성
- 아래 작업에서 **Lambda: Invoke** 를 드래그하여 첫번째 상태를 여기에 놓기를 선택
- 상태 이름에 First Function 입력
- API 파라미터에서 입력 선택 후, FirstFunction 입력 선택 후, FirstFunction 선택
- 같은 방법으로 Lambda: Invoke를 추가하고 SecondFunction을 선택
- 다음 버튼을 클릭하여 상태 시스템 설정 지정
![Pasted-image-20230925104542.png](/img/이미지 창고/Pasted-image-20230925104542.png)
- 기본 설정을 그대로 두고 상태 머신 생성 버튼 클릭
![Pasted-image-20230925105759.png](/img/이미지 창고/Pasted-image-20230925105759.png)
- 생성된 상태 머신 ARN을 복사

#### SQS 대기열 생성
- 왼쪽 상단 검색차에서 Amazon SQS 입력하고, Amazon SQS 콘솔로 이동
- 대기열 생성 클릭 후, 이름에 StepFunction_SQS 입력하고 대기열 생성 버튼 클릭
![Pasted-image-20230925105915.png](/img/이미지 창고/Pasted-image-20230925105915.png)

#### 상태 머신 규칙 생성
- 생성된 상태 머신에서 작업 선택하고 EventBridge(CloudWatch Events) 규칙 생성 클릭
- 규칙 세부 정보를 아래와 같이 구성하고 다음 버튼 클릭
![Pasted-image-20230925110208.png](/img/이미지 창고/Pasted-image-20230925110208.png)
- EventPattern은 다음과 같이 구성합니다.
![Pasted-image-20230925110251.png](/img/이미지 창고/Pasted-image-20230925110251.png)
- 대상 선택에서 아래와 같이 **구성 후 검토 및 생성 단계로 건너뛰기** 버튼 클릭
![Pasted-image-20230925111017.png](/img/이미지 창고/Pasted-image-20230925111017.png)
- 검토 및 생성에서 구성한 내용 확인 후, **규칙 생성** 버튼 클릭
- Lambda 콘솔로 돌아와서 MyFunc1 함수를 선택합니다.'
###### 샘플 코드 복제
```shell
git clone git@github.com:fastcampus-dev/FastCampus-Online-AWS-DevOps-2022.git
```

- 함수 코드 편집기에 `serverless/ch3_sampleapp/call_step_functions.py`코드를 복사하여 붙여 넣고 저장
- 10번째 라인의 <mark>state_machine_arn</mark>의 값을 복사해 둔 상태 머신 ARN을 입력
- Deploy 버튼을 클릭하여 변경 내용을 배포

:::success 성공
- HTTP API 게이트웨이 엔드포인트를 호출하여 정상 동작 확인

:::

:::failure 실패
- SecondFunction 람다 함수를 수정하여 Step Function workflow를 실패하게 구성
- StepFunction_SQS에 실패 메시지가 발생하는 것을 확인
















































:::

---

#AWS #AWS_Lambda #AWS_Serverless 

---








