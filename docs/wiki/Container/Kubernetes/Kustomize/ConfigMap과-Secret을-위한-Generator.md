---
slug: "ConfigMap과-Secret을-위한-Generator"
---
- [실습](#실습)
	- [실행](#실습#실행)

---

## 실습

`/fastcampus-devops/3-docker-kubernetes/kustomize/5-generators`
![Pasted-image-20221221165108.png](/img/이미지 창고/Pasted-image-20221221165108.png)

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
- deployment.yaml
- service.yaml

configMapGenerator:
- name: mysql-config
  literals:
  - MYSQL_DATABASE=devops
  envs:
  - mysql.env
- name: test-files
  files:
  - files/test1.txt
  - test2.txt=files/test2.txt

secretGenerator:
- name: mysql-secret
  literals:
  - MYSQL_ROOT_PASSWORD=fastcampus

# These labels are added to all configmaps and secrets.
generatorOptions:
  labels:
    env: dev
  annotations:
    managed_by: kustomize
  # disableNameSuffixHash is true disables the default behavior of adding a
  # suffix to the names of generated resources that is a hash of
  # the resource contents.
  # disableNameSuffixHash: true
```
`kustomization.yaml`

- kubernetes에서 관리하기 어렵던 Configmap을 kustomize에서는 관리 할 수 있게 
- 위의 configMapGenerator 아래 부분들은 모두 중에 한개 이다.
	- literals
	- envs
	- name -> file을 기반으로 환경 변수를 설정함
 ![Pasted-image-20221221170519.png](/img/이미지 창고/Pasted-image-20221221170519.png)
- DEVOPS_OWNER, TEAM, TEST 등등이 설정된 모습을 볼 수 있다.
- 



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
        - secretRef:
            name: mysql-secret
        volumeMounts:
        - mountPath: /tmp/test
          name: kustomize-files
      volumes:
      - name: kustomize-files
        configMap:
          name: test-files
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
  ports:
  - name: http
    protocol: TCP
    port: 80
    targetPort: 3000
  selector:
    app: "grafana"
```
`service.yaml`

```env
DEVOPS_TEST=Hello
DEVOPS_TEAM=fastcampus
DEVOPS_OWNER=claud
```
`mysql.env`


### 실행
```bash
kustomize build . | kubectl apply -f -
```

---

#Container #Kubernetes #Kustomize

---