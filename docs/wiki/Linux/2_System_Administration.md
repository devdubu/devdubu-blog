---
slug: "2-System-Administration"
---

# System Administration

## 1. User Management

### User Management Commands
```bash
# 사용자 생성 (홈 디렉토리 포함)
sudo useradd -m username

# 비밀번호 설정
sudo passwd username

# 사용자를 그룹에 추가 (예: sudo 그룹)
sudo usermod -aG sudo username
```

### File Transfer (SCP)
SSH를 이용해 원격지로 파일을 전송합니다.
```bash
# 로컬 -> 원격지 (디렉토리 포함)
scp -r [로컬 경로] [사용자]@[원격지IP]:[원격지 경로]
```

---

## 2. Systemd
Systemd는 최신 리눅스의 init 시스템이자 서비스 관리자입니다.

### Features
- **병렬 실행**: 부팅 속도 향상.
- **Dependency 관리**: 서비스 간 의존성 자동 처리.
- **Monitoring**: 서비스 상태 모니터링 및 자동 재시작.
- **Journaling**: `journalctl`을 통한 통합 로깅.

---

## 3. Storage Management (LVM & Swap)

### LVM (Logical Volume Manager)
물리적 디스크를 논리적으로 유연하게 관리하는 시스템입니다.

**구성 요소**:
- **PV (Physical Volume)**: 물리적 디스크/파티션 (`/dev/sdb1`)
- **VG (Volume Group)**: PV들의 집합 (`testvg`)
- **LV (Logical Volume)**: VG에서 할당된 논리적 파티션 (`datalv`)

**생성 절차**:
1.  **PV 생성**: `pvcreate /dev/sdb1`
2.  **VG 생성**: `vgcreate testvg /dev/sdb1`
3.  **LV 생성**: `lvcreate -n datalv -L 70G testvg`
4.  **Format**: `mkfs.ext4 /dev/testvg/datalv`
5.  **Mount**: `mount /dev/testvg/datalv /data`

### Swap Management
RAM이 부족할 때 디스크를 메모리처럼 사용하는 Swap 영역을 관리합니다.

**Swap File 생성 및 활성화 (8GB 예시)**:
```bash
# 1. 기존 스왑 끄기 (있을 경우)
sudo swapoff -a

# 2. Swap File 생성 (fallocate 권장)
sudo fallocate -l 8G /swapfile
sudo chmod 600 /swapfile

# 3. Swap 포맷 및 활성화
sudo mkswap /swapfile
sudo swapon /swapfile

# 4. 영구 등록 (/etc/fstab)
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

**Swappiness**: Swap 사용 적극성 조절 (0~100, 기본 60).
```bash
# 확인
cat /proc/sys/vm/swappiness

# 변경 (일시적)
sudo sysctl vm.swappiness=10
```

---

## 4. Tips & Tricks

### Alternatives (Java Version Change)
`update-alternatives`를 사용하여 여러 버전의 프로그램을 관리합니다.
```bash
# Alternatives 등록
sudo alternatives --install /usr/bin/java java /opt/jdk-21/bin/java 2100

# 버전 선택
sudo alternatives --config java
```

### Bulk File Deletion
`find` 명령어를 사용하여 특정 패턴의 파일을 일괄 삭제합니다.
```bash
# .log로 끝나는 파일 찾아서 삭제
find /path/to/dir -type f -name "*.log" -delete
```

### Busy Waiting
**Busy Waiting**은 자원을 얻기 위해 권한을 지속적으로 확인하며 CPU를 낭비하는 현상입니다.
- **해결**: Mutex, Semaphore, Monitor 등의 동기화 메커니즘을 사용하여, 자원이 없을 때는 대기(Sleep)하고 자원이 생기면 깨우는(Wake up) 방식을 사용해야 합니다.
