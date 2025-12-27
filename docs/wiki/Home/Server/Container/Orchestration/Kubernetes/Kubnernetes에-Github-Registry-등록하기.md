---
sticker: vault//이미지/개발 로고/TechIconSVG/Kubernetes.svg

slug: "Kubnernetes에-Github-Registry-등록하기"
---
### ## 🔎 원인: Docker와 Kubernetes의 분리

`docker login` 정보는 해당 명령어를 실행한 사용자(예: `jinmin` 또는 `root`)의 홈 디렉토리에만 저장됩니다.

하지만 쿠버네티스에서 이미지를 다운로드하는 주체는 `docker` 데몬이나 사용자가 아닌, **`kubelet`이라는 별개의 시스템 에이전트**입니다. `kubelet`은 보안상의 이유로 사용자의 `docker login` 정보를 들여다보지 않습니다.

> 🧑‍🏫 **비유:** 워커 노드에 `docker login`하는 것은 **개인 지갑**에 현금을 넣어두는 것과 같습니다. 반면, 쿠버네티스는 파드(Pod)라는 직원에게 **회사 법인 카드**를 쥐여주고 이미지를 구매(pull)하라고 시키는 방식입니다. 직원은 사장님의 개인 지갑을 함부로 열어볼 수 없습니다.

---

### ## ✅ 올바른 방법: `imagePullSecrets` 생성 및 사용

쿠버네티스에게 비공개 레지스트리(GitHub Container Registry)의 로그인 정보를 알려주려면, **`Secret`**이라는 '회사 법인 카드'를 만들어주고, 파드가 이 카드를 사용하도록 지정해야 합니다.

#### **1단계: GitHub PAT(Personal Access Token) 생성**

GitHub Container Registry(GHCR)는 비밀번호 대신 PAT를 사용합니다.

1. GitHub의 `Settings` > `Developer settings` > `Personal access tokens` > `Tokens (classic)`으로 이동합니다.
    
2. `Generate new token`을 클릭하고, `Note`를 적당히 입력한 뒤 **`read:packages`** 권한만 체크하고 토큰을 생성합니다.
    
3. **생성된 토큰 문자열을 반드시 복사해두세요.** (이 페이지를 벗어나면 다시 볼 수 없습니다.)
    

---

### ## 2단계: Kubernetes에 Secret 생성

MacBook 터미널에서 아래 `kubectl` 명령어를 실행하여, 방금 만든 PAT를 쿠버네티스 Secret으로 저장합니다.

Bash

```
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=<GitHub_유저이름> \
  --docker-password=<방금_복사한_PAT>
```

- **`ghcr-secret`**: 우리가 만들 Secret의 이름입니다.
    

---

### ## 3단계: Deployment/StatefulSet에 Secret 적용

이제 비공개 이미지를 사용하는 모든 `Deployment`나 `StatefulSet`의 YAML 파일을 수정하여, `ghcr-secret`을 사용하도록 알려줘야 합니다.

`metric-exporter-deployment.yml` 이나 `vectorizer-worker-deployment.yml` 같은 파일을 열어 `spec.template.spec` 아래에 `imagePullSecrets`를 추가합니다.

- **수정 전:**
    
    YAML
    
    ```
    # ...
    spec:
      template:
        spec:
          containers:
          - name: exporter
            image: ghcr.io/<GitHub_유저이름>/metric-exporter:latest
    ```
    
- **수정 후:**
    
    YAML
    
    ```
    # ...
    spec:
      template:
        spec:
          imagePullSecrets: # ⬅️ 이 부분을 추가합니다.
          - name: ghcr-secret
          containers:
          - name: exporter
            image: ghcr.io/<GitHub_유저이름>/metric-exporter:latest
    ```
    

수정한 YAML 파일들을 모두 `kubectl apply`로 다시 적용하면, 쿠버네티스는 `ghcr-secret` 정보를 이용해 GitHub Container Registry에 로그인하고 이미지를 성공적으로 다운로드할 것입니다.