---
aliases:
  - AWS EKS 프로비저닝
sticker: vault//이미지/미분류/AWS Icon/Architecture-Service-Icons_02072025/Arch_Containers/48/Arch-Amazon-EKS-Cloud-48.svg
시작 날짜: 2023-10-17
종료 날짜: 2023-10-17

slug: "AWS-EKS-프로비저닝"
---
:::tip Kubernetes?
- Kubernetes는 컨테이너화 된 애플리케이션의 자동 배포, 스케일링 등을 제공하는 관리 시스템으로, 오픈 소스 기반이다.
- 구글에 의해 설계되고, 현재는 리눅스 재단에 의해 관리되고 있다.
- 목적
- 여러 클러스터의 호스트 간에 애플리케이션 컨테이너의 배치, 스케일링, 운영을 자동화하기 위한 플랫폼을 제공하기 위함이다.
- Docker를 포함하여 일련의 컨테이너 도구들과 함께 동작합니다.

:::

# AWS 네트워크 및 EKS 설계
:::note 순서도
1. VPC 생성
2. Subnet 및 Internet Gateway 생성
3. Route Table 생성
4. EKS Cluster 생성
5. EKS Node Group 생성
6. POD(Container) 배포

:::

![Screenshot-2023-08-21-at-9.40.53-PM.png](/img/이미지 창고/Screenshot-2023-08-21-at-9.40.53-PM.png) 
## AWS Console로 EKS 생성
:::note 사전 준비 사항
1. VPC 생성 및 설정 확인
2. Subnet 생성 확인
3. Internet Gateway 생성 확인
4. Route Table 생성 확인

:::

:::warning 중요사항
- EKS Cluster 및 NodeGroup이 실행될 대상 Subnet에는 반드시 해당 TAG가 있어야 한다.
- TAG 명 : kubernetes.io/cluster/\&lt;EKS Cluster명>
- Tag 값 : shared
:::

### Security Group 생성

### IAM Role 및 Policy 생성

| IAM Role 생성 명| Role 내 적용할 Policy 목록|
| -- | -- |
|`test-iam-role-eks-cluster` | - `AmazonEKSClusterPolicy`<br /> - `AmazonEKSVPCResourceController`|
| `test-iam-role-eks-nodegroup` | - `AmazonEKSWorkerNodePolicy`<br /> - `AmazonEKS_CNI_Policy` <br /> - `AmazonEC2ContainerRegistryReadOnly` |

> 간단 명령어 모음

```
# 예제 코드  > daemonset.yaml

kubectl create -f daemonset.yaml
# 예제코드 > deployment.yaml 배포
kubectl create -f deployment.yaml

# 정상 배포 확인
kubectl get daemonset
kubectl get deployment
kubectl get pods

```


