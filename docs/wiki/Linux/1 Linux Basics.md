---
slug: "1-Linux-Basics"
---

# Linux Basics

## 1. Operating System Overview
:::note What is an OS?
운영체제(OS)는 시스템 하드웨어를 관리하고 응용 소프트웨어를 실행하기 위한 시스템 소프트웨어입니다.
최근에는 하드웨어 추상화 플랫폼과 공통 시스템 서비스를 제공하며, 가상화 기술 위에서도 실행됩니다.
:::

### Kernel
- **커널(Kernel)**: 운영체제의 핵심으로, 시스템의 모든 것을 통제하며 응용 프로그램 수행에 필요한 서비스를 제공합니다.
- **분류**:
    - **Monolithic Kernel**: Unix, Linux, MS-DOS (현실적으로는 Layered)
    - **Micro Kernel**: QNX, Mach (현실적으로는 Hybrid)

---

## 2. Boot Process
리눅스(Ubuntu 예시)의 부팅 과정은 다음과 같습니다.

### General Boot Sequence
1.  **ROM BIOS**: POST(Power On Self Test) 및 부팅 디바이스 선정.
2.  **MBR (Master Boot Record)**: HDD의 0번 섹터 읽기.
3.  **BootLoader**: GRUB2 등 부트로더 실행.
4.  **Linux Kernel**: 커널 메모리 로드, 하드웨어/파일시스템 초기화, `/sbin/init` 실행.
5.  **Init Process**: PID 1번 프로세스(systemd) 실행.
6.  **Runlevel/Target**: 부팅 레벨에 따른 서비스 실행.

### Systemd vs Runlevel
과거 `System-V init` 방식의 Runlevel과 현재 `systemd`의 Target 비교:

| Runlevel | Systemd Target | 설명 |
| :---: | :--- | :--- |
| **0** | `poweroff.target` | 시스템 종료 |
| **1** | `rescue.target` | 단일 사용자 모드 (복구) |
| **3** | `multi-user.target` | 다중 사용자 모드 (CLI) |
| **5** | `graphical.target` | 그래픽 모드 (GUI) |
| **6** | `reboot.target` | 재부팅 |

> [!TIP] Boot Target 설정 예시
> ```bash
> # 현재 기본 타겟 확인
> sudo systemctl get-default
> 
> # CLI 모드로 부팅 설정
> sudo systemctl set-default multi-user.target
> ```

---

## 3. File System & Directory Structure
리눅스 파일 시스템은 계층적 트리 구조를 가집니다.

| 경로 | 설명 |
| :--- | :--- |
| `/` | **Root Directory**: 최상위 디렉토리 |
| `/bin`, `/sbin` | **Binaries**: 기본 명령어 및 시스템 관리자용 명령어 |
| `/boot` | **Boot**: 부트로더 및 커널 이미지 |
| `/dev` | **Devices**: 디바이스 파일 |
| `/etc` | **Etc**: 시스템 설정 파일 |
| `/home` | **Home**: 사용자 홈 디렉토리 |
| `/root` | **Root Home**: 루트 사용자 홈 디렉토리 |
| `/lib` | **Libraries**: 커널 모듈 및 라이브러리 |
| `/var` | **Variable**: 로그, 스풀 등 가변 데이터 |
| `/tmp` | **Temp**: 임시 저장소 (재부팅 시 삭제됨) |
| `/proc` | **Process**: 프로세스 및 커널 정보 (가상 파일 시스템) |
| `/mnt`, `/media` | **Mount**: 파일 시스템 마운트 포인트 |

---

## 4. Multi-User Environment
리눅스는 다중 사용자(Multi-User)를 지원합니다.
- **Virtual Console**: `Ctrl + Alt + F1~F6` 키를 통해 여러 가상 터미널(TTY)에 접속할 수 있습니다.
- `F1`: 주로 GUI (GDM)
- `F2~F6`: TTY (CLI 로그인)
