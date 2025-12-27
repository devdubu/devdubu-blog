---
slug: "Template-Method"
---
지금까지 로그 추적기를 만들었다. 파라미터를 넘기는 불편함을 제거하기 위해 쓰레드 로컬도 도입하였다.
그런데 로그 추적기를 도입하려고 하니, 개발자들의 반대의 목소리가 높았다 왜 일까
```java
//OrderControllerV0 코드

@GetMapping("/v0/request")
public String request(String itemId) {
	orderService.orderItem(itemId);
	return "ok";
}
//OrderServiceV0 코드
public void orderItem(String itemId) {
	orderRepository.save(itemId);
}
```

로그 추적기 도입 후 v3 코드
```java
//OrderControllerV3 코드
@GetMapping("/v3/request")
public String request(String itemId) {
	TraceStatus status = null;
	try {
		status = trace.begin("OrderController.request()");
		orderService.orderItem(itemId); //핵심 기능
		trace.end(status);
	} catch (Exception e) {
		trace.exception(status, e);
		throw e;
	}
	return "ok";
}
//OrderServiceV3 코드
public void orderItem(String itemId) {
	TraceStatus status = null;
	try {
		status = trace.begin("OrderService.orderItem()");
		orderRepository.save(itemId); //핵심 기능
		trace.end(status);
	} catch (Exception e) {
		trace.exception(status, e);
		throw e;
	}
}
```

v0 시절 코드와 비교해서 v3를 보게 된다면,
v0는 해당 메서드가 실제 처리해야 하는 핵심 기능만 깔끔하게 남아 있다.
반면에 V3에는 핵심 기능보다 로그를 출력해야 하는 부가 기능 코드가 훨씬 많고 복잡하다.

:::note 핵심 기능
- 핵심 기능은 해당 객체가 제공하는 고유의 기능이다.
- 예를 들어서 `orderService`의 핵심 기능은 주문 로직이다.
- 메서드 단위로 보면 `orderService.orderItem()`의 핵심 기능은 주문 데이터를 저장하기 위해 리포지토리를 호출하는 `orderRepository.save(itemId)` 코드가 핵심 기능이다.

:::

:::tip 부가 기능
- 핵심 기능을 보조하기 위해 제공되는 기능이다.
- 예를 들어서 로그 추적 로직, 트랜잭션 기능이 있다.
- 이러한 부가 기능은 단독으로 사용되지는 않고, 핵심 기능과 함께 사용된다.
- 예를 들어서 로그 추적 기능은 어떤 핵심 기능이 호출 되었는지 로그를 남기기 위해 사용된다.
- 그러니까 핵심 기능을 보조하기 위해 존재한다.

:::

V0는 핵심 기능만 있지만, 로그 추적기를 추가한 v3 코드는 핵심 기능과 부가 기능이 함께 섞여 잇다.
v3를 보면 로그 추적기의 도입으로 핵심 기능 코드보다 부가 기능을 처리 하기 위한 코드가 더 많아졌다.
소위 배보다 배꼽이 더 큰 상황이다..

만약 클래스가 수백 개라면?

이 문제를 좀 더 효율적으로 처리 할 수 있는 방법이 있을까?
v3 코드를 유심히 잘 살펴보면 다음과 같이 동일한 패턴이 있다.
```java
TraceStatus status = null;
try {
	status = trace.begin("message");
	//핵심 기능 호출
	trace.end(status);
} catch (Exception e) {
	trace.exception(status, e);
	throw e;
}
```
`Controller`, `Service`, `Repository` 의 코드를 잘 보면, 로그 추적기를 사용하는 구조는 모두 동일하다.
중간에 핵심 기능을 사용하는 코드만 다를 뿐이다.
부가 기능과 관련된 코드가 중복이니 중복을 별도의 메서드로 뽑아내면 될 것 같다.
그런데 `try ~ catch`는 물론이고, 핵심 기능 부분이 중간에 있어서 단순하게 메서드로 추출하는 것은 어렵다.

