# 생성자
:::tip 정해진 키벨류를 가진 객체를 편리하게 생성할 수 있게 도와주는 기계 같은 역할 입니다.
- 비슷한 객체들을 여러 개 생성하기 위해서 생성할 때마다 키 밸류 값을 일일이 입력해서 만드는 것이 아니라 
- 하나의 생성자를 만들어 놓으면 그 생성자를 이용하여 간편하게 해당 객체를 생성할 수 있다.

:::

```js

function Student(name, age, height) {
        this.name = name;
        this.age = age;
        this.height = height;
        this.sayHi = function () {
          console.log(
            `안녕하세요 저의 이름은 ${name}이고 나이는 ${age} 이며, 키는 ${height}입니다.`
          );
        };
      }

```

---

#NodeJS #JavaScript 

---
