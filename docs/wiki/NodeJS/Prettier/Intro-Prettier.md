---
slug: "Intro-Prettier"
---
# Prettier
[Prettier](https://prettier.io)

## Perttier 예시
```bash
mkdir prettier-test
cd prettier-test
npm init -y
npm install prettier -D
```
- 예를 들어서 `index.js`를 아래와 같이 작성 후 prettier 로 변환해보면
```js
console.log('Hello')
```
`index.js`

```bash
npx prettier index.js
# console.log("Hello");

npx prettier index.js --write
```
- 의도적으로 바꾸는 모습을 볼 수 있으며, `--write` 옵션을 주게 된다면, 파일 자체가 통째로 변경되게 된다.
- 하지만, 매번 위의 cli를 입력하는 것이 귀찮기 때문에, 아래와 같이 prettier를 vscode에 설치하게 된다.
![Screenshot-2023-06-27-at-8.42.51-PM.png](/img/이미지 창고/Screenshot-2023-06-27-at-8.42.51-PM.png)
- plugin 설치로 들어간 후 `Prettier` 를 검색 후 설치 한다.
![Screenshot-2023-06-27-at-8.43.30-PM.png](/img/이미지 창고/Screenshot-2023-06-27-at-8.43.30-PM.png)
- 위의 단축키를 눌러서 검색 란을 활성화 한 후 `Format Document`를 검색하고 들어간다.
![Screenshot-2023-06-27-at-8.44.14-PM.png](/img/이미지 창고/Screenshot-2023-06-27-at-8.44.14-PM.png)
- 위의 셋팅처럼 바꿔준다.

- 만약 `prettier`의 옵션이 마음에 들지 않는다면, root 디렉토리에 `.prettierrc.json` 파일을 만들고, 
- 만약 " "대신 ' '를 쓰고 싶다면, 아래와 같이 json을 설정해주면 된다.
```json
{
	"singleQuote": true
}
```
![Screenshot-2023-06-27-at-8.48.18-PM.png](/img/이미지 창고/Screenshot-2023-06-27-at-8.48.18-PM.png)
- Prettier로 인해서 ESLint에 영향을 주면 안되므로, 해당 규칙은 해제하는것이 좋다.
- 그렇기 때문에, `eslint-config-prettier`를 사용해서 해당 이슈를 제거한 상태에서 사용하는 것이 좋다.

---

#NodeJS #Prettier

---