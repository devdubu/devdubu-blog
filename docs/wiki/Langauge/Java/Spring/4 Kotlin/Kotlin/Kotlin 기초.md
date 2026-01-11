---
slug: "Kotlin-기초"
---
# Kotlin 기초

Created: 2022년 6월 28일 오후 8:14

![Kotlin.png](/img/Kotlin.png)
요즘 Spring에서 Java의 입지가 조금 위험하다는 느낌을 받았습니다.

[NAVER D2](https://d2.naver.com/helloworld/6685007)

요새 네이버에서 kotline을 통해서 spring boot를 전환하려고 하는 움직임이 커지고 있습니다.

최근에 java 진영에서 null 값을 잡는데 부진 하고 있다는 소식을 접하다보니, 많은 기업들이 현재 kotlin으로의 이주를 고민하고 있다라고 많이 거론되고 있습니다.

아무래도 java가 좋은 언어라고 해도 오래되었고, 해당 시간 동안 근본적으로 고쳐지지 않는 문제가 나올 것이기 때문에 새로 만들어진 java 기반의 kotlin으로 분위기가 넘어가고 있지 않나 생각이 듭니다.

이 글은 코틀린 공식 문서를 참고하여 정리한 글입니다.

# Kotlin Basic syntax

우선 코틀린도 java와 마찬가지로 패키지 구조로 파일을 불러온다. 그렇기 때문에 Java를 사용하신 분들은 쉽게 이해가 가실 부분이다.

## 파일 구조

```kotlin
package my.demo

import kotlin.text.*

// ...
```

여기서는 여차 다른 언어와 다를게 없다. import를 해서 패키지를 불러온다.

# Kotlin entry point

코틀린의 entry 포인트는 2가지로 표현이 된다.

```kotlin
fun main(){
	println("Hello world!")
}
```

```kotlin
fun main(args: Array<String>){
	println(args.contentToString())
}
```

- 영어 단어 정리
    - argument : 전달 인자, 인자
    - parameter : 매개 변수

다른 형식으로는 String 인수를 변수로 받는다.

# 입력

kotlin은 입력을 받을 때, `readline()`으로 받습니다.

이 readline은 데이터의 형식을 알아서 구분지어서 입력을 받습니다. 하지만, 단점은 모든 입력을 String으로 받습니다.

따라서 int, double을 따로 반환을 해줘야합니다.

```kotlin
fun main(){
	var name = readLine()
	println(name)
}

```

```kotlin
fun main(){
	var num:Int = readLine()!!.toInt()
	var dou:Double = readLin()!!.toDouble()
	
	println(num, dou)
}
```

만약에 여러개를 받아야한다면?

```kotlin
fun main(){
	var size:Int = readLine()!!.toInt()
	var arr = Array<Int>(size){ readLine()!!.toInt() }
	for(item in arr){
		println(item)
	}
}
```

—> Kotlin은 Java에서 사용되는 `BufferedReader`와 `Scanner`를 사용할 수 있습니다

# 출력

kotlin은 java와 다르게 `System.out.println` 처럼 아주아주 길게 해야지만 출력하는 것이 아닌, python과 비슷하게 `print` 로 출력이 가능합니다. 즉,

```kotlin
fun main(){
	print("Hello ");
	print("World!");
}
```

:::note
💡 Hello World!
:::

라는 결과가 나오게 됩니다.

그리고 혹시라도 다음 행에 출력을 원하시는 분들은 `println` 를 사용하시면 됩니다.

```kotlin
fun main(){
	println("Hello");
	println("World!");
}
```

:::note
💡 Hello
World!
:::

# 변수

Java에서는 처음 변수를 선언할 때, 필수적으로 이 변수가 int형인지, string형인지 선언을 먼저 해야합니다. 하지만, kotlin은 변수를 선언할 때는 `var` 라는 선언 형을 먼저 작성후 사용하면 된다.

그중에서 변수형은 `var`, 상수형은 `val`으로 작성한다.

그러나 굳이 자료형은 선언을 먼저 하고 싶다면, `var a:Int = 1` 이런식으로 변수명:자료형 으로 작성하면 된다.

### val

```kotlin
fun main(){
	val a:Int = 1
	val b = 2
	val c:Int
	c = 3
	
	println("a=$a, b = $b, c = $c");
}
```

val은 자료형을 선언하지 않는 이상 초기화 값을 무조건 입력해야한다.

### var

```kotlin
fun main(){
	var x = "String 타입"
	var y = 'c' //char
	var z = 1 //int
	var w = 1.5 //double

	println("x = $x, y = $y,z = $z, w = $w"); 
}
```

var도 마찬가지로 자료형을 선언하지 않는 이상 초기화를 무조건 해야한다.

kotlin의 자세한 자료형을 보고 싶으시면

[Kotlin 코틀린 자료형의 종류](https://enter.tistory.com/235)

해달 블로그를 참고해주시길 바랍니다.

# Function

왜인지는 모르겠지만, 공식문서에서는 Function을 먼저 소개를 해주지만, 저는 변수→함수 순이 맞다고 생각을 하여서 순서를 바꾸었습니다.

```kotlin
fun sum(a:Int, b:Int):Int{
	return a + b
}

fun main(){
	print("sum of 3 and 5 is")
	println(sum(3,5))
}
```

위 함수는 매개변수 중 a는 Int, b는 Int 자료형을 가지며, 함수의 리턴 값은 Int입니다.

만약 void 함수를 가진다고 한다면, 

```kotlin
fun printSum(a:Int, b:Int):Unit{
	println("sum of $a and $b is${a+b}");
}
fun main(){
	printSum(-1,8)
}
```

# Class & instances

클래스와 인스턴스를 만드는 방법은 Java와 유사하게 되어있습니다.

우선 예시로 들자면,

```kotlin
class Rectangle(var height: Double, var lenght: Double){
	var perimter = (height + length) * 2
}
```

메인 클래스에서 사용 방법은 밑에 코드와 같습니다.

```kotlin
class Rectangle(var height: Double, var lenght: Double){
	var perimeter = (height + lenght)*2
}
fun main(){
	//SampleStart
	val rectangle = Rectangle(5.0, 2.0);
	println("The perimeter is ${rectangle.perimeter}");
	//SampleEnd
}
```

# 템플릿 문자열

```kotlin
fun main(){
	//SampleStart
	var a = 1
	val s1 = "a is $a"
	
	a = 2
	//arbitrary expression in template:
	val s2 = "${s1.replace("is", "was ")}, but now is $a"
	//sampledEnd
	println(s2)
}
```

# 조건문

```kotlin
//sampleStart
fun maxOf(a: Int, b:Int):Int {
	if(a > b){
		return a
	} else {
		return b
	}
}
//sampleEnd
fun main(){
	println("max of 0 and 42 is ${maxOf(0, 42)}")
}
```

코틀린에서는 한줄로 조건문을 표현 할 수 있습니다.

```kotlin
//sample start
fun maxOf(a: Int, b: Int) = if (a>b) a else b

fun main(){
	println("max of 0 and 42 is ${maxOf(0,42)}")
}
```

# 반복문

## for

```kotlin
fun main(){
	//sampleStart
	val items = listOf("apple", "banana", "kiwifruit")
	for (item in items){
		println(item)
	}
//sample end
}
```

```kotlin
fun main(){
	//sample start
	val items = listOf("apple", "banana", "kiwifruit")
	for(index in items.indices){
		println("item at $index is ${items[index]}")
	}
	//sample end
}
```

```kotlin
fun main(){
	//sampleStart
	for(x in 1..10 step 2){
		print(x) // 올라가는 숫자
	}
	println()
	for(x in 9 downTo 0 step 3){
		print(x) // 반대 index
	}
	//sampleEnd
}
```

## while

```kotlin
fun main(){
	val items = listOf("apple", "banana", "kiwifruit")
	var index = 0
	while(index < item.size){
		println("item at $index is ${items[index]})
		index++
	}
}
```

## when

```kotlin
//sample start
fun describe(obj: Any): String = 
	when (obj){
		1 -> "One"
		"Hello": -> "Greeting"
		is Long: -> "Long"
		!is String -> "Not a string"
		else -> "Unknown"
	}
//sample end
fun main(){
	println(describe(1))
	println(describe("Hello")
	println(describe(1000L))
	println(describe(2))
	println(describe("other")
}
```

# Range

```kotlin
fun main(){
	//templeStart
	val x = 10
	val y = 9
	if(x in 1..y+1){
		println("fits in range")
	}
	//sampleEnd
}
```

Out Of Range라면 체크 해야한다.

```kotlin
fun main(){
	//SampleStart
	val list = listOf("a", "b", "c")

	if(-1 !in 0..list.lastIndex){
		println("-1 is out of range")
	}
	if(list.size !in list.indices){
		println("list size is out of valid list indices range, too")
	}
//sampleEnd
}
```

# Collections

```kotlin
fun main(){
	val items = listOf("apple", "banana", "kiwifurit")
	//sampleStart
	for(item in items){
		println(item)
	}
	//sampleEnd
}
```

```kotlin
fun main(){
	//sampleStart
	val fruits = listOf("banana", "avocado", "apple", "kiwifruit")
	fruits
		.filter{ it.startsWith("a") }
		.sortedBy{ it }
		.map{ it.uppercase() }
		.forEach{ println(it) }
	//sampleStart
}
```

```kotlin
fun main(){
	val items = setOf("apple", "banana", "kiwifruit")
	//sampleStart
	when{
		"orange" in items -> println("juicy")
		"apple" in items -> println("apple is fine too")
	}
	//sampleEnd
```

람다식으로 map 컬랙션을 사용한 코드 입니다.
