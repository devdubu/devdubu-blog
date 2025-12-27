---
slug: "Docker-Compose로-분산-애플리케이션-실행하기"
---

# Docker Compose 파일의 구조

- dockerfile  스크립트는 애플리케이션을 패키징하기 위한 스크립트라는 점은 확실히 이해했을 것이다.
- 그러나 분산 애플리케이션을 기준으로 보면 Dockerfile 스크립트는 애플리케이션의 한 부분을 패키징하는 수단에 지나지 않는다.
- 웹 프론트엔드, 백엔드 API, 데이터 베이스를 갖춘 애플리케이션을 패키징 하려면, 각 컴포넌트에 하나씩 세 개의 Dockerfile 스크립트가 필요하다.
- 그렇다면 이들 컨테이너는 누가 실행해야할까?

- 직접 순서대로 각각의 컨테이너를 도커 명령행을 통해 일일이 옵션을 지정해가며, 실행할 수 있겠지만, 이런 수동 프로세스는 온갖 실수와 오류의 원천이 되기 쉽다
- 직접 실행하는 과정에서 조금만 옵션을 잘못 지정해도, 애플리케이션이 정상적으로 동작하지 않거나 컨테이너 간 통신에 문제가 생길 있기 때문이다.
- 이런 방법 대신 docker compose 파일에 애플리케이션의 구조를 정의하면 된다.

- docker compose 파일은 애플리케이션의 <mark>원하는 상태</mark>, 다시 말해 모든 컴포넌트가 실행 중일 때 어떤 상태여야 하는지를 기술하는 파일이다.
- 또한 `docker container run`명령으로 컨테이너를 실행할 때 지정하는 모든 옵션을 한데 모아 놓은 단순한 형식의 파일이다.
- Docker compose 파일을 작성하고 나면 docker compose가 컨테이너, 네트워크 볼륨등 필요한 모든 도커 객체를 만들도록 docker API에 명령은 내린다.

```yaml
version: '3.7'

services:
	todo-web:
		image: diamol/ch06-todo-list
		ports:
			- "8020:80"
		networks:
			- app-net
networks:
	app-net:
		external:
			name: nat
```
- 이 스크립트의 내용은 docker network에 docker container하나가 연결된 간단한 애플리케이션을 기술 한 것이다.
- docker compose는 사람도 쉽게 읽고 이해할 수 있으며, json으로 변환하기 쉬운 yaml 문법으로 기술 된다.

### 문법
- **version**
	- 파일에 사용된 docker compose 파일 형식의 버전을 가르킨다.
	- 여러 번의 걸쳐 문법과 표현 가능한 요소에 많은 변화가 있었으므로, 먼저 정의가 따르는 형식 버전을 지정할 필요가 있다.
- **services**
	- 애플리케이션을 구성하는 모든 컴포넌트를 열거하는 부분이다.
	- docker compose에서는 실제 컨테이너 대신 서비스 개념을 단위로 삼는다.
	- 하나의 서비스를 같은 이미지로 여러 컨테이너에서 실행할 수 있기 때문이다.
- **network**
	- 서비스 컨테이너가 연결될 모든 도커 네트워크를 열거하는 부분이다.

- 도커 컴포즈를 사용해 이 애플리케이션을 실행하면 컨테이너 하나가 실행돼 스크립트에 정의된 구성을 갖춘다
- 아래 사진은 애플리케이션이 어떤 리소스로 구성되어있는지 나타낸 것이다.
![Pasted-image-20230608110213.png](/img/이미지 창고/Pasted-image-20230608110213.png)
- 애플리케이션을 직접 실행해 보기 전에 스크립트에서 주의 깊게 살펴볼 부분이 두 곳이 있다.
- todo-web 이라는 이름의 서비스는 diamol/ch06-todo-list 이미지로부터 단일 컨테이너로 실행도며, 이 컨테이너는 호스트 컴퓨터의 80번 포트로 자시느이 8002번 포트를 공개한다.
- 최종적인 결과는 `docker container run -p 8020:80 --name todo-web --network nat diamol/ch06-todo-list` 명령을 실행한 것과 같은 상태가 된다.

