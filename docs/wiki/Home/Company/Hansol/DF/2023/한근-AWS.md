---
시작 날짜: 2023-12-25
sticker: vault//이미지/미분류/개발로고 SVG/AWS.svg

slug: "한근-AWS"
---
# Hangeun AWS 아키텍쳐
Hangeun에서 사용되는 AWS 리소스와 아키텍쳐에 대한 그림입니다.
![DF 설계도.png](DF 설계도.png)
이를 바탕으로 위의 Terraform 코드를 작성했으며, 해당 Terraform 코드의 사용법은 아래와 같습니다

# 사용된 기술 스택

<table style={{border: 'black 1px solid'}}>
	<tr>
		<th> 사용 기술 스택 </th>
		<th> 사용 기술 스택 </th>
		<th> 사용 기술 스택 </th>
	</tr>
	<tr>
		<td rowspan="3"> AWS Serverless </td>
		<td> AWS Lambda </td>
		<td> NodeJS를 이용한 FasS 구축 </td>
	</tr>
	<tr>
		<td> AWS API Gateway </td>
		<td> L7으로의 LoadBalencing 기능 </td>
	</tr>
	<tr>
		<td> AWS Amplify </td>
		<td> L7으로의 LoadBalencing 기능 </td>
	</tr>
	
</table>



| 사용 기술 스택 | 기술 이름 | 특징 | 
| -- | -- | -- |
|AWS Serverless | AWS Lambda | NodeJS를 이용한 FasS 구축 | 
| | AWS API Gateway | L7 Load Balencing |




## Terraform 설치
### MacOS 기준
```bash
brew tap hashicorp/tap
brew install hashicorp/tap/terraform

# terraform 이 정상적으로 설치 됐는지 확인
terraform --version
```

## Terraform 코드로 이동
```bash
cd terraform
```

## Terraform 초기화
```bash
terraform init
```

## Terraform 코드 활성화
```bash
terraform apply

# 이후 나오는 멘트에서 yes 입력합니다.
```

- 위의 작업이 끝난다면, AWS 리소스는 사용준비가 끝나게 됩니다.

