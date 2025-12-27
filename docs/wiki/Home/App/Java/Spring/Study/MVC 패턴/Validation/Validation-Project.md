---
종료 날짜: 2025-04-09
시작 날짜: 2025-04-09
분류: 공부
카테고리: BackEnd
세부 카테고리:
  - Java
  - Spring
sticker: emoji//2714-fe0f

slug: "Validation-Project"
---

# Validation

:::example 요구사항
요구사항에 대한 예시를 통해서 Validation 적용
:::

## 검증 로직 추가
- 타입 검증
	- 가격, 수량에 문자가 들어가면 검증 오류 처리
- 필드 검증
	- 상품명 : 필수, 공백X
	- 가격 : 1000원 이상, 1백만원 이하
	- 수량 : 최대 9999
- 특정 필드의 범위를 넘어서는 검증
	- 가격 * 수량의 합은 10,100원 이상


:::tip 클라이언트 검증, 서버 검증
클라이언트 검증은 **조작** 할 수 있으므로 **보안에 취약**하다.
서버만으로 검증하면, **즉각적인 고객 사용성**이 **부족**해진다.
둘을 적절히 섞어서 사용하돼, **최종적**으로 **서버 검증**은 필수
API 방식을 사용하면, API 스펙을 잘 정의 해서 검증 오류를 **API 응답 결과**에 잘 남겨우어야 한다.

:::

# Project Setting V1

:::info 실습 디렉토리 준비
실습을 준비하기 위해서는 `validation_start` 파일로 프로젝트를 시작하면 됩니다.

:::

![Pasted-image-20230110141001.png](/img/이미지 창고/Pasted-image-20230110141001.png)
- 사용자가 상품 등록 폼에서 정상 범위의 데이터를 입력하면, 서버에서는 검증 로직이 통과하고, 상품을 저장하고, 상품 상세 화면으로 redirect한다.
![Pasted-image-20230110141224.png](/img/이미지 창고/Pasted-image-20230110141224.png)
- 고객의 입력값이 검증하려는 것과 일치하지 않을 때, 서버 검증 로직이 실패해야한다.
- 이렇게 검증에 실패한 경우 고객에게 다시 상품 등록 폼을 보여주고, 어떤 값을 잘못 입력했는지 친절하게 알려주어야한다.
	- 즉, 재 랜더링 및 데이터 보존

## 개발

