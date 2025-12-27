---
slug: "Login-Backend-Login"
---
# Login
`domain/member/Member.java`
```java
package hello.login.domain.member;  

import lombok.Data;  
  
import javax.validation.constraints.NotEmpty;  
  
@Data  
public class Member {  
  
    private Long id;  
    @NotEmpty  
    private String loginId;  // 로그인 ID
    @NotEmpty  
    private String name;  // 사용자 이
    @NotEmpty  
    private String password;  
}
```

`domain/member/MemberRepository.java`
```java
package hello.login.domain.member;  

import lombok.extern.slf4j.Slf4j;  
import org.springframework.stereotype.Repository;    
import java.util.*;  

@Slf4j  
@Repository  
public class MemberRepository {  
  
    private static Map<Long,Member> store = new HashMap<>();
    private static long sequence = 0L;//static 사용  
  
    public Member save(Member member){  // 저장 함
        member.setId(++sequence);  
        log.info("save: member={}", member);  
        store.put(member.getId(), member);  
        return member;  
    }
    
    public Member findById(Long id){  
        return store.get(id);  
    }    
    
    public Optional<Member> findByLoginId(String loginId){ 
// ***********************************************************************    
        List<Member> all = findAll();  
        for (Member m : all) {  
            if(m.getLoginId().equals(loginId)){  
                return Optional.of(m);  
            }  
        }  
        return Optional.empty();  
// ***********************************************************************

        //위 코드와 아래 람다코드와 똑같은 로직이다.  
        return findAll().stream()  
                .filter(m -> m.getLoginId().equals(loginId))  
                .findFirst();  
// ***********************************************************************
    }  
    private List<Member> findAll() {  
        return new ArrayList<>(store.values());  
    }  
    public void clearStore(){  
        store.clear();  
    }}
```
:::question java8의 Optional stream 객체에 대한 부분 조사

:::

`web/member/MemberController`
```java
package hello.login.web.member;  
  
import hello.login.domain.member.Member;  
import hello.login.domain.member.MemberRepository;  
import lombok.RequiredArgsConstructor;  
import org.springframework.stereotype.Controller;  
import org.springframework.validation.BindingResult;  
import org.springframework.web.bind.annotation.GetMapping;  
import org.springframework.web.bind.annotation.ModelAttribute;  
import org.springframework.web.bind.annotation.PostMapping;  
import org.springframework.web.bind.annotation.RequestMapping;  
  
import javax.validation.Valid;  
  
@Controller  
@RequiredArgsConstructor  
@RequestMapping("/members")  
public class MemberController {  
  
    private final MemberRepository memberRepository; // MemberRepository에 대한 의존성 주
  
    @GetMapping("/add")  
    public String addForm(@ModelAttribute("member") Member member){  
        return "members/addMemberForm";  
    }  
    @PostMapping("/add")  
    public String save(@Valid @ModelAttribute Member member, BindingResult bindingResult){  
        if(bindingResult.hasErrors()){  
            return "members/addMemberForm";  
        }  
        memberRepository.save(member);  
        return "redirect:/";  
    }}
```

## 로그인에 대한 판별
`domain/login/LoginService.java`
```java
package hello.login.domain.login;  
import hello.login.domain.member.Member;  
import hello.login.domain.member.MemberRepository;  
import lombok.RequiredArgsConstructor;  
import org.springframework.stereotype.Service;  
  
import java.util.Optional;  
  
@Service  
@RequiredArgsConstructor  
public class LoginService {  
  
    private final MemberRepository memberRepository;  
  
    /**  
     *     * @return null 로그인 실패  
     */  
    public Member login(String loginId, String password){  
// *************************************************************************    
        Optional<Member> findMemberOptional = memberRepository.findByLoginId(loginId);  
        Member member = findMemberOptional.get();  
        if(member.getPassword().equals()){  
            return member;  
        }else{  
            return null;  
        }  
  // *************************************************************************
  // 위 코드와 아래 코드는 일치합니다.
        return memberRepository.findByLoginId(loginId)  
                .filter(m -> m.getPassword().equals(password))  
                .orElse(null);  
    }
}
```
- 해당 Service(비즈니스 로직)은 회원을 조회한 다음에 파라미터로 넘어온 pw와 비교해서 같으면 회원으로 반환, 아니면 null로 반환한다.
`web/login/LoginForm.java`
```java
package hello.login.web.login;  
  
import lombok.Data;  
  
import javax.validation.constraints.NotEmpty;  

@Data  
public class LoginForm {  
  
    @NotEmpty  
    private String loginId;  
  
    @NotEmpty  
    private String password;  
} 
```
- 로그인 Form데이터와 직접적으로 통신하는 데이터 셋

