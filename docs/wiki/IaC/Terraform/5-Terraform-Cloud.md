---
slug: "5-Terraform-Cloud"
title: "5. Terraform Cloud (TFC)"
---

# Terraform Cloud (TFC)

:::info 개요
**Terraform Cloud(TFC)**는 HashiCorp에서 제공하는 SaaS형 관리 플랫폼입니다. 원격 State 저장소, 협업 기능(Locking), 원격 실행(Remote Execution) 환경을 제공합니다.
:::

## 1. 주요 기능

### 1.1 Remote State Management
State 파일을 로컬이나 S3가 아닌 TFC 내부에 안전하게 저장합니다.

### 1.2 Remote Execution
`terraform apply` 명령을 로컬 컴퓨터가 아닌 TFC 서버에서 실행합니다. 이로 인해 로컬 환경(키, 버전 등)에 구애받지 않고 일관된 배포가 가능합니다.

### 1.3 VCS Integration
GitHub, GitLab 등과 연동하여, 코드가 푸시되면 자동으로 Plan/Apply가 실행되도록 파이프라인(GitOps)을 구성할 수 있습니다.

---

## 2. 설정 방법

### 2.1 로그인
```bash
terraform login
```

### 2.2 `cloud` 블록 설정
`backend` 블록 대신 `cloud` 블록을 사용합니다. (Terraform 1.1 이상)

```hcl
terraform {
  cloud {
    organization = "my-org"

    workspaces {
      name = "my-workspace"
    }
  }
}
```

---

## 3. 비용
- **Free Tier**: 5명까지 무료, State 저장 및 원격 실행 무제한.
- 개인 프로젝트나 소규모 팀에게는 S3 백엔드보다 설정이 간편하고 강력한 기능을 제공합니다.
