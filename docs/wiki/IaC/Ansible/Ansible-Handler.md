---
slug: "Ansible-Handler"
---
# Ansible Handler

# Ansible Handler?

- 이번트를 기반으로 돌아가는 Task를 의미한다.
- 어떤 식으로 Handler을 사용하는지 알아보려면 우선 코드를 보면 된다.
- handler를 사용하는 이유는 Nginx와 같은 Web, Was들의 config 파일들을 바꾸고, ansible 명령어를 사용하게 된다면, 이에 대해서 변화가 없다는 것을 알 수 있다.
- ansible 몇몇 명령어들은 완벽한 멱등성을 제공하지 않으므로, (Nginx start)와 같이 다시 재 랜더링이 되지 않는 부분에 대해서 이벤트를 걸어서 Restart를 하게 해주는 것이 handler의 목적이다.

# 실습 코드

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
    notify:
    - Restart Nginx

  # Docs: https://docs.ansible.com/ansible/latest/collections/ansible/builtin/service_module.html
  - name: "Ensure nginx service started"
    service:
      name: nginx
      state: started

  handlers:
  - name: Restart Nginx
    service:
      name: nginx
      state: restarted

```

→ `Restart Nginx` 는 Handler 함수의 이름이다.

## Handler

- 핸들러를 작성 후에 위의 어떤 작업을 해야하는지는 위 함수와 같게 적어주면 된다.
- `notify` 는 위의 task를 모두 마친 뒤에 핸들러를 호출 하기 위한 구문이다.

### 주의 사항

1. 플레이 내에서 같은 이벤트를 여러번 호출하더라도 동일한 핸들러는 한번만 실행된다.
2. 모든 핸들러는 플레이 내에 모든 작업이 완료된 후에 실행된다.
3. 핸들러는 이벤트 호출 순서에 따라 실행되는 것이 아닌, 핸들러 정의 순서에 따라 실행된다.

---

#IaC #Ansible

---
