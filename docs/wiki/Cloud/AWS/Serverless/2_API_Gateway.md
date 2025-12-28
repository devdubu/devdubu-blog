# Amazon API Gateway

## 1. Overview
**Amazon API Gateway** is a fully managed service that makes it easy for developers to create, publish, maintain, monitor, and secure APIs at any scale.

### API Types
- **HTTP API**: Low-latency, low-cost API built for serverless workloads. Suitable for simple proxying to Lambda or HTTP endpoints.
- **REST API**: Feature-rich API (e.g., API keys, usage plans, request validation, WAF integration).
- **WebSocket API**: For real-time two-way communication (chat apps, dashboards).

---

## 2. Core Components

### Routes & Methods
- **Resource**: The URL path (e.g., `/users`).
- **Method**: HTTP verb (GET, POST, etc.).
- **Integration**: The backend that processes the request (Lambda, HTTP, Mock, AWS Service).

### Stages
A logical reference to a lifecycle state of your API (e.g., `dev`, `prod`).
- **Stage Variables**: Env vars that can be used in configuration (e.g., dynamic backend endpoints).
- **Canary Deployment**: Allows gradual rollout of changes.
    - Route traffic to a new version (Canary) for a small percentage of users (e.g., 10%).
    - Monitor metrics and promote to production if successful.

---

## 3. Features & Security

### Rate Limiting (Throttling)
Protects backend systems from traffic spikes.
- **Token Bucket Algorithm**:
    - **Burst**: Max number of concurrent requests allowed.
    - **Rate**: Number of requests added to the token bucket per second.
- **Leaky Bucket**: Smooths out bursty traffic.

### CORS (Cross-Origin Resource Sharing)
Allows restricted resources on a web page to be requested from another domain.
- **Preflight Request**: Browser sends an `OPTIONS` request to check permissions (`Access-Control-Allow-Origin`).
- **API Gateway Support**: Can be enabled via the console to automatically add necessary headers.

### Authentication & Authorization
- **Lambda Authorizer**: A Lambda function that controls access to the API.
    - **Token-based**: Validates a Bearer token (JWT, OAuth).
    - **Request-based**: Validates headers, query strings, parameters.
- **Cognito User Pools**: integration for mobile/web app users.
- **IAM**: AWS Sign v4 authentication.

---

## 4. Lambda Authorizer Workflow
1. Client calls API with a Bearer Token (Header).
2. API Gateway invokes the **Lambda Authorizer** function.
3. Lambda verifies the token (signature, expiration, claims).
4. Lambda returns an IAM Policy (Allow/Deny) and optional context.
5. API Gateway enforces the policy and forwards the request to the backend if allowed.
