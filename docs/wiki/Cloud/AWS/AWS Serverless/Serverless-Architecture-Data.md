---
slug: "Serverless-Architecture-Data"
---
# 데이터 아키텍처의 변화
![Pasted-image-20230925132311.png](/img/이미지 창고/Pasted-image-20230925132311.png)

- 각 서비스에 맞는 데이터 베이스를 선택 가능하지만, 많은 데이터를 지켜봐야한다는 것이 단점으로 작용하게 됩니다.

## SQL vs NoSQL
![Screenshot 2023-10-10 at 10.56.03 PM.png](Screenshot 2023-10-10 at 10.56.03 PM.png)
### SQL
- SQL을 사용하게 되면 RDBMS에서 데이터 저장, 삭제, 수정이 가능하게 됩니다.
	- SQL은 정의된 관계형 스키마에 따라 테이블에 데이터가 저장됩니다.
	- 관계를 통해 여러 테이블에 분산되게 됩니다.
	- 데이터의 중복을 피하기위해서 관계를 사용하게 됩니다
### NoSQL
- 관계형 데이터베이스의 정 반대이다.
- NoSQL은 record를 document라고 부릅니다.
- SQL은 구조가 같지 않으면, 해당 데이터를 저장 할 수 없지만, NoSQL은 그런 제약이 없다.

위처럼 다양한 데이터 베이스의 구조에 따라서, 다양한 Needs가 데이터 베이스 쪽에서 발생하게 됩니다.
- 초반에는 `Structured Data` 구조만을 사용했지만, <mark>다양한 데이터</mark>들을 저장해야하기에, Data Lake라는 통합형 데이터 저장소라는 개념이 생기게 됐습니다.
![Screenshot 2023-10-10 at 11.00.39 PM.png](Screenshot 2023-10-10 at 11.00.39 PM.png)

![Screenshot 2023-10-10 at 11.01.39 PM.png](Screenshot 2023-10-10 at 11.01.39 PM.png)

# DynamoDB
:::tip DynamoDB?
- 모든 규모에서 10ms 미만의 성능을 제공하는 빠르고 유연한 NoSQL DB 서비스

:::

![Screenshot 2023-10-10 at 11.03.29 PM.png](Screenshot 2023-10-10 at 11.03.29 PM.png)

## DynamoDB 구성 요소
| Key | Value |
| -- | -- |
|**테이블** | 테이블은 데이터의 집합|
|**항목** | 각 테이블에는 0개 이상의 항목이 있음 <br /> 항목은 모든 기타 항목 중에서 고유하게 식별할 수 있는 속성 들의 집합|
|**속성**|각 항목은 하나 이상의 속성으로 구성 <br /> 속성은 기본적인 테이터 요소로서 더 이상 나뉠 필요가 없는 것|

:::note 기본키
:::

**파티션 키**
> - 파티션 키로 알려진 하나의 속성으로 구성되는 단순 기본 키
> 	- 해시 함수 출력에 따라 항목을 저장할 파티션이 결정
> 	- 파티션 키로만 구성되어 있는 테이블에서는 어떤 두 개의 테이블 항목도 동일한 파티션 키 값을 가질 수 없음
>
>**파티션 키 및 정렬 키**
>- 복합 기본키로 지칭되는 이 형식의 키는 두 개의 속성으로 구성
>- 첫 번째 속성은 파티션 키이고, 두 번째 속성은 정렬 키
>	- DynamoDB는 내부 해시 함수에 대한 입력으로 파티션 키 값을 사용
>	- 파티션 키 값이 동일한 모든 항목은 정렬 키 값을 기준으로 정렬되어 함께 저장

:::quote 보조 인덱스
**글로벌 보조 인덱스**
- 파티션 키 및 정렬 키가 테이블과 다를 수 있는 인덱스
- 각 테이블에 20개 지정 가능(기본 할당량)
**로컬 보조 인덱스**
- 기본 테이블과 파티션 키는 동일하지만, 정렬 키가 다른 인덱스 
- 5개 정도로 지정

:::

