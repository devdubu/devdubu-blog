# 필드 동기화
앞서 로그추적기를 만들면서 트랜잭션 ID와 level을 동기화 하는 문제가 있었다.
이 문제를 해결하기 위해서 `ThreadId`를 파라미터로 넘기도록 구현했다.

하지만, 문제는 로그를 출력하는 모든 메서드에 `TreadId` 파라미터를 추가해야하는 문제가 발생한다.

해당 문제를 해결하기 위해 새로운 추적기를 만든다.

다양한 구현 체로 변경할 수 있도록 우선 interface를 만들도록 한다.
[ThreadLocal Example Code#LogTrace Interface](ThreadLocal-Example-Code.md#LogTrace Interface)

`LogTrace` 인터페이스에는 로그 추적기를 위한 최소한의 기능인 `begin()` , `end()` , `exception()` 를 정의했습니다.

이제 파라미터를 넘기지 않고 `TraceId` 를 동기화 할 수 있는 `FieldLogTrace` 구현체를 만들면 됩니다.

[ThreadLocal Example Code#FieldLogTrace](ThreadLocal-Example-Code.md#FieldLogTrace)
`FieldLogTrace` 는 기존에 만들었던 `HelloTraceV2` 와 거의 같은 기능을 한다.

`TraceId` 를 동기화 하는 부분만 파라미터를 사용하는 것에서 `TraceId traceIdHolder` 필드를 사용하도록 변경
되었다.
이제 직전 로그의 `TraceId` 는 파라미터로 전달되는 것이 아니라 `FieldLogTrace` 의 필드인 `traceIdHolder` 에
저장된다.

:::info 중요
- 로그를 시작할 때 호출하는 `syncTraceId()` 와 로그를 종료할 때 호출하는 `releaseTraceId()`이다.
- `synceTraceId()`
	- `TraceId()`를 새로 만들거나 앞선 로그의 `TraceId()`를 참고해서 동기화하고, `level` 도 하나 증가한다.
	- 결과를 `traceIdHolder`에 보관한다.
- `releaseTraceId()`
	- 매서드를 추가로 호출할 때는 `level`이 하나 증가해야 하지만, 동기화 하고, 메서드 호출이 끝나면 `level`이 하나 감소 해야한다.
	- `releaseTraceId()`는 `level`을 하나 감소한다.
	- 만약 최초 호출 `level=0`이면 내부에서 관리하는 `traceId`를 제거한다.

:::

## 동시성 문제
잘 만든 로그 추적기를 실제 서비스에 배포했다 가정해보자.
테스트 할 때는 문제가 없는 것 처럼 보인다. 사실 직전에 만든 `FieldLogTrace` 는 심각한 동시성 문제를 가지고 있
다.
동시성 문제를 확인하려면 다음과 같이 동시에 여러 번 호출해보면 된다.

### 기대 결과
![Pasted-image-20241127142256.png](/img/이미지 창고/Pasted-image-20241127142256.png)
### 실제 결과
![Pasted-image-20241127142314.png](/img/이미지 창고/Pasted-image-20241127142314.png)
기대한 것과 전혀 다른 문제가 발생한다. `트랜잭션ID` 도 동일하고, `level` 도 뭔가 많이 꼬인 것 같다. 분명히 테스트 코
드로 작성할 때는 문제가 없었는데, 무엇이 문제일까?

:::warning 동시성 문제
- 이 문제는 동시성 문제이다.
- `FieldLogTrace`는 싱글톤으로 등록된 스피링 빈이다.
- 이 객체의 인스턴스가 애플리케이션에 딱 1 존재한다는 뜻이다.
- 이렇게 하나만 있는 인스턴스의 `FieldLogTrace.traceIdHolder` 필드를 여러 쓰레드가 동시에 접근하기 때문에 문제가 발생한다.

:::

### 동시성 예제 코드
동시성 문제를 조금 더 단순화하여 알아보자
테스트를 진행하려면 아래와 같이 코드를 추가합니다.
`build.gradle`
```gradle
dependencies {
	...
	//테스트에서 lombok 사용
	testCompileOnly 'org.projectlombok:lombok'
	testAnnotationProcessor 'org.projectlombok:lombok'
}
```

[ThreadLocal Example Code#FieldService](ThreadLocal-Example-Code.md#FieldService)

매우 단순한 로직이다. 파라미터로 넘어온 `name` 을 필드인 `nameStore` 에 저장한다. 그리고 1초간 쉰 다음 필드에 저
장된 `nameStore` 를 반환한다.

#### Test
[ThreadLocal Example Code#FieldService Test](ThreadLocal-Example-Code.md#FieldService Test)

#### 순서대로 실행
`sleep(2000)` 을 설정해서 `thread-A` 의 실행이 끝나고 나서 `thread-B` 가 실행되도록 하자

:::note `FieldService.logic()` 메서드는 내부에 `sleep(1000)` 으로 1초의 지연이 있다.

:::

따라서 1초 이후에 호출하면 순서대로 실행할 수 있다. 여기서는 넉넉하게 2초 (2000ms)를 설정했다.

#### 결과
![Pasted-image-20241127143032.png](/img/이미지 창고/Pasted-image-20241127143032.png)

![Pasted-image-20241127143046.png](/img/이미지 창고/Pasted-image-20241127143046.png)

실행 결과를 보면 문제가 없다.
- `Thread-A` 는 `userA` 를 `nameStore` 에 저장했다.
- `Thread-A` 는 `userA` 를 `nameStore` 에서 조회했다.
- `Thread-B` 는 `userB` 를 `nameStore` 에 저장했다.
- `Thread-B` 는 `userB` 를 `nameStore` 에서 조회했다.

#### 동시성 문제 코드
이번에는 `sleep(100)` 을 설정해서 `thread-A` 의 작업이 끝나기 전에 `thread-B` 가 실행되도록 합니다.

따라서 1초 이후에 호 출하면 순서대로 실행할 수 있다. 다음에 설정할 100(ms)는 0.1초이기 때문에 `thread-A` 의 작업이 끝나기 전에
`thread-B` 가 실행된다.

#### 결과
![Pasted-image-20241127143218.png](/img/이미지 창고/Pasted-image-20241127143218.png)
![Pasted-image-20241127143247.png](/img/이미지 창고/Pasted-image-20241127143247.png)

저장하는 부분은 문제가 없어보입니다.
하지만, 조회하는 부분에서는 문제가 생기게 됩니다.
![Pasted-image-20241127143321.png](/img/이미지 창고/Pasted-image-20241127143321.png)

0.1초 이후에 `thread-B` 가 `userB` 의 값을 `nameStore` 에 보관한다. 기존에 `nameStore` 에 보관되어 있던
`userA` 값은 제거되고 `userB` 값이 저장된다.

![Pasted-image-20241127143335.png](/img/이미지 창고/Pasted-image-20241127143335.png)

`thread-A` 의 호출이 끝나면서 `nameStore` 의 결과를 반환받는데, 이때 `nameStore` 는 앞의 2번에서
`userB` 의 값으로 대체되었다. 따라서 기대했던 `userA` 의 값이 아니라 `userB` 의 값이 반환된다.
`thread-B` 의 호출이 끝나면서 `nameStore` 의 결과인 `userB` 를 반환받는다.


---

#Java #Spring_Java 

---