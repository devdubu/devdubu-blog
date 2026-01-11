---
slug: "5_Docker_Advanced"
---

# Docker Advanced

## 1. Container Monitoring
컨테이너 환경에서는 기존 모니터링 방식과는 다른 접근이 필요합니다.

### 주요 도구
- **cAdvisior**: 구글에서 만든 컨테이너 리소스 사용량 및 성능 분석 도구.
- **Prometheus**: 시계열 데이터베이스(TSDB) 기반의 모니터링 시스템. Pull 방식을 사용하며 강력한 쿼리 언어(PromQL) 제공.
- **Grafana**: 시각화 도구. Prometheus 등 다양한 데이터 소스와 연동하여 대시보드 구성.

### 모니터링 아키텍처 예시 (Docker Compose)
1. **Node Exporter**: 호스트 OS의 메트릭 수집.
2. **cAdvisor**: 도커 컨테이너 메트릭 수집.
3. **Prometheus**: 위 익스포터들로부터 데이터 수집(Scraping) 및 저장.
4. **Grafana**: 프로메테우스를 데이터 소스로 하여 그래프 시각화.

---

## 2. Docker Swarm
도커 스웜(Docker Swarm)은 도커 엔진에 내장된 컨테이너 오케스트레이션 도구입니다. 여러 호스트를 하나의 가상 도커 호스트(클러스터)로 묶어 관리합니다.

### 주요 개념
- **Manager Node**: 클러스터 상태 관리, 태스크 스케줄링, API 처리.
- **Worker Node**: 실제 컨테이너(Task)를 실행.
- **Service**: 스웜에서 배포의 단위. (ex: nginx 서비스를 3개 레플리카로 실행)
- **Task**: 스웜에서 스케줄링하는 최소 단위(==컨테이너).

### 주요 명령어
- `docker swarm init`: 스웜 클러스터 초기화 (현재 노드를 매니저로).
- `docker swarm join`: 워커 노드가 클러스터에 합류.
- `docker service create`: 서비스 생성.
- `docker service ls`: 실행 중인 서비스 목록.
- `docker service scale <service>=<n>`: 서비스 스케일링.
- `docker node ls`: 클러스터 노드 상태 확인.

> **Note**: 현재 오케스트레이션 표준은 **Kubernetes**로 넘어갔지만, 간단한 클러스터 구성에는 여전히 Swarm이 유용할 수 있습니다.
