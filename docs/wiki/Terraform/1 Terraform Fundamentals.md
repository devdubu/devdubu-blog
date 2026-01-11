---
slug: "1-Terraform-Fundamentals"
title: "Terraform 기초 및 설치 (Fundamentals)"
---

# Terraform 기초 및 설치

:::info 개요
**Terraform**은 HashiCorp에서 만든 **IaC (Infrastructure as Code)** 도구로, 인프라를 코드로 정의하고 프로비저닝, 변경, 버전 관리를 자동화합니다.
:::

## 1. 왜 Terraform인가?

클라우드 환경에서는 수많은 리소스(서버, 네트워크, 보안 그룹 등)를 생성하고 관리해야 합니다. 이를 콘솔에서 클릭으로 관리하면 실수가 발생하기 쉽고, 히스토리 관리가 불가능합니다.

Terraform을 사용하면:
- **코드 기반 관리**: Git을 통한 버전 관리 및 협업 가능
- **실행 계획 (Plan)**: 적용 전 변경 사항 미리 확인
- **리소스 그래프**: 리소스 간 의존성 자동 파악
- **멀티 클라우드 지원**: AWS, Azure, GCP 등 다양한 프로바이더 지원

---

## 2. 설치 (Installation)

### 2.1 MacOS
```bash
brew tap hashicorp/tap
brew install hashicorp/tap/terraform

# 설치 확인
terraform version
```

### 2.2 자동 완성 설정 (Zsh)
```bash
terraform -install-autocomplete
# 쉘 재시작 필요
exec zsh
```

### 2.3 플러그인 캐시 설정 (권장)
디스크 공간 절약 및 속도 향상을 위해 플러그인 캐시를 설정하는 것이 좋습니다.

`~/.terraformrc` 파일 생성:
```hcl
plugin_cache_dir   = "$HOME/.terraform.d/plugin-cache"
disable_checkpoint = true
```

캐시 디렉토리 생성:
```bash
mkdir -p ~/.terraform.d/plugin-cache
```

---

## 3. 기본 명령어

- `terraform init`: 작업 디렉토리 초기화 (Provider 플러그인 다운로드)
- `terraform plan`: 변경 사항 예측 (Dry Run)
- `terraform apply`: 실제 리소스 생성 및 변경
- `terraform destroy`: 생성된 모든 리소스 삭제
- `terraform fmt`: 코드 포맷팅
