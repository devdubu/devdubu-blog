---
slug: "Flutter-앱-개발"
---
`analysis_options.yaml`
```yaml
...
rules:  
  # avoid_print: false  # Uncomment to disable the `avoid_print` rule  
  # prefer_single_quotes: true  # Uncomment to enable the `prefer_single_quotes` rule  
  prefer_typing_uninitialized_variables: false  
  prefer_const_constructors_in_immutables: false  
  prefer_const_constructors: false  
  avoid_print: false  
  prefer_const_literals_to_create_immutables: false
...

```

## Style 따로 할당하기
`lib/main.dart`
```dart
import 'package:flutter/material.dart';  
  
void main() {  
  runApp(  
    MaterialApp(  
      theme: ThemeData(  
        iconTheme: IconThemeData(color: Colors.blue)// 해당 부분에서 아이콘을 blue컬러로 바뀜
      ),      home: MyApp()  
    )  );}  
  
class MyApp extends StatelessWidget {  
  const MyApp({Key? key}) : super(key: key);  
  
  @override  
  Widget build(BuildContext context) {  
    return Scaffold(  
      appBar: AppBar(),  
      body: Icon(Icons.star), // 해당 부분에서 주석 처리
    );  }}
```
- 위의 코드인 `iconTheme: IconThemeData(color: Colors.blue)`를 사용하게 된다면, 모든 icon들은 파란색을 갖는다

```dart
import 'package:flutter/material.dart';  
  
void main() {  
  runApp(  
    MaterialApp(  
      theme: ThemeData(  
        iconTheme: IconThemeData(color: Colors.blue),  
        appBarTheme: AppBarTheme(color: Colors.grey)  
      ),      home: MyApp()  
    )  );}  
  
class MyApp extends StatelessWidget {  
  const MyApp({Key? key}) : super(key: key);  
  
  @override  
  Widget build(BuildContext context) {  
    return Scaffold(  
      appBar: AppBar(actions: [Icon(Icons.star)],),  
      body: Icon(Icons.star),  
    );  }}
```
- 하지만, Appbar에 아이콘을 넣었지만, 파란색으로 변하지 않는다. 

### ThemeData()
```dart
ThemeData( 
	iconTheme: IconThemeData(color: Colors.red, size: 60), 
	appBarTheme: AppBarTheme( color: Colors.grey),
)
```
- `iconTheme: IconThemeData()` : 빨간색을 넣게 된다면, 모든 아이콘이 빨간색이 된다.
- `appBarTheme: AppBarTheme()`: 회색을 넣게 된다면, 위의 AppBar가 회색이 된다.

#### Text 스타일 변경
```dart
ThemeData( 
	textTheme: TextTheme( 
		bodyText2: TextStyle( 
			color : Colors.blue, 
		), 
	),
)
```

:::tip textTheme 안에서는 스타일이 정해져있습니다.
- headline1
- headline2
- bodyText1
- bodyText2
- subtitle1
- `Text`위젯은 이 중에 `bodyText2` 스타일을 사용하고, 
- `AppBar`와 `Dialog` 위젯은 이 중에 `headline6`을 사용하고 
- `ListTile` 위젯은 `subtitle1`을 사용합니다.

:::

## AppBar 만들기 예시
`lib/main.dart`
```dart
import 'package:flutter/material.dart'

void main(){
	runApp(
		MaterialApp(
			theme: ThemeData(
				appBarTheme: AppBarTheme(
					color: Colors.white,
					elevation: 1,
					titleTextStyle: TextStyle(color: Colors.black, fontSize: 25),
					actionIconTheme: IconThemeData(color: Colors.black),
					textTheme: TextTheme(
						bodyText2: TextStyle(color: Colors.red),
					),
				),
				home: MyApp()
			),
		)
	);
	const MyApp({Key? key}) : super(key:key);

	@overrid
	Widget build(BuildContext context){
		return Scaffold(
			appBar: AppBar(
				title: Text('Instagram'),
				actions: [
					IconButton(
						icon: Icon(Icons.add_box_outlined),
						onPressed: (){},
						iconSize: 30,
						)//IconButton
				]
			) // AppBar
			body: Text('안녕'),
		); // Scaffold
	}
}
```


