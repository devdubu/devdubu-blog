---
slug: "BackEnd-기본-개념"
---
- [URL](#URL)
		- [WHATWG](#WHATWG)
		- [Node url](#Node url)
		- [querystring](#querystring)
- [암호화](#암호화)
	- [crypto](#암호화#crypto)
		- [단방향 암호화](#crypto#단방향 암호화)
- [양방향 암호화](#양방향 암호화)
- [Util](#Util)
- [file system](#file system)
	- [fs](#file system#fs)



# URL
### WHATWG

이 url방식은 search 부분을 searchParams라는 특수한 객체로 반환하므로 유용

search 부분은 보통 주소를 통해 데이터를 전달 할 때 사용됨

search는 물음표(?)로 시작하고, 그 뒤에 **키=값** 형식으로 데이터를 전달함 여러 키가 있을 경우에는 &로 구분한다.

http://www.gilbut.co.kr/?page=3&limit=10 등 등

| 함수                 | 설명                                                                                                        |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| getAll(key)        | 키에 해당하는 모든 값들을 가져온다. category 키에는 두 가지 값, 즉 nodejs와 javascript의 값이 들어있습니다.                                |
| get(key)           | 키에 해당하는 첫번째 값만 가져옵니다.                                                                                     |
| has(key)           | 해당 키가 있는지 없는지를 검사한다.                                                                                      |
| keys()             | searchParams의 모든 값을 반복기 객체로 가져온다.                                                                         |
| valuse()           | searchParams의 모든 값을 반복기 객체로 가져온다.                                                                         |
| append(key, value) | 해당 키를 추가한다. 같은 키의 값을 모두 지우고 새로 추가한다.                                                                      |
| set(key, value)    | append와 비슷하지만 같은 키의 값들을 모두 지우고 새로 추가합니다                                                                   |
| delete(key)        | 해당 키를 제거합니다.                                                                                              |
| toString()         | 조작한 searchParams 객체를 다시 문자열로 만듭니다. 이 문자열을 searchParams 객체를 다시 문자열로 만듭니다. 이 문자열을 search에 대입하면 주소 객체에 반영된다. |
### Node url
주소가 host 부분 없이 pathname 부분만 오는 경우(/book/bookList.apsx)는 WHATWG 방식은
이 주소를 처리 할 수 없다.

### querystring
WHATWG 방식의 url 대신 기존 노드의 url을 사용할 대 search 부분을 사용하기 쉽게 객체로 만드는 모듈

# 암호화
## crypto
:::tip crypto?
- 다양한 방식의 암호화를 도와주는 모듈
:::

### 단방향 암호화

비밀번호는 보통 단방향 암호화 알고리즘을 사용해서 암호화합니다.

단방향 암호화란 복호화 할 수 없는 암호화 방식을 뜻합니다. 즉, 단방향 암호화는 한 번 암호화시 원래 문자를 찾을 수 없다.

단방향 암호화 알고리즘은 주로 해시 기법을 사용한다.

:::question 해시 기법?
- 어떠한 문자열을 고정된 길이의 다른 문자열로 바꿔버리는 방식이다.
- 예를 들면 abcdefgh라는 문자열을 qvew로 바꿔버리고, ijklm라는 문자열을 zvsf로 바꿔버리는 것이다. 
- 입력 문자열의 길이는 다르지만, 출력 문자열의 길이는 네 자리로 고정되어 있다.

:::

```jsx
const crypto = require('crypto');

console.log('base64',crypto.createHash('sha512').update('비밀번호').digest('base64'));
console.log('hex: ',crypto.createHash('sha512').update('비밀번호').digest('hex'));
console.log('base64:',crypto.createHash('sha512').update('다른 비밀번호').digest('base64'));

```

| 함수 | 설명 |
| --- | --- |
| createHash(알고리즘) | 사용할 해시 알고리즘을 넣어준다. md5, sha1, sha256, sha512 등이 가능하지만, md5와 sha1은 이미 취약점이 발견되었다. 현재는 sha512 정도로 충분하지만, 나중에 sha512마저도 취약해지면 더 강화된 알고리즘으로 바꿔야한다. |
| update(문자열) | 변환할 문자열을 넣어줍니다. |
| digest(인코딩) | 인코딩할 알고리즘을 넣어준다. base64, hex, latin1이 주로 사용되는데, 그 중 base64가 결과 문자열이 가장 짧아 애용됩니다. 결과물로 변환된 문자열을 반환합니다. |

:::bug 취약점
- 가끔 nopqrst라는 문자열이 qvew로 변환되어 abcdefh를 넣었을 때와 똑같은 출력 문자열로 바뀔 때도 있다.
- 이런 상황을 **충돌이 발생했다**고 표현한다
- 해킹용 컴퓨터의 역할은 어떠한 문자열이 같은 출력 문자열을 반환하는지 찾아내는 것입니다. 여러 입력 문자열이 같은 출력 문자열로 변환 될 수 있으므로 비밀번호를 abcdefgh로 설정했어도 nppqrst로 뚤리는 사태가 발생하게 된다.
- 해킹용 컴퓨터가 성능이 발달하멩 따라 기존 해시 알고리즘들이 위협을 받고 있다. 대신 해시 알고리즘도 더 강력하게 진화하고 있다.
- 언젠가 sha512도 취약점이 발견된다면, sha3으로 이전하면 된다.
- 현재는 주로 pbkdf2나 bcrypt, scrypt라는 알고리즘으로 비밀번호를 암호화 하고 있다.
- 이 중에 노드에서 지원하는 pbkdf2는 기존 문자열에 salt라고 불리는 문자열을 붙인 후에 해시 알고리즘을 반복해서 적용한 것이다.

:::

```jsx
const crypto = require('crypto');

crypto.randomBytes(64,(err,buf)=>{
	const salt = buf.toString('base64');
	console.log('salt: ', salt);
	crypto.pbkdf2('비밀번호', salt, 100000, 64, 'sha512', (err, key) =>{
		console.log('password: ', key.toString('base64'));
	});
});
```

1. randomBytes() 메서드로 64바이트 길이의 문자열을 만들어준다. - 이것이 salt가 된다.
2. pbkdf2() 메서드에는 순서대로 비밀번호, salt, 반복횟수, 출력 바이트, 해시 알고리즘을 인자로 넣어준다
3. sha512로 변환된 결괏값을 다시 sha512로 변환하는 과정을 10만번 반복한다.

1초 정도가 될 때까지 반복 횟수를 조정하면 된다.

pbkdf2는 간단하지만, bcrypt난 scrypt보다는 보안에 취약하다 더 나은 보안이 필요하면 scrypt방식을 사용하면 된다.

# 양방향 암호화

암호화된 문자열을 복호화 할 수 있다.

여기에서는 키(열쇠)라는 것이 사용된다. 암호를 복호화하려면 암호화할 때 사용한 키와 같은 키를 사용해야한다.

```jsx
const crypto = require('crypto')

const cipher = crypto.createCiper('aes-256-cbc', '열쇠');
let result = cipher.update('암호화할 문장', 'utf8', 'base64');
result += cipher.final('base64');
console.log('암호화 : ', result);

const decipher = crypto.createDecipher('aes-256-cbc', '열쇠');
let result2 = decipher.update(result, 'base64', 'utf8');
result2 += decipher.final('utf8');
console.log('복호화: ', result2);
```

| 함수 | 설명 |
| --- | --- |
| crypto.createCipher(알고리즘, 키) | 암호화 알고리즘과 키를 넣어줍니다. 암호화 알고리즘은 aes-256-cbc를 사용했습니다. 다른 알고리즘을 사용해도 됩니다. 사용가능한 알고리즘 목록은 crypto.getCipher()를 하면 볼 수 있다. |
| cipher.update(문자열, 인코딩, 출력 인코딩) | 암호화할 대상과 대상의 인코딩, 출력 결과물의 인코딩을 넣어줍니다. 보통 문자열은 utf8 인코딩을, 암호는 base64를 많이 사용합니다. |
| cipher.final(출력 인코딩) | 출력 결과물의 인코딩을 넣어주면 암호화가 완료 됩니다. |
| crypto.createDecipher(알고리즘, 키) | 복호화할 때 사용한다. 암호화할 대 사용했던 알고리즘과 키를 그대로 넣어주어야 합니다. |
| decipher.update(문자열, 인코딩, 출력 인코딩) | 암호화된 문장, 그 문장의 인코딩, 복호화할 인코딩을 넣어준다. createCipher의 update()에서 utf8, base64 순으로 넣었다면 createDecipher의 update()에서 base64, utf8 순으로 넣으면 됩니다. |
| decipher.final(출력 인코딩) | 복호화 결과물의 인코딩을 넣어줍니다. |

# Util
:::tip util?
- util이라는 이름처럼 각종 편의 기능을 모아둔 모듈이다. 
- 계속해서 API가 추가되고 있고, 가끔 deprecated되어 사라지는 경우도 있다.

:::

:::question deprecated?
- deprecated는 프로그래밍 용어로, <mark>‘중요도가 떨어져 더 이상 사용되지 않고 앞으로는 사라지게 될'</mark> 것이라는 뜻 입니다. 
- 새로운 기능이 나와서 기존 기능보다 더 좋을 대, 기존 기능을 deprecated 처리하곤 합니다. 
- 이전 사용자를 위해 기능을 제거하지 않지만 곧 없앨 예정이므로 더 이상 사용하지 말라는 의미이다.

:::

```jsx
const util = require('util');
const crypto = require('crytpo');

const dontUseMe = util.deprecate((x,y)=>{
	console.log(x + y);
}, 'dontUseMe 함수는 deprecated되었으니 더 이상 사용하지 마세요!');
dontUseMe(1, 2);

const randomBytesPromise = util.promisify(crypto.randomBytes);
randomBytesPromise(64).then((buf)=>{
	console.log(buf.toString('base64'));
}).catch((error)=>{
	console.error(error)
}); 
```

| 함수 | 설명 |
| --- | --- |
| util.deprecate | 함수가 deprecated 처리되었음을 알려줍니다. 첫 번째 인자로 넣은 함수를 사용했을 때 경고 메시지가 출력됩니다. 두번 째 인자로 경고 메시지 내용을 넣으면 됩니다. 함수가 조만간 사라지거나 변경될 때 알려줄 수 있어 유용합니다. |
| util.promisify | 콜백 패턴을 프로미스 패턴으로 바꿔줌. 바꿀 함수를 인자로 제공하면 됩니다. 이렇게 바꾸어두면 async/await 패턴까지 사용할 수 있어 좋습니다. randomBytes와 비교해보기, util.callbackify도 있지만 자주 사용하진 않는다 |

# file system
## fs
:::tip fs?
- 파일 시스템에 접근하는 모듈이다.
- 즉, 파일 생성하거나 삭제하고, 읽거나 쓸 수 있습니다.

:::

```jsx
const fs = require('fs');

fs.readFile('./readme.txt', (err, data)=>{
	if(err){
		throw err;
	}
	console.log(data);
	console.log(data.toString());
});
```

readFile 의 결과물은 버퍼라는 형식으로 제공된다. 지금은 단순히 버퍼를 메모리의 데이터라고 생각하면 된다.

```jsx
const fs = require('fs');

fs.writeFile('./writeme.txt','글이 입력됩니다.',(err)=>{
	if(err{
		thorw err;
	}
	fs.readFile('./writeme.txt', (err, data)=>{
		if(err){
			throw err;
		}
		console.log(data.toString());
	});
});
```

`writeFile()`메서드에서 생성괼 파일의 경로와 내용을 입력해준다.

# HTTP 상태 코드

- 2XX : 성공을 알리는 상태 코드이다. 대표적으로 200(성공), 201(작성됨)이 많이 사용됨
- 3XX : 리다이럭션(다른 페이지로 이동을 알리는 상태 코드이다. 어떤 주소를 입력해슨데 다른 주소의 페이지로 넘어갈 때 이 코드가 사용된다. 대표적으로 301(영구이동), 302(임시 이동)가 있습니다.
- 4XX : 요청 오류를 나타냅니다. 요청 자체에 오류가 있을 때 표시됩니다. 대표적으로 401(권한 없음), 403(금지됨), 404(찾을 수 없음)가 있다.
- 5XX : 서버 오류를 나타낸다. 요청은 제대로 왔지만, 서버에 오류가 생겼을 때 발생한다. 이 오류가 뜨지 않게 주의 해서 프로그래밍 해야한다. 이 오류를 클라이언트 res.writeHead로 직접 보내는 경우는 없고, 예기치 못한 에러 발생 시 서버까 알아서 5XX대 코드를 보낸다. 500(내부 서버 오류), 502(불량 게이트웨어), 503(서비스를 사용할 수 없음)이 자주 사용됨

# REST API와 라우팅

## REST API는 REpresentational State Transfer

네트워크 구조의 한 형식이다. 서버의 자원을 정의하고, 자원에 대한 주소를 지정하는 방법을 가르킨다. 주소는 의미를 명확히 전달하기 위해 명사로 구성된다. /user이면 사용자 정보에 관련된 자원을 요청하는 것이고, /post라면 게시글에 관련된 자원을 요청하는 것이라고 추측할 수 있다.

REST API는 주소 외에도 HTTP 요청 메서드라는 것을 사용한다. 폼 데이터를 전송할 때 GET 또는 POST가 바로 요청 메서드이다.

| GET    | 서버 자원을 가져오고자 할 때 사용, 요청의 본문에 데이터를 넣지 않는다. 데이터를 서버로 보내야한다면 queryString을 사용해야한다. |
| ------ | ------------------------------------------------------------------------------ |
| POST   | 서버에 자원을 새로 등록하고자 할 때 사용함, 요청의 본문에 새로 등록할 데이터를 넣어보냅니다.                          |
| PUT    | 서버의 자원을 요청에 들어 있는 자원으로 치환하고자 할 대 사용한다.                                         |
| PATCH  | 서버 자원의 일부만 수정하고자 할 때 사용한다. 요청의 본문에 치환 할 데이터를 넣어 보낸다.                           |
| DELETE | 서버의 자원을 삭제하고자 할 때 사용한다.                                                        |

GET 메서드 같은 경우에는 브라우저에서 캐싱을 할 수 있어서 같은 주소의 GET요청을 할 때 서버에서 가져오는 것이 아니라 캐시에서 가져올 수도 있다. 
이렇게 캐싱이 되면 성능이 좋아진다.

그리고 http 프로토콜을 사용하면 클라이언트가 누구든 상관없이 서버와 소통할 수 있습니다.

iOS, 안드로이드, 웹이 모두 같은 주소로 요청을 보낼 수 있다.

# HTTP & HTTP2
https 모듈은 웹 서버에 SSL암호화를 추가한다. GET이나 POST요청을 할 때 오고 가는 데이터를 암호화 해서 중간에 다른 사람이 요청을 가로채더라도 내용을 확인할 수 없게 해준다.

요즘은 로그인이나 결제가 필요한 창에서는 https 적용이 필수가 되는 추세이다.

https 모듈을 사용하는 건 아무나 사용할 순 없다.

암호화를 적용하는 만큼, 그것을 인증해줄 수 있는 기관도 필요하다. 인증서는 인증 기관에서 구입해야한다. Let’s Encrypt 같은 기관에서 무료로 발급해주기도 하나.

인증서 발급 과정은 복잡하고 도메인이 필요한 경우도 있다. 만약 발급받은 인증서가 있다면

```jsx
const https = require('https');
const fs = require('fs');

https.createServer({
	cert: fs.readFileSync('도메인 인증서 경로');
	key : fs.readFileSync('도메인 비밀키 경로');
	ca : [
		fs.readFileSync('상위 인증서 경로');
		fs.readFileSync('상위 인증서 경로');
	],
}, (req, res) = > {
	res.write('<h1>Hello Node!<h1>');
	res.end('<p>Hello Server!<p>');
}).listen(443, ()=> {
	console.log('443번 포트에서 서버 대기중입니다!');
});
```

createServer 메서드가 인자를 두번 받는다. 두 번째 인자는 http모듈과 같이 서버 로직이고, 첫번째 인자는 인증서에 관련된 옵션 객체이다. 인증서를 구입하면 pem이나 crt, 또는 key확장자를 가진 파일들을 제공해준다. 파일들을 fs.readFileSync메서드로 읽어서 cert, key, ca 옵션에 알맞게 넣어주면 된다.

노드의 http2 모듈은 SSL 암호화와 더불어 최신 http프로토콜인 http/2를 사용할 수 있게 해준다.

http/2는 요청 및 응답 방식이 기존 http/1.1보다 개선되어 훨씬 효율적으로 요청을 보낸다. http/2를 사용하면 웹의 속도도 많이 개선 된다.

아래는 http/2를 적용한 코드이다.

```jsx
const http2 = require('http2');
const fs = require('fs');

http2.createServer({
	cert: fs.readFileSync('도메인 인증키 경로');
	key: fs.readFileSync('도메인 비밀키 경로');
	ca : [
		fs.readFileSync('상위 인증서 경로');
		fs.readFileSync('상위 인증서 경로');
	],
}, (req, res) => {
	res.write('<h1>Hello Node!</h1>');
	res.end('<p>Hello Server!</p>');
)}.listen(443, () => {
	console.log('443번 포트에서 서버 대기 중입니다.');
});
```

---

#NodeJS #BackEnd

---




