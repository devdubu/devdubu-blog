---
시작 날짜: 2024-07-24
종료 날짜: 2024-07-24
sticker: emoji//1f4c6

slug: "Data-Picker-검토"
---
# 조건
- 조건    
    - 날짜 직접 입력 or calendar 통해 선택 option 선택 가능
    - 날짜 직접 입력 시 calender 년월이 자동으로 변경되는가
    - 날짜 선택 시 return 해주는 데이터 타입을 지정할 수 있는가? (체크만)
        - 예) String(2024-01-02) or Date
    - 최초 value 세팅 시 string과 date 타입 모두 값을 지정할 수 있는가?
    - date range 선택이 가능한가?
    - 년 또는 년월 calendar 사용이 가능한가?
    - (필요한 부분 추가)

# 검토 내용
##  Toast UI
| 조건 | 기능 |
| ---- | ---- |
| 날짜 입력 기능 | 선택 / text 입력 |
| format | `String(2024-01-02)` / 최초 Value 셋팅 동일 |
| data range | ![Pasted-image-20240123161247-1.png](/img/이미지 창고/Pasted-image-20240123161247-1.png) |
| 년 월 사용 가능 여부 | ![Pasted-image-20240123161319-1.png](/img/이미지 창고/Pasted-image-20240123161319-1.png) |
| 그 외 기타 기술 | 아래 처럼 Range를 할당하면 이후 날짜 값은 비활성화 됩니다.<br />![Pasted-image-20240123161411-1.png](/img/이미지 창고/Pasted-image-20240123161411-1.png) |

## Vue BootStrap
| 조건 | 내용 |
| ---- | ---- |
| 날짜 입력 기능 | select / text 가능 |
| 형식 | `String(2024-01-02)` / 기본적으로 String의 형식이며, 보여지는 Format은 조절 가능<br />![Pasted-image-20240123165255-1.png](/img/이미지 창고/Pasted-image-20240123165255-1.png) |
| Date Range | 없음 |
| 년 / 월 사용 여부 | 없음 |
| 그 외 기타 기술 | 캘린더 비활성화 / Date 비활성화 |
## Tailwind DatePicker
| 조건 | 내용 |
| ---- | ---- |
| 날짜 입력 기능 | select / text |
| 형식 | date 속성 및 string 모두 가능 |
| Date Range | 가능<br />![Pasted-image-20240124133537-1.png](/img/이미지 창고/Pasted-image-20240124133537-1.png) |
| 년 / 월 사용 여부 | 가능<br />![Pasted-image-20240124133559-1.png](/img/이미지 창고/Pasted-image-20240124133559-1.png) |
| 그 외 기타 기술 | [이벤트 기능](https://vue-tailwind-datepicker.com/events.html)<br />[다양한 스타일](https://vue-tailwind-datepicker.com/props.html) |
| 단점 | 한글 화 부족 |

## Vue Datepicker
[사이트 주소](https://vue3datepicker.com/)

| 조건 | 내용 |
| ---- | ---- |
| 날짜 입력 기능 | select / text |
| 형식 | `String(2024-01-02)` |
| Date Range | 가능<br />![Pasted-image-20240124152156-1.png](/img/이미지 창고/Pasted-image-20240124152156-1.png) |
| 년 / 월 사용 여부 | 가능 |
| 그 외 기타 기술 | auto range<br />![Pasted-image-20240124152538-1.png](/img/이미지 창고/Pasted-image-20240124152538-1.png)<br /><br />multi Calendar<br />![Pasted-image-20240124152510-1.png](/img/이미지 창고/Pasted-image-20240124152510-1.png)<br />Week Picker<br />![Pasted-image-20240124152624-1.png](/img/이미지 창고/Pasted-image-20240124152624-1.png)<br /><br />Quter Picker<br />![Pasted-image-20240124152651-1.png](/img/이미지 창고/Pasted-image-20240124152651-1.png)<br /><br />Multi Date<br />![Pasted-image-20240124152928-1.png](/img/이미지 창고/Pasted-image-20240124152928-1.png)<br /><br /> |
| 비고 | 기능이 너무 많아서 공식 문서를 직접 보는게 낫습니다 |



## [Element DatePicker](https://element-plus.org/en-US/component/date-picker.html)
### 특징
- 한글화 가능
- Muilt Calendar 기능 

## [QDate](https://quasar.dev/vue-components/date/)
### 특징
- 이벤트 하이라이트 기능
- ![Pasted-image-20240124165717-1.png](/img/이미지 창고/Pasted-image-20240124165717-1.png)
- 


