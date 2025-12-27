---
slug: "Ansible-Conditionals"
---
# Ansible Conditionals

[Conditionals - Ansible Documentation](https://docs.ansible.com/ansible/latest/user_guide/playbooks_conditionals.html)

# Conditional

```yaml
---

- name: Example
  hosts: all
  become: true
  vars:
    users:
    - name: john
      shell: /bin/bash
      enabled: true
    - name: alice
      shell: /bin/sh
      enabled: false
    - name: claud
      shell: /bin/bash
      enabled: true
    - name: henry
      shell: /bin/sh
      enabled: false
    - name: jeremy
      shell: /bin/bash
      enabled: true
    - name: may
      shell: /bin/sh
      enabled: false
  tasks:
  # Docs: https://docs.ansible.com/ansible/latest/collections/ansible/builtin/user_module.html
  - name: "Create a user if enabled in Amazon Linux"
    user:
      name: "{{ item.name }}"
      shell: "{{ item.shell }}"
      comment: "FastCampus DevOps"
      state: "present"
    loop: "{{ users }}"
    when: item.enabled and (ansible_facts["distribution"] == "Amazon")

  - name: "Show items between 10 and 100"
    debug:
      var: item
    loop: [ 0, 192, 154, 456, 7, 2, -1, 55, 234]
    when:
    - item >= 10
    - item <= 100

  - name: "Show items not between 10 and 100"
    debug:
      var: item
    loop: [ 0, 192, 154, 456, 7, 2, -1, 55, 234]
    when:
    - (item < 10) or (item > 100)

  - name: "Install Packages on Ubuntu"
    apt:
      name: "{{ item }}"
      update_cache: true
      state: "present"
    loop:
    - git
    - curl
    - htop
    when:
    - ansible_facts['distribution'] == 'Ubuntu'

  - name: "Install Packages on Amazon Linux"
    yum:
      name: "{{ item }}"
      state: "present"
    loop:
    - git
    - curl
    - htop
    when:
    - ansible_facts['distribution'] == 'Amazon'

  - name: "Print users"
    command: "cut -d: -f1 /etc/passwd"
    register: users

  - name: "Is there claud"
    debug:
      msg: "There is no claud"
    when: users.stdout.find('claud') == -1
```

→ 이번 코드는 ubuntu, amazon 그룹 모두 실행되도록 설정 했다.

→ 기존 loop 코드와 동일하다.

→ 해당 라인을 보면 `when` 속성이 추가 된 것을 알 수 있다.

`when : item.enable and (ansible_facts[”distribution”] == “Amazon”)` 

이 뜻은 item 중에서 enable가 true인 것과 facts(시스템 속성)의 distribution이 Amazon인 경우 = Amazon linux인 경우에만 통과가 된다.

→ 해당 라인의 `when`을 보게 된다면

`- itme >= 10`

`- item <= 100` 

를 사용하게 된다면 → object 형식으로 사용한다면, and 연산자로 계산 된다.

→ 만약 or 문을 사용하고 싶다면, `(item < 10) or (item > 100)` 을 사용하면 된다.

→ ubuntu 운영체제에서는 이러한 명령어가 먹히지 않기 때문에, amazon linux일 때만 이 명령어가 실행되도록 조건문을 걸었다.

→ 해당 라인의 명령어는 위에서 User중 claud를 추가 했다.

이때 그 claud가 추가가 됐다면, Skip이 될 것이고, 만약 claud가 없다면,

There is no claud

를 호출하게 될 것이다.

---

#IaC #Ansible

---
