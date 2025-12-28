---
slug: "3-Network-Security"
---

# VPC Network Security

VPC의 보안은 서브넷 수준의 **NACL**과 인스턴스 수준의 **Security Group**으로 이루어진 이중 방어 계층을 가집니다.

## 1. Security Group (보안 그룹)
- **적용 대상**: **인스턴스 (EC2, RDS 등)**
- **특징**: **Stateful (상태 저장)**
	- 인바운드 규칙에서 허용된 트래픽의 응답(아웃바운드)은 자동으로 허용됩니다.
	- 반대의 경우도 마찬가지입니다.
- **Rule**: 허용(Allow) 규칙만 생성 가능합니다. (차단 규칙 불가)
- **용도**: 1차적인 방화벽 역할. 포트 및 소스 IP 제어.

## 2. NACL (Network Access Control List)
![Untitled-8.png](/img/Untitled-8.png)
- **적용 대상**: **Subnet (서브넷)**
- **특징**: **Stateless (상태 비저장)**
	- 상태를 저장하지 않으므로, 인바운드와 아웃바운드 규칙을 각각 명시적으로 설정해야 합니다. (예: 들어오는 요청 허용 + 나가는 응답 허용)
- **Rule**: 허용(Allow) 및 **거부(Deny)** 규칙 모두 생성 가능합니다.
- **순서**: 규칙 번호(Rule Number)가 낮은 순서대로 평가됩니다. (예: 100번 Deny가 200번 Allow보다 우선)
- **용도**: 서브넷 전체에 대한 2차 방화벽. 특정 IP 대역 차단(Block) 등에 유용합니다.

### Comparison
| 특징 | Security Group | NACL |
| -- | -- | -- |
| **Level** | Instance | Subnet |
| **State** | Stateful | Stateless |
| **Action** | Allow Only | Allow & Deny |
| **Order** | 모든 규칙 평가 | 번호 순서대로 평가 |

## 3. Stateful vs Stateless Example

### Stateful (SG)
![Untitled-9.png](/img/Untitled-9.png)
- 인바운드 80 포트를 허용하면, 웹 서버가 응답을 보낼 때 사용하는 임의의 포트(Ephemeral Port)로 나가는 아웃바운드 트래픽도 자동으로 허용됩니다.

### Stateless (NACL)
![Untitled-10.png](/img/Untitled-10.png)
- 인바운드 80 포트를 허용했더라도, 아웃바운드 규칙에서 응답 트래픽(Ephemeral Port 범위: 1024-65535 등)을 명시적으로 허용하지 않으면 응답이 나가지 못합니다.
