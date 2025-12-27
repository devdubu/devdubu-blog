---
sticker: vault//이미지/미분류/AWS Icon/Resource-Icons_02072025/Res_Networking-Content-Delivery/Res-Amazon-VPC-NAT-Gateway-48.svg
---
![Pasted-image-20221228105221.png](/img/이미지 창고/Pasted-image-20221228105221.png)

# 로드 밸런서란?

> 서버에 가해지는 트래픽을 여러 대의 서버에 균등하게 분산 시켜주는 역할을 하는 것이 로드밸런서 입니다.
- 트래픽이 적다면, 서버 한개로도 충분히 감당할 수 있습니다.
- 하지만, 트래픽이 하나의 서버가 감당 할 수 없을 정도로 늘어나게 된다면, 해당 서버는 다운 될 것 입니다.
- 해당 문제를 해결하기 위한 문제로 2가지 방안이 있습니다.

![Pasted-image-20221228105955.png](/img/이미지 창고/Pasted-image-20221228105955.png)

## Scale-up
- 단순하게 서버의 인스턴스 성능을 올리는 것을 말합니다.
- 가장 단순하면서도 효과적인 방법입니다.

## Scale-out
- 서버를 여러대로 나눠서 트래픽을 처리 하는 방식을 말합니다.
- 현재 LoadBalancer 방식을 Scale-out 방식입니다.

# Load Balancer Algorithm

## Round Robin Method
![Pasted-image-20221228110413.png](/img/이미지 창고/Pasted-image-20221228110413.png)
- 서버에 들어온 <mark>요청 순서</mark>대로 돌아가며 배정하는 방식입니다.
- 여러 대의 서버가 동일한 스펙을 갖고 있고, 서버와의 연결(세션) 오래 지속되지 않는 경우에 활용하기 적합합니다.




---
**출처**
[[AWS] 로드 밸런서란?](https://yoo11052.tistory.com/63)
[로드밸런서(Load Balancer)의 개념과 특징](https://m.post.naver.com/viewer/postView.naver?volumeNo=27046347&memberNo=2521903)