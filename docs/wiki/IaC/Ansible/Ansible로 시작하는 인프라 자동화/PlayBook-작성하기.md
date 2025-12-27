---
slug: "PlayBook-작성하기"
---
인벤토리를 이용하여 대상 호스트를 정의 했다면, 이번에는 대상 호스트에 수행될 작업들을 정의 하기 위한 플레이북을 작성해 보겠습니다.
`ansible.cfg` 라는 환경 설정 파일이 존재하는 디렉터리가 앤서플 프로젝트 디렉터리가 될 수 있습니다.
이번 챕터에서는 플레이북을 실행하기 위한 환경 설정 파일인 `ansible.cfg` 에 대해 알아보고, 나만의 첫번째 플레이 북 작성 및 실행해보도록 하겠습니다.

# 플레이북 환경 설정
플레이북을 작성하고 실행하려면 여러 가지 설정을 미리 해주어야 합니다.
예를 들어 어떤 호스트에서 플레이북을 실행할 것인지, 플레이북을 루트 권한으로 실행할 것인지, 대상 호스트에 접근 할 때, SSH 키를 이용할 것인지 패스워드를 이용할 것인지 설정해야 합니다.

## 앤서블 환경 설정 파일
앤서블 프로젝트 디렉토리에 `ansible.cfg` 파일을 생성하면, 다양한 앤서블 설정을 적용할 수 있습니다.
앤서블 환경 설정 파일에는 각 섹션에 key-value 쌍으로 정의된 설정이 포함되며, 여러 개의 섹션으로 구성됩니다.
섹션 제목은 대괄호로 묶여 있으며, 기본적인 실행을 위해 다음 예제와 같이 `[default]`와 `[privilege_escalation]` 두 개의 섹션으로 구성합니다.

```shell
[defaults]
inventory = ./inventory
remote_user = user
ask_pass = false

[privilege_escalation]
become = true
become_method = sudo
become_user = root
become_ask_pass = root
```

## `[defaults]` 섹션

여기서는 앤서블 작업을 위한 기본 값을 설정하며, 매개 변수 별 설정 값은 다음과 같은 의미를 갖습니다.

| 매개 변수         | 설명                                                                         |
| ------------- | -------------------------------------------------------------------------- |
| `inventory`   | 인벤토리 파일의 경로를 지정함                                                           |
| `remote_user` | 앤서블이 관리 호스트에 연결할 때 사용하는 사용자 이름을 지정함<br />이때 사용자 이름을 지정하지 않으면 현재 사용자 이름으로 지정됨 |
| `ask_pass`    | SSH 암호를 묻는 메시지 표시 여부를 지정함.<br />SSH 공개 키 인증을 사용하는 경우 기본 값은 false 임           |

## `[privilege_escalation]` 섹션
보안과 감사로 인해 앤서블을 원격 호스트에 권한이 없는 사용자로 먼저 연결한 후, 관리 액세스 권한을 에스컬레이션 하여 루트 사용자로 가져와야할 때도 있습니다.
이 경우 권한은 `[privilege_escalation]` 섹션에 설정 할 수 있습니다.

| 매개 변수             | 설명                                                                                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `become`          | 기본적으로 권한 에스컬레이션을 활성화 할 때 사용하며, 연결 후 관리 호스트에서 자동으로 사용자를 전환할지 여부를 지정함.<br />일반적으로 root로 전환되며, 플레이북에서도 지정 할 수 있음                                             |
| `become_method`   | 권한을 에스컬레이션 하는 사용자 전환 방식을 의미함.<br />일반적으로 기본값은 `sudo` 를 사용하며, `su` 는 옵션으로 설정 할 수 있음                                                                        |
| `become_user`     | 관리 호스트에서 전환할 사용자를 지정함.<br />일반적으로 기본 값은 root 임                                                                                                            |
| `become_ask_pass` | `become_method` 매개 변수에 대한 암호를 묻는 메시지 표시 여부를 지정함, 기본 값은 `false` 임<br />권한을 에스컬레이션 하기 위해 사용자가 암호를 입력해야 하는 경우, 구성 파일에 `become_ask_pass = true` 매개 변수를 설정하면 됨 |

