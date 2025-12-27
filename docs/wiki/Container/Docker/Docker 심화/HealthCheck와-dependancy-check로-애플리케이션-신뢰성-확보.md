---
slug: "HealthCheck와-dependancy-check로-애플리케이션-신뢰성-확보"
---


# HealthCheck를 지원하는 도커 이미지 빌드하기
- Docker는 Container를 시작할 때 마다, 애플리케이션의 기본적인 상태를 확인한다.
- 컨테이너를 실행하면 내부에서 애플리케이션 실행 파일이나 자바 혹은 닷넷 런타임, 또는 셸 스크립트 같은 특정한 프로세스가 실행된다.
- Docker가 확인하는 것은 이 프로세스의 실행 상태다.
- 만약 이 프로세스가 종료됐다면, Container도 종료 상태가 된다.

- 이것만으로 환경과 상관 없이 기본적인 헬스 체크는 가능
- 해당 프로새스가 비정상적으로 종료됐다면, 개발자도 애플리케이션의 상태가 비정상임을 알 수 있다.
- 클러스터 환경에서는 플랫폼이 종료된 컨테이너를 재 시작하거나 새 컨테이너로 교체하는 작업을 대신 해준다.
- 하지만, 이정도 수준은 프로세스가 실행 상태라는 점 뿐이지 애플리케이션의 정상적인 상태가 아니다.

- 웹 애플리케이션을 실행 중인 컨테이너를 떠올려 보자
- 이 컨테이너의 처리 용량을 뛰어넘는 수의 요청이 들어오는 순간, 웹 애플리케이션은 503 **Service Unavailable** 오류를 뿜을 것이다.
- 하지만, 컨테이너의 프로세스는 여전히 정상적으로 실행 중이다.
- 애플리케이션이 동작을 멈췄어도, Docker Container는 정상이라고 판단한다.

- Docker는 애플리케이션의 상태가 실제로 정상인지 확인 할 수 있는 정보를 Docker 이미지에 직접 넣을 수 있는 기능을 제공한다.
- 방법은 간단하다.
	- Dockerfile 스크립트에 상태 확인을 위한 로직을 추가하면 된다.
	- 간단한 API 컨테이너를 대상으로 직접 실습해 볼 것이다.
	- 하지만 그 전에 헬스 체크 로직이 없는 상태에서 생길 수 있는 문제를 먼저 체험해 보겠다.

:::example 실습
- 무작위 숫자를 반환하는 간단한 REST API가 있다.
- 이 API를 제공하는 컨테이너를 실행하라
- 그런데 이 애플리케이션은 버그가 있어 세번 API 호출하고 나면 비 정상 상태에 빠지며, 그 이후의 호출은 실패한다.
- 터미널 창을 열어 컨테이너를 실행한 다음 API를 호출한다.

:::

```bash
# API 컨테이너를 실행한다.
docker container run -d -p 8080:80 diamol/ch08-numbers-api

# API를 세 번 호출한다. - 각 호출마다 무작위 숫자가 반복된다.
curl http://localhost:8080/rng
curl http://localhost:8080/rng
curl http://localhost:8080/rng

# 네번째 부터는 API 호출이 실패한다.
curl http://localhost:8080/rng

# 컨테이너의 상태를 확인 한다.
docker container ls
```

- API는 처음 세 번째 호출까지는 정상 동작하지만, 네번째 호출부터 HTTP 500 'Internal Server Error' 응답을 반환한다.
- 이 버그로 인해 네 번째 이후의 호출 결과는 이렇게 오류를 반환한다.
- 컨테이너 목록을 확인하면, 해당 컨테이너의 상태는 여전히 Up 으로 나온다.
- 컨테이너 안에서 동작하는 프로세스의 상태도 역시 실행 중이다.
- Docker의 입장에서는 Container runtime은 프로세스 안에서 무슨일이 일어나는지, 애플리케이션이 정상적으로 동작 중인지 알 방법이 없다.
![Pasted-image-20230612155536.png](/img/이미지 창고/Pasted-image-20230612155536.png)


