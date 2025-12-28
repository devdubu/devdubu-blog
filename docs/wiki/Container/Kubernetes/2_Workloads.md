---
slug: "2_Workloads"
---

# Kubernetes Workloads

## 1. ReplicaSet
파드의 복제본(Replica) 수를 일정하게 유지해주는 컨트롤러입니다. 일반적으로 직접 사용하기보다는 **Deployment**를 통해 관리됩니다.
- 레플리카 수를 지속적으로 모니터링하고, 부족하면 생성하고 많으면 삭제합니다.
- Label Selector를 통해 파드를 식별하고 관리합니다.

---

## 2. Deployment
애플리케이션의 배포와 업데이트를 선언적으로 관리하는 가장 일반적인 워크로드입니다. ReplicaSet을 생성하여 파드를 관리합니다.

### 주요 기능
- **스케일링 (Scaling)**: `replicas` 수를 조절하여 파드 개수 변경.
- **롤링 업데이트 (Rolling Update)**: 무중단 배포 지원.
    - `maxSurge`: 업데이트 중 최대로 더 생성할 수 있는 파드 수.
    - `maxUnavailable`: 업데이트 중 최대로 사용할 수 없는 파드 수.
- **롤백 (Rollback)**: 문제 발생 시 이전 버전(`revision`)으로 복구.

### 배포 전략
- **Recreate**: 기존 파드를 모두 종료하고 새 파드를 생성. (다운타임 발생)
- **RollingUpdate** (기본값): 점진적으로 새 파드를 생성하고 기존 파드를 삭제.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
```

---

## 3. DaemonSet
클러스터의 **모든 노드**(또는 특정 조건의 노드)에 파드를 하나씩 실행하도록 보장합니다.

### 사용 사례
- **로그 수집기**: fluentd, logstash 등.
- **모니터링 에이전트**: node-exporter, metricbeat 등.
- **네트워크 플러그인**: calico, kube-proxy 등.

---

## 4. Job & CronJob

### Job
하나 이상의 파드를 생성하여 특정 작업이 **성공적으로 완료(Completed)**될 때까지 실행합니다.
- 배치 작업, 데이터 마이그레이션 등에 사용.
- `completions` (총 실행 횟수)과 `parallelism` (동시 실행 수) 옵션 지원.
- `restartPolicy`: 보통 `OnFailure` 또는 `Never` 사용.

### CronJob
리눅스의 Cron 처럼 **주기적**으로 Job을 생성하여 작업을 수행합니다.
- `schedule`: Cron 표현식 (`* * * * *`) 사용.
- 데이터 백업, 정기 리포트 생성 등에 사용.

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: hello
spec:
  schedule: "*/1 * * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: hello
            image: busybox
            command: ["/bin/sh", "-c", "date; echo Hello from the Kubernetes cluster"]
          restartPolicy: OnFailure
```
