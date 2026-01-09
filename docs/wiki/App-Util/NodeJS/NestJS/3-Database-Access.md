---
slug: "3-Database-Access"
title: "3. 데이터베이스 연동 (Database Access)"
---

# 데이터베이스 연동

:::info 개요
NestJS는 데이터베이스와의 통합을 위해 **TypeORM**, **Prisma**, **Mongoose** 등 다양한 ORM/ODM을 지원합니다.
:::

## 1. TypeORM 연동

가장 전통적이고 많이 사용되는 TypeScript ORM입니다.

### 1.1 설치
```bash
npm install --save @nestjs/typeorm typeorm mysql2
```

### 1.2 설정 (AppModule)
```ts
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'test',
      entities: [User],
      synchronize: true, // 개발 환경에서만 true (자동 스키마 동기화)
    }),
  ],
})
export class AppModule {}
```

### 1.3 Repository 패턴 사용
```ts
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
}
```

---

## 2. Prisma 연동

TypeORM보다 더 모던하고 직관적인 ORM입니다.

### 2.1 설치 및 초기화
```bash
npm install prisma --save-dev
npx prisma init
```

### 2.2 Prisma Service 생성
PrismaClient를 주입받아 사용하기 위해 서비스를 생성합니다.

```ts
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

### 2.3 사용
```ts
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async user(userWhereUniqueInput: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }
}
```