- Dockerfile에서는 HEALTHCHECK 인스트럭션을 보자. 컨테이너 런 타임은 이 인스트력션에 정의된 정보를 이용해 컨테이너에서 동작 중인 애플리케이션의 상태가 정상인지 확인 할 수 있다.
- HEALTHCHECK 인스트력션에는 docker container 안에서 실행하는 명령을 지정하게 되는데, 이 명령이 반환하는 상태 코드를 보고 애플리케이션의 상태를 판단한다.
- 애플리케이션의 상태를 판단할 수 있다면, 어떤 명령을 지정해도 무방하다.
- docker는 일정한 시간 간격으로 컨테이너 안에서 지정된 명령을 실행한다.
- 상태 코드가 정상이면 컨테이너도 정상으로 간주되지만, 상태코드가 연속으로 일정 횟수 이상 실패로 나오면 해당 컨테이너를 이상 상태로 간주한다.

```dockerfile
FROM diamol/dotnet-aspnet
"
ENTRYPOINT ["dotnet", "/app/Numbers.Api.dll"]

HEALTHCHECK CMD curl --fail http://lcoalhost/health
WORKDIR /app

COPY --from=builder /out/ .
```
- 위 예시는 무작위 숫자 API의 Dockerfile 스크립트에 추가된 HEALTCHECK 인스트럭션이다.
- 이 Dockerfile 스크립트로 API 버전 2의 이미지를 빌드 한 것이다.
- 이 인스트럭션에 사용된 명령은 curl 명령으로, 호스트 컴퓨터에서 내가 API 상태를 확인했던 방법과 비슷하다.
- 다른 점은 이 명령은 컨테이너 내부에서 실행된다는 점이다.
- URL /health는 버그가 발동했는지 확인하기 위한 또 다른 API 엔드포인트다.
- 만약 버그가 발동 됐다면 `500 Internal Server Error` 가 반환되고, 정상이라면 `200 OK` 가 응답으로 반환된다.

- `--fail`
	- curl이 전달 받은 상태 코드를 docker에 전달한다.
	- 요청이 성공하면 curl이 0을 반환하고 실패하면 0이외의 숫자를 반한합니다.
		- docker 0을 헬스 체크 정상, 0이외 값은 비정상으로 간주합니다.
- 이 Dockerfile 스크립트로 새로운 버전의 이미지를 빌드할 텐데, 일반적으로 Dockerfile 스크립트의 파일명은 Dockerfile이고,
- Docker는 이 이름을 가진 파일을 찾아 빌드를 시도한다.
:::example dockerfile의 이름, 디렉토리 위치가 모두 다를 때의 이미지 빌드
:::

```bash
# 예제 코드의 최상위 디렉터로 이동하면 하위 폴더와 Dockerfile 스크립트 파일이 있다.
cd ./ch08/exercises/numbers

# -f 옵션을 붙여 Dockerfile 스크립트 파일의 경로를 지정한다.
docker image build -t diamol/ch080-numbers-api:v2 -f ./numbersapi/Dockerfile.v2 .
```
- 이 이미지 빌드가 끝나면 헬스 체크 기능을 갖춘 애플리케이션을 실행할 수 있습니다.
- 여기에 더해 헬스 체크 간격과 애플리케이션의 상태를 이상으로 간주하는 누적 실패 횟수도 설정할 수 있습니다.
- 기본 값은 30초 간격으로 연속 3회 이상 실패하면, 애플리케이션이 이상 상태로 간주된다.
- 새로 빌드한 v2 이미지는 이제 헬스 체크 기능을 내장 했으므로, 테스트를 다시 해 보면 컨테이너의 이상을 감지할 수 있다.

```dockerfile
# 버전 v2 이미지로 API 컨테이너를 실행하라
docker container run -d -p 8081:80 diamol/ch08-numbers-api:v2

# 30초 정도 기다린 다음 컨테이너 목록을 확인 한다.
docker container ls

#API를 네 번 호출한다. 처음 세 번은 무작위 숫자를 반환하고, 네 번째는 실패한다.

# 애플리케이션이 이상 상태에 빠졌다.
# 90초를 기다려 docker의 이상 상태를 감지하는지 확인한다.
docker container ls
```

