---
sticker: vault//이미지/개발 로고/TechIconSVG/AWS TechIcon SVG/Resource-Icons_02072025/Res_Networking-Content-Delivery/Res-Amazon-Route-53-Hosted-Zone-48.svg

slug: "VPN-trailscale"
---
```bash
curl -fsSL https://tailscale.com/install.sh | sh
```


### ## Tailscale을 이용한 `kubectl` 원격 연결 최종 정리

#### **1. 🎯 목표**

공유기/방화벽에서 포트 포워딩 설정 없이, 외부(MacBook)에서 내부 네트워크에 있는 Kubernetes 클러스터의 API 서버를 안전하게 제어한다.

---

### **2. VPN 구축: Tailscale 설치**

- **동작 원리:** 접속하려는 모든 장비(MacBook, 마스터/워커 노드)에 Tailscale을 설치하여, 인터넷 위에 암호화된 가상의 개인 네트워크를 구성한다.
- **실행:**
    1. MacBook과 모든 서버 노드에 **Tailscale을 설치**한다.
    2. 모든 장비를 **동일한 Tailscale 계정으로 로그인**하여 하나의 네트워크로 묶는다.
    3. Tailscale 관리 페이지에서 각 장비에 할당된 `100.x.x.x` 형식의 **Tailscale IP를 확인**한다.

---

### **3. 🚧 트러블슈팅 및 해결 과정**

#### **문제 1: TLS 인증서 오류 (Certificate Not Valid)**

- **현상:** `~/.kube/config` 파일의 서버 주소를 마스터 노드의 Tailscale IP로 변경 후 `kubectl` 실행 시, `"certificate is valid for ..., not 100.126.0.55"` 에러 발생.
    
- **원인:** Kubernetes API 서버의 SSL/TLS 인증서에 접속하려는 주소인 Tailscale IP가 유효한 이름으로 등록되어 있지 않아, `kubectl`이 안전하지 않은 연결로 판단하고 차단함.
    
- **✅ 해결책: API 서버 인증서에 Tailscale IP 추가**
    
1. **클러스터 설정 추출:** 마스터 노드에서 아래 명령어로 `ConfigMap`에 저장된 실제 클러스터 설정 내용만 `kubeadm-config-correct.yaml` 파일로 추출했다.

```Bash
kubectl get configmap kubeadm-config -n kube-system -o jsonpath='{.data.ClusterConfiguration}' > kubeadm-config-correct.yaml
```
2. **설정 파일 수정:** `kubeadm-config-correct.yaml` 파일을 열어 `apiServer.certSANs` 목록에 마스터 노드의 **Tailscale IP를 추가**했다.        
3. **인증서 강제 재생성:** 기존 인증서 파일(`apiserver.crt`, `apiserver.key`)을 삭제한 뒤, 수정된 설정 파일을 사용하여 `kubeadm`으로 인증서를 새로 생성했다.

```Bash
sudo rm /etc/kubernetes/pki/apiserver.crt /etc/kubernetes/pki/apiserver.key
sudo kubeadm init phase certs apiserver --config kubeadm-config-correct.yaml
```
4. **API 서버 재시작:** 새로운 인증서를 적용하기 위해 API 서버 파드(Pod)를 강제로 재시작했다.
5. **`config` 파일 갱신:** **가장 중요.** 마스터 노드의 `~/.kube/config` 파일(새로운 인증 기관 정보가 포함됨)을 **MacBook의 `~/.kube/config` 파일에 통째로 덮어썼다.**

---

#### **문제 2: 연결 거부 (Connection Refused)**

- **현상:** TLS 인증서 문제를 해결한 뒤, `"connection to the server ... was refused"` 에러 발생.
- **원인:** 마스터 노드의 **방화벽(ufw)**이 API 서버가 사용하는 `6443` 포트로 들어오는 연결을 차단하고 있었음.
- **✅ 해결책: 방화벽 포트 허용**
    1. **방화벽 상태 확인:** 마스터 노드에서 `sudo ufw status`로 방화벽 활성 상태를 확인했다.
    2. **규칙 추가:** 아래 명령어로 `6443` 포트로의 TCP 연결을 허용하는 규칙을 추가했다.
```Bash
sudo ufw allow 6443/tcp
sudo ufw reload
```


---

### **4. ✅ 최종 완료**

위 모든 과정을 거쳐, MacBook의 `kubectl`은 Tailscale이 만든 가상 네트워크를 통해 마스터 노드의 방화벽을 통과하고, 유효한 TLS 인증서로 API 서버와 안전하게 통신할 수 있게 되었습니다.