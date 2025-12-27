---
slug: "AWS-AMI"
---
# AWS Golden Image(AMI)
- Standard AWS EC2 Image
	- 필수 패키지 설치
	- 보안 조치 및 점검 완료
	- ...
- AWS IAM Policy를 통해 통제 가능
![Pasted-image-20230222104925.png](/img/이미지 창고/Pasted-image-20230222104925.png)
- Base가 된 Image를 알게 된다면, 해당 이미지를 토대로 지속적으로 EC2를 생성할 수 있기때문에 효율성 면에서도 AMI는 중요하게 차지하는 부분이다.
- 해당 AMI를 만들기 위해서는 EC2를 생성하기 위해서 필요한 Terraform 처럼, Hashicorp에서도 해당 AMI를 만들기 위해서 Packer라는 프레임웤을 제공합니다.
![Pasted-image-20230222131433.png](/img/이미지 창고/Pasted-image-20230222131433.png)
- Terraform Packer를 이용해서 EC2의 AMI를 통해서 신규 EC2로 만드는 것이다.

#### Packer
- Packer는 Build automated machine images tool이며,
- support multi platform(AWS, GCP, Azure, ...)
- Json & HCL2
![Pasted-image-20230222132422.png](/img/이미지 창고/Pasted-image-20230222132422.png)

![Pasted-image-20230222132449.png](/img/이미지 창고/Pasted-image-20230222132449.png)


---

#AWS #AWS_EC2 #AWS_AMI

---




































