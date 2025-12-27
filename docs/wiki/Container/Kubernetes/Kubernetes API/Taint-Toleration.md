---
slug: "Taint-Toleration"
---
- [Taint & Toleration](#Taint & Toleration)
	- [Taint(얼룩)](#Taint & Toleration#Taint(얼룩))
	- [Toleration(용인)](#Taint & Toleration#Toleration(용인))
	- [노드 Taint 관리](#Taint & Toleration#노드 Taint 관리)
		- [Effect](#노드 Taint 관리#Effect)
			- [Taint가 노드에 설정될 시 적용될 효과](#Effect#Taint가 노드에 설정될 시 적용될 효과)
		- [minikube-m02 노드에 role=system:NoSchedule Taint 추가](#노드 Taint 관리#minikube-m02 노드에 role=system:NoSchedule Taint 추가)
		- [minikube-m02 노드에 role:NoSchedule Taint 제거](#노드 Taint 관리#minikube-m02 노드에 role:NoSchedule Taint 제거)
		- [minikube-m02 노드에 role 키를 가진 모든 Taint 제거](#노드 Taint 관리#minikube-m02 노드에 role 키를 가진 모든 Taint 제거)
	- [다양한 Toleration 설정 방법](#Taint & Toleration#다양한 Toleration 설정 방법)
		- [모든 종류의 Taint를 용인](#다양한 Toleration 설정 방법#모든 종류의 Taint를 용인)
		- [키가 role이고 효과가 NoExecute인 모든 Taint 용인](#다양한 Toleration 설정 방법#키가 role이고 효과가 NoExecute인 모든 Taint 용인)
		- [키가 role인 모든 Taint를 용인](#다양한 Toleration 설정 방법#키가 role인 모든 Taint를 용인)
		- [role=system:NoSchedule Taint를 용인](#다양한 Toleration 설정 방법#role=system:NoSchedule Taint를 용인)
		- [실습](#다양한 Toleration 설정 방법#실습)
			- [toleration](#실습#toleration)
			- [filebeat](#실습#filebeat)

---

# Taint & Toleration
![Pasted-image-20221220164838.png](/img/이미지 창고/Pasted-image-20221220164838.png)
## Taint(얼룩)
- <mark>노드에 Taint를 설정</mark>하여 임의의 파드가 할당되는 것을 방지


## Toleration(용인)
- 특정 Taint를 용인할 수 이는 Toleration <mark>설정을 가진 파드</mark>는 해당 노드에 할당 가능

## 노드 Taint 관리
- 노드를 새로 구성할 때 kubelet 옵션을 통해서 기본 Taint 설정도 가능
- kubectl을 통해 노드의 Taint 관리 가능
- Label / Annotation과 비슷하지만, 추가적으로 Effect 파라미터를 가짐
	- Key = Value:Effect

### Effect
#### Taint가 노드에 설정될 시 적용될 효과
- NoSchedule - 파드를 스케줄링하지 않음
- NoExecute - 파드의 실행을 허용하지 않음
- PreferNoSchedule - 파드 스케줄링을 선호하지 않음
 
### minikube-m02 노드에 role=system:NoSchedule Taint 추가
```bash
kubectl taint node minikube-m02 role=system:NoSchedule
```

### minikube-m02 노드에 role:NoSchedule Taint 제거
```bash
kubectl taint node minikube-m02 role:NoSchedule-
```

### minikube-m02 노드에 role 키를 가진 모든 Taint 제거
```bash
kubectl taint node minikube-m02 role-
```

## 다양한 Toleration 설정 방법

### 모든 종류의 Taint를 용인
![Pasted-image-20221220170942.png](/img/이미지 창고/Pasted-image-20221220170942.png)

### 키가 role이고 효과가 NoExecute인 모든 Taint 용인
![Pasted-image-20221220171038.png](/img/이미지 창고/Pasted-image-20221220171038.png)

### 키가 role인 모든 Taint를 용인
![Pasted-image-20221220171128.png](/img/이미지 창고/Pasted-image-20221220171128.png)

### role=system:NoSchedule Taint를 용인
![Pasted-image-20221220171156.png](/img/이미지 창고/Pasted-image-20221220171156.png)

### 실습
#### toleration

![Pasted-image-20221220172409.png](/img/이미지 창고/Pasted-image-20221220172409.png)
```bash
#!/usr/bin/env sh

kubectl taint node minikube-m03 --overwrite role=system:NoSchedule
```
`set-node-taints.sh`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: normal
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
`normal.yaml`
![Pasted image 20221220172451.png](Pasted image 20221220172451.png)
3번 node에 toleration이 걸려있기 때문에 2번 노드에 실행 된다.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: tolerated
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
      tolerations:
      - key: role
        operator: Equal
        value: system
        effect: NoSchedule
```
`tolerated.yaml`
![Pasted-image-20221220172611.png](/img/이미지 창고/Pasted-image-20221220172611.png)
- 이런식으로 랜덤적으로 배치 됩니다.

#### filebeat

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: filebeat
  namespace: default
  labels:
    app.kubernetes.io/name: filebeat
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: filebeat
  template:
    metadata:
      labels:
        app.kubernetes.io/name: filebeat
    spec:
      serviceAccountName: filebeat
      terminationGracePeriodSeconds: 30
      # hostNetwork: true
      # dnsPolicy: ClusterFirstWithHostNet
      containers:
      - name: filebeat
        image: docker.elastic.co/beats/filebeat:7.15.0
        args:
        # Log to `stderr` instead of `syslog` or `file`
        - "-e"
        env:
        - name: NODE_NAME
          valueFrom:
            fieldRef:
              fieldPath: spec.nodeName
        securityContext:
          runAsUser: 0
        resources: {}
          # We usually recommend not to specify default resources and to leave this as a conscious
          # choice for the user. This also increases chances charts run on environments with little
          # resources, such as Minikube. If you do want to specify resources, uncomment the following
          # lines, adjust them as necessary, and remove the curly braces after 'resources:'.
          # requests:
          #   cpu: 100m
          #   memory: 128Mi
          # limits:
          #   memory: 256Mi
        ports:
        - name: internal-http
          containerPort: 5066
        livenessProbe:
          httpGet:
            path: /
            port: internal-http
            scheme: HTTP
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /
            port: internal-http
            scheme: HTTP
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 5
          failureThreshold: 3
        volumeMounts:
        - mountPath: /usr/share/filebeat/filebeat.yml
          readOnly: true
          name: config
          subPath: filebeat.yml
        - mountPath: /usr/share/filebeat/data
          name: data
        - mountPath: /var/lib/docker/containers
          readOnly: true
          name: varlibdockercontainers
        - mountPath: /var/log
          readOnly: true
          name: varlog
      volumes:
      - name: config
        configMap:
          name: filebeat-config
          defaultMode: 0640
      - name: varlibdockercontainers
        hostPath:
          path: /var/lib/docker/containers
      - name: varlog
        hostPath:
          path: /var/log
      # data folder stores a registry of read status for all files, so we don't send everything again on a Filebeat pod restart
      - name: data
        hostPath:
          # When filebeat runs as non-root user, this directory needs to be writable by group (g+w).
          path: /var/lib/filebeat-data
          type: DirectoryOrCreate
      tolerations:
      - key: role
        operator: Exists
```
`daemon.yaml`

- daemonset은 모두 다 띄워져야하기 때문에, 해당 toleration을 걸어두는 것을 당연하게 해야한다.

---

#Container #Kubernetes #KubernetesAPI

---


