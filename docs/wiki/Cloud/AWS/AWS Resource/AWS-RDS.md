---
slug: "AWS-RDS"
---
# Amazon RDS

> Amazon RDS란?

Amazon Relational Database Services는 AWS 클라우드에서 관계형 데이터 베이스를 더 쉽게 설치, 운영 및 확장할 수 있는 웹서비스 입니다.

이 서비스는 산업 표준 관계형 데이터 베이스를 위한 경제적이고 크기 조절이 가한 용량을 제공하고 공통 데이터베이스 관리 작업을 작업합니다.

## Amazon RDS 및 Amazon EC2

Amazon RDS는 관리형 데이터베이스 서비스로, 대부분의 관리 작업을 담당합니다.

Amazon RDS를 사용하면 번거로운 수동 작업을 처리할 필요 없이, 애플리케이션과 사용자에게 집중할 수 있습니다.

| **특징**          | **Amazon EC2 관리** | **Amazon RDS 관리** |
| --------------- | ----------------- | ----------------- |
| 애플리케이션 최적화      | 고객                | 고객                |
| 확장성             | 고객                | AWS               |
| 높은 가용성          | 고객                | AWS               |
| 데이터베이스 백업       | 고객                | AWS               |
| 데이터베이스 소프트웨어 패치 | 고객                | AWS               |
| 데이터베이스 소프트웨어 설치 | 고객                | AWS               |
| OS 패치           | 고객                | AWS               |
| OS 설치           | 고객                | AWS               |
| 서버 유지 관리        | AWS               | AWS               |
| 하드웨어 수명         | AWS               | AWS               |
| 전력, 네트워크 및 냉각   | AWS               | AWS               |

Amazon RDS는 완전 관리 형이 아닌 데이터베이스 배포와 비교해서 다음과 같은 특정 이점을 제공합니다.

- 이미 익숙한 MariaDB, SQL Server, MySQL, Oracle 및 PostgreSQL과 같은 데이터 베이스 제품을 사용할 수 있습니다.
    
- Amazon RDS는 백업, 소프트웨어 패치, 자동 장애 감지 및 복구를 관리합니다.
    
- 자동화된 백업을 설정하거나 고유한 백업 스냅샷을 수동으로 생성할 수 있습니다.
    
    - 해당 백업을 사용하면 데이터 베이스를 복원할 수 있다.
        
    - Amazon RDS 복원 프로세스는 안정적이고 효율적 입니다.
        
- 데이터베이스 패키지의 보안 외에도 RDS 데이터베이스에 액세스 할 수 있는 사용자 제어할 수 있습니다.
    
    - 그러기 위해서는 AWS Identity and Access Management(IAM)를 사용하여 사용자 권한을 정의하면 됩니다.
        
    - 데이터베이스를 Virtual Private Cloud(VPC)에 배치하여 데이터베이스를 보호할 수 있다.
        

# DB 인스턴스

DB 인스턴스는 AWS 클라우드에 잇는 격리된 데이터베이스 환경입니다.
Amazon RDS의 기본 빌딩 블록은 DB 인스턴스 입니다.
DB 인스턴스에 사용자가 만든 데이터베이스 하나 이상 포함 될 수 있습니다.
AWS Command Line Interface(AWS CLI), Amazon RDS API 또는 AWS Management Console을 사용하여 DB 인스턴스를 생성하고 수정할 수 있습니다.

## DB 엔진

DB 엔진은 DB인스턴스에서 실행되는 특정 관계형 데이터 베이스 소프트웨어 입니다.

Amazon RDS에서는 아래와 같은 엔진을 지원합니다.

![Pasted-image-20250410101928.png](/img/이미지 창고/Pasted-image-20250410101928.png)

MariaDB

![Pasted-image-20250410101941.png](/img/이미지 창고/Pasted-image-20250410101941.png)

SQL Server

![Pasted-image-20250410101952.png](/img/이미지 창고/Pasted-image-20250410101952.png)

MySQL

![Pasted-image-20250410102001.png](/img/이미지 창고/Pasted-image-20250410102001.png)

Oracle DB

![Pasted-image-20250410102009.png](/img/이미지 창고/Pasted-image-20250410102009.png)

Postgre SQL

## DB 인스턴스 클래스

DB 인스턴스 클래스는 DB 인스턴스의 컴퓨팅 및 메모리 용량을 결정하며, DB 인스턴수 클래스는 DB 인스턴스 유형과 크기로 구성됩니다.

인스턴스 유형마다 서로 다른 컴퓨팅, 메모리 및 스토리지 기능을 제공합니다.

### DB 인스턴스 스토리지

Amazon EBS는 내구성이 있는 블록 수준 스토리지 볼륨을 제공하여 실행 중인 인스턴스에 연결하는 것이 가능합니다.
:::tip DB 인스턴스 **스토리지 유형**
- 범용(SSD)
- 프로비저닝된 IOPS(PIOPS)  
- Magnetic    

:::

스토리지 유형은 성능 특성과 가격이 다릅니다.

# MariaDB DB 인스턴스 생성 및 해당 인스턴스에 연결

![Pasted-image-20250410102058.png](/img/이미지 창고/Pasted-image-20250410102058.png)

위의 아키텍쳐로 MariaDB RDS에 대한 예시를 설명할 예정입니다.
기본적으로 VPC, Private, Public Subnet, EC2를 만들었다는 가정 하에 문서를 진행할 예정입니다.

## MariaDB DB 인스턴스 생성

### 간편 생성

