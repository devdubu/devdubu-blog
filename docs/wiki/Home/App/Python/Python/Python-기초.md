---
sticker: vault//이미지/개발 로고/TechIconSVG/Python.svg

slug: "Python-기초"
---
# 파이썬의 특징

 >[!tip] 세미코론(`;`)으로 끝을 맺지 않아도 된다.
 
```python
# 아래 둘다 모두 상관 없다.
print('Hello World!')
print('Hello World!');
```

:::tip Python은 기본적으로 들여쓰기를 기준으로 영역을 나눕니다.

:::

```python
1+1
# 아래 처럼의 들여쓰기는 주의가 필요함
	1+1
```
![스크린샷-2025-07-17-오전-8.52.20.png](/img/이미지 창고/스크린샷-2025-07-17-오전-8.52.20.png)

:::note 한줄 주석은 `#` 또는 `'''`, `"""` 로 생성할 수 있습니다.

:::

```python
# 한줄짜리 주석입니다.

'''
이렇게
여러줄을
주석처리 할 수 있습니다.
'''

"""
쌍 따옴표로도
할 수 있습니다.
"""
```

# 변수

```python
# 변수 생성 방법 1
a = 100
b = 10000

# 변수값 확인하기
print(a)
print(b)


# 변수 생성 방법 2
a, b = 100, 10000
```

:::warning 변수 생성시 주의점
- 영문자, 숫자, `_` 의 조합으로 구성되어야함
- 변수의 첫 글자에서 숫자는 사용 불가
- 대소문자 구분되어있음
- 변수명 사이 띄어쓰기 불가

:::

## 자료형

```python
a = 1
b = 0.1
c = 'hello'

print(type(a))
print(type(b))
print(type(c))

# <class 'int'>
# <class 'float'>
# <class 'str'>
```


### 숫자형
#### 정수
```python
a = 1
print(type(a))

# <class 'int'>
```

#### 실수
```python
a = 1.1
print(type(a))

# <class 'float'>
```












