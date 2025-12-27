---
slug: "AWS-VPC-실습"
---

# VPC 생성

![Untitled.png](/img/이미지 창고/Untitled.png)
우선 AWS 콘솔에 접속 후 검색 창에 VPC를 검색후에 누른다. 그리고 콘솔 창이 보일텐데 왼쪽 메뉴란에 VPC를 누른다.

![Untitled-1.png](/img/이미지 창고/Untitled-1.png)
위 사진과 같이 VPC에 접속하면 Name이 - 인 것이 보일 것이다. 이는 본인이 계정을 생성했을 때 자동으로 default VPC로 설정되는 것이다. 우리는 우리만의 VPC를 생성할 것이다.

우선 우상단에 있는 VPC 생성을 누른다.

![Untitled-2.png](/img/이미지 창고/Untitled-2.png)
후에는 아래의 그림에 VPC를 작성해주면 된다.

![Untitled-3.png](/img/이미지 창고/Untitled-3.png)
이름 태그에는 VPC의 이름을 적어주시면 되고,

IPv4 CIDR에 대한 부분은 저번에 알아갔던 IPv4 CIDR을 그래도 적용해주면 된다.

저는 예시로는 

IPv4는 CIDR을 `10.0.0.0/16` 으로 적용했습니다.

후에는 하단에 VPC 생성을 누르게 되면 정상적으로 VPC가 생성됨을 알 수 있습니다.

# Subnet 생성

![Untitled-4.png](/img/이미지 창고/Untitled-4.png)
서브넷을 먼저 설정할 예정이므로, 서브넷을 누른다.

처음 서브넷에 들어가게 되면 한개가 생성이 되어있을 것이다. 이 Subnet은 우리가 AWS 계정을 가입하면 자동으로 생성되는 Subnet인 셈이다.

이는 무시하고 우리는 새로 private 과 public VPC를 할당할 것이다. 우선 VPC 설정을 위해서 서브넷 생성을 누른다.

![Untitled-5.png](/img/이미지 창고/Untitled-5.png)
![Untitled-6.png](/img/이미지 창고/Untitled-6.png)
서브넷 생성을 누르게 된다면, VPC ID를 입력하라고 한다.

즉, 우리가 전에 만들었던 VPC를 활용하면 된다.

VPC를 선택하게 된다면,

![Untitled-7.png](/img/이미지 창고/Untitled-7.png)
이런 식으로 서브넷 설정이 뜨게 된다.

당연하게도 작성해주면 되고, 또한 상단에 IPv4 CIDR이 뜨기 때문에 이를 참고하고 서브넷의 IPv4의 CIDR 블록을 작성해주면 된다.

### 서브넷 이름

- 서브넷을 나타내는 이름을 작성하면 된다.

### 가용 영역

- 저번에 알아갔던 것처럼 서브넷이 상주할 영역을 선택합니다. AZ가 다르게 되면 서브넷이 통신이 안되기 때문에
- public, private 두개를 실습하려면 웬만하면 같은 AZ로 통일 해줍니다.
    
    ![Untitled-8.png](/img/이미지 창고/Untitled-8.png)

### IPv4 CIDR

- Subnet의 갯수에 따라 달라지므로 미리 계산에 들어간 후에 작성해주면 된다.

# Internet Gateway 생성

![Untitled-9.png](/img/이미지 창고/Untitled-9.png)
인터넷 게이트웨이 만드는 건 어렵지 않습니다. 우선 인터넷 게이트웨이에 들어갑니다.

그리구 난 후에 인터넷 게이트웨이 생성을 누릅니다.

![Untitled-10.png](/img/이미지 창고/Untitled-10.png)
그리고 생성 화면에서는 별 다른 설정이 뜨진 않습니다.

![Untitled-11.png](/img/이미지 창고/Untitled-11.png)
간단하게 이름만 적어주시면 끝이 납니다.

# Router Table

