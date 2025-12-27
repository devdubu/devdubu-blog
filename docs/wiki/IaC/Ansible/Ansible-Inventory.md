---
slug: "Ansible-Inventory"
---
- [Inventory?](#Inventory?)
	- [Static Inventory](#Inventory?#Static Inventory)
		- [amazon.inv](#Static Inventory#amazon.inv)
		- [ubuntu.inv](#Static Inventory#ubuntu.inv)
		- [simple.inv](#Static Inventory#simple.inv)
		- [alias.inv](#Static Inventory#alias.inv)
		- [vars.inv](#Static Inventory#vars.inv)
	- [Dynamic Inventory](#Inventory?#Dynamic Inventory)
# Ansible Inventory
# Inventory?

- 인벤토리란, 대상 서버 호스트를 관리하는 파일이라고 한다.
- 하나의 파일 안에 Ansible이 관리하는 서버들이 적혀있다.
- 이때 Inventory는 그룹 기능을 지원한다.

## Static Inventory

- 현재 알아볼 인벤토리는 정적 인벤토리이다.
- 이는 Ansible에서 가장 기초적인 인벤토리를 뜻한다.
![Untitled.png](/img/이미지 창고/Untitled.png)
파일의 확장자가 `.inv` 로 되어있지만, 확장자에 대한 부분은 정해진게 없다 이는 규칙을 알아서 세우면 된다.

### amazon.inv
![Untitled-1.png](/img/이미지 창고/Untitled-1.png)
해당 인벤토리에는 저번에 만들었던 서버에 public IP 주소가 할당 되어있다.

본인 서버에 맞게끔 public ip주소를 할당하면 된다.

### ubuntu.inv

![Untitled-2.png](/img/이미지 창고/Untitled-2.png)
해당 파일에서는 AWS 서버에서 public DNS주소를 기입한 것을 알 수 있다.

→ 인벤토리 방법은 IP, DNS 모두 지원하기 때문에 편한 방법으로 사용하면 된다

### simple.inv

![Untitled-3.png](/img/이미지 창고/Untitled-3.png)
이 파일에서는 group기능을 이용하여 Invnetory를 구성하였다.

→ `all` 이라는 기본 그룹이 있다.

이는 해당 Inventory에 있는 모든 그룹을 포함하는 그룹이다.

### alias.inv
![Untitled-4.png](/img/이미지 창고/Untitled-4.png)
alias 파일에는 `별칭=IP, DNS` 이런식으로 구성이 가능하다.

해당 변수 이름으로 추후에 다른 곳에서 ip주소가 아닌 변수 명으로도 활용이 가능해진다.

### vars.inv
![Untitled-5.png](/img/이미지 창고/Untitled-5.png)
위에서 자세히 보게 된다면 ansible_user가 추가 된 것을 볼 수 있다.

이 의미는 ansible은 ssh로 접근을 한다. 이때 ssh로 접근 하려면 user의 이름이 있어야하기 때문에, 이와 같이 설정해야한다.

혹여라도 `ansible_user`라는 설정이 없다면 로컬 데스크탑의 사용자와 동일한 이름으로 `ansible_user`가 설정된다.

그리고 아래쪽을 보게 된다면 `[linux:childern]` 이라는 영역이 있다.

이는 하위그룹이라고 불리며, linux라는 그룹에 amazon, ubuntu를 포함한다는 듯으로 받아드리면 된다.

## Dynamic Inventory

- 동적으로 인벤토리를 관리한다.
- 인스턴스들이 동적으로 바뀔 때 사용하게 된다.

---

#IaC #Ansible

---
