---
slug: "Gateway-Load-Balancer"
---
# Gateway Load Balancer
- GWLB는 배포 및 확장과 AWS 의 타사 네트워크 가상 어플라이언스의 플릿 관리에 사용됩니다.
- GWLB는 모든 트래픽 방화벽을 통과하게 하거나 침입 탐지 및 방지 시스템에 사용합니다.
	- IDPS나 심픙 패킷 분석 시스템 또는 일부 payload를 수정할 수 있지만, 네트워크 수준에서 가능합니다.
![Pasted image 20230830100019.png](../../../../../Pasted image 20230830100019.png)
- GWLB는 모든 로드 밸런서보다 낮은 수준에서 실행됩니다.
- IP 패킷 네트워크 계층은 L3입니다.
- 이제 GWLB는 2가지 기능을 갖게 됩니다.
	- Transparendt Network Gateway
		- VPC의 모든 트래픽이 GWLB가 되는 단일 엔트리와 출구를 통과하기 때문입니다.
	- 대상 그룹의 가상 어플라이언스 집합에 전반적으로 그 트래픽을 분산해 로드 밸런서가 됩니다.
- 시험 볼 때, 6081번 포트의 GENEVE 프로토콜을 사용하면 됩니다.
	- 바로 GWLB가 됩니다.
## Target Group
- EC2 인스턴스
- IP Address 
	- private IP 만 가
![Pasted image 20230830171401.png](../../../../../Pasted image 20230830171401.png)

---

#AWS #AWS_LoadBalancer #AWS_GWLB #AWS_DEVLOPER 

---