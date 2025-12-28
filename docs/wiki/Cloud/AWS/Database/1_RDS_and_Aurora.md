# Amazon RDS & Aurora

## 1. Amazon RDS Overview
**Amazon RDS (Relational Database Service)** is a managed web service that makes it easy to set up, operate, and scale a relational database in the AWS Cloud. It provides cost-efficient and resizable capacity while automating time-consuming administration tasks such as hardware provisioning, database setup, patching, and backups.

### Managed Service Benefits (RDS vs EC2)
RDS offloads much of the operational burden compared to running a database on EC2.

| Feature | Managed by EC2 (Self-Managed) | Managed by RDS |
| :--- | :--- | :--- |
| **Application Optimization** | Customer | Customer |
| **Scalability** | Customer | **AWS** |
| **High Availability** | Customer | **AWS** |
| **Backups** | Customer | **AWS** |
| **Software Patching** | Customer | **AWS** |
| **DB Software Install** | Customer | **AWS** |
| **OS Patching** | Customer | **AWS** |
| **Server Maintenance** | AWS | AWS |

### Supported DB Engines
RDS supports major relational database engines:
- **Open Source**: MariaDB, MySQL, PostgreSQL
- **Commercial**: Oracle, SQL Server
- **Cloud Native**: **Amazon Aurora** (MySQL & PostgreSQL compatible)

### DB Instance Components
- **DB Instance Class**: Determines compute (vCPU) and memory capacity.
- **Storage**: Amazon EBS volumes.
    - **General Purpose (SSD)**: Balanced performance/cost.
    - **Provisioned IOPS (SSD)**: High performance for I/O intensive loads.
    - **Magnetic**: Legacy/Low cost.

---

## 2. High Availability & Scalability

### Multi-AZ Deployment (High Availability)
Synchronous replication to a standby instance in a different Availability Zone (AZ).
- **Purpose**: Disaster Recovery (DR) and High Availability. **Not for scaling reads.**
- **Failover**: Automatic failover (typically 60-120s) if the primary fails (OS patch, host failure, network loss).
- **Performance**: Writes may have slightly higher latency due to synchronous replication.

### Multi-AZ DB Cluster
A deployment with **one writer** and **two readable standbys** in three separate AZs.
- **Benefits**: Faster failover (typically <35s), lower write latency (semi-synchronous), and provides readable standbys for read scaling.

### Read Replicas (Scalability)
Asynchronous replication to read-only instances.
- **Purpose**: Scale out read-heavy workloads.
- **Features**: 
    - Can be promoted to a standalone DB.
    - Cross-Region replication supported.
    - Supported for MariaDB, MySQL, Oracle, PostgreSQL, and Aurora.

---

## 3. Amazon Aurora
(While not detailed separately in the source, Aurora is a key part of the RDS family, offering high performance and automatic storage scaling up to 128TB, with 6-way replication across 3 AZs.)

---

## 4. Maintenance & Operations

### Backup & Restore
- **Automated Backups**: Retention period (1-35 days). Point-in-time recovery.
- **Manual Snapshots**: User-initiated backups stored indefinitely until deleted.

### Monitoring
- **CloudWatch**: Monitor CPU, Memory, Storage, Replica Lag.
- **Enhanced Monitoring**: Real-time OS metrics.
- **Performance Insights**: Analyze database load and performance bottlenecks.

### Blue/Green Deployments
A safe way to update databases by creating a staging environment that mirrors production.
1.  **Blue (Production)** environment is replicated to **Green (Staging)** using logical replication.
2.  Make changes (e.g., major version upgrade, schema change) on Green.
3.  Test Green environment.
4.  **Switchover**: Promote Green to Production (typically <1 min downtime).

---

## 5. Security & Best Practices
- **VPC**: Always deploy in Private Subnets. Use Security Groups to restrict access (e.g., allow port 3306 only from App Server SG).
- **IAM**: Manage access to RDS API. Use IAM Database Authentication for password-less DB access (MySQL/PostgreSQL).
- **Encryption**: Enable encryption at rest (KMS) and in transit (SSL/TLS).
- **Least Privilege**: Grant necessary permissions only.

### Connection Example
To connect to an RDS instance (e.g., MariaDB/MySQL) from an EC2 instance:
```bash
# Install client
sudo dnf install mariadb105

# Connect using Endpoint
mysql -h <RDS_ENDPOINT> -P 3306 -u <USERNAME> -p
```
