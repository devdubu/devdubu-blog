---
slug: "1-IAM-Concepts"
---

# IAM (Identity and Access Management) Concepts

:::quote IAM?
- **Identity and Access Management**, **Global** Service
- AWS 리소스에 대한 접근을 제어하고 권한을 관리하는 서비스입니다.
:::

## 1. AWS Identity Types

### Root Account
- **Administer**: 계정 생성 시 만들어지는 기본 계정
- **모든 권한**: AWS Web Console & API의 모든 것을 컨트롤 할 수 있습니다.
- **보안 권고**: 계정 생성 및 초기 설정 시에만 사용하고, 평상시에는 사용하거나 공유해서는 안 됩니다. (MFA 필수 설정)

### IAM User
- **개별 사용자**: 조직 내의 한 사람 (혹은 애플리케이션)에 해당합니다.
- **권한**: 기본적으로 아무런 권한이 없으며, 정책(Policy)을 통해 권한을 부여받아야 합니다.
- **식별**: 
	- 계정 ID (12자리 숫자) 또는 별칭(Alias)을 통해 로그인 페이지에 접근합니다.
	- User Name으로 로그인합니다.

### IAM Group
- **사용자 집합**: 여러 IAM User를 묶어서 관리합니다.
- **권한 관리**: Group에 정책을 연결하면, 해당 Group에 속한 모든 User에게 권한이 상속됩니다.
- User는 여러 Group에 속할 수 있습니다.
- Group은 다른 Group을 포함할 수 없습니다. (중첩 불가)

## 2. Authentication (인증)

### IAM Password Policy
계정 보안을 강화하기 위해 강력한 비밀번호 정책을 설정할 수 있습니다.
- 최소 글자 수 설정
- 특정 문자 요구 (대/소문자, 숫자, 특수문자)
- 비밀번호 주기적 변경 요구
- 이전 비밀번호 재사용 방지

### MFA (Multi-Factor Authentication)
:::tip 필수 보안 조치
비밀번호 외에 추가적인 인증 수단(OTP 등)을 사용하여 보안을 강화해야 합니다. 특히 Root Account와 관리자 권한을 가진 User는 **반드시** MFA를 활성화해야 합니다.
:::
- **Virtual MFA**: Google Authenticator, Authy 등 스마트폰 앱
- **U2F Security Key**: YubiKey 등 물리적 보안 키 (여러 계정 지원)
- **Hardware Key Fob**: Gemalto 등 물리적 토큰

### Access Methods
AWS에 접근하는 3가지 방법:
| 방식 | 인증 수단 | 용도 |
| -- | -- | -- |
| **AWS Management Console** | ID/PW + MFA | 웹 브라우저를 통한 GUI 접근 |
| **AWS CLI** | Access Key ID + Secret Access Key | 터미널/커맨드 라인을 통한 제어 |
| **AWS SDK** | Access Key ID + Secret Access Key | 애플리케이션 코드 내에서 AWS 리소스 제어 (C++, Java, Python 등) |

:::warning Access Key 보안
Access Key는 ID/PW와 같습니다. 절대 GitHub 등에 공유해서는 안 되며, 주기적으로 교체(Rotate)해야 합니다.
:::

## 3. CloudShell
- AWS Console에서 바로 사용할 수 있는 브라우저 기반 쉘입니다.
- AWS CLI가 사전 설치되어 있어 별도 설정 없이 명령어를 실행할 수 있습니다.
- 파일 업로드/다운로드 기능을 제공합니다.