![Pasted-image-20230612155411.png](/img/이미지 창고/Pasted-image-20230612155411.png)
- 컨테이너의 이상 상태는 docker api를 통해 보고 된다.
- 따라서 컨테이너를 실행 중인 플랫폼도 컨테이너의 이상 상태를 통보 받고 애플리케이션을 복구하기 위한 조치를 취할 수 있다.
- 가장 최근의 헬스 체크 수행 결과도 저장돼 있어 컨테이너 상태를 보여주는 `docker container inspect` 명령을 볼 수 있다.

:::example 실습
- 지금은 API 컨테이너를 두 개 실행 중인데, 이들 컨테이너를 만들 때 이름을 부여하지 않았다.
- 하지만, `container ls`명령에 `--last` 플래그를 붙이면 가장 최근에 만든 컨테이터에 대한 정보를 볼 수 있다.
- 이 정보를 `container inspect` 명령으로 전달하면 가장 최근 컨테이너의 상태를 출력한다.

:::

```bash
docker container inspect $(docker container ls --last 1 --format '{.{ID}}')
```
- 꽤 긴 길이의 JSON 데이터가 출력 되는데, 위로 스크롤을 올려 State 필드를 찾아보면 그 아래 Health 필드가 보인다.
- 이 필드에서 현재의 헬스 체크 상태를 볼 수 있다.
- FailingStreak는 연속 실패한 횟수이고, Log는 가장 최근에 수행한 헬스 체크의 정보이다.
- 헬스 체크 명령에서 HTTPS 상태 코드 500이 나오면 실패가 되는데, 헬스 체크가 연속으로 여섯 번 실패하면 컨테이너 상태가 unhealty로 바뀐다.
![Pasted-image-20230612153925.png](/img/이미지 창고/Pasted-image-20230612153925.png)
- 위의 그림을 보면 이상 상태임에도 `State: { Status: Running }`는 변함이 없다.
- 이유인 즉슨,
	- docker 가 이런 작업을 완전히 처리 할 수 없음을 나타냅니다.
	- docker engine은 단일 서버에서 동작하는데, 이상이 생긴 컨테이너를 docker가 중지하고 재 시작할 수 있지만,
	- 그 시간 동안에는 애플리케이션이 동작하지 않는다.
	- 이상이 생긴 container를 제거하고 완전히 같은 설정으로 새 컨테이너를 실행할 수 있지만,
	- 이 경우에도 container에 보관된 데이터가 유실되고 그 시간 동안 애플리케이션도 동작하지 않는다.
	- docker 입장에서는 이상 상태를 보이는 container를 교체하는 작업을 직접 수행했을 때, 상황이 더 악화시키지 않을 것이라는 보장이 없으므로,
	- 이상 상태 발생을 통보만 할 뿐 container는 그대로 두는 것이다.
		- 물론 일시적 헬스체크 실패일 뿐이라면, container상태가 다시 healty로 돌아간다.

# 디펜던시 체크가 적용된 컨테이너 실행하기
:::example 컨테이너 상태는 정상이지만, 애플리케이션은 실행 되지 않는 상태
- 핵심 의존 관계를 만족하지 않아서 애플리케이션이 정상적으로 동작하지 않는 상황

:::

