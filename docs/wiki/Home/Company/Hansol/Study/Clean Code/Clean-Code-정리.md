---
시작 날짜: 2024-03-18
종료 날짜: 2024-03-18
sticker: emoji//1faa0

slug: "Clean-Code-정리"
---

:::tip Lean vs Agile

:::

정리와 정돈은 다름

정리는 우리가 하는 행위
정돈은 우리가 예상 가능한 범위에 있는 것

생활화?
- 나의 코드를 계속 의심해야한다 라는 뜻 같은데

---

# Chapter1

앞으로 프로그래밍 언어에서 추상화 수준은 점차 높아질 것이다.
더불어 특정 응용 분야에 적합한 프로그래밍 언어 수도 점차 많아질 것이다.
하지만, 그렇다고 코드 가 사라지진 않는다.
고도로 추상화 된 언어나 특정 응용 분야로 언어로 기술하는 명세 역시 코드이기 때문이다.
어떤 언어를 사용하든 코드는 기계가 이해하고 실행할 정도로 엄밀하고 정확하고 상세하고 정형 화 되기 때문이다.

르블랑의 법칙 > 나중은 결코 오지 않는다.

### 코드가 존재하리라
??? : 코드는 더 이상 문제가 아니다! 모델이나 요구사항에 집중해야한다고 생각하는 사람도 있으리라.
실제로도 코드의 종말이 코앞에 닥쳤다고 주장하는 사람이 없지 않다.
코드가 자동으로 생성하는 시대가 다가온다는 말이다.
자동으로 생성하면 되니까?

코드는 요구사항을 상세히 표현하는 수단이니까?
어느 수준에 이르면 코드의 도움 없이 요구사항을 상세하게 표현하기란 불가능하다.
추상화도 불가능하다.
정확히 명시하는 수 밖에 없다
기계가 실행할 정도로 상세하게 요구사항을 명시하는 작업, 바로 이것이 프로그래밍이다.
이렇게 명시한 결과가 바로 코드다

앞으로 프로그래밍의 추상화 수준은 높아질 것이다.
더불어 특정 응용 분야에 적합한 프로그래밍 언어 수도 점차 많아지리라 예상한다.

어떤 언어를 사용하든 코드는 기계가 이해하고 실행할 정도로 엄밀하고, 정확하고 상세하고 정형화 되어야 한다.
언젠가 코드가 사라지리라 생각하는 사람들은 언젠가 비정형적인 수학이 나오리리라 기대하는 수학자와 비슷하다.
사실 우리가 그런 기계를 만드는 것이다.







### 나쁜 코드로 치르는 대가
남들이 저질러 놓은 쓰레기 코드로 고생한 경험이 있으리라 코드가 하도 엉망이라 프로젝트 진도가 안 나가는 경험도 있다.
나쁜 코드는 개발 속도를 떨어뜨린다.

코드를 고칠 때 마다 엉뚱한 곳에서 문제가 생긴다.
간단한 변경은 없다.
매번 얽히고 설킨 코드를 해독해서 얽히고 설킨 코드를 더한다.
시간이 지나면서 쓰레기 더미는 점점 높아지고, 깊어지고 커진다.
나쁜 코드가 쌓일 수록 팀 생산성은 떨어진다.

#### 깨끗한 코드
깨끗한 코드는 어떻게 작성할까?
깨끗한 코드를 작성하려면, 청결 이라는 힘겹게 습득한 감각을 활용해 자잘한 기법들을 적용하는 절제와 규율이 필요하다.
열쇠는 <mark>코드 감각</mark>이다.

비야네는 우아한 이라는 단어를 사용한다.
깨끗한 코드는 보는 사람에게 즐거움을 선사해야 한다는 뜻이다.
비야네가 말하는 효율이 단순히 속도만을 얘기하는 것은 아니다.
CPU 자원을 낭비하는 코드도 우아하지 못하다.
나쁜 코드는 나쁜 코드를 유혹한다.
흔히 나쁜 코드를  고치면서 오히려 더 나쁜 코드를 만든다는 뜻이다.

데이트 토마스와 앤디 헌트는 같은 이야기를 다르게 표현했다.
깨진 창문이라고 비유를 하였다.
창문이 깨진 건물은 누구도 상관하지 않는 다는 이상을 풍긴다.
그래서 사람들도 관심을 끊는다.
창문이 더 깨져도 상관하지 않는다.

마침내 자발적으로 창문을 깬다.
외벽에 그려진 낙서를 방치하고 차고에 쓰레기가 쌓여도 치우지 않는다.
일단 창문이 깨지고 나면 쇠퇴하는 과정이 시작된다.

비야네는 철저한 오류 처리도 언급한다.
세세한 사항까지 꼼꼼하게 신경 쓰라는 말이다.
프로그래머들이 대충 넘어가는 부분 중 하나가 오류 처리다.
메모리 누수, 경쟁 상태, 일관성 없는 명명법이 또다른 예이다.

한마디로 요약하면 깨끗한 코드는 세세한 사항까지 꼼꼼하게 처리하는 코드다.
마지막으로 비야네는 깨끗한 코드란 한 가지를 잘한다고 단언한다.
수 많은 소프트웨어 설계 원칙이 이 간단한 교훈 하나로 귀결된다는 사실은 우연이 아니다.
수 많은 저술가들이 이 생각을 나름대로 표현하려고 애썼다.
나쁜 코드는 너무 많은 일을 하려 애쓰다가 의도가 뒤섞이고 목적이 흐려진다.

깨끗한 코드?
깨끗한 변수 이름, 깨끗한 함수, 깨끗한 클래스를 만드는 방법을 소개한다.
여기서는 우리 의견을 절대적인 진리 처럼 설교하므로, 어투가 거슬리더라도 이해하기 바란다.
지금까지 우리가 경험한 바로는 이 책에서 설명하는 교훈이 적어도 우리에게는, 절대적인 진리다.
이 책은 나와 내 동료들이 생각하는 깨끗한 코드를 정의 한다.

무술가들에게 최고의 무술이나 한 무술 내에서 최고의 기술을 꼽으라면 다들 다르게 답하리라.
흔히 무술 대가는 독자적인 문파를 만들고 제자를 모아 자신의 사상을 가르친다.

각 문파에 입문한 학생들은 창시자의 가르침을 익히고 연마한다.
그들은 까다로운 스승의 가르침을 배우기 위해 전념한다.
다른 대가를 찾아가 지식과 기술을 넓히기도 한다.
일부는 자신의 기술을 계속 연마하다 새로운 기술을 발견해 새로운 문파를 세운다.

우리는 저자다
저자에게는 독자와 잘 소통할 책임도 있다.
다음에 코드를 짤 때는 자신이 저자라는 사실을 여러분의 노력을 보고 판단을 내릴 독자가 있다는 사실을 기억하기 바란다.


### 의미 있는 이름
우리는 변수에도 이름을 붙이고, 함수에도 이름을 붙이고, 인수와 클래스와 패키지에도 이름을 붙입니다.
이름을 잘 지으면 여러모로 편합니다.

