---
slug: "AWS-IAM-1"
---
# AWS IAM
- AWS Identity Access Managerment
- AWS 리소스 접근 제어
 ![Screenshot-2023-01-15-at-11.09.56-PM.png](/img/이미지 창고/Screenshot-2023-01-15-at-11.09.56-PM.png)
- 특정 AWS 서비스에 접근할 수 있게 해주는 것이 IAM입니다.

## AWS Identity
- AWS Identity의 종류는 아래의 3가지 정도가 됩니다.

### Root Account
- Administer
- AWS web console & AWS API의 모든 것을 컨트롤 할 수 있다.

### IAM - User, Role
- (제한된)AWS web console & AWS API

### STS(Security Token Service)
- (제한된)AWS web console & AWS API
- life-time
	- 특정 시간, 특정 기간에서만 접근이 가능한 계정이다.


## AWS 사용
- AWS를 사용하는 방법은 두가지 정도가 된다.

### AWS console 이용
![Screenshot-2023-01-15-at-11.15.37-PM.png](/img/이미지 창고/Screenshot-2023-01-15-at-11.15.37-PM.png)
- 위와 같은 방식으로 Web Console을 통해서 온라인 GUI를 통해서 관리하는 방법이 있습니다.

### API 사용
![Screenshot-2023-01-15-at-11.16.38-PM.png](/img/이미지 창고/Screenshot-2023-01-15-at-11.16.38-PM.png)
- Signature 암호화를 통해서 AWS 인증을 받게 됩니다.
- AWS CLI, Terraform, AWS SDK 등등 
	- Signature V4를 통해서 인증 및 사용을 하게 됩니다.
![Screenshot-2023-01-15-at-11.18.31-PM.png](/img/이미지 창고/Screenshot-2023-01-15-at-11.18.31-PM.png)
- 위의 경우와 같이 API를 사용 시에 인증을 통해서 인증 받고 AWS 접근 하고,
- 해당 접근 시에 Access Management를 해주는 것이 결국 IAM이 해주는 역할이다.

## AWS IAM Policy
- AWS 서비스와 리소스에 대한 인가 기능 제공
![Screenshot-2023-01-15-at-11.19.32-PM.png](/img/이미지 창고/Screenshot-2023-01-15-at-11.19.32-PM.png)

### AWS IAM Policy 제공

#### SCP(Service Control Policy)
- AWS Orgainzations 내 정책
	- AWS에서 해당 계정에 대한 모든 권한 그룹에 대한 정책
- OU or AWS Account 레벨에서의 정책

#### Permission Policy, Permission Boundary
- IAM User, Role 에 대한 정책
- Boundary : IAM User, Role 에 할당된 권한 제한
	- 특정 서비스(Boundary)에 모든 권한(Permission)을 가지고 있음

#### Session Policy
- sts, Federation 시 권한 제어

#### Resource-based Policy
- Identity가 아니라 AWS Resource 자체의 권한 제어
- 해당 기능을 지원하는 서비스
	- S3, SQS, KMS, ECR

#### Endpoint Policy

### AWS IAM Policy - Json Format
![Screenshot-2023-01-15-at-11.19.32-PM.png](/img/이미지 창고/Screenshot-2023-01-15-at-11.19.32-PM.png)
#### Effect
- Allow, Deny

#### Principle
- 대상을 정의한다
![Screenshot-2023-01-15-at-11.31.05-PM.png](/img/이미지 창고/Screenshot-2023-01-15-at-11.31.05-PM.png)

#### Action
- 어떤 행위에 대한 것을 작성한다.
```json
"Action" : "iam : *AccessKey*"
```

#### Resource
- 무엇을 지정하는가
```json
"Resource" : "arn:aws:s3:::DOC-EXAMPLE-BUCKET/*/test/*"
```

#### Condition
- 위에서 권한을 할당 할 때 줄 수 있는 조건들을 개시하는 것
```json
"Condition" : { "{condition-operatior} : { "{condtion-key}" : "{condtion-value}" }}
```

##### 참조 사이트
[ref. AWS Policy Condition](https://docs.aws.amazon.com/ko_kr/IAM/latest/UserGuide/reference_policies_elements_condition_operators.html)

### AWS IAM Policy Example1
```json
{ 
	"Version" : "2012-10-17",
	"Statement" : [
		{
			"Sid" : "DenyAllButProductManagers",
			"Effect" : "Deny",
			"Principal" : {
				"AWS" : "*",
			},
			"Action" : [
				"s3 : PutObject"
			],
			"Resource" : [
				"arn:aws:s3:::productionbucket/*"
			],
			"Condition" : {
				"StringNotEquals" : {
					"aws:PrincipalTag/job-title" : "Product-Manager"
				}
			}
		}
	]
}
```
- AWS 모든 유저들이 S3에 Put하는 것을 Effect에서 거부한다
- Resource는 해당 S3의 위치를 말합니다.
- 그리고 Condtion에서 해당 조건을 말 합니다.
	- AWS tag에서 Product Manager라는 Tag를 갖고 있지 않는 모든 자들은 S3에 Put을 하는 것을 거부한다.


### AWS IAM Policy Example2
```json
{ 
	"Version" : "2012-10-17",
	"Statement" : [
		{
			"Sid" : "AllowOnlyForTestEnvironment",
			"Effect" : "Allow",
			"Action" : [
				"ec2:TerminateInstances",
				"ec2:StartInstances",
				"ec2:StopInstances"
			],
			"Resource" : "arn:aws:ec2:*:*:instace/*",
			"Condition" : {
				"StringLike" : {
					"ec2:ResourceTag/Env" : "test"
				}
			}
		}
	]
}
```
- ec2의 Terminate와 Start, Stop하는 행위를 Allow 한다.
- 해당 Tag에 test라는 Tag가 있을 때만 허용한다는 뜻이다.

---

#AWS #AWS_IAM 
#AWS_Security 

---