- 서비스 이름 아래로는 속성이 기술 된다.
- 그 내용은 거의 `docker container run` 명령의 옵션과 그 지정값의 쌍 형태다.
- image는 실행할 이미지를 지정하는 필드고, ports는 공개할 포트에 대한 정보,
- network는 컨테이너가 접속할 도커 네트워크를 정의하는 필드다.
- 서비스 이름은 컨테이너의 이름이자, docker network상에서 다른 컨테이너를 식별하기 위한 DNS 네임으로도 쓰인다.
- 서비스가 구성될 때 네트워크 이름은 app-net이다.
- 그러나 networks 항목을 보면 이 네트워크는 nat이라는 이름의 외부 네트워크로 연결된다. external 필드의 의미는 nat 네트워크가 이미 존재하므로 새로 생성하지 말라는 뜻이다.

- docker compose를 사용하려면 명령 행에서 docker-compose 명령을 실행하면 된다.
- docker-compose의 사용법은 docker 명령과는 다르다.
- 애플리케이션을 시작하려면 up 명령을 실행 해야 한다.
- 그러면 docker compose가 compose 파일을 체크하고 애플리케이션을 정의된 상태로 실행하기 위해 필요한 요소를 준비하기 시작한다.

:::quote 실습
- 터미널 창을 열어 docker network를 생성해보자
- 그 다음에는 docker compose 파일이 있는 디렉토리로 이동해 docker-compose 명령으로 애플리케이션을 시작해라

:::

```bash
docker network create nat
cd ./ch07/exercises/todo-list
docker-compose up
```

- 컴포즈로 애플리케이션을 실행시키기 위해 항상 docker 네트워크가 필요한 것은 아니다.
- 리눅스 컨테이너를 사용한다면 docker compose가 네트워크 대신 관리해주지만, 윈도 컨테이너를 사용한다면 도커를 설치할 때 자동으로 생성되는 기본 네트워크 nat을 사용 해야 한다.
- docker-compose 명령을 실행하면 먼저 현재 작업 디렉터리에서 docker-compose.yaml 파일을 찾는다.
- 해당 파일을 발견하면 to-do 애플리케이션의 정의를 읽어 들인다.
- 현재는 todo-web 서비스를 구성하는 컨테이너가 하나도 없으므로 docker compose가 컨테이너 별로 정리해서 보여준다.

 
![Pasted-image-20230609092522.png](/img/이미지 창고/Pasted-image-20230609092522.png)
- 이제 웹 브라우저에서 http://localhost:8020 에 접근해 to-do 애플리케이션 화면을 띄운다
- 이번에는 docker compose를 이용해 훨씬 간단하고, 안정적으로 애플리케이션을 실행했다.
- docker compose 파일은 애플리케이션 소스코드, dockerfile 스크립트와 함께 형상 관리 도구로 관리된다.
- 그리고 이 파일에 애플리케이션의 모든 실행 옵션이 기술된다.
- 그러므로 README 파일에 애플리케이션 이미지 이름이나 공개해야 할 포트 번호를 문서화 할 필요가 아예 없다
- docker compose 파일 형식에는 애플리케이션의 모든 설정 사항 값과 최 상위 레벨 docker 요소가 정의된다.
- 이 애플리케이션은 단일 서비스로 구성되지만, 이런 경우에도 컴포즈 파일을 통해 설정 사항을 간접적으로 문서화하는 효과를 얻을 수 있다.
- 여러 서비스로 구성된 애플리케이션이라면 compose 파일이 필요하다

