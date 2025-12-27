---
sticker: vault//이미지/개발 로고/TechIconSVG/Ansible.svg

slug: "Ansible-Kubernetes-기반-환경-셋팅"
---
네, ParasiX-Server 프로젝트의 쿠버네티스 클러스터 구축 과정을 처음부터 끝까지, 모든 트러블슈팅 내용을 포함하여 총정리해 드리겠습니다.

---

## 📜 Kubernetes 클러스터 구축: Ansible 여정 총정리

### **1. 🎯 프로젝트 목표 및 전략**

- **목표:** Docker Compose로 분산되어 있던 서비스들을 ARM 서버 기반의 Kubernetes 클러스터로 이전하고, 최종적으로 GitOps(ArgoCD) 기반의 자동화 배포 환경을 구축한다.
    
- **핵심 전략:** Ansible을 IaC(Infrastructure as Code) 도구로 사용하여, 수동 작업을 최소화하고 모든 인프라 설정을 코드로 관리한다.
    

---

### **2. 🏗️ Ansible 플레이북 설계 및 작성**

모든 서버(Master, Worker)에 걸쳐 공통 작업, 역할별 작업을 분리하기 위해 **Ansible Role** 기반으로 프로젝트를 설계했습니다.

- **디렉토리 구조:** `inventory.ini`, `ansible.cfg`, `setup-cluster.yml`, `roles/{common, master, worker}` 구조로 프로젝트 생성.
    
- **`common` 역할:** 모든 노드에 필요한 사전 설정 (swap 비활성화, 커널 모듈 활성화), 컨테이너 런타임(`containerd`) 설치, 쿠버네티스 기본 패키지(`kubelet`, `kubeadm`, `kubectl`) 설치를 정의.
    
- **`master` 역할:** `kubeadm init`으로 클러스터를 초기화하고, `kubectl` 설정 파일을 복사하며, CNI(네트워크 플러그인)로 `Flannel`을 설치하는 작업을 정의.
    
- **`worker` 역할:** 마스터 노드에서 생성된 Join Token을 이용해 클러스터에 참여하는 작업을 정의.
    
- **데이터 노드 라벨링:** 데이터 영속성이 필요한 서비스를 특정 노드(`worker1`)에 고정시키기 위해, 해당 노드에 라벨을 붙이는 작업을 `setup-cluster.yml`에 추가.
    

---

### **3. 🚧 트러블슈팅 및 해결 과정**

Ansible 플레이북을 실행하며 발생했던 다양한 오류와 해결 과정을 순서대로 정리했습니다.

#### **문제 1: `UNREACHABLE! ... remote username contains invalid characters`**

- **원인:** `ansible.cfg` 파일의 `remote_user` 설정에 `<your_ssh_user>`라는 플레이스홀더가 그대로 남아있거나, `remote_user = jinmin #주석` 처럼 설정 값 뒤에 주석이 붙어 있어 Ansible이 사용자 이름을 잘못 인식함.
    
- **해결:** `remote_user` 값을 실제 서버 접속 계정(`jinmin`)으로 수정하고, 설정 값과 주석을 다른 줄로 분리함.
    

#### **문제 2: `FAILED! ... Missing sudo password`**

- **원인:** Ansible이 `sudo` 명령을 실행할 때 서버가 비밀번호를 요구했지만, 자동화 스크립트가 입력해 줄 수 없어 실패함.
- **해결:** 모든 서버에 접속하여 `sudo visudo` 명령어로 `jinmin ALL=(ALL) NOPASSWD: ALL` 설정을 추가하여 `jinmin` 계정이 비밀번호 없이 `sudo`를 사용할 수 있도록 허용함.

#### **문제 3: `FAILED! ... ModuleNotFoundError: No module named 'apt_pkg'`**
- **원인:** 서버의 기본 Python 버전을 시스템 표준(Ubuntu 24.04의 경우 3.12)이 아닌 다른 버전(3.11)으로 변경하여, `apt`가 사용하는 핵심 파이썬 라이브러리(`apt_pkg`)를 찾지 못함.
- **해결:** `sudo ln -sf /usr/bin/python3.12 /usr/bin/python3` 명령으로 시스템 기본 파이썬 심볼릭 링크를 복구하고, `sudo apt-get install --reinstall python3-apt`로 관련 패키지를 재설치함.
    

#### **문제 4: `FAILED! ... The repository ... does not have a Release file`**

- **원인:** Ansible 플레이북에 쿠버네티스 `apt` 저장소 주소가 현재는 사용되지 않는 예전 주소(`apt.kubernetes.io`)로 잘못 설정되어 있었음.
    
- **해결:** `roles/common/tasks/main.yml` 파일에서 저장소 GPG 키와 주소를 최신 공식 주소인 `pkgs.k8s.io`로 수정함.
    

#### **문제 5: `FAILED! ... NO_PUBKEY ... repository is not signed`**

- **원인:** 새로운 저장소 주소는 맞았지만, `apt` 시스템이 해당 저장소를 신뢰하는 데 필요한 GPG 공개키를 제대로 인식하지 못함. Ansible 모듈의 문제 또는 서버의 꼬인 상태로 추정됨.
    
- **해결:** 모든 서버에서 기존 쿠버네티스 관련 `apt` 설정 파일들을 수동으로 삭제하고, 공식 `curl | gpg` 명령어를 직접 실행하여 키와 저장소를 깨끗하게 재등록함.
    

#### **문제 6: `FAILED! ... [ERROR CRI]: container runtime is not running`**

- **원인:** `kubeadm`이 컨테이너 런타임(`containerd`)과 통신하려 했으나 실패함. 이는 서버에 설치된 Docker 서비스가 `containerd`를 선점하고 있어 쿠버네티스와의 통신을 방해했기 때문.
    
- **해결:** 모든 서버에서 `sudo systemctl disable --now docker.service docker.socket` 명령으로 Docker 서비스를 중지 및 비활성화하고, `sudo rm /etc/containerd/config.toml`로 `containerd` 설정을 초기화하여 쿠버네티스가 `containerd`를 온전히 제어하도록 함.
    

#### **문제 7: `FAILED! ... connection to the server localhost:8080 was refused`**

- **원인:** `kubectl` 명령어를 실행하는 `Flannel` 설치 및 노드 라벨링 작업에서, `kubectl`이 API 서버의 주소를 몰라 기본값인 `localhost:8080`으로 접속하려다 실패함.
    
- **해결:** `setup-cluster.yml`과 `roles/master/tasks/main.yml`의 `kubectl`을 사용하는 모든 `command` 작업에 `environment: { KUBECONFIG: "/home/{{ ansible_user }}/.kube/config" }`를 추가하여 API 서버 접속 정보를 명시함.
    

#### **문제 8: `FAILED! ... nodes "worker1" not found`**

- **원인:** `kubectl label` 명령어에 `inventory.ini`의 별명(`worker1`)을 그대로 사용함. 하지만 쿠버네티스에는 실제 서버의 호스트 이름으로 노드가 등록되어 있어 이름을 찾지 못함.
    
- **해결:** `setup-cluster.yml`의 라벨링 작업에서 `kubectl label nodes {{ item }}` 부분을 `kubectl label nodes {{ hostvars[item]['ansible_hostname'] }}`으로 수정하여, Ansible이 알아낸 실제 호스트 이름을 사용하도록 변경함.
    

---

### **4. ✅ 최종 완료**

위의 모든 과정을 거쳐, 마침내 Ansible 플레이북 실행이 성공적으로 완료되었고, 1개의 마스터 노드와 2개의 워커 노드로 구성된 쿠버네티스 클러스터 기반이 마련되었습니다.