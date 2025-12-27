---
sticker: emoji//2615

slug: "Java-Version-관리"
---
### 1. jenv 설치하기

먼저 Homebrew를 사용해서 `jenv`를 설치합니다. 터미널을 열고 아래 명령어를 입력하세요.

Bash

```
brew install jenv
```

---

### 2. jenv 환경 설정

`jenv`를 설치한 후에는 셸 환경에 맞게 설정을 추가해야 합니다. 사용하시는 셸에 따라 아래의 명령어를 터미널에 입력해주세요.

**zsh 사용자의 경우 (`~/.zshrc`)**

```Bash
echo 'export PATH="$HOME/.jenv/bin:$PATH"' >> ~/.zshrc
echo 'eval "$(jenv init -)"' >> ~/.zshrc
```

**bash 사용자의 경우 (`~/.bash_profile` 또는 `~/.bashrc`)**

```Bash
echo 'export PATH="$HOME/.jenv/bin:$PATH"' >> ~/.bash_profile
echo 'eval "$(jenv init -)"' >> ~/.bash_profile
```

설정을 완료한 후, 터미널을 완전히 껐다가 다시 켜거나 아래 명령어를 실행하여 변경사항을 바로 적용할 수 있습니다.


```Bash
source ~/.zshrc 
# 또는 source ~/.bash_profile
```

제대로 설치되었는지 확인하려면 아래 명령어를 입력했을 때 "jenv is a shell function"과 같은 메시지가 나타나면 됩니다.

```Bash
type jenv
```

---

### 3. OpenJDK 21 설치하기
이제 Homebrew를 통해 OpenJDK 21을 설치합니다.

```Bash
brew install openjdk@21
```

---

### 4. jenv에 OpenJDK 21 등록하기

설치된 OpenJDK 21을 `jenv`가 관리할 수 있도록 추가해야 합니다. 아래 명령어를 실행하여 등록하세요.

```Bash
jenv add /Library/Java/JavaVirtualMachines/openjdk-21.jdk/Contents/Home
```

```Bash
jenv add /Library/Java/JavaVirtualMachines/[설치한 JAVA 버전]/Contents/Home
```

`jenv`에 잘 추가되었는지 확인하려면 다음 명령어를 사용하세요. 현재 등록된 자바 버전 목록이 나타납니다.

```Bash
jenv versions
```

---

### 5. 사용할 Java 버전 설정하기

마지막으로 `jenv`를 사용하여 시스템 전역 또는 특정 디렉토리에서 사용할 자바 버전을 설정할 수 있습니다.

**글로벌(전역) 버전으로 설정하기**
컴퓨터의 모든 터미널 세션에서 기본으로 OpenJDK 21을 사용하고 싶을 때 사용합니다.

```bash
jenv global 21.0
```

_(버전 번호는 `jenv versions` 명령어로 확인한 정확한 버전을 입력해야 합니다.)_

**로컬(특정 폴더) 버전으로 설정하기**

현재 작업 중인 폴더에서만 특정 자바 버전을 사용하고 싶을 때 사용합니다. 해당 폴더로 이동한 후 아래 명령어를 실행하세요.

```Bash
jenv local 21.0
```

---

### 6. 최종 확인
모든 설정이 완료된 후, 아래 명령어를 통해 현재 적용된 자바 버전을 확인합니다. OpenJDK 21 정보가 출력되면 성공적으로 설정된 것입니다. 🎉

```bash
java -version
```