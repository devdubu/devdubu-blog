---
시작 날짜: 2023-11-07
종료 날짜: 2023-11-07
sticker: vault//이미지/미분류/개발로고 SVG/AWS.svg

slug: "Hansol-DevOps-현-상황"
---
# 현재 회사 CI/CD
![한솔 CICD.svg](한솔 CICD.svg)

# 전체적 흐름도
![DevOps-구성.svg](/img/이미지 창고/DevOps-구성.svg)
- 기본 컨셉은 DevOps Account에서 IAM으로 개발자를 관리하는 것에서 나온다.
- 즉, CodeCommit, CodeBuild, CodePipeline, ECR같은 리소스는 DevOps 계정에서 한꺼번에 관리하게 된다.
- 같은 Account 상에서 리소스 연결은 권한 제한은 거의 없음
- 대신, 다른 Account에서 리소스 연결은 제한이 꽤 걸린다.

## 다른 Acount와 연결하는 방법
### DevOps 계정에서 필요한 권한 IAM Role
#### CodePipeline 
- CodeCommit Access
- CodeBuild Access
- Assume Role -> CodeDeploy에 대한 관계
##### 신뢰 관계
- CodePipeline

### DEV Account IAM Role
#### CodeDeploy
- CodeDeploy Access
##### 신뢰 관계
- DevOps 계정의 신뢰 관계

## 옵션
- 멱등성을 지키기 위해서 해당 내용이 필요할 수도 있음

### 네이밍 룰
hspnsiacterraformpoc
hspnsiaccloudformtaionpoc

### CloudFormation

### Terraform

# R&R
- CodeCommit 은 Repo 방식의 Naming Role과 Tag Rule을 따라가면 된다.
- CodeBuild, CodePipeline, CodeDeploy는 어떤 Naming Role과 Tag Rule을 따라 가야 하는지?
- 이를 자산으로 구분하는가?

## IAM
- 


## CI/CD


# ECS 
## ECS Task
### BackEnd
![Pasted-image-20231206162903.png](/img/이미지 창고/Pasted-image-20231206162903.png)
![Pasted-image-20231206162930.png](/img/이미지 창고/Pasted-image-20231206162930.png)


### FrontEnd
![Pasted-image-20231206163016.png](/img/이미지 창고/Pasted-image-20231206163016.png)

![Pasted-image-20231206163027.png](/img/이미지 창고/Pasted-image-20231206163027.png)




