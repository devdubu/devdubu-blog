---
slug: "처음-만나는-Kubernets"
---
:::quote 쿠버네티스로 애플리케이션을 배포하고 관리하기

:::

![스크린샷-2023-06-21-오후-4.42.19.png](/img/이미지 창고/스크린샷-2023-06-21-오후-4.42.19.png)

:::quote 사용자의 의도를 어떻게 표현하는가?
- 의도를 정의하는 방법 : Kubernetes Object - Object 종류에 따라 정의할 수 있는 속성이 달라진다.
- 표현방식 : YAML
- 전달방식 : REST API

:::

:::quote Kubernetes Object는 클러스터 상태를 결정한다.

:::

![스크린샷-2023-06-21-오후-4.46.46.png](/img/이미지 창고/스크린샷-2023-06-21-오후-4.46.46.png)
- 사용자가 어떻게 Kubernetes Object를 정의 하느냐에 따라, Kubernetes 상태가 결정된다.
- 즉, Kubernetes 오브젝트를 이용해서 개발팀의 구조, 배포 정책, 프로세스를 표현할 수 있다.

# Kubernetes Object
- 쿠버네티스 클러스터를 이용해 Application을 deply하고 운영하기 위해 필요한 모든 Kubernetes 리소스
## Kubernetes Object가 될 수 있는 것(클러스터의 상태를 표현하는 개체들)

### Pod
- 어떤 애플리케이션을

### ReplicaSet
- 얼마나

### Node, NameSpace
- 어디에

### Deployment
- 어떤 방식으로 배포할 것인가

### Service, Endpoints
- 트래픽을 어떻게 로드 밸런싱 할 것인가.

:::example 간단한 설계 사항
- 클러스터에는 10개의 Node에 5개의 NameSpace가 있고, 100개의 Deployment를 이용해 애플리케이션을 배포하고 있다.
- 배포는 점진적 배포 전략을 이용하고, ReplicaSet을 보니 Pod을 2개씩 생성해서 애플리케이션을 실행하고 있다.
- Service를 보니 서비슬르 호출하려면 my-app이라는 도메인을 호출 할수 있다.

:::

## 표현 방법
- 우리의 의도를 담는 `spec` 필드
```yaml
apiVersion: apps/v1          # 오브젝트 기본 정보(필수값)
kind: Deployment            # kind: 생성하고자 하는 오브젝트 종류
metadata:                   # metadata: 오브젝트를 구분 지을 수 있는 정 
	name:nginx-deployment    #     name, resourceVersion, labels, namespace, ...
spec:                       # spec: 사용자가 원하는 오브젝트 상태
	selector:                # 선언할 수 잇는 속성은 오브젝트 종류마다 다릅니다.
	matchLabels:
		app:nginx
	replicas:2
	template:
		metadata:
			labels:
				app: nginx
			spec:
				containers:
					- name: nginx
					  image: nginx:1.14.2
					  ports:
					  - containerPort: 80
```

- Kubernetes가 Object 상태를 알려주는 status 필드
```yaml
status:
	availableReplicas: 2
	conditions:
		- lastTransitionTime: '2022-02-06T12:28:39Z'
		  lastUpdateTime: '2022-02-06T12:28:39Z'
		  message: Deployment has minumum availablity.
		  reason: MinimumReplicasAvailable
		  status: 'True'
		  type: Available
		- lastTransitionTime: '2022-02-06T12:28:16Z'
		  lastUpdateTime: '2022-02-06T12:28:39Z'
		  message: ReplicaSet "my-app-5b7548d6b" has successfully progressed.
		  reason: NewReplicaSetAvailable
		  status: 'True'
		  type: Progressing
		observedGeneration:1
		readyReplicas: 2
		replicas: 2
		updatedReplicas: 2
```
- Object가 Kubernetes Cluster에 생성되면, Kubernetes Object 정보에 status 필드를 추가하고, 현재 실행 중인 오브젝트의 상태 정보를 알려준다.

---

#Container

---