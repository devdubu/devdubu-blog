---
slug: "AWS-API-Gateway"
---
- [제공 API 유형](#제공 API 유형)
	- [HTTP API](#제공 API 유형#HTTP API)
	- [WebSocket API](#제공 API 유형#WebSocket API)
	- [REST API & REST API private](#제공 API 유형#REST API & REST API private)
- [특징](#특징)
- [API Gateway의 구성 요소들](#API Gateway의 구성 요소들)
	- [경로](#API Gateway의 구성 요소들#경로)
	- [스테이지](#API Gateway의 구성 요소들#스테이지)
- [Rate Limit 알고리즘](#Rate Limit 알고리즘)
	- [Rate Limit 알고리즘 종류](#Rate Limit 알고리즘#Rate Limit 알고리즘 종류)
		- [Leaky Bucket](#Rate Limit 알고리즘 종류#Leaky Bucket)
		- [Tocken Bucket](#Rate Limit 알고리즘 종류#Tocken Bucket)
			- [Tocken Bucket Algorithm Flow](#Tocken Bucket#Tocken Bucket Algorithm Flow)
		- [Fixed Window Counter](#Rate Limit 알고리즘 종류#Fixed Window Counter)


# API Gateway
![Pasted-image-20230811090241.png](/img/이미지 창고/Pasted-image-20230811090241.png)

:::note API Gateway?
- 요청을 적절한 서비스로 라우팅하고, 요청자에게 응답을 다시 보내는 기능을 담당

:::

- 서비스의 확장성과 고가용성을 보장한다.
- API와 데이터 간 보안을 유지하며, 회사 내외부에서 로드밸런싱을 포함한 트래픽 요청을 관리합니다.
- 중요 데이터 보호를 위해서 액세스 정책, 인증, 액세스 제어를 할 수 있습니다.
- 클라이언트의 모든 API를 가져와서 요청을 라우팅하고, 프로토콜 변환을 이용해서 올바른 MSA를 구현할 수 있게 도와줍니다.
- API Gateway를 사용하는 주된 이유 중에 하나는 여러 백엔드 서비스를 호출하고 해당 결과를 집계할 수 있기 때문입니다.
- 단일 크기 스타일에 API를 제공합니다.
![Pasted-image-20230811090622.png](/img/이미지 창고/Pasted-image-20230811090622.png)
- API Gateway는 개발자가 손쉽게 유지보수, 생성, 모니터링이 가능하게 해주는 서버리스 리소스입니다.
- API Gateway를 통해서 Rest API, WebSocket 등등을 모두 사용이 가능합니다.
	- Contaienr 식 Web과 워크로드 또한 모두 지원합니다.
- 해당 리소스는 최소 요금제한은 없고, 오로지 <mark>API 사용량에 따른 요금 부과</mark> 만 적용 됩니다.
- <mark>백엔드 HTTP 엔드포인트</mark>, AWS Lambda 함수 또는 기타 AWS 서비스를 노출하기 위한 <mark>RESTful API의 생성</mark>, <mark>배포 및 관리</mark>
	- AWS Lambda 함수 또는 기타 AWS 서비스를 노출하기 위한 <mark>WebSocket API의 생성</mark>, <mark>배포 및 관리</mark>
- 프론트 엔드 HTTP 및 WebSocket 엔드포인트를 통해 노출된 API메서드 호출

## 제공 API 유형
![Pasted-image-20230811091252.png](/img/이미지 창고/Pasted-image-20230811091252.png)
### HTTP API
- http api, 혹은 Rest api를 사용해서 RESTful API를 구축 할 수 있습니다.
- API 관리 기능이 필요하지 않는 서비스에 한해서는 HTTP API를 사용하는 것이 맞습니다.
- HTTP API는 서버리스 워크로드와 백엔드 API에 최적화 되어있으며, REST API에 비해서 70%이상의 비용 절감과 60%이상의 지연시간 단축을 제공합니다.
- 백엔드 HTTP 엔드포인트 또는 Lambda 함수와 통합된 라우팅 및 메서드의 모음
- 이 모음을 하나 이상의 스테이지로 배포
- 각 라우팅은 API Gateway에서 지원되는 고유의 HTTP 동사를 가진 API 메서드를 하나 이상 노출

### WebSocket API
- 양방향 실시간 통신의 같은 경우에는 해당 API 제공 서비스를 사용하면 됩니다.
- API 메서드를 프론트엔드 웹 소켓 연결을 통해서 호출 할 수 있다.
- 해당 엔드포인트로 지정된 사용자 도메인과도 연결 가능합니다.
- 백엔드 HTTP 엔드포인트, Lambda 함수 또는 기타 AWS 서비스와 통합되어있는 WebSocket 경로와 경로 키의 모음
- 이 모음을 하나 이상의 스테이지로 배포

### REST API & REST API private
- 사용 플랜과 API와 같은 단일 솔루션에서 API 프록시 기능과 API 관리 기능을 요구 해야하는 워크 로드의 경우에는 REST API를 사용 해야 합니다.
- 백엔드 HTTP 엔드포인트, Lambda 함수 또는 기타 AWS 서비스와 통합되어 있는 HTTP 리소스와 메서드의 모음
- 이 모음을 하나 이상의 스테이지로 배포
- 애플리케이션 로직에 따른 리소스 트리로 정리
- 각 API 리소스는 API Gateway에서 지원하는 전용 HTTP 동사가 있는 API 메서드를 하나 이상 표시


## 특징
- 상태 저장(WebSocket) 및 상태 비저장(HTTP 및 REST) API에 대한 지원
- 변경 사항을 안전하게 롤아웃하기 위한 Canary 릴리스 배포
- API 사용 및 API 변경에 대한 CloudTrail 로깅 및 모니터링
- 경보 설정 기능을 포함한 CloudWatch 액세스 로깅 및 실행 로깅
- AWS CloudFormation 템플릿을 사용하여 API 생성을 활성화 할 수 있는 기능
- 사용자 지정 도메인 이름 지원
- 일반적인 웹 익스플로잇으로부터 API를 보호하기 위해 AWS WAF와 통합
- 성능 지연 시간 파악 및 학습을 위해 AWS X-Ray와 통합

## API Gateway의 구성 요소들

### 경로
![Pasted-image-20230811093738.png](/img/이미지 창고/Pasted-image-20230811093738.png)
- 수신 메세지를 메세지의 내용에 따라서 따라서 AWS Lambda 함수와 같은 특정 리소스로 연결 시켜주는 것을 의미합니다.
- 정의 할 때, 라우팅 키와 통합 백엔드를 지정하고, 수신 메세지에서 라우팅 키가 일치하게 된다면, 백엔드가 호출되게 됩니다.
- 일치 하지 않는 라우팅 키의 경우에는 기본 라우팅을 설정하거나, response 메세지를 전달하는 proxy 설정도 가능합니다.

### 스테이지
![Pasted-image-20230811094051.png](/img/이미지 창고/Pasted-image-20230811094051.png)

# API Gateway Tocken bucket Algorithm
- 서비스를 하다보면, 모든 리소스의 가용성 즉, API gateway, 컨테이너 레벨, 하드웨어 레벨 등등 클라이언트의 과도한 사용량에 대해서 보호될 필요가 있습니다.
- 클라이언트 측에서 과도한 트래픽을 발생하는 것에 대한 부분은 클라이언트에서 노력이 필요합니다.
- 서비스를 보호하기 위해서는 Rate Limit 알고리즘을 통해서 서비스를 보호할 수 있습니다.

## Rate Limit 알고리즘
:::warning 왜 필요할까?
- 서비스의 가용성을 유지하기 위해 클라이언트의 과도한 사용에 대해 보호가 필요
- 서비스를 보호해주는 수단으로 Rate Limit 알고리즘을 적용
- 과도한 트래픽으로부터 서비스 보호
- Resource 사용애 대한 공정성과 합리성 유도
- 트래픽 비용이 서비스 예산을 넘는 것을 방지
- Rate에 대해 과금을 부과하는 Business Model로 활용

:::

### Rate Limit 알고리즘 종류
#### Leaky Bucket
- 네트워크로의 데이터 주입 속도의 상한을 정해 제어하고, 네트워크에서 트래픽 체증을 일정하게 유지
- 들어오는 트래픽이 많다면, 해당 트래픽은 버려진다고 생각하면 된다.
- 즉, Bucket의 Limit보다 많은 패킷이 발생 시에, 패킷 손실이 발생된다.
	- 대표적으로 우버, Nginx가 해당 알고리즘을 채택하고 있습니다.

#### Tocken Bucket
- 평균 유입 속도를 제한하고 처리 패킷 손실 없이 특정 수준의 버스트 요청 허용
- 일시적으로 많은 트래픽이 와도, tocken이 있다면 처리가 가능하면서, tocken 송신을 통해서 평균 처리 속도를 제어할 수 있습니다.
##### Tocken Bucket Algorithm Flow
![Pasted-image-20230811103133.png](/img/이미지 창고/Pasted-image-20230811103133.png)
1. tocken은 정해진 비율로 tocken bucket에 넣습니다.
2. bucket은 최대 n개의 tocken을 저장하며, bucket이 가득차면 새로 추가된 tocken은 삭제되거나 거부됩니다.
3. 요청이 들어오면 queue에 들어가며, 요청을 처리하기 전에 tocken bucket의 tocken을 획득해야 하며, tocken을 보유한 후에 요청이 처리되며, 처리된 후에는 tocken을 삭제합니다.
4. tocken bucket은 tocken이 배치되는 속도를 기반으로 access 속도를 제어합니다.
5. 전송 횟수를 누적할 수 있으며, 버킷이 가득차면 패킷 손실 없이 토큰이 손실 됩니다.
:::tip Amazon API Gateway, EC2, EBS, CPU credit에서 해당 알고리즘을 채택 중입니다.


:::

#### Fixed Window Counter
- 정해진 시간 단위로 window가 만들어지고 요청 건수가 기록되어 해당 window의 요청 건수가 정해진 건수보다 크면 해당 요청은 처리가 거부
- 경계의 시간 대에 트래픽이 몰리게 된다면, 2배의 부하를 갖게 된다.
- 구현은 쉽지만, 기간 경계에 대한 트래픽의 편향 문제가 발생하게 됩니다.
	- 이를 극복하기 위해서 window처리를 위한 알고리짐을 몇가지 더 가지고 있습니다.
	- 스트리밍 데이터 서비스에서 해당 알고리즘을 사용하고 있습니다.

:::warning 각자 맞는 도메인 별로 알고르짐을 채택해야 합니다.
- 유료 서비스가 트래픽 체증에 민감하지 않는다면, Tocken Bucket 알고르짐을 채택하고,
- 그 외에는 Sliding Window, Fixed Window를 선택하면 됩니다.

:::

:::note 해당 정보들은 공유 되어야합니다.
- Common 한 트래픽은 Rate Limit을 높게 잡고, Trial을 해보는 것이 좋습니다.
- 외부 개발자들에게 Rate Limit 값과, 만약 트래픽이 초과했을 때 나오는 reponse 값 같은 경우는 명확하게 알려줄 필요가 있습니다.


:::

---

#AWS #AWS_API_Gateway #AWS_Serverless

---



