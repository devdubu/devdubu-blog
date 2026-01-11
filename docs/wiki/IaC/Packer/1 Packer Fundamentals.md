---
slug: "1-Packer-Fundamentals"
title: "Packer 기초 (Fundamentals)"
---

# Packer 기초

:::info 개요
**Packer**는 HashiCorp에서 만든 오픈 소스 도구로, 단일 소스 구성(JSON/HCL)에서 여러 플랫폼(AWS, Docker, VMWare 등)을 위한 동일한 머신 이미지(Machine Image)를 생성합니다.
:::

## 1. 사용 이유 (Why Packer?)

Terraform과 같은 IaC 도구로 인프라를 프로비저닝할 때, 서버가 부팅된 후 패키지를 설치하고 설정을 적용하는 과정(Warm-up)이 오래 걸릴 수 있습니다.
Packer를 사용하면 **모든 설정이 완료된 골든 이미지(Golden Image)**를 미리 빌드(Build)해두고, 이를 배포 시 바로 사용할 수 있어 초기 기동 시간을 획기적으로 단축할 수 있습니다.

### 주요 장점
- **Super fast infrastructure deployment**: 이미지가 준비되어 있어 배포가 빠릅니다.
- **Improved stability**: 미리 빌드하고 테스트한 이미지를 사용하므로 안정성이 높습니다.
- **Portability**: 동일한 설정으로 AWS AMI, Docker Image 등을 동시에 생성할 수 있습니다.

![Packer Workflow](https://www.packer.io/img/packer-workflow.svg)

---

## 2. 작동 방식

Packer는 이미지를 빌드하기 위해 클라우드 서비스(예: AWS)에 임시 인스턴스를 생성하고, 프로비저닝(설정)을 수행한 뒤, 이를 스냅샷/이미지 형태로 저장하고 임시 인스턴스를 삭제합니다.

1.  **Builder**: EC2, Docker 등 플랫폼별 임시 머신 생성
2.  **Provisioner**: 쉘 스크립트, Ansible 등을 통해 패키지 설치 및 설정
3.  **Post-Processor**: 생성된 이미지에 태그를 붙이거나 압축하는 등의 후처리

---

## 3. 설치 및 명령어

### 3.1 설치 (MacOS)
```bash
brew tap hashicorp/tap
brew install hashicorp/tap/packer
```

### 3.2 주요 명령어

```bash
# 초기화 (필수 플러그인 설치)
packer init .

# 템플릿 포맷팅 (HCL 표준 스타일)
packer fmt .

# 템플릿 유효성 검사
packer validate .

# 구조 확인 (청사진)
packer inspect .

# 빌드 실행
packer build .

# 디버그 모드 빌드 (단계별 Enter 키 입력 필요)
packer build -debug .
```

---

## 4. 로컬에서 AMI 삭제 가이드
Packer 실습 후 생성된 AWS AMI는 비용 절감을 위해 삭제하는 것이 좋습니다.

1.  AWS 콘솔 > **EC2** > **AMI** 메뉴 이동
2.  생성된 AMI 선택 > **작업** > **AMI 등록 취소(Deregister)**
3.  **EC2** > **스냅샷(Snapshots)** 메뉴 이동
4.  해당 AMI의 스냅샷 선택 > **삭제** (AMI만 지우고 스냅샷을 안 지우면 비용 발생)
