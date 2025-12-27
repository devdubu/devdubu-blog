---
slug: "Kubernetes-용량-문제"
---
- [minikube 용량 문제 에러](#minikube 용량 문제 에러)
	- [minikube 경로 옮기기](#minikube 용량 문제 에러#minikube 경로 옮기기)

---

# minikube 용량 문제 에러
- 조금 많이 pod를 올렸더니 바로 용량 문제가 터졌다.
- 어쩌면 우리 회사 서버 정책상 당면하여 해결해야하는 문제 일 수도 있을 것 같다.
- 용량 문제는 아래와 같이 `df -f` 로 찾을 수 있다.
![Pasted-image-20221220133007.png](/img/이미지 창고/Pasted-image-20221220133007.png)

![Pasted-image-20221220132910.png](/img/이미지 창고/Pasted-image-20221220132910.png) 
- Docker의 이미지 용량 문제로 해당 경로를 옮겼더니,,minikube에서 해당 경로를 찾지 못하는 에러를 내뱉었다.
- 우선 위의 문제는 Docker data의 경로를 옮겨서 해결하였다.


## minikube 경로 옮기기
- docker 경로 변경으로 용량 문제를 해결하니 minikube가 해당 경로를 감지를 못하였다. 
![Pasted-image-20221220132739.png](/img/이미지 창고/Pasted-image-20221220132739.png)

-> 그냥 `minikube delete` 하고 다시 하니까 됐다
젠장


---

#Container #Kubernetes

---