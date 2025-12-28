---
slug: "3-IAM-Roles"
---

# IAM Roles (역할)

## 1. Concept
:::quote IAM Role?
- **IAM Role**은 특정 사람(User)에게 영구적으로 부여된 것이 아닌, **필요할 때 권한을 얻어(Assume)** 사용하는 **임시 자격 증명(Temporary Security Credentials)** 입니다.
- 사용자(User)나 AWS 서비스(Service)가 특정 작업을 수행하기 위해 잠시 "모자"를 쓰는 것과 같습니다.
:::

- **특징**:
	- Password나 Access Key와 같은 장기 자격 증명이 없습니다.
	- Role을 맡으면(Assume Role), 임시 보안 토큰(STS Token)이 발급됩니다.
	- 유효 기간(Session Duration)이 존재합니다.

## 2. Common Use Cases

### IAM Roles for Services (서비스 역할)
AWS 리소스(EC2, Lambda, ECS 등)가 다른 AWS 서비스에 접근할 때 사용합니다.
- **EC2 Instance Profile**: EC2 인스턴스 내의 애플리케이션이 Access Key 없이 S3, DynamoDB 등에 접근할 수 있게 해줍니다.
- **Lambda Execution Role**: Lambda 함수가 실행될 때 필요한 권한(로그 기록, VPC 접근 등)을 제공합니다.

![Pasted-image-20230704093856.png](/img/Pasted-image-20230704093856.png)
1. IAM Role을 생성하고 권한(Policy)을 부여합니다.
2. EC2 인스턴스에 해당 Role을 연결(Instance Profile)합니다.
3. EC2 내부의 SDK/CLI는 자동으로 Role의 임시 자격 증명을 사용하여 API를 호출합니다.

### Cross-Account Access (계정 간 접근)
다른 AWS 계정의 사용자에게 리소스 접근 권한을 부여할 때 사용합니다.
- 예: `Account A`의 User가 `Account B`의 S3 버킷에 접근해야 할 때, `Account B`에 Role을 생성하고 `Account A` User가 이를 Assume하게 합니다.

## 3. Assume Role Process
![Pasted-image-20230221131744.png](/img/Pasted-image-20230221131744.png)
1. **Trust Policy (신뢰 정책)**: 누가(Principal) 이 Role을 맡을 수 있는지 정의합니다. (예: "이 Role은 EC2 서비스만 맡을 수 있다.")
2. **Permission Policy (권한 정책)**: 이 Role을 맡았을 때 무엇을 할 수 있는지 정의합니다. (예: "S3 ListBucket 허용")
3. **STS (Security Token Service)**: `AssumeRole` API를 호출하면 STS가 임시 자격 증명(Access Key, Secret Key, Session Token)을 발급해줍니다.
