---
slug: "AWS-서비스-개요"
---
# AWS의 성장 배경
![Pasted-image-20231023094405.png](/img/이미지 창고/Pasted-image-20231023094405.png)
![Pasted-image-20231023094600.png](/img/이미지 창고/Pasted-image-20231023094600.png)

# AWS 소개
## AWS 글로벌 인프라
### 리전(Region)
![Pasted-image-20231023094633.png](/img/이미지 창고/Pasted-image-20231023094633.png)
![Pasted-image-20231023094832.png](/img/이미지 창고/Pasted-image-20231023094832.png)
- 리전 코드 해석
	- **지역**(ap) - **지리적 위치**(northeast) - **순번**(2)

- AWS는 리전 별로 서비스 리스트가 다르기 때문에, 아래의 링크를 참조해서 서비스 지원 여부를 확
https://aws.amazon.com/ko/about-aws/global-infrastructure/regional-product-services/

### AWS CLI를 활용한 리전 서비스 조회
```bash
# AWS 리전 목록 조회
aws ssm get-parameters-by-path --path /aws/service/global-infastructure/regions --output json | jq .Parmeters[].Name

# 모든 AWS 서비스 목록 조회
aws ssm get-parameters-by-path --path /aws/service/global-infrastructure/services --output json | jq .Parameters[].Name | sort

# 리전에서 사용 가능한 서비스 조회
aws ssm get-parameters-by-path --path /aws/service/global-infrastructure/regions/us-east-1/services/ --output json | jq .Parameters[].Name | sort

# 서비스 엔드포인트 조회
aws ssm get-parameters-by-path --path /aws/service/global-infrastructure/regions/us-east-1/services/s3/endpoint --output json | jq .Parameter.Value | sort
```

## AZ(Availabilty Zone) 가용영역
:::tip 가용영역?
- 하나의 리전은 최소 2개 이상 가용영역으로 구성
- 가용영역은 하나 이상의 데이터 센터로 구성
- 서울 리전은 현재 4개의 AZ 운영

:::

![Pasted-image-20231023100054.png](/img/이미지 창고/Pasted-image-20231023100054.png)

## AWS Edge Location(AWS 엣지 로케이션)
:::tip Edge Location?
- Amazon CloudFront / Route53을 위한 캐시 서버(Cache Server)들의 모음
- Edge Location은 AWS 전세계 리전에서 빠른 접근성을 위한 글로벌 네트워크 인프라(400개 지점)
- Lambda@Edge(가까운 지역 위치에서 서버리스 코드 실행)를 통해 성능을 개선하고 지연 시간 단축
:::

![Pasted-image-20231023100316.png](/img/이미지 창고/Pasted-image-20231023100316.png)

# AWS 주요 서비스 소개
## AWS 서비스 포트폴리오
![Pasted-image-20231023100457.png](/img/이미지 창고/Pasted-image-20231023100457.png)

## AWS 컴퓨팅 서비스

### EC2
:::tip AWS EC2?
- Elastic Compute Cloud
- Infra as a Service
- Virtual Machine 서비스
- 다양한 OS 지원
- Auto Scaling을 통한 탄력적 확장 / 축소
- 성능에 따른 다양한 인스턴스 타입 제공
:::

![Pasted-image-20231023100521.png](/img/이미지 창고/Pasted-image-20231023100521.png)

#### 지원 가능 OS
![Pasted-image-20231023100644.png](/img/이미지 창고/Pasted-image-20231023100644.png)
#### AWS EC2 인스턴스 타입 종류
![Pasted-image-20231023100715.png](/img/이미지 창고/Pasted-image-20231023100715.png)

#### AWS EC2 인스턴스 타입 설명
![Pasted-image-20231023100730.png](/img/이미지 창고/Pasted-image-20231023100730.png)

#### AWS EC2 T-Family
![Pasted-image-20231023100820.png](/img/이미지 창고/Pasted-image-20231023100820.png)
![Pasted-image-20231023100813.png](/img/이미지 창고/Pasted-image-20231023100813.png)
- 인스턴스 타입 중 특이한 타입이 위의 T-family이다.
- Bustable 기능을 가지고 있다.
	- 기준 사용률 밑의 성능으로 사용하능 동안 CPU credit이 축적되며, 기준 성능이 넘치는 CPI가 필요할 때 버스팅해서 사용할 수 있습니다.
	- CPU 크래딧을 모두 사용한다면, 급격한 성능 저하가 발생하게 됩니다.
