---
slug: "Ansible-Module"
---
# Ansible Module

ansible 의 공식 문서이다.

[Ansible Documentation - Ansible Documentation](https://docs.ansible.com/ansible/latest/index.html)

여기서 왼쪽 메뉴에 보면 **Collection Index**가 보인다.

Collection Index 에서 amazon도 좋지만 ansible의 순수 실력을 올리기 위해서는 

[Ansible.Builtin - Ansible Documentation](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/index.html#plugins-in-ansible-builtin)

ansible의 내장 docs인 build-in part를 읽어보는 것도 좋은 방법이다.

# 실습

```yaml
---

- name: Example
  hosts: ubuntu
  become: true
  tasks:
  # Docs: https://docs.ansible.com/ansible/latest/collections/ansible/builtin/user_module.html
  - name: "Create a user"
    user: "name=fastcampus shell=/bin/bash"

  - name: "Hello World"
    command: "echo 'Hello World!'"

  # Docs: https://docs.ansible.com/ansible/latest/collections/ansible/builtin/lineinfile_module.html
  - name: "Add DNS server to resolv.conf"
    lineinfile:
      path: /etc/resolv.conf
      line: 'nameserver 8.8.8.8'

  # Docs: https://docs.ansible.com/ansible/latest/collections/ansible/builtin/apt_module.html
  - name: "Install Nginx"
    apt:
      name: nginx
      state: present
      update_cache: true

  # Docs: https://docs.ansible.com/ansible/latest/collections/ansible/posix/synchronize_module.html
  - name: "Upload web directory"
    synchronize:
      src: files/html/
      dest: /var/www/html
      archive: true
      checksum: true
      recursive: true
      delete: true

  # Docs: https://docs.ansible.com/ansible/latest/collections/ansible/builtin/copy_module.html
  - name: "Copy nginx configuration file"
    copy:
      src: files/default
      dest: /etc/nginx/sites-enabled/default
      owner: "{{ ansible_user }}"
      group: "{{ ansible_user }}"
      mode: '0644'

  # Docs: https://docs.ansible.com/ansible/latest/collections/ansible/builtin/service_module.html
  - name: "Ensure nginx service started"
    service:
      name: nginx
      state: started
```

## user

- 사용자들을 관리하는 module을 의미한다.

[ansible.builtin.user module - Manage user accounts - Ansible Documentation](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/user_module.html)

## lineinfile

- 해당 모듈은 특정 파일의 특정 라인에 해당하는 코드가 있는지 확인해주는 모듈이다.
- 만약 해당 라인이 없다면 추가, 해당 라인이 존재한다면 skip을 하는 동장 방식이다.
- 이는 설정 파일을 확인하고 싶을 때 아주 유용한 명령어이다.

[ansible.builtin.lineinfile module - Manage lines in text files - Ansible Documentation](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/lineinfile_module.html)

## apt

- ubuntu의 경우 apt-get을 하는 것이다
- update_cache는 `apt-get update` 라고 생각하면 된다.

[ansible.builtin.apt module - Manages apt-packages - Ansible Documentation](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/apt_module.html)

## synchronize

- linux 명령어의 rsync와 유사한 명령어 이다.
- src - 로컬 데스크탑, dest : 원격 데스크탑에 위치한 폴더/파일 이라고 생각하면 된다.
- 이는 로컬과 원격데스크탑이 파일의 구조가 다른지 같으지 판별하는 명령어이다, 자세한 부분은 공식 문서로

[ansible.posix.synchronize module - A wrapper around rsync to make common tasks in your playbooks quick and easy - Ansible Documentation](https://docs.ansible.com/ansible/latest/collections/ansible/posix/synchronize_module.html)

## copy

- src, dest는 위와 의미가 동일하다.
- 이는 파일을 복사하는 명령어이다.

[ansible.builtin.copy module - Copy files to remote locations - Ansible Documentation](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/copy_module.html)

## service

- damon으로 서비스를 실행하라는 모듈이다.

[ansible.builtin.service module - Manage services - Ansible Documentation](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/service_module.html)

## ansible의 작성법

### 하나의 String

```yaml
- name: "Create a user"
    user: "name=fastcampus shell=/bin/bash"
```

오른쪽과 같이 `‘name=fastcampus'` 처럼 `‘[키]=[값]’` 으로 표현하는 방법

### yaml 문법 방식

```yaml
apt:
      name: nginx
      state: present
      update_cache: true
```

yaml의 문법처럼

`[키] : [값]`

으로 표현 하는 방법

### free-form 방식

```yaml
name: :"Hello World"
	command: "echo 'Hello World'"
```

`“[명령어] ’[값]’ ”` 의 방식으로 작성하는 방법이다.

command 모듈을 사용할 때 사용 가능하다.

---

#IaC #Ansible

---
