---
slug: "User-만들기"
---
# Linux에서 유저 만들기
```shell
sudo useradd username

sudo passwd username

# user를 생성했을 때 /home 디렉토리에 자동 생
sudo useradd -m username

# 사용자를 그룹에 추가 할 수 있다.
sudo usermod -aG [그룹명] [유저명]

```

# Linux 파일 전송
```shell
scp -r [디렉토리 명] [원격지 user]@[원격지 ip]:[보낼 경로]
```


---

#Linux 

