# AWS CodeSeries (CI/CD)

## 1. AWS CodeBuild
**AWS CodeBuild** is a fully managed build service that compiles source code, runs tests, and produces software packages that are ready to deploy.

### Build Concepts
- **Build Project**: Defines how CodeBuild runs a build, including source code location, build environment, build commands, and where to store output.
- **Build Environment**: The operating system, programming language runtime, and tools used to run the build (Docker container).
- **BuildSpec**: A YAML file (`buildspec.yml`) containing build commands and settings.

### `buildspec.yml` Structure
Must be located in the root of the source code.

```yaml
version: 0.2

phases:
  install:
    runtime-versions:
      java: corretto11
    commands:
      - echo Installing dependencies...
  pre_build:
    commands:
      - echo Logging in to Amazon ECR...
  build:
    commands:
      - echo Build started on `date`
      - mvn install
  post_build:
    commands:
      - echo Build completed on `date`
      - echo Pushing the Docker image...

artifacts:
  files:
    - target/my-app.jar
  discard-paths: yes
```

- **Phases**: `install` (dependencies), `pre_build` (setup), `build` (compile/test), `post_build` (packaging/pushing).
- **Artifacts**: Output files sent to S3 or used by the next stage in CodePipeline.

---

## 2. AWS CodeDeploy
**AWS CodeDeploy** automates code deployments to any instance, including EC2 instances and on-premises servers, as well as serverless Lambda functions and ECS services.

### Deployment Types
- **In-place Deployment**: Updates the application on existing instances. The application is stopped, updated, and restarted. (EC2/On-premises only).
- **Blue/Green Deployment**:
    - **EC2**: Provisions a new set of instances (Green), installs the new version, and switches traffic.
    - **ECS/Lambda**: Traffic is shifted from the original task set/version (Blue) to the new replacement set/version (Green).

### Components
- **Application**: Unique identifier for the application.
- **Deployment Group**: Defines **where** to deploy (e.g., EC2 tags, Auto Scaling Group) and **how** (Deployment Config).
- **AppSpec File** (`appspec.yml` or `appspec.json`): Defines the deployment actions.

### `appspec.yml` Example (EC2/Linux)
```yaml
version: 0.0
os: linux
files:
  - source: /
    destination: /var/www/html/
hooks:
  BeforeInstall:
    - location: scripts/install_dependencies.sh
      timeout: 300
  AfterInstall:
    - location: scripts/change_permissions.sh
  ApplicationStart:
    - location: scripts/start_server.sh
  ValidateService:
    - location: scripts/verify_server.sh
```

### ECS Deployment Lifecycle
1.  **BeforeInstall**: (Lambda Hook)
2.  **Install**: Creates replacement task set.
3.  **AfterInstall**: (Lambda Hook)
4.  **AllowTestTraffic**: Routes traffic to Test Listener.
5.  **AfterAllowTestTraffic**: (Lambda Hook - e.g., run integration tests)
6.  **AllowTraffic**: Routes production traffic to replacement task set.
7.  **AfterAllowTraffic**: (Lambda Hook)

---

## 3. AWS CodePipeline
**AWS CodePipeline** is a fully managed continuous delivery service that helps you automate your release pipelines for fast and reliable application and infrastructure updates.

### Pipeline Structure
- **Source Stage**: Detects changes in source (GitHub, CodeCommit, S3, ECR).
- **Build Stage**: Compiles and tests code (CodeBuild, Jenkins).
- **Deploy Stage**: Deploys code to environments (CodeDeploy, Elastic Beanstalk, ECS, S3).
- **Transitions**: Connections between stages. Can be disabled to pause the pipeline.
- **Artifacts**: Files passed between stages (e.g., Source Output -> Build Input).

### Key Concepts
- **Artifact Store**: S3 bucket used to store artifacts passed between stages.
- **Manual Approval**: A pause in the pipeline waiting for human approval before proceeding (e.g., before deploying to Prod).

### DevOps Workflow Example
1.  **Source**: Developer pushes code to GitHub. CodePipeline detects change.
2.  **Build**: CodeBuild pulls source, runs tests, builds Docker image, pushes to ECR.
3.  **Deploy (Staging)**: CodeDeploy deploys new image to ECS Staging Cluster.
4.  **Test**: Automated integration tests run against Staging.
5.  **Approval**: Manual approval required to proceed.
6.  **Deploy (Prod)**: CodeDeploy deploys to ECS Production Cluster.
