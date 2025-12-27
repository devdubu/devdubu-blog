---
slug: "Packer-개요"
---
- [Packer 공식 사이트](#Packer 공식 사이트)
	- [왜 IMAGE를 사용하는가?](#Packer 공식 사이트#왜 IMAGE를 사용하는가?)

---

# Packer 공식 사이트

[Packer by HashiCorp](https://www.packer.io/)

Packer는 machine 이미지를 뜻한다 → AWS, Docker 모두 이미지 라는 파일이 필요하다. 이에 Packer는 이를 통합적으로 관리할 수 있게끔 설정해주는 것을 의미한다.

## 왜 IMAGE를 사용하는가?

현재까지 사용해보았듯이, Terraform은 초반에 환경을 셋팅하는데 매우 오랜 시간이 걸린다.

이를 통념적으로는 Warm Up이라고 부른다. 이 Warm Up은 보통 EC2머신이 만들어지고 난 이후에나 작동 되기 때문에 더 오래 걸리는 점도 있다.

하지만, AIM 이미지는 이미 초기에 셋팅이 완료된 상태로 구워져있기 때문에, 이런 웜업 시간이 없다고 봐도 무방하다.

![Untitled.png](/img/이미지 창고/Untitled.png)
현업에서는 이 Docs페이지를 참고하면서 문제를 풀어나아가면 된다.

![Untitled-1.png](/img/이미지 창고/Untitled-1.png)
특히 이중에서 우리는 Templates를 눈여겨 봐야한다. 그 중에서 HCL을 눈 여겨서 보면 된다. 하시코프사에서도 밀어주는 언어이고, 그에 대한 정보가 많이 있으므로, HCL 문법을 통해서 익혀주면 된다.

---

#IaC #Packer

---