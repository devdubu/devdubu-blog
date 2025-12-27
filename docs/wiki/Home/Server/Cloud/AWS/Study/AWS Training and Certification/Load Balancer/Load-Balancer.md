---
sticker: vault//이미지/미분류/AWS Icon/Architecture-Service-Icons_02072025/Arch_Networking-Content-Delivery/32/Arch-Elastic-Load-Balancing-32.svg

slug: "Load-Balancer"
---
# Scalability & High Availability
## Scalability
:::note Scalability?
- 어플리케이션 혹은 시스템이 조정을 통해서 더 많은 양을 처리할 수 있다는 뜻이다.
:::

- 여기에 두 가지 종류의 확장성에 대한 개념이 있습니다.
	- Vertical Scalability
	- Horizontal Scalability(elastic)
- 확장성과 고가용성은 비슷해보이나, 다른 개념입니다.

## Vertical Scalability
![Pasted-image-20230829132327.png](/img/이미지 창고/Pasted-image-20230829132327.png)
:::tip 수직 확장성은 인스턴스의 크기를 확장하는 것을 의미합니다.

:::

 - 만약 EC2를 사용할 때 애플리케이션이 t2.micro로 구동 된다면,
	- 해당 애플리케이션을 확장해서 t2.large에서 구동 하게끔 만들고자 하는 것입니다.
- 해당 수직적 확장성은 데이터베이스와 같이 <mark>분산 되지 않은 시스템</mark>에서 흔히 사용됩니다. 
	- RDS, ElastiCache등의 데이터베이스에서 쉽게 찾아볼 수 있습니다.
	- 이 서비스들은 하위 인스턴스의 유형을 업그레이드 해서 수직적으로 확장 할 수 있는 시스템들 입니다.
- 일반적으로 확장할 수 있는 정도는 한계가 있습니다.

## Horizontal Scalability
![Pasted-image-20230829132723.png](/img/이미지 창고/Pasted-image-20230829132723.png)
:::tip 수평 확장성은 애플리케이션에서 인스턴스나 시스템의 수를 늘리는 방법입니다.
:::

- 수평 확장을 했다는 것은 분배 시스템이 있다는 것을 의미합니다.
- 웹이나 현대적 애플리케이션은 대부분 분배 시스템으로 이루어져 있습니다.
- EC2 환경은 수평적 확장을 더욱 쉽게 해주게 됩니다.

# High Availability
:::warning 고가용성은 수평 확장 함께 사용되는 개념이지만, 늘 그런 것은 아닙니다.

:::

:::tip High Availablility
- 애플리케이션 또는 시스템을 적어도 둘 이상의 AWS의 AZ나 데이터 센터에서 가동 중이라는 걸 의미합니다.
:::

- 고가용성의 목표는 데이터 센터에서의 손실에서 살아남는 것으로,
- 센터 하나가 멈춰도 계속 작동이 가능 하게 끔 하는 것입니다.

- AWS RDS Multi AZ를 갖추고 있을 때, <mark>수동형 고가용성</mark>을 확보하고 있다고 말합니다.
- 수평 확장을 하는 것은 <mark>능동형 고가용성</mark> 확보라고 말합니다.

## High Availability & Scalability For EC2
### Vertical Scaling
- 인스턴스의 사이즈를 스케일업 혹은 스케일 다운 하는 작업
	- From : t2.nano - 0.5G of RAM, 1 vCPU
	- To : u-12tb1.metal - 12.3 TB of RAM 448vCPU
### Horizontal Scaling
- 인스턴스의 수를 늘리는 작업 - 스케일 아웃 / 인
	- Auto Scaling Group
	- Load Balancer
### High Availability
- 동일 애플리케이션의 동일 인스턴스를 다수 AZ에 걸쳐 실행하는 경우를 의미합니다.
- 다중 AZ가 활성화 된 Auto Scaling Group이나 Load Balancer에서도 사용됩니다.

# Elastic Load Balancer
:::note What is load balancing?
- 서버 혹은 서버셋으로 트래픽을 백엔드나 다운스트림 EC2 인스턴스 또는 서버들로 전달하는 역할을 합니다.
:::

