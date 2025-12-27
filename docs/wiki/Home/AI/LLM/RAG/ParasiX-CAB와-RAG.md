---
sticker: vault//이미지/개발 로고/TechIconSVG/Nest.js.svg

slug: "ParasiX-CAB와-RAG"
---
## rag.module.ts
```ts
// src/rag/rag.module.ts 
import { Module } from '@nestjs/common'; 
import { RagController } from './rag.controller'; 
import { RagService } from './rag.service'; 
import { AuthModule } from '../auth/auth.module'; 
import { PrismaModule } from '../prisma/prisma.module'; // Prisma 모듈 (아래 설명)

@Module(
	{ 
		imports: [AuthModule, PrismaModule], 
		controllers: [RagController], 
		providers: [RagService], 
	}) 
	
export class RagModule {}
```

## rag.service.ts
```ts
// src/rag/rag.service.ts 
import { Injectable } from '@nestjs/common'; 
import { Ollama } from '@langchain/ollama'; 
import { PrismaService } from '../prisma/prisma.service'; // Prisma 서비스 
import { createSqlQueryChain } from 'langchain/chains/sql_db'; 
import { PromptTemplate } from 'langchain/prompts'; 
import { StringOutputParser } from 'langchain/schema/output_parser'; 
import { RunnablePassthrough, RunnableSequence } from 'langchain/schema/runnable'; 
import { Prisma } from '@prisma/client'; // Prisma 클라이언트 타입

@Injectable() export class RagService { 
	private llm = new Ollama(
		{ 
			model: 'gemma:2b', 
			baseUrl: '[http://localhost:11434](http://localhost:11434)', 
			temperature: 0.1 
			}
		);

	constructor(private readonly prisma: PrismaService) {}

	async buildSqlRAG(query: string, allowedTables: string[]): 
	Promise<any> { 
	if (!allowedTables.length) throw new Error('No allowed tables');

	// 테이블 정보 수동 로드 (Prisma describe or schema reflection) 
	const tableInfo = await this.getTableInfo(allowedTables);

	// 자연어 → SQL 쿼리 생성 체인 (LangChain + Gemma) 
	const sqlQueryChain = await createSqlQueryChain(
		{ 
			llm: this.llm, 
			dialect: 'mysql', // MySQL dialect // 커스텀 프롬프트: 테이블 정보 포함 
			prompt: PromptTemplate.fromTemplate( `Based on the table schema below, write a SQL query that would answer the user's question: {schema}Question: {question} SQL Query:`, ), });
	const generatedQuery = await sqlQueryChain.invoke({ question: query, schema: tableInfo });
	// Prisma로 쿼리 실행 (raw SQL) 
	let result; 
	try { result = await this.prisma.$queryRawUnsafe(generatedQuery); // raw SQL 실행 } catch (error) { throw new Error(Query execution failed: ${error.message}); }

// RAG: SQL 결과 → Gemma 생성 const responseChain = RunnableSequence.from([ new RunnablePassthrough(), PromptTemplate.fromTemplate( `Answer the question based only on the following context: {context}

Question: {question}`, ), this.llm, new StringOutputParser(), ]);

const response = await responseChain.invoke({ question: query, context: JSON.stringify(result), });

return response; }

private async getTableInfo(tables: string[]): Promise<string> { // Prisma로 테이블 스키마 정보 가져오기 (예: DESCRIBE table) let schema = ''; for (const table of tables) { const columns = await this.prisma.$queryRawUnsafe&#x3C;Prisma.JsonArray>(<code>DESCRIBE ${table}</code>); schema += <code>Table ${table}: ${JSON.stringify(columns)}\n</code>; } return schema; } }</string>
```

## rag.controller.ts
```ts
// src/rag/rag.controller.ts 
import { Controller, Post, Body, Headers, UnauthorizedException } from '@nestjs/common'; 
import { RagService } from './rag.service'; 
import { AuthService } from '../auth/auth.service';

@Controller('rag') export class RagController { 
	constructor( 
		private readonly ragService: RagService, 
		private readonly authService: AuthService, 
	) {}

	@Post('query') 
	async query( @Body() body: { query: string; auth: { orgCd: string; projCd: string; menuCd: string; pageCd: string; action: string } }, 
	@Headers('authorization') authHeader: string, ) { 
	const token = authHeader?.split(' ')[1]; 
	if (!token) throw new UnauthorizedException('No token provided');

	const allowedTables = await this.authService.checkAccess(body.auth, token); 
	const response = await this.ragService.buildSqlRAG(body.query, allowedTables); 
	return { answer: response }; 
	} 
}
```

### prisma.module.ts
```ts
/ src/prisma/prisma.module.ts (Prisma 모듈 신설 or 기존 사용) import { Module } from '@nestjs/common'; import { PrismaService } from './prisma.service';

@Module({ providers: [PrismaService], exports: [PrismaService], }) export class PrismaModule {}

// src/prisma/prisma.service.ts (기존 가정, 확장) import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'; import { PrismaClient } from '@prisma/client';

@Injectable() export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy { async onModuleInit() { await this.$connect(); }

async onModuleDestroy() { await this.$disconnect(); } }

// AuthService 수정 (pageCd-DB 테이블 매핑) private getAllowedTables(pageCd: string): string[] { const mapping = { // DB 스키마 기반 매핑 예시: pageCd에 따라 허용 테이블 (PxCorePage.path나 apiPath와 연동 가정) 'page1': ['PxCoreOrganization', 'PxCoreProject'], // org/proj 관련 페이지 'page2': ['PxCoreMenu', 'PxCorePage'], // menu/page 관련 'page3': ['PxCoreUser', 'PxCoreRoleGroup', 'PxCoreRole'], // 사용자/역할 관련 'page4': ['PxCoreAuth', 'PxCorePermission'], // 권한 관련 // 실제로는 PxCorePage 테이블에서 pageCd로 조회해 동적 매핑 (e.g., apiPath가 테이블 이름 암시) }; return mapping[pageCd] || []; }
```