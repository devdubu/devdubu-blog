---
slug: "Serverless-실습"
---
- [서버리스 아키텍처 구현](#서버리스 아키텍처 구현)
	- [실습](#서버리스 아키텍처 구현#실습)
		- [AWS Lambda 생성하기기](#실습#AWS Lambda 생성하기기)
		- [Lambda 함수 모니터링하기](#실습#Lambda 함수 모니터링하기)
- [실습 아키텍쳐](#실습 아키텍쳐)
- [실습](#실습)
	- [API Gateway 생성하기](#실습#API Gateway 생성하기)
		- [경로 생성하기](#API Gateway 생성하기#경로 생성하기)
		- [helloworld API 테스트](#API Gateway 생성하기#helloworld API 테스트)
- [API Gateway REST API 생성하기](#API Gateway REST API 생성하기)
	- [Canary 배포 시작](#API Gateway REST API 생성하기#Canary 배포 시작)
- [CORS의 동작 방법](#CORS의 동작 방법)
	- [단순 요청 방법](#CORS의 동작 방법#단순 요청 방법)
		- [1. 조건](#단순 요청 방법#1. 조건)
		- [2. 조건](#단순 요청 방법#2. 조건)
		- [3. 조건](#단순 요청 방법#3. 조건)
	- [Preflight request](#CORS의 동작 방법#Preflight request)
- [API Gateway CORS 활성화](#API Gateway CORS 활성화)
	- [Lambda 권한 부여자의 인증 워크플로우](#API Gateway CORS 활성화#Lambda 권한 부여자의 인증 워크플로우)
- [JWT](#JWT)
- [JWT 토큰 발급 Secret Key 생성](#JWT 토큰 발급 Secret Key 생성)
- [Lambda Authorizer 함수 생성](#Lambda Authorizer 함수 생성)
		- [샘플 코드 복제](#Lambda 권한 부여자의 인증 워크플로우#샘플 코드 복제)
		- [APIGateway](#Lambda 권한 부여자의 인증 워크플로우#APIGateway)


# Lambda Function 구현 및 모니터링
## 서버리스 아키텍처 구현
![Pasted-image-20230811105350.png](/img/이미지 창고/Pasted-image-20230811105350.png)

### 실습
#### AWS Lambda 생성하기기 
![Pasted-image-20230811105455.png](/img/이미지 창고/Pasted-image-20230811105455.png)
- 위와 같이 셋팅을 해줍니다.
![Pasted-image-20230811105519.png](/img/이미지 창고/Pasted-image-20230811105519.png)
- 함수를 생성하게 된다면 위와 같은 화면이 뜨게 됩니다.
- 함수 myFunc1이 생성되면, 아래와 같은 python 코드로 구성됩니다.
```py
import json

def lambda_handler(event, context):
	# TODO implement
	return{
		'statusCode' : 200,
		'body': json.dumps('Hello from Lambda!')
	}
```
- 위의 Test버튼을 클릭합니다.
- 아래와 같이 구성후 저장 버튼을 누릅니다.
	- 이벤트 작업 테스트 : 새 이벤트 생성
	- 이벤트 이름 : TestEvent
	- 이벤트 공유 설정 : 프라이빗
	- 템플릿 - 선택사항
		- hello-world

![Pasted-image-20230811105925.png](/img/이미지 창고/Pasted-image-20230811105925.png)
- Test 버튼을 클릭하여 함수 실행 하고 결과를 확인
![Pasted-image-20230811124326.png](/img/이미지 창고/Pasted-image-20230811124326.png)
#### Lambda 함수 모니터링하기
- 모니터링 탭을 클릭하고 View CloudWatch Logs 클릭합니다.
![Pasted-image-20230811124501.png](/img/이미지 창고/Pasted-image-20230811124501.png)
- 새 탭에서 CloudWatch 화면이 뜨면 해당 함수명을 확인하고 로그 스트림을 클릭합니다.
![Pasted-image-20230811124544.png](/img/이미지 창고/Pasted-image-20230811124544.png)
- 로그 이벤트 확인
![Pasted-image-20230811124633.png](/img/이미지 창고/Pasted-image-20230811124633.png)

# API Gateway

## 실습 아키텍쳐
![Pasted-image-20230811125020.png](/img/이미지 창고/Pasted-image-20230811125020.png)

## 실습
### API Gateway 생성하기
- API Gateway를 검색 후에 접속 합니다.
- 아래와 같이 API Gateway를 구성합니다.
![Pasted-image-20230811125717.png](/img/이미지 창고/Pasted-image-20230811125717.png)
- 이후 경로 구성과 스테이지 정의는 기본값으로 하고, 다음을 누릅니다.
![Pasted-image-20230811125746.png](/img/이미지 창고/Pasted-image-20230811125746.png)
- 컴토 및 생성 화면에서 구성 내용 확인 후 생성 버튼을 클릭합니다.

#### 경로 생성하기
- 왼쪽 메뉴에서 경로를 클릭하고 Create 버튼을 클릭합니다.
![Pasted-image-20230811125828.png](/img/이미지 창고/Pasted-image-20230811125828.png)
- 경로 생성에서 메서드는 GET, 경로에 `/helloworld` 를 입력합니다.
![Pasted-image-20230811125926.png](/img/이미지 창고/Pasted-image-20230811125926.png)
- `/helloworld` 경로를 선택하고 통합 항목에서 통합 연결 버튼을 클릭합니다.
![Pasted-image-20230811130024.png](/img/이미지 창고/Pasted-image-20230811130024.png)
- 다음과 같이 구성 후 생성 버튼을 클릭합니다.
![Pasted-image-20230811130052.png](/img/이미지 창고/Pasted-image-20230811130052.png)
- 이 통합을 경로에 연결 : GET `/helloworld`
- 통합 유형 : Lambda 함수
- 통합 대상
	- AWS 리전 : ap-northeast-2
	- Lambda 함수 : 생성한 함수 ARN 선택
- 왼쪽 메뉴에서 생성한 `ServerlessTes API Gateway`를 클릭합니다.
- Serverless Test에 대한 스테이지 항목에서 `$default` 스테이지 URL을 복사
![Pasted-image-20230811130321.png](/img/이미지 창고/Pasted-image-20230811130321.png)
#### helloworld API 테스트
[API 테스트 모](https://insomnia.rest/)
![Pasted-image-20230811130734.png](/img/이미지 창고/Pasted-image-20230811130734.png)

# API Gateway에서 API Canary 배포하기

:::note Carnary 릴리스란?
- API의 **새 버전을 테스트 목적**으로 배포하고 같은 단계에서의 정상 작동을 위해 **기본 버전은 프로덕션 릴리스**에 배포하는 소프트웨어 개발 전략
:::

- Canary 릴리스 배포에서 전체 API 트래픽은 **사전 구성된 비율**로 **프로덕션 릴리스**와 **Carnary 릴리스**로 임의로 분할
- 일반적인 Canary 릴리스에는 API 트래픽 중 **작은 백분율**이 주어지며, 프로덕션 릴리스가 나머지를 차지
- 업데이트 된 API 기능은 Carnary를 통하는 API 트래픽에만 보임
- 테스트 범위를 또는 성능을 최적화하기 위해 **Canary 트래픽 백분율**을 **조정**할 수 있습니다.
- 테스트 지표가 요구 사항을 통과한 후에는 Canary 릴리스를 프로덕션 릴리스로 승격하고, 배포에서 Canary를 비활성화 합니다.

## API Gateway REST API 생성하기
- API Gateway 대시보드로 이동
- API 메뉴 클릭 후, `API 유형 선택` > `REST API 구축` 버튼 클릭
![Screenshot-2023-08-15-at-8.52.27-PM.png](/img/이미지 창고/Screenshot-2023-08-15-at-8.52.27-PM.png)
- 위와 같이 구성한다.
> 프로토콜 선택 : REST
> 새 API 생성 : 예제 API
> 설정 > 엔드포인트 유형 : 지역
> 필수 : 경고 실패

- 배포가 완료되면 아래와 같은 화면을 볼 수 있습니다.
![Screenshot-2023-08-15-at-8.54.58-PM.png](/img/이미지 창고/Screenshot-2023-08-15-at-8.54.58-PM.png)
- 배포 스테이지에서 `새 스테이지` 선택 후, 스테이지 이름을 `PROD` 입력
![Screenshot-2023-08-15-at-8.56.02-PM.png](/img/이미지 창고/Screenshot-2023-08-15-at-8.56.02-PM.png)
### Canary 배포 시작
- 상단 탭에 Canary 클릭 후, Carnay 생성 버튼 클릭
- 단계의 요청 배포에서 Canary로 지정된 요청 백분율을 50%로 수정
![Screenshot-2023-08-15-at-8.57.31-PM.png](/img/이미지 창고/Screenshot-2023-08-15-at-8.57.31-PM.png)
- **리소스 > 작업** 에서 **리소스 생성**을 클릭
![Screenshot-2023-08-15-at-8.58.22-PM.png](/img/이미지 창고/Screenshot-2023-08-15-at-8.58.22-PM.png)

- 리소스 이름에 V2 입력 후 **리소스 생성** 버튼 클릭
![Screenshot-2023-08-15-at-8.58.48-PM.png](/img/이미지 창고/Screenshot-2023-08-15-at-8.58.48-PM.png)
- 위에서 리소스 생성을 클릭 후, **다시** 작업에서 **리소스 생성**을 클릭 합니다.
- 아래와 같이 구성 한 후에 리소스 생성 버튼을 클릭합니다.
![Screenshot-2023-08-15-at-9.00.41-PM.png](/img/이미지 창고/Screenshot-2023-08-15-at-9.00.41-PM.png)
- 생성된 리소스를 클릭하고 **작업 > 메서드 생성** 클릭
![Screenshot-2023-08-15-at-9.01.14-PM.png](/img/이미지 창고/Screenshot-2023-08-15-at-9.01.14-PM.png)
- 메서드 타입을 **GET** 선택 후, **체크** 버튼 클릭
![Screenshot-2023-08-15-at-9.01.51-PM.png](/img/이미지 창고/Screenshot-2023-08-15-at-9.01.51-PM.png)
- 아래와 같이 구성하고 **엔드포인트 URL** 에 아래 URL을 입력하고 저장 버튼 클릭
> `https://petstore.swagger.io/v2/pet/findByStatus?status=available`

![Screenshot-2023-08-15-at-9.03.18-PM.png](/img/이미지 창고/Screenshot-2023-08-15-at-9.03.18-PM.png)
- 해당 리소스를 선택한 상태에서 **작업 > API 배포**를 클릭
![Screenshot-2023-08-15-at-9.04.08-PM.png](/img/이미지 창고/Screenshot-2023-08-15-at-9.04.08-PM.png)
- 배포 스테이지를 PROD(Canary 사용)을 선택하고 배포 버튼 클릭
![Screenshot-2023-08-15-at-9.04.51-PM.png](/img/이미지 창고/Screenshot-2023-08-15-at-9.04.51-PM.png)
- 해당 URL에 접속하여 배포 확인
> `<api-gateway-url>/PROD/v2/pets`
![Screenshot-2023-08-15-at-9.06.06-PM.png](/img/이미지 창고/Screenshot-2023-08-15-at-9.06.06-PM.png)
- API 정상 동작을 확인 한 후, 스테이지를 선택하고 **Canary 탭**으로 이동하여 **Canary 승격** 버튼 클릭
![Screenshot-2023-08-15-at-9.07.18-PM.png](/img/이미지 창고/Screenshot-2023-08-15-at-9.07.18-PM.png)

# API Gateway CORS란?
:::note Origin(출처)
- URL 구조에서 Protocol, Host, Port를 합친 것
- 브라우저 개발자 도구의 콘솔 창에 location.origin를 실행하면 출처를 확인

:::

:::question Same-Origin Policy(동일 출처 정책)
- 브라우저가 동일 출처 정책(Same-Origin Policy, SOP)를 지켜서 다른 출처의 리소스 접근을 금지하기 때문
- 동일 출처 정책을 지키면 리소스를 가져오지 못해 불편하다.
- 하지만, 동일 출처 정책은 XSS나 XSRF 등의 보안 취약점을 노린 공격을 방어
- 외부 리소스를 사용하기 위한 SOP의 예외 조항이 CORS

:::

## CORS의 동작 방법
- 단순 요청과 예비 요청을 보내는 두가지 방법이 존재 한다.

### 단순 요청 방법
- 서버에 바로 요청을 보내는 방법이다.
- 서버는 `Access-Control-Allow-Origin` 요청을 보냅니다.
- 브라우저는 서버로 부터 받은 `Access-Control-Allow-Origin` 해당 요청의 Origin Header를 확인해서 동작할지 확인 합니다.
#### 1. 조건

| 조건 | 상세 설명 |
| -- | --|
|GET||
|Head| [Accept](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept)<br /> [Accept-Language](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language)<br /> [Content-Language](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Language)<br /> [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) <br /> [DPR](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/DPR) <br /> [DownLink](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Downlink)<br /> [Save-Data](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Save-Data)<br /> [ViewPort](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Viewport-Width)<br /> [Width](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Width)<br />|
|POST| |
|Content-Type Header| `application/x-www-form-urlencoded` <br /> `multipart/form-data` <br /> `text/plain` |

#### 2. 조건
|조건|상세 설명|
|--|--|
|Authorization Header| 사용자 인증 쪽에 많이 사용되는 요소이기에,<br /> 지켜지기 어려운 조건이다. |

#### 3. 조건
| 조건 | 상세 설명 |
| -- | -- |
|Content-Type| application/json을 많은 어플리케이션에서 사용한다.<br /> 그렇다보니 성사되기 어려운 조건이다. |

![Screenshot-2023-08-15-at-9.16.30-PM.png](/img/이미지 창고/Screenshot-2023-08-15-at-9.16.30-PM.png)

### Preflight request
:::tip Preflight request?
- 서버에 예비 요청을 보내서 안전한지 판단한 후 본 요청을 보내는 방법

:::

![Screenshot-2023-08-15-at-9.37.05-PM.png](/img/이미지 창고/Screenshot-2023-08-15-at-9.37.05-PM.png)
- `GET`, `POST`, `DELETE`, `PUT` 요청을 보낼 때, 크롬 개발자 도구에 **Network 탭**에서 **Options Methods**로 요청이 보내는 것은 보았다면,
- 이미 Preflight request를 경험한 것이다.
- 해당 요청은 OPTIONS Methods를 통해서 미리 예비 요청을 보냅니다.
	- 서버는 해당 요청을 바탕으로 `Access-Control-Allow-Origin` 을 **브라우저** 보내서 판단을 합니다.
	- 브라우저는 `Access-Control-Allow-Origin` Header를 확인해서 CORS 동작을 할 지 확인합니다.

## API Gateway CORS 활성화
- API Gateway 대시보드로 이동한 후에, **작업 > CORS 활성화**를 클릭합니다.
![Screenshot-2023-08-15-at-9.42.35-PM.png](/img/이미지 창고/Screenshot-2023-08-15-at-9.42.35-PM.png)
- 기본 설정을 그대로 두고, **CORS 활성화 및 기존의 CORS 헤더 대체** 를 클릭합니다.
![Screenshot-2023-08-15-at-9.43.25-PM.png](/img/이미지 창고/Screenshot-2023-08-15-at-9.43.25-PM.png)
- 메서드 변경 사항 확인 팝업이 뜨면 **예, 기존 값을 대체하겠습니다** 버튼 클릭합니다.
![Screenshot-2023-08-15-at-9.44.05-PM.png](/img/이미지 창고/Screenshot-2023-08-15-at-9.44.05-PM.png)
- API를 호출하고 응답에서 CORS 헤더를 확인하여 구성 테스트
```bash
curl -v -X OPTIONS https://{restapi_id}.execute-api.{region}.amazonaws.com/{stage_name}
```
- 결과
```
< HTTP/1.1 200 OK  
< Date: Tue, 19 May 2020 00:55:22 GMT  
< Content-Type: application/json  
< Content-Length: 0  
< Connection: keep-alive  
< x-amzn-RequestId: a1b2c3d4-5678-90ab-cdef-abc123  
< Access-Control-Allow-Origin: *  
< Access-Control-Allow-Headers: Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token < x-amz-apigw-id: Abcd=  
< Access-Control-Allow-Methods: DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT
```

# Lambda 권한 부여자 사용
![Pasted-image-20230904084920.png](/img/이미지 창고/Pasted-image-20230904084920.png)
:::quote 내용
- 클라이언트에서 샘플 코드를 통해 토큰을 발급받는 코드를 작성한다.
- 앞서 생성한 HTTP API 게이트웨이에 권한 부여자로 Lambda Authorizer를 구성하고 토큰을 인증한다.
- 엑세스 권한에 따라 API를 호출하도록 구성하여 Deny, Access를 테스트 해본다.

:::

:::note Lambda 함수를 사용하여 API 메서드에 대한 액세스를 제어하는 API Gateway 기능
- 토큰 기반 Lambda 권한 부여자
- 보유자 토큰(JSON Web Tocken(JWT) 또는 OAuth 토큰)에 잇는 호출자의 자격 증명
- 요청 파라미터 기반 Lambda 권한 부여자
- Header, 쿼리 문자열 파라미터, stageVariables 및 $context 변수의 조합으로 호출자의 자격 증명을 수신 

:::

### Lambda 권한 부여자의 인증 워크플로우
![Pasted-image-20230904090557.png](/img/이미지 창고/Pasted-image-20230904090557.png)
- Client가 API Gateway의 Method를 호출합니다.
- 보유자의 Tocken이나, 요 Parameter를 전송합니다. 
- API Gateway Method에 대해 Lambda 권한 **부여자** 부여 되어 있는지 확인합니다.
	- 구성이 되어있다면, Lambda 함수를 호출합니다.
- Lambda함수는 아래와 같은 방법으로 인증을 진행합니다.
	- OAuth공급자를 호출해서, AccessTocken을 받습니다.
	- SAM, 혹은 요청 파라미터를, DB에서 자격 증명을 받아올 수 있습니다.
	- 호출을 성공하면, Lambda함수는 1개 이상의 IAM 정책과 보안 주체 식별자를 포함하는 출력객체를 반환하여 액세스를 부여합니다.
	- 마지막으로 API Gateway가 정책을 평가합니다.

## JWT
:::question JWT란?
- Json Web Tocken으로, 인증에 필요한 정보들을 토큰에 담아 암호화 시켜 사용하는 방식
- 서명된 토큰이라는 점에서 쿠키보다 더 보안적입니다.

:::

:::info JWT 구조
- JWT는 Header, Payload, Signature의 구성 요소로 이루어지며, 각 구성 요소가 마침표로 구분 된다.
- **Header** : 보통 토큰의 타입이나, 서명 생성에 사용되는 알고리즘을 저장
- **Payload** : 토큰에 담을 정보를 key-value 형태로 저장
- **Signature** : 서명이 저장되는데 암호화되어 있기 때문에, 서버에 있는 개인 키로만 복호화 가능

:::

- Application이 실행될 때, JWT를 Static 변수와 LocalStorage에 저장합니다.
	- Static 변수에 저장하는 이유는, HTTP 통신을 할 때마다, 매번 API 통신을 할 수 없다.
	- LocalStorage에 담게 되면 해당 HTTP 통신마다 요청하게 되서 overhead가 발생한다.
- Client가 JWT를 요구할 때는 백엔드가 허가된 JWT인지 검사합니다. 
- 로그아웃 시에는 LocalStorage 저장된 JWT 데이터를 제거하며, 실제 서비스할 때는 해당 JWT를 블랙 리스트에 넣어서 해당 토큰을 막는 작업을 합니다.

## JWT 토큰 발급 Secret Key 생성
```bash
openssl rand 256 | base64
```
- 아래의 텍스트를 복사합니다.
![Pasted-image-20230904093605.png](/img/이미지 창고/Pasted-image-20230904093605.png)
- [JWT](https://jwt.io/)에 접속하여 아래와 같이 구성하고 Encoded에 출력된 값을 복사합니다.
![Pasted-image-20230904093654.png](/img/이미지 창고/Pasted-image-20230904093654.png)
## Lambda Authorizer 함수 생성
![Pasted-image-20230904093736.png](/img/이미지 창고/Pasted-image-20230904093736.png)
- 함수 이름 : LambdaAuthorizer
- 런타임 : Python 3.9
- 아키텍쳐 : x86_64
#### 샘플 코드 복제
```bash
git clone git@github.com:fastcampus-dev/FastCampus-Online-AWS-DevOps-2022.git
```
- 터미널에서 `serverless/ch2_sampleapp/lambda_authorzier` 폴더로 이동
- 6번째 라인의 `your_secret_key`를 복사한 `secret`으로 변경
- 아래 명령어를 사용하며 `lambda_fuction.py` 파일을 `.zip` 파일에 추가
```bash
zip my-deployment-package.zip lambda_function.py
```
- 아래의 명령어를 사용하여 Lambda함수 배포
```bash
cd ..
aws lambda update-function-code --function-name lambdaAuthorizer --zip0-file fileb://my-deployment-package.zip
```
![Pasted-image-20230904094523.png](/img/이미지 창고/Pasted-image-20230904094523.png)
- 이름 : LambdaAuthorizer
- 유형 : Lambda
- Lambda 함수 : lambdaAuthorizer 선택
- Lambda Event Payload : Tocken
- Tocken 원본 : Authorization

- Lambda 함수에 권한 추가 팝업이 뜨면 권한 부여 후 생성 버튼 클
![Pasted-image-20230904094843.png](/img/이미지 창고/Pasted-image-20230904094843.png)
- 리소스 메뉴에 `/pets`에서 GET 메서드를 클릭하고 메서
![Pasted-image-20230904094956.png](/img/이미지 창고/Pasted-image-20230904094956.png)
- 승인에서 lambdaAuthorizer를 선택하고 체크 버튼을 클릭
![Pasted-image-20230904095031.png](/img/이미지 창고/Pasted-image-20230904095031.png)
- 작업에서 API 배포 클
![Pasted-image-20230904100949.png](/img/이미지 창고/Pasted-image-20230904100949.png)
- `serverless/ch2_sampleapp/client` 폴더로 이동
- `client_test.py` 6,7번째 라인을 아래와 수정
	- `AUTHORIZER_ARN` : lambdaAuthorizer의 ARN
	- `ENDPOINT` : ``&lt;api-gateway-url>/PROD/v2/pets`
- 아래 명령어를 실행하여 정상적으로 ENDPOINT API가 호출 되는 것을 확인
```bash
python client_test.py
```

#### APIGateway
- APIGateway에서 **권한 부여자** 클릭
- **새로운 권한 부여자 생성 버튼** 클릭
![Pasted-image-20230904094444.png](/img/이미지 창고/Pasted-image-20230904094444.png)






















---

#AWS #AWS_Lambda #AWS_API_Gateway #AWS_Serverless 

---