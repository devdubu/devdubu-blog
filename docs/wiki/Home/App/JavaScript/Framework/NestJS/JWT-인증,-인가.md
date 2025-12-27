---
종료 날짜: 2025-04-10
시작 날짜: 2025-04-10
분류: 공부
카테고리: BackEnd
세부 카테고리:
  - JavaScript
  - NestJS
특징:
  - Book
  - 개념
sticker: vault//이미지/개발 로고/TechIconSVG/Nest.js.svg

slug: "JWT-인증,-인가"
---

# 가드
앞서 인증을 미들웨어로 구현하는 것이 좋은 사례라고 했습니다.
애플리케이션은 사용자의 권한을 확인하기 위해 인증과 인가를 수행해야합니다.

인증은 요청자가 자신이 누구인지 증명하는 과정입니다.
최근에는 매 요청마다 헤더에 JWT 토큰을 실어 보내고 이 토큰을 통해 요청자가 라우터에 접근 가능한지 확인하는 방식을 많이 사용합니다.
쉽게 이야기 해서 현재 요청자가 해당 서비스의 올바른 유저인지 검증합니다.

이해 비해 인가는 인증을 통과한 유저가 요청한 기능을 사용할 권한이 있는지를 판별하는 것을 말합니다.
`permission`, `role`, `access control list` 같은 개념을 사용하여, 유저가 가지고 있는 속성으로 릿스를 사용을 허용할 지 판별합니다.
인가는 `guard`를 이용하여 구현할 수 있는 좋은 사례 입니다

:::note 보통 인증과 인가가 실패할 경우의 응답에 대한 HTTP 상태 코드는
- 401 Unauthorized와 403 Forbidden 입니다.
- 401의 이름이 Unauthorized로 되어 있으므로 주의 바랍니다.

:::

그러면 인가를 인증처럼 미들웨어로 구현하면 안될까?
불행히도 미들웨어는 `ExecutionContext`에 접근하지 못한다.
단순히 자신의 일만 수해하고 `next()`를 호출합니다.

즉, 다음에 어떤 핸들러가 실행될지 알수 없습니다.
이에 반해 가드는 `ExecutionContext` 인스턴스에 접근 할 수 있어 다음 실행될 작업을 정확히 알 수 있습니다.

## 가드를 이용한 인가
가드를 이용해서 인가 기능을 간단히 구현해보겠습니다.
실제 인가는 여러분이 만들 서비스의 내부 규칙에 따라 달라지게 됩니다.
예를 들어 사용자가 가입한 요금제에 따라 서비스에서 제공하는 기능이 다를 경우, 교청 객체에 포함된 정보(예: Token)를 분석하여, 사용자가 해당 기능을 사용할 수 있는지 판단합니다.

가드는 `CanActivate` 인터페이스를 구현해야합니다.

```ts
import { CanActivate, ExecutionContext, Injectable } from ‘@nestjs/common’;
import { Observable } from ‘rxjs’;

@Injectable()
export class AuthGuard implements CanActivate{
	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean>{
		const request = context.switchToHttp().getRequest();
		return this.validateRequest(request)
	}

	private validateRequest(request: any){
		return true
	}
}
```

### 실행 콘텍스트
`canActivate` 함수는 `ExecutionContext` 인스턴스를 인수로 받습니다.
`ExecutionContext`는 `ArgumentsHost`를 상속 받는데, 요청과 응답에 대한 정보를 가지고 있습니다.
우리는 HTTP로 기능을 제공하고 있으므로, 인터페이스에서 제공하는 함수 중 `switchToHttp()` 함수를 사용하여 필요한 정보를 가지고 올 수 있습니다.
```ts
export interface ExecutionContext extends ArgumentsHost{
	getClass<T = any>(): Type<T>
	getHandler(): Function;
}

export interface ArgumentsHost{
	getArgs<T extends Array<any> = any[]>(): T;
	getArgByIndex<T = any>(index: number): T;
	switchToRpc(): RpcArgumentsHost;
	switchToHttp(): HttpArgumentsHost;
	switchToWs(): WsArgumentsHost;
	getType<TContext extends string = ContextType>(): TContext;
}

export interface HttpArgumentsHost{
	getRequest<T = any>(): T;
	getResponse<T = any>(): T;
	getNext<T = any>(): T;
}
```

