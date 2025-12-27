- [kubefwd 설치](#kubefwd 설치)
	- [MacOS](#kubefwd 설치#MacOS)
	- [Ubuntu](#kubefwd 설치#Ubuntu)
- [실습](#실습)
	- [간단 명령어 실습](#실습#간단 명령어 실습)

---

# Kubefwd
- 로컬에서 Kubernetes 서비스를 portfowarding하여 쉽게 접속할 수 있게 해주는 패키지

# kubefwd 설치
https://github.com/txn2/kubefwd

## MacOS
```bash
brew install txn2/tap/kubefwd
```

## Ubuntu
```bash
wget https://github.com/txn2/kubefwd/releases/download/1.22.0/kubefwd_amd64.deb
sudo dpkg -i kubefwd_amd64.deb
```

# 실습

## 간단 명령어 실습

```bash
# 운영체제에서 portfowarding이 되기 때문에, 권한이 필요하므로 sudo를 붙여야한다.
sudo kubefwd svc --all-namespaces

# Linux에서는 -E 옵션이 추가가 된다.
sudo kubefwd svc -E --all-namespaces
```
- 모든 namespace의 서비스 목록을 출력하는 명령어 입니다.
```bash
# Linux일 때는 -E를 붙이고 그 외는 없어도 된다.
sudo -E kubefwd svc -n fast
```
- 위의 명령어를 하게 된다면, 특정 namespace에 대한 정보들을 찾아서 portfowarding을 진행할 수 있습니다.


---

#Container #Kubernetes #Kubefwd #Kubernetes관리도구

---
