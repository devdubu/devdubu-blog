---
slug: "AWS-Lambda-SAM"
---
- [사용 사례](#사용 사례)
- [주요 개념](#주요 개념)
	- [함수](#주요 개념#함수)
	- [트리거](#주요 개념#트리거)
	- [이벤트](#주요 개념#이벤트)
	- [실행환경](#주요 개념#실행환경)
	- [명령 세트 아키텍쳐](#주요 개념#명령 세트 아키텍쳐)
		- [arm64](#명령 세트 아키텍쳐#arm64)
		- [x86_64](#명령 세트 아키텍쳐#x86_64)
	- [베포 패키지](#주요 개념#베포 패키지)
	- [런타임](#주요 개념#런타임)
	- [Layer](#주요 개념#Layer)
	- [AWS SAM 템플릿 사양](#주요 개념#AWS SAM 템플릿 사양)
	- [AWS SAM CLI](#주요 개념#AWS SAM CLI)
- [AWS SAM 사양](#AWS SAM 사양)
	- [AWSTemplateFormatVersion](#AWS SAM 사양#AWSTemplateFormatVersion)
	- [Description](#AWS SAM 사양#Description)
	- [Metadata](#AWS SAM 사양#Metadata)
	- [Parameters](#AWS SAM 사양#Parameters)
	- [Mapping](#AWS SAM 사양#Mapping)
	- [Conditions](#AWS SAM 사양#Conditions)
	- [Resource](#AWS SAM 사양#Resource)
	- [Output](#AWS SAM 사양#Output)
- [SAM CLI](#SAM CLI)
	- [`sam init`](#SAM CLI#`sam init`)
	- [`sam local invoke / sam local start-api`](#SAM CLI#`sam local invoke / sam local start-api`)
	- [`sam logs`](#SAM CLI#`sam logs`)
	- [`sam package`](#SAM CLI#`sam package`)
	- [`sam deploy`](#SAM CLI#`sam deploy`)


# AWS Lambda
![Pasted-image-20230811083347.png](/img/이미지 창고/Pasted-image-20230811083347.png)
:::tip AWS Lambda?
- 서버를 프로비저닝 또는 관리하지 않고도 모든 유형의 애플리케이션 또는 백엔드 서비스에 대한 코드를 실행할 수 있는 이벤트 중심의 서버리스 컴퓨팅 서비스

:::

![Pasted-image-20230811083548.png](/img/이미지 창고/Pasted-image-20230811083548.png)
## 사용 사례
![Pasted-image-20230811083700.png](/img/이미지 창고/Pasted-image-20230811083700.png)

## 주요 개념
### 함수
- 코드를 실행하기 위해 호출할 수 있는 리소스

### 트리거
- Lambda 함수를 호출하는 리소스 또는 구성
- 함수 및 이벤트 소스 매핑을 호출하도록 구성할 수 있는 AWS 서비스가 포함

### 이벤트
- 처리할 Lambda 함수에 대한 데이터가 포함된 JSON 형식 문서
- 예) 날씨 데이터
``` json
{
	"TemperatureK": 281,
	"WindKmh": -3,
	"HumidityPct": 0.55,
	"PressureHPa": 1020
}
```

### 실행환경
- 실행환경은 Lambda 함수를 위한 안전하고 격리된 런타임 환경을 제공
- 함수를 실행하는 데 필요한 프로세스와 리소스를 관리

### 명령 세트 아키텍쳐
- 명령 세트 아키텍처에 따라 Lambda가 함수를 실행하는 데 사용하는 컴퓨터 프로세서의 유형이 결정
#### arm64 
- AWS Graviton2 프로세서에 사용되는 644비트 ARM 아키텍쳐
#### x86_64 
- x86 기반 프로세서에 사용되는 64비트 x86 아키텍

### 베포 패키지
- 함수 코드 및 종속 항목이 포함된 `.zip` 파일 아카이브
- Open Container Initiative(OCI) 사양과 호환되는 컨테이너 이미지

### 런타임
- 실행 환경에서 실행되는 언어별 환경을 제공
- 컨테이너 이미지의 경우 이미지를 빌드할 때 런타임을 포함

### Layer
- Lambda 계층은 추가 코드 또는 기타 콘텐트를 포함할 수 있는 `.zip` 파일 아카이브 계층에는 라이브러리, 사용자 정의 런타임, 데이터 또는 구성 파일이 포함된다.

# AWS SAM(Serverless Application Model)

![Pasted-image-20230811084541.png](/img/이미지 창고/Pasted-image-20230811084541.png)
:::tip SAM?
- 서버리스 애플리케이션을 빌드하는 데 사용할 수 있는 오픈 소스 AWS 프레임 워크

:::

### AWS SAM 템플릿 사양
- 함수, API, 권한, 구성 및 이벤트를 설명하는 간단하고 깔끔한 구문을 제공한다.

### AWS SAM CLI
- AWS SAM 템플릿으로 정의된 서버리스 애플리케이션을 구축

## AWS SAM 사양
```yaml
AWSTemplateFormatVersion: "version date"

	Description:
		String
		
	Metadata:
		template metadata
	
	Parameters:
		set of parameters
	
	Rules:
		set of rules
	
	Mappings:
		set of mappings
		
	Conditions:
		set of conditions
		
	Transform:
		set of transforms
		
	Resources:
		set of resources
		
	Outputs:
		set of outputs
```

### AWSTemplateFormatVersion
- AWS 템플릿을 작성한 날짜를 작성하면 된다.

### Description
- Optional
- 해당 사양표의 설명 란을 적어 놓는 것입니다.

### Metadata
- 템플릿에 대한 추가 정보를 제공하는 객체 입니다.

### Parameters
- 스택을 생성하거나 업데이트 할 때, 실행 시간에 템플릿에 전달하는 값을 의미한다.
- 템플릿에 `Resource`나 `Output`에서 해당 `Parameter`를 활용할 수 있습니다.

### Mapping
- 조건부 Parameter를 지정할 수 있는 키와 관련된 Mapping으로 조회 테이블과 비슷한 역할을 합니다.

### Conditions
- optional
- 스택을 생성하거나 업데이트 할 때, 특정 리소스 속성이 할당 되는지, 또는 특정 리소스가 생성되는지 여부를 제한하는 조건 입니다.
	- 예를 들면, 특정 스택이 개발 용인지 혹은 운영 용 인지에 따라서 조건을 다르게 할 수 있다.

### Resource
- AWS EC2, S3 등등 AWS Resource 들을 참조 할 수 있습니다.

### Output
- output은 해당 스택을 실행했을 때 반환 되는 값들을 출력해주는 옵션입니다.

## SAM CLI

### `sam init`
- 선택한 언어로 사전 구성된 AWS SAM 템플릿과 예제 애플리케이션 코드를 생성

### `sam local invoke / sam local start-api`
- 애플리케이션 코드를 로컬에서 테스트 한 다음에 배포

### `sam logs`
- 이 명령을 사용하여 Lambda 함수가 생성하는 로그를 가져옴
- 응용 프로그램을 AWS 클라우드에 배포한 후 응용 프로그램을 테스트하고 디버깅하는 데 도움이 될 수 있다

### `sam package`
- 애플리케이션 코드와 종속성을 배포 패키지로 묶음

### `sam deploy`
- 서버리스 애플리케이션을 AWS 클라우드에 배포
- AWS 리소스를 만들고 AWS SAM 템플릿에 정의된 권한 및 기타 구성을 설정

---

#AWS #AWS_Lambda #AWS_SAM

---