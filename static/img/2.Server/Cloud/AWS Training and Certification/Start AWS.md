---
slug: "Start-AWS"
---
# AWS Region
![Pasted image 20230629102049.png](../../../Pasted image 20230629102049.png)
- AWS Region은 전세계의 걸쳐서 존재하며, Name은 `us-east-1`, `eu-west-3` ... 으로 표현된다.
- 해당 Region은 DataCenter의 클러스터를 의미한다.

## 어떻게 Region을 선택해야하는가?
- 정답 : 상황마다 다르다.
:::tip AWS 리전 선택에 영향을 미칠 수 있는 요인들
- 법률 준수
- 어떤 정부들은 애플리케이션 배포될 데이터가 국가 내에 보관되길 원한다.
- 지연 시간(latency)
- 대부분의 사용자가 만약 미국에 있는 경우 미국에 데이터 센터가 있는 것이 latency를 줄이는 방법이다. 
- 모든 리전이 모든 기능을 가지고 있지 않다.
- 일부 리전에서는 일부 기능을 사용할 수 없다.
- 요금
- 리전 마다 요금이 달라집니다.

:::

# AWS Availability Zone
- 각 Availablity Zones에는 각 리전에 <mark>보통은 3개</mark>, <mark>적게는 2개</mark>, <mark>많게는 6개</mark>가 존재합니다.
- 예를 들어 `ap-southeast-2`(시드니)를 예를 들면
![Pasted image 20230629102905.png](../../../Pasted image 20230629102905.png)
- `ap-southeast-2a`, `ap-southeast-2b`, `ap-southeast-2c` 의 각각의 AZ를 가집니다.
- 각각의 AZ는 여분의 전원, 네트워킹, 통신 기능을 갖춘 하나 또는 두 개의 개별적엔 데이터 센터로 이루어져 있습니다
	- 즉, `ap-southeast-2a`하나의 AZ에 <mark>하나 또는 두개</mark>의 데이터 센터가 존재한다.
- 해당 데이터 센터 분리의 이유는 재난 방지 용입니다.
	- 재난 방지로 인해서 서로 단절 되어 있습니다.
- 해당 데이터 센터는 높은 대역폭의 초저지연 네트워킹으로 서로 연결되어 리전을 형성합니다.

# AWS Points of Presence(Edge Locations)
- Global Infra쪽으로 알아야하는 지식은 전송 지점 입니다.
- AWS는 42개국 84개의 도시에 200개가 넘는 전송 지점을 보유하고 있습니다.

# Tour of the AWS Console

## AWS Global Services
- **Identity and Access Manager**(IAM)
- **Route 53**(DNS service)
- **CloudFront**(Control Deivery Network)
- **WAF**(Web Appliction Firewall)

## Most AWS services are Region-scoped
- **AWS EC2** (Infrastructure as a Service)
- **Elastic Beanstalk**(Platform as a Service)
- **Lambda**(Function as a Service)
- **Rekogition**(Software as a Service)