---
slug: "2-Advanced-Features"
title: "2. 고급 기능 (Middleware, Pipes, Dynamic Modules)"
---

# 고급 기능

:::info 개요
NestJS의 요청 처리 파이프라인에서 중요한 역할을 하는 **미들웨어**, **파이프**, 그리고 모듈성을 높이는 **동적 모듈**을 다룹니다.
:::

## 1. 미들웨어 (Middleware)

Route 핸들러가 실행되기 **전**에 호출되는 함수입니다. Express의 미들웨어와 동일하게 동작합니다.
요청/응답 객체에 접근 가능하며, `next()` 함수로 제어권을 넘깁니다.

```ts
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    next();
  }
}
```

### 적용 (Module)
`MainModule`에서 `configure()` 메서드를 통해 특정 라우트에 미들웨어를 적용합니다.

```ts
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('users');
  }
}
```

---

## 2. 파이프 (Pipes)

요청 데이터를 **변환(Transformation)**하거나 **유효성 검사(Validation)**를 수행합니다.

### 2.1 유효성 검사 (ValidationPipe)
`class-validator`와 함께 사용하여 DTO의 유효성을 자동으로 검증할 수 있습니다.

```bash
npm i --save class-validator class-transformer
```

```ts
// main.ts (전역 설정)
app.useGlobalPipes(new ValidationPipe({
  whitelist: true, // DTO에 없는 속성 제거
  forbidNonWhitelisted: true, // DTO에 없는 속성 있으면 에러
  transform: true, // 타입을 자동으로 변환 (예: url param string -> number)
}));
```

### 2.2 파이프 적용
핸들러 레벨, 파라미터 레벨 등 다양한 스코프에 적용 가능합니다.

```ts
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) { // 문자를 숫자로 자동 변환
  return this.usersService.findOne(id);
}
```

---

## 3. 동적 모듈 (Dynamic Modules)

설정 객체(Config) 등을 받아 동적으로 프로바이더를 등록하는 모듈입니다. 주로 `forRoot` 또는 `register` 메서드를 사용합니다.

```ts
@Module({})
export class ConfigModule {
  static register(options: ConfigOptions): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
        ConfigService,
      ],
      exports: [ConfigService],
    };
  }
}
```

**사용 예시:**
```ts
@Module({
  imports: [ConfigModule.register({ folder: './config' })],
})
export class AppModule {}
```
