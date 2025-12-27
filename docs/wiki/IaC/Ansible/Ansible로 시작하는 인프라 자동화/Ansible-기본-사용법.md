---
slug: "Ansible-기본-사용법"
---
자동화를 위해 가장 먼저 해야할 일은 어떤 시스템의 호스트를 자동화 할 것인지 대상 호스트를 선정하는 것입니다.
대상 호스트 선정이 되면 인벤토리를 통해 호스트를 설정합니다.

# 인벤토리를 이용한 자동화 대상 호스트 설정
이 파일은 INI 스타일 형식 **(이름=값)** 또는 YAML 을 포함한 다양한 형식을 사용하여 작성할 수 있습니다.

가장 간단한 형식의 INI 스타일 인벤토리 파일은 다음과 같이 관리 호스트의 호스트명 또는 IP 주소가 한 줄에 하나씩 있는 목록 형태 입니다.
```yaml
web1.example.com
web2.example.com
db1.example.com
db1.example.com
192.0.2.42
```

## IP를 이용한 인벤토리 파일 생성

```shell
vi inventory
192.168.0.63
192.168.0.5
192.168.0.105
```

## Host 명을 이용한 인벤토리 파일 생성
```shell
# /etc/hosts 에 자동화 대상 호스트 등록
vi /etc/hosts

...
192.168.0.63  rp01.com
192.168.0.5   rp02.com 
192.168.0.105 rp03.com

# 호스트명을 이용한 inventory 파일 생성
vi inventory
rp01.com
rp02.com
rp03.com
```

# 역할에 따른 호스트 그룹 설정
작업을 하다보면 호스트 별로 Role을 주고 Role 별로 특정 작업을 수행해야 하는 경우가 종종 발생합니다.
예를 들면, 웹 서비스를 구성하기 위해서는 웹 서버와 데이터베이스 서버가 필요합니다.
그런데 이런 서버들은 고가용성 을 위해 여러대를 구성할 경우 인벤토리도 유형별로 호스트를 선정 가능합니다.

## 그룹별 호스트 설정
그룹별로 호스트를 설정하여 사용하면 앤서블 플레이북 실행 시 그룹 별로 작업을 처리 할 수 있어 좀 더 효과적입니다.
이 경우 다음과 같이 그룹 명을 대괄호 `([])` 내에 작성하고 해당 그룹에 속하는 호스트 명이나 IP 한줄에 하나씩 나열 합니다.
아래 인벤토리는 두 개의 호스트 그룹인 webservers 와 db-servers 를 정의한 것입니다.

```shell
[webservers]
rp01.com
rp02.com

[db-servers]
rp03.com
```

또한 호스트는 여러 그룹에 있을 수 있습니다.
실제 호스트를 여러 그룹으로 구성하면 호스트의 역할, 실제 위치, 프로덕션 여부 등에 따라 다양한 방식으로 구성 할 수 있습니다.
그러면 특성, 용도 또는 위치에 다라 특정 호스트 집합에 앤서블 플레이를 쉽게 적용 가능합니다.

```shell
[webserver]
rp01.com
rp02.com

[db-server]
rp02.com
rp03.com

[prodouction]
rp01.com
rp02.com
rp03.com
```

## 중첩 그룹 정의
앤서블 인벤토리는 호스트 그룹에 기존에 정의한 호스트 그룹을 포함 시킬 수도 있습니다.
이 경우 호스트 그룹 이름 생성 시 `:childern` 이라는 접미사를 추가하면 됩니다.
다음은 webservers 및 db-servers 그룹의 모든 호스트를 포함 하는  datacenter 그룹을 생성하는 예 입니다.

```shell
[webserver]
web1.example.com
web2.example.com

[db-servers]
db01.example.com
db02.example.com

[datacenter:childern]
webservers
dbservers
```

## 범위를 사용한 호스트 사양 간소화
인벤토리의 호스트 이름 또는 IP 주소를 설정할 때 범위를 지정하여, 호스트 인벤토리를 간소화 할 수 있습니다.
숫자 또는 영문자로 범위를 지정할 수 있으며, 대괄호 사이에 시작 구문과 종료 구문을 포함합니다.

