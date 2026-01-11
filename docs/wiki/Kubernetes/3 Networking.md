---
slug: "3_Networking"
---

# Kubernetes Networking

## 1. Service
쿠버네티스 파드(Pod)는 기본적으로 일회성(Ephemeral)이고 IP가 계속 변경됩니다. **Service**는 파드 집합에 대한 지속적인 진입점(단일 IP/DNS)을 제공합니다.

### Service Types

| 타입 | 설명 | 용도 |
| --- | --- | --- |
| **ClusterIP** | 클러스터 **내부**에서만 통신 가능한 가상 IP 할당. (기본값) | 내부 마이크로서비스 간 통신 |
| **NodePort** | 모든 노드의 특정 포트(30000-32767)를 개방하여 외부 트래픽 수신. | 간단한 외부 노출, 테스트 용도 |
| **LoadBalancer** | 클라우드 제공자(AWS, GCP 등)의 로드밸런서를 자동으로 생성하여 연결. | 실제 서비스의 외부 노출 |
| **ExternalName** | 외부 도메인(예: `db.mycompany.com`)을 서비스로 매핑. | 외부 시스템 연동 |

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
  type: ClusterIP
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9376
```

---

## 2. Ingress
외부 요청(HTTP/HTTPS)을 클러스터 내부의 서비스로 라우팅하는 규칙 모음입니다. L7 로드밸런서 역할을 수행합니다.
- **Service**가 L4 레벨이라면, **Ingress**는 L7 레벨(Host, Path 기반 라우팅)을 담당합니다.
- 실제 동작을 위해서는 **Ingress Controller**가 필요합니다.

### Ingress Controller
쿠버네티스 표준에는 구현체가 없으며, 별도로 설치해야 합니다.
- **Nginx Ingress Controller**: 가장 대중적인 오픈소스 컨트롤러.
- **AWS Load Balancer Controller**: AWS ALB/NLB와 연동.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-ingress
spec:
  ingressClassName: nginx
  rules:
  - host: myapp.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: my-service
            port:
              number: 80
```

### 주요 기능
- **Host 기반 라우팅**: `a.com`, `b.com` 등 도메인에 따라 다른 서비스로 연결.
- **Path 기반 라우팅**: `/api`, `/web` 등 경로에 따라 분기.
- **TLS/SSL**: 인증서 설정을 통해 HTTPS 지원.

---

## 3. Service Discovery
클러스터 내부에서는 DNS를 통해 서로를 찾을 수 있습니다.
- 형식: `<서비스이름>.<네임스페이스>.svc.cluster.local`
- 예: `default` 네임스페이스의 `db-service`에 접근하려면 `db-service` 또는 `db-service.default`로 호출 가능.
