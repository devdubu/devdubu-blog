---
slug: "AWS-CodeDeploy"
---
# ECS
## Front Container
### appspec.yaml
```yaml
version: 0.0
Resources:
  - TargetService:
      Type: AWS::ECS::Service
      Properties:
        TaskDefinition: "arn:aws:ecs:ap-northeast-2:882704992417:task-definition/stdweb-back-external-task:1"
        LoadBalancerInfo:
          ContainerName: "stdweb-back-external"
          ContainerPort: 8080
# Optional properties
        PlatformVersion: "LATEST"
        NetworkConfiguration:
          AwsvpcConfiguration:
            Subnets: ["subnet-1234abcd","subnet-5678abcd"]
            SecurityGroups: ["sg-12345678"]
            AssignPublicIp: "ENABLED"
        CapacityProviderStrategy:
          - Base: 1
            CapacityProvider: "FARGATE_SPOT"
            Weight: 2
          - Base: 0
            CapacityProvider: "FARGATE"
            Weight: 1
Hooks:
  - BeforeInstall: "LambdaFunctionToValidateBeforeInstall"
  - AfterInstall: "LambdaFunctionToValidateAfterInstall"
  - AfterAllowTestTraffic: "LambdaFunctionToValidateAfterTestTrafficStarts"
  - BeforeAllowTraffic: "LambdaFunctionToValidateBeforeAllowingProductionTraffic"
  - AfterAllowTraffic: "LambdaFunctionToValidateAfterAllowingProductionTraffic"
```

### taskdef.yaml
```json
{
    "containerDefinitions": [
        {
            "name": "stdweb-front",
            "image": "882704992417.dkr.ecr.ap-northeast-2.amazonaws.com/stdweb/front",
            "cpu": 0,
            "memory": 2048,
            "portMappings": [
                {
                    "name": "stdweb-front-8081-tcp",
                    "containerPort": 8081,
                    "hostPort": 8081,
                    "protocol": "tcp",
                    "appProtocol": "http"
                }
            ],
            "essential": true,
            "environment": [
                {
                    "name": "AGENT_ID",
                    "value": "stdweb-vue"
                },
                {
                    "name": "PROFILE",
                    "value": "test"
                },
                {
                    "name": "NODE_VERSION",
                    "value": "16"
                },
                {
                    "name": "NODE_PROFILE",
                    "value": "test"
                }
            ],
            "environmentFiles": [],
            "mountPoints": [],
            "volumesFrom": [],
            "dockerLabels": {
                "stdweb-front": "true"
            },
            "ulimits": [],
            "logConfiguration": {
                "logDriver": "awslogs",
                "options": {
                    "awslogs-create-group": "true",
                    "awslogs-group": "/ecs/stdweb-front-task",
                    "awslogs-region": "ap-northeast-2",
                    "awslogs-stream-prefix": "ecs"
                },
                "secretOptions": []
            }
        }
    ],
    "family": "stdweb-front-task",
    "taskRoleArn": "arn:aws:iam::882704992417:role/ecs-task-role",
    "executionRoleArn": "arn:aws:iam::882704992417:role/ecsTaskExecutionRole",
    "networkMode": "awsvpc",
    "revision": 5,
    "volumes": [],
    "status": "ACTIVE",
    "requiresAttributes": [
        {
            "name": "com.amazonaws.ecs.capability.logging-driver.awslogs"
        },
        {
            "name": "ecs.capability.execution-role-awslogs"
        },
        {
            "name": "com.amazonaws.ecs.capability.ecr-auth"
        },
        {
            "name": "com.amazonaws.ecs.capability.docker-remote-api.1.19"
        },
        {
            "name": "com.amazonaws.ecs.capability.task-iam-role"
        },
        {
            "name": "ecs.capability.execution-role-ecr-pull"
        },
        {
            "name": "com.amazonaws.ecs.capability.docker-remote-api.1.18"
        },
        {
            "name": "ecs.capability.task-eni"
        },
        {
            "name": "com.amazonaws.ecs.capability.docker-remote-api.1.29"
        }
    ],
    "placementConstraints": [],
    "compatibilities": [
        "EC2",
        "FARGATE"
    ],
    "requiresCompatibilities": [
        "FARGATE"
    ],
    "cpu": "1024",
    "memory": "4096",
    "runtimePlatform": {
        "cpuArchitecture": "X86_64",
        "operatingSystemFamily": "LINUX"
    },
    "registeredAt": "2023-11-10T08:27:05.270Z",
    "registeredBy": "arn:aws:iam::882704992417:user/220595",
    "tags": [
        {
            "key": "stdweb-front",
            "value": ""
        }
    ]
}
```

## Back Container
### appspec.yaml
```yaml

```



---

#AWS #AWS_CodeDeploy  

---

