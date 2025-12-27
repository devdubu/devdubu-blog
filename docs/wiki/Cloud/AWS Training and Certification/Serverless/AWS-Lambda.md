---
slug: "AWS-Lambda"
---
# Why AWS Lambda
## AWS EC2
![Pasted-image-20230904165357.png](/img/이미지 창고/Pasted-image-20230904165357.png)
- 클라우드의 가상 서버
- RAM과 CPU를 프로비저닝 해야 합니다.
- 인스턴스에 특별한 일이 생기지 않는 이상 지속적으로 실행해야 합니다.
- AutoScailing Group으로 자동으로 서버를 추가하며, 축소할 수 있습니다.

## AWS Lambda
![Pasted-image-20230904165553.png](/img/이미지 창고/Pasted-image-20230904165553.png)
- 람다는 가상의 함수 입니다.
- 관리할 서버 없이, 그냥 코드를 프로비저닝하고 함수를 실행합니다.
- 시간 제한이 있어서 실행 시간이 짧습니다.
	- 최대 15분의 실행 시간을 갖습니다.
- On demand로 사용 됩니다.
	- Lambdad를 사용하지 않으면, 비용이 청구 되지 않습니다.
- 스케일링이 자동화 됩니다.
	- 더 많은 Lambda함수가 동시에 처리될 경우 AWS가 자동적으로 더 많은 람다 함수를 프로비저닝 해줍니다.

# Lambda의 장점
- 가격 책정이 쉬워집니다.
	- Lambda가 수신하는 요청의 숫자에 따라 청구되며, 이는 호출 숫자 및 컴퓨팅 시간에 따릅니다.
	- Lambda가 실행된 시간 입니다.
	- freetire에서도 Lambda요청 백 만 개와 컴퓨팅 시간 40만 GB입니다.
- 다양한 AWS 서비스와 통합됩니다.
- 많은 프로그래밍 언어를 사용 가능합니다.
- CloudWatch 모니터링 통합도 쉬워집니다.
- 함수 당 최대 10GB의 램을 프로비저닝 할 수 있습니다.
	- 함수의 램을 증가시면, CPU와 네트워크 품질 또한 같이 향상 됩니다.

:::quote 지원 언어
- NodeJS (JavaScript)
- Python
- Java(Java 8)
- C# (.NET Core)
- Golang
- C# / Powershell
- Ruby
- Custom Runtime API(Community supported, example Rust)
- Lambda Container Iamge
- 컨테이너 이미지 자체가 Lambda의 Runtime API를 구현해야 하기에, Lambda에서 실행되는 다른 컨테이너 이미지와는 다릅니다.
- 컨테이너 이미지를 만드는 방법에 전제 조건이 필요합니다.
- 컨테이너 이미지에 Lambda API가 구현 되어있지 않다면, ECS혹은 Fargate에서만 사용해야합니다.

:::

## AWS Lambda Integrations Main ones
![Pasted-image-20230904172158.png](/img/이미지 창고/Pasted-image-20230904172158.png)
- 위와 같이 아주 많은 리소스와 Integration이 가능합니다.
- 해당 Lambda와 통합을 잘 보여주는 아래의 예시가 있습니다.
### Serverlesss Thumbnail creation
![Pasted-image-20230904172421.png](/img/이미지 창고/Pasted-image-20230904172421.png)
- 썸네일을 생성하기 위해서 S3에 이미지를 업로드 하는 이벤트가 생깁니다.
- S3이벤트 알림을 통해 Lambda 함수가 작동됩니다.
- 람다 함수에는 썸네일을 생성는 코드가 있습니다.
- 해당 썸네일은 다른 S3 버킷이나, 같은 버킷으로 Push 및 업로드가 됩니다.
- 혹은 DynamoDB에 업로드 될 수 있습니다.
	- 이미지의 메타 데이터가 삽입 됩니다.
