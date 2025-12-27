- [K9S 설치](#K9S 설치)
	- [MacOS](#K9S 설치#MacOS)
	- [Linux](#K9S 설치#Linux)
- [공식 Github](#공식 Github)
- [실습](#실습)
	- [Context](#실습#Context)

---

# K9S

## K9S 설치

### MacOS
```bash
brew install k9s
```

### Linux
```bash
curl -sS https://webinstall.dev/k9s | bash
```

## 공식 Github
https://github.com/derailed/k9s

## 실습

- Linux에서는 `/home/ubuntu/.local/bin/k9s` 로 경로가 잡혀있기 때문에, 제대로 명령어가 작동 되지 않습니다.
- 그렇기 때문에 `~/.profile` 임의적으로 지정을 해야합니다.
```bash
which k9s

vim ~/.profile
```
- 위의 파일에 들어가서 아래와 같은 코드를 추가하고 저장하면 된다.
- `export PATH="/home/ubuntu/.local/bin:$PATH"`
- 그 후에 K9S를 키게 된다면 아래와 같은 상황이 됩니다.
![Screenshot-2022-12-28-at-10.42.54-PM.png](/img/이미지 창고/Screenshot-2022-12-28-at-10.42.54-PM.png)

### Context
- kubernetes에서 사용되는 사용자 인증 및 클러스터 설정을 의미한다.

![Screenshot-2022-12-28-at-10.45.31-PM.png](/img/이미지 창고/Screenshot-2022-12-28-at-10.45.31-PM.png)
- 위처럼 강아지 모양이 뜬다면, 명령어를 입력할 수 있습니다.


---

#Container #Kubernetes #k9s

---