### 상품 등록 검증
```java
package hello.itemservice.web.validation;  
  
  
import hello.itemservice.domain.item.Item;  
import hello.itemservice.domain.item.ItemRepository;  
import lombok.RequiredArgsConstructor;  
import lombok.extern.slf4j.Slf4j;  
import org.springframework.stereotype.Controller;  
import org.springframework.ui.Model;  
import org.springframework.util.StringUtils;  
import org.springframework.web.bind.annotation.*;  
import org.springframework.web.servlet.mvc.support.RedirectAttributes;  
  
import java.util.HashMap;  
import java.util.List;  
import java.util.Map;  
  
  
@Slf4j  
@Controller  
@RequestMapping("/validation/v1/items")  
@RequiredArgsConstructor  
public class ValidationItemControllerV1 {  
  
    private final ItemRepository itemRepository;  
  
    @GetMapping  
    public String items(Model model) {  
        List<Item> items = itemRepository.findAll();  
        model.addAttribute("items", items);  
        return "validation/v1/items";  
    }  
    @GetMapping("/{itemId}")  
    public String item(@PathVariable long itemId, Model model) {  
        Item item = itemRepository.findById(itemId);  
        model.addAttribute("item", item);  
        return "validation/v1/item";  
    }  
    @GetMapping("/add")  
    public String addForm(Model model) {  
        model.addAttribute("item", new Item());  
        return "validation/v1/addForm";  
    }  
    @PostMapping("/add")  
    public String addItem(@ModelAttribute Item item, RedirectAttributes redirectAttributes ,Model model) {  
  
        //검증 오류 결과를 보관  
        Map<String, String> errors = new HashMap<>();  
  
        //검증 로직  
  
        //itemName 검증  
        if(!StringUtils.hasText(item.getItemName())){  
            errors.put("itemName", "상품 이름은 필수 입니다.");  
        }  
        //price 검증  
        if(item.getPrice() == null || item.getPrice() < 1000 || item.getPrice()>1000000){  
            errors.put("price", "가격은 1,0000");  
        }  
        //quantity 검증  
        if(item.getQuantity() == null || item.getQuantity() >= 9999){  
            errors.put("quantity", "수량은 최대 9,999 까지 허용합니다.");  
        }  
        //특정 필드가 아닌 복핣 룰 검증  
        if(item.getPrice() != null && item.getQuantity() != null){  
            int resultPrice = item.getPrice()* item.getQuantity();  
            if(resultPrice < 10000){  
                errors.put("globalError", "가격 * 수량의 합은 10,000원 이상이어야 합니다. 현재 값 = "+resultPrice);  
            }        }  
        // 검증에 실패하면 다시 입력 폼으로  
        if(!errors.isEmpty()){  
            log.info("errors = {}"+errors);  
            model.addAttribute("errors");  
            return "validation/v1/addForm";  
        }  
        //아래는 성공 로직  
  
        Item savedItem = itemRepository.save(item);  
        redirectAttributes.addAttribute("itemId", savedItem.getId());  
        redirectAttributes.addAttribute("status", true);  
        return "redirect:/validation/v1/items/{itemId}";  
    }  
    @GetMapping("/{itemId}/edit")  
    public String editForm(@PathVariable Long itemId, Model model) {  
        Item item = itemRepository.findById(itemId);  
        model.addAttribute("item", item);  
        return "validation/v1/editForm";  
    }  
    @PostMapping("/{itemId}/edit")  
    public String edit(@PathVariable Long itemId, @ModelAttribute Item item) {  
        itemRepository.update(itemId, item);  
        return "redirect:/validation/v1/items/{itemId}";  
    }  
}
```
`java/hello/itemservice/web/validation/ValidationItemControllerV1.java`
- 위의 Controller의 코드를 보게 된다면, 검증 오류 보관하는 정보를 담아두는 공간인 `Map<String, String> errors = new HashMap<>();`
```html
<!DOCTYPE HTML>  
<html xmlns:th="http://www.thymeleaf.org">  
<head>  
    <meta charset="utf-8">  
    <link th:href="@{/css/bootstrap.min.css}"  
          href="../css/bootstrap.min.css" rel="stylesheet">  
    <style>  
        .container {  
            max-width: 560px;  
        }        .field-error {  
            border-color: #dc3545;  
            color: #dc3545;  
        }    </style>  
</head>  
<body>  
  
<div class="container">  
  
    <div class="py-5 text-center">  
        <h2 th:text="#{page.addItem}">상품 등록</h2>  
    </div>  
  
    <form action="item.html" th:action th:object="${item}" method="post">  
  
        <div th:if="${errors?.containsKey('globalError')}">  
            <p class="field-error" th:text="${errors['globalError']}">전체 오류 메시지</p>  
        </div>  
  
        <div>  
            <label for="itemName" th:text="#{label.item.itemName}">상품명</label>  
            <input type="text" id="itemName" th:field="*{itemName}"  
                   th:class="${errors?.containsKey('itemName')} ? 'form-control field-error' : 'form-control'"  
                   class="form-control" placeholder="이름을 입력하세요">  
            <div class="field-error" th:if="${errors?.containsKey('itemName')}" th:text="${errors['itemName']}">  
                상품명 오류  
            </div>  
        </div>  
        <div>  
            <label for="price" th:text="#{label.item.price}">가격</label>  
            <input type="text" id="price" th:field="*{price}"  
                   th:class="${errors?.containsKey('price')} ? 'form-control field-error' : 'form-control'"  
                   class="form-control" placeholder="가격을 입력하세요">  
            <div class="field-error" th:if="${errors?.containsKey('price')}" th:text="${errors['price']}">  
                가격 오류  
            </div>  
        </div>  
  
        <div>  
            <label for="quantity" th:text="#{label.item.quantity}">수량</label>  
            <input type="text" id="quantity" th:field="*{quantity}"  
                   th:class="${errors?.containsKey('quantity')} ? 'form-control field-error' : 'form-control'"  
                   class="form-control" placeholder="수량을 입력하세요">  
            <div class="field-error" th:if="${errors?.containsKey('quantity')}" th:text="${errors['quantity']}">  
                수량 오류  
            </div>  
  
        </div>  
  
        <hr class="my-4">  
  
        <div class="row">  
            <div class="col">  
                <button class="w-100 btn btn-primary btn-lg" type="submit" th:text="#{button.save}">상품 등록</button>  
            </div>  
            <div class="col">  
                <button class="w-100 btn btn-secondary btn-lg"  
                        onclick="location.href='items.html'"  
                        th:onclick="|location.href='@{/validation/v1/items}'|"  
                        type="button" th:text="#{button.cancel}">취소</button>  
            </div>  
        </div>  
  
    </form>  
  
</div> <!-- /container -->  
</body>  
</html>
```
`resources/templates/validation/v1/addForm.html`
:::note 
**Safe Navigation Operator**
위의 예시를 보게 된다면, 첫 실행 시에는 errors가 null 값을 가지고 있다.
당연하게도 처음 데이터는 없기 때문이다. 그리고 해당하는 값이 `null`이면, `NullPointException`이 발생한다.
`errors?.`은 `error` 가 `null`일 때 `NullPointerException`이 발생하는 대신, `null`을 반환하는 문법이다.

