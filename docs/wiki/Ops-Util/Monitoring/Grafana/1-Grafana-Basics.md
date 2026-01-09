---
slug: 1-Grafana-Basics
title: 1. Grafana Basics
authors: [jinmin]
tags: [Monitoring, Grafana, Visualization]
---

# Grafana란 무엇인가?

**Grafana**는 오픈 소스 데이터 시각화 및 모니터링 플랫폼입니다.
다양한 데이터 소스(Prometheus, InfluxDB, MySQL, Elasticsearch 등)에 연결하여 데이터를 조회하고, 이를 아름다운 대시보드와 그래프로 시각화할 수 있습니다.

## 주요 기능
1. **데이터 시각화**: 복잡한 데이터를 그래프, 히트맵, 히스토그램 등 다양한 패널로 시각화합니다.
2. **다양한 데이터 소스 지원**: Prometheus, CloudWatch, Stackdriver 등 다양한 백엔드와 연동됩니다.
3. **경고 (Alerting)**: 데이터가 특정 임계값을 넘으면 Slack, Email 등으로 알림을 보낼 수 있습니다.
4. **대시보드 공유**: 팀원들과 대시보드를 쉽게 공유하고 내보낼 수 있습니다.

---

# Cheat Sheet

## 관리자 비밀번호 초기화 (Reset Admin Password)
Grafana 관리자 비밀번호를 분실했을 때 CLI를 통해 재설정하는 방법입니다.

```shell
grafana cli admin reset-admin-password --password-from-stdin
```
(실행 후 새 비밀번호 입력)

혹은 직접 지정:
```bash
grafana-cli admin reset-admin-password <new-password>
```
