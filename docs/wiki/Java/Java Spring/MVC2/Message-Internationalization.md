---
slug: "Message-Internationalization"
---
- [Message & Internationalization?](#Message & Internationalization?)
	- [Message](#Message & Internationalization?#Message)
	- [Internationlization](#Message & Internationalization?#Internationlization)
	- [Spring Message Source 사용](#Message & Internationalization?#Spring Message Source 사용)
		- [MessageSource Interface](#Spring Message Source 사용#MessageSource Interface)
		- [실습](#Spring Message Source 사용#실습)
- [웹 애플리케이션에 적용하기](#웹 애플리케이션에 적용하기)
	- [Message](#웹 애플리케이션에 적용하기#Message)
		- [ThymLeaf 메시지 적용법](#Message#ThymLeaf 메시지 적용법)
	- [Internationalization](#웹 애플리케이션에 적용하기#Internationalization)
		- [Choose Internationalization message of Spring](#Internationalization#Choose Internationalization message of Spring)
		- [LocaleResolver](#Internationalization#LocaleResolver)

:::INFO 프로젝트 폴더 정보
message-start 코드를 중심으로 사용
message-start -> message라고 변경 후에 프로젝트 진행하기

:::

# Message & Internationalization?

## Message

:::example 예시
프로젝트에 **상품명**이라고 되어있는 단어를 모두 **상품 이름**이라고 고쳐달라고 하면 어떻게 해야할까?
:::

- 해당 문제에서 만약 문제가 생긴다면, 분명 하드코딩으로 프론트 단을 짰을 때의 예기이다.
- 우린 초보이고, 현 코드 상에서는 hardcoding되어있는 상태이다보니, 이러한 문제를 해결하기 위해서는, 중앙에서 해당하는 단어들을 관리해야한다.
- 이런 다양한 메세지를 한 곳에서 관리하기 하도록하는 기능을 <mark>Message 기능</mark>이라고 한다.

```properties
item=상품
item.id=상품 ID
item.itemName=상품명
item.price=가격
item.quantity=수량
```
`messages.properties`

## Internationlization
- 메시지에서 설명한 메시지 파일`message properties` 을 나라별로 별도로 관리하면 서비스를 국제화 할 수 있다.
- 예를 들면 아래와 같이 2개의 파일을 만들어서 분류한다.
`messages_en.properties`
```properties
item=Item
item.id=Item ID
item.itemName=Item Name
item.price=price
item.quantity=quantity
```

`messages_kr.properties`
```properties
item=상품
item.id=상품 ID
item.itemName=상품명
item.price=가격
item.quantity=수량

```
- 위와 같은 방식으로 사이트를 국제화 시키면 된다.

- 한국에서 접근하는 것인지, 영어에서 접근하는 방식인지는 HTTP `accept-language` 헤더 값을 사용하거나 사용자가 직접 언어를 선택하도록 하고, 쿠키 등을 사용해서 처리하면 된다.

대부분은 SpringBoot를 사용하다보니, 굳이 Bean으로 등록할 필요는 없다.
아래의 코드만 추가 해주면 된다.
```properties
spring.messages.basename=message, config.i18n.message
```
`application.properties`
- 하지만, 기본적으로 SpringBoot에서는 message부분은 자동으로 등록해줍니다.
```properties
spring.messages.basename=message
```
- `MessageSource`를 Spring Bean으로 등록하지 않고, 스프링 부트와 관련된 별도의 설정을 하지 않으면, `message` 라는 이름으로 기본 등록 됩니다.
- 그래서 `messages_en,properties`, `messages_kr.properties` 등등 파일만 등록하면 자동으로 인식 된다.

## Spring Message Source 사용

### MessageSource Interface
```java
public interface MessageSource{
	String getMessage(String code, @Nullable Object[] args, @Nullable String defaultMessage, Locale locale);
	String getMessage(String code, @Nullable Object[] args, Locale locale) throws NoSuchMessageException;
}
```
- `MessageSource` 인터페이스를 보면 코드를 포함한 일부 파라미터로 메시지를 읽어오는 기능을 제공한다.

### 실습

:::Example MessageSourceTest
Path : `test/java/hello/itemservice/domain/message/MessageSourceTest.java`

:::

```java
...
import static org.assertj.core.api.Assertions.*;
...


@SpringBootTest  
public class MessageSourceTest {  
  
    @Autowired  
    MessageSource ms;  
  
    @Test  
    void helloMessage(){  
        String result = ms.getMessage("hello", null, null);  
        Assertions.assertThat(result).isEqualTo("안녕");  
    }  
}

// 해당 메시지를 찾지 못했을 때 생성되는 Error를 Throw Exception 처리 하였다.  
@Test  
void notFoundMessageCode(){  
    assertThatThrownBy(()-> ms.getMessage("no_code", null, null))  
            .isInstanceOf(NoSuchFieldError.class);  
}
// hello.name에서 {0} 부분을 Spring이라는 문자로 치환해서 테스트 진행
@Test
void argumentMessage(){
	String message = ms.getMessage("hello.name", new Object[]{"Spring"}, null);
	assertThat(message).isEqualTo("안녕 Spring");
}

// meesage.properties 처럼 다른 옵션이 없다면, 자동으로 default로 설정 된다.
@Test  
void defaultLang(){  
    assertThat(ms.getMessage("hello", null, null)).isEqualTo("안녕");  
    assertThat(ms.getMessage("hello", null, Locale.KOREA)).isEqualTo("안녕");  
}

//영어 message
@Test  
void enLang(){  
    assertThat(ms.getMessage("hello", null, Locale.ENGLISH)).isEqualTo("hello");  
}

```


# 웹 애플리케이션에 적용하기

## Message
`message.properties`
```properties
hello=안녕  
hello.name=안녕 {0}  
label.item=상품 IDlabel.item.itemName=상품명  
label.item.price=가격  
label.item.quantity=수량  
  
page.items=상품 목록  
page.item=상품 상세  
page.addItem=상품 등록  
page.updateItem=상품 수정  
  
button.save=저장  
button.cancel=취소
```

### ThymLeaf 메시지 적용법
- ThymLeaf 메시지 표현식은 `#{...}`를 사용하면 ㄴ스프링의 메시지를 편리하게 조회 할 수 있다.
`templates/message/items.html`
```html
...
<div>
	<h2 th:text="#{label.item}">상품 등록</h2>
</div>
...
```
- 이는 반복 ThymLeaf 작업이기 때문에 예시로 간단하게 아래에만 적고 넘어가겠습니다.
```html
<!--
페이지 이름에 적용
-->
<h2 th:text="#{page.addItem}">상품 등록 폼</h2>

<!--
레이블에 적용
-->
<label for="itemName" th:text="#{label.item.itemName}">상품명</label>
<label for="itemName" th:text="#{label.item.price}">가격</label>
<label for="itemName" th:text="#{label.item.quantity}">수량</label>

```
`addForm.html`

## Internationalization

```properties
hello=hello  
hello.name=hello {0}  
  
label.item.id=Item ID  
label.item.itemName=Item Name  
label.item.price=price  
label.item.quantity=quantity  
  
page.items=Item List  
page.item=Item Detail  
page.addItem=Item Add  
page.updateItem=Item Update  
  
button.save=Save  
button.cancel=Cancel
```
`imessages_en.properties`
- 이미 위에서 templete 파일에 메시지를 사용하도록 적용이 끝났기 때문에 더 이상 추가할 작업은 없다.
- 크롬 혹은 다른 브라우저에서 우선 순위를 영어로 변경하게 된다면, 해당 국제화가 적용 된다.

### Choose Internationalization message of Spring
- 앞서 `MessageSource` 테스트에서 보았듯이 메시지 기능은 `Locale`정보를 알아야 언어를 선택 할 수 있습니다.
- Spring은 언어 선택시 기본으로 `Accept-Language` 헤더의 값을 사용합니다.

### LocaleResolver
- Spring은 `Locale` 선택 방식을 변경할 수 있도록 `LocaleResolver`라는 인터페이스를 제공하는데, 스프링 부트는 기본으로 `Accept-Language`를 활용하는 `AcceptHeaderLocaleResolver`를 사용합니다.



---

#Spring_Java #Java 

---