![Pasted-image-20230612160331.png](/img/이미지 창고/Pasted-image-20230612160331.png)
- 애플리케이션 중에는 실행 시 필요한 의존 관계를 미리 확인 하는 로직을 포함한 것도 있지만, 대부분의 애플리케이션은 이런 로직이 없다.
- <mark>의존 관계를 만족</mark>하는지 점검하는 <mark>디펜던시 체크 기능</mark>도 docker image에 추가 가능하다
- dependance 체크는 애플리케이션 실행 전에 필요한 요구 사항을 확인하는 기능으로, 실행 시점이 헬스 체크와는 조금 다르다.
- 모든 요구 사항이 확인 되면, 디펜던시 체크가 성공하고 애플리케이션이 실행된다.
- 반대로 만족하지 못하는 요구사항이 있다면 디펜더시 체크가 실패해, 애플리케이션이 실행되지 않는다.
```dockerfile
FROM diamol/dotnet-aspnet

ENV RngApi:Url=http://numbers-api/rng

CMD curl --fail http://numbers-api/rng && \
	 dotnet Numbers.Web.dll
WORKDIR /app
COPY --from=builder /out/ .
```
- API 사용 가능 여부를 확인하기 위해, 이번에도 기반 이미지에 포함된 유틸리티인 curl을 사용한다.
- CMD 인스트럭션에 정의된 명령은 컨테이너를 실행할 때 실행된다.
- 이 명령은 API에 HTTP 요청을 보내 API가 사용 가능한지 확인 한다.
- 그 뒤에 이어지는  &&는 리눅스와 윈도우 셸 모두에서 기능이 같다.
- &&의 앞에 오는 명령이 성공하면 뒤에 오는 명령을 실행한다.

- API가 사용가능한 상태라면 curl 명령이 성공하고 이어지는 닷넷 코어 애플리케이션 실행 명령을 실행할 것이며, docker가 이어서 dotnet 프로세스의 상태를 모니터링 할 것이다.
- API를 사용할 수 없다면, curl 명령이 실패하고, 뒤에 오는 명령도 실행되지 않아, 컨테이너가 그대로 종료된다.

:::example 실습
- 실행 중인 API 컨테이너가 없으므로, 웹 애플리케이션 컨테이너도 실행에 실패하고 종료될 것이다.

:::

```bash
docker container run -d -p 8084:80 diamol/ch08-numbers-web:v2

docker container ls --all
```
![Pasted-image-20230612161854.png](/img/이미지 창고/Pasted-image-20230612161854.png)
- v2 컨테이너는 실행한지 몇 초만에 curl 명령을 실패해 사용 가능한 API를 발견하지 못하고 종료된다.
- 직관에는 어긋나지만, 이 상황에서는 container가 종료되는 것이 낫다.
- 애플리케이션의 규모가 크다면 무슨 일이 일어났을 때, 빨리 아는 편이 좋다.
- 컨테이너가 종료되면 컨테이너 플랫폼이 대체할 새로운 컨테이너를 마련한다.
	- 예)
		- API 컨테이너를 실행하는데 오래 걸린다면, 웹 애플리케이션이 실행 될 때 API가 준비되지 않았을 수도 있다.
		- 이럴 때는 그냥 웹 애플리케이션 컨테이너가 종료되고, API 준비가 끝났을 때, 대체 컨테이너를 실행하면 된다.
- 헬스 체크와 디펜던시 체크를 갖췄다면, 이제 컨테이너 플랫폼 환경에 적합한 애플리케이션이라고 할 수 있다.
- 우리가 사용한 검증 방식은 curl을 사용한 가장 기본적인 HTTP 요청 테스트 이다.
- 이 정도로 단순한 방법으로도 원하는 목적을 달성할 수 있으므로 별도의 외부 도구에 의존 할 필요가 없다.

# 애플리케이션 체크를 위한 커스텀 유틸리티 만들기
- curl은 웹 애플리케이션이나 API 테스트를 하는 데 매우 유용한 도구다.
	- 하지만, 실무에서는 curl을 사용하지 않는다.
	- 보안 정책상의 이유로 이미지에 curl을 포함 시킬 수 없다.
- docker image에는 애플리케이션을 구동하는 데 필요한 최소한의 내용만 들어가야 한다.
- 사용하지 않을 도구를 추가 해 봤자 이미지의 크기만 증가하고, 외부 공격에 노출될 여지를 늘릴 뿐이다.
	- curl이 컨테이너 상태에 체크에 유용한 도구이기는 하지만, 이런 이유로 실제 애플리케이션 체크에는 애플리케이션과 같은 언어로 구현된 별도의 커스텀 유틸리티를 사용하는 것이 낫다.

