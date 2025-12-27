---
slug: "Docker-Container"
---

- [Docker Container](#Docker Container)
- [Docker container lifeCycle](#Docker container lifeCycle)
- [Docker container create](#Docker container create)
- [Docker container run](#Docker container run)
		- [옵션](#옵션)
		- [Example](#Example)
	- [Docker container run (백그라운드)](#Docker container run#Docker container run (백그라운드))
		- [실행옵션](#Docker container run (백그라운드)#실행옵션)
		- [Example](#Docker container run (백그라운드)#Example)
	- [Docker container run (재시작)](#Docker container run#Docker container run (재시작))
		- [설정값](#Docker container run (재시작)#설정값)
	- [Docker container run (네트워크 옵션)](#Docker container run#Docker container run (네트워크 옵션))
		- [네트워크 옵션](#Docker container run (네트워크 옵션)#네트워크 옵션)
		- [Example](#Docker container run (네트워크 옵션)#Example)
			- [포트 번호 설정](#Example#포트 번호 설정)
			- [설명](#Example#설명)
		- [DNS 서버 설정 - IP 주소](#Docker container run (네트워크 옵션)#DNS 서버 설정 - IP 주소)
		- [MAC 주소](#Docker container run (네트워크 옵션)#MAC 주소)
		- [DNS 주소 정의](#Docker container run (네트워크 옵션)#DNS 주소 정의)
			- [설명](#DNS 주소 정의#설명)
	- [Docker container stats](#Docker container run#Docker container stats)
		- [Example](#Docker container stats#Example)
		- [결과](#Docker container stats#결과)
	- [Docker container top](#Docker container run#Docker container top)
		- [설명](#Docker container top#설명)
	- [Docker container start](#Docker container run#Docker container start)
		- [옵션](#Docker container start#옵션)
		- [Example](#Docker container start#Example)
	- [Docker container stop](#Docker container run#Docker container stop)
	- [Docker container restart](#Docker container run#Docker container restart)
	- [Docker container rm](#Docker container run#Docker container rm)
	- [Docker container prume](#Docker container run#Docker container prume)
	- [Docker container pause](#Docker container run#Docker container pause)
	- [Docker container unpause](#Docker container run#Docker container unpause)


# Docker Container 명령어

![docker-logo.png](/img/이미지 창고/docker-logo.png)
# Docker container lifeCycle

![Screen-Shot-2022-07-21-at-10.08.26-AM.png](/img/이미지 창고/Screen-Shot-2022-07-21-at-10.08.26-AM.png)
# Docker container create

- Docker 컨테이너를 생성만 한다.

# Docker container run

- Docker container를 생성하고 시작한다.

```bash
docker container run [옵션] 이미지[:태그명][인수]
``` 


### 옵션
  
| 옵션 | 설명 |
| --- | --- |
| `--attach`, `-a` | 표준 입력(stdin), 표준출력 |
| `--cidfile` | 컨테이너 ID를 파일로 출력한다. |
| `--detach`, `-d `| 컨테이너를 생성하고, 백그라운드에서 실행한다. |
| `--interactice`, `-l` | 컨테이너 표준 입력을 연다. |
| `--tty`, `-t` | 단말기 디바이스를 사용한다. |
### Example

```bash
docker container run -it --name "test1" centos /bin/cal
```

- 컨테이너 생성 및 실행
- 콘솔에 결과를 출력하는 옵션
- 컨테이너명
- 이미지명
- 컨테이너에서 실행할 명령
- 설명
    - 먼저 centos라는 이름의 이미지를 바탕으로 test1이라는 이름의 컨테이너를 실행하고
    - 컨테이너 안에서 `/bin/cal` 명령을 실행한다.
    - `/bin/cal` 명령은 Linux의 표준 명령으로 달력을 콘솔에 표시하는 명령이다.

---

## Docker container run (백그라운드)

> docker container run [실행옵션] 이미지명[:태그명] [인수]



### 실행옵션
   
| 옵션 | 설명 |
| --- | --- |
| `--detach`, `-d` | 백그라운드에서  실행 |
| `--user`, `-u` | 사용자 명을 지정 |
| `--restart=[no, on-failure, on-failure:횟수n, always, unless-stopped]` | 명령의 실행 결과에 따라 재시작을 하는 옵션 |
| `--rm` | 명령 실행 완료 후에 컨테이너를 자동으로 삭제 |

### Example
   
```bash
docker container run -d centos /bin/ping localhost
``` 
위의 명령은 centos라는 이름의 이미지를 바탕으로 하여 컨테이너를 생성하고, localhost에 대해 ping명령을 실행한다.
  
```bash
docker container logs -t { 컨테이너 ID }
``` 
위의 명령을 실행하게 된다면 백그라운드에서 실행되고 있는 컨테이너의 로그를 확인 할 수 있다.
   

## Docker container run (재시작)
```bash
docker container run [실행옵션] `--restart` = [설정값] 이미지명[:태그명] [인수]
```
 
### 설정값

| 설정값 | 설명 |
| --- | --- |
| `no` | 재시작 하지 않는다. |
| `on-failure` | 종료 스테이터스가 0이 아닐 때 재시작한다. |
| `on-failure:횟수n` | 종료 스테이터스가 0이 아닐 때 N번 재시작한다. |
| `always` | 항상 재시작한다. |
| `unless-stopped` | 최근 컨테이너가 정지 상태가 아니라면 항상 재시작한다. |

## Docker container run (네트워크 옵션)

```bash
docker container run [네트워크 옵션] 이미지명[:태그명] [인수]
```
### 네트워크 옵션
| 옵션 | 설명 |
| --- | --- |
| `--add-host=[호스트명:IP 주소]` | 컨테이너의 /etc/hosts에 호스트명과 IP주소를 정의 |
| `--dns=[IP 주소]`  | 컨테이너용 DNS 서버의 IP주소 지정 |
| `--expose` | 지정한 범위의 포트 번호 할당 |
| `--mac-address[MAC 주소]` | 컨테이너의 MAC주소를 지정 |
| `--net=[bridge, none, container:<name, id >, host, NETWORK ]`  | 컨테이너의 네트워크를 지정 |
| `--hostname`, `-h` | 컨테이너 자신의 호스트 명을 지정 |
| `--publish`, `-p[호스트의 포트 번호]:[컨테이너의 포트 번호]` | 호스트와 컨테이너의 포트 매핑 |
| `--publish-all`, `-p` | 호스트의 임의의 포트를 컨테이너에 할당 |

### Example

#### 포트 번호 설정
   
```bash
docker container run -d -p 8080:80 nginx
```
 
#### 설명
- ngnix라는 이름의 이미지를 바타응로 컨테이너를 생성하고, 백그라운드에서 실행ㅎ나다.
- 이때 호스트의 포트 번호 8080과 컨테이너의 포트 번호 80을 매핑 시킨다.
- 이 명령을 실행하고 호스트의 8080포트에 액세스 하면 컨테이너에서 작동하고 있는 Nginx(80번 포트)의 서비스에 액세스 할 수 있다.
![Screen-Shot-2022-07-27-at-12.56.49-PM.png](/img/이미지 창고/Screen-Shot-2022-07-27-at-12.56.49-PM.png)


### DNS 서버 설정 - IP 주소

```bash
docker container run -d -dns 192.168.1.1 nginx
```
 DNS 서버를 설정할 때는 위의 명령을 설정함 DNS서버는 IT주소로 지정한다.

 ### MAC 주소

```bash
docker container run -d --mac-address="92:d0:c6:0a:29:33" centos
```
 
### DNS 주소 정의

```bash
docker container run -it --hostname www.test.com --add-host node1.test.com:192.168.1.1 centos
```
 
#### 설명
- 명령을 실행하고 컨테이너 안의 /etc/host 를 확인하면 컨테이너 자신의 호스트명이 www.test1.com과 node1.com(192.168.1.1)으로 정의 되어있음을 확인 가능
- Docker container network 설정
- Docker 에서는 기본적으로 호스트 OS와 bridge 연결을 하지만, `--net` 옵션을 사용하며 아래와 같은 네트워크 설정이 가능하다.
- 자세한 부분은 [Docker NetWork](https://www.notion.so/Docker-Network-6e15c8ecd705465f9b0bc99019d42a57)를 보면 된다

## Docker container stats
```bash
docker container stats [컨테이너 식별자]
```
 

### Example

```bash
docker container stats webserver
```

### 결과

| 항목 | 설명 |
| --- | --- |
| CONTAINER ID | 컨테이너 식별자 |
| NAME | 컨테이녀 명 |
| CPU % | CPU 사용률 |
| MEM USEAGE/LIMIT | 메모리 사용량/컨테이너에서 사용할 수 있는 메모리 제한 |
| MEM % | 메모리 사용률 |
| NET I/O | 네트워크 I/O |
| BLOCK I/O | 블록 I/O |
| PIDS | PID(windows 컨테이너 제외) |


## Docker container top
```bash
docker container top [컨테이너 식별자]
```

### 설명
- 컨테이너에서 실행 중인 프로세스를 확인할 때는 위의 명령어를 사용한다.

## Docker container start
```bash
docker container start [옵션] <컨테이너 식별자> [컨테이너 식별자]
```

### 옵션
  
   
| 옵션 | 설명 |
| --- | --- |
| `--attach`, `-a` | 표준 출력, 표준 오류 출력을 연다. |
| `--interative`, `-i` | 컨테이너의 표준 입력을 연다. |

### Example

```bash
docker container start dbb4bbe0f470~
```
 

## Docker container stop
```bash
docker container stop [옵션] <컨테이너 식별자> [컨테이너 식별자]
```



### 옵션
    
| 옵션 | 설명 |
    | --- | --- |
    | --time, -t | 컨테이너의 정지 시간을 지정(기본 값은 10초) |
### Example
```bash
docker container stop dbb4bbe0f470~
```
   

## Docker container restart

> docker container restart [옵션] \&lt;컨테이너 식별자> [컨테이너 식별자]



### 옵션
| 옵션 | 설명 |
| --- | --- |
| --time, -t | 컨테이터의 재시작시간을 지정(기본값은 10초) |
### Example

```bash
docker container restart -t 2 webserver
```
- 자동 재시작을 원한다면 위의 `docker container run` 에서 `restart` 를 하면 된다. 

## Docker container rm

> docker container rm [옵션] \&lt;컨테이너 식별자> [컨테이너 식별자]


### 옵션

| 옵션 | 설명 |
| --- | --- |
| --force, -f | 실행 중인 컨테이너를 강제로 삭제 |
| --volumes, -v | 할당한 불륨을 삭제 |
### Example
 
```bash
docker container rm dbb4bbe0f470~
```


## Docker container prume

> docker container prume


### 설명
- 정지 중인 컨테이너만을 삭제한다.

## Docker container pause

> docker container pause \&lt;컨테이너 식별자>

- Example
   
```bash
docker container pause webserver
```


## Docker container unpause


> 💡 docker container unpause \&lt;컨테이너 식별자>

- Example  
```bash
 docker container unpause webserver
```

---

#Container #Docker 

---