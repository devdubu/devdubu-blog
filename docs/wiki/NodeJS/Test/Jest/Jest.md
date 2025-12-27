# Jest
:::question Jest?
- JavaScript에서 사용하는 대표적인 테스팅 툴

:::

이미 Jest가 깔린 상태에서는
```shell
npm test
```
를 하게 된다면 전역적으로 `__test__` 디렉토리를 찾은 후에 `~.test.js`를 모두 테스트 합니다.

만약 특정 Test 파일만 test하고 싶다면, 
```shell
npm test [test파일 경로]
```
를 한다면 특정 파일만 테스트를 진행합니다.

```js
import { mount } from '@vue/test-utils'
import PlatSearchContainer from '../PlatSearchContainer.vue'

describe('########### PlactSearchContainer UI 생성 테스트 ###########', () => {
  it('기본 container component가 정상적으로 dom에 생성된다.', () => {
    const wrapper = mount(PlatSearchContainer);
    console.log(wrapper)
    expect(wrapper.vm).toBeTruthy();
  });
});
```

- 위 스크립트는 아래의 스크립트의 test 코드 입니다.



---

#NodeJS 

---