---
slug: "2-HCL-Syntax"
title: "HCL 문법과 구성 (HCL Syntax)"
---

# HCL 문법과 구성

:::info 개요
Packer는 **HCL (HashiCorp Configuration Language)**을 사용하여 인프라를 정의합니다. 주요 블록으로는 `packer`, `source`, `build`, `provisioner`, `post-processor` 등이 있습니다.
:::

## 1. 기본 블록 구조

### 1.1 Packer 설정 (`packer`)
Packer 버전 및 필수 플러그인을 정의합니다.

```hcl
packer {
  required_version = "~> 1.7"

  required_plugins {
    amazon = {
      version = "~> 1.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}
```

### 1.2 소스 정의 (`source`)
이미지를 빌드할 기본 "틀"을 정의합니다. (예: AWS EBS, Azure, Docker 등)

```hcl
source "amazon-ebs" "ubuntu" {
  ami_name      = "my-custom-ami"
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
```

### 1.3 빌드 정의 (`build`)
정의된 `source`를 사용하여 실제로 수행할 작업을 명시합니다. 프로비저닝 단계가 여기에 포함됩니다.

```hcl
build {
  name = "my-build"
  sources = ["source.amazon-ebs.ubuntu"]

  # 프로비저닝 (쉘 스크립트 실행)
  provisioner "shell" {
    inline = [
      "sudo apt-get update",
      "sudo apt-get install -y nginx"
    ]
  }

  # 후처리 (매니페스트 생성 등)
  post-processor "manifest" {
    output = "manifest.json"
  }
}
```

---

## 2. 변수와 로컬 (Variables & Locals)

### 2.1 Locals (지역 변수)
파일 내부에서 재사용할 값을 정의합니다.

```hcl
locals {
  service_name = "web"
  version      = formatdate("YYYYMMDD", timestamp())
  ami_fullname = "${local.service_name}-${local.version}"
}
```

### 2.2 Variables (입력 변수)
외부에서 주입받을 수 있는 변수입니다.

```hcl
variable "region" {
  type    = string
  default = "ap-northeast-2"
}
```

---

## 3. Data Source
외부 데이터(기존 AMI, Secrets Manager 등)를 조회할 때 사용합니다.

```hcl
data "amazon-ami" "basic" {
  filters = {
    name = "ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"
  }
  most_recent = true
  owners      = ["099720109477"]
}

# 사용 시: data.amazon-ami.basic.id
```