이렇게 얻은 정보를 내부 규칙으로 평가하는 `validateRequest` 함수를 통해 인가를 진행합니다.
편의상 `validateRequest`는 `true`를 리턴한다고 하겠습니다.
`false` 로 바꾼 후 요청을 해보면 `403 Forbidden` 에러가 발생하게 됩니다.
만약 다른 에러를 응답으로 반환하고 싶다면, 직접 다른 예외를 생성해서 던져야 합니다.

### 가드 적용
가드를 적용하는 방법은 앞서 예외 필터를 적용하는 것과 유사합니다.
컨트롤러 범위 또는 메서드 범위로 적용하고자 한다면, `@UseGuards(AuthGuard)` 와 같이 사용하면 됩니다.
`AuthGuard` 인스턴스의 생성은 Nest가 맡아서 합니다.

```ts
@UseGuards(AuthGuard)
@Controller()
export class AppController{
	construcator(private readonly appService: AppService){ }

	@UseGuards(AuthGuard)
	@Get()
	getHello(): string{
		return this.appService.getHello();
	}

}
```

전역으로 가드를 적용하고 싶다면 부트 스트랩 과정을 수정해야 합니다.
```ts
...
async function bootstrap(){
	const app = await NestFactory.create(AppModule)
	app.useGlobalGuards(new AuthGuard());
	await app.listen(3000);
}

bootstrap();
```
- `useGlobalGuards` 함수를 사용하여 전역 가드를 설정합니다.

가드에 종속성 주입을 사용해서 다른 프로바이더를 주입해서 사용하고 싶다면, 커스텀 프로바이더로 선언해야합니다.

`app.module.ts`
```ts
import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nest/core'

@Module({
	providers:[
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		}
	]
})

export class AppModul { }
```

가드를 적용하는 방법을 알아봤습니다.
이제 유서 서비스에 실제로 가드를 적용해서 인증/인가를 구현하면 됩니다.

## 인증
사용자의 리소스를 보호하기 위해서는 서버에 접속하는 클라이언트가 리소스의 주인인지 확인하는 인증 절차를 거쳐야합니다.
사용자가 아이디와 비밀번호로 로그인하면 로그아웃 할 때까지는 사용자가 가진 권한 내에서 서비스를 이용할 수 있어야합니다.

즉, 사용자가 가진 리소스를 조회하고 변경할 수 있게 됩니다.
그렇다고 매번 리소스에 접근할 대마다 아이디와 패스워드를 입력 받도록 하는 것은 말이 안되는 UX이죠

그렇다면 어떻게 아이드와 패스워드 한번만 제출 했는데도, 매번 리소스에 대해 접근이 가능하게 할 수 있을까요?
여러 가지 인증방식이 존재하지만, 주로 세션이나 토큰을 이용한 방식을 사용합니다.

특히 토큰은 뒤에서 소개할 장점으로 인해 많은 서비스에서 채택하고 있고, 그 중에서도 JWT를 이용하는 방식이 거의 표준이 되었습니다.
최근에 만들어진 서비스는 거의 모두 사용한다고 해도 무방할 듯 합니다.

### 세션 기반 인증
세션은 로그인에 성공한 유저가 서비스를 사용하는 동안 저장하고 있는 유저 정보 입니다.
서버는 세션을 생성하고 나서 세션을 DB에 저장하고, 이후 사용자의 요청에 포함된 세션 정보가 세션 DB에 저장되어 있는지를 확인합니다.
브라우저에는 데이터를 저장할 수 있는 공간이 있습니다.

현재 열려있는 브라우저를 닫거나 새로운 탭, 창을 열면 데이터가 삭제되는 세션 저장소와 창을 닫아도 데이터가 남아있는 로컬 저장소, 그리고 간단한 데이터를 저장할 수 있는 쿠키가 있습니다.

![Image/BackEnd/NodeJS/NestJS/JWT 인증,인가/Diagram-1.svg](/img/이미지 창고/Diagram-1.svg)
세션 방식의 단점은 악의적인 공격자가 브라우저에 저장된 데이터를 탈취할 수 있다는 것입니다.
비록 세션을 알 수 없는 문자열로 만들었다고 해도, HTTP 는 보안이 취약하기 때문에 중간에 전달되는 데이터 역시 가로챌 수 있다.

이렇게 탈취된 세션을 이용하면 마치 해당 사용자 인 것 처럼 서버에 접근 할 수 있습니다.
이를 방지하기 위해 HTTPS로 암호화된 통신을 하고 세션에 유효기간을 정해둡니다.
유효 기간이 만료된 세션인 경우 다시 로그인을 유도하게 됩니다.