### 의도를 분명히 밝혀라
여기서의 의도는 이름이 중요하다는 것입니다.
이름을 주의 깊게 살펴 더 나은 이름이 떠오르면 개선하기 바란다.
그 코드를 읽는 사람이 더 행복진다.

변수나 함수 그리고 클래스 이름은 다음과 같은 굵직한 질문에 모두 답해야한다.
- 변수의 존재 이유는?
- 수행 기능은?
- 사용 방법은?
따로 주석이 필요하다면 의도를 분명히 드러내지 못했다는 말이다.

```java
int d; // 경과 시간(단위 : 날짜)

int elapsedTimeInDays;
int daysSinceCreation;
int daysSinceModification;
int fileAgeInDays;
```

의도가 드러나는 이름을 사용하면 코드 이해와 변경이 쉬워집니다.

```java
public List<int[]> getThem(){
	List<int[]> list1 = new ArrayList<int[]>();
	for(int[] x : theList)
	if(x[0] == 4 )
		list1.add(x);
	return list1;
}
```
코드가 하는 일을 짐작하기 어렵다.
왜 일까? 복잡한 문장은 없다.
공백과 들여쓰기도 적당하다.
변수는 세개, 상수는 두개 뿐이다.

문제는 코드의 단순성이 아니라 코드의 함축성이다.
다시 말해, 코드 맥락이 코드 자체에 명시적으로 드러나지 않는다.
위 코드는 암암리에 독자가 다음과 같은 정보를 안다고 가정한다.
1. theList에는 무엇이 들었는가?
2. theList에서 0번째 ㄱ밧이 어째서 중요한가?
3. 값 4는 무슨 의미인가?
4. 함수가 반환하는 리스트 list1을 어떻게 사용하는가?

### 그릇된 정보는 피하라
프로그래머는 코드에 그릇된 단서를 남겨서는 안된다.
그릇된 단서는 코드 의미를 흐린다.
나름대로 널리 쓰이는 의미가 잇는 단어를 다른 의미로 사용해도 안된다.
예를 들면, hp, aix, sco는 변수 이름으로 적합하지 않다.
유닉스 플랫폼이나 유닉스 변종을 가르키는 이름이기 때문이다.
직각 삼각형의 빗면을 구현할 때는 hp가 훌륭해 보여도 hp라는 변수는 독자에게 그릇된 정보를 제공한다.

여러 계정을 그룹으로 묶을 때 실제 List라는 단어는 특수 의미다.
계정을 담는 컨테이너가 실제 List가 아니라면 프로그래머에게 그릇된 정보를 제공하는 셈이다.
그러므로, accountGroup, bunchOfAccounts 아니면 단순히 Accounts라는 명명한다.

서로 흡사한 이름을 사용하지 않도록 주의한다.
한 모듈에서 XYZControllerForEfficientHandlingOfStrings라는 이름을 사용하고, 조금 떨어진 모듈에서 XYZControllerForEfficientStorageOfStrings 라는 이름을 사용한다면? 차이를 알아챘는가?
두 단어는 겁나게 비슷하다.

유사한 개념은 유사한 표기법을 사용한다.
이것도 정보다
일관성이 떨어지는 표기법은 그릇된 정보다.
최신 자바 호나경은 코드 자동완성 기능을 제공한다.
이름을 몇 자만 입력한 후 HotKey 조합을 누르면 가능한 후보 목록이 뜬다.

이름으로 그릇된 정보를 제공하는 끔찍한 예가 소문자 L이나 대문자 O 변수이다.
두 변수는 한꺼번에 사용하면 더 끔찍해진다.
다음 코드에서 보듯, 소문자 L은 숫자 1처럼 보이고 대문자 O는 숫자 0처럼 보인다.

### 의미 있게 구분해라
컴파일러 인터프리터만 통과하려는 생각으로 코드를 구현하는 프로그래머는 스스로 문제를 일으킨다.
예를 들어 동일한 범위 안에서는 다른 두 개념에 같은 이름을 사용하지 못한다.
그래서 프로그래머가 한쪽 이름을 마음대로 바꾸고픈 유혹에 빠진다.
어떤 프로그래머는 철자를 살짝 바꿨다가 나중에 철자 오류를 고치는 순간 컴파일이 불가능한 상황에 빠진다.

컴파일러를 통과할지라도 연속된 숫자를 덧붙이거나 불용어를 추가하는 방식은 적절하지 못하다.
이름이 달라야 한다면, 의미도 달라져야 한다.

연속적인 숫자를 덧붙인 이름은 의도적인 이름과 정반대다.
이런 이름은 그릇된 정보를 제공하는 이름도 아니며, 아무런 정보를 제공하지 못하는 이름일 뿐이다.
저자 의도가 전혀 드러나지 않는다.
```java
public static void copyChars(char a1[], char a2[]){
	for(int i = 0; i < a1.lenght; i++){
		a2[i] = a1[i]
	}
}
```
함수 인수 이름으로 source와 destination을 사용한다면, 코드 읽기가 훨씬 더 쉬워진다.
불용어를 추가한 이름 역시 아무런 정보도 제공하지 못한다.

Proudct라는 클래스가 있다고 가정하자.
다른 클래스를 ProductInfo 혹은 ProductData라 부른다면, 개념을 구분하지 않은 채 이름만 달리한 경우다.
Info 나 Data는 a, an, the 와 마찬가지로 의미가 불분명한 불용어다.

a나 the와 같은 접두어를 사용하지 말라는 소리가 아니다.
의미가 분명히 다르다면 사용해도 무방하다.
예를 들어, 모든 지역 변수는 a를 사용하고 모든 함수 인수는 the를 사용해도 되겠다.
요지는 zork라는 변수가 있다는 이유만으로도 theZork라는 이름을 지어서는 안된다는 말이다.

불용어는 중복이다.
변수 이름에 variable 이라는 단어는 단연코 금물이다.
표 이름에 table이라는 단어도 마찬가지이다.
NameString이 Name보다 뭐가 나은가?
Name이 부동 소수가 될 가능성이 있던가?
그렇다면, 앞서 언급한 그릇된 정보를 피하라 규칙을 위반한다.

코드를 읽다가 Customer라는 클래스와 CustomerObject라는 클래스를 발견했다면 차이를 알겠는가?
고객 급여 이력을 찾아야한다면 어떤 클래스를 뒤져야 빠를까?

이와 같은 오류를 저지르는 애플리케이션이 있다.
개발자를 보호하고자 이름을 바꿨으나 오류 형태는 정확히 다음과 같다.

- `getActiveAccount();`
- `getActiveAccounts();`
- `getActiveAccountInfo();`
이 프로젝트에 참여한 프로그래머는 어느 함수를 호출할지 어떻게 알까?
명확한 관계가 없다면 변수 `moneyAmount`는 `money`와 구분이 안 된다.
`customerInfo`는 `customer` 와 , `accountData`는 `account`와 `theMessage`는 `message`와 구분이 안된다.

