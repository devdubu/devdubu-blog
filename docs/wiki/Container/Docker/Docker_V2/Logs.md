
# STDOUT / STDERR
![Screenshot-2023-01-01-at-9.41.20-PM.png](/img/이미지 창고/Screenshot-2023-01-01-at-9.41.20-PM.png)
- 보통 docker에서의 log는 logging driver를 통해서 표준 출력, 표준 에러를 통해서 log를 밖으로 빼야한다.
- docker의 경우에는 logging driver를 다양하게 제공해주고 있다.

# Log 확인하기
```bash
# 전체 로그 확인
docker logs [container]

# 마지막 로그 10줄 확인
docker logs --tail 10 [container]

# 실시간 로그 스트림 확인 
docker logs -f [container]

# 로그마다 타임 스탬프 표시
docker logs -f -t [container]
```


## Host 운영체제의 로그 저장 경로
```bash
cat /var/lib/docker/containers/${CONTAINER_ID}/${CONTAINER_ID}-json.log
```
- 위의 경우는 log driver를 json-file로 했을 때만 유효하다.

## Log 용량 제한하기
- 컨테이너 단위로 로그 용량을 제한할 수 있지만, 도커 엔진에서 기본 설정을 진행할 수도 있습니다.
```bash
# 한 로그 파일 당 최대 크기를 3MB로 제한하고, 초대 로그 파일 3개로 로테이팅 .
docker run \
-d \
--log-driver=json-file \
--log-opt max-size=3m \
--log-opt max-file=5 \
nginx
```


## Log Driver
![Screenshot-2023-01-01-at-9.50.29-PM.png](/img/이미지 창고/Screenshot-2023-01-01-at-9.50.29-PM.png)


---

#Container #Docker 

---
