---
slug: "BindingResult-와-Errors"
---
:::tip BindingResult 와 Errors
- `org.springframework.validation.Errors`
- `org.springframework.validation.BindingResult`
`BindingResult`는 인터페이스이고, Errors 인터페이스를 상속받고 있다.
실제 넘어오는 구현체는 `BeanPropertyBindingResult` 라는것인데, 둘 다 구현하고 있으므로 `BindingResult` 대신에 `Errors`를 사용해도 된다.
`Errors` 인터페이스는 단순한 오류 저장과 조회 기능을 제공한다.
`BindingResult`는 여기에 더해서 추가적인 기능들을 제공한다.
`addError()`도 `BindingResult`가 제공하므로 여기서는 `BindingResult`를 사용하자.
주로 관례상 `BindingResult`를 많이 사용한다.


:::

---

#Java #Spring_Java 

---
