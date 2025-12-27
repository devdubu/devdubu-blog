- [MetaData](#MetaData)
	- [실습](#MetaData#실습)
		- [1-resource](#실습#1-resource)
			- [실행](#1-resource#실행)
		- [2-remote](#실습#2-remote)
			- [실행](#2-remote#실행)
		- [metadata](#실습#metadata)

---

# MetaData
`/fastcampus-devops/3-docker-kubernetes/kustomize/`

## 실습
### 1-resource
```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
- deployment.yaml
- service.yaml
```
`kustomization.yaml

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
kustomize build .
```
위 명령어를 하게 된다면, resource에 설정된 파일들을 표준 출력에 맞게 아래와 같이 합쳐준다.

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app: hello
  name: hello
spec:
  ports:
  - name: http
    port: 8080
    protocol: TCP
    targetPort: 80
  selector:
    app: hello
  type: ClusterIP
---
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
      labels:
        app: hello
      name: hello
    spec:
      containers:
      - image: nginxdemos/hello:plain-text
        name: nginx
        ports:
        - containerPort: 80
          name: http
          protocol: TCP
```

#### 실행
kustomize를 적용시키려면, 아래의 명령어를 수행하면 됩니다.
```bash
kustomize build . | kubectl apply -f -
```
![Pasted-image-20221221141034.png](/img/이미지 창고/Pasted-image-20221221141034.png)
성공적으로 적용 된 것을 확인 할 수 있습니다.
```bash
kubectl get all
```
![Pasted-image-20221221141310.png](/img/이미지 창고/Pasted-image-20221221141310.png)

kustomize 삭제시
```bash
kustomize build . | kubectl delete -f -
```

### 2-remote

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
- https://github.com/tedilabs/k8s-repository/observability/grafana/v8.2
```
`kustomization.yaml`
- 위와같이 URL로 Base를 사용할 수 있다.\
- 원격에 있는 매니페스트들로도 kustomize를 할 수 있다.
![Pasted-image-20221221141854.png](/img/이미지 창고/Pasted-image-20221221141854.png)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: grafana
  labels:
    app.kubernetes.io/name: "grafana"
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: "grafana"
  replicas: 1
  template:
    metadata:
      labels:
        app.kubernetes.io/name: "grafana"
    spec:
      serviceAccountName: grafana
      securityContext:
        fsGroup: 472
        supplementalGroups:
        - 0
      containers:
      - name: grafana
        image: grafana/grafana:8.2.2
        imagePullPolicy: IfNotPresent
        resources: {}
          # We usually recommend not to specify default resources and to leave this as a conscious
          # choice for the user. This also increases chances pods run on environments with little
          # resources, such as Minikube. If you do want to specify resources, uncomment the following
          # lines, adjust them as necessary, and remove the curly braces after 'resources:'.
          # requests:
          #   cpu: 250m
          #   memory: 750Mi
          # limits:
          #   cpu: 500m
          #   memory: 1000Mi
        ports:
        - name: http
          protocol: TCP
          containerPort: 3000
        livenessProbe:
          tcpSocket:
            port: http
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 1
          failureThreshold: 3
          successThreshold: 1
        readinessProbe:
          httpGet:
            path: /api/health
            port: http
            scheme: HTTP
          initialDelaySeconds: 10
          periodSeconds: 30
          timeoutSeconds: 2
          failureThreshold: 3
          successThreshold: 1
        volumeMounts:
        - mountPath: /var/lib/grafana
          name: data
      volumes:
      - name: data
        emptyDir: {}
```
`deployment.yaml`

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
- deployment.yaml
- service.yaml
- rbac.yaml

namespace: default
labels:
- pairs:
    app.kubernetes.io/part-of: "grafana"
    app.kubernetes.io/version: "8.2.2"
  includeTemplates: true

images:
- name: "grafana/grafana"
  newTag: "8.2.2"
```
`kustomization.yaml`

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: grafana
  labels:
    app.kubernetes.io/name: "grafana"
```
`rbac.yaml`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: grafana
  labels:
    app.kubernetes.io/name: "grafana"
spec:
  type: ClusterIP
  ports:
  - name: http
    protocol: TCP
    port: 80
    targetPort: http
  selector:
    app.kubernetes.io/name: "grafana"
```
`service.yaml`

#### 실행
```bash
kubectl apply -k .
```
![Pasted-image-20221221142221.png](/img/이미지 창고/Pasted-image-20221221142221.png)
![Pasted-image-20221221142238.png](/img/이미지 창고/Pasted-image-20221221142238.png)

### metadata
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

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
- deployment.yaml
- service.yaml
- 
---------------------
namespace: fastcampus
namePrefix: dev-
nameSuffix: -devops
---------------------

commonLabels:
  department: "devops"
  owner: "claud"
commonAnnotations:
  key1: "val1"
  key2: "val2"
```
`kustomization.yaml`
- 위의 kustomization 파일을 통해서 namespace, namePrefix, nameSuffix를 통해서 각 파일들의 metadata에 속성을 추가한다.

---

#Container #Kubernetes #Kustomize

---