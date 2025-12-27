---
slug: "Terraform-AWS-Provider"
---
- [AWS Provider를 사용하기 전에 해야할 셋팅](#AWS Provider를 사용하기 전에 해야할 셋팅)
	- [MacOS](#AWS Provider를 사용하기 전에 해야할 셋팅#MacOS)
		- [AWS CLI 자격 증명 : AWS 액세스 키 발급](#MacOS#AWS CLI 자격 증명 : AWS 액세스 키 발급)
	- [AWS CLI 자격 증명 설정](#AWS Provider를 사용하기 전에 해야할 셋팅#AWS CLI 자격 증명 설정)
		- [AWS CLI 자격 증명 설정 우선 순위](#AWS CLI 자격 증명 설정#AWS CLI 자격 증명 설정 우선 순위)
	- [Linux](#AWS Provider를 사용하기 전에 해야할 셋팅#Linux)
- [AWS VPC 설정](#AWS VPC 설정)
	- [tf apply](#AWS VPC 설정#tf apply)
	- [aws output](#AWS VPC 설정#aws output)
		- [Name Tag 변경 tf code](#aws output#Name Tag 변경 tf code)
		- [IP 변경 tf code](#aws output#IP 변경 tf code)
	- [AWS VPCS](#AWS VPC 설정#AWS VPCS)
	- [terraform으로 만든 모든 제어 제거하기](#AWS VPC 설정#terraform으로 만든 모든 제어 제거하기)

---

# AWS Provider를 사용하기 전에 해야할 셋팅

```bash
#터미널에서 이 명령어를 작성했을 때 에러가 난다면 아래의 셋팅 과정을 거치고 시작해야한다.
aws sts get-caller-identity
```

## MacOS

```bash
brew install awscli
```

### AWS CLI 자격 증명 : AWS 액세스 키 발급

![Untitled.png](/img/이미지 창고/Untitled.png)
![Untitled-1.png](/img/이미지 창고/Untitled-1.png)

위의 두 페이지를 차례 대로 접속 합니다.

![Untitled-2.png](/img/이미지 창고/Untitled-2.png)

액세스 키를 만들게 된다면, 아래와 같이 액세스 키에 대한 정보가 뜨게 됩니다.

## AWS CLI 자격 증명 설정

### AWS CLI 자격 증명 설정 우선 순위

1. **CLI 명령어 옵션**
2. **환경 변수**
3. CLI 자격 증명 파일 - `~/.aws/credentials`
4. **CLI 설정 파일** - `~/.aws/config`
5. 컨테이너 자격 증명 (ECS의 경우)
6. **인스턴스 프로파일 자격 증명(EC2의 경우)**

하지만 필자의 Mac에서는 vi code가 잘 먹지 않아서 임의적으로 파일을 만들고 하여 진행하였다.

```bash
cd ~
mkdir .aws && cd $_
vi config
```

```bash
[default]
aws_access_key_id=~
aws_secret_access_key=~
```

를 실행하게 되니, 실행이 완료 되었습니다.

## Linux

v1과 달리 파이썬의 의존성을 가지지 않으며 AWS 측에서 공식 설치 스크립트를 제공한다.

우선 설치 전에 필요 프로그램이 있기 때문에 해당 파일을 설치 해야한다.

```bash
sudo apt update
sudo apt install unzip build-enssential curl
```

그리고 그 후에는 

```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"

# 현재 강의를 듣고 있기 때문에 강의 기준으로는 2.2.16 버전으로 명시해서 다운 받아주면 된다.
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64-2.2.16.zip" -o "awscliv2.zip"

unzip awscliv2.zip
sudo ./aws/install

curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
```

위의 명령어를 이용해서 다운을 받아주면 된다.

그리고 위의 맥처럼 하니까 실패했다… 도륵…

그래서 다른 방법으로 계정을 생성하였다 다름아닌

```bash
aws configure
```

명령어를 치게 된다면 알아서 파일이 나온 뒤에 생성 시켜 준다.

[구성 기본 사항](https://docs.aws.amazon.com/ko_kr/cli/latest/userguide/cli-configure-quickstart.html#cli-configure-quickstart-config)

# AWS VPC 설정

```bash
terraform {
  required_providers {
    local = {
      source = "hashicorp/local"
      version = "2.2.3"
    }
  }
}

provider "local" {
}

provider "awscc" {
  region = "ap-northeast-2"
}

resource "aws_vpc" "foo" {
    cidr_block = "10.0.0.0/16"
}
```

region 을 설정하고 VPC 설정에서 cidr 설정을 통해서 `10.0.0.0/16` 으로 설정했다.

그렇게 되면 아마 lock이 되어서 error가 뜰텐데 이럴 때는

```bash
tf init
tf plan
```

을 하게 된다면 정상적으로 뜨는 것을 알 수 있다.

![Untitled-3.png](/img/이미지 창고/Untitled-3.png)

## tf apply

![Untitled-4.png](/img/이미지 창고/Untitled-4.png)

![Untitled-5.png](/img/이미지 창고/Untitled-5.png)

이런 식으로 나의 AWS 계정에서 VPC가 설정된 모습을 볼 수가 있다.

## aws output

```bash
terraform {
  required_providers {
    local = {
      source = "hashicorp/local"
      version = "2.2.3"
    }
  }
}

provider "awscc" {
  region = "ap-northeast-2"
}

resource "aws_vpc" "foo" {
    cidr_block = "10.1.0.0/16"
}

output "vpc_foo" {
  value = aws_vpc.foo
}
-----------------------------
output "file_foo" {
  value = data.local_file.foo
}
```

오른쪽과 같이 vpc의 정보들을 알려주는 output을 출력할 수 있다.→

왼쪽 하단에 보게 되면 output 에서 `file_foo`와 `vpc`와 큰 차이점이 앞에 `data.` 의 유무이다.

이러한 차이점이 발생하는 이유는 

file_foo의 경우네는 data source이기 때문에 앞에 data라는 네임을 붙여하는 하는 것이며,

vpc_foo의 경우네는 resource이기 때문에 따로 data를 붙이지 않아도 된다.

![Untitled-6.png](/img/이미지 창고/Untitled-6.png)

![Untitled-7.png](/img/이미지 창고/Untitled-7.png)

이번에는 vpc에서 Name Tag를 달아줍니다.

```bash
...
resource "aws_vpc" "foo" {
    cidr_block = "10.1.0.0/16"

		tags = {
			"Name" = "This is test vpc"
		}
}
...
```

- 새롭게 덮어 쓰는 것이 아닌 기존에 있던 VPC를 이용해서 수정을 가하는 것이다.
- 그렇기 때문에 기존 설정과 달라지는 건 추가하는 tag 밖에 없다

기존의 ip를 `10.1.0.0/16` → `10.123.0.0/16` 으로 변경함

![Untitled-8.png](/img/이미지 창고/Untitled-8.png)

```bash
terraform {
  required_providers {
    local = {
      source = "hashicorp/local"
      version = "2.2.3"
    }
  }
}

provider "local" {
}

provider "awscc" {
  region = "ap-northeast-2"
}

resource "aws_vpc" "foo" {
    cidr_block = "10.123.0.0/16"

    tags = {
        "Name" = "This is test vpc"
    }
}

resource "local_file" "foo" {
    filename = "${path.module}/foo.txt"
    content  = "Hello World!"
}

data "local_file" "foo" {
    filename = "${path.module}/foo.txt"
}

output "vpc_foo" {
  value = aws_vpc.foo
}

output "file_foo" {
  value = data.local_file.foo
}
```

### Name Tag 변경 tf code

![Untitled-9.png](/img/이미지 창고/Untitled-9.png)

### IP 변경 tf code

![Untitled-10.png](/img/이미지 창고/Untitled-10.png)

cider 값은 애초에 변경이 불가능한 값이기 때문에 이를 Terraform이 인식하여서 삭제한 다음에 다시 띄워주는 역할을 해준다.

## AWS VPCS

[Terraform Registry](https://registry.terraform.io/providers/hashicorp/awscc/latest/docs/data-sources/ec2_vpcs)

```bash
...
data "aws_vpcs" "this"{ 
}

output "vpcs" {
   value = data.aws_vpcs.this
}
...
```

vpcs에서 아무런 조건 없이 쓰게 된다면 전체 vpc를 보여주게 되며 위의 document를 쓰게 된다면 필터링을 해서 보여주게 된다.

![Untitled-11.png](/img/이미지 창고/Untitled-11.png)

## terraform으로 만든 모든 제어 제거하기

```bash
tf destroy
```

---

#IaC #Terraform

---