### 발음하기 쉬운 이름을 사용해라
사람들은 단어에 능숙하다.
단어는 정의 상 발음이 가능하다.
발음하기 어려운 이름은 토론하기 힘들다.
프로그래밍은 사회 활동이기에, 발음 하기 쉬운 이름은 매우 중요하다.

### 검색하기 쉬운 이름을 사용해라
문자 하나를 사용하는 이름과 상순느 텍스트 코드에서 쉽게 눈에 띄지 않는다는 문제점이 있다.
MAX_CLASSES_PER_STUDENT는 grep으로 찾기 쉽지만, 숫자 7은 은근히 까다롭다.

e라는 문자도 변수에서 최악이다.
영어에서 가장 많이 쓰는 문자가 e이다.
그래서 검색하기 매우 까다롭다.

```java
for(int j=0; j<34; j++){
	s += (t[j]*4)/5;
}
```
와
```java
int realDaysPerIdealDay = 4;
const int WORK_DAYS_PER_WEEK = 5;
int sum = 0;
for (int j=0; j < NUJMBER_OF_TASKS; j++){
	int realTaskDays = taskEstimate[j] * realDaysPerIdealDay
	int realTaskWeeks = (realTaskDays / ) 
}
```


# Chatper 3 함수
## 작게 만들어라
함수는 작게 만들 수록 더 좋다는 증거나 자료를 제시하기에는 어렵다 하지만, 지난 년생 동안, 3000줄에 육박하는 함수도 작성하고, 지금까지의 경험을 바탕으로 그리고 오랜 시행착오를 바탕으로 나는 작은 함수가 좋다고 확신한다.
80년대에는 함수가 한 화면을 넘어가면 안된다고 말했다.

모든 모니터에 비해서 상대적인 말이지만, 
만약 그렇다면, 얼마나 짧아야할까?
당연하겠지만, 매우 짧으면 짧을 수록 좋다

### 블록과 들여쓰기
다시말해, if 문/ else 문/while 문 드엥들어가는 블록은 한 줄 이어야 한다는 의미다.
대개 거기서 함수를 호출 한다.
그러면 바깥을 감사는 함수가 작아질 뿐 아니라, 블록 안에서 호출하는 함수 이름을 적절히 짓는다면, 코드를 이해하기도 쉬울 것이다.

중첩 구조가 생길 만큼, 함수가 거쳐서는 안된다는 뜻이다.
그러므로 함수에서 들여쓰기 수준은 1단이나, 2단을 넘어서면 안 된다

### 한가지 만 해라
처음 예시 코드는 여러가지를 처리한다.
버퍼를 생성하고, 페이지를 가져오고, 상속된 페이지를 검색하고, 경로를 렌더링하고 불가사의한 문자열을 덧붙이고, HTML을 생성한다.
반면 3번째 함수는 한가지의 일만을 한다.

>함수는 한 가지를 해야 한다.
>그 한 가지를 잘해야 한다.
>그 한 가지만 해야 한다.

문제라면, 그 한가지가무엇인지 알기가 어렵다는 점이다.
1. 페이지가 테스트 페이지인지 판단한다.
2. 그렇다면 설정 페이지와 해체 페이지를 넣는다.
3. 페이지를 HTML로 렌더링 한다.
그렇다면 어느쪽인가?
목록 3-3은 한 가지만 하는가?
아니면 세가지를 하는가?

위에서 언급하는 세 단계는 지정된 함수 이름 아래에서 추상화 수준이 하나 다.
함수는 간단한 TO 문단으로 기술될 수 있다.

지정된 함수 이름 아래에서 추상화 수주니 하나인 단계만 수행한다면, 그 함수는 한 가지 작업만 한다.
어쨋거나, 우리가 함수를 만드는 이유는 큰 개념을 다음 추상화 수준에서 여러 단계로 나눠 수행하기 위해서가 아니던가

다양한 추상화 수준에서 여러 단계를 처리 한다.
그러므로, 함수는 여러 작업을 한다.

그래서 3으로 축소가 가능하다.
하지만, 의미를 유지하면서 3을 더 이상 줄이기란 불가능하다.
if 문을 includeSetupAndTeardownslfTestPate라는 함수로 만든다면 똑같은 내용을 다르게 표현할 분 추상화 수준은 바뀌지 않는다.


# Chapter4
잘 달린 주석은 그 어떤 정보보다 유용하다.
경솔하고 근거 없는 주석은 코드를 이해하기 어렵게 만든다
오래되고 조잡한 주석은 거짓과 잘못된 정보를 퍼트려 해악을 미친다

주석은 쉰들러 리스트가 아니다.
주석은 <mark>순수하게 선하지</mark> 못하다

사실 상 주석은 기껏해야 필요악이다.
프로그래밍 언어 자체가 표현력이 풍부하다면
우리에게 프로그래밍 언어를 치밀하게 사용해 의도를 표현할 능력이 있다면, 주석은 거의 필요하지 않으리라.

우리는 코드로 의도를 표현하지 못해, 실패를 만회하기 위해 주석을 사용한다.
여기서 내가 실패라는 단어를 썼다는 사실에 주목한다.
주석은 언제나 실패를 의미한다.
때때로 주석 없이는 자신을 표현할 방법을 찾지 못해 할 수 없이 주석을 사용한다.
주석은 반겨 맞을 손님이 아니다.

그러므로 주석이 필요한 상황이 처하면 곰곰히 생각해야 한다.
상황을 역전해 코드로 의도를 표현할 방법이 없을까?
코드로 의도를 표현할 때는 스스로 칭찬해준다.
주석을 달 때 마다 자신에게 표현력이 없다는 사실을 푸념해야한다.

:::question 내가 주석을 무시하는 이유?

:::

너무 자주 거짓말을 하기 때문이다.
주석은 오래될 수록 코드에서 멀어진다.
오래 될 수록 완전히 그릇될 가능성도 커진다.
프로그래머들이 주석을 유지하고 보수하기란 현실적으로 불가능하다

코드는 변화하고 진화 한다.
일부가 여기서 저기로 옮겨지기도 한다.
조각이 나뉘고 갈라지고 합쳐지면서 괴물로 변한다.
불행하게도 주석이 언제나 코드를 따라가지 않는다.
주석이 코드에서 분리 되어 점점 부정확한 고아로 변하는 사례가 너무 도 흔하다.
예를 들어 아래에서 주석과 원래 주석이 달았던 행이 어떻게 됐는지 살펴보자

```java
MockRequest request;
private final String HTTP_DATE_REGEXP =
"[SMTWF][a-z]{2}\\,\\s[0-9]{2}\\s[JFMASOND][a-z]{2}\\s"+
"[0-9]{4}\\s[0-9]{2}\\:[0-9]{2}\\:[0-9]{2}\\sGMT";
private Response response;
private FitNesseContext context;
private FileResponder responder;
private Locale saveLocale;
// Example: "Tue, 02 Apr 2003 22:18:49 GMT"
```

