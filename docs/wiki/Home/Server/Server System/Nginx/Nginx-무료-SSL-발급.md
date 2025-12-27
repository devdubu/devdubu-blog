---
sticker: vault//이미지/개발 로고/TechIconSVG/NGINX.svg

slug: "Nginx-무료-SSL-발급"
---


### ## 1단계: MacBook에 Certbot 설치

MacBook 터미널에서 Homebrew를 이용해 `certbot`을 설치합니다.

Bash

```
brew install certbot
```

---

### ## 2단계: Certbot 실행 및 DNS 인증

1. 아래 명령어를 실행하여 인증서 발급을 시작합니다. `*.parasix.com` 부분은 실제 사용하는 도메인으로 변경하세요.
```Bash
    # MacBook 터미널에서 실행
sudo certbot certonly --manual --preferred-challenges dns -d "*.parasix.com" -d "parasix.com"
```
- `certonly`: 인증서만 발급받고 자동으로 설치하지 않습니다.        
- `--manual`: 수동으로 인증 절차를 진행합니다.
 - `--preferred-challenges dns`: DNS 방식으로 소유권을 인증합니다.
2. 명령을 실행하면, Certbot이 잠시 멈추고 화면에 아래와 비슷한 안내를 보여줍니다.
```sh
Please deploy a DNS TXT record under the name:
_acme-challenge.argocd.parasix.com.
    
with the following value:
    
jG_sdfsdf897sdf_sdfsdf234sdfsdf_sdfsdf
    
(This must be set up in your DNS provider's TTY)
Press Enter to Continue
```
    
3. 이제 웹 브라우저를 열어 **도메인을 구입한 곳(GoDaddy, 가비아 등)의 DNS 설정 메뉴**로 이동합니다.
4. 새로운 **`TXT`** 레코드를 추가하고, Certbot이 알려준 **이름(`_acme-challenge...`)**과 **값(무작위 문자열)**을 그대로 입력하고 저장합니다.
5. DNS 설정이 인터넷에 전파될 때까지 **1~2분 정도 기다린 후**, 다시 터미널로 돌아와 **`Enter`** 키를 누릅니다.

Certbot이 DNS를 확인하고 소유권이 증명되면, 인증서 발급이 성공적으로 완료됩니다.

---

### ## 3단계: 인증서를 Nginx 볼륨으로 복사 및 전송

발급된 인증서는 MacBook의 `/etc/letsencrypt/live/argocd.parasix.com/` 경로에 `root` 권한으로 저장됩니다. 이 파일들을 Nginx가 사용할 수 있도록 프로젝트 폴더로 복사해야 합니다.

1. **프로젝트 폴더에 `ssl` 디렉토리 생성**
    
    Bash
    
    ```
    # parasix-server-k8s 프로젝트 폴더 안에 있다고 가정
    mkdir -p nginx/ssl
    ```
    
2. 인증서 파일 복사
    
    sudo를 사용해 root 소유의 인증서를 프로젝트 폴더로 복사합니다.
    
    Bash
    
    ```
    sudo cp /etc/letsencrypt/live/argocd.parasix.com/fullchain.pem ./nginx/ssl/
    sudo cp /etc/letsencrypt/live/argocd.parasix.com/privkey.pem ./nginx/ssl/
    
    # 복사한 파일의 소유자를 현재 사용자로 변경
    sudo chown $(whoami) ./nginx/ssl/*
    ```
    
3. 이제 이 `nginx` 디렉토리를 **기존 방식대로 `scp`나 `tar`를 이용해 DMZ 서버로 전송**합니다.
    

---

### ## 4단계: Docker Compose 및 Nginx 설정 파일 수정

DMZ 서버에서 `docker-compose.yml`과 `nginx.conf` 파일을 수정하여 인증서를 사용하도록 설정합니다.

1. docker-compose.yml 수정
    
    Nginx 서비스에 SSL 인증서와 설정 파일을 담은 볼륨을 추가합니다.
    
    YAML
    
    ```
    # DMZ 서버의 docker-compose.yml
    services:
      nginx:
        image: nginx:latest
        container_name: nginx-proxy
        restart: always
        ports:
          - "80:80"
          - "443:443"
        volumes:
          # 기존 nginx.conf가 있는 볼륨
          - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
          # 새로 추가된 SSL 인증서 볼륨
          - ./nginx/ssl:/etc/nginx/ssl:ro
    ```
    
2. nginx.conf 파일 경로 수정
    
    nginx.conf 파일 안의 server 블록에서 SSL 인증서 경로를 컨테이너 내부 경로인 /etc/nginx/ssl/...로 지정합니다.
    
    Nginx
    
    ```
    # ./nginx/nginx.conf
    server {
        listen 443 ssl http2;
        server_name argocd.parasix.com;
    
        ssl_certificate /etc/nginx/ssl/fullchain.pem; # ⬅️ 컨테이너 내부 경로
        ssl_certificate_key /etc/nginx/ssl/privkey.pem; # ⬅️ 컨테이너 내부 경로
    
        # ... (이하 proxy_pass 설정)
    }
    ```
    

이제 DMZ 서버에서 `docker-compose up -d --force-recreate` 명령으로 Nginx를 다시 시작하면 SSL이 완벽하게 적용됩니다.