유호기간은 서비스 사용자가 불편함이 없는 적당한 시간으로 해야합니다.

세션은 서버의 저장소에 저장되고, 빠른 응답을 위해 메모리에 상주시키는 경우가 많습니다.
이로 인해 서비스에 사용자가 몰렸을 경우 요청마다 세션을 확인해야 하므로 DB에 많은 부하를 일크키게 되고 메모리 부족으로 서비스 장애가 발생할 수도 있습니다.

클라우드를 이용하면 서버와 DB를 유연하게 증설 할 수 있다고 하지만 그 시간에 서비스 장애를 겪을 수도 있습니다.
Redis와 같은 인프라를 이용하여 메모리에 상주하는 세션을 좀 더 빠르게 처리하도록 하는 방법을 사용합니다.

또한 서비스가 여러 도메인으로 나누어져 잇는 경우 CORS 문제로 인해 도메인간 세션을 공유하도록 하기 위한 처리가 번거롭습니다.

### 토큰 기반 인증
세션이 사용자 인증 정보를 서버에 저장하는 방식인 반면, 토큰은 사용자가 로그인 했을 때 서버에서 토큰을 생성해서 잔달하고 따로 저장소에 저장하지 않는 방식입니다.
로그인 이후 요청에 대해 클라이언트가 전달한 토큰 검증만 수행합니다.
이렇게 하기 위해서는 당연히 특정한 검증 방식이 필요한데, JWT를 많이 사용합니다.
![Image/BackEnd/NodeJS/NestJS/JWT 인증,인가/Diagram-2.svg](/img/이미지 창고/Diagram-2.svg)

토큰 기반 인증을 이용하면 세션과 같이 상태를 관리할 필요가 없어 어느 도메인의 서비스로 보내더라도 같은 인증을 수행할 수 있게 됩니다.
이를 확장하면, 메타 구글 계정으로 다른 서비스에 로그인을 할 수 있는 OAuth를 구현할 수 있습니다.

또한 토큰 기반 인증 방삭은 세션 저장소가 서버에 필요하지 않기 때문에 세션 기반 방식에서 발생하는 문제가 줄어듭니다ㅣ.

이어서 JWT의 동작 원리를 알아보고 로그인에 적용해보겠습니다.

## JWT
Json Web Token 은 RFC 7519에 소개된 것으로 문서를 초록을 옮기면 다음과 같습니다.
:::info 
JWT는 두 당사자 사이에 이전될 수 있는 클레임을 나타내는 간결하고 URL에서 안전한 방법입니다.
JWT에 포함된 클레임은 JSON 으로 인코딩되어 JSON Web Signature의 페이로드 또는 JSON Web Encryption의 일반적인 텍스트로 사용됩니다.
클레임을 디지털 방식으로 서명하거나 메시지 인증 코드로 암호화 해서 무결성을 보호합니다.

:::

JWT는 헤더, 페이로드, 시그니처 3가지 요소를 가지며 . 으로 구분됩니ㅏㄷ.
헤더와 페이로드는 각각 base64로 인코딩 되어있습니다.
base 64로 인코딩을 하면 사람이 읽을 수 없고, 디코딩이 필요하지만, JWT를 HTTP 헤더나 요청 매개변수 또는 폼 매개변수로 사용할 수 있습니다.
또 JSON 문자열을 데이터베이스나 프로그래밍 언어에서 지원하지 않는 경우가 있기 때문에 이 경우를 위해서라도 base 64 인코딩은 필요 합니다.

### Header
점 으로 구분된 가장 첫번때 문자열은 Header 입니다.
header는 일반적으로 JWT의 유형과 어떤 알고리즘에 의해 인코딩 되었는지를 포함합니다.

```json
{
	"typ": "JWT",
	"alg": "HS256"
}
```

- `"typ"`
	- 매개 변수는 JWS와 JWE에 정의된 미디어 타입 입니다.
	- 이는 JWT를 처리하는 애플리케이션에게 페이로드가 무엇인지를 알려주는 역할을 합니다.
	- 즉, 이 토큰은 JWT라는 것을 뜻하므로, JWT라는 값으로 정의하라고 권고하고 있습니다.
- `"alg`
	- 토큰을 암호화 하는 알고르즘 입니다.
	- 암호화하지 않을 경우 `"none"` 으로 정의 하고 , 암호화를 할 경우 해당 알고리즘을 기술합니다.
	- 위의 예에서는 `HS256` 으로 토큰을 암호화 했다는 뜻입니다.

