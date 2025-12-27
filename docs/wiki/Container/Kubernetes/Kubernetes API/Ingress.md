- [Ingress](#Ingress)
	- [Ingress Controller](#Ingress#Ingress Controller)
		- [대표적인 Ingress Controller](#Ingress Controller#대표적인 Ingress Controller)
		- [Ingress Class](#Ingress Controller#Ingress Class)
		- [Ingress](#Ingress Controller#Ingress)
	- [Nginx Ingress Controller](#Ingress#Nginx Ingress Controller)
	- [AWS Load Balancer Controller](#Ingress#AWS Load Balancer Controller)
	- [실습](#Ingress#실습)
		- [grafana](#실습#grafana)
		- [hello](#실습#hello)
		- [httpd](#실습#httpd)
		- [실행](#실습#실행)
		- [ingress-path.yaml](#실습#ingress-path.yaml)
		- [ingress-host.yaml](#실습#ingress-host.yaml)
		- [ingress-default-backend.yaml](#실습#ingress-default-backend.yaml)

---

# Ingress

> 외부로부터의 요청에 대해서 TLS 설정 관리 및 라우팅 관리는 어떻게?
> [개발공부/개발 공부/Infra/LoadBalancer/L4](개발공부/개발 공부/Infra/LoadBalancer/L4) 레벨이 아닌 [개발공부/개발 공부/Infra/LoadBalancer/L7](개발공부/개발 공부/Infra/LoadBalancer/L7) 레벨에서 외부 요청을 처리하고 싶다면? 

![Pasted-image-20221220105651.png](/img/이미지 창고/Pasted-image-20221220105651.png)
- 외부 요청을 받아 L7(어플리케이션 레이어)에서 어떻게 처리할 것인지를 결정
- 라우팅 기능 수행(Host 단위, Path 단위로 라우팅 가능)
- SSL / TLS  통신 암호화 처리 : 각 연결 호스트에 대한 인증서 적용

## Ingress Controller
> kuberntes cluster는 기본적으로 Ingress API 리소스를 다루는 Ingress Controller를 제공하지 않음
> Ingress API 리소스에 대한 스펙만 제공
> => <mark>사용자가 직접 원하는 Ingress Controller 설치 필요</mark>

### 대표적인 Ingress Controller
- <mark>Nginx Ingress Controller</mark>
- Kong Ingress Controller
- <mark>AWS Load Balancer Controller</mark>
- Google Load Balancer Controller

### Ingress Class
- <mark>하나의 클러스터</mark>에서 여<mark>러 인스레스 컨트롤러</mark>를 <mark>사용</mark>할 수 있도록 하기 위해 만들어진 리소스
**IngressClass = IngressController + Configuration**

### Ingress
- 라우팅 규칙 및 TLS 설정을 정의
- 하나의 Ingress 클래스와 연결

## Nginx Ingress Controller
https://github.com/kubernetes/ingress-nginx/
![Pasted-image-20221220111455.png](/img/이미지 창고/Pasted-image-20221220111455.png)
## AWS Load Balancer Controller
https://github.com/kuberntes-sigs/aws-load-balancer-controller
![Pasted-image-20221220122110.png](/img/이미지 창고/Pasted-image-20221220122110.png)
- AWS에서 관리하는 오픈소스 컨트롤러로 다음의 기능을 제공
	- AWS ALB(Application LoadBalancer) 기반의 Ingress Controller
	- AWS NLB(Network LoadBalancer) 기반의 LoadBalancer 타입 Service

## 실습
`/fastcampus-devops/3-docker-kubernetes/15-k8s-ingress/`
![Pasted-image-20221220122612.png](/img/이미지 창고/Pasted-image-20221220122612.png)
### grafana
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
`deployment.yaml`

```yaml
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

### httpd

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: httpd
  labels:
    app: "httpd"
spec:
  replicas: 1
  selector:
    matchLabels:
      app: "httpd"
  template:
    metadata:
      labels:
        app: "httpd"
    spec:
      containers:
      - name: httpd
        image: httpd:latest
        ports:
        - name: http
          containerPort: 80
```
`deployment.yaml`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: httpd
  labels:
    app: "httpd"
spec:
  type: ClusterIP
  ports:
  - name: http
    protocol: TCP
    port: 80
    targetPort: 80
  selector:
    app: "httpd"
```
`service.yaml`



### 실행
```bash
kubectl apply -f grafana/

kubectl apply -f hello/

kubectl apply -f httpd/

kubectl get all
```

### ingress-path.yaml
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: path
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
  - http:
      paths:
      - path: /hello
        pathType: Prefix
        backend:
          service:
            name: hello
            port:
              name: http
  - http:
      paths:
      - path: /grafana
        pathType: Prefix
        backend:
          service:
            name: grafana
            port:
              name: http
```
- Ingress 리소스를 확인하기 전에 [Ingress 설치](../Ingress-설치.md) 를 진행하면 된다.

```bash
kubectl get ns

kubectl get all -n ingress-nginx

kubectl get ingressclass
```
![Pasted-image-20221220134741.png](/img/이미지 창고/Pasted-image-20221220134741.png)
```bash
# yaml의 형식으로 살펴 볼 수 있다.
kubectl get ingressclass nginx -o yaml
```
```yaml
apiVersion: networking.k8s.io/v1
kind: IngressClass
metadata:
  annotations:
    ingressclass.kubernetes.io/is-default-class: "true"
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"networking.k8s.io/v1","kind":"IngressClass","metadata":{"annotations":{"ingressclass.kubernetes.io/is-default-class":"true"},"labels":{"app.kubernetes.io/component":"controller","app.kubernetes.io/instance":"ingress-nginx","app.kubernetes.io/name":"ingress-nginx"},"name":"nginx"},"spec":{"controller":"k8s.io/ingress-nginx"}}
  creationTimestamp: "2022-12-20T04:43:35Z"
  generation: 1
  labels:
    app.kubernetes.io/component: controller
    app.kubernetes.io/instance: ingress-nginx
    app.kubernetes.io/name: ingress-nginx
  name: nginx
  resourceVersion: "589"
  uid: 6d433d95-55ef-4e89-8221-71ebac508bd2
spec:
  controller: k8s.io/ingress-nginx
```

```bash
kubectl get ingress

kubectl get service -n ingress-nginx
```
![Pasted-image-20221220135648.png](/img/이미지 창고/Pasted-image-20221220135648.png)
```bash
# INTERNAL IP로 NODE IP를 알 수 있습니다.
kubectl get node -o wide
```
![Pasted-image-20221220135822.png](/img/이미지 창고/Pasted-image-20221220135822.png)
```bash
curl http://192.168.49.2:31781
```
![Pasted-image-20221220135901.png](/img/이미지 창고/Pasted-image-20221220135901.png)

### ingress-host.yaml
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: host
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
  - host: hello.fastcampus
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: hello
            port:
              name: http
  - host: grafana.fastcampus
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: grafana
            port:
              name: http
```
- host가 추가 되었고, path는 /로 변경되었음을 확인 할 수 있습니다.
```bash
kubectl apply -f ingress-host.yaml

kubectl get ingress
```
![Pasted-image-20221220140340.png](/img/이미지 창고/Pasted-image-20221220140340.png)
- 해당 url로 아래의 경로로 통신을 보내게 된다면
```bash
curl http://192.168.49.2:31781

# 192.168.49.2:31781 -H "Host: [host명]"
curl http://192.168.49.2:31781 -H "Host: hello.fastcampus"

curl http://192.168.49.2:31781 -H "Host: grafana"
```
![Pasted-image-20221220140613.png](/img/이미지 창고/Pasted-image-20221220140613.png)
![Pasted-image-20221220140630.png](/img/이미지 창고/Pasted-image-20221220140630.png)

### ingress-default-backend.yaml
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: default-backend
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  defaultBackend:
    service:
      name: httpd
      port:
        number: 80
  rules:
  - host: hello.fastcampus
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: hello
            port:
              name: http
  - host: grafana.fastcampus
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: grafana
            port:
              name: http
```
- defaultbackend라는 속성은 및에 있는 rule중아 아무것도 해당 되지 않는다면 보내는 backend입니다.
```bash
kubectl apply -f ingress-default-backend.yaml

kubectl get ingress
curl http://192.168.49.2:31781

curl http://192.168.49.2:31781 -H "Host: hello.fastcampus"
curl http://192.168.49.2:31781 -H "Host: grafana"
curl http://192.168.49.2:31781 -H "Host: adf.fastcampus"
```
![Pasted-image-20221220141431.png](/img/이미지 창고/Pasted-image-20221220141431.png)
- defaultbackend로 전송된 모습

---

#Container #Kubernetes #KubernetesAPI

---