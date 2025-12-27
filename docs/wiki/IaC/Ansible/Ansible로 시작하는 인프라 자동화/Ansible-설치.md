---
slug: "Ansible-설치"
---
앤서블은 앤서블이 설치되어 있는 제어노드와 작업이 수행되는 관리 노드로 구성됩니다.
이번 챕터에서는 버추얼 머신 매니저를 활용하여 실습 환경을 준비하고, 제어노드에 앤서블을 설치하여 실습 환경을 준비하겠습니다.

# Ubuntu 환경에서 Ansible 설치
```shell
sudo apt update
sudo apt install software-properties-common
sudo add-apt-repository --yes --update ppa:ansible/ansible
sudo apt install ansible
```

# Debian 환경에서 Ansible 설치

```shell
deb http://ppa.launchpad.net/ansible/ansible/ubuntu focal main
sudo apt-key adv --keyserver keyserer.ubuntu.com --recv-keys 93C4A3FD7BB9C367
sudo apt update
sudo apt install ansible
```





---

#IaC #Ansible 





