---
slug: "Node-Selector"
---
- [minikube로 멀티 노드 클러스터 구성](#minikube로 멀티 노드 클러스터 구성)
	- [기본 minikube 클러스터 제거](#minikube로 멀티 노드 클러스터 구성#기본 minikube 클러스터 제거)
	- [노드 3개로 구성된 minikube 클러스터 구성 (docker driver 이용)](#minikube로 멀티 노드 클러스터 구성#노드 3개로 구성된 minikube 클러스터 구성 (docker driver 이용))
		- [결과](#노드 3개로 구성된 minikube 클러스터 구성 (docker driver 이용)#결과)
- [NodeName을 이용한 배치](#NodeName을 이용한 배치)
	- [실습](#NodeName을 이용한 배치#실습)
		- [node-name](#실습#node-name)
- [NodeSelector를 이용한 배치](#NodeSelector를 이용한 배치)
	- [Node Label 관리](#NodeSelector를 이용한 배치#Node Label 관리)
			- [minikube-m02 노드에 team=key Label 추가](#node-name#minikube-m02 노드에 team=key Label 추가)
			- [minikube-m02 노드에 team Label 제거](#node-name#minikube-m02 노드에 team Label 제거)
	- [실습](#NodeSelector를 이용한 배치#실습)
		- [node-selector](#실습#node-selector)

---

# Node Selector

## minikube로 멀티 노드 클러스터 구성

### 기본 minikube 클러스터 제거
```bash
minikube delete
```
<span style={{color: 'red'}}>
 => 싱글 노드로 생성된 minikube 클러스터는 기본적으로 CNI를 설치하지 않아, 재구성하는게 간단합니다.
</span>

### 노드 3개로 구성된 minikube 클러스터 구성 (docker driver 이용)
```bash
minikube start --nodes 3 --driver=docker
```
#### 결과
![Pasted-image-20221220151035.png](/img/이미지 창고/Pasted-image-20221220151035.png)
## NodeName을 이용한 배치
<span style={{color: 'red'}}>=> 매니페스트의 재활용성이 떨어지며, 노드와 강결합되기 때문에 추천되지 않는 방법 </span>
![Pasted-image-20221220145032.png](/img/이미지 창고/Pasted-image-20221220145032.png)
- 노드의 이름 기반으로 파드가 배치될 노드를 결정

### 실습
`/fastcampus-devops/3-docker-kubernetes/16-k8s-selector`
![Pasted-image-20221220145249.png](/img/이미지 창고/Pasted-image-20221220145249.png)
#### node-name
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: node-name
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
      nodeName: minikube
```


## NodeSelector를 이용한 배치

![Pasted-image-20221220151137.png](/img/이미지 창고/Pasted-image-20221220151137.png)
- Node도 Kubernetes API 오브젝트로 관리되기 때문에, Lables을 가지고 있다.
- Node에 설정된 Label을 기반으로 하여 Label Selector 기반 파드 배치 가능

### Node Label 관리
- 노드를 새로 구성할 때 kubelet 옵션을 통해서 기본 Labels 설정도 가능
- kubectl을 통해 노드의 label 관리 가능

##### minikube-m02 노드에 team=key Label 추가
```bash
kubectl label node minikube-m02 team=red
```

##### minikube-m02 노드에 team Label 제거
```bash
kubectl label node minikube-m02 team-
```

### 실습
#### node-selector
```bash
#!/usr/bin/env sh

kubectl label node minikube --overwrite team=green
kubectl label node minikube-m02 --overwrite team=red
kubectl label node minikube-m03 --overwrite team=red
```
`set-node-labels.sh`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: node-selector
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
      nodeSelector:
        team: red
```
`depolyment.yaml`

```bash
sh set-node-labels.sh
kubectl apply -f deployment.yaml
```
![Pasted-image-20221220152421.png](/img/이미지 창고/Pasted-image-20221220152421.png)
![Pasted-image-20221220152457.png](/img/이미지 창고/Pasted-image-20221220152457.png)

---

#Container #Kubernetes #KubernetesAPI

---