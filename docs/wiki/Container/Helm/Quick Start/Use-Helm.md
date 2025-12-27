---
slug: "Use-Helm"
---
# 주요 개념 3가지
Chart는 Helm 패키지 이다.
이 패키지에는 K8S 클러스터 내에서 애플리케이션, 도구, 서비스를 구동하는데 필요한 모든 리소스가 정의가 포함되어 잇다.
K8S에서의 Homebrew 포뮬러, Apt dpkg, YUM RPM 파일과 같은 것으로 생각 할 수도 있다.

저장소는 차트를 모아두고, 공유하는 장소이다.
이것은 마치 Perl의 [CPAN 아카이브](https://www.cpan.org/)나 [페도라 패키지 데이터베이스](https://src.fedoraproject.org/)와 같은데, K8S 패키지용이라고 보면 된다.

릴리스는 k8s 클러스터에서 구동되는 차트 인스턴스이다. 일반적으로 하나의 차트는 동일한 클러스터 내에 여러번 설치 될수 있다.

설치 될때마다, 새로운 release 가 생성된다.

MySQL 차트의 경우를 생각해보자, 클러스터 내에 데이터베이스 2대를 구동하려면, 차트를 두번 설치하면 된다.
차레로 각각의 release name을 가지는, 각각의 release를 가지게 될 것이다.

이러한 개념을 염두에 두고, 헬름 설명을 이어간다.

헬름은 k8s 내부에 `charts`를 설치하고, 각 설치에 대해 새로운 release 를 생성한다.
새로운 차트를 찾기 위해 helm 차트 repositories를 검색할 수 있다.

## `helm search` 차트 찾기
helm은 강력한 검색 명령어를 제공한다.
서로 다른 2가지 소스 유형을 검색하는데 사용할 수 있다.

- `helm search hub` 는 여러 저장소들에 있는 helm 차트들을 포괄하는 [헬름 허브](https://hub.helm.sh/)를 검색한다.
- `helm search repo`는 `helm repo add`를 사용하여, 로컬 helm client에 추가된 저장소를 검색한다.
- 검색은 로컬 데이터 상에서 이루어지며, public 네트워크 접속이 필요하지 않다.

`helm search hub`를 실행하면 공개적으로 사용 가능한 차트들을 찾아볼 수 있다.

```shell
helm search hub wordpress
URL                                               	CHART VERSION	APP VERSION	DESCRIPTION
https://hub.helm.sh/charts/bitnami/wordpress      	7.6.7        	5.2.4      	Web publishing platform for building blogs and ...
https://hub.helm.sh/charts/presslabs/wordpress-...	v0.6.3       	v0.6.3     	Presslabs WordPress Operator Helm Chart
https://hub.helm.sh/charts/presslabs/wordpress-...	v0.7.1       	v0.7.1     	A Helm chart for deploying a WordPress site on ...
```
위와 같이 하면 helm 허브에서 모든 `wordpress` 차트를 찾는다.
필터 없이 `helm search hub`을 실행하면, 사용 가능한 모든 차트를 보여준다.

`helm search repo`를 사용하면, 기존에 추가된 저장소들에 있는 차트 이름을 볼 수 있다.

```shell
 helm repo add brigade https://brigadecore.github.io/charts
"brigade" has been added to your repositories
helm search repo brigade

NAME                        	CHART VERSION	APP VERSION	DESCRIPTION
brigade/brigade             	1.3.2        	v1.2.1     	Brigade provides event-driven scripting of Kube...
brigade/brigade-github-app  	0.4.1        	v0.2.1     	The Brigade GitHub App, an advanced gateway for...
brigade/brigade-github-oauth	0.2.0        	v0.20.0    	The legacy OAuth GitHub Gateway for Brigade
brigade/brigade-k8s-gateway 	0.1.0        	           	A Helm chart for Kubernetes
brigade/brigade-project     	1.0.0        	v1.0.0     	Create a Brigade project
brigade/kashti              	0.4.0        	v0.4.0     	A Helm chart for Kubernetes
```

`helm search` 는 퍼지 문자열 매칭 알고리즘을 사용하므로, 단어 또는 문구의 일부분만 입력해도 된다.

```shell
helm search repo kash

NAME          	CHART VERSION	APP VERSION	DESCRIPTION
brigade/kashti	0.4.0        	v0.4.0     	A Helm chart for Kubernetes
```

`search`는 사용가능한 패키지를 찾는 좋은 방법이다.
설치하려는 패키지를 찾았다면, `helm install`을 이용하여 설치 할 수 있다.

## `helm install` : 패키지 설치

새 패키지를 설치하려면, `helm install` 명령어를 사용하자
가장 간단하게는 사용자가 지정한 릴리스 이름, 설치하려는 차트 이름의 2개의 인수를 받는다.

```shell
helm install happy-panda stable/mariadb

Fetched stable/mariadb-0.3.0 to /Users/mattbutcher/Code/Go/src/helm.sh/helm/mariadb-0.3.0.tgz
happy-panda
Last Deployed: Wed Sep 28 12:32:28 2016
Namespace: default
Status: DEPLOYED

Resources:
==> extensions/Deployment
NAME                     DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
happy-panda-mariadb   1         0         0            0           1s

==> v1/Secret
NAME                     TYPE      DATA      AGE
happy-panda-mariadb   Opaque    2         1s

==> v1/Service
NAME                     CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
happy-panda-mariadb   10.0.0.70    <none>        3306/TCP   1s


Notes:
MariaDB can be accessed via port 3306 on the following DNS name from within your cluster:
happy-panda-mariadb.default.svc.cluster.local

To connect to your database run the following command:

   kubectl run happy-panda-mariadb-client --rm --tty -i --image bitnami/mariadb --command -- mysql -h happy-panda-mariadb
```

이제 `mariadb`차트가 설치 되었다.
차트를 설치하면, 새 `release` 오브젝트가 생성된다는 점을 알아두자.
위에서 릴리스의 이름이 `happy-panda`이다.
:::tip 헬름이 생성해주는 이름을 그대로 사용하려면 릴리스 이름을 넣지 말고 `--generate-name`을 사용하자.

:::

설치하는 동안, `helm` 클라이언트는 어떤 리소스가 생성되는지, 릴리즈 상태는 어떤지, 추가 설정단계가 있는지에 관한 유용한 정보를 출력할 것이다.

helm 모든 리소스가 구동할 때까지 기다리지 않는다.

많은 차트들이 크기 600MB 이상의 Docker이미지를 필요로 하며, 클러스터에 설치되기까지는 상당한 시간이 걸린다.

릴리스의 상태를 추적을 계속하거나, 구성 정보를 재확인하려면, `helm status`를 사용하자

```shell
helm status happy-panda

Last Deployed: Wed Sep 28 12:32:28 2016
Namespace: default
Status: DEPLOYED

Resources:
==> v1/Service
NAME                     CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
happy-panda-mariadb   10.0.0.70    <none>        3306/TCP   4m

==> extensions/Deployment
NAME                     DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
happy-panda-mariadb   1         1         1            1           4m

==> v1/Secret
NAME                     TYPE      DATA      AGE
happy-panda-mariadb   Opaque    2         4m


Notes:
MariaDB can be accessed via port 3306 on the following DNS name from within your cluster:
happy-panda-mariadb.default.svc.cluster.local

To connect to your database run the following command:

   kubectl run happy-panda-mariadb-client --rm --tty -i --image bitnami/mariadb --command -- mysql -h happy-panda-mariadb
```

위와 같이 릴리스의 현재 상태가 표시 된다.

### 설치 전 chart 커스터마이징
여기서는 이 차트의 기본 구성 옵션들만 사용할 것이다.

대부분의 경우 선호하는 구성을 사용하기 위해 차트를 커스터마이징하게 될 것이다.

차트에 어떤 옵션이 구성 가능한지 보려면, `helm show values`를 사용하자
```shell
helm show values stable/mariadb

Fetched stable/mariadb-0.3.0.tgz to /Users/mattbutcher/Code/Go/src/helm.sh/helm/mariadb-0.3.0.tgz
## Bitnami MariaDB image version
## ref: https://hub.docker.com/r/bitnami/mariadb/tags/
##
## Default: none
imageTag: 10.1.14-r3

## Specify a imagePullPolicy
## Default to 'Always' if imageTag is 'latest', else set to 'IfNotPresent'
## ref: https://kubernetes.io/docs/user-guide/images/#pre-pulling-images
##
# imagePullPolicy:

## Specify password for root user
## ref: https://github.com/bitnami/bitnami-docker-mariadb/blob/master/README.md#setting-the-root-password-on-first-run
##
# mariadbRootPassword:

## Create a database user
## ref: https://github.com/bitnami/bitnami-docker-mariadb/blob/master/README.md#creating-a-database-user-on-first-run
##
# mariadbUser:
# mariadbPassword:

## Create a database
## ref: https://github.com/bitnami/bitnami-docker-mariadb/blob/master/README.md#creating-a-database-on-first-run
##
# mariadbDatabase:
# ...
```

YAML 형식 파일에 있는 이러한 설정들을 override하여, 설치시 파일과 함께 반영시킬 수 있다.

```shell
echo '{mariadbUser: user0, mariadbDatabase: user0db}' > config.yaml

helm install -f config.yaml stable/mariadb --generate-name
```

위와 같이 하면, user0이라는 기본 MariaDB 사용자가 생성될 것이고, 이 사용자에게 새로 생성된 user0db 데이터 베이스에 대한 접근 권한이 부여되지만, 나머지 모든 기본 설정은 해당 차트를 따르게 된다.

설치 작업에 구성 데이터를 전달하는 방법에는 두가지가 있다.
- `--values` (또는 `-f`) : 
	- 오버라이드할 YAML 파일을 지정한다.
	- 여러번 지정할 수 있지만, 가장 오른쪽에 있는 파일이 우선시 된다.
- `--set`
	- 명령줄 상에서 오버라이드를 지정한다.






---

#Container

---

