:::success 변하는 것과 변하지 않는 것을 분리
- 좋은 설계는 변하는 것과 변하지 않는 것을 분리하는 것이다.

:::

여기서 핵심 기능 부분은 변하고, 로그 추적기를 사용하는 부분은 변하지 않는 부분이다.
이 둘은 분리해서 모듈화 해야 한다.
템플릿 메서드 패턴은 이런 문제를 해결하는 디자인 패턴이다.

# Template Method Pattern
해당 예제 코드는 아래와 같다.
```java
package hello.advanced.trace.template;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
@Slf4j
public class TemplateMethodTest {
	@Test
	void templateMethodV0() {
		logic1();
		logic2();
	}
	
	private void logic1() {
		long startTime = System.currentTimeMillis();
	
		//비즈니스 로직 실행
		log.info("비즈니스 로직1 실행");
		
		//비즈니스 로직 종료
		long endTime = System.currentTimeMillis();
		long resultTime = endTime - startTime;
		log.info("resultTime={}", resultTime);
	}
	
	private void logic2() {
		long startTime = System.currentTimeMillis();
		
		//비즈니스 로직 실행
		log.info("비즈니스 로직2 실행");
		
		//비즈니스 로직 종료
		long endTime = System.currentTimeMillis();
		long resultTime = endTime - startTime;
		log.info("resultTime={}", resultTime);
	}
}
```

`logic()`, `logic2()`를 호출하는 단순한 테스트 코드 이다.

실행 결과
```
비즈니스 로직1 실행
resultTime=5
비즈니스 로직2 실행
resultTime=1
```

`logic1()`과 `logic2()`는 시간을 측정하는 부분과 비즈니스 로직을 실행하는 부분이 함께 존재한다.
- 변하는 부분 : 비즈니스 로직
- 변하지 않는 부분: 시간 측정
이제 템플릿 메서드 패턴을 사용해서 변하는 부분과 변하지 않는 부분을 분리해보자


## Template Method Pattern
![Pasted-image-20250225164954.png](/img/이미지 창고/Pasted-image-20250225164954.png)
`AbstraceTemplate`
`/src/test`
```java
package hello.advanced.trace.template.code;
import lombok.extern.slf4j.Slf4j;
@Slf4j
public abstract class AbstractTemplate {
	public void execute() {
		long startTime = System.currentTimeMillis();
		
		//비즈니스 로직 실행
		call(); //상속
		
		//비즈니스 로직 종료
		long endTime = System.currentTimeMillis();
		long resultTime = endTime - startTime;
		l
		og.info("resultTime={}", resultTime);
	}
	protected abstract void call();
}
```

Template Method 패턴은 이름 그대로 템플릿을 사용하는 방식이다.
템플릿은 기준이 되는 거대한 틀이다.
템플릿이라는 틀에 변하지 않는 부분을 몰아둔다.

그리고 일부 변하는 부분을 별도로 호출해서 해결한다.

`AbstractTemplate` 코드를 보자.
변하지 않는 부분인 시간 측정 로직을 몰아둔 것을 확인 할 수 있다.
이제 이것이 하나의 템플릿이 된다.
그리고 템플릿 안에서 변하는 부분은 `call()` 메서드를 호출해서 처리한다.

템플릿 메서드 패턴은 부모 클래스에 변하지 않는 템플릿 코드를 둔다.
그리고 변하는 부분은 자식 클래스에 두고 상속과 오버라이딩을 사용해 처리한다.

### subClassLogic1
```java
package hello.advanced.trace.template.code;
import lombok.extern.slf4j.Slf4j;
@Slf4j
public class SubClassLogic1 extends AbstractTemplate {
	@Override
	protected void call() {
		log.info("비즈니스 로직1 실행");
	}
}
```
변하는 부분인 비즈니스 로직1을 처리하는 자식 클래스이다.
템플릿이 호출하는 대상인 `call()`메서드를 오버라이딩 한다.

