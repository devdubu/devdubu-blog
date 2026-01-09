---
slug: "5-Package-Management"
title: "5. 패키지 관리 (NPM)"
---

# 패키지 관리 (NPM)

:::info 개요
세계 최대의 소프트웨어 레지스트리인 **NPM**의 사용법, **유의적 버전 관리(SemVer)** 규칙, 그리고 대규모 프로젝트를 위한 **Monorepo** 전략(Lerna)을 정리합니다.
:::

## 1. NPM 기초

### 1.1 `package.json`
프로젝트의 메타데이터와 의존성(Dependencies)을 관리하는 파일입니다.
`npm init` 명령어로 생성할 수 있습니다.

- **dependencies**: 운영 환경에서 필요한 라이브러리. (`npm install <pkg>`)
- **devDependencies**: 개발 및 빌드 단계에서만 필요한 라이브러리. (`npm install -D <pkg>`)

### 1.2 버전 표기법 (Semantic Versioning)
`Major.Minor.Patch` (예: `1.0.4`) 형식을 따릅니다.

- **Patch (`1.0.x`)**: 버그 수정 등 하위 호환성이 유지되는 변경. `~1.0.4`는 Patch 버전 업데이트만 허용합니다.
- **Minor (`1.x`)**: 새로운 기능 추가(하위 호환). `^1.0.4`는 Minor 버전 업데이트까지 허용합니다. (NPM 기본값)
- **Major (`x`)**: 하위 호환되지 않는 변경.

---

## 2. 모노레포 (Mono-Repo)

하나의 저장소(Repository)에서 여러 개의 패키지를 관리하는 전략입니다.

### 2.1 장단점
- **장점**:
    - 공통 코드 및 설정(ESLint, Test) 재사용 용이.
    - 패키지 간 의존성 관리 및 통합 테스트가 쉬움.
- **단점**:
    - 저장소 크기가 커짐.
    - CI/CD 파이프라인 구성이 복잡해질 수 있음.

### 2.2 도구: Lerna
모노레포 관리를 도와주는 도구입니다.

```bash
npx lerna init
```

**구조**:
```
lerna-repo/
  packages/    # 각 패키지가 이 안에 위치
    pkg-a/
    pkg-b/
  lerna.json   # 설정 파일
  package.json # 공통 의존성
```
