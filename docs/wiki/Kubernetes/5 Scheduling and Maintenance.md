---
slug: "5_Scheduling_and_Maintenance"
---

# Kubernetes Scheduling & Maintenance

## 1. Scheduling
파드를 어떤 노드에 배치할지 결정하는 방법입니다.

### Node Selector
노드의 레이블(Label)을 기반으로 파드를 배치하는 가장 간단한 방법입니다.

```yaml
spec:
  nodeSelector:
    disktype: ssd
```
- 미리 노드에 `kubectl label node <node-name> disktype=ssd` 와 같이 레이블이 설정되어 있어야 합니다.

### Affinity (선호도)
Node Selector보다 유연하고 강력한 규칙을 정의할 수 있습니다.
- **Node Affinity**: 특정 노드에 배치 (Hard/Soft 조건 지원).
- **Pod Affinity**: 특정 파드가 있는 노드 근처(같은 호스트, 존 등)에 배치.
- **Pod Anti-Affinity**: 특정 파드와 서로 다른 노드에 배치 (고가용성 보장).

### Taint & Toleration
- **Taint (얼룩)**: 노드에 설정하여, 아무 파드나 오지 못하게 막습니다. (예: GPU 노드, 마스터 노드)
    - `NoSchedule`: 스케줄링 되지 않음.
    - `NoExecute`: 실행 중인 파드도 축출됨.
- **Toleration (용인)**: 파드에 설정하여, 특정 Taint가 있는 노드에도 배치될 수 있게 합니다.

---

## 2. Maintenance & Troubleshooting

### 기본 트러블슈팅 순서
1. **파드 상태 확인**: `kubectl get pod`
    - `Pending`: 스케줄링 실패 (자원 부족, 노드 조건 불일치).
    - `ImagePullBackOff` / `ErrImagePull`: 이미지 이름/태그 오류, 인증 실패.
    - `CrashLoopBackOff`: 컨테이너 시작 후 즉시 종료됨 (설정 오류, 애플리케이션 버그).
2. **상세 정보 확인**: `kubectl describe pod <pod-name>`
    - 이벤트(Events) 섹션에서 스케줄링 에러나 이미지 풀링 에러 원인을 확인할 수 있습니다.
3. **로그 확인**: `kubectl logs <pod-name>`
    - 애플리케이션 내부에서 발생한 오류 로그를 확인합니다.
4. **이벤트 확인**: `kubectl get events`
    - 클러스터 레벨의 이벤트를 확인합니다.

### 유용한 도구
- **Helm**: 쿠버네티스 패키지 매니저. 복잡한 애플리케이션 배포 및 템플릿 관리를 돕습니다.
- **Kustomize**: 원본 YAML을 수정하지 않고 오버레이(Overlay) 방식으로 설정을 재사용 및 변경합니다.
- **Lens / K9s**: 편리한 클러스터 관리를 위한 GUI/TUI 도구.
