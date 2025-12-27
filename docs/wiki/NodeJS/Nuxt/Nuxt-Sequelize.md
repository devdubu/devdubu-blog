---
slug: "Nuxt-Sequelize"
---
# Installing
```shell
npm install --save sequelize
```

데이터 베이스에 마다 driver를 아래와 같이 설치해주면 된다.
```sql
npm install --save pg pg-hstore #PostgreSQL
npm install --save mysql2
npm install --save mariadb
npm install --save sqlite3
npm install --save tedious # MicroSoft SQL Server
npm install --save oracledb # Oracle DB
```

## Nuxt 파일 생성

```ts
import { Sequelize } from 'sequelize'

export default defineNitroPlugin( async (nitro)=>{
	try{
		await sequelize.authenticate()
	}catch(error){
		console.log(error)
	}
})
```
`server/plugins/db.ts`

```ts
import { Sequelize } from 'sequelize'

export const useSequelize = async () =>{
	const config = useRuntimeConfig()
}

export const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: './mydb.sqlite'
	
})
```
`server/utils/db.instance.ts`


```ts
...
	runtimeConfig:{
		DB_NAME: process.env.DB_NAME,
	}
...
```
`nuxt.config.ts`


```.env
DB_NAME=""
```
`.env`

```ts
export class UserModel extends Model{}

UserModel.init(
	{
		firstName: {
			type: DataTypes.STRING(50),
			allowNull: false,
			validate: {
				len: [1,50]
			},
		},
		lastName:{
			type: DataTypes.STRING(50),
			allowNull: false,
			validate:{
				len: [1,50]
			}
		},
		email:{
			type: DataTypes.STRING(50),
			allowNull: false,
			validate:{
				isEmail: true
			}
		}
	},
	{ sequelize, tableName: "users" }
)
```
`server/models/User.model.ts`

---

#NodeJS #Nuxt #JavaScript #Nuxt3 #FrontEnd 

---