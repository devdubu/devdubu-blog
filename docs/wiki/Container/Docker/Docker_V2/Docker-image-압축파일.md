---
slug: "Docker-image-압축파일"
---
- [Docker image 압축 불러오기](#Docker image 압축 불러오기)
	- [실습](#Docker image 압축 불러오기#실습)

# Docker image 압축 파일 저장
- 이미지를 tar 압축 파일로 저장 합니다.
```bash
# docker save -o [OUTPUT-FILE] IMAGE
# ubuntu:focal 이미지를 ubnutu_focal.tar 압축 파일로 저장
docker save -o ubuntu_focal.tar ubuntu:focal
```

# Docker image 압축 불러오기
- 이미지를 tar 압축 파일로 부터 불러오기
```bash
# docker load -i [INPUT-FILE]
# ubuntu_focal.tar 압축 파일에서 ubuntu:focal 이미지 불러오기
docker load -i ubunut_focal.tar
```
- `-i` : 압출을 풀 .tar 파일을 지정할 수 있다.

## 실습
```bash
# v2 tar 파일 만들기
docker save -o my-app-v2.tar my-app:v2

# my-app:v2 이미지 삭제
docker rmi my-app:v2

# v2 tar 파일 압축 풀기
docker load -i my-app-v2.tar
```

---

#Container #Docker 

---