# docker compose를 사용해 여러 컨테이너로 구성된 애플리케이션 실행하기
```yaml
accesslog:
	image: diamol/ch04-access-log

iotd:
	image: dimaol/ch04-image-of-the-day
	ports:
		- "80"
image-gallery:
	image: diamol/ch04-image-gallery
	ports:
		"8010:80"
	depends_on:
		- accesslog
		- iotd
```
- 이 스크립트는 서로 다른 유형의 서비스를 기술한 좋은 예이다.
- accesslog 서비스는 공개하는 포트나 docker container run 명령에서 사용할 법한 설정 값도 없이 이미지 이름만 적혀 있다.
- 반면 iotd 서비스는 REST API다 스크립트에 이미지 이름과 함께 80번 포트를 호스트 컴퓨터의 무작위 포트를 통해 공개하도록 작성됐다.
- image-gallery 서비스는 이미지 이름과 함께 8010번 포트를 호스트 컴퓨터의 8010번 포트를 통해 공개한다.
- 또 depends_on 항목을 추가해 이 서비스는 다른 두 서비스에 의존한다는 사실도 기술 했다.
- 이 의존성을 만족하기 위해 컴포즈는 image-gallery 서비스를 실행하기 전에 여기 나열된 두 서비스를 먼저 실행하려고 시도하게 된다.

- 아래의 사진은 애플리케이션 아키텍처를 나타낸 것읻.
- 이 그림은 docker compose 스크립트를 다이어그램으로 변환해 주는 도구를 사용해 만든 것이다.
- 이 도구로 스크립트가 수정될 때마다 다이어 그램을 생성하게 하면 애플리케이션의 참조 문서를 편리하게 최신 상태로 유지할 수 있다.
- 이 도구 역시 docker container로 실행한다.

![Pasted-image-20230609092555.png](/img/이미지 창고/Pasted-image-20230609092555.png)

- docker compose를 사용해 이 애플리케이션을 실행하면,
- 분리모드로 애플리케이션을 실행할 수 있다.
- docker compose가 우리 대신 컨테이너 로그를 수집하지만, 컨테이너는 백 그라운드로 동작하므로 그 동안 docker compose의 기능을 몇가지 더 사용해보면,

:::quote 실습
- 터미널 창을 열어 예제 소스 코드의 최상위 디렉토리로 이동하고, 
- 다음과 같이 이미지 갤러리 애플리케이션의 디렉토리로 이동해 애플리케이션을 실행

:::

```bash
cd ./ch07/exercise/image-of-the-day

docker-compose up -d
```

- 그렇게 된다면, 아래와 비슷한 화면이 뜰 것이다.
- 잘 살펴보면 image-gallery 서비스를 시작하기 전에 accesslog와 iotd 서비스를 먼저 시작하는 것을 알 수 있다.
- 이 것은 컴포즈 파일에 서비스 간의 의존 관계를 설정했기 때문이다.
![Pasted-image-20230609093040.png](/img/이미지 창고/Pasted-image-20230609093040.png)

- 기존 실습된 것과 달라진 점은 여러 컨테이너의 설정과 이들이 어떻게 함께 동작하는지 적힌 docker compoe 파일이 생긴 것이다. 
- 컴포즈 파일을 사용해 여러 개의 컨테이너로 구성된 애플리케이션을 마치 한 덩어리 처럼 다룰 수 있다. 
- API 서비스는 상태가 없으므로, 컨테이너를 늘리는 방법으로 스케일 아웃이 가능하다.
- 웹 컨테이너가 API 데이터를 요청하면 docker가 여러 개의 API 컨테이너에 이 요청을 고르게 분배해준다.
:::queto 실습
- 조금 전과 같은 터미널 창에서 도커 컴포즈를 사용해 iotd 서비스의 컨테이너 수를 늘려 보자
- 그리고 웹 페이지를 리프레시하며 iotd 컨테이너 로그를 살펴보라

:::