위 설정이 끝나면 그러면 인터넷이 연결이 된건가? 라고 느끼실 수 있는데 아닙니다. Router Table에서 각각 포진 되어있는 로컬 서버와 IGW를 연결 시켜줘야지 서로 연결이 됩니다. 그렇기 때문에 나머지를 만들었다고 해서 자동으로 연결되는 건 아닙니다.

우선 Router Table 설정하러 가자면 좌측 메뉴에 라우팅 테이블을 누릅니다.

![Untitled-12.png](/img/이미지 창고/Untitled-12.png)
그러면 라우팅 테이블이 리스트로 나오게 되는데 처음 라우팅 테이블은 VPC 1개를 생성하게 되면 1개가 자동 생성됩니다. 하지만, 저희는 하나의 subnet당 하나의 라우팅 테이블을 가집니다.

왜냐하면 한개는 private → 내부망에서만 접속 가능한 라우팅 테이블, public → 내, 외부망 모두 접속 가능 하게 설정 하므로 두개의 subnet이 설정이 다릅니다.

그렇기 때문에 이는 각각의 라우팅 테이블을 할당하는 것이 좋습니다. 우선 자동 생성된 한개는 private-rtb로 두고, public-rtb를 생성해 봅시다.

![Untitled-13.png](/img/이미지 창고/Untitled-13.png)
라우팅 테이블 생성을 누른 후에

![Untitled-14.png](/img/이미지 창고/Untitled-14.png)
라우팅 테이블 생성에서의 설정도 뭔가를 연결하거나 하는 설정이 없다.

즉, 생성란에서는 연결하는 단계는 없는 것이니, 아직도 외부망 연결은 안되는 것이다.

## 외부망 연결(라우팅)

![Untitled-15.png](/img/이미지 창고/Untitled-15.png)
왼쪽 처럼 본인이 생성한 라우팅 테이블을 누른 후에 라우팅 탭을 누르게 된다면

라우팅 테이블이 하단에 뜨게 된다.

왼쪽 사진은 필자가 이미 실습으로 IGW에 연결해놓은 상태이기 때문에 2개의 라우팅 테이블이 뜨는 거지만, 독자 분들은 한개만 뜰것입니다. 

![Untitled-16.png](/img/이미지 창고/Untitled-16.png)
위의 설정만 뜰 것입니다. 우선 IGW를 어떻게 연결하냐면,

![Untitled-17.png](/img/이미지 창고/Untitled-17.png)
라우팅 편집을 누른 후에, 아래의 라우팅 추가를 누릅니다.
![Untitled-18.png](/img/이미지 창고/Untitled-18.png)
대상에는 우선 저희는 모든 IP 주소를 IGW로 보낼 것이기 때문에, `0.0.0.0/0` 으로 설정 하고 난 후에 변경사항 저장을 누릅니다.

![Untitled-19.png](/img/이미지 창고/Untitled-19.png)
이 방식으로 저장이 됩니다.

모든 IPv4 주소를 IGW로 보내게 된다면 위에 있는 `10.0.0.0/16` 는 의미가 없는거 아닌가요? 라고 말씀하실 수 있는데, 이를 AWS는 순서도로 표에 넣었습니다.

순서가 `10.0.0.0/16` → `0.0.0.0/0` 이기 때문에 `10.0.0.0/16` 인 IP 주소는 Local로 갈 것이고 `10.0.0.0/16` 이 아닌 IP 주소는 그 다음 라우팅 주소인 `0.0.0.0/0` 에 포함 되므로, IGW에 연결 되게 됩니다.

이 방식이 되면 IGW - Router Table과의 연결은 끝이 납니다. 

하지만, 아직 subnet-Router Table과의 연결을 하지 않았습니다. 이를 하기 위해서는 서브넷 연결 탭을 클릭합니다.

![Untitled-20.png](/img/이미지 창고/Untitled-20.png)
![Untitled-21.png](/img/이미지 창고/Untitled-21.png)
그 후 본인이 연결해야하는 서브넷을 연결해주면 

