---
sticker: vault//이미지/개발 로고/TechIconSVG/Less.js.svg

slug: "JWT-이슈"
---
###  이슈 요약: 로그인 후 새로고침 시 인증이 풀리는 현상

#### 🎯 현상

1. **로그인 성공**: 사용자가 정상적으로 로그인하면, 백엔드(NestJS)는 `accessToken`과 `refreshToken`을 발급하여 `HttpOnly` 쿠키로 설정하라는 응답을 보낸다.
    
2. **새로고침 시 문제 발생**: 페이지를 새로고침하면 Nuxt 플러그인이 `refreshToken`으로 `accessToken` 재발급을 시도하지만, **브라우저가 요청에 `refreshToken` 쿠키를 포함시키지 않아** 백엔드에서 인증에 실패한다.
    
3. **최종 결과**: 사용자 입장에서는 로그인이 풀리고, 백엔드에서는 `refreshToken`이 `undefined`로 수신되는 문제가 발생했다.
    

---

###  🔍 원인 분석: '자격 증명(Credentials)' 누락으로 인한 쿠키 저장 실패

이번 이슈의 **핵심 원인**은 프론트엔드와 백엔드가 서로 다른 출처(`http://localhost:3000` vs `http://localhost:8000`)에서 통신할 때 발생하는 브라우저의 **CORS 보안 정책** 때문이었습니다.

브라우저는 다른 출처 간에 쿠키와 같은 민감한 정보(자격 증명, Credentials)를 주고받으려면, **요청과 응답 양쪽 모두의 명시적인 동의**가 필요합니다.

1. **백엔드의 동의**: NestJS의 `main.ts`에 `app.enableCors({ credentials: true, ... })`를 설정하여, "우리 서버는 자격 증명을 포함한 요청을 허용할 준비가 되었어"라고 알려주었습니다. (**이 부분은 올바르게 설정되어 있었음**)
    
2. **프론트엔드의 동의 (문제 지점)**:
    
    - `refreshToken`을 재발급하는 `PxRefresh` 함수에는 `credentials: 'include'` 옵션을 추가하여 "쿠키를 함께 보낼게!"라고 알려주었습니다.
        
    - 하지만 **최초에 쿠키를 저장해야 하는 `PxLogin` 함수**에는 이 옵션이 **누락**되어 있었습니다.
        

이 때문에 브라우저는 다음과 같이 판단했습니다.

> "프론트엔드(`PxLogin`)가 쿠키를 다루겠다는 의사(`credentials: 'include'`)를 밝히지 않았네. 그런데 백엔드가 `Set-Cookie` 헤더를 보내서 다른 출처에 쿠키를 설정하려고 하잖아? 이건 보안상 위험할 수 있으니, **`Set-Cookie` 명령을 그냥 무시해야겠다.**"

결과적으로, 브라우저는 `refreshToken` 쿠키를 아예 저장하지 않았고, `Application` 탭의 쿠키 저장소에도 `http://localhost:8000` 항목이 생성되지 않았던 것입니다. 당연히 저장된 쿠키가 없으니 새로고침 시 보낼 쿠키도 없었던 것이죠.

---

### ## 🛠️ 해결 방법: 모든 API 호출에 `credentials` 옵션 명시

문제를 해결하기 위해, 쿠키를 **설정받는(`PxLogin`)** API와 쿠키를 **사용하는(`PxRefresh`)** API 양쪽 모두에 `credentials: 'include'` 옵션을 추가하여 브라우저에 명확한 의도를 전달했습니다.

**`commonFetch.ts` 수정**

```TypeScript
// 로그인 API 호출 시에도 credentials 옵션 추가
export const PxLogin = async (userEmail: string, password: string) => {
  // ...
  const response = await $fetch(/* ... */, {
    method: "post",
    body: { /* ... */ },
    // ❗ 이 옵션을 추가하여 쿠키를 설정받을 준비가 되었음을 알림
    credentials: "include", 
  });
  return response;
};

// 재발급 API는 이미 올바르게 설정되어 있었음
export const PxRefresh = async () => {
  // ...
  const response = await $fetch(/* ... */, {
    method: "post",
    credentials: "include",
  });
  return response;
};
```

이 수정을 통해 프론트엔드와 백엔드 양쪽 모두가 쿠키를 다루는 데 동의하게 되어, 브라우저는 `Set-Cookie` 헤더를 정상적으로 처리하고 이후의 모든 요청에 쿠키를 올바르게 포함시켜주게 되었습니다.

---

### 💡 주요 교훈 (Key Takeaway)

- `HttpOnly` 쿠키를 사용한 Cross-Origin 인증 시, **백엔드의 `Access-Control-Allow-Credentials: true`** 설정과 **프론트엔드의 `credentials: 'include'`** 옵션은 하나의 세트이다. 둘 중 하나라도 빠지면 쿠키는 전송되지 않는다.
- 문제가 발생하면, 브라우저 개발자 도구의 `Network` 탭에서 **`Request Headers`(요청 헤더)**와 **`Response Headers`(응답 헤더)**를 확인하는 것이 가장 빠른 해결책이다.
- 쿠키가 저장되지 않는다면, **쿠키를 설정하는 최초의 API(`login`)** 응답부터 확인해야 한다.