```bash
docker-compose up -d --scale iotd=3

docker-compose logs --tail=1 iotd
```
- 명령 실행 후 출력되는 내용을 보면 API서비스의 컨테이너를 두 개 늘려 애초에 세 배로 만드는 것을 알 수 있다.
- 사진이 뜨는 웹 페이지를 몇 차례 리프레시하면 웹 애플리케이션이 API에 데이터를 요청하고, 이들 요청을 늘어난 컨테이너가 고르게 나눠 처리하는데, API 서비스가 요청을 처리할 때 마다 남기는 컨테이너 로그로 이를 확인 할 수 있다.
- docker-compose 명령은 모든 컨테이너 혹은 원하는 컨테이너의 로그만 골라 출력하도록 할 수 있다.
- `--tail=1` 파라미터는 각 iotd 컨테이너의 마지막 로그를 출력하라는 의미다.
- 웹 애플리케이션에서 컨테이너 1번과 3번으로 요청을 보냈으며, 컨테이너 2번은 아직 사용되지 않았다는 것을 출력 된 로그에서 확인 할 수 있다.
![Pasted-image-20230609095636.png](/img/이미지 창고/Pasted-image-20230609095636.png)
- docker compose에는 다양한 기능이 있지만, 이들 기능을 배우기 전에 알아 두어야 할 것이 있다.
- docker compose는 클라이언트 측에서 동작하는 도구라는 점이다.
- docker compose 명령을 실행하면 compose 파일의 내용에 따라 docker API로 지시를 보낸다.
- docker 엔진 자체는 컨테이너를 실행할 뿐, 여러 컨테이너가 하나의 애플리케이션으로 동작하는지 여부는 알지 못한다.
- 이를 아는 것은 YAML 로 적힌 compose 파일을 읽어 애플리케이션의 구조를 이해한 compose 뿐이다.
- 그러므로 compose를 사용해 애플리케이션을 관리하려면 컴포즈 파일을 작성하고 이 파일을 읽을 수 있게 해야한다.

- compose 파일을 수정하거나 docker 명령행으로 직접 애플리케이션을 수정하면, 애플리케이션이 컴포즈 파일에 기술된 구조와 불일치하게 만들 수 있다.
- 이 상태에서 docker compose로 다시 애플리케이션을 관리하려 하면 비 정상적인 동작을 보일 수 있다.
- 우리는 이런 경우를 이미 본 적이 있는데 앞에서 compose 파일 수정 없이 iotd 서비스를 컨테이너 세개로 스케일링 했던 경우가 바로 여기에 해당된다.
- 이 상태에서 컴포즈로 애플리케이션을 재시작 하면 iotd 서비스는 다시 한 개의 컨테이너만으로 동작한다.

:::quote 실습
- docker compose 를 사용해 애플리케이션을 중지한 다음 재시작 하기
- 컨테이너 목록을 보고 애플리케이션 스케일링 상태를 확인

:::

```bash
docker-compose down

docker-compose up -d

docker container ls
```

- 부 명령은 down 은 애플리케이션을 제거하라는 명령으로, 애플리케이션이 중지되고 컨테이너를 모두 제거한다.
- compose 파일에 포함 됐으나, external 플래그가 붙지 않았다면, network와 volume은 모두 제거 대상이다.
- 그리고 부 명령어인 `up`은 애플리케이션을 시작하는 명령이다.
- 하지만, 지금은 실행 중인 컨테이너가 없으므로 compose 파일에 정의된 내용대로 모든 서비스를 다시 생성한다.
- 그러나 컴포즈 파일에는 스케일 아웃에 대한 정의가 없으므로 우리가 세개로 늘렸던 컨테이너수가 다시 하나로 돌아간다.

- 아래의 그림에서 의도한 것은 애플리케이션을 재시작하는 것이었지만, 결과적으로는 애플리케이션 스케일 다운 해버렸다.

![Pasted-image-20230609100153.png](/img/이미지 창고/Pasted-image-20230609100153.png)
- docker compose 사용하기 쉬우면서도 강력한 기능을 갖췄다.
- 하지만, docker compose yaml 파일에 정의된 애플리케이션 정의에 의존하는 클라이언트 측 도구임을 잊어서는 안된다.
- docker compose로 애플리케이션을 배포하면, 애플리케이션을 구성하는 다양한 리소스가 생성되지만, docker 엔진 입장에서의 이들이 어떤 관계를 갖는지 알 수 없다.
- compose 파일을 통해 리소스를 관리해야 애플리케이션이 성립할 수 있다.

