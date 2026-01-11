---
slug: "1-Intro-and-Architecture"
title: "Node.js 개요와 아키텍처 (Intro & Architecture)"
---

# Node.js 개요와 아키텍처

:::info 개요
**Node.js**의 탄생 철학, **비동기 I/O** 모델, 그리고 이를 가능하게 하는 **리액터 패턴(Reactor Pattern)**과 내부 아키텍처를 깊이 있게 다룹니다.
:::

## 1. Node.js의 철학

### 1.1 경량 코어와 생태계
Node.js 코어는 최소한의 기능 세트만 유지하고, 나머지 유저랜드(Userland) 생태계에 맡기는 방식을 취합니다. 이는 커널은 작게 유지하고 나머지 기능은 모듈로 확장하는 Unix 철학(Small Core)과 맞닿아 있습니다.

### 1.2 작은 모듈 (Small Modules)
"한 가지 일만 잘하는 작은 모듈을 만들어라."
- **재사용성**: 작고 명확한 모듈은 다양한 곳에서 재사용하기 좋습니다.
- **이해 용이성**: 모듈의 스코프가 작아 전체를 이해하고 테스트하기 쉽습니다.
- **버전 관리**: npm을 통해 의존성 지옥(Dependency Hell)을 피하고 각 패키지의 독립적인 버전을 사용합니다.

### 1.3 실용주의 (KISS)
디자인은 단순해야 합니다. 완벽한 설계보다 단순한 구현이 더 나을 때가 많습니다. JavaScript 자체의 유연함이 이를 뒷받침합니다.

---

## 2. 아키텍처와 작동 원리

### 2.1 I/O 문제와 해결
전통적인 **블로킹(Blocking) I/O**는 요청 당 하나의 스레드를 할당해야 하므로, 메모리 소모가 크고 컨텍스트 스위칭 비용이 발생합니다.
Node.js는 **논블로킹(Non-blocking) I/O**와 **이벤트 루프**를 통해 단일 스레드로 수천 개의 동시 연결을 처리합니다.

### 2.2 리액터 패턴 (Reactor Pattern)
Node.js 비동기 처리의 핵심 모델입니다.

1. **요청**: I/O 작업(파일 읽기, DB 조회)을 요청하면서 **콜백(Handler)**을 함께 전달합니다.
2. **이벤트 디멀티플렉서**: OS 커널(epoll, kqueue 등)을 통해 작업을 감시하다가, 완료되면 이벤트를 발생시킵니다.
3. **이벤트 루프**: 발생한 이벤트를 큐에서 꺼내어 등록된 **콜백을 실행**합니다.

![Reactor Pattern](/img/Pasted%20image%2020250409195637.png)

### 2.3 구성 요소
- **V8 엔진**: Google이 만든 고성능 JS 실행 엔진.
- **libuv**: 비동기 I/O를 추상화한 C 라이브러리. (이벤트 루프 구현)
- **Node.js Bindings**: C++로 작성된 코어 기능을 JS에서 사용할 수 있게 연결.

---

## 3. 설치와 설정

### 3.1 NVM (Node Version Manager) 권장
Node.js 버전을 프로젝트별로 다르게 관리하기 위해 `nvm` 사용을 강력히 권장합니다.

```bash
# 설치
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 사용
nvm install --lts
nvm use --lts
```

### 3.2 프로젝트 초기화
```bash
npm init -y
```
`package.json`이 생성되며 프로젝트의 의존성을 관리할 준비가 완료됩니다.
