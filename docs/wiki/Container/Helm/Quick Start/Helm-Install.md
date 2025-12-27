---
slug: "Helm-Install"
---
# 전제 조건
Helm을 성공적이고, 안전하게 사용하려면, 다음과 같은 전제조건들이 필요하다.
1. K8S Cluster
2. 설치를 위해 어떤 보안 구성을 사용할 것인지 결정하기(필요 시)
3. Helm 설치 및 구성

## K8S 설치 혹은 Cluster에 접근
- Kubernetes가 설치 되어 있어야한다.
- 최신 릴리스의 헬름을 사용하기 위해서, 대부분의 경우 두번째 최신 마이너 릴리스 버전인 Kubernetes lts 릴리즈 버전 설치를 권장한다.
- 또한 로컬로 구성된 `kubectl` 복사본이 있어야 한다.

Helm과 Kubernetes 사이의 버전 차이 정책(skew) 최대 버전은 [헬름 버전 지원 정책](https://helm.sh/docs/topics/version_skew/)을 참고 한다.


## Helm 설치
Helm 클라이언트의 바이너리 릴리스를 다운로드 한다.
`homebrew`와 같은 툴을 사용하거나 [공식 릴리스 페이지](https://github.com/helm/helm/releases)를 참고하면 된다.

## Helm Chart Repository 초기화
Helm이 준비되면, 차트 리포지토리를 추가할 수 있다.
가능한 헬름 차트 레포지토리를 위해서 [Artifact Hub](https://artifacthub.io/packages/search?kind=0)를 확인한다.

```shell
helm repo add bitnami https://charts.bitnami.com/bitnami
```

차트 리포지토리 추가가 완료되면 설치할 수 있는 차트들의 목록을 볼 수 있습니다.

```shell
helm search repo bitnami

NAME                             	CHART VERSION	APP VERSION  	DESCRIPTION
bitnami/bitnami-common           	0.0.9        	0.0.9        	DEPRECATED Chart with custom templates used in ...
bitnami/airflow                  	8.0.2        	2.0.0        	Apache Airflow is a platform to programmaticall...
bitnami/apache                   	8.2.3        	2.4.46       	Chart for Apache HTTP Server
bitnami/aspnet-core              	1.2.3        	3.1.9        	ASP.NET Core is an open-source framework create...
# ... and many more
```

## 예제 Chart 설치

Chart를 설치하기 위해서, `helm install` 커맨드를 실행한다.
helm은 차트를 설치하기 위한 몇가지 방법들이 존재하는데 가장 쉬운 방법은 bitnami 차트를 이용하는 것이다.

```shell
 helm repo update              # Make sure we get the latest list of charts
helm install bitnami/mysql --generate-name

NAME: mysql-1612624192
LAST DEPLOYED: Sat Feb  6 16:09:56 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES: ...
```
위의 예에서, `bitnami/mysql` 차트가 릴리스 되었고, 새로운 릴리스의 이름은 `mysql-1612624192`이다.

MySQL 차트에 대한 간단한 정보를 보려면 `helm show chart bitnami/mysql` 를 실행한다.
또는 차트에 대한 정보를 보려면 `helm show all bitnami/mysql` 를 실행할 수도 있다.

## Release에 대해서 알아보기

Helm 을 사용하여 릴리스된 내용을 쉽게 확인 할 수 있다.
```shell
helm list

NAME            	NAMESPACE	REVISION	UPDATED                             	STATUS  	CHART      	APP VERSION
mysql-1612624192	default  	1       	2021-02-06 16:09:56.283059 +0100 CET	deployed	mysql-8.3.0	8.0.23
```

`helm list or (helm ls)` 함수는 배포된 모든 릴리스 목록을 보여준다.

## Release 설치 제거
릴리스를 설치 제거하려면, `helm uninstall` 커맨드를 사용한다.

```shell
helm uninstall mysql-16126224192

release "mysql-1612624192" uninstalled
```

K8S에서 `mysql-1612624192`를 설치 제거 하려면, 릴리스 이력 뿐 아니라 릴리스와 관련된 리소스들 모두 제거된다.

`--keep-history` 플래그가 제공되면, 릴리스 이력은 유지된다.
그러면 릴리스에 대한 정보를 요청 할 수 있다.

```shell
helm status mysql-1612624192
Status: UNINSTALLED
...
```

Helm은 릴리스를 제거한 후에도 릴리스를 추적하므로, 클러스 이력을 감사 할 수 잇고, 릴리스 삭제 취소도 가능하다.
`helm rollback`사용


이 가이드는 헬름 CLI를 설치하는 방법을 설명한다. 헬름은 소스 또는 미리-빌드된(pre-built) 바이너리 릴리스로 설치할 수 있다.

## 헬름 프로젝트로

헬름 프로젝트는 헬름을 가져와서 설치하는데 2가지 방법을 제공한다. 이것들은 헬름을 릴리스하기 위한 공식적인 방법들이다. 이외에도, 헬름 커뮤니티에서는 다양한 패키지 관리자를 통해 헬름을 설치할 수 있는 방법을 제공하고 있다. 이러한 방법을 통한 설치는 아래에 있는 공식적인 방법들에서 확인할 수 있다.

### 바이너리 릴리스로

헬름의 모든 [릴리스](https://github.com/helm/helm/releases)는 다양한 OS들의 바이너리 릴리스를 제공한다. 이 바이너리 버전들은 수동으로 다운로드하여 설치할 수 있다.

1. [원하는 버전](https://github.com/helm/helm/releases)을 다운로드한다.
2. 압축해제한다. (`tar -zxvf helm-v3.0.0-linux-amd64.tar.gz`)
3. 압축해제된 디렉토리에서 `helm` 바이너리를 찾아서, 원하는 목적지로 이동시킨다. (`mv linux-amd64/helm /usr/local/bin/helm`)

거기서부터, 클라이언트를 구동하고 [stable 저장소를 추가](https://helm.sh/docs/intro/quickstart/#initialize-a-helm-chart-repository)할 수 있어야 한다: `helm help`.

**참고:** 헬름 자동화 테스트는 GitHub Actions 빌드와 릴리스 사이에, 리눅스 AMD64에서만 수행된다. 다른 OS들에 대한 테스트는, 대상 OS에 대한 헬름을 요청하는 커뮤니티에서 담당한다.

### 스크립트로

이제 헬름은 헬름 최신 버전을 자동으로 가져와서 [로컬에 설치](https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3)하는 인스톨러 스크립트를 제공한다.

이 스크립트를 받아서 로컬에서 실행할 수 있다. 문서화가 잘 되어 있으므로 실행 전에 문서를 읽어보면 무엇을 하는 것인지 이해할 수 있을 것이다.

```shell
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3

chmod 700 get_helm.sh
./get_helm.sh
```

최신이 필요하다면 `curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash` 을 해보자.

## 패키지 매니저를 통해서

헬름 커뮤니티 운영체제 패키지 관리자를 통해서 헬름을 설치할 수 있는 기능을 제공한다. 이것들은 헬름 프로젝트에서 지원되지 않으며 신뢰 할 수 있는 제 3자로 간주되지 않는다.

### Homebrew로 (맥OS)

헬름 커뮤니티 멤버들은 Homebrew용 헬름 포뮬러 빌드에 기여해왔다. 이 포뮬러는 보통 최신이다.

```shell
brew install helm
```

(참고: emacs-helm 라는 포뮬러도 있는데, 다른 프로젝트이다.)

### Chocolatey로 (윈도우)

헬름 커뮤니티 멤버들은 [Chocolatey](https://chocolatey.org/)용 [헬름 패키지](https://chocolatey.org/packages/kubernetes-helm) 빌드에 기여해왔다. 이 패키지는 보통 최신이다.

```shell
choco install kubernetes-helm
```

### Scoop으로 (윈도우)

헬름 커뮤니티 멤버들은 [Scoop](https://scoop.sh/)용 [헬름 패키지](https://github.com/ScoopInstaller/Main/blob/master/bucket/helm.json) 빌드에 기여해왔다. 이 패키지는 보통 최신이다.

```shell
scoop install helm
```

### Winget로 (윈도우)

헬름 커뮤니티 멤버들은 [Winget](https://learn.microsoft.com/en-us/windows/package-manager/)용 [헬름 패키지](https://github.com/microsoft/winget-pkgs/tree/master/manifests/h/Helm/Helm) 빌드에 기여해왔다. 이 패키지는 보통 최신이다.

```shell
winget install Helm.Helm
```

### Apt로 (데비안/우분투)

헬름 커뮤니티 멤버들은 Apt용 [헬름 패키지](https://helm.baltorepo.com/stable/debian/)에 기여해왔다. 이 패키지는 보통 최신이다.

```shell
curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
sudo apt-get install apt-transport-https --yes
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

### dnf/yum로 (페도라)

Fedora 35부터, 공식 저장소에서 헬름을 사용할 수 있다. 헬름을 호출하여 설치할 수 있다.

```shell
sudo dnf install helm
```

### Snap으로

[Snapcrafters](https://github.com/snapcrafters) 커뮤니티는 [헬름 패키지](https://snapcraft.io/helm)의 Snap 버전을 유지보수한다.

```shell
sudo snap install helm --classic
```

### pkg로 (FreeBSD)

FreeBSD 커뮤니티 멤버들은 [FreeBSD Ports Collections](https://man.freebsd.org/ports)용 [헬름 패키지](https://www.freshports.org/sysutils/helm) 빌드에 기여해왔다. 이 패키지는 보통 최신이다.

```shell
pkg install helm
```

### 개발용 빌드

릴리스 외에도 헬름의 개발용 스냅샷을 다운로드하거나 설치할 수 있다.

### 카나리(canary) 빌드에서

"카나리" 빌드는 최신 마스터 브랜치로부터 빌드된 헬름 소프트웨어의 버전이다. 공식 릴리스가 아니며, 안정적이지 않을 수 있다. 하지만 최신 기능을 테스트할 기회를 제공한다.

카나리 헬름 바이너리는 [get.helm.sh](https://get.helm.sh/)에 저장된다. 아래는 일반 빌드에 대한 링크들이다:

- [리눅스 AMD64](https://get.helm.sh/helm-canary-linux-amd64.tar.gz)
- [맥OS AMD64](https://get.helm.sh/helm-canary-darwin-amd64.tar.gz)
- [테스트용 윈도우 AMD64](https://get.helm.sh/helm-canary-windows-amd64.zip)

### 소스에서 (리눅스, 맥OS)

소스로 헬름을 빌드하는 것은 약간 작업이 더 많다. 하지만 최신 (프리-릴리스) 헬름 버전을 테스트하기에는 가장 좋은 방법이다.

작동하는 Go 환경이 필수적이다.

```shell
$ git clone https://github.com/helm/helm.git
$ cd helm
$ make
```

필요시에는 의존성(dependencies)을 페치(fetch)하고 캐시(cache)하며 설정 유효성검사를 하게 된다. 그러고 나서 `helm`을 컴파일하여 `bin/helm`에 둔다.



















---

#Container

---