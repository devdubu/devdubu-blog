# Nexus란?
- 보통 사내에서 외부에 있는 저장소를 구축해서 연결하기란 매우 어려운 작업입니다.
- 당연하게도 보안 문제가 있기 때문이죠.
- 그렇기 때문에 내부에 저장소를 배치하여서 많이 활용합니다.
![Pasted-image-20230109140101.png](/img/Pasted-image-20230109140101.png)
## 사내 저장소를 사용하는 이유
1. 보안이슈에서 자유로워진다.
	1. 외부망을 활용할 일이 없기 때문에, 보안 이슈가 사라집니다.
2. 라이브러리 버전 관리의 용이
3. 개발자 끼리 협업하기 편해진다.
	1. 컴포넌트끼리 공유가 되므로 확인이 쉬워집니다.

# Nexus의 장점
![Pasted-image-20230109140531.png](/img/Pasted-image-20230109140531.png)
1. 메인 저장소의 cash 저장소 역할을 합니다.
	1. 그렇기 때문에 build시에 architect가 빠른 빌드가 가능합니다.
	2. 외부에 공개 하기 꺼리는 아키텍트 같은 경우에는 private한 저장소에 저장하여 관리할 수 있습니다.
2. 보안이 강화됩니다.
	1. 외부와 인터넷 연결이 없어도 내부에 있는 private repository를 통해서 연결이 가능하므로, 외부와 연결할 일이 없어서 보안적으로 우수합니다.
# Nexus와 Jenkins CI와의 연동
- Nexus가 어떤 방식으로 사용되는지 아래의 flow를 보시면 알 수 있습니다.
![Pasted-image-20230109140836.png](/img/Pasted-image-20230109140836.png)
- 개발자가 IDE에서 개발을 하게 된다면, 그 후에 빌드를 할 때는 gradle 서버가 아닌 Nexus서버에서 해당 빌드 정보를 받아옵니다.
- 그리고 개발자가 깃허브에 커밋을 하고, jenkins가 이를 build를 할 때, Nexus에 있는 라이브러리를 통해서 해당 라이브러리를 가져옵니다.

## Nexus 소개
![Pasted-image-20230109142916.png](/img/Pasted-image-20230109142916.png)
- Nexus로그인 후 첫 화면 입니다.

### Blob Store
![Pasted-image-20230109143146.png](/img/Pasted-image-20230109143146.png)
- 모든 Repository는 BlobStore에 지정해야합니다.
- Blob Store는 hosted 나 proxy repository를 통해서 배포된 아티펙트를 저장하는 repository를 의미한다.

### Nexus Repository
![Pasted-image-20230109143408.png](/img/Pasted-image-20230109143408.png)

### Nexus Repository Type
![Pasted-image-20230109143748.png](/img/Pasted-image-20230109143748.png)
- Hosted : 기본 타입으로서, 회사 내에서 개발한 jar파일, 회사에서 제품 개발을 하기 위해서 개발한 jar파일을 관리하는 타입을 말한다.
- Proxy : 중앙 repository와 외부 repository에 proxy 역할을 해줍니
- Virtrual : 서로 다른 타입의 리포지토리를 연동하기 위한 Adapter 역할을 한다.
- Group : 여러 개의 Repository를 묶어주는 역할을 한다.

### Nexus Repository
![Pasted-image-20230109144527.png](/img/Pasted-image-20230109144527.png)
- 단일 Repository로도 개발, 운영 등등으로 분리해서 활용도 가능합니다.
- Nexus는 온프레미스, 클라우드 모두 활용이 가능합니다.
- 위의 그립과 같이 Group으로도 묶어서 용도별로 활용이 가능합니다.


---

#CICD #Nexus

---