짐작컨데, `HTTP_DATE_REGEXP` 상수와 주석 사이에 다른 인스턴스 변수를 추가했을 가능성이 농후하다.
프로그래머들이 주석을 엄격하게 관리해야 한다고, 그 의견에 동의한다.
프로그래머들에게도 절도가 필요하다.
하지만, 나라면 코드를 깔끔하게 정리하고 표현력을 강화 하는 방향으로 그래서 애초에 주석이 필요 없는 방향으로 에너지를 쏟겠다.

부정확한 주석은 아예 없는 주석보다 훨씬 더 나쁘다.
부정확한 주석은 독자를 현혹 하고 오도 한다.
부정확한 주석은 결코 이뤄지지 않을 기대를 심어준다.
더 이상 지킬 필요가 없는 규칙이나, 지켜서는 안 되는 규칙을 명시한다.
진실은 한 곳에만 존재 한다.
코드다

코드만이 자기가 하는 일을 진실 되게 말한다.
코드만이 정확한 정보를 제공하는 유일한 출처다.

### 주석은 나쁜 코드를 보완하지 못한다.
코드에 주석을 추가하는 일반적인 이유는 코드 품질이 나쁘기 때문이다.
모듈을 짜고 보니 짜임새가 엉망이고 알아 먹기 어렵다.
지저분한 모듈 이라는 사실을 자각 한다.
그래서 자신에게 이렇게 말한다.
주석을 달아야겠다
코드를 정리해라~

표현력이 풍부하고 깔끔하며, 주석이 거의 없는 코드가 복잡하고 어수선하며 주석이 많이 달린 코드보다 훨씬 좋다.
자신이 저지른 난장판을 주석으로 설명하려 애쓰는 대신에 그 난장판을 깨끗이 치우는데 시간을 보내라

### 코드로 의도를 표현해라
확실히 코드 만으로 의도를 설명하기 어려운 경우가 존재한다.
불행히도 많은 개발자가 이를 코드는 훌륭한 수단이 아니라는 의미로 해석한다.
다음 코드 예제 두 개 중 어느것이 더 나은가?

```java
// 직원에게 복지 혜택을 받을 자격이 있는지 검사한다.
if ((employee.flags & HOURLY_FLAG) &&
(employee.age > 65))
```

```java
if (employee.isEligibleForFullBenefits())
```
대다수의 의도를 표현할 수 있다.
많은 경우 주석으로 달려는 설명을 함수로 만들어 표현 해도 충분하다.

### 좋은 주석
어떤 주석은 필요하거나 유익하다.
글자 값을 한다고 생각하는 주석 몇 가지 방법을 소개한다.

#### 법적인 주석
회사가 정립한 구현 표준에 맞춰 법적인 이유로 특정 주석을 넣으라고 명시한다.
예를 들어 각, 소스 파일 첫 머리에 주석으로 들어가는 저작권 정보와 소유권 정보는 필요하고도 타당하다.
다음은 FitNess에서 모든 소스 파일 첫 머리에 추가한 표준 주석 헤더이다.
다행스럽게 요즘 IDE는 주석 헤더를 자동으로 축소해 코드만 깔끔하게 표시한다.

```java
// Copyright (C) 2003,2004,2005 by Object Mentor, Inc. All rights reserved.
// Released under the terms of the GNU General Public License version 2 or later.
```
소스 파일 첫머리에 들어가는 주석이 반드시 계약 조건이나 법적인 정보일 필요는 없다.
모든 조항과 조건을 열거하는 대신에, 가능하다면 표준 라이선스나 외부 문서를 참조해도 되겠다

### 정보를 제공하는 주석
때로는 기본적인 정보를 주석으로 제공하면 편리하다
예를 들어, 다음 주석은 추상 메서드가 반환할 값을 설명한다.

```java
// 테스트 중인 Responder 인스턴스를 반환한다.
protected abstract Responder responderInstance();
```
때때로 위와 같은 주석이 유용할지라도, 가능하다면, 함수 이름에 정보를 담는 편이 좋다.
예를 들어, 위 코드는 함수 이름을 reponderBeingTested로 바꾸면 주석이 필요 없다.

다음은 좀 더 나은 예제이다.
```java
// format matched kk:mm:ss EEE, MMM dd, yyyy
Pattern timeMatcher = Pattern.compile(
"\\d*:\\d*:\\d* \\w*, \\w* \\d*, \\d*");
```

위에 제시한 주석은 코드에서 사용한 정규 표현 식이 시각과 날짜를 뜻한다고 설명한다.
구체적으로는 주어진 형식 문자열을 사용해 `SimpleDataFormat.format`함수가 반환하는 시각과 날짜를 뜻한다.

이왕이면 시각과 날짜를 반환하는 클래스를 만들어 코드를 옮겨주면 더 좋고 깔끔하겠다.
그러면 주석이 필요 없을텐데

### 의도를 설명하는 주석
때로는 주석은 구현을 이해하게 도와주는 선을 넘어 결정에 깔린 의도까지 설명한다.
다음은 주석으로 흥미로운 결정을 기록한 예시이다.
두 객체를 비교할 때 저자는 다른 어떤 객체보다 자 객체에 높은 순위를 주기로 결정했다.

```java
public int compareTo(Object o){
	if(o instanceof WikiPagePath){
		WikiPagePath p = (WikiPagePath) o;
		String compressedName = StringUtil.join(names, "");
		String compressedArgumentName = StringUtil.join(p.names, "");
		return compressedName.compareTo(compressedArgumentName);
	}
	return 1; // 오른쪽 유형이므로 정렬 순위가 더 높다.
}
```
다음은 더 나은 예제다.
저자가 문제를 해결한 방식에 동의하지 않을지도 모르지만, 어쨋거나 저자의 의도는 분명히 드러낸다.
```java
public void testConcurrentAddWidgets() throws Exception {
	WidgetBuilder widgetBuilder = new WidgetBuilder(new Class[]{BoldWidget.class});
	String text = "'''bold text'''";
	ParentWidget parent = new BoldWidget(new MockWidgetRoot(), "'''bold text'''");
	AtomicBoolean failFlag = new AtomicBoolean();
	failFlag.set(false);
	
	// 스레드를 대량 생산하는 방법으로 어떻게든 경쟁 조건을 만들려 시도한다.

	for (int i = 0; i < 25000; i++) {
		WidgetBuilderThread widgetBuilderThread =
		new WidgetBuilderThread(widgetBuilder, text, parent, failFlag);
		Thread thread = new Thread(widgetBuilderThread);
		thread.start();
	}
	assertEquals(false, failFlag.get());
}
```

### 의미를 명료하게 밝히는 주석
때때로 모호한 인수나 반환 값은 그 의미를 좋게 표현하면 이해하기 쉬워진다.
일반적으로는 인수나 반환 값 자체를 명확하게 만들면 더 좋겠지만, 인수나 반환 값이 표준 라이브러리나 변경하지 못하는 코드에 속한다면, 의미를 명료하게 밝히는 주석이 유용하다.

