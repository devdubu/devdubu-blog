- [DaemonSet](#DaemonSet)
	- [실습](#DaemonSet#실습)
	- [실행](#실행)

---

# DaemonSet

> 각 노드마다 꼭 실행되어야하는 워크로드(로그 수집, 메트릭 수집, 네트워크 구성 등)가 있다면?

![Pasted-image-20221220101834.png](/img/이미지 창고/Pasted-image-20221220101834.png)

- 클러스터 상의ㅏ 모든 노드에 동일한 파드를 하나씩 생성
- 로그 수집 / 메트릭 수집 / 네트워크 구성 등의 목적으로 많이 사용
	- 로그 수집 : node-exproter / metricbeat / telegraf
	- 메트릭 수집 : node-exporter / metricbeat / telegraf 등
	- 네트워크 구성 : kube-proxy / calico 등
- Deployment와 마찬가지로 Label Selector 기반으로 동작
- nodeSelector / Affinity / Toleration 등을 통해 실행되어야할 노드 목록을 필터링 가능
## 실습
`/fastcampus-devops/3-docker-kubernetes/14-k8s-daemonset/`
![Pasted-image-20221220102541.png](/img/이미지 창고/Pasted-image-20221220102541.png)
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
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /
            port: internal-http
            scheme: HTTP
          initialDelaySeconds: 10
          periodSeconds: 10
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
```

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: filebeat-config
  namespace: default
data:
  filebeat.yml: |
    filebeat.inputs:
    - type: container
      paths:
      - /var/log/containers/*.log
      processors:
      - add_kubernetes_metadata:
          host: ${NODE_NAME}
          matchers:
          - logs_path:
              logs_path: "/var/log/containers/"

    http:
      enabled: true
      host: 0.0.0.0
      port: 5066

    output.console:
      enabled: true
```
- 맨 아래에서는 output을 console로 바로 보내는 형태로 구성했지만, 실 현업에서는 이러한 형태는 안된다.
- kafka, logstash, elastic search로 해당 로그들을 보내서 검토하면 된다.

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: filebeat
  namespace: default
  labels:
    app.kubernetes.io/name: filebeat

---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: filebeat
  labels:
    app.kubernetes.io/name: filebeat
rules:
# "" indicates the core API group
- apiGroups: [""]
  resources:
  - namespaces
  - nodes
  - pods
  - services
  verbs:
  - get
  - watch
  - list
- apiGroups: ["apps"]
  resources:
  - replicasets
  verbs:
  - get
  - watch
  - list

---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: filebeat
  labels:
    app.kubernetes.io/name: filebeat
subjects:
- kind: ServiceAccount
  name: filebeat
  namespace: default
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: filebeat
```

#### 실행
```bash
kubectl apply -f .

kubectl get daemonset
kubectl get pod

# filebeat의 로그들을 지속적으로 볼 수 있는 명령어
# 각각의 pod에 로그를 추합해서 볼 수 있다.
kubectl logs filebeat-npkvr
```
`kubectl apply -f .`
![Pasted-image-20221220103609.png](/img/이미지 창고/Pasted-image-20221220103609.png)
`kubectl get daemonset`
![Pasted-image-20221220103632.png](/img/이미지 창고/Pasted-image-20221220103632.png)
`kubectl get pod`
![Pasted-image-20221220103648.png](/img/이미지 창고/Pasted-image-20221220103648.png)

---

#Container #Kubernetes #KubernetesAPI 

---