- [Affinity - 파드의 배치 전략](#Affinity - 파드의 배치 전략)
	- [nodeAffinity을 이용한 배치](#Affinity - 파드의 배치 전략#nodeAffinity을 이용한 배치)
		- [실습](#nodeAffinity을 이용한 배치#실습)
			- [node-affinity](#실습#node-affinity)
	- [podAffinity을 이용한 배치](#Affinity - 파드의 배치 전략#podAffinity을 이용한 배치)
		- [Topology Key(토폴로지 키)](#podAffinity을 이용한 배치#Topology Key(토폴로지 키))
		- [실습](#podAffinity을 이용한 배치#실습)
			- [pod-affinity](#실습#pod-affinity)
	- [podAntiAffinity을 이용한 배치](#Affinity - 파드의 배치 전략#podAntiAffinity을 이용한 배치)
		- [Topology Key(토폴로지 키)](#podAntiAffinity을 이용한 배치#Topology Key(토폴로지 키))
		- [실습](#podAntiAffinity을 이용한 배치#실습)
			- [pod-anti-affinity](#실습#pod-anti-affinity)

---

# Affinity - 파드의 배치 전략
`/fastcampus-devops/3-docker-kubernetes/16-k8s-selector`

## nodeAffinity을 이용한 배치
- 선호하는 노드를 설정하는 벙법으로 nodeSelector보다 확장된 Label Selector 기능 지원
	- matchExpressions 사용 가능(In, NotIn, Exists, DoesNotExist, Gt, Lt 등)
![Pasted-image-20221220160003.png](/img/이미지 창고/Pasted-image-20221220160003.png)
여러 유즈케이스에 활용가능한 다양한 옵션 제공
- **반드시 충족해야하는 조건(Hard)**
	- **required**DuringScheduling**Ignored**DuringExecution
- **선호하는 조건(Soft)**
	- **preferred**DuringScheduling**Ignored**DuringExecution
<span style={{color: 'red'}}>IgnoredDuringExecution => 실행중인 워크로드에 대해서는 해당 규칙을 무시한다.</span>

### 실습
#### node-affinity
![Pasted-image-20221220161200.png](/img/이미지 창고/Pasted-image-20221220161200.png)
- preffered.yaml -> soft
- required.yaml -> hard

```bash
#!/usr/bin/env sh

kubectl label node minikube --overwrite team=green
kubectl label node minikube-m02 --overwrite team=red
kubectl label node minikube-m03 --overwrite team=blue
```
`set-node-labels.sh`

## podAffinity을 이용한 배치

- 선호하는 파드를 설정하는 방법으로, 사용법은 nodeAffinity와 거의 동일
![Pasted-image-20221220162425.png](/img/이미지 창고/Pasted-image-20221220162425.png)
여러 유즈케이스에 활용가능한 다양한 옵션 제공
- **반드시 충족해야하는 조건(Hard)**
	- **required**DuringScheduling**Ingnored**DuiringExecution
- **선호하는 조건(Soft)**
	- **preferred**DuringScheduling**Ignored**DuringExecution

### Topology Key(토폴로지 키)
- Label Selector를 수행할 노드의 범위 결정
- 노드 단위 : kuberntes.io/hostname
- 존 단위 : topology.kubernetes.io/zone
- 리전 단위 : topology.kubernetes.io/region

### 실습
#### pod-affinity
![Pasted-image-20221220163046.png](/img/이미지 창고/Pasted-image-20221220163046.png)
```bash
#!/usr/bin/env sh

kubectl label node minikube --overwrite team=green
kubectl label node minikube-m02 --overwrite team=red
kubectl label node minikube-m03 --overwrite team=blue
```
`set-node-labels.sh`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql
spec:
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      name: mysql
      labels:
        app: mysql
    spec:
      containers:
      - name: mysql
        image: mysql:5.7
        env:
        - name: MYSQL_ROOT_PASSWORD
          value: fastcampus
        - name: MYSQL_DATABASE
          value: devops
        ports:
        - name: http
          containerPort: 3306
          protocol: TCP
```
`mysql.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pod-affinity-required
spec:
  replicas: 3
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
      affinity:
        podAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - mysql
            topologyKey: kubernetes.io/hostname
            # topologyKey: topology.kubernetes.io/zone
            # topologyKey: topology.kubernetes.io/region
```
`required.yaml`
![Pasted-image-20221220163728.png](/img/이미지 창고/Pasted-image-20221220163728.png)
위와 같이 mysql과 같은 node에 띄워진 것을 알 수 있다.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pod-affinity-preferred
spec:
  replicas: 4
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
      affinity:
        podAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchExpressions:
                - key: app
                  operator: In
                  values:
                  - mysql
              topologyKey: kubernetes.io/hostname
              # topologyKey: topology.kubernetes.io/zone
              # topologyKey: topology.kubernetes.io/region
```
`preferred.yaml`
위의 yaml파일 또한 실행했을 때 같은 node에 생성됨을 알 수 있습니다.
![Pasted-image-20221220163836.png](/img/이미지 창고/Pasted-image-20221220163836.png)

## podAntiAffinity을 이용한 배치

- 선호하지 않는 파드를 설정하는 방법으로, podAffinity를 podAntiAffinity로만 <mark>변경하면 사용법 동일</mark>
![Pasted-image-20221220164027.png](/img/이미지 창고/Pasted-image-20221220164027.png)
여러 유즈케이스에 활용 가능한 다양한 옵션 제공

- **반드시 충족해야하는 조건(Hard)**
	- **required**DuringScheduling**Ingnored**DuiringExecution
- **선호하는 조건(Soft)**
	- **preferred**DuringScheduling**Ignored**DuringExecution

### Topology Key(토폴로지 키)
- Label Selector를 수행할 노드의 범위 결정
- 노드 단위 : kuberntes.io/hostname
- 존 단위 : topology.kubernetes.io/zone
- 리전 단위 : topology.kubernetes.io/region

### 실습
#### pod-anti-affinity
![Pasted-image-20221220164233.png](/img/이미지 창고/Pasted-image-20221220164233.png)

```bash
#!/usr/bin/env sh

kubectl label node minikube --overwrite team=green
kubectl label node minikube-m02 --overwrite team=red
kubectl label node minikube-m03 --overwrite team=blue
```
`set-node-labels.sh`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql
spec:
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      name: mysql
      labels:
        app: mysql
    spec:
      containers:
      - name: mysql
        image: mysql:5.7
        env:
        - name: MYSQL_ROOT_PASSWORD
          value: fastcampus
        - name: MYSQL_DATABASE
          value: devops
        ports:
        - name: http
          containerPort: 3306
          protocol: TCP
```
`mysql.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pod-anti-affinity-required
spec:
  replicas: 3
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
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - mysql
            topologyKey: kubernetes.io/hostname
            # topologyKey: topology.kubernetes.io/zone
            # topologyKey: topology.kubernetes.io/region
```
`required.yaml`

![Pasted-image-20221220164457.png](/img/이미지 창고/Pasted-image-20221220164457.png)
위의 mysql이 생성된 node와는 다른 node에서 pod가 생성됨을 알 수 있다.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pod-anti-affinity-preferred
spec:
  replicas: 4
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
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchExpressions:
                - key: app
                  operator: In
                  values:
                  - mysql
              topologyKey: kubernetes.io/hostname
              # topologyKey: topology.kubernetes.io/zone
              # topologyKey: topology.kubernetes.io/region
```
`preferred.yaml`

---

#Container #Kubernetes #KubernetesAPI

---