### subClassLogic2
```java
package hello.advanced.trace.template.code;
import lombok.extern.slf4j.Slf4j;
@Slf4j
public class SubClassLogic2 extends AbstractTemplate {
@Override
	protected void call() {
		log.info("비즈니스 로직2 실행");
	}
}
```
변하는 부분인 비즈니스 로직2를 처리하는 자식 클래스이다.
템플릿이 호출하는 대상인 `call()` 메서드를 오버라이딩 한다.

### TemplateMethodTest - templateMethodV1() 추가
```java
/**
* 템플릿 메서드 패턴 적용
*/
@Test
void templateMethodV1() {
AbstractTemplate template1 = new SubClassLogic1();
	template1.execute();
	AbstractTemplate template2 = new SubClassLogic2();
	template2.execute();
}
```
템플릿 메서드 패턴으로 구현한 코드를 실행해보자

#### 실행 결과
```
비즈니스 로직1 실행
resultTime=0
비즈니스 로직2 실행
resultTime=1
```

![Pasted-image-20250225165618.png](/img/이미지 창고/Pasted-image-20250225165618.png)
`template1.execute()`를 호출하면 템플릿 로직인 `AbstractTemplate.execute()`를 실행한다.
여기서 중간에 `call()` 메서드를 호출하는데, 이 부분이 오버라이딩 되어있다.
따라서 현재 인스턴스 `SubClassLogic1` 인스턴스의 `SubClassLogic1.call()` 메서드가 호출된다.

템플릿 메서드 패턴은 이렇게 다형성을 사용해서 변하는 부분과 변하지 않는 부분을 분리하는 방법이다.

## Template Method Pattern
#### 익명 내부 클래스 사용하기
템플릿 메서드 패턴은 `SubClassLogic1` , `SubClassLogic2` 처럼 클래스를 계속 만들어야 하는 단점이 있다. 
**익명 내부 클래스**를 사용하면 이런 단점을 보완할 수 있다.

익명 내부 클래스를 사용하면 객체 인스턴스를 생성하면서 동시에 생성할 클래스를 상속 받은 자식 클래스를 정의할 수
있다. 
이 클래스는 `SubClassLogic1` 처럼 직접 지정하는 이름이 없고 클래스 내부에 선언되는 클래스여서 익명 내부
클래스라 한다.

```java
/**
* 템플릿 메서드 패턴, 익명 내부 클래스 사용
*/
@Test
void templateMethodV2() {
	AbstractTemplate template1 = new AbstractTemplate() {
	@Override
		protected void call() {
			log.info("비즈니스 로직1 실행");
		}
	};
	log.info("클래스 이름1={}", template1.getClass());
	template1.execute();
	AbstractTemplate template2 = new AbstractTemplate() {
		@Override
		protected void call() {
			log.info("비즈니스 로직1 실행");
		}
	};
	log.info("클래스 이름2={}", template2.getClass());
	template2.execute();
}
```

#### 실행 결과
```
클래스 이름1 class hello.advanced.trace.template.TemplateMethodTest$1
비즈니스 로직1 실행
resultTime=3
클래스 이름2 class hello.advanced.trace.template.TemplateMethodTest$2
비즈니스 로직2 실행
resultTime=0
```

실행 결과를 보면 자바가 임의로 만들어주는 익명 내부 클래스 이름은 `TemplateMethodTest$1` ,
`TemplateMethodTest$2` 인 것을 확인할 수 있다.

![Pasted-image-20250225170609.png](/img/이미지 창고/Pasted-image-20250225170609.png)


