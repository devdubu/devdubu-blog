---
slug: "1-AWS-Overview"
---

# AWS Overview

## 1. AWS의 성장 배경
![Pasted-image-20231023094405.png](/img/Pasted-image-20231023094405.png)
![Pasted-image-20231023094600.png](/img/Pasted-image-20231023094600.png)

## 2. Global Infrastructure

### 리전 (Region)
![Pasted-image-20231023094633.png](/img/Pasted-image-20231023094633.png)
- AWS는 전 세계에 물리적으로 분리된 리전(Region)을 운영합니다.
- 리전 코드 예시: `ap-northeast-2`
    - **ap**: 지역 (Asia Pacific)
    - **northeast**: 지리적 위치
    - **2**: 순번

> [!TIP] CLI로 리전 정보 조회
> ```bash
> # AWS 리전 목록 조회
> aws ssm get-parameters-by-path --path /aws/service/global-infrastructure/regions --output json | jq .Parameters[].Name
> ```

### 가용 영역 (Availability Zone, AZ)
![Pasted-image-20231023100054.png](/img/Pasted-image-20231023100054.png)
- 하나의 리전은 최소 2개 이상의 가용 영역(AZ)으로 구성됩니다.
- 각 AZ는 하나 이상의 데이터 센터로 구성되며, 물리적으로 분리되어 있습니다 (지진, 화재 등 재해 대비).
- 예: `ap-northeast-2a`, `ap-northeast-2c`

### 엣지 로케이션 (Edge Location)
![Pasted-image-20231023100316.png](/img/Pasted-image-20231023100316.png)
- **CloudFront** (CDN) 및 **Route 53**을 위한 글로벌 캐시 서버 네트워크입니다.
- 전 세계 400개 이상의 지점에 분포하여 사용자에게 짧은 지연 시간으로 콘텐츠를 전송합니다.
- **Lambda@Edge**: 엣지 로케이션에서 코드를 실행하여 성능을 최적화할 수 있습니다.

## 3. Service Portfolio
![Pasted-image-20231023100457.png](/img/Pasted-image-20231023100457.png)
AWS는 컴퓨팅, 스토리지, 데이터베이스, 네트워킹, 머신러닝 등 수백 개의 서비스를 제공합니다.
