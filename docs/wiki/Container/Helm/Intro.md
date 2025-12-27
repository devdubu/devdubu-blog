Helm은 charts 라는 패키지 포맷을 사용한다.
Chart는 k8s 리소스와 관련된 셋을 설명하는 파일의 모음이다.
하나의 차트는 memcached 파드를 배포하는 것 처럼 단순한 형태나 HTTP 서버, 데이터베이스, 캐시 등으로 구성된 웹앱 같이 복잡한 형태로 사용될 수 있다.

차트는 특정한 디렉터리 구조를 가진 파일들로 생성된다.
이 파일들은 배포할 버전이 지정된 아카이브로 패키지화 될 수 있다.

설치하지 않고 공개된 차트를 다운로드 받거나 보기 위해
```shell
helm pull chartrepo/chartname
```
명령을 사용할 수 있다.

이 문서는 차트 형식을 설명하고, 차트를 Helm으로 구성하는 기본 가이드를 제공한다.

# 차트 파일 구조
Chart는 디렉터리 안에 파일들의 모음으로 구성된다.
디렉터리명은 (버전 정보 없는) 차트명이다.
따라서, WordPress 를 설명하는 차트는 `wordpress/` 디렉터리에 저장된다.

디렉터리 안에서 Helm 은 다음과 같은 구조를 가진다.

```shell
wordpress/
	Chart.yaml          # 차트에 대한 정보를 가진 YAML
	LICENSE             # 옵션: 차트의 라이센스 정보를 가진 텍스트 파일
	README.md           # 옵션 : README 파일
	values.yaml         # 차트에 대한 기본 환경설정 값들
	values.schema.json  # 옵션 : values.yaml 파일의 구조를 포함하는 디렉터리
	charts/             # 이 차트에 종속된 차트들을 포함하는 디렉터리
	crds/               # 커스텀 자원에 대한 정의
	templates/          # values와 결합될 때, 유효한 쿠버네티스 manifest 파일들이 생성될 템플릿들의 디렉터리
	templates/NOTES.txt # 옵션: 간단한 사용법을 포함하는 텍스트 파일
```

Helm 은 `chart/`, `crds/`, `templates/` 디렉터리와 나열된 파일명의 사용을 예약한다.
다른 파일들은 그대로 남는다.

## `Chart.yaml` 파일
`Chart.yaml` 파일은 차트의 필수 요소 이다.
다음과 같은 필드를 포함한다.

```yaml
apiVersion : 차트 API 버전(필수)
name: 차트명(필수)
version: SemVer2 버전(필수)
kubeVersion: 호환되는 쿠버네티스 버전의 SemVer 범위(선택)
description: 이 프로젝트에 대한 간략한 설명(선택)
type: 차트 타입(선택)
keywords:
	- 이 프로젝트에 대한 키워드 리스트(선택)
home: 프로젝트 홈페이지의 URL
	- 이 프로젝트의 소스코드 URL(선택)
dependencies: # 차트 필요 조건들의 리스트(optional)
	- name: 차트 명(nginx)
	- version: 차트의 버전("1.2.3")
	- repository: 저장소 URL("https://example.com/charts")
	- condition: (선택) 차트들의 활성/비활성을 결정하는 boolean 값을 만드는 yaml 경로 (예시: subchart1.enabled)
	- tags: #(활성)
		- 활성화 / 비활성화을 함께하기 위해 차트들을 그룹화 할 수 잇는 태그들
	- enabled: (선택) 차트가 로드될 수 있는지 결정하는 boolean
	- import-values: # (선택)
		- importValues는 가져올 상위 키에 대한 소스 값의 맵필을 보유한다.
		- 각 항목은 문자열이거나 하위 / 상위 하위 목록 항목 쌓일 수 있다.
	- alias: (선택) 차트에 대한 별명으로 사용된다. 같은 차트를 여러번 추가해야할 때 유용하다.
maintainers: # (선택)
	- name: maintainer들의 이름(각 maintainer 마다 필수)
	- email: maintainer들의 email(각 maintainer 마다 선택)
	- url: maintainer에 대한 URL (각 maintainer 마다 선택)
icon: 아이콘으로 사용될 SVG나 PNG 이미지 URL
appVersion: 이 앱의 버전(선택). SemVer 인 필요는 없다.
deprecated: 차트의 deprecated 여부(선택, boolean)
annotations:
	example: 키로 맵핑된 주석들의 리스트(선택)
```