# Template Method Pattern 정의
GOF 디자인 패턴에서는 Template Pattern을 다음과 같이 정의했다.
:::note 템플릿 메서드 디자인 패턴의 목적은 다음과 같다.
- 작업에서 알고리즘의 골격을 정의하고, 일부 단계를 하위 클래스로 연기합니다.
- 템플릿 메서드를 사용하면 하위 클래스가 알고리즘의 구조를 변경하지 않고도, 알고리즘의 특정 단계를 재정의 할 수 있다.

:::

![Pasted-image-20250225170810.png](/img/이미지 창고/Pasted-image-20250225170810.png)

부모 클래스에 알고리즘의 골격인 템플릿을 정의하고, 일부 변경되는 로직은 자식 클래스에 정의하는 것이다. 
이렇게 하면 자식 클래스가 알고리즘의 전체 구조를 변경하지 않고, 특정 부분만 재정의할 수 있다. 
결국 상속과 오버라이딩을 통한 다형성으로 문제를 해결하는 것이다.

:::warning 
- 템플릿 메서드 패턴은 상속을 사용한다. 
- 따라서 상속에서 오는 단점들을 그대로 안고간다. 특히 자식 클래스가 부모 클래스와 컴파일 시점에 강하게 결합되는 문제가 있다. 
- 이것은 의존관계에 대한 문제이다. 
- 자식 클래스 입장에서는 부모 클래스의 기능을 전혀 사용하지 않는다.


:::

이번 장에서 지금까지 작성했던 코드를 떠올려보자. 
자식 클래스를 작성할 때 부모 클래스의 기능을 사용한 것이 있었던가?

그럼에도 불구하고 템플릿 메서드 패턴을 위해 자식 클래스는 부모 클래스를 상속 받고 있다.

상속을 받는 다는 것은 특정 <mark>부모 클래스를 의존</mark>하고 있다는 것이다. 
자식 클래스의 `extends` 다음에 바로 부모 클래스가 코드상에 지정되어 있다. 
따라서 부모 클래스의 기능을 사용하든 사용하지 않든 간에 부모 클래스를 강하게 의존하게 된다. 
여기서 강하게 의존한다는 뜻은 자식 클래스의 코드에 부모 클래스의 코드가 명확하게 적혀 있다는 뜻이다.

UML에서 상속을 받으면 삼각형 화살표가 `자식 -> 부모` 를 향하고 있는 것은 이런 의존 관계를 반영하는 것이다.

자식 클래스 입장에서는 부모 클래스의 기능을 전혀 사용하지 않는데, 부모 클래스를 알아야한다. 
이것은 좋은 설계가 아니다. 
그리고 이런 잘못된 의존관계 때문에 부모 클래스를 수정하면, 자식 클래스에도 영향을 줄 수 있다.

추가로 템플릿 메서드 패턴은 상속 구조를 사용하기 때문에, 별도의 클래스나 익명 내부 클래스를 만들어야 하는 부분도
복잡하다.



:::question 지금까지 설명한 이런 부분들을 더 깔끔하게 개선하려면 어떻게 해야할까?


:::

템플릿 메서드 패턴과 비슷한 역할을 하면서 상속의 단점을 제거할 수 있는 디자인 패턴이 바로 ==전략 패턴(Strategy
Pattern)이다==.


# Strategy Pattern
탬플릿 메서드 패턴은 부모 클래스에 변하지 않는 템플릿을 두고, 
변하는 부분을 자식 클래스에 두어서 상속을 사용해서 문제를 해결했다.

전략 패턴은 변하지 않는 부분을 `Context` 라는 곳에 두고, 변하는 부분을 `Strategy` 라는 인터페이스를 만들고 해당인터페이스를 구현하도록 해서 문제를 해결한다. 

상속이 아니라 <mark>위임</mark>으로 문제를 해결하는 것이다.
전략 패턴에서 `Context` 는 변하지 않는 템플릿 역할을 하고, `Strategy` 는 변하는 알고리즘 역할을 한다.

![Pasted-image-20250225171220.png](/img/이미지 창고/Pasted-image-20250225171220.png)

