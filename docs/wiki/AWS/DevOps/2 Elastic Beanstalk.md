---

---

## 2. Platform & Docker Support
Elastic Beanstalk supports various platforms including Java, .NET, PHP, Node.js, Python, Ruby, Go, and **Docker**.

### Docker Deployments
Elastic Beanstalk makes it easy to deploy containerized applications.

#### Single Container Docker
- Runs a single Docker container per EC2 instance.
- Uses a `Dockerfile` or `Dockerrun.aws.json` (v1).

#### Multi-Container Docker (ECS Managed) (Legacy)
- Uses ECS to run multiple containers per instance.
- Uses `Dockerrun.aws.json` (v2).

#### Docker Configuration (`docker-compose.yml`)
- For **Amazon Linux 2** platforms, you can use `docker-compose.yml` to define multi-container applications.
- Supports pulling images from private repositories (e.g., Docker Hub, ECR).
    - Authentication requires a config file (e.g., `~/.docker/config.json`) uploaded to S3 and referenced in `Dockerrun.aws.json`.

---

## 3. Deployment & Scalability
- **Scaling**: Uses Auto Scaling Groups to scale out (add instances) or scale up (change instance type) based on metrics (CPU, Network I/O).
- **Load Balancing**: Distributes traffic across instances using Application Load Balancer (ALB) or Classic Load Balancer (CLB).

### Deployment Policies
Elastic Beanstalk provides several strategies to update applications:
- **All at once**: Deploys to all instances. Fastest, but downtime executes.
- **Rolling**: Deploys in batches. Application remains available, capacity is reduced during deployment.
- **Rolling with additional batch**: Launches new instances for the first batch, maintaining full capacity.
- **Immutable**: Launches a full set of new instances. If successful, terminates old ones. Best for safety.
- **Blue/Green**: Create a new Environment (Green), wait for it to be healthy, then swap CNAME URLs. Zero downtime, easy rollback.

---

## 4. Design Considerations
- **Statelessness**: Store sessions in ElastiCache or DynamoDB, not local disk, as instances are ephemeral.
- **External DB**: Decouple RDS from the environment for data persistence independent of the Beanstalk lifecycle.
- **SSL/TLS**: Configure SSL certificates (via ACM) on the Load Balancer to terminate encryption.
