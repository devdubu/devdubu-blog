---
slug: "SSL-인증서"
---
# SSL/TLS

:::question SSL?
- SSL은 <mark>보안 소켓 계층</mark> 이라는 뜻이며, 연결을 암호화 할 때 사용됩니다.

:::

:::question TLS?
- SSL의 새 버전이며, <mark>전송 계층 보안</mark>을 의미 합니다.

:::

- 클라이언트와 로드 밸런서 사이엥서 트래픽이 전송되는 동안 암호화 되도록 해줍니다.
	- 전송 중 암호화라고 불립니다.
- 데이터가 네트워크를 통과하는 중에는 암호화되어 있고, 발신자와 수신자만 해독할 수 있습니다
- 요즘은 TLS 인증서가 주로 사용되지만, **여전히 많은 사람들이 이것을 SSL**이라고 부릅니다.
- 퍼블릭 SSL 인증서는 인증 기관(CA)에서 발행하고, 이 기관에는 Comodo, Symantec, GoDaddy, Globalsign, Digicert 등이 있습니다.
- Load Balancer에 첨부된 퍼블릭 SSL 인증서를 활용하면 클라이언트와 Load Balancer 사이의 연결을 암호화 할 수 있습니다.
	- 예를 들어 Google 혹은 그 외 웹 사이트에 접속 했을 때 <mark>자물쇠</mark> 내지는 <mark>초록색 자물쇠</mark> 표시가 있으면, 트래픽이 암호화 됐다는 의미 입니다.
- SSL 인증서에는 사용자가 정한 만 날짜가 있으며, 인증서의 진위를 확인하기 위해 주기적으로 갱신 해야합니다.
![Pasted-image-20231204084552.png](/img/이미지 창고/Pasted-image-20231204084552.png)
>[!question | orange] LoadBalancer 측면에서는 어떻게 작동할까?
>- 사용자는 HTTPS를 통해 연결하는데, `S` 가 붙었기 때문에 안전하다는 얘기가 됩니다.
>- 그런 후 공용 인터넷을 통해 Load Balaner에 연결합니다.
>- 내부적으로 Load Balancer는 SSL 종료라는 걸 합니다.
>- 백엔드는 HTTP를 통해 EC2 인스턴스와 통신합니다.
>- Load Balancer는 X.509 인증서를 로딩하는데, SSL 혹은 TLS 서버 인증서라 불립니다.
>- AWS에서는 ACM(AWS 인증서 매니저)을 활용해 이 SSL 인증서를 관리할 수 있습니다.
>- 원하면 ACM에 인증서를 업로드 할 수 있습니다.
>- HTTPS 리스너를 설정할 때는 기본 인증서를 지정해줘야 합니다.
>	- 인증서 목록을 추가해 여러 도메인을 지원할 수 있습니다.
>	- 클라이언트는 SNI라는 걸 활용해 도달하려는 호스트 이름을 지정할 수 있습니다.
>	- 원하는 경우에는 HTTPS에 특정 보안 정책을 설정해서 레거시 클라이언트라고도 부르는 SSL과 TLS의 구 버전을 지원할 수도 있습니다.

# SNI - Server Name Indication
- SNI는 하나의 웹 서버에 여러 SSL 인증서를 로드해 웹 서버가 여러 웹 사이트를 지원하게 만드는 방법입니다.
- 클라이언트가 초기 SSL 핸드혜이크에서 대상 서버의 호스트 이름을 표시해야 하는 새 프로토콜 입니다.
- 클라이언트가 **이 웹 사이트와 연결하고 싶다** 고 하면 서버는 어떤 인증서를 로드 해야 하는지 알 수 있습니다.

>[!warning | gold] 모든 클라이언트가 이걸 지원하는 것은 아닙니다.
>- 더 최신 세대의 ALB와 NLB, CloudFront에서 적용됩니다.
>- 구세대인 Classic Load Balancer에서는 사용하지 않습니다.
>- 따라서 Load Balancer에 여러 SSL 인증서가 표시되면 ALB나 NLB를 떠올리면 됩니다.

![Pasted-image-20231204094422.png](/img/이미지 창고/Pasted-image-20231204094422.png)
- ALB는 몇 가지 규칙에 따라 이 대상 그룹으로 라우팅 되며, 이 경우 규칙은 호스트 이름에 직접 연결 될 수 있습니다.
- ALB에는 각 대상 그룹에 맞는 각각의 SSL 인증서가 있습니다.
- 이제 클라이언트가 우리 ALB에 연결하며 `www.mycopr.com`를 원한다고 합니다.
	- 이게 SNI의 일부 입니다.
- ALB는 클라이언트가 원하는 바를 파악 했고, 이에 맞는 SSL 인증서를 활용해서 트래픽을 암호화 합니다.
- 규칙 덕분에 `mycorp.com` 이라는 올바른 대상 그룹으로 리디렉션하는 방법도 압니다.
- ALB에 연결하여 `Domain1.example.com`을 월하는 클라이언트에게도 알맞은 SSL 인증서를 로드해야 맞는 대상 그룹과 연결해줄 겁니다.
- 서버 이름 표시, 즉, SNI를 사용하면 다른 SSL 인증서를 사용하는 서로 다른 웹 사이트를 위한 여러 대상 그룹을 가질 수 있습니다.

# SSL Certificates
## Classic Load Balancer(v1)
- Classic Load Balancer는 하나의 SSL 인증서만 지원합니다.
- 여러 SSL 인증서로 여러 호스트 이름을 사용하고 싶으면 Classic Load Balancer를 여러 개 사용하면 됩니다.

## Application Load Balancer(v2)
- 여러 SSL 인증서로 여러 리스터를 지원 할 수 있습니다.
- 여기서는 SNI를 활용하면 됩니다.

## Network Load Balancer(v2)
- 여러 SSL 인증서로 여러 리스터를 지원 할 수 있습니다.
- 여기서는 SNI를 활용하면 됩니다.


---

#AWS #AWS_LoadBalancer #SSL 

---

