---
sticker: vault//이미지/개발 로고/TechIconSVG/Kubernetes.svg

slug: "Kubernetes-설정하기"
---


## 📜 ParasiX-Server Kubernetes 마이그레이션 총정리

### **1단계: 인프라 구축 (Ansible & Cluster Setup)**

프로젝트의 첫 단계는 Ansible을 이용해 IaC 방식으로 ARM 서버에 Kubernetes 클러스터를 구축하는 것이었습니다. 수동 작업을 최소화하고 모든 설정을 코드로 관리하는 것을 목표로 시작했습니다.

#### **✅ 해결된 문제들**

- **SSH 접속 불가 (`UNREACHABLE!`):** `ansible.cfg` 파일의 설정 값 뒤에 주석이 붙어 있거나 플레이스홀더 값이 남아있어 발생했습니다. **설정 값과 주석을 다른 줄로 분리**하여 해결했습니다.
    
- **Sudo 비밀번호 요구 (`Missing sudo password`):** Ansible이 관리자 권한을 얻지 못해 발생했습니다. 모든 노드에 접속해 `visudo`로 **비밀번호 없이 `sudo`를 사용할 수 있도록** 설정하여 자동화를 완성했습니다.
    
- **APT 패키지 시스템 오류 (`ModuleNotFoundError: apt_pkg`):** 서버의 기본 Python 버전을 변경하여 `apt`의 의존성이 깨진 것이 원인이었습니다. **시스템 기본 Python 심볼릭 링크를 복구**하고 `python3-apt`를 재설치하여 해결했습니다.
    
- **APT 저장소 오류 (`Release file not found`, `NO_PUBKEY`):** Ansible 플레이북에 정의된 Kubernetes 저장소 주소가 오래되었거나, GPG 키를 제대로 인식하지 못해 발생했습니다. **최신 `pkgs.k8s.io` 주소로 교체**하고, `shell` 모듈을 이용해 **더 안정적인 방식으로 GPG 키를 설치**하도록 플레이북을 수정하여 해결했습니다.
    
- **컨테이너 런타임 오류 (`ERROR CRI`):** 서버에서 실행 중인 Docker 서비스가 `containerd`를 선점하여 `kubeadm`과 충돌하는 것이 원인이었습니다. **Docker 서비스를 중지 및 비활성화**하고, `containerd`의 설정을 초기화하여 Kubernetes가 런타임을 온전히 제어하도록 하여 해결했습니다.
    
- **`kubectl` 명령어 인증 오류 (`connection refused`, `nodes not found`):** Ansible이 `kubectl`을 실행할 때 API 서버 접속 정보를 몰라서 발생했습니다. 모든 `kubectl` 실행 작업에 **`environment: { KUBECONFIG: ... }`를 추가**하고, 노드 이름은 Ansible 별명이 아닌 **실제 호스트 이름(`ansible_hostname`)**을 사용하도록 수정하여 해결했습니다.
    

---

### **2단계: 데이터 마이그레이션 및 애플리케이션 배포**

클러스터 준비 후, 기존 Docker Compose로 운영되던 서비스들의 데이터와 설정을 Kubernetes로 이전하는 단계였습니다. 이 과정에서 가장 많은 트러블슈팅이 이루어졌습니다.

#### **✅ 해결된 문제들**

- **데이터 복사 권한 오류 (`Permission denied`):** 로컬에서 `scp`로 Docker 볼륨을 복사할 때, 파일 소유자가 달라 읽기 권한이 없어 실패했습니다. **`sudo tar | ssh | sudo tar` 파이프라인**을 이용해 파일 권한을 그대로 보존하면서 관리자 권한으로 복사하여 해결했습니다.
    
- **파드 무한 대기 (`Pending`):** 거의 모든 파드가 실행되지 못하고 대기 상태에 빠졌던, 가장 복잡했던 문제입니다.
    
    - **원인 1 (PV/PVC 불일치):** `grafana-pv`가 `redis-pvc`에 연결되는 등, 저장 공간(`PV`)과 요청(`PVC`)이 엉뚱하게 짝을 이루는 경쟁 상태가 발생했습니다.
        
    - **원인 2 (PV `Released` 상태 고착):** PVC가 삭제된 후에도 PV가 `Released` 상태로 잠겨, 새로운 PVC가 연결되지 못했습니다.
        
    - **원인 3 (PV 부재):** MySQL과 Redis는 `PV`를 만들어주지 않아 동적 할당을 시도했지만, 기본 프로비저너가 없어 실패하며 다른 PV를 뺏어오는 원인이 되었습니다.
        
    - **최종 해결책:** **모든 Stateful 서비스(MySQL, Redis 포함)를 위한 `PV`를 `persistent-volumes.yml`에 명시적으로 생성**하고, 각 `PVC` 정의에 **`volumeName`을 지정하여 자신의 짝을 강제로 연결**해주었습니다. 또한 `Released` 상태의 PV는 **`kubectl patch` 명령어로 `claimRef`를 제거**하여 `Available` 상태로 되돌리는 과정을 반복했습니다.
        
