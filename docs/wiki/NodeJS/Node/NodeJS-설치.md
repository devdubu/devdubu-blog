---
slug: "NodeJS-설치"
---
# NodeJS
>[!info | blue] **NodeJS?**
>- Chrome V8 JavaScript 엔진으로 빌드된 JavaScript Runtime


# NVM
## 설치
[NVM 설치 주소](https://github.com/nvm-sh/nvm) 에 들어가서 아래의 화면으로 이동합니다.
![Pasted-image-20231213144718.png](/img/이미지 창고/Pasted-image-20231213144718.png)
- 그러고 난 후에 아래의 코드를 복사한 후에 Terminal에 복사합니다.
```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```
### 윈도우 사용자
윈도우 사용자들 아래의 링크를 들어가면 된다.
[nvm-window](https://github.com/coreybutler/nvm-windows)
그 후에 `Download Now!` 를 찾아서 눌러주면 됩니다.
![Pasted-image-20231213145338.png](/img/이미지 창고/Pasted-image-20231213145338.png)
해당 URL로 이동 한 뒤에 아래의 `zip` 파일을 받으면 됩니다.
![Pasted-image-20231213145435.png](/img/이미지 창고/Pasted-image-20231213145435.png)


## 사용법
```shell
# NVM 으로 설치한 Node 버전 목록
nvm ls

# NVM으로 특정 버전의 node 설치
nvm install 12.14.1

# NVM으로 특정 버전의 node를 사용
nvm use 12.14.1
```

# NPM
:::info **NPM?**
- NodePackageManager는 전 세계의 개발자들이 만든 다양한 기능 들을 관리

:::

![Pasted-image-20231213151702.png](/img/이미지 창고/Pasted-image-20231213151702.png)
## 테스트 환경 구축
```shell
# NodeJS 초기화
npm init -y
# parcel-bundler 설치 devDependance
npm install parcel-bundler -D

npm install lodash

```

:::warning 개발용 의존성 패키지 vs 일반 의존성 패키지
- 개발용 의존성 패키지 : 개발할 때만 필요하고 실제 빌드 후 운영에서는 사용하지 않는 경우를 의미한다.
- 일반 의존성 패키지 : 개발 + 운영시 모두 필요한 패키지를 의미한다.








:::

---

#NodeJS 

---