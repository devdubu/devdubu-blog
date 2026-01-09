
# 동기 & 비동기 메서드
setTimeout 같은 타이머와 process.nextTick외에도, 노드는 대부분의 메서드를 비동기 방식으로 처리한다.

하지만 몇몇 메서드는 동기 방식으로도 사용 가능하다.


readme2.txt → 저를 여러 번 읽어보세요.

```jsx
const fs = require('fs');

console.log('시작');
fs.readFile('./readme2.txt', (err, data)=>{
	if(err){
		throw err;
	}
	console.log('1번', data.toString());
});

fs.readFile('./readme2.txt', (err, data)=>{
	if(err){
		throw err;
	}
	console.log('2번', data.toString());
});
fs.readFile('./readme2.txt', (err, data)=>{
	if(err){
		thorw err;
	}
	console.log('3번', data.toString());
});
console.log('끝');
```

반복 실행 할 때 마다 <mark>결과가 달라</mark>진다.
비동기 메서드들은 백그라운드에 해당하는 파일을 읽으라고만 요청하고 다음 작업으로 넘어간다.

따라서 파일 읽기 요청만 세번 보내고 console.log(’끝')을찍는다. 나중에 읽기가 완료되면 백그라운드가
다시 메인 스레드에 알림을 줍니다. 메인 스레드는 그제서야 록된 콜백함수를 실행한다.

이 방식은 수백 개의 I/O 요청이 들어와도 메인 스레드는 백그라운드에 요청 처리를 위임한다.
그 후로도 얼마든지 요청을 더 받을 수 있다. 

나중에 백그라운드가 각각의 요청 처리가 완료되었다고 알리면 그 대 콜백 한 수를 처리하면 된다.

:::tip 동기와 비동기, 블로킹과 논블로킹
- 노드에서는 동기와 비동기, 블로킹과 논블로킹이라는 네 용어가 혼용된다.
- 노드에서는 <mark>동기-블로킹</mark> 방식과 <mark>비동기-논블로킹</mark> 방식이 대부분이다. 
- <mark>동기-논블로킹</mark>이나 <mark>비동기-블로킹</mark>은 없다고 봐도 된다.

:::

### 동기 - 블로킹 방식
백그라운드 작업 완료 여부를 계속 확인하며, 호출한 함수가 바로 return되지 않고 백 그라운드 작업이 끝나야 return이 된다.
### 비동기 - 논블로킹 방식
호출한 함수가 바로 return되어 다음 작업으로 넘어가고, 백 그라운드 작업 완료 여부는 신경 쓰지 않고 나중에 백 그라운드가 알림을 줄 때 처리함

## 순서대로 출력시에 코드

```jsx
const fs = require('fs');

console.log('시작');
let data = fs.readFileSync('./readme2.txt');
console.log('1번', data.toString());

data = fs.readFileSync('./readme2.txt');
console.log('2번', data.toString());

data = fs.readFileSync('./readme2.txt');
console.log('3번', data.toString());

console.log('끝');
```

`readFile()`대신 `readFileSync()`라는 메서드를 사용
`readFileSync()`는 수백 개 이상이 들어왔을 때 성능에 문제가 생긴다.

Sync 메서드를 사용할 대는 이전 작업이 완료되어야 다음 작업을 진행할 수 있다.
즉, 백그라운드가 작업하는 동안 메인 스레드는 아무것도 못하고 대기하고 있어야 하는 것이다.

메인 스레드가 일을 하지 않고 노는 시간이 생기기 때문에 비효율적이다.
→ 비동기 메서드는 백그라운드가 작업을 하는 와중에도 다음 작업을 처리할 수 있다.

그렇기 때문에 동기 방식은 사용하지 않음
비동기 방식에서 순서를 유지하고 싶을 때는

```jsx
const fs = require('fs');

console.log('시작');
fs.readfile('./readme2.txt', (err,data)=>{
	if(err){
		throw err;
	}
	console.log('1번', data.toString());
	fs.readFile('./readme2.txt', (err, data) => {
		if(err){
			throw err;
		}
		console.log('2번', data.toString());
		fs.readFile('./readme2.txt', (err, data) => {
			if(err){
				throw err;
			}
			console.log('3번', data.toString());
		});
	});
});
console.log('끝');
```

이전 `readFile()`의 콜백에 다음 `readFile()`을 넣어주면 된다. 
소위 말하는 콜백의 지옥이 펼쳐짐, 하지만 순서가 어긋나진 않음 콜백 지옥은 `promise나` `async/await`으로 어느 정도 해결 가능

# Event
createReadStream() 같은 경우에는 내부적으로 알아서 data와 end이벤트를 호출하지만, 우리가 직접 이벤트를 만들 수도 있다.

```jsx
const EventEmitter = require('events');

const myEvent = new EventEmiiter();
myEvent.addListener('event1', () => {
	console.log('이벤트 1');
});

myEvent.on('event2', () => {
	console.log('이벤트 2');
});

myEvent.on('event2', () => {
	console.log('이벤트 2 추가');
});

myEvent.emit('event1');
myEvent.emit('event2');

myEvent.once('event3', () => {
	console.log('이벤트 3');
});
myEvent.emit('event3');
myEvent.emit('event3');

myEvent.on('event4',()=>{
	console.log('이벤트 4');
}
myEvent.removeAllListeners('event4');
myEvnet.emit('event4');

const listener = () => {
	console.log('이벤트 5');
};
myEvent.on('event5', listener);
myEvent.removeListener('event5', listener);
myEvnet.emit('event5');

console.log(myEvnet, listenerCount('evnet2'));
```

| 함수 | 설명 |
| ---- | ---- |
| on(이벤트명, 콜백) | 이벤트 이름과 이벤트 발생 시의 콜백을 연결해준다. 이벤트 이름을 인자로 넣어주면 미리 등록했던 이벤트 콜백이 실행된다. |
| emit(이벤트명) | 이벤트를 호출하는 메서드이다. 이벤트 이름을 인자로 넣어주면 미리 등록해뒀던 이벤트 콜백이 실행된다. |
| once(이벤트명, 콜백) | 한 번만 실행되는 이벤트 입니다. myEvent.emit(’event3’)을 두 번 연속 호출했지만 콜백이 한 번만 실행된다. |
| removeAllListeners(이벤트명) | 이벤트에 연결된 모든 이벤트 리스터를 제거한다. |
| removeListener(이벤트명, 리스너) | 이벤트에 연결된 리스터를 하나씩 제거한다. 역시 event5의 콜백도 호출 되지 않는다. |
| off(이벤트 명, 콜백) | 노드 10 버전에서 추가된 메서드로, removeListener와 기능이 같다 |
| listenerCount(이벤트명) | 현재 리스터가 몇 개 연결 되어 있는지 확인한다. |
# 예외 처리
:::tip exception
- 예외란 처리하지 못한 에러를 가르킨다. 


:::

이러한 예외들은 실행 중인 노드 프로세스를 멈추게 만든다.

멀티 스레드 프로그램에서는 스레드 하나가 멈추면 그 일을 다른 스레드가 대신한다. 하지만 노드는 스레드가 하나분이므로 그 하나를 소중히 해야한다.

```jsx
setInterval(()=>{
	console.log('시작');
	try{
		throw new Error('서버를 고장내주마!');
	}catch(err){
		console.error(err);
	}
},1000);
```

setInterval을 사용하는 것은 프로세스가 멈추는지에 대한 여부를 체크하기 위해서이다. 

setInterval 내부에 throw new Error()로 에러를 강제로 발생시켰다.

에러는 발생하지만, try catch로 잡을 수 있다. setInterval도 직접 멈추기 전까지 계속 실행된다.

```jsx
const fs = require('fs');

setInterval(() => {
	fs.unlink('./abcdefg.js', (err)=>{
		if(err){
			console.log(err);
		}
	});
},1000);
```

fs.unlink()로 없는 파일을 지우고 있습니다. 에러가 발생하지만 다행히 노드 내장 모듈의 에러는 실행 중인 프로세스를 멈추지 않는다. 에러 로그를 기록해두고 나중에 원인을 찾아 수정하면 된다.

```jsx
process.on('uncauthException', (err) => {
	console.error('예기치 못한 에러', err);
});

setInterval(()=>{
	throw new Error('서버를 고장내주마!');
},1000);

setTimeout(()=>{
 console.log('실행됩니다');
},2000);
```

process 객체에 `uncaughtException` 이벤트 리스너를 달아주었다. 처리 하지 못한 에러가 발생했을 때 이벤트 리스너가 실행 되고 프로세스가 유지 된다. 이 부분이 없다면 위의 예제에서는 `setTimeout`이 실행되지 않습니다. 실행 후 1초 만에 `setInterval`에서 에러가 발생하여 프로세스를 멈추기 때문, 하지만 `uncaughtException` 이벤트 리스터가 연결 되어 있으므로 프로세스가 멈추지 않는다.

노드의 공식 문서는 `uncaughtException` 이벤트를 최후의 수단으로 사용하라고 말하고 있다.

`uncaughtException` 이벤트 발생 후 다음 동작이 제대로 동작하는지를 보증할 수 없다고 한다.

따라서 단순 에러 내용을 기록하는 정도로 사용하고 `process.exit()`로 프로세스를 종료하는 것이 좋다.

## Request & Response
```jsx
const http = require('http');

http.createServer((req,res)=>{
	res.write('<h1>hello Node!</h1>');
	res.end('<h1>hello Server!</h1>');
}).listen(8080, () => {
	console.log('8080번 포트에서 서버 대기 중입니다.!');
});
```

# 쿠키와 세션
쿠키와 세션은 로그인을 구현할 때 가장 중요한 역할이다.

클라이언트가 서버에게 로그인한 사람이 누구인지를 지속적으로 알려주고 있기 때문이다.

서버로부터 쿠키가 오면 웹 브라우저는 쿠키를 저장했다가 요청할 때마다 쿠키를 동봉해서 보내준다. 서버는 요청에 들어있는 쿠키를 읽어서 사용자가 누구인지 파악한다.

즉, 서버는 미리 클라이언트에 요청자를 추정할 만한 정보를 쿠키로 만들어 보내고, 그 다음부터는 클라이언트로 부터 쿠키를 받아 요청자를 파악한다. 쿠키가 여러분이 누구인지를 추적하고 있는 것이다.

쿠키는 요청과 응답의 헤더에 저장 된다. 요청과 응답은 각각 헤더와 본문을 가진다.

```jsx
const http = require('http');

const parseCookies = (cookie = '') =>
	cookie
		.split(';')
		.map(v => v.split('=')])
		.reduce((acc, [k, v]) => {
			acc[k.trim()] = decodURIComponent(v);
			return acc;
},{});

http.createServer((req, res) => {
	const cookies = parseCookies(req.headers.cookie);
	console.log(req.url, cookies);
	res.writeHead(200, { 'Set-Cookie' : 'mycookie=test'});
	res.end('Hello Cookie);
}).listen(8082, () => {
		console.log('8082번 포트에서 서버 대기중입니다!');
});
```

parseCookies라는 함수를 직접 만들어보았다.

쿠키는` name=zerocho;year=1994`처럼 문자열 형식으로 온다. 이를` { name: ‘zerocho’, year “ ‘1994 }`와 같이 객체로 바꾸는 함수이다.

`createServer` 메서드의 콜백에서는 제일 먼저 req객체에 담겨 있는 쿠키를 분석한다. 쿠키는` req.headers.cookies`에 들어잇다.` req.headers`는 요청의 헤더를 의미.

응답의 헤더에 쿠키를 기록해야함, res.writeHead메서드를 사용함. 첫 번째 인자로 200이라는 상태 코드를 넣어두었다.

두번째 인자로는 헤어듸 내용을 입력한다 Set-Cookie는 브라우저한테 다음과 같은 값의 쿠키를 저장하라는 의미이다. 실제로 응답을 받은 브라우저는 mycookie=test라는 쿠키를 저장한다.

localhost:8082에 접속하면 req.url과 cookies 변수에 대한 정보를 로깅하도록 했다. req.url은 주소의 path와 search 부분을 알려준다. 화면에는 Hello Cookie가 뜨고 콘솔에는 다음과 같은 메시지를 볼 수 있다.

> 콘솔

> /\{}

> /favicon.ico\{ mycookie: ‘test’ }

만약 실행 결과가 위와 다르면 브라우저의 쿠키를 모두 제거한 후에 실행하면 된다.

두번째 요청중 favicon은 다음고 같이 웹사이트 탭에 보이는 이미지를 뜻한다.

:::note 헤더와 본문
- 요청과 응답은 모두 헤더와 본문을 가지고 있다. 
- 헤더는 요청 또는 응답에 대한 정보를 가지고 잇는 곳이고, 본문은 서버와 클라이언트 간에 주고 받을 실제 데이터를 담아두는 공간이다. 
- 쿠키는 부가적인 정보이므로 헤더에 저장한다.- 크롬 개발자 도구의 Network 탬에서 요청과 응답을 살펴볼 수 있다.
- `General`은 공통된 헤더
-` Request Headers`는 요청의 헤더
- `Response Headers`는 응답의 헤더
- 수많은 헤더가 있지만 Response Headers의 Set-Cookie와 Request Headers의 Cookie만 보면 된다.
- 응답의 Set-Cookie는 브라우저에게 해당 쿠키를 심으라는 명령을 내리는 것이다. 
- 브라우저는 쿠키를 심은 후, 다음부터 요청을 보낼때는 `Request Headers`에 `Cookie`로 쿠키를 보낸다.

:::

로그인 구현 쿠키

```jsx
const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');

const parseCookies = (cookie = '') =>
	cookie
		.split(';')
		.map(v => v.split('='))
		.map(([k, ...vs]) => [k, vs.join('=')])
		.reduce((acc, [k, v]) => {
			acc[k.trim()] = decodeURIComponent(v);
			return acc;
		}, {});
http.createServer((req, res) => {
	const cookies = parseCookie(req.headers.cookie);
	if(req.url.startsWith('/login')){
		const { query } = url.parse(req.url);
		const { name } = qs.parse(query);
		const expires = new Data();
		expires.setMinutes(expires.getMinutes() + 5);
		res.writeHead(302, {
			Location : '/',
			'Set-Cookie': 'name=${endcodeURIComponent(name)};
		Expires=${expires.toGMTString()}; HttpOnly; Path='/',
		});
		res.end();
	}else if(cookies.name){
	res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'});
	res.end('${cookies.name}님 안녕하세요');
	}else{
		fs.readFile('./server4.html', (err, data) => {
			if(err){
				throw err;
			}
			res.end(data);
		});
	}
})
	.listen(8083, () =>{
	console.log('8083번 포트에서 서버 대기 중입니다!');
});
```

1. 주소가 /login으로 시작하는 경우에는 url과 querystring 모듈로 각각 주소와 주소에 딸려오는 query를 분석한다. 그리고 쿠키의 만료시간도 지금으로 부터 5분뒤로 설정하였다. 이제 302 응답 코드, 리다이렌트 주소와 함깨 쿠키를 헤더에 넣는다. 브라우저는 이 응답 코드르 보고 페이지를 해당 주소로 리다이렉트 한다. 헤더에는 한글을 설정할 수 없으므로 name 변수를 encodeURIComponent 메서드로 인코딩한다.
2. 그 외의 경우,먼저 쿠키가 있는지 없는지를 확인한다. 쿠키가 없다면 로그인할 수 잇는 페이지를 보낸다. 처음 방문한 경우엔 쿠키가 없으므로 server4.html이 전송된다. 쿠키가 있다면 로그인한 상태로 간주하며, 인사말을 보낸다. res.end 메서드에 한글이 들어가면 인코딩 문제가 발생되므로 res.writeHead에 Content-Type을 text/html; charset=utf-8로 설정해 인코딩을 명시하였습니다.

|함수|설명|
|---|---|
|쿠키명=쿠키값|기본적인 쿠키의 값이다. mycookie=test 또는 name=zerocho 같이 설정한다.|
|Expires=날짜|만료 기한이다. 이 기한이 지나면 쿠키가 제거된다. 기본값은 클라이언트가 종료될 때까지 입니다|
|Max-age=초|Expires와 비슷하지만 날짜 대신 초를 입력할 수 있다, 해당 초가 지나며 쿠키가 제거된다. Expires보다 우선한다.|
|Domain=도메인명|쿠키가 전송될 도메인을 특정할 수 있다. 기본값은 현재 도메인이다.|
|Path=URL|쿠키가 전송될 URL을 특정할 수 있다. 기본 값은 ‘/’이고 이 경우 모든 URL에서 쿠키를 전송할 수 있다.|
|Secure|HTTPS일 경우에만 쿠키가 전송됩니다.|
|HttpOnly|설정 시 자바스크립트에서 쿠키를 접근 할 수 없습니다. 쿠키 조작 방지를 위해 설정하는것이 좋다|

하지만 쿠키에 민감한 정보를 담기엔 보안이 취약하고, 쿠키가 조작될 위험이 있기 때문에 로그인에서는 사용하면 안됨.

```jsx
const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');

const parseCookies = (cookie = '') =>
	cookie
		.split(';')
		.map(v => v.split('='))
		.map(([k, ...vs]) => [k, vs.join('=')])
		.reduce((acc, [k, v]) => {
			acc[k.trim()] = decodeURIComponent(v);
			return acc;
		}, {});

const session = {};

http.createServer((req, res) => {
	const cookies = parseCookie(req.headers.cookie);
	if(req.url.startsWith('/login')){
		const { query } = url.parse(req.url);
		const { name } = qs.parse(query);
		const expires = new Data();
		expires.setMinutes(expires.getMinutes() + 5);
		
		session[randomInt] = {
			name,
			expires,
		};
		res.writeHead(302, {
			Location : '/',
			'Set-Cookie': 'session=${randomInt};	
			Expires=${expires.toGMTString()}; HttpOnly; Path= /',
		});
		res.end();
	}else if(cookie.session && session[cookies.session].expires > new Date()){
		res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'});
		res.end('${session[cookies.session].name}님 안녕하세요');
	}else{
		fs.readFile('./server4.html', (err, data) => {
			if(err){
				throw err;
			}
			res.end(data);
		});
	}
})
	.listen(8083, () =>{
	console.log('8083번 포트에서 서버 대기 중입니다!');
});
```

쿠키에 이름을 담아서 보내는 대신 randomInt라는 임의의 숫자를 보냈다. 사용자의 이름과 만료시간은 session이라는 객체에 대신 저장한다. 이제 cookie.session이 있고 만료기한을 넘기지 않앗다면 session 변수에서 사용자 정보를 가져와서 사용한다.

서버에 사용자 정보를 저장하고 클라이언트와는 세션 아이디로만 소통한다. 세션 아이디는 곡 쿠키를 사용해서 주고 받지 않아도 됨, 하지만 많은 웹사이트가 쿠키를 사용한다. 쿠키를 사용하는게 제일 간단하기 때문이다.

실제 배포용 서버에서는 세션을 위와 같이 변수에 저장하지 않는다. 서버가 멈추거나 재시작 되면 메모리에 저장된 변수가 초기화 되기 때문이다.

또한 서버의 메모리가 부족하면 세션을 저장하지 못하는 문제도 생기기 때문에 보통은 데이터 베이스에 넣어둔다.

서비스를 만들 때 마다 쿠키와 세션을 직접 구현할 순 없다 게다가 지금 코드로는 쿠키를 악용한 여러가지 위협을 방어하지도 못한다. 위의 방식 역시 세션 아이디 값이 공개되어 있어 누출되면 다른 사림이 사용할 수 있다. 따라서 절대로 위 코드를 실제 서비스에서 사용해선 안됨. 보안이 매우 취약함

# cluster

cluster 모듈은 싱글 스레드인 노드가 CPU코어를 모두 사용할 수 있게 해주는 모듈이다.

포트를 공유하는 노드 프로세스를 여러 개 둘 수 도 있어 요청이 많이 들어왔을 때 병렬로 실행된 서버의 개수 만큼 요청이 분산되게 할 수 있다. 서버에 무리가 덜 가게 되는 셈이다.

cluster 모듈을 설정하여, 코어 하나당 노드 프로세서 하나가 돌아가게 할 수 있다. 성능이 꼭 코어수만큼 되는 건 아니지만, 코어를 하나만 사용할 때에 비해서 성능이 올라간다.

하지만 세션을 공유하지 못한다,, 이는 Redis등의 서버를 도입해서 해결 가능,,

```jsx
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().lenght;

if(cluster.isMaster){
	console.log('마스터 프로세스 아이디 : ${process.pid}');
	//CPU 개수 만큼 워커 생산
	for(let i = 0; i < numCpus; i += 1){
		cluster.fork();
	}
	//워커가 종료되었을 때
	cluster.on('exit', (worker, code, signal) => {
		console.log('$(worker.process.pid}번 워커가 종료되었습니다.');
	});
}else{
	//워커들이 포트에서 대기
	http.createServer((req, res) => {
		res.write('<h1>Hello Node!</h1>');
		res.end('<p>Hello Cluster!</p>');
	}).listen(8085);

	console.log('${process.pid}번 워커 실행');
}
```

클러스터에는 마스터 프로세스와 워커 프로세스가 있다. 마스터 프로세스는 CPU 개수만큼 워커 프로세스를 만들고, 8085번 포트에서 대기한다. 요청이 들어오면 만들어진 워커 프로세스에서 요청을 분배한다.

워크 프로세스가 실질적인 일을 하는 프로세스이다. 여기서는 8개 코어라고 가정하고 코드를 작성한다.

```jsx
}else {
	//워커들이 포트에서 대기
	http.createServer((req, res) => {
		res.write('<h1>Hello Node!</h1>');
		res.end('<p>Hello Cluster!</p>');
		setTimeout( ()=>{
			process.exit(1);
		},1000);
	}).listen(8085);

	console.log('${process.pid)번 워커 실행');
}
```

여덟번까지는 오류가 발생해도 서버가 정상 작동이 가능하다. 종료된 워커를 다시 켜면 오류가 발생해도 버틸 수 있다. 다음과 같이 워커 프로세스가 종료 되었을 때 새로 하나를 생성해보자

```jsx
...
cluster.on('exit', (worker, code, signal) => {
	console.log('${worker.process.pid}번 워커가 종료되었습니다.');
	cluster.fork();
});
...
```

이제 워커가 죽을 때마다 새로운 워커가 하나 더 생성됩니다. 하지만 이러한 방식으로 오류를 막으려는 건 좋지 못함. 하지만 예기치 못한 에러로 인해 서버가 종료되는 현상을 방지할 수 있다.

직접 cluster모듈로 클러스터링을 구현할 수 있지만, 실무에서는 pm2등의 모듈로 cluster기능을 사용하곤 한다.

---

#NodeJS #BackEnd 

---