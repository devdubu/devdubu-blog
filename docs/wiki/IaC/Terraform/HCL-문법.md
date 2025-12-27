---
slug: "HCL-문법"
---
- [공식 Langauge documentation](#공식 Langauge documentation)
- [기초 HCL 문법](#기초 HCL 문법)
- [Terraform에 파일 구조](#Terraform에 파일 구조)
	- [파일 확장자](#Terraform에 파일 구조#파일 확장자)
	- [Modules(Directory)](#Terraform에 파일 구조#Modules(Directory))
		- [root Module, child Module](#Modules(Directory)#root Module, child Module)
	- [Identifier](#Terraform에 파일 구조#Identifier)
	- [주석](#Terraform에 파일 구조#주석)
	- [HCL 관습](#Terraform에 파일 구조#HCL 관습)
- [AWS instance 생성](#AWS instance 생성)
- [Terraform Modules](#Terraform Modules)
	- [public subnet](#Terraform Modules#public subnet)
	- [private subnet](#Terraform Modules#private subnet)
	- [router table](#Terraform Modules#router table)
		- [public router table](#router table#public router table)
		- [private router table](#router table#private router table)
- [variable](#variable)
	- [우선 순위](#variable#우선 순위)
		- [환경변수](#우선 순위#환경변수)
		- [terraform.tfvars 파일](#우선 순위#terraform.tfvars 파일)
		- [*.auto.tfvars 파일](#우선 순위#*.auto.tfvars 파일)
	- [variable terraform file의 변수](#variable#variable terraform file의 변수)
- [LocalValue](#LocalValue)
	- [tags](#LocalValue#tags)
- [output](#output)
		- [description](#tags#description)
- [반복문](#반복문)
	- [하드코딩](#반복문#하드코딩)
	- [count](#반복문#count)
	- [set](#반복문#set)
	- [map](#반복문#map)
- [조건문](#조건문)
- [Tf 의 For](#Tf 의 For)
	- [List Type [](#Tf 의 For#List Type [ ])]
		- [List → List](#List Type [ ]#List → List)
		- [Map → List](#List Type [ ]#Map → List)
	- [Map Type \{ }](#Tf 의 For#Map Type \{ })
		- [List → Map](#Map Type \{ }#List → Map)
	- [For문에서 if](#Tf 의 For#For문에서 if)



![https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1594969872/noticon/h5f5dlugmnwgbt3dvrzx.png](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1594969872/noticon/h5f5dlugmnwgbt3dvrzx.png)

# 공식 Langauge documentation

[Terraform by HashiCorp](https://www.terraform.io/)

# 기초 HCL 문법

```bash
# 기본 사용 방법
<BLOCK TYPE> "<BLOCK LABEL>" "<BLOCK LABEL>" {
  # Block body
  <IDENTIFIER> = <EXPRESSION> # Argument
}
# 예제
resource "aws_vpc" "main" {
  cidr_block = var.base_cidr_block
}
```

# Terraform에 파일 구조

## 파일 확장자

기본적으로 `.tf` 는 HCL 문법을 사용합니다. 하지만, 사용자의 편의상 JSON이 편하다고 느끼면, `.tf.json` 이라고 확장자 명을 변경하면 된다.

⇒ HCL문법보다 장점이 많은 방식은 아니기 때문에 그렇게 추천 하진 않는 방식이다.

Terraform은 현 디렉토리에 존재하는 `.tf` 파일만 파싱하고 하위 디렉토리에 존재하는 `.tf` 파일은 파징 하지 않는다.

## Modules(Directory)

### root Module, child Module

`terraform apply` 를 어느 파일에서 혹은 어느 디렉토리에서 하느냐에 따라서 달라진다.

즉, `[a.tf](http://a.tf)`, `b.tf`, `[c.tf](http://c.tf)` 3개의 terraform 파일 중에서 `a.tf` 파일을 기준으로 `terraform apply`를 한다면, 이는 `a.tf` 가 root Module이 될 것이며, 

`a.tf`에 의해서 `b.tf`, [`c.tf`](http://c.tf) 가 호출이 된다면, `b.tf`, `c.tf`는 child Module 이 될 것이다.

## Identifier

블록의 label을 구성하는 것을 identifier라고 부른다

identifier는 문자, underscore(_), hyphens(-)이다. 숫자는 금지하고 있다.

## 주석

```bash
#
//
/**/
```

왼쪽의 주석 모두 허용

## HCL 관습

```json
ami           = "abc123" 
instance_type = "t2.micro"
```

왼쪽의 코드 처럼 = 를 기준으로 양 옆을 맞추어서 가독성을 올리는 관습이 있다.

하지만 매번 위의 코드처럼 하기에는 힘들 수도 있다. 그렇기 때문에

```bash
resource "aws_instance" "example" {
  count = 2 # meta-argument first

  ami           = "abc123"
  instance_type = "t2.micro"

  network_interface {
    # ...
  }

  lifecycle { # meta-argument block last
    create_before_destroy = true
  }
}
```

왼쪽의 명령대로 각 블록마다의 의미가 다르다. 

인스턴스 설정, 네트워크 설정 등등 이 의미마다 한 칸씩 블록을 띄우는 것도 방법이 된다

이러한 규칙은 또한 작성마다 달라질 수도 있고, 이를 귀찮아하는 개발자들을 위해서 Terraform은 이에 대한 기능을 지원합니다.

```bash
# terraform formating 에 대한 명령어 모음집
terraform fmt -h

# terraform
terraform fmt -diff
```

라는 명령어를 치게 된다면, 자동으로 Terraform에서 추구하는 코드 관습을 적용해준다.

# AWS instance 생성

```bash
provider "aws" {
  region = "ap-northeast-2"
}

resource "aws_instance" "ubuntu" {
  ami = "ami-058165de3b7202099"
  instance_type = "t2.micro"

  tags = {
    "Name" = "fastcampus-ubuntu"
  }
}
```

왼쪽의 명령을 수행하게 된다면,

aws instance 상에서 region은 ap-northeast-2로 표기 되며,

나머지 ami, instance_type, name tag 등등 세부 사항을 적어주고

```bash
tf apply
```

를 하게 되면, 자동으로 ec2 머신이 생성됩니다.

```bash

data "aws_ami" "example" {
  most_recent      = true
  owners           = ["099720109477"] #Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}
```

data 에서는 

most_recent는 ami의 다양한 버전 중에서 최신 버전을 리턴 하는 것에 true를 한 것이다.

- filter 블록에서는 ami name이, value의 정규식을 통해서 amd-64-server에 대한 모든 ami를 가져온는 뜻이다.
- 다른 filter로는 가상화 타입이 hvm으로 되어있는 것을 가져오는 것을 설정할 수 있다.
- owner는 canonical이라고 ubuntu를 만든 회사의 번호를 입력하며, canonical 회사에 것만 가져온다는 것이다.

이에 대한 자세한 내용은

[Terraform Registry](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/ami#argument-reference)

위 사이트에 명시되어 있다.

이러한 방식을 적용한다면, 상단에 나와있는 `ami = "ami-058165de3b720209` 이 value 값을 외우지 않아도 된다.

# Terraform Modules

[Module Sources | Terraform by HashiCorp](https://www.terraform.io/language/modules/sources)

Module에 대한 설정을 하는 파트가 나오는 공식 페이지이다.

이때 Module은 Local에서 사용하는지 혹은 Terraform Registry, Github 마다 사용하는 방법이 다르기 때문에 한번 살펴보는 것을 권장한다.

유심히 봐야할 것은

- [Local Path](https://www.terraform.io/language/modules/sources#local-paths)
- [Terraform Registry](https://www.terraform.io/language/modules/sources#terraform-registry)
- [GitHub](https://www.terraform.io/language/modules/sources#github)
- [Bitsbucket](https://www.terraform.io/language/modules/sources#bitbucket)(회사 용도)

등이 있다

## public subnet

```bash
...
module "subnet_group__public" {
  source  = "tedilabs/network/aws//modules/subnet-group"
  version = "0.24.0"

  name                    = "${module.vpc.name}-public"
  vpc_id                  = module.vpc.id
  map_public_ip_on_launch = true

  subnets = {
    "${module.vpc.name}-public-001/az1" = {
      cidr_block           = "10.0.0.0/24"
      availability_zone_id = "apne2-az1"
    }
    "${module.vpc.name}-public-002/az2" = {
      cidr_block           = "10.0.1.0/24"
      availability_zone_id = "apne2-az2"
    }
  }

  tags = {}
}
...
```

`[module.vpc.name](http://module.vpc.name)` 은 module에서 정의한

```bash
module "vpc" {
...
  name = "fastcampus"
...
} 
```

을 의미한다.

`map_public_ip_on_launch = true` : 퍼블릭 서브넷이므로, 이 서브넷에는 퍼블릭 ip가 자동으로 할당하게 해주는 의미이다.

옆의 코드는 해당 서브넷이 두가지 리전에 위치 하게끔 설정을 해 놓았다.

## private subnet

```bash
module "subnet_group__private" {
  source  = "tedilabs/network/aws//modules/subnet-group"
  version = "0.24.0"

  name                    = "${module.vpc.name}-private"
  vpc_id                  = module.vpc.id
  map_public_ip_on_launch = false

  subnets = {
    "${module.vpc.name}-private-001/az1" = {
      cidr_block           = "10.0.10.0/24"
      availability_zone_id = "apne2-az1"
    }
    "${module.vpc.name}-private-002/az2" = {
      cidr_block           = "10.0.11.0/24"
      availability_zone_id = "apne2-az2"
    }
  }

  tags = {}
}
```

`map_public_ip_on_launch = false` : 이 부분은 private subnet이기 때문에, 이 부분에서는 false를 놓아야한다.

## router table

### public router table

```bash
module "route_table__public" {
  source  = "tedilabs/network/aws//modules/route-table"
  version = "0.24.0"

  name   = "${module.vpc.name}-public"
  vpc_id = module.vpc.id

  subnets = module.subnet_group__public.ids

  ipv4_routes = [
    {
      cidr_block = "0.0.0.0/0"
      gateway_id = module.vpc.internet_gateway_id
    },
  ]

  tags = {}
}
```

### private router table

```bash
module "route_table__private" {
  source  = "tedilabs/network/aws//modules/route-table"
  version = "0.24.0"

  name   = "${module.vpc.name}-private"
  vpc_id = module.vpc.id

  subnets = module.subnet_group__private.ids

  ipv4_routes = [] # NAT 게이트를 해야하지만, 과금이 발생함 -> 아예 인터넷 게이트를 막아버림

  tags = {}
}
```

# variable

```bash
...
variable "vpc_name" {
  ~~
}
module "vpc"{
	name = var.vpc_name
	...
}
...
```

- variable을 사용한다면, `var.vpc_name` 을 사용하여서 안에 있는 변수를 사용 가능하다.
- 이는 optional한 변수이므로, 빈 값을 넣어도 상관 없다.
- 이로 인해서 `[module.vpc.name](http://module.vpc.name)` 을 사용한다면, `var.vpc_name` 으로 모든 값이 변경된다

[Input Variables - Configuration Language | Terraform by HashiCorp](https://www.terraform.io/language/values/variables)

맨 하단에, 변수 선언에서 우선 순위에 대한 부분이 나와있다.

## 우선 순위

### 환경변수

우선 순위 첫번째는 환경 변수이다.

```bash
export TF_VAR_vpc_name=hello

#만약 환경 변수를 없애고 싶다면
unset TF_VAR_vpc_name
```

왼쪽과 같이 하게 된다면, 1순위 우선순위로 설정되어서 모든 vpc_name을 덮어 씌우게 된다

[Input Variables - Configuration Language | Terraform by HashiCorp](https://www.terraform.io/language/values/variables#environment-variables)

### terraform.tfvars 파일

```bash
vpc_name=fastcampus
```

왼쪽의 방식대로 `terraform.tfvars` 라는 파일을 설정하면 fastcampus로 설정이 덮어 씌워지게 된다. → `terraform.tfvars` 라고 설정하지 않으면 인식 X

대신 직접 설정을 해주면 된다.

만약 `terraform.tfvars` 를 `test.tfvars`로 변경한 다음 설정하고 싶다면

```bash
tf apply -var-file=test.tfvars
```

로 명령어를 치게 된다면 `test.tfvars`파일로 인식하게 된다.

### *.auto.tfvars 파일

이 파일로 실행 시에는 별도의 설정 없이 자동으로 알아서 해준다.

## variable terraform file의 변수

[Input Variables - Configuration Language | Terraform by HashiCorp](https://www.terraform.io/language/values/variables#arguments)

```bash
variable "vpc_name" {
  default = "default"
  description = "생성되는 VPC 이름"
  type = string
}
```

- `[default](https://www.terraform.io/language/values/variables#default-values)` - 변수의 값을 지정하지 않았을 때 기본적으로 사용하는 값이다.
- `[type](https://www.terraform.io/language/values/variables#type-constraints)` - 해당 문서의 variable의 type(string …), 기본적으로 추론 기능이 있기 때문에 굳이 명시할 필요는 없다.
- `[description](https://www.terraform.io/language/values/variables#input-variable-documentation)` - 이 명령은 주석의 역할을 하며, 협업을 할 때 어떤 변수는 어떤 이름으로 지어라 이런 부분을 명시하는 역할을 한다.

위의 명령을 주로 사용한다.

# LocalValue

- 중간에서 사용하는 지역 변수의 느낌이다.
- 지속적으로 반복되는 값을 사용할 때는 local 변수를 사용한다.

## tags

- aws의 대부분은 resource들은 tag로 관리된다.
- 가끔은 공통으로 적용되는 tag들이 있어야할 필요가 생긴다.

```bash
locals {
  common_tags={
    Project = "Network"
    Owner = "posquit0"
  }
}

module "vpc" {
	 ...
  tags = local.common_tags
}
```

# output

[Output Values - Configuration Language | Terraform by HashiCorp](https://www.terraform.io/language/values/outputs)

- Terraform의 코드가 돌고 난 후에, 나오는 값들을 정의하는 것으로 보면 된다.

```bash
...
output ""vpc_name"" {
  value= module.vpc.name
}
output "vpc_id" {
  value = module.vpc.id
}
output "vpc_cidr" {
  value=module.vpc.cidr
}
# output "public_subnet_group"{
#   value = module.subnet_group__public
# }
# output "private_subnet_group" {
#   value = module.subnet_group__private
# }
output "subnet_group" {
  value={
    public=module.subnet_group__public
    private=module.subnet_group__private
  }
}

...
```

![Untitled.png](/img/이미지 창고/Untitled.png)
위 처럼 output이 뜨는 것을 알 수 있습니다.

- value또한 Object 형식으로 사용 가능하다.

### description

```bash
output "vpc_cidr" {
  description = "생성된 vpc의 CIDR 영역"
  value=module.vpc.cidr_block
}
```

- 위의 local variable처럼 `desription`도 똑같은 의미로 사용 된다고 보면 된다.

# 반복문

## 하드코딩

```bash
provider "aws" {
  region = "ap-northeast-2"
}

/*
 * No count / for_each
 */
resource "aws_iam_user" "user_1" {
  name = "user-1"
}

resource "aws_iam_user" "user_2" {
  name = "user-2"
}

resource "aws_iam_user" "user_3" {
  name = "user-3"
}

output "user_arns" {
  value = [
    aws_iam_user.user_1.arn,
    aws_iam_user.user_2.arn,
    aws_iam_user.user_3.arn,
  ]
}
```

옆의 명령어를 실행하게 되면 3개의 EC2 인스턴스가 생성됨을 알 수 있다.

왼쪽의 방식은 중복이 많이 가미된 인스턴스 생성 방법이다.

## count

```bash
resource "aws_iam_user" "count" {
  count = 10

  name = "count-user-${count.index}"
}

output "count_user_arns" {
  value = aws_iam_user.count.*.arn
}
```

```bash
resource "aws_iam_user" "count" {
  count = 10

  name = "count-user-${count.index}"
}

output "count_user_arns" {
  value = aws_iam_user.count.*.arn
}
```

- Count는 resource 외에도 data source, module 에도 사용 가능하다.
- 우선 이 예에서는 resource에서 예시를 들었으므로, resource 블록 안에서 count를 사용 → meta-argument라고 한다.
- meta-argument는 resource 블록 최 상단에 위치하는게 규율이다.
- `${count.index}`라고 할 때 상단에 나와있는 `“count”`라고 하는 부분에서 count가 나온 것이다.
- `count.index는` 말 그대로 1~9까지의 숫자를 나타낸다.

- `value = aws_iam_user.count.*.arn`
- 이에 대한 의미는 상단에 count.*은 count는 배열로 값이 저장디 된다.
- 즉, [aws_iam_user1, aws_iam_user2…] 이러한 형식으로 저장이 되기 때문에 위의 코드는 배열을 호출 하는 것이다.
- 배열을 호출하며서 그 중에서 arn 값을 불러오는 의미라고 봐도 된다.

## for_each

```bash
/*
 * for_each
 */

resource "aws_iam_user" "for_each_set" {
  for_each = toset([
    "for-each-set-user-1",
    "for-each-set-user-2",
    "for-each-set-user-3",
  ])

  name = each.key
}

output "for_each_set_user_arns" {
  value = values(aws_iam_user.for_each_set).*.arn
}

```

for-each라는 속성은 set, map을 둘다 지원한다.

## set

- set은 List Unique element 방식이며, [1,2,3,4]로 나타낼 수 있다.
- 즉, `[ ]` 대괄호가 작성되어 있으면, 보통을 list가 default가 되므로
- set으로 형변환을 하려면 `toset` 이라는 함수로 설정하면 된다.
- set은 key, value가 구분이 없고 같이 동작한다. 즉,
- `each.key == each.value` 의 관계이다.
- `keys`, `values` 는 모든 key값과 모든 values 값을 불러오는 함수이다.

```bash
resource "aws_iam_user" "for_each_map" {
  for_each = {
    alice = {
      level = "low"
      manager = "posquit0"
    }
    bob = {
      level = "mid"
      manager = "posquit0"
    }
    john = {
      level = "high"
      manager = "steve"
    }
  }

  name = each.key
	# 이름은 각 key의 값을 의미하는 것
  tags = each.value
	# value는 각 태그를 의미하고, 안에 내부 값을 넣어주는 것이다.
}
```

## map

- map은 set과 다르게 key, value 타입이며
- `each.key ≠ each.value` 인 값이다.

```bash
 alice = {
      level = "low"
      manager = "posquit0"
    }
```

위에서 alice는 무조건 string으로 설정해야한다.

하지만 밑에 설정 즉, `level = “low”` 는 type과 무관한다.

![Untitled-1.png](/img/이미지 창고/Untitled-1.png)

```bash
tf state list
```

![Untitled-2.png](/img/이미지 창고/Untitled-2.png)

- 리스트를 사용할 때는 장점이 많이 있지만, 단점도 명확하다.
- 이는 만약 중간에서 삭제가 될 때 tf은 destory → replace를 하기 때문에 문제가 생기는 경우가 생긴다.
- 그렇기 때문에 무조건적으로 list를 사용하는건 좋지 못하고, 그러한 문제점이 있으므로 map 형식을 사용하는 경우도 있으니, 잘 선택해서 사용하면 된다.

# 조건문

```bash
provider "aws" {
  region = "ap-northeast-2"
}

/*
 * Conditional Expression
 * Condtion ? If_True : If_False
 */
variable "is_john" {
  type = bool
  default = true
}

locals {
  message = var.is_john ? "Hello John!" : "Hello!"
}

output "message" {
  value = local.message
}
```

- 삼항 다항식과 같이 ? 연산자를 통해서 true, false를 나누게 된다.
- 값이 true이기 때문에 Hello John이 출력됐다.

![Untitled-3.png](/img/이미지 창고/Untitled-3.png)

```bash
# 만약 false로 설정하게 된다면
tf apply -var="is_john=false"
```

![Untitled-4.png](/img/이미지 창고/Untitled-4.png)

```bash
...
/*
 * Count Trick for Conditional Resource
 */
variable "internet_gateway_enabled" {
  type = bool
  default = true
}

resource "aws_vpc" "this" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_internet_gateway" "this" {
  count = var.internet_gateway_enabled ? 1 : 0

  vpc_id = aws_vpc.this.id
}
```

- 왼쪽의 코드는 count와 조건문을 혼합하여 internetgateway를 생성하는지 안하는지에 대해 관련된 코드 이다.

# Tf 의 For

[For Expressions - Configuration Language | Terraform by HashiCorp](https://www.terraform.io/language/expressions/for)

우리가 아는 for문과는 살짝 다른 개념이다.

## List Type [ ]

### List → List

```bash
[for k, v in var.map : length(k) + length(v)]
```

왼쪽의 for문은 map의 함수를 이용해서

- k는 key 값을 의미하고, v는 value 값을 의미한다.
- 왼쪽 코드의 뜻은 [key 값의 문자 길이 + value 값의 문자 길이, …] 로 하나의 값이 된다.

### Map → List

```bash
[for i, v in var.list : "${i} is ${v}"]
```

만약 list에서 for문을 이용하는 것이면

- i는 index를 의미하며,
- v는 value를 의미한다.

## Map Type \{ }

### List → Map

```bash
{for s in var.list : s => upper(s)}
```

- 왼쪽과 마찬가지로 s는 value이고, `upper(s)` 는 key로 변하게 된다.

## For문에서 if

```bash
[for s in var.list : upper(s) if s != ""]
```

- 과정
    - 만약 빈 문자열이 아닐 때만 upper(s)라는 결과 값을 넣는다.
    - 빈 문자열이라면 결과 값을 넣지 않는다.

Ex)

```bash
provider "aws" {
  region = "ap-northeast-2"
}

/*
 * Groups
 */

resource "aws_iam_group" "developer" {
  name = "developer"
}

resource "aws_iam_group" "employee" {
  name = "employee"
}

output "groups" {
  value = [
    aws_iam_group.developer,
    aws_iam_group.employee,
  ]
}

/*
 * Users
 */

variable "users" {
  type = list(any)
}

resource "aws_iam_user" "this" {
  for_each = {
    for user in var.users :
    user.name => user
  }

  name = each.key

  tags = {
    level = each.value.level
    role  = each.value.role
  }
}

resource "aws_iam_user_group_membership" "this" {
  for_each = {
    for user in var.users :
    user.name => user
  }

  user   = each.key
  groups = each.value.is_developer ? [aws_iam_group.developer.name, aws_iam_group.employee.name] : [aws_iam_group.employee.name]
}

```

```bash
locals {
  developers = [
    for user in var.users :
    user
    if user.is_developer
  ]
	#개발자가 develop일 때만 developer 리스트에 들어 갈 수 있다.
}

resource "aws_iam_user_policy_attachment" "developer" {
  for_each = {
    for user in local.developers :
    user.name => user
  }
		# AWS의 기본 유저 정책을 통해서
  user       = each.key
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
		# developer에게만 관리자 권한을 주었다.
  depends_on = [
    aws_iam_user.this
  ]
		# 해당 리소소가 어떤 부분에서 의존하는지를 임의적으로 정해주는 코드 
		# depends_on 코드가 생성해야만이 resource 블록이 생성된다.
}

output "developers" {
  value = local.developers
}

output "high_level_users" {
  value = [
    for user in var.users :
    user
    if user.level > 5
  ]
}
```

---

#IaC #Terraform

---