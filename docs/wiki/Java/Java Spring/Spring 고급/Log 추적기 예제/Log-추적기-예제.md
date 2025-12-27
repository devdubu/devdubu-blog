---
slug: "Log-추적기-예제"
---
# V0
## `OrderRepositoryV0`
```java
package hello.advanced.app.v0;

import org.springframework.stereotype.Repository;
import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class OrderRepositoryV0 {
    // 저장 로직
    public void save(String itemId) {
        // 저장 로직
        if (itemId.equals("ex")) {
            throw new IllegalStateException("예외 발생");
        }
        sleep(1000);
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

## `OrderServiceV0`
```java
package hello.advanced.app.v0;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderServiceV0 {
	private final OrderRepositoryV0 orderRepository;
	public void orderItem(String itemId) {
		orderRepository.save(itemId);
	}
}
```

## `OrderControllerV0`
```java
package hello.advanced.app.v0;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class OrderControllerV0 {
	private final OrderServiceV0 orderService;
	
	@GetMapping("/v0/request")
	public String request(String itemId) {
		orderService.orderItem(itemId);
	return "ok";
	}
}
```

# V1

## `TraceId`
```java
package hello.advanced.trace;

import java.util.UUID;

public class TraceId {
    private String id;
    private int level;

    public TraceId() {
        this.id = createId();
        this.level = 0;
    }

    private TraceId(String id, int level) {
        this.id = id;
        this.level = level;
    }

    private String createId() {
        return UUID.randomUUID().toString().substring(0, 8);
    }

    public TraceId createNextId() {
        return new TraceId(id, level + 1);
    }

    public TraceId createPreviousId() {
        return new TraceId(id, level - 1);
    }

    public boolean isFirstLevel() {
        return level == 0;
    }

    public String getId() {
        return id;
    }

    public int getLevel() {
        return level;
    }
}
```


---

#Java #Spring_Java 

---