:::

:::failure 남은 문제점
1. 뷰 템플릿에서 중복 처리가 많다.
2. 타입 오류 처리가 안됨 -> 404에러로 표기 된다.
3. `Item`의 `price`에 문자를 입력하는 것 처럼 타입 오류가 발생해도 고객이 입력한 문자를 화면에 남겨야한다.
4. 고객이 입력한 값도 어딘가에 별도로 관리가 되어야한다.


:::

# Project Setting V2
![Pasted-image-20230110174615.png](/img/이미지 창고/Pasted-image-20230110174615.png)
![Pasted-image-20230110174625.png](/img/이미지 창고/Pasted-image-20230110174625.png)
## bindingResult

### V1
```java
public String addItemV1(@ModelAttribute Item item, BindingResult bindingResult, RedirectAttributes redirectAttributes, Model model) {  
  
    //검증 로직  
    if (!StringUtils.hasText(item.getItemName())) {  
        bindingResult.addError(new FieldError("item", "itemName", "상품 이름은 필수 입니다."));  
    }    if (item.getPrice() == null || item.getPrice() < 1000 || item.getPrice() > 1000000) {  
        bindingResult.addError(new FieldError("item", "price", "가격은 1,000 ~ 1,000,000 까지 허용합니다."));  
    }    if (item.getQuantity() == null || item.getQuantity() >= 9999) {  
        bindingResult.addError(new FieldError("item", "quantity", "수량은 최대 9,999 까지 허용합니다."));  
    }  
    //특정 필드가 아닌 복합 룰 검증  
    if (item.getPrice() != null && item.getQuantity() != null) {  
        int resultPrice = item.getPrice() * item.getQuantity();  
        if (resultPrice < 10000) {  
            bindingResult.addError(new ObjectError("item", "가격 * 수량의 합은 10,000원 이상이어야 합니다. 현재 값 = " + resultPrice));  
        }    }  
    //검증에 실패하면 다시 입력 폼으로  
    if (bindingResult.hasErrors()) {  
        log.info("errors={} ", bindingResult);  
        return "validation/v2/addForm";  
    }  
    //성공 로직  
    Item savedItem = itemRepository.save(item);  
    redirectAttributes.addAttribute("itemId", savedItem.getId());  
    redirectAttributes.addAttribute("status", true);  
    return "redirect:/validation/v2/items/{itemId}";  
}
```
`java/hello/itemservice/web/validation/ValidationItemControllerV2.java`

```html
<div class="container">  
  
    <div class="py-5 text-center">  
        <h2 th:text="#{page.addItem}">상품 등록</h2>  
    </div>  
  
    <form action="item.html" th:action th:object="${item}" method="post">  
  
        <div th:if="${#fields.hasGlobalErrors()}">  
            <p class="field-error" th:each="err : ${#fields.globalErrors()}" th:text="${err}">글로벌 오류 메시지</p>  
        </div>  
  
        <div>  
            <label for="itemName" th:text="#{label.item.itemName}">상품명</label>  
            <input type="text" id="itemName" th:field="*{itemName}"  
                   th:errorclass="field-error" class="form-control" placeholder="이름을 입력하세요">  
            <div class="field-error" th:errors="*{itemName}">  
                상품명 오류  
            </div>  
        </div>  
        <div>  
            <label for="price" th:text="#{label.item.price}">가격</label>  
            <input type="text" id="price" th:field="*{price}"  
                   th:errorclass="field-error" class="form-control" placeholder="가격을 입력하세요">  
            <div class="field-error" th:errors="*{price}">  
                가격 오류  
            </div>  
        </div>  
  
        <div>  
            <label for="quantity" th:text="#{label.item.quantity}">수량</label>  
            <input type="text" id="quantity" th:field="*{quantity}"  
                   th:errorclass="field-error" class="form-control" placeholder="수량을 입력하세요">  
            <div class="field-error" th:errors="*{quantity}">  
                수량 오류  
            </div>  
  
        </div>  
  
        <hr class="my-4">  
  
        <div class="row">  
            <div class="col">  
                <button class="w-100 btn btn-primary btn-lg" type="submit" th:text="#{button.save}">상품 등록</button>  
            </div>  
            <div class="col">  
                <button class="w-100 btn btn-secondary btn-lg"  
                        onclick="location.href='items.html'"  
                        th:onclick="|location.href='@{/validation/v2/items}'|"  
                        type="button" th:text="#{button.cancel}">취소</button>  
            </div>  
        </div>  
  
    </form>  
  
</div> <!-- /container -->
```
`resources/templates/validation/v2/addForm.html`
- `<div class="field-error" th:errors="*{price}">`
	- 해당 부분에서 `th:errors=*{price}*`가 해당 기능에 오류가 있을 때 `errors`를 통해서 기능을 출력한다.

