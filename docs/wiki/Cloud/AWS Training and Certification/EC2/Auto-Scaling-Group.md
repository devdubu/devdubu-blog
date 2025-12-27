---
slug: "Auto-Scaling-Group"
---
# Auto Scaling Group
![Pasted-image-20231204103212.png](/img/이미지 창고/Pasted-image-20231204103212.png)
>[!question | orange] Auto Scaling Group?
>- 웹 사이트 or 애플리케이션을 배포하면서 시간이 지나면서 로드가 변할 수 있다.
>- AWS에서는 EC2 인스턴스 생성 API 호출로 아주 빠르게 서버를 생성하고, 제거 할 수 있다.
>- 이를 자동화 하고 싶다면 ASG를 사용한다.

>[!tip | blue] Auto Scaling Group의 목표
>- <mark>Scale Out</mark>
>	- EC2 인스턴스를 추가해서 늘어난 로드를 맞춥니다.
>- <mark>Scale in</mark>
>	- EC2 인스턴스를 삭제하여 줄어든 로드를 맞춥니다.

- 전체적으로 매개변수를 저으이해서 ASG에서 언제든 실행할 수 있는 최소 및 최대 EC2 인스턴스 수를 정할 수도 있습니다.
- ASG의 강력한 기능 중 하나는, 로드 밸런서와 연결하면 ASG에 포함된 EC2 인스턴스가 로드 밸런서에 연결 된다는 점 입니다
- 어떤 인스턴스가 비 정상이라고 여겨진다면, 이것을 종료하고 새 EC2 인스턴스를 만들어 대체하는 것입니다.
- ASG는 무료이며, 그 아래에 생성되는 EC2인스턴스와 같은 리소스에 대해서만 비용을 내면 됩니다.
![Pasted-image-20231204104349.png](/img/이미지 창고/Pasted-image-20231204104349.png)
- `Minimum Capacity` : 최소 용량, ASG에 필요한 최소 인스턴스 수를 설정합니다.
- `Desired Capacity` : 희망 용량, ASG에 희망 인스턴스 수를 설정합니다.
- `Maximum Capacity` : 최대 용량, ASG에 필요한 최대 인스턴스 수를 설정합니다.
	- 원하는 용량을 늘려도 최대 용량 이상으로 늘리지 못한다.
![Pasted-image-20231204104620.png](/img/이미지 창고/Pasted-image-20231204104620.png)
- ASG는 Load Balancer와도 함께 작동됩니다.
- 가령 ASG에 등록된 인스턴스가 4개라면, ELB는 즉시 모든 인스턴스에 트래픽을 분산합니다
- 그렇다면, 사용자는 Load Balancer 웹 사이트에 접속 할 수 있습니다.
- 상태 확인 결과는 ASG에 전달 될 수 있습니다.
- 로드 밸런서가 EC2 인스턴스를 비정상이라고 여기면 ASG가 인스턴스를 종료할 수 도 있습니다.
- 또한 스케일 아웃, 즉 EC2 인스턴스를 추가하면 당연히 ELB가 여기에도 트래픽을 보내 부하를 분산시킵니다.
- 그래서 Load Balancer와 Auto Scaling Group을 사용하면, 유용하게 사용할 수 있습니다.

# Auto Scaling Group Attributes
- 이제 ASG를 생성하기 위한 속성 면에서, 시작 템플릿을 만들어야합니다.
![Pasted-image-20231204111716.png](/img/이미지 창고/Pasted-image-20231204111716.png)
- 시작 템플릿에서는 ASG에서 EC2 인스턴스를 시작하는 방법에 관한 정보가 있습니다.
---

#AWS 

---