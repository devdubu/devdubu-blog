---
slug: "AWS-IAM-EKS-보안"
---
# IRSA(IAM Role for Service Account)
- 먼저 EKS가 IR 보안이 없을 때 어떤 식으로 활용 되는지 예시를 들어보겠습니다.
![Pasted-image-20230221160934.png](/img/Pasted-image-20230221160934.png)
- 하나의 워커노드 중에서 Pod 1번이 S3를 접속한다고 가정을 한다.
- 그렇게 될 때 S3를 접속 할 때 생기는 권한을 IAM에 할당 받아야하기 때문에, S3 접속 권한을 Pod 1번 즉, 워커 노드가 부여 받게 된다.
- 즉, 그렇게 되면 접속을 하지 않아도 되는 Pod2, 3번까지 해당 S3를 접속할 수 있는 권한을 부여받게 된다.

![Pasted-image-20230221161445.png](/img/Pasted-image-20230221161445.png)
- 해당 문제를 해결하기 위해서, 위와 같은 구조를 이용하게 된다.
- 위의 구조가 된다면, Pod 1번에만 할당해주기 위해서 EC2 metadata service api를 통해서 IAM Controller를 통해서 tocken을 발행 후에 Pod 1번에만 해당 Tocken을 발행하여, S3를 접근 할 수 있다.
![Pasted-image-20230221161956.png](/img/Pasted-image-20230221161956.png)
https://github.com/dev-chulbuji/devops_k8s
https://github.com/dev-chulbuji/devops_infra.git