`web/login/LoginController.java`
```java
package hello.login.web.login;  
  
import hello.login.domain.login.LoginService;  
import hello.login.domain.member.Member;  
import lombok.RequiredArgsConstructor;  
import lombok.extern.slf4j.Slf4j;  
import org.springframework.stereotype.Controller;  
import org.springframework.validation.BindingResult;  
import org.springframework.web.bind.annotation.GetMapping;  
import org.springframework.web.bind.annotation.ModelAttribute;  
import org.springframework.web.bind.annotation.PostMapping;  
  
import javax.validation.Valid;  
  
@Slf4j  
@Controller  
@RequiredArgsConstructor  
public class LoginContoller {  
  
    private final LoginService loginService;  
  
    @GetMapping("/login")  
    public String loginFrom(@ModelAttribute("loginForm") LoginForm form){  
        return "login/loginForm";  
    }    
    
    @PostMapping("/login")  
    public String login(@Valid @ModelAttribute LoginForm form, BindingResult bindingResult){  
        if(bindingResult.hasErrors()){  
            return "login/loginFrom";  
        }        Member loginMember = loginService.login(form.getLoginId(), form.getPassword());  
        if(loginMember == null){  
            bindingResult.reject("loginFail", "아이디 또는 비밀번호가 맞지 않습니다.");  
            return "login/loginForm";  
        }  
        //로그인 성공 처리 TODO        
        return "redirect:/";  
    }
}
```

# 로그인 처리하기 - 쿠키 사용
:::note 쿠키를 사용해서 로그인, 로그아웃 기능을 구현한다.

:::

### 쿠키 생성
![Pasted-image-20230831135258.png](/img/이미지 창고/Pasted-image-20230831135258.png)
### 클라이언트 쿠키 전달1
![Pasted-image-20230831135354.png](/img/이미지 창고/Pasted-image-20230831135354.png)
### 클라이언트 쿠키 전달2
![Pasted-image-20230831135823.png](/img/이미지 창고/Pasted-image-20230831135823.png)
:::note 쿠키의 종류
- 영속 쿠키
- 만료 날짜를 입력하면 해당 날짜까지 유지
- 세션 쿠키
- 만료 날자를 생략하면 브라우저 종료 시까지만 유지

:::

`web/login/LoginController.java`
```java
...
@PostMapping("/login")  
public String login(@Valid @ModelAttribute LoginForm form, BindingResult bindingResult, HttpServletResponse response){

...
// 쿠키에 시간 정보를 주지 않으면 세션 쿠키(브라우저 종료시 모두 종료)  
	Cookie idCookie = new Cookie("memberId", String.valueOf(loginMember.getId()));  
	response.addCookie(idCookie);
}

```
- 로그인에 성공하면 쿠키를 생성한다.
	- `HttpServletResponse`에 담는다.
- 쿠키 이름은 `memberId` 이고, 값은 회원의 `id`를 담아둔다.
- 웹 브라우저는 종료 전까지 회원의 `id`를 서버에 계속 보내줄 수 있다.

`web/HomeController.java`
```java
package hello.login.web;  
  
import hello.login.domain.member.Member;  
import hello.login.domain.member.MemberRepository;  
import lombok.RequiredArgsConstructor;  
import lombok.extern.slf4j.Slf4j;  
import org.springframework.stereotype.Controller;  
import org.springframework.ui.Model;  
import org.springframework.web.bind.annotation.CookieValue;  
import org.springframework.web.bind.annotation.GetMapping;  
  
@Slf4j  
@Controller  
@RequiredArgsConstructor  
public class HomeController {  
  
    private final MemberRepository memberRepository;  
  
    @GetMapping("/")  
    public String homeLogin(@CookieValue(name = "memberId", required = false)Long memberId, Model model){  
  
  
        //로그인  
        Member loginMember = memberRepository.findById(memberId);  
        if(loginMember == null){  
            return "home";  
        }  
        model.addAttribute("member", loginMember);  
        return "loginHome";  
    }  
}
```
### 로그 아웃
`web/login/LoginController.java`
```java
...
@PostMapping("/logout")  
public String logout(HttpServletResponse response){  
    expireCookie(response);  
    return "redirect:/";  
}  
// 로그아웃에 대한 로직은, Cookie의 시간을 없애면 된다.
private void expireCookie(HttpServletResponse response){  
    Cookie cookie = new Cookie("memberId", null);  
    cookie.setMaxAge(0);  
    response.addCookie(cookie);  
}
...
```

# 쿠키와 보안 문제
:::warning 쿠키를 사용해서 로그인 ID를 전달해서 로그인을 유지할 수 있다. 하지만, 이는 심각한 보안 문제를 야기한다.
:::

## 보안 문제
:::error 쿠키 값음 임의로 변경 할 수 있다.
- 클라이언트가 쿠키를 강제로 변경하면 다른 사용자가 된다.
- 실제 웹 브라우저 개발자 모드 -> Application -> Cookie 변경으로 확인
- `Cookie: loginId=1` -> `Cookie: loginId=2`(다른 사용자의 이름이 보인다)

