---
종료 날짜: 2025-04-10
시작 날짜: 2025-04-10
분류: 공부
카테고리: BackEnd
세부 카테고리:
  - Java
  - Spring

slug: "Thread-Local-Code"
---
## LogTrace Interface
```java
package hello.advanced.trace.logtrace;
import hello.advanced.trace.TraceStatus;

public interface LogTrace {
TraceStatus begin(String message);
	void end(TraceStatus status);
	void exception(TraceStatus status, Exception e);
}
```

## FieldLogTrace
```java
package hello.advanced.trace.logtrace;
import hello.advanced.trace.TraceId;

import hello.advanced.trace.TraceStatus;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class FieldLogTrace implements LogTrace {
	private static final String START_PREFIX = "-->";
	private static final String COMPLETE_PREFIX = "<--";
	private static final String EX_PREFIX = "<X-";
	private TraceId traceIdHolder; //traceId 동기화, 동시성 이슈 발생
	@Override
	public TraceStatus begin(String message) {
		syncTraceId();
		TraceId traceId = traceIdHolder;
		Long startTimeMs = System.currentTimeMillis();
		
		log.info("[{}] {}{}", traceId.getId(), addSpace(START_PREFIX, traceId.getLevel()), message);
		return new TraceStatus(traceId, startTimeMs, message);
	}
	@Override
	public void end(TraceStatus status) {
		complete(status, null);
	}
	@Override
	public void exception(TraceStatus status, Exception e) {
		complete(status, e);
	}
	private void complete(TraceStatus status, Exception e) {
		Long stopTimeMs = System.currentTimeMillis();
		long resultTimeMs = stopTimeMs - status.getStartTimeMs();
		TraceId traceId = status.getTraceId();
		if (e == null) {
			log.info("[{}] {}{} time={}ms", traceId.getId(), addSpace(COMPLETE_PREFIX, traceId.getLevel()), status.getMessage(), resultTimeMs);
		} else {
			log.info("[{}] {}{} time={}ms ex={}", traceId.getId(), addSpace(EX_PREFIX, traceId.getLevel()),status.getMessage(), resultTimeMs, e.toString());
		}

		releaseTraceId();
	}
	private void syncTraceId() {
		if (traceIdHolder == null) {
			traceIdHolder = new TraceId();
		} else {
			traceIdHolder = traceIdHolder.createNextId();
		}
	}
	private void releaseTraceId() {
		if (traceIdHolder.isFirstLevel()) {
			traceIdHolder = null; //destroy
		} else {
			traceIdHolder = traceIdHolder.createPreviousId();
		}
	}
	private static String addSpace(String prefix, int level) {
		StringBuilder sb = new StringBuilder();
		
		for (int i = 0; i < level; i++) {
			sb.append( (i == level - 1) ? "|" + prefix : "| ");
		}
		return sb.toString();
	}
}
```

# 동시성 테스트
## FieldService
- 테스트 코드에 위치한다.
```java
package hello.advanced.trace.threadlocal.code;
import lombok.extern.slf4j.Slf4j;
@Slf4j
public class FieldService {
	private String nameStore;
	public String logic(String name) {
		log.info("저장 name={} -> nameStore={}", name, nameStore);
		nameStore = name;
		sleep(1000);
		log.info("조회 nameStore={}",nameStore);
		return nameStore;
	}
	private void sleep(int millis) {
		try {
			Thread.sleep(millis);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
}
```

## FieldService Test
```java
package hello.advanced.trace.threadlocal;
import hello.advanced.trace.threadlocal.code.FieldService;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
@Slf4j
public class FieldServiceTest {
	private FieldService fieldService = new FieldService();
	@Test
	void field() {
		log.info("main start");
		Runnable userA = () -> {
			fieldService.logic("userA");
		};
		Runnable userB = () -> {
			fieldService.logic("userB");
		};
		Thread threadA = new Thread(userA);
		threadA.setName("thread-A");
		
		Thread threadB = new Thread(userB);
		threadB.setName("thread-B");
		
		threadA.start(); //A실행
		sleep(2000); //동시성 문제 발생X
		// sleep(100); //동시성 문제 발생O
		
		threadB.start(); //B실행
		sleep(3000); //메인 쓰레드 종료 대기
		
		log.info("main exit");
	}
	private void sleep(int millis) {
		try {
			Thread.sleep(millis);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
}
```
