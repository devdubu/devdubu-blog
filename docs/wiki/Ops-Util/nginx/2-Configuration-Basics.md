---
slug: 2-Configuration-Basics
title: 2. Configuration Basics
authors: [jinmin]
tags: [Nginx, Config]
---

# 설정 파일 구조
Nginx의 주 설정 파일은 보통 `/etc/nginx/nginx.conf`에 위치합니다.

## 디렉토리 구조 (Debian/Ubuntu 기준)
- **`/etc/nginx/nginx.conf`**: 메인 설정 파일.
- **`/etc/nginx/conf.d/*.conf`**: 추가 설정을 분리하여 저장하는 디렉토리.
- **`/etc/nginx/sites-available/`**: 가상 호스트(Virtual Host) 설정 파일들을 저장하는 곳.
- **`/etc/nginx/sites-enabled/`**: 실제로 활성화된 설정 파일들의 심볼릭 링크가 위치하는 곳. `nginx.conf`는 보통 이 폴더를 include 합니다.

# 주요 설정 항목

## Events 블록
네트워크 연결 처리 방식을 설정합니다.

```nginx
events { 
    # 하나의 워커 프로세스가 동시에 처리할 수 있는 최대 접속 수
    worker_connections 1024; 
}
```

## Http 블록
웹 서버 동작에 대한 설정을 정의합니다.

```nginx
http {
    # 로그 설정
    access_log /var/log/nginx/access.log;
    error_log  /var/log/nginx/error.log warn;

    # 파일 전송 최적화
    sendfile on;

    # 가상 호스트 설정 포함
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
```

## Server 블록
가상 호스트(Virtual Host)를 정의합니다. 특정 도메인이나 포트로 들어오는 요청을 처리합니다.

```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        root /var/www/html;
        index index.html;
    }
}
```

---
#Util #Nginx