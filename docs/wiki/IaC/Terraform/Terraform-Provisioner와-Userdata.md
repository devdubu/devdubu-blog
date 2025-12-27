---
slug: "Terraform-Provisioner와-Userdata"
---

- [Terraform Provisioner](#Terraform Provisioner)
	- [file provisoner](#Terraform Provisioner#file provisoner)
	- [local_exec provisioner](#Terraform Provisioner#local_exec provisioner)
	- [remote_exec provisioner](#Terraform Provisioner#remote_exec provisioner)
- [예시 - Userdata](#예시 - Userdata)
		- [inline](#remote_exec provisioner#inline)
		- [script](#remote_exec provisioner#script)
		- [scripts](#remote_exec provisioner#scripts)
- [Null resource](#Null resource)
- [AWS VPC OpenVPN 구성](#AWS VPC OpenVPN 구성)
	- [Network](#AWS VPC OpenVPN 구성#Network)
	- [ec2-instance](#AWS VPC OpenVPN 구성#ec2-instance)
	- [Network](#AWS VPC OpenVPN 구성#Network)
		- [terraform.tf](#Network#terraform.tf)
	- [ec2-instance](#AWS VPC OpenVPN 구성#ec2-instance)
		- [terraform.tf](#ec2-instance#terraform.tf)
		- [templatefile](#ec2-instance#templatefile)
	- [docker 설치 shell script](#AWS VPC OpenVPN 구성#docker 설치 shell script)
	- [eip.tf](#AWS VPC OpenVPN 구성#eip.tf)
- [Ec2 생성 후](#Ec2 생성 후)
	- [openvpn client 설치](#Ec2 생성 후#openvpn client 설치)

---

# Terraform Provisioner

 → terraform에서 제공해주는 syntex라고 보면 된다. 이는 3개의 문법이 존재한다.

## file provisoner

- 이는 로컬에서 remote를 통해 파일을 복사하는 행위를 말하는 것이다.

## local_exec provisioner

- 로컬에서 명령을 수행하는 문법이다.

## remote_exec provisioner

- remote 환경에서 명령을 수행하는 문법이다.

# 예시 - Userdata

```bash

###################################################
# Userdata
###################################################

resource "aws_instance" "userdata" {
  ami           = data.aws_ami.ubuntu.image_id
  instance_type = "t2.micro"
  key_name      = "fastcampus"

  user_data = <<EOT
#!/bin/bash
sudo apt-get update
sudo apt-get install -y nginx
EOT

  vpc_security_group_ids = [
    module.security_group.id,
  ]

  tags = {
    Name = "fastcampus-userdata"
  }
}
```

userdata부분은

`user_data = <<EOT` 부분 아래에 보면 script를 작성하는 란이 있다.

`key_name` 이란 ssh에 사용되는 key name이라고 보면 된다.

→ 이는 ec2페이지, 키페어 페이지에 해당하는 이름이라고 생각하면 된다.

```bash
###################################################
# Provisioner - in EC2
###################################################

resource "aws_instance" "provisioner" {
  ami           = data.aws_ami.ubuntu.image_id
  instance_type = "t2.micro"
  key_name      = "fastcampus"

  vpc_security_group_ids = [
    module.security_group.id,
  ]

  tags = {
    Name = "fastcampus-provisioner"
  }

  provisioner "remote-exec" {
    inline = [
      "sudo apt-get update",
      "sudo apt-get install -y nginx",
    ]

    connection {
      type = "ssh"
      user = "ubuntu"
      host = self.public_ip
			# 해당 필자가 ssh-agent를 사용하고 있기 때문에 별도의 password가 필요 없는것
			# 혹여라도 사용하지 않는다면 paaword를 기입하도록 하자
    }
  }
}
```

provisioner에서는 특히 `“remote-exec”` 부분에서는 만들어진 ec2 머신에서 어떤 script를 바로 실행할 것인지에 대해서 적어도 된다.

provisioner에서 remote-exec에서 inline이라는 script로 생성하는 방법도 있으며 이외에도

script, scripts 2가지 방법이 있다.

### inline

- inline은 명령어 리스트를 나열해서 명령어를 수행한다고 보면 된다.

### script

- script파일을 업로드 해서 실행한다.

### scripts

- 여러 script파일을 업로드 해서 실행한다고 보면 된다.

# Null resource

# AWS VPC OpenVPN 구성

현재의 실습 파일의 구성은 아래와 같다.

![Untitled.png](/img/이미지 창고/Untitled.png)
## Network

- VPC와 Subnet을 구성하는 요소들을 제공하는 타입
- 

## ec2-instance

- openvpn과 사설 대역에 올라갈 private ec2에 구성되는 workspace이다.

## Network

### terraform.tf

```bash
terraform {
  backend "remote" {
    hostname     = "app.terraform.io"
    organization = "Test_Cloud_Devdubu"

    workspaces {
      name = "terraform-lab-network"
    }
  }
}
```

해당 부분에서 organization에서 본인의 terraform cloude의 organization으로 이름을 변경해주면 된다.

그리고 terraform cloud에서 새로 만들어진 workspace 설정에서 remote→local로 변경해주면 된다.

![Untitled-1.png](/img/이미지 창고/Untitled-1.png)

## ec2-instance

### terraform.tf

```bash
data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}
# *****************************************************************************
# 키 페어 이름 바꿔야하는 곳
# *****************************************************************************
resource "aws_instance" "private" {
  ami           = data.aws_ami.ubuntu.image_id
  instance_type = "t2.micro"
  subnet_id     = local.subnet_groups["private"].ids[0]
  key_name      = "JmServer"

  vpc_security_group_ids = [
    module.sg__ssh.id,
  ]

  tags = {
    Name = "${local.vpc.name}-private"
  }
}

locals {
  openvpn_userdata = templatefile("${path.module}/files/openvpn-userdata.sh", {
    vpc_cidr  = local.vpc.cidr_block
    public_ip = aws_eip.openvpn.public_ip
  })
  common_tags = {
    "Project" = "openvpn"
  }
}
# *****************************************************************************
# 키 페어 이름 바꿔야하는 곳
# *****************************************************************************
resource "aws_instance" "openvpn" {
  ami           = data.aws_ami.ubuntu.image_id
  instance_type = "t2.micro"
  subnet_id     = local.subnet_groups["public"].ids[0]
  key_name      = "JmServer"

  user_data = local.openvpn_userdata

  associate_public_ip_address = false
  vpc_security_group_ids = [
    module.sg__ssh.id,
    module.sg__openvpn.id,
  ]

  tags = {
    Name = "${local.vpc.name}-openvpn"
  }
}
```

```yaml
context: {}

remote_states:
  "network":
    organization: "Test_Cloud_Devdubu" # 교체 해야하는 부분
    workspace: "terraform-lab-network"
```

### templatefile

- templatefile은 두가지 인자를 받는다.
    - 파일 경로
    - context값 → context값을 랜더링 하여 파일에 넣는다.
    

## docker 설치 shell script

```bash
#!/bin/bash
sudo apt-get update
sudo apt-get install -y \
  apt-transport-https \
  ca-certificates \
  curl \
  gnupg \
  lsb-release
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io
usermod -aG docker ubuntu

## Run openvpn-ldap-otp container
docker run \
 --name openvpn \
 --volume openvpn-data:/etc/openvpn \
 --detach=true \
 -p 1194:1194/udp \
 --cap-add=NET_ADMIN \
 -e "OVPN_SERVER_CN=${public_ip}" \
 -e "OVPN_ENABLE_COMPRESSION=false" \
 -e "OVPN_NETWORK=172.22.16.0 255.255.240.0" \
 -e "OVPN_ROUTES=172.22.16.0 255.255.240.0, ${split("/", vpc_cidr)[0]} ${cidrnetmask(vpc_cidr)}" \
 -e "OVPN_NAT=true" \
 -e "OVPN_DNS_SERVERS=${cidrhost(vpc_cidr, 2)}" \
 -e "USE_CLIENT_CERTIFICATE=true" \
 wheelybird/openvpn-ldap-otp:v1.4

## Wait to ready OpenVPN Server
until echo "$(docker exec openvpn show-client-config)" | grep -q "END PRIVATE KEY" ;
do
  sleep 1
  echo "working..."
done

## Generate OpenVPN client configuration file
docker exec openvpn show-client-config > fastcampus.ovpn
```

→ docker 실행 명령어를 통해서 openvpn을 실행한다.

→ 1194 UDP 포트로 해당 컨테이너를 실행

→ 위에 templatefile에 랜더링한 값을 주입하는 칸이다 `${ }`

→ vpc cidr을 앞부분으로 가져오고, 뒤에는 netmask 값을 가져왔다.

→ cidr 명령어는 vpc_cidr에서 2번째 ip를 가져오는 것이다.

→ CIDR : 10.222.0.0/24의 두번째 IP는 10.222.0.2이다. → 이는 내부 DNS 서버 역할을 한다.

→ 왼쪽은 docker openvpn이 실행될때 까지 기다린 후에

→ 만약 openvpn이 실행됐다면, fastcampus.ovpn을 생성하게 된다.

## eip.tf

```bash
resource "aws_eip" "openvpn" {
  tags = merge(
    {
      "Name" = "${local.vpc.name}-openvpn"
    },
    local.common_tags,
  )
}

resource "aws_eip_association" "openvpn" {
  instance_id   = aws_instance.openvpn.id
  allocation_id = aws_eip.openvpn.id
}
```

- 보통의 경우 ec2에서는 인스턴스를 종료하게 된다면, public ip는 유지가 되지 않고 갱신된다.
- 하지만, 이는 중요 도메인에 있어서는 그리 좋은 선택은 아니다.
- 그렇기 때문에, eip를 설정해놓게 되면, 공인 ip가 유지가 가능하기 때문에,
    
    ec2를 지속적으로 재생성해도 같은 ip를 유지한다.
    

# Ec2 생성 후

```bash
ssh ubuntu@[publicIP]

sudo su
cat /var/log/cloud-init-output.log
```

![Screen-Shot-2022-09-26-at-2.57.49-PM.png](/img/이미지 창고/Screen-Shot-2022-09-26-at-2.57.49-PM.png)
```bash
docker ps
```

![Screen-Shot-2022-09-26-at-2.57.13-PM.png](/img/이미지 창고/Screen-Shot-2022-09-26-at-2.57.13-PM.png)

```bash
cd /
cat fastcampus.ovpn
```

- fastcampus.ovpn
    
    ```bash
    client
    dev tun
    persist-key
    persist-tun
    remote-cert-tls server
    key-direction 1
    cipher AES-256-CBC
    auth SHA512
    proto tcp
    reneg-sec 0
    
      ##Un-comment these lines in Ubuntu (and other Linux distros)
      ##in order to set the DNS server:
    
      #script-security 2
      #up /etc/openvpn/update-resolv-conf
      #down /etc/openvpn/update-resolv-conf
    
    # Set log file verbosity
    verb 3
    
    <connection>
    remote 3.39.183.205 1194 udp
    float
    nobind
    </connection>
    
    <ca>
    -----BEGIN CERTIFICATE-----
    MIIDODCCAiCgAwIBAgIJAKxjuDHC9UwcMA0GCSqGSIb3DQEBCwUAMBcxFTATBgNV
    BAMMDDMuMzkuMTgzLjIwNTAeFw0yMjA5MjYwNjIwNTdaFw0zMjA5MjMwNjIwNTda
    MBcxFTATBgNVBAMMDDMuMzkuMTgzLjIwNTCCASIwDQYJKoZIhvcNAQEBBQADggEP
    ADCCAQoCggEBAMAqJf1HiCxfYCRbr6V1KQdKWraoW0Uh+i0PWXuGCoP1NNY3qWim
    cHEYLzSZEFo87tGUNuyG6niDiz6u+3b+8xSbRvuybqNpFRgKXv3d/z3PWA8wQqki
    k8fthfIp6aNCmbSIYvHCy9+l5h0UdEYMONDugYYQwp4fbs8x85ujp6iHXRSU4ou4
    Yuc/bPOpI/T835JqRV+YzO9C0brMqECoVGbClZN5zyqMaufl5Kc3SZ8sTcy2pvlU
    lLkFJtqNCzfaxqnsg/sHoTqy/SlhGoSyEClAPUQYgR3t0f55GtxEAuHbkek33tQT
    /CRsOeVYxixs5JdRlbst5ewxYik80qTnaW0CAwEAAaOBhjCBgzAdBgNVHQ4EFgQU
    nGNyjiNP6TosiuVDDRRsBJ6k8CowRwYDVR0jBEAwPoAUnGNyjiNP6TosiuVDDRRs
    BJ6k8CqhG6QZMBcxFTATBgNVBAMMDDMuMzkuMTgzLjIwNYIJAKxjuDHC9UwcMAwG
    A1UdEwQFMAMBAf8wCwYDVR0PBAQDAgEGMA0GCSqGSIb3DQEBCwUAA4IBAQB8H2dO
    jzwVlPTq74quA35W/JH4UPRqUqAYSnbVJQGE2vXDDpOPvjbCluxeQqfFQt1ycyub
    YhdGmdeHeV5spl/857AETw2rJ7Mu0g89q10MztUYjRACejTucESBaDl0bmVq5z/Q
    7F0t3yL/fuzm8JxU24iDZ0ovmbqsV8Ay60ueTEvvoAB3IHK2poyj8ydVXOlPbbtw
    N5EpoZhJtIrx0rX1/OuHbNoBGLiphi1qCAqpi1jEimxoMw7ck+PumJYA9/0Vt797
    4B7GUXpBOjMNzC8B+cZr2RBG/dPhDwGUDpJWLH9LsoctMIQOBt381VnV7hL1QQZx
    YYqLWSrYj6b2Gwry
    -----END CERTIFICATE-----
    </ca>
    <tls-auth>
    #
    # 2048 bit OpenVPN static key
    #
    -----BEGIN OpenVPN Static key V1-----
    268044f872caa13fd80c5919ced88dfd
    b3bd8f0a717e79aabc67a48bb72dc6a3
    1e6deb4976d1545884fa234ca3a19dde
    96bca8b4685d7134b64f291e053d39b4
    28570f7085055514cf08d457f9334a4f
    ae167b722c599d403a1742f4a0c14e30
    0a8281f8f58265e0d5044cbbd20cf63d
    b2a5bab56aafd2bdc9be4fe6ae7d4922
    0b79d457350b94e98287cceb87284b1b
    5644da687e92c956274a9050498c300c
    6da0c79e808141b870d0103bcefc83f3
    912179caf231a9a4ed3274963f781109
    a036e0d06881aef9ec0c53b16fc1f43e
    ef0a3a914ce7e249b9b70a9d18b5c7dd
    ea8436714f1ef9bb2a17533f0951b3f7
    e3c629c3f6ea911e412dc2ccf937412c
    -----END OpenVPN Static key V1-----
    </tls-auth>
    key-direction 1
    
    <cert>
    Certificate:
        Data:
            Version: 3 (0x2)
            Serial Number:
                d8:62:09:59:01:51:b5:1c:b2:fc:79:b3:0f:dc:85:cb
        Signature Algorithm: sha256WithRSAEncryption
            Issuer: CN=3.39.183.205
            Validity
                Not Before: Sep 26 06:21:08 2022 GMT
                Not After : Sep 23 06:21:08 2032 GMT
            Subject: CN=client
            Subject Public Key Info:
                Public Key Algorithm: rsaEncryption
                    Public-Key: (2048 bit)
                    Modulus:
                        00:cb:6c:28:2e:02:bd:e7:b3:3a:42:35:56:98:55:
                        12:79:40:0e:6a:71:1b:5e:a5:bc:51:be:56:01:4b:
                        37:77:7a:2a:59:24:3a:05:da:88:e6:93:fe:1b:e0:
                        16:25:91:a8:4d:83:81:fc:2c:e5:9e:c4:50:f9:c0:
                        ee:44:8d:3b:8a:ce:81:20:eb:ac:b4:c9:4b:c0:6c:
                        31:d7:4f:c2:e2:67:30:99:25:9e:f4:58:49:a0:a6:
                        c6:18:3d:52:5d:dd:3f:3a:e7:2e:a2:4f:fd:ea:16:
                        76:d8:fd:e5:c1:ee:15:25:b3:43:78:ad:9a:29:94:
                        db:46:ae:d3:4c:6d:94:2f:a8:36:f2:02:0c:d2:f8:
                        37:7a:f6:36:aa:53:f5:5c:0e:47:b3:b6:12:ba:d5:
                        8b:22:4b:19:b8:ba:b6:90:dc:8d:d8:bc:19:53:44:
                        f6:ea:d1:e8:77:4d:10:9c:e1:cf:0c:46:86:78:cd:
                        00:d8:36:43:89:e2:73:51:2b:f9:b9:0d:19:b2:47:
                        39:b8:d7:51:32:67:22:e3:f2:04:86:2e:86:3a:af:
                        56:31:63:a0:99:3b:0b:d9:0a:f1:75:c7:c5:d1:7e:
                        9b:96:bf:51:00:bf:0d:ae:4b:86:83:bf:b1:a2:25:
                        12:76:00:6f:b1:f4:53:4f:25:0b:55:47:d0:15:5a:
                        a7:2b
                    Exponent: 65537 (0x10001)
            X509v3 extensions:
                X509v3 Basic Constraints:
                    CA:FALSE
                X509v3 Subject Key Identifier:
                    92:CA:38:EF:91:09:55:B4:27:11:58:A0:37:17:6E:D8:92:46:0C:8B
                X509v3 Authority Key Identifier:
                    keyid:9C:63:72:8E:23:4F:E9:3A:2C:8A:E5:43:0D:14:6C:04:9E:A4:F0:2A
                    DirName:/CN=3.39.183.205
                    serial:AC:63:B8:31:C2:F5:4C:1C
    
                X509v3 Extended Key Usage:
                    TLS Web Client Authentication
                X509v3 Key Usage:
                    Digital Signature
        Signature Algorithm: sha256WithRSAEncryption
             60:bc:a9:f9:74:ee:00:b5:0e:98:8a:d2:5b:21:58:69:d2:f0:
             26:af:03:1c:c8:5f:7d:b6:84:b2:af:f9:6d:a7:a2:9d:fa:07:
             23:0d:54:d1:f4:d2:75:54:5b:cd:32:d5:9d:69:ff:30:db:23:
             32:69:d9:13:40:e7:a9:69:63:27:aa:b3:6a:91:43:0f:11:95:
             05:12:2f:63:c4:4b:05:df:e1:c8:78:0c:9f:86:b4:9a:c1:df:
             b7:3a:f4:5a:06:fd:2a:fc:27:12:ed:ed:10:25:9b:d5:d9:92:
             37:e0:5f:20:97:e4:8e:cd:55:4c:5e:18:5f:36:3f:57:3e:7e:
             e3:a5:b6:18:e2:5b:c4:a5:b9:6e:4b:9b:53:1d:a9:53:ef:de:
             cf:bb:46:f1:76:4a:73:47:37:17:03:03:7f:6c:af:b0:9c:ba:
             65:d9:08:ca:15:5c:4b:2f:26:d8:6d:5f:93:e5:44:9b:ff:34:
             00:9e:08:16:d7:a1:4a:7f:b5:e0:23:95:b6:d3:b8:21:28:3e:
             c0:38:bf:49:bd:89:01:eb:10:01:c4:e1:44:04:13:5c:a4:ae:
             a3:16:48:0b:6e:8b:b1:24:b4:3c:ff:7b:3e:75:5a:93:1a:32:
             db:fa:79:40:a0:ad:8a:cb:de:25:f1:a5:dc:bd:b1:7b:51:4c:
             81:7f:90:3b
    -----BEGIN CERTIFICATE-----
    MIIDTDCCAjSgAwIBAgIRANhiCVkBUbUcsvx5sw/chcswDQYJKoZIhvcNAQELBQAw
    FzEVMBMGA1UEAwwMMy4zOS4xODMuMjA1MB4XDTIyMDkyNjA2MjEwOFoXDTMyMDky
    MzA2MjEwOFowETEPMA0GA1UEAwwGY2xpZW50MIIBIjANBgkqhkiG9w0BAQEFAAOC
    AQ8AMIIBCgKCAQEAy2woLgK957M6QjVWmFUSeUAOanEbXqW8Ub5WAUs3d3oqWSQ6
    BdqI5pP+G+AWJZGoTYOB/CzlnsRQ+cDuRI07is6BIOustMlLwGwx10/C4mcwmSWe
    9FhJoKbGGD1SXd0/Oucuok/96hZ22P3lwe4VJbNDeK2aKZTbRq7TTG2UL6g28gIM
    0vg3evY2qlP1XA5Hs7YSutWLIksZuLq2kNyN2LwZU0T26tHod00QnOHPDEaGeM0A
    2DZDieJzUSv5uQ0Zskc5uNdRMmci4/IEhi6GOq9WMWOgmTsL2QrxdcfF0X6blr9R
    AL8NrkuGg7+xoiUSdgBvsfRTTyULVUfQFVqnKwIDAQABo4GYMIGVMAkGA1UdEwQC
    MAAwHQYDVR0OBBYEFJLKOO+RCVW0JxFYoDcXbtiSRgyLMEcGA1UdIwRAMD6AFJxj
    co4jT+k6LIrlQw0UbASepPAqoRukGTAXMRUwEwYDVQQDDAwzLjM5LjE4My4yMDWC
    CQCsY7gxwvVMHDATBgNVHSUEDDAKBggrBgEFBQcDAjALBgNVHQ8EBAMCB4AwDQYJ
    KoZIhvcNAQELBQADggEBAGC8qfl07gC1DpiK0lshWGnS8CavAxzIX322hLKv+W2n
    op36ByMNVNH00nVUW80y1Z1p/zDbIzJp2RNA56lpYyeqs2qRQw8RlQUSL2PESwXf
    4ch4DJ+GtJrB37c69FoG/Sr8JxLt7RAlm9XZkjfgXyCX5I7NVUxeGF82P1c+fuOl
    thjiW8SluW5Lm1MdqVPv3s+7RvF2SnNHNxcDA39sr7CcumXZCMoVXEsvJthtX5Pl
    RJv/NACeCBbXoUp/teAjlbbTuCEoPsA4v0m9iQHrEAHE4UQEE1ykrqMWSAtui7Ek
    tDz/ez51WpMaMtv6eUCgrYrL3iXxpdy9sXtRTIF/kDs=
    -----END CERTIFICATE-----
    </cert>
    <key>
    -----BEGIN PRIVATE KEY-----
    MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDLbCguAr3nszpC
    NVaYVRJ5QA5qcRtepbxRvlYBSzd3eipZJDoF2ojmk/4b4BYlkahNg4H8LOWexFD5
    wO5EjTuKzoEg66y0yUvAbDHXT8LiZzCZJZ70WEmgpsYYPVJd3T865y6iT/3qFnbY
    /eXB7hUls0N4rZoplNtGrtNMbZQvqDbyAgzS+Dd69jaqU/VcDkezthK61YsiSxm4
    uraQ3I3YvBlTRPbq0eh3TRCc4c8MRoZ4zQDYNkOJ4nNRK/m5DRmyRzm411EyZyLj
    8gSGLoY6r1YxY6CZOwvZCvF1x8XRfpuWv1EAvw2uS4aDv7GiJRJ2AG+x9FNPJQtV
    R9AVWqcrAgMBAAECggEAQYogS+qwOsWBALHkq4HFSPF9c4frlIv7Z67WUOZmAYWH
    vV6xnw8wynFmDp8dI4+RVSAIsjHY7VU87areWZHTXD56Vhv4cerlECMLz94v4Pf0
    LXN0ii8j0bHJ4ydmsT1GUPkJClyRZ2lDc1giPWAyygm+tFPidoEyQMy04Uvw0YVi
    2OTac7yCtANqeLyHaBiPU/Hu/wC6FEYR1k+lCHvUprWHcV8jhgP1+l53RAyWVwcf
    iL2Zz7JgHHokDAu8XJrG+X78E9IeHl7VuyWdAYvGDdhg7sFkiL+9Q0k3M48CSHoQ
    GtkGKUD92G7uPndkvV0tlx3gOifw25P1yTLThN1qoQKBgQDmC/7n5+BqpM0gh76S
    sZj4zwfhtNSBT9PHga1Zntp+tdxoDFSE9W9ToBmXnJCcyidg/DlV+y1xoHbc1QFh
    urLdWyh9leUywplqXq8QhvN7qao9ENvqH3lB6TOqiDStBgG1XNTpsPXZHSaWB6Pq
    5OsbbLm/4r5Dmy1clm33AAMKsQKBgQDiXzhpycCP4ehD5tLs7vWvWKsZvvjwQJ+r
    M4GRdx64BKVyUWUwcCjoQBTETDQeOMrp4uPsE0NhsW2eSmlqcHNWcK2ZH+BCx2Bc
    Po/UfyeM9Be5Mx/g7rPbrJIab3UUXRsl3dsdb668vVCmjzhvZnSSx1PciObOWRA3
    ovhkWCWOmwKBgQCfBZXMy143efqOTSewkfHztHF3VaA8T2lPFVY2iHfzdVWJ21Ql
    oN+3CAoI4uKYb6mvAkvEIuB0Fn90Ag51dzCjkZs4zQBmCV0xyYfsvczcJBmZIulS
    OzWAGWtsq8D2BhvyOdy4OmqIDf2ZYmiuPFZFW/A/M8dgRomh4h7byndP0QKBgHrb
    EtLXHBr6kAPKEk9koRI5HSMr8g7yA7X2jitUaueUHfadFj3joU/q91pRwTdluzqU
    WP6WtcsfcE6oM+4AeZhALvcbxap4amOl0ImTOPPWxclNZc+9vP9L+T8/nlse7Mzw
    Syr+oebtGAhNUmOjR0EhzPGzmxACZjrLx+Mts7RhAoGAMLe8Yeey8BCAIG6NFu2E
    me6FLNhKXXR4h9ysTlH2rsbB4vz82xhHd8DpVPE1IzTjts4kJbxdZiPs3/VsPJkY
    geu23o2oGdSbYY7vZlCBxA1UBR+tB3APAzRPzZKkTj7j4y6ObJbfmgEkCxfCJxOe
    DNCMwKWPznTEjwY01Bn8jW4=
    -----END PRIVATE KEY-----
    </key>
    ```
    

## openvpn client 설치

맥에서는 간단하게 brew를 이용해서 설치가 가능하다.

```bash
brew install tunnelblick
```

openclient를 설치한 후에는 fastcampus.ovpn 파일을 해당 디렉토리에 만든다.

![Screen-Shot-2022-09-26-at-3.35.05-PM.png](/img/이미지 창고/Screen-Shot-2022-09-26-at-3.35.05-PM.png)

후에 fastcampus.ovpn을 더블클릭 후에 암호를 입력하게 된다면 상단에 이러한 마크가 뜨게 된다.

![Screen-Shot-2022-09-26-at-3.36.19-PM.png](/img/이미지 창고/Screen-Shot-2022-09-26-at-3.36.19-PM.png)

![Screen-Shot-2022-09-26-at-3.37.06-PM.png](/img/이미지 창고/Screen-Shot-2022-09-26-at-3.37.06-PM.png)

후에 Connection fastcampus를 누르게 된다면, private ip도 내 컴퓨터에서 접근이 가능해진다.

![Screen-Shot-2022-09-26-at-3.38.06-PM.png](/img/이미지 창고/Screen-Shot-2022-09-26-at-3.38.06-PM.png)

해당 명령어는 private dns에 쿼리를 날려주기 때문에 원래는 반응이 없어야하지만, 내부망 접속(open vpn)을 통해서 이를 받아올 수 있다.

![Screen-Shot-2022-09-26-at-3.39.19-PM.png](/img/이미지 창고/Screen-Shot-2022-09-26-at-3.39.19-PM.png)

---

#IaC #Terraform

---