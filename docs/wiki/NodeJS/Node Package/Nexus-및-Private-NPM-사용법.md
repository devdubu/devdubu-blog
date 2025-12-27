---
slug: "Nexus-및-Private-NPM-사용법"
---
# Nexus 사용법

처음 Nexus 로 진입 후에, 로그인 완료 후 아래 Browse로 접속합니다

![Pasted-image-20250424090345.png](/img/이미지 창고/Pasted-image-20250424090345.png)

이미 구축이 되어 있는 경우는 아래와 같이 되어 있을 겁니다.
![Pasted-image-20250424090513.png](/img/이미지 창고/Pasted-image-20250424090513.png)

그리고 만약 위 사진 처럼 4가지의 Browse 속성이 보이지 않는다면, 새로 하나 생성 해야 합니다.

각 설정은 아래와 같습니다. 해당 Name 보다는 Type을 집중적으로 보시면 됩니다.

## Hosted
실제 NPM으로 만든 Package를 넣는 장소 입니다.
![Pasted-image-20250424092234.png](/img/이미지 창고/Pasted-image-20250424092234.png)

위와 같이 실제 Npm 으로 만든 모듈들을 넣는 곳이며, 위에 올라간 모듈들은 `tgz` 으로 압축된 상태로 들어가게 됩니다.

실제 들어간 모듈을 클릭하게 되면 오른쪽 단에 아래와 같이 뜨게 됩니다.
![Pasted-image-20250424092429.png](/img/이미지 창고/Pasted-image-20250424092429.png)
해당 명령어를 통해서 다운 받으면 됩니다.

### npm url 확인법

:::note 전제 조건
- Admin 계정일 경우 또는 해당 Repository 설정 권한을 가지는 계정인 경우

:::

![Pasted-image-20250424092715.png](/img/이미지 창고/Pasted-image-20250424092715.png)

상단 npm 을 클릭하면 아래와 같은 창이 뜨고, 해당 url로 `npm install` 하면 됩니다.
![Pasted-image-20250424092907.png](/img/이미지 창고/Pasted-image-20250424092907.png)

## Proxy

:::warning Proxy가 필요한 이유
- 흔히 `.npmrc`를 기준으로 npm 은 다운로드 합니다.
- 그렇기에, 흔히 hosted type을 기준으로 url을 설정하게 됩니다.
- 이때부터 문제가 생깁니다.

:::

만약 hosted url을 `.npmrc` 설정하게 된다면, 나머지 `npm.org`에 등록된 오픈 소스 라이브러리를 사용하지 못합니다.

즉, npm hosted 타입에 <mark>존재하는 npm 모듈만</mark> 가져오게 됩니다.
그렇기에, 중간 다리 역할인 proxy 라는 속성이 필요합니다.

해당 url을 가지고 있다면, `npmrc`에서 private repo 라도, npm.org로 연결하여 연동 가능합니다.
아래는 해당 속성 설정입니다.

![Pasted-image-20250424093303.png](/img/이미지 창고/Pasted-image-20250424093303.png)

:::question 어쩌피 `npm.org` 로 proxy로 보낸다면 무슨 의미?

:::

![Pasted-image-20250424093550.png](/img/이미지 창고/Pasted-image-20250424093550.png)

`npm.org` 로 proxy를 연결할 때는 <mark>해당 npm 모듈이 repo 에 없을 때만</mark> 입니다.

즉, 한번 다운로드 된 <mark>npm 모듈은 해당 npm-proxy 타입 repo에 저장</mark>되며, 
실제로 private repository를 사용하는 이유인, 버전 관리에 대한 부분을 이 곳에서 진행이 됩니다.

## Group

실제 npm proxy와 npm hosted는 각각 다른 repo이기에, 해당 url이 모두 다릅니다.
그렇기에, 다운로드 할 때, 해당 package는 npm hosted로 다른 package는 npm proxy로 는 불가능합니다

그래서 나온 type에 group 입니다.


:::tip 해당 타입은, 다운로드 하는 package가 npm hosted에 존재하는지, npm proxy에 존재하는지 자체적으로 판단하여, 자동으로 조정해줍니다.

:::

실제로 해당 Group Repo에 들어가게 되면, Proxy랑 동일하게 외부 npm 모듈이 들어가 있는 것을 확인 할 수 있습니다.
![Pasted-image-20250424094116.png](/img/이미지 창고/Pasted-image-20250424094116.png)

### 설정
![Pasted-image-20250424094143.png](/img/이미지 창고/Pasted-image-20250424094143.png)

npm group에 대한 설정입니다.

:::note 즉, 결론적으로는 npm을 install 하는 입장에서는 `.npmrc`에 group 타입의 url이 적혀 있으면 됩니다.

:::

# Nexus 권한 및 사용자

Nexus 도 기타 다른 서비스처럼 권한 설정과 사용자 설정이 존재합니다.

## Roles

![Pasted-image-20250424095515.png](/img/이미지 창고/Pasted-image-20250424095515.png)

권한 설정은 그리 어렵지 않습니다.

Create Role을 클릭 후
![Pasted-image-20250424095556.png](/img/이미지 창고/Pasted-image-20250424095556.png)
아래와 같이 원하는 Role을 선택하면 됩니다.


## User

그 후에 해당 권한을 User에게 이양하면 됩니다.
![Pasted-image-20250424095702.png](/img/이미지 창고/Pasted-image-20250424095702.png)

![Pasted-image-20250424095720.png](/img/이미지 창고/Pasted-image-20250424095720.png)
실제 Granted 는 적용된 권한을 의미합니다.

User를 생성하고 추후에도 변경이 가능합니다.

# NPM 배포자 셋팅

npm을 배포하기 위해서는 Auth 체크가 필수적입니다.
그렇기에, `.npmrc` 파일을 이용해서 주로 Auth 체크를 하지만, 해당 `.npmrc` 에 정상적으로 등록되어있는 상황에서 안되는 상황이면,

전역적으로 설정하면 됩니다.

## 충돌 방지를 위한 전역 `.npmrc` 제거
우선 gitbash 혹은 cmd 에 들어가면 아래와 같은 화면이 나옵니다.

윈도우 기준으로 아래 경로로 들어왔을 때

![Pasted-image-20250424100137.png](/img/이미지 창고/Pasted-image-20250424100137.png)
해당 경로가 `C:\Users\[사용자명]` 일 때 

```shell
cat .npmrc
# 해당 명령어 입력 시 오류가 아닌 정상 출력이 뜰 경우 .npmrc를 제거해줍니다.
# 충돌 방지를 위한 제거 입니다.
rm .npmrc

# 이후 전역 토큰 재 등록을 진행합니다.
npm login --registry http://192.168.245.126:9081/repository/npm

```

위 과정을 수행하면, 전역적으로 로그인이 되어 오류가 없이 publish 가 됩니다.