## 파일로 분리
- `ThemeData()` 같은 경우 코드가 길어질 수 있습니다.
:::tip 다른 파일로 분리
1. `lib` 폴더 안에 `style.dart` 해당 파일을 만들어서 이 파일에 변수를 만들어서 축약할 내용을 적습니다.
2. `main.dart`로 불러오면 됩니다.

:::

`lib/style.dart`
```dart
import 'package:flutter/material.dart'

var theme = ThemeData{
	// ThemeData 안에 들어있는 모든 데이터
}
```

`lib/main.dart`
```dart
import 'style.dart' as style;

class MyApp extends StatelessWidget{
	MyApp({Key? key}) : super(key: key);
	@override
	Widget build(BuildContext context){
	
		return MaterialApp(
			theme: style.theme,
			// ~~
		)
	}
}
```
- 다른 파일에 있는 변수, 함수, 클래스를 Import 해올 때는
- `import '경로' as 작명`
- 으로 작성해주면 됩니다.

:::question 변수를 다른 파일에서 사용하지 못하게 하는 방법
- 변수명을 작명할 때 아래에 언더바를 왼쪽에 붙여서 사용하면 됩니다.

:::

```dart
var _age = 20;
var _date = 'john';
```

### ThemeData 버튼 디자인 변경
```dart
ThemeData(
	textButtonTheme: TextButtonThemeData(
		style: TextButton.styleFrom(
			primary: Colors.black,
			backgroundColor: Colors.orange,
		)
	)
)
```
- 위와 같이 쓰면 모든 `TextButton` 위젯 색이 변합니다.
- styleFrom()은 ButtonStyle() 사본을 하나 생성해주는 함수 입니다.

### ThemeData를 중간에 변경하고 싶을 때 
`main.dart`
```dart
import 'package:flutter/material.dart';  
import './style.dart';  
  
void main() {  
  runApp(  
      MaterialApp(  
        theme: theme,  
          home: MyApp()  
      )  );}  
  
class MyApp extends StatelessWidget{  
  const MyApp({Key? key}) : super(key:key);  
  
  @override  
  Widget build(BuildContext context){  
    return Scaffold(  
      appBar: AppBar(  
        title: Text('Instagram'),  
        actions: [  
          IconButton(  
            icon: Icon(Icons.add_box_outlined),  
            onPressed: (){},  
            iconSize: 30,  
          )//IconButton  
        ]  
      ),      
      body: Theme(
	      data: ThemeData(
		      textData:
		    ), // ThemeData
			child: Container() // 위의 ThemeData를 기준으로 아래 Container가 변경 된다.
	    ) //Theme
    ); // Scaffold  
  }  
}
```

### 원하는 ThemeData를 불러오기
`main.dart`
```dart
...

class MyApp extends StatelessWidget{  
  const MyApp({Key? key}) : super(key:key);  
  
  @override  
  Widget build(BuildContext context){  
    return Scaffold(  
      appBar: AppBar(  
        title: Text('Instagram'),  
        actions: [  
          IconButton(  
            icon: Icon(Icons.add_box_outlined),  
            onPressed: (){},  
            iconSize: 30,  
          )//IconButton  
        ]  
      ),      
      body: Text('안녕', style: Theme.of(context).textTheme.bodyText2,)
    ); // Scaffold  
  }  
}
```
- ThemeData()를 찾아서 거기에 있던 `textTheme > bodyText2` 를 가져와 달라는 뜻이다.

`styles.dart`
```dart
...
import 'package:flutter/material.dart';  
  
var theme = ThemeData(  
		textButtonTheme: TextButtonThemeData(  
		style: TextButton.styleFrom(  
			backgroundColor: Colors.grey,  
		)      
	),  
	appBarTheme: AppBarTheme(  
		color: Colors.white,  
		elevation: 1,  
		titleTextStyle: TextStyle(color: Colors.black, fontSize: 25),  
		actionsIconTheme: IconThemeData(color: Colors.black), 
		 
		textTheme: TextTheme(  
		    bodyText2: TextStyle(color: Colors.red),//위에서 불러온 문법
	    ),  
	),
);

```

