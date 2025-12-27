대부분은 html, css, js에 대해서 기초적인 지식은 보통은 습득하고 온다.
예전만 해도 HTML CSS JS 라는 기술에 절대적 의존 중이었다 보니 해당 기술에 파생적인 기술로 많이 나왓다.
예를 들면, JQuery, ejs, jsp 등등 프론트를 개발할 때 생각해보면 html 태그를 이용해서 작성을 많이 했다.

그 중에서도 <mark>내가 개발하는 화면</mark>과 <mark>실제 보여지는 화면</mark>의 코드가 대개 일치하는 것을 알 수 있다.

하지만 요즘 유행하는 기술은 대부분은 그렇지 못하다.
이유인 즉슨, 사실상 <mark>javascript로 해당 html 을 그리</mark>고 있기 때문이다.

그렇기에 내가 보는 코드와 실제 브라우저에서 그리는 화면은 다르게 생겼습니다.
프론트 엔드와 퍼블리싱에서 인지 오류가 나고, 맞지 않는 구석 들은 대부분은 해당 문제를 살펴 보지 않기 때문에 생기는 오류 입니다.

중요한 지식은 맞긴 하지만, 이걸 모른다고 프론트를 못해요! 이건 아닙니다~
하지만, 알면 고급 개발자가 되는거고 하면 아니면 못하는 정도..?

# DOM
:::NOTE DOM이란?
- 문서 객체 모델은 HTML, XML 문서의 프로그램 interface 입니다.
- DOM은 문서의 구조화된 표현을 제공하며 프로그래밍 언어가 DOM 구조에 접근 할 수 있는 방법을 제공하여, 그들이 문서 구조, 스타일 내용등을 변경할 수 있게 돕는다.

:::

표준은 대부분의 브라우저에서 DOM 을 구현하는 기준이다. 
많은 브라우저들이 표준 규약에서 제공하는 기능 외에도 추가적인 기능들을 제공하기 때문에 사용자가 작성한 문서들이 각기 다른 DOM 이 적용된 다양한 브라우저 환경에서 동작할 수 있다는 사실을 항상 인지하고 있어야 한다.

예를 들면, 표준 DOM에서는 문서 안에 모든 `<P>` elements에 대한 list를 리턴하는 `getElementByTagName` method를 정의하고 있습니다.

```js
var paragraphs = document.getElementsByTagName("P");
// paragraphs[0] is the first <p> element
// paragraphs[1] is the second <p> element, etc.
alert(paragraphs[0].nodeName);

```
웹 페이지를 수정하거나 생성하는데 사용되는 모든 property, method, event 들은 objects 로 구성된다. 
- 예를 들어 document object 는 document 자체를 의미하며, table object 는 HTML table 에 접근하기 위한 `HTMLTableElement` DOM 인터페이스를 구현한 것이다. 
- 이 문서는 Gecko 기반의 브라우저에서 구현된 DOM 에 대한 object-by-object reference 를 제공한다.

---

#HTML  #Util

---