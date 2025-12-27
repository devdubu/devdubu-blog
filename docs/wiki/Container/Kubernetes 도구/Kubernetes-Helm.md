---
slug: "Kubernetes-Helm"
---
현업에서는 애플리케이션을 실행하기 위해서 Kubernetes 리소스가 여러개  필요한 경우가 많습니다.
파드의 노출을 담당하는 서비스(Service), 애플리케이션 설정에 관련된 config Map, 기밀 정보를 다루는 Secret, 등을 하나의 애플리케이션에 포함하는 것이 대표적입니다.
이렇게 다양한 리소스를 각각 관리하지 않고, 하나의 패키지로 관리하는 도구가 헬름 입니다.
리눅스 환경에서 yum, apt 등이 애플리케시연에 필요한 라이브러리를 패키지 형태로 제공하는 것과 유사합니다.

대부분의 제조사에서 직접 helm 파일을 제공해서 안정성, 고가용성 측면에서 best practice 기반의 파일을 사용할 수 있습니다.

또한 템플릿 형태로 제공하므로, 사용자는 개별 운영 환경에 필요한 인자들은 변수형태로 편리하게 추가 또는 수정할 수 있습니다.

helm은 다양한 고객사에서 이미 표준 애플리케이션 설치 도구로 사용하고 있습니다.
이번 장에서는 helm 주요 개념 3가지, 즉, helm charts, helm repository, helm templates 를 이해하고 nginx 애플리케이션을 직접 헬름으로 설치하는 실습을 진행할 예정입니다.

# Helm 주요 구성 요소
## Helm 차트
헬름을 이용해 K8S 환경의 애플리케이션을 설치하려면 먼저 헬름의 주요 구성 요소를 이해해야합니다.
헬름 차트는 애플리케이션 설치에 사용되는 네트워크, 스토리지, 보안과 관련된 여러 쿠버네티스 리소스를 묶어놓은 패키지 입니다.

일반적으로 차트라는 용어는 그래프를 의미하지만, 헬름에서의 차트는 여러 리소스의 묶음을 의미합니다.
헬름 차트를 통해 애플리케이션을 설치할 때는 개별 리소스마다 하나씩 별로도 설치하지 않고, 헬름 차트 하나로 일괄 설치 할 수 있습니다.

특정 차트는 특정한 리소스 디렉터리 구조를 가집니다.
다음은 헬름 차트 디렉터리 구조의 예시입니다.

```
헬름 차트 디렉터리/
Chart.yaml  # 차트에 대한 정보가 담긴 YAML
LICENSE     # 차트의 라이선스 정보가 담긴 텍스트 파일
README.md   # 해당 차트에 대한 설명을 포함한 README 파일
values.yaml # 차트의 기본 템플릿 변수 파일
charts/     # 차트에 종속된 차트들을 포함하는 디렉터리
crds/       # 커스텀 자원 정의
templates/  # values 파일과 같이 유효한 쿠버네티스 패니페스트 파일을 생성하는 템플릿
	NOTES/txt   # 차트 사용법을 설명하는 텍스트 파일
```

다음으로는 리포지토리는 다양한 헬름 차트를 저장하고 공유하는 저장소 입니다.
리눅스 패키지 관리 도구인 `yum`의 리포지토리와 동일한 기능입니다.

많은 솔루션 업체들이 직접 헬름 리포지토리를 제공합니다.
솔루션 업체가 제공하는 리포지토리가 없는 애플리케이션은 주로 `ArtifactHub` 등에서 찾을 수 있습니다.
`ArtifatHub`는 사용자가 단일 헬름 장소에서 다양한 헬름 차트를 사용할 수 있도록 헬름 차트 허브를 제공합니다.

헬름 리포지토리는 로컬에 원격 리포지토리 주소를 등록해서 사용할 수 있습니다.
각 리포지토리별로 애플리케이션 목록은 `helm search` 명령어로 확인 할수 있습니다.

```SHELL
# 리포지토리 목록 조회
helm repo list

# 리포지토리 내 설치 가능한 애플리케이션 조회
helm search repo bitnami

```

헬름은 템플릿을 사용해 설치와 관련된 파일을 관리합니다.
템플릿이란 일정한 형식 또는 포맷을 의미하며, 사용자는 이름 날짜 등의 특정 변수만 수정하면 해당 파일을 사용할 수 있습니다.
helm은 여러 템플릿 파일에서 사용하는 변수를 단일 `value.yaml` 파일에서 관리합니다.
해당 파일만 수정하면 전체 템플릿 파일에서 사용하는 변수를 한꺼번에 수정할 수 있습니다.

