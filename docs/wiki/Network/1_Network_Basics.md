---
slug: "1-Network-Basics"
---

# Network Basics

## 1. Network Concepts

### Network Types (Scope)
- **PAN (Personal Area Network)**: 개인 통신망 (Bluetooth, 10m 이내)
- **LAN (Local Area Network)**: 근거리 통신망 (Ethernet, Wi-Fi). Star형, Bus형 구조 등.
- **MAN (Metropolitan Area Network)**: 도시 규모 통신망 (케이블 인터넷).
- **WAN (Wide Area Network)**: 광역 통신망 (국가 간 연결). 전용선, 패킷 교환망 등.

### Network Components
- **NIC (Network Interface Card)**: 고유 MAC 주소를 가진 네트워크 카드.
- **Switch (L2)**: MAC 주소를 기반으로 패킷을 포워딩하는 장비.
- **Router (L3)**: IP 주소를 기반으로 최적의 경로를 찾아 패킷을 전송하는 장비.

---

## 2. Protocols & Models

### OSI 7 Layer & TCP/IP Stack
네트워크 통신 과정을 계층별로 나눈 모델입니다.

| OSI 7 Layer | TCP/IP Layer | 역할 | 주요 프로토콜 |
| :--- | :--- | :--- | :--- |
| **7. Application** | **Application** | 사용자 인터페이스, 데이터 생성 | HTTP, DNS, FTP, SSH |
| **6. Presentation** | | 데이터 표현 (인코딩, 암호화) | SSL/TLS |
| **5. Session** | | 세션 연결 및 동기화 | |
| **4. Transport** | **Transport** | 데이터 전송 신뢰성 보장 | TCP, UDP |
| **3. Network** | **Internet** | 논리적 주소(IP) 기반 경로 설정 | IP, ICMP, ARP |
| **2. Data Link** | **Network Interface** | 물리적 주소(MAC) 기반 전송 | Ethernet, Wi-Fi |
| **1. Physical** | | 전기 신호 전송 | Cable, Hub |

---

## 3. IP Addressing & Subnetting

### IPv4 Classes
IP 주소의 첫 번째 옥텟을 기준으로 클래스를 구분합니다.

| Class | 첫 번째 옥텟 | 특징 | 용도 |
| :---: | :--- | :--- | :--- |
| **A** | 0~127 | N.H.H.H | 대규모 네트워크 |
| **B** | 128~191 | N.N.H.H | 중규모 네트워크 |
| **C** | 192~223 | N.N.N.H | 소규모 네트워크 |

### CIDR & Subnetting
**CIDR (Classless Inter-Domain Routing)**: 클래스 단위가 아닌 서브넷 마스크(Prefix)를 사용하여 네트워크를 유연하게 나누는 방식입니다.
- 예: `192.168.0.0/24` (256개 IP), `192.168.0.0/25` (128개 IP)
- **Subnetting**: 하나의 네트워크를 여러 개의 작은 네트워크(Subnet)로 분할하여 IP 낭비를 줄이고 보안성을 높입니다.

---

## 4. Modern Network Architecture

### Data Center Network
- **Spine-Leaf Structure**: 3계층 구조의 한계를 극복하고 서버 간 통신(East-West Traffic) 효율을 높이기 위한 2계층 아키텍처입니다.
- **High Bandwidth**: 10G, 25G, 100G, 400G 이더넷 기술 사용.

### VLAN (Virtual LAN)
물리적 배선 변경 없이 논리적으로 네트워크를 분리하는 기술입니다.
- **장점**: 보안성 강화, 브로드캐스트 트래픽 감소, 관리 유연성 증대.
