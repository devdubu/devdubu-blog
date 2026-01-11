---
slug: "4-Nginx"
---

# Nginx & SSL

## 1. Nginx Overview
Nginx는 높은 성능을 제공하는 웹 서버이자 리버스 프록시, 로드 밸런서입니다.

---

## 2. Free SSL Certificate (Let's Encrypt)
Certbot을 사용하여 무료로 SSL 인증서를 발급받고 Nginx에 적용하는 과정입니다.

### 1단계: Certbot 설치 (MacBook/Local)
```bash
brew install certbot
```

### 2단계: 인증서 발급 (DNS Challenge)
와일드카드 도메인(`*.example.com`)을 사용하려면 DNS 인증 방식이 필요합니다.

```bash
sudo certbot certonly --manual --preferred-challenges dns -d "*.parasix.com" -d "parasix.com"
```
1.  명령어 실행 후 제공되는 **TXT 레코드** (이름: `_acme-challenge`, 값: 랜덤 문자열)를 도메인 관리자(AWS Route53, GoDaddy 등)에서 추가합니다.
2.  DNS 전파를 기다린 후(1~5분) 엔터를 눌러 검증을 완료합니다.

### 3단계: 인증서 배포
발급된 인증서(`/etc/letsencrypt/live/...`)를 서버(Nginx)로 복사합니다.

```bash
# 인증서 복사 (권한 주의)
sudo cp /etc/letsencrypt/live/domain.com/fullchain.pem ./nginx/ssl/
sudo cp /etc/letsencrypt/live/domain.com/privkey.pem ./nginx/ssl/
```

### 4단계: Nginx 설정 (Docker Compose)
**docker-compose.yml**:
```yaml
services:
  nginx:
    image: nginx:latest
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro  # 인증서 볼륨 마운트
```

**nginx.conf**:
```nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;

    location / {
        proxy_pass http://backend;
    }
}
```
