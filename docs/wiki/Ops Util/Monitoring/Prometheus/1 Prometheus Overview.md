---
slug: 1-Prometheus-Overview
title: Prometheus Overview
authors: [jinmin]
tags: [Monitoring, Prometheus, TSDB]
---

# Prometheus란?

**Prometheus**는 SoundCloud에서 시작된 오픈 소스 시스템 모니터링 및 경고 툴킷입니다.
현재 Cloud Native Computing Foundation(CNCF)의 졸업(Graduated) 프로젝트로, Kubernetes 환경에서의 표준 모니터링 시스템으로 자리 잡았습니다.

![Pasted-image-20230622170358.png](/img/Pasted%20image%2020230622170358.png)

## 핵심 특징
1. **Pull 방식**: 서버가 주기적으로 Target 시스템에 접속하여 메트릭을 긁어오는(Scrape) 방식입니다.
    - 장점: 모니터링 대상이 모니터링 서버를 알 필요가 없습니다. 서버 부하 조절이 용이합니다.
2. **다차원 데이터 모델**: 메트릭 이름과 Key-Value 쌍의 레이블(Label)로 시계열 데이터(Time Series Data)를 식별합니다.
3. **PromQL**: 유연하고 강력한 쿼리 언어를 제공하여 실시간으로 데이터를 집계하고 분석할 수 있습니다.
4. **자율성**: 분산 스토리지에 의존하지 않고, 단일 서버 노드에서 자율적으로 동작합니다.

---

# 아키텍처 (Architecture)

![Pasted-image-20230622170422.png](/img/Pasted%20image%2020230622170422.png)

1. **Prometheus Server**: 메트릭을 수집(Scrape)하고 저장(Storage)하며, PromQL을 처리합니다.
2. **Exporters**: 애플리케이션이나 시스템(OS, DB 등)의 상태를 Prometheus가 읽을 수 있는 형식(`/metrics`)으로 노출하는 라이브러리 또는 프록시입니다. (예: `node-exporter`, `nginx-exporter`)
3. **Pushgateway**: Pull 방식이 불가능한 짧은 수명의 작업(Batch Job)에서 메트릭을 Push 받아 일시적으로 저장해두는 중계소입니다.
4. **Alertmanager**: Prometheus가 보낸 경고를 받아 중복 제거, 그룹화, 라우팅(Email, Slack 등)을 처리합니다.

---

# 설정 파일 (prometheus.yml)

Prometheus의 동작을 제어하는 메인 설정 파일입니다.

```yaml
# 전역 설정
global:
  scrape_interval: 15s     # 15초마다 메트릭 수집 (Default: 1m)
  evaluation_interval: 15s # 15초마다 규칙(Rule) 평가 (Default: 1m)

# 수집할 타겟 설정 (Scrape Configurations)
scrape_configs:
  - job_name: 'prometheus'
    # 'localhost:9090/metrics'에서 자기 자신의 메트릭 수집
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']
```