:::

 >[!error] 쿠키에 보관된 정보는 훔쳐갈 수 있다.
 >- 만약 쿠키에 개인정보나, 신용카드 정보가 있다면?
 >- 이 정보가 웹 브라우저에도 보관되고, 네트워크 요청마다 계속 클라이언트에서 서버로 전달된다.
 >- 쿠키의 정보가 나의 로컬 PC가 털릴 수도 있고, 네트워크 전송 구간에서 털릴 수도 있다.

:::error 해커가 쿠키를 한번 훔쳐가면 평생 사용할 수 있다.
- 해커가 쿠키를 훔쳐가서 그 쿠키로 악의적인 요청을 계속 시도 할 수 있다.

:::

:::success 대안
- 쿠키에 중요한 값을 **노출하지 않고**, 사용자 별로 예측 불가능한 임의의 토큰(**랜덤 값**)을 노출하고, 서버에서 토큰과 사용자 id를 매핑해서 인식한다.
- 그리고 서버에서 토큰을 관리한다.
- 토큰은 해커가 임의의 값을 넣어도 찾을 수 없도록 예상 불가능 해야 한다.
- 해커가 토큰을 털어가도 시간이 지나면 사용할 수 없도록 예상 불가능 해야 한다.
- 해커가 토큰을 털어가도 시간이 지나면 사용할 수 없도록 서버에서 해당 토큰의 만료시간을 짧게(예 : 30분 ) 유지한다.
- 또는 해킹이 의심되는 경우 서버에서 해당 토큰을 강제로 제거하면 된다

:::

# Server Session
![Pasted-image-20230901105015.png](/img/이미지 창고/Pasted-image-20230901105015.png)
![Pasted-image-20230901105134.png](/img/이미지 창고/Pasted-image-20230901105134.png)
- 세션 ID를 생성하는데, 추정이 불가능 해야 한다.
- UUID는 추정이 불가능하다.
![Pasted-image-20230901105328.png](/img/이미지 창고/Pasted-image-20230901105328.png)
- 세션 ID를 응답 쿠키로 전달
- 클라이언트와 서버는 결국 쿠키로 연결 되어 있어야 한다.
- 서버는 클라이언트에 `mySessionId` 라는 이름으로 세션 Id만 쿠키에 담아서 전달한다.
- 클라이언트는 쿠키 저장소에 `mySessionId`쿠키를 보관한다.
:::tip 중요 포인트
- 회원과 관련된 정보는 전혀 클라이언트에 전달 하지 않는다는 점이다.
- 오직 추정 불가능한 세션 ID만 쿠키를 통해 클라이언트에 전달한다.

:::

:::note 정리
- 세션을 사용해서 서버에 중요한 정보를 관리하게 됐다.
- 쿠키 값을 변조 가능 -> 세션 ID로 해결
- 쿠키 보관하는 정보 해킹 가능 -> 세션 ID가 털리기에, 딱히 타격 없음
- 쿠키 탈취 후 사용 -> 만료 되면 사용 불가 의미 없음

:::

## 개발
:::quote 세션 관리는 다음 3가지 기능을 제공하면 됩니다.
- **세션 생성**
- sessionid 생성(임의의 추정 불가능한 랜덤 값)
- session 저장소에 sessionId와 보관할 값 저장
- sessionid로 응답 쿠키를 생성하여 클라이언트에 전달
- **세션 조회**
- 클라이언트가 요청한 sessionid 쿠키의 값으로, 세션 저장소에 보관한 값 조회
- **세션 만료**
- 클라이언트가 요청한 sessionid 쿠키의 값으로, 세션 저장소에 보관한 sessionid와 값 제거

:::

