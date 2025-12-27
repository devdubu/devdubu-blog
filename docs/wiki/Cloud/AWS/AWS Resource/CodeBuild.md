CodeBuild에 대한 내용과 buildspec.yml 작성 법에 대한 문서 입니다.

# AWS CodeBuild

AWS CodeBuild는 클라우드 상의 **완전관리형** **빌드 서비스** 입니다.

CodeBuild는 **소스 코드를 컴파일**하고 **단위 테스트**를 실행하며 **배포 준비가 완료된 아티팩트**를 **생성**합니다.

CodeBuild에서는 **자체 빌드 서버**를 **프로비저닝**, **관리 및 확장할 필요**가 없습니다.

## CodeBuild 실행 방법

AWS Codebuild 또는 AWS CodePipeline 콘솔을 사용하여 CodeBuild를 실행합니다.

AWS Command Line Interface(AWS CLI) 또는AWS SDK를 사용하여, CodeBuild 실행을 자동화할 수 있다.

![Pasted-image-20250410092804.png](/img/이미지 창고/Pasted-image-20250410092804.png)

아래의 다이어그램처럼 CodeBuild를 파이프라인 빌드 또는 테스트 목적으로의 파이프라인 빌드 도는 테스트 단계에 추가할 수 있습니다.

![Pasted-image-20250410092816.png](/img/이미지 창고/Pasted-image-20250410092816.png)

## CodeBuild 개념

![Pasted-image-20250410092823.png](/img/이미지 창고/Pasted-image-20250410092823.png)

위의 그림은 CodeBuild를 사용하여 빌드를 실행할 때 나타나는 현상을 보여 줍니다.

1. 입력으로 CodeBuild 프로젝트와 함께 Source를 제공해야 합니다.
    
    1. 이 빌드 프로젝트에는 **소스 코드를 가져올 위치**, **사용할 빌드 환경**, **실행할 빌드 명령 및 빌드 출력**을 **저장할 위치**를 비롯하여 **빌드 실행 방법**에 대한 **정보가 포함**되어 있습니다.
        
2. CodeBuild가 빌드 프로젝트를 사용하여 빌드 환경을 생성합니다.
    
3. **CodeBuild가 빌드 환경**에 소스 코드를 다운로드한 다음, 빌드 프로젝트에 정의되거나 소스 코드에 직접 포함된 **빌드 사양 (buildspec)** 을 사용합니다.
    
    1. BuildSpec는 **CodeBuild가 빌드**를 실행하는 데 **사용하는 YAML 형식의 빌드 명령 및 관련 설정**의 모음입니다.
        
4. **빌드 출력**이 있으면 **빌드 환경에서 출력을 S3 버킷**에 업로드합니다.
    
    1. 빌드 환경에서 사용자가 **buildspec에 지정한 작업**을 **수행**할 수도 있습니다 (예: Amazon SNS 주제에 빌드 알림 전송).
        
5. 빌드가 실행되는 동안 **빌드 환경이 정보**를 CodeBuild와 **Amazon CloudWatch 로그**에 **전송**합니다.
    
6. 빌드가 실행되는 동안 AWS CodeBuild 콘솔, AWS CLI 또는 AWS SDK가 CodeBuild에서 **요약된 빌드 정보**를 가져오고 **Amazon CloudWatch Logs 로그에**서 **자세한 빌드 정보**를 가져올 수 있습니다.
    
    1. 사용하는 도구AWS CodePipeline빌드를 실행하기 위해 CodePipeline에서 제한된 빌드 정보를 가져올 수 있습니다.
        

## 사용 방법

### buildspec 파일 생성

`buildspec` 은 CodeBuild가 빌드를 실행하는 데 사용하는 **YAML 형식**의 **빌드 명령 및 관련 설정**의 **모음**입니다.

`buildspec` 이 없으면 빌드 입력을 빌드 출력으로 성공적으로 변환하거나 빌드 환경에서 빌드 출력 아티팩트를 찾아 출력 버킷에 업로드할 수 없습니다.

다음 파일을 생성하고 이름을 `buildspec.yml`로 지정한 다음 이를 루트(최상위) 디렉터리에 저장합니다.

아래의 코드는 예시 코드 입니다.

```yaml
version: 0.2
phases: 
  install: 
    runtime-versions: 
      java: corretto11 
    pre_build: 
      commands:
        - echo Nothing to do in the pre_build phase... 
    build: 
      commands: 
        - echo Build started on `date` 
        - mvn install 
    post_build: 
      commands: 
        - echo Build completed on `date`
artifacts: 
  files: 
    - target/messageUtil-1.0.jar
```

#### version

- 사용 중인 빌드 사양 표준의 버전을 나타냅니다.
- 해당 빌드 사양은 최신 버전인 0.2 버전을 사용하고 있고, 0.2 버전을 권장하고 있습니다.

#### phases

- CodeBuild가 명령을 실행하도록 지시할 수 있는 **빌드 단계**를 나타냅니다.
- 여기에서는 이 빌드 단계가 **install**, **pre_build**, **build** 및 **post_build**로 나열되어 있습니다.
- 이 빌드 단계 이름의 철자는 변경할 수 없으며 **추가로 빌드 단계 이름을 생성할 수도 없**습니다.
    

#### artifacts

- CodeBuild 업로드되는 빌드 출력 아티팩트 세트를 나타냅니다.
- files는 빌드 출력에 포함할 파일을 나타냅니다.
- CodeBuild빌드 환경의 target 관련 디렉터리에 있는 단일messageUtil-1.0.jar 파일을 업로드합니다.
- 사용자 자체 빌드에서는 이러한 파일 이름과 디렉터리가 다릅니다.


