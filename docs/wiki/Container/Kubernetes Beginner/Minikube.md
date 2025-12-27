해당 하는 프로그램은 아래의 사이트에서 설치가 가능하다.
[Kubernetes 공식 사이트](https://kubernetes.io/)

## 설치 방법
:::warning Os 별로 설치를 하게 된다면 별다른 문제 없이 설치가 된다.

:::

- [Kubectl 설치](https://kubernetes.io/docs/tasks/tools/install-kubectl-macos/)

![Screenshot-2024-07-03-at-10.58.43-PM.png](/img/이미지 창고/Screenshot-2024-07-03-at-10.58.43-PM.png)
![Screenshot-2024-07-03-at-10.58.20-PM.png](/img/이미지 창고/Screenshot-2024-07-03-at-10.58.20-PM.png)
 ![Screenshot-2024-07-03-at-10.58.03-PM.png](/img/이미지 창고/Screenshot-2024-07-03-at-10.58.03-PM.png)


## Nginx 실행 커맨드
```shell
kubectl run nginx --image=nginx
```

```shell
# 현재 가동되고 있는 pod의 정보를 간략하게 볼 수 있다.
kubectl get pods

# wide 옵션을 너어서 추가적인 정보들을 더 확인 할 수 있다.
kubectl get pods -o wide

# nginx 라는 pod의 정보를 세부적으로 볼 수 있다.
kubectl describe pod nginx

```


---


#Container #Kubernetes 