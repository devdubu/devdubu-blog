---
slug: "YAML-in-Kubernetes"
---
:::tip Kubernetes 구성을 위한 YAML 파일 개발 방법
- Kubernetes는 YAML 파일을 POD, 배포 서비스 등 개체의 생성을 위한 파일로 사용합니다.

:::

Kubernetes 정의 파일은 항상 4개의 최상위 필드를 포함합니다.
```yaml
apiVersion:

kind:

metadata:

spec:
```
- 위 4가지 속성은 모두 Root Level 속성입니다.
- 위 필드는 필수 필드이므로, <mark>구성 파일에 반드시</mark> 있어야 합니다.

## `apiVersion`
- 해당 개체 생성할 때 사용하는 Kubernetes API 버전 입니다
- 우리가 만들려는 것에 따라 올바른 API 버전을 사용해야 합니다.

| 종류         | 버전        |
| ---------- | --------- |
| POD        | `v1`      |
| Service    | `v1`      |
| ReplicaSet | `apps/v1` |
| Deployment | `apps/v1` |
### `kind`
- 만들려는 객체의 유형을 가르킵니다.

### `metadata`
- 이름표 같은 개체에 대한 데이터 입니다.
- 문자열 값을 명시했던 것과는 달리 이는 Map의 형태로 표현됩니다.
```yaml
apiVersion: v1
kind: Pod
metadata:
	name: myapp-pod
	labels:
		app: myapp
		type: front-end
```
- kubernetes 는 `metadata` 아래에서는 함부로 다른 속성을 추가 할 수는 없다.
	- 하지만, `metadata/labels` 아래에서는 원하는 `key-value` 값을 추가하여 값을 가질 수 있다.

### `spec`
- 구성 파일의 마지막 섹션은 `spec` 입니다.
- 우리가 만들 개체의 `spec`에 따라서 그 개체에 대한 추가 정보를 kubernetes에 제공합니다.
- 이 부분은 종류 마다 모두 다른 Format을 지원할 것이며, 각각이 맞는 format은 참조하는 것이 중요하다
	- 현재는 container를 추가하는 것이기에 아래 처럼 작성하면 된다.
```yaml
apiVersion: v1
kind: Pod
metadata:
	name: myapp-pod
	labels:
		app: myapp
		type: front-end
spec: 
	containers:
		- name: nginx-container
		- image: nginx
```
위 처럼 `yaml` 파일에서 정의가 끝났다면, 아래와 같이 `yaml` 파일을 실행해주면 됩니다.
```yaml
kubectl create -f pod-definition.yml
```
or
```yaml
kubectl apply -f pod.yaml
```

---

#Container #Kubernetes 

