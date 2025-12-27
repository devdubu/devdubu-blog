---
slug: "Kubernetes-설치"
---
- [Mac OS 설치](#Mac OS 설치)
- [Kubectl과 Kustomize](#Kubectl과 Kustomize)
	- [Kubectl](#Kubectl과 Kustomize#Kubectl)
		- [Kubectl Install(Ubuntu)](#Kubectl#Kubectl Install(Ubuntu))
		- [Kubectl Install(MacOS)](#Kubectl#Kubectl Install(MacOS))
	- [Kustomize](#Kubectl과 Kustomize#Kustomize)
		- [Kustomize Install(Ubuntu)](#Kustomize#Kustomize Install(Ubuntu))
		- [Kustomize Install(MacOS)](#Kustomize#Kustomize Install(MacOS))
- [minikube](#minikube)
	- [minikube?](#minikube#minikube?)
	- [minikube install(Ubuntu)](#minikube#minikube install(Ubuntu))
	- [minikube install(MacOS)](#minikube#minikube install(MacOS))
	- [minikube 정보](#minikube#minikube 정보)
		- [clusters](#minikube 정보#clusters)
		- [contexts](#minikube 정보#contexts)
		- [users](#minikube 정보#users)
	- [minkube 기본 사용법](#minikube#minkube 기본 사용법)
		- [kubernetes 클러스터 상태 확인](#minkube 기본 사용법#kubernetes 클러스터 상태 확인)
		- [kubernetes 클러스터 일시중지](#minkube 기본 사용법#kubernetes 클러스터 일시중지)
		- [kubernetes 클러스터 중지](#minkube 기본 사용법#kubernetes 클러스터 중지)
		- [kubernetes 클러스터 재개](#minkube 기본 사용법#kubernetes 클러스터 재개)
		- [쿠버네티스 클러스터 삭제](#minkube 기본 사용법#쿠버네티스 클러스터 삭제)
		- [minikube 애드온 명령어](#minkube 기본 사용법#minikube 애드온 명령어)
		- [kubernetes 클러스터 노드에 SSH 접속](#minkube 기본 사용법#kubernetes 클러스터 노드에 SSH 접속)
		- [minikube 애드온 활성화](#minkube 기본 사용법#minikube 애드온 활성화)
		- [kubernetes 클러스터 버전과 대응 되는 kubectl 사용](#minkube 기본 사용법#kubernetes 클러스터 버전과 대응 되는 kubectl 사용)
		- [minikube 애드온 비활성화](#minkube 기본 사용법#minikube 애드온 비활성화)

---

# Mac OS 설치

Mac 혹은 Window 에서는 Docker Desktop을 제공합니다. Window에서는 호환성의 문제로 많은 제약 사항이 따르지만, Mac 운영체제에서는 Base운영 체제가 Linux 기반으로 되어있기 때문에 구동하는 문제에 있어서는 아무런 문제가 되지 않는다.

```bash
brew install --cask docker
```

를 치게 된다면, docker desktop이 설치가 된 것이고, application 폴더에서 docker desktop을 찾아서 실행하게 된다면, docker가 실행 되는 것을 알 수 있다.

# Kubectl과 Kustomize

## Kubectl

![Untitled.png](/img/이미지 창고/Untitled.png)

- kubctl은 쿠머네티스의 API 서버와 통신하여 사용자 명령을 전달할 수 있는 CLI 도구 이다.
- 쿠버네티스는 오른쪽과 같은 구조를 가지고 있으며, 이는 kubectl은 마스터 노드를 통해 접근을 하여서 명령어를 api로 전달해주는 역할을 한다.

### Kubectl Install(Ubuntu)

[Install and Set Up kubectl on Linux](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)

### Kubectl Install(MacOS)

[Install and Set Up kubectl on macOS](https://kubernetes.io/docs/tasks/tools/install-kubectl-macos/)

kubeclt은 또한 homebrew 패키지 매니저로 간단하게 설치 가능하다.

```bash
brew install kubectl
```

MacOS 처럼 Docker Desktop을 통해서 Docker을 다운을 받았다면, 이를 통해서 Kubectl이 같이 내장되어있는 경우가 있다.

Package를 따로 설치하는 경우가 최신 버전을 사용하기 때문에 안정적이기에, 따로 설치하는 것을 권장 한다.

때에 따라서, Docker Desktop에 내장된 Kubectl과 Package로 설치한 Kubectl과 겹치는 일이 있을 수도 있다. 이를 방지하기 위해서는 homebrew로 설치한 Kubectl으로 overwriting 할 이유가 생긴다. 방법으로는

```bash
brew link --overwrite kubernetes-cli
```

충돌이 일어날 때만 사용하면 되고, 충돌이 일어나지 않는다면 굳이 안해도 무방하다

## Kustomize

![Untitled-1.png](/img/이미지 창고/Untitled-1.png)
- Kubernetes는 애플리케이션에서 올라가게 될 정보들을 오케스트레이션을 해주는 것입니다.
- 해당하는 정보들을 매니페스트 파일이라고 부르는 파일에 저장합니다.
- 이때 kustomize는 쿠버네티스의 매니페스트 파일을 좀 더 효율적으로 관리할 수 있도록 도와주는 도구이다.

→ kustomize가 인기가 많아짐에 따라서 kubectl에 내장이 되기 시작했다.

### Kustomize Install(Ubuntu)

kustinuze는 따로 package manager가 없으며, 따로 binary 파일로 다운 받아서 설치를 해야한다.

```bash
curl -s "https://raw.githubusercontent.com/kubernetes-sigs/kustomize/master/hack/install_kustomize.sh"  | bash
```

### Kustomize Install(MacOS)

kustomize 또한 kubectl과 마찬가지로 homebrew로 간단하게 설치 가능하다.

```bash
brew install kustomize
```

kubctl안에 kustomize가 내장되었다고 하지만, 이는 살짝 문법이 다르기도 하고, 또한 따로 패키지를 쓰는 것이 안정적이기 때문에

따로 사용하는게 좋지만, 확인하는 방법은

```bash
kubectl kustomize
```

명령어를 사용하게 된다면, 에러가 나오지 않는 모습을 알 수 있다.

# minikube

## minikube?

[Welcome!](https://minikube.sigs.k8s.io/docs/)

- minikube는 작은 쿠버네티스를 뜻한다.
- 가상 환경을 사용하여 쿠버네티스 클러스터를 구현한다.
- driver를 선택하여 원하는 가상환경(docker, podman, virtualbox, parllels, vmware, hyperkit 등)에서 구성 가능하다
- 쿠버네티스 학습 환경으로 활용하기 좋다

## minikube install(Ubuntu)

[minikube start](https://minikube.sigs.k8s.io/docs/start/)

위 해당 사이트에서 본인에 운영체제에 맞게끔 설정 후에 설치를 하면 된다.

## minikube install(MacOS)

minikube 또한 homebrew를 통해서 설치가 가능하다.

```bash
brew isntall minikube
```

설치가 된 후에는 아래 처럼 설정을 해주면 된다.

## minikube 정보

```bash
minikube start --drvier=docker
# 해당 명령어는 driver를 docker를 선택한 것이다.
```

`minikube start` 를 통해서 로컬 환경에 kubernetes 환경을 구성 할 수 있다.

이때 kubectl이 Kubernetes랑 통신하기 위해서는 설정파일이 필요하다 해당 설정 파일은

```bash
cat ~/.kube/config
```

에 존재한다. 이 폴더를 열어보게 된다면, yaml 파일 형식으로 설정 파일이 작성 되어 있는 것을 볼 수 있다.

결과물을 보게 된다면 크게

### clusters

clusters는 현재 관리할 클러스터를 array 형태로 관리하게끔 설정 파일이 setting 되어 있다.

### contexts

context도 cluster와 마찬가지로 같은 형식으로 관리하는 것을 볼 수 있다.

어떤 cluster와 통신을 할지에 대한 인증을 담당한다고 보면 된다.

### users

users도 마찬가지로 위와 같은 yaml로 적을 수 있으며, 이는 인증 사용자 정보를 의미한다

```bash
kubeclt get nodes
```

위의 명령어를 입력하게 된다면, kubectl이 접속하는 node의 종류를 볼 수 있다.

```bash
kubeclt cluster-info
```

명령어를 통해서 어떤 ip, 어떤 DNS로 띄워져 있는지 확인 할 수 있다.

## minkube 기본 사용법

### kubernetes 클러스터 상태 확인

```bash
minikube status
```

### kubernetes 클러스터 일시중지

```bash
minikube pause
```

### kubernetes 클러스터 중지

```bash
# kubernetes 전원 종료
minikube stop
```

### kubernetes 클러스터 재개

```bash
minikube unpause
```

### 쿠버네티스 클러스터 삭제

```bash
minikube delete
```

### minikube 애드온 명령어

```bash
minikube addons list
# 위의 명령어는 addon의 사용 가능한 list 들을 출력해주는 명령어이다.
```

### kubernetes 클러스터 노드에 SSH 접속

```bash
minikube ssh
# 현재는 node가 한개가 있기 때문에 그 쪽으로 접속을 하게 된다.

```

### minikube 애드온 활성화

```bash
minikube addons enable [addon]
# 만약에 ingress를 설치하려고 한다면 아래의 명령어를 입력하면 된다.
# 다움 받고, 실행까지 자동으로 해준다.
minikube addons enable ingress
```

### kubernetes 클러스터 버전과 대응 되는 kubectl 사용

```bash
minikube kubectl ...
```

### minikube 애드온 비활성화

```bash
minikube addons disable [addon]
```

가끔 kubectl package와 버전이 맞지 않는 경우가 생길 수도 있다. 이때는

```bash
minikube kubectl
```

명령어를 입력하게 되면 minikube가 알아서 kubectl의 버전을 맞춰준다.

---

#Container #Kubernetes #Kubernetes기초

---