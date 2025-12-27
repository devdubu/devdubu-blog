---
slug: "Node-Package"
---
# 개발 서버 실행과 빌드

## dev
```json
{
	// ...
	"main" : "index.js",
	"script" : {
		"dev" : "parcel index.html" 
	}
	// ...
}
```
`package.json`

```shell
npm run dev
```
- 를 입력하게 된다면, `package.json`에 있는 script를 자동으로 생성해준다.

```js
import _ from 'lodash'

console.log(_.camelCase('hello world'));
```

## Build 
```json
{
	// ...
	"main" : "index.js",
	"script" : {
		"dev" : "parcel index.html" ,
		"build" : "parcel build index.html"
	}
	// ...
}
```
`package.json`
```shell
npm run build
```
위 명령어를 입력시에는 Build가 되서, dist 파일 안에 build된 결과물이 보이게 됩니다
해당 빌드 결과물은 난독화를 진행하여 build 결과물을 추출합니다.

:::question **난독화?**
- 작성된 코드를 읽기 어렵게 만드는 작업을 말합니다.
- 빌드된 결과(제품)는 브라우저에서 해석되는 용도로, 용량을 축소하고 읽기 어렵게 만드는 등의 최적화를 거치는 것이 좋습니다.

:::

:::tip **Bundle?**
- 프로젝트 개발에 사용한 여러 모듈을 하나로 묶어내는 작업


:::

# 유의적 버전(SemVer)

```shell
npm info lodash
```
![Pasted-image-20231218085332.png](/img/이미지 창고/Pasted-image-20231218085332.png)
- 실제 `package.json` 파일과 현재 설치된 버전이 다를 수도 있습니다.
- 정확한 해당 node package의 버전을 보고 싶다면, 해당 `node_modules`에서 해당 패키지 명 안에 있는 `package.json`을 찾아보는 것이 제일 정확한 방법입니다.


## 특정 패키지 버전 설치
```shell
# 특정 패키지 버전 설치
npm install lodash@4.17.20

# 패키지 버전 업그레이드
npm update lodash
```
`^` 이 없다면, 해당 버전으로 Fix 된 상태이기에, 업데이트를 진행할 수가 없다.

---

#NodeJS #NPM

---