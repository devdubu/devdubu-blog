---
slug: "FieldError-생성자"
---
# FieldError 생성자
`FieldError`는 두 가지 생성자를 제공한다.
```java
public FieldError(String objectName, String field, String defaultMessage);
public FieldError(String objectName, String field, @Nullable Object rejectedValue, boolean bindingFailure, @Nullable String[] codes, @Nullable Object[] arguments, @Nullable String defaultMessage)
```

## 파라미터 목록
|파라미터 이름|설명|
|--|--|
|`objectName`|오류가 발생한 객체 이름|
|`field`|오류 필드|
|`rejectedValue`|사용자가 입력한 값(거절된 값)|
|`codes`|메시지에서 사용하는 인자|
|`arguments`|메시지에서 사용하는 인자|
|`defaultMessage`|기본 오류 메시지|

- `ObjectError`도 유사하게 두 가지 생성자를 제공한다.

## 오류 발생시 사용자 입력 값 유지
```java
new FieldError("item", "price", item.getPrice(), false, null, null, "가격은 1,000 ~ 1,000,000 까지 허용합니다.")
```
- 사용자의 입력 데이터가 컨트롤러의 `@ModelAttribute`에 바인딩 되는 시점에 오류가 발생하면 모델 객체에 사용자 입력 값을 유지하기 어렵다.
- 예를 들어 가격에 숫자가 아닌 문자가 입력된다면, 가격은 `Integer` 타입이므로 문자를 보관할 수 있는 방법이 없다.
- 그래서 <mark>오류가 발생한 경우</mark> 사용자 입력 값을 <mark>보관하는 별도의 방법</mark>이 필요하다.
- 이렇게 보관한 사용자 입력 값을 검증 오류 발생시 화면에 다시 출력되면 된다.
- `FeildError` 오류 발생시 사용자 입력 값을 저장하는 기능을 제공한다.

- 여기서 `rejectdValue`가 바로 오류 발생시 사용자 입력 값을 저장하는 필드이다.
- `bindingFailure`는 타입 오류 같은 바인딩이 실패했는지 여부를 적어주면 된다.
- 여기서는 바인딩이 실패한 것은 아니기 때문에 `false`를 사용한다.

## 타임리프 사용자 입력 값 유지
- `th:field="*{price}*"`
- 타입리프의 `th:field`는 매우 똑똑하게 동작하는데, 정상 상황에는 모델 객체의 값을 사용하지만, 오류가 발생하면 `FieldError`에서 보관한 값을 사용해서 값을 출력한다.

## Spring 바인딩 오류 처리
- 타입 오류로 바인딩에 실패하면, 스프링은 FieldError를 생성하면서 사용자가 입력한 값을 넣어둔다.
- 해당 오류를 `BindingResult`에 담아서 컨트롤러를 호출한다.
- 따라서 타입 오류 같은 바인딩 실패시에도 사용자의 오류 메시지를 정상 출력이 가능하다.

---

#Java #Spring_Java 

---