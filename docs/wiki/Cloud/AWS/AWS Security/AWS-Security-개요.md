---
slug: "AWS-Security-개요"
---
# AWS Security 개요
![Screenshot-2023-01-09-at-9.44.52-PM.png](/img/Screenshot-2023-01-09-at-9.44.52-PM.png)
- AWS 즉, public 클라우드를 사용한다면, 여러가지 장점들이 존재합니다.
- 갑작스런 대량의 트래픽이 왔을 때 유연하게 대처가 가능한다는 점 등등 좋은 점이 있지만, 마냥 좋은 점만 있는 것은 아닙니다.
- 하지만, 단점도 있습니다.

## AWS Shared Responsdibity Model
- AWS 책임 : 클라우드의 보안
- 고객의 책임 : 클라우드에서의 보안
![Screenshot-2023-01-15-at-10.43.58-PM.png](/img/Screenshot-2023-01-15-at-10.43.58-PM.png)
![Screenshot-2023-01-15-at-10.44.53-PM.png](/img/Screenshot-2023-01-15-at-10.44.53-PM.png)

## AWS Secruity Service
![Screenshot-2023-01-15-at-10.47.24-PM.png](/img/Screenshot-2023-01-15-at-10.47.24-PM.png)
![Screenshot-2023-01-15-at-10.49.05-PM.png](/img/Screenshot-2023-01-15-at-10.49.05-PM.png)
- AWS에서 오는 모든 API들은 CloudTrail을 통해서 로그를 확인 할 수 있다.
- AWS에서도 private한 VPC를 만들 수 있기 때문에, 해당 VPC로 오는 Traffic들의 Log들도 CloudWatch를 통해서 확인 할 수 있다.
![Screenshot-2023-01-15-at-10.51.35-PM.png](/img/Screenshot-2023-01-15-at-10.51.35-PM.png)
- 하지만, Log를 볼 수 있다고 하여서, 모든 Log를 보면서 분석하고 상황을 판단하는 건 불가능한 일이기 때문에, 
- Amazon GuardDuty를 이용해서 해당 보안 이슈를 자동으로 분석하게 한다.
![Screenshot-2023-01-15-at-10.57.04-PM.png](/img/Screenshot-2023-01-15-at-10.57.04-PM.png)
- AWS EC2에서는 Amazon Inspector를 이용해서 이상 감지 탐지를 한다.
- AWS S3에서는 Amazon Macle를 이용해서 이상 감지를 탄지하고 해당 하는 것을 AWS Security Hub에 전송합니다.
- AWS Network에 대한 보안도 중시 하기 때문에, Newwork에 대한 보안 감지는 AWS Sheild를 통해서 하게 됩니다.


![Screenshot-2023-01-15-at-10.58.35-PM.png](/img/Screenshot-2023-01-15-at-10.58.35-PM.png)
- 제일 좋은 보안 방법은 사용자 별로 Account를 나눠 주는 것이다.
- 해당 방법을 통해서 접근 하지 말아야할 계정들을 미리 분리하여 컨트롤 하는 것이 제일 확실한 보안 방법이다.
