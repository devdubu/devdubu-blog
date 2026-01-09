---
slug: 3-Reverse-Proxy-Load-Balancing
title: 3. Reverse Proxy & Load Balancing
authors: [jinmin]
tags: [Nginx, Proxy, LoadBalancing]
---

# 리버스 프록시 (Reverse Proxy)

리버스 프록시는 클라이언트의 요청을 대신 받아 백엔드 서버로 전달하고, 응답을 다시 클라이언트에게 반환하는 서버입니다.
보안 강화, 캐싱, SSL 암호화 처리 등의 이점이 있습니다.

## 설정 예시
`example.com`으로 들어오는 요청을 내부의 `localhost:3000`(Node.js 앱 등)으로 전달하는 설정입니다.

```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        # 요청을 백엔드 서버로 전달
        proxy_pass http://localhost:3000;
        
        # 헤더 전달 설정 (클라이언트의 실제 IP 등을 백엔드에 전달)
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

# 로드 밸런싱 (Load Balancing)

여러 대의 백엔드 서버에 트래픽을 분산시켜 부하를 줄이고 가용성을 높이는 기술입니다.
`upstream` 블록을 사용하여 서버 그룹을 정의합니다.

## 설정 예시
3대의 백엔드 서버로 요청을 분산하는 설정입니다.

```nginx
# 백엔드 서버 그룹 정의
upstream backend-servers {
    # 기본값은 Round Robin (순차적 분배)
    server backend1.example.com;
    server backend2.example.com;
    server backend3.example.com;
    
    # 옵션: 가중치 부여 (weight=2는 다른 서버보다 2배 더 많은 요청 처리)
    # server backend1.example.com weight=2;
}

server {
    listen 80;
    server_name my-app.com;

    location / {
        # 정의한 upstream 그룹으로 요청 전달
        proxy_pass http://backend-servers;
    }
}
```

## 부하 분산 알고리즘
- **Round Robin (Default)**: 순서대로 하나씩 분배
- **Least Conn**: 연결 수가 가장 적은 서버로 분배 (`least_conn;`)
- **IP Hash**: 클라이언트 IP를 해싱하여 특정 사용자는 항상 같은 서버로 연결 (`ip_hash;`)
