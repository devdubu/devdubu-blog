---
slug: "Nexus-활용,-AWS-S3-연결"
---
# Nexus 설치
- Nexus를 설치하기 실습을 진행할 때는 AWS를 활용하여 설치를 한다.
- AWS S3를 연결하고 Blob Store 및 Repository를 생성한다.

## 준비 사항
- Nexus 서버용 AWS EC2 1개 VM 생성 및 접근 허용
	- Instance Type : t3.medium(2Core / 4GB Mem / 30GB EBS)
	- Security Group Inbound Role : 8081(Nexus), 22(SSH)
- Docker-CE 버전 설치 및 Docker 데몬 기동
- Nexus Repository용 S3 Bucket은 사전 불필요(Nexus 설정으로 자동 생성된다.)

https://github.com/DevOpsRunbook/FastCampus/tree/main/Appendix/AWS

### 사전 준비사항
- Linux 실습 환경에서 AWS 연동을 위한 설정을 수행
- AWS Configure를 Nexus 설치할 서버에 사전에 적용
