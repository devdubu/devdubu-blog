---
시작 날짜: 2025-04-10
종료 날짜: 2025-04-10
sticker: vault//이미지/개발 로고/TechIconSVG/Vite.js.svg

slug: "VitePress-개요"
---
마크다운 출력물에 대해서 한참을 찾던 도중 아래의 사이트를 찾게 되었다.

[Nuxt vs VitePress vs Astro](https://www.vuemastery.com/blog/nuxt-vs-vitepress-vs-astro/)

생각해보면 이런 오픈 소스들은 다 MD 파일로 이루어져 있는데 라우팅이며, 아니면 다른것이며 어캐한거지 맨날 의문을 가지던 도중에 불현듯, Vitepress라는 사이트를 우연히 찾았고, 다들 이런 식으로 문서 정리를 하는 것 같았다.

[VitePress](https://vitepress.dev/)

하지만, 아쉽게도 우리 환경은 Nuxt이며, 위 사이트의 환경은 Vue인 것을 감안하면, 잘 맞지 않았다.
대신 Nuxt 환경은 Nuxt Content 라는 환경으로 대체하는 분위기 이다.

조금 더 알아봐야겠지만, VitePress를 공부하면서 Nuxt Content에 대한 생소한 문법도 좀 익힐 수 있을 것 같다

이윤 즉,,, [해당 사이트](https://stackblitz.com/edit/vite-1sjg7j?file=docs%2Findex.md)를 보면 의문이 풀린다.
```markdown
---

layout: home
hero:
	name: VitePress
	text: Vite & Vue powered static site generator.
	tagline: Simple, powerful, and performant. Meet the modern SSG framework you've always wanted.

actions:
- theme: brand
	text: Get Started
	link: /example
- theme: alt
	text: View on GitHub
	link: https://github.com/vuejs/vitepress
---
```
`docs/index.md`
위 파일은 아무리 봐도 md 문법이 아닌데도 불구하고 아래 처럼 출력이 된다.
![Screenshot-2024-07-03-at-11.09.59-PM.png](/img/이미지 창고/Screenshot-2024-07-03-at-11.09.59-PM.png)
```markdown
# VitePress 💙 StackBlitz

Hi there :wave: This is a demo running VitePress within your **browser tab**!

## Powered by Vite

VitePress uses Vite under the hood. This means:

- Instant server start
- Lightning fast HMR
- Optimized builds

## Markdown-Centered

So you can focus more on writing. Powered by MarkdownIt. Comes with many [built-in extensions](https://vitepress.dev/guide/markdown), and you can use Vue features in Markdown too!
```
`docs/example.md`

![Screenshot-2024-07-03-at-11.10.59-PM.png](/img/이미지 창고/Screenshot-2024-07-03-at-11.10.59-PM.png)
암만 봐도 일반적인 Markdown 문법은 아니기에, 해당 Vitepress에 관심이 가진 김에, 해당 문법도 좀 공부해볼 예정이다.
이를 공부하면 조금 내 넘쳐나는 MD파일의 정리가 좀 편해지지 않을까 기대를 해본다.
블로그야,,URL만 좀 옮기면 될거 같은데 ㅎㅎㅎ

---

#NodeJS 

---