IGW - Router Table - Subnet 이 연결이 완성 됩니다.

# NACL 설정

이제는 보안에 신경을 써봐야겠죠, IP에 대한 설정을 마쳤으니, Port 번호에 대한 보안을 설정하러 가겠습니다. NACL을 설정하러 가려면 왼쪽 메뉴에 보안 → 네트워크 ACL을 누르시면 됩니다.

![Untitled-22.png](/img/이미지 창고/Untitled-22.png)
NACL 또한 VPC가 생성됨에 따라 defualt로 자동 생성됩니다.

우선 자동 생성된 NACL 말고 public NACL을 한번 만들어보겠습니다. 그러려면 우상단에 있는 네트워크 ACL 생성 버튼을 눌러줍니다.

![Untitled-23.png](/img/이미지 창고/Untitled-23.png)
다른 설정과 마찬가지로, VPC 설정 외에는 따로 건드릴 것이 없습니다.

NACL을 생성하게 된다면 총 3가지의 설정을 해줘야합니다. 먼저

## 인바운드 규칙 & 아웃바운드 규칙

우선 인바운드 규칙과 아웃바운드 규칙을 설정해야합니다.

인바운드와 아웃바운드 규칙은 서로 설정이 똑같으므로 한 가지만 설정해보겠습니다.

![Untitled-24.png](/img/이미지 창고/Untitled-24.png)


우선 네트워크 NACL을 누르고, 인바운드 규칙 탭을 누르게 되면 위의 화면이 뜨게 됩니다. 필자는 이미 설정을 마쳤기 때문에, 위에 처럼 떠 있는 것이지만, 독자 분들은 한개만 있을 거라고 생각이 듭니다.

특정 포트 혹은 모든 포트를 추가하려면 인바운드 규칙 편집 버튼을 눌러야합니다.

![Untitled-25.png](/img/이미지 창고/Untitled-25.png)

이런 식으로 본인이 희망하는 포트 번호 IP 등등을 추가해서 보안성을 높이면 된다.

이때 중요한 정보는 규칙 정보이다.

규칙 정보는 위에 Router Table에서 보았듯이, 규칙 번호가 적을 수록 순번이 높은 것이다. 

즉, 80 번 포트가 오게 된다면, 규칙 번호 1번이 우선 적용되어서 적용 되고, 그 다음에는 100번 그 다음에는 너 높은 규칙 번호가 적용 되어서 규칙이 적용 된다.

이는 아웃 바운드 규칙과 동일한 규정이다.

마찬가지로 NACL도 결국은 subnet과 붙어 있기 때문에 subnet 연결을 필수적이다.

![Untitled-26.png](/img/이미지 창고/Untitled-26.png)

당연하게도 서브넷 연결 탭을 클릭 후 서브넷을 연결하려면 서브넷 연결 편집을 누르면 

![Untitled-27.png](/img/이미지 창고/Untitled-27.png)

이런 식으로 어디서 되게 많이 본듯한 화면이 뜨게 된다. 이를 이용해서 서브넷을 연결만 해주면 NACL 설정이 완료 된다.

# Bastion Host 만들기

Bastion Host는 개념이 어려운 것이지, putty를 이용해서 key를 등록 시키면, public ec2로 접속 한 후에 public ec2 → private ec2로 연결 하는 작업이다. 어렵진 않은 작업이므로 따로 작성하진 않겠습니다.

# NAT Gateway 만들기

NAT Gateway는 Bastion Host처럼 private ec2를 외부 망과 연결해주는 방법 중 한 개 입니다. 이는 따로 AWS에서 서비스를 제공하므로 설정해줘야합니다. 왼쪽 메뉴바에 NAT 게이트웨이

를 누릅니다.

![Untitled-28.png](/img/이미지 창고/Untitled-28.png)
우선 NAT 게이트웨이를 누른 후에 NAT 게이트웨이 생성을 누릅니다

