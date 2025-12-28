---
slug: "5-Load-Balancing-and-Auto-Scaling"
---

# Load Balancing & Auto Scaling

시스템의 확장성(Scalability)과 고가용성(High Availability)을 확보하기 위한 핵심 서비스인 ELB와 ASG에 대해 다룹니다.

## Scalability & Availability Concepts

### 1. Scalability
어플리케이션이나 시스템이 조정을 통해 더 많은 양을 처리할 수 있는 능력을 의미합니다.

- **Vertical Scalability (수직 확장, Scale Up)**
    - 인스턴스의 사양(스펙)을 높이는 작업입니다.
    - 예: `t2.micro` (0.5G RAM, 1 vCPU) -> `u-12tb1.metal` (12.3TB RAM, 448 vCPU)
    - RDS, ElastiCache 등 분산이 어려운 데이터베이스 시스템에서 흔히 사용됩니다.
    - 하드웨어의 한계로 인해 확장할 수 있는 정도에 제한이 있습니다.

- **Horizontal Scalability (수평 확장, Scale Out)**
    - 인스턴스나 시스템의 개수를 늘리는 방법입니다.
    - 웹 애플리케이션 등 분산 처리가 가능한 현대적인 시스템에 적합합니다.
    - EC2 Auto Scaling Group 등을 통해 쉽게 구현할 수 있습니다.

### 2. High Availability (고가용성)
시스템이 중단 없이 지속적으로 운영되는 능력을 의미합니다.
- 보통 2개 이상의 AZ(가용 영역) 또는 데이터 센터에 걸쳐 애플리케이션을 실행하여 달성합니다.
- **수동형 고가용성**: RDS Multi-AZ와 같이 장애 시 예비 시스템으로 전환.
- **능동형 고가용성**: 수평 확장과 같이 여러 시스템이 동시에 가동되며 부하를 분산.

---

## ELB (Elastic Load Balancer)

:::note Load Balancer란?
서버 혹은 서버셋으로 들어오는 트래픽을 여러 백엔드 다운스트림 EC2 인스턴스 또는 컨테이너로 전달하는 역할을 합니다.
AWS가 관리하는 ELB는 업그레이드, 유지 관리 및 고가용성을 책임지며, 어떤 경우에도 작동할 것을 보장합니다.
:::

![Pasted-image-20230829152253.png](/img/Pasted-image-20230829152253.png)

### Why use Load Balancer?
- 부하를 다수의 다운스트림 인스턴스로 효과적으로 분산합니다.
- 애플리케이션의 단일 액세스 지점(DNS)을 제공합니다.
- **상태 확인(Health Checks)** 매커니즘으로 비정상 인스턴스로 트래픽을 보내지 않게 하여 가용성을 높입니다.
- **SSL Termination** (HTTPS 복호화)을 지원하여 백엔드 서버의 부하를 줄입니다.
- 쿠키를 이용한 **Stickiness**를 제공합니다.
- 클라우드 내에서 프라이빗 트래픽과 퍼블릭 트래픽을 분리할 수 있습니다.

### Load Balancer Types
| 유형 | 버전 | 계층 | 프로토콜 | 특징 |
| -- | -- | -- | -- | -- |
| **ALB** (Application) | v2 | Layer 7 | HTTP/HTTPS/gRPC | 경로 기반 라우팅, 컨테이너(Docker) 지원, 웹 소켓 지원. 가장 권장됨. |
| **NLB** (Network) | v2 | Layer 4 | TCP/UDP/TLS | 초고성능(수백만 rps), 초저지연, **고정 IP(Static IP)** 제공 가능. |
| **GWLB** (Gateway) | v2 | Layer 3 | IP (GENEVE) | 방화벽, 침입 탐지 등 타사 가상(보안) 어플라이언스 배포 및 관리에 사용. |
| **CLB** (Classic) | v1 | Layer 4/7 | TCP/HTTP | 구형(Legacy). AWS 권장하지 않음. |

### 1. Application Load Balancer (ALB)
![Pasted-image-20230829173046.png](/img/Pasted-image-20230829173046.png)
- **L7 라우팅**: URL 경로(`/users`), 호스트 이름(`one.example.com`), 쿼리 스트링 등에 따라 다른 대상 그룹(Target Group)으로 라우팅할 수 있습니다.
- **Target Group**: EC2, ECS 태스크 프라이빗 IP, Lambda 등을 대상으로 지정 가능.
- **X-Forwarded-For**: EC2는 ALB의 IP를 보게 되므로, 클라이언트의 실제 IP를 알기 위해 헤더를 확인해야 합니다.

