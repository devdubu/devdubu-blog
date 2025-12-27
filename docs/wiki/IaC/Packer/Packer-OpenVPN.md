---
slug: "Packer-OpenVPN"
---
- [public subent](#public subent)
- [private subnet](#private subnet)
- [1. Packer를 통해서 AMI를 만든다](#1. Packer를 통해서 AMI를 만든다)
- [2. AMI를 바탕으로 terraform으로 ec2서버에 올린다.](#2. AMI를 바탕으로 terraform으로 ec2서버에 올린다.)
- [grafana](#grafana)

---


현재 Packer에서는 Terraform 때 적용한 OpenVPN을 조금 더 개선한 모델을 Packer를 통해서 만들려고 합니다.

현재의 구상도를 잠깐 살펴보자면

**public subnet - private subnet** 

으로 구성되어 있다.

### public subent

openVPN으로 접속을 시도한다.

### private subnet

grafana를 위치 시킨다. - 모니터링 도구 중에 한개이다.

이를 이용해서 openVPN → grafana 로 접속을 시킨다

현재는 이 부분을 Terraform으로 깡으로 만들기 보다는

### 1. Packer를 통해서 AMI를 만든다

### 2. AMI를 바탕으로 terraform으로 ec2서버에 올린다.

이런 식으로 실습을 진행할 예정입니다.

![Untitled.png](/img/이미지 창고/Untitled.png)
- 대략 파일의 구성은 이런 식으로 되어있다.
- 여기서 내가 설정을 변경해줘야하는 값은 config.yaml에서 terraform cloud organization으로 변경, ec2.tf에서 keyname을 본인의 keyname으로 변경
- network/terraform.tf 에서 oraganization 본인 것으로 교체
- 

# grafana

```bash
data "amazon-ami" "ubuntu" {
  filters = {
    virtualization-type = "hvm"
    name                = "ubuntu/images/*ubuntu-focal-20.04-amd64-server-*"
    root-device-type    = "ebs"
  }
  owners      = ["099720109477"]
  most_recent = true
}

locals {
  created_at = timestamp()
  version = formatdate("YYYYMMDDhhmm", local.created_at)
  ami_name        = join("/", [
    "ubuntu",
    "20.04",
    "amd64",
    "${var.name}-${local.version}"
  ])
  source_tags = {
    "source-ami.packer.io/id"         = "{{ .SourceAMI }}"
    "source-ami.packer.io/name"       = "{{ .SourceAMIName }}"
    "source-ami.packer.io/owner-id"   = "{{ .SourceAMIOwner }}"
    "source-ami.packer.io/owner-name" = "{{ .SourceAMIOwnerName }}"
    "source-ami.packer.io/created-at" = "{{ .SourceAMICreationDate }}"
  }
  build_tags = {
    "build.packer.io/name"       = var.name
    "build.packer.io/version"    = local.version
    "build.packer.io/os"         = "ubuntu"
    "build.packer.io/os-version" = "20.04"
    "build.packer.io/region"     = "{{ .BuildRegion }}"
    "build.packer.io/created-at" = local.created_at
  }
}

source "amazon-ebs" "ubuntu" {
  ami_name        = local.ami_name
  ami_description = var.description
  source_ami    = data.amazon-ami.ubuntu.id

  instance_type = "t2.micro"
  region        = "ap-northeast-2"
  ssh_username = "ubuntu"

  run_tags = merge(
    local.source_tags,
    local.build_tags,
    {
      "Name" = "packer-build/${local.ami_name}",
    }
  )
  tags = merge(
    local.source_tags,
    local.build_tags,
    {
      "Name" = local.ami_name,
    }
  )
}
```

→ 해당 `run_tag` 부분은 packer에서 ec2 머신을 만들고, 중지 하기 전에 생기는 tag들로, ec2, secruity group, ebs에 생기는 태그이며,

→ `tag` 는 packer에서 빌드가 완료된 AMI에 붙는 tag를 의미한다. 즉, snapshot이나, 혹은 ami 에 tag가 붙는다.

```bash
build {
  name = "aws"

  sources = [
    "amazon-ebs.ubuntu",
  ]

  provisioner "shell" {
    inline = [
      "cloud-init status --wait",
    ]
    execute_command = "sudo -S sh -c '{{ .Vars }} {{ .Path }}'"
  }

  provisioner "shell" {
    scripts = [
      "${path.root}/scripts/update-apt.sh",
      "${path.root}/scripts/install-common-tools.sh",
      "${path.root}/scripts/configure-locale.sh",
      "${path.root}/scripts/install-docker.sh",
      "${path.root}/scripts/run-docker-grafana.sh",
      "${path.root}/scripts/clean-apt.sh",
    ]
    execute_command = "sudo -S sh -c '{{ .Vars }} {{ .Path }}'"
  }

  post-processor "manifest" {
    output     = "dist/packer-manifest.json"
    strip_path = true
  }
}
```

→ provisioner에서는 `cloud-init status --wait` 은 userdata로 정의된 명령어들이 다 수행될 때까지 기다리는 명령어이다.

→ 이후는 차례대로 서버가 실행되고 그 후의 작업들을 shell로써 정의하는 것이다.

이후 실습 환경에서는 

1. 모든 packer 파일이 build가 완료 된 후에,
2. network 디렉토리로 들어가서 `terraform apply`를 하면 된다.
3. ec2-instance 디렉토리로 들어가서 `terraform apply` 를 하면 된다.
4. 후에는 Terraform에서 openvpn을 사용했던 것 처럼 openvpn을 설정하면 되고,
5. 그 후에 `openvpn_instance`의 private ip로 접근을 시도하고 접근이 된다면, 성공이다
6. 그 후에 `grafana_instace`에서 [private ip]:3000 을 url에 시도한 후에 접속된다면 성공이다.

---

#IaC #Packer

---