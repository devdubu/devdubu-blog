---
종료 날짜: 2025-04-10
시작 날짜: 2025-04-10
sticker: vault//이미지/개발 로고/TechIconSVG/Nest.js.svg
---

Nest의 Controller는 MVC 패턴에서 말하는 그 Controller를 말합니다.
컨트롤러는 들어오는 요청을 받고 처리된 결과를 응답으로 돌려주는 interface의 역할을 합니다.

컨트롤러는 endpoint routing 메커니즘을 통해 각 Controller가 받을 수 있는 요청을 분류합니다.
컨트롤러를 사용 목적에 따라 구분하면 구조적이고 모듈화된 소프트웨어를 작성할 수 있습니다.

NestJS 프로젝트를 생성했다면, 아래의 script로 컨트롤러를 생성 가능합니다.

```shell
cd [프로젝트명]
nest g controller Users
```

AppModule에는 방금 생성한 UsersController와 프로젝트를 생성할 때 만들어진 AppService를 Import해서 사용하고 있습니다.
그 밖의 Nest 구성 요소에 대한 약어는 `nest -h` 명령어로 확인 할 수 있습니다.

만들고자 하는 리소스의 CRUD 보일러플레이트 코드를 한번에 생성할 수 도 있습니다.

```shell
nest g resource [name]
```
예를 들어 `nest g resource Users` 명령으로 Users 리소스를 생성했다면, 
아래와 같이 module, controller, service, entity, dto 등의 코드와 테스트 코드를 자동으로 생성해줍니다.

# Routing

```ts
import { Controller, Get } from ‘@nestjs/common’;
import { AppService } from ‘./app.service’;

@Controller()
export class AppController{
	constructor(private readonly appService: AppService){}
	
	@Get()
	getHello():string{
		return this.appService.getHello();
	}
}
```
`app.controller.ts`
스프링을 접해보신 분이라면 익숙한 구조 입니다.
서버가 수행해야하는 많은 귀찮은 작업을 데커레이션으로 기술하여, 애플리케이션의 핵심 로직에 집중할 수 있도록 도와줍니다.

`@Controller` 데커레이터를 클래스에 선언하는 것으로 해당 클래스는 컨트롤러의 역할을 하게 됩니다.
`getHello`함수는 `@Get` 데커레이터를 가지고 있습니다.
따라서 루트 경로로 들어오는 요청을 처리 할 수 있게 됐습니다.

라우팅 경로는 `@Get` 데커레이터의 인수로 관리 할 수 있습니다.
경로를 루트 경로가 아니라 `/hello`로 변경해보면?

```ts
@Get(‘/hello’)
getHello():string{
	return this.appService.getHello();
}
```

`@Controller` 데커레이터도 인수를 전달 할 수 있습니다.
이를 통해 라우팅 경로의 접두어를 지정합니다.

예를 들면 `@Controller(‘app’)` 이라고 했다면, 이제 `http://localhost:3000/app/hello` 경로로 접근해야합니다.
보통 컨트롤러가 맡은 리소스의 이름으로 지정하는 경우가 많습니다.

## 와일드 카드 사용
라우팅 패스는 와일드 카드를 이용하여, 작성할 수 있습니다.
예를 들어 별표 문자를 사용하면 문자열 가운데 어던 문자가 와도 상관 없이 라우팅 패스를 구성하겠다는 뜻입니다.
```ts
@Get(‘he*lo’)
hetHello(): string{
	return this.appService.getHello();
}
```
이 코드는 `helo`, `hello`, `he__lo` 같은 경로로 요청 받을 수 있습니다.
`*`외의 ?, + , () 문자 역시 정규 표현식에서의 와일드 카드와 동일하게 동작합니다.
단 `-`, `.`은 문자열로 취급합니다.
즉, `@Get(’he.lo)`는 `hello`로 요청할 수 없습니다.
와일드카드는 컨트롤러의 패스를 정할 때만 사용하는 것이 아닙니다.

## 요청 객체
클라이언트는 요청을 보내면서 종종 서버가 원하는 정보를 함게 전송 합니다.
Nest는 요청과 함께 전달 되는 데이터를 핸들러(요청을 처리할 구성 요소, 컨트롤러가 이 역할을 합니다.)가 다룰 수 있는 객체로 변환 합니다.

