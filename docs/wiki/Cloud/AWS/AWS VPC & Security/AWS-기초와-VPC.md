---
slug: "AWS-기초와-VPC"
---
# AWS 기초와 VPC


# AWS VPC?

Amazon Virtual Private Cloud(Amazon VPC)를 이용하게 되면, 사용자가 정의한 가상 네트워크로 AWS 리소스를 시작할 수 있다.

이 가상 네트워크로 AWS 리소스를 시작할 수 있다.

이 가상 네트워크는 AWS의 확장 가능한 인프라를 사용한다는 이점과 함께 고객의 자체 데이터 센테에서 운영하는 기존 네트워크와 매우 유사하다.

## VPC 의 특징

- 계정 생성 시 default VPC를 만들어준다
- EC2, RDS, S3 등의 서비스 활용 가능
- 서브넷 구성
- 보안 설정(IP block, inbound outbound 설정)
- VPC Peering(VPC 간의 연결)
- IP 대역 지정 가능
- VPC는 하나의 Region 에만 속할 수 있다(다른 Region으로 확장 불가)

# Availablity Zone

![Untitled.png](/img/이미지 창고/Untitled.png)
- 물리적으로 분리되어 있는 인프라가 모여 있는 데이터 센터
- 각 AZ는 일정 거리 이상 떨어져 있음
- 하나의 리전은 2개 이상의 AZ로 구성됨
    - 지역에 천재지변을 대비하는 백업 용 AZ
- 각 계정의 AZ는 다른 계정의 AZ와 다른 아이디를 부여 받음

# VPC 전체 구성 요소

![Untitled-1.png](/img/이미지 창고/Untitled-1.png)

## Subnet

![Untitled-2.png](/img/이미지 창고/Untitled-2.png)
- VPC의 하위 단위(subnet+network)
- 하나의 AZ에서만 생성 가능하다.
- 하나의 AZ에는 여러개의 subnet을 생성 가능하지만, 왼쪽의 예시는 불가능하다.

![Untitled-3.png](/img/이미지 창고/Untitled-3.png)
### Private subnet

- 인터넷에 접근 불가능한 subnet

### Public subnet

- 인터넷에 접근 가능한 subnet

크게 본다면

**Regin(VPC(AZ(Subnet)))**

의 개념으로 생각하면 된다.

### Ex)

![Untitled-4.png](/img/이미지 창고/Untitled-4.png)
### CIDR

- 하나의 VPC 내에 있는 여러 IP주소를 각각의 Subnet으로 분리/분배하는 방법

- 1번째 서브넷 : 211.11.124.0/26 (211.11.124.0 ~ 211.11.124.63)
- 2번째 서브넷 : 211.11.124.64/26 (211.11.124.64 ~ 211.11.124.127)
- 3 번째 서브넷 : 211.11.124.128/26 (211.11.124.128 ~ 211.11.124.191)
- 4 번째 서브넷 : 211.11.124.192/26 (211.11.124.192 ~ 211.11.124.255)

## Internet Gateway (IGW)

![Untitled-5.png](/img/이미지 창고/Untitled-5.png)
- 인터넷으로 나가는 통로
- Private subnet은 IGW로 연결되어 있지 않다.
    - 말 그대로 private 하기 때문에, 외부 공용 망에 연결되어 있으면 이 subnet은 private이 아닌 public subnet이다.

## Route table

![Untitled-6.png](/img/이미지 창고/Untitled-6.png)
- 트래픽이 어디를 가야 할지 알려주는 테이블
- VPC 생성 시 자동으로 만들어준다.
    - 10.0.0.0/16(10.0.0.0 ~ 10.0.255.255까지) → Local로 연결해준다.
    - 나머지는 IGW(인터넷으로 연결해준다.)

![Untitled-8.png](/img/이미지 창고/Untitled-8.png)
> **Public Route Table**
> 
- **Local** or **Internet** or **Inner** 인지 알려주는 신호등과 비슷한 역할을 한다.

> **Private Route Table**
> 
- private route table일 경우에는 외부 IP가 접근 할 때는 Route Table에서 막힌다.

## NACL(Network Access Control List)/Security Group

![Untitled-8.png](/img/이미지 창고/Untitled-8.png)
- 보안 검문소
- NACL → Stateless, SG → Statefull
- Access Block은 NACL에서만 가능하다.

### **Statefull, Stateless**

### **Statefull**

![Untitled-9.png](/img/이미지 창고/Untitled-9.png)
- 상태 유지라는 뜻을 가진다.
- 네트워크에서 상태를 유지한다는 뜻은, Port를 기억한다는 뜻으로 해석된다.
- 접근하려는 Port가 인바운드 혹은 아웃바운드 둘 중 한개라도 접속에 성공해서 응답을 받거나 혹은 요청을 했다면,
- 그에 Port를 기억하여 다시 요청 혹은 응답을 허가해주는 것을 의미한다.
- 즉 유동적으로 접속된 Port에 한해서 요청 응답을 풀어주는 것이다.

