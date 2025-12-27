---
slug: "Kustomize-소개-및-기본-사용법"
---
- [Kustomize 소개](#Kustomize 소개)
- [kustomization.yaml](#kustomization.yaml)
	- [Base Manifests](#kustomization.yaml#Base Manifests)
	- [Overlay Manifests](#kustomization.yaml#Overlay Manifests)
	- [Kustomize 주요 명령어](#kustomization.yaml#Kustomize 주요 명령어)
	- [kubectl 통합](#kustomization.yaml#kubectl 통합)

---

# Kustomize 소개
> https://kustomize.io/
> https:kubectl.docs.kubernetes.io/refernces/kustomize/
> https://github.com/kubernetes-sigs/kustomize

![Pasted-image-20221221131550.png](/img/이미지 창고/Pasted-image-20221221131550.png)
- 쿠버네티스 매니페스트파일을 효율적으로 관리하기 위해 만드렁진 오픈소스 도구
- 원본 YAML 파일을 보존한 채로 목적에 따라 변경본을 만들어 사용할 수 있도록 하는 것을 목표로 함

![Pasted-image-20221221131231.png](/img/이미지 창고/Pasted-image-20221221131231.png)

# kustomization.yaml
- Kustomize가 사용하는 YAML 매니페스트 파일
![Pasted-image-20221221132545.png](/img/이미지 창고/Pasted-image-20221221132545.png)
## Base Manifests
- Kustomization에 의해 참조되는 Kustomization에 의해 참조되는 Kustomization
- 보통 기본 설정으로 구성된 쿠버니테스 매니페스트 묶음

## Overlay Manifests
- Base Manifests에 변형을 가하기 위해 사용되는 Kustomization Overlay도 다른 누군가의 Base가 될 수 있다.

## Kustomize 주요 명령어
- 현재 디렉토리에 kustomization.yaml
```bash
kustomize createe
```
- 현재 디렉토리에 kustomization.yaml 파일 해석하여 쿠버네티스 매니페스트 출력
```bash
kustomize build .
```
- URL을 통해 원격에 위치한 kustomization.yaml 파일을 해석하여 쿠버네티스 매니페스트 출력
```bash
kustomize build https://github.com/tedilabs/k8s-repository/observability/grafana/v8.2
```
- kustomization.yaml 파일 내용 클러스터에 적용
```bash
kustomize build . | kubectl apply -f -
```
- kustomization.yaml 파일 내용 클러스터에서 삭제
```bash
kustomize build . | kubectl delete -f -
```


## kubectl 통합
- Kustomize가 인기를 얻으면서 Kubernetes 버전 1.14에서 kubectl 내에 kustomize 버전 v2.0.3을 내장
- 하지만, 쿠버네티스 버전 1.20까지는 관리가 되지 않아 kustomize 버전 v2.0.3 유지
- 2021-12 기준 kustomize 최신 버전 v4.4.1
![Pasted-image-20221221133750.png](/img/이미지 창고/Pasted-image-20221221133750.png)

---

#Container #Kubernetes #Kustomize

---