이렇게 변환 된 객체를 `@Req` 데커레이터를 이용하여 다룰 수 있습니다.
```ts
import { Request } from 'express'
import { Controller, Get, Req } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController{
	constructor(private readonly appService: AppService){}
	
	@Get()
	getHello(@Req() reqw: Request): string{
		console.log(req);
		return this.appService.getHello()
	}
}
```
요청 객체는 HTTP요청을 나타냅니다.
쿼리 스트링, 매개변수, 헤더와 분문 외 많은 정보를 가지고 있습니다.
Nest는 `@Query()`,  `@Param(key?: string)`, `@Body` 데커레이터를 이용해서 요청에 포함된 쿼리 미개변수, path, 매개변수, 본문을 쉽게 받을 수 있게 해줍니다.

## Response
앞에서 `nest g resource Users` 명령어로 USERS 리소스에 대한 CRUD API를 만들어봤습니다.
서버를 실행하면, 어떤 라우팅 패스를 통해 요청을 받을 수 있는지 console 로 확인 가능합니다.

Usersd 리소스에 대한 CRUD 요청 결과를 표로 정리하면 다음과 같습니다.

| 경로         | HTTP 메서드 | 응답 상태 코드 | 본문                            |
| ---------- | -------- | -------- | ----------------------------- |
| `/users`   | POST     | 201      | This action adds new user     |
| `/users`   | GET      | 200      | This action returns all users |
| `/users/1` | GET      | 200      | This action returns a #1 user |
| `/users/1` | PATCH    | 200      | This action update a #1 user  |
| `/users/1` | DELETE   | 200      | This action removes a #1 user |
각 요청의 성공 응답 코드는 POST일 경우에만 <mark>201</mark>이고, 나머지는 200인 것을 볼 수 있습니다.
또한 응답 본문은 String 값을 가지고 잇는데 이는 `UsersController`의 각 메서드가 리턴 하는 값입니다.
- JavaScript의 원시 타입을 리턴하는 경우, 직렬화 없이 바로 보내지만
- 객체를 리턴한다면, 직렬화를 통해 JSON으로 자동 변환해줍니다.
```js
@Get()
findAll(@Res() res){
	const users = this.userService.findAll()

	return res.status(200).send(users)
}
```

만약 상태 코드를 다른 값으로 바꾸길 원한다면?
Nest는 `@HttpCode`를 통해서 변경하면 됩니다.

```ts
import { HttpCode } from '@nestjs/common'

@HttpCode(202)
@Patch(':id')
update(@Param('id') id:string, @Body() updateUserDto: UpdateUserDto){
	return this.usersService.update(+id, updateUserDto);
}
```

요청을 처리하는 도중 에러가 발생하거나 예외를 던져야한다면?
```ts
@Get(':id')
findOne(@Param('id') id:string){
	if(+id<1){
		throw new BadRequestException('id는 0보타 큰 값이어야 합니다.')
	}

	return this.usersService.findOne(+id);
}
```

`NotFoundException` 객체의 생성자로 전달한 메시지와 함께 상태 코드가 400인 에러가 발생합니다.

만약 응답에 커스텀 헤더를 추가하고 싶다면 `@Header` 데커레이터를 사용하면 됩니다.
인수로 헤더 이름과 값을 받습니다.
물론 라이브러리에서 제공하는 응답 객체를 사용해서 `res.header()` 메서드로 직접 설정도 가능합니다.

```ts
import { Header } from '@nestjs/common'

@Header('Custom', 'Test Header')
@Get(':id')
findOneWithHeader(@Param('id') id:string){
	return this.usersService.findOne(+id)
}
```


## Redirect
- 요청을 보낸 클라이언트를 다른 페이지로 이동하고 싶을 때
`@Redirect` 데커레이터를 사용하면 됩니다.

데커레이터의 두번째 인수는 상태 코드 입니다.
`301 Moved Permanently` 는 요청한 리소스가 헤더에 주어진 리소스로 완전히 이동 됐다는 뜻입니다.
이 상태 코드를 200과 같이 다른 것으로 바꾸어 응답할 수 도있습니다.
```ts
import { Redirect } from '@nestjs/common'

@Redirect('https://nestjs.com', 301)
@Get(':id')
findOne(@Param('id') id:string){
	return this.usersService.findOne(+id)
}
```

```ts
@Get('redirect/docs')
@Redirect('https://docs.nestjs.com', 302)
getDocs(@Query('version') version){
	if(version && version === '5'){
		return { url: 'https://docs.nestjs.com/v5'}
	}
}
```

## Route 매개변수
Route 매개변수는 <mark>Path 매개변수</mark>라고도 합니다.
1번 유저의 정보를 가져오려면 `http://localhost:3000/user/1`로 요청을 합니다.
여기서 1에 해당하는 부분이 유저 ID인데 당연히 동적으로 구성됩니다.

