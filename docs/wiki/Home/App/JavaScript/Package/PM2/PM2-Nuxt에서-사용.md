---
sticker: vault//이미지/개발 로고/TechIconSVG/Pm2-Icon.svg

slug: "PM2-Nuxt에서-사용"
---
# 설치

```shell
npm install -g pm2
```

## Nuxt Production 모드 준비
```shell
npm run build
```

## Nuxt PM2로 배포
```shell
pm2 start .output/server/index.mjs --name [nuxt-app]
```

## PM2 리스트 확인하기

```shell
pm2 list
```


## PM2 Nuxt 설정 방법

- PM2의 CLI 명령어를 활용하기 보다는 아래 설정 파일을 통한 제어가 훨씬 유연하게 제어 가능합니다.

```js
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'nuxt-app', // 애플리케이션 이름
      exec_mode: 'cluster', // 클러스터 모드 (CPU 코어 수에 따라 여러 인스턴스 실행)
      instances: 'max', // 가능한 최대 CPU 코어 수만큼 인스턴스 생성
      script: './.output/server/index.mjs', // 빌드된 Nuxt 서버 파일 경로
      args: 'start', // script에 전달할 인자 (Nuxt 3 빌드 결과는 보통 'start' 인자 필요 없음, 생략 가능)
      env: {
        NODE_ENV: 'production',
        HOST: '0.0.0.0', // 모든 IP에서 접근 허용
        PORT: 3000, // 서비스 포트
        # 여기에 필요한 다른 환경 변수들을 추가
        # API_BASE_URL: 'https://api.example.com',
        # DB_HOST: 'your_db_host',
      },
      env_production: {
        # 'production' 환경일 때만 적용되는 환경 변수
        # NODE_ENV: 'production', (위에서 정의했으므로 중복되지 않게)
        # PORT: 80,
      },
      watch: false, // 파일 변경 감지 및 자동 재시작 (개발 시 유용, 프로덕션에선 false 권장)
      ignore_watch: ['node_modules', '.git', '.output'], // watch 모드일 때 무시할 경로
      max_memory_restart: '300M', // 메모리 사용량 초과 시 재시작
      error_file: 'logs/err.log', // 에러 로그 파일 경로
      out_file: 'logs/out.log', // 일반 출력 로그 파일 경로
      log_date_format: 'YYYY-MM-DD HH:mm:ss', // 로그 날짜 포맷
      time: true, // 로그에 타임스탬프 추가
    },
  ],
};
```

### PM2를 해당 설정파일로 실행하는 CLI
```shell
pm2 start ecosystem.config.js
```

### PM2 재시작
```shell
pm2 restart nuxt-app
# 또는
pm2 restart ecosystem.config.js
```

### PM2 재시동(무중단 배포)
```shell
pm2 reload nuxt-app
# 또는
pm2 reload ecosystem.config.js
```


## Graceful Shutdown

:::question Graceful Shutdown?
- Node.js 애플리케이션이 외부 신호(예: PM2가 보내는 `SIGINT` 또는 `SIGTERM`)를 받았을 때, 현재 처리 중인 요청을 완료하고 새로운 요청을 받지 않도록 우아하게 종료하는 과정을 **Graceful Shutdown**이라고 합니다. 
- 이는 무중단 배포의 신뢰성을 높여줍니다.

:::

Nuxt 3는 Nitro 서버 엔진을 사용하며, 일반적으로 기본적인 Graceful Shutdown을 지원합니다. 
하지만, 데이터베이스 연결, 외부 API 호출 등 장시간이 필요한 작업이 있다면 이를 명시적으로 처리해주는 코드를 추가할 수 있습니다.

Nuxt 3의 서버 미들웨어 또는 플러그인에서 서버 종료 시 이벤트를 감지하여 처리할 수 있습니다.

```js
// server/plugins/graceful-shutdown.ts (예시)
export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook('close', async () => {
    console.log('Nitro server is closing. Performing graceful shutdown...');
    // 여기에 데이터베이스 연결 종료, 메시지 큐 연결 해제 등
    // 서버가 종료되기 전에 완료해야 할 비동기 작업을 추가합니다.
    await new Promise(resolve => setTimeout(resolve, 5000)); // 예시: 5초 대기
    console.log('Graceful shutdown complete.');
  });
});
```

PM2는 재시작/재로드 시 기본적으로 1600ms(1.6초)의 대기 시간을 줍니다. 
이 시간 안에 Graceful Shutdown이 완료되지 않으면 강제로 프로세스를 종료합니다. 
이 시간은 `kill_timeout` 옵션으로 조절할 수 있습니다.

```js
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'nuxt-app',
      // ...
      kill_timeout: 5000, // 5초 동안 Graceful Shutdown 대기 (밀리초 단위)
      // ...
    },
  ],
};
```

:::error ecosystem.config.ts 는 PM2 에서 인식 불가하다

:::

# Trouble Shooting
:::tip 기본적으로 PM2는 commonJS 로만 구동 된다.

:::

즉, `export default { }` 가 아닌 `module.export = {}` 라는 CommonJS 문법으로 이를 실행해야한다.
파일 확장자는 `.cjs`로 해야지 에러가 나지 않는다.








