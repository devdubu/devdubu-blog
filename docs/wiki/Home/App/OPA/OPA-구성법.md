---
sticker: vault//이미지/개발 로고/TechIconSVG/open-policy-agent.svg

slug: "OPA-구성법"
---
## OPA 정책 설정 (Rego) 개요

OPA는 **Rego**라는 선언적 정책 언어를 사용합니다. Rego 정책은 `input` 객체로 들어오는 요청 정보와 `data` 객체로 제공되는 외부 데이터(사용자 권한 등)를 기반으로 `allow` 또는 `deny` 결정을 내립니다.

### 핵심 아이디어

1. **입력 데이터(Input):** OPA로 들어오는 HTTP 요청의 `body.action`, `body.url` (혹은 `MENU_CD`에 해당하는 값) 등의 정보가 `input` 객체로 전달됩니다.
    
2. **정책 데이터(Data):** 사용자가 부여받은 권한 (`permission`, `MENU_CD`, `PAGE_CD`, `PROJ_CD`, `ORG_CD`, `IS_AUTH`) 배열이 OPA의 `data` 객체로 로드됩니다.
    
3. **정책 규칙(Rules):** `input`과 `data`를 조합하여 특정 요청이 허용되는지 여부를 결정하는 Rego 규칙을 작성합니다.
    

---

## OPA 설정 및 Rego 정책 예시

### 1. OPA에 권한 데이터 로드

사용자 권한 데이터는 OPA가 정책을 평가할 때 참조할 수 있도록 `data` 객체로 로드되어야 합니다. 이는 여러 방법으로 가능합니다.

- **정적 파일로 로드 (개발 초기):** `permissions.json` 파일에 사용자별 권한 데이터를 JSON 형태로 저장하고 OPA 시작 시 `--data permissions.json` 옵션으로 로드합니다.
    
    JSON
    
    ```json
    // permissions.json 예시
    {
      "user_permissions": {
        "user123": [
          {
            "permission": 15, // C:1, R:1, U:1, D:1 (binary 1111)
            "MENU_CD": "/dashboard",
            "PAGE_CD": "none",
            "PROJ_CD": "PX-PROJ-0",
            "ORG_CD": "PX-ORG-0",
            "IS_AUTH": true
          },
          {
            "permission": 1, // Read (binary 0001)
            "MENU_CD": "/settings",
            "PAGE_CD": "PX-PAGE-1",
            "PROJ_CD": "PX-PROJ-0",
            "ORG_CD": "PX-ORG-0",
            "IS_AUTH": true
          },
          {
            "permission": 4, // Update (binary 0100)
            "MENU_CD": "/admin",
            "PAGE_CD": "PX-PAGE-ADMIN-1",
            "PROJ_CD": "PX-PROJ-ADMIN",
            "ORG_CD": "PX-ORG-GLOBAL",
            "IS_AUTH": true
          }
        ]
      }
    }
    ```
    
- **동적 번들 서비스 (운영 환경):** 실제 운영 환경에서는 위 `permissions.json`과 같은 데이터를 웹 서버에 호스팅하고, OPA가 주기적으로 이 번들을 다운로드하도록 설정하는 것이 일반적입니다. (위에서 설명한 Bundle Service 방식)
    
- **외부 데이터 소스 연동:** 사용자 권한이 데이터베이스나 다른 마이크로서비스에 저장되어 있다면, OPA가 해당 소스로부터 직접 데이터를 가져오도록 설정할 수도 있습니다. (예: OPA `plugins` 또는 커스텀 데이터 로딩 스크립트)
    

### 2. Rego 정책 (`policy.rego`) 작성

이제 `input`으로 들어오는 요청과 `data`로 로드된 권한 데이터를 사용하여 정책을 평가하는 Rego 규칙을 작성해봅시다.

코드 스니펫

