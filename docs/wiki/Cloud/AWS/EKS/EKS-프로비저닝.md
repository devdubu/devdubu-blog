---
slug: "EKS-프로비저닝"
---
# AWS 네트워크 및 EKS 설계
:::note 순서도
1. VPC 생성
2. Subnet 및 Internet Gateway 생성
3. Route Table 생성
4. EKS Cluster 생성
5. EKS Node Group 생성
6. POD(Container) 배포

:::

![Screenshot-2023-08-21-at-9.40.53-PM.png](/img/Screenshot-2023-08-21-at-9.40.53-PM.png) 
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

