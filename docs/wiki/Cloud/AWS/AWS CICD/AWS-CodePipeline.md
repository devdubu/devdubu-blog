---
slug: "AWS-CodePipeline"
---
# Json 코드

```json
{

    "pipeline": {
        "name": "stdweb-pipeline",
        "roleArn": "arn:aws:iam::228525850236:role/codepipelinestdweb",
        "artifactStore": {
            "type": "S3",
            "location": "codepipeline-ap-northeast-2-634056246158",
            "encryptionKey": {
                "id": "arn:aws:kms:ap-northeast-2:228525850236:key/0807b81d-b777-424d-b3b4-2da976fa4128",
                "type": "KMS"
            }
        },
        "stages": [
            {
                "name": "Source",
                "actions": [
                    {
                        "name": "Source",
                        "actionTypeId": {
                            "category": "Source",
                            "owner": "AWS",
                            "provider": "CodeCommit",
                            "version": "1"
                        },
                        "runOrder": 1,
                        "configuration": {
                            "BranchName": "main",
                            "OutputArtifactFormat": "CODEBUILD_CLONE_REF",
                            "PollForSourceChanges": "true",
                            "RepositoryName": "stdweb-front"
                        },
                        "outputArtifacts": [
                            {
                                "name": "SourceArtifact"
                            }
                        ],
                        "inputArtifacts": [],
                        "region": "ap-northeast-2",
                        "namespace": "SourceVariables"
                    }
                ]
            },
            {
                "name": "Build",
                "actions": [
                    {
                        "name": "Build",
                        "actionTypeId": {
                            "category": "Build",
                            "owner": "AWS",
                            "provider": "CodeBuild",
                            "version": "1"
                        },
                        "runOrder": 1,
                        "configuration": {
                            "ProjectName": "stdweb-front"
                        },
                        "outputArtifacts": [
                            {
                                "name": "BuildArtifact"
                            }
                        ],
                        "inputArtifacts": [
                            {
                                "name": "SourceArtifact"
                            }
                        ],
                        "region": "ap-northeast-2",
                        "namespace": "BuildVariables"
                    }
                ]
            },{
                "name": "Deploy",
                "actions": [
                    {
                        "inputArtifacts": [
                            {
                                "name": "BuildArtifact"
                            }
                        ],
                        "name": "ExternalDeploy",
                        "actionTypeId": {
                            "category": "Deploy",
                            "owner": "AWS",
                            "version": "1",
                            "provider": "CodeDeployToECS"
                        },
                        "outputArtifacts": [],
                        "configuration": {
                            "ApplicationName": "AppECS-stdweb-test-stdweb-test-front-service",
                            "DeploymentGroupName": "DgpECS-stdweb-test-stdweb-test-front-service",
                            "AppSpecTemplateArtifact" : "BuildArtifact",
                            "TaskDefinitionTemplatePath": "taskdef.json",
                            "AppSpecTemplatePath": "appspec.yaml",
                            "TaskDefinitionTemplateArtifact": "BuildArtifact"
                        },
                        "runOrder": 1,
                        "roleArn": "arn:aws:iam::882704992417:role/CodeDeploy_DevOps"
                    }
                ]
            }
        ],
        "version": 1
    }
}
```



---

#AWS #AWS_CodePipeline 

---