![Pasted-image-20250410092844.png](/img/이미지 창고/Pasted-image-20250410092844.png)

위의 구조처럼 `buildspec.yml` 파일은 최상단에 위치 해야 합니다.

- 동일한 리포지토리의 다른 빌드에 대해 `buildspec_debug.yml` 및 `buildspec_release.yml`과 같은 다른 buildspec 파일을 사용합니다.
- `buildspec` 파일을 `config/buildspec.yml`과 같은 소스 디렉터리의 루트가 아닌 다른 위치 또는 S3 버킷에 저장합니다.
- S3 버킷은 빌드 프로젝트와 **동일한 AWS 리전**에 있어야 합니다.
- ARN을 사용하여 `buildspec` 파일을 지정합니다
	- (예: `arn:aws:s3:::my-codebuild-sample2/buildspec.yml`).

# buildspec 구문

`buildspec` 파일은 YAML 형식으로 표기해야 합니다.

```yaml
version: 0.2

run-as: Linux-user-name
env : 
  shell : shell-tag 
  variables : 
    key: "value" 
    key: "value" 
  parameter-store : 
    key: "value" 
    key: "value" 
  exported-variables : 
    - variable 
    - variable 
  secrets-manager : 
    key: secret-id:json-key:version-stage:version-id 
  git-credential-helper : no | yes
proxy :  
  upload-artifacts : no | yes 
  logs : no | yes
batch : 
  fast-fail: false | true 
  # build-list : 
  # build-matrix : 
  # build-graph : 
phases : 
  install : 
    run-as : Linux-user-name 
    on-failure : ABORT | CONTINUE 
    runtime-versions : 
      runtime: version 
      runtime: version 
    commands:
      - command
      - command 
    finally : 
      - command 
      - command 
    # steps : 
  pre_build : 
    run-as : Linux-user-name 
    on-failure : ABORT | CONTINUE 
    commands : 
      - command 
      - command 
    finally : 
      - command 
      - command 
      # steps : 
  build : 
    run-as : Linux-user-name 
    on-failure : ABORT | CONTINUE 
    commands : 
      - command 
      - command 
    finally : 
      - command 
      - command 
      # steps : 
  post_build : 
    run-as : Linux-user-name 
    on-failure : ABORT | CONTINUE 
    commands : 
      - command 
      - command 
    finally : 
      - command 
      - command 
      # steps :
reports : 
  report-group-name-or-arn: 
    files : 
      - location 
      - location 
    base-directory : location 
    discard-paths : no | yes 
    file-format : report-format
artifacts : 
  files : 
    - location 
    - location 
  name : artifact-name 
  discard-paths : no | yes 
  base-directory : location 
  exclude-paths : excluded paths 
  enable-symlinks : no | yes 
  s3-prefix : prefix 
  secondary-artifacts : 
    artifactIdentifier: 
      files : 
        - location 
        - location 
      name : secondary-artifact-name 
      discard-paths : no | yes 
      base-directory : location 
    artifactIdentifier: 
      files : 
        - location 
        - location
        discard-paths : no | yes 
        base-directory : location
cache : 
  paths : 
    - path 
    - path
```

### version

- **필수 문법**
- `buildspec` 버전을 나타냅니다.

### run-as

- 해당 문법은 옵션 문법입니다.
- 서버 OS가 Linux 라면 사용할 수 있습니다.
- 이 buildspec 파일에서 명령을 실행하는 **Linux 사용자**를 지정합니다.
- **run-as 지정된 사용자**에게 **읽기 및 실행 권한을 부여**합니다.
    - buildspec 파일 처음에 run-as를 지정할 경우 모든 명령에 전역적으로 적용됩니다.
- 모든 buildspec 파일 명령에 대한 사용자를 지정하지 않으려는 경우
    - **phases 블록** 중 하나에 **run-as를 사용**하여 단계에 명령에 대한 사용자를 지정할 수 있습니다.
- run-as를 **지정하지 않으면** 모든 명령이 **루트 사용자로 실행**됩니다
    

### env

- 해당 문법은 옵션 문법입니다.
- 하나 이상의 사용자 지정 환경 변수에 대한 정보를 나타냅니다.

#### env/shell

- 해당 문법은 옵션 문법입니다.
- Linux 또는 Windows 운영 체제에 지원되는 셸을 지정합니다.
- Linux 운영 체제의 경우 지원되는 셸 태그는 다음과 같습니다.
    - bash
    - /bin/sh
- Windows 운영 체제의 경우 지원되는 셸 태그는 다음과 같습니다.
    - powershell.exe
    - cmd.exe

#### env/variables

- env가 지정된 경우 및 사용자 지정 환경 변수를 일반 텍스트로 정의하려고 할 때 필요합니다.
- `key/value` 스칼라 매핑을 포함하며, 각 매핑은 일반 텍스트의 단일 사용자 지정 환경 변수를 나타냅니다.
- key는 사용자 지정 환경 변수의 이름이고, value는 이 변수의 값입니다.
    

:::warning **민감 데이터**는 **저장하지 않는 것이 좋습니다**.
- 중요한 값의 경우 `parameter-store` 또는 `secrets-manager` 매핑을 사용하는 것이 좋습니다.
- 사용자가 설정한 환경 변수는 기존 환경 변수를 대체합니다.
- 해당 env/variables 가 우선 순위가 높습니다.



:::

#### env/parameter-store

- 해당 문법은 옵션 문법입니다.
- env가 지정되고 Amazon **EC2** Systems Manager **파라미터 스토어**에 저장된 **사용자 지정 환경 변수**를 검색하려는 경우 필수입니다.
    

