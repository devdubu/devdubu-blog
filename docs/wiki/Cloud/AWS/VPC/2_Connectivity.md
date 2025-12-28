---
slug: "2-Connectivity"
---

# VPC Connectivity

VPC 내/외부의 리소스가 서로 통신하는 방법에 대해 다룹니다.

## 1. Internet Gateway (IGW)
![Untitled-5.png](/img/Untitled-5.png)
- **역할**: VPC의 인스턴스와 인터넷 간의 통신을 가능하게 하는 관문입니다.
- **특징**:
	- VPC당 하나만 연결할 수 있습니다.
	- 고가용성이 보장되며, 대역폭 제한이 없습니다.
	- **Public Subnet**은 라우팅 테이블을 통해 IGW와 연결되어 있어야 합니다.

## 2. Route Table (라우팅 테이블)
트래픽이 어디로 가야 할지 결정하는 규칙(Rule)들의 집합입니다.
![Untitled-6.png](/img/Untitled-6.png)

### Public Route Table
- **구성**:
	- Local: `10.0.0.0/16` (VPC 내부 통신)
	- Internet: `0.0.0.0/0` -> **IGW (Internet Gateway)**
- **용도**: Public Subnet에 연결하여 인터넷 접속 허용

### Private Route Table
- **구성**:
	- Local: `10.0.0.0/16`
	- Internet: `0.0.0.0/0` -> **NAT Gateway** (선택 사항, 외부 통신 필요 시)
- **용도**: Private Subnet에 연결. 외부에서 직접 접근 불가.

## 3. NAT (Network Address Translation)
Private Subnet의 인스턴스가 인터넷(외부)으로 나가는 **Outbound** 통신을 가능하게 해줍니다. (예: yum update, DB 패치 등)

### NAT Gateway vs NAT Instance
![Untitled-11.png](/img/Untitled-11.png)

| 특징 | NAT Gateway (권장) | NAT Instance (Legacy) |
| -- | -- | -- |
| **관리** | AWS 완전 관리형 | 사용자가 직접 EC2 관리 |
| **위치** | **Public Subnet**에 위치 | **Public Subnet**에 위치 |
| **고가용성** | AZ 내에서 자동 고가용성 제공 | 사용자가 스크립트 등으로 구성 필요 |
| **대역폭** | 자동 확장 (최대 45Gbps) | EC2 인스턴스 유형에 따라 다름 |
| **비용** | 시간당 요금 + 데이터 처리 요금 | EC2 인스턴스 요금 |

### NAT Gateway 설정 방법
1. **생성**: VPC 서비스 -> NAT Gateway 생성
2. **Subnet 선택**: 반드시 **Public Subnet**을 선택해야 합니다.
3. **EIP 연결**: 탄력적 IP(Elastic IP)를 할당해야 합니다.
4. **라우팅 수정**: Private Route Table의 `0.0.0.0/0` 타겟을 생성한 NAT Gateway ID로 설정합니다.

## 4. Bastion Host
![Untitled-14.png](/img/Untitled-14.png)
- **목적**: 관리자가 외부에서 Private Subnet의 인스턴스에 SSH로 접근하기 위한 점프 서버입니다.
- **위치**: Public Subnet
- **접속 흐름**: User(인터넷) -> Bastion Host(Public) -> Private Instance(Private)
- **보안**: Bastion Host의 Security Group은 관리자의 IP(My IP)에서 오는 22번 포트만 허용해야 합니다.

## 5. VPC Peering
- 서로 다른 두 VPC 간의 트래픽을 라우팅할 수 있게 해주는 네트워크 연결입니다.
- 동일 리전, 다른 리전, 다른 계정 간에도 연결 가능합니다.
- Peering 연결 후에는 양쪽 VPC의 라우팅 테이블에 상대방 VPC의 CIDR 대역을 추가해야 합니다.