1. AWS Management Console에 로그인한 후에 Amazon RDS 콘솔을 엽니다.
2. Amazon RDS 콘솔의 오른쪽 상단에서 DB 인스턴스를 생성하려는 AWS 리전을 선택합니다.
3. 탐색 창에서 DB를 선택합니다.
4. Create database를 선택하고 Easy Create이 선택 되어 있는지 확인합니다.
![Pasted-image-20250410102118.png](/img/이미지 창고/Pasted-image-20250410102118.png)
5. 구성에서 MariaDB를 선택합니다.
6. 현 상황에 맞게 나머지를 채워주면 됩니다.

![Pasted-image-20250410102127.png](/img/이미지 창고/Pasted-image-20250410102127.png)

![Pasted-image-20250410102139.png](/img/이미지 창고/Pasted-image-20250410102139.png)

![Pasted-image-20250410102147.png](/img/이미지 창고/Pasted-image-20250410102147.png)

Easy Create와 함게 사용되는 기본 설정을 검토할 수 있는 화면입니다.
데이터베이스 생성 후 편집 가능 열에는 데이터베이스 생성 후 어떤 옵션을 변경할 수 있는지 나와 있습니다.

### MariaDB DB 인스턴스에 연결

![Pasted-image-20250410102155.png](/img/이미지 창고/Pasted-image-20250410102155.png)

DB 인스턴스의 엔드포인트(DNS 이름)과 포트 번호를 찾습니다.

DB 인스턴스에 연결하려면 엔드포인트와 포트 번호가 모두 필요합니다.

#### EC2 연결

EC2 인스턴스에 연결하기 위해서는 우선 아래의 작업을 진행해야합니다.

```shell
# 소프트웨어 업데이트 
sudo dnf update -y 
# mariaDB의 mysql 명령줄 클라이언트를 설치합니다. 
# Amazon Linux 2023에서 MariaDB 명령줄 클라이언트를 설치하려면 다음 명령을 실행합니다. 
sudo dnf install mariadb105 

# MariaDB 인스턴스에 연결합니다. 
# MySQL 클라이언트를 사용하여 MariaDB DB 인스턴스에 연결 할 수 있습니다. 

# 전에 복사해둔 endpoint를 아래에 넣어주면 됩니다. 
mysql -h [endpoint] -P 3306 -u admin -p
```

# Oracle DB 인스턴스 생성 및 해당 인스턴스에 연결

![Pasted-image-20250410102212.png](/img/이미지 창고/Pasted-image-20250410102212.png)

MariaDB와 마찬가지로 RDS 생성에 대해서만 다루겠습니다.

## Orcale DB 인스턴스 생성

![Pasted-image-20250410102218.png](/img/이미지 창고/Pasted-image-20250410102218.png)

![Pasted-image-20250410102223.png](/img/이미지 창고/Pasted-image-20250410102223.png)

RDS를 위의 화면과 같이 셋팅 해줍니다.

→ DB 인스턴스 indentifier 등등은 환경에 맞게 유동적으로 셋팅하면 됩니다.


![Pasted-image-20250410102313.png](/img/이미지 창고/Pasted-image-20250410102313.png)

간편 생성 셋팅 보기로, 현재 셋팅된 값을 확인합니다.

### SQL 클라이언트를 Oracle DB 인스턴스에 연결



![Pasted-image-20250410102301.png](/img/이미지 창고/Pasted-image-20250410102301.png)

Oracle DB도 마찬가지로 Endpoint와 Port를 찾아서 기억합니다.

연결할 EC2에 접속한 후에, 아래의 과정을 거쳐서 DB 인스턴스 연결을 진행합니다.

```shell
sudo dnf update -y
```

