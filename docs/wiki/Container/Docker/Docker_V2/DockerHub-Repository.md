---
slug: "DockerHub-Repository"
---
[DockerHub](https://hub.docker.com/)

# Docker Hub에 회원가입

# DockerHub Access Tocken

## Access Tocken 생성하기
 1. Account Setting에 접속 합니다.
![Pasted-image-20230102130836.png](/img/이미지 창고/Pasted-image-20230102130836.png)

 2. Security에서 New Access Tocken을 클릭합니다.
![Pasted-image-20230102130937.png](/img/이미지 창고/Pasted-image-20230102130937.png)

 3. Access Tocken의 이름을 만들고 Generate를 누릅니다.
![Pasted-image-20230102131234.png](/img/이미지 창고/Pasted-image-20230102131234.png)

 4. Access Tocken의 Access Tocken 받습니다.
![Pasted-image-20230102131318.png](/img/이미지 창고/Pasted-image-20230102131318.png)


## 5. Docker login 진행

```bash
docker login -u dobu382

# dckr_pat_mIRFAPZA6JqUZl_H8tlao8PjCLg
```
![Pasted-image-20230102131559.png](/img/이미지 창고/Pasted-image-20230102131559.png)
- 해당 명령어를 치게 된다면 비밀번호를 요구하는데, 해당 비밀번호는 좀 전에 위에서 받았던 Access Tocken을 치면 됩니다.

## 6. Docker Repository 만들기

1. 상단 메뉴인 Repository에 접속 합니다. 
![Pasted-image-20230102131849.png](/img/이미지 창고/Pasted-image-20230102131849.png)

2. Create Repository를 클릭합니다.
![Pasted-image-20230102132126.png](/img/이미지 창고/Pasted-image-20230102132126.png)

3. 아래의 화면처럼, Public, Title을 작성합니다.
4. 우측 상단에 보면, Docker Repository에 image를 올리는 방법이 있습니다. 위와 같이 올리게 된다면, docker hub repository에 업로드가 완료 됩니다.
![Pasted-image-20230102132327.png](/img/이미지 창고/Pasted-image-20230102132327.png)

5. create를 누르게 된다면 아래의 사진과 같이 my-nginx로 
![Pasted-image-20230102132457.png](/img/이미지 창고/Pasted-image-20230102132457.png)

7. 그리고 위의 Repository에 해당 이미지를 올리려면, 아래의 명령어를 작성해주면 됩니다.
```bash
docker tag nginx:latest dobu382/my-nginx:v1.0.0

# docker hub에 업로드
docker push dobu382/my-nginx:v1.0.0

# docker hub에 다운로
docker pull dobu382/my-nginx:v1.0.0

```

---

#Container
#Docker 
#DockerHub


---