다음 예제와 같이 `value.yaml` 파일 내의 변수를 key-value 형태로 등록하면 실제 템플릿 파일에서 핻아 변수를 공통으로 적용할 수 있습니다.

템플릿 파일에 변수를 적용하려면 아래와 같이 원하는 k8s 오브젝트 파일에 `{ .Values.favoriteDrink }}` 형식으로 지정합니다.

```yaml
favoriteDrink: coffee
```

`Values`는 템플릿 변수 파일을 의미하고 `favoriteDrink`는 `values.yaml`에 등록한 키를 의미합니다.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
	name: {{ .Release.Name }}-configmap
data:
	myvalue: "Hello World"
	drink: {{ .Values.favoriteDrink }}
```

적용된 변수 파일은 다음과 같이 실제 생성된 k8s 리소스에서 확인 할 수 있습니다.
```yaml
helm install geared-marsupi ./mychart --dry-run --debug
```


# Helm Chart를 이용한 Nginx 설치
Helm을 이용해 애플리케이션 lifecycle을 관리하고 helm 템플릿 변수 파일인 `values.yaml`을 사용하는 방법을 알아보겠습니다.

## Helm을 이용한 애플리케이션 라이프사이클 관리

```shell
# 애플리케이션 설치에 사용하는 helm repository를 로컬 환경에 추가합니다.
helm repo add

# 헬름 차트 파일을 로컬호스트로 내려받습니다.
helm pull

# 원본 템플릿 변수 파일의 이력 관리를 위해 템플릿 변수 파일 values.yaml 을 새로운 파일 my-values.yaml 로 복사합니다.
cp values.yaml my-values.yaml

# 수정한 파일을 템플릿 옵션 파일로 지정해 원하는 애플리케이션을 설치합니다.
helm install { helm 이름 } -f my-values.yaml .

# 설치된 helm 차트 목록을 확인합니다.
helm ls

# 주로 디버깅 용도로 사용하며, 현재 실행 중인 helm 차트의 전체 YAML 파일 목록 및 상세 설정을 확인 할 수 있다.
helm get manifest

# 기존 헬름 차트의 변수 등을 수정해서 재배포 합니다.
helm upgrade

# 헬름 차트를 삭제합니다.
helm delete
```

실습을 위해서 localhost에 `helm` 유틸리티를 설치 합니다.

```shell
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3

chmod 700 get_helm.sh

./get_helm.sh

helm version
```

이제 helm을 이용해 nginx를 설치 합니다.
먼저 검색을 통해 해당 애플리케이션의 helm 차트를 포함하는 리포지토리를 추가합니다.
![Screenshot-2024-11-19-at-9.05.19-PM.png](/img/이미지 창고/Screenshot-2024-11-19-at-9.05.19-PM.png)
정상적으로 nginx helm 차트가 검색 됩니다.
이제 해당 helm 차트를 localhost에 내려받습니다.
helm 차트를 localhost에 내려받지 않고, 원격 helm 차트 그대로 설치하는 것도 가능합니다.

하지만, 로컬에 내려받지 않으면 어떤 버전의 차트를 사용했는지, `values.yaml`은 어떻게 수정했는지 관리하기 쉽지 않습니다.


그래서 필자는 helm 차트를 로컬호스트에 내려받고 필욯나 변수를 수정해서 애플리케이션을 설치하는 방법을 권장 합니다.

`helm pull` 명렁어를 사용하면 다운 됩니다.

```shell
helm pull bitnami/nginx

tar xvfz nginx-18.2.5

rm -rf nginx-18.2.5

mv nginx nginx-18.2.5

cd nginx-18.2.5/

