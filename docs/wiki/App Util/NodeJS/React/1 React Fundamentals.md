---
slug: "1-React-Fundamentals"
title: "React 기초 (Fundamentals)"
---

# React 기초

:::info 개요
React의 핵심 개념인 **가상 DOM**, **컴포넌트**, **Props**와 **State**에 대해 다룹니다.
:::

## 1. React란?
Facebook(Meta)이 만든 UI 라이브러리로, **선언형(Declarative)**이고 **컴포넌트 기반(Component-Based)**입니다.

### 1.1 Virtual DOM
실제 DOM을 조작하는 것은 느립니다. React는 메모리에 가상 DOM을 두고, 변경 전후를 비교(Diffing)하여 바뀐 부분만 실제 DOM에 반영(Reconciliation)하여 성능을 최적화합니다.

---

## 2. 컴포넌트 (Component)

### 2.1 클래스형 vs 함수형
React 초기에는 클래스형 컴포넌트만 State와 Lifecycle을 가질 수 있었으나, **Hooks(v16.8)**의 등장으로 함수형 컴포넌트가 표준이 되었습니다.

**함수형 컴포넌트 (권장)**:
```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

**클래스형 컴포넌트 (레거시)**:
```jsx
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

---

## 3. Props와 State

### 3.1 Props (Properties)
- 부모 컴포넌트가 자식에게 전달하는 데이터입니다.
- **읽기 전용(Read-only)**이며, 자식은 수정할 수 없습니다.

### 3.2 State
- 컴포넌트 내부에서 관리되는 **변경 가능한 데이터**입니다.
- State가 변경되면 컴포넌트는 리렌더링됩니다.

```jsx
const [count, setCount] = useState(0); // Hook 사용
```

---

## 4. 이벤트 핸들링

카멜 케이스(camelCase)를 사용하며, 함수 자체를 전달합니다.

```jsx
<button onClick={handleClick}>Click me</button>
```
