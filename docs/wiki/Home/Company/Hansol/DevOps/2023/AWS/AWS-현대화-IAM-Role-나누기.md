---
시작 날짜: 2023-10-30
sticker: vault//이미지/미분류/AWS Icon/Architecture-Service-Icons_02072025/Arch_Security-Identity-Compliance/32/Arch-AWS-Identity-and-Access-Management-32.svg

slug: "AWS-현대화-IAM-Role-나누기"
---
![HanTemp20230919095434357.jpg](/img/이미지 창고/HanTemp20230919095434357.jpg)
- 현재 IAM Full Access인데, 커스텀 Policy에서 해당 에러 때문에 넘어가지 않는다.
- AccessAnalyzer

# Multi Access Account
Multi AWS Account 권한 부여를 요약하면 다음과 같습니다.

DevOps AWS Account (CodeCommit 이 있는 AWS Account) 에서 하는 작업
1. DevOps AWS Account의 Administrator가 CodeCommit repository를 생성
2. DevOps AWS Account의 Administrator가 CodeCommit에 접근하는 정책(Policy)을 생성
3. DevOps AWS Account의 Administrator가 CodeCommit에 접근하는 역할(Role)을 생성


CodeCommit에 접근하려는 다른 AWS Account에서 하는 작업
1. IAM 그룹 생성
2. DevOps AWS Account가 만든 역할을 부여 받는 정책을 생성해서 IAM 그룹에 추가
3. IAM 그룹에 사용자 추가

![Pasted-image-20230920191123.png](/img/이미지 창고/Pasted-image-20230920191123.png)
- 왜 안되는겨
- principal을 배치할 policy가 어디인가..
- 

```json
{
    "Statement": [
        {
            "Action": [
                "iam:PassRole"
            ],
            "Resource": "*",
            "Effect": "Allow",
            "Condition": {
                "StringEqualsIfExists": {
                    "iam:PassedToService": [
                        "cloudformation.amazonaws.com",
                        "elasticbeanstalk.amazonaws.com",
                        "ec2.amazonaws.com",
                        "ecs-tasks.amazonaws.com"
                    ]
                }
            }
        },
        {
            "Action": [
                "codecommit:CancelUploadArchive",
                "codecommit:GetBranch",
                "codecommit:GetCommit",
                "codecommit:GetRepository",
                "codecommit:GetUploadArchiveStatus",
                "codecommit:UploadArchive"
            ],
            "Resource": "*",
            "Effect": "Allow"
        },
        {
            "Action": [
                "codedeploy:CreateDeployment",
                "codedeploy:GetApplication",
                "codedeploy:GetApplicationRevision",
                "codedeploy:GetDeployment",
                "codedeploy:GetDeploymentConfig",
                "codedeploy:RegisterApplicationRevision"
            ],
            "Resource": "*",
            "Effect": "Allow"
        },
        {
            "Action": [
                "codestar-connections:UseConnection"
            ],
            "Resource": "*",
            "Effect": "Allow"
        },
        {
            "Action": [
                "elasticbeanstalk:*",
                "ec2:*",
                "elasticloadbalancing:*",
                "autoscaling:*",
                "cloudwatch:*",
                "s3:*",
                "sns:*",
                "cloudformation:*",
                "rds:*",
                "sqs:*",
                "ecs:*"
            ],
            "Resource": "*",
            "Effect": "Allow"
        },
        {
            "Action": [
                "lambda:InvokeFunction",
                "lambda:ListFunctions"
            ],
            "Resource": "*",
            "Effect": "Allow"
        },
        {
            "Action": [
                "opsworks:CreateDeployment",
                "opsworks:DescribeApps",
                "opsworks:DescribeCommands",
                "opsworks:DescribeDeployments",
                "opsworks:DescribeInstances",
                "opsworks:DescribeStacks",
                "opsworks:UpdateApp",
                "opsworks:UpdateStack"
            ],
            "Resource": "*",
            "Effect": "Allow"
        },
        {
            "Action": [
                "cloudformation:CreateStack",
                "cloudformation:DeleteStack",
                "cloudformation:DescribeStacks",
                "cloudformation:UpdateStack",
                "cloudformation:CreateChangeSet",
                "cloudformation:DeleteChangeSet",
                "cloudformation:DescribeChangeSet",
                "cloudformation:ExecuteChangeSet",
                "cloudformation:SetStackPolicy",
                "cloudformation:ValidateTemplate"
            ],
            "Resource": "*",
            "Effect": "Allow"
        },
        {
            "Action": [
                "codebuild:BatchGetBuilds",
                "codebuild:StartBuild",
                "codebuild:BatchGetBuildBatches",
                "codebuild:StartBuildBatch"
            ],
            "Resource": "*",
            "Effect": "Allow"
        },
        {
            "Effect": "Allow",
            "Action": [
                "devicefarm:ListProjects",
                "devicefarm:ListDevicePools",
                "devicefarm:GetRun",
                "devicefarm:GetUpload",
                "devicefarm:CreateUpload",
                "devicefarm:ScheduleRun"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "servicecatalog:ListProvisioningArtifacts",
                "servicecatalog:CreateProvisioningArtifact",
                "servicecatalog:DescribeProvisioningArtifact",
                "servicecatalog:DeleteProvisioningArtifact",
                "servicecatalog:UpdateProduct"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "cloudformation:ValidateTemplate"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "ecr:DescribeImages"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "states:DescribeExecution",
                "states:DescribeStateMachine",
                "states:StartExecution"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "appconfig:StartDeployment",
                "appconfig:StopDeployment",
                "appconfig:GetDeployment"
            ],
            "Resource": "*"
        },
	    {
	        "Effect": "Allow",
	        "Action": [
	            "sts:AssumeRole"
	        ],
	        "Resource": [
	            "arn:aws:iam::228525850236:role/External_Connection_Role"
	        ],
	        "Principal": [
			    "arn:"
	        ]
	    }
    ],
    "Version": "2012-10-17"
}
```

