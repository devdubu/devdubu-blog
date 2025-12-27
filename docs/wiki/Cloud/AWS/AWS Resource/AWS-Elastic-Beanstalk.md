---
slug: "AWS-Elastic-Beanstalk"
---
# Elastic Beanstalk 개념

## 용어 정리

> 애플리케이션

![Pasted-image-20250410091730.png](/img/이미지 창고/Pasted-image-20250410091730.png)
- Elastic Beanstalk 애플리케이션은 환경, 버전 및 환경 구성을 포함한 Elastic Beanstalk 구성 요소의 논리적 컬렉션 입니다.
- Elastic Beanstalk 에서 애플리케이션은 **개념적**으로 **폴더**와 유사합니다.
    

> 애플리케이션 버전

- Elastic Beanstalk에서 애플리케이션 버전은 **웹 애플리케이션의 배포 가능한 코드**의 레이블 지정된 특정 반복을 나타냅니다.
    - 쉽게 말해서, 만약 Java WAR 파일 등의 **배포 가능한 코드가 포함된** Amazon S3 객체(**저장소**)를 가르킵니다.
        

> 환경

- 환경은 애플리케이션 버전을 실행 중인 AWS 리소스 모음입니다.
    
- 각 환경은 한 번에 **하나의 애플리케이션 버전**만 **실행**하지만,
    
    - 여러 환경에서 **동일한 애플리케이션 버전** 또는 **서로 다른 애플리케이션 버전**을 **동시에 실행**할 수 있습니다.
        
- 환경을 생성하면, Elastic Beanstalk에서 사용자가 지정한 애플리케이션 버전을 실행하는데 필요한 리소스를 프로비저닝 합니다.
    

> 환경 티어

![Pasted-image-20250410091755.png](/img/이미지 창고/Pasted-image-20250410091755.png)

- Elastic Beanstalk 환경을 시작할 때, 먼저 환경 티어를 선택합니다.
- 환경 티어는 환경에서 실행되는 애플리케이션 유형을 지정하고 Elastic Beanstalk에서 이러한 애플리케이션을 지원하기 위해 프로비저닝하는 리소스를 결정합니다.
- **HTTP 요청을 처리**하는 애플리케이션은 **웹 서버 환경 셋팅**에서 실행됩니다.
- Amazon SQS 대기열에서 작업을 자겨오는 백엔드 환경은 **작업자 환경 티어**에서 실행됩니다.
    

> 환경 구성

- 환경 구성은 환경 및 연관된 리소스의 작동 방법을 정의하는 파라미터 및 설정의 모음을 식별합니다.
    
- 환경의 구성 설정을 업데이트 하면 Elastic Beanstalk가 자동으로 기존 리소스에 변경 사항을 적용하거나, 삭제하고 새 리소스를 배포합니다.
    

> 플랫폼

![Pasted-image-20250410091814.png](/img/이미지 창고/Pasted-image-20250410091814.png)
- 플랫폼은 운영체제(OS), 프로그래밍 언어 런타임, 웹 서버, 애플리케이션 서버 및 Elastic Beanstalk 구성 요소의 조합입니다.
    
- 웹 애플리케이션을 설계하고 플랫폼에 맞게 타겟팅 합니다.
    
- Elastic Beanstalk은 애플리케이션을 구축할 수 있는 플랫폼을 다양하게 지원합니다.
    

> 웹 서버 환경

![Pasted-image-20250410091826.png](/img/이미지 창고/Pasted-image-20250410091826.png)

- Elastic Beanstalk은 위의 그림처럼 구성 되어 있습니다.
    
    - EC2 Instance
    - Security Group
    - Auto Scailing Group
    - AZ
    - ELB
- Load Balanacer는 AutoScaling 그룹의 일부인 Amazon EC2 인스턴스의 앞에 위치합니다.
- Amazon EC2 Auto Scaling은 추가 Amazon EC2 인스턴스를 자동으로 시작하여 애플리케이션의 증가하는 로드를 처리합니다.
    

> 호스트 관리자(HM)

해당 소프트웨어 구성 요소는 각 Amazon EC2 인스턴스에서 실행됩니다.

- 애플리케이션 배포
- 콘솔, API, 명령줄을 통해 검색을 위해 이벤트와 측정치 집계
- 인스턴스 수준 이벤트 생성
- 애플리케이션 로그 파일을 모니터링 하여 심각한 오류 검출
- 애플리케이션 서버 모니터링
- 인스턴스 구성 요소 패칭
- 애플리케이션의 로그 파일을 교체하고 Amazon S3에 개시

호스트 관리자는 측정치, 오류 및 이벤트, 서버 인스턴스 상태를 보고합니다.

