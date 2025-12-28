---
slug: "1-VPC-Basics-and-Subnets"
---

# VPC Basics & Subnets

## 1. Amazon VPC?
**Amazon Virtual Private Cloud (Amazon VPC)**는 사용자가 정의한 가상 네트워크 환경에서 AWS 리소스를 시작할 수 있게 해주는 서비스입니다.
- **격리된 네트워크**: 고객의 자체 데이터 센터와 유사하게 네트워크 환경을 완벽하게 제어할 수 있습니다.
- **주요 기능**: IP 주소 범위 선택, 서브넷 생성, 라우팅 테이블 및 네트워크 게이트웨이 구성 등.

:::info Region vs VPC vs AZ
**Region (VPC (AZ (Subnet)))**
- **Region**: 물리적으로 떨어진 데이터 센터 집합 (예: 서울 리전)
- **VPC**: 하나의 Region에 속하는 가상 네트워크 (다른 Region으로 확장 불가)
- **AZ (Availability Zone)**: 물리적으로 분리된 데이터 센터 (예: `ap-northeast-2a, 2c`)
- **Subnet**: VPC의 IP 대역을 더 작게 나눈 단위. **하나의 AZ에만 생성 가능**합니다.
:::

![Untitled.png](/img/Untitled.png)

## 2. VPC Components

### CIDR (Classless Inter-Domain Routing)
VPC와 Subnet의 IP 주소 범위를 지정하는 방식입니다.
- 예: `10.0.0.0/16` (65,536개 IP)
- VPC 생성 시 사설 IP 대역(RFC 1918) 사용 권장:
	- `10.0.0.0` ~ `10.255.255.255`
	- `172.16.0.0` ~ `172.31.255.255`
	- `192.168.0.0` ~ `192.168.255.255`

### Subnet Types
![Untitled-3.png](/img/Untitled-3.png)
1. **Public Subnet**: 인터넷에 직접 접근할 수 있는 서브넷 (IGW와 연결됨). 웹 서버, Bastion Host 등이 위치.
2. **Private Subnet**: 인터넷에 직접 접근할 수 없는 서브넷. DB, WAS 등이 위치. (보안성 높음)

### Subnet CIDR Calculation Example
VPC: `211.11.124.0/24` 일 때 4개의 서브넷으로 나눈다면:
- Subnet 1: `211.11.124.0/26` (0 ~ 63)
- Subnet 2: `211.11.124.64/26` (64 ~ 127)
- Subnet 3: `211.11.124.128/26` (128 ~ 191)
- Subnet 4: `211.11.124.192/26` (192 ~ 255)

## 3. Creating a VPC (Step-by-Step)
1. **VPC 생성**:
    - IPv4 CIDR 블록 입력 (예: `10.0.0.0/16`)
    - Tenancy: 기본(Default)
2. **Subnet 생성**:
    - VPC ID 선택
    - **가용 영역(AZ)** 선택 (예: `ap-northeast-2a`)
    - CIDR 블록 입력 (예: `10.0.1.0/24`)
    - **팁**: Public/Private 서브넷을 쌍으로 같은 AZ에 만드는 것이 관리하기 좋습니다.
