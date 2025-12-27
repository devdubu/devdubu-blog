---
slug: "GitHub-Container-Registry"
---
# Docker Hub
DockerHub를 사용하려고 했더니, Private Repository가 하나 밖에 안된다.
그래서 사용하기에는 좀 애매한 부분이 있다. 사용해야하는 repository만 3개라서 턱없이 부족하다.

그러다가 회사에서도 GitLab도 Docker Registry를 지원하는데 github은 없나?
기웃거리다가 발견했다.
![Pasted-image-20240112092422.png](/img/이미지 창고/Pasted-image-20240112092422.png)
위 사진과 같이 <mark>Package</mark>에 들어간 후에, Docker 쪽에 보니까 <mark>Start Git Package~</mark> 라고 되어있다.
아무튼 오늘은 이 부분을 구축해보려고 한다.

아래 사이트에 Docker Registry에 대한 구축 방법이 나와있습니다.

[Github Docker Registry 구축 방법](https://docs.github.com/ko/packages/working-with-a-github-packages-registry/working-with-the-container-registry)

## Access Tocken 생성
우선 Docker Login을 진행하기 위해서는 Access Tocken을 생성해야합니다.

> [Access Tocken 생성](https://github.com/settings/tokens/new?scopes=write:packages)

위 사이트를 들어가서 Access Tocken을 생성합니다.

그 후에 아래 CLI를 입력하여 로그인을 진행합니다.
```bash
# 변수로 저장한 후에 하고 싶다면,
echo CR_PAT=[AccessTocken]

docker login ghcr.io -u USERNAME  --password-stdin

# 사람이 입력할 때는 아래와 같이
docker login ghcr.io -u USERNAME
```

## Docker Registry Push
```shell
docker push ghcr.io/NAMESPACE/IMAGE_NAME:latest
```
- 여기서 NameSpace란, 현 계정의 UserId를 의미합니다.

---

#CICD #git 

---