## DynamoDB 특징
### 대규모 성능
- 키-값 및 문서 데이터 모델
- DynamoDB Accelerator를 사용하여 지연 시간을 마이크로초 수준으로 최소화
- 전역 테이블을 사용하여 전역 복제 자동화
	- 선택한 AWS 리전에서 데이터를 자동으로 복제하고, 워크로드를 수행하기 위해 용량을 자동으로 조정
- Kinesis Data Streams for DynamoDB로 고급 스트리밍 애플리케이션 개발
- 테이블의 항목 수준 변경 사항을 Kinesis 데이터 스트림으로 캡쳐

#### DynamoDB Accelerator
:::note DynamoDB Accelerator?
- 종합 관리형 인 메모리 캐시를 지원함으로써 규모와 상관 없이 테이블에 대한 빠른 읽기 성능을 제공하는 인 메모리 캐시
:::

![Screenshot 2023-10-10 at 11.23.09 PM.png](Screenshot 2023-10-10 at 11.23.09 PM.png)
- DAX를 사용하면 DynamoDB 테이블의 읽기 성능을 최대 10배까지 개선
- 초당 수백만건의 요청에서도 읽기에 필요한 시간을 ms -> µs로 줄였다.

### 서버리스
#### 읽기 / 쓰기 용량 모드
- 각 테이블에 대해 온디맨드와 프로비저닝의 용량 모드 제공
#### 온디맨드 모드
- 워크로드가 이전에 도달했던 트래픽 수준으로 증가하거나 감소하면서 즉시 워크로드를 수용
#### Auto Scaling
- 애플리케이션의 성능 사용량을 모니터링하여 이전에 설정한 용량을 기반으로 처리량과 스토리지를 자동으로 조정
#### 트리거를 사용한 변경 추적
- AWS Lambda와 통합되어 트리거를 제공

## 실습(DynamoDB 생성)
![Screenshot 2023-10-10 at 11.26.06 PM.png](Screenshot 2023-10-10 at 11.26.06 PM.png)
- DynamoDB 콘솔 이동 후, 테이블 생성 클릭
![Screenshot 2023-10-10 at 11.26.52 PM.png](Screenshot 2023-10-10 at 11.26.52 PM.png)
- 위의 SampleCode를 사용합니다.
- 데이터 업로드 후에 DynamoDB 콘솔로 이동합니다.
![Screenshot 2023-10-10 at 11.27.59 PM.png](Screenshot 2023-10-10 at 11.27.59 PM.png)
- 탐색 창에 `테이블` 선택
- 테이블 목록에 `ProductCatalog`를 선택합니다.
- `항목 탐색` 탭을 선택하여 테이블로 로드한 데이터를 확인합니다.

- 정상적으로 위의 `ProductCatalog`가 업로드 됐다면, `Forum`, `Thread`, `Reply` 라는 아래와 같은 테이블을 생성합니다.
![Screenshot 2023-10-10 at 11.29.02 PM.png](Screenshot 2023-10-10 at 11.29.02 PM.png)

### DynamoDB 인덱스 생성
- 탐색창에서 테이블을 선택합니다.
- 테이블 목록에서 Reply를 선택합니다.
- 작업을 선택하고 인덱스 생성 버튼을 클릭합니다.
- 아래 그럼처럼 구성 후 인덱스 생성 버튼을 클릭합니다.
![Screenshot 2023-10-10 at 11.32.08 PM.png](Screenshot 2023-10-10 at 11.32.08 PM.png)

- 탐색창에 테이블 선택
- 테이블 목록에서 `Reply` 선택
![Screenshot 2023-10-10 at 11.33.37 PM.png](Screenshot 2023-10-10 at 11.33.37 PM.png)
- 항목 스캔 또는 쿼리를 아래와 같이 구성하고 실행 버튼 클릭
![Screenshot 2023-10-10 at 11.35.09 PM.png](Screenshot 2023-10-10 at 11.35.09 PM.png)
- Reply 테이블에는 PostedBy 및 Message 속성의 클로벌 보조 인덱스가 존재


# Lambda로 DynamoDB 접근하기
![Pasted-image-20231016083513.png](/img/이미지 창고/Pasted-image-20231016083513.png)

