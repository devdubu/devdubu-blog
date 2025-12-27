---
slug: "Docker-Network"
---

- [Docker network](#Docker network)
	- [Docker network ls](#Docker network#Docker network ls)
	- [Docker network create](#Docker network#Docker network create)
	- [Docker network connect / Docker network disconnect](#Docker network#Docker network connect / Docker network disconnect)
	- [Docker network inspect](#Docker network#Docker network inspect)
	- [Docker network rm](#Docker network#Docker network rm)

# Docker network

## Docker network ls


> 💡 docker network ls [옵션]



### 옵션
 
| 옵션 | 설명 |
| --- | --- |
| -f, -filter=[] | 출력을 필터링 한다. |
| --no-trunc | 상세 정보를 출력한다. |
| -q, -quite | 네트워크 ID만 표시한다. |

### Example
 
```bash
docker network ls -q --filter driver=bridge
```
   
### 설명
- bridge 네트워크 ID만을 목록으로 표시하고 싶을 대는 아래의 명령을 실행한다.
- 네트워크를 명시적으로 지정하지 않고 Docker 컨테이너를 시작하면 기본 값인 bridge 네트워크로 Docker 컨테이너를 시작한다.
- 예를 들기 위해
        
```bash
docker contaier un -itd --name=sample ubuntu:lastest
```

- 컨테이너 시작 시에 네트워크를 명시적으로 지정하지 않을 때는 기본값인 브리지 네트워크(이 예시 에서는 d6cb4ce1101bef2310948e9177734a7c193d2696e0dd4d016c2f22c47d79d485 )로 컨테이너가 시작 되는 것을 알 수 있다.
	- overlay network
		- overlay network는 물리 네트워크 상에서 소프트웨어적으로 에큘레이트한 네트워크를 말한다.
        - 물리 네트워크를 덮듯이 가상 네트워크가 구성된다는 점에서 가상 네트워크라고도 부른다.
        - 물리 네트워크의 구조가 은폐되어 그 아래에 있는 물리 계층의 형태나 제어 방식 등을 의식하지 않고 이용할 수 있다는 것이 특징이다.
        - 예를 들어 여러 개의 호스트에 걸친 네트워크를 구성할 때 사용한다.
        - 소프트웨어로 구서오딘 네트워크이므로 물리 작업을 수반하지 않고 자유롭게 구성을 변경할 수 있다는 장점이 있다.

- 결과
	- NETWORK ID
    - NAME
    - DRIVER - bridge, host, none
    - SCOPE

## Docker network create


> 💡 docker network create [옵션] 네트워크

### Example
    
```bash
docker network create --driver=bridge web-network
```
   

### 옵션
 

| 옵션 | 설명 |
| --- | --- |
| `--drvie, -d` | 네트워크 브리지 또는 오버레이(기본값은 bridge) |
| `--ip-range` | 컨테이너에 할당하는 IP주소의 범위를 지정 |
| `--subnet` | 서브넷을 CIDR형식으로 지정 |
| `--ipv6` | IPv6 네트워크를 유효홯 라지 말지(true/false) |
| `--label` | 네트워크에 설정하는 라벨 |

## Docker network connect / Docker network disconnect


> 💡 docker network connet [옵션] 네트워크 컨테이너

### 옵션
    
    
| 옵션 | 설명 |
| --- | --- |
| `--ip` | IPv4의 주소 |
| `--ip6` | IPv6의 주소 |
| `--alias` | 앨리어스명 |
| `--link` | 다른 컨테이너에 대한 링크 |


> 💡 docker network disconnect [옵션] 네트워크 컨테이너

### 옵션
   
| 옵션 | 설명 |
| --- | --- |
| `--ip` | IPv4의 주소 |
| `--ip6` | IPv6의 주소 |
| `--alias` | 앨리어스명 |
| `--link` | 다른 컨테이너에 대한 링크 |

### Example
 
```bash
docker container disconnect web-network webfront
```
   

## Docker network inspect


> 💡 docker network inspect [옵션] 네크워크

### Example
 
```bash
docker network inspect web-network
```
    

## Docker network rm


> 💡 docker network rm [옵션] 네트워크



### Example
   
```bash
docker network rm web-network
```

---

#Container #Docker 

---
