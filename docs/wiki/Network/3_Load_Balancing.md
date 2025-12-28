---
slug: "3-Load-Balancing"
---

# Load Balancing

## 1. Overview
**Load Balancer**는 서버에 가해지는 트래픽을 여러 대의 서버에 균등하게 분산시켜 시스템의 가용성과 확장성을 높이는 장비입니다.

### Why Load Balancing?
트래픽이 증가할 때 단일 서버로는 처리가 불가능한 시점이 옵니다.
- **Scale-Up (수직 확장)**: 서버 자체의 성능(CPU, Ram)을 업그레이드. 비용이 기하급수적으로 증가하며 한계가 있음.
- **Scale-Out (수평 확장)**: 서버의 대수를 늘려 트래픽을 분산. 로드 밸런서가 필수적임.

---

## 2. Types of Load Balancers

### L4 Load Balancer (Transport Layer)
- IP 주소와 포트 번호(TCP/UDP)를 기반으로 트래픽을 분산합니다.
- 패킷 내용을 보지 않으므로 처리 속도가 빠릅니다.

### L7 Load Balancer (Application Layer)
- HTTP 헤더, URL, 쿠키 등 애플리케이션 계층의 데이터를 분석하여 정교한 분산이 가능합니다.
- SSL Termination, URL 기반 라우팅 등을 지원합니다.

---

## 3. Load Balancing Algorithms

### Round Robin
- 서버에 들어온 요청을 순서대로 돌아가며 배정합니다.
- 서버 스펙이 동일하고 세션이 길지 않은 경우에 적합합니다.

### Least Connection
- 현재 연결(세션) 개수가 가장 적은 서버로 트래픽을 보냅니다.
- 세션 유지 시간이 불규칙한 경우 효율적입니다.

### Source IP Hash
- 사용자의 IP 주소를 해싱하여 항상 특정 서버로 연결되도록 보장합니다 (Stickiness).
- 로그인 세션 유지 등이 필요할 때 사용됩니다.
