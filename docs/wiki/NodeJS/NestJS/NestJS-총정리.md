---
slug: "NestJS-총정리"
---
# NestJS?
:::tip Node 진영에서의 백엔드 프레임워크 중 하나 입니다.

:::

처음 부터 ExpressJS 를 사용했던 사람으로서, NestJS의 개념 자체는 낯설었지만, 오히려 Spring Boot를 하셨던 분들은 되게 익숙한 개념들이 많을 거라고 생각이 듭니다.
그만큼 spring boot에서 따온 개념과 구조를 NestJS를 구성하고 있습니다.

NestJS 서적 [NestJs로 배우는 백엔드 프로그래밍](https://www.yes24.com/Product/Goods/115850682)을 참조하여 글을 작성해봅니다.

## NestJS 설치
```shell
npm i -g @nestjs/cli

# NestJS 프로젝트 설치
nest new [project-name]
```

설치 후에, NestJS 프로젝트를 본다면 아래와 같은 구조를 보게 됩니다.
![Pasted-image-20240620104626.png](/img/이미지 창고/Pasted-image-20240620104626.png)
- `app.controller.ts`
	- 기본 컨트롤러의 single route
- `app.controller.spec.ts`
	- 컨트롤러의 test 코드
- `app.module.ts`
	- application의 root 모듈
- `app.service.ts`
	- 기본 서비스의 하나의 method
- `main.ts`
	- 코어 함수인 `NestFactory` 는 `Nest Application` 인스턴스 만들게 될 때 해당 파일은 application의 Entry Point가 됩니다.
	- `main.ts` 는 비동기 함수를 포함하고 있습니다.
```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

---

#NodeJS #Back  #NestJS

---