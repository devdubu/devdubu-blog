---
slug: "TerraForm-WorkSpace-Terraform-Local-Provider"
---
- [Terraform WorkSpace 개념](#Terraform WorkSpace 개념)
	- [Terraform의 기능 - 변경 사항 추적](#Terraform WorkSpace 개념#Terraform의 기능 - 변경 사항 추적)
- [Terraform 실습](#Terraform 실습)
		- [Resources](#Terraform의 기능 - 변경 사항 추적#Resources)
		- [Data Source](#Terraform의 기능 - 변경 사항 추적#Data Source)
	- [Sources - Local_file](#Terraform 실습#Sources - Local_file)
		- [.terraform.lock.hcl](#Sources - Local_file#.terraform.lock.hcl)
		- [terraform plan](#Sources - Local_file#terraform plan)
		- [terraform apply](#Sources - Local_file#terraform apply)
	- [Data Source - local_file](#Terraform 실습#Data Source - local_file)

---

# Terraform WorkSpace 개념

인프라를 정의하기 위한 Terraform 하나의 프로젝트 단위

## Terraform의 기능 - 변경 사항 추적

Terraform은 인프라를 코드로 관리할 때 변경 사항을 추적하는 기능을 제공한다.

변경사항을 알기 위해서 상태 관리라는 것을 한다. → `.terraform.tfstate` → workspace 단위로 상태를 관리한다.

# Terraform 실습

Terraform을 실습할 프로젝트 파일로 이동 후에

![Untitled.png](/img/이미지 창고/Untitled.png)
Terraform provider에서 Local을 누른 후 이 Provider를 이용할 것입니다.

![Untitled-1.png](/img/이미지 창고/Untitled-1.png)

Terraform provider에서 `terraform{}` 에 대한 구문은 version 에 대한 명시가 있습니다. 하지만, 이 명시는 굳이 사용하지 않아도 됩니다(명시가 안될 경우에는 자동으로 최신 버전을 적용합니다.)

![Untitled-2.png](/img/이미지 창고/Untitled-2.png)


### Resources

- 왼쪽에 있는 Resource가 local_provider에서 관리하고 있는 인프라 resource가 있다고 보면 된다.
- 데이터를 쓸 때 사용하는 용도, 새로운 것을 만들 때 사용하는 용도

### Data Source

- 인프라를 관리 할 때 데이터를 참조할 때가 있다, 그럴 때 사용 가능한 데이터 소스
- 데이터를 읽을 때 사용하는 용도, 기존에 있는 데이터를 사용하기 위한 용도이다.

## Sources - Local_file

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

resource "local_file" "foo" {
    filename = "${path.module}/foo.txt"
    content  = "Hello World!"
}
```

- 옆에 예시에는 resource가 추가 되었다.
- 여기서 filename은 foo.txt이며, 안의 내용에는 Hello World! 가 적혀있을 것이다.

- 이 부분에서는 `${ }` 는 HCL 문법이다.
    - 이러한 문법은 String interpolation 문법이라고 한다.
    - 변수나 데이터에 접근해서 값을 가져오는 문법이다.
    - 변수, 함수 둘다 가능하다
    - 현재 `${path.module}` 이 문법은 현재의 디렉토리의 경로를 가져오게 하는 뜻이다.

```bash
terraform init
```

![Untitled-3.png](/img/이미지 창고/Untitled-3.png)


```bash
# 만약 terraform을 치기 귀찮다면
alias tf=terraform
# 을 사용하게 된다면 tf로 단축해서 사용 가능하다.
```

이후에 실행하려면 터미널에서 왼쪽의 명령어를 입력하게 된다면 terraform에 대한 컴파일 설정이 완료된다.

![Untitled-4.png](/img/이미지 창고/Untitled-4.png)


### .terraform.lock.hcl

이 파일은 해당 workspace에서 사용하는 provider들을 lock 시키고, version도 lock을 시킴으로써

추후에 협업을 했을 때 환경 셋팅의 통일화를 이르게 하기 위해서 나온 파일이다.

```bash
# This file is maintained automatically by "terraform init".
# Manual edits may be lost in future updates.

provider "registry.terraform.io/hashicorp/local" {
  version     = "2.2.3"
  constraints = "2.2.3"
  hashes = [
    "h1:aWp5iSUxBGgPv1UnV5yag9Pb0N+U1I0sZb38AXBFO8A=",
    "zh:04f0978bb3e052707b8e82e46780c371ac1c66b689b4a23bbc2f58865ab7d5c0",
    "zh:6484f1b3e9e3771eb7cc8e8bab8b35f939a55d550b3f4fb2ab141a24269ee6aa",
    "zh:78a56d59a013cb0f7eb1c92815d6eb5cf07f8b5f0ae20b96d049e73db915b238",
    "zh:78d5eefdd9e494defcb3c68d282b8f96630502cac21d1ea161f53cfe9bb483b3",
    "zh:8aa9950f4c4db37239bcb62e19910c49e47043f6c8587e5b0396619923657797",
    "zh:996beea85f9084a725ff0e6473a4594deb5266727c5f56e9c1c7c62ded6addbb",
    "zh:9a7ef7a21f48fabfd145b2e2a4240ca57517ad155017e86a30860d7c0c109de3",
    "zh:a63e70ac052aa25120113bcddd50c1f3cfe61f681a93a50cea5595a4b2cc3e1c",
    "zh:a6e8d46f94108e049ad85dbed60354236dc0b9b5ec8eabe01c4580280a43d3b8",
    "zh:bb112ce7efbfcfa0e65ed97fa245ef348e0fd5bfa5a7e4ab2091a9bd469f0a9e",
    "zh:d7bec0da5c094c6955efed100f3fe22fca8866859f87c025be1760feb174d6d9",
    "zh:fb9f271b72094d07cef8154cd3d50e9aa818a0ea39130bc193132ad7b23076fd",
  ]
}
```

### terraform plan

```bash
tf plan
```

왼쪽 명령어를 사용하게 된다면 현재 작성한 파일에 어떤 변경점이 있는지 확인이 가능하다.

![Untitled-5.png](/img/이미지 창고/Untitled-5.png)


### terraform apply

```bash
tf apply
```

왼쪽의 명령어를 치게 된다면 위의 변경사항이 반영이 된다.

![Untitled-6.png](/img/이미지 창고/Untitled-6.png)
![Untitled-7.png](/img/이미지 창고/Untitled-7.png)
![Untitled-8.png](/img/이미지 창고/Untitled-8.png)

추가적으로 terraform.tfstate파일이 생성됨을 알수 있다 이는 현재 상태의 테라폼 리소스 변경사항을 저장하고 있음을 확인 할 수 있다.

## Data Source - local_file

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

resource "local_file" "foo" {
    filename = "${path.module}/foo.txt"
    content  = "Hello World!"
}

data "local_file" "foo" {
    filename = "${path.module}/foo.txt"
}
```

왼쪽 처럼 data 블록이 추가 된 것을 볼 수 있다.

그래서 foo.txt파일을 불러 올 것이다.

![Untitled-9.png](/img/이미지 창고/Untitled-9.png)

그리고 데이터를 사용하는 것이기 때문에 Local에서 아무런 변화가 없으므로 NoChange가 뜨게 되는 것이다.

만약 데이터를 출력을 하고 싶다면 `output{}` 이라는 명령어를 사용하면 된다.

```bash
...

data "local_file" "foo" {
    filename = "${path.module}/foo.txt"
}

output "file_foo"{
	value = data.local_file.foo
}

```

![Untitled-10.png](/img/이미지 창고/Untitled-10.png)

위의 사진 처럼, Output 에 file에 대한 정보가 추가 된 것을 볼 수 있다. → 이 또한 local에 대한 변화가 있는 것은 아니기 때문에, 따로 apply가 뜨지 않는다.

---

#Terraform 

---