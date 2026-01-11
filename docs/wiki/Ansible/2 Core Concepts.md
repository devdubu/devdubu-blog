---
slug: "2-Core-Concepts"
title: "핵심 개념 (Core Concepts)"
---

# 핵심 개념 (Core Concepts)

:::info 개요
Ansible을 효과적으로 사용하기 위해 필수적인 **Inventory(인벤토리)**와 **Module(모듈)**에 대해 다룹니다.
:::

## 1. Inventory (인벤토리)

Ansible이 관리할 대상 호스트 서버들의 정보를 담고 있는 파일입니다. 기본적으로 `/etc/ansible/hosts`를 사용하지만, `-i` 옵션으로 별도 파일을 지정할 수 있습니다.

### 1.1 Static Inventory (정적 인벤토리)
고정된 IP나 도메인을 직접 명시합니다. INI 또는 YAML 형식을 지원합니다.

```ini
[web]
192.168.1.10
192.168.1.11

[db]
db.example.com

[all:children]
web
db
```

### 1.2 Dynamic Inventory (동적 인벤토리)
클라우드 환경(AWS, GCP 등)처럼 IP가 수시로 변하는 환경에서 사용합니다. Python 스크립트나 플러그인을 통해 실시간으로 호스트 목록을 가져옵니다.

---

## 2. Modules (모듈)

Ansible에서 실제 작업을 수행하는 단위입니다. 멱등성(Idempotency)을 보장하도록 설계되어 있습니다.

### 2.1 주요 모듈

| 모듈 | 설명 | 예시 |
| --- | --- | --- |
| `command` | 단순 쉘 명령어 실행 (쉘 환경변수 사용 불가) | `command: echo hello` |
| `shell` | 쉘을 통해 명령어 실행 (파이프, 리다이렉션 가능) | `shell: echo hello > out.txt` |
| `copy` | 파일 복사 | `copy: src=foo dest=/tmp/foo` |
| `file` | 파일/디렉토리 속성 설정 (권한, 소유자) | `file: path=/tmp/foo state=directory` |
| `apt`/`yum` | 패키지 설치 및 관리 | `apt: name=nginx state=present` |
| `service` | 서비스 데몬 관리 (start, restart) | `service: name=nginx state=started` |

### 2.2 모듈 문서 확인
`ansible-doc` 명령어로 로컬에서 모듈 설명서를 확인할 수 있습니다.

```bash
ansible-doc apt
```