## Chart 와 Versioning

모든 차트는 버전 번호를 가져야한다.
버전은 `SemVer2` 표준을 따라야 한다.
이전 헬름과 다르게, 헬름 v2이상은 버전 번호를 release 마커로 사용한다.
저장소에 있는 패키지들은 이름과 버전으로 구분된다.

예를 들어, 버전 필드가 `version: 1.2.3`으로 설정된 nginx 차느는 다음과 같이 이름이 지어진다.
```shell
nginx-1.2.3.tgz
```

`version:1.2.3-alpha.1+2f365` 같은 더 복잡한 SemVer2 이름도 지원된다.
SemVer가 아닌 이름은 시스템에 의해 명백하게 허용되지 않는다.

:::info Helm Classic과 Deploy Manager는 둘 다 GitHub를 지향한 차트지만
- Helm v2와 이후 버전은 GitHub나 Git에 의존하지도, 필요 하지도 않는다.
- 따라서 Git SHA값의 버전관리에서는 모두 사용하지 않는다.

:::

`Chart.yaml` 의 안에 있는 `version` 필드는 CLI를 포함한 많은 헬름 툴에서 사용된다.
패키지를 생성할 때, `helm package` 명령은 `Chart.yaml` 에서 찾은 버전을 패키지 이름에 있는 토크을 사용한다.

시스템은 Chart Package 안의 버전 번호가 `Chart.yaml` 안의 버전 번호와 일치한다고 가정한다.
이 가정을 충족하지 못하면 에러가 발생한다.

### `apiVersion` Field
`apiVerison` 필드는 최소 헬름 3을 필요로 하는 헬름 차트에 대한 `v2`여야 한다.
이전 헬름 버전을 지원하는 차트는 `apiVersion`이 `v1`으로 설정되어 있고, Helm 3에 의해 여전히 설치 가능하다.

