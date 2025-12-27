---
slug: "Job-CronJob"
---
- [CronJob](#CronJob)
	- [실습](#CronJob#실습)
		- [job.yaml](#실습#job.yaml)
			- [실행하기](#job.yaml#실행하기)
		- [job-parallelism.yaml](#실습#job-parallelism.yaml)
			- [실습](#job-parallelism.yaml#실습)
				- [Job 실행](#실습#Job 실행)
				- [Job의 Log 확인](#실습#Job의 Log 확인)
		- [job-deadline.yaml](#실습#job-deadline.yaml)
			- [실행](#job-deadline.yaml#실행)
		- [cronjob.yaml](#실습#cronjob.yaml)
			- [cronjob 조회](#cronjob.yaml#cronjob 조회)

---

# Job
> 지속적으로 실행되는 서비스가 아니라 특정 작업을 수행하고 종료해야하는 경우?

- 특정 동작을 <mark>수행하고 종료</mark>하는 작업을 정리하기 위한 리소스
- 내부적으로 <mark>파드를 생성</mark>하여 작업 수행
- Pod의 상태가 Running이 아닌 <mark>Completed가 되는 것이 최종 상태</mark>
- 실패 시 <mark>재시작 옵션</mark>, <mark>작업 수행 회수</mark>, <mark>동시 실행 수 등</mark> 세부 옵션 제공

# CronJob
> 주기적으로 특정 작업을 수행하고 종료해야하는 경우?
![Pasted-image-20221220092450.png](/img/이미지 창고/Pasted-image-20221220092450.png)
- 주기적으로 특정 동작을 수행하고 종료하는 작업을 정의하기 위한 리소스
- 리눅스의 [Cron 스케줄링](Cron-스케줄링.md)을 그대로 사용
- 내부적으로 Job을 생성하여 작업 수행
- <mark>주기적으로</mark> <mark>데이터를 백업</mark>하거나 <mark>데이터 점검 및 알림 전송</mark> 등의 목적으로 사용

## 실습
`/fastcampus-devops/3-docker-kubernetes/13-k8s-job/`
![Pasted-image-20221220093104.png](/img/이미지 창고/Pasted-image-20221220093104.png)

### job.yaml
```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: hello
spec:
  template:
    spec:
      restartPolicy: Never
      containers:
      - name: hello
        image: ubuntu:focal
        command: ["sh", "-c", "echo Hello World!"]
```
`job.yaml`
- Job도 결국은 작업을 수행하는 Pod를 만드는 작업이기 때문에, spec 아래는 Pod를 만드는 작업과 동일하게 작성하면 된다.
- deployment가 가지는 templete 구조와 동일하다고 보면 된다.
- Job에서는 가장 중요한 구문은 <mark>restartPolicy</mark> 부문 입니다.
	- Job의 경우에는 Never, OnPailure를 작성하는게 적절하다.
	- CronJob의 경우에는 Always를 작성하는게 적절하다.
#### 실행하기
```bash
kubectl apply -f job.yaml

kubectl get job

# job 지우는 방법
kubectl delete -f job.yaml
```
![Pasted-image-20221220093752.png](/img/이미지 창고/Pasted-image-20221220093752.png)
![Pasted-image-20221220093811.png](/img/이미지 창고/Pasted-image-20221220093811.png)
- Job과 같은 경우에는 Selector를 지정하지 않아도, 자동으로 Selector와 Lable이 지정되기 때문에, 신경쓰지 않아도 됩니다.
- 하지만, 다른 것들과 마찬가지로 수동으로 지정이 가능하기 때문에, 필요에 의해서 수동으로 작성하면 됩니다.

### job-parallelism.yaml
```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: hello
spec:
  completions: 10
  parallelism: 2
  template:
    spec:
      restartPolicy: Never
      containers:
      - name: hello
        image: ubuntu:focal
        command: ["sh", "-c", "sleep 2; echo Hello World!"]
```
`job-parallelism.yaml`
- completions -> Job을 몇번 실행 시킬 건지
- parallelism -> 동시 실행 횟수

#### 실습
##### Job 실행
```bash
kubectl apply -f job-parallelism.yaml
```
![Pasted-image-20221220094817.png](/img/이미지 창고/Pasted-image-20221220094817.png)
![Pasted-image-20221220094827.png](/img/이미지 창고/Pasted-image-20221220094827.png)
- completions에서 Job의 횟수는 10번이므로, 최종 완료된 형태는 10개입니다.
- parallelism에서 2개이므로, 동시 실행(Running 상태)는 최대 2개 입니다.
##### Job의 Log 확인
```bash
kubectl logs job/hello
```
![Pasted-image-20221220095042.png](/img/이미지 창고/Pasted-image-20221220095042.png)

### job-deadline.yaml
```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: hello
spec:
  activeDeadlineSeconds: 3
  template:
    spec:
      restartPolicy: Never
      containers:
      - name: hello
        image: ubuntu:focal
        command: ["sh", "-c", "sleep 5; echo Hello World!"]
```
`job-deadline.yaml`
- activeDeadlineSeconds -> Job이 최대 실행할 수 있는 시간 수이다.
	- 즉, 3초라고 지정하면 Job 실행 소요 시간이 3초를 넘어가면 실패로 간주한다는 의미이다.
#### 실행
```bash
kubectl apply -f job-deadline.yaml

kubectl get job
```

![Pasted-image-20221220100536.png](/img/이미지 창고/Pasted-image-20221220100536.png)
- Complete가 아닌 <mark>Terminating</mark>이 되고 있는 모습을 볼 수 있습니다.
![Pasted-image-20221220100701.png](/img/이미지 창고/Pasted-image-20221220100701.png)
- 위 사진을 보게 된다면, completions에 성공이 되지 않고 실패 됐다는 것을 확인 할 수 있습니다.
```bash
kubectl desrcibe job/hello
```

### cronjob.yaml
```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: hello-every-minute
spec:
  schedule: "*/1 * * * *"
  successfulJobsHistoryLimit: 5
  jobTemplate:
    spec:
      template:
        spec:
          restartPolicy: Never
          containers:
          - name: hello
            image: ubuntu:focal
            command: ["sh", "-c", "echo Hello $(date)!"]
```
`cronjob.yaml`
- 위 코드에서 schedule에는 cron expression입니다.
	- 위의 표현은 <mark>매 1분마다 cronjob을 실행시켜라</mark> 입니다.
- successfulJobsHistoryLimit -> 성공한 job의 기록은 5개까지만 남겨라
#### cronjob 조회
```bash
kubectl get cronjob
```

---

#Container #Kubernetes #KubernetesAPI

---