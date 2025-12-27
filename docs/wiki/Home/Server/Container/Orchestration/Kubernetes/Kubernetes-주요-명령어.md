---
sticker: vault//이미지/개발 로고/TechIconSVG/Kubernetes.svg

slug: "Kubernetes-주요-명령어"
---
##  🌐 클러스터 및 노드 확인

클러스터의 전반적인 상태와 구성 요소를 확인할 때 사용합니다.

- **모든 노드 상태 확인 (가장 먼저 실행하는 명령어)**
```Bash
kubectl get nodes
```
    
- **특정 노드에 라벨 추가/수정**
```Bash
kubectl label node <노드이름> <키>=<값> --overwrite
```


---

## 🛠️ 리소스 생성, 삭제, 수정

YAML 파일을 클러스터에 적용하거나 리소스를 직접 조작할 때 사용합니다.

- **리소스 생성 및 업데이트 (가장 많이 사용하는 명령어)**
```Bash
kubectl apply -f <YAML_파일명_또는_디렉토리명>
```
    
- **리소스 삭제**
```Bash
# 파일/디렉토리로 삭제
kubectl delete -f <YAML_파일명_또는_디렉토리명>

# 특정 리소스 직접 삭제
kubectl delete <리소스_종류> <리소스_이름>
# 예시: kubectl delete pod gitlab-0
# 예시: kubectl delete pvc --all
```
    
- 실행 중인 리소스 강제 수정 (고급)
	Released 상태의 PV를 초기화할 때 사용했습니다.
```Bash
kubectl patch pv <PV이름> -p '{"spec":{"claimRef":null}}'
```
- deploy 완전 삭제
```bash
kubectl delete deployment <deploy 명>

kubectl delete pvc <pvc 명>
kubectl delete pv <pv명>
```

---

## 🔍 상태 확인 및 모니터링

배포된 애플리케이션들이 잘 동작하는지 확인할 때 사용합니다.

- **현재 네임스페이스의 모든 리소스 요약 보기**
```Bash
kubectl get all
```
    
- **파드(Pod) 상태 확인**
```Bash
# 기본 조회
kubectl get pods   
# 실시간으로 변화 감시
kubectl get pods -w

# IP, 실행 중인 노드 등 상세 정보와 함께 조회
kubectl get pods -o wide
```
    
- 저장 공간(PV, PVC) 상태 확인    
	- Pending 문제의 원인을 찾을 때 가장 중요합니다.
```sh
kubectl get pv,pvc
```
- 서비스(네트워크) 및 접속 포트 확인
	- NodePort 번호를 확인할 때 사용합니다.
```Bash
kubectl get service
```
    
- ConfigMap 내용 확인
	- YAML 형식으로 상세 내용을 볼 수 있습니다.    
```Bash
kubectl get configmap <ConfigMap이름> -o yaml
```


---

### ## 🐛 디버깅 및 상세 분석

파드에 문제가 발생했을 때 원인을 깊게 파고들 때 사용합니다.

- 리소스의 상세 정보 및 이벤트 확인 (최고의 디버깅 도구)
    
    파드가 Pending, ContainerCreating 상태일 때 반드시 사용해야 하는 명령어입니다.
    
    
    
```Bash
kubectl describe <리소스_종류> <리소스_이름>
# 예시: kubectl describe pod prometheus-0
```
    
- 파드 로그 확인
    
    CrashLoopBackOff, Error 상태의 원인을 찾을 때 사용합니다.
    
    Bash
    
    ```
    # 현재 실행 중인 컨테이너의 로그
    kubectl logs <파드이름>
    
    # 실시간으로 로그 확인
    kubectl logs -f <파드이름>
    
    # CrashLoopBackOff 상태일 때, 이전에 죽었던 컨테이너의 로그 확인 (필수)
    kubectl logs --previous <파드이름>
    ```
    

---

### ## ✨ 기타 매우 유용한 명령어

- 컨테이너에 직접 접속하기 (컨테이너 SSH)
    
    실행 중인 컨테이너 내부에 들어가서 파일 시스템을 보거나 명령을 실행할 수 있습니다.
    
    Bash
    
    ```
    kubectl exec -it <파드이름> -- /bin/sh
    # (또는 /bin/bash)
    ```
    
- 로컬에서 내부 서비스로 포트 포워딩
    
    NodePort를 설정하지 않은 내부 서비스를 내 MacBook에서만 임시로 접속하고 싶을 때 사용합니다.
    
    Bash
    
    ```
    kubectl port-forward <파드이름_또는_서비스이름> <내PC포트>:<파드포트>
    # 예시: kubectl port-forward redis-0 6379:6379
    # (이제 내 PC의 localhost:6379로 접속하면 클러스터의 Redis와 연결됩니다.)
    ```