```java
public void testCompareTo() throws Exception{
	WikiPagePath a = PathParser.parse("PageA");
	WikiPagePath ab = PathParser.parse("PageA.PageB");
	WikiPagePath b = PathParser.parse("PageB");
	WikiPagePath aa = PathParser.parse("PageA.PageA");
	WikiPagePath bb = PathParser.parse("PageB.PageB");
	WikiPagePath ba = PathParser.parse("PageB.PageA");
	assertTrue(a.compareTo(a) <mark> 0); // a </mark> a
	assertTrue(a.compareTo(b) != 0); // a != b
	assertTrue(ab.compareTo(ab) <mark> 0); // ab </mark> ab
	assertTrue(a.compareTo(b) == -1); // a < b
	assertTrue(aa.compareTo(ab) == -1); // aa < ab
	assertTrue(ba.compareTo(bb) == -1); // ba < bb
	assertTrue(b.compareTo(a) == 1); // b > a
	assertTrue(ab.compareTo(aa) == 1); // ab > aa
	assertTrue(bb.compareTo(ba) == 1); // bb > ba
}
```
물론 그릇된 주석을 달아 놓을 위험은 상당히 높다.
직전 예제를 살펴보면 알겠지만, 주석이 올바른지 검증하는 건 쉽지 않다.
이것이 의미를 명료히 밝히는 주석이 필요한 이유인 동시에 주석이 위험한 이유이기도 하다.
그러므로 위와 같은 주석을 달 대는 더 나은 방법이 없는지 고민하고 정확히 달도록 각별히 주의한다.

### 결과를 경고하는 주석
때로 다른 프로그래머에 결과를 경고할 목적으로 주석을 사용한다.
예를 들어, 다음은 특정 테스트 케이스를 꺼야하는 이유를 설명하는 주석이다.
```java
// 여유 시간이 충분하지 않다면, 실행하지 마십시오
public void _testWithReallyBigFile()
{
	writeLinesToFile(10000000);
	
	response.setBody(testFile);
	response.readyToSend(this);
	String responseString = output.toString();
	assertSubString("Content-Length: 1000000000", responseString);
	assertTrue(bytesSent > 1000000000);
}
```
물론 요즘에는 `@Ignore` 속성을 이용해 테스트 케이스를 꺼버린다.
구체적인 설명은 `@Ignore` 속성에 문자열로 넣어준다.
예를 들어,
`@Ignore("실행이 너무 오래걸린다")` 라고 쓴다.
하지만 JUnit4가 나오기 전에는 메서드 앞에 `_`기호를 붙이는 방법이 일반적인 관례였다.
위에 제시한 주석은(다소 경박하지만) 매우 적절한 지적이다.
다음 주석이 아주 적절한 예제이다.
```java
public static SimpleDateFormat makeStandardHttpDateFormat()
{
	// SimpleDateFormat은 스레드에 안전하지 못하다.
	// 따라서 각 인스턴스를 독립적으로 생성해야 한다.
	SimpleDateFormat df = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss z");
	df.setTimeZone(TimeZone.getTimeZone("GMT"));
	return df;
}
```

더 나은 해결책이 있다고 불평할지도 모르겟다.
나도 동감한다.
하지만 여기서는 주석이 아주 합리적이다.
프로그램 효율을 높이기 위해 정적 초기화 함수를 사용 하려던 열성적인 프로그래머가 주석 때문에 실수를 면한다.

### TODO 주석
때로는 <mark>앞으로 할 일</mark> `// TODO` 주석으로 남겨두면 편하다.
다음은 함수를 구현하지 않은 이유와 미래 모습을 `// TODO` 주석으로 설명한 예제이다.

```java
//TODO-MdM 현재 필요하지 않다.
// 체크 아웃 모델을 도입하면 함수가 필요 없다.
protected VersionInfo makeVersion() throws Exception{
	return null;
}
```
TODO 주석은 프로그래머가 필요하다 여기지만 당장 구현하기 어려운 업무를 기술한다.
더 이상 필요 없는 기능을 삭제하라는 알림, 누군가에게 문제를 봐 달라는 요청, 더 좋은 이름을 떠올려 달라는 부탁, 앞으로 발생할 이벤트에 맞춰 코드를 고치라는 주의 등에 유용하다.
하지만 어떤 용도로 사용하든 시스템에 나쁜 코드를 남겨 놓는 핑계가 되어서는 안 된다.

요즘 나오는 대다수의 IDE는 TODO 주석 전부를 찾아 보여주는 기능을 제공하므로 주석을 잊어버릴 염려는 없다.
그래도 TODO로 떡칠한 코드는 바람직하지 않다.
그러므로 주기적으로 TODO주석을 점검해 없애도 괜찮은 주석은 없애라고 권한다.

### 중요성을 강조하는 주석
자칫 대수롭지 않다고 여겨질 뭔가의 중요성을 강조하기 위해서도 주석을 사용한다.
```java

String listItemContent = match.group(3).trim();
// 여기서 trim은 정말 중요하다.
// trim 함수는 문자열에서 시작 공백을 제거한다.
// 문자열에 시작 공백이 있으면, 다른 문자열로 인식 되기 대문이다.
new ListItemWidget(this, listItemContent, this.level + 1);
return buildList(text.substring(match.end()));
```

### 공개 API에서 Javadocs
표준 자바 라이브러리에서 사용한 javadocs가 좋은 예다.
javadocs가 없다면, java 프로그램을 짜기가 아주 어려우리다.

## 나쁜 주석
대다수 주석이 이 범주에 속한다.
일반적으로 대다수 주석은 허술한 코드를 지탱하거나, 엉성한 코드를 변명하거나, 미숙한 결정을 합리화 하는 등 
프로그래머가 주절거리는 독백에서 크게 벗어나지 못한다.

### 주절 거리는 주석
특별한 이유 없이 의무감으로 혹은 프로세스에서 하라고 하니까 마지 못해 주석을 단다면, 전적으로 시간낭비다.
주석을 달기로 결정했다면, 충분한 시간을 들여 최고의 주석을 달도록 노력한다.

다음은 Fitness에서 발견한 코드로, 주석을 제대로 달았다면 상당히 유용했을 코드다.
하지만 저자가 서둘렀거나 부주의했다.
그냥 주절거려 놓았기에 판독이 불가능하다.
```java
public void loadProperties(){
	try{
		String propertiesPath = propertiesLocation + "/" + PROPERTIES_FILE;
		FileInputStream propertiesStream = new FileInputStream(propertiesPath);
		loadedProperties.load(propertiesStream);
	}catch(IOException e){
		// 속성 파일이 없다면 기본값을 모두 메모리로 읽어 들였다는 의미다.
	}
}
```
catch 블록에 있는 주석은 무슨 뜻일까?
확실히 저자에게야 의미가 있겠지만, 그 의미가 다른 사람들에게는 전해지지 않는다.
IOException이 발생하면 속성 파일이 없다는 뜻 이란다.
그러면 모든 기본 값을 메모리로 읽어 들인 상태란다.
하지만, 누가 모든 기본 값을 읽어 들이는가
loadProperties.load를 호출하기 전에 읽어 들이는가?
아니면 loadProperties.load가 예외를 잡아 기본 값을 읽어 들인 후 예외를 던져주는가?
아니면 loadProperties.loadrk 파일을 읽어 들이기 전에 모든 기본 값부터 읽어 들이는가?
저자가 catch 블록을 비워놓기 뭐해 몇 마디 덧붙였을 뿐이가?
아니면, 나중에 돌아와서 기본값을 읽어들이는 코드를 구현하려 했는가?