![Pasted-image-20230829150628.png](/img/이미지 창고/Pasted-image-20230829150628.png) 
### Why use Load Balancer?
- 부하를 다수의 다운 스트림 인스턴스로 분산하기 위해서이다.
- 애플리케이션의 단일 액세스 지점(DNS)을 노출하게 되고, 다운스트림 인스턴스의 장애를 원할히 처리 할 수 있다.
- 로드 밸런서가 상태 확인 매커니즘으로 어떤 인스턴스로 트래픽을 보낼 수 없는지 확인해 준다.
- 인스턴스의 상태를 확인할 수 있는 것이죠
- SSL 종료도 할 수 있고, 웹 사이트에 암호화된 HTTPS 트래픽을 가질 수 있습니다.
- 쿠키로 Enforce stickiness 를 할 수있다.
- 영역에 걸친 고가용성을 가지며, 클라우드 내에서 개인 트래픽과 공공 트래픽을 분리할 수도 있습니다.
:::note Elastic Load Balancer
- AWS 가 관리하며, 어떤 경우애도 작동할 것을 보장합니다.
- AWS가 업그레이드와 유지 관리 및 고가용성을 책임지며,
- 로드 밸런서의 작동 상식을 수정할 수 있게끔 일부 구성 knob도 제공합니다.
:::

- Elastic Load Balancer는 무조건 쓰는 편이 좋다.
- 자체 LB를 마련하는 것보다 저렴하고, 
	- 직접 LB를 마련하게 된다면 확장성 측면에서 굉장히 번거롭기 때문입니다.
- 또한 LB는 다수의 AWS 서비스들과 통합 되어 있습니다.
	- EC2, EC2 Auto Scaling Groups, Amazon ECS
	- AWS Certificate Manager (ACM), CloudWatch
	- Route 53, AWS WAF, AWS Global Accelerator

## Health Checks
![Pasted-image-20230829151501.png](/img/이미지 창고/Pasted-image-20230829151501.png)
- 상태 확인은 Elastic Load Balancer가 EC2 인스턴스의 작동이 올바르게 되고 있는지의 여부를 확인하기 위해 사용됩니다.
- 만약 제대로 작동되지 않는다면, 해당 인스턴스로 트래픽을 보낼 수 없기 때문에, 
- 로드 밸런서에겐 인스턴스의 상태가 아주 중요합니다.
- 상태 확인은 포트와 라우트에서 이뤄집니다.
- 만약 애플리케이션의 response가 200(OK)로 응답하지 않는다면
	- 인스턴스 상태가 좋지 않다고 기록됩니다.
	- ELB는 해당 인스턴스로 트래픽을 보내지 않게 됩니다.

## Type of Load Balancer on AWS
![Pasted-image-20230829152253.png](/img/이미지 창고/Pasted-image-20230829152253.png)
:::note AWS에는 4 종류의 관리형 로드 밸런서가 있습니다.
:::

### Classic Load Balancer
- 기존 세대 혹은 V1 이라고도 하며, 2009년도에 만들어졌습니다.
- HTTP, HTTPS, TCP. SSL과 Secure TCP를 지원합니다.
- 해당 리소스는 AWS에서 사용을 권장하고 있지 않습니다.


### [Application Load Balancer](../../../../../../../2. Server/Cloud/AWS Training and Certification/EC2/Load Balancer/Application-Load-Balancer.md)
- 신형 로드 밸런서 이며, 2016년에 만들어졌습니다.
- HTTP, HTTPS, WebSocket 프로토콜을 지원합니다.

### [이미지/미분류/Cloud/AWS Training and Certification/EC2/Load Balancer/Network Load Balancer](이미지/미분류/Cloud/AWS Training and Certification/EC2/Load Balancer/Network Load Balancer) 
- 신형 로드 밸런서이며, 2017년에 만들어졌습니다.
- TCP, TLS, secure TCP와 UDP프로토콜을 지원합니다.

### [Gateway Load Balancer](../../../../../../../2. Server/Cloud/AWS Training and Certification/EC2/Load Balancer/Gateway-Load-Balancer.md)
- 2020년에 출시한 로드 밸런서 입니다. ( GWLB )
- 네트워크층에서 작동하므로, 3계층과 IP 프로토콜에서 작동하는 것입니다.

:::quote 기능이 제일 많은 신형 로드 밸런서를 사용하는 것을 권장 드립니다.
:::

- 일부의 로드 밸런서들은 내부에서 설정될 수 있습니다.
- 네트워크에 개인적으로 접근이 가능하고, 웹사이트와 공공 애플리케이션 모두에 사용이 가능한 외부 공공 로드 밸런서도 있습니다.

## Load Balancer Security Group
![Pasted-image-20230829170037.png](/img/이미지 창고/Pasted-image-20230829170037.png)
- 유저는 HTTP나 HTTPS를 사용해 어디서든 로드 밸런서에 접근이 가능합니다.
	- 그렇기 때문에 아래와 같이 SG가 설정될 겁니다.
![Pasted-image-20230829170230.png](/img/이미지 창고/Pasted-image-20230829170230.png)
- 여기서 EC2 &lt;-> ELB는 EC2에서만 오는 트래픽을 허용 해야하기에, 아래와 같이 SG를 구성한다.
![Pasted-image-20230829170443.png](/img/이미지 창고/Pasted-image-20230829170443.png)
