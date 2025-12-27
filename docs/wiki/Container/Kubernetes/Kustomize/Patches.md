- [patches-strategic-merge](#patches-strategic-merge)
	- [실습](#patches-strategic-merge#실습)
		- [base](#실습#base)
		- [prod](#실습#prod)
		- [dev](#실습#dev)
- [patches-json-6902](#patches-json-6902)
	- [실습](#patches-json-6902#실습)
		- [base](#실습#base)
		- [dev](#실습#dev)
		- [prod](#실습#prod)

---

# Pathes
`/fastcampus-devops/3-docker-kubernetes/kustomize/

## patches-strategic-merge

### 실습
![Pasted-image-20221221174632.png](/img/이미지 창고/Pasted-image-20221221174632.png)
- base의 경우에는 base를 기준으로 사용할 것입니다.
- dev, prod의 경우에는 overlay의 개념으로 사용할 것입니다.

#### base
```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
- deployment.yaml
- service.yaml
```
`kustomization.yaml`

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

#### prod
```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
- ../base

namePrefix: prod-

patchesStrategicMerge:
- resources.yaml
```
`kustomization.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello
spec:
  template:
    spec:
      containers:
      - name: nginx
        resources:
          requests:
            cpu: 300m
            memory: 128Mi
```
`resource.yaml`

#### dev

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
- ../base

namePrefix: dev-

patchesStrategicMerge:
- resources.yaml
- service.yaml
```
`kustomization.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello
spec:
  template:
    spec:
      containers:
      - name: nginx
        resources:
          requests:
            cpu: 100m
            memory: 64Mi
```
`resource.yaml`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: hello
spec:
  type: NodePort
```
`service.yaml`

```bash
kustomize build dev
```

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app: hello
  name: dev-hello
spec:
  ports:
  - name: http
    port: 8080
    protocol: TCP
    targetPort: 80
  selector:
    app: hello
  type: NodePort
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: dev-hello
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
        resources:
          requests:
            cpu: 100m
            memory: 64Mi
```
- 위 코드를 보게 된다면, nginx container에 정확한 위치에 해당 resource들이 추가 된 것을 알 수 있습니다.
- 해당 기능이 kustomize의 strategic merge 방법 입니다.
	- target을 찾고, target에 대한 merge 파일을 제공합니다.
- 위의 service에서 NodePort로 되어있는 설정이 위에서도 똑같이 적용 된 것을 알 수 있다.




## patches-json-6902
### 실습
![Pasted-image-20221222105931.png](/img/이미지 창고/Pasted-image-20221222105931.png)

#### base
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
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
- deployment.yaml
- service.yaml
```
`kustomization.yaml`

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

#### dev
```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
- ../base

namePrefix: dev-

patchesJson6902:
- target:
    version: v1
    kind: Deployment
    name: hello
  path: resources.yaml
- target:
    version: v1
    kind: Service
    name: hello
  path: service.yaml
```
`kustomization.yaml`

```yaml
- op: add
  path: /spec/template/spec/containers/0/resources
  value:
    requests:
      cpu: 100m
      memory: 64Mi
```
`resources.yaml`

```yaml
- op: replace
  path: /spec/type
  value: NodePort
```
`service.yaml`

#### prod
```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
- ../base

namePrefix: prod-

patchesJson6902:
- target:
    version: v1
    kind: Deployment
    name: hello
  path: resources.yaml
```
`kustomization.yaml`

```yaml
- op: add
  path: /spec/template/spec/containers/0/resources
  value:
    requests:
      cpu: 200m
      memory: 128Mi
```
`resources.yaml`

- 위 patch와 차이점은 아래는 `patchesJson6902` 를 사용했다는 점입니다.
- strategic-merge와는 다르게 target을 찾아가는 기능이 없기 때문에, 정확히 명시를 해줘야한다.

---

#Container #Kubernetes #Kustomize

---


