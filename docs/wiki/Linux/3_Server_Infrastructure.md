---
slug: "3-Server-Infrastructure"
---

# Server Infrastructure Setup

## 1. Initial Server Setup (Ubuntu)

### Essential Tools
기본적인 개발 및 운영 도구를 설치합니다.

#### Oh My Zsh (OMZ)
```bash
# Zsh 설치 및 기본 쉘 변경
sudo apt install -y zsh
chsh -s $(which zsh)

# Oh My Zsh 설치
curl -L https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh | sh
```

#### Git & Curl
```bash
sudo apt-get install curl git
```

#### Node.js (via NVM)
```bash
# NVM 설치
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
source ~/.bashrc

# Node.js 설치
nvm install --lts
```

### Docker Setup
#### Installation (ARM/Apple Silicon)
```bash
sudo apt-get update
sudo apt-get install apt-transport-https ca-certificates curl software-properties-common

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=arm64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

sudo apt-get update
sudo apt-get install docker-ce docker-compose-plugin
```

#### User Permissions
sudo 없이 Docker 명령어를 사용하기 위해 사용자를 docker 그룹에 추가합니다.
```bash
sudo usermod -aG docker $USER
# 로그아웃 후 다시 로그인 필요
```

### Security (Firewall & SSH)
#### UFW (Uncomplicated Firewall)
```bash
sudo apt-get install ufw
sudo ufw enable

# 기본 정책
sudo ufw default deny incoming
sudo ufw default allow outgoing

# 포트 허용
sudo ufw allow 22/tcp   # SSH (매우 중요)
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
```

#### OpenSSH Server
```bash
# 설치 및 상태 확인
sudo apt-get install openssh-server
sudo systemctl status ssh

# SSH Key 인증만 허용 (보안 강화)
# /etc/ssh/sshd_config
# PasswordAuthentication no
# PubkeyAuthentication yes
```

### Database (MySQL)
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

---

## 2. VPN Setup (Tailscale)
외부에서 내부 네트워크(Kubernetes API 등)에 안전하게 접속하기 위해 Mesh VPN인 Tailscale을 사용합니다.

### Installation & Connection
```bash
curl -fsSL https://tailscale.com/install.sh | sh
# 실행 후 표시되는 링크로 로그인하여 기기 인증
```

### Case Study: Kubectl on Mac via Tailscale
MacBook(외부)에서 사설 네트워크에 있는 Kubernetes Master Node에 접속하는 방법입니다.

1.  **VPN 구성**: MacBook과 Master Node 모두 Tailscale 설치 및 연결.
2.  **API Server 인증서 수정**:
    - Kubernetes API 서버는 기본적으로 내부 IP만 허용하므로, Tailscale IP(`100.x.x.x`)를 신뢰할 수 있도록 인증서에 추가해야 합니다.
    - `kubeadm-config`의 `apiServer.certSANs`에 Tailscale IP 추가 후 인증서를 재생성합니다.
3.  **Firewall**: Master Node의 UFW에서 Tailscale 네트워크 인터페이스나 API 포트(6443)를 허용해야 합니다.
    ```bash
    sudo ufw allow 6443/tcp
    ```
4.  **Kubeconfig**: Master Node의 `~/.kube/config`를 MacBook으로 복사하여 사용합니다.