답을 알아내려면 다른 코드를 뒤져 보는 수밖에 없다.
이해가 안되어 다른 모듈까지 뒤저야하 하는 주석은 독자와 제대로 소통하지 못하는 주석이다.
그런 주석은 바이트만 낭비할 뿐이다.

#### 같은 이야기를 중복 하는 수식
아래의 코드는 간단한 함수로, 헤더에 달린 주석이 같은 코드 내용을 그래도 중복 한다.
자칫하면 코드보다 주석을 익는 시간이 더 오래 걸린다.

```java
// this.closed가 true일 대 반환되는 유틸리티 메서드다.
// 타임 아웃에 도달하면 예외를 던진다.
public synchronized void waitForClose(final long timeoutMillis)
throws Exception{
	if(!closed){
		wait(timeoutMillis);
		if(!closed)
			throw new Exception("MockResponseSender could not be closed");
	}
}
```
위와 같은 주석을 달아놓는 목적은 무엇일가
주석이 코드보다 더 많은 정보를 제공하지 못한다.
코드를 정당화 하는 주석도 아니고 의도나 근거를 설명하는 주석도 아니다.
코드보다 읽기가 쉽지도 않다
실제로 코드보다 부정확해 독자가 함수를 대추 이해하고 넘어가게 만든다
엔진 후드를 열어볼 필요가 없다면, 고객에게 아양 떠는 중고차 판매원과 비슷하다.

아래 코드는 톰켓에서 가져온 코드다.
쓸모없고 중복된 JavaDocs가 매우 많다.
아래 주석은 코드만 지저분하고, 정신 없게 만든다.
기록이라는 목적에는 전혀 기여하지 못한다.

설상가상으로 아래 코드는 첫 부분 조금일 뿐이다.
이 모듈에는 아래와 같은 주석이 아주 많다.
```java
public abstract class ContainerBase
implements Container, Lifecycle, Pipeline,
MBeanRegistration, Serializable {
/**
* The processor delay for this component.
*/
protected int backgroundProcessorDelay = -1;
/**
* The lifecycle event support for this component.
*/
protected LifecycleSupport lifecycle =
new LifecycleSupport(this);
/**
* The container event listeners for this Container.
*/
protected ArrayList listeners = new ArrayList();
/**
* The Loader implementation with which this Container is
* associated.
*/
protected Loader loader = null;
/**
* The Logger implementation with which this Container is
* associated.
*/
protected Log logger = null;
/**
* Associated logger name.
*/
protected String logName = null;
/**
* The Manager implementation with which this Container is
* associated.
*/
protected Manager manager = null;
/**
* The cluster with which this Container is associated.
*/
protected Cluster cluster = null;
/**
* The human-readable name of this Container.
*/
protected String name = null;
/**
* The parent Container to which this Container is a child.
*/
protected Container parent = null;
/**
* The parent class loader to be configured when we install a
* Loader.
*/
protected ClassLoader parentClassLoader = null;
/**
* The Pipeline object with which this Container is
* associated.
*/
protected Pipeline pipeline = new StandardPipeline(this);
/**
* The Realm with which this Container is associated.
*/
protected Realm realm = null;
/**
* The resources DirContext object with which this Container
* is associated.
*/
protected DirContext resources = null;
```

#### 오해할 여지가 있는 주석
때때로 의도는 좋았으나, 프로그래머가 딱 맞을 정도로 엄밀하게는 주석을달지 못하기도 한다.
위위 코드에서 봤던 주석을 떠올려보면 해당 주석은 중복이 상당히 많으면서 오해할 여지도 살짝 있다.

`this.closed`가 `true`로 변하는 순간에 메서드는 반환되지 않는다.
`this.closed`가 `true`여야 메서드는 반환된다.
아니면 무조건 타임아웃을 기다렸다 `this.closed`가 그래도 `true` 가 아니면 예외를 던진다.

코드보다 읽기도 어려운 주석에 담긴 살짝 잘못된 정보로 인해 `this.closed`가 true로 변하는 순간에 함수가 반환되리라는 생각으로 어느 프로그래머가 경솔하게 함수를 호출할지도 모른다.
그래 놓고 그 불쌍한 프로그래머는 자기 코드가 굼벵이 기어가듯 돌아가는 이유를 찾느라 골머리를 앓는다.

### 의무적으로 다는 주석
모든 함수에 javadocs를 담거나 모든 주석을 달아야 한다는 규칙은 어리석기 그지 없다.
이런 주석은 코드를 복잡하게 만들며, 거짓말을 퍼트리고 혼동과 무질서를 초래한다.
예를 들어, 아래 코드는 모든 함수에 javadocs를 넣으라는 규칙이 낳은 괴물이다.
아래와 같은 주석은 아무 가치도 없다.

오히려 코드만 헷갈리게 만들며, 거짓말할 가능성을 높이며, 잘못된 정보를 제공할 여지만 만든다.

```java
/**
*
* @param title CD 제목
* @param author CD 저자
* @param tracks  CD 트랙 숫자
* @param durationInMinutes CD 길이(단위 : 분)
*/
public void addCD(String title, String author,
	int tracks, int durationInMinutes) {
	CD cd = new CD();
	cd.title = title;
	cd.author = author;
	cd.tracks = tracks;
	cd.duration = duration;
	cdList.add(cd);
}
```

#### 이력을 기록하는 주석
때때로 사람들은 모듈을 편집할 때마다 모듈 첫머리에 주석을 추가한다.
그리하여 모듈 첫머리 주석은 지금까지 모듈에 가한 변경을 모두 기록하는 일종의 일지 혹은 로그가 된다.
첫 머리 주석만 십여쪽을 넘어서는 모듈도 보앗다.