# docker container 간 통신
- 분산 애플리케이션의 모든 구성 요소는 컴포즈가 docker container로 실행한다.
- 이들 컨테이너는 어떻게 서로 통신 할까?
- container는 docker 엔진으로 부터 부여받은 자신만의 가상 IP 주소를 가지며, 모두 같은 docker network 로 연결돼 이 IP 주소를 통해 서로 통신할 수 있습니다.
- 애플리케이션 생애주기 동안에 컨테이너가 교체되면 IP 주소도 변경된다..
- IP 주소가 변경되도 문제가 없도록 도커에서는 DNS를 이용해 서비스 discovery 기능을 제공합니다.

- DNS는 IP주소를 도메인과 연력ㄹ하느 기능을 제공하는 시스템으로, 인터넷과 사설 네트워크에서 모두 동작한다.
- docker에도 DNS 서비스가 내장되어 있다.
- 컨테이너를 실행 중인 애플리케이션도 다른 구성 요소에 접근하기 위해 이 DNS 서비스를 사용한다.
- 컨테이너 이름을 도메인 삼아 조회하면 해당 컨테이너 IP 주소를 찾아준다.
- 이런 방법으로 docker network상에 있는 다른 컨테이너의 정보를 사용할 수 있다.


:::quote 실습
- 컨테이너 수를 세배로 늘려 docker compose로 애플리케이션을 실행하라
- 웹 컨테이너에 DNS 조회 명령을 실행해 보자

:::

```bash
docker-compose -d scale --iotd=3

# 리눅스 컨테이너
docker container exec -it image-of-the-day_image-gallery_1 sh

# 윈도 컨테이너
docker container exec -it image-of-the-day_image-gallery_1 cmd

nslookup accesslog

exit
```

- `nslookup` 은 웹 애플리케이션 컨테이너 기반 이미지에 들어있는 유틸리티다.
- 명령의 인자로 도메인을 지정하면 해당 도메인을 DNS 서비스에서 조회하고 그 결과를 출력한다.
![Pasted-image-20230609111507.png](/img/이미지 창고/Pasted-image-20230609111507.png)
- docker network에 연결된 모든 컨테이너는 이 네트워크의 범위에 포함되는 IP주소를 부여받는다.
- 그리고 이 네트워크를 통해 컨테이너 간 통신이 가능하다.
- DNS 조회를 사용하면 컨테이너가 교체돼 IP 주소가 변경되더라도 항상 새로 만들어진 컨테이너에 접근 가능하다.
- docker 명령행에서 accesslog 컨테이너를 직접 삭제하고 docker-compose 로 애플리케이션을 재 실행해 보면 이를 확인 할 수 있다.
- docker compose는 accesslog 컨테이너가 없으므로, 새로운 컨테이너를 만들어 애플리케이션을 재 실행할 것이다.
- 이 컨테이너는 새로운 IP주소를 부여 받으므로, DNS 조회를 다시 해 보면 응답 내용이 달라진 것을 알 수 있다.

:::quote 실습
- docker 명령형으로 accesslog 컨테이너 삭제하기
- docker compose 로 애플리케이션을 재 실행하기
- 웹 컨테이너에서 다시 셸을 실행해 DNS 조회를 다시 실행해보기
:::

```bash
docker container rm -f image-of-the-day_accesslog_1

docker-compose up -d --scale iotd=3

# 리눅스 컨테이너
docker container exec -it image-of-the-day_image-gallery_1 sh

# 윈도 컨테이너
docker container exec -it image-of-the-day_gallery_1 cmd

nslookup accesslog

nslookup iotd

exit
```

- 새로 만들어지거나 삭제된 컨테이너가 더 이상 없었으므로 새로 만들어진 accesslog 컨테이너에도 기존과 같은 IP주소 172.24.0.2가 부여됐다.
- iotd API를 대상으로 DNS 조회를 해 보면, 각각의 컨테이너를 가리키는 세 개의 IP 주소가 출력되는 것을 볼 수 있다.
- 하나의 도메인에 대해 DNS 조회 결과에 여러 개의 IP주소가 나올 수 있다.
- docker compose는 이 점을 활용해 간단한 로드 밸런싱을 구현할 수 있다.
![Pasted-image-20230612140050.png](/img/이미지 창고/Pasted-image-20230612140050.png)

