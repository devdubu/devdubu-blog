---
slug: "Network-Load-Balancer"
---
# Network Load Balancer
- Layer 4 로드 밸런서이므로 TCP와 UDP 트래픽을 처리 할 수 있습니다.
	- 시험에서 UDP, TCP가 나오면 NLB라고 생각하면 된다.
- Network Load Balancer는 굉장한 고성능입니다.
	- 초당 수백 만 건의 요청을 처리할 수 있습니다.
	- 지연시간도 애플리케이션 로드 밸런서 대비 짧습니다.(ALB : 400ms, NLB : ~100ms)
- NLB는 AZ당 하나의 고정 IP만 있다는 점 입니다.
	- 각 AZ에 탄력적 IP를 배정할 수 있습니다.
	- 이건 여러 고정 IP가 있는  애플리케이션을 노출해야 할 때 무척 유용하고 이건 탄력적 IP도 될 수 있습니다.
		- 만약 시험에 애플리케이션이 1개 혹은 서로 다른 2,3개의 IP로만 액세스 가능하다고 나오면, NLB의 옵션을 떠올려야 합니다.
- NLB는 AWS 프리 티어에는 포함돼 있지 않습니다.
![Pasted image 20230830095428.png](../../../../../Pasted image 20230830095428.png)
## Target Group
- EC2 인스턴스
- IP Address - private IP
- Application Load Balancer
- Health checks support the TCP, HTTP and HTTPS Protocol
![Pasted image 20230830095554.png](../../../../../Pasted image 20230830095554.png)
---

#AWS #AWS_LoadBalancer #AWS_NLB #AWS_DEVLOPER 

---