## bottomNavigationBar
`main.dart`
```dart
class MyApp extends StatelessWidget{  
  const MyApp({Key? key}) : super(key:key);  
  
  @override  
  Widget build(BuildContext context){  
    return Scaffold(  
      appBar: AppBar(  
        title: Text('Instagram'),  
        actions: [  
          IconButton(  
            icon: Icon(Icons.add_box_outlined),  
            onPressed: (){},  
            iconSize: 30,  
          )//IconButton  
        ]  
      ),      body: Text('안녕'),  
      bottomNavigationBar: BottomNavigationBar(  
        showSelectedLabels: false,  
        showUnselectedLabels: false,  
        items: [  
          BottomNavigationBarItem(icon: Icon(Icons.home_outlined), label: '홈'),  
          BottomNavigationBarItem(icon: Icon(Icons.shopping_bag_outlined), label: '샵'),  
        ],  
      ),    ); // Scaffold  
  }  
}
```


# 페이지를 나누는 법
- 페이지를 나누는 방법은 여러가지가 있습니다.
- Navigator, Router, Tab 등등 여러가지가 존재하지만, 지금은 Tab을 이용해서 구현하겠습니다.

## Tab
- 페이지를 나누기 위해서는 현재 state를 저장할 요소가 필요합니다.
- 그렇기 때문에 `stateless`는 허용되지 않고, `statefull` 위젯을 사용해야 합니다.
```dart
class MyApp extends StatefulWidget{
	const MyApp({Key ? key}) : super(key: key);
	
	@override
	State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp>{
	var tab = 0;
}
```

### onTab
`main.dart`
```dart
class _MyAppState extends State<MyApp>{  
  
  var tab = 0;  
  
  @override  
  Widget build(BuildContext context){  
    return Scaffold(  
      appBar: AppBar(  
        title: Text('Instagram'),  
        actions: [  
          IconButton(  
            icon: Icon(Icons.add_box_outlined),  
            onPressed: (){},  
            iconSize: 30,  
          )//IconButton  
        ]  
      ),      
      body: [Text('홈페이지'), Text('샵페이지')][tab],  
      bottomNavigationBar: BottomNavigationBar(  
        showSelectedLabels: false,  
        showUnselectedLabels: false,  
        onTap: (i){  
          print(i); // 아래의 items의 index를 출력해준다.
				    // onPress랑 비슷한 역할을 한다.
        },        
        items: [  
          BottomNavigationBarItem(icon: Icon(Icons.home_outlined), label: '홈'),  
          BottomNavigationBarItem(icon: Icon(Icons.shopping_bag_outlined), label: '샵'),  
        ],  
      ),    
    ); // Scaffold  
  }  
}
```
- 해당 부분을 활용해서 tab 버튼을 누르고, tab을 인위적으로 바꾸려면 아래의 코드 처럼 사용하면 된다.
```dart
...
bottomNavigationBar: BottomNavigationBar(  
        showSelectedLabels: false,  
        showUnselectedLabels: false,  
        onTap: (i){  
	        setState((){
		        tab = i;
	        }) 
        },        
        items: [  
          BottomNavigationBarItem(icon: Icon(Icons.home_outlined), label: '홈'),  
          BottomNavigationBarItem(icon: Icon(Icons.shopping_bag_outlined), label: '샵'),  
        ],  
      ),

...
```
#### 게시물 레이아웃 만들어오기
`main.dart`
```dart
...

	body: [Home(), Text('샵페이지')][tab],

...
class Home extends StatelessWidget{  
  const Home({Key ? key}) : super(key: key);  
  @override  
  Widget build(BuildContext context){  
  
    return ListView.builder(itemCount: 3,itemBuilder: (c,i){  
      return Column(  
        children: [  
          Image.network('https://codingapple1.github.io/app/car0.png'),  
          Container(  
            constraints: BoxConstraints(maxWidth: 600),  
            padding: EdgeInsets.all(20),  
            width: double.infinity,  
            child: Column(  
              crossAxisAlignment: CrossAxisAlignment.start,  
              children: [  
                Text('좋아요 100'),  
                Text('글쓴이'),  
                Text('글내용'),  
              ],            
            ),          
		  )
		],  
	  );    
	});  
  }  
}
```
- 이런 식으로 작성하게 된다면 아래와 같은 레이아웃이 만들어진다.
![Screenshot 2023-09-30 at 3.04.10 PM.png](Screenshot 2023-09-30 at 3.04.10 PM.png)
- 하지만, 해당 부분을 Andriod 애뮬레이터에 적용하고 싶다면 약간의 설정이 필요하다.
- `andriod/app/src/main/AndriodManifest.xml`파일에서
```xml
<user-permission android:name="andriod.permission.INTERNET" />
```
- 그 후에, `pubspec.yaml` 파일에서 dependency를 설치 해야 합니다.
```yaml
...
dependencies:
	flutter:
		sdk: flutter	
	http: ^0.12.0+2

```
- 그 후에 `main.dart`에서 아래와 같이 `import`를 하면 됩니다.
```dart
import 'package:http/http.dart' as http;
import 'dart:convert';
```
- 만약 맨 처음 어플리케이션을 로드 했을 때, GET 데이터를 받고 싶다면, 아래와 같이 코드를 작성하면 됩니다.
`main.dart`
```dart
...
var tab = 0;

@override
void initState(){
	super.initState();
	// MyApp이 로드 됐을 때 처음으로 실행되는 로직을 여기에 넣으면 된다.
	var result = http.get(Uri.parse('https://codingapple1.github.io/app/data.json'));  
	print(result.body);
}
```
- 위와 같은 식으로 작성이 가능하다.
- 해당 코드는 비동기식이기에, 동기식으로 바꾸기 위해서는 `async`를 써야한다.
- 하지만, `initState()`는 `async` - `await` 이 사용되지 않기 때문에, 함수를 따로 빼서 작성해줘야한다.

