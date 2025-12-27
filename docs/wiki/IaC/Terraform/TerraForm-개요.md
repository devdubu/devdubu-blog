---
slug: "TerraForm-개요"
---
- [TerraForm](#TerraForm)
- [Write](#Write)
- [Plan](#Plan)
- [Apply](#Apply)
- [Registry](#Registry)
	- [Providers](#Registry#Providers)
	- [Modules](#Registry#Modules)
	- [Terraform의 WorkFlow](#Registry#Terraform의 WorkFlow)

---

# TerraForm

TerraForm은 Write, Plan, Apply에 대한 개념을 강조하고 있다.

# Write

![Untitled.png](/img/이미지 창고/Untitled.png)
TerraForm을 만든 HashiCorp는 다양한 인프라 언어들을 만들었습니다.

그 중에서 YAML 언어와 비슷한 HashiCorp Configuration Language(HCL) 을 통해서 인프라 코드를 작성할 수 있다.

← AWS EC2 서버를 정의하는 HCL이다.

 

# Plan

![Untitled-1.png](/img/이미지 창고/Untitled-1.png)

plan을 통해서 해당 인프라 코드가 어떤 변화를 가져올 지 확인이 가능하다.

맨 하단에 있는 Plan 결과가 가장 중요하다는 것을 알 수 있습니다.

> Plan : 1 to add, 0 to change, 0 to destory
> 

라고 하단에 적혀 있는데

이는 인프라 리소스가 1개 추가 될 예정이고, 변경점은 없고, 삭제 될 리소스 또한 하나도 없다라는 뜻이다.

변경사항에 대한 새부 사항들은 왼쪽 `#aws_ebs` 부터 중괄호 까지 세부사항으로 나와있다.

- size : AWS의 EBS 볼륨 → 100gib 사이즈의 볼륨을 가지고 있다.

# Apply

이런식으로 변경 사항이 확인이 된다면, TerraForm Apply 명령을 실제로 인프라를 구축하면 된다.

# Registry

![Untitled-2.png](/img/이미지 창고/Untitled-2.png)

Registry는 개발을 하면서 많이 찾아볼 문서이다. 알아두면 많이 도움이 될 것이다.

Registry는 패키지 저장소와 같이 생각을 하면 된다. TerraFrom은 서드파티가 Providers와 Modules를 제공한다.

## Providers

![Untitled-3.png](/img/이미지 창고/Untitled-3.png)

- AWS
- GCP
- Azure

등 서비스를 제공할 수 있는 플랫폼을 의미한다. 즉, AWS provider를 이용하면 AWS 인프라를 관리 할 수 있는 것이다.

![Untitled-4.png](/img/이미지 창고/Untitled-4.png)

해당 Provider 창에 들어가게 되면 이러한 화면이 뜨게 되는데 여기서 github repository를 누르게 된다면 해당 이슈를 알려주게 되고,

Documentation을 누르게 된다면 아래의 창 처럼

![Untitled-5.png](/img/이미지 창고/Untitled-5.png)

AWS TerraForm을 어떤 식으로 작성해야하는지에 대한 Reference를 볼 수 있게 된다.

## Modules

- 인프라 리소스의 템플릿
    - 즉, OpenVPN 이라는 명명을 만들고 그 안에
        - AWS EC2 instance
        - security group
        - abs module
- 등을 묶어서 템플릿 처럼 사용 가능하게 만든 것이다.

![Untitled-6.png](/img/이미지 창고/Untitled-6.png)

TerraForm 모듈로 가게 된다면 다른 사람들이 정의 해놓은 모듈도 볼 수 있다.

## Terraform의 WorkFlow

[The Core Terraform Workflow - Guides | Terraform by HashiCorp](https://www.terraform.io/intro/core-workflow)

---

#IaC #Terraform 

---