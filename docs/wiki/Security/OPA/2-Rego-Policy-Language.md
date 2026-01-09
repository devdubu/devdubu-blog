---
slug: "2-Rego-Policy-Language"
title: "2. Rego 정책 언어 (Rego Policy Language)"
---

# Rego 정책 언어

:::info 개요
**Rego**는 OPA에서 사용하는 선언적(Declarative) 정책 언어입니다. Datalog를 기반으로 확장되었으며, JSON 데이터에 대한 질의와 논리 연산을 수행합니다.
:::

## 1. 기본 문법

Rego는 `package` 선언으로 시작하며, `default` 값을 설정하고, 규칙(Rule)을 정의합니다.

### 1.1 기본 구조
```rego
package authz

# 기본적으로 거부 (Fail-safe)
default allow = false

# 규칙 정의: 모든 조건이 참이어야 allow가 true가 됨 (AND 연산)
allow {
    input.method == "GET"
    input.path == ["users", user_id]
    input.user_id == user_id
}
```

### 1.2 입력 데이터 (Input & Data)
- **input**: 서비스가 OPA에 요청할 때 전달하는 동적 데이터 (예: HTTP 요청 정보, 사용자 ID).
- **data**: OPA 메모리에 미리 로드된 정적/준정적 데이터 (예: 사용자 권한 목록, 역할 매핑).

---

## 2. 정책 구현 예시 (RBAC)

사용자의 권한이 데이터베이스나 JSON 파일(`data.user_permissions`)로 OPA에 로드되어 있다고 가정합니다.

### 2.1 권한 데이터 예시 (data.json)
```json
{
  "user_permissions": {
    "alice": {
      "role": "admin",
      "permission_bit": 15 // 1111 (C, R, U, D)
    },
    "bob": {
      "role": "viewer",
      "permission_bit": 4  // 0100 (Read Only)
    }
  }
}
```

### 2.2 정책 로직 (policy.rego)
비트마스크(Bitmask)를 사용하여 CRUD 권한을 체크하는 예제입니다.

```rego
package authz

default allow = false

# Action을 비트마스크로 매핑
action_map := {
    "create": 8, # 1000
    "read":   4, # 0100
    "update": 2, # 0010
    "delete": 1  # 0001
}

allow {
    # 1. Input에서 사용자 ID와 요청 Action 추출
    user_id := input.user
    action := input.action
    
    # 2. 사용자의 권한 데이터 조회
    user_perm := data.user_permissions[user_id]
    
    # 3. 요청 Action의 비트값 확인
    req_bit := action_map[action]
    
    # 4. 비트 연산 (AND)으로 권한 확인
    # 예: User 권한(15) & 요청(8/create) == 8 -> 허용
    bits.and(user_perm.permission_bit, req_bit) == req_bit
}
```
