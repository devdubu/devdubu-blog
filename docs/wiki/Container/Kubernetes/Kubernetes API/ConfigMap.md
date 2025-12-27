- [ConfigMap ?](#ConfigMap ?)
	- [실습](#ConfigMap ?#실습)
		- [no](#실습#no)
		- [env-from](#실습#env-from)
		- [env-value-from](#실습#env-value-from)
		- [volume](#실습#volume)
- [Kubectl ConfigMap 생성 명령어](#Kubectl ConfigMap 생성 명령어)
	- [my-config 이름의 ConfigMap 생성](#Kubectl ConfigMap 생성 명령어#my-config 이름의 ConfigMap 생성)
	- [my-config 이름의 ConfigMap 생성 - 로컬의 config.yaml 파일을 config.yaml 을 키로 저장](#Kubectl ConfigMap 생성 명령어#my-config 이름의 ConfigMap 생성 - 로컬의 config.yaml 파일을 config.yaml 을 키로 저장)
	- [my-config 이름의 ConfigMap 생성 - 로컬의 config.yaml 파일을 config을 키로 저장](#Kubectl ConfigMap 생성 명령어#my-config 이름의 ConfigMap 생성 - 로컬의 config.yaml 파일을 config을 키로 저장)

---

# ConfigMap ? 

> 어플리케이션의 설정 값을 컨테이너에 주입하고 싶다면?

- 설정 정보를 환경 변수 혹은 볼륨의 형태로 파드에 전달하기 위한 목적으로 사용
- 파드에서 직접 환경 변수를 관리하지 않고 ConfigMap을 분리하여7 목적에 따라 설정 데이터를 다르게 주입 가능
![Pasted-image-20221208151556.png](/img/이미지 창고/Pasted-image-20221208151556.png)
## 실습
`fastcampus-devops/3-docker-kubernetes/10-k8s-configmap`
### no
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
`deployment.yaml`
- 이때 mysql pod로 접속을 해보겠습니다.
```bash
kubectl exec -it deploy/mysql bash

--- 접속  후  ---
echo $MYSQL_ROOT_PASSWORD
mysql -h localhost -u root -p
# 비밀번호 : fastcampus

```
![Pasted-image-20221208152650.png](/img/이미지 창고/Pasted-image-20221208152650.png)
- 위와 같이 devops라는 DB가 잘 반영 된 것을 알 수 있습니다.
### env-from
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mysql-config
data:
  MYSQL_ROOT_PASSWORD: fastcampus
  MYSQL_DATABASE: devops
```
`env-from/configmap.yaml`
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
        envFrom:
        - configMapRef:
            name: mysql-config
```
`env-from/deployment.yaml`
우선 configmap을 먼저 만들고, 그 다음에 deployment를 만듭니다.
```bash
kubectl apply -f configmap.yaml
kubectl apply -f deployment.yaml
```
축약어는 이 곳에서 확인하면 된다 : [Kubernetes 기타 명령어](../Kubernetes-기타-명령어.md)

```bash
# configmap 의 축약어
kubectl get cm
```
![Pasted-image-20221209100840.png](/img/이미지 창고/Pasted-image-20221209100840.png)
```bash
# config의 상세 내용 알아보기
kubectl describe cm mysql-config
```
![Pasted-image-20221209101722.png](/img/이미지 창고/Pasted-image-20221209101722.png)

### env-value-from
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
          valueFrom:
            configMapKeyRef:
              name: mysql-config
              key: MYSQL_ROOT_PASSWORD
```
`env-value-from/deployment.yaml`
- 위의 yaml 처럼 해당 valueFrom을 사용하게 된다면, configmap에 원하는 값만 선정해서 사용할 수 있습니다.

### volume
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
        envFrom:
        - configMapRef:
            name: mysql-config
        volumeMounts:
        - mountPath: /tmp/config
          name: mysql-config
      volumes:
      - name: mysql-config
        configMap:
          name: mysql-config
```
`volume/deployment.yaml`
- container 레벨과 동일한 레벨인 volumes는
	- 해당 Pod가 사용하게 될 Volume을 설정하게 됩니다.
	- 하위 옵션은 해당 볼륨을 사용하게 될 볼륨 드라이버 옵션이다.
	- 해당 Configmap이 마운트 되는 원리는, configmap이 디렉토리로 옮겨지게 되고, 그 후에는 설정 목록이 file의 형태로 옮겨지게 됩니다.
- 위의 deployment를 실행하게 된다면, 아래의 폴더 경로에 해당 설정 파일들이 만들어집니다.

```bash
kubectl exec -it deploy/mysql bash
```
![Pasted-image-20221209110737.png](/img/이미지 창고/Pasted-image-20221209110737.png)

# Kubectl ConfigMap 생성 명령어

## my-config 이름의 ConfigMap 생성
```bash
kubectl create configmap my-config
```

## my-config 이름의 ConfigMap 생성 - 로컬의 config.yaml 파일을 config.yaml 을 키로 저장
```bash
kubectl create configmap my-config --from-file config.yaml
```

## my-config 이름의 ConfigMap 생성 - 로컬의 config.yaml 파일을 config을 키로 저장
```bash
kubectl create configmap my-config --from-file config=config.yaml -dry-run -o yaml
```

---

#Container #Kubernetes #KubernetesAPI

---