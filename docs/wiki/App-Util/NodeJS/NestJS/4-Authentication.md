---
slug: "4-Authentication"
title: "4. 인증과 인가 (Authentication)"
---

# 인증과 인가 (Authentication & Authorization)

:::info 개요
**Passport** 라이브러리와 **JWT**(Json Web Token)를 사용하여 안전한 인증 시스템을 구축하는 방법을 다룹니다.
:::

## 1. 개요 및 설치

NestJS는 `@nestjs/passport` 패키지를 통해 Passport 라이브러리를 래핑하여 제공합니다.

```bash
npm install --save @nestjs/passport passport passport-local passport-jwt
npm install --save-dev @types/passport-local @types/passport-jwt
```

---

## 2. JWT 인증 구현

### 2.1 AuthService 생성
사용자 로그인 검증 및 토큰 발급을 담당합니다.

```ts
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
```

### 2.2 JWT Strategy 구현
Passport의 JWT 전략을 상속받아 유효한 토큰인지 검증합니다.

```ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
```

---

## 3. 가드 (Guards)

`CanActivate` 인터페이스를 구현하여 요청을 처리할지 여부를 결정합니다. 주로 인증 여부를 확인할 때 사용합니다.

```ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

### 컨트롤러 적용
```ts
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@Request() req) {
  return req.user;
}
```
