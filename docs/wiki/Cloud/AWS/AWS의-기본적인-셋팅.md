---
slug: "AWS의-기본적인-셋팅"
---


# AWS의 기본적인 셋팅

# AWS 프리티어 소개


## AWS 가격 모델

기본적으로는 사용량에 따른 지불 AWS 서비스 별 과금 계산 방식이 다름

### AWS EC2 과금 방식

| 구분 | 수요에 따른 공급(On-demand) | 예약구매(Reserved) | 절감 계획(Saving Plan) | 경매(Spot) |
| --- | --- | --- | --- | --- |
| 약정 | 없음 | 1년 혹은 3년 약정 | 1년 혹은 3년 약정 | 없음 |
| 선불  | 없음 | 있음 | 있음 | 없음 |
| 사용성 | 쉬움 | 어려움 | 쉬움 | 매우 어려움 |
| 비용 | 가장 비쌈 | 쌈 | 쌈 | 가장 쌀 수 있음 |

## AWS 프리티어 유의 사항

많은 AWS 서비스를 프리티어로 제공하지만, 모든 AWS 서비스가 프리티어를 제공하지 않음

각 프리티어 서비스는 한도가 있다.

### 프리티어 사용 중 요금이 발생 했을 때 대처 방법

프리티어 적용 여부 확인

요금 발생 리소스 추적(결재 재시보드 - 서비스별 상세 내역 조회)

요금 지불 의향 없는 서비스 종료

리소스 사용량 모니터링

# AWS CLI

## AWS CLI소개

- AWS 서비스 관리를 위한 CLI 명령어 도구이다.
- AWS CLI Python 기반으로 작성되어 Boto 패키지를 이용한다.

## AWS CLI 설치

### Mac OS 설치

```bash
brew install awscli
```

### AWS CLI 자격 증명 : AWS 액세스 키 발급

AWS 계정 혹은 IAM 사용자의 액세스 키 발급 필요

![Untitled.png](/img/Untitled.png)
### Access Key ID

- 자격 증명 주체를 가리킴
- 인증 요청한 살마이 누구인가
- 공개해도 괜찮은 키

### Secrete Access Key

- 자격 증명 주체 본인임을 인증
- 인증 요청한 사람이 정말 A가 맞는지
- 공개하면 안되는 비밀키

![Untitled-1.png](/img/Untitled-1.png)
### AWS 액세스 키 발급 방법

1. 사이트 접속
2. 보안 자격 증명 클릭
![Untitled-2.png](/img/Untitled-2.png)
1. 액세스 키 클릭
2. 새 액세스 키 만들기 클릭

![Untitled-3.png](/img/Untitled-3.png)

![Untitled-4.png](/img/Untitled-4.png)
1. 키 파일 다운로드 클릭

# AWS CLI 자격증명 설정

## AWS CLI 자격 증명 설정 우선 순위

:::info CLI 명령어 옵션
**환경 변수**
<span style={{color: '5CFFD1'}}>CLI 자격 증명 파일 - ~/.aws/credentials</span>
<span style={{color: '5CFFD1'}}>CLI 설정 파일 - ~/.aws/config</span>
컨테이너 자격 증명(EC2의 경우)
인스턴스 프로파일 자격 증명(EC2의 경우)

:::

## AWS CLI 자격 증명 설정 : CLI 설정 파일

- AWS 설정 파일으 `~/.aws/config` 에 위치해 있다.

```bash
aws_access_key_id=AKIAYXJXT7GCLBIPC2XX
aws_secret_access_key=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
```

## AWS CLI 자격 증명 설정 : 환경 변수

`AWS_ACCESS_KEY_ID`, `AWS_PROFILE`, `AWS_SECRET_ACCESS_KEY`

위 3가지 환경 변수를 통해서 설정할 수 있다.

## AWS CLI 자격 증명 설정 : CLI 명령어 옵션

`--profile`

CLI 명령어 옵션을 통해 Access Key를 지정하는 방법은 제공하지 않고, 사용자 프로파일을 CLI 명령어 옵션을 통해 지정하는 방법만 제공

## AWS CLI 자격 증명 설정 : EC2 인스턴스 프로파일

인스턴스 프로파일(Instance Profile)

IAM 역할(Role)을 EC2 머신에 부여하기 위한 목적, EC2 내에서 AWS 서비스에 대한 권한을 수행할 수 있게 된다.

![Untitled-5.png](/img/Untitled-5.png)
## AWS CLI를 통해서 실습 해보기

```bash
# AWS 보안 자격 증명에서 다운 받은 액세스키가 표시 되어있는 디렉토리로 이동해야함
ls

# 에디터를 열어서 config 를 수정한다.
vi ~/.aws/config
```