## 데이터 읽기 함수 생성
- Lambda 콘솔로 이동 후 함수 생성
![Pasted-image-20231016083559.png](/img/이미지 창고/Pasted-image-20231016083559.png)
- 함수 생성 이후, 구성 탭에서 권한 선택 후, 역할 이름 클릭
- 새 탭에서 IAM 콘솔이 뜨면 권한 탭에서 **권한 추가**  >  **정책 연결**
- `AmazonDynamoDBReadOnlyAccess` 정책 선택 후 정책 연결 버튼 클릭
![Pasted-image-20231016083806.png](/img/이미지 창고/Pasted-image-20231016083806.png)
- 다시 Lambda 콘솔로 돌아와서 코드 편집에서 `serverless/ch4_sampleapp/read_forum.py` 파일의 내용을 복붙 한다.
```bash
git clone git@github.com:fastcampus-dev/FastCampus-Online-AWS-DevOps-2022.git
```

- 코드에서 아래 table 변수의 값을 Forum으로 수정하고 저장
- Test 이벤트를 생성 후, Test 버튼을 클릭 생성하여 정상적으로 값을 가져오는 것을 확인
![Pasted-image-20231016084535.png](/img/이미지 창고/Pasted-image-20231016084535.png)


## 데이터 쓰기 함수 생성
![Pasted-image-20231016084618.png](/img/이미지 창고/Pasted-image-20231016084618.png)
- 함수가 생성되면 구성 탭에서 권한을 선택하고 역할 이름을 클릭
- `AmazonDynamoDBFullAccess` 정책을 선택하고 정책 연결 버튼 클릭
![Pasted-image-20231016084923.png](/img/이미지 창고/Pasted-image-20231016084923.png)
- 코드 편집기에 `serverless/ch4_smapleapp/create_forum.py` 파일의 내용을 복사 붙여넣기 한다.
- 코드에서 아래 `table` 변수의 값을 `Forum`으로 수정
- 코드에서 아래 `new_item` 변수의 값을 아래 코드로 수정하고 저장
```json
"Item" : {
	"Name" : { "S" : "Amazon Lambda" },
	"Category" : { "S" : "Amazon Web Service" }
}
```
- 해당 값을 테스트하여, Test 버튼을 클릭 생성 후, 정상적으로 값을 가져오는 것을 확인
- 왼쪽 상단 검색 창에서 DynamoDB 입력하여 <mark>DynamoDB 콘솔</mark>로 이동
- 테이블 메뉴에서 항목 탐색 선택 후, Forum 테이블 선택 후 테이블 내용 확인
![Pasted-image-20231016085555.png](/img/이미지 창고/Pasted-image-20231016085555.png)

# Amplify 연동해서 웹 애플리케이션 배포
## 아키텍처
![Pasted-image-20231016090006.png](/img/이미지 창고/Pasted-image-20231016090006.png)

## AWS Amplify
:::tip AWS Amplify?
- 프론트엔드 웹 및 모바일 개발자가 다양한 AWS 서비스를 활용하는 유연성을 바탕으로 
- 풀 스택 애플리케이션을 손쉽게 구축, 배송 및 호스팅 할 수 있도록 지원하는 완전한 솔루션

:::

![Pasted-image-20231016090042.png](/img/이미지 창고/Pasted-image-20231016090042.png)

### S3 생성
- S3로 이동 후 버킷 생성 버튼 클릭 후, 아래와 같이 파일을 업로드 합니다.
- 해당 버킷에 `serverless/ch4_sampleapp/forum_app.zip` 파일 업로드
![Pasted-image-20231016090723.png](/img/이미지 창고/Pasted-image-20231016090723.png)

### Amplify 생성
- 모든 앱 메뉴 클릭 후 시작하기 버튼 클릭
- Amplify Hosting 시작하기 버튼 클릭
![Pasted-image-20231016090855.png](/img/이미지 창고/Pasted-image-20231016090855.png)
- 해당 강의에서는 <mark>Git 공급자 없음</mark>으로 시작합니다.
![Pasted-image-20231016091320.png](/img/이미지 창고/Pasted-image-20231016091320.png)
- 아래와 같이 구성하고 <mark>저장 및 배포</mark> 버튼을 클릭
![Pasted-image-20231016091406.png](/img/이미지 창고/Pasted-image-20231016091406.png)

