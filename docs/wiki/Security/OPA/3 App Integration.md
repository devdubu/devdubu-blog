---
slug: "3-App-Integration"
title: "애플리케이션 연동 (Integration)"
---

# 애플리케이션 연동 (Integration)

:::info 개요
**애플리케이션(Service)**에서 **OPA**에게 권한 확인 요청을 보내고, 응답을 처리하는 방법을 다룹니다.
:::

## 1. REST API 연동

OPA는 기본적으로 HTTP API(`POST /v1/data/{package}/{rule}`)를 제공합니다.

### 1.1 요청 (Request)
애플리케이션은 사용자의 요청 정보를 `input` 객체에 담아 OPA로 전송합니다.

**Endpoint**: `POST http://localhost:8181/v1/data/authz/allow`

```json
{
  "input": {
    "user": "alice",
    "action": "create",
    "resource": "/api/users"
  }
}
```

### 1.2 응답 (Response)
OPA는 정책 평가 결과를 `result` 필드에 담아 반환합니다.

```json
{
  "result": true
}
```

만약 `result`가 없거나 `false`라면 요청을 거부(403 Forbidden)해야 합니다.

---

## 2. Go 라이브러리 연동 (In-Process)
애플리케이션이 Go로 작성되었다면, OPA를 사이드카가 아닌 **라이브러리 형태**로 내장하여 사용할 수도 있습니다. 네트워크 오버헤드가 없다는 장점이 있습니다.

```go
import "github.com/open-policy-agent/opa/rego"

func checkAuth(ctx context.Context, input map[string]interface{}) (bool, error) {
    // Rego 정책 컴파일 및 실행
    query, _ := rego.New(
        rego.Query("data.authz.allow"),
        rego.Load([]string{"policy.rego"}, nil),
    ).PrepareForEval(ctx)

    results, _ := query.Eval(ctx, rego.EvalInput(input))
    return results[0].Expressions[0].Value.(bool), nil
}
```

---

## 3. Best Practices

1.  **Fail-Close**: OPA와 통신이 실패하거나 에러가 발생하면, 기본적으로 요청을 **거부**해야 합니다.
2.  **데이터 동기화**: 사용자 권한 정보가 변경되면 OPA에 즉시 반영되도록 데이터 로딩 전략(Bundle Server, OPAL 등)을 수립해야 합니다.
3.  **성능 캐싱**: 반복되는 요청에 대해 애플리케이션단에서 짧은 시간 동안 결과를 캐싱하여 성능을 높일 수 있습니다.
