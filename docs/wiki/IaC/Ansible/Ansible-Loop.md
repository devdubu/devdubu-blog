---
slug: "Ansible-Loop"
---
# Ansible Loop


[Loops - Ansible Documentation](https://docs.ansible.com/ansible/latest/user_guide/playbooks_loops.html)

# Loops

반복문에는 3가지의 문법이 존재한다.

`loop`, `with_<lookup>`, `until` 문법이 존재하며, 여기서는 `loop`와 `with_<lookup>` 문법을 살펴볼 예정입니다.

`loop` 문법은 현재 Ansible 2.5버전에서 나온 최신 문법이다. 해당 문법은 `with_<lookup>`을 추후에 완전 대체할 문법입니다.

현재는 완전 대체하지 못하여 공존하고 있지만, 추후에 변경점이 생기지 않게 하기 위해서는 반복문 코드는 `loop`로 만드는 것을 추천한다.

# 실습

```yaml
---

- name: Example
  hosts: ubuntu
  become: true
  vars:
    tags:
      Name: "Debug"
      Environment: "Test"
      Owner: "posquit0"
    users:
    - name: john
      shell: /bin/bash
    - name: alice
      shell: /bin/sh
    - name: claud
      shell: /bin/bash
    - name: henry
      shell: /bin/sh
    - name: jeremy
      shell: /bin/bash
    - name: may
      shell: /bin/sh
  tasks:
  # Docs: https://docs.ansible.com/ansible/latest/collections/ansible/builtin/group_module.html
  - name: "Create groups"
    group:
      name: "{{ item }}"
      state: "present"
    with_items:
    - backend
    - frontend
    - devops

  # Docs: https://docs.ansible.com/ansible/latest/collections/ansible/builtin/user_module.html
  # - name: "Create a user"
  #   user:
  #     name: "{{ item }}"
  #     comment: "FastCampus DevOps"
  #     state: "present"
  #   loop:
  #   - john
  #   - alice
  #   - claud
  #   - henry
  #   - jeremy
  #   - may

  # Docs: https://docs.ansible.com/ansible/latest/collections/ansible/builtin/user_module.html
  - name: "Create a user"
    user:
      name: "{{ item.name }}"
      shell: "{{ item.shell }}"
      comment: "FastCampus DevOps"
      state: "present"
    loop: "{{ users }}"

  - name: "Debug data"
    debug:
      msg: "{{ item.key }}: {{ item.value }}"
    loop: "{{ tags | dict2items }}"
```

→ `group` 문법을 사용하여 ubuntu 운영 체제에 group을 만드는 과정이다.

→ `item` 은 해당 loop에 있는 item을 의미하는 것이다.

→ `with_items` 를 통해서 아래 3가지 원소를 정의 된 것을 볼 수 있다.

이를 토대로 loop를 돌 때는 처음에는 backend, frontend, devops의 방식으로 돌게 되어있다.

→ 해당 명령어는 variable로 loop를 도는 문법이다.

모든 상황에서 항상 리스트만이 loop가 필요한 건 아니다.

그중 대표적으로는 object 형식에 loop가 필요할 수도 있다

→ 해당 코드가 바로 object를 loop로 보는 문법이다.

loop를 들여다보면, 

`“{{ tags | dict2items }}”` 라고 표현이 되어있는데 이는 jinja2 문법으로

\{\{ exp | func }}이 있으면 표현 문법 → 함수 로 들어가는 형식을 취한다.

→ 이는 object 형식의 자료형을 list의 형태로 변환시켜주는 함수이다.

---

#IaC #Ansible

---
