---
시작날짜: 2032-12-03T22:24:52
종료날짜: 2023-12-03T22:25:11

slug: "Flutter-기본-문법"
---


- [Flutter 초기 폴더 구조](#Flutter 초기 폴더 구조)
	- [assets](#Flutter 초기 폴더 구조#assets)
- [Main 페이지 만들기](#Main 페이지 만들기)
- [기본적인 위젯](#기본적인 위젯)
	- [Text()](#기본적인 위젯#Text())
	- [Icon()](#기본적인 위젯#Icon())
	- [Image()](#기본적인 위젯#Image())
	- [Container()](#기본적인 위젯#Container())
- [Flutter의 레이아웃](#Flutter의 레이아웃)
- [Flutter에서 Box 디자인](#Flutter에서 Box 디자인)
	- [Margin, Padding](#Flutter에서 Box 디자인#Margin, Padding)
	- [그외 기타](#Flutter에서 Box 디자인#그외 기타)
- [Typography](#Typography)
	- [색상 넣는 방법](#Typography#색상 넣는 방법)
	- [자주 사용하는 button style](#Typography#자주 사용하는 button style)
- [AppBar 디자인](#AppBar 디자인)
- [기본적인 디자인 레이아웃 실습](#기본적인 디자인 레이아웃 실습)
- [Flexible(), Expanded()](#Flexible(), Expanded())
	- [Flexible() 위젯](#Flexible(), Expanded()#Flexible() 위젯)
	- [Expended() 위젯](#Flexible(), Expanded()#Expended() 위젯)
- [ListView.builder 버튼](#ListView.builder 버튼)
	- [ListTile()](#ListView.builder 버튼#ListTile())
	- [목록을 동적으로 만들어야할 때 - ListView.builder()](#ListView.builder 버튼#목록을 동적으로 만들어야할 때 - ListView.builder())
	- [floatingActionButton](#ListView.builder 버튼#floatingActionButton)
	- [onPressed()\{}](#ListView.builder 버튼#onPressed()\{})
- [StatefullWidget](#StatefullWidget)
	- [위젯 또한 재렌더링을 해야 변경사항이 보인다.](#StatefullWidget#위젯 또한 재렌더링을 해야 변경사항이 보인다.)
	- [StatefullWidget 만들기](#StatefullWidget#StatefullWidget 만들기)
		- [커스텀 위젯으로 만들기](#StatefullWidget 만들기#커스텀 위젯으로 만들기)
		- [기존 위젯을 StatefullWidget으로 변경하기](#StatefullWidget 만들기#기존 위젯을 StatefullWidget으로 변경하기)
	- [Text를 동적으로 만들기](#StatefullWidget#Text를 동적으로 만들기)
- [Dialog/모달창](#Dialog/모달창)
	- [버튼 만들기](#Dialog/모달창#버튼 만들기)
	- [showDialog() 함수](#Dialog/모달창#showDialog() 함수)
		- [Why?](#showDialog() 함수#Why?)
			- [Context에 대한 이야기](#Why?#Context에 대한 이야기)
			- [showDialog()](#Why?#showDialog())
	- [자식 위젯이 부모 위젯의 state를 사용하고 싶다면](#Dialog/모달창#자식 위젯이 부모 위젯의 state를 사용하고 싶다면)
	- [부모 -> 자식 state 전송하는 법 #1](#Dialog/모달창#부모 -> 자식 state 전송하는 법 #1)
		- [보내기](#부모 -> 자식 state 전송하는 법 #1#보내기)
		- [자식 위젯 정의 부분에서 파라미터 등록](#부모 -> 자식 state 전송하는 법 #1#자식 위젯 정의 부분에서 파라미터 등록)
		- [자식 위젯에서 사용](#부모 -> 자식 state 전송하는 법 #1#자식 위젯에서 사용)
	- [부모 -> 자식 state 전송하는 법 - input message](#Dialog/모달창#부모 -> 자식 state 전송하는 법 - input message)
		- [TextEditingController()를 담는 변수를 하나 만듭니다.](#부모 -> 자식 state 전송하는 법 - input message#TextEditingController()를 담는 변수를 하나 만듭니다.)
		- [TextField() 위젯에 controller:](#부모 -> 자식 state 전송하는 법 - input message#TextField() 위젯에 controller:)
- [User에게 앱 권한 요청하기](#User에게 앱 권한 요청하기)
	- [Package 설치 필요](#User에게 앱 권한 요청하기#Package 설치 필요)
	- [Andriod Setting](#User에게 앱 권한 요청하기#Andriod Setting)
		- [gradle.properties](#Andriod Setting#gradle.properties)
		- [build.gradle](#Andriod Setting#build.gradle)
		- [AndriodManifest.xml](#Andriod Setting#AndriodManifest.xml)
	- [iOS의 경우 M1 Mac](#User에게 앱 권한 요청하기#iOS의 경우 M1 Mac)
		- [명령어 입력](#iOS의 경우 M1 Mac#명령어 입력)
		- [Podfile](#iOS의 경우 M1 Mac#Podfile)
		- [Info.plist](#iOS의 경우 M1 Mac#Info.plist)
	- [유저에게 사용 권한을 요청 후 Action](#User에게 앱 권한 요청하기#유저에게 사용 권한을 요청 후 Action)
		- [유저에게 사용 권한 요청하기](#유저에게 사용 권한을 요청 후 Action#유저에게 사용 권한 요청하기)
- [유저의 연락처를 가져오는 법](#유저의 연락처를 가져오는 법)
	- [사용자 연락처 가져오는 패키지](#유저의 연락처를 가져오는 법#사용자 연락처 가져오는 패키지)
	- [연락처를 다루는 패키지 사용법](#유저의 연락처를 가져오는 법#연락처를 다루는 패키지 사용법)
	- [실제 연락처를 list로 보여주기](#유저의 연락처를 가져오는 법#실제 연락처를 list로 보여주기)

---

# Flutter 기본

## Flutter 초기 폴더 구조
![스크린샷-2023-01-27-오전-9.10.07.png](/img/이미지 창고/스크린샷-2023-01-27-오전-9.10.07.png)
- 위에 보이는 것과 같이 매우 많은 폴더가 존재합니다.
- 하지만, 저희가 Flutter를 개발할 때는 모든 폴더의 파일을 쓰는 것이 아닙니다.
- 우선적으로 사용하는 파일은 `lib/main.dart` 파일 입니다.
- 해당 파일은 앱 개발에 기본이 되는 Main 파일 입니다, 해당 파일로 앱 개발을 메인으로 진행합니다

### assets
- 원래는 `assets` 이라는 디렉토리는 없는 것이지만 사진과 같은 파일을 추가하기 위해서는 따로 폴더를 만들었습니다.
- 다른 프레임워크와는 다르게 Flutter는 해당 디렉토리 추가에 대한 경로 설정을 해주어야합니다.
![스크린샷-2023-01-27-오전-9.17.12.png](/img/이미지 창고/스크린샷-2023-01-27-오전-9.17.12.png)
- 56,57번째 라인을 추가하면 assets라는 폴더안에 있는 모든 파일을 쓸 수 있습니다.

## Main 페이지 만들기
- 처음 `main.dart` 파일을 보게 된다면 아래와 같이 구성이 되어 있습니다.
```dart
class MyApp extends StatelessWidget { 
	const MyApp({Key? key}) : super(key: key); 
	
	@override 
	Widget build(BuildContext context) {
	
		return MaterialApp( 
			home: Text('안녕'), 
		); 
	} 
}
```
- Flutter는 흔히 위젯 형태로 사용한다고 말합니다.
- Text(), Contaier(), Image() 등등이 해당 방식에 속합니다.

## 기본적인 위젯

### Text()
```dart
return MaterialApp(
	home: Text('안녕')
)
```
- 글자를 넣어주는 위젯입니다.

### Icon()
```dart
return MaterialApp(
	home: Icon(Icons.star)
)
```
- 별 모양 아이콘

### Image()
```dart
return MaterialApp(
	home: Image.asset('assets/dog.png')
)
```

### Container()
```dart
return MaterialApp(
	home: Container()
)
```
- 위와 같은 방식으로 사용하면 된다.
- 해당 방식을 CSS 적인 것을 적용하려면 아래와 같이 작성하면 된다.
```dart
return MaterialApp(  
  home: Container(width: 50, height: 50, color: Colors.blue)  
);
```

![스크린샷-2023-01-27-오전-9.51.48.png](/img/이미지 창고/스크린샷-2023-01-27-오전-9.51.48.png)
- 하지만, 문제는 위와 같이 나온다는 것이다.
- 이유인 즉슨, 어디를 중심으로 50 * 50 인지를 Flutter에서 인지를 못하기 때문입니다.
- 그래서 아래와 같이 작성해야지 저희가 의도한 대로 50 * 50을 지키면서 나오게 됩니다.
```dart
return MaterialApp(  
  home: Center(  
   child: Container(width: 50, height: 50, color: Colors.blue),  
  )  
);
```
- 위 코드와 같이 Center로 한번 감싼 후에 Container를 child로 만들고, 속성을 적어주게 된다면
![스크린샷-2023-01-27-오전-9.55.41.png](/img/이미지 창고/스크린샷-2023-01-27-오전-9.55.41.png)
- 의도한 대로 50 * 50 짜리 박스가 만들어집니다.


## Flutter의 레이아웃
- 보통의 모바일 기기들을 보게 된다면, 현재 쓰고 있는 앱들은 아래의 사진과 같이 상단바, 중단, 하단바로 나뉘어 있습니다.
![스크린샷-2023-01-27-오전-10.12.22.png](/img/이미지 창고/스크린샷-2023-01-27-오전-10.12.22.png)
- 카톡 뿐만 아니래 대부분의 모바일 앱들이 해당 구조를 가지고 있으며, 이를 쉽게 구성하기 위해서는 Flutter에서 `Scaffold()` 위젯을 사용하면 됩니다.
```dart
return MaterialApp(  
  home: Scaffold(  
    appBar: 상단에 넣을 위젯,  
    body: 중단에 넣을 위젯,  
    bottomNavigationBar: 하단에 넣을 위젯,  
  ),  
);
```
- 예제
```dart
return MaterialApp(  
  home: Scaffold(  
    appBar: AppBar(  
      title:  
      Text('앱제목'),  
    ),  
    body: Text('안녕'),  
    bottomNavigationBar: BottomAppBar(  
      child: Text('하단바임 ㅅㄱ'),  
    ),  
  ),  
);
```

![스크린샷-2023-01-27-오전-10.22.07.png](/img/이미지 창고/스크린샷-2023-01-27-오전-10.22.07.png)
- 예제2
```dart
return MaterialApp(  
  home: Scaffold(  
    appBar: AppBar(  
      title:  
      Text('앱제목'),  
    ),  
    body: Text('안녕'),  
    bottomNavigationBar: BottomAppBar(  
        child: Container(  
            height: 60,  
            child: Row(  
              mainAxisAlignment: MainAxisAlignment.spaceAround,  
              children: [  
                Icon(Icons.phone),  
                Icon(Icons.message),  
                Icon(Icons.contact_page),  
              ],  
            )  
        )  
    ),  
  ),  
);
```

![스크린샷-2023-01-27-오전-10.27.24.png](/img/이미지 창고/스크린샷-2023-01-27-오전-10.27.24.png)
## Flutter에서 Box 디자인
- Container에서도 충분히 Box 디자인을 할 수 있습니다.
- 하지만, Container를 단순히 Size 조절을 위해서 사용하기에는 크기가 무거운 위젯이다보니, Flutter에서도 SizedBox()를 쓰라고 권장하고 있습니다.
- 똑같은 박스이지만, 훨씬 가볍습니다.

### Margin, Padding
- 해당 옵션은 **Container()** 속성에만 옵션을 줄 수 있습니다.
- 위의 SizedBox에서는 되지 않기 때문에, Container에서 속성을 써야합니다.
- 예시
```dart
return MaterialApp(  
  home: Scaffold(  
    appBar: AppBar( ... ),  
    body: SizedBox(  
      child: Container(  
		// 아래의 EdgeInsets.all은 모든 방향      
		margin: EdgeInsets.all(30),  
		//fromLTRB는 각각의 방향을 제어 할 수 있다.
        padding: EdgeInsets.fromLTRB(10, 20, 30, 40),  
          
	    color: Colors.green  
      ),  
    ),  
    bottomNavigationBar: BottomAppBar( ... ),  
  ),  
);
```
![스크린샷-2023-01-27-오전-10.52.07.png](/img/이미지 창고/스크린샷-2023-01-27-오전-10.52.07.png)
:::tip 참고
`Row()`, `Colume()` 이런 곳은 안되고 오직 `Container()` 에만 여백을 줄 수 있습니다.
`Row()` 에 여백을 주고 싶으면 `Container()` 위젯을 안쪽이나 바깥쪽이나 아무데나 추가하면 된다.


:::

### 그외 기타
- 그외의 중요성이 떨어지는 스타일은 `decoration: BoxDecoration()`안에 넣게 되어있습니다.
```dart
return MaterialApp(
	Container(
		decoration: BoxDecoration(
			border : Border.all(color : Colors.black)
		)
	)
)
```


## Typography

- Flutter도 글씨에 대한 스타일을 따로 부여가 가능합니다.
```dart
return MaterialApp(
	home: Scaffold(  
		body: SizedBox(  
			child: Container(  
			    child: Text(  
				    '글자임',  
				    style: TextStyle(  
			        color: Colors.red,  
			        backgroundColor: Colors.orange,  
			        fontSize: 30,  
			        fontWeight: FontWeight.w600,  
			        letterSpacing: 3,  
			        ),  
			    ),  
			),  
		),
	)
)
```

### 색상 넣는 방법
```dart
color: Colors.red,
color: Color.fromRGBO(20, 130, 50, 0.8),
color: Color(0xffffffff)
```

### 자주 사용하는 button style
```dart
return MaterialApp(  
  home: Scaffold(  
    appBar: AppBar( ... ),  
    body: SizedBox( ... ),  
    bottomNavigationBar: BottomAppBar(  
        child: Container(  
            height: 60,  
            child: Row(  
              mainAxisAlignment: MainAxisAlignment.spaceAround,  
              children: [  
                TextButton(onPressed: (){},  
                    child: Text('버튼임')  
                ),  
                ElevatedButton(  
                    child:  
                    Text('버튼임',),  
                    onPressed: (){},  
                ),  
                IconButton(  
                  icon:Icon(Icons.star),  
                  onPressed: (){},  
                ),  
              ],  
            )  
        )  
    ),  
  ),  
);
```
![스크린샷-2023-01-27-오후-2.56.10.png](/img/이미지 창고/스크린샷-2023-01-27-오후-2.56.10.png)
- 하단의 버튼 모양이 Flutter에서 자주 사용하는 Button 모양입니다.

## AppBar 디자인
![스크린샷-2023-01-27-오후-2.57.17.png](/img/이미지 창고/스크린샷-2023-01-27-오후-2.57.17.png)
- AppBar() 자주 쓰니까 짚고 넘어가자면
```dart
AppBar( 
	title : Text('앱제목'), 
	leading : Icon(Icons.star), 
	actions : 
		[ 
			Icon(Icons.star), 
			Icon(Icons.star) 
		] 
	)
```

|문법|설명|
|--|--|
|`title`|제목|
|`leading`|제목 왼쪽 아이콘|
|`actions`|제목 오른쪽 아이콘|
- 이런 식으로 쓰면 AppBar가 이뻐진다.

## 기본적인 디자인 레이아웃 실습
![Pasted-image-20230127150054.png](/img/이미지 창고/Pasted-image-20230127150054.png)
```dart
body: Container( 
	height: 150, 
	child: Row( 
		children: [ 
			Image.asset('camera.jpg', width : 150), 
			Expanded( 
				child : Column( 
					crossAxisAlignment: CrossAxisAlignment.start, 
					children: [ 
						Text('카메라팝니다'), 
						Text('금호동 3가'), 
						Text('7000원'), 
						Row( 
							children: const [ 
								Icon(Icons.favorite), 
								Text('4') 
							], 
						), //Row 
					], 
				), //Column 
			), 
		], 
	), 
),
```




## Flexible(), Expanded()

### Flexible() 위젯
- Row()안에 박스를 여러개 배치할 때, 박스의 폭을 고정된 숫자가 아니라 50% 이렇게 주고 싶을 때가 있다.
- 그러고 싶을 때는 Flexible() 안에 박스 들을 담으면 된다.

```dart
Row(
	Childern:[
		Flexible( child: Container(color : Colors.blue ), flex: 1),
		Flexible( child: Container(color: Colors.green ), flex: 1)
	]
)
```
- Row() 안에 있는 것들을 Flexible()로 각각 감싼 뒤에 flex를 주면 됩니다.
- flex는 이 박스가 얼마나 가로폭을 차지할지 결정하는 "배수"이다.

- 1과 2를 써놓으면 1대 2만큼 차지한다.
- 1과 1을 써놓으면 1대 1만큼 차지합니다.

### Expended() 위젯
- 하나의 박스만 가로폭을 꽉 채우고 싶다면 Expanded() 이걸로 감싸면 된다.
- 그걸로 감싼 박스는 남은 폭을 꽉채우고 싶어한다.
```dart
Row( 
	children : [ 
		Expanded( child: Container(color : Colors.blue), flex : 1 ), 
		Container(Color : Colors.green, width : 100), 
	] 
)
```

## ListView.builder 버튼

### ListTile()
![스크린샷-2023-02-01-오전-8.39.19.png](/img/이미지 창고/스크린샷-2023-02-01-오전-8.39.19.png)
```dart
ListTile(){
	leading : Image.asset('assets/profile.png'),
	title: Text('홍길동')
}
```
- 왼쪽에 그림이 있고, 오른쪽에는 글이 있는 레이아웃이 필요할 때는, ListTile()이라는 기본 위젯을 쓰게 된다면 편리하게 작성이 가능하다.

### 목록을 동적으로 만들어야할 때 - ListView.builder()
![스크린샷-2023-02-01-오전-8.41.54.png](/img/이미지 창고/스크린샷-2023-02-01-오전-8.41.54.png)
- 위와 같은 사진 처럼 반복되는 `ListTile()`의 경우에는 아래와 같이 `ListView.builder()` 속성을 이용해서 코드를 작성할 수 있습니다.
```dart

ListView.builder(
  itemCount: 3,
  itemBuilder: (context, i) {
    print(i);
    return ListTile(
      leading : Image.asset('profile.png'),
      title : Text('홍길동'),
    )
  }
);  
```
- i는 index 값으로 표현이 됩니다.

### floatingActionButton
![스크린샷-2023-02-01-오전-8.48.01.png](/img/이미지 창고/스크린샷-2023-02-01-오전-8.48.01.png)
- 이벤트를 통해서 `ListView.Builder()`를 동적으로 만들기 위해서 버튼을 하나 만들어 봅니다.

### onPressed()\{}
- 버튼을 눌렀을 때 실행하고 싶은 경우 `onPressed(){}`에 표현하면 됩니다.
```dart
class MyApp extends StatelessWidget { 
	MyApp({Key? key}) : super(key: key); 
	var a = 1; 
	
	@override 
	Widget build(BuildContext context) { 
		return MaterialApp( home : Scaffold( 
			floatingActionButton: FloatingActionButton( 
				child: Text(a.toString()), 
				onPressed: (){ a++; print(a); }, ), 
				body: , 
				appBar: AppBar(), 
			) 
		); 
	} 
}
```
- 혹시라도 a라는 변수의 변화가 실시간으로 렌더링이 되는지에 대한 것으로 알았지만, 지금의 기본 옵션에서는 해당 렌더링이 자동으로 되지 않습니다.

## StatefullWidget

### 위젯 또한 재렌더링을 해야 변경사항이 보인다.
- 위젯 안에 있는 변수가 변수 값이 변경되어도, 위젯과 똑같이 보이지 않는 이유는 재 랜더링이 되지 않아서 입니다.
- 그렇기 때문에 변수의 값이 변경되면 강제로 재랜더링을 시켜주여야합니다.
- `state`라는 것을 이용하면 자동으로 재 랜더링되게 할 수 있다.
- `state`는 변수랑 똑같은 것이지만, `state`는 변경사항이 생긴다면 해당 위젯이 자동으로 재 랜더링 됩니다.

### StatefullWidget 만들기

#### 커스텀 위젯으로 만들기
- state를 만들기 위해서는 해당 state보관함 + 커스텀 widget을 만들어야합니다.
```dart
class 테스트 extends StatefulWidget { 
	const 테스트({Key? key}) : super(key: key); 
	@override 
	_테스트State createState() => _테스트State();
} 
class _테스트State extends State { 
	var a = 1; //여기 만드는 변수는 state가 됩니다 
	@override 
	Widget build(BuildContext context) { 
		return Container(); 
	} 
}
```

#### 기존 위젯을 StatefullWidget으로 변경하기
- 저희 플젝에서 쓰던 MyApp이라는 위젯을 잘 보면 StatelessWidget입니다.
- 이걸 StatefulWidget으로 바꾸면 그냥 거기에 state를 만들어 쓸 수 있습니다.
```dart
class MyApp extends StatefulWidget { 
	const MyApp({Key? key}) : super(key: key); 
	@override 
	_MyAppState createState() => _MyAppState(); 
} 
class _MyAppState extends State { 
	var a = 1; //여기 만드는 변수는 state가 됩니다 
	@override 
	Widget build(BuildContext context) { 
		return Scaffold(생략); 
	} 
}
```

- 그래서 state를 적용을 하면 아래의 코드로 변화됩니다.
```dart
MaterialApp(   
	home: Scaffold( 
		floatingActionButtion: FloatingActionButton( 
			child : Text(a.toString()), 
			onPressed: (){ 
				setState((){ 
					a++ 
				}); 
			} 
		),
		appBar: AppBar(),    
	body: 생략   
	), 
)
```

### Text를 동적으로 만들기
- 아래의 코드에는 `Text('홍길동')` 이런식으로 하드 코딩이 되어있습니다.
- 해당 하드 코딩된 부분을 List를 통해서 표현하면서, 변동사항(추가, 삭제)에 대한 코드를 다루겠습니다.
```dart
class _MyAppState extends State { \
	var a = 1; 
	var name = ['김영숙', '홍길동', '피자집']; 
	@override 
	(생략) 
}
```
- 우선 위에서 변수를 작성했던 란에 `name`이라는 List 변수를 작성합니다.
```dart
ListView.builder( 
	itemCount: 3, 
	itemBuilder: (context, i) { 
		return ListTile( 
			leading : Image.asset('profile.png'), 
			title : Text(name[i]), 
		) 
	} 
);
```
- 그리고 위에서 ListView부분을 위의 코드와 같이 수정하게 된다면, List에 있는 화면으로 출력해줍니다.

## Dialog/모달창
- 웹의 모달창처럼, 앱도 모달창이 존재합니다.
![스크린샷-2023-02-01-오전-10.29.11.png](/img/이미지 창고/스크린샷-2023-02-01-오전-10.29.11.png)
- MaterialApp 디자인 쓰는 앱은 showDialog()라는 기본 함수가 있다.
- 여기다가 파라미터 몇개 집어 넣어주면 쉽게 다이얼로그가 화면에 생성된다.

### 버튼 만들기
- 우선 팝업을 띄울 버튼이 필요합니다.
- 아무데나 버튼을 일단 만듭니다.
```dart
MaterialApp( 
	home: Scaffold( 
		floatingActionButton: FloatingActionButton( 
		child: Text('버튼'), 
		onPressed: (){}, 
	), 
(생략)
```

### showDialog() 함수
- 소문자로 시작하는 것들은 모두 함수입니다.
- Flutter가 제공하는 기본 함수인 `showDialog()`를 쓰는 순간 Dialog가 하나가 뜹니다.
- 그리고 위에서 만들었던 버튼의 onPressed: 안에 넣습니다.
```dart
FloatingActionButton( 
	child: Text('버튼'), 
	onPressed: () { 
		showDialog( 
			context: context, 
			builder: (context){ 
				return Dialog( 
					child: Text('AlertDialog Title'), 
				);
			}, 
		); 
	}, 
),
```
- showDialog()에 들어갈 첫 파라미터는 context입니다.
- 둘째 파라미터는 `builder:` 인데 여기에는 위젯을 return하는 함수를 넣으면 됩니다.

- 하지만, 위의 코드는 나오지 않고 에러가 나옵니다. 우선 에러가 안나는 코드는 아래와 같습니다.
```dart
void main() { 
	runApp( 
		MaterialApp( 
			home : MyApp() 
		) 
	); 
} 
class _MyAppState extends State<MyApp> { 
	@override 
	Widget build(BuildContext context) { 
		return Scaffold( 안쪽 생략 );
```

#### Why?
- 해당 에러가 난 이유에 대한 것은 아래와 같습니다.

- context는 쉽게 비유하자면 족보입니다.
```dart
class 위젯명 extends StatelessWidget { 
	@override 
	build (context) { 
		어쩌구 생략
```
- 커스텀 위젯을 만들때 보면 build() 함수를 쓰도록 되어 있습니다.
- build() 함수 안에 첫 파라미터 넣으면 그건 무조건 <span style={{color: 'red'}}>현재 위젯의 부모들</span>이 누군지 담겨있습니다.
- context도 내 조상들(부모, 부모의 부모, 증부모 등등)의 위젯이 누군인지 알려주는 족보입니다.


##### Context에 대한 이야기
![스크린샷-2023-02-01-오전-11.01.21.png](/img/이미지 창고/스크린샷-2023-02-01-오전-11.01.21.png)
```dart
class MyApp extends StatelessWidget { 
	(생략) 
	build (context) { 
		return MaterialApp( 
			home : Scaffold( 
				body : 커스텀위젯()
			) 
		); 
	} 
} 
class 커스텀위젯 extends StatelessWidget { 
	(생략)
	build (context) { 
		return Text('안녕'); 
	} 
}
```
:::question Class 커스텀 위젯안에 Context에 담겨있는 정보?
커스텀 위젯의 모든 조상들의 정보를 담고 있습니다.
MaterialApp
Scaffold
이런 것들이 담겨있습니다.

:::

:::question 그럼 ClassMyApp 안에 있는 context는?
MyApp 위젯의 모든 조상들에 대한 정보를 담겨 있는 변수 입니다.
하지만, 최상위이기 때문에 아무것도 든게 없습니다.

:::

:::info Flutter에는 특별한 함수들이 있습니다.
`showDialog()`
`Navigator()`
`Theme.of()`
`Scaffold.of()`
이런 함수들은 context를 (족보를)소괄호 안에 집어넣어야 잘 작동하는 함수 입니다.

:::

##### showDialog()
- 족보를 넣는데 족보 중에 `MaterialApp` 이 들어있어야 제대로 작동됩니다.
```dart
showDialog( context : MaterialApp이 부모로 들어있는 족보)
```
- 위와 같이 써야합니다.

### 자식 위젯이 부모 위젯의 state를 사용하고 싶다면
- 예를 들어, A라는 state를 MyApp 위젯에 만들어놨는데, 그 안에 있는 Dialog(UI) 위젯이 a를 가져다가 Dialog 안에 표기해주고 싶다면?
![스크린샷-2023-02-01-오후-1.27.59.png](/img/이미지 창고/스크린샷-2023-02-01-오후-1.27.59.png)

- 당연하게도 그냥 a라고 변수를 작성하면 작동하지 않습니다.
- **부모 위젯**에서 **자식 위젯**으로 **state를 전송해서 써야**합니다.

### 부모 -> 자식 state 전송하는 법 #1
:::quote 부모 -> 자식 state 전송 순서
1. 보내기
2. 자식은 state 이름을 등록
3. 자식은 사용

:::

#### 보내기
```dart
(MyApp 안에 DialogUI() 쓰던 곳)
DialogUI(state : a)
```
- 보내는건 자식 쓰는 곳에다가 **파라미터로 보내기 넣으면** 끝입니다.
- **작명 : 변수명** -> 파라미터는 왼쪽과 같이 작성합니다.

#### 자식 위젯 정의 부분에서 파라미터 등록
```dart
class DialogUI extends StatelessWidget{
	DialogUI({Key? key, this.state}) : super(key, key);
	final state;
}
```
- **this.작명**, **final 작명** 왼쪽 두개를 채우면 끝 입니다.
- final은 상수로 만들고 싶을 때 사용합니다.

#### 자식 위젯에서 사용
- 이제 `DialonUI()` 안에서 자유롭게 쓰면 됩니다.
- Text(state.toString()) 이런 식으로 테스트 하면 됩니다.

:::danger 부모 위젯 -> 자식 위젯만 가능하며 그 반대는 성립하지 않습니다.
:::

![스크린샷-2023-02-01-오후-1.44.54.png](/img/이미지 창고/스크린샷-2023-02-01-오후-1.44.54.png)
>혹은 아예 관련 없는 옆집 위젯끼리의 전송은 안됩니다.

:::tip 그래서 많은 위젯을 사용해야하는 경우, 중요한 state는 최대한 위에 보관하는 것이 좋습니다.


:::

### 부모 -> 자식 state 전송하는 법 - input message
- 부모 -> 자식 state 전송법은 위와 동일하지만, input message를 추가하여서 설명하겠습니다.
- 유저가 TextFeild() 위젯으로 만듭니다.
#### TextEditingController()를 담는 변수를 하나 만듭니다.
```dart
class DialogUI extends StatelessWidget{
	DialogUI({Key? key, this.addOne}) : super(key: key);
	final addOne;
	var inputData = TextEditingController();
}
```


#### TextField() 위젯에 controller:
```dart
TextField(
	controller: inputData,
),
```

- `controller:` 파라미터 안에, 방금 만들어놓은 변수를 넣습니다.
- 그렇게 되면 유저의 TextField에 입력할 때마다, inputData.txt라는 곳에 저장이 됩니다.

## User에게 앱 권한 요청하기
- 모바일 기기 연락처, 파일, 카메라 등등 을 사용해서 기능 개발을 하고 싶다면, 유저의 허락이 필요합니다.

### Package 설치 필요
- 유저에게 앱 권한을 쉽게 요청 할 수 있게 만든 외부 패키지를 설치하면 됩니다.
- `permission_handler` 입니다.
- Flutter에서 Package 설치법은 쉽습니다.
	- `pubspec.yaml` 파일에 버전 기록하고
	- pub get 실행하면 끝납니다.
```yaml
dependencies: 
	flutter: 
		sdk: flutter 
	permission_handler: ^8.3.0
```
- 설치는 pubspec.yaml의 dependancies 부분 하단에 위 코드를 기록합니다.
- 그 후에 왼쪽에 전구 표시를 누른 후에 `pub get ~` 이라는 권장 사항이 뜨는데 그것을 누르게 되면 알아서 패키지가 설치 됩니다.

```dart
import 'package:permission_handler/permission_handler.dart';
```
- 그후에 `main.dart` 맨 위에 아무데나 위 코드를 추가 해주게 되면, 패키지 설치가 완료 됩니다.
- `permission_handler.dart` 파일에 있는 함수와 변수들을 가져다가 쓸 수 있게 해주는 문법입니다.

### Andriod Setting

#### gradle.properties
```properties
android.useAndroidX=true 
android.enableJetifier=true
```
- 우선 android 폴더에 gradle.properties 파일에 위 코드가 기록되어있는지 확인하고,

#### build.gradle
```gradle
android{
	compileSdkVerion 31
	...
}
```
- 위 처럼 andriod/build.gradle 파일 중간에 compileSdkVersion을 31로 맞추면 됩니다.
- 숫자가 아니라 이상한 문자가 채워져 있다면, 수정하지 않고 그대로 두어도 됩니다.

#### AndriodManifest.xml
```xml
<manifest 어쩌구> 

		<uses-permission android:name="android.permission.READ_CONTACTS"/> 
		<uses-permission android:name="android.permission.WRITE_CONTACTS"/> 
	
	<application 어쩌구>
```
- android/app/src/main/AndriodManifest.xml 파일에 위 `<uses-permission ...` 부분을 2개 넣으면 됩니다.
- 그리고 종료 후 다시 re-run을 하면 됩니다.

### iOS의 경우 M1 Mac 

#### 명령어 입력
```bash
cd ios
sudo arch -x86_64 gem install ffi
sudo arch -x86_64 gen install cocoapods
```

#### Podfile
- iOS 폴더 안에 있는 Podfile이 있습니다.
	- 만약 없다면, 터미널에 `pod init` 을 입력하면 됩니다.
- 해당 파일의 최하단에 `post_install do |installer|` ~ 부터 시작하는 부분이 있습니다.
- 그 코드 블록은 다 지우고, 아래의 코드 블록으로 대체 합니다.
```podfile
post_install do |installer| 
	installer.pods_project.targets.each do |target| 
		flutter_additional_ios_build_settings(target) 
		target.build_configurations.each do |config| 
			config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] ||= [ 
				'$(inherited)', 
				'PERMISSION_CONTACTS=1', 
				#추가할거 더 있으면 이 자리에 
			] 
		end 
	end 
end
```
- 만약 다른 권한을 주고 싶다면 아래의 링크에 예시가 있습니다.
	- https://pub.dev/packages/permission_handler
	- 'PERMISSION_CAMERA=1',
		- 위는 카메라 권한을 의미합니다.

#### Info.plist
```plist
<key>NSContactsUsageDescription</key>
<string>님 폰의 연락처 권한이 필요합니다 제발 주셈</string>
```
- Info.plist라는 파일을 오픈해서 위의 코드를 적절해보이는 곳에 추가하면 됩니다.
- 권한을 달라고 팝업을 띄울 때 안내문 넣는 부분입니다.
![스크린샷-2023-02-02-오후-3.39.41.png](/img/이미지 창고/스크린샷-2023-02-02-오후-3.39.41.png)

### 유저에게 사용 권한을 요청 후 Action

#### 유저에게 사용 권한 요청하기
```dart
getPermission() async { 
	var status = await Permission.contacts.status; 
	if (status.isGranted) { 
		print('허락됨'); 
	} else if (status.isDenied) { 
		print('거절됨'); 
		Permission.contacts.request(); 
	} 
}
```

- 우리 메인 위젯 안에 함수를 만들었습니다.
- contacts 대신 camera 쓰면 카메라 권한, location을 쓰면 위치 권한을 허락받을 수 있습니다.

:::warning Andriod 11 버전 이상과 iOS에서는 유저가 한, 두번 이상 거절하면 **다시는 팝업을 띄울 수 없습니다.**
그 경우 앱 설정을 오픈해서 유저가 직접 설정을 바꿔야하기 때문에, 그래서 앱을 처음 로드할 때 말고, 
진짜 연락처 기능이 필요해질 때 띄우는게 요즘 유행입니다.

:::

- 그리하여, AppBar 우측에 버튼을 만들고, 그거를 누르면 권한을 요청하라고 코드를 짰습니다.
```dart
AppBar( 
	title : Text('앱제목'), 
	actions : [ 
		IconButton(onPressed: (){ getPermission(); }, icon : Icon(Icons.contacts)) 
	] 
)
```
- 하지만, 아이폰의 경우 OS가 금지하는 경우도 있고(status.isRestricted)
- 안드로이드의 경우 아예 앱 설정에서 꺼 놓는 경우(status.isPermanentlyDenied)
- 그것도 체크하고 싶다면,
```dart
if(status.isPermanentlyDenied){
	openAppSetting();
}
```
- if문을 추가하여, 아예 유저가 설정에 들어가서 직접 바꿀 수 있게 셋팅해줍니다.


## 유저의 연락처를 가져오는 법

### 사용자 연락처 가져오는 패키지
- 그냥 가져올 순 없고, 외부 패키지 도움을 받아야합니다.
```yaml
dependencies: 
	flutter: 
		sdk: flutter 
	permission_handler: ^8.2.6 
	contacts_service: ^0.6.3
```
- `pubspec.yaml` 파일에 contacts_service를 추가합니다
- 그리고 전구 버튼에서 pub get을 눌러서 패키지를 설치하면 됩니다.

```dart
import 'package:contacts_service/contacts_service.dart'; 
```
- 그 후에 위의 코드를 main.dart에 추가하면 설치 끝입니다.

### 연락처를 다루는 패키지 사용법
```dart
var contacts = await ContactsService.getContacts();
```
- 이런 코드를 짜게 되면 list자료로 모든 연락처를 가져오게 됩니다.

```dart
var contacts = await ContractsService.getContacts(withThumbnails: false);
```
- 연락처에 저장되어 있는 프로필 사진도 다 가져와버리면 너무 느리기 때문에, 위 코드를 써서 썸네일 제외하고 가져올 수 있습니다.

```dart
var contacts = await ContactsService.getContacts(withThumbnails: false); 
print(contacts[0].givenName)
```
- 첫 연락처의 이름 부분을 출력해보는 코드 입니다.

```dart
var newContact = new Contact(); 
newContact.givenName = '민수'; 
await ContactsService.addContact(newContact);
```
- 이 코드를 실행 하면 실제 연락처가 폰으로 추가 됩니다.
- `.givenName` 항목엔 이름이, `.familyName` 항목에는 성
- 이걸 각각 추가해야하는데 이름만 해도 상관 없습니다.

### 실제 연락처를 list로 보여주기
```dart
(getPermission 함수 안쪽)

var contacts = await ContactsService.getContacts(withThumbnails: false);
print(contacts[0].givenName)

setState(() {
	name = contacts;
})
```

---

 #Flutter 

---
