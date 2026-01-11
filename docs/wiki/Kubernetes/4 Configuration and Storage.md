---
slug: "4_Configuration_and_Storage"
---

# Kubernetes Configuration & Storage

## 1. ConfigMap
애플리케이션의 설정 정보(DB 호스트, 포트, 일반 설정 파일 등)를 코드와 분리하여 저장하는 객체입니다. 키-값(Key-Value) 쌍으로 데이터를 저장합니다.

### 사용 방법
1.  **환경 변수(Environment Variable)로 주입**: `envFrom` 또는 `valueFrom` 사용.
2.  **볼륨(Volume)으로 마운트**: 설정 파일을 컨테이너 내부의 파일로 마운트.
3.  **Command-line Arguments**: 컨테이너 실행 인자로 전달.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: game-config
data:
  player_initial_lives: "3"
  ui_properties_file_name: "user-interface.properties"
```

---

## 2. Secret
비밀번호, OAuth 토큰, ssh 키와 같은 **민감한 정보**를 저장하는 객체입니다. 기본적으로 **Base64**로 인코딩되어 저장됩니다 (암호화가 아님에 주의).
- ETCD에 평문으로 저장되므로, 암호화 저장소(Encryption at Rest) 설정이나 External Secrets(Vault 등) 연동을 권장합니다.

### Secret 종류
- **Opaque**: 일반적인 임의의 사용자 데이터 (기본값).
- **kubernetes.io/dockerconfigjson**: Private 레지스트리 인증 정보.
- **kubernetes.io/tls**: TLS/SSL 인증서 및 키.

### 사용 예시 (Pod)
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secret-pod
spec:
  containers:
  - name: my-container
    image: my-image
    env:
      - name: SECRET_PASSWORD
        valueFrom:
          secretKeyRef:
            name: my-secret
            key: password
```

---

## 3. Persistent Volume (PV) & Claim (PVC)
파드는 일시적이므로(Ephemeral), 데이터를 영구적으로 저장하기 위해 PV와 PVC를 사용합니다.

- **PersistentVolume (PV)**: 클러스터 관리자가 프로비저닝한 실제 스토리지 리소스(AWS EBS, NFS 등).
- **PersistentVolumeClaim (PVC)**: 사용자가 요청하는 스토리지 요구 사항(용량, 접근 모드 등).
- **StorageClass**: 스토리지의 종류를 정의하며, PVC 요청 시 동적으로 PV를 생성(Dynamic Provisioning)해줍니다.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
```
