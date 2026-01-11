---
slug: "1_Kubernetes_Core"
---

# Kubernetes Core Concepts

## 1. Kubernetes Overview
쿠버네티스(Kubernetes, k8s)는 컨테이너화된 애플리케이션의 자동 배포, 스케일링 등을 관리하는 오픈소스 시스템입니다. 구글의 **Borg** 시스템에서 파생되었으며, 현재는 CNCF(Cloud Native Computing Foundation)에서 관리합니다.

### 특징
- **자동화된 롤아웃과 롤백**: 애플리케이션의 변화를 점진적으로 적용하고 문제 발생 시 자동 복구.
- **서비스 디스커버리와 로드 밸런싱**: 컨테이너에 고유 IP와 단일 DNS 이름을 부여하고 트래픽을 분산.
- **스토리지 오케스트레이션**: 로컬 저장소, 클라우드 스토리지 등을 자동으로 마운트.
- **자가 치유(Self-healing)**: 실패한 컨테이너를 다시 시작하고, 응답이 없는 컨테이너를 교체.

---

## 2. Cluster Architecture
쿠버네티스 클러스터는 **Control Plane(Master Node)**과 **Worker Node**로 구성됩니다.

### Control Plane (Master Node)
클러스터의 두뇌 역할을 하며 전역 상태를 관리합니다.
- **API Server**: 모든 요청을 처리하는 관문. REST API를 제공하며 `kubectl`의 요청을 받음.
- **etcd**: 모든 클러스터 데이터를 저장하는 고가용성 Key-Value 저장소.
- **Scheduler**: 새로 생성된 Pod를 감지하고 실행할 Node를 선택(스케줄링).
- **Controller Manager**: 노드, 레플리카셋, 엔드포인트 등 다양한 컨트롤러를 구동하고 상태를 유지.

### Worker Node
실제 애플리케이션(Pod)이 실행되는 서버입니다.
- **Kubelet**: 마스터의 API Server와 통신하며 노드에서 컨테이너가 정상적으로 동작하도록 관리.
- **Kube-Proxy**: 노드의 네트워크 규칙을 유지 관리하며 서비스 연결을 담당.
- **Container Runtime**: 컨테이너를 실행하는 소프트웨어 (Docker, containerd, CRI-O 등).

---

## 3. Basic Objects

### Pod
쿠버네티스에서 생성하고 관리할 수 있는 배포의 **가장 작은 단위**입니다.
- 하나 이상의 컨테이너 그룹으로, 스토리지/네트워크를 공유합니다.
- **Life Cycle**: Ephemeral(일시적)하며, 죽으면 되살아나지 않고 새로운 Pod로 대체됩니다.
- **Multi-container Pod**: 일반적으로는 1 Pod 1 Container지만, 로그 수집기나 프록시와 같은 보조 컨테이너(Sidecar 패턴)를 함께 실행할 수 있습니다.

### Namespace
단일 클러스터 내에서 리소스 그룹을 격리하는 가상 클러스터 개념입니다.
- **용도**: 여러 팀(개발, 운영)이나 프로젝트(A서비스, B서비스) 간의 리소스 분리.
- **ResourceQuota**: 네임스페이스별 CPU, 메모리 총량을 제한할 수 있습니다.
- **LimitRange**: 파드나 컨테이너별 최소/최대 리소스 사용량을 제한할 수 있습니다.

**기본 네임스페이스:**
- `default`: 기본 네임스페이스.
- `kube-system`: 쿠버네티스 내부 시스템 컴포넌트용.
- `kube-public`: 모든 사용자가 읽기 가능한 공용 데이터용.

---

## 4. Manifest (YAML)
쿠버네티스 객체는 YAML 형식의 매니페스트 파일로 정의하고 관리합니다.

### 기본 구조
모든 매니페스트는 다음 4가지 필수 필드를 가집니다.

```yaml
apiVersion: v1       # API 버전 (v1, apps/v1 등)
kind: Pod            # 리소스 종류 (Pod, Service, Deployment 등)
metadata:            # 리소스의 이름, 라벨, 네임스페이스 등 정보
  name: my-pod
  labels:
    app: myapp
spec:                # 리소스의 원하는 상태(Desired State) 정의
  containers:
  - name: nginx
    image: nginx:latest
```

### 명령형 vs 선언형
- **명령형(Imperative)**: `kubectl run`, `kubectl expose` 등 구체적인 동작을 지시. (테스트용)
- **선언형(Declarative)**: YAML 파일에 원하는 상태를 정의하고 `kubectl apply`로 적용. (운영용, GitOps)

```bash
# 선언형 명령 예시
kubectl apply -f pod.yaml
```
