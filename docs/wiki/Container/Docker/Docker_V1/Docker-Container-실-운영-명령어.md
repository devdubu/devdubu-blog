---
slug: "Docker-Container-실-운영-명령어"
---

- [Docker Container 실 운영 명령어](#Docker Container 실 운영 명령어)
- [Docker logs](#Docker logs)


# Docker Container 실 운영 명령어

수정일: 2022년 9월 22일 오후 4:22
작성일: 2022년 9월 21일 오전 10:34

이 포스팅은 실제로 Docker를 협업에서 사용하다보니, 구축과 초반 배우기 위해서 사용하는 명령어와 실제로 에러가 터졌을 때 혹은

문제를 해결하기 위해서 사용하는 명령은 다르다는 것을 느꼈습니다.

그렇기 때문에 조금이라도 더 빠르고, 신속하게 로그를 확인하기 위해서 이 명령어 모음집을 만들게 되었습니다..

# Docker logs


> 💡 docker logs [옵션] [컨테이너명]



- 옵션

| 옵션  | 설명 |
| --- | --- |
| --details | 로그를 더 자세하게 보기 위한 옵션 |
| -f, --follow | 로그를 자세하게 보여주기도하고, 실시간으로도 보여주는 옵션 |
| --since string | 로그를 timestamp 로부터 현재까지 보여준다. |
| -n, --tail string | 제일 하단에 로그로부터 몇번째 줄까지 출력하는지(default는 all) |
| -t, --timestamps | timestamp 를 설정함 |
| --util string | 설정한 timestamp 로부터 이전의 로그를 보여준다. |

---

#Container #Docker 

---