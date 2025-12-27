- [Deployment](#Deployment)
- [Deployment와 ReplicaSet의 차이점](#Deployment와 ReplicaSet의 차이점)
- [실습](#실습)
- [Deployment의 배포 전략](#Deployment의 배포 전략)
	- [재생성(Recreate)](#Deployment의 배포 전략#재생성(Recreate))
	- [롤링 업데이트(Rolling Update)](#Deployment의 배포 전략#롤링 업데이트(Rolling Update))
		- [새 파드 생성 후 기존 파드 삭제 반복](#롤링 업데이트(Rolling Update)#새 파드 생성 후 기존 파드 삭제 반복)
			- [방식](#새 파드 생성 후 기존 파드 삭제 반복#방식)
			- [사용 이유(Pod 10개는 예시)](#새 파드 생성 후 기존 파드 삭제 반복#사용 이유(Pod 10개는 예시))
		- [기존 파드 삭제 후 새 파드 생성 반복](#롤링 업데이트(Rolling Update)#기존 파드 삭제 후 새 파드 생성 반복)
			- [방식](#기존 파드 삭제 후 새 파드 생성 반복#방식)
			- [사용 이유(Pod 10개는 예시)](#기존 파드 삭제 후 새 파드 생성 반복#사용 이유(Pod 10개는 예시))
	- [실습](#Deployment의 배포 전략#실습)
	- [revision 기록 남기기](#Deployment의 배포 전략#revision 기록 남기기)
	- [revision 확인하기](#Deployment의 배포 전략#revision 확인하기)
	- [이전 revision으로 회귀 하기](#Deployment의 배포 전략#이전 revision으로 회귀 하기)
	- [revision 상태 체크](#Deployment의 배포 전략#revision 상태 체크)

---

# Deployment ?
- 서비스 버전이 업데이트되어 파드를 새로운 이미지 파드로 교체해야 한다면?
- 새 버전에 이슈가 발견되어 <mark>롤백</mark>을 진행해야 한다면?
- 어떤 기능을 사용해야 하는가에 대한 대답이 Deployment 입니다.

## Deployment
- 파드의 이미지 버전이 갱신될 때 배포 전략을 설정
- Deployment 오브젝트를 생성하면 대응되는 ReplicaSet과 Pod 자동 생성
- 기본적으로 Recreate 전략과 RollingUpdate 전략 지원
![Pasted-image-20221207111626.png](/img/이미지 창고/Pasted-image-20221207111626.png)
-> 사용자는 특수한 목적이 아니라면 파드와 레플리카셋이 아닌 <mark>Deployment</mark>로 워크 로드를 관리 합니다.

fastcampus에서 아래의 디렉토리 소스코드를 사용합니다.

> `fastcampus-devops/3-docker-kubernetes/8-k8s-deployment`

`deployment.yaml`
```yaml
apiVersion: apps/v1
kind: Deployment
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


## Deployment와 ReplicaSet의 차이점
- 해당 차이점을 알아보기 위해서 아래의 명령어를 실행합니다
```bash 
diff ../7-k8s-replicaset/replicaset.yaml deployment.yaml
```
를 하게 된다면, <mark>kind</mark> 의 종류만 다르고 그 외의 코드는 모두 동일한 것을 알 수 있습니다.

## 실습
해당 상태에서 아래의 명령어를 통해 k8s를 실행한다면
```bash
kubectl apply -f deployment.yaml  
```
그리고 다른 Terminal에서는 `watch` 명령어를 통해서 k8s의 pod 상황을 지켜봅니다.
```bash
watch kubectl get pod --show-labels
```
![Pasted-image-20221207124004.png](/img/이미지 창고/Pasted-image-20221207124004.png)
Deploy 값을 보고 싶다면
```bash
kubectl get deploy
```
![Pasted image 20221207124142.png](Pasted image 20221207124142.png)
```bash
kubectl get rs
```
![Pasted image 20221207124250.png](Pasted image 20221207124250.png)
```bash
kubectl get pod
```
![Pasted image 20221207124332.png](Pasted image 20221207124332.png)


## Deployment의 배포 전략

### 재생성(Recreate)
- 기존의 레플리카셋의 파드를 <mark>모두 종료 후</mark> 새 레플리카셋의 파드를 <mark>새로 생성함</mark>

### 롤링 업데이트(Rolling Update)
- 세부 설정에 따라 기존 레플리카셋에서 새 레플리카셋으로 점진적으로 이동
	- maxSurge : 업데이트 과정에 spec.replicas 수 기준 최대 새로 추가되는 파드 수
	- maxUnavailable : 업데이트 과정에 spec.replicas 수 기준 최대 이용 불가능 파드 수
#### 새 파드 생성 후 기존 파드 삭제 반복
##### 방식
- <mark>새로운 Pod를 먼저 생성</mark> 후에, <mark>기존에 있는 Pod를 삭제</mark>
##### 사용 이유(Pod 10개는 예시)
- 트래픽이 Pod 10개로 버티고 있는 구조에서 유리
- 자원이 Pod 10개로 한정이 되어있는 경우에는 비추
![Pasted-image-20221207124929.png](/img/이미지 창고/Pasted-image-20221207124929.png)
#### 기존 파드 삭제 후 새 파드 생성 반복
##### 방식
- 기존에 있던 <mark>Pod를 삭제 후</mark> <mark>새로운 Pod를 띄우는</mark> 형식
##### 사용 이유(Pod 10개는 예시)
- 자원을 Pod 10개로 한정 되어있을 때 사용하는 것이 유리
- 트래픽이 Pod 10개로 버티고 있는 구조라면 비추
![Pasted-image-20221207124949.png](/img/이미지 창고/Pasted-image-20221207124949.png)

### 실습
`rolling-update.yaml`
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: rolling
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  minReadySeconds: 5
  revisionHistoryLimit: 5
  replicas: 5
  selector:
    matchLabels:
      app: rolling
  template:
    metadata:
      name: rolling
      labels:
        app: rolling
    spec:
      containers:
      - name: nginx
        image: nginxdemos/hello:plain-text
        ports:
        - name: http
          containerPort: 80
          protocol: TCP
```
상단에 Deploy의 기능을 제대로 사용하기 위해서는 `strategy`를 사용해야한다.
즉, `strategy` 전략이 없다면 단순히 recreate 전략처럼 재생성만 해줍니다.
|key|value|뜻|
|--|--|--|
| type | RollingUpdate| 롤링 업데이트 방식을 사용한다. | 
|maxSurge| 1 | 최대 1개의 활성 Pod를 생성한다.|
|maxUnavailable| 0 | 최대 0개의 비활성 Pod를 생성한다.|
|minReadySeconds| 5| 새로운 Pod가 띄워지는 동안 5초 동안 Ready 하는 시간을 가져라|
|revisionHistoryLimit| 5| revision을 몇개 까지 가지고 있을 건지(새로운 Pod가 생성 될 때 마다 revisoin이 생성됨)|
```bash
kubectl rollout history deployment rolling
```
---

위의 명령어는 rolling-deployment의 revision을 확인 할 수 있습니다.
![Pasted-image-20221207133932.png](/img/이미지 창고/Pasted-image-20221207133932.png)

해당 CHANGE-CAUSE는 현재는 보이지 않지만 `--record` 옵션으로 해당 기록을 남길 수 있습니다.
k8s를 종료 후에 다시 키겠습니다.
### revision 기록 남기기
```bash
kubectl delete -f rolling-update.yaml
kubectl apply -f rolling-update.yaml --record
```
deprecated가 됐다고 얘기가 나오지만, 아직은 사용하는 사람들이 두루 있기 때문에 크게 지장이 있진 않지만, 추후에 사라지니 유의하면 되는 부분입니다.

### revision 확인하기
```bash
kubectl rollout history deployment rolling
```
![Pasted-image-20221207134941.png](/img/이미지 창고/Pasted-image-20221207134941.png)
CHANGE-CAUSE에 해당 revision이 만들어질 때 작성하였던 command를 확인 할 수 있습니다.

다른 Pod을 생성해보겠습니다.
```bash
kubectl set image deployment rolling nginx=nginxdemos/hello:latest --record
```
위와 같이 생성하게 된다면, Pod의 수를 맞추기 위해 한개는 disable을  하는 것을 확인 할 수 있습니다.

여기서 revision을 확인한다면
![Pasted image 20221207152235.png](Pasted image 20221207152235.png)
위와 같이 revision이 두개가 된 것을 확인 할 수 있습니다.

### 이전 revision으로 회귀 하기
```bash
kubectl rollout undo deployment rolling --to-revision=1
```

### revision 상태 체크
```bash
kubectl rollout status deployment rolling
```

---

#Container #Kubernetes #KubernetesAPI

---