![Untitled-29.png](/img/이미지 창고/Untitled-29.png)
우선 NAT Gateway에 이름을 작성하고,

서브넷을 설정합니다. 이때는 private → public → 외부망의 순서로 가기 때문에

NAT Gateway는 private아닌 public subnet 으로 설정해줍니다.

![Untitled-30.png](/img/이미지 창고/Untitled-30.png)
그 후에 IP를 할당 받아야하는데, 이는 탄력적 IP할당 버튼을 누른 후에 따로 IP를 할당 받습니다.

![Untitled-31.png](/img/이미지 창고/Untitled-31.png)

후에 생성 모든 설정이 완료 되면 생성 버튼을 누릅니다.

이후에 private ec2에 접속을 하게 된다면 여전히 다운로드가 되지 않습니다.

당연하게도 IP를 따로 할당 받았기 때문에 라우팅 테이블에 연결 작업이 필요하게 됩니다.

이렇게 설정 한 후에 위 페이지 처럼 라우팅 테이블로 가서 설정을 합니다.

### 라우팅 테이블 - NAT Gateway 연결

![Untitled-32.png](/img/이미지 창고/Untitled-32.png)

으로 들어간 후에 라우팅 편집을 누릅니다

![Untitled-33.png](/img/이미지 창고/Untitled-33.png)

후에 위 사진과 같이 `0.0.0.0/0` 으로 대상을 설정한 후에 net- 라고 작성 후에 나오는 NAT Gateway로 선택 하시고 변경사항 저장 버튼을 누르시면 변경이 완료 됩니다.

이후에 EC2로 다시 접근을 하신다면 외부망과 성공적으로 연결된 모습을 보실 수 있습니다.

# Gateway EndPoint 설정

## IAM 설정

Gateway endpoint 설정을 하기 앞서서 IAM으로 EC2의 권한을 설정해보도록 하겠습니다.

![Untitled-34.png](/img/이미지 창고/Untitled-34.png)

우선 검색 창에 IAM을 검색하고 서비스를 클릭합니다.

![Untitled-35.png](/img/이미지 창고/Untitled-35.png)
서비스에 접근하면 좌측 메뉴에 역할 탭을 클릭합니다.

![Untitled-36.png](/img/이미지 창고/Untitled-36.png)
역할 서비스를 클릭하면, 역할 만들기 버튼을 누릅니다.

![Untitled-37.png](/img/이미지 창고/Untitled-37.png)

각각을 선택 해준 후에 다음 버튼을 눌러줍니다.

이번에 저희는 S3에 대한 권한을 부여할 것이므로, 검색 창에 S3를 검색하고, AmazonS3FullAcess를 눌러줍니다.

![Untitled-38.png](/img/이미지 창고/Untitled-38.png)
후에 다음을 눌러줍니다.

AmazonS3FullAccess는 말 그대로 S3의 Full Acess권한을 주는 것입니다.

![Untitled-39.png](/img/이미지 창고/Untitled-39.png)
후에 이름을 기입하고 밑에 내려서 생성을 누르면 성공적으로 생성이 됩니다.

![Untitled-40.png](/img/이미지 창고/Untitled-40.png)
이런 식으로 생성 된 것을 확인 할 수 있습니다,

이는 EC2 인스턴스를 생성할 때 IAM 권한 설정해주면 됩니다.

![Untitled-41.png](/img/이미지 창고/Untitled-41.png)
EC2머신 생성 시에 이 곳에서 IAM 생성을 하시면 됩니다.

그리고 EC2의 새로운 인스턴스를 추가한 후에 IAM을 s3로 할당 후에, VPC 설정 후에 subnet은 private으로 설정하고 인스턴스를 생성합니다

그리고 public ec2를 이용해서 접속 한 후에 ssh 접속으로 private의 프라이빗 IPv4 주소로 접속하면 성공입니다.


---

#AWS #AWS_VPC

---