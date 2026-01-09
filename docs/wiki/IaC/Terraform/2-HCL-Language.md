---
slug: "2-HCL-Language"
title: "2. HCL 언어 문법 (HCL Language)"
---

# HCL 언어 문법 (HCL Language)

:::info 개요
Terraform에서 사용하는 **HCL**의 주요 블록(`provider`, `resource`, `variable`, `output`, `data`)과 자료형, 반복문에 대해 다룹니다.
:::

## 1. 주요 블록 (Block)

### 1.1 Provider
클라우드 서비스 제공자(AWS, Azure 등)를 설정합니다.

```hcl
provider "aws" {
  region = "ap-northeast-2"
}
```

### 1.2 Resource
실제 생성할 인프라 자원입니다.

```hcl
resource "aws_s3_bucket" "my_bucket" {
  bucket = "my-tf-test-bucket"
}
```

### 1.3 Variable (Input)
입력 변수를 정의합니다. 타입을 명시하여 유효성을 검증할 수 있습니다.

```hcl
variable "instance_count" {
  type    = number
  default = 1
}
```

### 1.4 Output
프로비저닝 완료 후 출력할 값을 정의합니다.

```hcl
output "bucket_name" {
  value = aws_s3_bucket.my_bucket.id
}
```

### 1.5 Data Source
외부 정보를 조회합니다.

```hcl
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]
}
```

---

## 2. 자료형 (Types)

- **Primitive**: `string`, `number`, `bool`
- **Collection**: `list`, `map`, `set`
- **Structural**: `object`, `tuple`

### 예시: Object Type
```hcl
variable "user" {
  type = object({
    name = string
    age  = number
  })
}
```

---

## 3. 반복문 (Loop)

### 3.1 count
단순히 리소스를 여러 개 생성할 때 사용합니다. 인덱스(`count.index`)를 활용할 수 있습니다.

```hcl
resource "aws_instance" "server" {
  count = 3
  tags = {
    Name = "Server-${count.index}"
  }
}
```

### 3.2 for_each
Map이나 Set을 순회할 때 사용합니다. `each.key`와 `each.value`로 접근합니다. **권장되는 방식**입니다.

```hcl
resource "aws_iam_user" "users" {
  for_each = toset(["alice", "bob"])
  name     = each.key
}
```
