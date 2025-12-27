---
sticker: vault//이미지/개발 로고/TechIconSVG/GraphQL.svg

slug: "GraphQL-서버-실습"
---
# Express 서버

```shell
npm i express express-graphql graphql --save
```

:::tip graphql 과 express-graphql의 차이
- `graphql`
- GraphQL.js는 Type Schema를 구축하고 해당 Type Schema에 대해 쿼리를 제공하는 두 가지 중요한 기능을 제공합니다.
- `express-graphql`
- 연결 스타일 미들웨어를 지원하는 모든 HTTP 웹 프레임워크로 GraphQL 

:::

![스크린샷-2025-07-15-오전-8.44.47.png](/img/이미지 창고/스크린샷-2025-07-15-오전-8.44.47.png)

## GraphiQL

:::tip GraphiQL?
- 앞서 기초에 문서에서 접속했던 [StarWars GraphQL](https://graphql.org/swapi-graphql/)UI를 로컬에서 개발을 할 때도 GraphiQL를 사용할 수 있습니다. 
- 또한 이 것은 다른 것 설치하지 않아도 이미 express-graphql 패키지 안에 들어 있기 때문에 
- 하나의 설정만 해주면 사용할 수 있습니다.

:::

해당 옵션은 아래와 같이 추가 하면 됩니다.

`server.js`
```js
...
app.use('/graphql', graphqlHTTP({
	schema: schema,
	rootValue: root,
	// 아래 옵션을 true로 넣고, 해당 localhost 로 접속하면 됩니다. 
	graphiql: true
}))
...
```
그렇다면 `http://localhost:4000/graphql` 해당 경로에 접근하게 된다면 아래와 같이 창이 뜨게 됩니다.
![스크린샷-2025-07-16-오전-10.21.25.png](/img/이미지 창고/스크린샷-2025-07-16-오전-10.21.25.png)
## Schema 작성


예시 Schema 작성
`server.js`

```js
const schema = buildSchema(`
	type Query{
		posts:[Post],
		commnets: [Comment]
	} 

	type Post{
		id: ID!
		title: String!
		description: String!
		comments: [Comment]
	}

	type Comment{
		id: ID!
		text: String!
		likes: Int
	}
`)
```

해당 되는 데이터의 예시
```js
const root = {
	posts:[
		{
			id: 'post1',
			title: 'It is a first post',
			description: 'It is a first post description',
			comments:[
				{
				id: 'commnet1',
				text: 'It is a first commnet',
				likes: 1
				}
			]
		},
		{
			id: 'post2',
			title: 'It is a second post',
			description: 'It is a second post description',
			comments: []
		}
	],
	comments:[
		{
		id: 'comment1',
		text: 'It is a first commnet',
		likes: 1
		}
	]
}
```

그리고 해당되는 결과물은 아래와 같습니다.

![스크린샷-2025-07-16-오전-10.29.36.png](/img/이미지 창고/스크린샷-2025-07-16-오전-10.29.36.png)
## GraphQL Tools

:::note GraphQL Tools?
- graphql 파일들을 분리해놓으면, 다시 하나로 모아 합쳐주는 도구입니다.

:::

### 설치 방법
```shell
npm i @graphql-tools/schema
```

```js
const schemaString = `
	type Query{
		posts:[Post],
		commnets: [Comment]
	}

	type Post{
		id: ID!
		title: String!
		description: String!
		comments: [Comment]
	}
	type Comment{
		id: ID!
		text: String!
		likes: Int
	}
`

const schema = makeExecutableSchema({
	typeDefs: [schemaString]
})
```

기존에는 `buildSchema` 함수 안에 때려 넣는 방식에서, `makeExecutableSchema` 함수를 통해서 1차적으로 분리 할 수 있게 구성할 수 있습니다.

### graphql-tools/load-files

사실 위 처럼 분리하는건 아무 의미가 없다는 걸 다들 알것이다.
그렇기에, 우리는 파일 단위로 분리하는 것이 만약 모듈화로 구성했을 때 가장 이상적인 형식이라고 알것이다.
그럴 때는 아래의 모듈을 설치하면 된다.

```shell
npm i @graphql-tools/load-files
```

해당 모듈로 설치 한 후에, 위 코드를 아래와 같이 분리하면 됩니다.

`comments/comments.graphql`
```graphql
type Query{
	commnets: [Comment]
}

type Comment{
	id: ID!
	text: String!
	likes: Int
}
```

`posts/posts.graphql`
```graphql
type Query{
	posts:[Post],
}

type Post{
	id: ID!
	title: String!
	description: String!
	comments: [Comment]
}
```

위 처럼 해당 Query를 분리한 후에, `server.js` 내에 아래의 코드와 같이 안으로 모으면 됩니다

```js
...
/*
	loadFileSync 를 , 현재 폴더(__dirname)에 있는, 모든 폴더(**) 
	즉, ~/.graphql 로 끝나는 모든 파일을 불러오는 함수 입니다.
*/
const loadedTypes = loadFilesSync("**/*",{
	extensions:['graphql']
})

const schema = makeExecutableSchema({
	typeDefs: loadedTypes
})
...
```

번외로 model 도 모듈화를 진행하면, 아래와 같이 진행하면 된다.
![스크린샷-2025-07-16-오전-10.56.57.png](/img/이미지 창고/스크린샷-2025-07-16-오전-10.56.57.png)

`posts/posts.model.js`
```js
module.exports = [
	{
		id: 'post1',
		title: 'It is a first post',
		description: 'It is a first post description',
		comments:[
			{
			id: 'commnet1',
			text: 'It is a first commnet',
			likes: 1
			}
		]
	},
	{
		id: 'post2',
		title: 'It is a second post',
		description: 'It is a second post description',
		comments: []
	}
]
```

`comments/comments.model.js`
```js
module.exports = [
	{
		id: 'comment1',
		text: 'It is a first commnet',
		likes: 1
	}
]
```