---
slug: "Terraform-Cloud"
---
- [Execution Mode](#Execution Mode)
	- [Remote](#Execution Mode#Remote)
	- [Local](#Execution Mode#Local)
- [terraform module 작성 방법](#terraform module 작성 방법)
- [Terraform Remote State](#Terraform Remote State)
- [폴더 구조에 대한 이야기](#폴더 구조에 대한 이야기)
- [versions.tf](#폴더 구조에 대한 이야기#versions.tf)
- [variables.tf](#폴더 구조에 대한 이야기#variables.tf)
- [terraform.tf](#폴더 구조에 대한 이야기#terraform.tf)
- [remote-state.tf](#폴더 구조에 대한 이야기#remote-state.tf)
- [output.tf](#폴더 구조에 대한 이야기#output.tf)
- [terraform-switcher → .terraform-version](#폴더 구조에 대한 이야기#terraform-switcher → .terraform-version)


---

![Untitled.png](/img/이미지 창고/Untitled.png)
## Execution Mode

### Remote

는 테라폼 클라우드에서 자제적으로 관리한다.

terraform runner를 활용해서 apply를 진행하다보니, 인프라에 apply에 대한 ip를 확보한 후에 그 ip로 인프라를 돌아가게끔 하는 작업이 필요하다.

조금 번거롭기도 하기 때문에 굳이 추천하진 않는다.

### Local

작업자의 pc에서 apply를 진행하는 것

terraform 클라우드에서는 state 만을 저장하는 방식

# terraform module 작성 방법

![Untitled-1.png](/img/이미지 창고/Untitled-1.png)

terraform 모듈은 이런식으로 작성하면 된다.

root module인 main.tf, account 폴더 안에 존재하는 terraform 모듈인 나머지 모듈들이 child가 되어서 root 모듈을 

# Terraform Remote State

[Terraform Registry](https://registry.terraform.io/providers/hashicorp/terraform/latest/docs/data-sources/remote_state)

- 하나의 workspace에서 인프라를 관리하는 건 문제가 되지 않습니다.
- 하지만, 여러개의 workspace를 다룰 때는 각각의 workspace의 의존성도 생각을 해야하고, 각 workspace간의 관계도 생각을 하면서 인프라를 구성해야합니다.
- 하지만, 형상관리는 하나의 workspace 단위로만 되기 때문에, 이에 대한 관리가 어려울 수 있다.
- 이를 해결하기 위해서 Terraform에서도 remote state라는 기능을 넣었다.
- 이는 각 workspace들의 state를 기능들을 참조해서, 형상관리를 도와주는 도구 입니다.
- terraform remote state는 각 backend에 사용하는 기능이다.

![Untitled-2.png](/img/이미지 창고/Untitled-2.png)

- 현재 코드의 구성은 ec2-instance가 network에 의존하도록 설정해놓았다.
- 실제로도 network는 한개로 두고 그 나머지를 ec2머신으로 두게 된다면 조금 더 효율 적으로 구성을 할 수 있다.

```bash
data "terraform_remote_state" "network" {
  backend = "local"

  config = {
    path = "${path.module}/../network/terraform.tfstate"
  }
}
```

- remote state를 제대로 사용하기 위해서는 아래의 config 모듈에서 제대로 output이 지정이 되어 있어야한다.
- 

```bash
locals {
  vpc_name      = data.terraform_remote_state.network.outputs.vpc_name
  subnet_groups = data.terraform_remote_state.network.outputs.subnet_groups
}
```

- 위의 코드 처럼 …nework.output… 처럼
- 왼쪽의 코드에서 output으로 선언된 코드들을 불러오는데 사용이 된다.

```bash
output "vpc_name" {
  value = module.vpc.name
}

output "vpc_id" {
  value = module.vpc.id
}

output "vpc_cidr" {
  description = "생성된 VPC의 CIDR 영역"
  value = module.vpc.cidr_block
}

output "subnet_groups" {
  value = {
    public  = module.subnet_group__public
    private = module.subnet_group__private
  }
}
```

```bash
resource "aws_instance" "ubuntu" {
  ami           = data.aws_ami.ubuntu.image_id
  instance_type = "t2.micro"
  subnet_id     = local.subnet_groups["public"].ids[0]

  tags = {
    Name = "${local.vpc_name}-ubuntu"
  }
}
```

- 해당 local.subnet_groups는 `nework/main.tf` 에 위치해 있다.
- 이를 remote state로 끌어왔기 때문에, 이를 ec2-instance 도 사용할 수 있는 것다.

# 폴더 구조에 대한 이야기

![Untitled-3.png](/img/이미지 창고/Untitled-3.png)

왼쪽과 같이 많은 파일이 있다 이 중에서도 눈 여겨 볼 부분이 있다.

- versions.tf
- variables.tf
- terraform.tf
- terraform.auto.tfvars
- remote-states.tf
- outputs.tf
- config.yml

을 중심으로 보면 된다.

## versions.tf

```bash
terraform {
  required_version = "~> 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}
```

terraform 블록을 통해서 해당 terraform을 실행하기 위한 최소 버전,

required_provider를 통해서 어떤 provider를 사용할 것이고, 어떤 버전을 사용할 지에 대한 정보를 담는

파일이다.

## variables.tf

```bash
variable "config_file" {
  description = "The path of configuration YAML file."
  type        = string
  default     = "./config.yaml"
}
```

필자는 variable은 하나의 config_file안에 모두 yaml 파일 형식으로 저장을 해놓는다.

그렇기 때문에 variable 파일에는 별다른 내용은 없다.

## terraform.tf

```bash
terraform {
  backend "remote" {
    hostname     = "app.terraform.io"
    organization = "fastcampus-devops"

    workspaces {
      name = "aws-network-apne2-fastcampus"
    }
  }
}

###################################################
# Local Variables
###################################################

locals {
  aws_accounts = {
    fastcampus = {
      id     = "xxxxxxxxxx"
      region = "ap-northeast-2"
      alias  = "posquit0-fastcampus"
    },
  }
  context = yamldecode(file(var.config_file)).context
  config  = yamldecode(templatefile(var.config_file, local.context))
}

###################################################
# Providers
###################################################

provider "aws" {
  region = local.aws_accounts.fastcampus.region

  # Only these AWS Account IDs may be operated on by this template
  allowed_account_ids = [local.aws_accounts.fastcampus.id]

  assume_role {
    role_arn     = "arn:aws:iam::${local.aws_accounts.fastcampus.id}:role/terraform-access"
    session_name = local.context.workspace
  }
}
```

이 terraform은

backend를 remote형식으로 사용하고

oragnization은 fastcampus-devops에서 사용하고 있다.

workspace 는 aws-network-apne2-fastcampus라른 곳에서 사용하고 있다.

그리고 간단한 지역 변수들이 할당 되어 있다.

실제 로컨 변수는 fastcampus 한개 밖에 없고

아래의 context에서 `yamldecode` 를 사용하게 된다면, yaml 파일로 구성된 code를 hcl 문법으로 decode를 해준다.

- context, config 파일을 굳이 나눈 이유
    - 우선 yamldecode(file(var.config_file)).context는
    
    ```bash
    context:
      region: "apne2"
      vpc: "apne2-fastcampus"
      cidrs:
        "primary": "10.222.0.0/16"
        "pod": "10.223.0.0/17"
    ...
    ```
    
    이런식으로 표기가 된다. → 전역적으로 모두 쓰이는 값이기 때문에 우선적으로 불러오며 config 는 `${ }` 처럼 렌더링이 필요한 항목
    
    ```bash
    vpc:
      name: "${vpc}"
      cidr: "${cidrs.primary}"
      secondary_cidrs:
      # EKS Pod CIDR
      - "${cidrs.pod}"
      vpn_gateway_asn: 4242000000
      private_zones:
      - "dev/dkr.ecr.ap-northeast-2.amazonaws.com"
      - "dev/sts.ap-northeast-2.amazonaws.com"
    ```
    
    처럼 랜더링이 필요한 항목들을 그 이후에 불러온다.
    
    `yamldecode(templatefile(var.config_file, local.context))` 
    
    `${ }` 의 값의 위의 context 부근에 위치하기 때문에 이러한 순서로 랜더링하는 것이다.
    

## remote-state.tf

```bash
locals {
  remote_states = {
    "domain-zone" = data.terraform_remote_state.this["domain-zone"].outputs
  }
  domain_zones = local.remote_states["domain-zone"]
}

###################################################
# Terraform Remote States (External Dependencies)
###################################################

data "terraform_remote_state" "this" {
  for_each = local.config.remote_states

  backend = "remote"

  config = {
    organization = each.value.organization
    workspaces = {
      name = each.value.workspace
    }
  }
}
```

- remote-state는 multi workspace를 관리할 때 중요한 기능이다.
- 옆의 코드는 remote-state를 `for_each` 를 통해서 배열로 출력하기 위해서 셋팅해놓은 값이다.

## output.tf

```bash
output "config" {
  value = local.config
}

output "prefix_lists" {
  value = {
    ipv4 = {
      for name, prefix_list in aws_ec2_managed_prefix_list.ipv4 :
      name => {
        id      = prefix_list.id
        arn     = prefix_list.arn
        name    = prefix_list.name
        entries = prefix_list.entry
        version = prefix_list.version
      }
    }
    ipv6 = {
      for name, prefix_list in aws_ec2_managed_prefix_list.ipv6 :
      name => {
        id      = prefix_list.id
        arn     = prefix_list.arn
        name    = prefix_list.name
        entries = prefix_list.entry
        version = prefix_list.version
      }
    }
  }
}

output "vpc" {
  value = module.vpc
}

output "subnet_groups" {
  value = module.subnet_group
}

output "eip" {
  value = aws_eip.this
}

output "nat_gateway" {
  value = module.nat_gw
}

output "nacl" {
  value = module.nacl
}

output "gateway_endpoints" {
  value = module.vpc_gateway_endpoint
}
```

- [output.tf](http://output.tf) 파일은 왼쪽의 파일과 같이 모든 출력파일을 모은 것으로
- output을 모두 모은 것이다.

## terraform-switcher → .terraform-version

```bash
1.0.0
```

- terrform-switcher를 설치하게 된다면, 처음 terraform init 때에 설정해 놓은 버전으로 자동으로 설치를 해준다.

---

#IaC #Terraform

---