왼쪽의 링크를 통해서 [![](https://www.oracle.com/asset/web/favicons/favicon-32.png)Instant Client for Linux x86-64 (64-bit)](https://www.oracle.com/database/technologies/instant-client/linux-x86-64-downloads.html) Oracle Client를 설치합니다.

아래의 버전은 21.9 버전을 기준으로 작성한 Shell 입니다.

```shell
 wget https://download.oracle.com/otn_software/linux/instantclient/219000/oracle-instantclient-basic-21.9.0.0.0-1.el8.x86_64.rpm
 wget https://download.oracle.com/otn_software/linux/instantclient/219000/oracle-instantclient-sqlplus-21.9.0.0.0-1.el8.x86_64.rpm
```

아래의 명령어를 통해 패키지를 설치합니다.
```shell
sudo dnf install oracle-instantclient-*.rpm

# 위에 복사해둔 endpoiont를 아래에 붙여넣기 합니다.
sqlplus amdin@oracle-db-instance-endpoint:1521/DATABASE
```

# Amazon RDS의 모범 사례

## Amazon RDS 기본 운영 지침

아래는 Amazon RDS 서비스 수준 계약에 다음 지침을 따르도록 명시되어있습니다.

### RDS 모니터링

![Pasted-image-20250410102408.png](/img/이미지 창고/Pasted-image-20250410102408.png)

- 지표를 사용하여 메모리, CPU, 복제본 지연 및 스토리지 사용량을 모니터링 합니다.
    
- Amazon CloudWatch에서 사용 패턴이 변경되거나 사용자가 배포 용량에 도달했을 때 알림을 받는 등으로 시스템 성능 및 가용성을 유지해야 한다.
    

### DB 인스턴스 확장

위의 모니터링 결과로서, 스토리지 용량의 한계에 도달한 경우에 DB 인스턴스를 확장합니다.
스토리지 및 메모리에 어느 정도 버퍼가 있어야지만, 애플리케이션에서 수요가 얘기치 않게 늘어날 경우 이를 수용할 수 있습니다.

### 자동 백업 활성화

일일 쓰기 IOPS가 낮은 동안 백업 창이 열리도록 설정합니다.
백업이 데이터 베이스 사용에 영향을 미칠 수도 있습니다.

### DB 인스턴스 I/O 용량 늘리기

데이터 베이스 작업량으로 인해 프로비저닝한 I/O보다 많이 필요한 경우 장애 조치 또는 데이터베이스 오류가 발생한 후에 복구 속도가 느려집니다.
DB 인스턴스의 I/O 용량을 늘리려면 다음 중 일부 항목이나 모든 항목을 수행해야 합니다.
- I/O 용량이 높은 다른 DB 인스턴스 클래스로 마이그레이션 합니다.
- 필요한 증분 양에 따라 마그네틱 스토리지를 범용 또는 프로비저닝된 IOPS 스토리지로 변환합니다.
    - 이미 프로비저닝된 IOPS를 사용하고 있는 경우 추가 처리 용량을 프로비저닝합니다.
- 클라이언트 애플리케이션이 DB 인스턴스의 DNS 데이터를 캐시한ㄴ 경우 TTL 값을 30초 미만으로 설정합니다.
    - 장애 조치 후에 DB 인스턴스의 기본 IP 주소가 변경될 수 있습니다.
    - DNS 데이터를 장기간 캐시 하면 연결이 실패할 수 있습니다.
    - 애플리케이션이 더 이상 사용되지 않는 IP 주소에 연결을 시도 할 수 있습니다.

# Amazon RDS DB 인스턴스 구성

Amazon RDS DB 인스턴스를 설정하는 방법을 안내합니다.

## Amazon RDS DB 인스턴스 생성

Amazon RDS의 기본 빌딩 블록은 데이터 베이스를 생성하는 DB 인스턴스 입니다.
DB 인스턴스를 생성할 때는 엔진 고유의 특성을 선택합니다.

### DB 인스턴스의 네트워크 구성

가용 영역이 2개 이상 있는 AWS 리전에 있어야 하고, DB 인스턴스에 대해 선택한 DB 서브넷 그룹은 2개 이상의 가용 영역을 포함 해야 합니다.
- 해당 구성을 사용하게 된다면 DB 인스턴스를 생성할 때 다중 AZ 배포를 구성하거나 향후 쉽게 DB 인스턴스로 이동할 수 있습니다.


### EC2 인스턴스와 자동 네트워크 연결 구성

![Pasted-image-20250410102433.png](/img/이미지 창고/Pasted-image-20250410102433.png)

만약 자동으로 컴퓨팅 리소스에 연결을 선택한다면 RDS가 다음 옵션을 자동으로 설정합니다.

|   |   |
|---|---|
|**콘솔 옵션**|**자동 설정**|
|네트워크 유형|RDS는 네트워크 유형을 IPv4로 설정합니다.<br /><br />현재 듀얼 스택 모드는 EC2 인스턴스와 DB 인스턴스 간의 연결을 설정할 때 지원되지 않습니다.|
|VPC(Virtrual Private Cloud)|RDS는 VPC를 EC2 인스턴스와 연결된 VPC로 설정합니다.|
|DB 서브넷 그룹|RDS에는 EC2 인스턴스와 동일한 가용 영역에 Private Subnet이 있는 DB 서브넷 그룹이 필요합니다.<br /><br />이 요구 사항을 충족하는 DB 서브넷 그룹이 있다면 RDS는 기존 DB 서브넷 그룹을 사용합니다.<br /><br />기본적으로 이 옵션은 자동 설정으로 되어있습니다.<br /><br />만약 요구 사항을 충족하는 서브넷 그룹이 없다면,<br /><br />1. RDS는 가용 영역 중 하나가 EC2 인스턴스와 동일한 3개의 가용 영역에서 3개의 사용 가능한 Private Subnet을 사용합니다.<br />    <br />2. Private Subnet을 사용할 수 있는 경우 RDS는 Subnet과 연결된 Routing Table을 사용하고 생성된 모든 Subnet을 이 Routing Table에 추가합니다<br />    <br />3. Private Subnet을 사용할 수 없는 경우 RDS는 인터넷 게이트웨이 액세스가 없는 라우팅 테이블을 생성하고 생성한 서브넷을 라우팅 테이블에 추가합니다.<br />    <br />4. RDS를 사용하면 기존 DB Subnet Group도 사용할 수 있습니다. 선택한 기존 DB Subnet Group을 사용하려면 Choose existing(기존 항목 선택)을 선택합니다.|
|Public Access|RDS는 DB 인스턴스에 공개적으로 액세스 할 수 없도록 합니다.<br /><br />보안을 위해 DB를 비공개로 유지하고 인터넷에서 액세스 할 수 없도록 하는 것이 가장 좋습니다.|
|VPC 보안 그룹(방화벽)|RDS는 DB 인스턴스와 연결된 새 Security Group을 생성합니다.<br /><br />보안 그룹의 이름은 `rds-ec2-n`이며, 여기서 n은 숫자입니다.<br /><br />이 보안 그룹에는 EC2 VPC Security Group 이 소스인 인바운드 규칙이 포함됩니다.<br /><br />DB 인스턴스와 연결된 이 보안 그룹을 통해 EC2 인스턴스가 DB 인스턴스에 액세스할 수 있습니다.<br /><br />RDS는 EC2 인스턴스와 연결된 새 Security Group도 생성합니다.<br /><br />Security Group의 이름은 `ec2-rds-n`이며, 여기서 n은 숫자입니다.<br /><br />이 Security Group에는 DB 인스턴스의 VPC 보안 그룹을 소스로 하는 아웃바운드 규칙이 포함됩니다.<br /><br />이 보안 그룹을 사용하면 EC2 인스턴스가 DB 인스턴스로 트래픽을 보낼 수 있습니다.|
|가용 영역|#### 단일 AZ 배포 환경<br /><br />가용성 및 내구성(단일 AZ 배포)에서 단일 DB 인스턴스를 선택한 경우 **RDS**는 **EC2 인스턴스**의 **가용 영역을 선택**합니다.<br /><br />#### 다중 AZ DB 인스턴스 배포<br /><br />RDS는 배포에서 단일 DB 인스턴스에 대해 EC2 인스턴스의 가용 영역을 선택합니다.<br /><br />RDS는 **다른 DB 인스턴스**에 대해 **서로 다른 가용 영역을 임의로 선택**합니다.<br /><br />**기본 DB 인스턴스** 또는 **대기 복제본**은 **EC2 인스턴스와 동일한 가용 영역**에서 생성됩니다.<br /><br />다중 AZ DB 인스턴스를 선택할 때 **DB 인스턴스**와 **EC2 인스턴스가 서로 다른 가용 영역**에 있는 경우 **교차 가용 영역 비용**이 발생할 가능성이 있습니다.|

### 네트워크 수동 구성

추후에 추가 할 예정입니다.

## DB 인스턴스 생성

상단 RDS 생성 편에서 나왔던 간편 생성은 콘솔로도 가능하지만, AWS CLI도 사용할 수 있습니다.

해당 AWS CLI 옵션과 설정 세부사항에 대한 표를 아래에 있습니다.

추후에 추가할 예정입니다.

|   |   |   |   |
|---|---|---|---|
|**콘솔 설정**|**설정 설명**|**CLI 옵션 및 RDS API 파라미터**|**지원되는**<br /><br />**DB 엔진**|
|할당된 스토리지|DB 인스턴스에 할당할 스토리지 양(기가바이트 단위)입니다.<br /><br />경우에 따라 DB 인스턴스에 대해 데이터베이스의 크기보다,<br /><br />많은 양의 스토리지를 할당하면 I/O 성능을 개선할 수 있습니다.|**CLI 옵션**<br /><br />`--allocated-storage`<br /><br />#### **API 파라미터**<br /><br />`AllocatedStorage`|ALL|
|아키텍처 설정|#### 데이터베이스의 아키텍처<br /><br />CDB(단일 테넌트) 또는 비 CDB입니다.<br /><br />**Oracle Database 21c**는 CDB 아키텍처만 사용합니다.<br /><br />**Oracle Database 19c**는 CDB 또는 비 CDB 아키텍처를 사용할 수 있습니다.<br /><br />**Oracle Database 19c 이전**의 릴리스는 비 CDB만 사용합니다.<br /><br />#### 멀티테넌트 아키텍처<br /><br />RDS for Oracle에서 **컨테이너 데이터베이스**(CDB)가 생성됩니다.<br /><br />이 CDB에는 플러그형 데이터베이스(PDB) 1개가 포함됩니다.<br /><br />이 **옵션을 선택하지 않으**면 RDS for Oracle에서 **비 CDB가 생성**됩니다.<br /><br />비 CDB에는 기존의 Oracle 아키텍처가 사용됩니다.|**CLI 옵션**<br /><br />`--engine oracle-ee-cdb` - 멀티테넌트<br /><br />`--engine oracle-se2-cdb` - 멀티테넌트<br /><br />`--engine oracle-ee` - 기존<br /><br />`--engine oracle-se2` - 기존<br /><br />**API 파라미터**<br /><br />`Engine`|Oracle|
|마이너 버전<br /><br />자동 업그레이드|DB 인스턴스가 선호하는 DB 엔진 버전 마이너 업그레이드를 사용할 수 있게 되면 **자동 마이너 버전 업그레이드**를 사용하도록 **설정**합니다.<br /><br />Amazon RDS는 유지 관리 기간에 자동 마이너 버전 업그레이드를 수행합니다.|**CLI 옵션**<br /><br />`--auto-minor-version-upgrade`<br /><br />`--no-auto-minor-version-upgrade`<br /><br />**API 파라미터**<br /><br />`AutoMinorVersionUpgrade`|ALL|
|가용 영역|DB 인스턴스의 가용 영역입니다. 가용 영역을 지정하지 않으려면,<br /><br />기본값으로 No Preference를 사용합니다.|**CLI 옵션**<br /><br />`--availability-zone`<br /><br />**API 파라미터**<br /><br />`AvailabilityZone`|ALL|
|AWS KMS key|암호화를 암호화 활성화로 설정한 경우에만 사용할 수 있습니다.<br /><br />이 DB 인스턴스를 암호화하는 데 사용할 AWS KMS key를 선택합니다.|**CLI 옵션**<br /><br />`--kms-key-id`<br /><br />**API 파라미터**<br /><br />`KmsKeyId`|ALL|
|백업 복제|재해 복구를 위해 추가 리전에 백업을 생성하려면<br /><br />**다른 AWS 리전에서 복제 활성화**(Enable replication in another AWS Region)를 선택합니다.  <br />그런 다음 **추가 백업을 위한 대상 리전**(Destination Region)을 선택합니다.|DB 인스턴스를 생성할 때는 사용할 수 없습니다.|Oracle  <br />PostgreSQL  <br />SQL Server|
|백업 보관 기간|DB 인스턴스의 **자동 백업을 보존할 기간**(단위: **일**)입니다.<br /><br />중요한 DB 인스턴스라면 이 값을 1 이상으로 설정합니다.|**CLI 옵션**<br /><br />`--backup-retention-period`<br /><br />**API 파라미터**<br /><br />`BackupRetentionPeriod`|ALL|
|백업 대상|AWS 클라우드를 선택하여 자동 백업 및 수동 스냅샷을 상위 AWS 리전에 저장합니다.<br /><br />Outposts(온프레미스)(Outposts (on-premises))를 선택하여 Outpost에 로컬로 저장합니다.|**CLI 옵션**<br /><br />`--backup-target`<br /><br />**API 파라미터**<br /><br />`BackupTarget`|MySQL, PostgreSQL, SQL Server|
|백업 기간|Amazon RDS가 **자동**으로 **DB 인스턴스를 백업**하는 **기간**입니다.<br /><br />데이터베이스를 백업할 특정 기간을 지정하지 않으려면 기본값으로 기본 설정 없음을 사용합니다.|**CLI 옵션**<br /><br />`--preferred-backup-window`<br /><br />**API 파라미터**<br /><br />`PreferredBackupWindow`|ALL|
|인증 기관|**DB 인스턴스**에서 사용하는 **서버 인증서의 CA(인증 기관)**입니다.|**CLI 옵션**<br /><br />`--preferred-backup-window`<br /><br />**API 파라미터**<br /><br />`PreferredBackupWindow`|ALL|
|문자 집합|DB 인스턴스에 대한 문자 세트입니다.<br /><br />DB 문자 집합에 대한 기본값 `AL32UTF8`은 Unicode 5.0 UTF-8 Universal 문자 집합을 나타냅니다.<br /><br />DB 인스턴스를 생성한 후에는 DB 문자 집합을 변경할 수 없습니다.  <br />단일 테넌트 구성에서 **기본이 아닌 DB 문자 집합**은 **CDB가 아니라 PDB에만 영향**을 줍니다.|**CLI 옵션**<br /><br />`--character-set-name`<br /><br />**API 파라미터**<br /><br />`CharacterSetName`|Oracle|
|스냅샷으로 태그 복사|이 옵션은 스냅샷을 생성할 때 DB 인스턴스 태그를 DB 스냅샷에 복사합니다.|**CLI 옵션**<br /><br />`--copy-tags-to-snapshot`<br /><br />`--no-copy-tags-to-snapshot`<br /><br />**API 파라미터**<br /><br />`CopyTagsToSnapshot`|ALL|
|데이터베이스<br /><br />인증|데이터베이스 암호로만 데이터베이스 사용자를 인증할 수 있도록<br /><br />Password authentication(암호 인증)을 선택합니다.<br /><br />사용자 및 역할을 통해 **데이터베이스 암호 및 사용자 자격 증명**으로 **데이터베이스 사용자를 인증**할 수 있도록 Password and IAM DB authentication(암호 및 IAM DB 인증)을 선택합니다.<br /><br />**AWS Managed Microsoft AD**로 생성한 **AWS Directory Service**를 통해 **데이터베이스 암호** 및 **Kerberos 인증**으로 데이터베이스 사용자를 인증할 수 있도록 [암호 및 Kerberos 인증(Password and Kerberos authentication)]을 선택합니다. 그다음에는 디렉터리를 선택하거나 새 디렉터리 생성을 선택합니다.|**IAM**<br /><br />**CLI 옵션**<br /><br />`--enable-iam-database-authentication`<br /><br />`--no-enable-iam-database-authentication`<br /><br />**RDS API 파라미터**<br /><br />`EnableIAMDatabaseAuthentication`<br /><br />**Kerberos**<br /><br />**CLI 옵션**<br /><br />`--domain`<br /><br />`--domain-iam-role-name`<br /><br />**RDS API 파라미터**<br /><br />`Domain`<br /><br />`DomainIAMRoleName`|인증 유형에 따라 다름|
|데이터베이스<br /><br />관리 유형|환경을 **사용자 지정할 필요**가 **없는 경우** Amazon RDS를 선택합니다.  <br />데이터베이스, OS 및 인프라를 사용자 지정하려는 경우 Amazon RDS Custom을 선택합니다.|CLI 및 API의 경우 데이터베이스 엔진 유형을 지정합니다.|Oracle  <br />SQL Server|
|데이터베이스<br /><br />포트|DB 인스턴스에 액세스하는 데 사용할 포트입니다.<br /><br />기본 포트가 표시됩니다<br /><br />**Note**<br /><br />- 방화벽이 기본 MariaDB, MySQL 및 PostgreSQL 포트에 대한 연결을 차단합니다.<br />    <br />- 기업 방화벽이 기본 포트를 차단할 경우 DB 인스턴스에 다른 포트를 입력해야 합니다.|**CLI 옵션**<br /><br />`--port`<br /><br />**API 파라미터**<br /><br />`Port`|ALL|
|DB 엔진 버전|사용할 데이터베이스 엔진의 버전입니다.|**CLI 옵션**<br /><br />`--engine-version`<br /><br />**API 파라미터**<br /><br />`EngineVersion`|ALL|
|DB 인스턴스 클래스|DB 인스턴스에 대한 구성입니다.<br /><br />예를 들어,<br /><br />**db.t3.small DB** 인스턴스 클래스에는 2GiB 메모리, vCPU 2개, 가상 코어 1개, 가변 ECU 1개, 중간 정도의 I/O 용량이 있습니다.|**CLI 옵션**<br /><br />`--db-instance-class`<br /><br />**API 파라미터**<br /><br />`DBInstanceClass`|ALL|
|DB 인스턴스 식별자|DB 인스턴스의 이름입니다.<br /><br />- 최대 63자의 영숫자 문자를 포함할 수 있으며, 선택한 AWS 리전의 계정에 대해 고유|**CLI 옵션**<br /><br />`--db-instance-identifier`<br /><br />**API 파라미터**<br /><br />`DBInstanceIdentifier`|ALL|
|DB 파라미터<br /><br />그룹|DB 인스턴스의 파라미터 그룹입니다.<br /><br />**기본 파라미터 그룹을** 사용하거나<br /><br />**사용자 지정 파라미터 그룹**을 생성할 수 있습니다.|**CLI 옵션**<br /><br />`--db-parameter-group-name`<br /><br />**API 파라미터**<br /><br />`DBParameterGroupName`|ALL|
|DB 서브넷 그룹|DB 클러스터에 사용할 DB 서브넷 그룹입니다.<br /><br />기존 DB 서브넷 그룹을 사용하려면Choose existing(기존 항목 선택)을 선택합니다.<br /><br />그런 다음 Existing DB subnet groups(기존 DB 서브넷 그룹) 드롭다운 목록에서 필요한 서브넷 그룹을 선택합니다.|**CLI 옵션**<br /><br />`--db-subnet-group-name`<br /><br />**API 파라미터**<br /><br />`DBSubnetGroupName`|ALL|
|삭제 방지|DB 인스턴스가 삭제되지 않도록 방지하려면, 삭제 방지를 활성화합니다.<br /><br />**AWS Management Console**을 **사용**하여 프로덕션 **DB 인스턴스를 생성할 경우 기본적**으로 **삭제 방지가 활성화됩니다.**|**CLI 옵션**<br /><br />`--deletion-protection`<br /><br />`--deletion-protection`<br /><br />**API 파라미터**<br /><br />`DeletionProtection`||
|암호|이 DB 인스턴스에 대해 유휴 암호화를 활성화하기 위한 [Enable Encryption].|**CLI 옵션**<br /><br />`--db-instance-identifier`<br /><br />**API 파라미터**<br /><br />`DBInstanceIdentifier`||

→ 추후에 옵션을 더 추가할 예정입니다.

# 다중 AZ 배포 구성 및 관리

다중 AZ 배포에는 **대기 인스턴스**가 하나 또는 두개 있을 수도 있습니다.

**배포에 하나**의 **대기 DB 인스턴스가** 있는 경우 다중 AZ DB 인스턴스 배포라고 합니다.

## 다중 AZ DB 인스턴스 배포

Amazon RDS는 단일 대기 DB 인스턴스와 함께 다중 AZ 배포를 사용하여 DB 인스턴스에 대한 고가용성 및 장애 조치 지원을 제공합니다. 이러한 유형의 배포를 다중 AZ DB 인스턴스 배포라고 합니다.

![Pasted-image-20250410102451.png](/img/이미지 창고/Pasted-image-20250410102451.png)

다중 AZ DB 인스턴스 배포에서 Amazon RDS는 자동으로 **서로 다른 가용 영역**에 **동기식 대기 복제본**을 **프로비저닝**하고 유지합니다.

프라이머리 DB 인스턴스는 **전체 가용 영역**에서 **대기 복제본으로 동기식으로 복제**되어 **시스템 백업 중에 데이터 이중화**를 제공하고 **대기 시간 급증을 최소화**합니다.

DB 인스턴스를 고가용성으로 실행하면 계획된 **시스템 유지 관리 중 가용성**을 높일 수 있습니다.

:::warning 고가용성 옵션은 읽기 전용 시나리오에서는 **확장 솔루션이 아닙**니다.
- 대기 복제본을 사용하여 **읽기 트래픽을 처리할 수 없습**니다.

:::

**다중 AZ DB 인스턴스 배포**를 사용하는 DB 인스턴스는 단일 AZ 배포에 비해 쓰기 및 **커밋 대기 시간이 길어질** 수 있습니다.

→ 이러한 현상은 **동기식 데이터 복제**가 **발생**하기 때문에 일어날 수 있습니다.

AWS는 가용 영역 간 지연 시간이 짧은 네트워크 연결을 제공하도록 설계되었지만 **배포**가 **예비 복제본으로 장애 조치**될 경우 **지연 시간이 변경**될 수 있습니다.

프로덕션 워크로드의 경우 빠르고 일관된 성능을 제공할 수 있도록 프로비저닝된 IOPS(초당 입/출력 작업)를 사용하는 것이 좋습니다.

## 다중 AZ DB 인스턴스 배포가 되도록 DB 인스턴스 수정

:::note 단일 AZ 배포에서 DB인스턴스가 있고, 이를 다중 AZ DB 인스턴스 배포(Amazon Aurora 이외 엔진 용)로 수정하는 경우 아래와 같은 단계를 거쳐야 한다.

:::

1. 기본 DB 인스턴스의 **Amazon Elastic Block Store(EBS) 볼륨**의 **스냅샷**을 만듭니다.
2. 스냅샷에서 **스탠바이 복제본용 새 볼륨**을 **생성**합니다.
    1. 이러한 볼륨은 **백그라운드에서 초기화**되며 데이터가 완전히 **초기화된 후에 최대 볼륨 성능**이 **달성**됩니다.
3. **기본 복제본**과 **대기 복제본**의 볼륨 간의 **동기 블록 수준 복제**를 켭니다.

:::warning 스냅샷을 사용하여 대기 인스턴스를 생성하면
- 단일 AZ -> 다중 AZ로 변환할 때 **가동 중지 시간**을 피할 수 있지만
- 다중 AZ로 **변환하는 동안**과 **후**에 **성능에 영향**을 미칠 수 있습니다.
- 이는 **쓰기 대기 시간**에 **민감한** **워크로드에 상당한 영향**을 미칠 수 있습니다.  
- 이 기능을 사용하면 스냅샷에서 **대용량 볼륨을 신속**하게 **복원**할 수 있지만, 이로 인해 **동기식 복제로 인해 I/O 작업**의 **지연 시간**이 상당히 증가할 수 있습니다.
- 이러한 지연 시간은 데이터베이스 성능에 영향을 줄 수 있습니다.
- 모범 사례로서 **프로덕션 DB 인스턴스**에서는 **다중 AZ 변환을 수행**하지 않는 것이 **좋습니다**.  
- 현재 민감한 워크로드를 처리하는 **DB 인스턴스의 성능 영향**을 피하려면 **읽기 전용 복제본**을 만들고 **읽기 전용 복제본에서 백업**을 **활성화**해야 합니다.
- **읽기 전용 복제본**을 **다중 AZ로 변환**하고 읽기 전용 복제본의 볼륨(두 AZ 모두에서)에 **데이터를 로드하는 쿼리**를 **실행**합니다.

:::

## Amazon RDS 장애 조치 프로세스

계획되거나 계획되지 않은 DB 인스턴스의 운영 중단으로 인해 **인프라 장애**가 발생한 경우, 다중 AZ를 설정하면 Amazon RDS는 **자동으로 다른 가용 영역**의 **대기 복제본으로 전환**됩니다.
장애 조치가 완료되는 데 소요되는 시간은 **프라이머리 DB 인스턴스**를 **사용할 수 없게 된 시점**의 데이터베이스 활동 및 기타 조건에 따라 **달라**집니다.

- 장애 조치에 소요되는 시간은 **일반적으로 60–120초**입니다.
- 그러나 트랜잭션의 규모가 크거나 복구 프로세스가 복잡한 경우 장애 조치에 소요되는 시간이 증가할 수 있습니다.
- 장애 조치가 완료되면 RDS 콘솔에 새 가용 영역이 반영되는 데 시간이 더 걸릴 수 있습니다.


:::note Amazon RDS는 **자동으로 장애 조치**를 취하여 **관리자의 개입 없이** 데이터베이스 작업을 **신속하게 재개**할 수 있도록 합니다.

:::

아래의 설명된 조건 중 하나가 발생되면 자동으로 예비 복제본으로 기본 DB 인스턴스가 전환됩니다.

|장애 조치 이유|설명|
|---|---|
|RDS 데이터베이스 인스턴스 기반의 운영 체제가 오프라인 작업에서 패치되고 있습니다.|OS 패치 또는 보안 업데이트를 위한 유지 관리 기간 동안 장애 조치가 트리거되었습니다.|
|RDS 다중 AZ 인스턴스의 기본 호스트가 비정상입니다.|다중 AZ DB 인스턴스 배포에서 손상된 프라이머리 DB 인스턴스를 감지하여 장애 조치를 수행했습니다.|
|네트워크 연결 손실로 인해 RDS 다중 AZ 인스턴스의 기본 호스트에 연결할 수 없습니다.|RDS 모니터링이 기본 DB 인스턴스에 대한 네트워크 연결 실패를 감지하여 장애 조치를 트리거했습니다.|
|RDS 인스턴스를 고객이 수정했습니다.|RDS DB 인스턴스 수정 때문에 장애 조치가 트리거되었습니다.|
|RDS 다중 AZ 기본 인스턴스가 사용 중이며 응답하지 않습니다.|기본 DB 인스턴스가 응답하지 않습니다. 다음을 수행하는 것이 좋습니다.<br /><br />- 이벤트 및 CloudWatch 로그에서 과도한 CPU, 메모리 또는 스왑 공간 사용량을 검사합니다.<br />    <br />- 워크로드를 평가하여 적절한 DB 인스턴스 클래스를 사용 중인지 확인합니다.<br />    <br />- 실시간 운영 체제 지표에 대해 향상된 모니터링을 사용합니다.<br />    <br />- 성능 개선 도우미를 사용하면 DB 인스턴스의 성능에 영향을 미치는 문제를 분석할 수 있습니다.|
|RDS 다중 AZ 인스턴스의 기본 호스트 기반의 스토리지 볼륨에 오류가 발생했습니다.|다중 AZ DB 인스턴스 배포가 프라이머리 DB 인스턴스에서 스토리지 문제를 감지하여 장애 조치를 수행했습니다.|
|사용자가 DB 인스턴스의 장애 조치를 요청했습니다.|사용자가 DB 인스턴스를 재부팅하고 장애 조치를 사용하여 재부팅을 선택했습니다.|

# 다중 AZ DB 클러스터 배포

다중 AZ DB 클러스터 배포는 읽을 수 있는 **대기 DB 인스턴스**가 **두 개 있**는 **Amazon RDS의 반동기식 고가용성 배포 모드**입니다.

다중 AZ DB 클러스터에는 **동일한 AWS 리전**에 있는 **세 개의 개별 가용 영역에 Writer DB 인스턴스**와 **두 개의 Reader DB 인스턴스**가 있습니다.

다중 AZ DB 클러스터는 다중 AZ DB 인스턴스 배포에 비해 **고가용성**, **높은 읽기 워크로드 용량**, **낮은 쓰기 대기 시간**을 지원합니다.

## 다중 AZ DB 클러스터 개요

![Pasted-image-20250410102651.png](/img/이미지 창고/Pasted-image-20250410102651.png)

1. 다중 AZ DB 클러스터에서는 Amazon RDS가 DB 엔진의 네이티브 복제 기능을 사용하여 **Writer DB 인스턴스의 데이터**를 **두 Reader DB 인스턴스**로 **복제**합니다.
2. **Writer DB 인스턴스**가 **변경**되면 각 **Reader DB 인스턴스**로 **전송**됩니다.  
3. 다중 AZ DB 클러스터 배포에서는 **변경 사항을 커밋**하려면, **하나 이상의 Reader DB 인스턴스의 승인**을 받아야 하는 **반동기식 복제**를 사용합니다.
    1. 모든 복제본에서 이벤트가 완전히 실행되고 커밋 되었음을 승인하는 작업은 필요하지 않습니다.
4. Reader DB 인스턴스는 **자동 장애 조치 대상 역할**을 하며 **읽기 트래픽을 제공**하여 애플리케이션 **읽기 처리량을 높**입니다.
5. **Writer DB 인스턴스**에서 **중단**이 발생하는 경우 RDS는 어느 **Reader DB 인스턴스**가 **장애 조치 대상**이 되는지를 **관리**합니다.
6. RDS는 어느 **Reader DB 인스턴스**의 가장 **최근 변경 기록**을 **기준으로 이를 수행**합니다.
    

## 다중 AZ DB 클러스터의 제한

:::error 다중 AZ DB 클러스터는 **프로비저닝된 IOPS 스토리지**만 지원합니다.
- 단일 AZ DB 인스턴스 배포 또는 다중 AZ DB 인스턴스 배포를 **다중 AZ DB 클러스터**로 **변경할 수 없습**니다.
:::

    >	- 대신에 단일 AZ DB 인스턴스 배포 또는 다중 AZ DB 인스턴스 배포의 스냅샷을 **다중 AZ DB 클러스터로 복원**할 수는 있습니다.  
> - 다중 AZ DB 클러스터는 모든 수정이 DB 클러스터 수준에서 수행되므로 **DB 인스턴스 수준에서 수정을 지원하지 않**습니다.    
>- 다중 AZ DB 클러스터는 **다음 기능을 지원하지 않**습니다  
    >	- **Amazon RDS 프록시**
    >	- **IPv6 연결** 지원(듀얼 스택 모드)
    >	- Amazon **S3 버킷**으로 **다중 AZ DB 클러스터 스냅샷 데이터 내보내기**
    >	- **IAM DB 인증**
    >	- **Kerberos 인증**
    >	- **포트 수정**(**다중 AZ DB 클러스터**를 **특정 시점으로 복원**하고 **다른 포트 지정 가능)**
    >	- 옵션 그룹 수
    >	- Amazon S3 버킷에서 다중 AZ DB 클러스터 스냅샷 복원
    >	- 할당된 최대 스토리지를 설정하여 스토리지 자동 크기 조정 또는 수동으로 스토리지 크기 조정 가능
    >	- DB 클러스터 **중지 및 시작**
    >	- 다중 AZ DB 클러스터의 **스냅샷 복사**
    >	- 암호화되지 않은 다중 AZ DB **클러스터 암호화**
    >	- **MySQL용** 다중 AZ DB 클러스터용 RDS는 **외부 대상 데이터베이스로**의 **복제를 지원하지 않**습니다.
    >	- RDS for MySQL 다중 AZ DB 클러스터는 다음 시스템 저장 프로시저만 지원합니다.
        >		- `mysql.rds_rotate_general_log`
        >		- `mysql.rds_rotate_slow_log`
        >		- `mysql.rds_show_configuration`
    >	- RDS for MySQL Multi-AZ DB 클러스터는 다른 저장 프로시저를 지원하지 않습니다.
    >	- PostgreSQL 다중 AZ DB 클러스터용 RDS는 aws_s3, pg_transport, pglogical과 같은 PostgreSQL 확장을 지원하지 않습니다.
    >	- PostgreSQL 다중 AZ DB 클러스터용 RDS는 논리적 복제를 지원하지 않습니다.


# Amazon RDS 블루/그린 배포

## Amazon RDS 블루/그린 배포 개요

Amazon RDS **블루**/**그린** 배포를 사용하면 **관리형 데이터베이스 변경**을 위한 **블루**/**그린 배포**를 만들 수 있습니다.

**블루**/**그린** 배포는 **프로덕션 환경**을 **복사하는 스테이징 환경**을 만듭니다.

**블루**/**그린** 배포에서는 **블루 환경**이 현재 **프로덕션 환경**입니다.

**그린 환경**은 **스테이징 환경**입니다.

![Pasted-image-20250410102910.png](/img/이미지 창고/Pasted-image-20250410102910.png)

**스테이징 환경**은 논리적 복제를 사용하여 현재 **프로덕션 환경**과 계속 동기화됩니다.  
**프로덕션** 워크로드에 영향을 주지 않고 **그린 환경**에서 RDS DB 인스턴스 를 변경할 수 있습니다.

- 예를 들어 메이저 또는 마이너 DB 엔진 버전을 업그레이드하거나, 데이터베이스 파라미터를 변경하거나, 스테이징 환경 내 스키마를 변경할 수 있습니다.
    

**그린 환경**의 변경 사항을 철저하게 테스트할 수 있습니다.

준비가 되면 환경을 전환하여 **그린 환경**을 새로운 **프로덕션 환경**으로 승격할 수 있습니다.

- 전환은 일반적으로 1분도 걸리지 않으며 데이터 손실이 발생하지 않고 애플리케이션을 변경할 필요도 없습니다.
    

![Pasted-image-20250410102918.png](/img/이미지 창고/Pasted-image-20250410102918.png)

**그린 환경**은 **프로덕션 환경** 토폴로지의 복사본이므로, **그린 환경**에는 DB 인스턴스에서 사용하는 기능이 포함됩니다.

→ 대표적인 기능은 읽기 전용 복제본, 스토리지 구성, DB 스냅샷, 자동 백업, 성능 개선 도우미와 확장 모니터링입니다.

**블루** DB 인스턴스가 다중 AZ DB 인스턴스 배포인 경우

**그린** DB 인스턴스도 다중 AZ DB 인스턴스 배포입니다.  
  

###### 출처 : AWS RDS 공식문서


---

#AWS #AWS_RDS  

---