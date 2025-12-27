---
slug: "AWS-ECR"
---

[AWS Console](https://aws.amazon.com/ko/free/?trk=fa2d6ba3-df80-4d24-a453-bf30ad163af9&sc_channel=ps&sc_campaign=acquisition&sc_medium=ACQ-P|PS-GO|Brand|Desktop|SU|Core-Main|Core|KR|KR|Text&ef_id=Cj0KCQiAq7COBhC2ARIsANsPATFjdG2RHYhNx9IbSmc4I13SSQkeobHgW55yt77cMeo0m6YetfzNaWYaAhC2EALw_wcB:G:s&s_kwcid=AL!4422!3!563761819834!e!!g!!aws&ef_id=Cj0KCQiAq7COBhC2ARIsANsPATFjdG2RHYhNx9IbSmc4I13SSQkeobHgW55yt77cMeo0m6YetfzNaWYaAhC2EALw_wcB:G:s&s_kwcid=AL!4422!3!563761819834!e!!g!!aws&all-free-tier.sort-by=item.additionalFields.SortRank&all-free-tier.sort-order=asc&awsf.Free%20Tier%20Types=*all&awsf.Free%20Tier%20Categories=*all)
# AWS ECR

## AWS ECR 사용
1. 상단 검색 창에 `ecr` 이라고 검색 후, 아래 `Elastic Container Registry` 클릭
![Pasted-image-20230102133523.png](/img/이미지 창고/Pasted-image-20230102133523.png)

2. Repositorys 클릭
![Pasted-image-20230102133718.png](/img/이미지 창고/Pasted-image-20230102133718.png)

3. 우선 private Repository를 만들기 위해서 `레포지토리 생성`을 누릅니다.
![Pasted-image-20230102133756.png](/img/이미지 창고/Pasted-image-20230102133756.png)

4. 해당 Repository 이름을 작성하고, 아래의 이미지 스캔은 별도의 비용발생 우려로 Disable 상태로 둡니다.
![Pasted-image-20230102133943.png](/img/이미지 창고/Pasted-image-20230102133943.png)
![Pasted-image-20230102134025.png](/img/이미지 창고/Pasted-image-20230102134025.png)

5. 생성 버튼을 누른 후에는 아래와 같이 만들어짐을 볼 수 있습니다.
![Pasted-image-20230102134135.png](/img/이미지 창고/Pasted-image-20230102134135.png)

6. 아래를 클릭하게 된다면, 아무것도 없음을 확인 할 수 있습니다.
![Pasted-image-20230102134220.png](/img/이미지 창고/Pasted-image-20230102134220.png)
![Pasted-image-20230102134230.png](/img/이미지 창고/Pasted-image-20230102134230.png)

7. 푸시 명령 보기를 누르게 된다면
![Pasted-image-20230102134305.png](/img/이미지 창고/Pasted-image-20230102134305.png)
![Pasted-image-20230102134348.png](/img/이미지 창고/Pasted-image-20230102134348.png)
- 위와 동일하게 `docker tag`, `docker push` 명령어를 통해서 ECR에 올리는 방법을 알려줍니다.
- AWS ECR은 aws-cli 설정이 되어있어야 합니다.


---
#Container
#Docker 
#AWS 
#AWS_ECR


---