```
* Changes (from 11-Oct-2001)
* --------------------------
* 11-Oct-2001 : 클래스를 다시 정리하고 새로운 패키지인 com.jrefinery.date로 옮겼다(DG);
* 
* 05-Nov-2001 : getDescription() 메서드를 추가 했으며, NotableDate class를 제거했다.
* 
* 12-Nov-2001 : IBD가 setDescription() 메서드를 요구한다, NotableDate 클래스를 없앴다.(DG);
*  Changed getPreviousDayOfWeek(), getFollowingDayOfWeek(), getNearestDayOfWeek()를 변경해 버그를 수정했다.
* (DG);
* 05-Dec-2001 : SpreadsheetDate classd에 있는 버그를 수정했다. (DG);
* 29-May-2002 : month 상수를 독자적인 인터페이스로 옮겼다.(MonthConstants) (DG);
* 
* 27-Aug-2002 : addMonths() method에 있는 버그를 수정했다., N???levka Petr 덕분이다.(DG);
* 03-Oct-2002 : Checkstyle이 보고한 오류를 수정햇다.(DG);
* 13-Mar-2003 : Serializable를 구현했다. (DG);
* 29-May-2003 : addMonths method에 있는 버그를 수정했다. (DG);
* 04-Sep-2003 : Comparable를 구현했다.isInRange javadocs를 갱신했다. (DG);
* 05-Jan-2005 : addYears() 메서드에 있는 버그를 수정했다. (1096282) (DG);
```
예전에는 모든 모듈의 첫머리에 변경 이력을 기록하고 관리하는 관례가 바람직 했다.
당시에는 소스 코드 관리 시스템이 없었으니까
하지만, 이제는 혼란만 가중할 뿐이다.
완전히 제거하는 편이 좋다.

#### 있으나 마나 한 주석
때때로 있으나 마나 한 주석을 접한다.
너무 당연한 사실을 언급하며, 새로운 정보를 제공하지 못하는 주석이다.
```java
/**
* 기본 생성자
*/
protected AnnualDateRule() {
}
```
다음은 어떤가?
```java
/** 월 중 일자. */
private int dayOfMonth;
```
이번에는 전형적인 중복을 보여준다.
```java
/**
* 월 중 일자를 반환한다.
*
* @return 월 중 일자.
*/
public int getDayOfMonth() {
return dayOfMonth;
}
```
위와 같은 주석은 지나친 참견이라 개발자가 주석을 무시하는 습관에 빠진다.
코드를 읽으며 자동으로 주석을 건너 뛴다.
결국은 코드가 바뀌면서 주석은 거짓말로 변한다.

아래 코드에서 첫 번째로 주석은 적절해 보인다.
catch 블록을 무시해도 괜찮은 이유를 설명하는 주석이다.
하지만, 두 번째 주석은 전혀 쓸모가 없다.
아무래도 프로그래머는 try/catch 블록을 짜다 너무나 짜증났기에 함수에다 분풀이를 했다보다.

```java
private void startSending(){
	try{
		doSending();
	}catch(SocketException e){
		// 정상, 누군가 요청을 멈췃다.
	}catch(Exception e){
		try{
			response.add(ErrorResponder.makeExceptionString(e));
			response.closeAll();
		}catch(Exception e1){
			// 이게 뭐야!
		}
	}
}
```

있으나 마나 한 주석을 달려는 유혹에서 벗어나 코드를 정리하라, 더 낫고, 행복한 프로그래머가 되는 지름 길이다.

#### 무서운 잡음
때로는 javadocs도 잡음이다.
다음은 잘 알려진 오픈 소스 라이브러리에서 가져온 코드다.
아래 나오는 javadocs는 어떤 목적을 수행할까?
답은 없다.
단지 문서를 제공해야 한다는 잘못된 욕심으로 탄생한 잡음일 뿐이다.
```java
/** The name. */
private String name;
/** The version. */
private String version;
/** The licenceName. */
private String licenceName;
/** The version. */
private String info;
```
위 주석을 한 번 더 주의 깊게 읽어보자.
잘라서 붙여넣기 오류가 보이는가
주석을 작성한(혹은 붙여넣은) 저자가 주의를 기울이지 않았다면, 독자가 여기서 무슨 이익을 얻겠는가

#### 함수나 변수로 표현할 수 있다면, 주석을 달지 마라
다음 코드를 살펴보자
```java
// 전역 목록 <smodule>에 속하는 모듈이 우리가 속한 하위 시스템에 의존하는가?
if (smodule.getDependSubsystems().contains(subSysMod.getSubSystem()))
```
이 코드에서 주석을 없애고 다시 표현하면 다음과 같다.
```java
ArrayList moduleDependees = smodule.getDependSubsystems();
String ourSubSystem = subSysMod.getSubSystem();
if (moduleDependees.contains(ourSubSystem))
```
코드를 작성한 저자는 주석을 먼저 달고, 주석에 맞춰 코드를 작성했을지도 모른다.
하지만 위와 같이 주석이 필요하지 않도록 코드를 개선하는 편이 더 좋았다.

#### 위치를 표시하는 주석
때때로 프로그래머는 소스 파일에서 특정 위치를 표시하려 주석을 사용한다.
예를 들어, 최근에 살펴보던 프로그램에서 다음 행을 발견했다.
```java
// Actions //////////////////////////////////
```
극히 드물지만, 위와 같은 벤 아래 특정 기능을 모아 놓으면 유용한 경우도 있긴 하다.
하지만, 일반적으로 위와 같은 주석은 가독성만 낮추므로 제거해야 마땅하다
:::question 난 이거 좀 아닌거 같은데..

:::

특히 뒷 부분에 슬래시로 이어지는 잡음은 제거하는 편이 좋다.
배너를 남용하면 독자가 흔한 잡음으로 무시한다.

#### 닫는 괄호에 다는 주석
때로는 프로그래머들이 닫는 괄호에 특수한 주석을 달아놓는다.
아래 코드가 좋은 예다.
```java
public class wc {
	public static void main(String[] args) {
		BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
		String line;
		int lineCount = 0;
		int charCount = 0;
		int wordCount = 0;
		try {
			while ((line = in.readLine()) != null) {
				lineCount++;
				charCount += line.length();
				String words[] = line.split("\\W");
				wordCount += words.length;
			} //while
			System.out.println("wordCount = " + wordCount);
			System.out.println("lineCount = " + lineCount);
			System.out.println("charCount = " + charCount);
		} // try
		catch (IOException e) {
			System.err.println("Error:" + e.getMessage());
		} //catch
	} //main
}
```
중첩이 심하고 장황한 함수라면, 의미가 있을지도 모르지만, 작고 캡슐화된 함수에는 잡음일 뿐이다.
그러므로 닫는 괄호에 주석을 달아야겠다는 생각이 든다면 대신에 함수를 줄이려 시도 하자

#### 공로를 돌리거나 저자를 표시하는 주석
```java
/* 릭이 추가함 */
```
소스코드 관리 시스템은 누가 언제 무엇을 추가했는지 귀신처럼 기억한다.
저자 이름으로 코드를 오염 시킬 필요가 없다.
주석이 있으면, 다른 사람들이 코드에 관해 누구한테 물어볼지 아니까 위와 같은 주석이 유용하다 여길 지도 모르겠다.
하지만, 현실적으로 이런 주석은 그냥 오랫동안 코드에 방치되어 점차 부정확하고 쓸모없는 정보로 변하기 쉽다.

다시 한번 강조하지만, 위와 같은 정보는 소스 코드 관리 시스템에 저장하는 편이 좋다.