이는 Elastic Beanstalk 콘솔 API 및 CLI를 통해 사용할 수 있습니다.

# 설계 고려 사항

![Pasted-image-20250410091909.png](/img/이미지 창고/Pasted-image-20250410091909.png)

- 애플리케이션을 설계할 때는 확장성, 영구 스토리지, 내결함성, 콘텐츠 전송, 소프트웨어 업데이트 및 패칭, 연결성을 고려해야 합니다.
    

## 확장성

물리적 하드웨어 환경에서 작동하는 경우 두 가지 방법으로 확장성을 액세스 할 수 있습니다.

![Pasted-image-20250410091921.png](/img/이미지 창고/Pasted-image-20250410091921.png)

위 이미지에 보이는 것과 같이 **스케일 아웃(서버를 병렬 댓수 늘리기)**, **스케일 업(서버의 스펙을 올리기)** 가 있습니다.

해당 내용의 자세한 설명은 하단 링크를 참조해주세요

[링크 개설 예정]

스케일 업 접근 방법의 경우 상당한 비용이 들 수 있으며, 여전히 수요가 용량을 초과할 우려가 있습니다.

이와 관련하여 **일반적**으로는 **스케일 아웃 방식이 효과적**입니다.

그러나 이를 사용할 때는 정기적으로 수요를 예측하고 해당 수요를 충족하기 위해 인프라를 대량으로 배포할 수 있어야 합니다.

![Pasted-image-20250410091933.png](/img/이미지 창고/Pasted-image-20250410091933.png)

해당 방식은 미 사용 용량이 발생할 수 도 있기 때문에, 세심한 모니터링이 필요합니다.

**Elastic Beanstalk**은 EC2의 **AutoScaling Group**을 사용할 수 있기 때문에, **시스템 지표**(예 : CPU, 메모리, 디스크 I/O, 네트워크 I/O) 같은 지표로 **자동으로 스케일 아웃을 진행**할 수 있습니다.

## 보안

애플리케이션과 클라이언트 사이에 흐르는 정보를 보호하기 위해서는 흔히 SSL을 사용합니다.

**Elastic Beanstalk**에서 **SSL을 구성**하기 위해서는 **AWS Certificate Manager**의 무료 인증서가 필요합니다.

![Pasted-image-20250410091946.png](/img/이미지 창고/Pasted-image-20250410091946.png)

만약 이미 **외부 인증 기관(CA)의 인증서**를 갖고 있다면, **ACM을 사용하여 해당 인증서를 가져**올 수 있습니다.

또는 AWS CLI를 이용해서 가져올 수 있습니다.

환경에 대해 SSL 인증서를 구성하면 클라이언트와 환경의 Elastic Load Balancing 로드 밸런서 간에 데이터가암호화 됩니다.

기본적으로 **암호화는 로드 밸런서에서 종료**되고, **로드 밸런서**와 **Amazon EC2** 인스턴스 간의 **트래픽은 암호화 되지 않**습니다.

## 영구 스토리지

Elastic Beanstalk 애플리케이션은 영구 로컬 스토리지가 없는 Amazon EC2 인스턴스에서 실행됩니다.

**Amazon EC2 인스턴스가 종료**되면, 로컬 파일 시스템에 **저장되지 않습**니다.

새 Amazon EC2 인스턴스는 기본 파일 시스템으로 시작합니다.

**영구 데이터** 원본에 **데이터를 저장**하도록 **애플리케이션을 구성**하는 것이 좋습니다.

아래는 Elastic Beanstalk에 사용할 수 있는 영구 저장 스토리지 서비스 입니다.

영구 스토리지

- Amazon S3
- Amazon Elastic File System
- Amazon Elastic Block System
- Amazon DynamoDB
- Amazon Relational Databases Service(RDS)
    

## 내결함성

클라우드 아키텍쳐를 설계할 때는 재난 상황을 항상 염두하고 설계해야 합니다.

![Pasted-image-20250410092017.png](/img/이미지 창고/Pasted-image-20250410092017.png)

항상 장애시 자동 복구 할 수 있도록 설계, 구현 및 배포합니다.

Amazon EC2 인스턴스 및 Amazon RDS에 여러 가용 영역을 사용합니다.

Amazon CloudWatch를 사용하여 Elastic Beanstalk 애플리케이션의 상태를 보다 쉽게 파악하고 하드웨어 장애나 성능 저하 시 적절한 조치를 취합니다.

비정상 Amazon EC2 인스턴스를 새 인스턴스로 바꾸고 Auto Scaling 설정을 구성하여 Amazon EC2 인스턴스를 일정한 크기로 유지합니다.

