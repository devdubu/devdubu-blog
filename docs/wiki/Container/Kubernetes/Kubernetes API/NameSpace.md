- [NameSpace](#NameSpace)
	- [클러스터 범위 API 리소스와 NameSpace 범위 API 리소스](#NameSpace#클러스터 범위 API 리소스와 NameSpace 범위 API 리소스)
		- [NameSpace 범위 API 리소스(NameSpace-scoped API Resources)](#클러스터 범위 API 리소스와 NameSpace 범위 API 리소스#NameSpace 범위 API 리소스(NameSpace-scoped API Resources))
		- [클러스터 범위 API 리소스(Cluster-scoped API Resources)](#클러스터 범위 API 리소스와 NameSpace 범위 API 리소스#클러스터 범위 API 리소스(Cluster-scoped API Resources))
	- [실습](#NameSpace#실습)
	- [클러스터 기본 네임스페이스](#NameSpace#클러스터 기본 네임스페이스)
		- [default](#클러스터 기본 네임스페이스#default)
		- [kube-system](#클러스터 기본 네임스페이스#kube-system)
		- [kube-public](#클러스터 기본 네임스페이스#kube-public)
		- [kube-node-lease](#클러스터 기본 네임스페이스#kube-node-lease)
	- [다른 NameSpace 서비스 접근하기](#NameSpace#다른 NameSpace 서비스 접근하기)
		- [FQDN(Fully Qualified Domain Name)과 Domain Search 옵션](#다른 NameSpace 서비스 접근하기#FQDN(Fully Qualified Domain Name)과 Domain Search 옵션)
	- [실습](#NameSpace#실습)
		- [discovery](#실습#discovery)
	- [ResourceQuota와 LimitRange](#NameSpace#ResourceQuota와 LimitRange)
		- [ResourceQuota](#ResourceQuota와 LimitRange#ResourceQuota)
		- [LimitRange](#ResourceQuota와 LimitRange#LimitRange)
	- [실습](#NameSpace#실습)
		- [extra](#실습#extra)

---

# NameSpace

> 쿠버네티스 상의 API 오브젝트들을 논리적으로 구분하여 관리하고 싶다면?
> 분류뿐만 아니라 해당 논리적인 그룹에 대하여 권한 관리, CPU & Memory 등 리소스 제한 등을 하고 싶다면?

- 리소스를 <mark>논리적</mark>으로 나누기 위한 방법 제공(논리적 그룹) 
- Namespace의 단위는 사용자 목적에 맞추어 결정
	- 팀 단위 NameSpace
	- 환경 단위 NameSpace
	- 서비스 단위 NameSpace
![Screenshot-2022-12-19-at-10.06.21-PM.png](/img/이미지 창고/Screenshot-2022-12-19-at-10.06.21-PM.png)


## 클러스터 범위 API 리소스와 NameSpace 범위 API 리소스
NameSpace에 속 할 수 있는 리소스를 네임스페이스 범위 API 리소스라고 함

### NameSpace 범위 API 리소스(NameSpace-scoped API Resources)
- Pod, Deployment, Service, Ingeress, Secret, ConfigMap, ServiceAccount, Role, RoleBinding 등
```bash
kubectl api-resources --namespaced=true
```

### 클러스터 범위 API 리소스(Cluster-scoped API Resources)
- Node, Namespace, IngressClass, PriorityClass, ClusterRole, ClusterRoleBinding 등
```bash
kubectl api-resources --namespaced=false
```

## 실습
```bash
kubectl api-resources
```
![Screenshot-2022-12-19-at-10.46.03-PM.png](/img/이미지 창고/Screenshot-2022-12-19-at-10.46.03-PM.png)

```bash
kubectl api-resources --namespaced=false
```
![Screenshot-2022-12-19-at-10.47.11-PM.png](/img/이미지 창고/Screenshot-2022-12-19-at-10.47.11-PM.png)
- 위의 결과는 Cluster 내에서 관리되는 API Resource라고 보면 된다.

## 클러스터 기본 네임스페이스
- 쿠버네티스 클러스터를 생성하고나면 기본적으로 만들어져 있는 네임스페이스

### default
- NameSpace를 지정하지 않은 경우에 기본적으로 할당되는 NameSpace

### kube-system
- Kubernetes 시스템에 의해 생성되는 API 오브젝트들을 관리하기 위한 NameSpace

### kube-public
- 클러스터 내 모든 사용자로부터 접근 가능하고 읽을 수 있는 오브젝트들을 관리하기 위한 NameSpace

### kube-node-lease
- 쿠버네티스 클러스터 내 노드의 연결 정보를 관리하기 위한 NameSpace

## 다른 NameSpace 서비스 접근하기
> 서로 다른 서비스(Service)가 통신하기 위해서는 서비스명으로 충분하지 않습니다.
>  => NameSpace가 다르지만 서비스명이 동일하다면?

###  FQDN(Fully Qualified Domain Name)과 Domain Search 옵션
```bash
curl ${service}.${namespace}.svc.cluster.local #FQDN
curl ${service}.${namespace}.svc
curl ${service}.${namespace}
curl ${service} # 동일한 네임스페이스 내 서비스 접근시 사용
```

## 실습
`fastcampus-devops/3-docker-kubernetes/12-k8s-namespace`
### discovery
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello
spec:
  replicas: 2
  selector:
    matchLabels:
      app: hello
  template:
    metadata:
      name: hello
      labels:
        app: hello
    spec:
      containers:
      - name: nginx
        image: nginxdemos/hello:plain-text
        ports:
        - name: http
          containerPort: 80
          protocol: TCP
```
`deployment.yaml`
```yaml
apiVersion: v1
kind: Service
metadata:
  name: hello
  labels:
    app: hello
spec:
  type: ClusterIP
  ports:
  - name: http
    protocol: TCP
    port: 8080
    targetPort: 80
  selector:
    app: hello
```
`service.yaml`
```bash
#!/usr/bin/env sh

kubectl create namespace a
kubectl create namespace b
kubectl apply -f . -n a
kubectl apply -f . -n b
```
`create.sh`
![Screenshot-2022-12-19-at-11.01.21-PM.png](/img/이미지 창고/Screenshot-2022-12-19-at-11.01.21-PM.png)
```bash
# a 네임스페이스 확인
kubectl get all -n a
# b 네임스페이스 확인
kubectl get all -n b
```
![Screenshot-2022-12-19-at-11.03.11-PM.png](/img/이미지 창고/Screenshot-2022-12-19-at-11.03.11-PM.png)
```bash
kubectl exec -it test sh
```

## ResourceQuota와 LimitRange
> NameSpace 단위의 자원 사용량 관리할 수 있는 기능 제공

### ResourceQuota
- NameSpace에서 사용할 수 있는 자원 사용량의 합의 제한
	- 할당할 수 있는 자원(CPU, Memory, Volume 등)의 총합 제한
	- 생성할 수 있는 리소스(Pod, Service, Deployment 등)의 개수 제한

### LimitRange
- 파드 혹은 컨테이너에 대하여 자원 <mark>기본 할당량 설정</mark>, 혹은 <mark>최대 / 최소 할당량</mark> 설정

## 실습
### extra
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: fastcampus
```
`namespace.yaml`

```yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: limit-range
  namespace: fastcampus
spec:
  limits:
  - type: Container
    default:
      memory: 128Mi
      cpu: 100m
    defaultRequest:
      memory: 64Mi
      cpu: 50m
    max:
      memory: 1Gi
      cpu: 1000m
    min:
      memory: 16Mi
      cpu: 10m
  - type: Pod
  - type: PersistentVolumeClaim
    min:
      storage: 100Mi
    max:
      storage: 1Gi
```
`limit-range.yaml`

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: object-count-quota
  namespace: fastcampus
spec:
  hard:
    limits.cpu: "5000m"
    limits.memory: "8Gi"
    count/pods: 10
    count/replicationcontrollers: 10
    count/replicasets.apps: 10
    count/deployments.apps: 10
    count/statefulsets.apps: 10
    count/jobs.batch: 3
    count/cronjobs.batch: 3
    count/services: 5
    count/services.nodeports: 0
    count/services.loadbalancers: 0
    count/configmaps: 10
    count/secrets: 10
    count/persistentvolumeclaims: 5
    count/resourcequotas: 3
```
`resource-quota.yaml`

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test
  namespace: fastcampus
spec:
  containers:
  - name: nginx
    image: nginxdemos/hello:plain-text
    ports:
    - name: http
      containerPort: 80
      protocol: TCP
```
`pod.yaml`

```bash
kubectl apply -f namespace.yaml
kubectl apply -f limit-range.yaml
kubectl apply -f resource-quota.yaml
kubectl describe ns fastcampus
```

![Screenshot-2022-12-19-at-11.16.16-PM.png](/img/이미지 창고/Screenshot-2022-12-19-at-11.16.16-PM.png)
```bash
kubectl apply -f pod.yaml
kubectl describe pod test -n fastcampus
```
![Screenshot-2022-12-19-at-11.18.47-PM.png](/img/이미지 창고/Screenshot-2022-12-19-at-11.18.47-PM.png)

---

#Container #Kubernetes #KubernetesAPI

---