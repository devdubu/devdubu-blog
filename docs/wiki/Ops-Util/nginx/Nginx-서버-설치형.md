---
slug: "Nginx-서버-설치형"
---
# Error Log 쌓이는 경로
```shell
error_log  /var/log/nginx/error.log warn;
```

# nginx pid 가 저장되는 경로
```
pid        /var/run/nginx.pid;
```
# Worker_connections
```
events { 
	worker_connections 1024; 
}
```



더욱 자세한 내용
https://phsun102.tistory.com/45

---

#Util #Nginx