---
slug: "Cross-Zone-Load-Balancing"
---
# Cross Zone Load Balancing
:::success Cross Zone Load Balancing 적용
- 두 개의 ELB에서 1:1의 트래픽을 보내더라도 10개의 EC2가 있다는 가정 하에, 
- 모든 트래픽을 골고루 분산한다는 가정 하에서 모든 EC2에 10%의 트래픽을 전송합니다.

:::

![Pasted-image-20230830175820.png](/img/이미지 창고/Pasted-image-20230830175820.png)
:::error Cross Zone Load Balancing 미적용
- 1, 2번에 각각 50% 씩 Load Balancing을 한다.
- 그리고 해당 하는 50% 를 각 AZ의 인스턴스마다 아래처럼 분산시킨다.

:::

![Pasted-image-20230906144756.png](/img/이미지 창고/Pasted-image-20230906144756.png)

## Application Load Balancer
- 애플리케이션 로드 밸런서의 경우 기본적으로 교차 영역 로드 밸런싱이 활성화 돼 있습니다.
- 비활성화는 대상 그룹 레벨에서 가능합니다.
- 데이터가 가용 영역으로 넘어가도 요금이 부과 되지는 않습니다.
	- AWS 에서는 보통 데이터가 다른 AZ로 넘어가면, 비용을 내야 하지만, 
	- ALB같은 경우는 CZLB가 기본적으로 활성화 되어있기에,  AZ 교차에 데이터에 대해서는 비용이 부과되지 않습니다.
## Network Load Balancer & Gateway Load Balancer
- 기본적으로 CZLB가 비활성화 되어있습니다.
- 만약 활성화 시에는 요금이 부과 됩니다.

## Classic Load Balancer
- 기본적으로 비활성화 되어있습니다.
- 만약 활성화를 해도 AZ 간 이동하는 데이터에서는 비용이 부과되지 않습니다.

---

#AWS #AWS_LoadBalancer #AWS_CrossLoadBalancer #AWS_DEVLOPER 

---