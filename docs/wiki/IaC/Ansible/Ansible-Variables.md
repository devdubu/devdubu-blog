---
slug: "Ansible-Variables"
---
# Ansible Variables


[Using Variables - Ansible Documentation](https://docs.ansible.com/ansible/latest/user_guide/playbooks_variables.html)

# Ansible Varialbes

- 앤서블은 Python을 사용하기 때문에, Python의 예약어 및 ansible의 예약어를 사용하지 못한다.

## 변수 명

| 가능한 변수명 | 불가능한 변수명 |
| --- | --- |
| foo | *foo , python 예약어 |
| foo_env | playbook의 예약어(environment) |
| foo_port | foo-port, foo port, foo.port |
| foo5, _foo | 5foo, 12 |

## 변수 사용 형태

```yaml
ansible.builtin.template:
  src: foo.cfg.j2
  dest: '{{ remote_install_path }}/foo.cfg'
```

변수의 사용 형태는 `{{ 변수 명 }}` 으로 사용하면 된다.

더 고급적인 지식을 얻고 싶다면 공식문서 아래에 변수 사용법을 자세하게 읽으면 된다

# 실습

## 1. 현 playbook에서 바로 변수를 선언하여 설정하는 방법

```yaml
---

- name: Example
  hosts: ubuntu
  become: true
  vars:
    user_name: "devdubu"
    user_comment: "from playbook vars"
    user_shell: /bin/bash
    user_uid: "7777"
  # vars_files:
  # - vars.yaml
  tasks:
  # Docs: https://docs.ansible.com/ansible/latest/collections/ansible/builtin/user_module.html
  # - name: "Create a user"
  #   user:
  #     name: "devdubu"
  #     comment: "hard coding"
  #     shell: "/bin/bash"
  #     uid: "7777"
  - name: "Create a user"
    user:
      name: "{{ user_name }}"
      comment: "{{ user_comment }}"
      shell: "{{ user_shell }}"
      uid: "{{ user_uid }}"
```

해당 yaml 명령어는 User를 생성하는 명령이다.

→ 변수로 아래의 상황들을 미리 저장을 해놓는다.

→ 후에 user라는 모듈을 작성할 때

아래의 명령에서는 var로만 작성하여 ansible을 작동 시키는 것이다.

playbook 내에서 선언한 변수들은 playbook 내에서만 유효하다

```bash
ansible-playbook -i inventory playbook.yaml
```

## 2. 변수를 따로 yaml파일에 두는 방법

```yaml
---

- name: Example
  hosts: ubuntu
  become: true
 
  vars_files:
	  - vars.yaml
  tasks:

  - name: "Create a user"
    user:
      name: "{{ user_name }}"
      comment: "{{ user_comment }}"
      shell: "{{ user_shell }}"
      uid: "{{ user_uid }}"
```

```yaml
user_name: "posquit0"
user_comment: "from vars.yaml file"
user_shell: "/bin/bash"
user_uid: "7777"
```

```bash
ansible-playbook -i inventory 
```

## 3. inventory 파일에 변수를 선언하는 방법

```yaml
---

- name: Example
  hosts: ubuntu
  become: true

  tasks:

  - name: "Create a user"
    user:
      name: "{{ user_name }}"
      comment: "{{ user_comment }}"
      shell: "{{ user_shell }}"
      uid: "{{ user_uid }}"
```

```bash
[amazon]
amazon1 ansible_host=3.35.53.163 ansible_user=ec2-user
amazon2 ansible_host=3.34.253.165 ansible_user=ec2-user

[ubuntu]
ubuntu1 ansible_host=ec2-3-34-49-77.ap-northeast-2.compute.amazonaws.com ansible_user=ubuntu user_name=posquit0 user_comment="from inventory" user_shell=/bin/bash user_uid=7777
ubuntu2 ansible_host=ec2-13-209-20-108.ap-northeast-2.compute.amazonaws.com ansible_user=ubuntu user_name=posquit0 user_comment="from inventory" user_shell=/bin/bash user_uid=7777

[linux:children]
amazon
ubuntu
```

```bash
ansible-playbook -i vars.inv playbook.yaml
```

 

## CLI 명령어로 보내는 방법

```yaml
---

- name: Example
  hosts: ubuntu
  become: true

  tasks:

  - name: "Create a user"
    user:
      name: "{{ user_name }}"
      comment: "{{ user_comment }}"
      shell: "{{ user_shell }}"
      uid: "{{ user_uid }}"
```

```bash
# 순수 명령어로 변수를 선언하는 방법
ansible-playbook -i inventory playbook.yaml -e "user_comment=helloworld user_shell=/bin/sh"
# yaml 파일을 전송하는 방법
ansible-playbook -i inventory playbook.yaml -e "@vars.yaml"
```

실행 후에 ubuntu AWS 서버에 접속한 다음

```bash
sudo cat /etc/passwd
```

라고 작성하면 playbook.yaml에 추가된 User를 볼 수 있다.

---

#IaC #Ansible

---
