# YAML?
- YAML은 우리가 흔히 쓰였던 `XML`, `JSON` 다음으로 데이터를 구성할 때 표현하는 형식 중에 한 개이다.
- 아래에는 3가지의 예시 파일들이 있다.

`XML`
```xml
<Servers>
	<Server>
		<name>Server1</name>
		<owner>John</owner>
		<created>12232012</created>
		<status>active</status>
	</Server>
</Servers>
```

`JSON`
```json
{
	Servers:[
		{
			name: Server1,
			owner: John,
			created: 12232012,
			status: active
		}
	]
}
```

`YAML`
```yaml
Servers:
	- name: Server1
	- owner: John
	- created: 12232012
	- status: active
```

## YAML
해당 Format을 간단히 정리하면 key-value값으로 정의 할 수 있으며 아래와 같이 key value를 표현합니다.
### Key Value Pair
```yaml
Fruit: Apple
Vegetable: Carror
Liquid: Water
Meat: Chicken
```
key와 value를 구분하기 위해서는 `:`를 붙인 뒤에 반드시 공백을 표현해야 한다.

### Array
```yaml
Fruits:
- Orange
- Apple
- Banana

Vegetable:
- Carrot
- Cauliflower
- Tomato
```

### Dictionary / Map

```yaml
Banana:
	Calories: 105
	Fat: 0.4g
	Carbs: 27g

Grapes:
	Calories: 62
	Fat: 0.3g
	Carbs: 16g
```

:::error YAML 파일은 빈칸이 핵심이다.

:::

```yaml
Banana:
	Calories: 105
	 Fat: 0.4g
	 Carbs: 27g
```
위 처럼 만약 공백이 한칸 이라도 되어 있다면, `Calories` 집합에 `Fat`, `Carbs` 라는 집합이 들어와 있어야 하지만, 105 라는 값이 이미 존재하기 때문에 이는 에러를 뱉습니다.

### key Value / Dictionary / List
```yaml
Fruits:
	- Banana:
		Calories: 105
		Fat: 0.4g
		Carbs: 27g
	- Grape:
		Calories: 62
		Fat: 0.3g
		Carbs: 16g
```

---

#Container #Kubernetes 