> EC2 ParmeterStore?
> [EC2 ParmeterStore](https://docs.aws.amazon.com/ko_kr/systems-manager/latest/userguide/systems-manager-parameter-store.html)


- `#/#` 스칼라의 매핑을 포함합니다.
- 여기서 각 매핑은 **Amazon EC2 Systems Manager 파라미터 스토어**에 저장된 **단일 사용자 지정 환경 변수**를 나타냅니다.
    - key# 나중에 빌드 명령에서 이 사용자 지정 환경 변수를 참조하기 위해 사용하는 이름이고,
    - value# Amazon EC2 Systems Manager 파라미터 스토어에 저장된 사용자 지정 환경 변수의 이름입니다.

#### env/secrets-manager

- 해당 문법은 옵션 문법입니다.
- **AWS Secrets Manager**에 **저장된 사용자 지정 환경 변수**를 검색하려는 경우 필요합니다.
- 다음 패턴을 reference-key 사용하여 시크릿 매니저를 지정하십시오.

``` json
<key>: <secret-id>:<json-key>:<version-stage>:<version-id>
```

##### `<key>`
- (필수) 로컬 환경 변수 이름. 이 이름을 사용하면 빌드 중에 변수에 액세스할 수 있습니다
    

##### `<secret-id>`

- (필수) **암호의 고유 식별자**로 사용되는 이름 또는 Amazon 리소스 이름 (**ARN**).
    - AWS 계정에 있는 암호에 액세스하려면 암호 이름을 지정합니다.
    - 다른 AWS 계정의 암호에 액세스하려면 암호 ARN을 지정합니다.

##### `<json-key>`

- (선택 문법) 값을 검색하려는 **Secrets Manager 키-값 쌍**의 **키 이름을 지정**합니다.
    - json-key를 지정하지 않는 경우 CodeBuild에서 **전체 보안 암호 텍스트**를 **검색**합니다.

##### `<version-stage>`

- (선택 문법) 버전에 첨부된 스테이징 레이블로 검색하려는 비밀 버전을 지정합니다.
    - 스테이징 레이블은 교체 프로세스 도중 다른 버전을 추적하는 데 사용됩니다.
    - **version-stage**를 사용하는 경우 **version-id를 지정하지 마**십시오.
    - 버전 스테이지 또는 버전 ID를 지정하지 않으면 기본값은 AWSCURRENT의 버전 스테이지 값으로 버전을 검색하는 것입니다.

##### `<version-id>`

- (선택 문법) 사용하려는 **암호 버전의 고유 식별자를 지정**합니다.
    
    - version-id을 지정할 경우 version-stage을 지정하지 마십시오.
        
    - 버전 스테이지 또는 버전 ID를 지정하지 않으면 기본값은 **AWSCURRENT의 버전 스테이지 값**으로 **버전을 검색**하는 것입니다.
        

#### env/exported-variables

- 해당 문법은 옵션 문법입니다.
    
- 내보낼 **환경 변수**를 **나열**하는 데 사용됩니다.
    
- **exported-variables**에서 **별도의 행에 내보낼 각 변수의 이름**을 **지정**합니다.
    
    - **exported-variables**는 빌드 중에 컨테이너에서 사용할 수 있어야 합니다.
        
    - **exported-variables**는 환경 변수일 수 있습니다.
        
- **exported-variables**는 현재 빌드 단계에서 파이프라인의 후속 단계로 환경 변수를 내보내는 **AWS CodePipeline 데 사용**됩니다.
    
- 빌드 하는 동안 변수의 값은 **install 단계**부터 **사용**할 수 있습니다.
    
- 이 값은 **install 단계 시작**과 **post_build 단계 끝** 사이에서 **업데이트**할 수 있습니다.
    
    - **post_build 단계**가 **끝**나면 **내보낸 변수의 값**을 **변경**할 수 없습니다
        

#### env/git-credential-helper

- 해당 문법은 옵션 문법입니다.
    
- CodeBuild가 Git 자격 증명 헬퍼를 사용하여 Git 자격 증명을 제공 하는지를 나타내는 데 사용됩니다.
    
- Git 자격 증명 헬퍼가 사용되는 경우 yes이고, 그렇지 않은 경우 no이거나 값이 지정되지 않은 것입니다.
    

**퍼블릭 Git 리포지토리**에 대해 webhook에서 트리거한 빌드의 경우에는 **git-credential-helper가 지원되지 않습**니다.

### Proxy

- 해당 문법은 옵션 문법입니다.
    
- 명시적 프록시 서버에서 **빌드를 실행할 경우** 설정을 나타내는 데 사용됩니다
    

#### proxy/upload-artifacts

- 해당 문법은 옵션 문법입니다.
    
- 명시적 프록시 서버에서 **빌드된 아티팩트**를 **업로드** 하도록 하려면 yes로 설정합니다.
    
    - **기본 값**은 **no**입니다.
        

#### proxy/logs

- 해당 문법은 옵션 문법입니다.
    
- 명시적 프록시 서버에서 빌드에 대해 yes로 설정하여 **CloudWatch 로그**를 **작성**합니다.
    
    - **기본 값**은 **no**입니다.
        

### phases

- **필수 문법**
    
- 빌드의 각 단계 동안 CodeBuild가 실행하는 명령을 나타냅니다.
    

#### phases/run-as

- 해당 문법은 옵션 문법입니다.
    
- 해당 명령을 실행하는 **Linux 사용자**를 **지정**하려면 빌드 단계에 사용합니다.
    
- buildspec 전역적으로 run-as도 지정해도, **step 사용자**가 **우선 적용**됩니다.
    
    - 예를 들어 **전역적**으로 **User-1**을 run-as 지정하고
        
    - **install 단계**에 대해 run-as 명령문만 **User-2**를 지정하는 경우
        
    - User-2로 실행되는 **install 단계**의 명령을 **제외**하고 buildspec 파일의 모든 명령이 **User-1로 실행**됩니다.
        

#### phases/on-failure

- 해당 문법은 옵션 문법입니다.
    
- 단계에서 장애가 발생할 경우 취할 조치를 지정합니다.
    
- 다음 값 중 하나일 수 있습니다
    
    - **ABORT**- **빌드**를 **중단**합니다.
        
    - **CONTINUE**- **다음 단계**로 넘어가세요.
        

#### phases/finally

- 해당 문법은 옵션 문법입니다.
    
- finally블록에 지정된 명령은 `commands` 블록의 **명령 이후**에 **실행**됩니다.
    
- 블록의 명령이 **실패**하더라도 **finally commands 블록**의 **명령**이 **실행**됩니다.
    
    - 예를 들어 명령 3개가 포함된 commands 블록에서 첫 번째 명령이 실패할 경우,
        
        - CodeBuild는 나머지 **두 명령**을 **건너뛰고 finally 블록의 명령**을 **실행**합니다.
            
        - commands 및 finally 블록의 **모든 명령이 성공적**으로 실행되면 **단계가 성공**합니다.
            
        - 어느 단계의 명령이 **하나라도 실패**하면 **그 단계는 실패**합니다.
            

현재 사용할 수 있는 빌드 단계 이름은 아래와 같습니다.

#### phase/install

- 해당 문법은 옵션 문법입니다.
    
- 설치 중에 **CodeBuild**가 **실행하는 명령**을 나타냅니다(있는 경우).
    
- 빌드 환경에서 **패키지를 설치하는 경우에만** **install 단계**를 사용하는 것이 좋습니다.
    
    - 예를 들어, Mocha나 RSpec 같은 코드 테스팅 프레임워크를 설치하기 위해 이 단계를 사용할 수 있습니다
        

##### phases/install/runtime-versions

- 해당 문법은 옵션 문법입니다.
- 런타임 버전은 우분투 표준 이미지 5.0 이상 및 Amazon Linux 2 표준 이미지 4.0 이상에서 지원됩니다.
    - 지정된 경우 적어도 하나의 실행 시간이 이 섹션에 포함되어야 합니다.
    - 특정 버전, **메이저 버전 뒤**에 해당 CodeBuild 메이저 버전을 최신 **마이너 버전과 함께 사용**하도록 지정하거나
    - latest 최신 메이저 및 마이너 버전 (예: ruby: 3.2nodejs: 18.x, 또는java: latest) 을 사용하여 런타임을 지정합니다.
- `.x` 숫자나 환경 변수를 사용하여 실행 시간을 지정할 수 있습니다.
    
    - 예를 들어 Amazon Linux 2 표준 이미지 4.0을 사용하는 경우 다음은 Java 버전 17, Python 버전 3의 최신 마이너 버전 및 Ruby의 환경 변수에 포함된 버전을 설치하도록 지정합니다


`phases: install: runtime-versions: java: corretto8 python: 3.x ruby: "$MY_RUBY_VAR"`

- 빌드 사양 파일의 runtime-versions 섹션에서 **하나 이상**의 **런타임**을 **지정**할 수 있습니다.
- 런타임이 **다른 런타임에 종속**되는 경우 빌드 사양 파일에서 **종속 런타임을 지정**할 수도 있습니다.
- 빌드 사양 파일에 **런타임을 지정하지 않은 경우** CodeBuild에서는 **사용하는 이미지**에서 **사용할 수 있는 기본 런타임**을 **선택**합니다.
- **하나 이상의 런타임을 지정**하는 경우 **CodeBuild에서는 해당 런타임만** **사용**합니다.
- 종속 런타임을 지정하지 않은 경우, 지정된 두개의 런타임이 실패합니다..
    - 예를 들어 android: 29와 java: openjdk11이 충돌하므로 둘 다 지정하면 빌드가 실패합니다.
        

##### phases/install/commands

- 해당 문법은 옵션 문법입니다.
- 스칼라 시퀀스를 포함합니다.
    - 여기서 각 **스칼라**는 설치 중에 CodeBuild 실행되는 **단일 명령**을 나타냅니다.
- **CodeBuild**각 명령을 **나열된 순서대로** 처음부터 끝까지 **한 번에 하나 씩 실행**합니다.
    

#### phases/pre_build

- 해당 문법은 옵션 문법입니다.
- 빌드 전에 CodeBuild가 실행하는 명령을 나타냅니다(있는 경우).
    - 예를 들어 이 단계를 사용하여 **Amazon ECR**에 로그인하거나 **npm 종속성을 설치**할 수 있습니다.
        

##### phases/pre_build/commands

- pre_build를 지정한 경우 **필수** 입니다.
- 스칼라 시퀀스를 포함합니다.
    - CodeBuild각 명령을 나열된 순서대로 처음부터 끝까지 한 번에 하나 씩 실행합니다.
        

#### phases/build

- 해당 문법은 옵션 문법입니다.
- **빌드 중**에 CodeBuild가 **실행하는 명령**을 나타냅니다(있는 경우).
    - 예를 들어, Mocha, RSpec 또는 sbt를 실행하기 위해 이 단계를 사용할 수 있습니다.
        

##### phases/build/commands

- build를 지정한 경우 **필수** 입니다.
- 스칼라 시퀀스를 포함합니다.
    - CodeBuild각 명령을 나열된 순서대로 처음부터 끝까지 한 번에 하나 씩 실행합니다.
        

#### phases/post_build

- 해당 문법은 옵션 문법입니다.
- **빌드 후**에 CodeBuild가 **실행하는 명령**을 나타냅니다(있는 경우).
    - 예를 들어 Maven을 사용하여 빌드 아티팩트를 JAR 또는 WAR 파일로 패키징하거나 **Docker 이미지**를 **Amazon ECR로 푸시**할 수 있습니다.
    - 그런 다음 **Amazon SNS**를 통해 **빌드 알림**을 보낼 수 있습니다.
        

##### phases/post_build/commands

- post_build를 지정한 경우 **필수** 입니다.
- 스칼라 시퀀스를 포함합니다.
    - CodeBuild각 명령을 나열된 순서대로 처음부터 끝까지 한 번에 하나 씩 실행합니다.
        

### reports

#### report-group-name-or-arn

- 해당 문법은 옵션 문법입니다.
- 보고서를 **전송할 보고서 그룹**을 **지정**합니다.
- 프로젝트에는 **최대 5개의 보고서 그룹**이 포함될 수 있습니다.
- 기존 보고서 그룹의 **ARN** 또는 **새 보고서 그룹의 이름**을 **지정**합니다.
    - 이름을 지정하는 경우 **CodeBuild**는 **프로젝트 이름**과 `<project-name>-<report-group-name>` 형식으로 지정한 이름을 사용하여 보고서 그룹을 생성합니다.
        

#### `reports/<report-group>/files`

- **필수 문법** 입니다.
- 보고서에 의해 생성된 테스트 결과의 원시 데이터가 포함된 위치를 나타냅니다.
- 스칼라 시퀀스를 포함하며, 각 스칼라는 CodeBuild가 원래 빌드 위치와 관련하여 테스트 파일을 찾을 수 있는 별도의 위치 또는 설정된 경우 **base-directory**을 나타냅니다.
- 위치에는 다음이 포함될 수 있습니다
    - 단일 파일(예: my-test-report-file.json)
    - 하위 디렉터리의 단일 파일입니다
        - (예: my-subdirectory/my-test-report-file.json 또는my-parent-subdirectory/my-subdirectory/my-test-report-file.json).    
    - '**/*'는 모든 파일을 재귀적으로 나타냅니다.**
    - **my-subdirectory/*는 my-subdirectory라는 하위 디렉터리에 있는 모든 파일을 나타냅니다.**
    - **my-subdirectory/**/*는 my-subdirectory라는 하위 디렉터리에서 시작하는 모든 파일을 재귀적으로 나타냅니다.

#####` report/<report-group>/file-format`

- 해당 문법은 옵션 문법입니다.
    
- 보고서 파일 형식을 나타냅니다.
    - 지정하지 않으면 `JUNITXML`가 사용됩니다.
    - 이 값은 대소문자를 구분하지 않습니다.
    - 가능한 값은 다음과 같습니다.
    - Test Report
        - `CUCUMBERJSON` : Cucumber JSON
        - `JUNITXML` : JUnit XML
        - `NUNITXML` : NUnit XML
        - `NUNIT3XML` : NUnit3 XML
        - `TESTNGXML` : TestNG XML
        - `VISUALSTUDIOTRX` : Visual Studio TRX
    - Code Coverage Report
        - `CLOVERXML` : Clover XML
        - `COBERTURAXML` : Cobertura XML
        - `JACOCOXML` : JaCoCoXML
        - `SIMPLECOV` : SimpleCovJSON

##### `reports/<report-group>/base-directory`

- 해당 문법은 옵션 문법입니다.
- 원시 테스트 파일을 찾을 위치를 결정할 때,
- CodeBuild가 사용하는 원래 빌드 위치를 기준으로 하나 이상의 최상위 디렉터리를 나타냅니다.

##### `reports/<report-group>/discard-paths`

- 해당 문법은 옵션 문법입니다.
- 보고서 파일 디렉터리가 출력에서 평면화되는지 여부를 지정합니다.
- 이 값이 지정되지 않거나 no를 포함하는 경우 보고서 파일은 디렉터리 구조가 손상되지 않은 상태로 출력됩니다.
- yes가 포함된 경우 모든 테스트 파일이 동일한 출력 디렉터리에 배치됩니다.
    - 예를 들어, 테스트 결과에 대한 경로가 `com/myapp/mytests/TestResult.xml` 인 경우,
    - yes 를 지정하면 이 파일이 `/TestResult.xml`에 배치됩니다.

### artifacts

- 해당 문법은 옵션 문법입니다.
    
- CodeBuild가 빌드 결과를 찾을 수 있는 위치 및 CodeBuild가 S3 출력 버킷에 업로드하기 위해 빌드 출력을 준비하는 방식에 대한 정보를 나타냅니다.
    - 예를 들어 Docker 이미지를 빌드하여 **Amazon ECR로** 푸시하거나 소스 코드에서 단위 테스트를 실행하지만 빌드하지는 않는 경우에는 이 시퀀스가 필요하지 않습니다.
        

#### artifacts/files

- **필수 문법** 입니다.
- 빌드 환경의 빌드 출력 결과물을 포함하는 위치를 나타냅니다.
- 스칼라 시퀀스를 포함하며, 각 스칼라는 CodeBuild가 빌드 출력 결과물을 찾을 수 있는 개별 위치를 원래 빌드 위치 또는 기본 디렉터리(설정한 경우)를 기준으로 나타냅니다.
- 위치에는 다음이 포함될 수 있습니다.
- 단일 파일(예: my-file.jar).
- 하위 디렉터리의 단일 파일입니다
	- (예: my-subdirectory/my-file.jar 또는 my-parent-subdirectory/my-subdirectory/my-file.jar).
    
- '**/*'는 모든 파일을 재귀적으로 나타냅니다.**
- **my-subdirectory/*는 my-subdirectory라는 하위 디렉터리에 있는 모든 파일을 나타냅니다.**
- **my-subdirectory/**/*는 my-subdirectory라는 하위 디렉터리에서 시작하는 모든 파일을 재귀적으로 나타냅니다.
    

빌드 출력 결과물 위치를 지정하면 CodeBuild가 빌드 환경의 원래 빌드 위치를 찾을 수 있습니다.
빌드 결과물 출력 위치 앞에 원래 빌드 위치 경로를 추가하거나 `./` 같은 것을 지정하지 않아도 됩니다.
이 위 치에 대한 경로를 알고 싶으면 빌드 중에 `echo $CODEBUILD_SRC_DIR`과 같은 명령을 실행하면 됩니다.
각 빌드 환경의 위치는 약간씩 다를 수 있습니다.

#### artifacts/name

- 해당 문법은 옵션 문법입니다.
- 빌드 결과물의 이름을 지정합니다. 이 이름은 다음 중 하나에 해당될 때 사용됩니다.
    - CodeBuild API를 사용하여 빌드를 생성하면 프로젝트가 업데이트되거나 생성되거나 빌드가 시작될 때 `ProjectArtifacts` 객체에 `overrideArtifactName` 플래그가 설정됩니다.
    - CodeBuild 콘솔을 사용하여 빌드를 생성하면 `buildspec` 파일에 이름이 지정되고, 프로젝트를 만들거나 업데이트할 때 의미 체계 버전 관리 사용을 선택합니다.
        

다음 예시는 아티팩트가 생성된 날짜를 추가한 아티팩트 이름의 예입니다.
```yaml
version: 0.2
phases:
  build:
    commands:
      - rspec HelloWorld_spec.rb
aritifacts:
  files:
    - '**/*'
  name: myname-$(date +%Y-%m-%d)  
```

- 아래는 환경 변수를 사용하는 `buildspec` 을 의미 합니다.
```yaml
version: 0.2
phases:
  build:
    commands:
      - rspec HelloWorld_spec.rb
artifacts:
  files:
    - "**/*"
  name: myname-%AWS_REGION
```


- 아래의 코드는 `CodeBuild` 환경 변수를 사용하여 결과물 생성 날짜가 추가된 결과물 이름의 예입니다.  
```yaml
version: 0.2
phases:
  build:
    commands:
      - rspec HelloWorld_spec.rb
artifacts:
  files:
    - '**/*'
  name: $AWS_REGION-$(date + %Y-%m-%d)
```


이름에 경로 정보를 추가하여 이름이 지정된 아티팩트가 이름의 경로를 기준으로 디렉터리에 배치 되도록 할 수 있습니다.

이 예제에서는 빌드 아티팩트가 아래의 `builds/<build number>/my- artifacts` 출력에 배치됩니다.
```yaml
version: 0.2
phases:
  build:
    commands:
      - rspec HelloWorld_spec.rb
artifacts:
  files:
    - '**/*'
  name: builds/$CODEBUILD_BUILD_NUMBER/my-artifacts
```
`

#### artifacts/discard-paths

- 해당 문법은 옵션 문법입니다.
- **디렉토리**를 **유지**하는지 아니면 유지하지 않는지에 대한 여부
- 이 값이 지정되지 않거나 no를 포함하는 경우 **빌드 아티팩트는 디렉터리 구조가 손상되지 않은 상태로 출력**됩니다.
- yes가 포함된 경우 모든 빌드 아티팩트가 동일한 출력 디렉터리에 배치됩니다.
    - 예를 들어, 빌드 출력 아티팩 트의 파일 경로가 `com/mycompany/app/HelloWorld.java`인 경우 yes를 지정하면 이 파일이 `/ HelloWorld.java`에 배치됩니다.

#### artifacts/base-directory

- 해당 문법은 옵션 문법입니다.
- CodeBuild가 빌드 출력 결과물에 포함할 **파일** 및 **하위 디렉터리**를 **결정**하는 데 사용하는 원래 빌드 위치에 상대적인 하나 이상의 최상위 디렉터리를 나타냅니다.
- 유효한 값으로는 다음이 포함됩 니다.
    - 단일 최상위 디렉터리입니다(예: my-directory).
    - 'my-directory*'는 이름이 my-directory로 시작하는 모든 최상위 디렉터리를 나타냅니다.
- 빌드 출력 결과물에는 이 최상위 디렉터리가 포함되지 않으며, 파일 및 하위 디렉터리만 포함됩니다.
- 포함할 파일 및 하위 디렉터리를 보다 더 제한하려면 files 및 discard-paths를 사용하면 됩니다.
- 아래의 예시에서 다음 디렉토리 구조에서
```yaml
.
### my-build-1
#   ### my-file-1.txt
### my-build-2
    ### my-file-2.txt
    ### my-subdirectory
        ### my-file-3.txt
```

다음 artifacts 시퀀스에 대해:
```yaml
artifacts:
  files:
    - '*/my-file-3.txt'
  base-directory: my-build-2
```

다음 하위 디렉터리 및 파일이 빌드 출력 결과물에 포함됩니다.
```yaml
.
### my-subdirectory
    ### my-file-3.txt
```


다음 artifacts 시퀀스 동안

```yaml
artifacts:
  files:
    - '**/*'
  base-directory: 'my-build*'
  discard-paths: yes
```

다음 파일이 빌드 출력 결과물에 포함됩니다.
```shell
.
### my-file-1.txt
### my-file-2.txt
### my-file-3.txt
```

#### artifacts/discard-path

- 해당 문법은 옵션 문법입니다.
- 빌드 아티팩트에서 CodeBuild 제외할 하나 이상의 경로를 나타냅니다.
- `base-directory` 별표(*) 문자는 폴더의 경계를 넘지 않고 0개 이상의 이름 구성 요소 문자와 해당합니다.
- 이 중 별표 (**) 는 모든 디렉터리에서 이름 구성 요소의 0개 이상의 문자를 일치 시킵니다.
    

제외 경로의 예는 다음과 같습니다.
- 모든 디렉터리에서 파일을 제외하려면: `"**/file-name/**/*"`
- 모든 도트 폴더를 제외하려면: `"**/.*/**/*"`
- 모든 도트 파일을 제외하려면: `"**/.*"`

#### artifacts/enable-symlinks

- 해당 문법은 옵션 문법입니다.
- 출력 유형이 `ZIP` 인 경우 내부 심볼 링크를 `ZIP` 파일에 보존할지 여부를 지정합니다.
- 여기에 포함된 yes 경우 소스의 모든 내부 심볼 링크가 아티팩트 `ZIP` 파일에 보존됩니다.

#### artifacts/s3-prefix

- 해당 문법은 옵션 문법입니다.
- 아티팩트가 Amazon S3 버킷으로 출력될 때 사용되는 접두사를 지정하고 네임스페이스 유형 은 입니다.
- `BUILD_ID` 사용 시 버킷의 출력 경로는 입니다 `<s3-prefix>/<build-id>/<name>.zip.`

#### artifacts/secondary-artifacts

- 해당 문법은 옵션 문법입니다
- 1개 이상의 아티팩트 정의를 아티팩트 식별자와 아티팩트 정의를 연결하는 매핑으로 나 타냅니다.
- 이 블록에서는 각 아티팩트가 프로젝트의 `secondaryArtifacts` 속성에서 정의하는 아티팩트와 일치해야 합니다.
- 각 정의는 위의 artifacts 블록과 동일한 구문을 갖습니다.
    

프로젝트 구조가 다음과 같다면,

```json
{
  "name": "sample-project",
  "secondaryArtifacts": [
    {
      "type": "S3",
      "location": "output-bucket1",
      "artifactIdentifier": "artifact1",
      "name": "secondary-artifact-name-1"
    },
    {           
      "type": "S3",
      "location": "output-bucket2",
      "artifactIdentifier": "artifact2",
      "name": "secondary-artifact-name-2"
    }
  ]
}
      
```

`buildspec`파일은 다음과 비슷합니다.
```yaml
version: 0.2

phases:
build:
  commands:
    - echo Building...
artifacts:
  files:
    - '**/*'
  secondary-artifacts:
    artifact1:
      files:
        - directory/file1
      name: secondary-artifact-name-1
    artifact2:
      files:
        - directory/file2
      name: secondary-artifact-name-2
```
### cache

- 해당 문법은 옵션 문법입니다.
    
- CodeBuild가 S3 캐시 버킷에 캐시를 업로드하기 위해 준비할 수 있는 파일에 대한 정보를 나 타냅니다.
    
- 프로젝트의 캐시 유형이 **No Cache**인 경우 **이 시퀀스는 필수가 아닙**니다.
    

#### cache/paths

- 해당 문법은 옵션 문법입니다.
- cache의 위치를 나타냅니다.
- 스칼라 시퀀스를 포함하며, 각 스칼라는 CodeBuild가 빌드 출력 결과물을 찾을 수 있는 개별 위치를 원래 빌드 위치 또는 기본 디렉터리(설정한 경우)를 기준으로 나타냅니다.
- 위치에는 다음이 포함될 수 있습니다.
    - 단일 파일(예: `my-file.jar`).
    - 하위 디렉터리의 단일 파일입니다(예: `my-subdirectory/my-file.jar` 또는 `my-parent-subdirectory/my-subdirectory/my-file.jar`).
    - `'**/*'`는 모든 파일을 재귀적으로 나타냅니다.
    - `my-subdirectory/*`는 `my-subdirectory`라는 하위 디렉터리에 있는 모든 파일을 나타냅니다.
    - `my-subdirectory/**/*`는 `my-subdirectory`라는 하위 디렉터리에서 시작하는 모든 파일을 재귀적으로 나타냅니다.
        
:::warning buildspec 선언은 올바른 YAML이어야 하므로 buildspec 선언의 **공백 설정**이 **중요**합니다.
- buildspec 선언의 공백 수가 잘못되면 빌드가 즉시 실패할 수 있습니다.
- YAML 유효성 검사기를 사용하여 `buildspec` 선언이 올바른 YAML인지 여부를 테스트할 수 있습니다.
- 빌드 프로젝트를 생성하거나 업데이트할 때 **AWS CLI** 또는 **AWS SDK**를 사용하여 buildspec을 선언하는 경우, 
	- `buildspec`은 **필수 공백** 및 **줄바꿈 이스케이프 문자**를 **포함**하여 **YAML 형식**으로 **표현된 단일 문자열**이어야 합니다.
- `buildspec.yml` 파일 대신 CodeBuild 또는 AWS CodePipeline 콘솔을 사용하는 경우 build 단계의 명령만 삽입할 수 있습니다.
- 앞에 나온 구문을 사용하는 대신, 빌드 단계 중에 실행 하려는 모든 명령을 하나의 행에 나열합니다.
- **명령**이 **여러 개**인 경우 각 명령을 **&&**로 구분합니다(예: mvn test && mvn package).  
:::

`buildspec.yml` 파일 대신 CodeBuild 또는 CodePipeline 콘솔을 사용하여 빌드 환경의 빌드 출력 결과물 위치를 지정할 수 있습니다.
> - 앞에 나온 구문을 사용하는 대신, 모든 위치를 하나의 행에 나열 합니다. 위치가 여러 개인 경우 각 위치를 쉼표로 구분합니다(예: buildspec.yml, target/my- app.jar).




## BuildSpec 예제

```yaml
version: 0.2
env:
  variables:
    JAVA_HOME: "/usr/lib/jvm/java-8-openjdk-amd64"
  parameter-store:
    LOGIN_PASSWORD: /CodeBuild/dockerLoginPassword
phases:
  install:
    commands:
      - echo Entered the install phase...
      - apt-get update -y
      - apt-get install -y maven
    finally:
      - echo This always runs even if the update or install command fails
  pre_build:
    commands:
      - echo Entered the pre_build phase...
      - docker login -u User -p $LOGIN_PASSWORD
    finally:
      - echo This always runs even if the login command fails
  build:
    commands:
      - echo Entered the build phase...
      - echo Build started on `date`
      - mvn install
    finally:
      - echo This always runs even if the install command fails
  post_build:
    commands:
      - echo Entered the post_build phase...
      - echo Build completed on `date`
reports:
  arn:aws:codebuild:your-region:your-aws-account-id:report-group/report-group-name-1:
    files:
      - "**/*"
    base-directory: 'target/tests/reports'
    discard-paths: no
  reportGroupCucumberJson:
    files:
      - 'cucumber/target/cucumber-tests.xml'
    discard-paths: yes
    file-format: CUCUMBERJSON # default is JUNITXML
artifacts:
  files:
    - target/messageUtil-1.0.jar
      discard-paths: yes
secondary-artifacts:
  artifact1:
    files:
        - target/artifact-1.0.jar
      discard-paths: yes
    artifact2:
      files:
        - target/artifact-2.0.jar
      discard-paths: yes
cache:
  paths:
    - '/root/.m2/**/*'
```


- `JAVA_HOME`의 키 및 `/usr/lib/jvm/java-8-openjdk-amd64`의 값이 있는 일반 텍스트의 사용자 지정 환경 변수가 설정됩니다.
- Amazon EC2 Systems Manager **파라미터 스토어**에 저장한 **사용자 지정 환경 변수**는 나중에 키를 사용하여 빌드 명령에서 참조됩니다.
    - `dockerLoginPassword LOGIN_PASSWORD`
- 이러한 빌드 단계 이름은 변경할 수 없습니다.
- 이 예제에서 실행되는 명령으로는
    - `apt-get update -y` 및 `apt-get install -y maven`
        - Apache Maven 설치
    - `mvn install`
        - 소스 코드를 빌드 출력 아티팩트로 **컴파일**, **테스트** 및 **패키징**하고 내부 리포지토리에 빌드 출력 아티팩트를 설치
    - `docker login`
        - Amazon EC2 Systems Manager **파라미터 스토어**에서 `dockerLoginPassword` 설정한 사용자 지정 환경 변수 값에 해당하는 암호로 Docker에 로그인 및 여러 명령이 있습니다.
        - echo 명령은 CodeBuild 가 명령을 실행하는 방식 및 명령 실행 순서를 보여 주기 위해 포함된 것입니다.
- files는 **빌드 출력 위치**에 업로드할 파일을 나타냅니다.
    - 이 예에서 CodeBuild는 이라는 단일 `messageUtil-1.0.jar` 파일을 업로드합니다.
    - `messageUtil-1.0.jar` 파일은 빌드 환경의 target이라는 상대적 디렉터리에서 찾을 수 있습니다.
    - `discard-paths: yes`가 지정되어 있으므로, `messageUtil-1.0.jar`가 바로 업로드됩니다
        - 중간의 target 디렉터리를 거치지 않음
    - 파일 이름 `messageUtil-1.0.jar` 및 상대적 디렉터리 이름 target은 Apache Maven이 이 예제에서만 빌드 출력 결과물을 생성 및 저장하는 방식에 따라 달라집니다.
    - 사용자 자체 시나리오에서는 이러한 파일 이름과 디렉터리가 다릅니다.
- `reports`는 빌드 중에 보고서를 생성하는 두 개의 보고서 그룹을 나타냅니다.  
    • `arn:aws:codebuild:your-region:your-aws-account-id:report-group/report-group-name-1`는 보고서 그룹의 ARN을 지정합니다.
- 테스트 프레임워크에 의해 생성된 테스트 결과는 `target/tests/reports` 디렉터리에 있습니다.
- 파일 형식은 `JunitXml`이고 테스트 결과가 포함된 파 일에서 경로가 제거되지 않습니다.
- `reportGroupCucumberJson` 는 새 보고서 그룹을 지정합니다.
- 프로젝트 이름이 my-project인 경우 빌드가 실행될 때 이름이 `my-project-reportGroupCucumberJson`인 보고서 그룹이 생성됩니다.
- 테스트 프레임워크에 의해 생성된 테스트 결과가 `cucumber/target/cucumber-tests.xml`에 있습니다.
- 테스트 파일 형식은 CucumberJson이고 테스트 결과가 포함된 파일에서 경로가 제거됩니다.

---

#AWS #CICD #AWS_CodeBuilder

---