---
slug: "Git-Branch-Strage"
---
# Git Flow
브랜치 전략하면 가장 먼저 떠오르기도 하고, 많은 회사와 팀에서 기본으로 사용하고 있는게 Git Flow 전략이라고 생각한다. Git Flow의 특징 몇가지만 살펴보면,

1. 각 용도에 맞게 main(master), develop, feature, release, hotfix 브랜치를 분리해서 사용
2. 명확한 릴리즈 기간과 주기적인 버전이 정해진 프로덕트를 개발하는 환경에 적합
3. 릴리즈 버전 관리를 위한 release 브랜치를 따로 관리하기 때문에, 특정 버전에 대한 유지보수 기간이 길고, 여러 버전을 동시에 관리해야 할 필요가 있을때 유용함
4. 2, 3과 같은 장점 때문에 소규모 팀보다는 규모가 있는 팀에 더 어울림

이렇게 4가지 정도로 특징을 정리할 수 있다.

  
![git-flow](https://sungjk.github.io/images/2023/02/20/git-flow.png "git-flow")
우리 팀도 마찬가지로 Branch 전략에 Git Flow를 사용하기로 했다. 
맨 처음에 어떤 이유 때문에 Git Flow를 사용하기로 했는지 정확히 기억은 안나지만, 위에 나열한 특징 외에도 아래 항목들을 추가로 고려했지 않았을까…

1. <mark>운영 환경(Production)</mark> 배포 브랜치와 <mark>개발 환경(Develop)</mark> 배포 브랜치를 명시적으로 분리해서, 운영 환경에 어떤 코드 베이스가 배포 되어 있는지 한 눈에 확인할 수 있다는 점
2. 운영 환경에 <mark>언제 배포해도 상관없는 Stable 브랜치</mark>(main)를 별도로 관리해서, 장애 혹은 버그 수정이 필요한 경우 <mark>main 브랜치</mark>를 기준으로 <mark>빠르게 수정</mark>
3. 아직 테스트가 완료되지 않은 피쳐가 운영 환경에 배포되는 걸 방지하기 위함(2번과 관련)
4. 그리고 마지막, 모두에게 가장 익숙한 브랜치 전략

역사엔 다양한 이유가 있듯이, 이 과정에도 더 많은 이유와 외부 환경 때문에 어쩔 수 없는 것들이 함께 반영 되었을 텐데 당장 떠오르는 건 이렇게 4가지 정도다. 
새로 만들고 있는 서비스의 경우엔 자유롭게 단일 브랜치를 사용했는데, 사용자에게 릴리즈 된 서비스는 모든 팀이 Git Flow 브랜치를 바탕으로 개발하고 안전하게 배포까지 했다.

### 배포 열차
배포 열차가 필요한 이유. 
우리 팀이 만들고 있는 제품과 업의 특성상 Production 환경에 자유로운 배포는 불가능하다. 
제품을 만들어 나가는 개발자와 별개로, 배포를 하기 전에는 <mark>항상 배포 승인자</mark>의 승인이 필요하다.
배포가 많아지면 많아질수록 배포 승인자는 리뷰와 승인에 할애하는 시간이 많아지고 하루의 대부분 시간을 <mark>배포 승인에 쏟아야 하는 상황</mark>까지 생길 수 있었다. 
전체 팀의 규모는 작지만, 다양한 서비스들이 동시에 만들어지고 있다 보니 <mark>배포 대상 서비스</mark>도 많았다. 
그래서 우리 팀은 매주 수요일이면 수요일, 목요일이면 목요일에 정기 배포 요일을 정하고, 그 날에는 배포를 집중적으로 하기로 했다. 
<mark>리뷰, 승인, 배포, 모니터링</mark> 등 어느 요일 오후에 집중해서 끝내기로. 
정기 배포 요일과 별개로 다른 날에도 배포가 필요하면 비 정기 배포를 하곤 했다.
그래서 매주 정기 배포 요일의 오후가 되면 <mark>배포 열차</mark>가 떠나고, 탑승한 팀원들은 배포 모니터링을 시작한다.

### 지옥철
처음엔 아무런 문제나 불편한 점이 없었는데, <mark>정기 배포를 1년 이상</mark> 하다 보니 배포 과정에서 생기는 비효율적인 면과 불안함도 생겼다. 
배포 열차니까 굳이(실제론 여유로움) 비유하자면 <mark>지옥철</mark>이라고 표현할 수 있을까. 
일단 탐승해야 하니까 뒤죽박죽 낑겨서라도 탑승. 
불편함이 상당하지만 어쩔 수 없다. 
사람이 많아질수록 통제가 어려워지는 것과 마찬가지로, <mark>배포 대상 서비스(마이크로서비스)</mark>가 늘어나면서 <mark>배포 진행 중</mark> 혹은 그 이후에 <mark>발생한 이슈가 어떤 서비스의 영향 때문</mark>인지 <mark>추적</mark>하기가 어려워지고, 릴리즈에 포함된 변경 사항이 너무 많아서 확인에 어려움이 생긴다. 
날짜를 특정해서 전체 배포를 하니 더욱더.

그리고 배포 대상 서비스가 늘어가는 것과 별개로, 우리 팀의 일하는 방식이 <mark>배포 프로세스</mark>와 맞지 않아서 생기는 불안함도 생기기 시작했다. 
우리 팀은 <mark>속도가 굉장히 빠른 편</mark>인데, 속도가 빠르다는건 그만큼 릴리즈도 많이 하고 릴리즈에 포함된 변경 사항이 상당하다는 걸 의미한다. 
사소한 버그라도 사용자에게 치명적인 금융 서비스를 만들고 있다보니, 자동화된 테스트 뿐만 아니라 꼼꼼한 리뷰도 중요하다. 
모든 피쳐들이 개발 환경이나 테스트 단계에서 검증되어서 실제로 문제는 없었지만, 난 배포 열차가 출발하는 날이면 <mark>Release 브랜치</mark>에 있는 탑승 대기 중인 코드들을 매번, 모두 살펴보았다. 
한 주 동안 새로 추가되고 수정되고 삭제되는 코드 라인이 정말 많았는데, 마음 편하게 열차를 떠나 보내고 싶었다. 
겉으론 아무렇지 않아보였지만, Deploy 버튼을 누를 때면 심장 박동수가 조금씩 올라갔다. 
지금 생각해보면 이미 검증된 코드를 한 번 더 사서 고생했다는 생각도 드는 한편, 그 때의 꼼꼼함이 성장에 많은 도움이 된거 같기도 하고.

잠깐 배포의 불안함에 대해서 이야기 했는데 다시 돌아와서. 
오랫동안 정기 배포를 하다보니 매주 Git Flow 때문에 발생하는 비효율적인 면도 보이기 시작했다. Git Flow 브랜치 전략은 코드 릴리즈를 위해 release 브랜치를 생성하고 생성된 release 브랜치에서 테스트(QA)를 마친 후에 Stable 브랜치(main)로 합친다(merge). 
우리팀도 마찬가지로 매주 정기 배포 요일이 되면 아래와 같은 일을 하고 있었다.

1. develop 브랜치에서 release branch 생성
2. release 브랜치를 main 브랜치로 merge 하는 PR 생성(CI, Build)
3. main 브랜치에 merge 후 release tag 생성

Git Flow의 장점 중 하나는 <mark>release 브랜치를 별도로 관리</mark>해서 배포 전에 테스트할 수 있는 환경을 만들 수 있다는 것인데, 아직 우리는 이런 환경(Beta/Staging과 별개로 흔히 얘기하는 QA 환경)이 갖춰져 있지 않아서 별도의 테스트를 하지 않고 바로 main branch로 코드를 합쳤다. 

그리고 정기 배포 요일에는 모든 서비스들의 배포 준비 때문에 CI 작업이 몰리면서 적어도 30분 정도는 기다리고만 있어야 했다. 
release branch 만들고, main branch 머지를 위한 PR을 생성하고, CI 기다리고, 머지한 뒤에 release tag 생성하고. 매주 이렇게 기계적인 과정을 반복했어야 했다. 

빌드 기다리면서 다른 작업을 하는 것도 컨텍스트 스위칭이 여간.. 그래서 배포 열차에 탑승하기 위해서는 적지 않은 리소스가 매주 소요되었다.

### Github Flow

문제라고 하면 문제일 수 있는 이런 불편함과 불안함들을 없애기 위해서 스터디를 시작했다. 
Git Flow, Github Flow, Gitlab Flow 등 다양한 Feature Branching 전략 뿐만 아니라, Mainline 기반으로 개발하는 Trunk-Based Development 방법론도 살펴보았다.

- [Patterns for Managing Source Code Branches](https://martinfowler.com/articles/branching-patterns.html): 이것만 정독하고 이해한다면 Git Branch 전략은 마스터할 수 있다고 생각. 다양한 방법론에 대한 자세한 설명 뿐만 아니라, 적절한 브랜치 전략을 고를 수 있는 방법까지 소개해주고 있다.
- [Git Branching Strategies vs. Trunk-Based Development](https://launchdarkly.com/blog/git-branching-strategies-vs-trunk-based-development/): Feature Branching 전략에 비해 trunk-based 개발 방법론이 가지고 있는 장점과 Trunk 기반의 개발을 위해서 반드시 필요한 Feature Flag에 대해서 잘 소개해주고 있다.
- [trunkbaseddevelopment](https://trunkbaseddevelopment.com/): Trunk 기반 개발의 정의와 필요한 사항들에 대한 가이드 문서. 이 사이트만 제대로 이해하고 있다면 Trunk 기반 개발에 관한 다른 문서는 안봐도 된다고 생각.
- [Git Flow에서 트렁크 기반 개발으로 나아가기](https://tech.mfort.co.kr/blog/2022-08-05-trunk-based-development/): 국내 기술 블로그 중에 Trunk-Based 개발이 잘 소개된 유일한 자료가 아닐까. 실무에서는 어떻게 사용하고 있는지 더 많이 공유가 되었으면 좋겠다.
![github-flow](https://sungjk.github.io/images/2023/02/20/github-flow.png "github-flow")

Github Flow는 Git Flow에서 develop, release, hotfix 브랜치를 제거한 형태다. 
Git Flow가 Production 환경에 여러 버전을 관리하고 있는 제품을 위한 전략이라고 하면, Github Flow는 Production 환경에 단일 버전이 있는 제품을 위한 전략이라고 볼 수 있다. 
그래서 배포를 위한 Release 브랜치를 따로 관리하지 않고 Hotfix도 마찬가지다. 
Github Flow에서는 Mainline을 main(master)라고 부르고, 개발자는 작업을 feature 브랜치에서 한다.

(이론적으로) 작업도 마찬가지로 Feature 브랜치에서 하니까 Git Flow에서 <mark>develop, release, hotfix 브랜치만 제거</mark>하면 Github Flow와 똑같다고 생각했는데, 인지해야 할 중요한 점이 하나 더 있다고 생각한다. 
Git Flow 뿐만 아니라 모든 브랜치 전략에는 Mainline이 존재하는데, <mark>Mainline은 모든 작업(Feature)</mark>의 시작 점을 의미한다.
Git Flow는 develop 브랜치가 Mainline이고, Github Flow는 main 브랜치가 Mainline이다.
그리고 언제 배포해도 상관없는 <mark>Stable 브랜치가 Release 형태</mark>로 분리되어 있는 <mark>Git Flow와 다르게</mark>, Github Flow는 배포 브랜치와 작업을 시작하는 Mainline이 동일한 main 브랜치를 사용하고 있다. 
**즉, Github Flow 전략에서 main 브랜치는 mainline의 역할과 동시에 Stable 해야 한다.** 
따라서, Github Flow를 사용하는 팀원 모두는 main 브랜치가 항상 Stable 해야 한다는 명시적 혹은 암묵적 합의가 필요하다. 
Github Flow 전략을 사용하고 있는데 릴리즈에 포함되면 안되는 피쳐가 main 브랜치에 존재한다면 의도치 않은 장애로 이어질 수 있다.

Github Flow는 Git flow에 비해서 <mark>Release를 위한 절차가 굉장히 줄어</mark>들기 때문에 잦은 기능 수정과 배포가 있는 애자일 조직에 적합한 전략이라고 볼 수 있다. 
그리고 여러 버전을 동시에 관리할 필요가 없는 Middle급 조직에 어울리는 전략이기도 하다.

### Trunk-Based Development

Github Flow 외에 Trunk-Based 방법론도 살펴보았는데, [https://trunkbaseddevelopment.com/](https://trunkbaseddevelopment.com/)에서는 아래와 같이 설명하고 있다.

> A source-control branching model, where developers collaborate on code in a single branch called ‘trunk’, resist any pressure to create other long-lived development branches by employing documented techniques. They therefore avoid merge hell, do not break the build, and live happily ever after.

![merge-hell](https://sungjk.github.io/images/2023/02/20/merge-hell.png "merge-hell")

처음엔 trunk가 뭐지 했는데 <mark>Trunk-Based 방법론</mark>에서 <mark>Maineline</mark>을 부르는 용어다. 
Github Flow로 치면 main(master) branch와 똑같은. 
Feature Branch 기반이 아닌, <mark>Trunk 기반</mark>으로 작업을 하기 때문에 <mark>Mainline으로 변경사항</mark>을 바로 바로 추가할 수 있고, 수명이 긴 Feature Branch를 관리하지 않아서 Merge Hell에 빠지거나 빌드가 깨지는 경험에서 벗어날 수 있다. 
물론 빌드가 깨지는 결과물을 Mainline에 추가 하는건 논외로.

<mark>Trunk 기반 개발</mark>을 더 살펴보다 보면 여기에도 Feature Branch를 사용하는 부분이 나오는데, Github Flow의 Feature와는 다르게 <mark>지켜야 할 규칙</mark>이 있다. 
Trunk 기반 개발은 단일 브랜치를 지향하기 때문에, <mark>오랫동안 지속되는 브랜치</mark>를 <mark>지양</mark>하고 있다(Short-Lived Feature Branches). 
브랜치가 Merge, Delete 되기 전에는 며칠 동안만 지속되어야 하고, 오랜 기간 남아있는 브랜치가 있다면 Trunk 기반 개발의 철학과 정반대의 기능을 하고 있다고 볼 수 있다.

![trunk-feature-branch](https://sungjk.github.io/images/2023/02/20/trunk-feature-branch.png "trunk-feature-branch")

이처럼 <mark>Trunk 기반</mark>으로 작업하는 것과 Feature Branch 수명이 굉장히 짧은 특징은 잦은 기능 수정과 빠른 릴리즈가 필요한 조직에 적합하다. 
하지만 검증되지 않은 기능이 사용자에게 노출되는 건 위험하기 때문에 단순히 빠른 속도를 위해서 Trunk 기반을 채택해서는 안되고, 몇 가지 약속과 준비해야 할 것들이 있다.

- Quick rhythm to deliver code to production
- Small Changes
- Merge branches to the trunk at least once a day
- Continuous Integration; Automated testing
- Continuous Delivery
- Feature flags

Trunk 기반 개발을 위해서는 갖추어야 할 기술 기반 뿐만 아니라 <mark>코드 리뷰</mark>, <mark>페어프로그래밍</mark>, 코드 스타일 등 개발팀의 문화와 더불어서 Trunk를 안전하게 운영할 수 있는 경험과 노하우도 필요해보였다. 
하지만 우리 팀에는 이 전략을 경험했거나 시도해 본 사람이 아무도 없었고, 상대적으로 익숙한 Github Flow를 기본 브랜치 전략으로 가져 가보기로 했다.

### 매일 배포하기

배포에 포함되지 말아야 할 피쳐가 mainline에 포함되어 있으면 어떡하냐, 여러명이 작업하면 Merge Conflict는 어차피 발생하는거 아니냐 등 Github Flow를 사용한다고 했을 때 우려되는 점이 많았었다. 
전자는 각 프로젝트에 Feature Flag를 도입해서 해결할 수 있고, 후자는 어느 브랜칭 전략을 사용하던지 간에 발생 하는 건데 Trunk 기반 개발에서 Feature 브랜치의 수명을 짧게 가져 가는 것처럼 피쳐의 수명을 줄이면 고통이 많이 줄어 들거라 생각했다. 
이전에 코드 충돌에서 발생하는 고통을 [고통스러우면 더 자주하라](https://sungjk.github.io/2022/11/12/frequency-reduces-difficulty.html) 글에서 소개하기도 했는데, <mark>PR/커밋의 단위를 작게</mark> 가져가면 많은 부분을 해소할 수 있을거라 생각. 
그리고 새로운 전략을 사용해보면서 우리 팀 전체의 역량과 경험도 쌓아가고 팀에 맞게 개선할 수 있는 부분도 있을거라 믿었다.

<mark>브랜치 전략에 Github Flow</mark>를 사용한 지 3달 정도가 지났다. 
그 전에는<mark>(Git Flow) 배포를 하기 위해 1시간</mark>은 넉넉히 생각하고 있었는데 지금은 20분 정도 걸리려나? 
지금도 배포 프로세스 과정에서 개선해야 할 부분이 많이 남아있는데 더 줄이고 싶다. 
아무튼, <mark>배포에 쏟는 시간</mark>이 절반 이상으로 줄어들었다. 아직 3달 밖에 안됐는데 팀에 새로운 경험치도 많이 쌓였다고 생각한다. 
<mark>더 빠른 배포</mark>와 수명이 짧은 <mark>feature 브랜치</mark> 관리를 위해 <mark>빌드 속도 개선</mark>에도 신경을 많이 쓰게 되었고(개발 생산성도 덩달아 올라갔다), 새로 작성한 코드나 수정한 코드를 안전하게 관리하기 위해 Feature Flag도 적극적으로 사용하고 있다.

안정적인 개발과 운영이 중요한 프로젝트를 하고 있다보니 불안함도 많았었는데 교훈도 하나 배웠다. 
문제 없이 잘 동작하는 레거시 코드가 많은 이유이기도 한데, 개인적으로 <mark>안정적인 코드</mark>는 가장 많이 <mark>실행되는 코드</mark>라고 생각한다. 
그리고 코드 리뷰어와 배포 승인자의 피로를 덜기 위해 배포에 포함되는 변경 사항이 많지 않도록<mark>(Maineline에 새로운 코드가 많이 쌓이지 않도록)</mark> 신경쓰고 있고, 더 자주 배포하고 더 자주 실행되고 만들기 위해 노력하고 있다. 
지금은 매일 배포하는 팀이 되었다. 이전처럼 배포할 때 긴장되는 느낌과 불안함도 사라졌다. 
지금 팀에서 배포 1000번 하는게 목표인데 생각보다 금방 달성할 거 같기도 하고.. 아무튼, <mark>Github Flow(with Short-Lived Feature Branches)</mark>를 적용하고 나서 우리 팀의 특성에 맞게 빠른 속도와 안정적인 운영을 동시에 가져갈 수 있어서 만족하고 있다. 
<mark>Trunk 기반 개발</mark>을 포함해서 새로운 전략들을 스터디 해보면서 개선할 부분이 있는지 계속해서 살펴봐야겠다.

# Github Flow
github flow는 단순합니다. 
개발 당시에는 바쁜 일정에 맞추기 위해 <mark>간소한 git 프로세스</mark>가 필요했는데요.
1. 별도의 배포 주기를 가지지 않고
2. 각 기능이 짧은 주기로 <mark>Merge Request</mark>(github의 Pull Request와 동일)를 거치고 나면 빠르게 병합되며
3. 장애 상황에 대해 <mark>가장 빠른 롤 백</mark> 시나리오가 <mark>필요하지 않은</mark>(운영 배포되지 않았으므로)

github flow가 제격이었습니다.
저희 팀은 추가적으로 3way merge가 아닌 <mark>rebase 후 merge</mark>하는 rule을 <mark>추가</mark>하였어요.

### 팀에서 정한 github-flow rule
#### rebase merge 하기
PR을 보내기 전, master 브랜치를 반드시 rebase해야 합니다.
![Pasted-image-20230912124857.png](/img/이미지 창고/Pasted-image-20230912124857.png)
이는 깃 히스토리 그래프를 단순하게 만들기 위한 작업으로, 향후 단순히 <mark>시간 순서의 커밋</mark>이 아니라 <mark>기능 단위로 커밋 단위</mark>를 나눠 볼 수 있도록 해줍니다. 

아래는 [우아한형제들 기술블로그](https://techblog.woowahan.com/2553/)에서 가져온, 일반 merge(아래)와 rebase merge를 할 때(위)의 차이점입니다.
![Pasted-image-20230912125402.png](/img/이미지 창고/Pasted-image-20230912125402.png)
`merge request`
![Pasted-image-20230912125409.png](/img/이미지 창고/Pasted-image-20230912125409.png)
`rebase request`

위 블로그 예시에선 `1 PR = 1` 티켓 으로 관리했기 때문에 `squash merge` 하지만, 
저희 팀은 각 기능의 수정 사항이 많아 하나의 commit에 담기엔 너무 커다란 경우가 많았으므로, 따로 `squash merge` 하진 않았습니다.

그 결과 아래와 같은 git graph를 가지게 되었습니다.
![Pasted-image-20230912125436.png](/img/이미지 창고/Pasted-image-20230912125436.png)

#### rebase merge의 장점
1. 시간 순서 단위가 아닌 <mark>기능 단위로 history</mark>가 쌓이므로, <mark>롤백 해야 할 상황</mark>이나 새로운 기능 브랜치를 생성해야 할 때, 어떤 기능까지 포함하여 <mark>브랜치를 분화</mark>할 것인지 쉽게 판단할 수 있습니다.

2. 만약 master 브랜치로부터 <mark>분화 된 지 오래된 경우</mark>, master 브랜치와 병합할 때 그 동안의 변경 사항으로 인해 버그가 발생할 수 있습니다. 
	1. 베이스 브랜치를 A, 기능 브랜치를 B로 예를 들겠습니다.
![Pasted-image-20230912125503.png](/img/이미지 창고/Pasted-image-20230912125503.png)
A1 브랜치에서 생성한 feature 브랜치인 B 브랜치는 기능을 완성하고 PR을 보냅니다. 
이 때 B 브랜치에선 A2 커밋의 변경사항에 대해선 알지 못 합니다. 
B 브랜치에선 정상 동작하던 코드가, A2의 변경 사항과 합쳐진 A3 커밋 에서도 정상 동작할 것이라는 보장이 없기 떄문에, rebase 후 CI를 거쳐 Merge 한다면 위 상황에서 발생할 수 있는 버그를 방지할 수 있습니다.

#### rebase merge의 단점
1. conflict가 발생하면 한꺼번에 <mark>모든 conflict</mark>를 보여주는 <mark>3way merge와 달리</mark> 매 커밋 마다 충돌 난 부분을 해결해야 하기에 <mark>conflict 해결이 좀 더 힘듭니다</mark>… 
2. master 브랜치를 checkout 한 후, <mark>conflict 나지 않는 커밋</mark>만 [cherry pick](https://git-scm.com/docs/git-cherry-pick)하고, conflict난 부분은 다시 작성하는 방식을 많이 사용했습니다.
3. Pull Request를 올려놓고 바로 병합되지 않고 시간이 흘러 master 브랜치에 변경 사항이 발생하면, <mark>로컬</mark>에서 <mark>master 브랜치</mark>로 <mark>rebase 후 push</mark> 하려 할 때 <mark>force push</mark>를 해야 합니다. 
	1. 나 혼자 작업한 기능이라면 크게 상관없지만… force push가 주는 생리적 거부감…

### github flow를 사용하며 느낀 장점

기능 구현 시나리오가 단순하여 (main에서 feature 브랜치 생성 → 기능 완료후 master으로 merge) 큰 고민이 필요없고, 
타 개발자의 기능 구현이 빠르게 반영되어 master 브랜치가 가장 최신의 브랜치라는 심리적 안정감이 컸습니다.

또한 배포 시 특정한 브랜치를 target으로 배포할 수 있는 배포 시스템을 구축해놨기에, merge 전에 <mark>잠시 dev 환경</mark>이나 <mark>beta 환경</mark>에 배포해보고 <mark>테스트</mark> 할 수 있어서 staging이 없다는 github-flow의 단점도 어느 정도 상쇄할 수 있었습니다.

## 왜 git flow로 전환하였는가?

실제 프로젝트 런칭 일이 다가오자, <mark>운영 환경</mark>과 <mark>동일</mark>하게 구성한 테스트가 자주 진행되었습니다. 
이 때 안정적인 QA를 위해서 아무 때나 배포하던 배포 시기를 <mark>하루 중 정해진 시간</mark>(ex. 오후 2시)이나 QA를 불가능하게 하는 <mark>긴급한 수정 사항</mark>일 때만 <mark>배포</mark>하도록 <mark>변경</mark>되었는데요, 
이 때문에 문제가 발생했습니다.

1.MSA 프로젝트 였기에 각 모듈 별로 다른 버전의 master 브랜치가 배포되어있었는데요, 여러 모듈이 공통으로 쓰는 common module의 버저닝에서 문제가 발생했습니다.
![Pasted-image-20230912135722.png](/img/이미지 창고/Pasted-image-20230912135722.png)
#### 문제 상황
- 상품 서버를 개발하는 개발자 A는 정해진 배포 시간인 오후 2시에 master 브랜치의 c1 커밋을 배포하였습니다. 
- 이후 추가 기능을 구현하며 c2 에서 공통 모듈을 수정하고, 머지 해 놓았습니다. 
	- A는 해당 기능이 내일 배포 시간인 오후 2시에 배포되길 기대했습니다.
- 주문 서버를 개발하는 개발자 B는 <mark>긴급한 수정 사항</mark>이 생겨 <mark>c3 커밋을 생성</mark>해 주문 서버에 배포하였습니다. 
- 주문 쪽 코드에만 변경 사항이 있었기에 <mark>주문 모듈만 배포</mark>합니다.
- 이 때 상품 에서 내일 배포되길 기대했던 공통 모듈의 수정 사항이 주문 서버로 인해 딸려나갔습니다. 
- 상품 서버도 같이 배포해주었다면 문제가 없었겠지만, 주문 서버 개발자는 그 사실을 몰랐기에 공통 모듈의 코드가 서로 달라 에러가 발생합니다.
![Pasted-image-20230912140119.png](/img/이미지 창고/Pasted-image-20230912140119.png)
이 문제를 해결하려면 배포 시에 모든 모듈을 <mark>한꺼번에 배포</mark>하거나 기능을 개발하는 개발자가 본인이 원하는 시기인 <mark>배포 시간에 맞추어 코드</mark>를 머지 해야 합니다. 
각 기능이 <mark>서로 다른 배포 시기</mark>를 가질 때, github flow에선 신경 써야 할 요소가 많았습니다.

이 때문에 주기에 맞는 운영 배포 시나리오(기능 개발, 운영 배포, 핫 픽스, 롤 백)를 브랜치 전략을 통해 관리할 수 있는 git flow로 이전하게 되었습니다.

## git flow로 전환하고 나서

git flow로 전환하고 난 뒤엔 release 브랜치에서 특정 주기에 배포되어야 할 코드들이 병합되고, 배포 관리자가 영향 범위를 파악하고 있어 
의도하지 않은 시기에 코드가 딸려나갈 걱정이 사라졌습니다.

여러 브랜치를 관리해야 하고 배포 시간에 대해 배포 관리자를 두어야 하지만, <mark>브랜치를 중심</mark>으로 일관되게 <mark>여러 시나리오</mark>를 <mark>대처</mark>할 수 있는 장점이 있었습니다.

몇 주간 `develop 브랜치`와 `main 브랜치`를 별도로 운영 했었는데, `release 브랜치`로 배포하는 
저희 팀의 특성 상 `develop 브랜치`의 역할이 모호하다 느껴져 `develop 브랜치`를 <mark>삭제</mark>하고 `main 브랜치` 하나만 유지하는 방식으로 변경하였습니다.

저희 팀에선 아래 시나리오처럼 관리하는데, 이런 방법도 있구나 참고해주세요.
![Pasted-image-20230912140354.png](/img/이미지 창고/Pasted-image-20230912140354.png)

| * 삭제 되지 않는 브랜치 | 설명 |
| -- | -- |
| `main` | 코드 베이스가 되는 브랜치 <br /> release 브랜치 및 hotfix 브랜치의 원본 브랜치 역할을 한다.|

| 삭제 되는 <br />브랜치 | 설명 | 생성 시기 <br /> 및 <br /> 베이스 브랜치 | Merge 시기 <br /> 및 <br /> Merge Targe 브랜치|
| -- | -- | -- | -- |
| `release-yyyyMMdd` |  다음 버전의 기능이 추가되는 브랜치. <br /> develop으로부터 생성하며, 배포 나갈 일정에 맞추어 yyyyMMdd를 붙인다. <br /> 배포날 해당 브랜치를 대상으로 배포하며, 안정적이라고 판단되면 main으로 merge한다. | 다음 배포 시기가 결정 되었을 때, <br /> develop으로부터 생성 | 배포 후 안정적이라고 판단 되었을 때, <br /> `master`로 머지|
|`feature/기능명`|기능을 개발하는 브랜치.<br /> 머지할 때 release를 rebase하여 git history를 관리한다.| 기능 개발이 필요한 때, <br />release가 있다면 `release` 브랜치,<br /> 없다면 `develop` 브랜치로 부터 생성|기능 개발이 완료된 시점에, <br />배포 시기에 맞는 release로 머지| 
|`hotfix-yyyyMMdd`| 배포버전에 오류가 있어 빠른 대응이 필요할 때 생성하는 브랜치. |핫픽스가 필요한 때, master 브랜치로부터 생성|hotfix를 배포한 뒤 안정적이라고 판단되었을 때, master로 머지(현재 생성되어있는 release 브랜치는 hotfix 수정 내용을 rebase)| 
### 기능 개발 시나리오
![Pasted-image-20230912141533.png](/img/이미지 창고/Pasted-image-20230912141533.png)
1. feature 브랜치를 생성합니다. 이때 이름은 `feature/티켓명` 혹은 `feature/기능명` 으로 작성합니다.
	1. 만약 `release` 브랜치가 <mark>있다면</mark> : 해당 `release` 브랜치로부터 생성합니다.
	2. 만약 release 브랜치가 <mark>없다면</mark> : `main` 브랜치로부터 생성합니다.
2. 해당 브랜치에서 기능을 구현합니다. 
	1. 만약 기능 테스트가 필요하다면, `dev`에 해당 브랜치를 기준으로 배포하여 기능을 확인할 수 있습니다.
3. 기능 구현이 완료되었다면, 배포 버전을 확인하여 알맞은 브랜치에 머지할 준비를 합니다.
	1. 만약 `release` 브랜치가 <mark>있다면</mark> : 해당 <mark>릴리즈 브랜치</mark>를 <mark>rebase</mark>합니다.
	2. 만약 `release` 브랜치가 <mark>없다면</mark> : `develop`을 기준으로 `release`브랜치를 생성합니다.
		1. remote/`develop`을 `release-yyyyMMdd` (yyyyMMdd는 배포일 기준)으로 <mark>생성</mark>합니다.
		2. 작업한 `feature`브랜치는 새롭게 생성한 `release` 브랜치를 <mark>rebase</mark>합니다.
4. release 브랜치에 담당자, 리뷰어 등을 적절히 지정하여 merge request를 생성합니다.
5. 리뷰를 반영하고 MR이 approve되면 머지합니다.

### 운영 배포 시나리오
![Pasted-image-20230912141719.png](/img/이미지 창고/Pasted-image-20230912141719.png)
1. 배포 일이 되면, `release-yyyyMMdd` 브랜치를 운영 환경에 <mark>배포</mark>합니다.
2. 운영 배포가 모니터링, 운영 환경 테스트를 통해 안정적이라고 판단되면 <mark>백 포팅</mark>을 준비합니다.
:::tip BackPorting?
- ![](data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==) [Backporting](https://en.wikipedia.org/wiki/Backporting)은 이전 소프트웨어를 최신 버전으로 이식하는 것을 나타내는 말로, 
- 저희 팀에선 배포된 `release` 브랜치를 `main`에 반영하는 용어로 사용합니다.
:::

1. (백포팅) `release` 브랜치를 `main` 브랜치로 머지합니다.
	1. 이후 `master`의 최신 커밋에 배포한 날짜를 기준으로 [tag](https://git-scm.com/book/ko/v2/Git%EC%9D%98-%EA%B8%B0%EC%B4%88-%ED%83%9C%EA%B7%B8)를 생성합니다. 태그의 이름은 `platform-yyyyMMdd` 양식을 따릅니다.

### 롤백 시나리오
![Pasted-image-20230912141757.png](/img/이미지 창고/Pasted-image-20230912141757.png)

1. `release` 브랜치를 배포하고 난 뒤 문제가 발생하여 <mark>서버 롤백</mark>이 필요한 상황입니다.
	1. <mark>백포팅 전</mark>이라면 <mark>main 브랜치</mark>로 <mark>배포</mark>합니다.
	2. <mark>백포팅 후</mark>라면 <mark>직전 배포 버전에 해당하는 tag</mark>를 찾아 배포합니다.

### 핫픽스 시나리오
![](https://oopy.lazyrockets.com/api/v2/notion/image?src=https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Ffea24337-4347-46f6-9f6c-e882baf29edd%2FUntitled.png&blockId=7fddc7d2-4d6d-47c5-ab3a-26a0e35bfe68)

1. 배포 버전에 중대한 결함이 발견되어 <mark>빠르게 수정</mark>이 필요한 상황입니다.
2. `main` 브랜치로부터 배포버전에 해당하는 태그를 찾아 `hotfix-yyyyMMdd` 브랜치를 생성합니다.
3. 기능을 수정합니다.
4. 이상이 없다고 판단되면 `hotfix` 브랜치를 배포합니다.
5. 이후 안정되었다면, `master` 및 `develop` 브랜치로 <mark>백포팅을 준비</mark>합니다.
6. (백포팅) `hotfix` 브랜치를 `main` 브랜치로 머지합니다.
	1. 이후 master의 최신 커밋에 배포한 날짜를 기준으로 [tag](https://git-scm.com/book/ko/v2/Git%EC%9D%98-%EA%B8%B0%EC%B4%88-%ED%83%9C%EA%B7%B8)를 생성합니다. 
	2. 태그의 이름은 `platform-yyyyMMdd` 양식을 따릅니다.
7. 현재 생성되어있는 `release` 브랜치는 `develop`을 rebase해 `hotfix` 변경 사항을 반영합니 다.

### git flow의 단점
1. 다양한 브랜치를 관리하여야 하여야 합니다.
2. 배포 상황을 총괄할 배포 관리자가 필요합니다.

## 마치며
은탄환은 없다는 말처럼, 세상에 존재하는 모든 팀 별로 각자 필요한 브랜칭 전략이 다를 거란 생각이 듭니다. 
각자 상황에 맞게 브랜칭 전략을 도입하고, 문제 상황을 맞닥뜨리면 나만의 전략을 도입해 지혜롭게 해결하시길 바랍니다. 

---

#CICD #git 

---
