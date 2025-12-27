---
slug: "AWS-계정-MFA-활성화"
---
# AWS 계정 MFA 활성화


# MFA?

다단계 인증이라고 하며, Multil Factor Authentication의 약자이다. 즉, 서비스 제공자로부터 자격 증명을 받는 과정에서 추가 보안 인증을 수행하는 것을 의미한다.

MFA를 활성화하면 계정에 대한 추가 보안 레이어를 구축함으로써 혹시 몰르 보안 사고에 대비할 수 있다.

# AWS가 지원하는 MFA

| 지원 유형 | 가상 MFA 디바이스 | U2F 보안키 | 다른 하드웨어 MFA 디바이스 | SMS 문자 메시지 기반 MFA |
| --- | --- | --- | --- | --- |
| 설명 | 스마트폰 또는 기타 디바이스에서 실행되며 물리적 디바이스를 에뮬레이션 하는 소프트웨어 애플리케이션 | YubiKey와 같은 컴퓨터 USB포트에 연결하는 디바이스 | 동기화된 1회 암호 알고리즘에 따라 여섯자리 숫자 코드를 생성하는 하드웨어 디바이스 | IAM 사용자만 사용 가능 |

- 가상 MFA 디바이스
    ![Untitled.png](/img/이미지 창고/Untitled.png)
    
| Google Authenticator | Authy | Azure Authenticator | 1Password |
| --- | --- | --- | --- |
| 클라우드가 아닌 로컬에 OTP를 저장하기 때문에 분실하거나, 핸드폰을 잃어버리면 복호화가 불가능 | 클라우드 상에서 OTP 정보를 저장하기 때문에 복호화가 쉬움 |  | 클라우드 상에서 OTP 정보를 저장하기 때문에 복호화가 쉬움 |
|  | 무료 |  | 유료 |

# AWS에 MFA 적용 방법
![Untitled-1.png](/img/이미지 창고/Untitled-1.png)

로그인 후 → 보안 자격 증명을 클릭합니다.

![Untitled-2.png](/img/이미지 창고/Untitled-2.png)
멀티 팩터 인증(MFA)를 클릭합니다.

후에 MFA 활성화 버튼을 누릅니다

![Untitled-3.png](/img/이미지 창고/Untitled-3.png)
그리고 저희는 가상 MFA를 사용할 예정이므로, 가상 MFA 디바이스를 선택 후 

계속 버튼을 누릅니다.
![Untitled-4.png](/img/이미지 창고/Untitled-4.png)
이렇게 QR코드가 나오게 되는데 이 QR코드를 사용하는 MFA 어플에 그대로 등록하면 된다.

---

#AWS #AWS_Security 

---