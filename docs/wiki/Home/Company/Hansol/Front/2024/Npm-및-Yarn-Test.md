---
시작 날짜: 2024-06-26
종료 날짜: 2024-06-26
sticker: vault//이미지/개발 로고/TechIconSVG/Node.js.svg

slug: "Npm-및-Yarn-Test"
---
# 버전에 따른 표준웹 Error
## Yarn 1.22.21 & Node 16
- 가능
## Yarn 1.22.21 & Node 18
- Error
```shell
 @achrinza/node-ipc@9.2.2: The engine "node" is incompatible with this module. Expected version "8 || 10 || 12 || 14 || 16 || 17". Got "18.16.1"
```

## Yarn 4.0.3 & Node 16
- 가능

```shell
npm install -g yarn

# yarn의 최신 버전으로 변경
yarn set version berry

# 특정 버전으로 yarn을 고정하는 방법
yarn set version [버전명] 
# 표준웹 버전은 1.22.21
```
- 만약 `package.json` 파일이 있다면, 해당 `"packageManager": "yarn@4.0.2"` 를 변경해줍니다.
- 글로벌 설정을 바꾸려면 해당 디렉토리에 `package.json` 파일이 없는 위치에서 위에 명령어를 입력해줍니다.