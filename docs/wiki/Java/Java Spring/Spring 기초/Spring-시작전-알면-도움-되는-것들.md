---
slug: "Spring-시작전-알면-도움-되는-것들"
---
# Spring 시작 전 알면 도움 되는 것들


# Spring이란?

아주 간략하게 설명을 하면, 자바 플랫폼을 위한 오픈 소스 애플리케이션 프레임 워크이다. 대규모 데이터 처리와 트랜잭션이 동시에 여러 사용자로 부터 행해지는 매우 큰 규모의 환경을 엔터프라이즈 환경이라고 말함

Spring Framework는 경량 컨테이너로 자바 객체를 담고 직접 관리한다.

# Spring의 특징

> IoC와 AOP를 지원하는 경량의 컨테이너 프레임워크
> ![Screen-Shot-2022-05-08-at-10.54.32-PM.png](/img/이미지 창고/Screen-Shot-2022-05-08-at-10.54.32-PM.png)
> 

## POJO

 → Plain Old Java Object, 자바 객체라는 뜻

- 기존 JSP와는 다르게 개발자가 직접 Servlet 클래스를 작성하지 않고, POJO만으로 웹 애플리케이션을 구축할 수 잇다는 것이 스프링의 특징

## 컨테이너란?

- 컨테이너는 특정 객체의 생성과 관리를 담당하며 객체 운용에 필요한 다양한 기능을 제공한다. 애플리케이션 운용에 필요한 객체를 생성하고 객체 간의 의존관계를 관리한다는 점에서 스프링도 일종의 컨테이너라고 할 수 있다.

### spring 컨테이너의 종류

- 스프링에서 BeanFactory와 이를 상속한 ApplicationContext 두 가지 유형의 컨테이너를 제공한다. BeanFactory는 Spring설정 파일에 등록된 `<bean>`객체를 생성하고 관리하는 가장 기본적인 컨테이너 기능만 제공.
- 컨테이너가 구동될 때 객체를 생성하는 것이 아니라 클라이언트로부터의 요청에 의해서만 객체를 생성한다
- 이를 확장한 ApplicationContext 컨테이너는 이 기능에 더해 트랜잭션 관리나 메시지 기반의 다국어 처리 등 다양한 기능을 지원한다. 
- 또한 컨테이너가 구동되는 시점에 bean에 등록되어있는 클래스들을 객체화하는 즉시 로딩 방식으로 동작.

 → 스프링 컨테이너는 `<bean>` 저장소에 해당하는 XML파일을 참조하여 bean의 생명주기를 관리하고 여러가지 서비스를 제공한다.

## IOC(Inversion of Control) - 제어의 역전

 → 기존 사용자가 모든 작업을 제어하던 것을 특별한 객체에 모든 것을 위임하여 객체의 생성부터 생명 주기등 모든 객체에 대한 제어권이 언어간 것을 IOC, 즉 제어의 역전이라고 함

- 비즈니스 컴포넌트를 개발할 때 항상 신경쓰는 것이 바로 낮은 결합도, 높은 응집도이다.
- 스프링의 IoC는 객체 생성을 자바 코드로 직접 처리하는 것이 아닌, 컨테이너가 대신 처리하게 된다. 
- 그리고 객체와 객체 사이의 의존 관계 역시 컨테이너가 처리한다.

 

## DL(Dependency Lookup) - 의존성 검색

- 컨테이너에서는 객체들을 관리하기 위해 별도의 저장소에 빈을 저장하는데 저장소에 저장되어잇는 개발지들이 컨테이너에서 제공하는 API를 이용하여 사용하고자 하는 빈을 검색하는 방법이다.

## DI(Dependency Injection) - 의존성 주입

- 의존성 관계란 객체와 객체의 결합 관계이다.
- 하나의 객체에서 다른 객체의 변수나 메소드를 이용해야한다면, 객체에 대한 생성과 생성된 객체의 레퍼런스 정보가 필요하다.
- 즉, 의존성은 new이다. A라는 객체 생성자에서 new B()를 했다면, A는 B의 의존하게 된다. 
- 하지만 이를 외부에서 생성된 B를 A에 주입함으로써 외존 관계를 없앨 수 있다.

