---
slug: "Node-Package-Manager-Version-관리"
---
# Package Version
## Npm 버전 표기법
### 패치 버전
- `1.0` : `1.0` 버전에서 어떤 패치 버전이어도 상관 없음
- `1.0.x` : `1.0.x` 버전에서 어떤 패치 버전이어도 상관 없음
- `~1.0.4` : `1.0.4` 버전 이상으로 어떤 패치 버전이어도 상관 없음
### 마이너 버전
마이너와 패치 버전의 범위만
- `1` : `1` 버전 이상의 어떤 마이너 패치 버전이어도 상관 없음
- `1.x` : `1` 버전 이상의 어떤 마이너 패치 버전이어도 상관 없음
- `^1.0.4` `1.0.4` 버전 이상으로 어떤 마이너 버전이어도 상관 없음 ( 즉, 메이저 버전만 고정 )

### 메이저 버전
- `*`, `x` : 어떤 버전이어도 상관 없음
# Package 관리 방법
## Npm Package 
흔히 아는 Github Registry를 사용하면 된다.
우리가 흔히 올리는 npm 과 유사한 방식이다.


## Mono Repo
기본적으로 `$npm init`을 통해 생성한 node_module 기본 프로젝트는 `package.json`파일을 가진 단일 패키지로 구성됩니다.
Mono-Repo 는 하나의 프로젝트로 여러 패키지를 관리하는 개념을 말합니다

### 장점
- 공통 코드 사용 용이
- 패키지 간 node_module 공통 사용(eslint, unit test 등 설정 공유)
- 1개 저장소 관리로 인해 유지 보수 용이성 증가

### 단점
- 단일 저장소 사이즈가 매우 커질 수 있다.
- 여러 패키지가 무분별하게 서로 의존성을 가지가 될 수 있음

공통 관심사를 가진 패키지들끼리 묶어서 사용할 때 가장 효율적이라는 것을 알 수 있습니다. 
웹 파트에서는 Mono-repo 를 구성하고 관리할 수 있는 도구로 Lerna 를 사용했습니다.

### Lerna
![Pasted-image-20240731100845.png](/img/이미지 창고/Pasted-image-20240731100845.png)
[공식문서](https://lerna.js.org/)

#### Mono-Repo
먼저 프로젝트 디렉터리를 생성한 뒤 npx 를 통해 `lerna` 명령어를 입력합니다.
```shell
npx lerna init --independent
```
이 때 independent 모드로 설정하면 패키지마다 별도의 버전으로 배포할 수 있습니다. 

이렇게 Lerna 프로젝트를 초기화하면 아래와 같은 폴더 구조가 됩니다.
```shell
lerna-ropo/
	packages/
	packages.json
	lerna.json
```
- `package.json`
	- 루트의 `package.json` 파일에 Mono-Repo에서 공통으로 사용할 의존성 설정이 가능합니다.
- `/lerna.json`
	- Lerna 설정 파일
- `/packages/` 
	- packages 디렉터리 하위에 단일 패키지 프로젝트를 생성하게 됩니다.
packages 경로를 임의의 폴더로 변경하고 싶다면, `lerna.json` 파일에서 `package.json` 옵션 경로를 수정하면 됩니다.




---

#NodeJS #NPM

---
