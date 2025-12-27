---
slug: "Terraform-시작하기"
---



----

:::tip 이번 장에서는
- 테라폼 명령어를 통해 서버, 트래픽 로드 밸러서 등의 클러스터 구성 방법
- 인프라르 통해 확장성과 고가용성을 갖는 웹 서비스와 마이크로 서비스를 알아본다.

:::

- 테라폼은 AWS, Azure, GCP 등 잘 알려진 공용 클라우드 공급자 뿐 아니라 오픈 스택, VM웨어 등의 사설 클라우드와 가상화 플랫폼도 지원합니다.
- 테라폼을 학습하는 데는 AWS가 가장 좋은 선택입니다.
	- AWS는 가장 대중적인 퍼블릭 클라우드 공급자 입니다.
	- AWS는 EC2처럼 신뢰성 있고, 확장성이 있는 다양한 서비스를 제공하며, ASG처럼 가상 서버의 클러스트를 손쉽게 관리할 수 있도록 한다.
	- ELB를 통해 가상 서버의 클러스터에 트래픽 부하를 분산 시키는 서비스도 제공한다.

## IAM 설정
- IAM 설정은 매우 쉬으므로 따로 다루진 않겠다.

### IAM 정책 
- 이 책의 예제를 실행하기 위해서는 IAM 사용자에게 아래와 같은 정책을 추가해야 합니다.
:::warning IAM 정책
- AmazonEC2FullAccess
- AmazonS3FullAccess
- AmazonDynamoDBFullAccess
- CloudWatchFullAccess
- IAMFullAccess

:::

## Terraform 설치
[TerraForm && Packer 설치](../TerraForm-Packer-설치.md) 를 살펴보시면 됩니다.

## 단일 서버 배포하기
- 테라폼 코드는 tf 확장자인 하시코프 설정 언어(HCL HashiCorp Configuration Language)로 작성되어있다. 
- 테라폼은 구성하고자 하는 인프라를 설명할 수 있도록 선언형 언어로 구성되어 있으며, 테라폼이 구성정보에 따라 각 인프라 제공자의 API를 사용하여 리소스를 생성하고 구성하는 단계를 지원한다.
- 또한, 테라폼은 AWS, Azure, GCP 등 다양한 플랫폼에 종속적이지 않게 인프라를 생성할 수 있다.

- 테라폼 사용의 첫 번째 단계는 원하는 공급자를 설정하는 것이다.
- 새로운 디렉토리를 생성하고 `main.tf` 파일을 만들고 다음의 내용을 작성한다.
```HCL
provider "aws"{
	region = "ap-northeast-2"
}
```
- 앞의 선언을 통해 테라폼은 제공자로 AWS를 사용하고 인프라를 배포하고자 하는 지역이 `ap-northeast-2`이라고 인식합니다.
- AWS는 전 세계에 데이터 센터를 가지고 있으며, 여러 가용 영역들을 지역으로 묶어서 제공한다.
- AWS Region은 지리학적인 위치로 나누어져 있으며, 여러 지역이 존재 한다.
- 각 지역에는 **가용 영역**으로 불리는 각각의 독립된 여러 개의 데이터 센터를 가지고 있으며, ap-northeast-2a, ap-northeast-2c로 선언되어있다.

- 또한, 각 제공자 환경에 따라서 각각 다른 리소스를 생성할 수 있다.
- 예를 들면 서버, 데이터 베이스, 로드 밸런서 등이 있으며, AWS에서 EC2 Instance와 같은 단일 서버를 생성하고자 한다면, aws_instance 리소스를 `main.tf` 에 추가하면 된다.
```HCL
resource "aws_instance" "example"{
	ami             = "ami-40d28157"
	instance_type   = "t2.micro"
}
```

- 기본적인 테라폼 리소스의 문법은 다음과 같다.
```HCL
resource "PROVIDER_TYPE" "NAME"{
	[CONFIG...]
}
```
- PROVIDER는 AWS처럼 공급자 이름이며, TYPE은 instance와 같이 생성하고자 하는 리소스의 종류다.
- NAME은 테라폼 코드에서 해당 리소스를 지칭하는 식별자이며, CONFIG는 해당 리소스에 선언할 수 있는 하나 이상의 설정 변숫값들로 구성되어있다.
- aws_instance 리소스에는 다양한 설정 변숫값이 있으며, 지금은 다음에 명시된 변수만 사용하면 된다.
### AMI
- AMI는 EC2 인스턴스를 구동시키는 골드 이미지다.
- AWS 마켓플레이스를 통해 무료, 유료 AMI를 찾을 수 있으며, Packer로 직접 제작이 가능합니다.
### instance_type
- EC2 인스턴스를 구동시키기 위한 필수 정보다.
- 각 EC2인스턴스 타입은 각기 다른 CPU, 메모리, 디스크 용량, 네트워크 수용량을 갖고 있으며, AWS 페이지에서 모든 가능한 목록을 확인 할 수 있습니다.

