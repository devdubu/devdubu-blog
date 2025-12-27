# Container Orchestration
:::note Container Orchestration?
- DB, Message Service가 만약 컨테이너에 의존한다면?
- 만약 사용자 수가 증가해서 애플리케이션을 확장해야 한다면?
- 트래픽이 감소할 때 어떻게 규모를 줄일까?
:::

- 위 기능을 가능케 하려면, 리소스와 기능 집합이 있는 기본 플랫폼이 필요합니다.
- 플랫폼은 컨테이너 간의 연결을 조정해야 합니다.
- 자동으로 scale up or scale down 
- 컨테이너를 자동으로 배포하고, 관리하는 이 전체의 process는 Container Orchestration

## Kubernetes Advantage
![Pasted-image-20240306112045.png](/img/이미지 창고/Pasted-image-20240306112045.png)

# Kubernetes 용어 정리
## Node
:::question Node?
- kubernetes가 설치된 물리적, 가상의 머신입니다.
- Node는 작업자 머신으로 Kubernetes가 컨테이너를 런칭하는 곳입니다.

:::

![Pasted-image-20240306124256.png](/img/이미지 창고/Pasted-image-20240306124256.png)
- 만약 node가 다운된다면, service가 죽기 때문에, 해당 Node는 하나 이상이 있는게 좋습니다.

## Cluster
![Pasted-image-20240306124446.png](/img/이미지 창고/Pasted-image-20240306124446.png)
클러스터는 여러 개의 노드의 집합 입니다.

## Master Node
![Pasted-image-20240306124826.png](/img/이미지 창고/Pasted-image-20240306124826.png)
Master Node는 Kubernetes가 설치된 도 다른 노드 입니다.
마스터로 구성 됩니다.
Master는 Cluster에서 노드를 살핍니다.
작업자 노드에서 컨테이너의 실제 오케스트레이션을 책임 집니다.


## Components
![Pasted-image-20240306132454.png](/img/이미지 창고/Pasted-image-20240306132454.png)
시스템에 Kubernetes를 설치할 대 다음 구성 용소를 설치하게 됩니다.
API 서버와 기타 서비스 kubelet 서비스 컨테이너 런타임 컨트롤러와 스케쥴러와 API 서버는 Kubernetes의 프론트 엔드 처럼 작동합니다.
사용자, 관리 장치 명령줄 인터페이스 모두 API 서버에 통신해 Kubernetes 클러스터와 상호 작용합니다.
ETCD Store에는 분산되고 신뢰할 수 있는 Key값 저장소로 Kubernetes가 클러스터 관리에 사용되는 모든 데이터를 저장하는 데 사용합니다.
클러스터에 노드가 여럿이고, 마스터도 여럿일 경우 분산 방식으로 클러스터 내의 모든 노드에 관한 정보를 저장합니다.
기타 등등은 클러스터 내에서 잠금을 구현합니다.
마스터 간에 충돌을 없애도록 하기 위해서죠 

스케쥴러는 다중 노드에 걸쳐 작업이나 컨테이너를 배포해야 합니다.
새로 생성된 컨테이너를 찾아 노드에 할당합니다.

Controller는 오케스트레이션을 지휘하는 두뇌입니다.
Node, Container, EndPoint가 다운될 때 이를 인지하고 대응합니다.
그럴 때 Controller가 새로운 컨테이너를 들여올지 결정합니다.

Container Runtime은 컨테이너를 실행하는데 사용되는 기본 소프트웨어 입니다.

## Master vs Worker Nodes
![Pasted-image-20240319143604.png](/img/이미지 창고/Pasted-image-20240319143604.png)
:::question 이런 구성 요소들이 다른 유형의 서버에 어떻게 분산이 될까?

:::

### Worker Node
Worker Node는 컨테이너가 호스팅 되는 곳입니다.
시스템이 Docker Container를 실행하려면, 컨테이너 런타임이 설치돼야 합니다.
:::tip Kubelet
- MasterNode와 상호 작용하는 Agent
- Node의 Health Info를 제공하고 Master가 요청한 작업을 수행합니다.

:::

### Master Server
Master Server는 Kube API 서버를 갖고 있는데 그게 마스터가 되는 겁니다.
:::note ETCD
- 수집된 모든 정보는 Master의 Key Value 저장소에 간다.


:::

## Kubectl
Kube 명령 줄 도구 또는 Kubectl 또는 kube Controller이라고도 합니다.
```shell
kubectl run hello-minikube
```
kubectl 도구는 Kubernetes Cluster 상의 응용 프로그램을 배포하고 관리하는데 사용되죠
클러스터 정보를 얻고 클러스터 내의 다른 노드의 상태를 얻고 다른 많은 것을 관리하기 위해서 입니다.

kubectl 실행 명령은 클러스터에 응용 프로그램을 배포하는데 사용됩니다.
```shell
kubectl cluster-info
```
kubectl 클러스터 정보 명령은 클러스터 정보를 보는데 사용 되고
```shell
kubectl get nodes
```
클러스터의 모든 노드를 열거하는 데 사용됩니다.

---

#Container #Kubernetes 

---