ls templates/
```

모든 helm 차트는 유사한 디렉터리 구조를 가집니다.
다른 애플리케이션과 마찬가지로 nginx helm 차트도 templates 디렉터리에서 helm 차트에서 설치할 전체 쿠버 리소스 목록을 확인할 수 있습니다.

deplyment, ingress, hpa 등 다양한 리소스가 있습니다.
![Screenshot-2024-11-19-at-9.19.52-PM.png](/img/이미지 창고/Screenshot-2024-11-19-at-9.19.52-PM.png)
helm 차트는 이처럼 다양한 오브젝트를 각각 설치하지 않고, 단일 helm 차트로 일괄 설치 할 수 있습니다.
각 오브젝트별 옵션 설정에 필욯나 변수는 펼도의 템플릿 변수 파일 `values.yaml` 을 사용해 일괄 적용합니다.
하나의 변수 파일만 수정하면 해당 변수를 포함하는 모든 템플릿 파일에 공통으로 적용되어 편리합니다.

개별 환경마다 클러스터 규모, 지원하는 네트워크 스토리지 종류에 따라 다양한 변수 파일을 수정합니다.
변경 내역을 관리하기 위해 기본적으로 제공되는 helm 템플릿 변수 파일을 복사해서 임의의 새로운 파일을 생성합니다.

```shell
cp values.yaml my-values.yaml
```

새로 생성한 `cp-values.yaml` 파일의 변수를 수정해서 현재 환경에 적합한 클러스터의 스토리지, 네트워크 설정을 입력합니다.

해당 실습은 간단히 `replicaCount` 변수만 수정합니다.

```yaml
replicasCount: 2
```

변경된 파일로 Nginx 애플리케이션을 설치합니다.
설치 전 nginx 애플리케이션 전용 NS를 임시 생성합니다.

관리 편의와 자원 효율화를 위해 일반적으로 K8S 는 각 애플리케이션 별로 NS를 구분합니다.

NS를 생성하고 생성한 NS로 변경합니다.
```SHELL
# nginx 네임스페이스 생성
kubectl create ns nginx

# nginx 네임스페이스 변경
kubectl ns nginx
```

생성한 ns 에서 nginx helm 차트를 설치합니다.
helm 차트의 이름은 임의로 정할 수 있으나, 애플리케이션 이름을 사용하는 것을 권장합니다.
```shell
helm install nginx -f my-values.yaml .
```
- `-f` 옵션으로 helm 차트 설치에 사용할 템플릿 파일 이름을 지정합니다.
- `.` 를 지정해 현재 디렉터리 위치의 helm 차트를 이용해 설치합니다.

생성한 helm 차트는 `helm ls`로 확인합니다.

```shell
helm ls

kubectl get pods
```

헬름 차트를 이요해서 Nginx 설치를 완료 했습니다.
그러면 기존 사용자가 임의로 생성한 Nginx 와 어떤 차이가 있나?

먼저 helm 차트에는 기본으로 다양한 k8s 리소스를 포함합니다.
Nginx helm 차트는 depolyment 외에도 configmap, service 등을 기본으로 포함합니다.

```shell
# deploy, svc, configmap 등을 쉼표(',')로 구분해서 여러 개의 리소스를 동시에 조회 가능
kubectl get deploy, svc, configmap
```

헬름 차트로 설치된 전체 리소스 목록은 `helm get manifest`로 확인 할 수 있습니다.
설치가 완료되면 리소스 목록 확인과 개별 리소스의 상세 옵션을 확인 할 수 있어 디버깅 용도로 주로 사용합니다.

```shell
helm get manifest nginx
```

다음으로 파드의 상세 설정을 확인하면 `Liveness/Readiness Probe` 등이 포함돼 있습니다.
이러한 설정은 헬름 차트로 설치된 애플리케이션이 헬름 차트를 사용하지 않은 다를 애플리케이션에 비해 좀 더 안정적으로 동작하게 합니다.

헬름 차트를 사용하지 않으면, 해당 설정을 직접 일일이 추가해야 합니다.

```shell
kubectl describe pod nginx-123213
```

## 헬름 템플릿 변수 파일 사용하기
이번에는 nginx 헬름 차트를 설치할 때 사용한 템플릿 변수 파일에 대해 좀 더 알아보겠습니다.
앞에서 복사한 `my-values.yaml` 파일의 내용을 확인하면, `key-value` 형식으로 구성된 다양한 변수를 확인 할 수 있습니다.

```yaml
resouces:
	limits:
		cpu: 1000m
		memory: 512Mi
	requests:
		cpu: 100m
		memory: 128Mi