- 터미널에서는 `main.tf` 파일이 있는 디렉토리로 이동하여 `terraform init` 명령어 plan 명령어를 순서대로 수행한다.
```bash
terraform init
```
- `Init` 명령어는 테라폼을 수행하기 위한 공급자의 플로그인들을 초기 설저하는 명령어이며, 실습에서는 해당 명령어이며, 실습에서는 해당 명령어를 통해 AWS 최신 버전 플러그인이 설정된다.
- `plan` 명령어는 테라폼을 통해 실제로 생성되고 변경되는 내역을 보여준다.
	- 실제 환경에 적용하기 전에 검증할 수 있게 하는 중요한 수단이다.
	- plan의 결괏값은 유닉스, 리눅스와 깃의 `diff` 명령어와 비슷하다.
	- 더하기(+) 기호는 생성한다는 의미이며, 빼기(-) 기호는 제거한다는 의미, 물결(~) 기호는 변경한다는 의미다.
	- 이 결괏값은 통해 정의한 대로 테라폼이 EC2 인스턴스를 생성한는지 알 수 있다.
- 실제로 인스턴스를 생성하기 위해 `terraform apply` 명령어를 수행하고 변경 내역을 확인하면 다음과 같이 생성됩니다.
 -> terraform apply 적용 사진 넣기



- 지금까지는 서버가 정상적으로 생성되었으나 흥미로운 예제는 아니다.
- 지금부터는 더욱더 흥미로운 예제를 만들어 볼 것이다. 첫째로 EC2인스턴스에 이름을 정의해본다.
```hcl
resouce "aws_instance" "example"{
	ami           = "ami-40d281757"
	instance_type = "t2.micro"
	
	tags{
		Name = "terraform-example"
	}
}
```
- 테라폼은 이미 생성된 설정 파일의 세트를 지속적으로 관리합니다.
- 이를 통해 EC2 인스턴스가 기존에 생성되었는지 알 수 있습니다.
- 현재 배포된 내역과 신규로 변경되는 사항도 알 수 있습니다.
- 원하는 내역이 테라폼을 통해 Name이라는 단일 태그를 생성하는 것을 확인 할 수 있으며, apply를 수행하여 실제로 적용한다.


- 간단한 테라폼 코드의 동작 방법을 알 수 있다. 또한 버전 관리 도구를 쓴다면, 다른 사람들과 코드를 공유하고 인프라 변경 사항을 꾸준히 파악 할 수 있다.
- 커밋 로그를 통해 디버깅할 수 있다.
- 예를 들어
	- 현재 깃 저장소를 통해 다음과 같이 테라폼 설정 값을 저장할 수 있다.
```bash
git init
git add main.tf
git commit -m "Initial commit"
```
.gitignore를 통해서 깃에 추가할 때 실수로 특정 파링이 추가되지 않도록 설정 할 수 있습니다.
```.gitignore
.terraform
*.tfstage
*.tfstate.backup
```
- 앞의 `.gitignore` 파일은 git 저장소에 추가되지 않아야할 파일들을 명시하고 있으며, 테라폼 상태를 저장하고 있는 `*.tfstate` 파일과 같은 경우 `.gitignore`파일에 역시 커밋해 놓아야합니다.
```bash
git add .gitignore
git commit -m "Add a .gitignore file"
```
- 이 코드를 동료들과 공유하려면 모두가 접근할 수 있는 공유 깃 저장소를 만들어야한다.
- 이 이후는 깃 CLI를 습득하신 분이라면, 다 아실겁니다.


