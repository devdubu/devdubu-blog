---
slug: "3-State-Management"
title: "상태 관리 (State Management)"
---

# 상태 관리 (State Management)

:::info 개요
Terraform은 인프라의 현재 상태를 추적하기 위해 **State 파일**(`terraform.tfstate`)을 사용합니다. 협업 시 이 파일을 안전하게 관리하는 것이 매우 중요합니다.
:::

## 1. State 파일이란?

Terraform이 생성한 리소스와 실제 인프라 간의 매핑 정보를 담고 있는 JSON 파일입니다.
`terraform apply` 실행 시, 이 파일을 참조하여 변경 사항을 감지합니다.

### 1.1 문제점 (로컬 저장 시)
- **공유 불가**: 팀원 간 상태 공유가 어려움.
- **동시성 문제**: 여러 명이 동시에 수정하면 상태가 꼬일 수 있음.
- **보안 위험**: 민감한 정보가 평문으로 저장될 수 있음.

---

## 2. Remote Backend (원격 백엔드)

State 파일을 로컬이 아닌 원격 저장소(S3, Terraform Cloud 등)에 저장하는 것을 권장합니다.
가장 대중적인 조합은 **AWS S3 + DynamoDB**입니다.

### 2.1 AWS S3 Backend 설정
- **S3**: State 파일 저장
- **DynamoDB**: State Locking (동시 수정 방지)

```hcl
terraform {
  backend "s3" {
    bucket         = "my-tf-state-bucket"
    key            = "dev/terraform.tfstate"
    region         = "ap-northeast-2"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}
```

---

## 3. Workspace

하나의 코드 베이스로 여러 환경(dev, staging, prod)을 격리하여 관리할 수 있게 해주는 기능입니다.

```bash
# 워크스페이스 생성 및 전환
terraform workspace new dev

# 워크스페이스 목록
terraform workspace list

# 현재 워크스페이스 이름 사용
# resource "aws_s3_bucket" "b" {
#   bucket = "my-bucket-${terraform.workspace}"
# }
```