- 커스텀 유틸리티를 실행할 때도, 애플리케이션과 같은 도구를 사용하므로, 이미지에 추가적인 소프트웨어를 포함 시킬 필요가 없다.
- 재시도, 횟수나 분기 등 셸 스크립트로는 표현하기 까다로운 복잡한 체크 로직을 적용할 수 있다.
- 특히 리눅스와 윈도 양쪽에서 사용할 크로스 플랫폼 이미지라면 더욱 유용하다.
- 애플리케이션과 같은 설정을 사용해 대상 URL을 여러 곳에 반복 정의하거나 수정에 누락 시키는 일을 방지 할 수 있다.
- 애플리케이션과 같은 라이브러리 환경에서 데이터베이스 접속이 필요한 인증서 파일의 존재 유무 등 컨테이너 실행 저에 확인이 필요한 모든 사항을 검증한다.
![Pasted-image-20230612163343.png](/img/이미지 창고/Pasted-image-20230612163343.png)
- Dockerfile.v3 파일의 빌드 단계 중 마지막 단계를 아래 코드에 적혀 있습니다.
- HEALTCHECK 인스트럭션에서 curl 대신 닷넷 코어로 구현된 유틸리티를 이용합니다.
```dockerfile
FROM diamol/dotnet-aspent
"
ENTRYPOINT ["dotnet", "Numbers.Api.dll"]
HEALTHCHECK CMD ["dotnet", "Utilities.HttpCheck.dll","-u","http://localhos/health"]

WORKDIR /app

COPY --from=http-check-builder /out/ .
COPY --from=builder /out/ .
```

- 수정된 헬스 체크도 동작은 거의 그대로 이다.
- 차이점은 컨테이너 검사 중 출력되는 로그가 좀 적어진다는 정도다.
- 따라서 헬스 체크 수행 한 반에 한 줄의 결과만 출력된다.
- 애플리케이션의 초기 상태도 정상으로 나온다.
- 이미 알고 있듯이 API를 몇번 호출하고 나면 이상 상태를 보고 할 것이다.

:::example 실습
- 이번에는 헬스 체크 간격을 조금 줄인다.
- 컨테이너의 상태가 정상인지 확인하고 API를 몇번 호출해 상태가 이상으로 바뀌는지 확인해보기

:::

```bash
# 기존 container는 삭제
docker container rm -f $(docker container ls -aq)

# API를 v3 버전의 이미지로 실행 한다.
docker container run -d -p 8080:80 --health-interval 5s diamol/ch08-numbers-api:v3

# 5초 정도 기다린 후 컨테이너 목록을 확인 한다.
docker container ls

# API를 네번 호출 한다.
curl http://localhost:8080/rng
curl http://localhost:8080/rng
curl http://localhost:8080/rng
curl http://localhost:8080/rng

# 애플리케이션에 버그가 발생, 15초 기다린 후 상태가 이상으로 바뀌는 지 확인
docker contaienr ls
```
![Pasted-image-20230612164917.png](/img/이미지 창고/Pasted-image-20230612164917.png)
- API 사용 가능 여부를 확인하는 디펜던시 체크에도 같은 유틸리티를 사용합니다.
- 아래의 예제는 dockerfile 스크립트의 마지막 빌드 단계이다.
- 여기서 사용한 `-t` 옵션은 애플리케이션과 같은 설정 파일을 읽어 그 설정대로 대상 URL을 지정한 것이다.
```dockerfile
FROM diamol/dotnet-aspnet
ENV RngApi:Url=http://numbers-api/rng
CMD dotnet Utilites.HttpCheck.dll -c RngApi:Url -t 900 && \
	dotnet Numbers.Web.dll
WORKDIR /app
COPY --from=http-check-builder /out/ .
COPY --from=builder /out/ .
```
- 이제 동작은 똑같이 유지하면서, 애플리케이션 이미지에서 curl을 제거할 수 있게 됐다.
```bash
docker container run -d -p 8081:80 diamol/ch08-numbers-web:v3

docker container ls -all
```
- 실행하게 된다면, API 컨테이너가 이상 상태이지만, 계속 실행 중으로 나온다.
- 웹 애플리케이션 컨테이너는 numbers-api라는 도메인으로 API 컨테이너를 찾는데, 이름을 지정하지 않아서 찾지 못한다.
- API 컨테이너를 실행할 때 이 이름을 지정해 실행했다면, 웹 애플리케이션 API를 발견해 호출했을 것이다.
- 그래도 네번재 호출부터 버그를 일으키는 건 변함 없다.
![Screenshot-2023-06-12-at-10.51.47-PM.png](/img/이미지 창고/Screenshot-2023-06-12-at-10.51.47-PM.png)
- 커스텀 테스트 유틸리티의 또다른 장점은, 이미지의 이식성이 향상된다는 것이다.
- 컨테이너 플랫폼마다 헬스 체크와 디펜던시 체크를 정의하고 실행하는 방법에 차이가 있다.
- 그러나 모든 로직을 테스트 유틸리티에 포함시킨다면, docker compose, docker swarm, kubernetes등 어떤 환경에서도 그대로 동작 가능하다.

