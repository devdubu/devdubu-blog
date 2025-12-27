---
slug: "Kubernetes-Network"
---
- [Kubernetes Services](#Kubernetes Services)
	- [External Traffic](#Kubernetes Services#External Traffic)
		- [SSH 연결 후 Curl](#External Traffic#SSH 연결 후 Curl)
	- [Service Types](#Kubernetes Services#Service Types)
		- [NodePort Type](#Service Types#NodePort Type)
		- [Cluster IP](#Service Types#Cluster IP)
		- [Load Balancer](#Service Types#Load Balancer)


Kubernetes에서는 Docker에 할당되는 것과는 다르게, 달리 IP 주소를 Pod에 할당합니다.
![Diagram.svg](/img/이미지 창고/Diagram.svg)
Kubernetes는 각 Pod 마다의 고유의 IP가 존재합니다.

Kubernetes가 처음 설정 됐을 때에 내부에 사설 네트워크 망을 만듭니다.
![Diagram-1.svg](/img/이미지 창고/Diagram-1.svg)
다중 Pod를 배포하게 된다면, 이 Pod들 모두 개별 IP를 가지게 됩니다.
그렇기에, 내부의 IP 주소 만을 이용해서 다른 부분에 엑세스 하는 것은 그리 좋은 선택은 아닙니다.
Pod는 항상 변하기 때문이죠

단일 노드에서는 설명하기 쉽지만, 만약 Multi Node라면?
상황이 달라질 수 있습니다.\

# Kubernetes Services
Kubernetes Service는 애플리케이션의 안팎의 다양한 구성 요소 간의 통신을 가능하게 합니다.
Kubernetes Service는 애플리케이션을 다른 애플리케이션 또는 사용자와 연결하는 데 도움을 줍니다.
가령 응용 프로그램엔 다양한 섹션에서 실행되는 파트 그룹이 있습니다.
![Diagram-2.svg](/img/이미지 창고/Diagram-2.svg)
사용자가 프론트 엔드를 처리하는 그룹과 백엔드 프로세스를 실행하는 다른 그룹 외부 데이터 소스에 연결되는 제 3의 그룹 같은 것입니다.

이런 그룹의 부분들 간의 연결을 가능하게 하는 서비스 입니다.
서비스는 프론트 엔드 응용 프로그램을 엔드 사용자가 사용할 수 있게 하죠

따라서 서비스는 앱 내 마이크로 서비스 간의 느슨한 연결을 가능하게 합니다.
서비스 이용 사례 하나를 보겠습니다.

## External Traffic

아래의 그림을 보면 `10.244.0.0`과 `10.244.0.2`는 서로 통신이 되지만, `192.168.1.2`와는 서로 통신 할 수 없습니다.
연결점이 없기 때문입니다.
### SSH 연결 후 Curl
![Diagram-3.svg](/img/이미지 창고/Diagram-3.svg)
첫 방법으로는 위와 같이 SSH로 접속 한 후에, curl로 `10.244.0.2`로 직접 접근 하는 방법 입니다.
하지만 당연하게도 이는 올바른 방법은 아닙니다.

유저가 바로 `192.168.1.2` 로 접속해서 바로 access가 되려면, `10.244.0.2` 를 연결해주는 매개체가 존재해야 합니다.
여기서 부터 Kubernetes Servicer가 시작 됩니다.
![Diagram-4.svg](/img/이미지 창고/Diagram-4.svg)
Kubernetes Service 오브젝트 입니다.
부품 복제본 세트나 전에 함께 작업했던 배포처럼 말입니다.
:::tip Node Port Service
- 사용 사례 중 하나는 노드 포트에 해당 포트에서 웹 응용 프로그램을 실행하는 포트로 요청하는 것입니다.

:::

## Service Types
### NodePort Type
- 서비스가 노드의 포트에 내부 포트를 액세스 하는 것입니다.
![Diagram-5.svg](/img/이미지 창고/Diagram-5.svg)

![Diagram-8.svg](/img/이미지 창고/Diagram-8.svg)

위 그림을 보게 된다면, 3 개의 포트가 관련이 있습니다.
웹 서버가 실행 중인 포트에서 포트는 80 입니다.

타겟 포트라고도 하는 서비스가 전진하는 곳입니다.
두번째 포트에 대한 요청은 서비스 자체의 포트 입니다.
서비스는 사실 클러스터 내부의 노드의 가상 서버와 같습니다.
고유의 IP 주소가 있는데 그 IP 주소를 서비스의 클러스터 IP라고 부릅니다.

마지막으로 노드에 포트가 있습니다.
외부 웹 서버에 액세스 할때 사용합니다.
노드 포트는 유효 범위에 만 있을 수 있습니다.
기본 설정상 30000 ~ 32767 까지 입니다.

`service-definition.yml`
```yaml
apiVersion: v1
kind: Service
metadata: 
	name: myapp-service
spec:
	type: NodePort
	ports:
		- targetPort: 80
		- port: 80
		- nodePort: 30008
	selector:
		app: myapp
		type: front-end
```
서비스 `spec` 섹션에는 타입과 포트가 있습니다.
`type`은 우리가 만드는 서비스 유형을 가르킵니다.
- 예를 들어, Cluster IP, NodePort, LoadBalancer
Port는 배열 입니다.
Port 섹션 아래에 배열의 첫번째 요소를 나타내는 대시가 있습니다. 
하나의 서비스 내에서 여러 개의 포트 매핑을 가질 수 있습니다.

정의 파일에는 서비스와 포트를 연결하는 것이 없다.
target Port는 언급했지만, Port의 위치는 언급하지 않았습니다.

웹 서비스가 포트 80에서 실행되는 pod가 수백개가 될 수 있습니다.
전에 복제 세트로 했던 것처럼 Kubernetes에서 자주 쓰는 기술입니다.

`label`과 `selector`를 이용해 둘을 연결할 것입니다.
pod는 라벨로 제작된 것입니다.

그 `label` 서비스 정의 파일에 가져와야 합니다.
`spec` 섹션에 `selector` 라는 새로운 속성이 있습니다.
복제본 세트와 배포 정의, 파일에서 선택기 아래에 라벨 리스트를 제공해 Pod를 식별하는 것처럼요
Pod 정의 파일에서 `label`꺼내서 `selector`아래에 둡니다.

완료 된다면, Kube Controller를 이요해 서비스를 생성합니다.
```shell
# 서비스 생성
kubectl create -f service-definition.yml

# Kubernetes 사용 서비스 ls
kubectl get services

# 서비스 획득 명령어
kubectl get svc
```

### Cluster IP
- 이 경우 클러스터 내부에 가상 IP를 만들어 다양한 서비스 간의 통신을 가능하게 합니다.
- 프론트 서버 세트와 백엔드 서버 세트 같은 것을 의미한다.
![Diagram-6.svg](/img/이미지 창고/Diagram-6.svg)

프론트엔드 웹 서버를 실행하는 여러 파트가 있고, 백엔드 서버를 실행하는 다른 파트가 있다.
Redis 같은 키 값 스토어를 실행하는 파트가 있고 SQL 같은 영구적인 DB를 실행하는 파트가 있다.

웹 프론트엔드 서버는 백엔드 서버와 통신해야 하고 백엔드 서버는 DB와 Redis 등과  통신해야 한다.

앱의 이런 서비스나 걔층 간의 연결을 확립하는 올바른 방법은 무엇일까?
Pod는 모두 IP 주소가 정해져 있다.
하지만, IPS는 고정적이지 않다.

![Diagram-9.svg](/img/이미지 창고/Diagram-9.svg)
이런 부품은 언제든 해체 될 수 있고, 새 Pod는 끊임 없이 만들어집니다.
따라서 응용 프로그램 간의 내부 통신에 이런 IP주소에만 의존 할 순 없습니다.

:::question 위 프론트 Pod 중에서 백엔드의 3개의 Pod는 어디로 갈것인가?
- 누가 이런 결정을 내릴 것인가?

:::

K8S 서비스를 통해 포드를 하나로 묶고 하나의 인터페이스를 통해 단체 포드에 접속할 수 있습니다.
해당 서비스에 액세스 하도록 단일 인터페이스를 제공합니다.
![Diagram-10.svg](/img/이미지 창고/Diagram-10.svg)
위 요청은 무작위로 한 Pod에 전달 됩니다.
Redis를 위한 추가 서비스를 생성해 백엔드 Pod가 서비스를 통해 Redis 시스템에 접속할 수 있게 하는 것입니다.

덕분에 K8S에 극세사 기반 응용 프로그램을 쉽고 효과적으로 배포 할 수 있습니다.
각 계층은 필요한대로 확장 또는 이동할 수 있습니다.
다양한 서비스 간의 통신에 영향을 주지 않고 말입니다.

각각의 서비스는 클러스터 내부에서 IP와 그에 할당된 이름을 갖습니다.
그 이름은 다른 경로에 의해 서비스에 엑세스 하는데 사용돼야 합니다.

이런 유형을 Cluster IP 로 알려져 있습니다.
#### 예시 코드
```yaml
apiVersion: v1
kind:Service
metadata:
	name: back-end
spec:
	type: ClusterIP
	ports:
		- targetPort: 80
		- port: 80
	selector:
		app: myapp
		type:back-end
```
- `type`을 지정하지 않아도 Port 아래 ClusterIP라는 형식을 자동으로 추정합니다.
- `targetPort`는 백엔드가 노출되는 포트 입니다.
- `port`는 서비스가 노출하는 포트 입니다.
- 서비스를 포트 모음에 연결하려면 `selector`를 사용해야 합니다.
	- `selector`는 pod 정의 파일에 `label` 항목과 동일하게 적용하면 됩니다.
	- 


### Load Balancer
- 부하 분산기로 지원되는 클라우드 공급자에서 우리 응용 프로그램을 위해 부하 분산기를 프로비전 합니다.
- 좋은 예는 프론트엔드 계층의 다양한 웹 서버에 로드를 배포하는 것입니다.
![Diagram-7.svg](/img/이미지 창고/Diagram-7.svg)
잠시 예를들면 아래의 투표 어플리케이션이 있고, 아래와 같이 Node와 Port가 배치 되어있다.

외부 사용자가 응용 프로그램에 액세스 할 수 있도록 유형 노드 Port 서비스를 만듭니다.
Node Port가 있는 서비스는 Port에서 트래픽을 수신해 각각의 Pod로 트래픽을 라우팅 하는 것을 돕습니다.
![Diagram-11.svg](/img/이미지 창고/Diagram-11.svg)

:::note 위 VotingApp 액세스 주소
- http://192.168.56.70:30035
- http://192.168.56.71:30035
- http://192.168.56.72:30035
- http://192.168.56.73:30035

:::

:::success 위 Result App 액세스 주소
- http://192.168.56.70:31061
- http://192.168.56.71:31061
- http://192.168.56.72:31061
- http://192.168.56.73:31061

:::

Node Port를 통해서 모든 URL 혹은 IP로 퉁 쳐져서 접속이 가능하다.
이 URL을 사용자에게 공유해 응용 프로그램에 액세스 할 수 있습니다.
하지만, 최종 사용자가 원하는 것은 그게 아닙니다.

예를 들면 ABC에 투표하는 하나의 URL이 필요합니다.
이를 위한 한가지 방법은 Load Balancer로 새 VM을 생성해 적당한 부하 분산기를 설치하고 구성하는 것 입니다.
Proxy나 Nginx처럼
![Diagram-12.svg](/img/이미지 창고/Diagram-12.svg)
그런 다음 기본 Node에 Root Trafic을 위한 부하 분산 장치를 구성합니다.
보통은 내부적으로 사용하기 보다는 AWS, GCP 등의 Native Load Balancer를 사용하여 해당 LoadBalancer를 구성합니다.




---

#Container #Kubernetes 