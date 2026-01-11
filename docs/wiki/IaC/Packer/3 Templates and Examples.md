---
slug: "3-Templates-and-Examples"
title: "실전 템플릿 예제 (Templates & Examples)"
---

# 실전 템플릿 예제

:::info 개요
실제 운영 환경에서 사용 가능한 **OpenVPN 서버** 이미지 빌드 템플릿과 **멀티 빌드** 전략을 다룹니다.
:::

## 1. OpenVPN 서버 이미지 (OpenVPN)

Grafana 모니터링 서버에 접근하기 위한 Bastion Host 역할을 하는 OpenVPN 서버 이미지를 생성합니다.

### 1.1 디렉토리 구조
```text
packer-openvpn/
├── main.pkr.hcl            # 메인 설정
├── scripts/
│   ├── install-openvpn.sh  # OpenVPN 설치 스크립트
│   └── configure.sh        # 설정 스크립트
└── files/
    └── server.conf         # OpenVPN 설정 파일
```

### 1.2 `main.pkr.hcl` 작성

```hcl
variable "region" {
  default = "ap-northeast-2"
}

source "amazon-ebs" "openvpn" {
  ami_name      = "packer-openvpn-${formatdate("YYYYMMDDhhmm", timestamp())}"
  instance_type = "t2.micro"
  region        = var.region
  source_ami_filter {
    filters = {
      name = "ubuntu/images/*ubuntu-focal-20.04-amd64-server-*"
    }
    owners      = ["099720109477"]
    most_recent = true
  }
  ssh_username = "ubuntu"
}

build {
  name = "openvpn-build"
  sources = ["source.amazon-ebs.openvpn"]

  # 1. 설정 파일 업로드
  provisioner "file" {
    source      = "./files/server.conf"
    destination = "/tmp/server.conf"
  }

  # 2. 설치 스크립트 실행
  provisioner "shell" {
    scripts = [
      "./scripts/install-openvpn.sh",
      "./scripts/configure.sh"
    ]
    execute_command = "sudo -S sh -c '{{ .Vars }} {{ .Path }}'"
  }
}
```

---

## 2. 선택적 빌드 (Only & Except)

하나의 템플릿에 여러 소스가 정의되어 있을 때, 특정 소스만 빌드하거나 제외할 수 있습니다.

```bash
# 특정 소스(null.two)만 빌드
packer build -only="null.two" .

# 특정 소스를 제외하고 빌드
packer build -except="null.one" .
```

---

## 3. 디버깅 (Debugging)

빌드 과정 중 오류가 발생할 때 `-debug` 플래그를 사용하면 단계별로 멈추어 상태를 확인할 수 있습니다. 인스턴스가 종료되지 않은 상태에서 SSH로 접속하여 문제 원인을 파악할 수 있습니다.

```bash
packer build -debug .
```

SSH 키는 빌드 디렉토리에 임시로 생성됩니다.
```bash
ssh -i ec2_pem_key ubuntu@[public_ip]
```
