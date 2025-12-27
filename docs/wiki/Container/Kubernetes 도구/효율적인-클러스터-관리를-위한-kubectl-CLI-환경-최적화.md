---
slug: "효율적인-클러스터-관리를-위한-kubectl-CLI-환경-최적화"
---
:::tip 이번 장에는 kubectl 명령어를 좀 더 효율적으로 사용할 수 있는 방법을 알아봅니다.

:::

# K8S krew 를 이용한 plugin 관리
krew는 kubectl 플러그인 매니저 입니다.
여기서 plugin은 기존 소프트웨어에 특별한 기능을 편리하게 추가하는 옵션을 의미합니다.
krew는 kubectl CLI 환경에서 사용가능한 다양한 플러그인을 설치, 삭제, 조회하는 기능을 제공합니다.

그럼 krew를 설치합니다.

```shell
(
  set -x; cd "$(mktemp -d)" &&
  OS="$(uname | tr '[:upper:]' '[:lower:]')" &&
  ARCH="$(uname -m | sed -e 's/x86_64/amd64/' -e 's/\(arm\)\(64\)\?.*/\1\2/' -e 's/aarch64$/arm64/')" &&
  KREW="krew-${OS}_${ARCH}" &&
  curl -fsSLO "https://github.com/kubernetes-sigs/krew/releases/latest/download/${KREW}.tar.gz" &&
  tar zxvf "${KREW}.tar.gz" &&
  ./"${KREW}" install krew
)
```


```sh
export PATH="${KREW_ROOT:-$HOME/.krew}/bin:$PATH"
```

그 후에, 잘 설치 됐는지 확인하는 방법입니다.
```sh
kubectl krew update

kubectl krew
```

# kube-ctx, kube-ns, kube-ps1 활용
개발 / 스테이징 / 운영의 각 단계별로 클러스터는 분리돼 잇고, 다양한 클라우드 서비스와 각 서비스의 다양한 리전을 동시에 사용하는 것이 일반적 입니다.

여러 클러스터를 관리하면, 현재 내가 작업하는 클러스터가 여러 클러스터 중 어떤 클러스터인지 혼동 될 수 있습니다.
예를 들어 클러스터의 pod를 삭제해야 ㅎ나느데, 운영 클러스트이 파드를 삭제하는 경우가 발생할 수 있습니다.
스테이징 클러스터는 운영단계가 아니라 파드를 삭제해도 크게 문제가 되지 않지만, 운영은 서비스와 직결되므로, 큰 문제가 발생할 수 있습니다.

kube-ctx(context)는 k8s 컨텍스트를 선택하는 플러그인으로, 여러 클러스터 중 내가 원하는 클러스터를 선택할 수 있는 plugin입니다.
예를 들어, kube-ctx를 사용하면 개발, 스테이징, 운영 클러스터 중에서 필요한 클러스터를 지정할 수 있습니다.

### `kube-ctx`

아래 krew 명령어로 kube-ctx를 설치합니다.

```sh
kubectl krew install ctx


# kube-ctx 작동
kubectl ctx
```
만약 로컬호스트에 등록한 클러스터가 하나이면, 하나의 클러스터만 보이고, 여러개 등록한 경우라면 여러 개가 보입니다.

`kube-ctx`로 여러 클러스터 중 하나를 입력합니다.
클러스터 이름을 입력하면 해당 클러스터로 변경됩니다.

```sh
kubectl ctx [클러스터명]

kubectl get -n kube-system
```

### `kube-ns`
다음은 `kube-ns` 입니다.
k8s namespace는 단일 클러스터 내에서 각 namespace별 자원을 격리할 수 있어, 가상 클러스로 구분하는 용도로 사용할 수 있습니다.

```shell
kubectl krew install ns

# namespace 조회
kubectl ns

```

처음 k8s를 설치하면, 기본 애플리케이션 외에 다른 애플리케이션이 설치 되지 않아, namespace가 앞에 페이지와 같이 4개만 보입니다.

일반적인 운영환경에서는 여러가지가 보이는게 정상입니다.

