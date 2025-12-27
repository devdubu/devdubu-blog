---
sticker: vault//이미지/개발 로고/TechIconSVG/Nuxt-JS.svg

slug: "Nuxt-Plugins-Hook-조건"
---
# 문제
## Nuxt Plugins 내부 함수 중, 비동기 함수를 두번 사용하면, 에러를 뱉음

```ts
export const initData = async () => {
	console.log('initDataMin')
	
	const { status, data } = await mapPost(COMMON_API_URL.user.data)
	// const { data } = await mapPost(COMMON_API_URL.user.code)
	
	if (status && data) {
		const { user, menu, prgm, lang, env, favoriteMenu } = data
		
		setInitData(user, menu, prgm, lang, env, favoriteMenu)
	} else {
		setInitData()
	}
}
```
위 코드를 보게 된다면, 그닥 문제는 없어보이는데, Nuxt에서는 해당 문제를 문제라고 받아들이는 것 같다.

결정적으로는 비동기 함수가 두개라서 그런다는데,,,정확한 원인은 찾아봐야 알거 같다.



