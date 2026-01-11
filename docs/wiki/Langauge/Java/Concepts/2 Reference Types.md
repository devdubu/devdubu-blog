---
slug: "2-Reference-Types"
title: "참조 타입 (Reference Types)"
---

# 참조 타입 (Reference Types)

:::info 개요
Java의 데이터 타입은 **기본 타입(Primitive)**과 **참조 타입(Reference)**으로 나뉩니다.
이 문서에서는 참조 타입의 메모리 구조, String, Array에 대해 상세히 다룹니다.
:::

## 1. 메모리 구조
JVM은 운영체제에서 할당받은 메모리(Runtime Data Area)를 다음과 같이 구분하여 사용합니다.

- **Method Area**: 클래스 정보, 정적(static) 변수 저장.
- **Heap Area**: 객체와 배열 생성. (GC의 대상)
- **JVM Stack**: 스레드마다 존재하며, 메서드 호출 시 프레임 생성 (지역 변수 저장).

### 기본 vs 참조 변수 구조
- **기본 타입**: 스택 영역에 직접 값을 저장.
- **참조 타입**: 스택 영역에 **힙 영역의 주소 값**을 저장. 객체는 힙에 존재.

---

## 2. String 타입

Java의 `String`은 클래스(참조 타입)입니다.

### 2.1 리터럴 vs new
- **리터럴** (`"Hello"`): String Constant Pool에 저장되어, 같은 문자열은 같은 객체를 공유함.
- **new** (`new String(...)`): 힙 영역에 매번 새로운 객체 생성.

```java
String str1 = "Java";
String str2 = "Java";
String str3 = new String("Java");

System.out.println(str1 == str2); // true (주소 같음)
System.out.println(str1 == str3); // false (주소 다름)
System.out.println(str1.equals(str3)); // true (내용 같음)
```

:::warning 비교 주의
문자열 내용 비교는 반드시 `equals()`를 사용해야 합니다. `==`는 주소값을 비교합니다.
:::

---

## 3. 배열 (Array)

같은 타입의 데이터를 연속된 공간에 저장하는 객체입니다.

### 3.1 선언 및 생성
```java
int[] arr1 = { 1, 2, 3 }; // 값 목록으로 생성 (선언 시에만 가능)
int[] arr2 = new int[5]; // 길이로 생성 (초기값 0)
```

### 3.2 참조 객체 배열
객체 배열은 각 항목에 객체 자체가 아닌, 객체의 주소를 저장합니다.
```java
String[] strArr = new String[3];
strArr[0] = "Java";
strArr[1] = "Spring";
```

### 3.3 다차원 배열
```java
int[][] matrix = new int[2][3];
```
