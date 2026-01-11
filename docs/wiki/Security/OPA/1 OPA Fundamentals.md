---
slug: "1-OPA-Fundamentals"
title: "OPA 기초 (Open Policy Agent)"
---

# OPA 기초 (Open Policy Agent)

:::info 개요
**OPA (Open Policy Agent)**는 클라우드 네이티브 환경을 위한 범용 정책 엔진입니다. 서비스의 로직과 정책 결정을 분리(Decoupling)하여 유연한 권한 관리를 가능하게 합니다.
:::

## 1. 등장 배경
기존 애플리케이션에서는 권한 확인 로직이 비즈니스 로직과 강하게 결합되어 있었습니다.
이로 인해 정책 변경 시 코드 수정 및 재배포가 필요했고, 여러 서비스 간 정책의 일관성을 유지하기 어려웠습니다.

OPA는 이러한 문제를 해결하기 위해 정책(Policy)을 코드에서 분리하고, **Policy-as-Code** 방식으로 관리하도록 돕습니다.

## 2. 작동 원리 (Architecture)
OPA는 서비스(Application)와 별도의 프로세스(또는 사이드카)로 실행됩니다.

1. **Service**: OPA에게 **"이 사용자(User)가 이 행동(Action)을 해도 되는가?"**라고 질의(Query)합니다. 이때 JSON 형태의 `Input`을 함께 전달합니다.
2. **OPA**: 미리 정의된 정책(Policy, Rego)과 데이터(Data)를 바탕으로 `Input`을 평가합니다.
3. **OPA**: 평가 결과(`True/False` 또는 데이터)를 서비스에 반환합니다.
4. **Service**: 반환된 결과를 바탕으로 요청을 허용하거나 거부합니다.

![OPA Architecture](https://www.openpolicyagent.org/docs/latest/images/opa-service.svg)

## 3. 주요 활용 사례
- **Kubernetes**: Admission Controller를 통한 리소스 생성/수정 제어 (예: 특정 라벨 필수, 컨테이너 이미지 레지스트리 제한).
- **Microservices API 권한 제어**: 서비스 간 호출 인가(Authorization).
- **IaC 검증**: Terraform, Dockerfile 설정 검증.
- **Linux PAM**: SSH 접속 제어.
