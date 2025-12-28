---
slug: "AWS-Control-Tower"
---
# AWS Control Tower
![Pasted-image-20230628224104.png](/img/Pasted-image-20230628224104.png)



# 사용 방법

![Screenshot-2023-06-28-at-10.44.00-PM.png](/img/Screenshot-2023-06-28-at-10.44.00-PM.png)
- AWS Console 에서 Control Tower로 접속 합니다.
![Pasted-image-20230628224456.png](/img/Pasted-image-20230628224456.png)
- 위 그림과 같이 <mark>리전</mark> 선택 후에 `Set up Landing Zone`을 클릭 합니다.

:::tip Step1 Review pricing and select Regions 입력 항목
- Home Region : Asia Pacific(Seoul)
- Region deny setting : Not endabled
- Addtional AWS Regions for governance: 입력하지 않음

:::

- `Region deny setting`을 Enable 하게 되면, Control Tower에서 관리 되지 않은 리전은 접근을 금지 시키는 보안 룰이 적용 됩니다.
- 실습 환경에서는 `Not Enabled`로 설정을 수행 합니다. 
	- 이러한 설정은 Control Tower가 배포된 이후 Setting 메뉴에서 변경이 가능합니다.

:::tip Step2 Configure organizational units(OUs) 입력 항목
- Foundational OU : **Security**
- Additional OU : **Production**

:::

- 네이밍은 개별적을 지어주어도 된다.

:::tip Configure shared accounts and encryption

:::