`web/session/SessionManager.java`
```java
package hello.login.web.session;  
  
import org.springframework.stereotype.Component;  
  
import javax.servlet.http.Cookie;  
import javax.servlet.http.HttpServletRequest;  
import javax.servlet.http.HttpServletResponse;  
import java.util.Arrays;  
import java.util.Map;  
import java.util.UUID;  
import java.util.concurrent.ConcurrentHashMap;  
  
/*  
 * 세션 관리  
 */  
@Component  
public class SessionManager {  
  
    // 동시성 이슈로 인한 해결을 ConcurrentHashMap으로 해결 할 수 있다.  
    private Map<String, Object> sessionStore = new ConcurrentHashMap<>();  
    public static final String SESSION_COOKIE_NAME = "mySessionId";  
    /**  
     * 세션 생성  
     * * sessionId 생성  
     *  * 세션 저장소에 sessionId와 보관할 값 저장  
     *  * sessionId로 응답 쿠키를 생성해서 클라이언트에 전달  
     */  
    public void createSession(Object value, HttpServletResponse response){  
  
        // 세션 id를 생성하고, 값을 세션에 저장  
        String sessionId  = UUID.randomUUID().toString();  
        sessionStore.put(sessionId, value);  
  
        //쿠키 생성  
        Cookie mySessionCookie = new Cookie(SESSION_COOKIE_NAME, sessionId);  
        response.addCookie(mySessionCookie);  
    }    /**  
     * 세션 조회  
     */  
    public Object getSession(HttpServletRequest request){  
    // ---------------------------------------------------------
    // 아래 코드와 아래 함수는 같다.
        Cookie[] cookies = request.getCookies();  
        if(cookies == null){  
            return null;  
        }  
        for(Cookie cookie: cookies){  
            if(cookie.getName().equals(SESSION_COOKIE_NAME)){  
                return sessionStore.get(cookie.getValue());  
            }  
        }  
  
        return null;
		// ---------------------------------------------------------

        Cookie sessionCookie = findCookie(request, SESSION_COOKIE_NAME);  
        if(sessionCookie == null){  
            return null;  
        }        
        return sessionStore.get(sessionCookie.getValue());  
    }    
    
    public Cookie findCookie(HttpServletRequest request, String cookieName){  
        if(request.getCookies() == null){  
            return null;  
        }        
        
        return Arrays.stream(request.getCookies())  
                .filter(cookie -> cookie.getName().equals(cookieName))  
                .findAny()  
                .orElse(null);  
    }  
    /**  
     * 세션 만료  
     */  
    public void expire(HttpServletRequest request){  
        Cookie sessionCookie = findCookie(request, SESSION_COOKIE_NAME);  
        if(sessionCookie != null ){  
            sessionStore.remove(sessionCookie.getValue());  
        }
    }
}
```
- 정상적으로 작동이 되는지 Test Code를 작성해본다.
`test/java/login/web/session/SessionManagerTest.java`
```java
package hello.login.web.session;  
  
import hello.login.domain.member.Member;  
import org.assertj.core.api.Assertions;  
import org.junit.jupiter.api.Test;  
import org.springframework.mock.web.MockHttpServletRequest;  
import org.springframework.mock.web.MockHttpServletResponse;  
  
  
public class SessionManagerTest {  
  
    SessionManager sessionManager = new SessionManager();  
  
    @Test  
    void sessionTest(){  
        // response를 사용하기 위해서는 tomcat이 필요한데 spring 자체적으로 mockup tomcat을 지원하여 해당 테스트를 도와준다.  
        // 서버 -> 클라이언트  
        MockHttpServletResponse response = new MockHttpServletResponse();  
        // 세션 생성  
        Member member = new Member();  
        sessionManager.createSession(member,response);  
  
        // 요청에 응답 쿠키 저장  
        // 클라이언트 -> 서버  
        MockHttpServletRequest request = new MockHttpServletRequest();  
        request.setCookies(response.getCookies());  
  
        // 세션 조회  
        Object result = sessionManager.getSession(request);  
        Assertions.assertThat(result).isEqualTo(member);  
  
        // 세션 만료  
        sessionManager.expire(request);  
        Object expired = sessionManager.getSession(request);  
        Assertions.assertThat(expired).isNull();  
    }
}
```

`web/login/LoginController.java`
```java

...
@PostMapping("/login")  
public String loginV2(@Valid @ModelAttribute LoginForm form, BindingResult bindingResult, HttpServletResponse response){  
    if(bindingResult.hasErrors()){  
        return "login/loginFrom";  
    }
	Member loginMember = loginService.login(form.getLoginId(), form.getPassword());  
    
    if(loginMember == null){  
        bindingResult.reject("loginFail", "아이디 또는 비밀번호가 맞지 않습니다.");  
        return "login/loginForm";  
    }  
    //로그인 성공 처리  
  
    // 쿠키에 시간 정보를 주지 않으면 세션 쿠키(브라우저 종료시 모두 종료)  
    sessionManager.createSession(loginMember, response);  
  
    return "redirect:/";  
}

public String logout(HttpServletResponse response){  
    expireCookie(response, "memberId");  
    return "redirect:/";  
}

@PostMapping("/logout")  
public String logoutV2(HttpServletRequest request){  
    sessionManager.expire(request);  
    return "redirect:/";  
}

...
```

`web/HomeController.java`
```java
...
private final MemberRepository memberRepository;  
private  final SessionManager sessionManager;

@GetMapping("/")  
public String homeLoginV2(HttpServletRequest request, Model model){  
    // 세션 관리자에 저장된 회원 정보 조회  
    Member member = (Member)sessionManager.getSession(request);  
    //로그인  
    if(member == null){  
        return "home";  
    }  
    model.addAttribute("member", member);  
    return "loginHome";  
}

...
```

:::note 정리
- 프로젝트 마다 이런 식으로 세션을 직접 개발하는 것은 상당히 불편할 것입니다.
- 그래서 서블릿도 세션 개념을 지원합니다.
- 서블릿이 공식 지원하는 세션은 우리가 직접 만든 세션과 동작 방식이 거의 같다.
- 추가로 세션을 일정 시간 사용하지 않으면 해당 세션을 삭제하는 기능을 제공한다.

:::

