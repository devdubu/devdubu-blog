---
sticker: vault//이미지/개발 로고/TechIconSVG/Linux.svg

slug: "Linux-System-Swap-Ram-늘리기"
---
# Swap Ram을 늘려야하는 이유

![Pasted-image-20250715094331.png](/img/이미지 창고/Pasted-image-20250715094331.png)

위 사진을 본다면, 현재 Swap Ram이 모두 1GB로 되어있는 것을 볼 수 있다..
그렇기에, 해당 Swap Ram은 보통은 Ram에 1배에서 2배까지는 늘린다고 보통은 얘기를 하기 때문에, 나는 최대인 2배로 늘려서 진행을 하려고 한다.

## Swap Partition
Swap Partition 같은 경우는 초기에 설정을 해야한다는데, 자세한건...추후에 알아보고 작성해보기로

## Swap File
우선 SwapFile을 생성하는 방법부터 먼저 익히려고 한다.

### 기존 swapfile 제거

```shell
sudo swapoff /swapfile

rm /swapfile
```

### swap file 생성
```shell
sudo fallocate -l 8G ./swapfile # 최신 리눅스 시스템에서 권장 (더 빠름)
# 또는 구형 시스템에서:
# sudo dd if=/dev/zero of=/swapfile bs=1M count=4096 # 4096 * 1MB = 4GB
```

### swap file 권한 설정
스왑 파일은 보안상 Root만 읽고 쓸수 잇도록 권한을 제한해야합니다.

```shell
sudo chmod 600 /swapfile
```

### Swap 영역으로 포맷

```shell
sudo mkswap /swapfile
```
- `mkswap`: 지정된 파일을 스왑 영역으로 초기화합니다.

### Swap 활성화

```shell
sudo swapon /swapfile
```
- `swapon`: 지정된 스왑 장치(또는 파일)를 활성화합니다.

### Swap 영구 활성화

시스템 재 부팅시에도 자동으로 Swap File이 활성되 될 수 있게끔 `/etc/fstab` 파일을 수정해야 합니다.
```shell
sudo vi /etc/fstab # 또는 nano, gedit 등 원하는 텍스트 에디터 사용
```

파일에 맨 아래 부분에 다음 줄을 추가 합니다.

```shell
/swapfile none swap sw 0 0
```

- `/swapfile`: 스왑 파일의 경로
- `none`: 마운트 포인트 (스왑 파일은 마운트되지 않으므로 none)
- `swap`: 파일 시스템 타입
- `sw`: 스왑 장치 옵션 (기본 옵션)
- `0 0`: `dump`와 `pass` 옵션 (스왑 파일에는 일반적으로 0으로 설정)

## Swappiness
:::question Swappiness?
- 해당 값은 Linux의 커널이 얼마나 자주 스왑 메모리를 사용할지 결정하는 값입니다(0 ~ 100)
- 기본값은 <mark>60</mark>으로 해당 값이 높을 수록 적극적으로 Swap 메모리를 사용하는 경향이 있습니다.

:::

### 현재 값 확인 하는 방법

```shell
cat /proc/sys/vm/swappiness
```

### 영구적으로 변경하는 방법
```shell
sudo vi /etc/sysctl.conf


# 해당 파일의 아래 값을 변경
vm.swappiness=10

# 변경 사항 저장 
sudo sysctl -p
```
