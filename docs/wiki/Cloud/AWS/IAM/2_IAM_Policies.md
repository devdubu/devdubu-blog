---
slug: "2-IAM-Policies"
---

# IAM Policies

## 1. IAM Policy Structure (JSON)
IAM 정책은 JSON 형식으로 정의되며, 다음과 같은 구조를 가집니다.
![Pasted-image-20230629131211.png](/img/Pasted-image-20230629131211.png)

```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "Identifier",
			"Effect": "Allow",
			"Principal": { "AWS": "arn:aws:iam::account-id:user/UserName" },
			"Action": ["s3:ListBucket"],
			"Resource": ["arn:aws:s3:::example_bucket"],
			"Condition": {
				"StringLike": { "s3:prefix": ["home/*"] }
			}
		}
	]
}
```

### 주요 구성 요소
- **Version**: 정책 언어 버전 (보통 `"2012-10-17"` 사용)
- **Statement**: 하나 이상의 권한 규칙 목록
	- **Sid**: (Optional) 문장 식별자
	- **Effect**: `Allow` (허용) 또는 `Deny` (거부)
	- **Principal**: (Resource-based Policy에서) 권한을 부여받는 주체 (User, Role, Account 등)
	- **Action**: 허용하거나 거부할 작업 (예: `s3:PutObject`, `ec2:StartInstances`)
	- **Resource**: 작업이 적용되는 리소스의 ARN (Amazon Resource Name)
	- **Condition**: (Optional) 정책이 적용되는 구체적인 조건 (예: 특정 IP 대역, MFA 인증 여부, 태그 값 등)

:::tip Least Privilege (최소 권한의 원칙)
사용자가 업무를 수행하는 데 꼭 필요한 최소한의 권한만 부여해야 합니다. `*` (모든 권한/리소스) 사용은 자제해야 합니다.
:::

## 2. Policy Types

### Identity-based Policy (신원 기반 정책)
- **Managed Policy (관리형 정책)**:
	- **AWS Managed**: AWS가 미리 생성하고 관리하는 정책 (예: `AdministratorAccess`, `AmazonS3ReadOnlyAccess`)
	- **Customer Managed**: 사용자가 직접 생성하여 관리하는 정책. 재사용 가능하고 버전 관리가 됩니다. **(권장)**
- **Inline Policy (인라인 정책)**:
	- 특정 User나 Role에 직접 1:1로 삽입되는 정책. 재사용이 불가능하며 권한 관리가 어려워 권장되지 않습니다.

### Resource-based Policy (리소스 기반 정책)
- 리소스 자체(예: S3 Bucket, SQS Queue, KMS Key)에 직접 연결하는 정책입니다.
- **Principal** 항목이 필수입니다. (누가 이 리소스에 접근할 수 있는지 정의)
- Identity-based Policy와 Resource-based Policy의 **교집합** (또는 명시적 허용)에 따라 최종 접근 권한이 결정됩니다.

## 3. Policy Inheritance & Logic
![Pasted-image-20230629125325.png](/img/Pasted-image-20230629125325.png)
- User는 자신이 속한 모든 **Group**의 정책을 상속받습니다.
- User에게 직접 연결된 정책도 함께 적용됩니다.
- **Deny Wins**: 명시적 거부(`Deny`)는 모든 허용(`Allow`)보다 우선합니다. 아무런 설정이 없으면 기본적으로 거부(Implicit Deny)입니다.

## 4. Examples

### Example 1: 조건부 거부 (Deny)
Product-Manager가 아닌 모든 사용자에게 S3 PutObject를 거부합니다.
```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "DenyAllButProductManagers",
			"Effect": "Deny",
			"Principal": { "AWS": "*" },
			"Action": ["s3:PutObject"],
			"Resource": ["arn:aws:s3:::productionbucket/*"],
			"Condition": {
				"StringNotEquals": { "aws:PrincipalTag/job-title": "Product-Manager" }
			}
		}
	]
}
```

### Example 2: 태그 기반 제어 (ABAC)
`Env` 태그가 `test`인 EC2 인스턴스에 대해서만 종료/시작/중지를 허용합니다.
```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "AllowOnlyForTestEnvironment",
			"Effect": "Allow",
			"Action": [
				"ec2:TerminateInstances",
				"ec2:StartInstances",
				"ec2:StopInstances"
			],
			"Resource": "arn:aws:ec2:*:*:instance/*",
			"Condition": {
				"StringLike": { "ec2:ResourceTag/Env": "test" }
			}
		}
	]
}
```