## BindingResult2
- Spring 에서 제공하는 검증 오류를 보관하는 객체이다.
- `BindingResult`가 있으면 `@ModelAttribute`에 데이터 바인딩 시 오류가 발생해도 컨트롤러가 호출 된다.
:::tip `@ModelAttribute`에 바인딩 시 타입 오류가 발생하면?
`BindingResult`가 없으면 -> 400 오류가 발생하면서 컨트롤러가 호출되지 않고, 오류 페이지로 이동한다.
`BindingResult`가 있으면 -> 오류 정보(`FieldError`)를 `BindingResult`에 담아서 컨트롤러를 정상 호출 한다.

:::

### BindingResult에 검증 오류를 적용하는 3가지 방법
1. `@ModelAttribute`의 객체에 타입 오류 등으로 바인딩이 실패하는 경우 Spring이 `FieldError`생성해서 `BindingResult`에 넣어준다.
2. 개발자가 직접 넣는다.
3. `Validator` 사용

### 타입 오류 확인
- 숫자가 입력되어야 할 곳에 문자를 입력해서 타입을 다르게 해서 `BindingResult`를 호출하고 `bindingResult`의 값을 확인하기

:::warning 주의
`BindingResult`는 검증할 대상 바로 다음에 와야한다. 순서가 중요하다.
예를 들어,
`@ModelAttribute Item item`, 바로 다음에 `BindingResult`가 와야한다.
`BindingResult`는 Model에 자동으로 포함된다.

:::

- [BindingResult 와 Errors](../../../../../../../1. App/Java/Java Spring/MVC2/Validation/BindingResult-와-Errors.md)

### FieldError, ObjectError

:::example 목표
사용자 입력 오류 메시지가 화면에 남도록하기
`FieldError`, `ObjectError`에 대해서 더 자세히 알아보기

:::

[FieldError 생성자](../../../../../../../1. App/Java/Java Spring/MVC2/Validation/FieldError-생성자.md)

```java
@PostMapping("/add")  
    public String addItemV2(@ModelAttribute Item item, BindingResult bindingResult, RedirectAttributes redirectAttributes, Model model) {  
  
        //검증 로직  
        if (!StringUtils.hasText(item.getItemName())) {  
            bindingResult.addError(new FieldError("item", "itemName", item.getItemName(), false, null, null, "상품 이름은 필수 입니다."));  
        }        if (item.getPrice() == null || item.getPrice() < 1000 || item.getPrice() > 1000000) {  
            bindingResult.addError(new FieldError("item", "price", item.getPrice(), false, null, null, "가격은 1,000 ~ 1,000,000 까지 허용합니다."));  
        }        if (item.getQuantity() == null || item.getQuantity() >= 9999) {  
            bindingResult.addError(new FieldError("item", "quantity", item.getQuantity(), false, null ,null, "수량은 최대 9,999 까지 허용합니다."));  
        }  
        //특정 필드가 아닌 복합 룰 검증  
        if (item.getPrice() != null && item.getQuantity() != null) {  
            int resultPrice = item.getPrice() * item.getQuantity();  
            if (resultPrice < 10000) {  
                bindingResult.addError(new ObjectError("item",null ,null, "가격 * 수량의 합은 10,000원 이상이어야 합니다. 현재 값 = " + resultPrice));  
            }        }  
        //검증에 실패하면 다시 입력 폼으로  
        if (bindingResult.hasErrors()) {  
            log.info("errors={} ", bindingResult);  
            return "validation/v2/addForm";  
        }  
        //성공 로직  
        Item savedItem = itemRepository.save(item);  
        redirectAttributes.addAttribute("itemId", savedItem.getId());  
        redirectAttributes.addAttribute("status", true);  
        return "redirect:/validation/v2/items/{itemId}";  
    }
```

