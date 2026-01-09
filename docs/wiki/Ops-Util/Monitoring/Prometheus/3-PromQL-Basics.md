---
slug: 3-PromQL-Basics
title: 3. PromQL Basics
authors: [jinmin]
tags: [Prometheus, PromQL, Query]
---

# PromQL (Prometheus Query Language)

Prometheus에 저장된 시계열 데이터를 실시간으로 선택하고 집계하기 위한 함수형 쿼리 언어입니다.

## 기본 문법

### 1. 인스턴스 벡터 (Instant Vector)
특정 시점의 단일 값을 반환합니다. 가장 기본적인 조회 방식입니다.

- `http_requests_total`: 모든 시계열 데이터 조회
- **Label Selector (필터링)**: `{ }`를 사용하여 특정 레이블과 매칭되는 데이터만 조회합니다.
    - `http_requests_total{job="prometheus"}`: job 레이블이 "prometheus"인 것만 조회
    - `http_requests_total{status!="200"}`: status가 200이 **아닌** 것
    - `http_requests_total{method=~"GET|POST"}`: 정규식 사용 (GET 또는 POST)

### 2. 레인지 벡터 (Range Vector)
현재 시점으로부터 과거 특정 기간 동안의 값을 배열 형태로 반환합니다. `[시간]`을 붙여 사용합니다.
주로 `rate()` 함수 등과 함께 사용됩니다.

- `http_requests_total[5m]`: 최근 5분간의 모든 값

## 주요 함수

### rate() vs irate()
카운터(Counter) 데이터의 초당 변화율을 계산할 때 사용합니다.

- **`rate(v [time])`**: 지정된 구간 전체의 평균 속도를 계산합니다. 그래프가 부드럽게(Smoothing) 나옵니다. 알람 규칙이나 장기 추세 확인에 적합합니다.
    - 예: `rate(http_requests_total[5m])` (최근 5분간 평균 초당 요청 수)
- **`irate(v [time])`**: 구간 내 가장 마지막 두 포인트만을 이용해 순간 속도를 계산합니다. 스파이크(튀는 값)를 감지하기 좋습니다.

### sum() / avg() / max() / min()
여러 시계열 데이터를 하나로 합치거나 집계할 때 사용합니다. `by` 키워드로 그룹핑할 수 있습니다.

- `sum(rate(node_cpu_seconds_total[5m])) by (mode)`: CPU 모드(user, system, idle 등)별로 그룹핑하여 합계 계산