```

위 예제는 리소스 설정에 관한 변수 입니다.
해당 변수가 어떻게 사용되는지 확인하기 위해 헬름 차트의 `templates` 디렉터리에 있는 `deployment.yaml` 파일을 살펴 보겠습니다.
이 파일을 열어보면 앞에서 사용된 변수를 확인 할 수 있습니다.
- ` {{- if .Values.resources }} `
	- `if` 문을 사용해 resources 변수가 정의돼 있으면, 해당 변수를 사용하도록 설정 할 수 있습니다.
- ` {{- toYaml .Values.resources | nindent 12 }}`
	- `toYaml` 함수를 사용해 해당 변수의 내용을 들여쓰기 12칸의 형식의 YAML 형식으로 전환합니다.
위 같은 형식으로 `values.yaml` 파일에 정의된 변수는 개별 리소스의 매니페스트 파일에 적용됩니다.
사전에 정의된 `values.yaml` 파일의 다양한 변수를 변경해서 사용자는 원하는 기능을 추가 할 수 있습니다.

이렇게 사전에 설정된 다양한 변수 중 필요한 변수만 변경해서 사용자는 애플리케이션을 새롭게 구성합니다.
만약 원하는 옵션이 없다면 템플릿 양식 문법에 맞게 직접 변수를 추가하거나 임의로 오브젝트 매니페스트 파일에 직접 추가할 수 있습니다.

## 리소스 Requests/Limits 이해
헬름 차트로 설정한 변수 중 리소스 Request/Limits에 대해 좀 더 자세히 알아보겠습니다.
쿠버네티스는 하나의 노드에 여러 개의 파드를 실행합니다.

같은 노드에 실행 중인 여러 파드는 동일한 호스트 노드의 자원을 공유하므로, 특정 파드가 자원을 많이 사용하면, 공통으로 사용 중인 노드 자원이 줄어들어 다른 파드의 성능에 영향을 끼칩니다.

이러한 상황을 대비해 파드가 사용 가능한 자원을 제한 할 수 있도록 리소스 `Requests/Limits` 옵션을 사용할 수 있습니다.

Limits는 이름 그대로 사용 가능한 자원을 제한하는 것입니다.
예를 들어 `limits.cpu : 1000m`, `limits.memory: 512Mi` 설정은 해당 파드가 1CPU, 512Mi 메모리 이상의 자원을 사용하지 못하도록 제한합니다.
이처럼 Limits 설정은 직관적입니다.

하지만 Request는 조금 이해하기 어렵습니다.
Requests 옵션은 처음 노드에 파드를 할당할 때 해당 요청량 (Request) 이상의 여유 자원이 있는 노드에 파드를 할당하게 하는 옵션입니다.
그리고 파드가 배치된 이 후 각 파드 간 자원 사용량이 증가해서 노드에서 할당 가능한 자원 이상을 사용해 자원 경합이 발생하면, 파드는 Requests에서 할당한 자원 만큼 사용이 가능하다고 보장 받습니다.

Request라는 단어의 의미를 파드가 보장 받을 수 잇는 자원 요청량으로 이해하면 좀 더 이해하는데 도움이 됩니다.

먼저 메모리 제한 사용량(limits)을 초과한 파드를 실행하는 경우를 알아봅니다.
부하 실행 도구 stress 를 포함한 컨테이너를 실행해 추가 부하를 발생 시켜 보겠습니다.

```yaml
apiVersion: v1
kind: Pod
metadata:
	name: memory-demo-1
spec:
	containers:
	- name: memory-demo-1
	  image: polinux/stress
	  resources:
			requests:
				  memory: "3Gi"
			  limits:
				  memory: "6Gi"
	command: ["stress"]
	args: ["--vm", "1", "--vm-bytes", "6500", "--vm-hang", "1"]
```
- `spec.resources.limits.memory: "6Gi"`
	- 컨테이너의 메모리 사용량을 6Gi로 제한합니다.
- `spec.resources.command : ["stress"]`
	- stress 도구를 사용해 제한 사용량 6Gi를 초과한 6500M의 메모리를 사용하도록 리소부하를 발생 시킵니다.

```yaml
kubectl apply -f mem-limits01-pod.yml

kubectl get pod
```
사용 가능한 메모리 제한을 초과해서 파드에 OOMKilled(Out of Memory) 에러가 발생하빈다.
`describe` 명령어로 에러 메시지를 확인 할 수 있습니다.

```yaml
kubectl described pod momory-demo-1
```

처음에는 파드가 실행되지만, 메모리 사용량이 증가하면서 제한 사용량을 초과하면, 해당 파드의 실행은 중단되고 다시 시작되는 상황을 반복하비낟.

메모리 Limits 설정을 가진 pod의 테스트가 완료 됐으므로 해당 파드를 삭제합니다.
```yaml
kubectl delete pod memory-demo-1
```

이제 2개의 파드를 실행해 메모리 요청량(requests) 설정을 알아봅니다.
`requrest`는 다른 파드의 사용량에 관계 없이 pod가 request해서 사용 가능한 자원 사용량입니다.

```yaml
apiVersion: v1
kind: Pod
metadata:
	name: memory-demo-1
