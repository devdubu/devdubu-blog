---
slug: "JWT-Tip"
---
# JWT 인증 및 인가

:::tip JWT를 사용하다보면 `Bearer` 이라는 단어가 많이 보인다.
- 이유인 즉, JWT를 구성하는데 아래와 같기 때문이다.

:::

 `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiIsImlhdCI6MTczMDYyMDM5NX0._xPZ1CHMANqANFtCuo2SZoYghc4yB4L1TN-2O1ySs5M`

즉, Bearer Token인 셈이다.

# PostMan에서 JWT 사용하기
![Screenshot-2024-11-03-at-5.17.14-PM.png](/img/이미지 창고/Screenshot-2024-11-03-at-5.17.14-PM.png)

위와 같은 형식으로 Authroization에서 Auth Type을 `Bearer Token`으로 지정한 후에 Token에 발급 받은 Token을 넣어주면 됩니다.

# Token의 유효시간
예전에 생성했던 Token으로 지속적으로 로그인이 가능할시에는 당연하게도 해킹의 우려가 존재한다.
그렇기에, 해당 Token의 유효시간을 이용해서 해킹을 방지 할 수 있다.

:::note 유효시간을 너무 짧게 하면?
- 자동으로 로그아웃돼서 너무 자주 로그인을 다시 해야한다.


:::

:::note 유효시간을 너무 길게 하면
- token의 유효시간을 주는 이유가 사라지게 된다.
- token이 탈취 당하면, 긴 유효시간이 끝날때 까지 계속 탈튀 당한 토큰을 사용하게 됩니다.

:::

## Refresh Token
위와 같은 문제점을 보완하기 위해서 `refresh Token`을 사용하게 됩니다.
`refresh Token`도 `access Token`처럼 jwt를 이용해 발급 가능하며, 주로 `access Token`의 유효시간을 짧게 해주며, `refresh Token`은 길게 해줍니다.
그래서 `access Token`의 유효시간이 다 지나면 `refresh Token`을 이용해서 새로운 `access Token`을 발급 해줍니다.


![Diagram-3.svg](/img/이미지 창고/Diagram-3.svg)

1. 사용자가 로그인 시도를 합니다.
	1. 서버에서는 로그인 회원을 DB에서 찾습니다.
	2. 또한 비번도 확인합니다.
2. 로그인이 완료 되면 Access Token과 함께 Refresh Token이 발급됩니다.
	1. 회원 DB에 일반적으로 Refresh Token을 저장합니다. or Redis
3. 사용자가 Refresh Token을 안전한 장소에 보관한 후, 서버에 요청을 보낼 때, Access Token을 Header에 실어 요청을 보냅니다.
4. Access Token을 서버에서 검증하게 되며, 맞는 Token이라면 요청한 데이터를 보내줍니다.
5. Access Token의 유효기간이 만료되었을 때, 요청을 보냅니다.
6. Access Token의 유효 기간이 만료되었기 때문에, 권한 없을 에러를 보냅니다.
7. 사용자는 Refresh Token을 서버로 보내며 Access Token 발급 요청을 보냅니다.
8. 서버에서 사용자가 보낸 Refresh Token과 DB에 저장되어 있는 Refresh Token을 비교합니다.
	1. Refresh Token이 동이랗고 유효기간도 지나지 않았다면, Access Token을 새로 발급합니다.

---

#BackEnd #JWT

----