:::note `v1`에서 `v2`로 변경하기
- 종속성을 정의하는 `dependencies` Field는 `v1` 차트를 위한 독립된 `requirements.yaml` 파일에 위치 [Chart Dependencies](https://helm.sh/ko/docs/topics/charts/#%ec%b0%a8%ed%8a%b8-%ec%9d%98%ec%a1%b4%ec%84%b1)
- `type` 필드는 어플리케이션과 라이브러리 차트를 식별 [ChartTypes](https://helm.sh/ko/docs/topics/charts/#%ec%b0%a8%ed%8a%b8-%ed%83%80%ec%9e%85)

:::

### `appVersoin` Field
`appVersion` Field는 `version` Field와 **관련이 없음을 주의하라**
이 Field는 어플리케이션의 버전을 명시하는 방법이다.
예를 들어, `drupal` 차트가 `appVersion: 8.2.1` 을 가진다면, 차트에(기본 값으로 ) 포함되는 Drupal의 버전은 `8.2.1` 임을 나타낸다.
이 필드는 정보만 제공하고, 차트 버전 계산에 영향이 없다.

버전을 따옴표로 감싸는 것을 매우 권장한다.
이 것은 YAML parser가 버전 번호를 string으로 다루게 한다.

따옴표 없이 남기면 몇몇 경우에 parsing에 문제가 생길 수도 있다.
YAML은 `1.0`을 소숫점으로, `1234e10` 같은 Git Commit SHA 를 과학적 기수법으로 해석한다.

현재 Helm v3.5.0에서, `helm create`는 기본값으로 `appVersion` 필드를 따옴표로 감싼다.

### `kubeVersoin` Field
선택 Field인 `kubeVersion`은 지원되는 kubernetes 버전에 대한 SemVer 제약조건을 정의 할 수 있다.
Helm은 차트를 설치할 때 버전 제약을 판단하고, 클러스터가 지원되지 않는 K8S 버전을 구동하면 실패한다.

버전 제약은 공백으로 분리된 AND 비교로 다음과 같이 구성된다.
```yaml
>= 1.13.0 < 1.15.0
```

다음 예제와 같이 표현은 각각 OR `||` 연산과 결합될 수 있다.
```yaml
>= 1.13.0 < 1.14.0 || >= 1.14.1 < 1.15.0
```

이 예제에서 버전 `1.14.0`은 제외되어, 특정 버전의 버그가 차트를 제대로 실행하지 못하게 하는 것으로 이해할 수 있다.

버전 제약에 사용하는 `=`, `!=`, `<`, `>`, `<=`, `>=` 연산 외에도, 다음 약칭 표기법이 지원 된다.
- 닫힌 간격에 대한 하이픈 범위
	- `1.1 - 2.3.4` 는 `>=1.1 <= 2.3.4` 와 동일하다.
- 와일드카드 `x`, `X` ,`*`
	- 예를 들어 `1.2.x` 는 `>= 1.2.0 < 1.3.0` 와 동일하다.
- 물결 범위 (패치 버전 변화는 허용)
	- `~1.2.3`는 `>= 1.2.3 < 1.3.0` 와 동일하다.
- 탈자 범위 (마이너 버전 변화는 허용)
	- `^1.2.3` 는`>= 1.2.3 < 2.0.0` 와 동일하다.

### 미사용 예정 차트
차트 저장소에서 차트를 관리할 때, 가끔 차트를 **미사용 예정**으로 표시하는 것이 필요하다.
`Chart.yaml` 에 있는 선택 필드인 `deprecated` 는 차트가 미사용 예정임을 표시하는데 사용될 수 있다. 
저장소에 있는 차트의 **최신** 버전이 **미사용 예정**으로 표시 된다면, **차트는 전체가 미사용 예정**이라고 판단한다. 
미사용 예정을 체크하지 않은 새로운 버전을 발행함으로써 차트명을 이후에 재사용 할 수 있다.
차트를 미사용 하는 것에 대한 [kubernetes/charts](https://github.com/helm/charts) 프로젝트를 따르는 작업흐름은 다음과 같다.

1. 차트의 `Chart.yaml` 를 업데이트 하여 차트를 미사용 예정으로 표시하여 버전을 올린다.
2. 차트 저장소에 새로운 차트 버전을 발행한다.
3. 차트를 소스 저장소에서 삭제한다 (예. git)

### Chart Type
`type` Field는 Chart의 타입을 정의 한다.
`application`, `libary`의 두가지 타입이 있다.
Application은 기본 타입이며, 온전하게 작동할 수 있는 표준 차트이다.

[`library chart`](https://helm.sh/ko/docs/topics/library_charts/)는 chart builder에 유틸리티나 함수를 제공한다.
library chart는 설치가 불가능하고, 보통 어떤 리소스 오브젝트도 갖지 않는 다는 점에서 application chart와 다르다.

:::tip 
- application chart는 libaray chart로 사용될 수 있다.
- 타입을 `libaray` 로 설정하여 활성화 한다.
- 차트는 무든 유틸리티와 함수 기능을 활용할 수 있는 상태의 library chart로 렌더링 된다.
- 차트의 모든 리소스 오브젝트는 렌더링되지 않는다.

:::

### Chart LICENCE, README, NOTES

차트는 설치, 구성, 사용법, 라이센스를 설명하는 파일을 가질 수 있다.

LICENSE는 차트에 대한 [license](https://en.wikipedia.org/wiki/Software_license) 를 포함하는 일반 텍스트 파일이다. 차트는 템플릿 안에서 프로그래밍 로직을 가지는 것으로써의 라이센스를 포함할 수 있으므로 환경 설정 전용이 아니다. 필요한 경우, 차트에 의해 설치된 어플리케이션을 위해 별도의 라이센스로 나눠질 수 있다.

차트에 대한 README는 마크다운(README.md)의 포맷이어야 하며, 일반적으로 다음을 포함한다.

- 차트가 제공하는 어플리케이션이나 서비스에 관한 설명
- 차트를 실행하기 위한 전제조건이나 필요조건
- `values.yaml` 에 있는 옵션과 기본값에 대한 설명
- 차트의 설치나 환경설정에 관련이 있을 수 있는 다른 정보

허브 및 기타 사용자 인터페이스가 `README.md` 파일의 콘텐츠에서 가져온 차트에 대한 세부 정보를 표시하는 경우

차트는 릴리즈의 상태를 보여줄때와 설치 후에 출력될 짧은 일반 텍스트를 `template/NOTES.txt` 파일에 적을 수 있다. 이 파일은 [template](https://helm.sh/ko/docs/topics/charts/#%ed%85%9c%ed%94%8c%eb%a6%bf%ea%b3%bc-%ea%b0%92)으로 평가되고 사용법 메모, 다음 스텝, 차트의 릴리즈와 관련된 다른 정보를 표시하기 위해 사용될 수 있다. 예를 들어, 지시 사항(instructions)은 데이터베이스에 연결하기, 웹 UI에 액세스하기 등에 대해 제공될 수 있다. 이 파일이 `helm install` 이나 `helm status` 가 실행될 때 STDOUT으로 출력되기 때문에, 내용을 간단하게 유지하고, 상세 내용은 README를 참조하도록 하는 것을 권장한다.

## Chart Dependency

Helm에서 하나의 파트는 0개 이상의 다른 차트에 의존한다.
이 의존성은 `Chart.yaml` 에 `dependencies` 필드를 사용하여, 직접 연결되거나 `charts/` 디렉터리로 가져와서 수동으로 관리 할 수 있다.
### `Dependencies` Field를 통해 의존성 관리하기
현재 차트가 필요로하는 chart들은 `dependencies` 필드에 리스트로 정의된다.

```yaml
dependencies:
	- name: apache
	version: 1.2.3
	repository: https://example.com/charts
	- name: mysql
	version: 3.2.1
	repository: https://another.example.com/charts
```

- `name` 필드는 사용할 차트명이다.
- `version` 필드는 사용할 차트의 버전이다.
- `repository` 필드는 차트 저장소의 완전한 URL 이다. 반드시 로컬 환경에서 `helm repo add` 를 사용해야 함을 주의하라.
- URL 대신 저장소의 이름을 사용할 수 있다.

```shell
helm repo add fantastic-charts https://fantastic-charts.storage.googleapis.com
```

```yaml
dependencies:
  - name: awesomeness
    version: 1.0.0
    repository: "@fantastic-charts"
```

일단 종속성을 정의하면, `helm dependency update`를 실행할 수 있고, 실행하면 종속성 파일을 사용해서 모든 명시된 차트를 `charts/` 디렉터리 안에 다운로드 받는다.

```shell
$ helm dep up foochart
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "local" chart repository
...Successfully got an update from the "stable" chart repository
...Successfully got an update from the "example" chart repository
...Successfully got an update from the "another" chart repository
Update Complete. Happy Helming!
Saving 2 charts
Downloading apache from repo https://example.com/charts
Downloading mysql from repo https://another.example.com/charts
```

`helm dependency update` 가 차트를 가져올 때, 차트 아카이브의 형태로 `charts/` 디렉터리에 저장한다.
위의 예제같은 경우, 다음 파일들을 차트 디렉터리에서 볼 수 있다.

```yaml
charts/
	apache-1.2.3.tgz
	mysql-3.2.1.tgz
```

### 의존성 안에서의 대체 필드
위에서 본 필드 외에도, 각각의 필요 엔트리는 선택적 Field인 `alias`를 가질 수 있다.
종속성 차트에 대한 별명(alias)를 추가하여, dependencies 안에 새로운 종속성 이름을 별명으로 사용하여 넣게 된다.

다른 이름으로 차트에 엑세스 해야하는 경우 `alias`를 사용할 수 있다.

```yaml
# parentchart/Chart.yaml

dependencies:
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
    alias: new-subchart-1
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
    alias: new-subchart-2
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
```
위의 예에서 `parentChart`에 대해 모두 3개의 종속성을 얻게 된다.

```yaml
subchart
new-subchart-1
new-subchart-2
```

같은 동작을 수동으로 하는 방법은 `charts/` 디렉터리에 같은 차트를 여러번 다른 이름으로 복사/붙여넣기 하면 된다.

#### 의존성 안에서의 태그와 조건 필드
위에서 본 Field 외에도, 각각의 필요 Entry 는 선택 필드인 `Tags`와 `condition`을 가질 수 있다.
모든 Chart는 기본으로 로드 된다.
`tags`나 `condition` 필드가 존재하면, chart가 적용될지에 대한 로딩 제어를 위해 사용되고 평가된다.

Condition-condtion 필드는 1개 이상의 콤마로 구분되는 YAML 경로이다.
최상단 부모의 values에 이 경로가 존재하고 boolean 값으로 판단할 수 있다면, 차트는 boolean 값에 의해 활성화 혹은 비활성화 된다.
리스트에서 발견된 유효한 첫번째 경로만이 평가되고, 이 경로가 존재하지 않으면, 해당 condition은 무효하다.

Tags-tags 필드는 이 차트와 관련된 레이블의 YAML 리스트이다.
최상단 부모의 values에서, 태그를 가진 모든 차트는 특정한 태그와 boolean 값에 의해 활성화 또는 비활성화 된다.

```yaml
# parentchart/Chart.yaml

dependencies:
  - name: subchart1
    repository: http://localhost:10191
    version: 0.1.0
    condition: subchart1.enabled, global.subchart1.enabled
    tags:
      - front-end
      - subchart1
  - name: subchart2
    repository: http://localhost:10191
    version: 0.1.0
    condition: subchart2.enabled,global.subchart2.enabled
    tags:
      - back-end
      - subchart2
```

```yaml
# parentchart/values.yaml

subchart1:
  enabled: true
tags:
  front-end: false
  back-end: true
```

위 예에서 `front-end` 태그를 가진 모든 차트는 비활성화 되지만, 부모의 values 에서 `subchart1.endabled` 가 `true` 로 평가되었기 때문에, 
condition은 `front-end` 태그를 덮어 쓰고, `subchart1`은 활성화 된다.

`subchart2`는 `back-end`와 태그 되었고, 이 태그는 `true`, 평가되어서, `subchart2` 는 활성화 된다.
또한 `subchart2` 가 특정한 condition을 가지지만, 부모의 values에 대응되는 경로가 없어서, 이 condition은 아무 영향이 없다.

##### 태그 및 조건과 함께 CLI 사용

- **(values에 셋팅된) Condition은 항상 tag를 덮어쓴다.** 
	- 존재하는 첫번째 condition 경로가 사용되고 그 차트의 다른 것들은 무시된다.
- tag는 '어떤 차트의 tag라도 true면 차트를 활성화 시킬것' 으로 평가한다.
- tag와 condition 값은 최상단 부모의 values에 셋팅되어야 한다.
- values의 `tags:` 키는 최상단 레벨의 키여야 한다. 
- 전역과 중첩된 `tags:` 테이블은 현재 지원되지 않는다.

#### 의존성을 통해 자식 값 가져오기

몇몇 케이스에서 자식 차트의 values가 부모의 차트에 영향을 미치고 공통 기본 값으로 공유되도록 하고 싶을 수 있다. 
`exports` 포맷을 사용하는 것의 추가 이점은 향후 도구를 통해 사용자가 설정 할 수 있는 값을 가능하게 하는 것이다.

`import` 될 값을 포함하는 키는 `YAML` 리스트를 사용해서 부모 차트의 `dependencies` 안에 `import-values` 필드로 명시할 수 있다. 
리스트의 각 아이템은 자식 차트의 `exports` 필드로부터 `import` 되는 키이다.

`exports` 키 안에 포함되지 않은 import value를 사용하려면, [child-parent](https://helm.sh/ko/docs/topics/charts/#%ec%9e%90%ec%8b%9d-%eb%b6%80%eb%aa%a8-%ed%98%95%ec%8b%9d-%ec%82%ac%ec%9a%a9%ed%95%98%ea%b8%b0) 포맷을 사용하라. 두 포맷 모두 아래에서 설명한다.

##### 내보내기 형식 사용하기

자식의 `values.yaml` 파일이 루트에 `exports` 필드를 가진다면, 
이 필드의 내용은 다음 예제처럼 import 하기 위한 키를 명시함으로써 부모의 values에 직접 import 될수 있다.

```yaml
# parent's Chart.yaml file

dependencies:
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
    import-values:
      - data
```

```yaml
# child's values.yaml file

exports:
  data:
    myint: 99
```

`import` 리스트에 `data` 키를 명시했기 때문에, Helm을 `data` 키에 대한 자식 차트의 `exports` 필드를 찾고 그것의 내용을 import 한다.

최종 부모의 values는 export 된 필드를 포함한다.

```yaml
# parent's values

myint: 99
```

부모의 `data` 키가 부모의 최종 values에 포함되지 않음을 주의 하라.
부모의 키에 명시할 필요가 있다면, `child-parent` 포맷을 사용하라


#### `child-parent` 형식 사용하기
자식 차트의 values `exports`키에 포함되지 않는 values 접근하려면, import 될 child values의 키와 부모 차트의 values parents안의 목적지 경로를 명시해야 한다.

아래의 예제에 있는 `import-values`는 `child` 경로에서 발견된 어떤 값이든 취하고, 값들을 `parent: ` 에 명시된 경로에 부모의 값들로 복사하라고 헬름에게 지시한다.

```yaml
# parent's Chart.yaml file

dependencies:
  - name: subchart1
    repository: http://localhost:10191
    version: 0.1.0
    ...
    import-values:
      - child: default.data
        parent: myimports
```

위의 예제에서, subchart1의 값들 안에 `default.data` 에서 발견된 values는 다음과 같이 부모 차트의 values 안의 `myimports` 키로 import 된다.

```yaml
# parent's values.yaml file

myimports:
  myint: 0
  mybool: false
  mystring: "helm rocks!"
```

```yaml
# subchart1's values.yaml file

default:
  data:
    myint: 999
    mybool: true
```

부모 chart의 values 결과는 다음과 같다.

```yaml
# parent's final values

myimports:
  myint: 999
  mybool: true
  mystring: "helm rocks!"
```

부모의 최종 values는 이제 subchart1에서 import된 `myint`와 `mybool` 필드를 가진다.

#### `charts/` 디렉터리를 통해 수동으로 의존성 관리
더 많은 종속성 제어가 필요하다면, 이 종속성들은 dependency 차트를 `charts/` 디렉터리로 복사함으로써, 정확하게 표현 될 수 있다.

종속성은 차트 아카이브 (`foo-1.2.3.tgz`) 나 비 압축 차트 디렉터리가 될 수 있다.
이름은 `_`나 `.`로 시작될 수 없다.

예를 들어서, WordPress 차트가 Apache 차트에 의존한다면, (올바른 버전의) Apache 차트는 WordPress 차트의 `charts/` 디렉터리 안에 저장된다.

```yaml
wordpress:
  Chart.yaml
  # ...
  charts/
    apache/
      Chart.yaml
      # ...
    mysql/
      Chart.yaml
      # ...
```

### 의존성 사용의 운영적 관점
위 섹션은 차트 종속성을 어떻게 명시하는지 설명하지만, `helm install`과 `helm upgrade`를 사용하는 차트 설치에 어떻게 영향을 미치는가?

"A"라는 차트가 다음과 같은 k8s 오브젝트를 생성한다고 가정하자.
- namespace "A-Namespace"
- statefulset "A-StatefulSet"
- service "A-Service"
A가 오브젝트를 생성하는 B 차트에 의존성을 가진다고 하자.
- namespace "B-Namespace"
- replicaset "B-ReplicaSet"
- service "B-Service"
차트 A의 installation/upgrade 후에, 단일 헬름 릴리즈가 생성 / 수정된다.

릴리즈는 다음 순서로 위의 k8s 오브젝트를 전부 생성/업데이트 한다.

- A-Namespace
- B-Namespace
- A-Service
- B-Service
- B-ReplicaSet
- A-StatefulSet

왜냐하면 헬름이 차트를 설치/업그레이드 할때, 차트와 모든 종속성으로부터 쿠버네티스 오브젝트가

- 단일 집합으로 통합된다.
- 이름에 따른 타입으로 정렬된다.
- 그 순서에 의해 생성/업데이트 된다.

이런 이유로 단일 릴리즈는 차트와 종속성에 대한 모든 오브젝트와 함께 생성된다.

쿠버네티스 타입의 설치 순서는 kind_sorter.go( [the Helm source file](https://github.com/helm/helm/blob/484d43913f97292648c867b56768775a55e4bba6/pkg/releaseutil/kind_sorter.go))의 열거형 타입 설치 순서에 의해 제공된다.

## 템플릿과 값
헬름 차트 템플릿은 [sprig 라이브러리](https://github.com/Masterminds/sprig)에서 50개 정도의 애드온 템플릿 함수와 몇가지 기타 [특수 함수](https://helm.sh/ko/docs/howto/charts_tips_and_tricks/)가 추가된 [Go template language](https://golang.org/pkg/text/template/)로 작성되었다.

모든 템플릿 파일은 차트의 `templates` 디렉터리 안에 저장된다.
Helm이 차트를 렌더링 할 때, 템플릿 엔진을 통해 이 디렉토리 안에 모든 파일을 전달한다.

템프릿에 대한 values는 2가지 방법으로 제공된다.
- 차트 개발자는 차트의 안에 `values.yaml` 이라 부르는 파일을 제공할 수 있다.
- 이 파일은 기본 값을 포함 할 수 있다.
- 차트 사용자는 값을 포함한 YAML 파일을 제공할 수 있다.
- `helm install` 커맨드 라인으로 제공 받을 수 있다.

사용자가 커스텀 값을 제공할 때, 차트의 `values.yaml` 파일에 있는 값을 덮어 쓴다.

#### 템플릿 파일
템플릿 파일 Go 템플릿 작성에 대한 표준 규약을 따른다.
 ( [텍스트/템플릿 Go 패키지 문서](https://golang.org/pkg/text/template/)). 예제 템플릿 파일은 다음과 같을 수 있다.
```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: deis-database
  namespace: deis
  labels:
    app.kubernetes.io/managed-by: deis
spec:
  replicas: 1
  selector:
    app.kubernetes.io/name: deis-database
  template:
    metadata:
      labels:
        app.kubernetes.io/name: deis-database
    spec:
      serviceAccount: deis-database
      containers:
        - name: deis-database
          image: {{ .Values.imageRegistry }}/postgres:{{ .Values.dockerTag }}
          imagePullPolicy: {{ .Values.pullPolicy }}
          ports:
            - containerPort: 5432
          env:
            - name: DATABASE_STORAGE
              value: {{ default "minio" .Values.storage }}
```

위의 예는 k8s 애플리케이션 컨트롤러에 대한 템플릿이다.
다음 4가지 템플릿 값을 사용할 수 있다. - 보통 `values.yaml`에 정의 된다.

- `imageRegistry` : Docker 이미지의 소스 레지스트리
- `dockerTag` : Docker Image Tag
- `pullPolciy` : k8s의 pull 정책
- `storage` : 기본 값이 `"minio"`로 설정되는 저장소 백엔드

이 모든 값은 템플릿 작성자에 의해 정의된다.
Helm은 파라미터를 요구하거나 지시하지 않는다.

많은 작동중인 차트를 보려면, [쿠버네티스 차트 프로젝트](https://github.com/helm/charts)를 참고하라.

#### 미리 정의된 값
`values.yaml` 파일( 혹은 `--set` 플래그)로 제공되는 값은 템플릿 안에서 `.Values` 객체로 접근 가능하다.
그러나 템플릿 안에서 접근 가능한 다른 미리 정의된 데이터 조각이 있다.

다음 값은 미리 정의되었고, 모든 템플릿에서 접근 가능하며, 덮어쓸수 없다.
모든 값과 마찬가지로, 이름은 대소문자를 구별한다.
- `Release.Name` : 릴리즈의 이름(차트의 이름이 아님)
- `Release.Namespace` : 차트가 릴리즈 된 네임스페이스
- `Release.Service` : 릴리즈를 수행하는 서비스
- `Release.isUpgrade` : 현재 업그레이드나 롤백 중이면 true로 설정된다.
- `Release.Isinstall`: 현재 설치중이면 true로 설정된다.
- `Chart`: `Chart.yaml`의 내용 차트의 버전은 `Chart.Version` 으로, 메인테이너는 `Chart.Maintainers`로 얻을 수 있다.
- `Files`: 
	- 차트에 모든 특별하지 않는 파일을 포함하는 맵과 같은 오브젝트이다.
	- 템플릿에 접근을 제공하지는 않지만, 
	- (`.helmignore` 로 배제되지 않았다면) 존재하는 추가 파일에 대한 액세스를 제공한다.
	- 파일은 `{{ index .Files "file.name" }}` 나 `{{ Files/Get name }}` 함수를 사용해서 접근 할 수 있다.
	- `Capabilities`
 : k8s 버전 (`{{ .Capabilities.KubeVersion }}`) 과 지원되는 k8s api 버전( `{{ .Capabilities.APIVersions.Has "batch/v1" }}`)에 대한 정보를 포함하는 맵과 같은 오브젝트


:::warning 
- 익명의 `Chart.yaml` 필드는 무시된다.
- 이 필드는 `Chart` 오브젝트의 안에서 접근이 불가능하다.
- 따라서 `Chart.yaml` 은 템플릿으로 구조화된 데이터를 제멋대로 전달하기 위해 사용될수 없다.

:::

## Values File
이전 섹션에서의 템플릿을 고려할 때, 필수적인 값을 제공하는 `values.yaml`은 다음과 같다.

```yaml
imageRegsitry: "quay.io/deis"
dockerTag: "lates",
pullPolicy: "Always"
storage: "s3"
```

values 파일은 YAML 포맷이다.
차트는 기본 `values.yaml` 파일을 포함한다.
Helm 설치 명령은 추가 YAML 값을 제공함으로써, 사용자가 값을 덮어 쓸수 있게 한다.

```shell
helm install --generated-name --values=myvalues.yaml wordpress
```

이 방법으로 값이 전달 될 때, Default values 파일로 이 값들은 병합된다.
예를 들어, `myvalues.yaml` 파일은 다음과 같다고 하자

```yaml
storage: "gcs"
```

차트의 `values.yaml` 로 병합될 때, 생성된 내용의 결과는 다음과 같다.

```yaml
imageRegistry: "quay.io/deis"
dockerTag: "latest"
pullPolicy: "Always"
storage: "gcs"
```

오직 마지막 필드가 덮여 쓰여짐을 주의하라

:::note 
- 차트의 안에 포함된 Default Value 파일은 `values.yaml` 의 이름을 가져야한다.
- 반면, command line에 명시하는 파일은 아무 이름이나 가질 수 있다.

:::

:::note 
- `--set` 플래그가 `helm install` 이나 `helm upgrade`에 사용된다면,
- 이 값들은 클라이언트에서 YAML로 간단하게 변환된다.

:::

:::note 
- `values` 파일에 필수적인 entry가 있다면, Chart 템플릿에서 [차트 템플릿](https://helm.sh/ko/docs/howto/charts_tips_and_tricks/)을 사용함으로써 필수로 정의될 수 있다.

:::

값 중 어떤 것이라도 템플릿의 안에서 `.Values` 오브젝트를 사용하여, 접근이 가능하다.

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: deis-database
  namespace: deis
  labels:
    app.kubernetes.io/managed-by: deis
spec:
  replicas: 1
  selector:
    app.kubernetes.io/name: deis-database
  template:
    metadata:
      labels:
        app.kubernetes.io/name: deis-database
    spec:
      serviceAccount: deis-database
      containers:
        - name: deis-database
          image: {{ .Values.imageRegistry }}/postgres:{{ .Values.dockerTag }}
          imagePullPolicy: {{ .Values.pullPolicy }}
          ports:
            - containerPort: 5432
          env:
            - name: DATABASE_STORAGE
              value: {{ default "minio" .Values.storage }}
```

### 범위, 의존성, 값

values 파일은 최상위 차트에 대한 값과 차트의 `charts/` 디렉터리에 포함된 차트 중 어떤 것이라도 정의할 수 있다.
또는, 다르게 표현하면, values 파일은 차트와 그것의 종속성 모두에게 값을 제공할 수 있다.
예를 들어 위의 데모 WordPress 차트는 `mysql`, ``





---

#Container

---












































