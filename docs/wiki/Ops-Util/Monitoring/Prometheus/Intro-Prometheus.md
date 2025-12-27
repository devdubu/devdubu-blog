---
slug: "Intro-Prometheus"
---
# Prometheus
## Prometheus란?
- Prometheus는 SoundCloud 사에서 만든 오픈소스 시스템 모니터링 및 경고 툴킷 이다.
- 지금은 독립형 오픈소스 프로젝트이며, 많은 회사들이 사용하고 있고, 또한 kubernetes에서도 Prometheus를 사용하여 매트릭 수집 및 대시보드 구축하는 방식을 장려하고 있다.
![Pasted-image-20230622170358.png](/img/이미지 창고/Pasted-image-20230622170358.png)
- Prometheus의 아키텍쳐는 아래와 같이 구성되어있다.
![Pasted-image-20230622170422.png](/img/이미지 창고/Pasted-image-20230622170422.png)
- `Jobs/experters`는 실제로 매트릭을 수집하는 프로세스라고 보면 된다.
- 이 `export`가 매트릭을 수집하고 HTTP 통신을 통해 매트릭 데이터를 가져갈 수 있게 /metrics라는 HTTP 엔드포인트를 제공한다.
- 그러면 `Prometheus server`가 이 `exporter` 엔드포인트로 HTTP GET 요청을 날려 매트릭 정보를 수집(Pull)한다.
- 수집한 정보를 Prometheus가 제공하는 간단한 웹 뷰를 통해 조회할 수 있고 그 안에서 테이블 및 그래프 형태로 볼 수 있다.

- 하지만 시각화 도구가 부족해서 이를 직접 사용하지는 않고 대게 Grafana라는 Data Visualization tool을 이용하여 시각화하고 있다.
- (Prometheus & Grafana와 Elasticsearch & Kibana 뭐 이런 느낌이다..)







Prometheus는 오픈 소스이며, Apach2 라이센스로 공개 되어 있기에 유료 걱정 없이 사용이 가능합니다.
![Pasted-image-20230622125835.png](/img/이미지 창고/Pasted-image-20230622125835.png)
- 위 그림은 프로메테우스 구조 입니다.
- 다른 모니터링 도구와 가장 다른 점은 대부분의 모니터링 도구가 Push 방식, 
- 즉 각 서버에 클라이언트를 설치하고 이 클라이언트가 메트릭 데이터를 수집해서 서버로 보내면,
- 서버가 모니터링 상태를 보여주는 방식인데,

- Prometheus는 Pull 방식이다.
- 그래서 각 서버가 각 클라이언트를 알고 있어야 하는게 아니라 서버에 클라이언트가 떠 있으면, 서버가 주기적으로 클라이언트에 접속해 데이터를 가져오는 방식이다.
- 몇 가지 특징을 짚고 넘어갈 수 있는데, 구성을 크게 나누면 Exporter, Prometheus Server, Grafana, AlertManager로 나눌 수 있다.

## Exporter
- 모니터링 대상의 Metric 데이터를 수집하고, Prometheus가 접속했을 때 정보를 알려주는 역할을 한다.
- 호스트 서버의 CPU, Memory 등을 수집하는 node-exporter도 있고 nginx의 데이터를 수집하는 nginx-exporter도 있다.
- Exporter를 실행하면, 데이터를 수집하는 동시에 HTTP 엔드포인트를 열어(기본은 9100 포트) Prometheus 서버가 데이터를 수집해 갈 수 있도록 한다.
- 이 말은 웹 브라우저 등에서 해당 HTTP 엔드포인트에 접속하면 Metric의 내용을 볼 수 있다는 의미다.
	- Exporter를 쓰기 어려운 배치잡 등은 Push gateway를 사용하면 된다.
	- Prometheus Server에 Grafana를 연동해서 대시보드 등의 시각화 한다.
	- 알림을 받을 규칙을 만들어서 Alert Manager로 보내면 Alert Manager가 규칙에 따라 알림을 보낸다.

