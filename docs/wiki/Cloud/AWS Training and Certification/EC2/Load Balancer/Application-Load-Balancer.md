---
slug: "Application-Load-Balancer"
---
## Application Load Balancer(v2)
- 7계층 즉, HTTP 전용 로드 밸런서
- 머신 간 다수 HTTP 애플리케이션의 라우팅에 사용이 됩니다.
	- 이러한 머신들은 대상 그룹이라는 그룹으로 묶이게 됩니다.
- 동일 EC2 인스턴스 상의 여러 애플리케이션의 부하를 분산합니다.
	- Container, ECS
- HTTP/2와 WebSocket을 지원하고, Redirects도 지원하기에, HTTP에서 HTTPS로 자동 Redirect도 가능합니다.
- 경로 라우팅도 가능합니다.
- target 그룹에 따른 라우팅으로는
	- URL 대상 경로에 기반한 라우팅이 가능합니다.
	- URL HostName으로도 라우팅 가능합니다.
		- Ex) one.example.com / other.example.com
	- 쿼리 문자열과 헤더에 기반한 라우팅도 가능합니다.
		- Ex) example.com/users?id=123&order=false
:::tip ALB는 마이크로 서비스나 컨테이너 기반 애플리케이션에 가장 좋은 로드밸런서이다.
- ECS와 Container에 가장 적합한 LB이다.

:::

![Pasted-image-20230829173046.png](/img/이미지 창고/Pasted-image-20230829173046.png)

:::question Target Group?
- EC2 인스턴스가 대상 그룹이 될 수 있습니다. - HTTP
- 이들은 Auto Scaling Group으로 관리 될 수 있습니다.
- ECS의 task가 될 수 있습니다 - HTTP
- Lambda functions이 될 수도 있지만 잘 알려진 내용은 아닙니다.- HTTP 
- ALB는 IP 주소들의 앞에도 위치할 수 있다.

:::

![Pasted-image-20230830084500.png](/img/이미지 창고/Pasted-image-20230830084500.png)
- 위의 경우에는 Target Group이 EC2와 온프레미스로 이루어져 있습니다.
	- 해당의 경우에 사설 IP를 앞 단에 가지고 와서 ALB와 연동 시켜야 합니다.
- 위의 사진을 보게 된다면 queryString으로도 ALB를 이용해서 트래픽을 분산 시킬 수도 있습니다.
:::tip ALB의 알아두면 좋은 점
- hostname이 고정 되어 있습니다.
- 애플리케이션 서버는 클라이언트의 IP를 직접 보지 못하며, 클라이언트의 실제 IP는 X-Forwarded-For라고 불리는 헤더에 삽입됩니다.
- X-Forworded-Port를 사용하는 포트와 X-Forwarded-Proto에 의해 사용되는 프로토콜도 얻게 됩니다.

:::

![Pasted-image-20230830085053.png](/img/이미지 창고/Pasted-image-20230830085053.png)
- 즉, 클라이언트 IP는 ALB에 들어간 순간 EC2 인스턴스에는 닿지 않습니다.
- 하지만, EC2 인스턴스가 클라이언트의 IP를 알고 싶다면, HTTP 요청에 있는 추가 헤더인 X-Forwarded-Port와 Proto를 확인해야 합니다.

---

#AWS #AWS_LoadBalancer #AWS_ALB #AWS_DEVLOPER 

---