---
slug: "4-Variables-and-Facts"
title: "4. 변수와 팩트 (Variables & Facts)"
---

# 변수와 팩트 (Variables & Facts)

:::info 개요
Playbook을 재사용 가능하게 만드는 **변수(Variables)**와 대상 서버의 정보를 수집하는 **팩트(Facts)**, 그리고 민감 정보를 관리하는 **Vault**에 대해 다룹니다.
:::

## 1. 변수 (Variables)

변수는 Playbook 내에서 `{{ variable_name }}` 형태로 사용됩니다.

### 1.1 변수 정의 위치
1.  **Playbook 내 `vars`**: 가장 간단한 방식
2.  **Inventory 파일**: 호스트별/그룹별 변수 정의
3.  **별도 파일 (`vars_files`)**: 변수만 모아둔 파일 분리

```yaml
vars:
  http_port: 80
  server_name: "example.com"

tasks:
  - name: Print var
    debug:
      msg: "Port is {{ http_port }}"
```

---

## 2. 팩트 (Facts)

Ansible이 대상 서버에 접속했을 때 자동으로 수집하는 시스템 정보입니다. (OS 버전, IP 주소, 메모리 등)

- `ansible_facts['distribution']`: OS 배포판 이름 (Ubuntu, CentOS 등)
- `ansible_facts['default_ipv4']['address']`: IP 주소
- `ansible_facts['processor_vcpus']`: CPU 코어 수

```yaml
- name: Print OS info
  debug:
    msg: "System is {{ ansible_facts['distribution'] }}"
```

---

## 3. Ansible Vault

비밀번호나 API 키 같은 민감한 정보를 암호화하여 저장하는 기능입니다.

```bash
# 암호화된 파일 생성
ansible-vault create secrets.yml

# 파일 편집
ansible-vault edit secrets.yml

# 암호화된 파일 사용하여 Playbook 실행
ansible-playbook site.yml --ask-vault-pass
```

### 활용
```yaml
vars_files:
  - secrets.yml  # 암호화된 파일 로드

tasks:
  - name: Login with secret
    command: login --password {{ db_password }}
```