# Docker compose로 healthcheck & dependance check 정의하기
- 단일 서버에서 애플리케이션을 실행 중이라면 더 심각한 장애를 일으킬 수 있기 때문에, Docker compose에서는 새 컨테이너로 대채하지 않는다.
```yaml
numbers-api:
	image: diamol/ch08-numbers-api:v3
	ports:
		- "8087:80"
	healthcheck:
		interval: 5s
		timeout: 1s
		retries: 2
		start_period: 5s
	networks:
		- app-net
```
- docker compose 파일에서는 헬스 체크의 옵션을 더 세세하게 설정 가능하다.
	- **interval**
		- 헬스 체크 실시 간격을 의미한다.
	- **timeout**
		- 그때까지 응답을 받지 못하면 실패로 간주하는 제한 시간을 의미한다.
	- **retries**
		- 컨테이너 상태를 이상으로 간주할 때까지 필요한 연속 실패 횟수를 의미한다.
	- **start_period**
		- 컨테이너 실행 후 첫 헬스 체크를 실실하는 시간 간격을 의미한다.
		- 애플리케이션을 시작하는데 시간이 오래 걸리는 경우 필요하다
- 실세 설정값은 애플리케이션의 이상 발생을 파악하는 속도와 허용할 수 있는 장애 오탐지 빈도를 고려해 결정해야한다.
- 이미지에 헬스 체크가 없다면, 컴포즈 파일에서 정의하는 방법도 있다.
```yaml
numbers-web:
	image: diamol/ch08-numbers-web:v3
	restart: on-failure
	ports:
		- "8088:80"
	healthcheck:
		test:["CMD", "dotnet","Utilities.HttpCheck.dll", "-t","150"]
		interval: 5s
		timeout: 1s
		retries: 2
		start_period: 10s
	networks:
		- app-net
```
- 스크립트에 `restart: on-failure` 설정이 있으므로, 컴테이너가 예기치 않게 종료되면 컨테이너를 재시작한다
- 그러나 의존 관계를 정의한 `depends_on` 설정이 없으므로 docker compose는 container를 어떤 순서로든 실행할 수 있다.

:::example 실습
- 현 docker compose 실행해보기

:::

```bash
# 컴포즈 파일이 있는 디렉토리로 이동
cd ./ch08/exercises/numbers

# 현재 컨테이너를 모두 삭제
docker container rm -f $(docker container ls -aq)

# 애플리케이션 실행
docker-compose up -d

# 5초를 기다린 다음 컨테이너 목록을 확인
docker container ls

# 웹 애플리케이션 로그도 확인
docker container logs numbers-numbers-web-1
```
![Screenshot-2023-06-12-at-11.12.45-PM.png](/img/이미지 창고/Screenshot-2023-06-12-at-11.12.45-PM.png)
- 왜 docker compose 파일에 `depends_on`설정을 사용해 직접 디펜던시 체크를 하도록 하지 않는지 궁금해 할 수 있다.
	- 그 이유는 docker compose가 디펜던시 체크를 할 수 있는 범위가 단일 서버로 제한 되기 때문이다.
	- 이에 비하면 운영환경에서 애플리케이션을 실제 시작할 때 일어나는 상황은 이보다 훨씬 예측하기 어렵다.