- 기본 성능 계산식
	- 100% * 시간당 지급되는 Credit / vCPU수 / 60분
		- Ex) t2.small : 100% 성능 * 12개 Credit / 1vCPU / 60분 = 20% 성

#### AWS EC2 5세대 인스턴스 Nitro System
![Pasted-image-20231023101218.png](/img/이미지 창고/Pasted-image-20231023101218.png)
:::question Nitro System?
- **Nitro Hypervisor**
- Nitro Hypervisor는 메모리 및 CPU 할당을 관리함
- 베어 메탈과 차이가 없는 성능을 제공하는 경량 하이퍼바이저
- **NVMe**
- Non-Volatile Memnory express로 초고속 저장장치 프로토콜
- NVMe는 인텔, 삼성, 샌디스크, 델, 시게이트 등 포함된 산업
- 컨소시엄이 SSD 전용으로 개발한 통신 표준/프로토콜
- **ENA**
- Elastic Network Adapter
- 향상된 네트워크 처리를 가능하게 해주는 네트워크 통신 모듈
- **Nitro 보안 칩**
- 전용 하드웨어 및 소프트웨어 보안 기능이 적용 되어 공격 포인트를 최소화 함

:::

#### AWS EC2 6/7세대 인스턴스 Graviton chip(64Bit Arm Neoverse N1 Core)
![Pasted-image-20231023102119.png](/img/이미지 창고/Pasted-image-20231023102119.png)

### Lambda
:::tip Lambda?
- 서버리스 컴퓨팅 서비스
- FaaS(Function as a Service)
- 다양한 런타임 지원
- 필요 시에만 코드 실행
- 사용한 만큼 지불
- 실시간 파일처리 지원
![Pasted-image-20231023102302.png](/img/이미지 창고/Pasted-image-20231023102302.png)

:::

#### Lambda 지원 언어
![Pasted-image-20231023102251.png](/img/이미지 창고/Pasted-image-20231023102251.png)

## AWS 스토리지 서비스

### Amazon S3
:::tip Amazon S3란?
- Simple Storage Service
- 객체 스토리지 서비스
- Restful api를 사용하여 객체 엑세스
- HTTP/HTTPS 프로토콜을 사용
- 저장 가능한 파일 개수의 제한 없음
- 단일 파일 5TB 크기까지 저장
- 데이터를 여러 데이터 센터에 중복 저장
- 99.9999% 의 내구성
- 데이터 암호화 기능 제공
- 버전 관리 기능 / 정적 웹 사이트 호스팅
![Pasted-image-20231023102629.png](/img/이미지 창고/Pasted-image-20231023102629.png)

:::

#### Amazon S3 스토리지 클래스
![Pasted-image-20231023102946.png](/img/이미지 창고/Pasted-image-20231023102946.png)
- Cold로 갈 수록 저렴하며, 접근성이 낮은 스토리지 입니다.
- 즉, 대용량이지만, 거의 접근하지 않는 데이터에 적합한 모델 입니다.

#### Amazon S3 사용 예시
![Pasted-image-20231023103145.png](/img/이미지 창고/Pasted-image-20231023103145.png)

### Amazon EBS
:::tip Amazon EBS?
- Elastic Block Storage Service
- 블록 스토리지 서비스
- EC2에 Attach/Detach
- SSD / HDD 볼륨
- 간편한 스냅샷 백업
- 99.999% 내구성
- 탄력적 확장 가능
- 데이터 암호화 기능 제공
![Pasted-image-20231023103324.png](/img/이미지 창고/Pasted-image-20231023103324.png)

:::

#### EBS to EC2 Attach
![Pasted-image-20231023103343.png](/img/이미지 창고/Pasted-image-20231023103343.png)

#### Amazon EBS 볼륨 타입
![Pasted-image-20231023103512.png](/img/이미지 창고/Pasted-image-20231023103512.png)
- EBS 역시도 EC2와 마찬가지로 버스팅 기능이 존재합니다.
- 




---

#AWS 

---