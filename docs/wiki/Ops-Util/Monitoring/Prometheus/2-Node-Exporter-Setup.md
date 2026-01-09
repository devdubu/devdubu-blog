---
slug: 2-Node-Exporter-Setup
title: 2. Node Exporter Setup
authors: [jinmin]
tags: [Prometheus, Exporter, Linux]
---

# Node Exporter란?

**Node Exporter**는 하드웨어 및 OS(Linux) 커널 관련 메트릭(CPU, RAM, Disk, Network I/O 등)을 수집하여 Prometheus에 노출해주는 에이전트입니다. 모니터링하려는 모든 서버(노드)에 설치해야 합니다.

---

# 설치 및 실행 (Linux)

## 1. 다운로드 및 설치
사용자 계정을 생성하고 바이너리를 다운로드하여 `/usr/local/bin`으로 옮깁니다.

```bash
# 1. 전용 사용자 생성
sudo useradd --no-create-home --shell /bin/false node_exporter

# 2. 다운로드 (버전/아키텍처 확인 필요)
wget https://github.com/prometheus/node_exporter/releases/download/v1.7.0/node_exporter-1.7.0.linux-arm64.tar.gz

# 3. 압축 해제 및 이동
tar zxvf node_exporter-1.7.0.linux-arm64.tar.gz
sudo cp node_exporter-1.7.0.linux-arm64/node_exporter /usr/local/bin/

# 4. 권한 부여
sudo chown node_exporter:node_exporter /usr/local/bin/node_exporter

# 5. 정리
rm -rf node_exporter-1.7.0.linux-arm64*
```

## 2. Systemd 서비스 등록
서버 재부팅 시 자동으로 실행되도록 Systemd 서비스로 등록합니다.

`sudo vi /etc/systemd/system/node_exporter.service`

```ini
[Unit]
Description=Node Exporter
Wants=network-online.target
After=network-online.target

[Service]
User=node_exporter
Group=node_exporter
Type=simple
ExecStart=/usr/local/bin/node_exporter

[Install]
WantedBy=multi-user.target
```

## 3. 서비스 시작
서비스를 Reload하고 시작합니다.

```bash
sudo systemctl daemon-reload
sudo systemctl enable node_exporter
sudo systemctl start node_exporter
sudo systemctl status node_exporter
```

정상적으로 실행되었다면 `http://<IP>:9100/metrics` 에서 메트릭을 확인할 수 있습니다.