### Stategy Interface
```java
package hello.advanced.trace.strategy.code.strategy;
public interface Strategy {
	void call();
}
```
이 인터페이스는 변하는 알고리즘 역할을 한다.

**StrategyLogic1**
```java
package hello.advanced.trace.strategy.code.strategy;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class StrategyLogic1 implements Strategy {
@Override
	public void call() {
		log.info("비즈니스 로직1 실행");
	}
}
```
변하는 알고리즘은 `Strategy` 인터페이스를 구현하면 된다. 여기서는 비즈니스 로직1을 구현했다.

**StrategyLogic2**
```java
package hello.advanced.trace.strategy.code.strategy;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class StrategyLogic2 implements Strategy {
@Override
	public void call() {
		log.info("비즈니스 로직2 실행");
	}
}
```

**ContextV1**
```java
package hello.advanced.trace.strategy.code.strategy;
import lombok.extern.slf4j.Slf4j;
/**
* 필드에 전략을 보관하는 방식
*/
@Slf4j
public class ContextV1 {
	private Strategy strategy;
	public ContextV1(Strategy strategy) {
		this.strategy = strategy;
	}
	public void execute() {
		long startTime = System.currentTimeMillis();
		//비즈니스 로직 실행
		strategy.call(); //위임
		//비즈니스 로직 종료
		long endTime = System.currentTimeMillis();
		long resultTime = endTime - startTime;
		log.info("resultTime={}", resultTime);
	}
}
```
ContextV1` 은 변하지 않는 로직을 가지고 있는 템플릿 역할을 하는 코드이다. 
전략 패턴에서는 이것을 컨텍스트(문맥)이라 한다.

쉽게 이야기해서 컨텍스트(문맥)는 크게 변하지 않지만, 그 문맥 속에서 `strategy` 를 통해 일부 전략이 변경된다 생각 하면 된다.
`Context` 는 내부에 `Strategy strategy` 필드를 가지고 있다. 이 필드에 변하는 부분인 `Strategy` 의 구현체를 주입하면 된다.

:::tip 전략 패턴의 핵심은 `Context` 는 `Strategy` 인터페이스에만 의존한다는 점이다.
- 덕분에 `Strategy` 의 구현체를 변경하거나 새로 만들어도 `Context` 코드에는 영향을 주지 않는다.

:::

**ContextV1Test - 추가**
```java
/**
* 전략 패턴 적용
*/
@Test
void strategyV1() {
	Strategy strategyLogic1 = new StrategyLogic1();
	ContextV1 context1 = new ContextV1(strategyLogic1);
	context1.execute();
	Strategy strategyLogic2 = new StrategyLogic2();
	ContextV1 context2 = new ContextV1(strategyLogic2);
	context2.execute();
}
```
전략 패턴을 사용해보자.
코드를 보면 의존관계 주입을 통해 `ContextV1` 에 `Strategy` 의 구현체인 `strategyLogic1` 를 주입하는 것을 확인할 수 있다. 
이렇게해서 `Context` 안에 원하는 전략을 주입한다. 

이렇게 원하는 모양으로 조립을 완료하고 난 다음에 `context1.execute()` 를 호출해서 `context` 를 실행한다.

![Pasted-image-20250225171622.png](/img/이미지 창고/Pasted-image-20250225171622.png)
1. `Context` 에 원하는 `Strategy` 구현체를 주입한다.
2. 클라이언트는 `context` 를 실행한다.
3. `context` 는 `context` 로직을 시작한다.
4. `context` 로직 중간에 `strategy.call()` 을 호출해서 주입 받은 `strategy` 로직을 실행한다.
5. `context` 는 나머지 로직을 실행한다.

실행 결과**
```
StrategyLogic1 - 비즈니스 로직1 실행
ContextV1 - resultTime=3
StrategyLogic2 - 비즈니스 로직2 실행
ContextV1 - resultTime=0
```

---

#Java #Spring_Java 

---