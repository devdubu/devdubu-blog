- [Kubectx & Kubens?](#Kubectx & Kubens?)
- [kubectx 설치](#kubectx 설치)
	- [Mac OS](#kubectx 설치#Mac OS)
	- [Ubuntu](#kubectx 설치#Ubuntu)
		- [설치 간단 확인 명령어](#Ubuntu#설치 간단 확인 명령어)
			- [kubectl config 명령어](#설치 간단 확인 명령어#kubectl config 명령어)
		- [kubens 명령어](#Ubuntu#kubens 명령어)
			- [namespace 확인](#kubens 명령어#namespace 확인)

---

# Kubectx & Kubens?
- kubectx는 컨텍스트 전환을 보다 쉽게 해주는 명렁어 모음
- kubens는 namespace를 쉽게 접근할 수 있는 명렁어 모음



# kubectx 설치
https://github.com/ahmetb/kubectx
## Mac OS
```bash
brew install kubectx
```

## Ubuntu
```bash
sudo git clone https://github.com/ahmetb/kubectx /opt/kubectx
sudo ln -s /opt/kubectx/kubectx /usr/local/bin/kubectx
sudo ln -s /opt/kubectx/kubens /usr/local/bin/kubens
```

### 설치 간단 확인 명령어
```bash
kubectx

kubens
```

#### kubectl config 명령어
```bash
# 아래의 명령어로 연결되어있는 context를 확인할 수 있다.
kubectl config current-context

# 아래의 명령어로 연결할 수 있는 모든 context를 확인 할 수 있다.
kubectl config get-contextx
```
- kubectl 명령어로 사용이 가능한 기능이지만, 너무 길어지는 관계로 kubectx로 대체하여 사용하는 경우도 많이 있습니다.


### kubens 명령어
#### namespace 확인
```bash
kubens
```
- 만약 기본 namespace를 변경하려면,
```bash
kubens [NameSpace명]
```
- 위 명령어를 작성해주면, 기본 NameSpace가 변경됩니다.

---

#Container #Kubernetes #kubectx

---