### **Stateless**

![Untitled-10.png](/img/이미지 창고/Untitled-10.png)
- 무상태라는 뜻을 가진다.
- 네트워크에서 상태가 없다는 뜻으로 **Statefull**과는 달리 Port를 기억하지 않는다.
- 접근하려는 Port가 인바운드에 설정되어있어, 요청을 보내도,
- 아웃바운드가 설정 되지 않는 Port라면 응답을 해주지 않는다.

## NAT(Network Address Translation) instance/gateway

### NAT의 필요성

- Private 한 인스턴스에 예를 들면, DB를 설치하였다.
- 이때 DB에 대한 업데이트 혹은 DB설치를 해야한다. 하지만, 외부망에 연결되어 있지 않기 때문에, 이에 대한 문제가 생긴다.
- 외부 망이 매일 필요한 것은 아니지만, 위의 상황이 생길수도 있기 때문에 가끔은 필요하다.
    - 그래서 Route Table 잠깐 IGW를 설정해주면 안되나?
    - 안된다. 그렇게 설정할거면 Private Subnet을 설정한 이유가 전혀 없다.
- 그렇기 때문에 이때를 위해서 NAT을 사용한다.

![Untitled-11.png](/img/이미지 창고/Untitled-11.png)
- 위 그림을 보면 이해가 쉽다.
- Private Subnet에서는 인테넷이 접근이 되지 않기 때문에 내부 망인 Public Subnet을 이용한다.
- 이를 이용해서 원하는 DB 프로그램 등을 대신 다운 받게한다.(public subnet에 접근 후 ssh 등과 같이 private으로 접근 후에 다운 받게 하면 된다.)

![Untitled-12.png](/img/이미지 창고/Untitled-12.png)
Request

![Untitled-13.png](/img/이미지 창고/Untitled-13.png)
Response

- Pricate subnet안에 있는 pricate instance가 외부의 인터넷과 통신하기 위한 방법
- **NAT gateway**는 우회에 특화된 서비스 이며, AWS에서 제공하는 서비스이다.
- **NAT instance**는 EC2 instance 이기 때문에 private instance하나, public instance하나 총 두대의 인스턴스로 활용하는 것이다.
    - NAT instance는 Public Subnet에 위치해 있어야한다.

## Bastion host

이번에는 반대로 관리자가 private subnet으로 접근하는 방법인 bastion host이다.ㅋ

![Untitled-14.png](/img/이미지 창고/Untitled-14.png)
- private subnet은 외부에 있는 관리자가 접근 할 수 없다.
- Bastion host를 이용하게 되면 접근 가능해진다. NAT과 유사한 점이 많이 있다.

![Untitled-15.png](/img/이미지 창고/Untitled-15.png)

- Private Instance에 접근하기 위한 수단이다.
- Public subnet 내에 위치한 EC2를 거쳐서 내부 망으로 접근 후에 Private Subnet에 있는 Private Instance를 접근한다.

## VPC EndPoint

![Untitled-15.png](/img/이미지 창고/Untitled-15.png)
- VPC 엔드포인트를 통해 인터넷 게이트웨이, NAT 디바이스, VPN 연결 또는 AWS Direct Connect 연결을 필요로 하지 않고
- AWS Private Link 구동 지원 AWS 서비스 및 VPC 엔드포인트 서비스에 비공개로 연결 가능하다.
- VPC의 인스턴스는 서비스의 리소스와 통신하는데 퍼블릭 IP 주소를 필요로 하지 않는다.
- VPC와 기타 서비스 간의 트래픽은 Amazon 네트워크를 벗어나지 않는다.

### VPC Endpoint

- AWS의 여러 서비스들과 VPC를 연결 시켜주는 중간 매개체
    - AWS에서 VPC 바깥으로 트래픽이 나가지 않고 aws의 여러 서비스를 사용하게끔 만들어주는 서비스
    - Private subnet 같은 경우는 격리된 공간인데, 그 상황에서도 aws의 다양한 서비스들(s3, dynamodb, athena 등)
     연결할 수 있도록 지원하는 서비스

### Interface Endpoint

![Untitled-16.png](/img/이미지 창고/Untitled-16.png)
Private IP를 만들어 서비스를 연결해줌(SQS, SNS, Kinesis, Sagemaker 등 지원)

### Gateway Endpoind

![Untitled-17.png](/img/이미지 창고/Untitled-17.png)
라우팅 테이블에서 경로의 대상으로 지정하여 사용(S3, Dynamodb 지원)

```bash
aws s3 ls --region ap-northeast-2
# 현재 내가 가지고 있는 aws s3 를 ls 해달라
```

---

#AWS #AWS_VPC

---