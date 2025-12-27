---
slug: "AWS-IAM-2"
---
# AWS IAM - 2

![Pasted-image-20230220093329.png](/img/이미지 창고/Pasted-image-20230220093329.png)


## AWS Group

![Pasted-image-20230220093550.png](/img/이미지 창고/Pasted-image-20230220093550.png)
- 위의 상황처럼, AWS에서 하나의 여러 개의 계정에서 겹치는 부분들이 많이 생기게 된다.
- 위의 상황이 된다면, 한 두개 일 때는 괜찮지만, 여러개라면 조금 불편한 상황이 생기게 된다.
- 그렇기 때문에 IAM에서는 <mark>Group</mark>이라는 기능을 제공한다.
![Pasted-image-20230220094228.png](/img/이미지 창고/Pasted-image-20230220094228.png)

- 계정 뿐만아니라, 만들어놓은 기능 또한 해당 Role에 따라서 할 수 있는 역할이 다르다.
![Pasted-image-20230220094352.png](/img/이미지 창고/Pasted-image-20230220094352.png)
- 위의 사진 처럼, EC2, Lambda를 통해서 AWS의 인프라에서 해당하는 Policy를 정하여서 기능을 제한하는 것도 할 수가 있다.

## AWS Access Managemnet
![Pasted-image-20230220094931.png](/img/이미지 창고/Pasted-image-20230220094931.png)
- 만약 AWS S3 bucket에 접근하려고 할 때, 해당 Identity를 가지고 접근을 하려고 한다고 가정을 하면,
![Pasted-image-20230220095232.png](/img/이미지 창고/Pasted-image-20230220095232.png)
- 위의 사진처럼, Principal을 통해서, 먼저 해당 Identity를 비교하게 됩니다.
- 그리고 아래의 사진처럼 만약, Identity에 교집합이 생긴다면, 접근을 허용하게 됩니다.
![Pasted-image-20230220095456.png](/img/이미지 창고/Pasted-image-20230220095456.png)

- 위의 그림처럼, Resource상에서 Policy와 Identity에 Policy와 교집합이 생길 시에 허용이 되지만, 실제로 2개로만 이루어지는 것이 아니라
- 아래의 그림처럼,, 여러가지 정책 설정의 교집합을 통해서 해당 Resource를 접근하는데 제한을 두는 것이다.
![Pasted-image-20230220095635.png](/img/이미지 창고/Pasted-image-20230220095635.png)

# AWS IAM Assume-role
![Pasted-image-20230220101808.png](/img/이미지 창고/Pasted-image-20230220101808.png)
- 본래의 AWS IAM은 AWS CLI를 통해서 해당 Resource를 접근제어 하게 됩니다.
- 하지만, 위의 사진에는 Policy가 아무것도 해당 되는 것이 없기 때문에, 원래 같다면, S3 Resource에 접근이 되지 않습니다.
- 이 과정에서 AWS IAM Role을 지속적으로 Policy를 할당하게 된다면, 계속 해서 Role이 붙게 되면서, 나중에는 해당 Role을 쓰지 않음에도 불구하고 지속적으로 Policy를 가지고 있게 된다.
- 이를 방지하기 위해서 AWS 에서는 <mark>Assume-role</mark>이라는 기능이  있다. -> role을 위임하는 것이다.
- 해당 Role을 위임하게 된다면, 위임된 Role은 Tocken을 발행해줍니다.
- 그리고 발행된 tocken을 가지고, 접근을 하게 됩니다.
![Pasted-image-20230221131744.png](/img/이미지 창고/Pasted-image-20230221131744.png)


---

#AWS #AWS_IAM #AWS_Security 

---



















