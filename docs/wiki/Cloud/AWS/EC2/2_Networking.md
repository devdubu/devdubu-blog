---
slug: "2-Networking"
---

# EC2 Networking

EC2 인스턴스를 운영할 때 네트워크 구성은 보안과 접근성 측면에서 매우 중요합니다. 특히 사설(Private) 서브넷에 있는 인스턴스에 접근하는 방식에 대한 설계가 필요합니다.

## Bastion Host (Traditional Approach)
![Pasted-image-20230221163223.png](/img/Pasted-image-20230221163223.png)
- **개념**: 외부(인터넷)에서 접근 가능한 Public Subnet에 'Bastion Host'라 불리는 점프 서버를 두고, 이 서버를 거쳐서 Private Subnet의 인스턴스에 SSH 접속하는 방식입니다.
- **흐름**: User -> Public IP (Bastion Host) -> Private IP (Target Instance)
- **보안 이슈**: Bastion Host 자체가 Public IP를 가지고 외부로 노출되어 있어 공격의 대상이 될 수 있습니다. 보안 그룹(Security Group) 관리가 매우 중요합니다.

## VPN / Direct Connect (Secure Approach)
![Pasted-image-20230221163622.png](/img/Pasted-image-20230221163622.png)
- **개념**: 기업 내부망과 AWS VPC를 VPN(Site-to-Site VPN) 또는 전용선(Direct Connect)으로 연결하여, 인터넷을 거치지 않고 사설 IP로 직접 접근하는 방식입니다.
- **장점**:
	- Public IP 노출 없이 안전하게 접근 가능
	- 내부망의 확장된 개념으로 운영 가능

:::tip 안전한 접근을 위한 선택
보안이 중요한 프로덕션 환경에서는 Bastion Host보다는 VPN이나 AWS Systems Manager(SSM) Session Manager를 사용하는 것이 권장됩니다.
:::