운영 계정 -> DevOps 계정
이런 식으로 들여다 볼 때,,,
운영 계정은 AssumeRole을 통해서 DevOpsRole을 할당 받는다.
그러면 DevOps Role은 해당 Principal을 가지고 뭔가를 해야할텐데...이상하게 policy가 적용이 안되네



AWS CodeDeploy 에 대한 아키텍쳐 간단히 그려오기
![Diagram-2.svg](/img/이미지 창고/Diagram-2.svg)

## EC2
`appspec.yaml`
```yaml
version: 0.0
os: linux
# 배포해야 할 디렉토리 혹은 파일을 지정하는 문구이다.
files:
  - source: /
    destination: /hansol/ec2-user/stdweb-compose
    overwrite: yes
  - permissions:
  - object: /hansol/ec2-user/stdweb-compose
    owner: ec2-user
    group: ec2-user
hooks:
# script라는 파일 경로에 해당 script를 넣으면 된다.
# location은 필수 지정이기에, 빠트리면 안된다.
  AfterInstall:
    - location: /hansol/ec2-user/stdweb-compose/docker-compose-update.sh
      timeout: 1000
      runas: ec2-user
```

## ECS
### front
`appspce.yaml`
```yaml
version: 0.0
Resources:
  - TargetService:
      Type: AWS::ECS::Service
      Properties:
        TaskDefinition: "arn:aws:ecs:[AWS리전정보]:[AWS Account id]:task-definiton/[ECS 생성 이름]:[Revision-Number]"
      LoadBalancerInfo:
        "ContainerName" : "stdweb-frontend"
        "ContainerPort" : 8081
```

### back
```yaml
version: 0.0
Resources:
  - TargetService:
      Type: AWS::ECS::Service
      Properties:
        TaskDefinition: "arn:aws:ecs:ap-northeast2:882704992417:task-definiton/[ECS 생성 이름]:[Revision-Number]"
      LoadBalancerInfo:
        "ContainerName" : "stdweb-backend"
        "ContainerPort" : 8080
```

## CodeDeploy 의문점

- Elastic LoadBalancer 애서 Public Subnet의 역할
- Public Subnet이 1개 EC2 여러 개
- Public Subnet 2개 이상 EC2 각 한 대
- ELB에서 HealthCheck을 통해서 Blue/Green 배포를 진행하는가?
	- 해당 부분을 진행한다면 Application에서 어떤 Response를 줘야하는가?
- CodeDeploy는 어떤 방식으로 해당 서비스가 정상적으로 배포 됐다고 판단하는가?
- Auto Scailing을 사용할 때 Blue/Green 배포를 사용 시에, Blue Instance와 Green Instace는 알아서 정해주는 것인가?
- Auto Scailing을 사용하지 않을 시에는 Tag 방식으로 Blue/Green을 구분하는 것이 맞는가?
- Auto Scailing을 사용하게 된다면, 


## Fargate
- 생각보다 싸진 않음
- 오히려 EC2를 사용하지 않을 때는 차라리 끄고 키는 것이 낫다
- 

git credential(IAM)
git remote codecommit - SSO
```bash
git clone codecommit
```
으로 사용한다.

codecommit repo(role principle x) -> 대상 instance에 assume role + principal이 들어가야 한다.




8월 한일
[DevOps R&D] AWS 표준웹 현대화 전체 아키텍쳐 생성
[DevOps R&D] AWS 외부 Account와 연결
	[DevOps R&D]운영 계정 IAM Role 및 Policy 설정
	[DevOps R&D]DevOps 계정 IAM Role 및 Policy 설정
[DevOps R&D]CodePipeline 구성
[DevOps R&D]CodeDeploy 중 무 중단 배포 설정 구성
	