의존성 주입하는 방식은 여러가지 방식이 있다.

### XML을 통한 의존성 주입

1. 생성자를 통한 의존성 주입
    1. 생성자에 인자로 주입하고자 하는 객체를 넣어준다. 
    2. 스프링 설정 파일에서는 constructor-arg 태그과 ref속성을 이용
2. 속성을 통한 의존성 주입
    1. 내부적으로 set method를 사용한다. 
    2. 스프링 설정 파일에서는 property 태그를 사용해야 하며 name 속성값이 호출하고자 하는 메소드의 이름이어야한다.

### 어노테이션을 통한 의존성 주입

- 스프링에서는 @Autowired라는 어노테이션을 통해 의존성을 주입한다. 
- @Autowired는 속성의 설정자 메소드에 해당하는 역할을 자동으로 수행한다. 
- 이와 비슷한 역할을 하는 자바 어노테이션으로 @Resouce 어노테이션이 있다. 
- 두 어노테이션의 차이는 bean을 탐색할 때 우선 순위로 하는 기준이 어떤 것이냐이다.

**[Annotation](https://velog.io/@gillog/Spring-Annotation-%EC%A0%95%EB%A6%AC)**

### Java Bean vs Spring Bean

- Java Bean : Java Bean은 특정 형태의 클래스를 가르키는 뜻으로 사용됨, DTO(data transform object), VO 형태가 JavaBean이라고 생각하면 된다.
- 필드는 private으로 구성, getter, setter를 통해서만 접근 가능, 전달 인자가 없는 생성자가 가지는 형태의 클래스이다. 즉, getter setter를 통해서만 접근이 가능하다.
- 전달인자가 없는 생성자를 가지는 형태의 클래스이다. POJO(Plain Old Java Object)
- Spring Bean : Spring에서의 Bean은 스프링 IOC 컨테이너가 관리하는 Java객체를 뜻한다.
- 일반 Java객체와 다른점은 없다. **스프링 IoC가 관리하는 객체**라함은 스프링에 의해 생성되고, 라이프 사이클을 수행하고, 의존성 주입이 일어나는 객체들을 말한다.
- 즉, 개발자가 관리하는 객체가 아닌 스프링에게 제어권을 넘긴 객체를 스프링에서 Bean이라고 부른다.

## AOP(Aspect Oriented Programming)

직역하면 관점지향프로그래밍이다.

DI가 의존성에 대한 주입이라면 AOP는 로직 주입이라고 할 수 있다.

- 코드 작성을 하다보면 다수의 모듈에 공통적으로 나타나는 부분이 존재하는데 이것을 횡단 관심사라고 한다.
- 모듈 각각 고유한 로직을 핵신 관심사라고 한다.

→ 각 모듈을 구성하고 있는 코드는 핵심 관심사와 횡단 관심사가 합쳐진 것이다.

### AOP의 목적

AOP는 중복을 제거해야 한다는 개발자의 숙명으로부터 탄생하게 된 것이다.

AOP를 이해 하는데 가장 중요한 핵심 개념은 바로 관심 분리(separation of Concerns)

- 핵심 비즈니스 로직과 각 비즈니스 메소드마다 반복해서 등장하는 공통 로직을 분리함으로써 응집도가 높게 개발할 수 있도록 지원한다.

### 1. XML을 이용한 AOP

### 2. 어노테이션을 이용한 AOP

- @Aspect 어노테이션은 클래스를 AOP에서 사용하겠다는 의미이며, @Before 어노테이션은 대상 메서드 실행 전에 이 메서드를 실행하겠다는 의미이다.

## PSA(Portable Service Abstaction)

일관성 있는 서비스 추상화

→ JDBC처럼 어댑터 패턴을 적용하여 같은 일을 하는 다수의 기술을 공통 인터페이스로 제어할 수 있게 한 것을 서비스 추상화라고 한다.

![Screen-Shot-2022-05-09-at-10.22.06-AM.png](/img/이미지 창고/Screen-Shot-2022-05-09-at-10.22.06-AM.png)
내부 Servlet, Java Class들의 동작 과정

1. 웹 어플리케이션이 실행되면 Tomcat에 의해 web.xml이 loading됨
2. web.xml에 등록되어있는 ContextLoaderListener(java class)가 생성됨. ContextLoaderListener 클래스는 ServletContextListener인터페이스를 구현하고 있으며 ApplicationContext를 생성하는 역할을 수행.
3. 생성된 ContextLoaderListener는 root-context.xml을 loading한다.
4. root-context.xml에 등록되어있는 Spring Conatainer가 구동된다. 이 때 개발자가 작성한 비즈니스 로직에 대한 부분과 DAO, VO 객체들이 생성된다.
5. 클라이언트로부터 웹 어플리케이션이 요청 온다.
6. DispatcherServlet(Servlet)이 생성된다. DispatcherServlet은 FrontController의 역할을 수행한다. 클라이언트로부터 요청온 메시지를 분석하여 알맞은 PageController에게 전달하고 응답을 받아 요청에 따른 응답을 어떻게 할지 결정만한다. 실질적인 작업은 PageController에서 이루어지기 때문이다. 이러한 클래스들을 HandlerMapping, ViewResolver 클래스라고 한다.
7. DispatcherServlet은 servlet-context.xml을 loading한다.
8. 두번째 Spring Container가 구동되며 응답에 맞는 PageController들이 동작한다. 이때 첫번 째 Spring Contatiner가 구동되면서 생긴 DAO, VO, Servicelmpl 클래스들과 협업하여 알맞은 작업을 처리하게 된다.

# MVC

![Screen-Shot-2022-05-09-at-10.36.24-AM.png](/img/이미지 창고/Screen-Shot-2022-05-09-at-10.36.24-AM.png)
MVC(Model View Controller)

## Model

model에서는 데이터 처리르 담당하는 부분이다.

모델 부분은 Service, Repository, Domain(Entity)으로 크게 구성이된다.

Model부분은 불필요하게 HTTP통신을 하지 말아야하며, request, response와 같은 객체를 매개변수로 받아선 안된다.

또한 Model부분의 Service는 view에 종속적인 코드가 없어야하고 View부분이 변경되더라도 Service부분은 그대로 재사용 할 수 있어야한다.

**Model에서는 View와 Controller의 어떠한 정보를 가지고 있어선 안된다.**

![Untitled.png](/img/이미지 창고/Untitled.png)
### Repository

```java
public class MemoryMemberRepository implements MemberRepository {
    private static Map<Long, Member> store = new HashMap<>();
    //실무에서는 동시성 문제 때문에 공유되는 변수는 hashmap을 사용하지 않는다.
    private static long sequence = 0L;
    @Override
    public Member save(Member member) {
        member.setId(++sequence);
        store.put(member.getId(), member);
        return member;
    }
    @Override
    public Optional<Member> findById(Long id) {
        return Optional.ofNullable(store.get(id));
        //optional로 감싸면 값이 null이 와도 클라이언트에서 처리 가능
    }
    @Override
    public Optional<Member> findByName(String name) {
        return store.values().stream()
                .filter(member -> member.getName().equals(name))
                .findAny();
    }
    @Override
    public List<Member> findAll() {
        return new ArrayList<>(store.values());
    }

    public void clearStore(){
        store.clear();
    }
}
```

- MVC 패턴에서 Model에 해당하는 부분으로 POJO로는 접근 불가
- Persistence Layer와 1:1매칭
- Java Persistence API 구현체를 이용하여 자바 객체로 접근 가능

### DAO(Data Access Object)

- 원래 DB의 데이터와 프로그래밍 언어는 패러다임의 불일치로 인해 사용할 수 없다.
- 따라서 별도의 SQL을 작성하고 SQL을 객체의 필드에 하나씩 매핑하거나 순수한 SQL을 작성해 사용해야함

### Entity

```java
package hello.hellospring.domain;

public class Member {

    private Long id;
    private String name;
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
}
```

- 별도의 Entity Class를 사용하여 그 클래스를 테이블과 1:1매칭 할 수 있다.
- 이러한 Entity Class는 도메인이라하며 DB와 가장 가까운 클래스이다.
- Entity의 각 필드는 DB테이블과 1:1 매칭되며 따라서 PK를 가진다.
- Entity는 순수한 도메인 로직과 비즈니스 로직만 가지고 있어야한다.
- Entity는 DB의 데이터를 전달해주고 Service에서 사용할 비즈니스 로직만을 가져야한다.

### DTO(Data Transfer Object)

![Untitled](/img/이미지 창고/Untitled.png)

- Entity를 통해 DB에서 데이터를 꺼내 왔지만, 한가지 문제가 있다.
- 요청을 받고 데이터를 처리하고 반환해주기 위해선 데이터에 접근해야하는데 여기서 Controller,  Presentation Layer의 경우 클라이언트와 직접 맞닿는 부분이고 Entity는 Presentation Layer와 완전히 분리되어야함.

이럴때 DTO를 사용한다.

```java
@Data
    @AllArgsConstructor
    static class MemberDto {
        private String name;
        private Address address;
    }
```

- Getter/Setter 없음
- Wrapping 된 순수한 데이터 객체
- Entity에 직접 접근하지 않기 때문에 Entity가 변경되어도 DTO만 변경하면 된다.

# Spring 프로젝트의 구조

## Domain

```java
@Entity
@Getter @Setter
public class Member {
    @Id @GeneratedValue
    @Column(name = "member_id")
    private Long id;
```

- DB 테이블과 1:1 매칭
- 현재 관련된 객체 없음

## Repository

```java
@Repository
@RequiredArgsConstructor
public class MemberRepository{

    private final EntityManager em;
```

- Entity를 통해 데이터를 DB에 저장
- Entity는 DB의 데이터와 매칭된 것
    
    실제 DB에 데이터를 저장하는 건 Repository클래스의 Entity Manager를 통해 이루어진다.
    

## Service

```java
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor 
public class MemberService {

    private final MemberRepository memberRepository;
```

- Presentation(View)에서 Entity에 직접 접근하지 않고 비즈니스 로직을 처리할 수 있도록하는 Layer
- Repository에 정의된 비즈니스 로직을 처리하거나 Entity에 접근

## Controller

```java
@RestController // Response + Request
@RequiredArgsConstructor
public class MemberApiController {
    private final MemberService memberService;
    
    @GetMapping("api/v1/members")
    public Result<List<MemberDto>> memberV2() {
```

- Presentation Layer로 클라이언트 요청을 처리
- Entity는 서비스에 의해 추상화되어 직접 접근 불가능
- 서비스에 정의된 비즈니스 로직을 호출
- ResponseBody에 데이터를 담아 반환해줌

출처: 

[Spring 의 시작, 프레임워크의 구성요소와 동작원리](https://asfirstalways.tistory.com/334)

[[Spring] Spring Framework란? 기본 개념 핵심 정리](https://khj93.tistory.com/entry/Spring-Spring-Framework%EB%9E%80-%EA%B8%B0%EB%B3%B8-%EA%B0%9C%EB%85%90-%ED%95%B5%EC%8B%AC-%EC%A0%95%EB%A6%AC)

[스프링과 DAO, DTO, Repository, Entity](https://velog.io/@agugu95/%EC%8A%A4%ED%94%84%EB%A7%81-%ED%8C%A8%ED%84%B4%EA%B3%BC-DAO-DTO-Repository)



---

#Java #Spring_Java 

---
