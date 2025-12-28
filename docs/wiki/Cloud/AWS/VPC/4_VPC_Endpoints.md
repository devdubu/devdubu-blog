---
slug: "4-VPC-Endpoints"
---

# VPC Endpoints (PrivateLink)

:::info VPC Endpoint?
인터넷 게이트웨이(IGW), NAT 디바이스, VPN 연결 등을 통하지 않고 **AWS 전용 사설 네트워크(AWS PrivateLink)**를 통해 AWS 서비스(S3, DynamoDB 등)와 VPC를 안전하게 연결하는 기술입니다.
:::
![Untitled-15.png](/img/Untitled-15.png)

## 1. Why use VPC Endpoints?
- **보안**: 트래픽이 공용 인터넷을 타지 않고 AWS 내부 네트워크에만 머무릅니다.
- **프라이버시**: Private Subnet의 인스턴스가 Public IP 없이도 AWS 서비스에 접근할 수 있습니다.
- **규정 준수**: 데이터 유출 방지 및 네트워크 격리 요구사항을 충족합니다.

## 2. Types of Endpoints

### Interface Endpoint
![Untitled-16.png](/img/Untitled-16.png)
- **방식**: VPC 내의 서브넷에 **ENI (Elastic Network Interface)**를 생성하고, 이 ENI의 사설 IP(Private IP)를 통해 서비스에 접근합니다.
- **대상**: 대부분의 AWS 서비스 (CloudWatch, SQS, SNS, Kinesis, SageMaker, Systems Manager 등)
- **특징**: Security Group을 통해 접근 제어가 가능합니다. 비용이 발생합니다.

### Gateway Endpoint
![Untitled-17.png](/img/Untitled-17.png)
- **방식**: **라우팅 테이블(Route Table)**에 경로(Route)를 추가하여 트래픽을 서비스로 보냅니다.
- **대상**: **S3**, **DynamoDB** (현재 이 두 가지 서비스만 지원)
- **특징**: 무료입니다. 라우팅 테이블에서 제어됩니다.

## 3. Example: Gateway Endpoint for S3
1. VPC 서비스 -> 엔드포인트 생성
2. 서비스 카테고리에서 **AWS 서비스** 선택
3. 서비스 이름에서 `com.amazonaws.[region].s3` (Gateway 타입) 검색 및 선택
4. 연결할 **VPC** 선택
5. **라우팅 테이블** 선택: 엔드포인트를 사용할 서브넷의 라우팅 테이블을 체크합니다. (자동으로 라우트가 추가됨)
6. **정책(Policy)**: Full Access 또는 특정 버킷만 허용하는 등 제어 가능

설정이 완료되면, Private Subnet의 인스턴스는 NAT Gateway 없이도 S3에 접근할 수 있습니다.
```bash
aws s3 ls --region ap-northeast-2
```