```dart
...
var tab = 0;  
  
getData() async{  
  var result = await http.get(Uri.parse('https://codingapple1.github.io/app/data.json'));  
  print(result.body);  
}  
  
@override  
void initState(){  
  super.initState();  
  getData();  
}

...
```
![Screenshot 2023-09-30 at 3.20.13 PM.png](Screenshot 2023-09-30 at 3.20.13 PM.png)
- 위와 같이 Console에 뜨는 것을 확인 할 수 있다.
- 그리고 해당 Json 파일을 Flutter에서는 Map이라는 형태로 받아서 사용하기에, 해당 Json 데이터를 한번 Decode할 필요가 있습니다.

```dart
...

var data = []
getData() async{  
  var result = await http.get(Uri.parse('https://codingapple1.github.io/app/data.json'));  
  var result2 = jsonDecode(result.body);  
  setState((){  
    data = result2;  
  });
}

...
```

![300](Screenshot 2023-09-30 at 3.35.25 PM.png)
- 해당 행위를 하기 위해서는 아래와 같이 코드를 작성해야합니다.
`main.dart`
```dart
class _MyAppState extends State<MyApp>{  
  
  var tab = 0;  
  var data = [];  
  
  getData() async{  
    var result = await http.get(Uri.parse('https://codingapple1.github.io/app/data.json'));  
    var result2 = jsonDecode(result.body);  
    setState((){  
      data = result2;
	});  
}

...
	body: [Home(data: data), Text('샵페이지')][tab],
...

class Home extends StatelessWidget{  
  const Home({Key ? key, this.data}) : super(key: key);  
  final data;
  
...

}
```


### FutureBuild
- 서버에서 데이터를 받아오는 행위 자체가 오래 걸리기 때문에, 그 때문에 사용하는 문법이다.
```dart
...
	body: [FutureBuilder(future: data, builder: (){}), Text('샵페이지')][tab]
...
```
- 위의 key 값이 `future` 라는 의미는 해당 data가 오래 걸리는 data라는 뜻이다.
- 즉, `future`안의 값이 렌더링이 완료된다면, 해당 `builder` 안의 위젯을 보여주게 됩니다.


---

 #Flutter 

---