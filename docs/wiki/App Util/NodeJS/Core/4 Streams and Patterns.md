---
slug: "4-Streams-and-Patterns"
title: "스트림과 디자인 패턴 (Streams & Patterns)"
---

# 스트림 (Stream)

:::info 개요
"모든 것을 스트리밍하라(Stream Everything)."
Node.js의 스트림은 대용량 데이터를 효율적으로 처리하고, 시스템의 메모리 효율성을 극대화하는 핵심 패턴입니다.
:::

## 1. 버퍼링 vs 스트리밍

### 1.1 버퍼링 (Buffering)
전통적인 방식은 모든 데이터가 도착할 때까지 기다렸다가(버퍼에 저장), 한 번에 처리합니다.
- **단점**: 대용량 파일(예: 1GB)을 처리할 때 메모리 한계(V8 힙 메모리 제한 등)에 부딪힐 수 있습니다. 반응 속도가 느립니다.

![Buffering](/img/Pasted%20image%2020250403133008.png)

### 1.2 스트리밍 (Streaming)
데이터가 도착하는 "즉시" 청크(Chunk) 단위로 처리합니다.
- **장점**: 
    - **공간 효율성**: 1GB 파일을 처리해도 메모리는 수 MB만 사용합니다.
    - **시간 효율성**: 아직 전체 파일이 다운로드되지 않았어도 처리를 시작할 수 있습니다 (예: 비디오 재생).

![Streaming](/img/Pasted%20image%2020250403133327.png)

---

## 2. 스트림의 종류

Node.js `stream` 모듈은 네 가지 기본 추상 타입을 제공합니다.

1. **Readable**: 읽기 가능 스트림 (예: `fs.createReadStream`, `process.stdin`)
2. **Writable**: 쓰기 가능 스트림 (예: `fs.createWriteStream`, `process.stdout`)
3. **Duplex**: 읽기/쓰기 모두 가능 (예: TCP 소켓)
4. **Transform**: 입력 받아 변환 후 출력 (예: `zlib.createGzip`, 암호화)

### 파이핑 (Piping)
UNIX의 파이프(`|`)처럼, 스트림끼리 연결하여 데이터를 물 흐르듯 전달할 수 있습니다.

```js
fs.createReadStream('input.txt')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('input.txt.gz'));
```

:::tip 백프레셔 (Backpressure)
데이터를 쓰는 속도보다 읽는 속도가 빠를 때, 메모리 낭비를 막기 위해 자동으로 읽기 속도를 조절하는 메커니즘이 내장되어 있습니다. `pipe()`를 사용하면 이를 자동으로 처리해줍니다.
:::

---

# 디자인 패턴 (Design Patterns)

Node.js와 JS 생태계에서 자주 사용되는 생성(Creational) 패턴들입니다.

## 1. 팩토리 (Factory)
객체 생성을 유연하게 하고, 생성 로직을 캡슐화합니다.

```js
function createImage(name) {
  if (name.match(/\.jpe?g$/)) {
    return new JpegImage(name);
  } else if (name.match(/\.png$/)) {
    return new PngImage(name);
  } else {
    throw new Error('Unsupported format');
  }
}
```

## 2. 공개 생성자 (Revealing Constructor)
`Promise`가 대표적인 예입니다. 생성자 내부에서 실행자(Executor) 함수를 통해 내부 상태를 조작할 수 있는 권한을 제공합니다.

```js
class ReadOnlyEmitter extends EventEmitter {
  constructor(executor) {
    super();
    const emit = this.emit.bind(this);
    this.emit = undefined; // 외부에서는 emit 불가
    executor(emit); // executor에게만 emit 권한 부여
  }
}
```

## 3. 빌더 (Builder)
복잡한 객체 생성 과정을 단계별로 나눕니다.

## 4. 싱글톤 (Singleton)
Node.js의 `CommonJS` 모듈 캐싱 덕분에, `module.exports = new MyClass()` 형태로 내보내면 자연스럽게 싱글톤이 됩니다.