```rego
package authz

# 기본적으로 모든 요청은 거부됩니다.
default allow = false

# HTTP POST 요청의 body에 있는 action을 숫자로 매핑합니다.
# CREATE: 8 (1000)
# READ:   4 (0100)
# UPDATE: 2 (0010)
# DELETE: 1 (0001)
action_map := {
    "create": 8,
    "read":   4,
    "update": 2,
    "delete": 1
}

# 요청된 action에 해당하는 비트마스크 값을 찾습니다.
requested_action_bit := action_map[input.body.action]

# 요청된 URL에 해당하는 MENU_CD를 찾습니다.
# 가정: input.body.url이 MENU_CD와 직접 매핑됩니다.
requested_menu_cd := input.body.url

# OPA로 요청이 들어왔을 때, 해당 요청이 허용되는지 여부를 결정하는 메인 규칙입니다.
allow {
    # 1. 사용자 ID가 input에 포함되어야 합니다. (예: input.user_id)
    # 실제 환경에서는 JWT 토큰 등에서 사용자 ID를 추출하여 input으로 전달합니다.
    some user_id
    user_id := input.user_id

    # 2. 해당 사용자의 권한 데이터를 가져옵니다.
    user_permissions := data.user_permissions[user_id]

    # 3. 요청된 메뉴/페이지에 대한 권한을 찾습니다.
    some permission_entry in user_permissions
    
    # IS_AUTH가 false면 권한 체크를 하지 않으므로 허용합니다.
    not permission_entry.IS_AUTH

} else allow {
    some user_id
    user_id := input.user_id
    user_permissions := data.user_permissions[user_id]
    
    some permission_entry in user_permissions
    permission_entry.IS_AUTH == true # IS_AUTH가 true인 경우만 아래 로직 실행

    # 4. 권한 이양 로직 (ORG -> PROJ -> MENU -> PAGE) 및 PAGE_CD "none" 처리
    # ORG_CD 매칭 (가장 상위)
    permission_entry.ORG_CD == input.body.org_cd

    # PROJ_CD 매칭
    permission_entry.PROJ_CD == input.body.proj_cd

    # MENU_CD 매칭
    permission_entry.MENU_CD == requested_menu_cd

    # PAGE_CD가 "none"이면 MENU 권한으로 간주
    # 그렇지 않으면 PAGE_CD도 매칭되어야 합니다.
    permission_entry.PAGE_CD == "none"

    # 5. C/R/U/D 권한 체크 (비트마스크 연산)
    # requested_action_bit가 permission_entry.permission에 포함되는지 확인합니다.
    # 예: READ(4) 요청 시 permission이 5(0101)이면 4 & 5 = 4 이므로 허용
    (permission_entry.permission & requested_action_bit) == requested_action_bit
}
```

### Rego 정책 설명

- **`package authz`**: 정책 패키지 이름을 정의합니다. OPA에 질의할 때 `data.authz.allow`와 같이 참조됩니다.
- **`default allow = false`**: 명시적으로 허용되지 않는 한, 모든 요청은 기본적으로 거부됩니다. (Fail-safe)
- **`action_map`**: `POST` 요청 `body`의 `action` 필드(예: "read", "create")를 비트마스크 숫자(1, 2, 4, 8)로 변환하는 맵입니다.
    - CRUD 권한 비트:
        - Create (C): 8 (1000)
        - Read (R): 4 (0100)
        - Update (U): 2 (0010)
        - Delete (D): 1 (0001)
    - **주의**: 일반적으로 CRDA 순서로 1,2,4,8을 부여하거나, Read가 가장 흔하므로 1로 부여하기도 합니다. 여기서는 제가 임의로 `action_map`을 정의했으니, 실제 프로젝트의 CRUD 비트마스크 정의에 맞춰 수정해야 합니다.
        
