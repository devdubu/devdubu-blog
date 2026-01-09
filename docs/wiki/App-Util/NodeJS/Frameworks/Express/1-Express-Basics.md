---
Start Date: 2025-05-13
---
- [폴더 구조](#폴더 구조)
	- [app.js](#폴더 구조#app.js)
	- [bin/www](#폴더 구조#bin/www)
	- [public](#폴더 구조#public)
	- [route](#폴더 구조#route)
	- [views](#폴더 구조#views)
- [Express 구조 이해하기](#Express 구조 이해하기)
- [bin/www](#Express 구조 이해하기#bin/www)
- [app.js](#app.js)
- [미들웨어](#미들웨어)
- [커스텀 미들웨어 만들기](#미들웨어#커스텀 미들웨어 만들기)
	- [주의할점](#커스텀 미들웨어 만들기#주의할점)
- [에러 핸들러](#미들웨어#에러 핸들러)
- [app.use 응용](#미들웨어#app.use 응용)
- [Morgan](#Morgan)
- [body-parser](#body-parser)
- [JSON, URL-encoded](#body-parser#JSON, URL-encoded)
- [cookie-parser](#cookie-parser)
- [static](#static)
- [express-session](#express-session)
- [connect-flash](#connect-flash)
- [Router 객체로 라우팅 분리하기](#Router 객체로 라우팅 분리하기)
	- [next함수](#JSON, URL-encoded#next함수)
	- [:id](#JSON, URL-encoded#:id)
	- [send](#JSON, URL-encoded#send)
	- [sendFile](#JSON, URL-encoded#sendFile)
	- [JSON](#JSON, URL-encoded#JSON)
	- [redirect](#JSON, URL-encoded#redirect)
- [에러 처리](#Router 객체로 라우팅 분리하기#에러 처리)

# Express-generator

익스프레스 프레임워크는 익스프레스 외에도 많은 패키지를 사용

그렇기 때문에 그 부분을 한번에 다운 받고, 기본 폴더 구조까지 잡아주는 패키지가 있다.

```bash
npm i -g express-generator
```

먼저 우선 global로 설치해야한다. 후에 프로젝트 폴더로 이동해서

```bash
express 폴더이름 --view=ejs
```

만약 pug를 원하면 ejs자리에 pug를 넣으면 된다. 그러면 후에 learn-express라는 폴더가 생성될 것이다. 그러면 이동명령어와 설치 명령어를 실행한다.

```bash
cd learn-express && npm i
```

## 폴더 구조

![Pasted-image-20240117092347.png](/img/이미지 창고/Pasted-image-20240117092347.png)

### app.js
핵심적인 서버 역할을 한다.
### bin/www
서버를 실행하는 스크립트이다.
### public
외부에서 접근 가능한 파일들을 모아둔 곳이다.
- 이미지
- 자바스크립트
- CSS
파일들이 들어 있다
### route
주소별 라우터들을 모아둔 곳이다.
### views
템블릿 파일을 모아둔 곳이다.


# Express 구조 이해하기

```jsx
#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('learn-express:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
```

## bin/www
app, debug, http 모듈을 가져옴 
debug 모듈은 콘솔에 로그를 남기는 모듈이다.
port ⇒ 3000이 기본 포트값이며, 만약 process.env에 port 에 대한 설정이 없다면 
코드처럼 직접 설정해주면 된다.
http.createServer 불러온 app 모듈을 넣어준다.

# app.js

![Pasted-image-20240117092547.png](/img/이미지 창고/Pasted-image-20240117092547.png)

익스프레스의 구구조를 그림으로 표현하면 다음과 같다
클라이언트의 요청을 받아서 처리한 후, 다시 클라이언트에게 응답한다는 점

# 미들웨어
미들웨어는 익스프레스의 핵심이다
요청과 응답의 중간에 위치하여 미들웨어라고 불린다.
라우터, 에러 핸들러 또한 미들웨어의 일종이므로 미들웨어가 익스프레스의 전부라고 해도 과언이 아니다.

```jsx
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
```

`app.use` 메서드의 인자로 들어있는 함수가 미들웨어이다.

미들웨어는 `use method`로 app에 장착한다. 제일 위의 `logger(’dev’)`부터 시작하여 

미들웨어들을 순차적으로 거친 후 라우터에서 클라이언트로 응답을 보낸다.

![Pasted-image-20240117092547.png](/img/이미지 창고/Pasted-image-20240117092547.png)
## 커스텀 미들웨어 만들기

```jsx
	...
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
/*
	추가하는 부분
*/

app.use(function(req, res, next){
	console.log(req.url,'저도 미들웨어');
	next();
});

/*
	**********************
*/
app.use(logger('dev'));
	...
```

![Pasted-image-20240117092651.png](/img/이미지 창고/Pasted-image-20240117092651.png)
### 주의할점

→ 반드시 미들웨어 안에서 next()를 호출해야 다음 미들웨어로 넘어간다. ,, logger, express.json, express.urlencoded, cookieParser, express.static모두 내부적으로 next를 호출함 

next()

는 미들웨어의 흐름을 제허하는 핵심적인 함수

![Pasted-image-20240117092714.png](/img/이미지 창고/Pasted-image-20240117092714.png)
## 에러 핸들러

```jsx
// 404처리 미들웨어
app.use(function(req, res,next){
	next(createError(404));
});
```

```jsx
//에러 핸들러
app.use(function(err, req, res, next){
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') == 'development' ? err : {};

	res.status(err.status || 500);
	res.render('error');
});
```

라우터에 등록되지 않은 주소로 요청이 들어올 때 404 NOT FOUND 상태 코드로 응답을 해줘야 함
라우터에서 요청이 처리되지 않으면, 이 미들웨어로 오게 된다.
`http-errors(createError)`패키지가 404 에러를 만들어내고, 이 에러를 next에 담아 에러 핸들러로 보내고 있다.

 

이 미들웨어는 다른 것과 다르게 함수의 매개변수가 4개 입니다.
`req`전에 `err`가 추가 되었다. next 함수에 넣어준 인자가 err 매개변수로 연결된다.
에러 핸들링 미들웨어는 일반적으로 미들웨어 중 제일 아래에 위치하여 위에 있는 미들웨어서 발생하는 에러를 받아서 처리한다.

## app.use 응용
```jsx
app.use('/', function(req, res, next){
	console.log('첫 번째 미들웨어');
	next();
}, fuctionn(req, res, next){
	console.log('두번째 미들웨어');
	next();
}, fuctionn(req, res, next){
	console.log('두번째 미들웨어');
	next();
});
```

이 성질을 활용해서 Express-generator가 생성한 코드도 다음과 같이 줄일 수 있다.

```jsx
app.use(logger('dev'), express.json(), express.urlencoded({ extended: false}), cookieParser(), express.static(path.join(__dirname, 'public')));
```

하지만 이렇게는 잘 안 쓰이니 참고만 해두면 된다.

```jsx
app.use(function(req, res, next){
	if(+new Date()%2 === 0){
		return res.status(404).send('50% 실패');
	}else{
		next();
	}
}, function(req, res, next){
	console.log('50% 성공');
	next();
});
```

왼쪽 코드는 숫자를 2로 나눈 결과를 토대로 50프로의 확률을 통해서 404 NOT FOUND를 응답하거나 다음 미들웨어로 넘어가는 것이다. 이 미들웨어를 통해서

로그인한 사용자인지 확인할 때 위의 코드를 응용하게 된다.

# Morgan

현재` GET / 200 51.257ms - 1539 `같은 로그는 모두 morgan 미들웨어에서 나오는 것이다. 
요청에 대한 정보를 콘솔에 기록해준다.

```jsx
...
var logger = require('morgan');
...
app.use(logger('dev');
...
```

`GET / 200 51.257ms - 1539` 의 의미는 순서대로 

<mark>HTTP요청(GET) 주소(/) HTTP상태코드(200) 응답속도(51.267ms) - 응답바이트(1539)</mark>

보통 개발 시에는 short나 dev로 많이 쓰고 <mark>배포</mark> 시에는 <mark>common이나 combined</mark>를 많이 사용한다.

콘솔 뿐만 아니라 파일이나 <mark>데이터베이스</mark>에 로그를 남길 수도 잇다. 
하지만 이러한 작업을 할 때는 <mark>winston 모듈</mark>을 더 많이 사용한다.

# body-parser
:::question body-parser?
- 요청의 본문을 해석해주는 미들웨어이다.
- 보통 <mark>form</mark>데이터나 <mark>AJAX요청</mark>의 데이터를 처리함



:::

```jsx
...
var bodyParser = require('body-parser');
...
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
...
```

app.js에서는 body-parser를 사용하지 않았다. 
익스프레스 4.16.0버전부터 body-parser의 일부기능이 익스프레스에 내장되었기 때문이다. 
그래서 bodyparser를 설치하지 않고도 다음과 같이 할 수 있다.

- 단, body-parser가 필요한 경우도 있다. body-parser는 JSON과 URL-encoded형식의 본문 외에도 Raw, Text 형식의 본문을 추가로 해석할 수 있다.
    - Raw는 본문이 버퍼 데이터 일때
    - Text는 본문이 텍스트 데이터일 때 해석하는 미들웨어이다.

```jsx
app.use(bodyParser.raw());
app.use(bodyParser.text());
```

## JSON, URL-encoded
:::question JSON & URL-encoded?
- Json 방식은 json 형식의 데이터 전달 방식이고, <mark>url-encoded</mark>는 주소 형식으로 데이터를 보내는 방식이다
- 보통 폼 전송 url-encode방식을 주로 사용한다.


:::

`app.use(bodyParser.urlencoded({ extended: false }));`

이 옵션에서 false면 노드의 `querystring` 모듈을 사용하여 쿼리 스트링을 해석하고, true면 qs모듈을 사용하여 쿼리 스트링을 해석한다.

qs모듈은 npm 패키지이며, querystring모듈의 기능을 조금 더 확장한 모듈이다.

# cookie-parser
:::question cookie-parser?
- cookie-parser는 요청에 동봉된 쿠키를 해석해준다.  

:::

```jsx
...
var cookieParser = require('cookie-parser');
app.use(cookieParser());
...
```

해석된 쿠키들은 req-cookies 객체에 들어간다. 
예를 들어 name=zerocho 쿠키를 보냈다면, `req-cookies`는 `{name: ‘zerocho’ }`가 된다.

```jsx
app.use(cookieParser(’secret code’);
```

이와 같이 첫 번재 인자로 문자열을 넣어줄 수 있다. 
이제 쿠키들은 제공한 문자열로 서명된 쿠키가 된다. 

서명된 쿠키는 클라이언트에서 수정했을 때 에러를 발생하므로 클라이언트에서 쿠키로 위험함 행동을 하는 것을 방지할 수 있다.

# static
:::question static?
- static 미들웨어는 정적인 파일들을 제공한다.

:::

```jsx
...
app.use(express.static(path.join(__dirname, 'public')));
...

app.use('/img', express.static(path.join(__dirname,'public')));
//이런 식으로 http://localhost:3000/img/abc.png 주소로 접근 가능
```

함수의 인자로 정적 파일들이 담겨있는 폴더를 지정하면 된다. 현재는 public 폴더가 지정되어 있다. 
실제 서버의 폴더 경로에는 public이 들어있지만, 요청 주소는 public이 들어 잇지 않다는 점,,
서버의 폴더 경로와 요청 경로가 다르므로 외부 인이 서버의 구조를 쉽게 파악 불가

→ static 미들웨어는 요청에 부합하는 정적 파일을 발견한 경우 응답으로 해당 파일을 전송한다.

이 경우 응답을 보냈으므로 다음에 나오는 라우터가 실행되지 않는다. 만약 파일을 찾지 못했다면, 요청을 라우터로 넘깁니다.

→ 이렇게 자체적으로 정적 파일 라우터 기능을 수행하므로 최대한 위쪽에 배치하는 것이 좋다

그래야 서버가 쓸데없는 미들웨어 작업을 하는 것을 막을 수 있다. 
저자는 morgan다음에 배치한다. 
static 미들웨어를 morgan보다도 더 위로 올리면 정적 파일 요청이 기록 되지 않기 때문이다.

```jsx
...
app.use(logger('dev');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended : false }));
app.use(cookieParser());
...
```

기존 코드에선 `morgan`, `json`, `urlencoded`, `cookie-parser` 미들웨어를 거처야 `static` 미들웨어에 도달한다. 

요청을 기록하는 `morgan을` 제외하고 정적 파일을 제공하는데 영향을 끼치지 않는 json, urlencoded, cookie-parser를 거치는 것은 낭비이다. 
따라서 순서를 바꾸는게 좋다

참고로 서비스에 따라서 쿠키 같은 것이 정적파일을 제공하는데 영향을 끼칠 수도 있다. 그러므로 자신의 서비스에 맞는 위치를 선택해야한다.

# express-session

세션 관리용 미들웨어이다.

로그인 등의 이유로 세션을 구현할 때 매우 유용하다. express-generator로는 설치되지 않으므로 다음과 같이 직접 설치해야한다.

```bash
npm i express-session
```

설치 후 app.js에 express-session을 연결한다

```jsx
...
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/users');
...

app.use(cookieParser('secret code'));
app.use(session({
	resave: false,
	saveUninitialized, : false,
	secret : 'secret code',
	cookie:{
		httpOnly: true,
		secure: false,
	},
})));
...
```

`express-session` 1.5 버전 이전에서는 내부적으로 cookie-parser사용했다. 
그러므로 `cookie-parser` 미들웨어보다 뒤에 위치했지만, 1.5버전 이후부터는 사용하지 않게 되면서

순서가 상관 없어졌다. 
그래도 현재 몇 버전을 사용하는지 모르기 때문에 `cookie-parser` 미들웨어 뒤에 놓는 것이 안전
express-session은 인자로 세션에 대한 설정을 받는다. 

resave는 요청이 왔을 때 세션에 수정 사항이 생기지 않더라도 세션을 다시 저장할 지에 대한 설정이고, 
`saveUninitialized`는 세션에 저장할 내역이 없더라도 세션을 저장할지에 대한 설정이다. 보통 방문자를 추적할 때 설정

현재는 둘다 필요 없으니 false로 했다.
`secret`은 필수 항목으로` cookie-parser`의 비밀키와 같은 역할을 한다.

`express-session`은 세션 관리 시 클라이언트에 쿠키를 보낸다. 
이를 세션 쿠키라고 부른다

안전하게 쿠키를 전송하려면 쿠키에 서명을 추가 해야 하고, 쿠키를 서명하는데 secret의 값이 필요하다. 
`cookie-parser`의 secret과 같게 설정 해야 한다.

cookie 옵션은 세션 쿠키에 대한 설정이다. 
`maxAge`, `domain`, `path`, `expires`, `sameSite`, `httpOnly`, `secure` 등등 일반적인 쿠키 옵션이 모두 제공됨

현재는 httpOnly를 사용해서 클라이언트에서 쿠키를 확인하지 못하도록 했고, secure는 false로 해서 https가 아닌 환경에서도 사용할 수 있게 했다.

배포시에는 https를 적용하고 secure도 true로 설정하는 것이 좋음

# connect-flash

상대적으로 중요도가 떨어지는 미들웨어,,
일회성 메시지들을 웹 브라우저에 나타날 때 좋다. express-session과 마찬가지로 직접 설치

```bash
npm i connect-flash
```

connect-flash는 cookie-parser와 express-session을 사용하므로 이들보다는 뒤에 위치해야함

```jsx
var session = require('express-session');
var flash = require('connect-flash');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/users');

...

app.use(session({
	resave: false,
	saveUnitialized : false,
	secret: 'secret code',
	cookie: {
		httpOnly: true,
		secure: false,
	},
}));
app.use(flash());
...
```

flash 미들웨어는 req 객체에 `req.flash` 메서드를 추가한다.
`req.flash(key, value)`으로 해당 키에 값을 설정하고,
`req.flash(key)`로 해당 키에 대한 값을 불러온다.

flash 예제

```jsx
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next){
	res.send('respond with a resource');
});

router.get('/flash', funtion(req, res){
	req.session.message = '세션 메시지';
	req.flash('message','flash 메세지');
	res.redirect('/users/flash/result');
});

router.get('/flash/result', funtion(req, res){
	res.send('${req.session.message} ${req.flash("message")}');
});

module.exports = router;
```

`/users/flash` 라우터로 GET요청을 보내면 서버에서는 세션과 flash에 메시지를 설정하고, `/users/flash/result` 메시지로 리다이렉트 한다. 

1. `/users/flash/result`에는 세션 메시지와 flash 메시지가 모두 보인다.
2. 여기서 브라우저를 새로고침 하게 된다면 세션 메시지는 보이지만 flash메시지는 보이지 않는다. 일회성이기 때문이다.

→ 일회성 메시지라는 성질을 이용해서 로그인 에러나 회원 가입 에러 같은 일회성 경고 메시지는 flash 미들웨어로 보내면 좋다

# Router 객체로 라우팅 분리하기

```jsx
...
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
...
app.use('/', indexRouter);
app.use('/users', usersRouter);
...
```

익스프레스 app과는 연결되어 있다. app.use를 사용하므로 라우터도 미들웨어이다.

다른 미들웨어와는 다르게 앞에 주소가 붙어있다. 
라우팅 미들웨어는 첫번째 인자로 주소를 받아서 특정 주소에 해당하는 요청이 왔을 때만 미들웨어가 동작하게 할수도 있다.

use 대신 `get`, `post`, `put`, `patch`, `delete` 같은 HTTP메서드를 사용할 수도 있다.

use메서드는 모든 HTTP 메서드에 대해 요청 주소만 일치하면 실행되지만, `get`, `post`, `put`, `patch`, `delete` 같은 메서드는 주소 뿐만 아니라 HTTP 메서드까지 일치하는 요청일 때만 실행된다.

```jsx
var express = require('express');
var router = express.Router();

/* GET home Page */
router.get('/'. function(req, res, next){
	res.render('index', { title : 'Express' });
});

module.exports = router; //라우터를 모듈로 만드는 부분
```

```jsx
var express = require('express');
var router = express.Router();

/* GET user listing */
router.get('/'. function(req, res, next){
	res.send('respond with a resource');
});

module.exports = router;
```

router에도 app처럼 use, `get`, `post`, `put`, `patch`, `delete` 같은 메서드를 붙일 수 있다. use를 제외하고는 HTTP 요청 메서드와 상응 한다.

또한 app.use처럼 router하나에 미들웨어 여러 개를 장착 가능

→` router.get(’/’, middleware1, middleware2, middleware3);`

router를 사용하지 않아도, app에서 사용하는 기능과 거의 동일하게 사용이 가능하지만, 코드 관리를 위해서 라우터를 별도로 분리하는 것이다.

```jsx
var express = require('express');
var router = express.Router();

...

router.get('/', function(req, res, next){
	next('route');
}, function(req, res, next){
	console.log('실행되지 않습니다.');
	next();
}, function(req, res, next){
	console.log('실행되지 않습니다.');
	next();
}
});

router.get('/', function(req, res){
	console.log('실행되지 않습니다');
	res.render('index', {title: 'Express'});
});

...
```

### next함수

라우터에서만 동작하는 특수 기능이 있다.
`next(route)`이다.

같은 주소의 라우터를 두개 만들었다.
- 첫번째 라우터의 첫번재 미들웨어에서 next를 호출하자 
- 두번째, 세번째 미들웨어는 실행이 되지 않는다.
- 대신 주소와 일치하는 다음 라우터로 넘어간다.

### :id
```jsx
router.get('/users/:id/', function(req, res){
	console.log(req.params, req.query);
});
```

`req.params`객체 안에 :id의 값이 들어있다.

만약` /users/123?limit=5&skip=10` 이라는 주소가 요청이 들어올 때

`req.params`와 `req.query` 객체는

→ `{ id : ‘123’ }{ limit : ‘5’, skip : ‘10’ }`

단, 이 패턴을 사용할 때는 일반 라우터보다 뒤에 위치 해야 한다는 점이다. 
다양한 라우터를 아우르는 와일드 카드 역할을 하므로 일반 라우터 보다는 뒤에 위치해야 다른 라우터에 방해를 받지 않는다. 

에러가 발생하지 않았다면, 라우터는 요청을 보낸 클라이언트에게 응답을 보내주어야한다. 
응답 메서드는 여러 가지 지만 이 책에서는 `send`, `sendFile`, `json`, `redirect`, `render`를 주로 사용한다.

```jsx
res.send(버퍼 or 문자열 or HTML or JSON);

res.sendFile(파일 경로);

res.json(JSON 데이터);

res.redirect(주소);

res.render('템플릿 파일 경로', { 변수 });

```

### send
- send는 만능 메서드이다. 
- 버퍼 데이터나 문자열을 전송하거나, HTML 코드를 전송하기도 하고, JSON 데이터도 전송할 수 있다.

### sendFile
- 파일을 응답으로 보내주는 메서드

### JSON
- json 데이터를 보내준다.
### redirect
- 응답을 다른 라우터로 보내준다.
- 로그인 완료후 다시 메인 화면으로 돌아갈 때 res.redirect(메인화면)를 하면 된다.

## 에러 처리

```jsx
...

//404 처리 미들웨어
app.use(function(req, res, next){
	next(createError(404));
});

//에러 핸들러
app.use(funtion(err, req, res, next){
	//set locals, only provding error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err: {};

	//render the error page
	res. status(err.status || 500);
	res. render('error');
});

...
```

마지막으로 라우터가 요청을 처리하지 못할 때 어떤 일이 발생할까
요청을 처리할 라우터가 없다면 다음 미들웨어로 넘어간다.
404 HTTP 상태코드를 보내주어야 하므로 
다음 미들웨어에서 새로운 에러를 만들고 에러의 상태 코드를 404로 설정한 뒤 에러 처리 미들웨어로 넘겨버린다.

---

#NodeJS #Express

---