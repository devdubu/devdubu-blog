---
slug: "1-Java-Environment"
title: "1. Java 환경 및 버전 관리"
---

# Java 환경 및 버전 관리

:::info 개요
Java 개발을 위한 환경 설정, 버전 관리, 그리고 VSCode 프로젝트 설정에 대해 다룹니다.
:::

## 1. Java 버전 관리 (JEnv)

Mac OS 환경에서는 `jenv`를 사용하여 여러 버전의 Java를 관리하는 것이 편리합니다.

### 1.1 설치
```bash
brew install jenv
echo 'export PATH="$HOME/.jenv/bin:$PATH"' >> ~/.zshrc
echo 'eval "$(jenv init -)"' >> ~/.zshrc
source ~/.zshrc
```

### 1.2 JDK 추가
설치된 JDK를 jenv에 등록합니다.
```bash
jenv add /Library/Java/JavaVirtualMachines/jdk-11.jdk/Contents/Home
jenv add /Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home
```

### 1.3 버전 변경
```bash
# 전역 설정
jenv global 11.0

# 현재 디렉토리 설정
jenv local 17.0
```

---

## 2. VSCode 프로젝트 버전 관리

VSCode에서 Java 프로젝트를 열 때, 프로젝트별로 다른 JDK 버전을 적용하려면 `.vscode/settings.json`을 설정합니다.

```json
{
  "java.configuration.runtimes": [
    {
      "name": "JavaSE-11",
      "path": "/Library/Java/JavaVirtualMachines/jdk-11.jdk/Contents/Home"
    },
    {
      "name": "JavaSE-17",
      "path": "/Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home",
      "default": true
    }
  ]
}
```
