---
slug: "Sticky-Session"
---
# Sticky Session or Session Affinity
:::tip Sticky Session?
- 고정성 혹은 고정 세션을 실행하는 것으로,
-해당 개념은 로드 밸런서에 2가지 요청을 수행하는 클라이언트가 요청에 응답하기 위해 백엔드가 동일한 인스턴스를 갖는 것입니다.

:::

![Pasted image 20230830171730.png](../../../../../Pasted image 20230830171730.png) 
- Client1이 LB를 거쳐서 동일한 EC2에 가는 것처럼, 확산이 아닌, 고정된 EC2에 지속적으로 트래픽을 보내는 것이다.
- 이러한 동작은 CLB, ALB에서도 설정이 가능합니다.
- 해당 원리는 쿠키를 이용하는 것입니다.
	- 클라이언트에서 로드 밸런서로 요청의 일부로서 전송 되는 것입니다.
	- 고정성과 만료 기간도 존재합니다.
	- 쿠키가 만료되면, 클라이언트가 다른 EC2 인스턴스로 리다이렉션 된다는 것입니다.
- 세션 만료를 사용시에는 
	- 사용자의 로그인과 같은 중요한 정보를 취하는 세션 데이터를 잃지 않기 위해, 
	- 동일한 백엔드 인스턴스와 연결 시킵니다.
- 고정성을 활용하면
	- 백엔드 EC2 인스턴스 부하에 불균형을 초래 할 수 있습니다.
	- 일부 인스턴스는 고정 사용자를 갖게 됩니다.

## Sticky Session - Cookie Names
- 고정 세션에는 2가지 유형의 쿠키가 있습니다.
### Application-based Cookies
- Application 기반 쿠키의 만료 기간은 Application에서 설정할 수 있습니다.
:::quote Custom cookie?
- 대상으로 생성된 사용자 정의 쿠키로, 애플리케이션에서 생성됩니다.
- 애플리케이션에 필요한 모든 사용자 의 속성을 포함할 수 있습니다.
:::

- 쿠키 이름은 각 대상 그룹별로 개별적으로 지정해야하는데, 아래의 이름은 사용하면 안됩니다.
	- **AWSALB**, **AWSALBAPP**, or **AWSALBTG**
	- 위의 예약어는 이미 ELB에서 사용하기 때문입니다.

:::quote Application cookie
- 로드 밸런서 자체에서 생성됩니다.
- ALB의 쿠키 이름은 AWSALBAPP입니다.

:::

### Duration-based Cookies
:::quote Duration-based cookie?
- 로드 밸ㄹ너서에서 생성되는 쿠키
- ALB - AWSALB, CLB - AWSELB 
- 특정 기간을 기반으로 만료되며 그 기간이 로드 밸런서 자체에서 생성되는 것입니다.

:::

---

#AWS #AWS_LoadBalancer #Session #AWS_DEVLOPER 

---