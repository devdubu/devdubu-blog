---
slug: "Vitest-Router-Test"
---
# Vue Router Test
Vue Router를 사용하여 애플리케이션을 테스트하는 두 가지 방법을 제시 합니다.
1. 실제 Vue Router를 사용하면, 프로덕션과 유사하지만, 대규모 애플리케이션을 테스트 할 때 복잡성이 발생 할 수 있음
2. 모의 라우터를 사용하면 테스트 환경을 더욱 세밀하게 제어할 수 있다.
Vue Test Utils는 Vue Router에 의존하는 구성 요소 테스트를 지원하는 특별한 기능을 제공하지 않습니다.

## 모의 라우터 사용
단위 테스트에서 Vue Router의 구현 세부 사항에 신경 쓰지 않으려면 모의 라우터를 사용 할 수 있습니다.
실제 Vue Router 인스턴스를 사용하는 대신 관심 있는 기능만 구현하는 모의 버전을 만들 수 있습니다.

### 예시
```js
const Component = {
  template: `<button @click="redirect">Click to Edit</button>`,
  props: ['isAuthenticated'],
  methods: {
    redirect() {
      if (this.isAuthenticated) {
        this.$router.push(`/posts/${this.$route.params.id}/edit`)
      } else {
        this.$router.push('/404')
      }
    }
  }
}
```
 
실제 라우터를 사용한 다음 이 구성 요소에 대한 올바른 경로로 이동한 다음 버튼을 클릭한 후 올바른 페이지가 렌더링 되었다고 주장할 수 잇습니다.
그러나 이는 상대적으로 간단한 테스트를 위한 많은 설정입니다.
핵심적으로 우리가 작성하려는 테스트는 
- 인증된 경우로의 분기 처리
입니다.
```js
import { mount } from '@vue/test-utils';

test('allows authenticated user to edit a post', async () => {
  const mockRoute = {
    params: {
      id: 1
    }
  }
  const mockRouter = {
    push: jest.fn()
  }

  const wrapper = mount(Component, {
    props: {
      isAuthenticated: true
    },
    global: {
      mocks: {
        $route: mockRoute,
        $router: mockRouter
      }
    }
  })

  await wrapper.find('button').trigger('click')

  expect(mockRouter.push).toHaveBeenCalledTimes(1)
  expect(mockRouter.push).toHaveBeenCalledWith('/posts/1/edit')
})

test('redirect an unauthenticated user to 404', async () => {
  const mockRoute = {
    params: {
      id: 1
    }
  }
  const mockRouter = {
    push: jest.fn()
  }

  const wrapper = mount(Component, {
    props: {
      isAuthenticated: false
    },
    global: {
      mocks: {
        $route: mockRoute,
        $router: mockRouter
      }
    }
  })

  await wrapper.find('button').trigger('click')

  expect(mockRouter.push).toHaveBeenCalledTimes(1)
  expect(mockRouter.push).toHaveBeenCalledWith('/404')
})
```
`global.mocks`

각 테스트에 이상적인 상태를 설정하는데 `global.mocks`에 필요한 종속성을 제공했습니다.
:::tip 
- 엔드투엔드 방식으로전체 시스템을 테스트 할 수 있습니다.
- 실제 브라우저를 사용한 전체 시스템 테스트를 위해 [Cypress](https://www.cypress.io/) 와 같은 프레임워크를 고려할 수 있습니다.


:::

---

#NodeJS #Test #Vitest #JavaScript 

---