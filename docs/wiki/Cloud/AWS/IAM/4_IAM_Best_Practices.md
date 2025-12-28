---
slug: "4-IAM-Best-Practices"
---

# IAM Best Practices & Security Tools

## 1. IAM Guidelines & Best Practices
IAM을 안전하게 운영하기 위한 핵심 가이드라인입니다.

1.  **Root Account 보호**:
    - 일상적인 업무에 Root 계정을 사용하지 않습니다.
    - **Access Key를 절대 생성하지 않습니다.**
    - 강력한 비밀번호와 **MFA**를 반드시 설정합니다.
    - Root 계정 사용이 감지되면 알림이 오도록 설정합니다 (예: CloudWatch Event + SNS/Slack).
2.  **User 관리**:
    - **One Physical User = One AWS User**: 공유 계정을 사용하지 않습니다.
    - 불필요한 사용자는 삭제합니다.
    - **MFA 활성화**: 모든 사용자, 특히 콘솔 접근 권한이 있는 사용자에게 MFA를 강제합니다.
	    
	    :::example MFA 설정 방법 (Virtual MFA)
		1. AWS Console 로그인 -> 보안 자격 증명(Security Credentials) -> MFA 활성화
		2. **가상 MFA 디바이스(Virtual MFA device)** 선택
		3. **Google Authenticator** 또는 **Authy** 앱 실행하여 QR 코드 스캔
		4. 앱에 표시된 연속된 2개의 인증 코드 입력 후 **MFA 활성화** 클릭
		:::
3.  **권한 관리 (Least Privilege)**:
    - **최소 권한 부여**: 업무에 꼭 필요한 권한만 부여합니다.
    - **Policy 관리**: Inline Policy보다는 재사용 가능한 **Customer Managed Policy**를 사용합니다.
    - **Group 활용**: 사용자에게 직접 권한을 주지 말고, Group에 권한을 부여하고 사용자를 Group에 추가합니다.
4.  **Access Key 관리 (CLI/SDK)**:
    - Access Key는 꼭 필요한 경우(로컬 개발 등)에만 생성합니다.
    - EC2 등 AWS 내부에서는 **IAM Role**을 사용합니다.
    - Access Key는 주기적으로 교체(Rotate)하고, 사용하지 않는 Key는 비활성화/삭제합니다.
    - 코드(Git)에 하드코딩하지 않습니다.
5.  **보안 도구 활용**:
    - Credential Report와 Access Advisor를 정기적으로 확인합니다.

## 2. IAM Security Tools

### IAM Credentials Report (자격 증명 보고서)
- **레벨**: Account Level (계정 전체)
- **내용**: 계정 내 모든 사용자의 자격 증명 상태(비밀번호 변경일, MFA 활성화 여부, Access Key 사용일 등)를 CSV 파일로 제공합니다.
- **용도**: 감사(Audit) 및 컴플라이언스 점검. 예를 들어, 90일 이상 비밀번호를 변경하지 않은 사용자 식별.

### IAM Access Advisor (액세스 관리자)
- **레벨**: User / Role Level
- **내용**: 해당 Principal(사용자/역할)이 부여된 권한을 실제로 언제 마지막으로 사용했는지 보여줍니다.
- **용도**: **권한 다이어트**. 오랫동안 사용하지 않은 서비스 권한(Not accessed in tracking period)을 식별하여 제거함으로써 최소 권한 원칙을 실현합니다.

### IAM Access Analyzer
- 리소스 기반 정책(S3 버킷 정책, IAM 역할 신뢰 정책 등)을 분석하여 외부(다른 계정, 공개 인터넷)에서 접근 가능한 리소스를 식별합니다.

## 3. Automation
- **Config / CloudWatch / Lambda** 등을 활용하여 IAM 정책 위반(예: MFA 미설정, 90일 지난 키)을 자동 탐지하고 알림을 보내거나 자동으로 수정(Remediation)하는 파이프라인을 구축할 수 있습니다.
![Pasted-image-20230221155719.png](/img/Pasted-image-20230221155719.png)
