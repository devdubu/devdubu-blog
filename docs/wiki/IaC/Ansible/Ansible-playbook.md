---
slug: "Ansible-playbook"
---
# Ansible playbook

생성일: 2022년 9월 29일 오후 1:33

# Playbook

ansible의 playbook은 yaml 파일로 구성되어 있다. 잠시 파일을 한번 살펴보면

```yaml
---
# This is Ansible Playbook
#
# 플레이북 (Playbook): YAML로 정의. 순서대로 정렬된 플레이(작업 목록) 절차.
# 플레이 (Play): 작업 목록(Tasks). 특정 호스트 목록에 대하여 수행
# 작업 (Task): 앤서블의 수행 단위. 애드혹 명령어는 한 번에 단일 작업 수행.
# 모듈 (Module): 앤서블이 실행하는 코드 단위. 작업에서 모듈을 호출함.
# 콜렉션 (Collection): 모듈의 집합.

- name: Play 1
  hosts: ubuntu
  tasks:
  - name: "Task 1: Execute command"
    command: uptime

  - name: "Task 2: Execute script"
    script: task2.sh

  - name: "Task 3: Install package"
    apt:
      name: nginx
      state: present
      update_cache: true

  - name: "Task 4: Start nginx service"
    service:
      name: nginx
      state: started

- name: Play 2
  hosts: localhost
  tasks:
  - name: "Task 1: Execute command"
    command: whoami

  - name: "Task 2: Execute script"
    script: task2.sh
```

## hosts

```yaml
hosts: [inventory에서 정의된 group명]
```

## task

작업을 의미하며, ansible이 한번의 작업을 수행하는 단위를 가르킨다.

## module

```yaml
- name: "Task1"
	command : uptime
```

에서 name 다음 라인에 오는 것을 의미하며, 각각의 모듈들은 프로그래밍 상에서는 함수와 의미가 똑같다.

# 실습

```yaml
---

- name: Install Nginx on Ubuntu
  hosts: ubuntu
  become: true
  tasks:
  - name: "Install Nginx"
    apt:
      name: nginx
      state: present
      update_cache: true

  - name: "Ensure nginx service started"
    service:
      name: nginx
      state: started

- name: Install Nginx on Amazon Linux
  hosts: amazon
  become: true
  tasks:
  - name: "Enable Nginx repository provided by Amazon"
    command: "amazon-linux-extras enable nginx1"

  - name: "Install Nginx"
    yum:
      name: nginx
      state: present

  - name: "Ensure nginx service started"
    service:
      name: nginx
      state: started
```

```bash
[amazon]
amazon1 ansible_host=3.35.53.163 ansible_user=ec2-user
amazon2 ansible_host=3.34.253.165 ansible_user=ec2-user

[ubuntu]
ubuntu1 ansible_host=ec2-3-34-49-77.ap-northeast-2.compute.amazonaws.com ansible_user=ubuntu
ubuntu2 ansible_host=ec2-13-209-20-108.ap-northeast-2.compute.amazonaws.com ansible_user=ubuntu

[linux:children]
amazon
ubuntu
```

`become : true` : root 권한을 부여해줌

→ amazon linux는 먼저 nginx repository를 먼저 활성화를 해야하기 때문에,

`command : “amazon-linux-extras enable nginx1”` 을 실행하는 것이다.

→ `service` 모듈을 통해서 nginx를 실행할 수 있다.

코드가 준비가 완료 되었다면, terminal에 `ansible-playbook` 명령어를 사용하면 된다.

ansible-playbook 명령어는 [ansible ad-hoc](https://www.notion.so/Ansible-Ad-hoc-Command-65675cf9bee54e6a87093b9a31cc899f) 에서 ansible 명령어와 거의 유사하기 때문에 비슷하게 작성해주면 된다.

```bash
ansible-playbook -i inventory install-nginx.yaml
```

명령어를 사용하게 되면 nginx 가 설치되는 모습을 볼 수 있다.

여러번 결과를 돌려보게 되면, amazon-linux의 enable nginx1 부분에서 색상이 변경된 점을 발견할 수 있다.

`command` 명령어는 기본적으로 멱등성이 보장 되지 않는다. 이유인 즉슨, 이는 server 컴퓨터에 종속된 명령어를 발산하기 때문에, 이를 편법적으로는 멱등석을 제공해야한다.

AWS에서 Nginx가 정상적으로 설치 됐는지 확인하는 방법은

```bash
ansible -i inventory amazon -m command -a "curl localhost"
ansible -i inventory ubuntu -m command -a "curl localhost"
```

생성했던 Nginx를 삭제하기 위해 폴더 안에 있는 uninstall-nginx 를 이용해서 삭제를 해보고 상단의 명령어를 다시 작성하게 된다면, nginx가 정상적으로 삭제 된 모습을 볼 수 있습니다.

```bash
ansible-playbook -i inventroy uninstall-nginx.yaml
```


---

#IaC #Ansible

---
