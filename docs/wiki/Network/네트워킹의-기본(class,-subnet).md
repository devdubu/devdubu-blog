---
slug: "네트워킹의-기본(class,-subnet)"
---
- [네트워킹의 기본(class, subnet)](#네트워킹의 기본(class, subnet))
- [IPV4 Class](#IPV4 Class)
	- [A Class](#IPV4 Class#A Class)
		- [Network bit](#A Class#Network bit)
		- [Host bit](#A Class#Host bit)
		- [특징](#A Class#특징)
	- [B Class](#IPV4 Class#B Class)
		- [Network bit](#B Class#Network bit)
		- [Host bit](#B Class#Host bit)
		- [특징](#B Class#특징)
	- [C Class](#IPV4 Class#C Class)
		- [Network bit](#C Class#Network bit)
		- [Host bit](#C Class#Host bit)
		- [특징](#C Class#특징)
- [Network 나누기 - CIDR](#Network 나누기 - CIDR)

---

# 네트워킹의 기본(class, subnet)

# IPV4 Class

![Untitled.png](/img/이미지 창고/Untitled.png)
. 을 기준으로 각각을 옥텟이라고 한다.

이 옥텟 중 첫번째 옥텟의 앞자리 숫자들을 바탕으로 Class를 구분한다.

A : 첫번째 비트 0

B : 첫번째 비트 1, 두번째 비트 0

C : 첫번째 비트 1, 두번째 비트 1, 세번째 비트 0

## A Class

![Untitled-1.png](/img/이미지 창고/Untitled-1.png)
### Network bit

A class에서의 network bit는 맨 앞에 식별자를 제외한 7비트만이 네트워크 비트이며,

네트워크를 구분 짓기 위해서 존재하는 bit이다.

### Host bit

해당 class와 network bit에 해당하는 host를 구분 짓기 위해서 만든 bit이다.

즉, 1개의 네트워크가 host bit 정도의 ip를 보유한다고 생각하면 된다.

---

### 특징

A clss는 host의 규모는 매우 크지만, network에 종류에 대한 부분은 매우 작다.

## B Class

![Untitled-2.png](/img/이미지 창고/Untitled-2.png)
### Network bit

B class에서의 network bit는 맨 앞에 두번째 식별자를 제외하고, 두 옥텟까지가 네트워크 비트이며,

네트워크를 구분 짓기 위해서 존재하는 bit이다.

### Host bit

해당 class와 network bit에 해당하는 host를 구분 짓기 위해서 만든 bit이다.

즉, 1개의 네트워크가 host bit 정도의 ip를 보유한다고 생각하면 된다.

---

### 특징

B class는 A class보다는 Network bit의 규모는 훨씬 크며, Host bit에 대한 규모는 작다.

## C Class

![Untitled-3.png](/img/이미지 창고/Untitled-3.png)
### Network bit

B class에서의 network bit는 맨 앞에 세번째 식별자를 제외하고, 세 옥텟까지가 네트워크 비트이며,

네트워크를 구분 짓기 위해서 존재하는 bit이다.

### Host bit

해당 class와 network bit에 해당하는 host를 구분 짓기 위해서 만든 bit이다.

즉, 1개의 네트워크가 host bit 정도의 ip를 보유한다고 생각하면 된다.

---

### 특징

C class는 Network bit의 규모가 훨씬 크며, 반대로 Host bit에 대한 규모는 작다.

# Network 나누기 - CIDR

우선 예를 들어 `211.11.124.0` ~ `211.11.124.255` 까지의 IP를 할당 받았다고 가정을 합니다.

![Untitled-4.png](/img/이미지 창고/Untitled-4.png)
기존에 방식대로라면, Class 별로 나눠야하지만, 클래스 단위로 분류를 하게 된다면 적절한 네트워크 크기로 구분할 수가 없다.

그래서 새로운 Subnet 이라는 개념을 들고 이를 가지고 분할을 시도 한다.

Subnet은 하나의 네트워크가 분할되어 나눠진 작은 네트워크라고 할 수 있다. 

예를 들자면 위의 IP주소를 2개로 분할하게 된다면, `211.11.124.127` 을 기점으로 두개가 나뉘게 된다. 즉,

![Untitled-5.png](/img/이미지 창고/Untitled-5.png)
이를 두개로 나눈 뒤에, 각각의 자릿수에 2진수로 표현하게 된다면, 위와 같 방법으로 표기가 가능하다.

그리고 자세히 보게 된다면

![Untitled-6.png](/img/이미지 창고/Untitled-6.png)
위의 네모칸만이 변화한다는 것을 알수 있다. 즉, 총 32개의 비트 중에서 25개의 비트는 고정적이고, 나머지 7개의 비트는 유동적인 것을 알 수 있다.

Subnet에서는 이를 아래와 같이 표현한다.

![Untitled-7.png](/img/이미지 창고/Untitled-7.png)
다시 예를 한번 더 들어보자면, 이번에는 subnet을 4개로 나누어본다고 했을 때

![Untitled-8.png](/img/이미지 창고/Untitled-8.png)
![Untitled-9.png](/img/이미지 창고/Untitled-9.png)
위의 코드 처럼 이런식으로 표현 된다. 그러면 2가지의 subnet으로 분류된 부분 보다 고정 부분이 1개가 더 늘어났으므로 표현하자면 아래와 같이 표현 된다.

![Untitled-10.png](/img/이미지 창고/Untitled-10.png)
이런 식으로 subnet network의 통상 의미를 통칭한다.

---

#Network

---