앤서블은 리눅스에서 기본적으로 SSH 프로토콜을 사용하여, 관리 호스트에 연결합니다.
앤서블에서 관리 호스트에 연결하는 방법을 제어하는 가장 중요한 매개 변수는 `[defaults]` 섹션에 설정 되어 있습니다.

또한, 별도로 설정되어 잇지 않으면 앤서블은 실행 시 로컬 사용자와 같은 사용자 이름을 사용하여 관리 호스트에 연결 합니다.
이때 다른 사용자를 지정하려면, `remote_user` 매개 변수를 사용하여, 해당 사용자 이름으로 설정할 수 있다.

## 앤서블 접근을 위한 SSH 인증 구성

앤서블 로컬 사용자에게 개인 SSH 키가 잇거나 관리 호스트에서 원격 사용자임을 인증 가능한 키가 구성된 경우 자동으로 로그인 됩니다.
SSH 키 기반의 인증을 구성할 때는 `ssh-keygen` 명령어를 이용하여 다음과 같이 생성할 수 있습니다.
또한 `ssh-copy-id` 명령어를 이용하여 SSH 공개 키를 해당 호스트로 복사 할 수 있습니다.

1. ssh-keygnen을 합니다.

2. SSH 키가 생성되면 `ssh-copy-id` 명령어를 이용하여, 관리 노드로 복사합니다.
3. 이번에는 인벤토리 파일을 생성했던 `my-ansible` 디렉토리로 전환하여 `ansible.cfg` 파일 내용을 다음과 같이 수정합니다.
```shell
cd my-ansible
vi ansible.cfg

inventory = ./inventory
remote_user = root
ask_pass = false

[privilege_escalation]
become = true
become_method = true
become_user = root
become_ask_pass = false

cat inventory

[web]
tnode1-centos.exp.com
tnode2-ubuntu.exp.com

[db]
tnode3-rhel.exp.com
```

4. 앤서블 환경 설정 파일이 준비되면 `ansible` 명령어를 이용하여 `ping` 테스트를 진행합니다. ping 모듈을 이용하여 web 그룹의 호스트로 ping 을 수행하면 정상적으로 통신이 이루어질 시 `SUCCESS`라는 메시지를 볼 수 있습니다.

```shell
ansible -m ping web

```

5. 이번에는 `--ask-pass` 옵션을 추가하여 ping 테스트를 합니다. 그러면 SSH password 를 입력하라는 프롬프트가 뜨고, 정확한 패스워드를 입력하면 ping 테스트가 진행됩니다.

```shell
ansible -m ping --ask-pass web
```

이렇게 플레이북을 작성하고 실행할 기본 준비가 완료되었습니다.

# 첫번 째 플레이북 작성하기
플레이북은 YAML 포맷으로 작성된 텍스트 파일이며, 일반적으로 `.yml` 이라는 확장자를 사요하여 저장됩니다.
플레이북은 대상 호스트나 호스트 집합을 수행할 작업을 정의하고 이를 실행합니다.
이때 특정 작업 단위를 수행하기 위해 모듈을 적용합니다.

## 플레이북 작성하기
그럼, 가장 심플한 첫 번째 플레이북을 작성하겠습니다.
앤서블이 설치된 `ansible-server`에 접속하고, `my-ansible` 이라는 디렉터리로 전환됩니다.
그리고 vi 에디터를 이용해 다음과 같이 입력하고 저장합니다.
```shell
vi first-playbook.yml
```

```yaml
---
- hosts: all
- tasks:
	- name: Print message
	- debug:
		msg : Hello Ansible World
```