## Prometheus Server
- Prometheus 서버는 [다운로드](https://prometheus.io/download/)에서 받으면 된다.
- docker image로도 제공하고 있기에 편한대로 사용하면 된다.

## Prometheus.yml
- 이제 Prometheus 서버를 띄울 때 사용한 설정 파일인 `prometheus.yml`를 살펴본다.
```yml
# 전역 설정
global:
  scrape_interval:     15s # 15초마다 매트릭을 수집한다. 기본은 1분.
  evaluation_interval: 15s # 15초마다 규칙을 평가한다. 기본은 1분.

  # 외부 시스템에 표시할 이 서버의 레이블
  external_labels:
      monitor: 'codelab-monitor'

# 규칙을 로딩하고 'evaluation_interval' 설정에 따라 정기적으로 평가한다.
rule_files:
  # - "first.rules"
  # - "second.rules"

# 매트릭을 수집할 엔드포인드로 여기선 Prometheus 서버 자신을 가리킨다.
scrape_configs:
  # 이 설정에서 수집한 타임시리즈에 `job=<job_name>`으로 잡의 이름을 설정한다.
  - job_name: 'prometheus'

    # metrics_path의 기본 경로는 '/metrics'이고 scheme의 기본값은 `http`다

    static_configs:
      - targets: ['localhost:9090']
```

### global
- 매트릭 수집을 위한 전역 설정 값이다.
- 프로메테우스 서버를 프로메테우스 서버에 연결하거나 Alert Manager 등에서 이 서버의 데이터를 가져갈 수 있는데 그때 구분할 수 있도록
- `external_labes`로 이름을 지정할 수 있다.

### rule_files
- Alert 규칙 등 필요한 규칙을 작성해서 사용할 수 있는데
- 위의 코드는 규칙을 지정하지 않았습니다.

### scrape_configs
- 실제 수집 대상을 지정하는 설정이다.
- 여기서는 `prometheus`라는 이름으로 한 개만 설정했다.
- 이는 여러 대상을 설정할 수 있다는 것이고, targets가 배열로 지정하므로 서버 군을 모두 여기 지정 할 수 있다.

### target
- `localhost:9090`으로 설정했는데, 이는 Prometheus 서버 자신을 가리킨다.
- `target`에 지정하는 것은 Prometheus 서버가 접근해서 데이터를 가져올 Export의 HTTP 엔드 포인트다.
- 그래서 `localhost:9090`으로 지정을 하면 기본 값이 `metrics_path`를 이용해서 `localhost:9090/metrics`에 접근해서 데이터를 가져온다
- 이는 Prometheus 서버가 metric을 수집하는 서버인 동시에 metric을 노출하는 Exporter이기도 하다는 의미다.

### scrapte_config
- 위 코드는 수동으로 지정
- 모니터링할 서버를 수동으로 관리할 수 없다.
- 모니터링 대상은 Consul, DNS 기반의 서비스 디스커버리를 이용해서 동적으로 설정할 수 있다.


---
해당 내용은 확인이 필요

- Prometheus는 클러스터링 기능이 없다.
- 한대의 Prometheus 서버로 수천 대의 서버를 다 모니터링 할 수는 없고, 내가 아는 선에서는 현재 Prometheus 서버를 Prometheus 서버에 연결해서 사용하는 방식으로 확장하는 것으로 추측?
- 즉, 100대를 수집하는 Prometheus 서버를 두고 이 서버가 수집한 데이터를 다시 수집하는 Prometheus 서버를 또 뒤에 둔다는 것이다.

## Exporter
- 메트릭을 제공하는 Exporter를 살펴 봐야 한다. 
- 간단히 prometheus를 docker로 띄운 뒤 `prometheus.yaml`을 설정한다.
```yml
scrape_configs:
  - job_name: 'prometheus'

    static_configs:
      - targets: ['localhost:9090']
  - job_name: 'test-server'

    scrape_interval: 10s

    static_configs:
      - targets: ['52.69.72.174:9100']
```
- 기본에 있던 prometheus job외에 test-server라는 이름으로 새로운 job을 추가하고 위에 설정한 Node-Exporter를 바라보고도록 했다.

## 표현식 언어
- Prometheus에서는 수집한 매트릭 데이터를 조회할 수 있는 함수형 표현식 언어를 제공하고 있다.
- 이 표현식 언어를 사용한 것이다.
	- 앞에서 조회해본 `process_cpu_sceonds_total`, `node_cpu`, `http_requests_total` 등 <mark>인스턴스 백터</mark> 라고 부른다.
	- 인스턴스 벡터 뒤에 `{ }`로 레이블을 지정하면 필터링을 할 수 있는데, `http_requests_total{job="prometheus", group="carnay"}`와 같이 사용한다.
	- 이렇게 하면, `http_requests_total`에서 job이름이 prometheus이고 group은 canary인 정보만 조회한다.
		- 레이블에서는 = , !=, =~, !~같은 논리 연산자를 사용할 수 있고, 여기서 ~는 정규표현식을 의미한다.
		- `http_request_total{environment=~"staging|testing|development"., method!="GET"`와 같이 사용할 수 있다.
	- 인스턴스 벡터 뒤에 레인지 벡터라고 부르는 `[]` 를 사용할 수 있습니다.
	- `http_requests_total{job="prometheus"}[5m]` 라고 하면 최근 5분의 값을 조회한다.
	- `node_cpu offset 10m` 처럼 특정 시간의 값을 조회하는 오프셋 모디파이어를 사용할 수 있다.
- 그 외의 연산자나 함수를 이용해서 조회 할 수 있다.

---

#Util #Monitoring #Prometheus

---






