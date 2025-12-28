---
slug: "1-Introduction-and-Instances"
---

# AWS EC2 Introduction & Instances

## Amazon EC2 Overview
![Pasted-image-20230705091629.png](/img/Pasted-image-20230705091629.png)
- EC2(Elastic Compute Cloud)는 AWS가 제공하는 가장 기본적인 IaaS(Infrastructure as a Service) 서비스입니다.
- 가상 머신(VM)을 임대하여 사용할 수 있으며, 이를 EC2 인스턴스라고 부릅니다.
- EC2 서비스는 단순히 VM뿐만 아니라 다음 기능들을 포괄합니다:
	- **EC2**: 가상 머신 인스턴스
	- **EBS (Elastic Block Store)**: 가상 드라이브(스토리지)
	- **ELB (Elastic Load Balancing)**: 로드 밸런서
	- **ASG (Auto Scaling Group)**: 자동 확장 그룹

:::tip EC2의 방식을 이해해야, AWS Cloud 작동 방식을 이해할 수 있습니다.
:::

## EC2 Sizing & Configuration Options
- **OS**: Linux, Windows, Mac OS 등 선택 가능
- **CPU**: 코어 수, 아키텍처(x86, ARM 등) 선택 가능
- **RAM**: 메모리 용량 선택 가능
- **Storage**:
	- 네트워크 스토리지: **EBS**, **EFS**
	- 하드웨어 스토리지: **EC2 Instance Store**
- **Network**:
	- 네트워크 카드 속도, 공개 IP(Public IP) 등 설정
	- 방화벽 규칙: **Security Group**
- **Bootstrapping**: **EC2 User Data**를 통한 초기 구성

