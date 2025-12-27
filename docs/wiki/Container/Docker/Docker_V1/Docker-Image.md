---
slug: "Docker-Image"
---

- [Docker Image](#Docker Image)
	- [Docker login](#Docker Image#Docker login)
	- [Docker image push](#Docker Image#Docker image push)
	- [Image DownLoad](#Docker Image#Image DownLoad)
		- [Example](#Image DownLoad#Example)
	- [Docker image ls](#Docker Image#Docker image ls)
		- [옵션](#Docker image ls#옵션)
		- [결과](#Docker image ls#결과)
		- [이미지 보안](#Docker image ls#이미지 보안)
		- [DCT](#Docker image ls#DCT)
	- [docker image inspect](#Docker Image#docker image inspect)
		- [결과](#docker image inspect#결과)
	- [Docker image tag](#Docker Image#Docker image tag)
	- [Docker search](#Docker Image#Docker search)
		- [옵션](#Docker search#옵션)
	- [Docker image rm](#Docker Image#Docker image rm)
		- [옵션](#Docker image rm#옵션)
	- [Docker image prune](#Docker Image#Docker image prune)
		- [옵션](#Docker image prune#옵션)


# Docker Image

Docker는 이미지 레지스트리에서 다운/업로드를 하거나 Docker 컨테이너의 시작이나 정지를 하는 조작 모두 Docker 명령을 수행한다.

해당 모든 이미지는 Docker Hub에서 관리 된다.

---

## Docker login

Docker 리포지토리에 업로드 하려면
```bash
 docker login [옵션] [서버]
```

|옵션 | 설명|
|-----|----|
|`--password`, `-p`| 비밀번호|
|`--username`, `-u` | 사용자명|


---

## Docker image push

docker 이미지를 업로드 하려면
```bash
docker image push 이미지명[:태그명]
```

---

## Image DownLoad

이미지를 다운 받기 위해서는

```bash
docker image pull [옵션] 이미지명[:태그명]
```

을 작성하면 된다.
### Example

```powershell
docker iamge pull centos:7
docker image pull -a centos
``` 
`-a` : 모든 태그를 취득 할 수 있다. 
`-a` 옵션을 지정할 때는 Docker 이미지명에 태그를 지정할 수 없으므로 주의 해야한다. 
Git처럼 http 주소로 다운이 가능하다(물론 유효한 주소일 때만 가능)
```powershell
docker image pull gcr.io.tensorflow/tensorflow
```

---

## Docker image ls

다운로드한 이미지의 목록을 표시하려면
```bash
docker image ls [옵션] [리포지토리명]
``` 

### 옵션
| 옵션 | 설명 |
|---|---|
|`-all`, `-a` | 모든 이미지 표시|
|`--digests`| 다이제스트를 표시할지 말지|
|`--no-trunc`| 결과를 모두 표시|
|`--quite`, `-q`| Docker 이미지 ID만 표시|

### 결과
| 항목 | 설명 |
|--|--|
|REPOSITORY|이미지 이름|
|TAG|이미지 태그 명|
|IMAGE ID|이미지 ID|
|CREATED|작성일|
|SIZE|이미지 크기|


### 이미지 보안

- Docker에는 인프라 구성이 포함되기 때문에 제 3자의 위장이나 변조를 하지 못하도록 이미지를 보호해야한다.
- 이때 Docker Content Trust(DCT)라는 기능을 사용하면 docker 이미지의 정당성을 확인 가능

> 서명

- 이미지 작성자가 Docker 레지스트리에 이미지를 업로드 하기 전에 로컬 환경에서 이미지 작성자의 비밀키를 사용하여 이미지에 서명한다.
- 이 비밀키를 Offline Key라고 한다. 이 키는 보안상 매우 중요한 키이다. → 철저한 관리가 필요하다

> 검증

- 서명이 된 이미지를 다운로드 할 때 이미지 작성자의 공개키를 사용하여 이미지가 진짜인지 아닌지를 확인한다.
- 만일 변조된 경우는 그 이미지를 무효로 만든다. 이 공개키를 Tagging key라고 한다.

---

### DCT

```powershell
export DOCEKR_CONTENT_TRUST=1
```

이 기능을 유효화 해놓으면 `docker image pull` 명령을 사용하여 이미지를 다운할 때 이미지의 검징이 같이 일어남

또한 서명이 되어있지 않는 이미지를 사용하면 오류가 발생한다.

---

## docker image inspect

이미지의 상세 정보를 확인하려면

```bash
docker image inspect [이미지명][:태그]
```
### 결과
|항목| 설명|
|--|--|
| IMAGE ID|이미지의 고유 ID|
|CREATED|작성일|
|DOCKER VERSION|Docker 버전|
|CPU ARCITATURE|CPU 아키텍쳐|  

결과는 JSON 형식으로 표시 된다

예를 OS값을 취득하고 싶을 때는 `--format` 옵션에서 JSON 형식의 데이터 계층 구조를 지정한다.

OS의 값은 루트 아래에 있는 OS 안에 설정 되어 있으므로 아래의 명령처럼 `--format` 옵션에서 \{\{ OS }}을 지정한다.

```bash
docker image inspect --format="{{ .Os }}" centos:7
```
마찬가지로 ContainerConfig의 Iamge 값들을 취득하고 싶을 때는
```bash
docekr image inspect --format="{{ .ContainerConfig.Image }}" centos:7

```

<br />

## Docker image tag

---

## Docker search

Docker Hub에 공개되어 잇는 이미지를 검색 할 때는
```bash
docker search [옵션] <검색키워드>
```
### 옵션
| 옵션 | 설명 |
|--|--|
|`--no-trunc`|결과를 모두 표시|
|`--list`|n건의 검색 결과 표시|
|`--filter=stars=n`|즐겨찾기의 수(n 이상)를 지정|

---

## Docker image rm

작성한 이미지를 삭제
```bash
docker image rm [옵션] 이미지명 [이미지명]
```

### 옵션
| 옵션 | 설명 | 
|---|---|
|` --force`|이미지를 강제 삭제|
|`-no-prune`|중간 이미지를 삭제하지 않음|

이미지 명은 [REPOSITORY] or [IMAGE ID]로 지정함.
여러 개의 이미지를 삭제시에 스페이스바로 구분하여 여러 개 삭제 가능

---

## Docker image prune

```bash
docker image prune [옵션]
```
### 옵션
| 옵션| 설명 |
|--|--|
|`--all`,` -a`|사용하지 않는 이미지를 모두 삭제|
|`--force`, `-f`|이미지를 강제로 삭제|

---

#Container #Docker 

---