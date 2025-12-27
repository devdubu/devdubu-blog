---
slug: "TypeScript-Type-Alias"
---

# Aliasing Primitive
```ts
// ---
type MyStringType = string;
const str = 'world';
let myStr: MyStringType = 'hello';

myStr = str;
// 별 의미가 없다.
```

# Aliasing Union Type
```ts
let person: string | number = 0;
person = 'Mark';

type StringOrNumber = string | number;

let another: StringOrNumber = 0;
another = 'Anna';
/*
1. 유니온 타입은 A도 가능하고 B도 가능한 타입
2. 길게 쓰는걸 짧게
*/

```

# Aliasing Tuple
```ts
let person: [string, number] = ['Mark', 35];
type PersonTuple = [string, number];
let another: PersonTuple = ['Anna', 24];

/*
1. 튜플 타입에 별칭을 줘서 여러군데서 사용할 수 있다.
*/
```

# Aliasing Function
```ts
type EatType = (food: string) => void;
```

---

#NodeJS #TypeScript 

---