### PayLoad
#### 등록된 클레임
IANA JWT 클레임 레지스트리에 등록된 클레임입니다.
필수는 아니지만 JWT가 상호호환성을 가지려면 작성해야합니다.

- `'iss'`
	- 누가 토큰을 발급했는지를 나타냅니다.
	- 애플리케이션에서 임의로 정의한 문자열 또는 URI 형식을 가집니다.
- `'sub'`
	- 일반적으로 주제에 대한 설명을 나타냅니다.
	- 토큰 주제는 발급자가 정의하는 문맥상 또는 전역으로 유일한 값을 가져합니다.
	- 문자열 또는 URI 형식을 가집니다.
- `'aud'`
	- 누구에케 토큰이 전달되는가를 나타냅니다.
	- 주로 보호된 리소스의 URL을 값으로 설정합니다.
- `'exp'`
	- 언제 토큰이 만료되는지를 나타냅니다.
	- 만료 시간이 지난 토큰은 수락 되어서는 안됩니다.
	- 일반적으로 UNIX Epoch 시간을 사용합니다.
- `'nbf'`
	- 정의된 시간 이후에 토큰이 활성화 됩니다.
	- 토큰이 유효해지는 시간 이전에 미리 발급되는 경우 사용합니다.
	- 일반적으로 UNIX Epoch 시간을 사용합니다.
- `'iat'`
	- 언제 토큰이 발급되었는지를 나타냅니다.
	- 일반적으로 UNIX Epoch 시간을 사용합니다.
- `'jti'`
	- 토큰의 고유 식별자로서, 같은 값을 가질 확률이 없는 암호학적 방법으로 생성되어야 합니다.
	- 공격자가 JWT를 재사용하는 것을 방지하기 위해 사용합니다.

#### 공개 클레임
JWT 발급자는 표준 클레임에 덧 붙여 공개되어도 무방한 페이로드를 공개 클레임으로 정의 합니다.
하지만, 이름 충돌을 방지하기 위해 IANA JWT 클레임 레지스트리에 클레임 이름을 등록하거나 합리적인 예방 조치를 해야합니다.
보통 URI 형식으로 정의 합니다.

```json
{
	"http://example.com/is_root" : true
}
```
 
#### 비공개 클레임
JWT 발급자와 사용자 간에 사용하기로 약속한 클레임 입니다.
서비스 도메인 내에서 필요한 이름과 값을 비공개 클레임으로 정의 합니다.
이름 충돌이 발생하지 않도록 주의 해야합니다.

### 시그니처
헤더와 페이로드는 단순히 `base64`로 인코딩하기 때문에, 공격자는 원하는 값을 넣고 토큰을 생성할 수 있습니다.
따라서 생성된 토큰이 유효한지 검증하는 장치가 필요합니다.
헤더에서 `'alg': "HS256"` 이라고 선언한다면 이 토큰은 `HMAC_SHA256` 알고리즘으로 암호화 해야합니다.
당연히 암호화할 때 사용하는 secret은 토큰을 생성하고 검증하는 서버에서만 안전한 방법으로 저장해야합니다.

`HS256` 방식의 암호화는 헤어와 페이로드를 base64 로 인코딩한 문자열과 secret 을 이용하여 `HMACSHA256` 알고리즘에 넣어두면 됩니다.

```ts
HMACSHA256(
	base64UrlEncode(header) + "." +
	base64UrlEncode(payload),
	'secret'
)
```

앞의 JWT를 공격자가 다시 구성하여 페이로드를 수정한 후 secret을 WRONG_SECRET으로 잘못 사용한 JWT를 생성했다고 해보자
```json
"http://example.com/is_root": false
```

이렇게 생성된 토큰의 값은 아래와 같다.
![Screenshot-2024-10-03-at-2.49.58-PM.png](/img/이미지 창고/Screenshot-2024-10-03-at-2.49.58-PM.png)
:::warning 페이로드에 들어갈 비공개 클레임은 비밀번호와 같은 중요 정보를 포함하면 안된다.
Signatrue는 이 토큰이 유효한 토큰인지 검사할 뿐이지 페이로드를 암호화 하는 게 아니기 때문입니다.

:::