```bash
aws_access_key_id=AKIAYXJXT7GCLBIPC2XX
aws_secret_access_key=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
```

설정이 완료 된 후에 테스트를 진행하자면,

```bash
# 설정된 AWS계정 정보를 확인 할 수 있다.
aws sts get-caller-identity
```

# 그 외에 AWS 기본 리전 설정

```bash
# AWS 리전 설정하는 명령어 이를 /.aws/config 에 추가해주면 된다.
region=ap-northeast-2
```

```bash
# AWS에서 EC2서비스에서 등록된 key pair 목록을 불러오는 명령
aws ec2 describe-key-pairs

# 해당 명령어를 작성하면 리전을 설정하라고 설명이 나온다
# 그렇기 때문에 위 명령에 리전을 설정하는 명령을 같이 작성해줘야한다.
aws ec2 describe-key-pairs --region ap-northeast-2
```

## Region을 default로 설정하는 법

```bash
vi ~/.aws.config
```

```bash
region=ap-northeast-2
aws_access_key_id=AKIAYXJXT7GCLBIPC2XX
aws_secret_access_key=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
```

```bash
# AWS 리전 설정하는 명령어
region=ap-northeast-2

# 리전을 default로 했기 때문에 정상적으로 출력이 된다.
```

## AWS CLI 결과 출력 형식 설정

### 결과 출력 형식

AWS CLI명령어 수행 후 나오는 결과 데이터의 출력 형식을 의미

지원하는 출력 형식 : `json`, `text`, `table`, `yaml`, `yaml-stream`

```bash
# AWS 리전 설정하는 명령어 이를 /.aws/config 에 추가해주면 된다.
region=ap-northeast-2
output=json
```

```bash
# 만약 default값을 주지 않았거나, 혹은 출력하고 싶은 output을 설정하고 싶다면
aws ec2 describe-key-pairs --output yaml
```

```bash
vi ~/.aws.config
```

```bash
region=ap-northeast-2
output=json
aws_access_key_id=AKIAYXJXT7GCLBIPC2XX
aws_secret_access_key=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
```

으로 한 뒤 출력하면 뒤에 아무것도 작성을 하지 않으면 yaml이 출력된다.

## AWS CLI 사용자 프로파일 설정

`~/.aws/config` 파일 상에 `[profile name]` 섹션을 추가하여 여러 사용자 프로파일 등록 가능

```bash
region=ap-northeast-2
output=json
aws_access_key_id=AKIAYXJXT7GCLBIPC2XX
aws_secret_access_key=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

[profile user1]
aws_access_key_id=AKIAYXJXDEFDXBIPC2XX
aws_secret_access_key=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
```

# AWS CLI 멀티 사용자 프로파일 예제

- 여러 AWS 계정 운영
- 동일 계정 내 여러 리전 운영
- 동일 계정 내 여러 IAM 역할 전환 수행
- AWS SSO 조직 내 SSO 역할 수행

## 실습

```bash
# 현재 사용자 프로파일에 지역 명을 가져오는 명령어이다.
aws configure get region

# 기본적으로 설정되어 있는 리전을 출력해준다.

# 설정해놓은 다른 리전을 default로 사용하고 싶다면
aws configure get region --profile eu-west-1

# or 아래는 환경 변수를 이용해서 하는 방법
export AWS_PROFILE=ap-northeast-1
```

```bash
region=ap-northeast-2
output=json
aws_access_key_id=AKIAYXJXT7GCLBIPC2XX
aws_secret_access_key=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

[profile eu-west-1]
region=eu-west-1
aws_access_key_id=AKIAYXJXDEFDXBIPC2XX
aws_secret_access_key=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

[profile ap-northeast-1]
region=ap-northeast-1
aws_access_key_id=AKIAYXJXDEADCGFFEEFX
aws_secret_access_key=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
```

# 기본적인 AWS CLI 사용법

```bash
aws <command> <subcommand> [options and parameters]
```

```bash
# AWS의 CLI 명령어 메뉴얼
aws help

# AWS의 명령어에 대한 메뉴얼 확인
aws <command> help

# AWS의 서브 명령어에 대한 메뉴얼 확인
aws <command> <subcommand> help
```

## AWS CLI 사용법 : 디버그 모드 활성화

```bash
# AWS CLI의 디버그 옵션을 활성화, 특정 명령을 수행하면 AWS CLI 명령을 디버깅 할 수 있다.
aws sts get-caller-identity --debug
```

## AWS CLI 사용법 : 현재 자격증명 정보 확인

```bash
# 현재 AWS CLI 명령어를 수행하고 있는 자격 증명 주체 정보를 확인하는 방법
aws sts get-caller-identity
```
