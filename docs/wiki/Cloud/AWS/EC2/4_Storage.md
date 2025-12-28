---
slug: "4-Storage"
---

# EC2 Storage (EBS & EFS)

EC2 인스턴스에서 사용할 수 있는 주요 스토리지 옵션인 **EBS**, **EFS**, **Instance Store**에 대해 다룹니다.

## EBS (Elastic Block Store)
![Pasted-image-20230801085339.png](/img/Pasted-image-20230801085339.png)
:::note EBS란?
- **네트워크 드라이브**입니다. (물리적 드라이브 X)
- 인스턴스가 실행 중인 동안 연결(Mount)하여 사용할 수 있습니다.
- 인스턴스가 종료되어도 데이터는 유지(Persist)될 수 있습니다.
- **가용 영역(AZ)에 종속**됩니다. (예: `ap-northeast-2a`에 생성된 EBS는 `2c`에서 연결 불가)
:::

### EBS Volume Types
| 유형 | 이름 | 설명 | 용도 | 특징 |
| -- | -- | -- | -- | -- |
| **SSD** | **gp3** | 범용 SSD | 다양한 워크로드, 부팅 볼륨 | 성능(IOPS)과 용량 독립적 설정 가능. 3,000 IOPS 기본 제공. |
| **SSD** | **gp2** | 범용 SSD | 다양한 워크로드, 부팅 볼륨 | 용량에 비례하여 IOPS 증가 (최대 16,000 IOPS). |
| **SSD** | **io1 / io2** | 프로비저닝 된 IOPS | 미션 크리티컬, 고성능 DB | 최고 성능, 높은 IOPS/GB 비율. **io2 Block Express**는 밀리초 미만 지연 시간 제공. |
| **HDD** | **st1** | Throughput Optimized | 빅데이터, DW, 로그 처리 | 높은 처리량(MB/s). 부팅 볼륨 불가. |
| **HDD** | **sc1** | Cold HDD | 자주 접근하지 않는 데이터 | 최저 비용. 부팅 볼륨 불가. |

### EBS Features
- **Delete on Termination**: 인스턴스 종료 시 EBS 볼륨을 함께 삭제할지 여부를 설정하는 옵션입니다. (Root 볼륨은 기본적으로 삭제되도록 설정됨)
- **Multi-Attach**: `io1`, `io2` 볼륨은 동일 AZ 내의 여러 인스턴스(최대 16개)에 동시에 연결 가능합니다. (Cluster Aware 파일 시스템 필요)
- **Encryption**: KMS를 사용하여 저장 데이터 및 전송 중인 데이터를 암호화할 수 있습니다.

## EBS Snapshots
![Pasted-image-20230801104713.png](/img/Pasted-image-20230801104713.png)
- **개념**: 특정 시점의 EBS 볼륨 백업입니다.
- **특징**:
	- 증분 백업(Incremental backup) 방식입니다.
	- 스냅샷은 리전(Region) 레벨에 저장되거나, 다른 리전으로 복사할 수 있습니다. (EBS 볼륨을 다른 AZ나 리전으로 옮길 때 사용)
	- **FSR (Fast Snapshot Restore)**: 스냅샷 복원 시 초기화(Warming) 없이 즉시 최대 성능을 내도록 하는 기능 (비용 발생)
	- **Recycle Bin**: 실수로 삭제한 스냅샷을 복구할 수 있는 휴지통 기능

## EFS (Elastic File System)
![Pasted-image-20230804101805.png](/img/Pasted-image-20230804101805.png)
- **개념**: 관리형 **NFS (Network File System)** 입니다.
- **특징**:
	- **Multi-AZ**: 여러 가용 영역에 걸쳐 수백, 수천 개의 EC2 인스턴스가 동시에 마운트할 수 있습니다.
	- **Linux 전용**: Windows는 지원하지 않습니다.
	- **자동 확장**: 용량을 미리 지정할 필요 없이 사용한 만큼만 지불합니다.
	- **비용**: EBS의 약 3배 정도로 비쌉니다. (하지만 EFS-IA 등으로 절감 가능)

### EFS Storage Classes
- **EFS Standard**: 자주 액세스하는 파일용
- **EFS-IA (Infrequent Access)**: 자주 액세스하지 않는 파일용 (비용 저렴, 검색 비용 발생)
- **Lifecycle Policy**: 일정 기간 액세스되지 않은 파일을 자동으로 IA 계층으로 이동시켜 비용 최적화 가능

## EC2 Instance Store
![Pasted-image-20230803173139.png](/img/Pasted-image-20230803173139.png)
- **개념**: EC2 호스트 서버에 물리적으로 부착된 하드웨어 디스크입니다 (Ephemeral Storage).
- **장점**: 네트워크를 거치지 않으므로 **매우 높은 I/O 성능**을 제공합니다. (버퍼, 캐시 등에 적합)
- **단점**: **휘발성(Ephemeral)** 입니다. 인스턴스가 중지(Stop)되거나 종료(Terminate)되면 데이터가 손실됩니다.

## Storage 비교 요약
| 구분 | EBS | EFS | Instance Store |
| -- | -- | -- | -- |
| **유형** | 네트워크 블록 스토리지 | 네트워크 파일 시스템 (NFS) | 물리적 하드웨어 디스크 |
| **연결** | 1:1 (일부 Multi-Attach 가능) | 1:N (수천 개 동시 연결) | 1:1 (내장) |
| **범위** | 단일 AZ | Multi-AZ (리전 전체) | 단일 호스트 |
| **데이터 보존** | 영구적 (설정 시) | 영구적 | **휘발성 (중지 시 삭제)** |
| **OS** | Linux, Windows | **Linux Only** | 모두 |
