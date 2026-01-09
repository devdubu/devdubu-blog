---
slug: "3-Playbooks"
title: "3. 플레이북 작성 (Playbooks)"
---

# 플레이북 작성 (Playbooks)

:::info 개요
**Playbook**은 Ansible의 핵심으로, 실행할 작업(Task)들을 **YAML** 형식으로 정의한 파일입니다. 조건문, 반복문, 핸들러 등 프로그래밍적인 제어가 가능합니다.
:::

## 1. 기본 구조

Playbook은 하나 이상의 **Play**로 구성되며, 각 Play는 대상 호스트(`hosts`)와 실행할 작업(`tasks`)을 정의합니다.

```yaml
---
- name: Web Server Setup
  hosts: webservers
  become: true  # root 권한 상승

  tasks:
    - name: Install Nginx
      apt:
        name: nginx
        state: present
```

---

## 2. 제어문 (Conditionals & Loops)

### 2.1 반복문 (Loops)
`loop` 또는 `with_items` 키워드를 사용합니다.

```yaml
- name: Create users
  user:
    name: "{{ item.name }}"
    shell: "{{ item.shell }}"
    state: present
  loop:
    - { name: 'alice', shell: '/bin/bash' }
    - { name: 'bob',   shell: '/bin/sh' }
```

### 2.2 조건문 (Conditionals)
`when` 키워드를 사용하여 특정 조건 만족 시에만 실행합니다. `ansible_facts`와 함께 자주 사용됩니다.

```yaml
- name: Install Git on Ubuntu
  apt:
    name: git
    state: present
  when: ansible_facts['distribution'] == "Ubuntu"
```

---

## 3. 핸들러 (Handlers)

설정 파일이 변경되었을 때만 서비스 재시작(Restart)과 같은 작업을 트리거하고 싶을 때 사용합니다. `notify`로 호출하며, **Play의 마지막에 한 번만 실행**됩니다.

```yaml
  tasks:
    - name: Copy Nginx Config
      copy:
        src: nginx.conf
        dest: /etc/nginx/nginx.conf
      notify: Restart Nginx

  handlers:
    - name: Restart Nginx
      service:
        name: nginx
        state: restarted
```