`kube-ns` 플러그인을 사용하면, namespace를 편리하게 이동할 수 있습니다.
```sh
# 기본 설정은 default namespace 결과가 출력됩니다.
kubectl get pod

## kube-system namespace 로 변경
kubectl ns kube-system

# default namespace와 다르게 kube-system namespace에서는 
# 동일한 명령어 kubectl get pod 로 다양한 pod를 확인 가능
kubectl get pod

```

위와 같이 `kubectl ns` 명령어로 namespace가 변경되어 동일한 `kubectl get pod` 명령어로 서로 다른 결과가 나타납니다.

`kubectl get pod` 명령어는 현재 namespace에서 실행 중인 pod의 정보만 보여줍니다.
`kubectl ns`로 만약 namespace를 이동하지 않는다면, `-n` 옵션을 통해서 직접 지정해야합니다.

### `kube-ps1`
현재 클러스터와 namespace의 이름을 리눅스 프롬프트에 표시하는 `kube-ps1`플러그인 입니다.
`kube-ps1`을 사용하면, CLI의 프롬프트에서 클러스와 namespace 이름을 확인할 수 있습니다.

clusterd와 namespace 이름을 명령어 프롬프트 에서 명확하게 확인 할 수 있어, 다른 클러스터와 namespace에서 명령어를 실행하는 실수를 예방할 수 있습니다.

설치를 위해서 공식 가이드에 따라 소스코드를 내려 받고, `kube-ps1.sh` 파일에 실행권한을 추가합니다.

```sh
git clone https://github.com/jonmosco/kube-ps1.git

chmod +x ./kube-ps1/kube-ps1.sh
```

`~/.bashrc` 파일에 관련 설정을 추가 합니다.

```sh
# ~/.bashrc 파일을 수정합니다.
vi ~/.bashrc
```

`~/.bashrc`
```sh
source $HOME/kube-ps1/kube-ps1.sh
PS1=‘[\u@\h \W $(kube-ps1)]\$ ‘
KUBE_PS1_SYMBOL_ENABLE=false
```

```sh
source ~/.bashrc
```


# k8s의 주요 오브젝트
k8s에서는 kubectl 명령어로 k8s 오브젝트를 생성하고, 리스트를 확인할 수 있습니다.
- `run`, `create` : pod와 deployment 생성
- `get`, `exec` : 생성된 pod와 현황 조회 및 pod 내 bash 스트립트
- `scale`, `delete` : pod의 수량 증가/감소 및 오브젝트 삭제
- `create namespace` : namespace 생성

k8s 오브젝트란, k8s api 서버로 생성하는 영속성을 가지는 모든 실체를 말합니다.
애플리케이션을 실행하고 애플리케이션에 필요한 추가 리소스를 지정하고, 고가용성 관련 설정을 하는 등 일련의 모든 k8s 작업은 다양한 오브젝트와 해당 오브젝트 옵션의 조합으로 실행됩니다.

k8s 오브젝트의 정확한 개념은 쉽게 이해하기 어렵다ㅏ.
k8s의 모든 오브젝트는 api 서버로 생성합니다.
사용자가 k8s 명령어를 실행하면, k8s는 해당 명령어의 api 를 호출해서 오브젝트를 실행하는 방식으로 동작합니다.
참고로 복잡한 옵션의 오브젝트 api 호출이 필요한 경우에는 명령어가 아니라 `yaml` 파일을 사용합니다.

# YAML 파일을 이용한 k8s 오브젝트 관리

아래는 특정 노드에 pod가 실행되지 않고, 여러 노드에 파드를 분산해서 배치하는 (anti-affinity) 예제 입니다.
이 처럼 복잡한 설정을 명령어로 구현하면 명령어가 길어져서 가독성이 떨어지지만 코드로 구현하면 훨씬 낫습니다.

```yaml
affinity:
	podAntiAffinity:
		perferredDuringSchedulingIgnoredDuringExcution:
			- podAffinityTerm:
				labelSelector:
					matchExpressions:
						- key: app
							operator: In
							values:
								- nginx
				topologyKeyL kubernetes.io/hostname
			weight: 100
```

