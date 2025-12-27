---
slug: "TerraForm-Packer-설치"
---
- [TerraForm 설치](#TerraForm 설치)
	- [MacOS 기준](#TerraForm 설치#MacOS 기준)
		- [자동 완성 기능 추가](#MacOS 기준#자동 완성 기능 추가)
		- [TerraForm 캐시 설정](#MacOS 기준#TerraForm 캐시 설정)
	- [Ubuntu & Window](#TerraForm 설치#Ubuntu & Window)
- [Packer 설치](#Packer 설치)
	- [MacOS 설치](#Packer 설치#MacOS 설치)
		- [자동 완성 기능 추가](#MacOS 설치#자동 완성 기능 추가)
	- [Linux && Window 환경에서 설치](#Packer 설치#Linux && Window 환경에서 설치)

---

# TerraForm 설치

[Downloads | Terraform by HashiCorp](https://www.terraform.io/downloads)

우선 TerraForm 설치하려면 위의 사이트에 접속하여서 TerraForm을 설치한다.

## MacOS 기준

```bash
brew tap hashicorp/tap
brew install hashicorp/tap/terraform
```

성공적으로 terraform이 설치가 된 것을 확인하려면 

```bash
terraform version
```

만약 버전이 성공적이라면, 정상적으로 설치가 완료 된 것이다.

### 자동 완성 기능 추가

Terraform에 자동 완성 기능을 추가하기 위해서는 **Enable tab completion** 탭을 가면 된다

저는 **Zsh** 를 이용하기 때문에 Zsh 기준으로 작성하겠습니다.

```bash
touch ~/.zshrc
terraform -install-autocomplete
# zsh를 다시 시작해야지 자동 완성이 적용된다.
zsh
```

자동 완성을 적용하기 위해서는 

`terraform` 을 터미널에 작성 후에 탭 키를 눌러서 작성하면 된다

### TerraForm 캐시 설정

```bash
nvim ~/.terraformrc
```

초기에는 terraformrc 파일이 없을 수도 있기 때문에 아래의 사이트에 들어가서 확인해주면 된다.

[CLI Configuration | Terraform by HashiCorp](https://www.terraform.io/cli/config/config-file)

우선 저희가 쓰는 설정은

![Untitled.png](/img/이미지 창고/Untitled.png)
왼쪽의 화면 처럼 선택 권이 많이 있지만,

plugin_cache_dir을 쓸 예정이다.

```bash
plugin_cache_dir   = "$HOME/.terraform.d/plugin-cache"
disable_checkpoint = true
```

위에와 같이 파일을 작성해주면 된다. 이렇게 작성을 하면

```bash
mkdir -p ~/.terraform.d/plugin-cache
```

이 설정을 하는 이유는 terraform 캐시 설정을 하지 않으면 workspace가 분산적으로 정리가 되므로, 중복되는 plugin들이 많아져서 컴퓨터에 쓸데없는 데이터가 쌓이게 된다.

하지만 이처럼 설정을 하게 된다면, 중앙 집중 즉, `~/.terraform.d/plugin-cache` 에 집중적으로 저장이 된다. 그러므로 다운로드가 된 plugin은 한번만 다운 되게끔 설정하는 것이다.

## Ubuntu & Window

만약 윈도우 혹은 linux라고 하시면 이 방법대로 다운을 받아서 실습을 하면 됩니다.

우선 윈도우는 linux 커널이 먹지 않기 때문에 wsl2 버전을 다운 받고, 우분투 버전을 다운 받은 뒤에 Linux 방식을 따라하면 실습이 가능합니다.

우선 커널을 켜 주신 후에

```bash
wget -O- https://apt.releases.hashicorp.com/gpg | gpg --dearmor | sudo tee /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install terraform
```

```bash
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://rpm.releases.hashicorp.com/RHEL/hashicorp.repo
sudo yum -y install terraform
```

이 차례대로 해주시면 됩니다. 그 후에 만약 terraform이 정상적으로 설치가 되면,

```bash
which terraform
terraform version
```

으로 terraform이 설치가 완료되었는지 확인 하면 됩니다.

# Packer 설치

[Packer by HashiCorp](https://www.packer.io/downloads)

위의 사이트에서 Packer를 각 운영체제에 맞게 다운로드 받아주면 됩니다.

## MacOS 설치

```bash
brew tap hashicorp/tap
brew install hashicorp/tap/packer

#packer가 정상적으로 설치 되었는지 확인
packer version
```

### 자동 완성 기능 추가

```bash
packer -autocomplete-install
zsh
```

를 하게 된다면 위의 TerraForm처럼 같은 형태로 Tap 키로 자동 완성이 되는 것을 알 수 있다.

## Linux && Window 환경에서 설치

```bash
wget -O- https://apt.releases.hashicorp.com/gpg | gpg --dearmor | sudo tee /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install packer
```

```bash
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://rpm.releases.hashicorp.com/RHEL/hashicorp.repo
sudo yum -y install packer
```

---

#IaC #Terraform

---