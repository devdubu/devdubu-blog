---
slug: "4-AWS-Infrastructure"
title: "AWS 인프라 구축 (AWS Infrastructure)"
---

# AWS 인프라 구축 (AWS Infrastructure)

:::info 개요
Terraform의 **AWS Provider**를 사용하여 EC2, IAM 등 핵심 리소스를 생성하는 방법과 **Provisioner**, **Userdata**를 통한 초기 설정 방법을 다룹니다.
:::

## 1. AWS Provider 설정

```hcl
provider "aws" {
  region = "ap-northeast-2"
}
```

## 2. EC2 인스턴스 생성

```hcl
resource "aws_instance" "web" {
  ami           = "ami-0e1d09d8b7c751816" # Ubuntu 20.04
  instance_type = "t2.micro"
  
  tags = {
    Name = "HelloWorld"
  }
}
```

---

## 3. 초기 설정 (Userdata vs Provisioner)

서버가 부팅될 때 스크립트를 실행하는 두 가지 방법이 있습니다.

### 3.1 Userdata (권장)
클라우드 네이티브한 방식으로, 인스턴스 부팅 시 `cloud-init`에 의해 실행됩니다.

```hcl
resource "aws_instance" "web" {
  # ...
  user_data = <<-EOF

              apt-get update
              apt-get install -y nginx
              systemctl start nginx
              EOF
}
```

### 3.2 Provisioner (비권장)
Terraform이 직접 SSH로 접속하여 스크립트를 실행하는 방식입니다.
HasiCorp에서는 **최후의 수단(Last Resort)**으로만 사용할 것을 권장합니다.

```hcl
resource "aws_instance" "web" {
  # ...
  
  # 파일 전송
  provisioner "file" {
    source      = "conf/nginx.conf"
    destination = "/etc/nginx/nginx.conf"
  }

  # 명령 실행
  provisioner "remote-exec" {
    inline = [
      "systemctl restart nginx"
    ]
  }
}
```

---

## 4. 모듈화 (Modules)

반복되는 인프라 패턴을 모듈로 만들어 재사용할 수 있습니다.

```hcl
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  name   = "my-vpc"
  cidr   = "10.0.0.0/16"
}
```
