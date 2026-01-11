---
slug: "3-Lifecycle-and-Patterns"
title: "생명주기와 고급 패턴 (Lifecycle & Patterns)"
---

# 생명주기와 고급 패턴

:::info 개요
Class 컴포넌트의 생명주기 메서드와 대응하는 Hooks, 그리고 **Error Boundary**, **HOC**, **Controlled Component** 패턴을 상세히 다룹니다.
:::

## 1. 생명주기 (Lifecycle)

### 1.1 Class vs Hooks 비교

| 단계 | Class 메서드 | Hooks (useEffect) |
| --- | --- | --- |
| **Mount** | `componentDidMount` | `useEffect(..., [])` |
| **Update** | `componentDidUpdate` | `useEffect(..., [deps])` |
| **Unmount** | `componentWillUnmount` | `useEffect`의 cleanup 함수 |

### 1.2 Deprecated 메서드 (v16.3+)
`componentWillMount`, `componentWillReceiveProps`, `componentWillUpdate`는 안전하지 않아 `UNSAFE_` 접두사가 붙거나 사용이 지양됩니다.
대신 `getDerivedStateFromProps`, `getSnapshotBeforeUpdate`를 사용합니다.

---

## 2. 에러 경계 (Error Components)

React 컴포넌트 트리 하위에서 발생하는 에러를 포착하여 애플리케이션 충돌을 방지합니다. **Class 컴포넌트**로만 구현 가능합니다.

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    logErrorToService(error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

---

## 3. 고차 컴포넌트 (HOC)

컴포넌트를 인자로 받아 새로운 컴포넌트를 반환하는 함수입니다.

### 3.1 `withRouter` 예제
라우팅 관련 Props(`history`, `match` 등)를 주입합니다.

```jsx
import { withRouter } from 'react-router-dom';

const LoginButton = ({ history }) => (
  <button onClick={() => history.push('/')}>Login</button>
);

export default withRouter(LoginButton);
```

### 3.2 주의사항
- **render() 내부 사용 금지**: 매 렌더링마다 새로운 컴포넌트가 생성되어 상태가 초기화됩니다.
- **Static 메서드 복사 필요**: `hoist-non-react-statics` 라이브러리 사용 권장.

---

## 4. 제어 컴포넌트 (Controlled Components)

Form 입력값(state)을 React가 완전히 제어하는 패턴입니다.

```jsx
const [value, setValue] = useState("");
<input value={value} onChange={e => setValue(e.target.value)} />
```

- **장점**: 입력값의 즉각적인 유효성 검사 및 조작 가능.
- **단점**: 코드가 다소 길어질 수 있음.
