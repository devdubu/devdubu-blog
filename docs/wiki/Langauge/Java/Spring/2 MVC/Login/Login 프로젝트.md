---
slug: "Login-프로젝트"
---


# Login
:::note 요구사항
- 홈 화면 - 로그인 전
- 회원 가입
- 로그인
- 홈 화면  - 로그인 후
- 본인 이름
- 상품 관리
- 로그 아웃
- 보안 요구사항
- 로그인 사용자만 상품에 접근하고, 관리 할 수 있음
- 로그인 하지 않은 사용자가 상품 관리에 접근하면 로그인 화면으로 이동
- 회원 가입, 상품 관리

:::

## 화면
### 홈화면 - 로그인 전
![Pasted-image-20230831111139.png](/img/Pasted%20image%2020230831111139.png)
### 홈 화면 - 로그인 후
![Pasted-image-20230831111205.png](/img/Pasted%20image%2020230831111205.png)
### 회원 가입
![Pasted-image-20230831111248.png](/img/Pasted%20image%2020230831111248.png)
### 로그인
![Pasted-image-20230831111302.png](/img/Pasted%20image%2020230831111302.png)
### 상품 관리
![Pasted-image-20230831111315.png](/img/Pasted%20image%2020230831111315.png)

# 프로젝트 구성
## Package 구성
- hello.login
	- domain
		- item
		- member
		- login
	- web
		- item
		- member
		- login

:::info 도메인?
- 화면, UI, 기술 인프라 등등의 영역은 제외한 시스템이 구현해야하는 핵심 비즈니스 업무 영역을 말한다.

:::

:::warning 향후 web을 다른 기술로 바꾸어도 도메인은 그대로 유지할 수 있어야한다.
-  web은 도메인을 알고 있지만, domain은 web을 모르도록 설계해야 한다.
- 이것을 web domain을 의존하지만, domain은 web을 의존하지 않는다고 표현 해야 한다.
- 즉, web package를 모두 삭제해도 domain에 영향이 가면 안된다.






:::
