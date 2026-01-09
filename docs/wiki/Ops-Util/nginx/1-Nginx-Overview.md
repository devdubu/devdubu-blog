---
slug: 1-Nginx-Overview
title: 1. Nginx Overview
authors: [jinmin]
tags: [Nginx, WebServer, ReverseProxy]
---

# Nginx란 무엇인가?

**Nginx**("engine-x"라고 읽음)는 높은 성능과 안정성, 적은 리소스 소비를 목표로 설계된 오픈 소스 웹 서버입니다.
웹 서버 기능뿐만 아니라 **리버스 프록시(Reverse Proxy)**, **로드 밸런서(Load Balancer)**, **메일 프록시** 등 다양한 역할을 수행할 수 있습니다.

## 주요 특징
1. **비동기 이벤트 기반 구조**: Apache와 같은 스레드/프로세스 기반이 아닌, 이벤트 기반(Event-Driven) 구조로 동작하여 적은 메모리로 많은 동시 접속을 처리할 수 있습니다.
2. **고성능 정적 콘텐츠 처리**: HTML, CSS, 이미지 등 정적 파일을 매우 빠르게 제공합니다.
3. **리버스 프록시 및 로드 밸런싱**: 백엔드 애플리케이션(Node.js, Spring Boot 등) 앞단에서 요청을 받아 전달하고, 부하를 분산시킵니다.
4. **확장성 및 유연성**: 다양한 모듈을 통해 기능을 확장할 수 있습니다.

## Docker로 실행하기
가장 간단하게 Nginx를 실행하는 방법은 Docker를 사용하는 것입니다.

```bash
docker run --name my-nginx -p 80:80 -d nginx
```

---
#Util #Nginx