## 단일 웹 서버 배포하기
- 다음 단계는 인스턴스에 웹 서버를 동작시키는 것이다.
- 우리의 목적은 최대한 간단하게 웹 서비스를 구성하는 것이며, 이 단일 웹 서버는 아래와 같이 HTTP 요청들에 대해 응답할 수 있도록 만들 것입니다.
![Pasted-image-20230420212614.png](/img/이미지 창고/Pasted-image-20230420212614.png)
- 실제 환경에서는 웹 서버에 Ruby or Django 같은 웹 프레임워크를 사용해야 하나, 실습에서는 `Hello World`에 응답만 할 수 있도록 최대한 간단하게 웹 서버를 구현할 것이다.
```bash
echo "Hello, World" > index.html
nohup busybox httpd -f -p 8080 &
```
- 위 bash script는 `index.html` 파일에 "Hello, World"를 작성하랄고 비지막스를 수행하여 8080포트로 웹 서버를 시작하는 명령어 입니다.
- 또한 비지박스 명령어와 nohub과 &를 추가하여, 배시 스크립트가 종료되더라도 지속해서 백그라운드로 수행할 수 있도록 설정했습니다.
:::warning 포트 번호
- 예제에서 8080번을 사용한 이유는,** 1024이하 모든 포트**를 사용하기 위해서는** root 권한**이 필요하다.
- 해당 포트를 사용할 경우 서버를 손상할 수 있는 공격자가 root권한을 가지므로 보안의 위협이 있다.
- 권한이 제한된 사용자로 웹 서버를 기동시키는 것이 가장 이상적인 방법이며,
- 높은 숫자의 포트 번호를 사용 해야한다.
- 로드 밸런서에서 80포트 번호로 트래픽을 수용하여 높은 숫자 번호로 라우팅하는 설정을 추가 해야 한다.

:::

- EC2 인스턴스에 해당 스크립트를 어떻게 적용해야 할까?
- 일반적으로 앞에서 다룬 서버 템플릿 도구로 할 수 있다.
- Packer를 통해 직접 AMI를 구성하여 웹 서버를 설치할 때 해당 스크립트를 적용해 놓을 수 있다.
- 이 예제의 임시 웹 서버는 한 줄의 비지 박스 명령어로 되어 있으므로 기본 ubuntu 16.04 이미지로 사용할 수 있으며, EC2 인스턴스의 사용자 데이터(user data) 설정을 통해 "Hello, World" 스크립트를 인스턴스 기동 시 수행할 수 있다.
```hcl
resource "aws_instance" "example"{
	ami = "ami-40d28157"
	instance_type = "t2.micro"

	user_data = <<-EOF
				#!/bin/bash
				echo "Hello, World" > index.html
				nohup busybox httpd -f -p 8080 &
				EOF
}
```
- 이 파일에서 &lt;&lt;-EOF와 EOF 표시는 새로운 줄에 문자를 매번 추가하는 것이 아니라 여러 줄의 단락으로 처리하는 테라폼의 히어닥(heredoc) 문법이다.
- 웹 서버를 동작시키기 전에 추가로 한 가지 작업을 해야한다.
- 기본적으로 AWS는 인스턴스의 들어오고 나가는 트래픽을 허용하지 않으며, 예제와 같이 8080포트에 대한 트래픽을 허용하기 위해서는 다음과 같이 보안 그룹(Security Group)을 통해 설정해야 한다.
```hcl
resouces "aws_security_group" "instance"{
	name = "terraform-example-instance"
	ingress{
		from_port = 8080
		to_port = 8080
		protocol = "tcp"
		cidr_blocks = ["0.0.0.0/0"]
	}
}
```
- 이 코드는 `aws_security_group` 리소스를 생성하고, CIDR블록 0.0.0.0/0 으로부터 8080포트에 대해 TCP 요청을 받을 수 있도록 설정하였다.
- CIDR 블록은 IP 주소 대역을 간략하게 표현한 것이다.

- 사실상 단순히 보안 그룹만 만드는 것으로는 충분하지 않으며, 실제로 EC2 인스턴스가 해당 보안 그룹을 사용할 수 있도록 해야 한다.
- 이를 위해 보안 그룹의 ID를 aws_instance 리소스에 vpc_security_group_ids의 변수로 지정해야 한다.
- 보안 그룹의 ID를 다음과 같이 채움 참조(interpolation) 구문으로 변수 처리 한다.
```hcl
"${something_to_interploate}"
```
- 따옴표에 달러 기호와 중괄호로 묶은 표시는 일반 문자열이 아닌 특별한 방법으로 처리 된다.
- 이 책에서는 다양한 문법 구문을 사용하며, 이번 예제에서 사용하는 것은 리소스의 속성값으로 불러오는 변수 구문이다.
- 테라폼에서는 모든 리소스를 속성값으로 불러 변수를 사용할 수 있으며, 구문 분법은 다음과 같다.
```hcl
"${TYPE.NAME.ATTRIBUTE}"
```

