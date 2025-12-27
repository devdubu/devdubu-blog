---
시작 날짜: 2024-07-09
종료 날짜: 2024-07-09

slug: "Platform-Concept"
---
# Platform Concept
- 우선 플랫폼이라는 개념 자체는, 결국 json 데이터를 기반으로 화면을 뽑을 수 있어야한다.
- 즉, 아래의 json 데이터를 기반으로 화면을 출력해야한다.
- 화면을 모두 데이터화 해야한다?
	- DB?
- 모든 것들의 예약어를 해야할듯


```json
{
    "_comment": "검색필드 + GRID 형태의 기본 검색 화면입니다.",
    "mixins": [ "template-default" ],
    "type": "(필수)searchgrid",
    "title": "화면-검색/목록",
    "pcd": "(필수)Z10101"
    "toolbar": {
        "items": [
            {
                "type": "button",
                "text": "추가",
                "auth": "auth-add",
                "events": {
                    "click": "onClickBtnAdd"
                }
            }
        ]
    },
    "contents": {
        "search": {
            "_comment": "검색조건 영역",
            "isExpandable": true,
            "expanded": false,
            "handler": "onClickBtnSearch",
            "items": [
                {
                    "type": "textbox",
                    "label": "검색조건1",
                    "value": "기본값1",
                    "placeholder": "입력해 주세요",
                    "binding": "SEARCH_TEXT1",
                    "require": true
                }
            ]
        },
        "grid": {
            "_comment": "검색결과 GRID 영역",
            "gridName": "(필수)testGrid",
            "title": "검색결과",
            "editor": "row / cell",
            "number": false,
            "selectCheckbox": false,
            "api": {
                "search": {},
                "add": {},
                "edit": {},
                "delete": {}
            },
            "columns": [
                {
                    "field": "(필수)COLUMN1",
                    "name": "(필수)컬럼명",
                    "width": 300,
                    "minWidth": 100,
                    "flex": 1
                }
            ]
        }
    }
}
```

- dynamic 한 것들을 더 정의 해야 한다?
- 너무 static 하다는 것인데..
	- 개발자 커스텀인가?
	- 서버에서 날라오는 데이터, 브라우저 데이터?
	- 모바일? PC?


- api에서 query를 떡칠해서 보낸다 -> 결국 graphql이 해당 방식을 사용하기에, 차라리 graphql을 사용하는게 낫다

- platform - 우선 vue2 -> 이후 마이그레이션 - realgrid
- vue3 작업 -> nuxt -> realgrid
- 재구축~