## Healthcheck와 Dependancy Check로 복원력 있는 애플리케이션을 만들 수 있는 이유
여러 개의 요소로 구성된 분산 시스템으로 동작하는 애플리케이션은 유연성과 기민성 면에 서 뛰어납니다.
그러나 반대로 급부로 관리가 그만큼 어려워집니다.
구성 요소 간의 복잡한 의존 관계를 보면, 이들 의존 관계를 각 구성 요소를 시작하는 순서에 반영해 모델링하고 싶은 유혹에 빠지기 쉽다.
하지만 이 방법은 그리 현명한 방법은 아닙니다.

물리 서버가 한 대 뿐인 환경이라면 Docker Compose에 웹 컨테이너보다 API 컨테이너를 먼저 실행시키라고 지시 할 수있습니다.
그러면 이 순서대로 실제로 컨테이너가 실행된다.
나의 운영 환경에서는 10여 대의 서버에서 Kubernetes를 운영하는데, 이 클러스터에서 20여 개의 API 컨테이너 20개를 먼저 실행해야할까?
20개의 API 컨테이너 중 19개는 무사히 실행 됐는데 마지막 한 개가 실행이 늦어져 5분이나 걸렸다면 어떻게 될까?
웹 애플리케이션 컨테이너가 하나도 실행되지 않았으므로, 애플리케이션이 동작 중이라 할 수 없다.
하지만 API 컨테이너가 하나 부족하더라도 50개의 웹 애플리케이션 컨테이너를 실행하는데는 문제가 없다.

Dependency check 와 healthcheck가 활용하는 부분은 바로 이 지점이다.
dependency check와 healthcheck를 도입하면서 처음 부터 플랫폼이 실행 순서를 보장하게 할 필요가 없다.
가능한 빨리 컨테이너를 실행하면 된다.
일부 컨테이너가 의존 관계를 만족하지 못한 상태라면 재 실행되거나 다른 컨테이너로 교체 될 것이다.
이런 방법이면 대 규모 애플리케이션의 경우 완전 동작 상태가 되는데 몇 분 정도 걸린다.
하지만, 그 동안에도 애플리케이션이 동작하며 요청을 처리할 수 있다.
아래는 운영 환경의 클러스터에서 일어나는 컨테이너 생애주기를 나타낸것이다.

애플리케이션의 자기 수복이란 일시적인 오류를 플랫폼이 해소해주는 것이다.
애플리케이션에 메모리 누수를 일으키는 까다로운 버그가 있더라도 플랫폼에서 해당 컨테이너를 메모리를 잃지 않은 새 컨테이너로 대체하면 된다.
버그를 수정하는것은 아니지만 애플리케이션은 계속 동작 할 수 있다.
![Pasted-image-20240115091932.png](/img/이미지 창고/Pasted-image-20240115091932.png)
하지만, HealthCheck와 dependency check에 주의가 필요하다
HealthCheck는 주기적으로 자주 실행되므로, 시스템에 부하를 주는 내용이어서는 안 된다.
자원을 너무 많이 소모하지 않으면서, 애플리케이션이  실질적으로 동작 중인지 검증 할 수 잇는 핵심적인 부분을 테스트 해야한다.
Dependency check는 애플리케이션이 시작 시에만 실행된다.
그러므로 테스트에 소모되는 리소스에 너무 크게 신경 쓸 필요는 없다.
테스트 대상이 빠짐없이 정확하도록 주의해야 한다.
dependency check에서 누락된 의존 관계가 있고, 이 문제를 플랫폼이 해결하지 못한다면, 애플리케이션에도 문제가 생길 것이다.


---

#Container #Docker 

---
