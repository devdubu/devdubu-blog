# SCSS 문법

## 초기 셋팅
```bash
npm init -y
npm i -D parcel-bundler
```

```json
...
"script":{
	"dev" : "parcel index.html",
	"build" : "parcel build index.html"
}
...
```
`package.json`

## 중첩(Nesting)
```scss
$color: royalblue;
.container{
	h1{
		color: $color;
	}
};
```
-  해당 중첩은 예전 CSS를 사용할 때, `.container h1`, `.container > h1` 등과 같은 역할을 하며, CSS 코드가 길어지는 것을 방지하는 역할을 한다.
- `$color` 를 하게 된다면, 변수로써 사용이 가능하다.

```html
<body>
	<div class="container">
		<ul>
			<li class="name">HEROPY</li>
			<li class="age">85</li>
		</ul>
	</div>
</body>
```
`index.html`

```scss
$color : royalblue;
.container{
	ul{
		li{
			font-size: 40px;
			.name{
				color: royalblue;
			}
			.age{
				color:orange;
			}
		}
	}
};
```
- 위 처럼 중첩을 적용하여, 해당 부분을 적용하면 된다.
- 자식 선택자 `>` 를 사용하게 된다면, 아래와 같이 사용하면 전체가 자식 선택자로 적용된다.
```scss
```scss
$color : royalblue;
.container\{
	> ul\{
		li\{
			font-size: 40px;
			.name\{
				color: royalblue;
			}
			.age\{
				color:orange;
			}
		}
	}
};
```
`main.scss`

## 주석
```scss
$color: royalblue;
.container\{
	h1\{
		color: $color;
		/* background-color: orange; */
		// font-size: 60px;
	}
};
```
- 주석은 JS에서 제공하는 주석은 모두 사용이 가능하다
	- `//` 해당 기호는 SCSS에서는 주석으로 작용하지만, CSS로 컴파일 시에는 해당 주석 부분은 <mark>컴파일 되지 않는다</mark>.

## 상위 선택자
```scss
.btn \{
	position: absolute;
	&.active\{
		color: red;
	}
}

.list\{
	li\{
		&:last-child\{
			margin-right: 0;
		}
	}
}

.fs\{
	&-small\{ font-size: 12px; }
	&-medium\{ font-size: 14px; }
	&-large\{ font-size: 16px; }
}


```

```css
.btn\{
	position: absolute;
}
.btn.active\{
	color: red;
}
.list li:last-child\{
	margin-right:0;
}

.fs-small\{
	font-size: 12px;
}
.fs-medium\{
	font-size: 14px;
}
.fs-large\{
	font-size: 16px;
}
```
- 상위 선택자 참조를 통해서, 자식은 상위 선택자를 참조하며, 상위 선택자의 옵션을 따라한다. -> 상속의 개념에 가깝다

## 중첩된 속성
```scss
.box\{
	font:\{
		weight: bold;
		size: 10px;
		family: sans-serif;
	};
	margin:\{
		top: 10px;
		left: 20px;
	};
	padding:\{
		top: 10px;
		bottom: 40px;
		left: 20px;
		right: 30px;
	};
}
```

```css
.box\{
	font-weight: bold;
	font-size: 10px;
	font-family: sans-serif;
	margin-top: 10px;
	margin-left: 20px;
	padding-top: 10px;
	padding-bottom: 40px;
	padding-left: 20px;
	padding-right: 30px;
}
```
- 위의 결과가 아래의 CSS 결과로 출력된다.
- 이 처럼 <mark>네임스페이스</mark> 가 같은 것들은 중첩을 통해서 표현 할 수 있으며 해당 네임스페이의 경우에는 무조건 `:`를 붙여야한다.

:::note 네임스페이스란?
- 이름을 통해 구분 가능한 범위를 만들어내는 것으로 일종의 유효범위를 지정하는 방법
- 현재의 상황에서는 속성이 가지고 있는 앞 부분의 영역이 동일한 것을 의미

:::

## 변수
```scss
$size: 100px; // 변수를 생성

.container \{
	position: fixed;
	top: $size;
	.item\{
		width: $size;
		height: $size;
		transform: translateX($size);
	}
}
```
- 변수는 범위가 정해져있다.
	- 즉, 위치에 따라 지역변수가 될 수도, 혹은 전역 변수가 될 수도 있으며, 해당 중괄호를 기준으로 쓰임이 달라진다.
- 만약 해당 상위 변수와 하위 변수가 이름이 같다면?
```scss
.container\{
	$size: 200px;
	positionL: fixed;
	top: $size;
	.item\{
		$size: 100px;
		width: $size;
		height: $size;
		transform: translateX($size);
	}
}
```

```css
.container\{
	position: fixed;
	top: 200px;
}

.container  .item\{
	width: 100px;
	height: 100px;
	transform: translateX(100px);
}
```

## 산술 연산
```scss
div\{
	width: 20px + 20px;
	height: 40px - 10px;
	font-size: 10px * 2;
	margin: 30px / 2;
	padding: 20px % 7;
}

// 나누기 연산자가 적용이 되지 않는 이유
span\{
	font-size: 10px;
	line-height: 10px;
	font-family: serif;
	// font는 단축 속성 사용이 가능하다.
	// 하지만, 해당 기능을 사용하기 위해서는 반드시 font-family의 값도 필요하다
	// 아래와 위는 같다 왼쪽은 size, 오른쪽은 line-hegint이다.
	font: 10px / 10px serif;
}

// 나누기 연산자가 작동하려면 아래와 같이 변수를 같이 사용하면 작동한다.
...
margin: $size / 2;
...

```

