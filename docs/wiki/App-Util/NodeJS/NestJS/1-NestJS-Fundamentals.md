---
slug: "1-NestJS-Fundamentals"
title: "1. NestJS 기초"
---

# NestJS 기초

:::info 개요
**NestJS**는 Node.js 기반의 프레임워크로, Angular의 아키텍처(Module, Controller, Provider)에서 영감을 받아 체계적이고 확장 가능한 구조를 제공합니다.
:::

## 1. 소개 및 설치

NestJS는 기본적으로 **TypeScript**를 지원하며, **OOP**(객체 지향), **FP**(함수형), **FRP**(함수형 반응형) 요소를 결합할 수 있습니다.

### 설치 및 프로젝트 생성
```bash
npm i -g @nestjs/cli
nest new my-nest-project
```

### 리소스 생성 (CRUD 스카폴딩)
```bash
nest g resource Users
```

---

## 2. 컨트롤러 (Controller)

클라이언트의 요청(Request)을 받아 처리하고 응답(Response)을 반환합니다.

### 2.1 기본 라우팅
`@Controller('users')` 데코레이터를 사용하여 라우팅 경로를 설정합니다.

```ts
@Controller('users')
export class UsersController {
  @Get()
  findAll() {
    return 'This action returns all users';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `User ID: ${id}`;
  }
}
```

### 2.2 요청 데이터 받기 (Payload & Params)

- **@Body()**: POST/PUT 요청의 본문(DTO).
- **@Param()**: 경로 매개변수 (`/users/:id`).
- **@Query()**: 쿼리 스트링 (`/users?offset=10`).

```ts
@Post()
create(@Body() createUserDto: CreateUserDto) {
  return 'Creates a new user';
}
```

### 2.3 고급 라우팅 기능

- **상태 코드 변경**: `@HttpCode(202)`
- **헤더 설정**: `@Header('Cache-Control', 'none')`
- **리다이렉트**: `@Redirect('https://docs.nestjs.com', 301)`
- **하위 도메인 라우팅**: `@Controller({ host: 'api.example.com' })`

---

## 3. 프로바이더 (Provider)

**의존성 주입(Dependency Injection)**의 핵심 대상으로, Service, Repository, Factory 등이 여기에 해당합니다.
`@Injectable()` 데코레이터가 붙은 클래스는 Nest IoC 컨테이너에 의해 관리됩니다.

```ts
@Injectable()
export class UsersService {
  private readonly users = [];

  create(user: User) {
    this.users.push(user);
  }
}
```

---

## 4. 모듈 (Module)

애플리케이션의 구조를 구성하는 메타데이터 객체입니다. 관련 컴포넌트(Controller, Service)를 묶어 캡슐화합니다.

```ts
@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService] // 다른 모듈에서 사용 가능하도록 내보내기
})
export class UsersModule {}
```