- 예를 들어, 보안 그룹의 ID를 사용하려면 다음과 같다.
```hcl
"${aws_security_group.instance.id}"
```
- `aws_instance` 리소스에서 해당 보안 그룹ID를 `vpc_security_group_ids` 변수로 사용할 수 있다.
```hcl
resource "aws_instance" "example"{
	ami = "ami-40d29157"
	instance_type = "t2.micro"
	vpc_security_group_ids = ["${aws_security_group.instance.id}"]

	user_data = <<-EOF
				#! /bin/bash
				echo "Hello, World" > index.html
				nohup busybox httpd -f -p 8080 &
				EOF
	tags{
		Name = "terraform-example"
	}
}
```
- 다른 리소스에 대해 채움 참조 문법을 사용하게 된다면 <mark>암시적인 의존성</mark>을 정의해야 한다
- 테라폼은 해당 의존성을 읽어 의존성 그래프를 만들고 그 기반으로 우선 순위를 자동으로 정해서 리소스를 생성한다.
- 예를 들어,
	- 테라폼은 EC2 인스턴스 생성을 위해 보안 그룹 ID가 필요하므로, 보안 그룹이 EC2 인스턴스 리소스 전에 생성되어야 한다는 것을 알고 있다.
	- 테라폼 graph 명령어를 통해 어떤 의존성이 있는지 확인한다.
```bash
terraform graph
```
- 결괏값은 DOT라는 그래프 설명 언어로 되어이 있으며, 아래와 같은 이미지로 바꿔 볼 수 있다.
- - 테스크톱 웹이나  **Graphviz** 혹은 [Graphviz](http://bit.ly/2mPbxmg)
![Pasted-image-20230421175243.png](/img/이미지 창고/Pasted-image-20230421175243.png)
- 테라폼이 의존성 트리(tree)를 따라서 수행될 때, 그것 자체에서도 여러 리소스를 변수 형태로 정의 할 수 있으며, 변경사항을 신속하게 적용할 수 있다.
- 이것이 선언형 언어의 장점이며, 원하는 것을 지정하면, 테라폼이 가장 효율적인 방법을 찾는다.

- 만약 **plan** 명령어를 수행하면, 테라폼이 보안 그룹을 생성하며, 기존 EC2 인스턴스를 새로운 사용자 데이터를 갖는 것으로 변경한다.

```bash
terraform plan
```
- 테라폼에서 EC2 인스턴스 태그와 같은 메타 데이터 변경 이외의 대부분 변경 사항들은 실제로 완전히 새로운 인스턴스를 만든다.
- 이것은 8페이지에서 언급한 '서버 템플릿 도구'의 변하지 않는 인프라의 패러다임이다.
- 웹 서버가 바꾸니다는 것은 서비스 사용자로서는 중단할 수도 있다는 의미다.
- 적용 계획에 문제가 없다면, `terraform apply` 명령어를 통해 EC2 인스턴스가 새롭게 배포 된 것을 알 수 있다.
- 화면 아래쪽 설명 탭을 보면 EC2 인스턴스의 IPv4 퍼블릭 IP를 확인할 수 있으며, 부팅 후 1~2분 이후 웹 브라우저나 curl 등의 도구를 통해서 해당 IP주소에 8080 포트로 http 요청을 하여 결과를 확인 할 수 있다.
```bash
curl http://<EC2_INSTANCE_PUBLIC_IP>:8080
Hello, World
```

:::warning 네트워크 보안
- VPC는 하나 이상의 서브넷으로 이루어져 있으며, 각 서브넷 별로 별도의 IP 주소 대역을 갖는다.
- 기본 VPC에 있는 서브넷들은 모두 **외부로 열려있는 서브넷**이며, 이는 인터넷을 통해서 IP 주소로 접근이 가능하다.
- 실제 환경에서는 보안 위험이 존재한다.
- 공격자가 인터넷을 통해 무작위로 IP 주소를 스캔하고 공격을 하기 위한 취약점을 찾는다.
- 만약 서버가 모두 인터넷에 연동되어 있고, 실수로 특정 포트를 보호하지 않거나 보안 취약점이 있는 코드를 지속해서 사용한다면 침해당할 수 있다.




:::

---

#IaC #Terraform #AWS #AWS_VPC #AWS_IAM 

---