## EC2 Instance Types
![Pasted-image-20230705095714.png](/img/Pasted-image-20230705095714.png)
- [EC2 인스턴스 타입 공식 문서](https://aws.amazon.com/ko/ec2/instance-types/)

### AWS 인스턴스 네이밍 규칙
예: `m5.2xlarge`
![Pasted-image-20230706090829.png](/img/Pasted-image-20230706090829.png)
- **m**: 인스턴스 클래스 (용도)
- **5**: 세대 (Generation) - 숫자가 높을수록 최신 하드웨어
- **2xlarge**: 크기 (Size) - vCPU, Memory 용량

### 인스턴스 유형별 특징

#### 1. 범용 (General Purpose)
- 웹 서버, 코드 저장소 등 다양한 작업에 적합
- CPU, Memory, Networking 밸런스가 잡혀있음
- 예: `t-series` (t2, t3), `m-series` (m5)
- **Usecase**: 웹 서버, 개발 환경
![Pasted-image-20230706091738.png](/img/Pasted-image-20230706091738.png)

#### 2. 컴퓨팅 최적화 (Compute Optimized)
- 고성능 프로세서가 필요한 작업에 최적화
- **Usecase**: 배차 처리, 미디어 트랜스코딩, 고성능 웹 서버, HPC, 머신러닝, 게임 서버
- 예: `c-series`
![Pasted-image-20230706091750.png](/img/Pasted-image-20230706091750.png)

#### 3. 메모리 최적화 (Memory Optimized)
- 대규모 데이터셋을 메모리에서 처리하는 작업에 최적화
- **Usecase**: 인메모리 DB(Redis, Memcached), 실시간 비정형 데이터 처리
- 예: `r-series` (RAM의 앞글자), `x1`, `z1`
![Pasted-image-20230706093928.png](/img/Pasted-image-20230706093928.png)

#### 4. 스토리지 최적화 (Storage Optimized)
- 로컬 스토리지의 대규모 데이터셋에 대한 높은 I/O가 필요한 작업
- **Usecase**: NoSQL DB(Cassandra, MongoDB), 데이터 웨어하우징, 분산 파일 시스템
- 예: `i-series`, `d-series`
![Pasted-image-20230706093846.png](/img/Pasted-image-20230706093846.png)

### 인스턴스 타입 비교 예시
| Instance | vCPU | Mem(GiB) | Storage | Network Performance | EBS Bandwidth(Mbps) |
| -- | -- | -- | -- | -- | -- |
| t2.micro | 1 | 1 | EBS-Only | Low to Moderate | |
| t2.xlarge | 4 | 16 | EBS-Only | Moderate | |
| c5d.4xlarge | 16 | 32 | 1 x 400 NVMe SSD | Up to 10 Gbps | 4,750 |
| r5.16xlarge | 64 | 512 | EBS Only | 20Gbps | 13,600 |
- [Instance 비교 사이트](https://instances.vantage.sh/)

## AMI (Amazon Machine Image)
![Pasted-image-20230801110043.png](/img/Pasted-image-20230801110043.png)

:::tip AMI란?
- 사용자 지정 EC2 인스턴스의 형상(Image)
- OS, 소프트웨어, 설정, 모니터링 도구 등을 사전에 패키징하여 부팅 및 구성 시간을 단축시킵니다.
:::

### AMI 유형
1. **Public AMI**: AWS가 제공하는 기본 이미지 (예: Amazon Linux 2)
2. **Your Own AMI**: 사용자가 직접 생성 및 관리하는 이미지
3. **AWS Marketplace AMI**: 서드파티가 판매하거나 공유하는 이미지 (유료일 수 있음)

### AMI Process
1. EC2 인스턴스 시작 및 사용자 지정 설정 (SW 설치 등)
2. 인스턴스 중지 (데이터 무결성 확보)
3. AMI 생성 (이때 EBS 스냅샷도 함께 생성됨)
4. 생성된 AMI를 통해 새로운 인스턴스 런치 (다른 AZ나 리전으로 복사 가능)
![Pasted-image-20230801111550.png](/img/Pasted-image-20230801111550.png)

### Golden Image & Automation (Packer)
- **Golden Image**: 보안 조치 및 필수 패키지가 설치된 표준화된 AMI
- **Automation**: HashiCorp의 **Packer**와 같은 도구를 사용하여 AMI 생성을 코드(IaC)로 자동화할 수 있습니다.
![Pasted-image-20230222131433.png](/img/Pasted-image-20230222131433.png)
### AWS EC2 T-Family (Burstable)
![Pasted-image-20231023100820.png](/img/Pasted-image-20231023100820.png)
- **Burstable Performance**: 기준 성능(Baseline) 이하로 사용할 때 **CPU Credit**을 축적하고, 필요할 때 소모하여 기준 이상의 성능(Burst)을 냅니다.
- **CPU Credit 계산**:
    - 크레딧 고갈 시 급격한 성능 저하가 발생할 수 있습니다.
    - 성능 계산식: `100% * 시간당 지급 Credit / vCPU 수 / 60분`
    - 예) `t2.small`: 100% * 12 Credit / 1 vCPU / 60분 = 약 20% 기준 성능

### AWS EC2 Nitro System
![Pasted-image-20231023101218.png](/img/Pasted-image-20231023101218.png)
5세대 이후 인스턴스에 적용된 차세대 가상화 플랫폼입니다.
1. **Nitro Hypervisor**: 메모리 및 CPU 할당을 관리하는 경량 하이퍼바이저. (베어메탈에 가까운 성능)
2. **Nitro Card (I/O)**:
    - **VPC**: ENA (Elastic Network Adapter) 컨트롤러로 향상된 네트워크 처리.
    - **EBS**: NVMe (Non-Volatile Memory express) 인터페이스로 초고속 스토리지 접근.
3. **Nitro Security Chip**: 하드웨어 레벨의 보안 및 펌웨어 검증.

## AMI (Amazon Machine Image)

## EC2 User Data
- 인스턴스가 **최초로 실행될 때(Bootstrapping)** 한 번만 실행되는 스크립트입니다.
- **용도**:
	- 패키지 업데이트 및 소프트웨어 설치
	- 파일 다운로드 및 설정
- **특징**:
	- Root 권한(sudo)으로 실행됩니다.
	- 스크립트가 길어지면 부팅 시간이 길어질 수 있습니다.

### User Data 설정 화면
![Pasted-image-20230706085013.png](/img/Pasted-image-20230706085013.png)
- EC2 생성 시 `Advanced details` 항목의 맨 아래에서 설정 가능합니다.

## EC2 Purchasing Options (구매 옵션)

| 옵션 | 설명 | 특징 |
| -- | -- | -- |
| **On-Demand** | 필요할 때 언제든 생성/삭제 | 단기 워크로드, 예측 불가능한 트래픽, 개발/테스트 |
| **Reserved** (RI) | 1년 또는 3년 약정 | 온디맨드 대비 최대 72% 할인, 안정된 DB 등에 적합 |
| **Savings Plans** | 특정 사용량($/hr) 약정 | 현대적인 요금 모델, 유연성 높음 (EC2, Lambda, Fargate) |
| **Spot Instance** | 남는 용량 사용 | 최대 90% 할인, 인스턴스가 언제든 중단될 수 있음 (Stateless, 배치 작업) |
| **Dedicated Host** | 물리적 서버 전체 예약 | 규정 준수(Compliance), 라이선스 이슈 해결 |
| **Capacity Reservations** | 특정 AZ의 용량 예약 | 할인 없음, 오직 용량 확보 목적 |

### 상세 비교
- **On-Demand**: 리눅스/윈도우는 초 단위 청구 (최소 60초). 약정 없음.
- **Reserved Instance (RI)**:
	- **Standard RI**: 변경 불가, 할인율 높음
	- **Convertible RI**: 인스턴스 유형/OS 변경 가능, 할인율 다소 낮음 (최대 66%)
- **Savings Plans**: 인스턴스 패밀리, 리전, OS 등에 유연하게 적용 가능 (최대 72% 할인).
- **Spot Instance**: AWS에서 가장 저렴하지만 신뢰성이 낮음. 중단 가능성 있음.