![Pasted-image-20231016091619.png](/img/이미지 창고/Pasted-image-20231016091619.png)
- Application Test
![Pasted-image-20231016091636.png](/img/이미지 창고/Pasted-image-20231016091636.png)

### Function Endpoint 구성
- API 게이트웨이 콘솔 이동
- API 생성 버튼을 클릭하고, HTTP API 구축 선택
- 아래와 같이 구성 후, 나머지 설정은 그대로 두고 <mark>검토 및 생성</mark> 버튼 클릭
![Pasted-image-20231016091751.png](/img/이미지 창고/Pasted-image-20231016091751.png)

- API 게이트웨이가 생성 되면 경로 탭에서 <mark>Create 버튼</mark> 클릭
- 아래와 같이 구성 후 <mark>생성</mark> 버튼 클릭
![Pasted-image-20231016091947.png](/img/이미지 창고/Pasted-image-20231016091947.png)
- 경로 탭에서 /forum **GET** 선택 후, 통합 연결 버튼을 클릭하고 통합 생성 및 연결 클릭
- 아래와 같이 구성하고, 생성 버튼을 클릭합니다.
![Pasted-image-20231016092102.png](/img/이미지 창고/Pasted-image-20231016092102.png)
- `<api=gateway-url>/forum` 을 접속하여 정상 동작 확인
- 다시 API Gateway 콘솔로 돌아와서 왼쪽 CORS 메뉴 선택
- 아래와 같이 구성 후 저장 버튼 클릭
![Pasted-image-20231016092346.png](/img/이미지 창고/Pasted-image-20231016092346.png)
- `serverless/ch4_sampleapp/forum_app` 경로로 이동
- `static/script.js` 파일의 3번째 `apiGatewayUrl`을 생성한 API <mark>게이트웨이 엔드포인트</mark>로 변경
- 웹 페이지에 접속하여 정상 동작 확인

### 권한 부여자 설정

:::tip 인증 받은 토큰을 갖고 있는 자만, 해당 API 를 호출 할 수 있게 해주는 설정
:::

- API 게이트웨이 입력하여 API 게이트웨이 콘솔로 이동
- 생성한 forum_app API 게이트웨이를 선택하고 **권한 부여** 클릭
- 왼쪽 경로에서 /forum GET 을 선택하고 <mark>권한 부여자 생성 및 연결</mark> 버튼 클릭
![Pasted-image-20231016093302.png](/img/이미지 창고/Pasted-image-20231016093302.png)
- 아래와 같이 구성하고 <mark>생성 및 연결</mark> 버튼 클릭
![Pasted-image-20231016093345.png](/img/이미지 창고/Pasted-image-20231016093345.png)
- Lambda Authorize를 생성해서 해당 권한을 부여합니다.
- 권한 부여자 Lambda 함수 수정
![Pasted-image-20231016093651.png](/img/이미지 창고/Pasted-image-20231016093651.png)

- 프론트엔드에서 해당 로직을 호출시 사용해야하는 로직은 아래와 같다
- `serverless/ch4_sampleapp/forum_app` 경로로 이동후
- `static/script.js` 파일에 인증 정보 추가
```js
var tocken = <jwt-tocken>
$.ajax({
	url: apiGatewayUrl + '/forum',
	method: "GET",
	headers: {"Authorization" : tocken},
	dataType: "json"
})
.done(function(forums)){
	  
}
```
- 터미널에서 `sererless/ch4_sampleapp/forum_app` 경로로 이동
```bash
zip -r ../forum_app.zip .

# s3에 업로드
aws s3 cp forum_app.zip s3://<bucket-name>/
```
![Pasted-image-20231016094511.png](/img/이미지 창고/Pasted-image-20231016094511.png)
- 저장 및 배포 다시 시도



---

#AWS #AWS_Serverless #AWS_DynamoDB 

---