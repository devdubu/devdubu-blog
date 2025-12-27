---
slug: "AWS-IAM-보안-자동화"
---
# AWS IAM Access-key checker
![Pasted-image-20230221155719.png](/img/이미지 창고/Pasted-image-20230221155719.png)
- event bridge를 통해서 특정 시간대에 점검을 진행하는 것이다.
- 즉, Lambda에 있는 iam policy에 대한 정책들을 내부적으로 특정 시간대의 Lambda릍 투입하여, 점검이 가능하다.

![Pasted-image-20230221155901.png](/img/이미지 창고/Pasted-image-20230221155901.png)
- 다른 방법으로는 security hub를 통해서 Event bridge를 통해서 슬랙으로 해당 챗봇을 알림을 넣는다.


---

#AWS #AWS_IAM 

---
