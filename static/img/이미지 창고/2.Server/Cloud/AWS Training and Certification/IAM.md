- [IAM : User & Group](#IAM : User & Group)
	- [Root Account](#IAM : User & Group#Root Account)
	- [User](#IAM : User & Group#User)
	- [Group](#IAM : User & Group#Group)
- [IAM : Permissions](#IAM : Permissions)
	- [User & Group](#IAM : Permissions#User & Group)
		- [User로 로그인 하는 방법](#User & Group#User로 로그인 하는 방법)
- [IAM Policies inheritance](#IAM Policies inheritance)
	- [IAM Policies Structure](#IAM Policies inheritance#IAM Policies Structure)
		- [Version](#IAM Policies Structure#Version)
		- [Id](#IAM Policies Structure#Id)
		- [Statement](#IAM Policies Structure#Statement)
			- [Sid](#Statement#Sid)
			- [effect](#Statement#effect)
			- [principal](#Statement#principal)
			- [Action](#Statement#Action)
			- [Resource](#Statement#Resource)
			- [Conditions](#Statement#Conditions)
- [IAM Password Policy](#IAM Password Policy)
	- [Password Policy](#IAM Password Policy#Password Policy)
	- [MFA](#IAM Password Policy#MFA)
	- [MFA devices options in AWS](#IAM Password Policy#MFA devices options in AWS)
		- [Virtual MFA device](#MFA devices options in AWS#Virtual MFA device)
		- [Universal 2nd Factor(U2F) Security Key](#MFA devices options in AWS#Universal 2nd Factor(U2F) Security Key)
		- [Hardware Key Fob MFA Device](#MFA devices options in AWS#Hardware Key Fob MFA Device)
		- [Hardware Key Fod MFA Device for AWS GovCloud(US)](#MFA devices options in AWS#Hardware Key Fod MFA Device for AWS GovCloud(US))
- [How can users access AWS](#How can users access AWS)
	- [Example Make Access Key](#How can users access AWS#Example Make Access Key)
	- [What's the AWS CLI](#How can users access AWS#What's the AWS CLI)
- [What's the AWS SDK?](#What's the AWS SDK?)
- [CloudShell](#CloudShell)
- [IAM Roles for Services](#IAM Roles for Services)
	- [실습](#IAM Roles for Services#실습)
- [IAM Security Tools](#IAM Security Tools)
	- [IAM Credential Reportss(account-level) - IAM 자격 증명 보고서](#IAM Security Tools#IAM Credential Reportss(account-level) - IAM 자격 증명 보고서)
	- [IAM Access Advisor(user-level) - IAM 액세스 관리자](#IAM Security Tools#IAM Access Advisor(user-level) - IAM 액세스 관리자)
	- [실습](#IAM Security Tools#실습)
		- [IAM 액세스 관리자](#실습#IAM 액세스 관리자)
- [IAM Guidelines & Best Practices](#IAM Guidelines & Best Practices)

# IAM : User & Group
:::quote IAM?
- Identity and Access Management, **Global** Service

:::

## Root Account
- 기본적으로 계정을 생성할 때 생성되는 계정
- 만든 후에는 사용도, 공유도 해서는 안된다.
- 사용자를 생성할 때만 사용해야 한다

## User
- 하나의 사용자는 조직 내의 한 사람에 해당 됩니다.
- 필요하다면, 사용자를 그룹에 묶을 수도 있습니다.

## Group
- 오직 User만 포함 시킬 수 있습니다, Group을 포함 시킬 수는 없습니다.
- Group에 포함 되어 있지 않는 User도 있습니다.

![Pasted image 20230629110941.png](../../../Pasted image 20230629110941.png)
# IAM : Permissions
- 왜 User와 Group으로 나눌까?
- 이유인 즉, AWS 계정을 사용하면서 <mark>권한</mark>을 주기 위함이다.
## User & Group
- JSON 형태로 해당 User, Goup을 구성할 수 있다.
	- 이를 정책  & IAM 정책 이라고 불린다.
![Pasted image 20230629111330.png](../../../Pasted image 20230629111330.png)
- 어떤 작업에 권한을 가지고 있는지 JSON의 형태로 설명해 놓은 것 입니다.
	- 해당 JSON은 EC2, ElasticLoadBalancing, CloudWatch의 describe가 허용된 상태 입니다.
- 이 정책을 사용해 사용자들의 권한을 정의 할 수 있게 됩니다.
- 새로운 사용자가 너무 많은 실행을 하여, 큰 비용이 발생할 수 도 있고, 보안적 이슈가 발생할 수도 있기에, 따라서 AWS에서는 최소 권한의 원칙을 적용합니다.
	- 사용자가 꼭 필요로 하는 것 이상의 권한을 주지 않는 것이 원칙입니다.

- AWS IAM 설정에서 Tag 값은 Department -> 부서명을 쓸 수도 있고, Identity를 할 수 있는 모든 Name을 사용해도 된다.

### User로 로그인 하는 방법
-  IAM 대시보드 홈에 왼쪽 상단에는 계정에 대한 압축된 정보가 있습니다.
![Pasted image 20230629130336.png](../../../Pasted image 20230629130336.png)
- 해당 계정ID는 복잡한 숫자로 구성되어있다.
- 이러한 복잡한 숫자는 구별하기 어렵기 때문에, 아래와 같이 계정 별칭을 지정해서 문자로 
![Pasted image 20230629130430.png](../../../Pasted image 20230629130430.png)
- 위의 별칭은 고유하기 때문에 다른 User가 사용할 수 없습니다.

# IAM Policies inheritance
![Pasted image 20230629125325.png](../../../Pasted image 20230629125325.png)
- 위와 같은 구조로 IAM Policy를 구성하게 된다면,
	- Alice, Bob, Charles는 **Developers**에 대한 Policy를 **상속** 받습니다.
	- David, Edward는 **Operations**에 대한 다른 Policy를 **상속** 받습니다.
	- Fred 처럼 아무 Group에 속하지 않을 수도 있습니다.
	- 만약 감사 팀에 Charles, David가 속한다면, **Audit Team**의 Policy를 **추가적으로 상속** 받게 됩니다.

## IAM Policies Structure
![Pasted image 20230629131211.png](../../../Pasted image 20230629131211.png)
- 위의 구조는 IAM Policy의 JSON 파일 구조입니다.
### Version
- <span style={{color: 'red'}}>정책 언어의 버전을 설정합니다 보통은 "2012-10-17" 입니다.</span>

### Id
- <span style={{color: 'orange'}}>정책을 식별하는 ID이다.</span>
- <span style={{color: 'orange'}}>해당 사항은 선택사항이다.</span>

### Statement
- <span style={{color: 'brown'}}>문장의 구성 요소이다.</span>
- <span style={{color: 'brown'}}>해당 사항은 필수 사항이다.</span>

#### Sid
- <span style={{color: 'orange'}}>Sid는 문장 ID로 문장의 식별자 역할을 한다.</span>
- <span style={{color: 'orange'}}>해당 사항은 선택사항이다.</span>

#### effect
- <span style={{color: '#FFBF00'}}>문장의 특정 API 접근 하는 것을 허용 할지에 대한 내용입니다.</span>
- <span style={{color: '#FFBF00'}}>오른쪽에 Allow, Deny가 뜰 수 도 있다.</span>

#### principal
- <span style={{color: 'teal'}}>계정, 유저, role등 해당 정책이 적용되는 것을 적는 란 이다. </span>
- <span style={{color: 'teal'}}>해당 예시에서는 AWS 계정의 루트 계정에 적용이 된 것입니다.</span>

#### Action
- <span style={{color: 'purple'}}>effect를 기반해 허용 및 거부되는 API 호출의 모음입니다.</span>

#### Resource
- <span style={{color: 'green'}}>적용될 action의 리소스의 목록으로 해당 예시에서는 bucket으로 되었지만, 다른 것들이 될 수 있습니다.</span>

#### Conditions
- <span style={{}}>Statement가 언제 적용 될 지를 결정하는 Condition이 있습니다. </span>
- <span style={{}}>해당 사항은 옵션입니다. </span>

# IAM Password Policy
- 그룹과 사용자들의 정보가 침해당하지 않으려면, 두 가지의 방어 메커니즘이 존재한다.

## Password Policy
:::tip 첫번째 방법은 비밀번호 정책의 정의 입니다.
- 비밀번호가 강력할 수록 계정의 보안이 철저해지기 때문입니다.
:::

- AWS에서는 다양한 옵션을 이용해 비밀번호 정책의 생성이 가능합니다.
:::example 비밀번호 정책
- 특정 문자 요구
- 대문자 필수
- 소문자 필수
- 숫자 필수
- 특수 문자 필수
- IAM User의 비밀번호 교체 유무
- 특정 기간이 지나면, 비밀 번호 만료 후 새 비밀번호 요구
- 사용자가 비밀번호 변경 시 이전 사용 비밀번호를 막는다.

:::

## MFA
:::tip Multi Factor Authentication
- AWS에서는 거의 필수적으로 사용하라고 권고되고 있다.
:::

- AWS User들은 많은 것들을 할 수 있습니다.
	- 특히 관리자의 경우에는 리소스 삭제, 추가 등등을 할 수 있습니다.
	- 그렇기 때문에 관리자 계정의 경우에는 반드시 보호의 대상이며, 전체 IAM 사용자들도 예외는 아닙니다.
:::note MFA?
- 비밀번호와 본인 소유의 보안 장치를 같이 사용하는 인증 방식을 말합니다.
- 비밀번호만 사용하는 것보다는 훨씬 안전합니다.

:::

![Pasted image 20230630092803.png](../../../Pasted image 20230630092803.png)
- 해당 로그인 방식은, 만약 비밀번호가 누출된 상태에서도 로그인을 위해서는 휴대폰과 같이 Alice의 물리적인 장치가 추가적으로 필요하기 계정이 침해 받지 않습니다.

## MFA devices options in AWS

### Virtual MFA device
![Pasted image 20230630093137.png](../../../Pasted image 20230630093137.png)
- **Google Authenticator**
	- 오직 하나의 디바이스에서만 가능합니다.
- **Authy**
	- 여러개의 디바이스에서 가능합니다.


### Universal 2nd Factor(U2F) Security Key
![Pasted image 20230630093227.png](../../../Pasted image 20230630093227.png)
- Yubico 사의 YubiKey가 있습니다.
- Yubico는 AWS 제공 장치가 아닌 3rd party 제품을 제공합니다.
- 하나의 보안 키에서 여러 루트 계정과 IAM 사용자 지원합니다


### Hardware Key Fob MFA Device
![Pasted image 20230630093246.png](../../../Pasted image 20230630093246.png)
- Gemalto의 제품입니다.


### Hardware Key Fod MFA Device for AWS GovCloud(US)
![Pasted image 20230630093253.png](../../../Pasted image 20230630093253.png)
- 만약 미국 정부의 클라우드인 AWS GovCloud를 사용한다면
- 위 처럼 보이는 특수 키 팝이 필요합니다.

# How can users access AWS
:::tip AWS 접근하기 위한 3가지 방안
- AWS Manangment Console( 비밀번호와 MFA 인증을 통한 로그인 )
- AWS Command Line Interface(CLI)(access key를 통해서 인증)
- AWS Software Developer Kit(SDK)(access key를 통해서 인증)
:::

- AWS AccessKey는 AWS Console에서 생성합니다.
- 사용자는 access key를 본인들이 관리하게 됩니다.
- Accesskey는 패스워드처럼 비밀 키이므로, 공유하면 절대 안된다.

## Example Make Access Key
![Pasted image 20230630095211.png](../../../Pasted image 20230630095211.png)

## What's the AWS CLI
- AWS CLI는 CLI 명령어를 이용해서 AWS 서비스들과 상호작용할 수 있게 해주는 것을 의미한다.
- CLI를 사용하면 AWS 서비스의 공용 API로 직접 액세스가 가능합니다.

![Pasted image 20230630095321.png](../../../Pasted image 20230630095321.png)

# What's the AWS SDK?
![Pasted image 20230704090435.png](../../../Pasted image 20230704090435.png)
- AWS Software Development Kit(AWS)
- 특정 언어로 된 라이브러리의 집합입니다.
	- 따라서 프로그래밍 언어에 따라 개별 SDK가 존재합니다.
- 해당 방식을 통해서도 AWS 서비스나 API에 프로그래밍을 위한 액세스가 가능하도록 해줍니다.
- SDK는 터미널에서 사용하는 것이 아닌, 코딩을 통해 애플리케이션 내에 심어 두어야 합니다.
- **SDK**
	- JavaScript, Python, PHP, .NET, Ruby, Java, Go, Nodejs, C++
	- Mobile SDKs(Android, iOS, ...)
	- IoT Device SDK(Embedded C, Arduino, ...)

# CloudShell
![Pasted image 20230704092103.png](../../../Pasted image 20230704092103.png)
- Cloud Shell 자체에서는 Terminal 처럼 지원하기 때문에, 굳이 local terminal을 사용하지 않아도 된다.
![Pasted image 20230704092339.png](../../../Pasted image 20230704092339.png)
- 위처럼 AWS 명령어도 잘 동작하고 있다.
![Pasted image 20230704092423.png](../../../Pasted image 20230704092423.png)
- 위 환경 설정에는 다양한 옵션들이 존재하기에, 해당 옵션을 통해서 원하는 설정을 가지고 가면 된다.
- 자체 내장 저장소가 있기 때문에, 아래와 같이 파일 업로드 및 다운로드가 가능하다.
![Pasted image 20230704092544.png](../../../Pasted image 20230704092544.png)

# IAM Roles for Services
- 몇몇 AWS service들은 우리를 대신해서, 우리 계정으로 이용해 작업을 수행합니다.
- AWs 서비스에 권한을 할당 해야 하고, 이를 위해 **IAM 역할** 이라는 것을 생성 해야 합니다.
	- IAM 역할은 사용자와 유사하지만, 실제 사용자가 사용하는 것이 아니라, AWS 서비스가 사용하는 것입니다.
![Pasted image 20230704093856.png](../../../Pasted image 20230704093856.png)
- 예를 들면, AWS EC2와 AWS에 있는 Resorce를 접근 할 때는 해당 IAM Role을 체크해서, AWS Resource에 Access를 하게 된다.
- 대표적인 예시는
	- EC2 Instance Roles
	- Lambda Function Roles
	- Roles for CloudFormation

## 실습
- 역할은 AWS의 엔티티가 단기간 동안 자격 증명을 얻고 필나 작업을 할 수 있게 해줍니다.
![Pasted image 20230704095712.png](../../../Pasted image 20230704095712.png)
![Pasted image 20230704100052.png](../../../Pasted image 20230704100052.png)
- 이외 나머지는 시험과 실습에 필요가 없다.
- AWS Service 역할을 만들 수 있다는 것을 알면 된다.
- 아래에서 가장 일반적인 사용 사례는 두가지 입니다.
	- EC2 인스턴스 또는 Lambda함수에 대한 역할을 만드는 것입니다.
![Pasted image 20230704100336.png](../../../Pasted image 20230704100336.png)

![Pasted image 20230704100422.png](../../../Pasted image 20230704100422.png)
- 위의 정책을 설정하면 EC2 인스턴스가 IAM을 읽을 수 있다.
![Pasted image 20230704100528.png](../../../Pasted image 20230704100528.png)
![Pasted image 20230704100552.png](../../../Pasted image 20230704100552.png)
# IAM Security Tools
## IAM Credential Reportss(account-level) - IAM 자격 증명 보고서
- 보고서는 계정에 있는 사용자 다양한 자격 증명의 상태를 포함합니다.


## IAM Access Advisor(user-level) - IAM 액세스 관리자
- 액세스 관리자는 사용자에게 부여된 서비스의 권한과 해당 서비스에 마지막으로 액세스한 시간이 보입니다.
	- 최소 권한의 원칙을 따랐을 때 매우 도움 되는 정보입니다.
- 해당 도구를 사용하여 어떤 권한이 사용되지 않는지 볼 수 있고, 따라서 사용자의 권한을 줄여서 최소 권한 원칙을 지킬 수 있습니다.

## 실습
- 자격 증명 보고서를 만들어보겠습니다.
![Pasted image 20230704102108.png](../../../Pasted image 20230704102108.png)
![Pasted image 20230704102132.png](../../../Pasted image 20230704102132.png)
- 위 버튼을 통해서 자격 증명 보고서를 다운 받습니다.

![Pasted image 20230704102320.png](../../../Pasted image 20230704102320.png)
- 해당 내용은 계정의 보안 적인 측면을 한꺼번에 확인이 가능하다.

### IAM 액세스 관리자
![Pasted image 20230704102541.png](../../../Pasted image 20230704102541.png)
- `Users` 클릭 후 본인의 User name을 선택합니다.
![Pasted image 20230704102655.png](../../../Pasted image 20230704102655.png)
- `Access Advisor`를 클릭하게 되면, 지속적으로 접속 했던 Resource가 뜨게 됩니다.
- 

![Pasted image 20230704102827.png](../../../Pasted image 20230704102827.png)
- 표에 나와있는 것 중에 Last accessed에서 `Not accessed in the tracking period`는 user가 한번도 사용하지 않았다는 것을 뜻하기에, 해당 권한은 삭제 처리 하는 것이 좋다.

# IAM Guidelines & Best Practices
:::tip AWS IAM 가이드 라인
- Root 계정은 AWS 계정을 설정할 때를 제외하고 사용하면 안된다.
- One pysical user = One AWS user
- 이유인 즉, 사용자를 그룹에 넣어 해당 그룹에 권한을 부여할 수도 있기 때문입니다.
:::

	>- 따라서 그룹 수준에서 보안을 관리 할 수 있다.
>- 강력한 비밀번호 정책
>- MFA 사용 권고
>- AWS 서비스에 권한을 부여할 때마다 역할을 만들고 사용해야 합니다.
>- SDK, CLI를 사용할 경우에는 Access Key를 반드시 사용해야 합니다. 
>- 계정 권한을 감시하고 분석할 IAM 자격 증명 보고서와 IAM 액세스 분석기를 사용할 수 있습니다.
- 위의 가이드라인 요소를 통해서, 해커를 방지할 수 있습니다.




---

#AWS #AWS_IAM #AWS_DEVLOPER 

---