## 유저 서비스의 이메일 인증 처리와 JWT 발급
### 회원 가입 이메일 인증
이제 회원 가입 요청 시 발송된 이메일 인증을 통해 회원 가입을 완료하고, 요청의 응답으로 토큰을 발급하여 로그인 상태가 되도록 하겠다.
이어서 가입된 유저 정보로 로그인 기능을 구현합니다.
로그인 요청 응답으로 역시 토큰을 발급하겠습니다.

먼저 회원 가입 요청에 포함된 이메일에는 다음 링크가 포함되어 있습니다.

```ts
const url = `${baseURL}/users/email-verify?signupVerifyToken=${signupVerifyToken};`
```

`signupVerifyToken`은 회원 가입시 서버에서 발급한 임의의 문자열로 해당 메일을 받은 사용자만 알 수 있는 유일한 값이다.
버튼을 누르면 이 `signupVerifyToken` 을 POST `/users/email-verify` 엔드포인트로 요청합니다.
이 요청을 처리하여 응답으로 JWT 문자열을 돌려줍니다.

```ts
async verifyEmail(signupVerifyToken: string): Promise<string>{
	const user = await this.usersRepository.findOne({
		where: {
			signupVerifyToken
		}
	})

	
	if(!user){
		throw new NotFoundException('유저가 존재하지 않습니다.')
	}

	return this.authService.login({
		id: user.id,
		name: user.name,
		email: user.email
	})
}
```
- `signupVerifyToken` 으로 회원 가입 중인 유저를 찾습니다.
- 만약 DB에 저장되어 잇지 않다면 에러를 던집니다.
- `AuthService` 에 로그인 처리를 요청합니다

JWT 토큰을 발급하고 검증하기 위해 `Auth()`에서 만든 `jsonwebtoken` 패키지를 사용하겠습니다.
```shell
npm i jsonwebtoken
npm i --save-dev @types/jsonwebtoken
```

`AuthService`에 로그인 처리를 합시다.
응답으로 JWT 토큰을 생성하여 돌려줍니다.

```ts
import * as  jwt from 'jsonwebtoken'
import { Inject, Injectable, } from '@nestjs/common'
import authConfig from 'src/config/authConfig'
import { ConfigType } from '@nestjs/config'

interface User{
	id: string
	name: string
	email: string
}

@Injectable()
export class AuthService{
	construtor(
		@Inject(authConfig.KEY) private config: ConfigType<typeof authConfig>,
	){ }

	login(user:User){
		const payload = { ...user }

		return jwt.sign(payload, this.config.jwtSecret,{
			expireIn: '1d',
			audience: 'example.com',
			issuer: 'example.com'
		})
	}
}
```
이제 회원 가입 시 받은 이메일의 버튼을 눌러 JWT를 확인해봅시다.
JWT 발급에 사용한 비공개 클레임과 함께 등록된 클레임이 포함되어 있는 것을 확인 할 수 있습니다.
`iat` 는 발급 시간을 나타내므로 자동 생성되었습니다.

### 로그인
로그인 기능도 함께 만들어보겠습니다.
`UsersService` 에서는 이메일 인증과 유사하게 전달 받은 이메일과 패스워드로 유저를 찾고 회원 가입 되어 있는 유저라면 JWT를 발급합니다.

```ts
async login(email: string, password: string): Promise<string>{
	const user = await this.usersRepository.findOne({
		where: { email, password }
	})

	if(!user){
		throw new NotFoundException('유저가 존재하지 않습니다.')
	}

	return this.authService.login({
		id: user.id,
		name: user.name,
		email: user.email
	})
}
```

로그인 요청을 하면, 토큰이 잘 전달 되는 것을 확인했습니다.

이제 토큰을 받았으니, 매 요청마다 이 토큰으로 인증 처리를 하도록 하겠습니다.

### JWT 인증
클라이언트는 로그인 후, 서버로부터 전달 받은 JWT를 저장한 후 리소스를 요청할 때 함께 전달합니다.
이 책에서는 프론트엔드는 따로 구현하지 않기 때문에, 헤더로 전달된다고 가정하고 설명을 이어가겠습니다.

새로운 기능으로 로그인한 유저 본인의 정보를 조회하는 API만들겠습니다.
API 명세는 아래와 같습니다.
```Shell
GET /users/:id
Authorization: Bearer <token>
```

헤더로 전달하는 JWT의 비공개 클레임에 유저의 ID가 포함되어 있지만, REST 형식으로 API 명세를 작성하기 위해 id를 패스 매개변수로 다시 전달하도록 했습니다.
Bearer 방식 인증을 사용하기 위해 헤더에 키를 `Authorization`으로 값을, `Bearer <token>` 
Bearer Token은 OAuth2.0 스펙 RFC 6750에 정의 되어 있지만, 일반적인 용도로도 많이 사용합니다.