즉 경로를 구성하는 매개변수가 됩니다.
전달 받은 매개변수는 함수 인수에 `@Param` 데이터레이터로 주입 할 수 있습니다.

라우트 매개변수를 전달 받는 방법은 2가지 있습니다.
이 방법은 params의 타입이 any가 되어 권장 하지 않습니다.
물론 라우트 매개변수는 타입이 항상 `string`이기 때문에, 명시적으로 `{ [key:string] : string }` 타입을 지정해도 됩니다.
```ts
@Delete(':userId/memo/:memoId')
deleteUserMemo(@Param() params: { [key: string] : string}){
	return 'userId: ${params.userId}, memoId: ${params.memoId}';
}
```


## 하위 도메인 라우팅
서버에서 제공하는 기능을 API로 외부에 공개하기로 했다면, 현재 사용하고 있는 도메인이면 `example.com`이고, API 요청은 `api.example.com`으로 받기로 했습니다.

즉, `http://example.com`, `http://api.example.com`로 들러온 요청을 서로 다르게 처리하고 싶다면, 
하위 도메인에서 처리하지 못하는 요청은 원래의 도메인에서 처리되도록 하고 싶다고 한다면, 
이런 경우 하위 도메인 라우팅 기법을 사용할 수 있습니다.

```shell
nest g co Api
```

`app.controller.ts` 에 이미 루트 라우팅 경로를 가진 엔드 포인트가 존재합니다.
`ApiController`에서도 같은 엔드 포인트를 받을 수 있도록 하기 위해 `ApiController`가 먼저 처리되도록 순서를 수정합니다.

```ts
@Module({
	controlers: [ApiController, AppController],
	...
})

export class AppModule { }
```

`@Conroller` 데커레이터는 ControllerOptions 객체를 인수로 받는데 host 속성을 하위 도메인에 기술 하면 됩니다.

```ts
@Controller({ host: 'api.example.com' }) //하위 도메인 요청 처리 설정
export class ApiController{
	@Get() // 같은 루트 경로
	index(): string{
		return : 'Hello, API' // 다른 응답
	}
}
```

앞서 우리는 요청 Path를 `@Param` 데커레이터로 받아 동적으로 처리할 수 있었습니다.
유사하게 `@HostParam` 데커레이터를 이용하면 서브 도메인을 변수로 받을 수도 있습니다.
API 버저닝을 하는 방법은 여러 가지 있지만, 하위 도메인을 이용하는 방법은 많이 사용합니다.

```ts
@Controller({ host: ':version.api.localhost' })
export class ApiController {
	@Get()
	index(@HostParam('version') version:string ):string{
		return 'Hello, API ${version}';
	}
}
```

host param이 없는 host로 요청을 하면 기존 도메인으로 요청이 처리 되는 것을 볼 수 있습니다.

## PayLoad 다루기
`POST`, `PUT`, `PATCH` 요청은 보통 처리에 필요한 데이터를 함께 실어 보냅니다.
이 데이터 덩어리, 즉 `PayLoad`를 `Body`라고 부릅니다.
NestJS에는 데이터 전송 객체 data transfer object, DTO가 구현되어 있어 본문을 쉽게 다룰 수 있다.

앞서 생성한 Users 리소스르 생성하기 위해 POST `/users`로 들어오는 본문을 `CreateUserDto` 로 받았습니다.

```ts
export class CreateUserDto{
	name:string;
	email: string;
}

@Post()
create(@Body() createUserDto: CreateUserDto){
	const { name, email } = createUserDto;
	
	return `유저를 생성했습니다. 이름 : ${name}, 이메일:  ${email}`
}
```

`GET`요청에서 서버에 전달 할 데이터를 포함할 때는 일반적으로 요청 주소에 포함 시킵니다.
- 유저 목록을 가져오는 요청은 `GET` `/users?offset=0&limit=10` 과 같이 페이징 옵션이 포함되도록 구성할 수 있습니다.
offset은 데이터 목록 중 건너뛸 갯수를 의미하고 Limit은 offset 이후 몇 개의 데이터를 가져올지 지정합니다.
이 두 쿼리 매개변수를 `@Query` DTO로 묶어 처리 할 수 있습니다.

```ts
export class GetUsersDTO{
	offset: number;
	limit: number;
}
```
# 인터페이스
## 유저 인터페이스
![IMG-2317.jpg](/img/이미지 창고/IMG-2317.jpg)

## 파일 구성
![Screenshot-2024-07-18-at-10.20.56-PM.png](/img/이미지 창고/Screenshot-2024-07-18-at-10.20.56-PM.png)
