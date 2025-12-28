# AWS Lambda

## 1. Overview
**AWS Lambda** is a serverless compute service that runs your code in response to events and automatically manages the underlying compute resources.
- **Event-driven**: Triggered by changes in S3, DynamoDB tables, HTTP requests via API Gateway, etc.
- **Serverless**: No servers to provision or manage. You pay only for the compute time you consume.

### Core Concepts
- **Function**: A resource that you call to run your code.
- **Trigger**: A resource or configuration that invokes a Lambda function.
- **Event**: A JSON-formatted document containing data for the function to process.
- **Execution Environment**: A secure and isolated runtime environment that manages the processes and resources required to run the function.

---

## 2. Lifecycle & Performance

### Cold Start
When a function is invoked for the first time or after a period of inactivity, Lambda initializes a new execution environment (container). This latency is called a **Cold Start**.
- **Mitigation**:
    - **Keep-Warm**: Regularly invoke the function.
    - **Provisioned Concurrency**: Keeps a specified number of environments initialized and ready to respond immediately.

### Concurrency
Concurrency is the number of requests that your function is serving at any given time.
- **Reserved Concurrency**: Guarantees a specific number of concurrent instances for the function. Acts as a maximum limit.
- **Provisioned Concurrency**: Pre-nitializes environments to reduce cold start latency.

---

## 3. Configuration & Management

### Versions & Aliases
- **Versions**: Immutable snapshots of code and configuration. `$LATEST` is the mutable version.
- **Aliases**: Pointers to specific versions (e.g., `PROD` -> `v1`, `DEV` -> `$LATEST`). Useful for rolling out updates.

### Layers
A **Layer** is a ZIP archive that contains libraries, a custom runtime, or other dependencies.
- **Benefits**: separation of code and dependencies, smaller deployment packages, code reuse across functions.
- **Usage**: Extracted to `/opt` in the execution environment.

### Runtime Management
Lambda automatically patches the underlying runtime (OS, language runtime). You can control this via **Runtime Management Controls** to prevent breaking changes (Auto, Function Upgrade, or Manual rollback).

---

## 4. Helper Tools

### AWS SAM (Serverless Application Model)
An open-source framework for building serverless applications. It extends CloudFormation to provide a simplified syntax for defining serverless resources.

**Template Structure (`template.yaml`):**
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Resources:
  MyFunction:
    Type: AWS::Serverless::Function
    Properties:
      Handler: app.lambda_handler
      Runtime: python3.9
      Events:
        Api:
          Type: Api
          Properties:
            Path: /hello
            Method: get
```

### EFS Integration
Lambda can mount Amazon EFS file systems to access shared data across function invocations or concurrent configurations, overcoming the storage limit of `/tmp`.
