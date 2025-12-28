---
slug: "Nexus-구축"
---
# Nexus Blob Store 생성
![Screenshot-2023-01-25-at-11.30.37-PM.png](/img/Screenshot-2023-01-25-at-11.30.37-PM.png)
- 위의 사진과 같이 생성해주면 된다.

# Nexus Docker Repository 구축
- 우선 Nexus에서 Docker Repository를 구축하기 위해서 아래 사진의 3가지가 가지는 의미를 알아야한다.
![Screenshot-2023-01-25-at-11.18.09-PM.png](/img/Screenshot-2023-01-25-at-11.18.09-PM.png)
## docker(group)
- Docker Registry의 상위 개념
- 즉, 컨터이너 레지스트리의 묶음이라고 생각하면 된다.

## docker(hosted)
- 실제 docker Registry의 역할을 하는 곳이라고 생각하면 된다.
- 실제로 Docker Image가 저장 되는 곳이다.

## docker (proxy)
- dockerhub(공식 레포지토리)에서 Pull을 할 수 있게 해주는 Proxy 역할을 한다.
- dockerhub image를 다운 받으면 해당 Docker proxy에 cash 가 저장되므로 빠르게 받아올 수 있다.
- dockerhub에서 받아오는 것을 대신 받아옴


## Docker Repository 생성
- 우선 <mark>docker(hosted)</mark>를 선택하고 아래와 같이 설정해주면 된다.
![Screenshot-2023-01-25-at-11.32.24-PM.png](/img/Screenshot-2023-01-25-at-11.32.24-PM.png)
- 생성된 Repository를 클릭하게 된다면 아래와 같은 사진으로 나오게 된다.
![Screenshot-2023-01-25-at-11.33.52-PM.png](/img/Screenshot-2023-01-25-at-11.33.52-PM.png)
- 위의 URL을 통해서 Docker Image를 push, pull 할 것이기 때문에 잘 기억해야한다.
- 해당 위 URL 부분은 8081 포트가 아닌 5050포트를 사용해야한다.


## Realms 설정
![Screenshot-2023-01-25-at-11.35.48-PM.png](/img/Screenshot-2023-01-25-at-11.35.48-PM.png)
- Docker Login에 대한 부분을 설정하는 부분이다.
