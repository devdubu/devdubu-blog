---
slug: "AWS-EC2-보안"
---
# AWS EC2 SSH
- Infrastructure as Service
- 가상 컴퓨팅 환경
- 네트워크 
	- EIP, ENI, SG
- 가상 머신 이미지
	- AMI
- 스토리지
	- EBS, EFS
- SSH
	- Key Pairs
![Pasted-image-20230221163223.png](/img/이미지 창고/Pasted-image-20230221163223.png)
- 보통의 경우라면 위와 같이 하나의 public subnet과 private subnet을 두면서 하나의 EC2를 public IP로 활용하는 그러한 작업을 진행한다.
- 즉, user가 private subnet을 접속하기 위해서는 public subnet을 거친 후에 private subnet을 접속 한다.
- 위의 문제점은 Bation Server자체가 public IP로 접근이 된다는 보안적 이슈가 있다.
	- 즉, public IP로 외부로 공개가 되어있다는 것 자체가 문제인 것이다.

- 위의 문제를 해결하기 위해서는 결국은 public -> private가 아닌
![Pasted-image-20230221163622.png](/img/이미지 창고/Pasted-image-20230221163622.png)
- 위의 그림처럼 VPN을 통해서(내부망 구축을 통한) private Server를 접근 하는 것이 제일 안전하다.

- Terraform으로 EC2를 접근제어 할 때는 EC2 메뉴에 <mark>Key Pair</mark>라는 메뉴가 존재한다.
- 해당 메뉴를 가지고, Private Key를 통해서 dev, prod, test 등등을 테스트 할 수 있다.
- 해당 방법은 Public IP로 SSH Key를 통해서 접근을 하는 방법이다.
- 하지만, 이 방법은 


![Pasted-image-20230221180040.png](/img/이미지 창고/Pasted-image-20230221180040.png)
- 위의 기능을 사용하기 위해서는 SSM이 EC2에 설치가 되어있어야한다.
- 즉, IAM Policy에 해당 내용이 있어야지 SSM을 통해서 접근 제어가 가능하다.
- 해당 기능을 사용하게 된다면, AWS Console에서 (웹)에서 터미널 접근이 가능하며, AWS System Manager를 통해서 터미널 접근이 가능하다.
![Pasted-image-20230222085828.png](/img/이미지 창고/Pasted-image-20230222085828.png)
- 다른 방법으로는 웹말고, AWS-CLI로 접근하는 방법도 있습니다.
https://docs.aws.amazon.com/ko_kr/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html#install-plugin-macos
- 별도의 Session Manager Plugin을 설치해야한다.

# EC2 백업

## AMI
- EC2가 만약 아래와 같이 구성이 되어있다면
	- EBS - /
	- EBS - /docker
- AWS의 AMI를 통해서 똑같은 환경을 복제 할 수 있다.

![Pasted-image-20230222094350.png](/img/이미지 창고/Pasted-image-20230222094350.png)

### EC2 AMI Backup Automation
- AMI는 LifeCycle Backup을 할 수 없다. 그렇기 때문에, 전에 했던 방식대로 Lambda를 이용해서 backup automation 기능을 만들어야 한다.
![Pasted-image-20230222102123.png](/img/이미지 창고/Pasted-image-20230222102123.png)

## Snapshot
- 그럼 만약에 EBS만 백업을 하고 싶다면 AMI의 기능을 이용하는 것이 아닌, SnapShot을 이용하여 백업을 진행한다.
![Pasted-image-20230222094655.png](/img/이미지 창고/Pasted-image-20230222094655.png)
- 위의 그림을 통해서 EBS Snapshot으로 설정한다 해당 마운트를 설정한다.


### AWS EC2 Lifecycle Policy
![Pasted-image-20230222101759.png](/img/이미지 창고/Pasted-image-20230222101759.png)
- SnapShot은 LifeCycle을 통해서 백업이 가능하다.

---

#AWS #AWS_EC2 

---
