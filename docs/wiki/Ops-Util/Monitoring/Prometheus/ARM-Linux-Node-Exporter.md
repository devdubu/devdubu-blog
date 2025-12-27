---
slug: "ARM-Linux-Node-Exporter"
---
어렵게 찾았다... 혹시 모르니까 적어 놓으려고 한다.

# 환경 준비
### Create a user : node_exporter
```shell
sudo useradd --no-create-home --shell /bin/false node_exporter
```

`Node Exporter` is installed on every node that is to be monitored.
### Install

Download the latest version of `Node Exporter`

```shell
# node_exporter 다운
wget https://github.com/prometheus/node_exporter/releases/download/v0.18.1/node_exporter-0.18.1.linux-arm64.tar.gz

# 압축 풀기
tar zxvf node_exporter-0.18.1.linux-arm64.tar.gz

# /usr/local/bin 으로 해당 파일 복사
sudo cp node_exporter-0.18.1.linux-arm64/node_exporter /usr/local/bin

# NodeExporter에 권한 부여
sudo chown node_exporter:node_exporter /usr/local/bin/node_exporter

# 남아 있는 node exporter 삭제
rm -fr node_exporter-0.18.1.linux-arm64.tar.gz node_exporter-0.18.1.linux-arm64
```

## 구성하기

해당 서버가 켜지면 자동으로 해당 node Exporter가 켜지게끔 구성
```shell
sudo vi /etc/systemd/system/node_exporter.service
```

아래를 복사해서 붙여 넣어준 후 저장하면 됩니다.
```shell
[unit]
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

저장 후에는 해당 daemon을 다시 reload 해야합니다. 그리고, 해당 `node_exporter`를 다시 재시작 하면 됩니다.

```shell
sudo systemctl daemon-reload
sudo systemctl start node_exporter
sudo systemctl status node_exporter
```

만약 모든게 작동 된다면, 아래와 같이 enable 해주면 됩니다.
```shell
sudo systemctl enable node_exporter
```

---

#Util #Prometheus 