---
slug: "2-Network-Security"
---

# Network Security

## 1. Security Infrastructure

### Security Zones
- **DMZ (Demilitarized Zone)**: 외부에서 접근 가능한 서비스(Web Server 등)가 위치하는 구간. 내부망과 분리되어 보호됩니다.
- **Internal Network**: 업무망, 개발망 등 외부 접근이 차단된 내부 구간.
- **Wireless Network**: 무선 단말을 위한 별도 네트워크.

### Security Components
| 장비 | 역할 & 특징 |
| :--- | :--- |
| **Firewall (방화벽)** | 1차 방어선. IP/Port 기반으로 트래픽을 허용/차단합니다. |
| **IDS (Intrusion Detection System)** | 침입 탐지 시스템. 트래픽 사본(Mirroring)을 분석하여 공격을 탐지합니다. |
| **IPS (Intrusion Prevention System)** | 침입 방지 시스템. 인라인(Inline)으로 트래픽을 검사하고 공격을 즉시 차단합니다. |
| **ESM (Enterprise Security Management)** | 통합 보안 관리 시스템. 다양한 보안 장비의 로그를 수집하고 분석합니다. |
| **NAC (Network Access Control)** | 사용자 및 단말기의 네트워크 접근 권한을 제어합니다. |

---

## 2. Security Monitoring
**보안 관제 센터 (SOC)** 구축 시 고려사항:
- **관제 대상**: 네트워크 트래픽, 서버/애플리케이션 로그, 에이전트 수집 정보.
- **모니터링 방식**:
    - **Mirroring (TAP/SPAN)**: 네트워크 성능 영향 없음, 차단 불가능.
    - **Inline**: 즉시 차단 가능, 장애 시 네트워크 단절 위험 (Bypass 기능 필요).
- **SIEM (Security Information & Event Management)**: 대용량 로그 수집 및 상관 분석을 통한 위협 탐지.

---

## 3. Network Attacks & Defense
(추후 보강 예정: DDoS, Spoofing, Sniffing 등)
