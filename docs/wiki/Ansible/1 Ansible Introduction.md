---
slug: "1-Ansible-Introduction"
title: "Ansible 기초 및 설치 (Introduction)"
---

# Ansible 기초 및 설치

:::info 개요
**Ansible**은 인프라를 코드로 관리(IaC)하고 자동화하기 위한 오픈 소스 도구입니다. 에이전트리스(Agentless) 아키텍처를 가지며, SSH를 통해 통신합니다.
:::

## 1. Ansible 아키텍처

Ansible은 **Control Node**(관리 서버)에서 **Managed Nodes**(대상 서버)로 명령을 내리는 구조입니다. 대상 서버에 별도의 에이전트를 설치할 필요가 없다는 것이 가장 큰 장점입니다.

- **Inventory**: 관리 대상 서버의 목록을 정의한 파일
- **Playbook**: 실행할 작업들을 YAML 형식으로 정의한 파일
- **Module**: 실제 작업을 수행하는 단위 (예: 파일 복사, 패키지 설치)

---

## 2. 설치 (Installation)

### 2.1 Linux & MacOS
Ansible은 Python 기반으로 동작하므로 pip를 이용한 설치를 권장합니다.

```bash
# pip 설치 확인
pip3 -V

# Ansible 설치
pip3 install ansible

# 설치 확인
ansible --version
```

---

## 3. 기본 사용법 (Ad-hoc Command)

Playbook을 작성하기 전, 간단한 명령을 수행하는 Ad-hoc 모드입니다.

```bash
# 모든 호스트에 ping 테스트
ansible all -m ping

# 디스크 용량 확인
ansible all -a "df -h"
```

### 주요 옵션
- `-m`: 실행할 모듈 선택 (기본값: command)
- `-a`: 모듈에 전달할 인자
- `all`: 대상 호스트 패턴 (all은 전체)