## 로그인 처리 - Servelt Session 사용하기
- 세션은 대부분의 웹 어플리케이션이 필요한 것입니다.
- 서블릿은 세션을 위해 `HttpSession` 이라는 기능을 제공합니다.
- 지금까지 직접 구현한 세션의 개념이 이미 구현 되어 있고, 더 잘 구현되어 있다.

:::todo HttpSession 사용
- 서블릿이 제공하는 `HttpSession` 도 결국은 `SessionManager`와 같은 방식으로 작동한다.
- 서블릿을 통해 `HttpSession`을 생성하면 다음과 같은 쿠키를 생ㅅ헝한다.

:::

`web/SessionConst.java`
```java
package hello.login.web;  
  
public class SessionConst {  
    public static final String LOGIN_MEMBER = "loginMember";  
}
```

`web/login/LoginController.java`
```java
...

@PostMapping("/login")  
public String loginV3(@Valid @ModelAttribute LoginForm form, BindingResult bindingResult, HttpServletRequest request){  
    if(bindingResult.hasErrors()){  
        return "login/loginFrom";  
    }    
    Member loginMember = loginService.login(form.getLoginId(), form.getPassword());  
    
    if(loginMember == null){  
        bindingResult.reject("loginFail", "아이디 또는 비밀번호가 맞지 않습니다.");  
        return "login/loginForm";  
    }  
    
    //로그인 성공 처리  
    // 세션이 있으면, 세션 반환, 없으면 신규 세션을 생성  
    HttpSession session = request.getSession();  
    //세션에 로그인 회원 정보 보관  
    session.setAttribute(SessionConst.LOGIN_MEMBER, loginMember);  
    return "redirect:/";  
}

@PostMapping("/logout")  
public String logoutV3(HttpServletRequest request){  
    HttpSession session = request.getSession(false); 
    // 세션이 존재 할 시에는 해당 세션 데이터를 날라가게 만드는 로직이다. 
    if(session != null){  
        session.invalidate();  
    }    return "redirect:/";  
}

...
```
### 세션 생성과 조회
- 세션을 생성하려면 `request.getSession(true)`를 사용하면 된다.
- `public HttpSession getSession(boolean create);`

#### 세션 `create`옵션
- `request.getSesstion(true)`
	- 세션이 있으면 기존의 세션을 반환한다.
	- 세션이 없으면, 새로운 세션을 생성해서 반환한다.
- `request.getSession(false)`
	- 세션이 있으면 기존의 세션을 반환한다.
	- 세션이 없으면, 새로운 세션을 생성하지 않고, `null`을 반환한다.
- `request.getSession()` : 신규 세션을 생성하는 `request.getSession(true)`와 동일하다.

`
`web/HomeController.java`
```java
...

@GetMapping("/")  
public String homeLoginV3(HttpServletRequest request, Model model){  
  
    // URL접근 시 Session을 생성할 이유가 없기 때문에, false로 설정한다.  
    HttpSession session = request.getSession(false);  
    // 세션 관리자에 저장된 회원 정보 조회  
  
    // 새션에 회원 데이터가 없으면 home    
    if(session == null){  
        return "home";  
    }  
    Member loginMember = (Member)session.getAttribute(SessionConst.LOGIN_MEMBER);  
    // 세션이 유지되면 로그인으로 이동  
    model.addAttribute("member", loginMember);  
    return "loginHome";  
}
...
```

### `@SessionAttribute`
- 스프링은 세션을 더 편리하게 사용할 수 있도록 `@SessionAttribute`을 지원한다.
- 이미 로그인 된 사용자를 찾을 때는 다음과 같이 사용하면 된다.
	- 이 기능은 세션을 생성하지 않는다.

`web/HomeController.java`
```java
...
@GetMapping("/")  
public String homeLoginV3Spring(@SessionAttribute(name = SessionConst.LOGIN_MEMBER, required = false) Member loginMember, Model model){  
  
    // 새션에 회원 데이터가 없으면 home    
    if(loginMember == null){  
        return "home";  
    }    // 세션이 유지되면 로그인으로 이동  
    model.addAttribute("member", loginMember);  
    return "loginHome";  
}
...
```
### TrackingModes
- 로그인을 처음 시도하면 아래의 코드가 URL뒤에 붙게 된다.
- `jsessionid=F2EE6C5D3942C94239AB579F9D518863` 
- 이 방식은 웹 브라우저가 쿠키를 지원하지 않을 때 쿠키 대신 URL을 통해서 세션을 유지하는 방식이다.
- 이 방법을 사용하려면 URL에 이 값을 계속 포함해서  전달해야 한다.
- 타임리프 같은 템플릿은 엔진을 통해서 링크를 걸면 `jsessionid`를 URL에 자동으로 포함해준다.
- 서버 입장에서 웹 브라우저가 쿠키를 지원하는지 하지 않는지 최초에는 판단하지 ㅇ못하므로, 쿠키 값도 전달하고 URL에 `jsessionid`도 함께 전달한다.

- URL 전달 방식을 끄고 항상 쿠키를 통해서만 세션을 유지하고 싶다면, 다음 옵션을 넣어주면 된다.
`application.propertis`
```properties
server.servlet.session.tracking-modes=cookie
```

## 세션 정보와 타임 아웃 설정
`web/session/SessionController.java`
```java
package hello.login.web.session;  
  
  
import lombok.extern.slf4j.Slf4j;  
import org.springframework.web.bind.annotation.GetMapping;  
import org.springframework.web.bind.annotation.RestController;  
  
