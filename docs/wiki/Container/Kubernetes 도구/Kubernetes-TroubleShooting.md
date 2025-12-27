---
slug: "Kubernetes-TroubleShooting"
---
일반적으로 kubernetes 작업 순서는 아래와 같습니다.
![Diagram-1.svg](/img/이미지 창고/Diagram-1.svg)
1. YAML 파일을 이용해 오브젝트를 생성(apply) 하고 생성한 오브젝트 리스트는 `get` 명령어로 확인합니다.
2. 만약 pod가 정상적으로 생성되지 않으면, 상세한 설정 정보를 `describe` 명령어로 확인합니다.
3. 이후 애플리케이션 관련 에러는 로그 명령어로 확인하고 kubernetes 클러스터 관련 메시지는 이벤트 명령어로 확인합니다.

# 기본 에러 조치 프로세스의 이해
:::question 만약 nginx 를 설치하는 YAML에 nginx 버전을 잘 못 기입 할 경우?

:::

해당 경우는 기존 Nginx 파드와 다르게, `READY 0/1` 이고 `STATUS` 는 `ImagePullBackOff` 입니다.
에러는 `ImagePullBackOff`, 즉 이미지를 Pull 하는데 실패했다는 의미 입니다.

이렇게 파드를 실행했는데 에러가 발생하면 추가로 상세한 정보 확인이 필요합니다.
상세 정보는 `describe` 명령어를 사용해 확인 할 수 있습니다.

```shell
kubectl describe pod nginx-19
```

`desribe` 명령어는 모든 k8s 오브젝트의 상세한 정보를 출력합니다.
`kubectl describe pod`로 파드가 실행되는 노드의 정보와 파드의 시작 시간, 이미지 정보 등 상세한 추가 정보를 확인 할 수 있습니다.

그리고 중요한 이벤트 관련 정보는 명령어 출력 결과의 하단에 별도로 분리되었습니다.
에러 메시지를 확인하면 `nginx:1.19.19 not found` 즉, `1.19.19` 이미지 버전을 찾을 수 없다 는 메시지를 확인 할수 있습니다.
메시지 만으로 이해하기 쉽고 직관적이라 이미지 버전이 잘못된 것을 바로 알 수 있습니다.

다음으로 파드의 YAML 파일 설정 문제가 아닌 애플리케이션 자체의 문제는 `kubectl logs` 명령어로 애플리케이션 로그를 확인해서 조치할 수 있습니다.

```shell
kubectl logs -f nginx-19
```

만약 위 처럼 특정 애플리케이션 수준이 아닌 전체 클러스터 레벨의 에러는 어떻게 확인 할까?
클러스터 이벤트 `kubectl get event` 명령어를 사용해 확인합니다.

해당 namespace와 관계된 호스트 노드, 네트워크, 스토리지 등 클러스터 전반의 이벤트가 출력됩니다.
또한 이벤트를 심각도 수준에 따라 필터링 하면 에러만 빠르게 확인 할 수 있다.

```shell
# -n 옵션으로 특정 네임스페이스를 지정할 수 있다.
kubectl get events -n kube-system

# -A 옵션을 지정하면 전체 네임스페이스 이벤트를 확인합니다.
kubectl get events -A
```

## 장애 처리 사례 - host node의 file system 용량 초과


![Diagram-2.svg](/img/이미지 창고/Diagram-2.svg)

먼저 YAML 파일을 이용해 파드 개수가 10개인 busybox deployment를 실행합니다.

`busybox-deploy.yml`
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
	name: busybox
	labels:
		app: busybox
spec:
	replicas: 10
	selector:
		matchLabels:
			app: busybox # POD label과 일치
	template:
		metadata:
			labels:
				app: busybox # Selector label 과 일치
		spec:
			containers:
				- name: busybox
				  image: busybox
				  command:
				  - "/bin/sh"
				  - "-c"
				  - "sleep inf"
```

deployment를 실행합니다. 10개의 pod가 각  노드에 고르게 분배 됩니다.

```shell
kubectl apply -f busybox-deploy.yml

kubectl get pod -o wide
```

에러의 상황을 만들기 위해서 2번 노드에 접속하여 용량이 큰 파일을 만듭니다.
용량이 큰 파일을 만듦과 동시에 pod의 상태를 확인 하기 위해 일단 바로 파일을 만들지 않고 준비만 합니다.

```shell
ssh spkr@172.17.29.62

df -h
```

컨테이너 런타임으로 containerd를 사용하는 kubernetes 환경의 파드는 노드의 `/var/lib/containerd` 디렉터리를 파드의 루트 디렉터리로 사용합니다.
임의로 패당 파일 시스템의 90%를 차지하는 파일 만들어서 에러를 발생 시키겠습니다.

원하는 특정 용량의 파일을 생성하는 리눅스 명령어는 `fallocate` 입니다.
실시간 로그를 확인하기 위해서 터미널의 화면을 위아래로 나눕니다.

첫 번째 화면에서는 `ubun20-02` 서버 접속해 `fallocate` 명령어를 실행합니다.

```shell
fallocate -l 30g 30g-file
df -h
```

두번째 화면에서는 `kubectl get pod -o wide -w` 명령어를 실행해 실시간으로 변경되는 파드의 상태를 확인합니다.
2번 노드에서 큰 파일을 생성해서 2번 노드에서 실행 중인 모든 busybox 파드가 사라지고 
새로운 노드(`ubun20-01`, `ubun-20-03`)에서 새로운 파드가 생성됩니다.

kubernetes는 위와 같이 자원이 부족한 노드가 발생하면 자동으로 해당 노드의 파드를 자원의 여유가 있는 다른 노드로 이전합니다.
`busybox` `deployment` 의 최초 의도한 상태가 pod 수량 10개 이므로, 이를 계속 유지하기 때문입니다.
이 처럼 kubernetes는 특정 노드에 문제가 발생하면 다른 노드로 자동으로 이전한 후, 실행해서 항상 애플리케이션을 의도한 상태로 유지합니다.
또한 이식성이 뛰어난 컨테이너 환경이라서 다른 노드에서 애플리케이션이 실행 되도 이전 노드와 같이 정상적으로 실행됩니다.



---

#Conatiner #Kubernetes 

---
