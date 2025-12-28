# Serverless Architecture & Patterns

## 1. Serverless Concepts
**Serverless** means you don't manage the underlying infrastructure (servers, OS, patching).
- **FaaS (Function as a Service)**: Event-driven computing (AWS Lambda). Charges per execution/millisecond.
- **BaaS (Backend as a Service)**: Managed backend services (Firebase, Cognito, DynamoDB).

### Benefits
- **No Infra Management**: Focus on code.
- **Auto-scaling**: Scales to zero and up to thousands of concurrent requests.
- **Cost**: Pay-per-use model.

---

## 2. AWS Step Functions (Orchestration)
**AWS Step Functions** is a visual workflow service to orchestrate microservices.

### Key States
- **Task**: Perform some work (invoke Lambda, call API).
- **Choice**: Branching logic based on input (If/Else).
- **Parallel**: Execute branches in parallel.
- **Map**: Iterate over a list of items (Dynamic Parallelism).
- **Wait**: Delay execution.
- **Pass**: Pass input to output (mocks/debugging).

### Use Cases
- **Orchestration**: Chaining Lambdas in a specific order.
- **Error Handling**: Built-in Retry (exponential backoff) and Catch logic.
- **Long-running processes**: Workflows can run for up to 1 year (Standard).

---

## 3. Amazon DynamoDB (NoSQL Data)
**DynamoDB** is a fully managed, serverless, key-value NoSQL database designed for high performance at any scale.

### Core Components
- **Table**: Collection of data.
- **Item**: A single record (like a row).
- **Attribute**: A data element (like a column). No fixed schema (except keys).
- **Primary Key**:
    - **Partition Key (PK)**: Determines the partition (hash). Mandatory.
    - **Sort Key (SK)**: Sorts items within a partition. Optional.

### Indexes
- **LSI (Local Secondary Index)**: Same PK, different SK. Must be created at table creation.
- **GSI (Global Secondary Index)**: Different PK and SK. Can be created anytime.

### Features
- **DAX (DynamoDB Accelerator)**: Fully managed in-memory cache for microsecond latency.
- **DynamoDB Streams**: Captures time-ordered sequence of item-level modifications. often used to trigger Lambda (Event sourcing).
- **On-Demand Mode**: Auto-scaling capacity for unpredictable workloads.
- **Provisioned Mode**: Specified RCU/WCU for predictable workloads (cheaper).

---

## 4. Common Design Patterns

### API Gateway + Lambda + DynamoDB
The classic "Serverless Microservice" pattern.
1.  **API Gateway**: Exposes REST/HTTP endpoint.
2.  **Lambda**: Contains business logic, validates input, transforms data.
3.  **DynamoDB**: Stores persistent data.

### Event-Driven Architecture
Decoupling services using events.
- **S3 Trigger**: File upload -> Lambda (Image resizing).
- **DynamoDB Stream**: DB Change -> Lambda (Audit log / Replication).
- **SQS/SNS**: Async messaging between services.