Amazon RDS를 사용하는 경우 Amazon RDS가 자동 백업을 수행할 수 있도록 백업의 보존 기간을 설정합니다.

## 콘텐츠 전송

사용자가 웹 사이트에 연결하면 요청이 여러 개별 네트워크를 통해 라우팅 됩니다.

![Pasted-image-20250410092029.png](/img/이미지 창고/Pasted-image-20250410092029.png)

사용자는 긴 지연 시간으로 인해 성능 저하를 경험할 수 있습니다.

Amazon CloudFront는 전 세계 엣지 로케이션의 네트워크 전체에 걸쳐 비디오, 이미지와 같은 웹 콘텐츠를 배포하여 지연 시간 문제를 개선할 수 있습니다.

사용자의 요청이 가장 가까운 엣지 로케이션으로 라우팅 되므로 콘텐츠 전송 성능이 뛰어납니다.

## 연결

배포를 완료하려면 Elastic Beanstalk를 환경의 인스턴스에 연결할 수 있어야 합니다.

Amazon VPC 내부에 Elastic Beanstalk 애플리케이션을 배포하는 경우, 연결성을 지원하는 데 필요한 구성은 생성하는 Amazon VPC 환경 유형에 따라 다릅니다.

단일 인스턴스 환경의 경우 추가 구성이 필요하지 않습니다.

![Pasted-image-20250410092038.png](/img/이미지 창고/Pasted-image-20250410092038.png)

아래 경우와 완전 동일하진 않습니다

**Public Subnet**과 **Private Subnet**이 모두 있는 Amazon VPC의 로드 밸런싱 수행 및 확장 가능 환경의 경우 다음을 수행 해야 합니다.

- 인터넷에서 Amazon EC2 인스턴스로 **인바우드 트래픽**을 **라우팅** 할 수 있도록 **Public Subnet에 로드 밸런서**를 만듭니다.
    
- Private Subnet 내부에 Amazon EC2 인스턴스에서 인터넷으로 **아웃 바운드 트래픽**을 **라우팅** 할 수 있도록 **네트워크 주소 변환(NAT) 디바이스**를 만듭니다.
    
- Private Subnet 내부에 Amazon EC2 인스턴스의 인바운드 및 아웃바운드 라우팅 규칙을 만듭니다.
    
- NAT 인스턴스를 사용하는 경우, 인터넷 통신을 사용하도록 NAT 인스턴스와 Amazon EC2 인스턴스의 보안 그룹을 구성합니다.
    

# Elastic Beanstalk 플랫폼

## 주요 용어

### 런타임

애플리케이션 코드르 실행하는 데 필요한 프로그래밍 언어별 런타임 소프트웨어(프레임워크, 라이브러리, 인터프리터, vm등)

### 플랫폼

플랫폼은 운영체제(OS), 런타임, 웹 서버 , 애플리케이션 서버 및 Elastic Beanstalk 구성 요소의 조합 입니다.

### 플랫폼 버전

특정 버전의 운영 체제(OS), 런타임, 웹 서버, 애플리케이션 서버 및 Elastic Beanstalk 구성 요소의 조합입니다.

### 플랫폼 브랜치

운영 체제(OS), 런타임 또는 Elastic Beanstalk 구성 요소와 같은 일부 구성 요소의 특정 버전을 공유하는 플랫폼 입니다.

## Docker Container에서 Elastic Beanstalk 애플리케이션 배포

Elasitc Beanstalk는 docker container 웹 애플리케이션 배포를 지원합니다.

### Docker 플랫폼 브랜치

Elastic Beanstalk 도커 플랫폼은 Amazon Linux 2에 기반한 플랫폼 브랜치를 지원합니다.

### Amazon Linux 2에서 실행되는 도커

이 플랫폼 브랜치는 단일 컨테이너 및 멀티 컨테이너 지원 모두 제공합니다.

Elastic Beanstalk는 이 플랫폼 브랜치의 EC2인스턴스에 Docker 이미지 및 소스 코드를 배포합니다.

Docker 플랫폼의 Docker 구성 도구를 활용하여 애플리케이션 구성, 테스트 및 배포를 간소화 할 수 있습니다.

### Dockerfile을 사용하여 컨테이너 배포

애플리케이션을 로컬에서 테스트 한 후 Elastic Beanstalk 환경에 배포합니다.

Elastic Beanstalk은 Dockerfile의 지침을 사용하여 이미지를 빌드하고 실행합니다.

`eb create` 명령을 사용하여 환경을 생성하고 애플리케이션을 배포합니다.

`eb create [enviroment-name]`

사용자 환경이 시작된 후 `eb open` 명령을 사용하여, 웹 브라우저에서 봅니다.

