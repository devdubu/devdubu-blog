---
slug: "Packer-기초"
---
- [Packer 시작하기](#Packer 시작하기)
	- [AMI 삭제하는 방법](#Packer 시작하기#AMI 삭제하는 방법)

---

# Packer 기초

우선 packer의 예시 코드를 보여드리겠습니다.

```bash
packer {
  required_version = "~> 1.7"

  required_plugins {
    amazon = {
      version = "~> 1.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

source "amazon-ebs" "ubuntu" {
  ami_name      = "fastcampus-packer"
  instance_type = "t2.micro"
  region        = "ap-northeast-2"

  source_ami_filter {
    filters = {
      name                = "ubuntu/images/*ubuntu-focal-20.04-amd64-server-*"
      root-device-type    = "ebs"
      virtualization-type = "hvm"
    }
    most_recent = true
    owners      = ["099720109477"]
  }

  ssh_username = "ubuntu"
}

build {
  name    = "fastcampus-packer"
  sources = [
    "source.amazon-ebs.ubuntu"
  ]
}
```

- Terraform과 코드 적으로 거의 유사합니다.
- packer의 확장자는 .pkr.hcl 로 정의 됩니다

# Packer 시작하기

```bash
packer init .
```

를 사용하게 되면 해당 디렉토리에 있는 파일들을 packer로 사용할 수 있게 끔 초기화를 해준다.

```bash
packer build .
```

packer가 해당 디렉토리 코드를 build하기 시작한다.

packer는 이미지를 만들때, 우선 packer에서

1. EC2머신 생성
2. EC2머신을 접근하기 위해서 임시적으로 ssh와 보안그룹 생성
3. EC2 머신 중지
4. EC2 AIM 이미지를 스냅샷합니다.

![Untitled.png](/img/이미지 창고/Untitled.png)
1. 후에 보안 그룹과 EC2을 깔끔하게 지운다.

## AMI 삭제하는 방법

 
![Untitled-1.png](/img/이미지 창고/Untitled-1.png)


우선 AMI로 간 후에, 작업 → AMI 등록 취소를 누른다.

![Untitled-2.png](/img/이미지 창고/Untitled-2.png)

그리고 그 후에는 스냅샷에 들어가서 작업 → 스냅샷 삭제를 눌러야지 완전 삭제가 됩니다.


---

#Packer

---

