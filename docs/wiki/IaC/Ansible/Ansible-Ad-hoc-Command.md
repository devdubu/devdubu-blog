---
slug: "Ansible-Ad-hoc-Command"
---
# Ansible Ad-hoc Command


# Ansible ad-hoc?

Ansible을 사용하는 방법은 3가지가 존재한다.

1. Ansible playbook
2. ansible-pull
3. Ad-hoc command

가 있으며, 그 중에 Ad-hoc은 재사용 불가능한 명령어를 사용하는 방법이다. 이 방법은 재사용이 불가능하다는 단점 때문에, 실무때는 쓰이지 않는다 주로 테스트 용도로 사용이 된다.

# 사용 방법


> 💡 ansible host-pattern -m moduld [-a ‘module options’] [-i inventory]



host-pattern : 인벤토리의 그룹명을 작성하면 된다

-a ‘module options’ : 만약 해당 모듈이 추가적인 인자값을 요구한다면 -a를 작성한 후에 추가적인 옵션을 달아주면 된다.

-i inventory : 만약 인벤토리 파일을 직접 지정하고 싶다면, -i 와 함께 인벤토리명을 붙여주면 된다

위의 순서는 사실상 의미가 없다 알아서 그냥 작성하면 된다. 예를들면

```bash
ansible -i amazon.inv -m ping all
```

그리고 해당 파일은 에러가 나올 것이다. 당연하게 user_name이 없기 때문이다 이럴 때는

```bash
ansible -i amazon.inv -m ping all -u ec2-user
```

이라고 user_name을 명시하게 되면, 연결이 되는 모습을 볼 수 있다

## 접속 방법

### ssh-agent

매일 host 컴퓨터에 ssh 키 입력하는게 힘들다면,

```bash
ssh-add -K [pem 키의 위치]
```

의 명령어를 사용하게 된다면, 접속시에 별다른 비밀번호 입력이 필요 없다.

만약 ssh-agent를 사용하지 않는 사용자라면

### 비밀번호

```bash
ansible -i amazon.inv -m ping all -u ec2-user -k
```

### pem 등 기타 키

```bash
ansible -i amazon.inv -m ping all -u ec2-user --private-key [키의 경로]
```

를 입력하면 접속이 가능하다.

 → 이때 `ping` 명령어는 linux shell에서 사용하는 명령어와는 다르다. ansible에서의 `ping` 명령어는 **대상 호스트에 연결 후 파이썬 사용 가능 여부 확인하기 위한 명령어** 입니다

추가적으로 실습을 해보면

```bash
ansible -i vars.inv -m command -a "uptime" ubuntu
```

command : 해당 호스트에 직접 명령어를 입력하는 모듈(shell 명령어 작성)

```bash
ansible localhost -m setup
```

setup : 상세(Facts) 수집 모듈이라고 한다, 리모트 호스트의 정보 수집

[localhost](http://localhost) : 이 부분은 현재 컴퓨터를 의미한다.

```bash
ansible -i vars.inv -m apt -a "name=git state=lastest update_cache=yes" ubuntu
```

apt : 우분투에서 apt-get을 의미한다. 즉, 뒤의 옵션은 패키지 다운로드를 의미한다.

→ 이를 바로 실행하게 된다면 에러가 나올 것이다. 이유인 즉슨, 패키지 다운로드는 하는데 권한 부족이기 때문이다. 이럴 때는

```bash
ansible -i vars.inv -m apt -a "name=git state=lastest update_cache=yes" ubuntu --become
```

`--become` : 기본적인 default값으로는 root로 변환한다. 다른 사용자로 변환하려면 옵션을 변겨하면 된다.

```bash
ansible -i vars.inv -m apt -a "name=git state=absent update_cache=yes" ubuntu --become
```

`state=absent` : absent의 뜻은, 삭제를 의미한다. 즉, 그렇기 때문에

```bash
ansible -i vars.inv -m command -a "git --version" ubuntu
```

명령어를 사용하게 되면 삭제됐음을 알 수 있다.

---

#IaC #Ansible

---