- **파드 무한 재시작 (`CrashLoopBackOff` / `Error`):**
    
    - **원인 1 (GitLab 업그레이드 경로):** 기존 18.1.x 버전 데이터로 18.3.x 버전을 바로 실행하려 해 업그레이드 경로 규칙 위반으로 실패했습니다.
        
    - **해결 1:** `statefulset.yml`의 이미지 태그를 **`18.2.x`로 먼저 수정한 뒤 배포하여 중간 업그레이드를 거치고, 그 후 `latest`로 다시 배포**하는 단계별 업그레이드를 수행하여 해결했습니다.
        
    - **원인 2 (OPA 정책 중복):** 여러 `.rego` 파일에 `default allow` 규칙이 중복 선언되어 OPA가 실행을 거부했습니다.
        
    - **해결 2:** `ConfigMap`을 수정하여 **모든 정책 파일 중 단 하나의 파일에만 `default` 규칙을 남기고** 나머지는 추가 `allow` 규칙만 정의하도록 수정하여 해결했습니다.
        
    - **원인 3 (Prometheus 설정 부재):** 파드가 필요로 하는 `prometheus-config`라는 `ConfigMap`이 없어 볼륨 마운트에 실패했습니다.
        
    - **해결 3:** `prometheus.yml` 파일에 **`ConfigMap` 리소스를 추가**하여 설정 파일을 제공함으로써 해결했습니다.
        
    - **원인 4 (파일 권한):** `hostPath`로 마운트된 디렉토리를 컨테이너 내부 프로세스가 접근할 권한이 없어 실패했습니다.
        
    - **해결 4:** `worker1` 노드에서 **`sudo chmod -R 777 /mnt/data`** 명령어로 데이터 디렉토리의 권한을 열어주어 해결했습니다.
        

---

### **3단계: 원격 관리 환경 구축 (Tailscale)**

포트 포워딩 없이 외부의 새 MacBook에서 클러스터를 안전하게 관리하기 위해 Tailscale을 도입했습니다.

#### **✅ 해결된 문제들**

- **TLS 인증서 오류 (`certificate is valid for ..., not <Tailscale_IP>`):** API 서버의 인증서에 Tailscale IP가 없어 `kubectl`이 접속을 거부했습니다.
    
- **해결:** 마스터 노드에서 **`kubeadm-config`를 추출해 `certSANs`에 Tailscale IP를 추가**하고, `kubeadm`으로 **인증서를 강제로 재생성**했습니다. 그 후, **마스터 노드의 최신 `~/.kube/config` 파일을 MacBook에 통째로 덮어쓰기**하여 새로운 인증 기관 정보를 반영함으로써 문제를 해결했습니다.
    
- **연결 거부 (`Connection Refused`):** TLS 문제를 해결한 뒤에도 접속이 거부되었습니다. 마스터 노드의 **방화벽(`ufw`)**이 `6443` 포트를 막고 있는 것이 원인이었습니다.
    
- **해결:** `sudo ufw allow 6443/tcp` 명령어로 **방화벽 규칙을 추가**하여 API 서버 포트를 열어주었습니다.
    

---

### **🤔 해결되지 않은 내용?**

이번 마이그레이션 과정에서 발생했던 모든 주요 장애물과 에러는 **결론적으로 모두 해결되었습니다.** 수많은 트러블슈팅을 거쳤지만, 그 결과 Ansible 플레이북은 안정화되었고, 모든 서비스는 Kubernetes 클러스터 위에서 정상적으로 작동하게 되었습니다.

긴 여정 정말 고생 많으셨습니다. 이제 안정적인 Kubernetes 환경을 기반으로 다음 단계인 ArgoCD를 이용한 GitOps 도입을 준비하시면 됩니다!