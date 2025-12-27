---
slug: "Container-Monitoring-SRC"
---
# Docker Daemon
```yaml
version: "3"
services:
	prometheus:
	image: prom/prometheus
	restart: unless-stopped
	user: 1000:1000
	ports:
		- 9090:9090
	volumes:
		- ./prometheus/prometheus.yaml:/etc/prometheus/prometheus.yaml
		- ./prometheus:/prometheus
	command:
		- --config.file=/etc/prometheus/prometheus.yaml
		- --storage.tsdb.path=/prometheus
		- --storage.tsdb.retention.time=90d # 90일보다 오래된 metrics는 삭제
		- --storage.tsdb.retention.size=10GB # 10GB를 넘을 시 오래된 metrics 삭제
		- --web.console.libraries=/usr/share/prometheus/console_libraries
		- --web.console.templates=/usr/share/proemtheus/consoles
		- --web.enable-admin-api

	grafana:
		image: grafana/grafana
		restart: unless-stopped
		user: 1000:1000
	ports:
		- 3000:3000
	volumes:
		- ./grafana:/var/lib/grafana
	environment:
		- GF_SECURITY_ADMIN_USER=admin # grafana 사용자 이름
		- GF_SECURITY_ADMIN_PASSWORD=admin # grafana 사용자 비밀번호
		- GF_USERS_ALLOW_SIGN_UP=false
```
`docker-compose.yaml`

```yaml
# my global config
global:
	scrape_interval: 15s # Set the scrape interval to every 15 seconds. Default is every 1 minute.
	evaluation_interval: 15s # Evaluate rules every 15 seconds. The default is every 1 minute.
# scrape_timeout is set to the global default (10s).
# Attach these labels to any time series or alerts when communicating with
# external systems (federation, remote storage, Alertmanager).
external_labels:
	monitor: 'codelab-monitor'

# Load rules once and periodically evaluate them according to the global 'evaluation_interval'.
rule_files:
	# - "first.rules"
	# - "second.rules"
	
# A scrape configuration containing exactly one endpoint to scrape:
# Here it's Prometheus itself.
scrape_configs:
	# The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.
	- job_name: 'prometheus'
		# metrics_path defaults to '/metrics'
		# scheme defaults to 'http'.
		static_configs:
			- targets: ['localhost:9090']

	- job_name: 'docker'
# metrics_path defaults to '/metrics'
# scheme defaults to 'http'.
		static_configs:
			- targets: ['192.168.245.126:4999']

	- job_name: 'node-exporter'
		static_configs:
			- targets: ['192.168.245.126:9100']
```
`prometheus/prometheus.yaml`

## cAdvisor-Container
```yaml
version: '3'
services:
	cadvisor:
		image: google/cadvisor:latest
		container_name: cadvisor
		ports:
			- 8080
		volumes:
			- /:/rootfs:ro
			- /var/run:/var/run:ro
			- /sys:/sys:ro
			- /var/lib/docker/:/var/lib/docker:ro
			- /dev/disk/:/dev/disk:ro
		restart: always
		networks:
			- monitoring-network
	prometheus:
		image: prom/prometheus
		container_name: prometheus
		restart: unless-stopped
		user: 1000:1000
		ports:
			- 9090:9090
		volumes:
			- ./prometheus/prometheus.yaml:/etc/prometheus/prometheus.yaml
			- ./prometheus:/prometheus
		command:
			- --config.file=/etc/prometheus/prometheus.yaml
			- --storage.tsdb.path=/prometheus
			- --storage.tsdb.retention.time=90d # 90일보다 오래된 metrics는 삭제
			- --storage.tsdb.retention.size=10GB # 10GB를 넘을 시 오래된 metrics 삭제
			- --web.console.libraries=/usr/share/prometheus/console_libraries
			- --web.console.templates=/usr/share/proemtheus/consoles
			- --web.enable-admin-api
		networks:
			- monitoring-network
	grafana:
		image: grafana/grafana
		container_name: grafana
		restart: unless-stopped
		user: 1000:1000
		ports:
			- 3000:3000
		volumes:
			- ./grafana:/var/lib/grafana
		environment:
			- GF_SECURITY_ADMIN_USER=admin # grafana 사용자 이름
			- GF_SECURITY_ADMIN_PASSWORD=admin # grafana 사용자 비밀번호
			- GF_USERS_ALLOW_SIGN_UP=false
		depends_on:
			- prometheus
		networks:
			- monitoring-network

networks:
	monitoring-network:
		driver: bridge
```
`docker-compose.yaml`

```yaml
global:
	scrape_interval: 15s
	
	external_labels:
		monitor: 'uzukilive-monitor'

scrape_configs:
	- job_name: 'cAdvisor'
	scrape_interval: 5s
	static_configs:
		- targets: ['cadvisor:8080']
```
`prometheus/prometheus.yaml`

---

#Container #Monitoring #DevOps #Docker 

---