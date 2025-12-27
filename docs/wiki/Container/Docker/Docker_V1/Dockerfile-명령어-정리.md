---
slug: "Dockerfile-명령어-정리"
---
- [명령어](#명령어)
	- [FROM](#명령어#FROM)
- [명령 실행](#명령 실행)
	- [RUN](#명령 실행#RUN)
		- [Shell 형식](#RUN#Shell 형식)
		- [Exec 형식](#RUN#Exec 형식)
	- [CMD](#명령 실행#CMD)
		- [Shell 형식](#CMD#Shell 형식)
		- [Exec 형식](#CMD#Exec 형식)
	- [ENTRYPOINT](#명령 실행#ENTRYPOINT)
		- [Shell 형식](#ENTRYPOINT#Shell 형식)
		- [Exec 형식](#ENTRYPOINT#Exec 형식)
		- [**ENTRYPOINT vs CMD**](#ENTRYPOINT#**ENTRYPOINT vs CMD**)
	- [ONBUILD](#명령 실행#ONBUILD)
		- [Ex)](#ONBUILD#Ex))
		- [STEP 1 베이스 이미지 작성](#ONBUILD#STEP 1 베이스 이미지 작성)
		- [STEP 2 웹 콘텐츠 개발](#ONBUILD#STEP 2 웹 콘텐츠 개발)
		- [STEP 3 웹 서버용 이미지 작성](#ONBUILD#STEP 3 웹 서버용 이미지 작성)
		- [STEP 4 웹 서버용 컨테이너 시작](#ONBUILD#STEP 4 웹 서버용 컨테이너 시작)
	- [STOPSIGNAL](#명령 실행#STOPSIGNAL)
	- [HEALTHCHECK](#명령 실행#HEALTHCHECK)
	- [ENV](#명령 실행#ENV)
	- [key value](#명령 실행#key value)
	- [key=value](#명령 실행#key=value)
	- [WORKDIR](#명령 실행#WORKDIR)
	- [USER](#명령 실행#USER)
	- [LABEL](#명령 실행#LABEL)
	- [EXPOSE](#명령 실행#EXPOSE)
	- [ARG](#명령 실행#ARG)
	- [ADD](#명령 실행#ADD)
	- [COPY](#명령 실행#COPY)
	- [VOLUME](#명령 실행#VOLUME)
	- [](#명령 실행#)
- [BUILD](#BUILD)
	- [Dockerfile 빌드 해보기](#BUILD#Dockerfile 빌드 해보기)
	- [Docker 이미지의 레이어 구조](#BUILD#Docker 이미지의 레이어 구조)
- [Dockerfile의 예시](#Dockerfile의 예시)
	- [개발 환경용 Docker 이미지](#Dockerfile의 예시#개발 환경용 Docker 이미지)
	- [제품 환경용 Docker 이미지](#Dockerfile의 예시#제품 환경용 Docker 이미지)
	- [docker 이미지 빌드](#Dockerfile의 예시#docker 이미지 빌드)
	- [docker 컨테이너 시작하기](#Dockerfile의 예시#docker 컨테이너 시작하기)


# Dockerfile이란

기존의 Docker 명령어들은 Docker의 명령어로 안의 OS의 설정이나 미들웨어의 설치, 파라미터의 설정 등을 수동으로 수행한다.

그리고 만들어진 컨테이너에서 서버를 구축하는 상태를 바탕으로 Docker 이미지를 생성한다.

이에 대한 부분을 각 컨테이너 마다 일일이 작업을 해줘야한다. 이에 대한 피로감으로 이 명령을 하나의 파일로 자동화 시키기위해서 나온 개념이 Dockerfile이다.

Dockerfile은 텍스트 형식의 파일로, 에디터 등을 사용하여 작성한다.

Dockerfile의 명령 인수는 정해져있으며 이에 대한 부분을 습득한다면 큰 어려움 없이 Dockerfile을 작성하실 수 있습니다.

# 명령어

## FROM

>`FROM [이미지명]`
>`FROM [이미지명]:[태그명]`
>`FROM [이미지명]@[다이제스트]`

- 이 FROM 명령은 필수적입니다.
    - FROM에는 Docker 컨테이너를 어떤 Docker이미지로 부터 생성할지라는 정보를 기술 하는 것이다.
    - Docker가 어떤 컨테이너 이미지를 사용하지는지 근간이 되기 때문에 최상위에 적어야한다.

- Ex)
```docker
FROM centos:centos7
```   
- 다이제스트
    - 다이제스트는 Docker Hub에 업로드하면 자동으로 부여되는 식별자를 말합니다.
    - 다이제스트는 고유한 식별지이기 때문에 이미지를 고유하게 지정할 수 있습니다

### 다이제스트 추출 방법

1. 예를 들어 tensorflow에 다이제스트를 추출한다는 가정에서
  
```bash
docker image ls --digests tensorflow/tensorflow
```
를 실행합니다.
![Untitled.png](/img/이미지 창고/Untitled.png)
1. 위 사진에서 DIGEST란에 있는 값을 얻고, Dockerfile에 적용한다.

```docker
FROM tensorflow/tensorflow@sha256:a5c8c8995f16c63a9dbb59e586bed2e15dbf1024ac08065aaaad053c5173f83e
```    

# 명령 실행

- 설명
    - Docker 이미지를 만들려면 필요한 미들웨어를 설치하고 사용자 계정이나 디렉토리를 작성하는 등의 명령을 실행할 필요가 있다.
    - 또한 이미지로부터 컨테이너를 생성했을 때 서버 프로세스 등을 데몬으로서 작동시킬 필요도 있다.
    - 여기선 Dockerfile에서 명령이나 데몬을 실행하는 방법에 대해 설명하려고 합니다.

## RUN

> `RUN [실행하고 싶은 명령]`

- 설명
    - 컨테이너에는 FROM 명령에서 지정한 베이스 이미지에 대해 애플리케이션/미들웨어 설치 및 설정한다, 환경 구축을 위한 명령을 실행한다 등과 같은 명령을 실행할 때는
    - RUN 을 사용한다.
    - Dockerfile을 작성할 때는 이 RUN 명령을 가장 많이 사용한다.

### Shell 형식

---

예시 코드로 ubuntu에서 Nginx를 설치 명령

```docker
# Nginx 설치
RUN apt-get install -y nginx
```

### Exec 형식

---

- 설명
    - Shell형식으로 기술하면 /bin/sh에서 실행된다.
    - 하지만, Exec 형식으로 기술하면 쉘을 경유하지 않고 직접 실행됨
    - 따라서 $HOME과 같은 환경변수를 지정할 수 없다.
    - 또한 다른 쉘을 이용하고 싶을 때는 RUN 명령에 쉘의 경로를 지정한 후 실행하고 싶은 명령을 지정한다
    

```docker
# Nginx 설치
RUN ["/bin/bash", "-c", "apt-get install -y nginx"]
```

- RUN 명령의 예시

```docker
# 베이스 이미지 설정
FROM ubuntu:latest
    
# RUN 명령의 실행
RUN echo 안녕하세요 Shell 형식입니다.
RUN ["echo", "안녕하세요 Exec 형식입니다."]
RUN ["/bin/bash", "-c" "echo '안녕하세요 Exec 형식에서 bash를 사용해보겠습니다.' "]
```

- RUN 명령은 기술된 내용에 따라 순차적으로 실행됩니다.
- Docker 컨테이너에서 실행할 기본 쉘을 변경하고 싶을 때는 SHELL 명령을 사용합니다.

```bash
docker build -t run-sample .
```
![Untitled-1.png](/img/이미지 창고/Untitled-1.png)
    
실행 결과를 확인하게 되면, 
    
- Shell 형식으로 기술한 RUN  명령은 /bin/sh
- Exec 형식을 사용하면, 쉘을 통하지 않고 실행되는 것을 알 수 있습니다.

- 이미지 레이어
Dockerfile을 빌드하면 기술된 명령마다 내부 이미지가 하나씩 저장됩니다. 

그래서 Dockerfile의 명령을 줄이는 방법이 몇가지 고안됩니다.    
- 다중 레이어

```docker
RUN yum -y install httpd
RUN yum -y install php
RUN yum -y install php-mbstring
RUN yum -y install php-pear
```

한편 아래의 예는 하나의 레이어만 생성됩니다.

```docker
RUN yum -y install httpd php php-mbstring php-pear
```

위와 같이 한줄로 쭉 사용하는 것도 좋지만 가독성이 떨어진다. 

그러므로 RUN 명령의 단일 레이어를 작성하려면,

아래와 같이 `\`로 줄바꿈을 하여 작성하는 것이 가독성을 높이는 길이다.

```docker
RUN yum -y install\  
    		httpd\
    		php\ 
    		php-mbstring\
    		php-pear\
```
   

## CMD

:::note
<img src="https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1568959202/noticon/bmsd6jrloxrq4zsmsbnp.png" alt="https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1568959202/noticon/bmsd6jrloxrq4zsmsbnp.png" width="40px" /> CMD [실행하고 싶은 명령]
:::

- 설명
    - 이미지를 바탕으로 생성된 컨테이너 안에서 명령을 실행하려면 CMD 명령을 사용한다
    - Dockerfile에는 하나의 CMD 명령을 기술할 수 있다. 만약 여러 개를 지정하면 마지막 명령만 유효하다
    - 예를 들어 웹 서버를 가동시키기 위한 Nginx를 설치하면 RUN 명령을, 설치한 Nginx를 데몬으로서 컨테이너 안에서 상시 작동시키기 위해서는 CMD 명령을 사용한다.
- 데몬(daemon)?
    - 데몬이란 리눅스 시스템이 처음 가동될 때 실행되는 백그라운드 프로세스의 일종이며, 사용자의 요청을 기다리고 있다가 요청이 발생하면 이에 적절히 디응하는 리스터와 같은 역할을 합니다.
    - 즉, 메모리에 상주하면서 특정 요청이 오면 즉시 대응 할 수 있도록 대기 중인 프로세스를 말합니다.

### Shell 형식

---

```docker
CMD ["nginx", "-g", "daemon off;"]
```

Nginx를 Foreground 형식으로 실행할 때는 위 코드처럼 기술한다.

- Foreground
    - 명령을 앞에서 실행시킨다.
    - 즉, 명령을 실행하는 동안 다른 작업이 불가능
    - BackGround와 반대의 의미

### Exec 형식

---

```docker
CMD nginx -g 'daemon off;'
```

Shell을 통해서 Nginx를 포어 그라운드에서 실행하고 싶을 때 위와 같이 기술

- Ex)

```docker
# 베이스 이미지 설정
FROM ubuntu:16.04

# Nginx 설치
RUN apt-get -y update && apt-get -u upgrade
RUN apt-get -y install nginx

# 포트 지정
EXPOSE 80

# 서버 설정
CMD ["nginx", "-g", "daemon off;"]
```

- 위의 Dockerfile의 예에서는 Ubuntu 16.04를 베이스 이미지, apt로 Nginx를 설치 후 데몬을 실행합니다.
- 또한 웹 서버로서 액세스를 하기 위해서 EXPOSE 명령을 사용하여 80번 포트를 지정합니다.

```bash
docker build -t cmd-sample .
```

- 생성한 이미지에서 컨테이너를 실행합니다. CMD 명령을 사용하여 Nginx 데몬을 실행하도록 설정 되어있으므로,
- 아래의 명령을 사용하여 80번 포트를 호스트 OS로 전송하면 컨테이너가 웹 서버로 작동하고 있다는 것을 알 수 있습니다.

![Untitled-2.png](/img/이미지 창고/Untitled-2.png)


```bash
docker container run -p 80:80 -d cmd-sample
```
![Untitled-3.png](/img/이미지 창고/Untitled-3.png)
![Untitled-4.png](/img/이미지 창고/Untitled-4.png)

## ENTRYPOINT

> `ENTRYPOINT [실행하고 싶은 명령]``



- 설명
    - ENTRYPOINT 명령에서 지정한 명령은,
    - Dockerfile에서 빌드한 이미지로부터 Docker 컨테이너를 시작하기 때문에
    - `docker container run` 명령을 실행했을 때 실행된다.

### Shell 형식

---

```docker
ENTRYPOINT nginx -g 'daemon off;'
```

### Exec 형식

---

```docker
ENTRYPOINT ["nginx", "-g", "daemon off;"]
```

### **ENTRYPOINT vs CMD**

- ENTRYPOINT와 CMD는 겉으로 보면 데몬을 실행한다는 것에서 똑같아 보일 수 있습니다.
- 하지만 차이점은 `docker container run` 명령을 실행 시의 동작에 있습니다.

**CMD**

- 컨테이너 시작시에 실행하고 싶은 명령을 정의해도 `docker container run` 명령 실행 시에 인수로 새로운 명령을 지정한 경우 이것을 우선 실행합니다.
- 즉, 명령을 덮어 쓸수 있습니다.
- Ex)

```docker
# Docker 이미지 취득
FROM ubuntu:16.04

# top 실행
ENTRYPOINT ["top"]
CMD ["-d", "10"]
```

터미널에서는

```bash
docker container run -it sample

docker container run -it sample -d 2
```
    
    위의 코드는 10초 간격으로 재 시작, 아래의 코드는 2초 간격으로 재시작한다.
    
    즉, CMD 명령은 덮어씌울 수 있다. 하지만, ENTRYPOINT는 무조건 기술되어 있으면 실행된다.
    

## ONBUILD

:::note
<img src="https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1568959202/noticon/bmsd6jrloxrq4zsmsbnp.png" alt="https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1568959202/noticon/bmsd6jrloxrq4zsmsbnp.png" width="40px" /> ONBUILD [실행하고 싶은 명령]
:::

- 설명
    - ONBUILD 명령은 그 다음에 빌드에서 실행할 명령을 이미지 안에 설정하기 위한 명령이다.
    
    **Ex)** 
    
    1. Dockerfile에 ONBUILD 명령을 사용하여 어떤 명령을 실행하도록 설정하여 빌드하고 이미지를 작성한다.
    2. 해당 이미지를 다른 Dockerfile에서 베이스 이미지로 설정하여 빌드했을 때 ONBUILD 명령에서 지정한 명령을 실행 시킬 수 있다.
    - 이 ONBUILD 명령을 사용하면 웹 어플리케이션의 실행 환경을 구축할 수 있다.
    

### Ex)

### STEP 1 베이스 이미지 작성

```docker
# 베이스 이미지 설정
FROM ubuntu:17.10

# Nginx 설치
RUN apt-get -y update && apt-get -y upgrade
RUN apt-get -y install nginx

# 포트 지정
EXPOSE 80

# 웹 콘텐츠 배치
ONBUILD ADD website.tar /var/www/html

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
```

이 Dockerfile.base 라는 이름으로 하고 아래의 명령으로 빌드합니다. docker build 명령을 사용하여 파일 명을 지정할 때는 -f 옵션은 파일명을 지정합니다.

```bash
docker build -t web-base -f Dockerfile.base .
```

### STEP 2 웹 콘텐츠 개발

샘플로 HTML 파일 CSS파일, 그림 파일 등을 website라는 이름으로 하여 tar 명령을 사용하여 하나로 모읍니다.

### STEP 3 웹 서버용 이미지 작성

이 이미지에는 STEP 1에서 작성한 베이스 이미지를 FROM 명령으로 지정합니다.

```docker
# Docker 이미지 취득
FROM web-base
```

![Screen-Shot-2022-08-29-at-8.28.36-PM.png](/img/이미지 창고/Screen-Shot-2022-08-29-at-8.28.36-PM.png)

이런 형태로 파일을 배치 후에,

```bash
docker build -t photoview-image .
```

이로써 photoview-image라는 이름의 이미지가 생성된다.

### STEP 4 웹 서버용 컨테이너 시작

```bash
docker container run -d -p 80:80 photoview-image
```

브라우저(localhost:80)을 액세스하게 된다면 로컬에 있는 애플리케이션이 전개되는 것을 확인할 수 있다.

이와 같이 인프라 구축 관련된 이미지 작성과 애플리케이션 전개와 관련된 이미지 생성을 나눌 수 있다.

- ONBUILD 명령 설정 확인하기
    
    ONBUILD 명령이 설정되어있는지 확인하는 방법은 `docker image inspcet` 를 작성하면 되고, 아래의 코드처럼 확인하면 된다
    
    Ex)
    
    ```bash
    docker iamge inspect --format="{{ .Config.OnBuild }}" web-base
    ```
    
- ONBUILD 명령을 사용한 팀 개발의 예
    - 애플리케이션 개발 현장에서는 여러 사람이 팀으로 협력하면서 진행하는 경우가 많다.
    - 팀 멤버가 각각 Dockerfile을 작성하고 이미지를 작성한다면 Docker를 도입했는데도 애플리케이션 실행환경이 제각각 될 우려가 있다.
    - 그래서 개발팀 안에 실행 환경 Dockerfile을 작성할 담당자를 정한 후 그 담당자가 OS/미들웨어의 설치나 설정, 라이브러리의 검증이나 도입 등을 하고 베이스가 되는 Dockerfile을 만든다.
    - 웹 콘텐츠 개발자는 이 베이스가 되는 Dockerfile을 바탕으로 각자 개발한 소스코드를 전개하여 테스트를 하면, 팀 멤버 전원이 똑같은 실행 환경에서 개발과 테스트를 진행할 수 있다.
    - 베이스가 되는 Dockerfile을 작성한는 담당자는 인프라 기술과 애플리케이션 개발 기술 모두 정통한 엔지니어 적임자입니다.
    - 팀 개발을 할 때의 개발 폴리시가 정해져있는 경우는 그 룰 안에 베이스가 되는 Dockerfile을 바탕으로 하는 이미지로부터 생성한 컨테이너에서 테스트한다는 것을 정해두는 것도 좋다.
    - 또한 Dockerfile은 Git을 사용하여 팀 내에서 공유다고 버전을 관리할 수 있으므로 설명 Dockerfile을 작성하는 담당자가 정해져있어도 그 사람에게 의존해버릴 가능성이 낮아진다.
    

## STOPSIGNAL

:::note
<img src="https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1568959202/noticon/bmsd6jrloxrq4zsmsbnp.png" alt="https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1568959202/noticon/bmsd6jrloxrq4zsmsbnp.png" width="40px" /> STOPSIGNAL [시그널]
:::

- 설명
    - 컨테이너를 종료할 때 송신하는 시그널을 설정하면서 STOPSIGNAL 명령을 사용한다.
    - STOPSIGNAL 명령에는 시그널 번호 또는 시그널명(SIGKILL 등)을 지정할 수 있다.

## HEALTHCHECK

:::note
💡 HEALTHCHECK [옵션] CMD 실행할 명령
:::

- 설명
    - 컨테이너 안의 프로세스가 정상적으로 작동하고 있는지를 체크하고 싶을 때는 HEALTCHECK 명령을 사용한다.
    - HEALTHCHECK 명령에서는 Docker에 대해 컨테이너 상태를 어떻게 확인 할지를 설정한다.

- 옵션

| 옵션           | 설명         | 기본값 |
| ------------ | ---------- | --- |
| --interval=n | 헬스 체크 간격   | 30s |
| --timeout=n  | 헬스 체크 타임아웃 | 30s |
| --retries=N  | 타임아웃 횟수    | 3   |

	
- Ex)
    
    ```bash
    HEATHCHECK --interval=5m --timeout=3m CMD curl -f http://lcoalhost/ || exit 1
    ```
    
    헬스 체크의 결과는 `docker container inspect` 명령으로 확인 할 수 있다.
    
    ```bash
    docker container inspect webap
    ```
    

## ENV

:::note
💡 ENV [key] [value]
ENV [key]=[value]
:::

- 설명
    - Dockerfile 안에서 환경변수를 설정하고 싶을 때는 ENV 명령을 다음 두 서식 중에 하나로 기술 한다.

## key value

---

```docker
ENV myName "Shiho ASA"
ENV myOrder Gin Whisky Calvados
ENV myNickName miya
```

- 설명
    - 단일 환경변수에 하나의 값을 설정한다. 첫 번째 공백 앞을 key로 설정하면 그 이후는 모두 문자열로 취급한다.
    - 공백이나 따옴표와 같은 문자를 포함하는 것도 문자로 취급한다.
    
    즉,
    
| 키 명        | 값                   |
| ---------- | ------------------- |
| myName     | Shiho ASA           |
| myOrder    | Gin Whisky Calvados |
| myNickName | miya                |

## key=value

---

```docker
ENV myName="Shiho ASA"
		myOrder=Gin\ Whisky\ Calvados\
		myNickName=miya
```

- 설명
    - 여기서는 하나의 ENV 명령으로 여러 개의 값을 설정하므로 만들어지는 Docker 이미지는 하나이다.
    - 변수 앞에 \를 추가하면 이스케이프 처리를 할 수 있다.
    - 예를 들어 \$myName은 $myName이라는 리터럴로 치환 가능하다.
    - ENV 명령으로 지정한 환경 변수는 컨테이너 실행 시의 `docker container run` 명령의 `--env` 옵션을 사용하면 변경 가능하다.
    

## WORKDIR

:::note
💡 WORKDIR [작업 디렉토리 설정]
:::

- 설명
    - Dockerfile에서 정의한 명령을 실행하기 위한 작업용 디렉토리를 지정하려면 WORKDIR 명령을 설정하면 됩니다.
    - WORKDIR 명령은 Dockerfile에 쓰여있는 다음과 같은 명령을 실행하기 위한 작업용 디렉토리를 지정합니다.
        - RUN
        - CMD
        - ENTRYPOINT
        - COPY
        - ADD
    - 만일 지정한 디렉토리가 존재하지 않으면, 새로 작성한다.
    - 또한 WORKDIR 명령은 Dockerfile 아에서 여러번 사용 가능하다.
    - 상대 경로로 지정한 경우 이전 WORKDIR 명령의 경로에 대한 상대 경로가 된다.
- Ex)
    - Dockerfile에서 아래와 같이 지정하면 마지막 줄 실행후 /first/second/third 가 출력된다.
        
        ```docker
        WORKDIR /first
        WORKDIR second
        WORKDIR third
        RUN ["pwd"]
        ```
        
    - WORKDIR 명령에서 지정한 환경 변수를 사용할 수 있다. 예를 들면 Dockerfile에서 아래와 같이 지정하면 마지막 줄 실행 후 /first/second가 출력된다.
        
        ```docker
        ENV DIRPATH /first
        ENV DIRNAME second
        WORKDIR $DIRPATH /$DIRNAME
        RUN ["pwd"]
        ```
        

## USER

:::note
💡 USER [사용자명/UID]
:::

- 설명
    - 이미지 실행이나 Dockerfile의 다음과 같은 명령을 실행하기 위한 사용자를 지정할 때는 USER 명령을 사용한다.
        - RUN
        - CMD
        - ENTRYPOINT
    - USER 명령에서 지정하는 사용자는 RUN 명령으로 미리 작성해 놓을 필요가 있다.
    

- Ex)
    
    ```docker
    RUN ["adduser", "asa"]
    RUN ["whoami"]
    USER asa
    RUN ["whoami"]
    ```
    
    - 위의 예에서는 RUN 명령으로 asa라는 사용자 미리 작성
    - USER명령에서 asa를 설정
    - 두번째 RUN 명령을 asa라는 계정으로 실행한다.
    - 이 Dockerfile을 빌드하면, 첫번째는 `whoami` 명령은 `root`이지만,
    - 두번째 `whoami` 명령은 `asa`로 되어있다.
    - whoami
        - 사용자명을 표기하기 위한 Linux 명령어

## LABEL

```docker
LABLE <키 명>=<값>
```
 

- Ex)
    
    ```docker
    LABEL maintainer "Shiho ASA<asashiho@mail.asa.seoul>"
    LABEL title="WepAP"
    LABEL version="1.0"
    LABEL description="This image is WebApplicationServer"
    ```
    
    - 이 명령을 바탕으로 Dockerfile을 빌드하여 생성된 sample이라는 이름의 이미지의 상세 정보를 확인하면, 아래와 같이 LABLE 명령으로 지정한 정보가 설정된다.
    
    ```bash
    docker image inspect --format="{{ .Config.Labels }}" label-sample
    ```
    
    또한 구 버전의 Docker에서는 Dcokerfile의 작성자를 기술 할 때 MAINTAINER 명령을 사용했지만, 이 명령은 권장하지 않는다. → LABEL 명령 권장
    

## EXPOSE

```docker
EXPOSE <포트 번호>
```


- 설명
    - 컨테이너의 공개 포트 번호를 지정할 때는 EXPOSE 명령을 사용한다.
    - EXPOSE 명령은 Docker에서 실행 중인 컨테이너가 listen하고 있는 네트워크를 알려준다.
    - 또한 `docker container run` 명령의 -p  옵션을 사용할 때 어떤 포트를 호스트에 공개할지를 정의한다.
- Ex)
    
    ```docker
    EXPOSE 8080
    # 8080 포트 공개
    ```
    

## ARG

```docker
ARG <이름>[=기본값]
```


- 설명
    - Dockerfile 안에서 사용할 변수를 정의할 때는 ARG 명령을 사용한다.
    - ARG 명령을 사용하면 변수의 값에 따라 생성되는 이미지의 내용을 바꿀 수 있다.
- Ex)
    
    ```docker
    # 변수의 정의
    ARG YOURNAME="asa"
    RUN echo $YOURNAME
    ```
    
    - 이 Dockerfile을 빌드할 대 `--build-arg` 옵션을 붙여 ARG 명령에서 지정한 YOURNAME에 shiho라는 값을 설정하고 아래의 명령을 실행한다.
    
    ```bash
    docker build . --build-arg YOURNAME=shiho
    ```
    
    - `--build-arg` 옵션을 붙이지 않고, docker build 명령을 실행했을 때는 아래와 같이 ARG 명령에서 지정한 기본값(위 예를 들어 asa)이 전개 된다.
    
    ```bash
    docker build .
    ```
    

## ADD

```docker
ADD <호스트의 파일 경로> <Docker 이미지의 파일 경로>
ADD [”<호스트의 파일 경로>” “<Docker 이미지의 파일 경로>”]
```



- 설명
    - ADD 명령은 호스트 상의 파일이나 디렉토리, 원격 파일을 Docker 이미지 안으로 복사한다.
- Ex)
    
    ```docker
    ADD host.html /docker_dir/
    # docker 이미지 안에 docker_dir라는 디렉토리 안에 host.html 이라는 파일을 넣는 명령어
    
    ADD hos* /docker_dir
    # hos로 시작하는 모든 파일을 추가
    
    ADD hos?.txt /docker_dir
    #hos+[임의의 한 문자] 룰에 해당하는 파일을 추가함
    ```
    
    ```docker
    WORKDIR /docker_dir
    # WORKDIR 명령으로 docker_dir을 지정
    ADD host.html web/
    # docker_dir안에 있는 web이라는 디렉토리에 host.html을 복사함
    ```
    

- URL
    
    ```docker
    ADD http://www.wings.msn.to/index.php /docker_dir/web
    # 이처럼 추가 하고 싶은 코드가 url이라면
    ```
    
    - 추가한 파일의 퍼미션은 600(사용자만 읽기 쓰기 가능)이 된다.
    - If 취득한 원격 파일이 HTTP Last-Modified Header를 갖고 있다면, 추가된 파일에서 mtime의 값으로 사용된다.
        - HTTP Last-Modified 헤더
            - HTTP에서 콘텐츠의 데이터를 마지막으로 갱신한 날짜의 타임스탬프를 말한다.
    - ADD 명령은 인증을 지원하지 않는다
        - 원격 파일의 다운로드에 인증이 필욯나 경우는 RUN에서 wget명령이나 curl명령을 사용해야한다.

- URL Ex)
    
    ```docker
    ADD http://www.wings.msn.to/index.php /docker_dir/web
    # 위의 url로 다운로드하여 Docker이미지 안 docker_dir/web 위치에 파일을 추가시킨다.
    # 만약 파일이 tar 아카이브거나 압축 포맷이면 자동으로 압출을 푼다
    # 단, 원격 url로부터 다운로드한 리소스는 압축이 풀리지 않음
    ```
    
- 빌드에 불필요한 파일 제외
    - Docker에서 빌드를 하면 빌드를 실행한 디렉토리 아래에 있는 모든 파일이 Docker 데몬으로 전송 된다.
    - 그렇게 때문에 빌드에서 제외하고 싶은 파일이 있는 경우 .dockerignore이라는 이름의 파일 안에 해당 파일명을 기술하기 바란다.
    - 여러 개의 파일을 지정할 때는 줄 바꿈을 해서 파일 명을 나열한다.
    - 빌드 컨텍스트상에 Dockerfile과 Dummyfile을 저장하고, dockerignore 안에 Dummyfile을 지정한다.
    
    이 환경에서 아래의 Dockerfile을 만든다. Dockerfile안에는 dummyfile을 이미지에 포함시키는 ADD명령을 기술한다.
    
    ```docker
    # 베이스 이미지 지정
    FROM ubuntu:latest
    
    # 더미 파일 배치
    ADD dummyfile /tmp/dummyfile
    ```
    
    그 다음 docker build 명령을 실행하여 sample이라는 이름의 이미지를 만든다.
    
    로그를 확인하면 dummyfile이 존재하지 않기 때문에 오류가 발생한다는 것을 알 수 있다.
    
    .dockerignore 파일 설정해 두면 빌드에 불필요한 파일이 전송되지 않기 때문에 처리 속도가 빨라진다.
    
    이와 같이 불팔요한 파일은 Docker의 빌드 대상에서 제외하는 설정을 해두는 것이 좋다.
    

## COPY

```docker
COPY <호스트의 파일경로> <Docker 이미지의 파일 경로>
COPY [”<호스트의 파일 경로>” “<Docker 이미지의 파일 경로>”]
```


- 설명
    - ADD 명령과 COPY 명령은 매우 비슷하다
    - COPY 명령은 호스트상의 파일을 이미지 안으로 복사처리만 한다.
        - 하지만 ADD는 원격 파일 다운, 아카이브 압축 해제를 해주는 기능이 있음
    - 단순히 파일을 Docker 이미지 안에 배치하는 행위는 COPY를 사용함
- Dockerfile의 저장 위치
    - Dockerfile로부터 이미지를 만들때,
    - `docker build` 명령은 Dockerfile을 포함하는 디렉토리(서브디렉토리를 포함한다)를 모두 Docker 데몬으로 전송
    - 예를 들어 시스템의 루트 디렉토리를 소스 리포지토리로 사용한 경우는,
    - 루트 디렉토리의 모든 콘텐츠를 Docker 데몬으로 전송하기 때문에 처리가 느려집니다.
    - 그래서 Dockerfile의 저장 위치는 빈 디렉토리를 만들고 거기에 Dockerfile을 놓아두고 이미지를 작성하는 방법을 권장한다.
    - Docker의 빌드에 필요 없는 파일은 Dockerfile과 똑같은 디렉토리에 두지 않도록 주의 하는 것이 좋다.

## VOLUME


>💡 `VOLUME [”/마운트 포인트”]``



- 설명
- 이미지에 볼륨을 할당하려면 VOLUME 명령을 사용한다
- VOLUME 명령은 지정한 이름의 마운트 포인트를 작성하고, 호스트나 그 외 다른 컨테이너로부터 볼륨의 외부 마운트를 수행한다.

```docker
VOLUME ["/var/log"]
# Json 배열
VOLUME /var/log
VOLUME /var/log /var/db
# 위 처럼 여러개의 인수도 가능
```

- 컨테이너는 영구 데이터를 저장하는데 적합하지 않다. 그래서 영구 저장이 필요한 데이터는 컨테이너 밖의 스토리지에 저장해야지 적합하다.
- 영구 데이터는 Docker의 호스트 머신 상의 볼륨을 마운트하거나 공유 스토리지를 볼륨으로 마운트 하는 것이 가능하다.

## #

```docker
# 이 기호는 주석이다.
# 여타 다른 언어들 처럼 주석이 가능하다.
```

# BUILD

## Dockerfile 빌드 해보기
![Untitled-5.png](/img/이미지 창고/Untitled-5.png)

원하는 위치에 Dockerfile을 만들면 된다. 우선 필자는 dockerfile를 해당 폴더 경로에 넣었다.

![Untitled-6.png](/img/이미지 창고/Untitled-6.png)
vi를 이용해서 간단하게 

```docker
FROM centos:centos7
```

이라고 적어주고 저장한다.

그리고 후에는 
![Untitled-7.png](/img/이미지 창고/Untitled-7.png)
```bash
docker build -t [이미지명:버전] [Dockerfile의 절대경로 위치]
```



를 작성해준다. 현재 필자 폴더의 환경에서 예시를 적게 되면

```bash
docker build -t sample:1.0 /mnt/c/Users/hansol/Desktop/MyDataGram/docker
```

왼쪽과 같은 화면이 나올 것이다. 그리고 Docker에서 정상적으로 이미지가 완성이 됐는지 확인하려면 `docker image ls` 를 작성해서 확인하면 된다.

- 정상적으로 출력된 이미지의 예시
![Untitled-8.png](/img/이미지 창고/Untitled-8.png)
한번 다운 받은 이미지는 다시 다운받지 않고, 해당 이미지의 ID를 사용한다.

## Docker 이미지의 레이어 구조

Dockerfile을 빌드하여 Docker 이미지를 작성하면 Dockerfile의 명령별로 이미지를 작성합니다.

예시 코드는
![Untitled-9.png](/img/이미지 창고/Untitled-9.png)
```docker
#STEP 1 Ubuntu(베이스 이미지)
FROM ubuntu:latest

#STEP 2 Nginx 설치
RUN apt-get update && apt-get install -y -g nginx

#STEP 3 파일 복사
COPY . /usr/share/nginx/html 

# ^ 필자 기준
#COPY index.html /usr/share/nginx/html/ (책 기준)

#STEP 4 Nginx 시작
CMD ["nginx", "-g", "daemon off;"]

```
![Untitled-10.png](/img/이미지 창고/Untitled-10.png)
빌드를 하는 방법은 현재 디렉토리에 Dockerfile 이 있다면 굳이 절대 경로를 사용하지 않고 . 으로 설정할 수 있다.

```bash
docker build -t webap .
```

# Dockerfile의 예시

```docker
# 1. Build Image
FROM golang:1.8.4-jessie AS builder

# Install dependencies
WORKDIR /go/src/github.com/asashiho/greet
RUN go get -d -v github.com/urfave/cli

# Build modules
# COPY main.go . -> 현재는 오류가 난다.
COPY . .
RUN GOOS=linux go build -a -o greet .

#--------------------------------------------
# 2. Production Image
FROM busybox
WORKDIR /opt/greet/bin

# Deploy modules
COPY --from=builder /go/src/github.com/asashiho/greet
ENTRYPOINT ["./greet"]
```

## 개발 환경용 Docker 이미지

---

여기서는 개발용 언어 Go의 버전 1.8.4를 베이스 이미지로 하여 작성, builder 라는 별명을 붙인다.

이 소스 코드를 go build 명령으로 빌드하여 greet이라는 이름의 실행 가능 바이너이 파일을 작성

## 제품 환경용 Docker 이미지

---

제품 환경용 Docker 이미지의 베이스 이미지로는 busybox를 사용합니다.

- BusyBox?
    - 기본적인 Linux 명령들을 하나의 파일로 모아놓은 것
    - 최소한으로 필요한 Linux 쉘 환경을 제공하는 경우 이용함
    

그 다음 개발용 환경의 Docker 이미지로 빌드한 greet 이라는 이름의 실행 가능 바이너리 파일 제품 환경용 Docker 이미지로 복사한다. 

이때 `--form` 옵션을 사용한 builder라는 이름의 이미지로부터 실행 가능 바이너리 파일을 실행하는 명령을 적는다.

제품 환경에서는 부하에 따라 작동하는 컨테이너 수가 바뀝니다. 따라서 가능 한 용량이 적은 이미지를 사용하면서 시스템 전체의 컴퓨팅 리소스를 효율적으로 활용이 가능합니다.

## docker 이미지 빌드

```bash
docker build -t greet .
```

빌드의 로그를 확인해보면 먼저 Docker Hub에서 개발용 환경 베이스 이미지인 golang:1.8.4-jessie 를 다운로드하고, 

그것을 바탕으로 개발 환경용 이미지 builder 가 생성된다.

이 builder 이미지로 소스코드를 빌드하여 실행 가능 바이너리 파일을 생성하고 있다.  → 이 코드는 에러가 있으므로 참고용으로만 봐주시길 바랍니다.

## docker 컨테이너 시작하기

```docker
docker container run 
```


---

#Container #Docker 

---