- **`allow` 규칙**:
    - `input.user_id`를 통해 요청을 보낸 사용자의 ID를 가져옵니다. (이 `user_id`는 실제 애플리케이션에서 OPA로 보낼 `input` 데이터에 포함되어야 합니다. 예를 들어, JWT 토큰을 검증하여 얻은 사용자 ID를 `input`에 추가.)
    - `data.user_permissions[user_id]`를 통해 해당 사용자의 모든 권한 엔트리를 가져옵니다.
    - **`IS_AUTH` 체크**: `IS_AUTH`가 `false`인 권한 항목이 있다면, 해당 권한은 체크하지 않으므로 바로 허용합니다. (여기서 `else allow`로 분리하여 `IS_AUTH == true`인 경우만 다음 로직을 타도록 했습니다.)
    - **권한 이양 및 매칭**: `ORG_CD`, `PROJ_CD`, `MENU_CD` (요청 `url`과 매핑), `PAGE_CD` 순서로 매칭을 시도합니다.
        - `PAGE_CD == "none"`일 경우, 해당 권한은 상위 `MENU_CD`에 대한 권한으로 간주됩니다.
        - 만약 `PAGE_CD`가 `none`이 아니라면, `input`으로 들어온 `page_cd`와 `permission_entry.PAGE_CD`가 정확히 일치해야 합니다. (이 부분은 `input.body.page_cd`가 들어온다고 가정합니다.)
            
    - **비트마스크 권한 체크**: `(permission_entry.permission & requested_action_bit) == requested_action_bit` 이 구문이 핵심입니다.
        - 예를 들어, 사용자 권한 (`permission_entry.permission`)이 11 (이진수 `1011`, 즉 Create, Update, Delete 권한)이고, 요청된 동작이 Update (비트 `0010`)라면:
            - `1011` (11) `&` `0010` (2) = `0010` (2)
            - `0010` (2) `==` `0010` (2) 이므로 `true`가 되어 요청이 허용됩니다.
        - 만약 사용자 권한이 `0100` (4, Read만 가능)인데, Create (`1000`)를 요청한다면:
            - `0100` (4) `&` `1000` (8) = `0000` (0)
            - `0000` (0) `==` `1000` (8) 이 아니므로 `false`가 되어 요청이 거부됩니다.
                

### 3. 애플리케이션에서 OPA 호출 방식

애플리케이션은 HTTP `POST` 요청을 OPA의 `/v1/data/authz/allow` 엔드포인트로 보냅니다. 이때 `input` 객체에 필요한 데이터를 담아 보냅니다.

JSON

```json
// OPA로 보낼 HTTP POST 요청의 body (예시)
{
  "input": {
    "user_id": "user123",
    "body": {
      "action": "read", // 요청된 동작 (create, read, update, delete)
      "url": "/dashboard", // 요청된 메뉴/페이지 URL (MENU_CD에 해당)
      "org_cd": "PX-ORG-0",
      "proj_cd": "PX-PROJ-0",
      "page_cd": "none" // 또는 실제 페이지 코드
    }
  }
}
```

OPA는 이 요청을 받아 Rego 정책을 평가한 후 다음과 같은 응답을 반환합니다.

JSON

```json
// OPA 응답 (허용될 경우)
{
  "result": true
}

// OPA 응답 (거부될 경우)
{
  "result": false
}
```

애플리케이션은 이 `result` 값을 받아 `true`면 요청을 진행하고, `false`면 `403 Forbidden` 등의 응답을 반환하면 됩니다.

---

## 추가 고려 사항

- **성능 최적화**: 권한 데이터가 매우 많아질 경우, OPA의 번들 서비스 최적화, 인덱싱 등을 고려해야 합니다.
- **오류 처리**: OPA와의 통신 오류, 정책 평가 오류 등에 대한 적절한 로깅 및 오류 처리 메커니즘을 구현해야 합니다.
- **테스트**: Rego 정책은 `opa test` 명령어를 통해 단위 테스트를 작성하고 실행할 수 있습니다. 이는 정책의 정확성을 보장하는 데 매우 중요합니다.
- **캐싱**: OPA 자체적으로도 캐싱 기능을 제공하지만, 애플리케이션 레벨에서 OPA의 결정을 캐싱하여 성능을 더욱 향상시킬 수 있습니다.
- **정책 배포 자동화**: 개발/테스트/운영 환경에 따라 정책을 배포하는 CICD 파이프라인을 구축하는 것이 중요합니다.


이 설정은 시작하기 위한 기본적인 틀을 제공합니다. 실제 프로젝트의 복잡성이나 특정 요구사항에 따라 세부적인 Rego 정책이나 OPA 통합 방식은 달라질 수 있습니다.