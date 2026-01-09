---
slug: "6-Nexus-Private-Registry"
title: "6. Nexus 사설 레지스트리 (Private Registry)"
---

# Nexus 사설 레지스트리

:::info 개요
보안이 중요한 기업 환경에서는 외부망 접속이 제한되거나, 내부 전용 라이브러리를 관리해야 합니다. **Nexus Repository Manager**를 사용하여 사설 NPM 레지스트리를 구축하는 방법을 알아봅니다.
:::

## 1. 저장소 유형 (Repository Types)

Nexus는 3가지 타입의 저장소를 제공합니다.

1. **Hosted**: 우리가 직접 만든 내부 패키지(`npm publish`)를 저장하는 곳입니다.
2. **Proxy**: 외부(`registry.npmjs.org`) 패키지를 캐싱하는 곳입니다. 한 번 다운로드된 패키지는 내부에 저장되어, 외부망이 끊겨도 사용할 수 있습니다.
3. **Group**: Hosted와 Proxy를 하나로 묶어주는 가상 저장소입니다. 개발자는 이 Group URL 하나만 바라보면 됩니다.

![Repository Types](/img/Pasted-image-20250424094116.png)

## 2. 사용 설정 (`.npmrc`)

프로젝트 루트의 `.npmrc` 파일에 레지스트리 주소를 설정하여, `npm install` 시 Nexus를 바라보게 합니다.

```ini title=".npmrc"
registry=http://nexus.company.com/repository/npm-group/
```

### 인증 설정
배포(`npm publish`)를 위해서는 로그인이 필요합니다. 충돌 방지를 위해 기존 전역 설정을 초기화하고 로그인하는 것이 좋습니다.

```bash
# 기존 설정 제거 (충돌 방지)
rm ~/.npmrc

# 로그인 (Hosted 저장소 주소 사용)
npm login --registry http://nexus.company.com/repository/npm-hosted/
```

:::warning 주의
패키지 다운로드는 **Group** URL을 사용하지만, 배포(Publish)는 반드시 **Hosted** URL을 타겟으로 해야 합니다.
:::