spec:
	containers:
	- name: memory-demo-1
		image: polinux/stress
		resources:
			requests:
				memory: "36Gi"
			limits:
				memory: "6Gi"
			command: ["stress"]
			args: ["--vm", "1", "--vm-bytes", "100M", "--vm-hang", "1"]
```
- `spec.resources.requests.memory: "3Gi"`
	- 메모리 requests를 3Gi 로 설정합니다.
- `spec.containers.command:["stress"]`
	- 100M의 메모리 부하로 파드를 실행합니다.
- `spec.nodeSelector`
	- 테스트를 위해 특정 노드(ubun-20-01)에 파드를 할당합니다.

그럼 pod를 실행합니다. nodeSelector에 정의한 ubun20-01 노드에 실행됩니다.

```yaml
kubectl apply -f mem-requests01-pod.yml

kubectl get pod -o wide
```

이제 메모리 제한 사용량을 초과하지 않게 메모리 부하를 실행하는 pod를 실행합니다.
```yaml
apiVersion: v1
kind: Pod
metadata:
	name: memory-demo-2
spec:
	containers:
	- name:
		image: polinux/stress
		resources:
			requests:
				memory: "3Gi"
			limits:
				memory: "6Gi"
		command: ["stress"]
		args: ["--vm|", "1", "--vm-bytes", "5500M", "--vm-hang", "1"]
	nodeSelector:
		kubernetes.io/hostname: ubun20-01
```
- `spec.containers.ressources.memory: "6Gi"`
	- 메모리 제한 사용량이 6Gi 설정합니다.
- `spec.containers.command: ["stress"]`
	- 5500M 메모리 부하로 파드를 실행합니다.
- `spec.nodeSelector`
	- 테스트를 위해 특정 노드(ubun20-01)
```yaml
kubectl apply -f mem-requrests01-pod.yml

kubectl get pod -o wide
```

이제 메모리 제한 사용량 (6Gi) 를 초과하지 않게 메모리 부하를 실행하는 파드를 실행합니다.
```yaml
apiVersion: v1
kind: Pod
metadata:
	name: memory-demo-2
spec:
	containers:
	- name: memory-demo-2
		image: polinux/stress
		resources:
			requests:
				memory: "3Gi"
			limits:
				memory: "6Gi"
		command: ["stress"]
		args:
```

- `spec.containers.resources.memory: "6Gi"`
	- 메모리 제한 사용량을 6Gi 설정합니다.
- `spec.containers.command: ["stress"]`
	- 5500M의 메모리 부하로 파드를 실행합니다.
제한 사용량 6Gi를 넘지 않는 5500M 부하를 실행하므로, 파드는 정상적으로 실행됩니다.
앞에서 실행한 파드(momory-demo-2)의 메모리 사용량이 100M + 5.5Gi에서 두 파드 모두 정상적으로 실행됩니다.

![Diagram-3.svg](/img/이미지 창고/Diagram-3.svg)
- Requests 메모리 사용량을 초과하기 전의 메모리 사용량
```shell
kubectl apply -f mem-stress-pod.yaml
```

이제 1번 파드에서 사용하는 메모리 사용량을 2900M 까지 올립니다.
메모리 사용량이 증가해서 이제 2개의 파드 메모리 사용량 합계가 8.4Gi (2.9Gi + 5.5Gi) 가 되어 호스트 노드의 전체 메모리인 8Gi를 초과하게 됩니다.

그럼 2개의 pod 중 어떤 파드가 종료 될까?

![Diagram-4.svg](/img/이미지 창고/Diagram-4.svg)

직접 파드에 접속해 메모리 사용량을 증가 시킵니다.
창을 위 아래로 2개의 창을 나누고, 한곳에서 아래와 같이 메모립 부하를 증가하는 명령어를 실행합니다.
```shell
kubectl exec -it memory-demo-1 -- bash
stress --vm 1 --vm-bytes 2900M --vm-hang 1
```

이제 다른 창에서 아래와 같이 실기간으로 pod의 상태 변화를 확인할 수 있습니다.


---

#Container #Kubernetes 

---

















