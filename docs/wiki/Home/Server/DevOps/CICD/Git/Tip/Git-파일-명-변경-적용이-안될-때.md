---
sticker: vault//이미지/개발 로고/TechIconSVG/Git.svg

slug: "Git-파일-명-변경-적용이-안될-때"
---
Git에서 파일명 대소문자를 구분하도록 설정하는 옵션은 **`core.ignorecase`** 입니다.
이 값을 `false`로 설정하면 Git이 파일명의 대소문자를 구분하게 됩니다.

---
### **설정 확인 및 변경 방법**
터미널이나 Git Bash에서 아래 명령어를 사용하여 현재 설정을 확인하고 변경할 수 있습니다.
#### **1. 현재 설정 확인하기**

현재 저장소(repository)의 설정을 확인하려면 다음 명령어를 입력하세요.
```Bash
git config core.ignorecase
```

- **`true`** 가 나오면 대소문자를 구분하지 않는 상태입니다 (기본값).
- **`false`** 가 나오면 대소문자를 구분하는 상태입니다.
- 아무것도 출력되지 않으면 전역(global) 설정을 따릅니다.

---

#### **2. 대소문자 구분하도록 설정 변경하기**

**`core.ignorecase`** 옵션을 `false`로 설정하면 됩니다.
- **현재 프로젝트(저장소)에만 적용할 경우:**

```Bash
git config core.ignorecase false
```
- **모든 프로젝트(전역)에 적용할 경우:**
```Bash
git config --global core.ignorecase false
```

### **⚠️ 중요 참고사항**
- **운영체제 파일 시스템:** macOS나 Windows의 기본 파일 시스템(APFS, NTFS)은 기본적으로 대소문자를 구분하지 않습니다. 따라서 `git config core.ignorecase false`로 설정하더라도, 운영체제 수준에서 `file.txt`와 `File.txt`를 같은 파일로 인식하여 문제가 발생할 수 있습니다.
- **팀 협업:** 팀원들과 `core.ignorecase` 설정을 통일하는 것이 중요합니다. 다른 팀원은 `true`로, 나는 `false`로 설정하고 작업하면 예기치 않은 커밋(commit) 충돌이 발생할 수 있습니다.
- **이미 존재하는 파일:** 이 설정을 변경하기 전에 이미 `file.txt`와 `File.txt`가 같은 이름으로 취급되어 저장소에 추가된 상태라면, `git mv` 명령