import javax.servlet.http.HttpServletRequest;  
import javax.servlet.http.HttpSession;  
  
@Slf4j  
@RestController  
public class SessionInfoController {  
  
    @GetMapping("/session-info")  
    public String sessionInfo(HttpServletRequest request){  
        HttpSession session = request.getSession(false);  
        if(session == null){  
            return "세션이 없습니다.";  
        }  
        // 세션 데이터 출력  
        session.getAttributeNames().asIterator()  
                .forEachRemaining(name -> log.info("session name={}, value={}", name, session.getAttribute(name)));  
  
        log.info("sessionId={}", session.getId());  
        log.info("getMaxInactiveInterval={}", session.getMaxInactiveInterval());  
        log.info("getCreationTime={}", session.getCreationTime());  
        log.info("getLastAccessedTime={}", session.getLastAccessedTime());  
        log.info("isNew={}", session.isNew());  
  
        return "세션 출력";  
    }    
}
```
- `sessionId`: 세션 ID, `JESSIONID`의 값이다.
- `maxInactiveInterval` : 세션의 유효 시간
	- 예) 1800초(30분)
- `creationTime` : 세션 생성일시
- `lastAccessdTime` : 세션과 연결된 사용자가 최근에 서버에 접근한 시간, 클라이언트에서 서버로 `sessionId` `(JSESSIONID)`를 요청한 경우 개신된다.
- `isNew` : 새로 생성된 세션인지, 아니면 이미 과거에 만들어졌고, 클라이언트에서 서버로 `sessionId` `(JSESSIONID)`를 요청해서 조회된 세션인지 여부

## 세션 타임아웃 설정
- 세션은 사용자가 로그아웃을 직접 호출해서 `session.invalidate()`가 호출 되는 경우에 삭제 된다.
- 대부분의 사용자는 로그아웃을 선택하지 않고, 그냥 브라우저를 종료한다.
- 문제는 HTTP가 비 연결성(ConnectionLess)이므로, 서버 입장에서는 해당 사용자가 웹 브라우저를 종료한 것인지 아닌지를 인식 할 수 없다.
- 서버에서 세션 데이터를 언제 삭제해야 하는지 판단하기가 어렵다.

- 이 경우 남아있는 세션을 무한정 보관하면 다음과 같은 문제가 발생한다.

- 세션과 관련된 쿠키 `(JSESSIONID)`를 탈취 당했을 경우 오랜 기간이 지나도 해당 쿠키로 악의적인 요청을 할 수 있다.
- 세션은 기본적으로 메모리에 생성된다.
- 메모리의 크키가 무한하지 않기 때문에 꼭 필요한 경우만 생성해서 사용해야 한다.
- 10만명의 사용자가 로그인하면 10만 개의 세션이 생성되는 것이다.

:::error 세션의 종료 시점
- 세션의 정료 시점을 어떤 식으로 정하면 좋을까?
- 세션 생성 시점으로부터 30분 정도로 잡으면, 30분이 지나면 세션이 삭제 되기에 다시 로그인 해서 세션을 생성해줘야한다.
- 더 나은 대안은 세션 생성 시점이 아니라 사용자가 서버에 최근 오청한 시간을 기준으로 30분 정도를 유지하는 것이다.
- 사용자가 서비스를 사용하고 있으면, 세션의 생존 시간이 30분으로 계속 늘어나게 된다.
- 30분 마다 로그인 해야 하는 번거로움이 사라집니다.
- `HttpSession`은 해당 방식을 사용하고 있습니다.

:::

### 세션 타임 아웃 글로벌 설정
`application.properties`
```properties
server.servlet.session.timeout=1800 // 1800초
```

### 세션 타임 아웃 특정 단위 설정
```java
session.setMaxInactiveInterval(1800); //1800초
```

### 세션 타임 아웃 발생
- 세션의 타임 아웃 시간은 해당 세션과 관련된 `JSESSIONID`를 전달하는 HTTP요청이 있으면 현재 시간으로 다시 초기화 된다.
- 이렇게 초기화 되면 세션 타임 아웃으로 설정한 시간 동안 세션을 추가로 사용할 수 있다.
- `session.getLastAccessedTime()` : 최근 세션 접근 시간
- `LastAccessdTime`  이후로 timeout 시간이 지나면, WAS가 내부에서 해당 세션을 제거한다.

:::note 정리
- 서블릿의 `HttpSession`이 제공하는 타임 아웃 기능 덕분에 세션을 안전하고, 편리하게 사용할 수 있다.
- 실무에서 주의할 점은 세션에는 최소한의 데이터만 보관해야 한다는 점이다.
- 보관한 데이터 용량 * 사용자 수로 세션의 메모리 사용량이 급격하게 늘어난다.
- 추가로 세션의 시간이 너무 길게 가져가면 메모리 사용이 계속 누적 될 수 있으므로 적당한 시간을 선택하는 것이 필요하다.
- 기본이 30분이라는 것을 기준으로 고민하면 된다.

:::

# 필터, 인터셉터
## 필터

:::error 공통 관심 사항
- 요구사항을 보면, 로그인 한 사용자만 상품 관리 페이지에 들어갈 수 있어야 한다.
- 앞에서 로그인을 하지 않는 사용자에게는 상품 관리 버튼이 보이지 않기 때문에, 문제가 없어보인다.
- 그런데 문제는 로그인 하지 않는 사용자도 다음 URL을 직접 호출하면 상품 관리 화면에 들어갈 수 있다는 점이다.

:::

- 상품 관리 컨트롤러에서 로그인 여부를 체크하는 로직을 하나하나 작성하는 방법도 있다.
- 하지만 이는 매우 비 효율 적인 방법이다.
	- 모든 컨트롤러마다 지속적으로 해당 로직을 작성 해야 하기 때문이다.

- 위의 고민처럼 애플리케이션 여러 로직에서 공통으로 관심이 있는 것을 <mark>공통 관심사(cross-cutting concern)</mark> 이라고 한다.
- 이러한 공통 관심사는 AOP로도 충분히 해결 가능하지만, 
- 웹과 관련된 <mark>공통 관심사</mark>는 서블릿 필터 또는 <mark>스프링의 인터셉터</mark>를 사용하는 것이 더 좋다.
	- HTTP의 Header나 URL 정보들이 필요한데, 서블릿 필터나 스프링 인터셉터는 `HttpServletRequest`를 제공한다.

:::info 서블릿 필터?
- 필터는 서블릿이 지원하는 수문장이다.

:::

### 필터 흐름

```
HTTP 요청 -> WAS -> 필터 -> 서블릿 -> 컨트롤러
```
- 모든 고객의 요청 로그를 남기는 요구사항이 있다면, 필터를 사용하면 된다.
	- 필터는 특정 URL 패턴에 적용할 수 있다.
	- `/*` 이라고 하면 모든 요청에 필터가 적용 된다.
		- 스프링을 사용하는 경우, 여기서 말하는 서블릿은 디스패처 서블릿으로 생각하면 된다.

### 필터 제한
```
HTTP 요청 -> WAS -> 필터 -> 서블릿 -> 컨트롤러 // 로그인 사용자

HTTP 요청 -> WAS -> 필터(적절하지 않는 요청이라고 판단, 서블릿 호출 X) //  비 로그인 사용자
```

### 필터 체인
```
HTTP 요청 -> WAS -> 필터1 -> 필터2 -> 필터3 ->  서블릿 -> 컨트롤러
```
- 필터는 체인으로 구성된다.
- 중간에 필터를 자유롭게 추가 가능하다.
	- 로그를 남기는 필터를 먼저 적용, 그 다음 로그인 여부를 체크하는 필터를 만들 수 있다.

### filter interface
```java
public interface Filter{
	public default void init(FilterConfig filterConfig) throws ServletException{
	
	}

	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) thorws IOException, ServletException;

	public default void destroy() {}
}
```
- 필터 인터페이스를 구현하고 등록하면 서블릿 컨테이너가 필터를 싱글톤 객체로 생성하고, 관리한다.
- `init()` : 필터 초기화 메서드, 서블릿 컨테이너가 생성될 때 호출 된다.
- `doFilter()` : 고객의 요청이 올 때 마다 해당 메서드가 호출 된다.
- `destroy()` : 필터 종료 메서드, 서블릿 컨테이너가 종료될 때 호출 된다.

## 실습
`login/web/filter/LogFilter`
```java
package hello.login.web.filter;  
  
import lombok.extern.slf4j.Slf4j;  
  
import javax.servlet.*;  
import javax.servlet.http.HttpServletRequest;  
import java.io.IOException;  
import java.util.UUID;  
  
@Slf4j  
public class LogFilter implements Filter {  
  
  
    @Override  
    public void init(FilterConfig filterConfig) throws ServletException {  
        log.info("log filter init");  
    }  
    @Override  
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {  
        log.info("log filter doFilter");  
  
        HttpServletRequest httpRequest = (HttpServletRequest) request;  
        // 모든 사용자의 URI를 남기기 위해서  
        String requestURI = httpRequest.getRequestURI();  
  
        // 요청 온것을 구분하기 위해서 uid를 생성  
        String uuid = UUID.randomUUID().toString();  
        try {  
            log.info("REQUEST [{}][{}]", uuid, requestURI);  
            // 아래의 로직에서 doFilter가 나올 시에는 chain 형식을 Fitler를 정렬할 수 있다.  
            chain.doFilter(request, response);
            
        }catch (Exception e){  
            throw e;  
        }finally {  
            log.info("RESPONSE [{}][{}]", uuid, requestURI);  
        }    
    }  
    @Override  
    public void destroy() {  
        log.info("log filter destroy");  
    }
}
```

:::warning 주의점
- 꼭 servlet Filter로 선택할 것!
![Pasted-image-20231016103400.png](/img/이미지 창고/Pasted-image-20231016103400.png)

:::

#### 적용하기
`login/WebConfig.java`
```java
package hello.login;  
  
import hello.login.web.filter.LogFilter;  
import org.springframework.boot.web.servlet.FilterRegistrationBean;  
import org.springframework.context.annotation.Bean;  
import org.springframework.context.annotation.Configuration;  
  
import javax.servlet.Filter;  
import javax.servlet.FilterRegistration;  
  
@Configuration  
public class WebConfig {  
  
    @Bean  
    public FilterRegistrationBean logFilter(){  
        // 해당 Filter를 Spring에서 사용할 때는 Bean에 등록해서 사용해야한다.  
        FilterRegistrationBean<Filter> filterRegistrationBean = new FilterRegistrationBean<>();  
        // 생성자 생성후 (Bean), 우리가 만든 필터를 넣어주면 된다.  
        filterRegistrationBean.setFilter(new LogFilter());  
        //필터의 작동 순서  
        filterRegistrationBean.setOrder(1);  
        //어떤 URL 패턴에 해당 Filter를 작동 시킬 것인지  
        filterRegistrationBean.addUrlPatterns("/*");  
  
        return filterRegistrationBean;  
    }
}
```
- `public class LogFilter implements Filter {}`
	- 필터를 사용하려면 필터 인터페이스를 구현해야한다.
- `doFilter(ServletRequest request, ServletResponse response, FilterChain chain)`
	- HTTP 요청이 오면 `doFilter`가 호출된다.
	- `ServletRequest request` 는 HTTP 요청이 아닌 경우까지 고려해서 만든 인터페이스,이다.
	- HTTP를 사용하면, `HttpServletRequest httpRequest = (HttpServletRequest) request;` 와 같이 다운 케스팅 하며 된다.
- `String uuid = UUID.randomUUID().toString;`
	- HTTP 요청을 구분하기 위해 요청 당 임의의 `uuid`를 생성해둔다.
- `log.info("REQUEST [{}][{}]", uuid, requestURI);`
	- `uuid` 와 `requestURI`를 출력한다.
- `chain.doFilter(request, response);`
	- 다음 필터가 있으면, 필터 호출, 없으면 서블릿 호출
	- 이 로직이 호출하지 않으면 이 단계로 진행되지 않는다.

## 서블릿 인증 체크
- 로그인 되지 않은 사용자는 상품 관리 뿐만 아니라 미래에 개발될 페이지에도 접근하지 못하게 
`web/filter/LoginCheckFilter`
```java
package hello.login.web.filter;  
  
import hello.login.web.SessionConst;  
import lombok.extern.slf4j.Slf4j;  
import org.springframework.util.PatternMatchUtils;  
  
import javax.servlet.*;  
import javax.servlet.http.HttpServletRequest;  
import javax.servlet.http.HttpServletResponse;  
import javax.servlet.http.HttpSession;  
import java.io.IOException;  
  
@Slf4j  
public class LoginCheckFilter implements Filter {  
  
    private static final String[] whitelist = {"/", "/members/add", "/login", "/logout", "/css/*"};  
  
  
    // init과 Destroy는 default가 구현되어있기에, 굳이 안해도 된다.  
    @Override  
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {  
        HttpServletRequest httpRequest = (HttpServletRequest) request;  
        String requestURI = httpRequest.getRequestURI();  
  
        HttpServletResponse httpResponse = (HttpServletResponse) response;  
  
        try{  
            log.info("인증 체크 필터 시작 {}", requestURI);  
            HttpSession session = httpRequest.getSession(false);  
            if(session <mark> null || session.getAttribute(SessionConst.LOGIN_MEMBER) </mark> null){    
                log.info("미인증 사용자 요청{}", requestURI);  
                //로그인으로 redirect                
                httpResponse.sendRedirect("/login?redirectURL="+requestURI);  
                return;  
            }  
            chain.doFilter(request, response);  
        }catch (Exception e){  
            throw e;  
        }finally {  
            log.info("인증 체크 필터 종료{}", requestURI);  
        }    
    }  
    /*  
    * 화이트 리스트의 경우 인증 체크 X    
    * */    
    public boolean isLoginCheckPath(String requestURI){  
        return PatternMatchUtils.simpleMatch(whitelist, requestURI);  
    }  
}
```






---

#Java #Spring_Java 

---


