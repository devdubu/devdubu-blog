---
sticker: vault//이미지/개발 로고/TechIconSVG/Linux.svg

slug: "LVM(Logical-Volumne-Management)"
---
# LVM

:::question LVM?
- 리눅스에서 논리적 볼륨을 관리하기 위한 시스템이다.
- HDD, SDD를 물리적으로 나누지 않고, 논리적으로 유연하게 파티션을 구성하고 관리할 수 있게 해줍니다.
- LVM을 사용하면 볼륨 크기 조정이 용이하고, 디스크 추가 및 확장이 쉽습니다.

:::

**LVM 구성 요소**:

- **PV (Physical Volume)**: 물리적 디스크나 파티션.
- **VG (Volume Group)**: 여러 PV를 모은 논리적 그룹.
- **LV (Logical Volume)**: VG 내에서 실제로 데이터를 저장하는 논리적 볼륨.
- **PE (Physical Extent)**: PV를 나눈 작은 블록 단위.
- **LE (Logical Extent)**: LV를 나눈 작은 블록 단위.

![Pasted-image-20250701093502.png](/img/이미지 창고/Pasted-image-20250701093502.png)


## LVM 구성 요소

1. LVM을 구성할 디스크 
2. 사용하고자 할 디스크를 선택합니다.
	1. 여기서는 `/dev/sdb`를 예로 들겠습니다.
3. 선택한 디스크(파티션)의 시스템 타입을 LVM 으로 지정하여 파티션을 생성
4. 디스크를 파티셔닝한 뒤,해당 파티션의 시스템 ID를 LVM 으로 변경합니다.

```shell
root # fdisk /dev/sdb
Command (m for help): n        # 새 파티션 추가
Select (default p): p          # 파티션 유형 선택
Partition number (1-4, default 1): 1
First sector (2048-209715199, default 2048): (Enter)
Last sector, +sectors or +size{K,M,G} (2048-209715199, default 209715199): (Enter)
Command (m for help): t        # 파티션 타입 변경
Hex code (type L to list all codes): 8e  # Linux LVM 타입
Command (m for help): p        # 파티션 정보 확인
Command (m for help): w        # 설정 저장
```

### PV (물리적 볼륨 생성)
이제 /dev/sdb1 파티션을 물리적 볼륨(PV)으로 설정합니다.

```shell
root # pvcreate /dev
```

#### PV 명령어 예시
```shell
root # pvs
PV       VG       Fmt  Attr  PSize  PFree
/dev/sda2 centos  lvm2 a--   <19.00g 0
/dev/sdb1         lvm2 ---  <100.00g <100.00g
```

#### VG (볼륨 그룹) 생성
물리적 볼륨(PV)을 사용해 볼륨 그룹(VG)을 생성합니다.

```shell
root # vgcreate testvg /dev/sdb1
```

#### vgs 명령어 예시:
```shell
root # vgs
VG     #PV   #LV  #SN  Attr   VSize   VFree
centos 1     2    0    wz--n- <19.00g  0
testvg 1     0    0    wz--n- <100.00g <100.00g
```

### LV(논리적 볼륨) 생성
볼륨 그룹(VG) 을 이용해 논리적 볼륨(LV)을 생성합니다.

```shell
root # lvcreate -n datalv -L 70GB testvg
root # lvcreate -n backuplv -l +100%FREE testvg
```

#### lvs 명령어 예시:
```shell
root # lvs
LV        VG      Attr    LSize   Pool   Origin   Data%   Meta%   Move   Log   Cpy%Sync   Convert
root      centos  -wi-ao-- <17.00g
swap      centos  -wi-ao--   2.00g
backuplv  testvg  -wi-a---- <30.00g
datalv    testvg  -wi-a----  70.00g
```

#### 파일 시스템 포맷
생성된 논리적 볼륨에 파일 시스템을 생성합니다.
여기서는 ext4 파일 시스템을 사용합니다.

```shell
root # mkfs.ext4 /dev/testvg/datalv
root # mkfs.ext4 /dev/testvg/backuplv
```

#### LV 파일 시스템을 마운트
논리적 볼륨을 마운트할 디렉토리를 생성하고 마운트합니다.

```shell
root # mkdir /data
root # mkdir /backup
root # mount /dev/testvg/datalv /data
root # mount /dev/testvg/backuplv /backup
```

#### df -h 명령어 예시:
```shell
root # df -h
/dev/mapper/testvg-datalv    70G   53M   67G   1% /data
/dev/mapper/testvg-backuplv  30G   45M   28G   1% /backup
```

#### 자동 마운트 설정
`/etc/fstab` 파일에 자동 마운트를 설정합니다.
시스템 재부팅 후에도 자동으로 마운트 되도록 설정합니다.

```shell
root # vi /etc/fstab
/dev/testvg/datalv   /data   ext4   defaults   0 0
/dev/testvg/backuplv /backup ext4   defaults   0 0
```

변경 후 `mount -a` 명령어로 fstab 설정을 적용합니다.
