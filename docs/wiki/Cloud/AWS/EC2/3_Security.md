---
slug: "3-Security"
---

# EC2 Security

EC2 인스턴스의 보안은 크게 네트워크 접근 제어(Security Group)와 인스턴스 접근 제어(Key Pair, IAM)로 나눌 수 있습니다.

## Security Group (보안 그룹)
![Pasted-image-20230713090829.png](/img/Pasted-image-20230713090829.png)
![스크린샷-2023-06-14-오전-10.55.42.png](/img/스크린샷-2023-06-14-오전-10.55.42.png)

:::info Security Group이란?
- **AWS의 방화벽 인스턴스 수준의 가상 방화벽**입니다.
- 인바운드(Inbound) 및 아웃바운드(Outbound) 트래픽을 제어합니다.
- **Inbound**: 외부 -> 인스턴스로 들어오는 트래픽 (기본값: 모두 차단)
- **Outbound**: 인스턴스 -> 외부로 나가는 트래픽 (기본값: 모두 허용)
:::

### 특징
- **Stateful (상태 저장)**: 인바운드 규칙에서 허용된 트래픽에 대한 응답(아웃바운드)은 규칙과 상관없이 자동으로 허용됩니다.
- **Allow Only**: 트래픽을 허용하는 규칙만 추가할 수 있습니다. (차단 규칙 생성 불가 → 차단은 NACL에서 수행)
- **참조 기능**: IP 주소뿐만 아니라 **다른 보안 그룹의 ID**를 소스로 지정할 수 있습니다. (예: Web-SG에서 App-SG의 접근만 허용)

### Security Group Diagram
![Pasted-image-20230713091555.png](/img/Pasted-image-20230713091555.png)
- 인스턴스 외부에서 방어막 역할을 하므로, 트래픽이 차단되면 인스턴스 로그에는 남지 않고 타임아웃(Timeout)이 발생합니다.
- **Timeout** 발생 시: 99% 확률로 Security Group 이슈
- **Connection Refused** 발생 시: Security Group은 통과했으나, 애플리케이션이 실행 중이지 않거나 포트가 닫혀있는 경우

### Security Group vs Network ACL (NACL)
| 특징 | Security Group | Network ACL |
| -- | -- | -- |
| **적용 범위** | 인스턴스 단위 | 서브넷 단위 |
| **규칙** | 허용(Allow)만 가능 | 허용(Allow) 및 거부(Deny) 가능 |
| **동작 방식** | Stateful (상태 저장) | Stateless (상태 비저장) |
| **순서** | 모든 규칙 평가 | 번호 순서대로 평가 |

## Ports Reference
자주 사용되는 주요 포트 번호입니다.

| Port | Protocol | Name | Description |
| -- | -- | -- | -- |
| 21 | TCP | FTP | 파일 전송 |
| 22 | TCP | SSH | Linux 인스턴스 접속 (SFTP 포함) |
| 80 | TCP | HTTP | 웹 서비스 (비보안) |
| 443 | TCP | HTTPS | 웹 서비스 (보안) |
| 3389 | TCP | RDP | Windows 인스턴스 원격 데스크톱 |

## Access Control (접근 제어)

### 1. Key Pairs (SSH)
- **개념**: 공개 키 암호화 방식을 사용하여 인스턴스에 접속할 때 사용하는 로그인 자격 증명입니다.
- **Private Key**: 사용자가 보관 (.pem 파일)
- **Public Key**: AWS EC2 인스턴스에 저장
![Pasted-image-20230713100423.png](/img/Pasted-image-20230713100423.png)

### 2. AWS Systems Manager (SSM) Session Manager
![Pasted-image-20230221180040.png](/img/Pasted-image-20230221180040.png)
- **개념**: SSH 키나 22번 포트 개방 없이 브라우저나 CLI를 통해 안전하게 인스턴스에 쉘 접속하는 관리형 서비스입니다.
- **장점**:
	- **Bastion Host 불필요**: Private Subnet 인스턴스에 직접 접속 가능
	- **포트 보안**: 22번 포트를 열 필요가 없어 보안성 향상
	- **감사 로그**: 접속 기록 및 명령어 실행 로그가 CloudTrail과 S3에 저장됨
- **요구사항**: EC2 인스턴스에 **SSM Agent**가 설치되어 있어야 하고, 적절한 **IAM Role**이 연결되어 있어야 합니다.
