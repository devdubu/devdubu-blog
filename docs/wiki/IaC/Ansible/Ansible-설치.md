---
slug: "Ansible-설치"
---
- [Ansible 설치](#Ansible 설치)
	- [MacOS 설치](#Ansible 설치#MacOS 설치)
	- [Linux && Window 설치](#Ansible 설치#Linux && Window 설치)

# Ansible 설치
# Ansible 설치

## MacOS 설치

```bash
brew install ansible

# ansible 설치 확인 방법
which ansible
ansible --version
```

## Linux && Window 설치

apt-get으로 바로 설치 할 수 있지만, ansible의 최신 버전을 지원하지 않기 때문에, python 을 이용해서 설치하는 것이 좋다.

```bash
apt-get install python3-pip
# pip 버전이 설치가 잘 됐는지 확인
pip3 -V

pip3 install ansible
```

---

#IaC #Ansible

---
