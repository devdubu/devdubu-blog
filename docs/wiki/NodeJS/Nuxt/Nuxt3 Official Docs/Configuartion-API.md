---
slug: "Configuartion-API"
---
# Alias
- 해당 API는 디렉토리의 앞 부분을 생략하게 도와준다.
- 즉, CSS, JS파일 등이 있는 디렉토리를 미리 선언하여 변수 처럼 사용하게 해준다.
```json
{
  "~": "/<srcDir>",
  "@": "/<srcDir>",
  "~~": "/<rootDir>",
  "@@": "/<rootDir>",
  "assets": "/<srcDir>/assets",
  "public": "/<srcDir>/public"
}
```

>[!note | blue]
>- WebPack의 context(이미지 소스 혹은 CSS소스)는 `~` 를 앞에 붙여서 접근 가능하다.


---

#NodeJS #Nuxt #JavaScript #Nuxt3 #FrontEnd 

---

