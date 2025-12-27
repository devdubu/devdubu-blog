- [Secret?](#Secret?)
- [Secret의 종류](#Secret의 종류)
- [kubectl Secret 생성 명령어(generic)](#kubectl Secret 생성 명령어(generic))
	- [작성법](#kubectl Secret 생성 명령어(generic)#작성법)
	- [my-secret 이름의 generic 타입 Secret 생성](#kubectl Secret 생성 명령어(generic)#my-secret 이름의 generic 타입 Secret 생성)
	- [my-secret 이름의 generic 타입 Secret 생성 - 로컬의 secret.yaml 파일을 secret.yaml을 키로 저장](#kubectl Secret 생성 명령어(generic)#my-secret 이름의 generic 타입 Secret 생성 - 로컬의 secret.yaml 파일을 secret.yaml을 키로 저장)
	- [my-secret 이름의 generic 타입 Secret 생성 - 로컬의 secret.yaml 파일을 secret을 키로 저장](#kubectl Secret 생성 명령어(generic)#my-secret 이름의 generic 타입 Secret 생성 - 로컬의 secret.yaml 파일을 secret을 키로 저장)
	- [my-secret 이름의 generic 타입 Secret YAML 출력 - 로컬의 secret.yaml 파일의 secret을 키로 저장](#kubectl Secret 생성 명령어(generic)#my-secret 이름의 generic 타입 Secret YAML 출력 - 로컬의 secret.yaml 파일의 secret을 키로 저장)
- [실습](#실습)
	- [env-from](#실습#env-from)
	- [env-value-from](#실습#env-value-from)
	- [volume](#실습#volume)
	- [docker-registry](#실습#docker-registry)
	- [tls](#실습#tls)
- [Secret의 선언적 관리](#Secret의 선언적 관리)
- [External Secrets](#Secret의 선언적 관리#External Secrets)
- [Sealed Secrets](#Secret의 선언적 관리#Sealed Secrets)

---

> 패스워드, API Key, SSH Key 등 민감한 정보를 컨테이너에 주입해야한다면?

##  Secret?
- ConfigMap과 사용 방법은 비슷하다
- Secret은 사용 목적에 따라 몇 가지 종류로 나누어 진다.
- Kubernetes는 기본적으로 시크릿 값을 저장할 때 Base64 인코딩을 한다.
	- etcd에 접근이 가능하다면, 누구든지 Secret 값을 볼 수 있는 문제가 생긴다.
	- 그렇기 때문에 해당 권한 관리 혹은 접근 제어 등을 다루는 것이 중요하다.
![Pasted-image-20221209130023.png](/img/이미지 창고/Pasted-image-20221209130023.png)
## Secret의 종류
1. <span style={{color: 'red', fontWeight: '900'}}>Opaque(generic) - 일반적인 용도의 시크릿</span>
2. **dockerconfigjson - 도커 이미지 저장소 인증 정보**
3. **tls - TLS 인증서 정보**
4. **service-account-tocken -- ServiceAccount의 인증 정보** - [RBAC](../RBAC.md)
![Pasted-image-20221209131526.png](/img/이미지 창고/Pasted-image-20221209131526.png)

## kubectl Secret 생성 명령어(generic)
### 작성법
```bash
kubectl create secret [type명] [name]
```

### my-secret 이름의 generic 타입 Secret 생성
```bash
kubectl create secret generic my-secret
```
### my-secret 이름의 generic 타입 Secret 생성 - 로컬의 secret.yaml 파일을 secret.yaml을 키로 저장
```bash
kubectl create secret generic my-secret --from-file secret.yaml
```
### my-secret 이름의 generic 타입 Secret 생성 - 로컬의 secret.yaml 파일을 secret을 키로 저장
```bash
kubectl create secret generic my-secret --from-file sercet=secret.yaml
```
### my-secret 이름의 generic 타입 Secret YAML 출력 - 로컬의 secret.yaml 파일의 secret을 키로 저장
```bash
kubectl creaet secrete generic my-secret --from-file secret=secret.yaml --dry-run -o yaml
```

## 실습
`fastcampus-devops/3-docker-kubernetes/11-k8s-secret`
### env-from
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mysql-config
data:
  MYSQL_DATABASE: devops
```
`configmap.yaml`
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysql-secret
stringData:
  MYSQL_ROOT_PASSWORD: fastcampus
```
`secret.yaml`
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
```
- 위의 envFrom은 순서가 중요합니다.
	- 만약 같은 이름이라면 나중에 온 값이 덮어 쓸 수 있습니다.
```bash
kubectl apply -f secret.yaml
kubectl apply -f configmap.yaml
kubectl apply -f depolyment.yaml
```
### env-value-from
`configmap.yaml`,`secret.yaml`은 모두 동일합니다.
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
            secretKeyRef:
              name: mysql-secret
              key: MYSQL_ROOT_PASSWORD
```
- configMap과 마찬가지로 secret에 모든 변수를 가져오는 것이 아닌 일부만 가져오는 방식입니다.

### volume
`configmap.yaml`,`secret.yaml`은 모두 동일합니다.
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
        - mountPath: /tmp/config
          name: mysql-config
        - mountPath: /tmp/secret
          name: mysql-secret
      volumes:
      - name: mysql-config
        configMap:
          name: mysql-config
      - name: mysql-secret
        secret:
          secretName: mysql-secret
```
`deployment.yaml`
- configmap과 동일한 방식으로 사용했지만, secret과 configmap을 각각 mount를 하여서 사용하고 있습니다.
- 해당 볼륨은 `tmp/` 경로에 있는 것으로 확인할 수 있습니다.


### docker-registry
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: docker-registry
type: kubernetes.io/dockerconfigjson
data:
  .dockerconfigjson: eyJhdXRocyI6eyJodHRwczovL2luZGV4LmRvY2tlci5pby92MS8iOnsidXNlcm5hbWUiOiJmYXN0Y2FtcHVzIiwicGFzc3dvcmQiOiJmYXN0Y2FtcHVzIiwiYXV0aCI6IlptRnpkR05oYlhCMWN6cG1ZWE4wWTJGdGNIVnoifX19
```
- bash64 디코딩 방법
```bash
echo "eyJhdXRocyI6eyJodHRwczovL2luZGV4LmRvY2tlci5pby92MS8iOnsidXNlcm5hbWUiOiJmYXN0Y2FtcHVzIiwicGFzc3dvcmQiOiJmYXN0Y2FtcHVzIiwiYXV0aCI6IlptRnpkR05oYlhCMWN6cG1ZWE4wWTJGdGNIVnoifX19" | base64 -d
``` 
![Pasted-image-20221209171352.png](/img/이미지 창고/Pasted-image-20221209171352.png)
해당 코드를 변환하는 shell 파일은 아래와 같습니다.
```shell
#!/usr/bin/env sh

kubectl create secret docker-registry docker-registry \
  --docker-username=fastcampus \
  --docker-password=fastcampus \
  --dry-run -o yaml
```
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
      imagePullSecrets:
      - name: docker-registry
      containers:
      - name: mysql
        image: mysql:5.7
        env:
        - name: MYSQL_ROOT_PASSWORD
          value: fastcampus
```
`deployment.yaml`
- 위의 코드를 보면 `imagePullSecret` 에서는 보통은 private한 image를 다운 받게 된다면 그렇게 하지만, 현재는 public 한 image 를 다운 받고 있지만, 빈번히 다운을 받게 된다면, public 이미지는 ratelimit가 걸려있기 때문에, private으로 변경하는 것도 좋은 선택이다.

### tls
![Pasted-image-20221219132332.png](/img/이미지 창고/Pasted-image-20221219132332.png)
```bash
#!/usr/bin/env sh

openssl req -new -newkey rsa:4096 -days 365 -nodes -x509 -subj "/CN=fastcampus.com" -keyout cert.key -out cert.crt

kubectl create secret tls my-tls \
  --cert cert.crt \
  --key cert.key \
  --dry-run -o yaml
```
`print-secret.sh`

# Secret의 선언적 관리
Secret은 Git과 같은 버전 관리 시스템에서 관리하기에 기밀 정보가 담겨있어 부적절하다.

## External Secrets
- HashiCorp Vault, AWS Secrets Manager등과 통합
- ExternalSecret 오브젝트를 생성하면 컨트롤러가 프로바이더로부터 기밀 값을 가져와서 Secret 오브젝트 생성

## Sealed Secrets
- 쿠버네티스 클러스터 상에 컨트롤러 실행
- 클러스터 상의 암호화 키 보관
- kubeseal CLI 가 컨트롤러와 통신하여 데이터 암호화
- SealedSecret 오브젝트를 생성하면 컨트롤러가 복호화하여 Secret 오브젝트 생성

---

#Container #Kubernetes #KubernetesAPI

---
