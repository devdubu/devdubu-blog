---
slug: "Terraform-State"
---
- [Terraform Backend](#Terraform Backend)
	- [Local State](#Terraform Backend#Local State)
	- [Remote State](#Terraform Backend#Remote State)
- [Terraform Cloud](#Terraform Cloud)
		- [계정 등록](#Remote State#계정 등록)
- [Terraform 상태 관리(terraform state)](#Terraform 상태 관리(terraform state))
		- [옵션](#Remote State#옵션)
			- [show - 거의 사용하지 않음](#옵션#show - 거의 사용하지 않음)
	- [terraform state mv](#Terraform 상태 관리(terraform state)#terraform state mv)
	- [terraform rm](#Terraform 상태 관리(terraform state)#terraform rm)
	- [terraform state pull](#Terraform 상태 관리(terraform state)#terraform state pull)
- [특정 리소스 강제 교체(tf taint)](#특정 리소스 강제 교체(tf taint))
- [Terraform workspace 관리](#Terraform workspace 관리)
		- [옵션](#terraform state pull#옵션)

---


![https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1594969872/noticon/h5f5dlugmnwgbt3dvrzx.png](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1594969872/noticon/h5f5dlugmnwgbt3dvrzx.png)

# Terraform Backend

상태 관리를 위해서는 그 상태관리를 한 파일들을 보관해야하는 곳이 있어야한다. 이를 Terraform에서는 Backend라고 칭한다.

종류에 따라서 Local서버에서 저장하는 방식과 그 외에 저장하는 방식이 나뉘어지며, 종류는 다양하게 있다

- 종류
    - Local Backend
    - Remote Backend(Terraform Cloud) → 최근에 나왔지만, 기능이 파워풀 하다
    - AWS S3 Backend(with/without DynamoDB) → DynamoDB가 있을 땐 Locking 기능이 있다(없으면 없다)
    - kubernetes

Backend를 고려를 할 때 가장 중요한 고려 대상은 Locking이라는 기술이 들어가있냐 아니냐 이다.

- Locking?
    - 테라폼 상태 파일을 원격으로 관리할 때가 되면, 로컬 파일은 개인 작업만이 가능하다.
    - 하지만, Remote State는 다른 사람들과의 협업을 목적으로 하는 것이기 때문에 여러 사람들이 같은 파일을 만지게 된다.
    - 같은 파일을 만지거나 할 때는 이러한 동시성 이슈를 피해갈 순 없다.
    - 하지만 이 Locking은 먼저 실행을 한 사람에게 우선권을 주고 다른 사람들은 실행하지 못하도록 Lock을 걸어버리는 것이다.

## Local State

쉽게 말하자면, terraform.tfstate 파일을 의미한다. 이는 local 환경에서 남아있기 때문에 Local state라고 부른다.

## Remote State

해당 terraform 상태를 원격으로 남긴하고 하여서 remote state라고 한다.

예시를 들자면 우선

```bash
terraform{
	backend "s3"{
		bucket="terraform-backend-32"
		key="s3-backend/terraform.tfsate"
		region="ap-northeast-2"
	}
}
```

s3를 기준으로 세웠기 때문에 다른 backend는 포함이 안될 수도 있다.

우선 3가지의 value가 필요하다. bucket, key, region

- bucket : 버킷 명이다. 이는 global unique이다.
- key : s3 버킷 내에 file path를 의미한다.
- region : s3 버킷이 위치한 곳

![Untitled.png](/img/이미지 창고/Untitled.png)
그리고 난 후에 이런식으로 AWS S3에 접속해서 bucket을 만들어주면 된다.

그리고 `terraform.tfstate`가 변경되었기 때문에 다시 한번더 `tf init` 을 해줘야한다.

# Terraform Cloud

[Terraform Cloud by HashiCorp](https://app.terraform.io/)

그 후에 organization을 만든 뒤에 코드를 수정합니다.

```bash
terraform{
	backend "remote"{
	  hostname="app.terraform.io"
	  organization="Test_Cloud_Devdubu"

	  workspaces{
		  name = "fastcampus_Terraform"
    }
  }
}
```

- backend는 remote 로 변경
- hostname은 “app.terraform.io” 로 설정하면 된다.
- organization은 본인이 만든 혹은 본인이 속해져있는 organization을 적어주면 된다.
- workspaces도 마찬가지로 본인이 만든 workspace로 적어주면 된다.

### 계정 등록

![Untitled-1.png](/img/이미지 창고/Untitled-1.png)

우선 `tf init` 을 작성하게 되면 이렇게 인증 오류가 뜹니다. 이를 해결하기 위해서는 

```bash
vi ~/.terraformrc
```

```bash
plugin_cache_dir = "$HOME/.terraform.d/plugin-cache"
credentials "app.terraform.io"{
	token = "X61YYvQXyVr1pA.atlasv1.uUkaPjwr85yLpA2OseYU0l9YyoNJQFqK061BFDKUQVy2AJ2HhC3sRYaRBGeRiI0nxMY"
}
```

에서 본인의 tocken을 만들어가면 된다.

- Tocken 만드는 방법
 
![Untitled-2.png](/img/이미지 창고/Untitled-2.png)

![Untitled-3.png](/img/이미지 창고/Untitled-3.png)

![Untitled-4.png](/img/이미지 창고/Untitled-4.png)
- 이런식으로 이름을 입력하게 되면, url이 나오게 된다.
 

# Terraform 상태 관리(terraform state)

> terraform state [옵션]

### 옵션

| 옵션 | 설명 |
| --- | --- |
| `list` - 중요 | 현재 terraform storage에 관리중인 리소스의 상태를 알 수 있다. |
| `mv` - 중요 |  |
| `rm` - 중요 |  |
| `pull` |  |
| `push` |  |
| `replace-provider` | provider에 큰 변경사항이 있을 때 주로 사용한다. |
| `show` | 특정 resource 상태를 코드로 볼 수 있다. |

```bash
terraform state list #현재 workspace에서 관리중인 resource들을 알려준다.
```

![Screen-Shot-2022-09-21-at-6.52.16-PM.png](/img/이미지 창고/Screen-Shot-2022-09-21-at-6.52.16-PM.png)

#### show - 거의 사용하지 않음    
```bash
terraform state show aws_iam_group.developer
```

![Screen-Shot-2022-09-21-at-6.56.54-PM.png](/img/이미지 창고/Screen-Shot-2022-09-21-at-6.56.54-PM.png)
   

## terraform state mv

terraform 코드를 리펙토링을 할 때 많이 사용하는 명령어이다.

- 리펙토링
    - 비즈니스 로직은 건드리지 않고 코드만 바꾸는 작업을 하는 것을 의미한다.
    - 즉, 결과물은 동일하다.

기존 코드

```bash
resource "aws_iam_group" "developer" {
 name = "developer"
}

resource "aws_iam_group" "employee" {
 name = "employee"
}
```

리펙토링 코드

```bash
resource "aws_iam_group" "this"{
	for_each = toset(["developer", "employee"])

	name = each.key

}
```

기존 코드

```bash
resource "aws_iam_user_group_membership" "this" {
  for_each = {
    for user in var.users :
    user.name => user
  }

  user   = each.key

	# 밑 부분이 바뀜
	groups = each.value.is_developer ? [aws_iam_group.developer.name, aws_iam_group.employee.name] : [aws_iam_group.employee.name]
}
```

리펙토링 코드

```bash
resource "aws_iam_user_group_membership" "this" {
  for_each = {
    for user in var.users :
    user.name => user
  }

  user   = each.key
	# 밑 부분이 바뀜
	groups = each.value.is_developer ? [aws_iam_group.this["developer"].name, aws_iam_group.this["employee"].name] : [aws_iam_group.this["employee"].name]
}
```

이런식으로 바꾸게 된다면 

![Screen-Shot-2022-09-21-at-7.28.15-PM.png](/img/이미지 창고/Screen-Shot-2022-09-21-at-7.28.15-PM.png)

terraform 내부에서는 해당 user를 없애고 다시 만드려고 한다.

그렇다 보니 심각한 오류를 범할 수 있다. 이번 코드는 `tf apply`를 시켜도 ERROR로 작동되지 않는다.

그래서 이를 해결하기 위해서는 

```bash
tf state mv 'aws_iam_group.developer' 'aws_iam_group.this["developer"]'
tf state mv 'aws_iam_group.employee' 'aws_iam_group.this["employee"]'
```

위의 코드를 먼저 적용해야한다. 이는 각 변경된 사항마다 해주면 된다.

![Screen-Shot-2022-09-21-at-7.33.28-PM.png](/img/이미지 창고/Screen-Shot-2022-09-21-at-7.33.28-PM.png)

정상적으로 실행되는 것을 알 수 있다.

## terraform rm

- 위 명령어는 테라폼으로 더 이상 관리를 원하지 않는 경우에 사용한다.
- Terraform에서 사용하는 resource들은 완전히 다른 플랫폼으로 넘어가고 싶을 때, 해당 명령어를 사용하여, 특정 resource를 Terraform에서 관리했던 내역들을 모두 삭제하려는 의도이다.

![Untitled-5.png](/img/이미지 창고/Untitled-5.png)

실제 [main.tf](http://main.tf)파일에서는 해당 내역을 지우고 

→ `tf apply` 를 하게 된다면 우리 정서상으로는 에러가 걸리면 안된다.

- 당연하듯이 기존에 있는 건 삭제하고,
- 재 생성하면 되지 않는가? 라고 생각이 들지만,
- Terraform에는 무슨 의도인지는 모르겠지만, 그렇게 하면 에러가 난다.
- 그렇기 때문에 우선 main.tf의 사진 부분을 지우게 된다면

![Untitled-6.png](/img/이미지 창고/Untitled-6.png)

위의 사진 처럼 상단에 해당하는 policy를 지우려고 하는 창이 뜨게 된다.

![Untitled-7.png](/img/이미지 창고/Untitled-7.png)

이를 오류가 뜨지 않고 완벽하게 삭제하기 위해서는 우선 위에 destroyed를 하게된 목록을

```bash
tf state list
```

로 뽑아낸 list와 대조합니다.

```bash
tf state rm 'aws_iam_user_group_membership.this["alice"]'
tf state rm 'aws_iam_user_group_membership.this["tony"]'
```

그 후에 `tf apply` 를 하게 된다면, 특정 사람들만 지울수 있고 나머지가 모두 교체되는 그런 에러를 방지 할 수 있다

## terraform state pull

push 명령어도 있지만 이는 해당 state를 모두 덮어쓰기 때문에 왠만하면 안쓰는게 낫다

```bash
# 해당 state를 로컬로 당겨오는 명령어
tf state pull

# 해당 state를 해당 파일 이름(a.tfstate)로 당겨오는 명령어
tf state pull > a.tfstate
```

 

# 특정 리소스 강제 교체(tf taint)

- 이는 코드에는 변경이 없지만, 에러가 날 때 시도해 볼 만한 명령이다.

```bash
tf taint "module.vpc.aws_internet_gateway.this[0]"
# ""는 예시임
```

위의 명령어를 치게 된다면 module.vpc.aws_internet_gateway.this[0]이 잘 작동 되지 않는다고 표기하는 것이다.

![Untitled-8.png](/img/이미지 창고/Untitled-8.png)

![Untitled-9.png](/img/이미지 창고/Untitled-9.png)

상단의 사진을 보게 된다면 위에서 taint로 설정해놓은 internet_gateway가 문제가 있다고 판단하여 다시 replace된다고 표기 되어있다.

![Untitled-10.png](/img/이미지 창고/Untitled-10.png)

상단의 internet gateway가 알아서 id가 변경되는 것을 알수 있다. internet_gateway는 의존성이 있는 요소이므로, 이에 대한 부분은 테라폼이 알아서 고려하여 설정한다.

taint를 해제하려면

```bash
tf untaint "module.vpc.aws_internet_gateway.this[0]"
```

그리고 이와 유사한 명령어가 있습니다. 이는 apply 시에 붙이는 옵션으로 강제적으로 replace를 해주는 옵션입니다.

```bash
tf apply -replace "module.vpc.aws_internet_gateway.this[0]"
```

를 하게 된다면 해당 모듈을 강제적으로 replace를 해줍니다.

# Terraform workspace 관리

```bash
tf workspace [옵션]
```

### 옵션
  
| 옵션 | 설명 |
| --- | --- |
| list | 전체 workspace 목록을 조회 |
| select | workspace를 선택한다. |
| show | 현재 workspace를 보여준다. |
| new | 새로운 workspace 생성 |

![Untitled-11.png](/img/이미지 창고/Untitled-11.png)

Terraform의 workspace를 사용하게 되면 각각의 workspace들을 관리해주는 terraform.tfstate.d 라는 디렉토리를 만들게 된다.

이 디렉토리 안에서 prod라는 workspace를 따로 관리하게 되고, 다른 workspace를 만들게 된다면, 이 폴더 안에서 모두 관리하게 된다.

우선 예시를 한번 들어보겠습니다.

![Untitled-12.png](/img/이미지 창고/Untitled-12.png)

해당하는 variable “vpc_name”에서 `default = “defualt”`라는 값을 없앱니다.

그 후에

![Untitled-13.png](/img/이미지 창고/Untitled-13.png)

위 3개의 파일을 만든 뒤에 각각의 파일 안에 파일 이름에 맞게끔 내용을 작성해줍니다.

```bash
vpc_name="dev"
```

그 후에

```bash
tf workspace new dev
tf workspace new prod
tf workspace new staging
```

이런식으로 만약에 설정을 했으면 우선 dev workspace로 옮긴 뒤에 apply를 해보겠습니다.

```bash
tf workspace select dev
```

![Untitled-14.png](/img/이미지 창고/Untitled-14.png)

```bash
tf apply -var-file=dev.tfvars
```

기존에 workspace는 이런 느낌으로 사용이 가능하지만, terraform cloud를 사용하게 되면 해당 workspace에 대한 부분이 달라지게 된다. 그렇기 때문에 이애 대한 부분 공식 문서를 참고 하면 된다.

---

#IaC #Terraform 

---
