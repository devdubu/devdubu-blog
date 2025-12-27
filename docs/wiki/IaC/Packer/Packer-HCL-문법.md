---
slug: "Packer-HCL-문법"
---
- [개요](#개요)
	- [local](#개요#local)
- [Builder](#Builder)
- [선택적 빌드(only & except)](#선택적 빌드(only & except))
- [Packer Provisioner](#Packer Provisioner)
- [Data source](#Data source)
	- [Amazon AMI](#Data source#Amazon AMI)
	- [Parameter Store, Secrets Manager](#Data source#Parameter Store, Secrets Manager)
	- [실습 코드](#Data source#실습 코드)
- [Post-Processors](#Post-Processors)
	- [Checksum Post-Processor](#Post-Processors#Checksum Post-Processor)
	- [Local Shell Post Processor](#Post-Processors#Local Shell Post Processor)
	- [실습](#Post-Processors#실습)
- [Packer Debuging](#Packer Debuging)
- [기타 명령어](#기타 명령어)
	- [packer fmt](#기타 명령어#packer fmt)
	- [packer inspect](#기타 명령어#packer inspect)
	- [packer validate](#기타 명령어#packer validate)

---

# 개요

[Packer by HashiCorp](https://www.packer.io/docs/templates/hcl_templates/blocks)

위 사이트를 들어가게 되면, 기본적으로 HCL은 block 단위로 코드가 돌아간다. 그리고, Terraform과 차이점이 있다면, 사용하는 문법에 대한 차이점이다.

![Untitled.png](/img/이미지 창고/Untitled.png)
위 사이트에서는 terraform과 유사한 언어로써는 locals, variable, packer, data가 있다. 이중에서 packer는 terraform에서 terraform문법에 속한다.

![Untitled-1.png](/img/이미지 창고/Untitled-1.png)

옆의 build 아래에 있는

4가지의 요소인 source, provisioner, post-processor, post-processors

도 매우 중요한 역할을 한다.

## local

```bash
# locals.pkr.hcl
locals {
    # locals can be bare values like:
    wee = local.baz
    # locals can also be set with other variables :
    baz = "Foo is '${var.foo}' but not '${local.wee}'"
}

# Use the singular local block if you need to mark a local as sensitive
local "mylocal" {
  expression = "${var.secret_api_key}"
  sensitive  = true
}
```

Terraform과는 다르게 locals만 존재하는게 아닌 단일 local 블록이 존재한다.

여기서 local은 지역변수로 활용된다.

# Builder

[Packer by HashiCorp](https://www.packer.io/docs/builders)

Packer에서 Builder는 어떤 머신 이미지를 만드는지에 대한 결정을 하는 것.

→ AWS EC2, Docker AMI 등등

AWS를 굽는 것은 생각보다 오랜 시간이 걸리기 때문에, Null Builder로 구워보도록 하겠습니다.

[Packer by HashiCorp](https://www.packer.io/docs/builders/null)

Null Builder은 말 그래도 아무것도 굽지 않은 것을 의미합니다.

우선 실습을 위해서

![Untitled-2.png](/img/이미지 창고/Untitled-2.png)****

파일을 준비합니다.

```bash
/**
 * Without Name
 */
build {
  sources = [
    "source.null.one",
    "source.null.two",
  ]
}
# source는 source.pkr.hcl파일에서 설정해놓은
# 변수들을 이곳에서 build하는 것이다.
# 위의 source는 순서가 상관 없는 리스트이므로, 순서는 신경 쓰지 않아도 된다.

/**
 * With Name
 */
build {
  name    = "fastcampus-packer"

  sources = [
    "source.null.one",
    "source.null.two",
  ]
}

/**
 * Fill-in
 */
build {
  name    = "fastcampus-packer-fill-in"

  source "null.one" {
    name = "terraform"
  }

  source "null.two" {
    name = "vault"
  }
}
```

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
```

```bash
source "null" "one" {
  communicator = "none"
}

source "null" "two" {
  communicator = "none"
}
```

위의 source에서 `“null”` 로 설정했기 때문에, null Builder로 작동한다.

그리고 communicator는 provisioning과 연관 되어 있다.

→ provisioning은 ssh 혹은 win_rm으로 연결하는 방식이지만,

현재 우리는 null 방식으로 진행하고 있기 때문에, 이 방식을 `none` 이라고 설정해 놓은 것이다.

**build 블록은 하나의 코드에 여러개 선언되어도 상관이 없다.**

![Untitled-3.png](/img/이미지 창고/Untitled-3.png)

이를 통해서 4가지 빌드가 실행됨을 확인 할 수 있다.

만약 name을 지정해서 build를 해준다면 `fastcampus-packer-fill-in` 으로 지정했다면, 이 이름이 prefix로 지정되어서 이름이 붙어지게 된다.

main.pkr.hcl 파일의 맨 하단을 보게 된다면,

```bash
/**
 * Fill-in
 */
build {
  name    = "fastcampus-packer-fill-in"

  source "null.one" {
    name = "terraform"
  }

  source "null.two" {
    name = "vault"
  }
}
```

source를 다시 재 선언하는 것을 알 수 있다.

![Untitled-4.png](/img/이미지 창고/Untitled-4.png)

위의 처럼 6가지의 방식이 생성된 것을 확인 할 수 있으며, 아래와 같이

null 값을 통해서 ami를 빌드 했으므로, 이제는 실제로 aws로 build를 하는 것을 해보자면,

```bash
build {
  name    = "fastcampus-packer"

  source "amazon-ebs.ubuntu" {
    name     = "vault"
    ami_name = "fastcampus-packer-vault"
  }
	# ami 이름은 중복되면 안되는 값이다.
  source "amazon-ebs.ubuntu" {
    name     = "consul"
    ami_name = "fastcampus-packer-consul"
  }
	# provisioner는 서버를 실행하고 바로 실행할 script를 의미한다.
  provisioner "shell" {
    inline = [
      "echo Hello World!"
    ]
  }

  provisioner "shell" {
    inline = [
      "echo Next World!"
    ]
  }
	# build가 끝나고 어떤 산출물들이 남아야하는지를 정의하는 것이다.
  post-processor "shell-local" {
    inline = [
      "echo Hello World!"
    ]
  }

  post-processor "shell-local" {
    inline = [
      "echo Next World!"
    ]
  }
}
# provisioner -> post-processor의 순서로 무조건 작성해야한다.
# 이는 순서가 있는 것이기 때문에 이런식으로 작성해야한다.
```

```bash
source "amazon-ebs" "ubuntu" {
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
```

# 선택적 빌드(only & except)

위의 null build의 파일을 잠시 인용하면

```bash
packer build .
```

를 진행하면, 모든 builder에 대해서 build가 진행된다.

이를 조금 더 선택적으로 하기 위해서 only라는 옵션을 사용한다.

```bash
pakcer build -only="null.two" .
```

![Untitled-5.png](/img/이미지 창고/Untitled-5.png)

위의 코드를 작성하게 되면, 위의 사진과 같이 `null.two` 만이 build되게 된다.

만약 두가지 이상을 지정하고 싶다면

```bash
packer build -only="null.two,fastcampus-packer.null.two" .
```

![Untitled-6.png](/img/이미지 창고/Untitled-6.png)

로 2개가 골라서 출력이 된다. only와 except는 *.one이 적용되기 때문에, 여러 개를 묶어서 표현 할 때는 이런 식으로 작성하면 된다.

```bash
packer build -only="*.two" .
```

except는 같은 방식으로, 문장을 써준 것을 제외하고 나머지를 build 해준다고 생각하면 된다.

# Packer Provisioner

우선 코드를 보면서 살펴보겠습니다.

```bash
build {
  name = "fastcampus-packer"

  source "amazon-ebs.ubuntu" {
    name     = "nginx"
    ami_name = "fastcampus-packer-nginx"
  }

  provisioner "shell" {
    inline = [
      "sudo apt-get update",
      "whoami",
    ]
  }

  provisioner "file" {
    source      = "${path.root}/files/index.html"
    destination = "/tmp/index.html"
  }

  provisioner "shell" {
    inline = [
      "echo ${source.name} and ${source.type}",
      "whoami",
      "sudo apt-get install -y nginx",
      "sudo cp /tmp/index.html /var/www/html/index.html"
    ]
  }

  provisioner "breakpoint" {
    disable = false
    note    = "디버깅용"
  }
}
```

source에서 name을 한번 더 선언함으로서 overwrite를 했다.

provisioner는 순서대로 실행 되기 때문에 그에 대한 순서는 중요하다.

→ 패키지 갱신

→ `${source.name}`, `${source.type}` 은 위에 선헌한 amazon.ebs와 nginx를 가르킨다.

후에 만약 build가 완료 되었다면, 보안 그룹에 들어가서 포트를 뚫어주면 된다.

![Untitled-7.png](/img/이미지 창고/Untitled-7.png)

![Untitled-8.png](/img/이미지 창고/Untitled-8.png)****

![Untitled-9.png](/img/이미지 창고/Untitled-9.png)

# Data source

[Packer by HashiCorp](https://www.packer.io/plugins/datasources/amazon)

Amazon AWS Data source에는 3가지 소스가 있다.

## Amazon AMI

```bash
data "amazon-ami" "basic-example" {
    filters = {
        virtualization-type = "hvm"
        name = "ubuntu/images/*ubuntu-xenial-16.04-amd64-server-*"
        root-device-type = "ebs"
    }
    owners = ["099720109477"]
    most_recent = true
}
```

- Amazon AMI를 가져다가, `filter` 를 하여서 검색 할 수 있는 기능을 추가 한 것이다.


## Parameter Store, Secrets Manager

```bash
data "amazon-parameterstore" "basic-example" {
  name = "packer_test_parameter"
  with_decryption = false
}

# usage example of the data source output
locals {
  value   = data.amazon-parameterstore.basic-example.value
  version = data.amazon-parameterstore.basic-example.version
  arn     = data.amazon-parameterstore.basic-example.arn
}
```

```bash
data "amazon-secretsmanager" "basic-example" {
  name = "packer_test_secret"
  key  = "packer_test_key"
  version_stage = "example"
}

# usage example of the data source output
locals {
  value         = data.amazon-secretsmanager.basic-example.value
  secret_string = data.amazon-secretsmanager.basic-example.secret_string
  version_id    = data.amazon-secretsmanager.basic-example.version_id
  secret_value  = jsondecode(data.amazon-secretsmanager.basic-example.secret_string)["packer_test_key"]
}
```

위 두가지는 현업에서도 자주 사용된다. 이유인 즉슨, 비밀키나 혹은 외부로 정보가 노출 되서는 안되는 그러한 민감 정보 같은 경우를 secret data에 저장하고, 필요시에만 꺼내 쓰는 방식으로 활용이 가능하다.

## 실습 코드

```bash
data "amazon-secretsmanager" "fastcampus" {
  name = "fastcampus"
  key  = "test"
}

build {
  name    = "fastcampus-packer"

  source "amazon-ebs.ubuntu" {
    name     = "nginx"
    ami_name = "fastcampus-packer-nginx"
  }

  provisioner "shell" {
    inline = [
      "sudo apt-get update",
      "echo Secret is ${data.amazon-secretsmanager.fastcampus.value}",
    ]
  }

  provisioner "file" {
    source      = "${path.root}/files/index.html"
    destination = "/tmp/index.html"
  }

  provisioner "shell" {
    inline = [
      "echo ${source.name} and ${source.type}",
      "whoami",
      "sudo apt-get install -y nginx",
      "sudo cp /tmp/index.html /var/www/html/index.html"
    ]
  }
}
```

→ amazon의 secret manager를 사용한 packer 코드이다.

```bash
data "amazon-ami" "ubuntu" {
  filters = {
    virtualization-type = "hvm"
    name                = "ubuntu/images/*ubuntu-focal-20.04-amd64-server-*"
    root-device-type = "ebs"
  }
  owners = ["099720109477"]
  most_recent = true
}

source "amazon-ebs" "ubuntu" {
  instance_type = "t2.micro"
  region        = "ap-northeast-2"
  source_ami = data.amazon-ami.ubuntu.id

  ssh_username = "ubuntu"
}
```

→ data 블록에는 반복적으로 많이 사용되는 것들을 미리 셋팅하고

→ source 부분에서는 지엽적인 부분을 따로 설정해서 반복을 최대한 줄인다.

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
```

secret manager을 사용하기 위해서는 우선 검색창에 검색 한다.

![Untitled-10.png](/img/이미지 창고/Untitled-10.png)

![Untitled-11.png](/img/이미지 창고/Untitled-11.png)

![Untitled-12.png](/img/이미지 창고/Untitled-12.png)

위의 처럼 셋팅을 해준다. 그 후에 오른쪽 하단에 다음을 누른후

![Untitled-13.png](/img/이미지 창고/Untitled-13.png)

fastcampus라고 작명을 지어주면 된다.

이후에는 계속 다음을 눌러준다면, 깡통 비밀키 완성이다.

이후에

```bash
packer build .
```

로 packer를 실행한다.

# Post-Processors

[Packer by HashiCorp](https://www.packer.io/docs/post-processors)

post-processor란 patch의 후처리 기능을 의미한다. 말 그래도 packer가 build 종료 후에 하는 후처리라고 보면 된다.

`post-processor`와 `post-processors` 두가지 종류가 있다.

## Checksum Post-Processor

우선 Packer의 과정을 알아본다면

1. build
2. artifact(산출물)
3. 후처리(post-processors)

로 구성되는데 이때 checksum은 무결성을 검사하는 요소이다.

```json
{
  "type": "checksum",
  "checksum_types": ["sha1", "sha256"],
  "output": "packer_{{.BuildName}}_{{.ChecksumType}}.checksum"
}
```

```json
post-processor "checksum" {
  checksum_types = ["sha1", "sha256"]
  output = "packer_{{.BuildName}}_{{.ChecksumType}}.checksum"
}
```

- 왼쪽의 코드는 해시함수를 이용해서 packer의 산출물의 무결성을 체크하는 함수이다.
- 이에 대해서 md5, sha256의 결과물을 저장함으로써 변조된 파일인지 아닌지를 판단하는 블록이다.

## Local Shell Post Processor

```json
source "file" "example" {
    content = "example content"
}

build {
  source "source.file.example" {
    target = "./test_artifact.txt"
  }

  post-processor "shell-local" {
    inline = ["echo foo"]
  }
}
```

- 마음에 드는 post-processor가 없을 때는
- 직접 shell로 직접적으로 post-processor 명령을 하여, 수행할 수 있다.

## 실습

```bash
build {
  name    = "fastcampus-packer"

  source "amazon-ebs.ubuntu" {
    name     = "nginx"
    ami_name = "fastcampus-packer"
  }

  post-processor "manifest" {}

  post-processors {
    post-processor "shell-local" {
      inline = ["echo Hello World! > artifact.txt"]
    }
    post-processor "artifice" {
      files = ["artifact.txt"]
    }
    post-processor "compress" {}
  }

  post-processors {
    post-processor "shell-local" {
      inline = ["echo Finished!"]
    }
  }
}
```

```bash
source "amazon-ebs" "ubuntu" {
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
```

위의 코드를 자세히보다보면

```bash
  post-processor "manifest" {} 

	post-processors {
    post-processor "shell-local" {
      inline = ["echo Hello World! > artifact.txt"]
    }
    post-processor "artifice" {
      files = ["artifact.txt"]
    }
    post-processor "compress" {}
  }
```

→ `post-processor`를 한가지만 사용하게 된다면 입력 값으로는 빌드 산출물을 받게 된다. 즉, 한번에 입력값을 가지고 결과물을 내면 된다.

→ 하지만 `post-processors` 는 내부에 `post-processor` 를 둠으로써 각각의 `post-processor`들이 순차적으로 작동하게끔 하는 역할을 한다.

# Packer Debuging

저번에 했던 provisioner 코드를 보게 된다면

```bash
provisioner "breakpoint"{
	disable = false;
	note = "디버깅용"
}
```

해당 명령어는 사용자에게 Enter를 요구한다.

이를 응하지 않을 시에는 provisioning이 충족되지 않는다.

이런식으로도 debug 혹은 build 시에 오류를 막을 수 있다. 하지만, 이에도 충분하지 않을 경우에는 Packer에서 제공하는 Debug기능을 사용하면 된다.

```bash
packer build -debug .
```

![Untitled-14.png](/img/이미지 창고/Untitled-14.png)

를 실행하게 되면 debug모드로 전환된다. 이 말은 사용자에게 Enter를 요구하게 된다.

Debug모드를 진행하게 된다면, 2가지 기능을 제공한다. Packer에서 ec2 머신 생성후 AIM로 만들게 될 때는, 먼저 ec2를 만들게 되어있는데 이때 임시로 .pem키를 만들게 된다.

![Untitled-15.png](/img/이미지 창고/Untitled-15.png)

![Untitled-16.png](/img/이미지 창고/Untitled-16.png)

- 위와 같은 식으로 임시적인 .pem키를 만들게 된다.
- 이때 다른 터미널로 ssh로 접속을 한다면, 접속이 가능하다.

```bash
ssh -i ec2_ubuntu ubuntu@[public ip]"
```

를 치게 된다면 접속이 가능하다. → permission deny가 뜬다면, `chmod 600` 으로 변경 후에 사용하면 된다.

# 기타 명령어

## packer fmt

packer 에서 지향하는 코드 컨벤션으로 포멧팅을 해준다.

```bash
packer fmt .
```

을 하게 된다면 알아서 fomating을 해주게 된다.

## packer inspect

![Untitled-17.png](/img/이미지 창고/Untitled-17.png)

packer inspect를 하게 된다면, 해당 템플릿이 어떤 구조를 가지고 있는지 청 사진을 획득할 수 있다.

```bash
packer inspect . #or 디렉토리 경로
```

## packer validate

각 템플릿의 값의 자료형이 맞는지에 대한 내용을 선행적으로 체크 해준다.

```bash
packer validate .
```


---

#IaC #Packer

---