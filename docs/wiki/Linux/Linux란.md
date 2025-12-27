- [운영체제?](#운영체제?)
	- [운영체제의 부팅 과정](#운영체제?#운영체제의 부팅 과정)
	- [Ubuntu 운영체제의 부팅 프로세스](#운영체제?#Ubuntu 운영체제의 부팅 프로세스)
		- [고전적 부팅 시스템](#Ubuntu 운영체제의 부팅 프로세스#고전적 부팅 시스템)
		- [개선된 부팅 시스템(14.04 까지)](#Ubuntu 운영체제의 부팅 프로세스#개선된 부팅 시스템(14.04 까지))
		- [현재의 부팅 시스템(16.04 부터)](#Ubuntu 운영체제의 부팅 프로세스#현재의 부팅 시스템(16.04 부터))
	- [Runlevel](#운영체제?#Runlevel)
	- [Runlevel과 systemdw의 targets 비교](#운영체제?#Runlevel과 systemdw의 targets 비교)
		- [ex)](#Runlevel과 systemdw의 targets 비교#ex))
	- [파일 시스템 및 디렉토리 구조](#운영체제?#파일 시스템 및 디렉토리 구조)
	- [다중 사용자](#운영체제?#다중 사용자)
- [커널](#커널)

---

# Linux

## 운영체제?
![Pasted-image-20230104084924.png](/img/이미지 창고/Pasted-image-20230104084924.png)
- 운영체제 또는 OS는 시스템 하드웨어를 관리할 뿐 아니라 응용 소프트웨어를 실행하기 위하여, 하드웨어 추상화 플랫폼과 공통 시스템 서비스를 제공하는 시스템 소프트웨어 입니다.
- 최근에는 가상화 기술의 발전에 힘입어 실제 하드웨어가 아닌 하이퍼바이저 위에서 실행되기도 한다.

### 운영체제의 부팅 과정
![Pasted-image-20230104103157.png](/img/이미지 창고/Pasted-image-20230104103157.png)
1. **ROM BIOS** : Basic Input / Output System(CMOS)
	- POST(Power On Self Test) 및 물리적 Boot 디바이스 선정
2. **MBR** : Master Boot Record
	- HDD의 특정 섹터(0번 섹터 512Byte)
3. **BootLoader
	- 소프트웨어 영역(멀티 부트 등 처리를 위한 멀티 스테이지 부트)
	- LILO, GRUB(Grand Unified Bootloader), GRUB2, uboot
4. **Linux Kernel**
	- 운영체제 소프트웨어 메모리에 올려서 구동(HW 디바이스, FS 등)
	- /sbin/init을 실행하며, initrd 패키지의 실행(pid 1)
5. **Init process : 부팅**
	- 루트 유저 프로세스로 systemd 등의 부팅 과정 수행
	- /etc/inittab 등 실행
6. **Runlevel : 부팅 (/etc/rc.d/rc*.d)**
	- 소프트웨어 부트 스크립트

### Ubuntu 운영체제의 부팅 프로세스
#### 고전적 부팅 시스템
- System-V init service
- /etc/inittab

#### 개선된 부팅 시스템(14.04 까지)
- Upstart init service

#### 현재의 부팅 시스템(16.04 부터)
- systemd boot process
- [systemd](systemd.md)

### Runlevel 
- **0 : halt(시스템 종료)**
- **1 : Single user mode(복원 모드)**
- **2 : Multiuser mode, without NFS**
- **3 : Full multiuser mode(텍스트 유저 모드)**
- **4 : unused(커스텀)**
- **X11 : (그래픽 유저 모드)**
- **Reboot (재부팅)**

### Runlevel과 systemdw의 targets 비교
**0 : poweroff.target 
1 : resure.target 
2/3/4 : multi-user.target
5 : graphical.target
6 : reboot.target **
#### ex)
```bash
sudo systemctl get-default
sudo systemctl enable multi-user.target
sudo systemctl set-default multi-user.target
```
- `systemctl` 명령을 사용하는 것을 추천

### 파일 시스템 및 디렉토리 구조
![Pasted-image-20230104125225.png](/img/이미지 창고/Pasted-image-20230104125225.png)

| 표기       | 설명                                  |
| -------- | ----------------------------------- |
| `/`      | 루트 디렉토리                             |
| `/bin`   | 기본적인 명령어                            |
| `/boot`  | 부트로더 디렉토리                           |
| `/dev`   | 시스템 디바이스                            |
| `/etc`   | 각종 설정파일                             |
| `/home`  | 사용자의 홈 디렉토리                         |
| `/lib`   | 라이브러리 및 커널 모듈                       |
| `/media` | 외부 저장소(cdrom, usb등)                 |
| `/mnt`   | 외부 저장소 도는 파일 시스템 마운트 포인트            |
| `proc`   | 시스템 설정등의 가상 파일 시스템(pseudo-file 시스템) |
| `/root`  | 루트 사용자의 홈 디렉토리                      |
| `/sbin`  | 시스템(관리자용) 명령어                       |
| `/tmp`   | 임시 저장소                              |
| `/usr`   | 일반 사용자들 공통 파일                       |
| `/var`   | 시스템 운용중에 생성되는 임시 데이터 저장소            |

### 다중 사용자
![Pasted-image-20230104130735.png](/img/이미지 창고/Pasted-image-20230104130735.png)
- 리눅스는 다중 사용자가 접속한다는 가정하에 만들어졌기 때문에, 가상 머신을 활성화한 상태에서 위의 단축키를 누르게 된다면,
- Terminal이 켜지는 것을 알 수 있다.


## 커널
- 컴퓨터 과학에서 커널은 컴퓨터의 운영체제의 핵심이 되는 컴퓨터 프로그램의 하나로, 시스템의 모든 것을 완전히 통제한다.
- 운영체제의 다른 부분 및 응용 프로그램 수행에 필요한 여러가지 서비스를 제공한다.
![Pasted-image-20230104085132.png](/img/이미지 창고/Pasted-image-20230104085132.png)
![Pasted-image-20230104085344.png](/img/이미지 창고/Pasted-image-20230104085344.png)
- 단일형 커널 -> Unix, **Linux**, MS-DOS,,,,현실적으로는 Layered
- 마이크로 커널 -> QNX, Mach, Window,,,,현실적으로는 대부분 Hybrid
![Pasted-image-20230104085551.png](/img/이미지 창고/Pasted-image-20230104085551.png)
![Pasted-image-20230104085610.png](/img/이미지 창고/Pasted-image-20230104085610.png)

---

#Linux

---
