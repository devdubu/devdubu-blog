---
slug: "XSS-탈취"
---
![Screenshot-2024-11-07-at-1.06.06-PM.png](/img/이미지 창고/Screenshot-2024-11-07-at-1.06.06-PM.png)
위와 같은 식으로 cookie에 중요한 정보를 넣어 놓게 된다면, 해커는 이를 `document.cookie` 를 통해서 탈취하게 된다.
해당 탈취 기법을 방어하는 수단은 
![Screenshot-2024-11-07-at-1.07.05-PM.png](/img/이미지 창고/Screenshot-2024-11-07-at-1.07.05-PM.png)
위의 사진 처럼 HttpOnly 옵션을 키게 된다면, cookie의 XSS 해킹을 방어 할수 있습니다.


---

#Security

---