```css
div\{
	width: 40px;
	height: 30px;
	font-size: 20px;
	margin: 30px/2; // 나누기 부분은 제대로 출력 되지 못했다.
	padding: 6px;
}
```

### 다른 단위의 산술 연산
```scss
.box\{
	background: royalblue;
	width: calc(100% - 200px);
	height: 100px;
}
```
- 해당 `calc` 함수는 단위가 다른 것에 대한 산술을 진행할 때 사용한다.
- 기존 CSS에서도 있는 문법이기에, SCSS에서 CSS로 컴파일 될 때 그대로 컴파일 된다.

## 재활용 mixin
```scss
@mixin center\{
	// 가운데 정렬을 하기 위해서 필요한 요소
	display: flex;
	justify-content: center;
	align-items: center;
}
.container\{
	@include center;
	.item\{
		@include center;
	}
}
.box\{
	@include center;
}
```
- 위 처럼 사용하게 되면 특정 카테고리에서 특정하게 사용하지 못한다.
- 그렇기 때문에, 인수(매개변수)를 통해서 아래와 같이 사용하게 된다면, 커스텀이 가능해진다.
```scss
@mixin center($size)\{
	width: $size;
	height: $size;
	background-color: tomato;
}

.container\{
	@include center(200px);
	.item\{
		@include center(100px);
	}
}
.box\{
	@include center(100px);
}

@mixin box($size: 80px, $color: tomato)\{
	width: $size;
	height: $size;
	background-color: $color;
}
.container\{
	@include box(200px, red);
	.item\{
		@include box($color: green); // 키워드 인수를 사용하게 된다면, 순서 상관 없이 인수 입력이 가능하다.
	}
}
.box\{
	@include box;
}
```

## 반복문
```scss
@for $i from 1 throgh 10\{
	.box\{
		width: 100px;
	}
}

@for $i from 1 through 10\{
	.box:nth-child(#\{$i})\{
		width: 100px * $i
	}
}


```
- 해당 반목문은 10번의 반복을 해준다.


## 함수
```scss
@mixin center\{
	display: flex;
	justify-content: center;
	align-items: center;
}

@function ratio($size, $ratio)\{
	@return $size * $ratio
}
.box\{
	$width: 100px;
	width: $width;
	height: ratio($width, 1/2);
	@include center;
}
```

```css
.box\{
	width: 100px;
	height: 50px;
	display: flex;
	justify-content: center;
	align-item: center
}
```

## 색상 내장함수
```scss
.box\{
	$color: royalblud;
	width: 200px;
	height: 100px;
	margin 20px;
	boarder-radius: 10px;
	background-color: $color;
	&:hover\{
		background-color: darken($color, 10%) // 10% 어둡게 만들어주는 메서드
	}
	&.build-in\{
		background-color: mix($color, red); // 첫 색상과, 두번째 색상을 섞어주는 메서드
		background-color: lighten($color, 10%); // 10% 밝게 만들어주는 메서드
		background-color: saturate($color, 10%); // 채도를 10% 올려주는 메서드
		background-color: desaturate($color, 10%); // 채도를 10% 감소해주는 메서드
		background-color: grayscale($color); // 해당 색상에서 회색으로 변경시켜 주는 메서드
		background-color: invert($color); // 해당 색상을 반전 시켜주는 메서드
		background-color: rgba($color, 0.5); // 해당 색상의 투명도를 조절해주는 메서드
	}
}
```

## 가져오기

```scss
@import "./sub.scss", "./sub2.scss"

$color: royalblue;

.container\{
	h1\{
		color: $color;
	}
}
```
`main.scss`
```scss
.container\{
	h1\{
		background-color: gold;
	}
}

```
`sub.scss`

## 데이터 종류
```scss
$number: 1;     // .5, 100px, 1em
$string: bold;  // relative, "./images/a.png"
$color: red;    // blue, #FFFF00, rgba(0,0,0,.1)
$boolean: true; // false
$null: null;
$list: orange, royalblue, yellow;
$map: \{
	o: orange,
	r: royalblue,
	y: yellow
};
.box\{
	width: 100px; // 숫자 데이터
	color: red; // 색상 데이터
	position: relative; // 문자 데이터
}
```

## 반복문 @each
```scss
$number: 1;     // .5, 100px, 1em
$string: bold;  // relative, "./images/a.png"
$color: red;    // blue, #FFFF00, rgba(0,0,0,.1)
$boolean: true; // false
$null: null;
$list: orange, royalblue, yellow;
$map: \{
	o: orange,
	r: royalblue,
	y: yellow
};
@each $c in $list\{
	.box\{
		color: $c;
	}
}

@each $key, $value in $list\{
	.box-#\{$key}\{
		color: $value
	}
}
```

```css
/* list의 each문*/
.box\{
	color: orange;
}
.box\{
	color: royalblue;
}
.box\{
	color: yellow;
}

/*  map의 each문 */
.box-o\{
	color: orange;
}
.box-r\{
	color: royalblue;
}
.box-y\{
	color: yellow;
}
```


## 재활용 @content
```scss
@mixin left-top\{
	position: absolute;
	top: 0;
	left: 0;
	@content;
}

.container\{
	width: 100px;
	height: 100px;
	@include left-top;
}
.box\{
	width: 200px;
	height: 300px;
	@include left-top\{
		bottom: 0;
		right: 0;
		margin: auto;
	}
}
```
- mixin되는 부분에서 `{ }` 를 통해서 새로운 값을 넣었다.
- 이때 `@content`는 새로운 값을 해당 위치에 삽입하는 역할을 수행한다.

---

#CSS #FrontEnd #SCSS

---