앞서 우리가 작성한 플레이북은 debug 모듈을 이용하여 `Hello Ansible World` 라는 문자열을 출력합니다.
플레이북을 작성할 때는 데이터 구조를 표현하기 위해 들여쓰기를 하는데, 이때는 공백 문자(스페이스)만 허용되므로 탭 문자는 사용하지 않는 것이 좋습니다.

## 플레이북 문법 체크하기
플레이북 작성 시 엄격한 공백 문자 때문에 문법 오류가 발생할 확률이 높다.
앤서블은 플레이북 실행 시 자체적으로 제공하는 모듈을 사용햇는지 그리고 공백은 잘 들여쓰기가 되었는지 확인하기 위해 문법을 체크 할 수 잇는 옵션을 제공합니다.

다음과 같이 `ansible-playbook` 명령어에 `--syntax-check` 옵션을 추가한 후 실행하고자 하는 플레이북 yml 파일명을 입력하면 문법 체크를 수행합니다.

특별한 오류가 없으면, 다음 결과를 확인 할 수 있습니다.
```shell
ansible-playbook --syntax-check first-playbook.yml
```

플레이북에 오류가 있는 경우에는 붉은 색 글씨로 어떤 작업에 문법 오류가 잇는지 위치를 보여줍니다.

# 플레이 북 실행
작성한 플레이북을 실행합니다.
플레이북을 실행할 때는 `ansible-playbook` 명령어를 이용합니다.
환경 설정 파일인 `ansible.cfg` 가 존재하는 프로젝트 디렉토리 내에서 실행할 경우 `ansible-playbook` 명령어와 함께 실행하고자 하는 플레이북 파일명을 입력하면 됩니다.

## 첫 번째 플레이북 실행하기
먼저 `my-ansible` 이라는 프로젝트 디렉토리로 이동합니다.
그리고 `ansible-playbook` 명령어와 함께 앞에서 생성한 `first-playbook.yml` 파일을 입력하고 Enter 키를 누르면 플레이북이 실행되는 과정을 볼 수 있습니다.

```shell
ansible-playbook first-playbook.yml
```

## 플레이북 실행 점검하기
플레이북을 실행하기 전에 먼저 플레이북이 제대로 실행될지 궁금하다면 `--check` 옵션을 사용해 플레이북의 실행 상태를 미리 점검할 수 있습이다.
이 옵션을 사용하면 앤서블에서 플레이북을 실행해도 관리 대상 호스트는 실제로 변경되지 않고 어떤 내용이 변경 될지만 미리 알 수 있습니다.

1. 먼저 sshd 서비스 재시작 하는 restart-service.yml 이라는 파일을 아래와 같은 내용으로 생성합니다.
```shell
---
- hosts: all
- tasks:
	- name: Restart sshd service
	- ansible.builtin.service:
		- name: sshd
		- state: restarted	
```

2. `--check` 옵션을 사용해 ansible-playbook을 실행합니다. 그러면 다음과 같이 sshd 서비스가 재 시작되어 서비스 상태가 변경될 예정이므로 Restart sshd service 태스크에서 changed 란느 문구가 뜹니다.

```shell
ansible-playbook --check restart-service.yml
```

3. `--check` 옵션을 뺍니다.
```shell
ansible-playbook restart-service.yml
```

`tnode1-centos` 서버에 접속하여 /var/log/message 를 통해 실제로 sshd 서비스가 재 시작되었는지 확인 가능합니다.
`Started Session 8 of root` 메시지와 `"session-8.scope: Succeded"` 메시지 사이에서는 ansible 로그를 확인 할 수 있습니다.
이는 ansible 이 실행되면서 정보를 수집하는 facts 가 실행된 것입니다.
또한 `Started Session 9 of user root` 메시지와 `session-9-scope: Succeeded` 메시지 사이에는 ansible 로그와 함께 OpenSSH 서비스가 재 시작 돈 것을 확인 할 수 있습니다.



























---

#IaC #Ansible 