### 원격 Docker 이미지 테스트

애플리케이션 docker 이미지를 빌드하고 Docker Hub로 푸시합니다.

이미지를 빌드하고, 푸시하면 Docker 환경에서 Docker 구성을 사용하는 경우 `docker-compose.yaml` 파일과 함께, Elastic Beanstalk에 배포할 수 있습니다.

Docker 환경에서 docker 구성을 사용하지 않는 경우 대신 `Dockerrun.aws.json` 파일을 사용합니다.

### Elastic Beanstalk로의 원격 Docker 이미지 배포

컨테이너를 로컬에서 테스트 한 후 Elastic Beanstalk 환경에 배포합니다.

Docker 구성을 사용하는 경우 Elastic Beanstalk이 `docker-compose.yaml` 파일을 사용하여, 이미지를 가져와서 실행합니다.

그렇지 않으면 Elastic Beanstalk 대신 Dockerrun.aws.json을 사용합니다.

`eb create [enviroment-name] eb open`

## Docker 구성

Elastic Beanstalk에 배포하기 위해서 Docker 이미지 및 컨테이너를 준비하는 방법에 대한 내용입니다.

### docker 구성을 사용하는 docker 환경

docker 구성 도구로 사용하는 경우 docker 환경에서 Elastic Beanstalk에 배포하는 모든 웹 애플리케이션에 `docker-compose.yaml` 파일이 있어야 합니다.

아래의 과정을 통해서 Elastic Beanstalk에 배포 할 수 있습니다.

- 호스팅 되는 리포지토리에 Elastic Beanstalk으로 Docker 이미지를 배포하도록 `docker-compose.yaml` 파일을 생성합니다.
    
- 모든 배포가 퍼블릭 리포지토리(DockerHub 공식 이미지)의 이미지에서 가져온 경우 다른 파일이 필요하지 않습니다.
    
- `Dockerfile`을 생성하여 Elastic Beanstalk을 빌드하고 사용자 이미지를 실행합니다.
    
    - 이 파일은 배포 요구 사항에 따라 선택 사항이 된다.
        
- 애플리케이션 파일, 모든 애플리케이션 파일 종속성, `.zip` 및 `Dockerfile` 파일이 포함된 `docker-compose.yaml` 파일을 만듭니다.
    
- `EB CLI` 를 사용하여 애플리케이션을 배포하면, `.zip` 파일이 생성됩니다.
    
    - 두 파일은 루트에 있거나, `.zip` 아카이브의 최상위에 있어야 합니다.
        

### 프라이빗 리포지토리 이미지 사용

Elastic Beanstalk은 프라이빗 리포지토리에서 이미지를 가져오고 배포하기 전에 Private 리포지토리를 호스팅하는 온라인 레지스트리로 인증 해야 합니다.

리포지토리로 인증하기 위해 Elastic Beanstalk 환경에 대한 보안 인증 정보를 저장하고 검색하는 두 가지 옵션에 대해 예제를 제공 합니다.

#### Dockerrun.aws.json

이 접근 방식을 사용하면 Docker 명령을 사용하여 인증 파일을 생성 한 다음 인증 파일을 Amazon S3 버킷에 업로드 합니다.

또한 Dockerrun.aws.json v3 파일에 버킷 정보를 포함 해야 합니다.

:::tip Elastic Beanstalk에 인증 파일을 생성하고 제공하려면

:::

1. docker register에 로그인을 합니다.

`docker login docker login [register-server-url]`

2. 이름이 `.dockercfg` 인 인증 파일의 복사본을 안전한 Amazon S3 버킷에 업로드 합니다.
    1. Amazon S3 버킷은 이를 사용 중인 환경과 동일한 AWS 리전에 호스팅 되어야 합니다.
    2. Elastic Beanstalk은 다른 리전에 호스팅된 Amazon S3 버킷에서 파일을 다운로드 할 수 없습니다.
3. Authentication 파일의 Dockerrun.aws.json v3 파라미터에 Amazon S3 버킷 정보를 포함합니다.


`{ "AWSEBDockerrunVersion" : "3", "Authentication" : { "bucket" : "DOC-EXAMPLE-BUCKET", "key" : "mydockercfg" } }`

- `AWSEBDockerrunVersion` 파라미터는 `Dockerrun.aws.json` 파일의 버전을 나타냅니다.
- Amazon Linux2 플랫폼은 Docker 구성을 사용하는 환경에서는 v3를 사용합니다.
- Docker 구성을 사용하지 않으면 v1을 사용합니다.
- 멀티 컨테이너 Docker Amazon Linux AMI 플랫폼은 v2를 사용합니다.

---

#AWS #AWS_ElasticBeanstalk

---