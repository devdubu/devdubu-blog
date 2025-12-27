---
slug: "Kubernetes-기초-및-셋팅"
---

- [Kubernetes](#Kubernetes)
- [컨테이너 오케스트레이션 시스템이란?](#컨테이너 오케스트레이션 시스템이란?)
	- [운영체제](#컨테이너 오케스트레이션 시스템이란?#운영체제)
	- [컨테이너 오케스트레이션 시스템](#컨테이너 오케스트레이션 시스템이란?#컨테이너 오케스트레이션 시스템)
- [Why Kubernetes?](#Why Kubernetes?)
	- [Plant Scale](#Why Kubernetes?#Plant Scale)
	- [Never Outgrow](#Why Kubernetes?#Never Outgrow)
	- [Run Anywhere](#Why Kubernetes?#Run Anywhere)
- [Kubernetes를 이용한 컨테이너 오케스트레이션](#Kubernetes를 이용한 컨테이너 오케스트레이션)
	- [Kubernetes의 다양한 배포판](#Kubernetes를 이용한 컨테이너 오케스트레이션#Kubernetes의 다양한 배포판)
		- [Local 설치형 Kubernetes - Test용](#Kubernetes의 다양한 배포판#Local 설치형 Kubernetes - Test용)
		- [운영용 Kubernetes 배포판](#Kubernetes의 다양한 배포판#운영용 Kubernetes 배포판)
	- [Kubernetes 버전 선택](#Kubernetes를 이용한 컨테이너 오케스트레이션#Kubernetes 버전 선택)
		- [운영환경에서 Kubernetes를 관리한다면](#Kubernetes 버전 선택#운영환경에서 Kubernetes를 관리한다면)
	- [클러스터 구성](#Kubernetes를 이용한 컨테이너 오케스트레이션#클러스터 구성)
		- [Control Plane(Master Node)](#클러스터 구성#Control Plane(Master Node))
		- [Node(Worker Node)](#클러스터 구성#Node(Worker Node))
	- [Control Plane(Master Node)](#Kubernetes를 이용한 컨테이너 오케스트레이션#Control Plane(Master Node))
		- [API Server](#Control Plane(Master Node)#API Server)
		- [etcd](#Control Plane(Master Node)#etcd)
		- [Schedular](#Control Plane(Master Node)#Schedular)
		- [Controller Manager](#Control Plane(Master Node)#Controller Manager)
		- [Kubelet](#Control Plane(Master Node)#Kubelet)
		- [CRI(Container Runtime Interface)](#Control Plane(Master Node)#CRI(Container Runtime Interface))
		- [kube-proxy](#Control Plane(Master Node)#kube-proxy)
- [API 리소스와 오브젝트](#API 리소스와 오브젝트)
	- [API 리소스](#API 리소스와 오브젝트#API 리소스)
	- [오브젝트(Object)](#API 리소스와 오브젝트#오브젝트(Object))
		- [현재 쿠버네티스 클러스터가 지원하는 API 리소스 목록 출력](#오브젝트(Object)#현재 쿠버네티스 클러스터가 지원하는 API 리소스 목록 출력)
		- [특정 API 리소스에 대해 간단한 설명 확인](#오브젝트(Object)#특정 API 리소스에 대해 간단한 설명 확인)
- [Minikube 명령어](#Minikube 명령어)
- [kubectl 명령어](#kubectl 명령어)
- [매니페스트 파일](#매니페스트 파일)
		- [apiVersion](#오브젝트(Object)#apiVersion)
		- [kind](#오브젝트(Object)#kind)
		- [metadata](#오브젝트(Object)#metadata)
		- [spec](#오브젝트(Object)#spec)
		- [Labels](#오브젝트(Object)#Labels)
		- [Annotations](#오브젝트(Object)#Annotations)
- [Kubectl 사용](#Kubectl 사용)
	- [명령형 VS 선언형](#Kubectl 사용#명령형 VS 선언형)
		- [명령형(Imperative)](#명령형 VS 선언형#명령형(Imperative))
		- [kubectl 명령형 명령어](#명령형 VS 선언형#kubectl 명령형 명령어)
		- [선언형(Declarative) - 최신의 트랜드](#명령형 VS 선언형#선언형(Declarative) - 최신의 트랜드)
		- [kubectl 선언형 명령어](#명령형 VS 선언형#kubectl 선언형 명령어)
	- [실습](#Kubectl 사용#실습)
		- [명령형(Imperative)](#실습#명령형(Imperative))
		- [선언형(Declarative)](#실습#선언형(Declarative))
- [Pod](#Pod)
	- [Pod란?](#Pod#Pod란?)
	- [파드 관련 kubectl 명령어](#Pod#파드 관련 kubectl 명령어)
	- [실습](#Pod#실습)
	- [멀티 컨테이너 파드와 사이드카 패턴](#Pod#멀티 컨테이너 파드와 사이드카 패턴)
		- [사이드카 패턴(Side-car Pattern)](#멀티 컨테이너 파드와 사이드카 패턴#사이드카 패턴(Side-car Pattern))
- [ReplicaSet](#ReplicaSet)
	- [레플리카셋이란?](#ReplicaSet#레플리카셋이란?)
	- [레플리카셋의 동작 원리](#ReplicaSet#레플리카셋의 동작 원리)
	- [레이블 셀렉터(Label Selector)](#ReplicaSet#레이블 셀렉터(Label Selector))
	- [실습](#ReplicaSet#실습)

---

# Kubernetes

![Untitled.png](/img/이미지 창고/Untitled.png)
# 컨테이너 오케스트레이션 시스템이란?

컨테이너의 배포, 관리, 확장, 네트워킹을 자동화 하는 기술

![Untitled-1.png](/img/이미지 창고/Untitled-1.png)

예를 들면

## 운영체제

→ 하나의 머신에서 프로세스를 효율적으로 관리하기 위한 프로세스 오케스트르레이션 시스템

## 컨테이너 오케스트레이션 시스템

→ 여러 머신으로 구성된 클러스터 상에서 컨테이너를 효율적으로 관리하기 위한 시스템

# Why Kubernetes?

## Plant Scale

- 구글에서 수 십억 개의 컨테이너를 운영할 수 있게 한 원칙 유지
- 행성 규모로 확장 할 수 있는 스케일

## Never Outgrow

- 다양한 요구사항을 만족할 수 있는 유연함
- 테스트용 로컬 규모부터 글로벌 서비스 규모까지 유연하게 크기 조정 가능
- 필요한 기능이 없을 경우 CRD를 통한 기능 확장

## Run Anywhere

- 온프레미스/퍼블릭 클라우드/하이브리드 환경 어디서나 동작
- 대부분의 리눅스 환경에서 동작하기 때문에 환경 이동에 제약이 없음

# Kubernetes를 이용한 컨테이너 오케스트레이션

## Kubernetes의 다양한 배포판

![Untitled-2.png](/img/이미지 창고/Untitled-2.png)

위에 나와있는 배포판에는 로컬에서 테스트를 하기 위해서 사용하는 것과, 운영을 위해서 사용하는 배포 판이 있습니다.

### Local 설치형 Kubernetes - Test용

![Untitled-3.png](/img/이미지 창고/Untitled-3.png)

→ 2021/5월 자료 기준

단일 노드에 빠르게 쿠버네티스 구성 및 테스트 가능

일부 기능 제한

- 클라우드 플랫폼에서만 사용 가능한 기능
    - ALB, NLB, EBS in AWS
- 여러 노트 환경에서 사용 가능한 리소스
    - DaewmonSet, Affinity / Taint / Toleration

### 운영용 Kubernetes 배포판

![Untitled-4.png](/img/이미지 창고/Untitled-4.png)

## Kubernetes 버전 선택

![Untitled-5.png](/img/이미지 창고/Untitled-5.png)

### 운영환경에서 Kubernetes를 관리한다면

- Major 버전의 업데이트의 ChangeLog와 Breacking Changes를 꼼꼼히 검토
- API Resouces Deprecation Schedule 검토

→ 버전에 따라서 지원하는 기능 및 API 리소스 스펙 차이가 있을 수 있으니 주의 해야함

—> 지원 하는데에 약간의 유예 기간을 준다. 

## 클러스터 구성

![Untitled-6.png](/img/이미지 창고/Untitled-6.png)

### Control Plane(Master Node)

- 클러스터를 관리하는 역할 담당
- 상태 관리 및 명령어 처리

### Node(Worker Node)

- 어플리케이션 컨테이너 실행

## Control Plane(Master Node)

![Untitled-7.png](/img/이미지 창고/Untitled-7.png)

### API Server

- 쿠버네티스 리소스와 클러스터 관리를 위한 API 제공
- etcd를 데이터 저장소로 사용한다.
    - 왼쪽의 그림처럼 따로 떨어져 있는 경우는 거의 드물다.
    - 보통은 MasterNode에 내장되어있는 경우가 etc많다.

### etcd

- 데이터를 안전하게 저장하기 위한 저장소이다.
- 분산 Key-Value 저장소로 클러스터 상태 저장
- 백업 및 복구를 etcd 저장소를 하게 된다면, 클러스터 상태를 복구하는 것이 가능하다.

### Schedular

- Node의 자원 사용 상태를 관리하며, 새로운 워크로드를 어디에 배포할지 관리

### Controller Manager

- 여러 컨트롤러 프로세스를 관리
- 각 컨트롤러는 클러스터부터 특정 리소스 상태의 변화를 감지하여 클러스터에 반영하는 reconcile 과정을 반복 수행
- etcd에 현재의 클러스터의 상태에 대한 정보를 반영하게 되면, 각각의 컨트롤러가 Pod에게 해당 상태를 반영하게끔 변경해주는 것이 Controller의 역할이다.

![Untitled-8.png](/img/이미지 창고/Untitled-8.png)

### Kubelet

- 컨테이너 런타임(Container Runtime)과 통신하며 컨테이너 라이프 사이클 관리
- API 서버와 통신하며 노드의 리소스 관리

### CRI(Container Runtime Interface)

- Kubernetes는 Container가 아니기 때문에 Container를 제어할 무언가가 필요함
- kubelet이 컨테이너 런타임과 통신할 때 사용되는 인터페이스
- kubernetes는 Docker, containerd, cri-o 컨테이너 런타임 지원

### kube-proxy

- 오버레이 네트워크 구성
- 네트워크 프록시 및 내부 로드 밸런서 역할 수행

# API 리소스와 오브젝트
![Untitled-9.png](/img/이미지 창고/Untitled-9.png)

## API 리소스

- 쿠버네티스가 관리할 수 있는 오브젝트의 종류
- Pod, Service, ConfigMap, Secret
- Node, ServiceAccount, Role

## 오브젝트(Object)

- API 리소스를 인스턴스 화 한 것

### 현재 쿠버네티스 클러스터가 지원하는 API 리소스 목록 출력

```bash
kubectl api-resources
```

### 특정 API 리소스에 대해 간단한 설명 확인

```bash
kubectl explain pod
```

# Minikube 명령어

```bash
# minikube 시작
minikube start
# minikube의 상태 확인
minikube status
```

# kubectl 명령어

```bash
# kubernetes의 node를 출력함
kubectl get node

# 현재 namespace에 kubernetes의 pod 출력
kubectl get pod

# 모든 namespace의 kubernetes의 pod을 출력
kubectl get pod --all-namespaces

# 현재 쿠버네티스 클러스터가 지원하는 API 리소스 목록 출력
kubectl api-resources

# pod에 대한 설명을 간략하게 해준다.
kubectl explain pod
# configmap에 대한 설명을 간략하게 해준다.
kubectl explain configmap
# service에 대한 설명을 간략하게 해준다.
kuberctl explain service
```

![Untitled-10.png](/img/이미지 창고/Untitled-10.png)

SHORTNAMES : 축약어

# 매니페스트 파일

**쿠버네티스는 오브젝트를 YAML 기반 매니페스트 파일로 관리**

![Untitled-11.png](/img/이미지 창고/Untitled-11.png)

### apiVersion

### kind

### metadata

### spec

---

### Labels

### Annotations

- 오브젝트가 어떤 API 그룹에 속하고 API 버전이 몇인가?

- 오브젝트가 어떤 API 리소스인가?

- 오브젝트를 식별하기 위한 정보(이름, 네임스페이스, 레이블 등)?

- 오브젝트가 가지고자 하는 데이터는?

 

---

- 오브젝트를 식별하기 위한 목적
- 검색 / 분류 / 필터링 등의 목적으로 사용
- 쿠버네티스 내부 여러 기능에서 Label Selector 기능 제공

- 식별이 아닌 다른 목적으로 사용
- 보통 쿠버네티스의 애드온이 해당 오브젝트를 어떻게 처리할지 결정하기 위한 설정 용도로 사용

      → API 리소스에 따라 spec 대신 data, rules, subjects 등 다른 속성 사용

# Kubectl 사용

## 명령형 VS 선언형

### 명령형(Imperative)

- 수행하고자 하는 액션을 지시
- 적은 리소스에 대해서 빠르게 처리 가능
- 여러 명령어를 알아야 함

### kubectl 명령형 명령어

```bash
# ubuntu:focal 이미지로 ubuntu 파드 생성(bash 명령어)
kubectl run -i -t ubuntu --image=ubuntu:focal bash

# grafana Deployment 오브젝트에 대해 NodePort 타입의 Service 오브젝트 생성(노드에 포트 개방)
kubectl expose deployment grafana --type=NodePort --port=80 --target-port=3000

# frontend Deployment의 www 컨테이너 이미지를 image:v2로 변경
kubectl set image deployment/frontend www=image:v2

# frontend Deployment를 리비전 2로 롤백
kubectl rollout undo deployment/frontend --to-revision=2
```

### 선언형(Declarative) - 최신의 트랜드

- 도달하고자 하는 상태(Desired State)를 선언
- 코드로 관리 가능 → GitOps 활용 가능
    - 변경 사항에 대한 감사(Audit) 용이
    - 코드 리뷰를 통한 협업
- 멱등성 보장(apply)
- 많은 리소스에 대해서도 매니페스트 관리 방법에 따라 빠르게 처리 가능
- 알아야할 명령어 수가 적음

### kubectl 선언형 명령어

```bash
# deployment.yaml에 정의된 쿠버네티스 오브젝트 클러스터에 반영
kubectl apply -f deployment.yaml

# deployment.yaml에 정의된 쿠버네티스 오브젝트 제거
kubectl delete -f deployment.yaml

# 현재 디렉토리의 kustomization.yaml 파일을 쿠버네티스 오브젝트 클러스터에 반영
kubectl apply -k ./
```

![Untitled-12.png](/img/이미지 창고/Untitled-12.png)

## 실습

![Untitled-13.png](/img/이미지 창고/Untitled-13.png)

`declarative.sh`, `[imperative.sh](http://imperative.sh)` 를 통해서 명령어를 미리 작성해 놓았다.

### 명령형(Imperative)

```bash
#!/usr/bin/env sh

kubectl create deployment grafana --image=grafana/grafana --port=3000
kubectl expose deployment grafana --type=NodePort --port=80 --target-port=3000

# Print grafana service url
minikube service grafana
```

![Untitled-14.png](/img/이미지 창고/Untitled-14.png)

![Untitled-15.png](/img/이미지 창고/Untitled-15.png)

```bash
#!/usr/bin/env sh

kubectl delete -f deployment.yaml
kubectl delete -f service.yaml
```

### 선언형(Declarative)

```bash
#!/usr/bin/env sh

kubectl apply -f deployment.yaml
kubectl apply -f service.yaml

# Print grafana service url
minikube service grafana
```

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: grafana
  labels:
    app: "grafana"
spec:
  replicas: 1
  selector:
    matchLabels:
      app: "grafana"
  template:
    metadata:
      labels:
        app: "grafana"
    spec:
      containers:
      - name: grafana
        image: grafana/grafana:latest
        ports:
        - name: http
          containerPort: 3000
```

```yaml
apiVersion: v1
kind: Service
metadata:
  name: grafana
  labels:
    app: "grafana"
spec:
  type: NodePort
  ports:
  - name: http
    protocol: TCP
    port: 80
    targetPort: 3000
  selector:
    app: "grafana"
```

![Untitled-16.png](/img/이미지 창고/Untitled-16.png)

# Pod

## Pod란?

- 쿠버네티스가 컨테이너를 다루는 기본 단위
- 1개 이상의 컨테이너로 구성된 컨테이너 집합
- 동일 파드 내 컨테이너는 여러 리눅스 네임스페이스를 공유 ⇒ 네트워크 네임스페이스 공유**(동일 IP 사용)**
- API Resource
    - Statefulset
    - Deplyment
    - Daemonset
    - Job
    - CronJob
    - Replicaset

→ **사용자가 파드를 직접 관리하는 경우는 거의 없음**

![Untitled-17.png](/img/이미지 창고/Untitled-17.png)

## 파드 관련 kubectl 명령어

```bash
# 파드 목록 확인
kubectl get pod

# 특정 파트 상태 확인
kubectl describe pod hello

# 특정 파드에 명령어 전달
kubectl exec -i -t hello bash

# 특정 파드 로그 확인
kubectl logs pod/hello
```

## 실습

```bash
# 해당 파일을 적용하여 pod을 띄운다.
kubectl apply -f [파일명]

# 해당 파일을 적용하여 pod을 삭제한다.
kubectl delete -f [파일명]

kubectl apply -f pod.yaml
kubectl get pod
```

![Untitled-18.png](/img/이미지 창고/Untitled-18.png)

→ 해당 부분에서 READY에서 0/1 중에서 0 → 현재 Ready 가 되는 컨테이너, 1 → 전체 컨테이너를 의미한다. 즉, [현재 ready상태의 컨테이너 수]/[전체 컨테이너 수]

```bash
kubectl get pod -o wide
```

![Untitled-19.png](/img/이미지 창고/Untitled-19.png)
더 많은 정보를 확인 가능함.

위에 적혀져 있는 ip 정보로 접속이 가능하냐에 대한 답은 → 안된다

이유인 즉, kubernetes도 가상화로 현 운영체제 안에서 감싼 상태이므로 외부에서 접근이 불가능하다(위에 있는 IP는 k8s 내에서만 사용하는 IP 대역인 셈이다)

그렇기 때문에 k8s가 만든 가상 환경에 접근을 한다면 접속이 가능한다.

```bash
kubectl ssh
```

접속을 하게 된다면 그 다음으로는 해당 IP로 접속이 가능해진다.

다른 방법은 exec 를 사용하는 방법이다. 이는 docker와 비슷한 명령어로 pod를 접근 할 수 있다.

```bash
# kubectl exec -it [pod이름] sh
kubectl exec -it nginx sh
```

또한 pod의 로그를 보는 방법은 

```bash
# 특정 pod의 로그를 보는 방법
kubectl logs nginx
```

## 멀티 컨테이너 파드와 사이드카 패턴

- 동일 파드 내 컨테이너는 모두 같은 노드에서 실행(네임스페이스를 공유하기 때문)

### 사이드카 패턴(Side-car Pattern)

- 메인 컨테이너를 보조하는 컨테이너와 같이 실행하는 구조
- 주요 usecase
    - Fileveat와 같은 로그 에이전트로 파드 로그 수집
    - Envoy와 같은 프록시 서버로 서비스메시 구성
    - Vault Agent와 같은 기밀 데이터 전달 목적
    - Nginx의 설정 리로드 역할 에이전트 구성

```bash
# 특정 파드 로그 확인
kubectl logs pod/hello -c debug

# 특정 파드에 명령어 전달
kubectl exec -it hello -c debug bash
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: hello
spec:
  containers:
  - name: nginx
    image: nginxdemos/hello:plain-text
    ports:
    - name: http
      containerPort: 80
      protocol: TCP
  - name: debug
    image: posquit0/doraemon:latest
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: hello
spec:
  containers:
  - name: nginx
    image: nginxdemos/hello:plain-text
    ports:
    - name: http
      containerPort: 80
      protocol: TCP
```

![Untitled-20.png](/img/이미지 창고/Untitled-20.png)

```bash
kubectl describe pod hello
```

![Untitled-21.png](/img/이미지 창고/Untitled-21.png)

hello pod에 대해서 자세하게 볼 수가 있다. 위의 정보를 본다면 hello 라는 pod에서는 nginx와 debug라는 container가 생성됐음을 알 수 있다.

```bash
# 아래의 명령어를 하게 된다면, nginx, debug(여러개의 컨테이너가 존재할 때) defualt로 설정되어 있는 container로 커널이 들어가게 됩니다.
kubectl exec -it hello sh

# 만약 한개로 지정하고 싶다면, 아래의 코드를 작성하면 된다.
kubectl exec -it hello sh -c nginx
# 로그를 표시할 때
kubectl logs hello -c debug
```

# ReplicaSet

## 레플리카셋이란?

→ 파드의 숫자를 늘리는 API resource 이다.

- 정해진 수의 파드가 항상 실행 될 수 있도록 관리
- 기존 실행중이던 파드에 문제가 생기면 파드를 다시 스케줄링
- ReplicationController의 신규 버전(현재는 Deprecated)

→ 파드와 마찬가지로 레플리카셋을 직접 관리하는 경우는 거의 없음

![Untitled-22.png](/img/이미지 창고/Untitled-22.png)

## 레플리카셋의 동작 원리

- ReplicaSet Controller가 Control Plane에 존재
- spec.selector에 대응되는 파드의 수가 spec.replicas와 동일한지 지속적으로 검사하고, 다를 경우 스케일 아웃 혹은 인 진행

## 레이블 셀렉터(Label Selector)

- 쿠버네티스 오브젝트는 모두 metadata.labels에 Key-Value 형태의 레이블 값을 가짐
- 특정 오브젝트 목록을 필터링하기 위한 기능이 Label Selector
- matchLabels와 matchExpressions 옵션 제공

**→ 많은 쿠버네티스 API 리소스가 Label Selector을 통해 기능을 제공**

**⇒ 리소스 간 느슨한 결합 유지(Loosely Coupled)**

![Untitled-23.png](/img/이미지 창고/Untitled-23.png)

## 실습

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: hello
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
```

```yaml
kubectl apply -f replicaset.yaml
```

![Untitled-26.png](/img/이미지 창고/Untitled-26.png)

watch 명령어를 사용해서 `replicaset.yaml` 파일의 labelselector가 어떤 식으로 작동이 되는 지를 확인 할 수 있다. 터미널을 하나 더 작동 시켜 확인을 해 본다.

```bash
watch kubectl get pod --show-labels
```

![Untitled-25.png](/img/이미지 창고/Untitled-25.png)

```bash
# replicaset에 대한 정보를 보고 싶다면
kubectl get replicaset

# 특정 pod에 대한 replicaset을 자세히 보고 싶다면
kubectl describe replicaset hello
```

![Untitled-26.png](/img/이미지 창고/Untitled-26.png)

만약의 상황을 가정을 해보도록 하겠습니다.

replicate는 labelSelector를 가지고 구별을 합니다. 이때, 만약 동일한 이름의 label이 미리 떠있고, 그 다음에 replicate를 실행했을 때는 어떤 행동을 취하는지 확인해보려고 합니다.

```bash
apiVersion: v1
kind: Pod
metadata:
  name: dummy
  labels:
    app: hello
spec:
  containers:
  - name: dummy
    image: posquit0/doraemon:latest
```

옆의 코드 처럼 `labels`의 설정은 `app:hello` 입니다.

```bash
# 우선 dummy.yaml을 먼저 실행
kubectl apply -f dummy-pod.yaml
```

![Untitled-27.png](/img/이미지 창고/Untitled-27.png)

```bash
# replicaset.yaml 을 그 다음 실행
kubectl apply -f replicaset.yaml
```

왼쪽의 상황을 보게 된다면 2개의 replicate가 만들어진 것을 확인 할 수 있다.

즉, dummy에 영향을 미친 것이다.

![Untitled-28.png](/img/이미지 창고/Untitled-28.png)

---

#Container #Kubernetes #Kubernetes기초

---