`controller`
```ts
import { Headers } from '@nestjs/common'

@Controller('users')
export class UsersController{
	constructor(
		private usersService: UsersService,
		private authService: AuthService
	){ }
	...

	@Get(':id')
	async getUserInfo(@Header() headers: any, @Param('id') userId: string): Promise<UserInfo>{
		const jwtString = headers.authorization.split('Bearer ')[1];

		this.authService.verify(jwtString)

		return this.usersService.getUserInfo(userId)
	}
}
```

다음은 AuthService에서 JWT 토큰을 검증하는 로직입니다.

```ts
export class AuthService{
	...
	verify(jwtString: string){
		try{
			const payload = jwt.verify(jwtString, this.config.jwtSecret) as (jwt.JwtPayload | string) & User;

			const { id, email } = payload;

			return {
				userId: id,
				email,
			}
		}catch(e){
			throw new UnauthorizedException()
		}
	}
}
```
역시 jsonwebtoken 라이브러리를 이용하여, 검증을 수행합니다.
이때 외부 노출되지 않는 secret을 사용하므로 이 토큰이 유효한 것인지 확인 할 수 있습니다.

UserService는 이전과 같이 데이터베이스에서 정보를 가져옵니다.
매개변수로 전달된 id를 이용하여 검색하면 되겠습니다.

```ts
export class UsersService{

	...
	async getUserInfo(userId: string):Promise<UserInfo>}{
		const user = await this.usersRepository.findOne({
			where: { id: userId }
		})

		if(!user){
			throw new NotFoundException('유저가 존재하지 않습니다.')
		}
		return {
			id: user.id,
			name: user.name,
			email: user.email
		}
	}
}
```

이제 JWT 를 이용해서 유저 정보를 조회해봅시다.
클라이언트는 발급받은 JWT를 통해 userId를 알고 있고 패스에 포함시킵니다.

### 가드를 이용한 인가 처리
컨트롤러의 유저 정보 조회 구현을 다시 살펴 봅니다.


```ts
@Get(':id')
async getUserInfo(@Headers() headers: any, @Param('id') userId: string) :Promise<UserInfo>{
	const jwtString = headers.authorization.split('Bearer')[1];

	this.authService.verify(jwtString);

	return this.usersService.getUserInfo(userId)
}
```
현재 구성 방식은 헤더에 포함된 JWT 토큰의 유효성을 검사하는 로직을 모든 엔드포인트에 중복 구현해야합니다.
이는 매우 비효율적이고 DRY 원칙에도 위배됩니다.
Nest에 제공하는 가드를 이용하여 이를 핸들러 코드에서 분리해봅시다.

일단 앞서 예시로 만든 것과 같이 `AuthGuard` 를 적용해보겟습니다.

```ts
import { Request } from 'express';
import { Observable } from 'rxjs'
import CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { AuthService } from './auth/auth.service'

@Injectable()
export class AuthGuard implements CanActivate{
	constructor(private authService: AuthService){ }

	canActivate(
		context: ExecutionContext
	):boolean | Promise<boolean> | Observable<boolean>{
		const request = context.switchToHttp().getRequest();
		return this.validateRequest(request)
	}

	private validateRequest(request: Request){
		const jwtString = request.headers.authorization.split('Bearer ')[1];
		this.authService.verify(jwtString)
		return true
	}
}
```

`valideRequest` 메서드에 앞서 컨트롤러에 구현된 로직을 옮겨 왔습니다.
가드는 준비되었으니, `AuthGuard`를 적용해야 합니다.
전역으로 적용하게 된다면, 회원 가입, 로그인 등 액세스 토큰 없이 요청하는 기능은 사용할 수 없으므로 회원 조회 엔드포인트에만 적용했습니다.
물론 컨트롤러를 분리 시키고 분리된 컨트롤러에 적용해도 됩니다.

```ts
@UserGuard(AuthGuard)
@Get(':id')
async getUserInfo(@Header() headers: any, @Param('id') userId :string) : Promise<UserInfo>{
	return this.usersService.getUserInfo(userId)
}
```
이제 다시 유저 정보 조회가 정상적으로 동작하는 지 살펴 봅니다.


## JWT 추가적인 정보
[JWT Tip](../../../../../1. App/NodeJS/JWT-Tip.md)