```shell
[start:end]
```

다음과 같이 webservers 는 대괄호 사이에 `[1:2]`로 범위를 지정했으며, `db-server`는 `[01:02]` 로 범위를 지정했습니다.
이렇게 지정하면 `webservers`의 경우 `web1.example.com`, `web2.example.com`에 해당하는 호스트에 앤서블 플레이북 작업들이, `db-server` 의 경우 `db1.example.com`, `db2.example.com`
에 해당하는 호스트에 앤서블 플레이북 작업들이 실행됩니다.
```shell
[webserver]
web[1:2].example.com

[db-servers]
db[01:02].example.com
```
이 외에도 IP 주소 범위를 표현할 때나 여러 호스트의 호스트 명을 지정할 때, 혹은 DNS 와 같이 호스트의 어미 부문을 범위로 지정하면 IPv6 의 범위 설정에도 가능합니다.

```shell
# IP 범위 설정 - 192.168.4.0 ~ 192.168.4.255 사이의 IP 범위를 표현
[defaults]
192.168.4.[0:255]

# 호스트 명 범위 설정 - com01.example.com ~ com20.example.com
[compute]
com[01:20].example.com

# DNS 범위 설정 - a.dns.example.com ~ b.dns.example.com, c.dns.example.com
[dns]
[a:c].dns.example.com

# IPv6 범위 설정
[ipv6]
2001:db8::[a:f]
```

ansible-server 노드에 접속하여 `/etc/ansible/hosts` 의 내용을 보면 앞에서 설명한 인벤토리 사용 예를 확인 할 수 있습니다.

# 인벤토리 확인
앤서블을 이용하여 나만의 자동화 플레이북을 작성할 수도 있지만, 기존에 이미 구성되어 있는 플레이북을 확인하고 실행해야할 경우도 발생합니다.
이때는 기존 인벤토리 파일의 내용을 `ansible-inventory` 라는 명령어를 이용해 확인 할 수 있습니다.

## 인벤토리 그룹 구성
앞에서 구성한 인벤토리 파일을 vi 에디터로 열어 그룹별로 설정합니다.
예를 들어 web 그룹에는 `tnode1-centos.exp.com`, `tnode2-ubuntu.exp.com`  서버를 등록하고, db 그룹에는 `tnode3-rhel.exp.com` 서버를 등록합니다.
그리고 all 이라는 그룹에 web과 db그룹을 추가 합니다.

```shell
vi inventory
[web]
tnode1.centos.exp.com
tnode2.ubuntu.exp.com

[db]
tnode3.rhel.exp.com

[all:children]
web
db
```

명령어 ansible-inventory를 이용하여, 다음과 같이 특정 인벤토리 정보를 JSON 형태로 확인 가능합니다.
이때 `-i` 옵션을 사용하면 특정 인벤토리를 지정할 수 있습니다.

```shell
ansible-inventory -i ./inventory --list
...
```

`ansible-inventory` 명령어와 `--graph` 옵션을 이용하면 트리 형태로 인벤토리 정보를 확인 할 수 있습니다.

```shell
ansible-inventory -i ./inventory --graph
```

현재 프로젝트 디렉터리 내인 `/root/my-ansible/ansible.cfg` 라는 앤서블 환경 설정 파일을 다음과 같이 구성 해야 합니다.

해당 파일이 존재하면, `ansible-inventory` 명령어 사용 시 `-i` 옵션을 사용하지 않아도 `ansible.cfg` 설정 파일에 정의된 인벤토리의 호스트 정보를 확인 할 수 있습니다.

```shell
# ansible.cfg 파일 생성
vi ansible.cfg

[default]
inventory = ./inventory

# --list 옵션을 통해 ansible inventory 목록 확인
ansible-inventory --list


# --graph 옵션을 통해 ansible invnetory 트리 형태 확인
ansible-inventory --graph
```




















---

#IaC #Ansible 