# docker compose로 애플리케이션 설정 값 지정하기
- 일정 규모 이상의 애플리케이션은 DB를 따로 가져가므로, PostgreSQL DB를 사용해서 docker를 구성해보도록 하겠다.
```yaml
services:

	todo-db:
		image:diamol/postgres:11.5
		ports:
			- "5433:5432"
		networks:
			- app-net

	todo-web:
		image: diamol/ch06-todo-list
		ports:
			- "8020:80"
		environment:
			- todo-db
		networks:
			- app-net
		secrets:
			- source: postgre-connection
			- target: /app/config/secret.json
```
- environment
	- 컨테이너 안에서 사용될 환경 변수 값이 정의 된다.
- secrets
	- 실행 시 컨테이너 내부의 파일에 기록될 비밀 값을 정의한다.
	- 이 애플리케이션이 실행되면, 컨테이너에 `/app/config/secrets.json` 파일이 생기고,
	- 이 파일에는 `postgre-connection` 이라는 비밀 값이 기록 된다.

- 비밀 값은 주로 클러스터 환경에서 쿠버네티스나 도커 스웜 같은 컨테이너 플랫폼을 통해 제공된다.
- 평소에는 클러스터 데이터베이스에 암호화 돼 있기 때문에 데이터 베이스 패스워드, 인증서, API키 등 민감한 정보로 구성된 설정 값을 전달하는데 적합하다.
- 도커를 단일 컴퓨터에서 실행하는 상황이라면 비밀 값을 보관하는 클러스터 데이터베이스가 없을 것이므로 파일을 통해 비밀 값을 전달해도 된다.
- compose 파일 마지막 부분에, secrets 항목이 있다.
- 이 스크립트는 비밀값 postgres-connection의 값을 secrets.json 파일에서 읽어오라는 의미다.



# Docker Compose도 만능은 아니다.
- docker compose는 복잡한 분산 애플리케이션의 설정을 짧고 명료한 포맷의 파일로 나타낼 수 있게 해준다.
- YAML 형식으로 작성된 컴포즈 파일은 애플리케이션의 배포 요령을 전달하는 목적으로는 워드로 작성된 문서 파일보다 훨씬 낫다.

- docker compose를 사용하면, 애플리케이션을 정의하고 이 정의를 docker 엔진을 실행 중인 단일 컴퓨터에 적용 가능하다.
- 이 컴퓨터에 실제 활성 상태인 docker 리소스를 docker API를 통해 요청해서 수정하거나 생성한다.

- `docker compose up` 명령을 실행하기만 하면 내가 정의한 상태대로 애플리케이션을 실행할 수 도 있다. 
- 하지만 docker compose가 할 수 있는 일은 여기까지 이다.
- docker compose는 애플리케이션이 지속적으로 정의된 상태를 유지하도록 하는 기능이 없다.
- 일부 컨테이너가 오류를 일으키거나 강제로 종료되더라도 docker-compose up 명령을 다시 실행하지 않는 한 애플리케이션의 상태를 원래대로 되돌릴 수 없다.
![Pasted-image-20230612142832.png](/img/이미지 창고/Pasted-image-20230612142832.png)
- 운영 환경에는 docker compose가 부 적합하다는 말은 아니다.
- docker를 처음 도입해 가상 머신에서 컨테이너로 이주하는 것을 고려하고 있다면, 이 여정의 출발점으로 docker compose는 더할 나위 없는 선택이다.
- 비록 고가용성, 로드 밸런싱, 이중화 같은 기능을 갖추진 못하겠지만,
	- 이들 기능은 애초 가상 머신에서도 없던 기능이다.
- 하지만, 애플리케이션 전체를 일관적인 요소들의 조합으로 만들 수 있다.
	- 애플리케이션의 모든 구성 요소가 각자의 Dockerfile 스크립트와 compose파일을 갖게 되고, 항상 동일한 도구로 애플리케이션을 배포하고 관리 할 수 있다.
	- 컨테이너 클러스터를 운영할 계획이 없는 한 docker compose로만으로도 충분하다.

---

#Container  #Docker 

---