#### 주석으로 처리한 코드
주석으로 처리한 코드만큼 밉살스러운 관행도 드물다.
다음과 같은 코드는 작성하지 마라!

```java
InputStreamResponse response = new InputStreamResponse();
response.setBody(formatter.getResultStream(), formatter.getByteCount());
// InputStream resultsStream = formatter.getResultStream();
// StreamReader reader = new StreamReader(resultsStream);
// response.setContent(reader.read(formatter.getByteCount()));
```
주석으로 처리된 코드는 다른 사람들이 지우기를 주저한다.
이유가 있어 남겨 놓았으리라고, 중요하니까 지우면 안된다고 생각한다.
그래서 질 나쁜 와인병 바닥에 앙금이 쌓이듯 쓸모없는 코드가 점차 쌓여간다.

다음은 아파치 commons에서 가져온 코드다.
```java
this.bytePos = writeBytes(pngIdBytes, 0);
//hdrPos = bytePos;
writerHeader();
writerResolutions();
//dataPos = bytePos;
if(writeImageData()){
	writeEnd();
	this.pngBytes = resizeByteArray(this.pngBytes, this.maxPos);
}else{
	this.pngBytes=null;
}
return this.pngBytes;
```

두 행을 주석으로 처리한 이유가 무엇일까?
중요해서?
코드를 급박하게 변경했다는 사실을 알려주려고?
아니면, 수년전 누군가 주석으로 처리한 코들르 아무도 없애지 않아서?
1960년 즈음에는 주석으로 처리한 코드가 유용했다.
하지만, 우리는 오래전 부터 우수한 소스코드 관리 시스템을 사용해왔다.
소스코드 관리 시스템이 우리를 대신해 코드를 기억해준다.
이제는 주석으로 처리할 필요가 없다.
그냥 코드를 삭제해라 잃어버릴 염려는 없다.

#### HTML 주석
소스코드에서 HTML 주석은 혐오 그 자체다.
다음 코드를 읽어보면 무슨 말인지 알리라 
HTML 주석은 (주석을 읽기 쉬워야하는) 편집기/IDE 에서조다 읽기가 어렵다.
도구로 주석을 뽑아 웹 페이지로 올릴 작정이라면, 주석에 HTML 태그를 삽입해야하는 책임은 프로그래머가 아니라 도구가 져야한다.
```java
/**
* Task to run fit tests.
* This task runs fitnesse tests and publishes the results.
* <p/>
* <pre>
* Usage:
* &lt;taskdef name=&quot;execute-fitnesse-tests&quot;
* classname=&quot;fitnesse.ant.ExecuteFitnesseTestsTask&quot;
* classpathref=&quot;classpath&quot; /&gt;
* OR
* &lt;taskdef classpathref=&quot;classpath&quot;
* resource=&quot;tasks.properties&quot; /&gt;
* <p/>
* &lt;execute-fitnesse-tests
* suitepage=&quot;FitNesse.SuiteAcceptanceTests&quot;
* fitnesseport=&quot;8082&quot;
* resultsdir=&quot;${results.dir}&quot;
* resultshtmlpage=&quot;fit-results.html&quot;
* classpathref=&quot;classpath&quot; /&gt;
* </pre>
*/
```

#### 전역 정보
주석을 달아야 한다면 근처에 있는 코드만 기술하라.
코드를 일부에 주석을 달면서 시스템의 전반적인 정보를 기술하지 마라.
예를 들어 다음 javadocs주석을 살펴보자
심하게 중복 되었다는 사실 외에도 주석은 기본 포트 정보를 기술한 다.
하지만, 함수 자체는 포트 기본값을 전혀 통제하지 못한다.
그러니까 아래 주석은 바로 함수가 아니라 시스템 어딘가에 있는 다른 함수를 설명한다는 말이다.
즉, 포트 기본값을 설정하는 코드가 변해도 아래 주석이 변하리라는 보장은 전혀 없다.
```java
/**
* Port on which fitnesse would run. Defaults to <b>8082</b>.
*
* @param fitnessePort
*/
public void setFitnessePort(int fitnessePort)
{
this.fitnessePort = fitnessePort;
}
```

#### 너무 많은 정보
주석에다 흥미로운 역사나 관련 없는 정보를 장황하게 늘어놓지 마라.
다음은 base64를 인코딩/디코딩 하는 함수를 테스트하는 모듈에서 가져온 주석이다.
RFC번호를 제외하면 독자에게 불필요하며, 불가사의한 정보일 뿐이다.
```java
/*
	RFC 2045 - Multipurpose Internet Mail Extensions (MIME)
	Part One: Format of Internet Message Bodies
	section 6.8. Base64 Content-Transfer-Encoding
	The encoding process represents 24-bit groups of input bits as output
	strings of 4 encoded characters. Proceeding from left to right, a
	24-bit input group is formed by concatenating 3 8-bit input groups.
	These 24 bits are then treated as 4 concatenated 6-bit groups, each
	of which is translated into a single digit in the base64 alphabet.
	When encoding a bit stream via the base64 encoding, the bit stream
	must be presumed to be ordered with the most-significant-bit first.
	That is, the first bit in the stream will be the high-order bit in
	the first 8-bit byte, and the eighth bit will be the low-order bit in
	the first 8-bit byte, and so on.
*/
```

#### 모호한 관계
주석과 주석이 설명하는 코드는 둘 사이 관계가 명백해야한다.
이왕 공들여 주석을 달았다면, 적어도 족자가 주석과 코드를 읽어보고 무슨 소린지 알아야 하지 않겠는가?
예를 들어, 다음은 아파치 commons에서 가져온 주석이다.

```java
/*
 * 모든 픽셀을 담을 만큼 충분한 배열로 시작한다.(여기에 필터 바이트를 더한다.)
 * 그리고 헤어 정보를 위해 200바이트를 더한다.
*/
this.pngBytes = new byte[((this.width + 1 ) * this.height * 3 ) + 200];
```
여기서 필터 바이트란 무엇일까?
`+1`과 관련이 있을까?
아니면 `*3`과  관련이 있을까?
아니면 둘다?
한 픽셀이 한 바이트인가?
200을 추가하는 이유는?
 주석을 다는 목적은 코드만 으로 설명이 부족해서이다.
 주석 자체가 다시 설명을 요구하니 안타깝기 그지 없다.
#### 짧은 함수 헤더
짧은 함수는 긴 설명이 필요 없다.
짧고 한 가지만, 수행하며 이름을 잘 붙인 함수가 주석으로 헤더를 추가한 함수보다 훨씬 좋다.

#### 비공개 코드에서 JavaDocs
공개 API는 javadocs가 유용하지만, 공개하지 않을 코드라면 javadocs는 쓸모가 없다.
시스템 내부에 속한 클래스와 함수에 javadocs를 생성할 필요는 없다.
유용하지 않을 뿐만 아니라, javadocs 주석이 요구하는 형식으로 인해 코드만 보기 싫고 산만해질 뿐이다.