이와 비슷하게 복잡한 옵션을 사용해야하는 k8s 오브젝트가 많습니다.
파드를 연결하는 방식을 정의하는 service, 개별 애플리케이션의 환경 변수 설정을 정의하는 ConfigMap, 자원을 많이 사용해서 동일한 노드를 사용하는 다른 pod에 영향을 끼치지 않도록 하는 리소스 limits / requests 설정 등이 대표적이다.

이러한 object는 대부분 코드를 사용해서 구현합니다.
사실상 k8s 작업을 한다는 것은 이처럼 각 기능을 구현하는 코드를 찾아서 작성하는 것을 의미합니다.

k8s 코드를 작성하는데는 주로 YAML 파일을 사용합니다.
모든 k8s 리소스와 해당 옵션은 YAML 파일로 구현할 수 있습니다.


## YAML 파일 export 플러그인 kube-neat 설치

모든 k8s 오브젝트는 YAML 파일로 실행하고, 실행 중인 모든 오브젝트는 YAML 파일로 export 할 수 있습니다.
이 때 `kube-neat` 플러그인을 사용하면 YAML 파일의 가독성이 향상 됩니다.

먼저 kubectl 명령어로 busybox pod를 생성합니다.
busybox 이미지는 1~5mb의 작은 용량에 많이 사용하는 unix utility를 포함하고 있어 문제가 발생했을 때, 디버깅 용도로 많이 사용됩니다.


```shell
kube run busybox —image=busybox

kube get pod
```

busybox pod를 실행하면 nginx pod와 다르게 Running 상태가 아니고 Complete 상태로 나타납니다.
busybox 이미지는 nginx 프로세스 처럼 계속 실행되는 프로세스가 없기 때문입니다.
따라서 `command` 옵션으로 계속 실행되는 프로세스를 추가 해야합니다.

`command` 옵션을 추가 하기 위해 실행 중인 pod를 YAML 파일로 export 합니다.

```sh
kubectl get pod busybox -o yaml
```

```yaml
status:
	conditions:
		- lastProbeTime: null
			lastTransitionTime: "2020-09-20T20:40:20"
			status: "True"
			type: Initialzed
		- lastProbeTime: null
			lastTransitionTime: "2020-09-20T20:40:20"
			message: 'containers with unready status: [busybox]'
			reason: ContainersNotReady
			status: "False"
			type: Ready
```

YAML 파일 형태로 export 할 때는 `-o yaml` 옵션을 사용합니다.
`-o yaml` 옵션은 실무에서 현재 실행중인 상세 설정을 YAML 파일로 확인하는 용도로 자주 사용합니다.
하지만, 앞의 출력 결과와 같이 불필요한 status 정보까지 포함돼 잇어, YAML파일을 보기가 불편합니다.

`kube-neat`플러드인은 export YAML 파일에 불필요한 정보를 제거합니다.
`kube-neat` 을 사용하면 가독성이 향상되어 export YAML을 재사용하기가 쉽습니다.
`kube-neat` 역시 앞장에서 설치한 플러그인 매니저 krew를 사용하여 설치합니다.

```sh
kubectl krew install neat
```

앞에 설명한 `-o yaml` 옵션에 `kube-neat` 명령어를 추가해서 export 하면 훨씬 간결한 YAML 파일을 확인 할 수 있습니다.

```sh
kubectl get pod busybox -o yaml | kubectl neat
```
# YAML 파일을 이용한 파드 배포
앞서 export 한 busybox pod의 yaml 파일에 `command` 옵션을 추가해서 재배포하겠습니다.

```sh
kubectl get pod busybox -o yaml | kubectl neat > busybox-pod.yml

vi busybox-pod.yml
```

```sh
spec:
	containers:
	- image: busybox
		name: busybox
		command:
		- "/bin/sh"
		- "-c"
		- "sleep inf"
```
`busybox-pod.yml`

새로운 buxybox pod를 실행하귀 위해 기존 busybox pod를 삭제합니다. 
삭제가 완료된 YAML 파일을 이용해 새로운 리소스를 생성합니다.

---

#Container #Kubernetes 

---




