---
slug: "Replicas-Images"
---
- [grafana](#grafana)
- [hello](#hello)

---

## 실습
`/fastcampus-devops/3-docker-kubernetes/kustomize/4-replicas-and-images`
![Pasted-image-20221221160218.png](/img/이미지 창고/Pasted-image-20221221160218.png)
### grafana

```bash
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
`deployment.yaml`

```bash
apiVersion: v1
kind: Service
metadata:
  name: grafana
  labels:
    app: "grafana"
spec:
  type: ClusterIP
  ports:
  - name: http
    protocol: TCP
    port: 80
    targetPort: 3000
  selector:
    app: "grafana"
```
`service.yaml`

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
- deployment.yaml
- service.yaml

namespace: fastcampus
namePrefix: dev-
nameSuffix: -devops

commonLabels:
  department: "devops"
  owner: "claud"
commonAnnotations:
  key1: "val1"
  key2: "val2"
```
`kustomization.yaml`

### hello

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

namespace: fastcampus
namePrefix: dev-
nameSuffix: -devops

commonLabels:
  department: "devops"
  owner: "claud"
commonAnnotations:
  key1: "val1"
  key2: "val2"
```
`kustomization.yaml`


```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
- grafana/
- hello/

replicas:
- name: grafana
  count: 2
- name: hello
  count: 1

images:
- name: grafana/grafana
  newTag: "8.2.2"
- name: nginxdemos/hello
  newName: nginx
  newTag: "latest"
```
`kustomization.yaml`

- 위의 kustomization 파일에서 replicas를 통해서 최종 replicas의 갯수를 변경할 수 있다.
- 아래의 images를 통해서 2가지 정도를 설정할 수 있습니다.
	- 이미지 레지스트리 위치 변경
	- 이미지 버전 변경
- 상단 kustomization에서 namespace가 fastcampus로 지정되어있기 때문에, 해당 namespace를 만들어야합니다.
```bash
kubectl create namespace fastcampus

kubectl apply -k .
```


---

#Container #Kubernetes #Kustomize

---