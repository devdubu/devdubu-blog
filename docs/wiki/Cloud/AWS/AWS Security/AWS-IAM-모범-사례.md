---
slug: "AWS-IAM-모범-사례"
---
# AWS 모범 사례 Root Account
- Root Account의 Access Key는 권한 제어를 하면 안된다. 즉, Access Key 자체를 발행하면 위험하다.
	- Root Access Key가 해킹되는 순간 모든 제어 권한이 빼앗기는 것이기에 위험하다.
- Root Account를 지향하도록 하고 최대한 IAM 유저를 할당하여, 작업을 진행하는 것이 올바르다.
- Root 계정은 불가피할 때만, 사용하는 것이기 때문에, 정말 특별한 일 아니면, 들어갈 일 이 없다.
- 그렇기 때문에 해킹에 대한 모니터링을 위해서 아래의 절차를 통해서 Slack으로 알림이 들어오게 설계를 하면 된다.
![Pasted-image-20230221132852.png](/img/이미지 창고/Pasted-image-20230221132852.png)


# AWS 모범 사례 User
- 강력한 암호 정책 사용
- MFA 활성화
- Access Key 공유 X
- Access Key 주기적으로 변경
- 불필요한 Access Key 삭제
	- Password Policy를 설정을 해줘야지, 회사 정책에 맞게끔 셋팅이 가능하다.

# AWS 모범 사례 IAM Policy
- 최소 권한 제공
- Inlmin Policy 사용 X -> Managed Policy
- Inline Policy의 경우 재사용 X시 사용
- 컴플라이언스에 맞는 Policy 설정
	- IP
	- ABAC
	- UserAgent
	- MFA
![Pasted-image-20230221142030.png](/img/이미지 창고/Pasted-image-20230221142030.png)

# AWS 모범 사례 EC2
- Access Key 사용 X -> Role 사용
- IMDSv2 사용
- EKS IRSA(Iam Role for service accounts)
![Pasted-image-20230221144000.png](/img/이미지 창고/Pasted-image-20230221144000.png)
- 위의 사진과 같이 EKS를 쓰기 위해선 하나의 Pod에 각각의 IAM 권한을 할당해야한다.


---

#AWS #AWS_IAM 

---


