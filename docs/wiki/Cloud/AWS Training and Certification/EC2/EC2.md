- [AWS 예산 설정](#AWS 예산 설정)
		- [AWS Billing Dashboard](#AWS Billing Dashboard)
		- [청구된 비용 알림](#청구된 비용 알림)
- [Amazon EC2](#Amazon EC2)
- [EC2 sizing & configuration options](#EC2 sizing & configuration options)
	- [EC2 User Data](#EC2 sizing & configuration options#EC2 User Data)
		- [BootScript](#EC2 User Data#BootScript)
- [EC2 인스턴스 타입](#EC2 인스턴스 타입)
	- [AWS 인스턴스 네이밍 규칙](#EC2 인스턴스 타입#AWS 인스턴스 네이밍 규칙)
		- [범용의 인스턴스 - General Purpose](#AWS 인스턴스 네이밍 규칙#범용의 인스턴스 - General Purpose)
			- [Usecase](#범용의 인스턴스 - General Purpose#Usecase)
		- [컴퓨팅 최적화 인스턴스 - Compute Optimized](#AWS 인스턴스 네이밍 규칙#컴퓨팅 최적화 인스턴스 - Compute Optimized)
			- [Usecase](#컴퓨팅 최적화 인스턴스 - Compute Optimized#Usecase)
		- [메모리 최적화 - Mermoy Optimized](#AWS 인스턴스 네이밍 규칙#메모리 최적화 - Mermoy Optimized)
			- [Usecase](#메모리 최적화 - Mermoy Optimized#Usecase)
		- [스토리지 최적화 인스턴스 - Storage Optimized](#AWS 인스턴스 네이밍 규칙#스토리지 최적화 인스턴스 - Storage Optimized)
			- [Usecase](#스토리지 최적화 인스턴스 - Storage Optimized#Usecase)
		- [인스턴스 타입 : 예시](#AWS 인스턴스 네이밍 규칙#인스턴스 타입 : 예시)
- [Security Group](#Security Group)
	- [Security Group Diagram](#Security Group#Security Group Diagram)
		- [Inbound](#Security Group Diagram#Inbound)
		- [Outbound](#Security Group Diagram#Outbound)
	- [Security Groups에 알아두면 좋을 점](#Security Group#Security Groups에 알아두면 좋을 점)
	- [Referencing other security groups Diagram](#Security Group#Referencing other security groups Diagram)
		- [inbound](#Referencing other security groups Diagram#inbound)
	- [Port](#Security Group#Port)
- [SSH Summary Table](#SSH Summary Table)
	- [Mac / Linux](#SSH Summary Table#Mac / Linux)
- [EC2 구매 옵션](#EC2 구매 옵션)
		- [EC2 On Demand](#Mac / Linux#EC2 On Demand)
			- [추천](#EC2 On Demand#추천)
		- [EC2 Reserved Instance](#Mac / Linux#EC2 Reserved Instance)
			- [추천](#EC2 Reserved Instance#추천)
		- [Convertible Reserved Instance](#Mac / Linux#Convertible Reserved Instance)
	- [EC2 Savings Plan](#EC2 구매 옵션#EC2 Savings Plan)
	- [EC2 Spot Instances](#EC2 구매 옵션#EC2 Spot Instances)
	- [EC2 Dedicated Hosts](#EC2 구매 옵션#EC2 Dedicated Hosts)
	- [EC2 Dedicated Instances](#EC2 구매 옵션#EC2 Dedicated Instances)
	- [EC2 Capacity Reservations](#EC2 구매 옵션#EC2 Capacity Reservations)

# AWS 예산 설정
- Billing 예산을 설정하여, 돈을 지출할 알람이 오도록 설정하는 방법입니다.
![Pasted-image-20230704180548.png](/img/이미지 창고/Pasted-image-20230704180548.png)
- 왼쪽 상단에 `Billing Dashboard`를 클릭합니다.
![Pasted-image-20230704180759.png](/img/이미지 창고/Pasted-image-20230704180759.png)
- 현재 관리자 계정임에도 불구하고, Billing Dashboard가 활성화 되지 않는 모습을 볼 수 있습니다.
- 해당 DashBoard는 오직 Root 계정 만이 활성화 할 수 있고, 설정 할 수 있습니다.
![Pasted-image-20230704181228.png](/img/이미지 창고/Pasted-image-20230704181228.png)
- Root 계정으로 접근하게 된다면, 위와 같은 화면이 뜨게 됩니다.
![Pasted-image-20230704181712.png](/img/이미지 창고/Pasted-image-20230704181712.png)
![Pasted-image-20230704181736.png](/img/이미지 창고/Pasted-image-20230704181736.png)
- 해당 란을 내리게 된다면, 아래와 같이 `IAM user and role access to Billing information` 이라는 란이 있습니다.
- 해당 설정을 활성화 하고, IAM 사용자로 돌아가서 이 페이지를 새로 고치면 됩니다.

### AWS Billing Dashboard
- 만약 어떤 부분에서 과금이 부과 됐는지 확인해보려면 왼쪽 상단에 `Bills`를 클릭합니
![Pasted-image-20230705084523.png](/img/이미지 창고/Pasted-image-20230705084523.png)
![Pasted-image-20230705084727.png](/img/이미지 창고/Pasted-image-20230705084727.png)
- 어떤 서비스에서 얼마나 부과 됐는지 뜨는 화면입니다.

### 청구된 비용 알림
![Pasted-image-20230705084955.png](/img/이미지 창고/Pasted-image-20230705084955.png)
- 왼쪽 메뉴란에 `Free tier` 를 클릭합니다.
- 가장 좋은 방법은 예산을 설정하는 것 입니다.
- 왼쪽 메뉴에 `Budgets`으로 들어갑니다.
![Pasted-image-20230705085430.png](/img/이미지 창고/Pasted-image-20230705085430.png)
![Pasted-image-20230705085509.png](/img/이미지 창고/Pasted-image-20230705085509.png)
- Create budget을 누르면, 한도에 도달하려고 한다면 알림을 받을 수 있습니다.
![Pasted-image-20230705085840.png](/img/이미지 창고/Pasted-image-20230705085840.png)
- AWS `Zero spend budget`을 선택하게 된다면, 프리티어 한도를 초과하는 순간 알림을 보내줍니다.
![Pasted-image-20230705091341.png](/img/이미지 창고/Pasted-image-20230705091341.png)
- 위의 화면과 같이 구성할 수 있습니다.
- `Thresholds`에서 `Exceeds`라고 뜬 상태는 이미, 해당하는 요금이 넘었다는 상태입니다.

# Amazon EC2
![Pasted-image-20230705091629.png](/img/이미지 창고/Pasted-image-20230705091629.png)
- EC2는 AWS가 제공하는 서비스에서 가장 많이 사용되는 것 중에 하나 입니다.
- EC2 = Elastic Compute Cloud = **Infrastructure as a Service**
- EC2는 여러 기능을 포괄하는 개념입니다.
	- **EC2** : 가상 머신을 임대 할 수 있고, 이를 EC2 인스턴스 라고 부릅니다.
	- **EBS** : 볼륨이라는 가상 드라이브에 데이터를 저장할 수 있습니다.
	- **ELB** : 여러 로드를 분산 시키는 Elastic Load Balancing
	- **ASG** : Auto Scaling Group을 통해서 서비스를 자동으로 확장 시켜줍니다. 

:::tip EC2의 방식을 이해해야, AWS Cloud 작동 방식을 이해할 수 있습니다.

:::

# EC2 sizing & configuration options

- EC2가 사용하는 OS
	- **Linux**, Windows or Mac OS
	- **CPU**의 **종류**와 **코어 수**를 선택할 수 있습니다.
	- **RAM**도 선택이 가능합니다.
	- 스토리지 용량도 선택 가능합니다.
		- 네트워크를 통한 스토리지 연결(**EBS** & **EFS**)
		- 하드웨어를 통한 스토리지(**EC2 Instance Store**)
	- EC2 인스턴스에 연결할 네트워크 유형도 선택 할 수 있다.
		- 네트워크 카드 속도 및 사용할 공개 IP를 설정할 수 있다.
	- EC2의 방화벽 규칙도 정의 할 수 있다.
		- security group
	- Bootstrap script(configure at first launch) : EC2 User Data

:::tip 가상 머신은 다양한 부분을 선택 할 수 있으며, AWS 에서 임대 할 수 있는 것입니다.

:::

## EC2 User Data
- EC2 사용자 데이터를 이용해 인스턴스 Bootstraping 할 수 있습니다.
:::quote bootstrapping?
-  머신이 시작할 때 명령을 실행하는 것이다.
- 해당 스크립트는 인스턴스가 켜진 후에, 한번만 실행하는 명령을 말한다.
:::

- EC2 user data는 특정한 용도가 있습니다.
	- 부팅 작업을 자동화한다는 것입니다.
	- Installing updates
	- Installing software
	- Downloading common files from the internet
	- Anything you can think of
	- 무엇이든 가능하다.
- EC2 User Data는 Root 사용자로 실행 됩니다.
	- 따라서 pseudo 권한으로 명령을 실행하게 됩니다.

:::warning User Data Script가 많아지면 많아질수록 부팅이 느려진다.


:::

### BootScript
- EC2를 생성하게 된다면, 맨 아래에 `Advanced details`를 확장한 후 맨 밑에
![Pasted-image-20230706084914.png](/img/이미지 창고/Pasted-image-20230706084914.png)
![Pasted-image-20230706085013.png](/img/이미지 창고/Pasted-image-20230706085013.png)
- 해당 란에 처음 시작 시에, 실행하는 script를 작성하면 됩니다.


# EC2 인스턴스 타입
![Pasted-image-20230705095714.png](/img/이미지 창고/Pasted-image-20230705095714.png)
- [EC2 인스턴스 타입](https://aws.amazon.com/ko/ec2/instance-types/)
## AWS 인스턴스 네이밍 규칙
- 인스턴스 네이밍에도 규칙이 있습니다.
- 아래의 사진으로 예를 들겠습니다.
![Pasted-image-20230706090829.png](/img/이미지 창고/Pasted-image-20230706090829.png)
- **m** : 인스턴스 Class
	- 해당 인스턴스 클래스는 범용 인스턴스 클래스 입니다.
- **5** : Generation
	- AWS가 새로운 세대의 하드웨어를 출시하고, 개선하게 된다면, 다음 숫자가 된다.
- **2xlarge** : 인스턴스 클래스의 크기를 나타냅니다.

### 범용의 인스턴스 - General Purpose
- 웹 서버나 코드 저장소와 같은 다양한 작업에 적합합니다.
	- CPU
	- Memory
	- Networking
- 등 밸런스가 골고루 잡혀있는 인스턴스이다.

#### Usecase
- 그렇기 때문에 해당 강의에서는 범용의 인스턴스를 사용하며, 사이즈는 `t2.micro`를 사용할 것이다.
	- free tier 때문
	- 현재는 `t3.micro`로 버전이 업그레이드 됐다.
![Pasted-image-20230706091738.png](/img/이미지 창고/Pasted-image-20230706091738.png)

### 컴퓨팅 최적화 인스턴스 - Compute Optimized
- 컴퓨터 집약접인 작업에 최적화된 인스턴스 입니다.

#### Usecase
- 고성능 프로세서를 위주로 사용하며,
	- 일부 데이터의 일괄 처리에 사용하거나
	- 미디어 트랜스코딩 작업 시
	- 고성능 웹 서버가 필요할 때
	- 고성능 컴퓨팅이라는 HPC 작업을 할 때
	- 머신 러닝 혹은 전용 게임 서버가 있을 때 사용합니다.
![Pasted-image-20230706091750.png](/img/이미지 창고/Pasted-image-20230706091750.png)

### 메모리 최적화 - Mermoy Optimized
- 이 유형의 인스턴스는 메모리에서 대규모 데이터 셋 처리하는 유형의 작업에 빠른 성능을 제공한다.

#### Usecase
- 인 메모리 데이터베이스가 되는 고성능의 관계형 또는 비 관계형의 데이터 베이스에 사용됩니다.
- 엘라스틱 캐쉬로 예를 들 수 있는 분산 웹 스케일 캐시 저장소에도 사용합니다.
- 비즈니스 인텔리전스(business intelligence)에 최적화된 인 메모리 데이터 베이스와 대규모 비정형 데이터의 실시간 처리를 실행하는 애플리케이션에도 사용합니다.
![Pasted-image-20230706093928.png](/img/이미지 창고/Pasted-image-20230706093928.png)
- Memory 최적화는 RAM의 앞자를 따서 네이밍을 한다.
	- 이것과는 별개로, X1이나 대용량 메모리 Z1도 있습니다.

### 스토리지 최적화 인스턴스 - Storage Optimized
- 로컬 스토리지에서 대규모의 데이터 셋에 액세스할 때 적합한 인스턴스 입니다.

#### Usecase
- 고주파 온라인 트랜잭션 처리인 OLTP 시스템에 사용됩니다.
- 관계형과 비 관계형인 NoSQL 데이터 베이스에 사용합니다.
- Redis와 같은 메모리 데이터 베이스의 캐시
- 데이터 웨어 하우징 애플리케이션(data warehousing applications) 
- 분산 파일 시스템에 사용됩니다.

![Pasted-image-20230706093846.png](/img/이미지 창고/Pasted-image-20230706093846.png)

### 인스턴스 타입 : 예시

| Instance | vCPU | Mem(GiB) | Storage | Network Performance |  EBS Bandwidth(Mbps) |
| -- | -- | -- | -- | -- | -- |
| t2.micro | 1 | 1 | EBS-Only | Low to Moderate | |
| t2.xlarge | 4 | 16 | EBS-Only | Moderate | |
| c5d.4xlarge | 16 | 32 | 1 x 400 NVMe SSD | Up to 10 Gbps | 4,750 |
| r5.16xlarge | 64 | 512 | EBS Only | 20Gbps | 13,600 | 
| m5.8xlarge | 32 | 128 | EBS Only | 10Gbps | 6,800 |
- [Instanace 비교 사이트](https://instances.vantage.sh/)

# Security Group
:::info Secruity Group?
- AWS의 firewall의 역할이다.
- Security Group은 AWS 클라우드 보안을 실현하는 가장 기본적인 기능입니다.
- Security Group은 인바운드 및 아웃바운드 트래픽을 제어합니다.
:::

- Security Group은 허용하는 규칙을 포함한다.
- Security Group 규칙은 컴퓨터가 위치한 IP주소를 참조하거나 다른 보안 그룹을 참조할 수 도 있습니다.
	- 즉, 보안 그룹이 서로 참조하는 것도 가능합니다.
- Security Group은 EC2 인스턴스의 firewall이라고 불린다.
	- Port 접근 제어
	- 인증된 IP 범위인지 확인
	- 외부 -> 인스턴스 (inbound network)
	- 인스턴스 -> 외부 (outbount network)
![Pasted-image-20230713090829.png](/img/이미지 창고/Pasted-image-20230713090829.png)

## Security Group Diagram
![Pasted-image-20230713091555.png](/img/이미지 창고/Pasted-image-20230713091555.png)
### Inbound
- 위의 상황은 개인 컴퓨터에서는 22번 포트가 뚫려 있는 상황입니다.
	- 위의 inbound 규칙에 인증되지 않는 22번 포트는 접속 되지 않습니다.
	- firewall이 해당 부분을 막고, timeout이 됩니다.
### Outbound
- outbound 는 모든 트래픽을 허용하였고, 모든 포트를 허용했습니다.

## Security Groups에 알아두면 좋을 점
- Security Group은 여러 개의 인스턴스에 붙일 수 있다.
- 하지만, Region, VPC당 한 개씩 만들어야 합니다..
- Security Group은 EC2 인스턴스 외부에 있어서, 트래픽이 차단되면 이를 확인 할 수 없습니다.
- EC2 자체 방화벽이 아닌, 외부에 있는 방화벽인 셈이다.
- **SSH 전용으로 별도의 보안 그룹을 관리하는 것 좋다**
	- SSH 접속에 대한 부분은 매우 복잡하며, 인증 과정을 거쳐야 하므로, 해당 Security Group은 분리해서 관리하는 것이 편하다
- 만약 timeout 이 걸린다면 대부분은 Security Group의 문제이다.
- 만약 Connetion refuse를 받게 된다면, Security Group은 작동이 되었고, 트래픽은 통과되었지만, 애플리케이션의 오류가 있거나 실행되지 않았거나 다른 원인이 있어 연결 거부 메시지가 뜨게 된겁니다.

:::danger 모든 inbound 트래픽은 막는 것이 기본

:::

:::success 모든 outbound 트래픽은 허용하는 것이 기본

:::

## Referencing other security groups Diagram
- 아래의 그림은 하나의 Security Group이 다른 Security Group을 참조하는 방식을 다이어 그램으로 그린 것입니다.
![Pasted-image-20230713094329.png](/img/이미지 창고/Pasted-image-20230713094329.png)
### inbound
- 위의 다이어그램은 Security Group1은 Security Group1과 Security Group2를 허용합니다.
- 그렇기 때문에 Security Group1, Security Group2를 가지고 있는 인스턴스는 허용되지만, Security Group3를 가진 인스턴스는 허용되지 않습니다.

## Port

| port number | Name | Description|
| -- | -- | -- |
|22|SSH| Secure Shell - log into a Linux Instance|
|21|FTP| File Transfer Protocol - upload files into a file share|
|22|SFTP| Secure File Transfer Protocol - upload files using SSH|
|80| HTTP | access unsecured websites|
|443| HTTPS| acess secureed websites|
|3389| RDP | Remote Desktop Protocol - log into a Window instance|

# SSH Summary Table 
- 클라우드의 유지 관리나 작업을 위해 서버 내부에 연결하는 작업 입니다.
- 리눅스 서버에는 SSH, 보안 셸을 통해 서버에 연결합니다.
![Pasted-image-20230713100423.png](/img/이미지 창고/Pasted-image-20230713100423.png)
- 위 사진은 SSH 접속을 위해서 사용되는 도구를 나탸냅니다.

## Mac / Linux 
- Linux or Mac 컴퓨터에서 EC2인스턴스에 SSH로 접속하는 방법
![Pasted-image-20230713101044.png](/img/이미지 창고/Pasted-image-20230713101044.png)

# EC2 구매 옵션

| EC2 옵션 | 설명 |
| -- | --|
|On-Demand Instance | 요청에 따라 언제든지 인스턴스를 실행할 수 있어서 단기 워크로드에 잘 어울립니다. 가격 예측이 쉬우며, 초당으로 요금을 부과 받습니다.|
| Reserved | 1 & 3 년의 예약  - 오래 사용하는 유저에게 적합|
|| Reserved Instance - Long Workloads  |
|| Convertible Instance - long workloads with flexible instance - 전환형 인스턴스 |
| Saving Plan| (1 & 3 ysers) 현대적인 요금 모델입니다. 인스턴스 유형 약정이 아니라 특정 사용량을 약정하여 지불하는 방식 | 
| Spot Instance | 아주 짧은 단기 워크로드용 인스턴스로 상당히 저렴하지만, 언제든지 인스턴스를 손실 할 수 있습니다 신뢰성이 낮습니다 |
| Dedicated Hosts | 물리적 서버 전체를 예약하고, 인스턴스 배치를 제어할 수 있습니다. 그리고 전용 인스턴스란 하드웨어를 공유하지 않는 것을 뜻합니다. |
| Capacity Reservations | 특정한 AZ의 용량을 원하는 기간 동안 예약할 수 있습니다.|

### EC2 On Demand
- OS 별 비용 산정 방법
	- Linux or Window 
		- 1분이 지난 이후에는 초당 요금으로 측정한다.
	- All other OS 
		- 시간 당 사용량을 매깁니다
#### 추천
- 연속적인 단기 사용 워크로드 입니다.
- 애플리케이션의 동작을 예측 할 수 없는 워크로드를 추천합니다.

### EC2 Reserved Instance
- 예약 인스턴스는 온디맨드에 비해 비용을 약 72% 절약할 수 있습니다
- 특정 인스턴스 속성을 예약합니다.
	- Instance Type
	- Region
	- Tenancy
	- OS
- 예약 기간으로는 1년 혹은 3년의 약정을 매길 수 있습니다.
	- 부분, 전체 설 결제 없이도 가능하지만, 선 결제가 가장 할인율이 높습니다.
- 특정 리전으로 범위를 지정하거나, 특정 AZ의 용량을 예약하도록 영역을 지정할 수 있습니다.

#### 추천
- 예약 인스턴스에 적합한 곳은 애플리케이션이 안정된 상태로 사용되는 데이터베이스 등입니다.
- 마켓 플레이스에서 얘약 인스턴스를 구매하거나 판매할 수 있습니다,

### Convertible Reserved Instance
- 인스턴스 유형을 변경할 수 있고, 인스턴스 제품군과 운영체제 및 범위, 테넨시가 변경 가능합니다.
- 유연성이 높기 때문에, 66% 할인을 해준다.

## EC2 Savings Plan
- 장기 사용에 따라 할인을 받을 수 있습니다.
	- 예약 인스턴스와 마찬가지로, 70% 가까이 됩니다.
- 시간 당 10달러의 비용을 1년에서 3년동안 약정합니다.
- Saving Plan에서 초과되는 사용량은 온디맨드 가격으로 청구됩니다.
- Saving Plans는 특정 인스턴스 제품군과 리전에 한해서 사용할 수 있습니다.
	- 예를 들어 us-east-1 M5 유형 인스턴스 제품군 등이 있습니다.
- Flexible Across:
	- Instance Size(m5.xlarge, m5.2xlarge)
	- OS(eg. Linux, Windows)
	- Tanancy (Host, Dedicated, Default)

## EC2 Spot Instances
![Pasted-image-20230714122124.png](/img/이미지 창고/Pasted-image-20230714122124.png)
- 스팟 인스턴스는 가장 파격적인 할인을 제공합니다.
- 온디맨드와 비교하여 최대 90%까지 할인합니다.
	- 그러나 인스턴스가 언제든 중단될 수 있다는 단점을 가지고 있습니다.
	- 스팟 인스턴스에 지불하고자 하는 가격보다 스팟 가격이 높으면 인스턴스가 중단 될 것입니다.
- AWS애서 가장 비용 효율적인 인스턴스이고, 서비스가 중단되어도 복구하기 쉬운 워크로드 매우 큰 도움이 됩니다.
	- 배치 작업
	- 데이터 분석
	- 이미지 처리
	- 분산된 워크로드
	- 시작 및 종료 시점이 유동적인 워크로드
- **중요한 작업**이나 **데이터베이스에는 적합**하지 **않습**니다.

## EC2 Dedicated Hosts
- 우리의 요청에 맞춘 EC2 인스턴스 용량을 가진 물리적인 서버입니다.
- 전용 호스트가 필요한 경우
	- 규정 준수 요구 사항이 있거나
	- 기존 서버 결합 소프트웨어 라이센스를 사용해야 할 경우 입니다.
- 이때 비용은 소켓당, 코어당 또한 VM 소프트웨어 라이선스 당 청구 됩니다.
- 이런 경우가 물리적 서버에 액세스하고, 전용 호스트가 필요한 사용 사례 입니다.
	- 전용 호스트 구매 옵션은 온디맨드로 초당 청구되거나
	- 1, 3년 동안 계약할 수 있습니다.
- AWS에서 가장 비싼 옵션 입니다.
	- 실제로 물리적인 서버를 예약하기 때문입니다.

## EC2 Dedicated Instances
- 위의 전용 호스트랑은 다른 개념이다.
- 같은 계정의 다른 인스턴스와 하드웨어를 공유하기도 하는데, 인스턴스 배치는 제어할 수 없다.
![Pasted-image-20230714123506.png](/img/이미지 창고/Pasted-image-20230714123506.png)

## EC2 Capacity Reservations
- 원하는 기간 동안 특정한 AZ에 온디맨드 인스턴스를 예약할 수 있는데, 이후 필요할 때마다 그 용량에 액세스 할 수 있다.
- 시간 약정은 없기에, 용량을 예약하거나 취소 할 수 있다.
- 요금 할인은 없으며, 용량 예약만을 위해서 사용된다.
- 요금을 할인 받기 위해서는 리전 예약 인스턴스 혹 Saving Plan과 결합 해야 합니다.
- 인스턴스 실행 여부와 관계없이 온디맨드 요금이 청구됩니다.
- 용량을 예약하고 거기에 대한 비용을 지불하며, 실행할 인스턴스는 당연히 사용 가능 해야 합니다.
- 실행하지 않더라고 요금은 부과될 것입니다.
- 특정하지 않고, 단기의 연속적인 워크로드에 잘 맞습니다.


---

#AWS #AWS_EC2 #AWS_DEVLOPER 

---