### 2. Network Load Balancer (NLB)
- **고성능**: TCP/UDP 트래픽을 매우 빠른 속도로 처리합니다.
- **Static IP**: 각 AZ마다 하나의 탄력적 IP(EIP)를 가질 수 있습니다. (화이트리스팅 등에 유용)
- 프리 티어가 아닙니다.

### ELB Key Features

#### Sticky Session (Session Affinity)
![Pasted-image-20230830171730.png](/img/Pasted-image-20230830171730.png)
- 동일한 클라이언트의 요청을 항상 동일한 인스턴스로 보내는 기능입니다. (쿠키 사용)
- 로그인 유지 등 세션 정보가 로컬 인스턴스에 저장된 경우 필요하지만, 부하 불균형을 초래할 수 있습니다.

#### Cross-Zone Load Balancing
- 로드 밸런서가 활성화된 모든 가용 영역(AZ)에 있는 등록된 모든 대상에 트래픽을 고르게 분산합니다.
- ALB는 기본 활성화, NLB/CLB는 기본 비활성화 상태입니다.

#### SSL/TLS Certificates & SNI
- **SSL Termination**: 로드 밸런서에서 암호화를 해제하여 백엔드 인스턴스로는 HTTP로 통신하게 하여 인스턴스의 부하를 줄입니다.
- **SNI (Server Name Indication)**: 하나의 리스너(IP)에 여러 SSL 인증서를 로드하여 여러 도메인(`www.a.com`, `www.b.com`)을 호스팅할 수 있게 해주는 기능입니다. (ALB, NLB 지원)

#### Connection Draining (Deregistration Delay)
- 인스턴스가 등록 취소되거나 비정상 상태가 될 때, 즉시 연결을 끊지 않고 진행 중인 요청(In-flight request)이 완료될 때까지 일정 시간(기본 300초) 기다려주는 기능입니다.

### Load Balancer Security Group
![Pasted-image-20230829170037.png](/img/Pasted-image-20230829170037.png)

로드 밸런서와 백엔드 EC2 인스턴스 간의 보안 그룹 구성은 다음과 같이 설정해야 합니다.

1. **Load Balancer SG**: 외부 사용자(Anywhere `0.0.0.0/0`)로부터 HTTP/HTTPS 트래픽 허용.
   ![Pasted-image-20230829170230.png](/img/Pasted-image-20230829170230.png)

2. **Backend EC2 SG**: **오직 Load Balancer의 보안 그룹**으로부터 오는 트래픽만 허용.
   ![Pasted-image-20230829170443.png](/img/Pasted-image-20230829170443.png)
   - 이렇게 하면 사용자가 EC2 인스턴스에 직접 접근하는 것을 막고, 모든 트래픽이 반드시 로드 밸런서를 거치도록 강제할 수 있습니다.

---

## Auto Scaling Group (ASG)
![Pasted-image-20231204103212.png](/img/Pasted-image-20231204103212.png)
:::tip 목적
- **Scale Out**: 부하 증가 시 인스턴스 추가
- **Scale In**: 부하 감소 시 인스턴스 제거
- EC2 인스턴스의 최소/최대 개수를 자동으로 유지하여 비용 최적화 및 가용성 확보
:::

### 기능
- **Launch Template**: 시작 템플릿 (AMI, 인스턴스 타입, 보안 그룹 등 정의)을 사용하여 인스턴스를 시작합니다.
- **ELB 통합**: ASG가 생성한 인스턴스를 자동으로 로드 밸런서의 대상 그룹에 등록합니다. 상태 확인(Health Check)에 실패한 인스턴스를 자동으로 교체(Terminate & Re-create)합니다.
- **Scaling Policies**:
	- **Target Tracking**: 특정 지표(예: CPU 사용률 40%)를 유지하도록 조정
	- **Simple/Step Scaling**: 알람 발생 시 N개 추가/제거
	- **Scheduled Scaling**: 예측 가능한 트래픽(예: 월요일 오전 9시)에 맞춰 조정