- Lambda는 덕분에 기능이 자동화되고, S3의 이벤트에 따라 대응이 가능해집니다.

### Serverless CRON Job
- CRON이란 5분마다 혹은 매주 월요일 10시 등등에 작업을 생성하는 기능입니다.
- 만약에 해당 CRON Job을 EC2에 실행하게 된다면, job을 수행하지 않는 모든 시간이 인스턴스 낭비가 됩니다.
![Pasted-image-20230904173622.png](/img/이미지 창고/Pasted-image-20230904173622.png)
- 따라서 CloudWatch 이벤트 규칙 또는 EvnetBridge 규칙을 만들고, 1시간 마다 작동되게 설정해서 1시간 마다 람다 함수와 통합되면, 그런 방법으로 태스크를 수행할 수 있게 됩니다.

### AWS Lambda Pricing
[AWS Lambda Pricing](https://aws.amazon.com/ko/lambda/pricing/)
- 호출  당
	- 초반 1,000,000번 요청은 무료 입니다.
	- 그 이후에 대해서는 요청당 20센트가 과금 됩니다.
- 기간 당 요금(1ms)
	- 한달 간 첫 400,000GB-s 동안 무료 입니다.
		- 이때 GB-s는 함수가 1GB 램을 가질 때 실행시간이 400,000초를 의미합니다.
	- 이후에는 600,000GB-S 당 1달러가 과금 됩니다.

# Lambda Synchronous Invocation

:::note Sybchronus?
- CLI, SDK, API Gateway, Application Load Balancer
- 결과를 기다리고 있다면, 그 결과가 우리에게 돌아온다는 의미이다. 
- 우리가 결과를 기다리게 되는 직업 호출임을 의미한다.

:::

:::warning 우리에게 돌아온 모든 종류의 오류는 클라이언트 측에서 해결해야 합니다.
- 콘솔에서 호출한 람다 함수가 실패한 경우
- Retry 버튼을 눌러 재시도 해야 한다는 것 입니다.
- Lambda에 오류가 발생하면 클라이언트가 방법을 알아내야 하는 것 입니다.
- 재시도, 지수 백오프 전략 등을 활용할 수 있습니다.

:::

![Pasted-image-20230907101053.png](/img/이미지 창고/Pasted-image-20230907101053.png)

## User Invoked
| Logo | Resouce Name |
| -- | -- |
| ![200](Elastic-Load-Balancer.png \) |**Elastic Load Balancer**| 
|![200](AWS-API-Gateway.png \) | **API Gateway**|
| ![200](AWS-CloudFront.png \) |**CloudFront** |
|![200](AWS-S3.webp \)| **AWS S3**|

## Service Invoked
| Logo | Resrouce Name |
| -- | --|
| ![200](AWS-Cognito.png \) | **AWS Cognito** |
|![200](AWS-Step-Function.png \) | **AWS Step Function** | 
## Other Services
| Logo | Resouce Name|
| -- | -- | 
|![200](AWS-Lex.png \) | **AWS Lex** |
|![200](Amazon-Alexa.png \) | **Amazon Alexa** |
|![200](AWS-Kinesis.png \) | **AWS Kinesis**|

# Lambda Integration with ALB
- Lambda를 HTTP, HTTPS로 호출 할 수 있는 방법은 두가지 정도가 있습니다.
## Application Load Balancer
- Lambda 함수를 Target Group에 등록해야 합니다.
![Pasted-image-20230907111946.png](/img/이미지 창고/Pasted-image-20230907111946.png)
### ALB to Lambda : HTTP to JSON
![Pasted-image-20230907124201.png](/img/이미지 창고/Pasted-image-20230907124201.png)
- 문서 상단에는 ELB에 대한 정보가 있습니다.
	- 어느 ELB가 호출하는지 대상 그룹은 무엇 인지를 나타냅니다.
- 그럼 HTTPS 수단과 관련된 정보가 주어졌습니다.
	- GET 이고, 경로는 /lambda 입니다.
- 키 / 값이 쌍을 이룬다면 쿼리 문자열 매개변수를 얻습니다.
	- 각 쿼리 스트링이 JSON 문서에 나타날 것입니다.
	- 키 / 값이 짝을 이룬다면 Header를 얻게 될 것이고,
- POST와 PUT에 대한 바디의 값은 isBase64Encoded입니다.
### Lambda to ALB   : JSON to HTTP
- 이와 유사하게 람다 함수도 JSON문서로 된 뭔가를 보냅니다.
![Pasted-image-20230907145354.png](/img/이미지 창고/Pasted-image-20230907145354.png)
- 응답은 상태 코드와 설명을 포함하고 있어야 합니다.
- 키/값 쌍으로 된 응답 헤더도 포함해야 하고,
- 마지막으로 회신의 바디와 isBase64Encoded인지 여부 표시해주는 플래그도 필요합니다.

## ALB Multi-Header Values
![Pasted-image-20230907145719.png](/img/이미지 창고/Pasted-image-20230907145719.png)
- ALB는 multi header value를 지원합니다.
	- 우리가 쿼리 스트링을 쉽게 표기하기 위해, 같은 값을 지니는 다수의 헤어 혹은 쿼리 스트링을 입력할 경우의 이야기 입니다.
- 위의 예시를 보게 된다면, `name=foo`, `name=bar` 라는 것처럼 key 값이 동일합니다.
- 그렇다면, 설정을 활성화하여 두 Header와 Query String 매개변수를 Lambda함수로 된 배열로 변환해 줄 수 있습니다.
- 그 말은 우리의 ALB가 JSON의 `queryStringParameters` Lambda함수를 호출 할 시에 `name`이 보이게 되고, 값은 하나가 아닌  <mark>값의 배열</mark>이 됩니다.
- 두 값 모두 변환되어서 나타납니다.
- 이처럼 다중 Header값은 ALB의 설정으로 사용 가능합니다.

- `accept`, `host`, `user-agent` 등의 항목에 2개 이상의 값을 설정할 수 있습니다.
- 해당 Multi Header를 사용하기 위해서는 ALB와 Lambda에 적절한 설정이 필요합니다.
#### ALB + Lambda Policy
```json
{
	"Statement" : {
		"Effect" : "Allow",
		"Principal" : {
			"Service" : "elasticloadbalancing.amazonaws.com"
		},
		"Action" : "lambda:InvokeFunction",
		"Resouce" : "arn:aws:lambda:ap-northeat-2:[계정번호]:function:[함수이름]"
		
	}
}
```

# Lambda Asynchronous Invocations

:::tip Lambda 함수 뒤에 불러오는 서비스를 위한 기능입니다.
- Amazon S3
- SNS
- CloudWatch

:::

![Pasted-image-20231004104017.png](/img/이미지 창고/Pasted-image-20231004104017.png)

- S3 버킷에서 새로운 파일에 대한 S3 이벤트 알림이 있다고 가정하면,
- 해당 서비스가 Lambda 서비스 안으로 이동하고, 비동기 식이기에 아래와 같은 일들이 일어납니다.
	- 이벤트 내부의 이벤트 대기열에 위치하게 됩니다.
	- Lambda함수는 해당 이벤트 대기열을 읽게 됩니다.
	- Lambda함수는 이 이벤트들을 처리하려고 시도 할 겁니다.
		- 이런 식으로 <mark>3번</mark> 시도 하게 됩니다.
		- 맨 처음 한번
		- 두 번째 시도는 1분 뒤 바로
		- 세 번째는 두 번째 시도 2분 뒤 시도 합니다.
	- 이런 식으로 여러 번 재 시작을 하게 된다면, Lambda함수에 멱등성이 보장되기에 문제가 될 수 있습니다.
	- 해당 로그를 CloudWatch 로그 엔트리가 복제 되는 Lambda함수가 계속 재시도를 하기 때문에 그렇게 됩니다.
	- DLQ(dead-letter queue)를 재시도가 끝난 뒤에 정의 할 수 있습니다.
		- 만약 처리에 실패하고, 재시도로 인해서 성공이 절대 불가능할 경우
		- Lambda함수가 이벤트를 SQS 혹은 SNS로 보내서 나중에 처리하도록 하는 것입니다.
- 비동기식 호출과 역할은 이와 같습니다.

:::question Why Asynchronous?
- 일부 서비스에는 비동기식 호출만 사용이 된다.
- 과정의 속도를 높여야 하는 상황에서 결과를 기다릴 필요가 없다면, 1000개의 파일이 동시에 처리되도록 해서 모든 파일이 병렬로 처리 될 때까지 기다리면 됩니다.

:::

# Asynchronous Invocation Service
| Service Icon | Service Name | Event 시점 |
|--|--|--|
|![200](AWS-S3.webp \) | AWS S3 ||
|![200](AWS-SNS.png \)| AWS SNS||
|![200](AWS-EventBridge.png \)| AWS EventBridge||
|![200](AWS-CloudWatch.png \)|AWS CloudWatch||
|![200](AWS-CodeCommit.png\) | AWS CodeCommit|새로운 브랜치, 태그, 푸시가 있을 때|
|![200](AWS-CodePipeline.jpeg \)| AWS CodePipeline |다른 람다 함수를 호출하고, 람다 함수는 CodePipeline을 호출합니다.|
|![200](AWS-CloudFormation.png \)| AWS CloudFormation| |
|![200](AWS-Config.png\)|AWS Config| |
|![200](AWS-IoT.png \)|AWS IoT||
|![200](AWS-SES.png\)|AWS EMS|
|![200](AWS-IoT-Event.png \)|AWS IoTEvent|

# CloudWatch Event / EventBridge 통합
![Screenshot 2023-10-07 at 2.11.47 PM.png](Screenshot 2023-10-07 at 2.11.47 PM.png)

이는 2가지 방법이 있고,
- 첫번째는 서버리스 CRON이나 Rate 입니다.
	- EventBridge 규칙을 생성한 뒤, 한시간 마다 람다 함수가 작업을 수행하도록 트리거링을 하는 것입니다.
- 혹은 CodePipeline EventBridge 규칙을 생성할 수 있습니다.
	- CodePipeline의 상태가 바뀔 때마다 이를 감지해서, 상태 변화가 감지되면 함수가 작업을 수행하도록 호출하는 것입니다.

# S3 Events Notification
![Screenshot 2023-10-07 at 2.20.55 PM.png](Screenshot 2023-10-07 at 2.20.55 PM.png)
:::tip Lambda를 통해 S3 Event 알림을 통합하는 방법
- S3 Event 알림은 객체가 생성 또는 제거 복구나 복제가 일어날 때 알림을 해주는 기능으로, 접두어와 접미어로 필터링이 가능합니다.
- Amazon S3에 업로드된 모든 이미지 파일의 썸네일을 생성하는 등이 전형적인 사용 사례가 됩니다.
:::

- S3는 이를 세가지로 보낼 수 있습니다.
	- SNS
		- 다수의 SQS 대기열로 보내기 위해 팬아웃 패턴을 활용할 수 있습니다.
	- SQS
		- 바로 SQS로 보내서 Lambda함수가 직접 SQS 대기열을 읽게 할 수 있습니다.
	- Lambda
		- S3 Event 알림을 바로 Lambda함수를 호출 할 수 있습니다.
		- 해당 방식은 비동기방식 입니다.
		- 어떤 로직도 실행 가능하며, 만약 문제가 생긴다면 Dead-Letter 대기열인 SQS를 설정할 수 있습 니다.
:::warning S3 이벤트는 초단위로 끝나지만, 종종 1분 이상이 걸릴 수 도 있습니다.
- 만약 이벤트 알림을 하나라도 놓치고 싶지 않다면,버킷에 버저닝을 반드시 활성화 해야합니다.
- 그렇지 않으면, 하나의 오브젝트에 동시에 두 개의 작성이 일어나는 경우, 하나의 알림밖에 받지 못할 수 도 있습니다.

:::

## S3 Event Pattern
### Metadata Sync
![Screenshot 2023-10-07 at 2.29.23 PM.png](Screenshot 2023-10-07 at 2.29.23 PM.png)
- S3 버킷이 새 파일 이벤트를 Lambd에게 보내면,  해당 Lambda가 이 파일을 처리 한 후에
- DynamoDB 테이블이나 RDS 데이터베이스의 테이블로 보냅니다.

# Lambda Event Source Mapping
:::note Record가 소스에 Polling되어야한다.
- Kinesis Data Streams
- SQS 및 SQS FIFO 대기열
- DynamoDB 스트림
:::

- 즉, Lambda가 서비스에 레코드를 요청해야 그 레코드가 반환되는 것입니다.
- Lambda가 이 서비스들로부터 Polling을 해야한다는 의미 입니다.
	- 이런 경우는 Lambda가 동기적으로 호출 됩니다.
![Screenshot 2023-10-09 at 8.20.31 AM.png](Screenshot 2023-10-09 at 8.20.31 AM.png)
- Event Source Mapper에는 두가지가 있습니다.

## Streams & Lambda(Kinesis & DynamoDB)
:::tip Stream은 Event Source Mapping이 일어나 각 샤드에 대한 반복자를 생성합니다.
- Kinesis 혹은 DynamoDB 스트림 샤드에 대해 일어나며
- 샤드 레벨에서 아이템을 순차적으로 처리합니다.
- 따라서 읽기 시작 위치를 구성할 수 있게 됩니다.

:::

- 새로운 아이템만 읽기를 하거나 샤드 시작 위치 혹은 특정한 타임 스탬프부터 읽도록 구성이 가능합니다.
- Kinesis에서든 DynamoDB에서든 샤드에서 아이템이 처리될 때, 아이템은 스트림으로부터 제거되지 않으며,
- Kinesis와 DynamoDB의 다른 소비자들이 데이터를 읽을 수 있습니다.
- 아래는 사용 예시입니다.
	- 사용 예시로는 낮은 트래픽 또는 높은 트래픽이 있습니다.
		- 트래픽이 낮다면 -> 배치 윈도우를 사용해서 처리 전에 Record를 축적합니다.
		- 트래픽이 높다면 -> Lambda가 샤드 레벨에서 동시에 여러 배치를 처리하도록 설정할 수 있습니다.
![Screenshot 2023-10-09 at 8.42.26 AM.png](Screenshot 2023-10-09 at 8.42.26 AM.png)
### Error Handling
- 기본적으로 함수가 오류를 반환하면, 함수가 성공할 때까지, 혹은 배치 내의 아이템이 만료될 때까지 모든 배치가 다시 처리 됩니다.
	- 배치에 오류가 생기면 처리가 중단 될 수 있습니다.
- 순차적인 처리를 위해서 오류가 해결 될때까지는 오류의 영향을 받는 배치의 처리가 중단됩니다.

:::bug 오류를 관리하는 방법
- 이벤트 소스 매핑이 오래된 이벤트를 폐기하도록 구성할 수 있다.
- 재시도 횟수 제한이나 오류시 배치 분할을 하도록 할 수 있습니다.
- 이는 Lambda 시간 초과 문제가 생기는 경우에 사용됩니다.
- Lambda 함수가 배치 전체를 처리할 시간이 없다고 해도, 배치의 절반을 처리하기에는 충분하기 때문입니다.
- 오래된 이벤트를 폐기하는 경우에도 그 이벤트 전체가 목적지로 전달됩니다.

:::

# Lambda Event Source Mapping SQS & SQS FIFO
![Screenshot 2023-10-09 at 9.01.41 AM.png](Screenshot 2023-10-09 at 9.01.41 AM.png)
- SQS 대기열은 Lambda의 Evnet Source Mapping으로 폴링 됩니다.
- 배치가 반환 될 때마다 이벤트 배치를 통해 Lambda 함수가 동기적으로 호출 될 것입니다.
- SQS의 경우, Event Source Mapping이 긴 Polling을 이용해ㅔ SQS를 Polling합니다.
- 배치 크기는 1 ~ 10 메시지까지 지정이 가능합니다.
- AWS 권장 대기열 표시 시간 초과를 Lambda 함수 시간 초과의 6배로 설정하는 것이 좋습니다.
- DLQ를 사용하는 경우, 읽기와 처리가 문제가 생겨서 Dead-Letter 대기열로 보내는 경우, 이때는 DLQ를 Lambda가 아닌 SQS 대기열에 설정합니다.

:::question 왜 DLQ를 Lambda가 아닌 SQS로 설정해야 할까?
- Lambda용 DLQ는 비동기식 호출에만 작동하기 때문입니다.(현재는 동기식임)
- 실패하는 경우 Lambda 목적지 기능을 쓸 수도 있습니다.

:::

# Queues & Lambda

- FIFO 대기열, 즉 선입선출을 사용하는 경우에는 Lambda가 순차적 처리를 지원합니다.
- 대기열을 처리하기 위해서는 스케일링 될 Lambda 함수의 수는 활성 메시지 그룹의 숫자와 동일합니다.
	- Group ID 설정
- 표준 대기열을 사용하면 아이템이 순서대로 처리되지 않을 겁니다.
- 표준 대기열에서 Lambda는 대기열의 모든 메시지를 읽을 수 있도록 최대한 빠르게 스케일링 됩니다.
- 배치는 개별 아이템으로서 대기열로 반환 될 것이고, 원래 배치와 다른 그룹에서 처리될 수 있습니다.
- 가끔 이벤트 소스 매핑이 함수 오류가 일어나지 않았음에도 불구하고, 대기 열로부터 같은 아이템을 두 번 수신 할 수도 있는데, 그런 경우에 Lambda함수에서 아이템이 처리 되도록 해야 합니다.
- 마지막으로 Lambda에서 아이템이 처리되면, Lambda는 대기열에서 아이템을 삭제할 것이고, 이 아이템은 다시는 나타나지 않게 됩니다.
- 소스 대기열을 구성하여, 처리되지 않은 아이템들을 Dead-letter 대기열로 보낼 수 있습니다.

# Lambda Event Mapper Scaling

- Kinesis 데이터 스트림과 DynamoDB 데이터 스트림에서 각 스트림 샤드당 Lambda 호출은 한 번입니다.
- 병렬 처리를 사용한다면, 샤드 당 동시에 10개 배치까지 처리 할 수 있습니다.
## SQS 표준
- Lambda는 매우 빠르게 스케일링이 됩니다.
	- 스케일 업을 위해 추가하는 인스턴스가 분당 16개이므로, 빠른 축에 속합니다.
	- 초당 동시에 처리되는 배치량은 최대 1,000개 입니다.
## SQS FIFO
- Group ID가 같은 메시지는 무조건 순서대로 처리되고, Lambda함수는 활성 메시지 그룹의 수만큼 스케일 업 합니다.
	- 이들을 정의 하는 것이 바로 Group ID 입니다.
:::tip 문제 출제
- 이벤트  매퍼에 대해 상세히 묻는 문제가 출제 될 수 있습니다.












:::

---

#AWS #AWS_Serverless #AWS_Lambda #AWS_DEVLOPER 

---