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
sticker: vault//이미지/개발 로고/TechIconSVG/Nest.js.svg

slug: "NestJS-설치-및-소개"
---

# Nest JS 설치
:::tip 필수 요소
- NodeJS 16 이상 
- TypeScript

:::

```bash
npm i -g @nestjs/cli
nest new project-name
```

nest로 새로운 프로젝트를 생성하게 된다면 아래와 같은 폴더 구조를 갖게 됩니다.
![Pasted-image-20240620104626.png](/img/이미지 창고/Pasted-image-20240620104626.png)
#### `app.controller.ts`
- 기본 컨트롤러의 single route
#### `app.controller.spec.ts`
- 컨트롤러의 unit 테스트를 위한 파일
#### `app.module.ts`
- 애플리케이션의 root 모듈
#### `app.service.ts`
- 기본 서비스의 하나의 method
#### `main.ts`
- 코어 함수인 `NestFactory`는 Nest Application 인스턴스를 만들게 될 때  해당 파일은 애플리케이션의 진입 점이 됩니다.
- `main.ts` 는 비동기 함수를 포함하고 있다.
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

- Nest 어플리케이션을 생성하게 된다면, 우리는 코어인 `NestFactory` class를 사용하게 된다.
- `NestFactory` 는 몇몇의 정적인 메소드를 어플리케이션이 만들어지면서 허용하게 되는 것을 보여준다..
- `create()` 메소드는 어플리케이션 object인 `INestApplication` 을 비 동기적으로 리턴 합니다 

# NestJS
## NestJS의 장점
NestJS는 NodeJS에 기반을 둔 웹 API 프레임 워크로 Express 또는 Fastify 프레임워크로 래핑하여 작동합니다.
:::info NestJS는 기본 설치 시에 ExpressJS 를 사용합니다.

:::

- Fastify는 Express와 벤치 마크 결과 <mark>2배 더 빠르지만</mark>,
- Express가 가장 널리 사용되고 있고 수많은 미들웨어가 NestJS와 호환되기에, Express를 기본적으로 사용합니다.
:::warning ExpressJS
- NodeJS는 뛰어난 확장성을 가진 반면에, 
- 과도한 유연함으로 인해 결과물 소프트웨어 품질이 일정하지 않고 알맞은 라이브러리를 찾기 위해 사용자가 많은 시간을 할애해야 합니다.

:::

- 이에 반해 NestJS는 데이터베이스, 객체 관계 매핑 ORM, 설정 (configuration), 유효성 검사 등 수많은 기능을 기본 제공합니다.

- 그러면서도 필요한 라이브러리를 쉽게 설치하여 기능을 확장할 수 있는 NdoeJS 장점은 그대로 가지고 있습니다.

NestJS는 앵귤러로부터 영향을 많이 받았습니다.

:::success 모듈/컴포넌트 기반으로 프로그램을 작성함으로써 재 사용성을 높입니다.
- 제어 반전(inversion of control, IOC)
- 의존성 주입(dependency injection, DI)
- 관점 지향 프로그래밍(aspect-oriented programming, AOP)

:::

프로그래밍 언어는 타입 스크립트를 기본으로 채택하여, TypeScript가 가진 <mark>Type System의 장점</mark>을 누릴 수 있습니다.

웹 프레임워크가 갖춰야 할 필수 기능이라면 다음과 같은 것들이 있습니다.
:::info 필수 기능
- 최신 ECMA Script 지원
- TypeScript
- CQRS(command query responsibilty separation)
- HTTP Header 보안 (Express는 helmet을 사용)
- 편리한 설정
- 인터셉터 (interceptor)
- 다양한 미들웨어 (middleware)
- 스케줄링
- 로깅
- 테스팅
- swagger 문서화
- ORM

:::

## Express ? Nest?

| 구분            | Express                                                                                                                                                                 | NestJS                                                                                                                      |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 유연함 / 확장성     | Express는 가볍게 테스트용 서버를 띄울수 있습니다. <br />아이디어를 빠르게 검증하는 데에는 좋지만, <br />단순하고 자유도가 높은 만큼 자기에게 맞는 라이브러리를 찾기 위해 발품을 팔아야 합니다. <br />보일러 플레이트를 미리 얹어놓은 github repo가 있으니, 이를 활용해도 좋습니다. | middleware, IoC, CQRS등 이미 많은 기능을 프레임 워크 자체에 포함합니다. <br />사용자는 문서를 보고 쉽게 따라 할 수 있습니다. <br />원하는 기능이 없다면 다른 라이브러리를 적용해서 사용하면 됩니다. |
| TypeScript 지원 | 추가 설정을 통해 사용 가능합니다.                                                                                                                                                     | 기본 설정입니다. <br />바닐라 JS로도 작성 가능합니다                                                                                             |
| 커뮤니티          | 가장 큽니다.                                                                                                                                                                 | 꾸준이 증가하고 있습니다.                                                                                                              |
|               |                                                                                                                                                                         |                                                                                                                             |
