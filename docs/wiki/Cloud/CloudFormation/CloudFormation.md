# CloudFormation 개념
:::note CloudFormation 템플릿은 JSON 또는 YAML 형식의 텍스트 파일입니다.
- `.json`, `.yaml`, `.template`, `.txt` 등의 확장명을 사용하여 이러한 파일을 저장할 수 있습니다. 
- CloudFormation은 이러한 템플릿을 AWS 리소스 구축을 위한 청사진으로 사용합니다. 
:::

- 예를 들어, 템플릿에서 <mark>인스턴스 유형</mark>, <mark>AMI ID</mark>, <mark>블록 디바이스 매핑</mark>, <mark>Amazon EC2 키 페어</mark> 이름 등과 같은 Amazon EC2 인스턴스를 설명할 수 있습니다. 
- 스택을 생성할 때마다 CloudFormation에서 템플릿에 설명된 항목을 생성하는 데 사용되는 템플릿도 지정합니다.

예를 들어, 다음 템플릿을 사용하여 스택을 생성한 경우 CloudFormation에서는 `ami-0ff8a91507f77f867` AMI ID, `t2.micro` 인스턴스 유형, `testkey` 키 페어 이름 및 Amazon EBS 볼륨을 사용하여 인스턴스를 프로비저닝합니다.
```yaml
AWSTemplateFormatVersion: 2010-09-09
Description: A sample template
Resources:
  MyEC2Instance:
    Type: 'AWS::EC2::Instance'
    Properties:
      ImageId: ami-0ff8a91507f77f867
      InstanceType: t2.micro
      KeyName: testkey
      BlockDeviceMappings:
        - DeviceName: /dev/sdm
          Ebs:
            VolumeType: io1
            Iops: 200
            DeleteOnTermination: false
            VolumeSize: 20
```

단일 템플릿에서 여러 리소스를 지정하고 해당 리소스를 함께 작동하도록 구성할 수도 있습니다. 
- 예를 들어, 다음 예제와 같이 탄력적 IP 주소(EIP)를 포함하도록 이전 템플릿을 수정한 후 Amazon EC2 인스턴스와 연결할 수 있습니다.
```yaml
AWSTemplateFormatVersion: 2010-09-09
Description: A sample template
Resources:
  MyEC2Instance:
    Type: 'AWS::EC2::Instance'
    Properties:
      ImageId: ami-0ff8a91507f77f867
      InstanceType: t2.micro
      KeyName: testkey
      BlockDeviceMappings:
        - DeviceName: /dev/sdm
          Ebs:
            VolumeType: io1
            Iops: 200
            DeleteOnTermination: false
            VolumeSize: 20
  MyEIP:
    Type: 'AWS::EC2::EIP'
    Properties:
      InstanceId: !Ref MyEC2Instance
```


# AWS CloudFormation Template?
>[!note | green] 템플릿이란 스택을 구성하는 AWS 리소스를 선언한 것입니다. 

템플릿은 JavaScript Object Notation(JSON) 또는 YAML 표준을 준수하는 형식의 텍스트 파일로 저장됩니다. 
템플릿은 텍스트 파일이기 때문에 텍스트 편집기에서 작성 및 편집하고 소스 코드의 나머지 부분과 함께 소스 제어 시스템에서 관리할 수 있습니다. 
템플릿 형식에 대한 자세한 내용은 [AWS CloudFormation 템플릿 형식](https://docs.aws.amazon.com/ko_kr/AWSCloudFormation/latest/UserGuide/template-formats.html) 단원을 참조하십시오.







---

#AWS #IaC 

---