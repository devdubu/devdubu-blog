---
slug: "Ansible-Facts"
---
# Ansible Facts

[Discovering variables: facts and magic variables - Ansible Documentation](https://docs.ansible.com/ansible/latest/user_guide/playbooks_vars_facts.html)

앤서블은 기본값으로는 Facts를 수집하게 되어있다.

그렇기 때문에 굳이 처음에 Facts를 수집하라고 하지 않아도 알아서 수집을 한다.

그러나, Facts를 수집하지 말아야할 상황이 생길 수도 있다.

```yaml
---

- name: Prepare Amazon Linux
  hosts: amazon
  become: true
  gather_facts: false
  tasks:
	# 컨테이너와 같은 python이 선생적으로 설치 되어있지 않는 것들은 yum, apt말고 comnmand 명령어로 직접 shell 작업을 해줘야한다.
  # Docs: https://docs.ansible.com/ansible/latest/collections/ansible/builtin/user_module.html
  - name: "Install python on Amazon Linux"
    yum:
      name: "python3"
      state: "present"

- name: Prepare Ubuntu
  hosts: ubuntu
  become: true
  gather_facts: false
  tasks:
  - name: "Install python on Ubuntu"
    apt:
      name: "python3"
      state: "present"
      update_cache: true

- name: Debug
  hosts: all
  become: true
  tasks:
  # Docs: https://docs.ansible.com/ansible/latest/collections/ansible/builtin/user_module.html
  - name: "Debug Ansible facts"
    debug:
      var: ansible_facts
```

그러면 어떤 상황에서 Facts를 수집하면 안될까?

이는 **대규모 시스템 관리**시에 **성능 향상**을 위해서 수집하지 않는 경우이다.

생각보다 Ansible이 Fact를 수집하는 것 리소스를 많이 잡아먹는 일이기 때문에, 성능 향상을 할 수도 있고,

또한 **빠른 테스트**를 위해서 Facts를 수집하지 않을 수도 있습니다.

예를 들어 docker의 환경에서 ansible을 활용한다면, docker는 ansible을 사용할 수 있는 python이 기본적으로 설치 되어있지 않다보니 fact를 수집할 때, 문제가 생길수도 있다.

이때는 command 명령어나, shell 명령어로 python을 먼서 설치해주고 작업을 이어사 나아가면 된다.

사용 방법은 `gather_facts: false` 로 설정하게 된다면 facts를 수집하지 않게 된다.

# Amazon Facts

[amazon.aws.ec2_metadata_facts module - gathers facts (instance metadata) about remote hosts within EC2 - Ansible Documentation](https://docs.ansible.com/ansible/latest/collections/amazon/aws/ec2_metadata_facts_module.html#ansible-collections-amazon-aws-ec2-metadata-facts-module)

```yaml
---

- name: Gather EC2 Metadata Facts
  hosts: ubuntu
  become: true
  tasks:
  # Docs: https://docs.ansible.com/ansible/latest/collections/amazon/aws/ec2_metadata_facts_module.html
  - name: "Gather EC2 Metadata Facts"
    amazon.aws.ec2_metadata_facts: {}

  # Docs: https://docs.ansible.com/ansible/latest/collections/ansible/builtin/user_module.html
  - name: "Debug Ansible facts"
    debug:
      var: ansible_facts

  - name: "Set VPC CIDR"
    set_fact:
      vpc_cidr: "{{ (ansible_facts | dict2items | selectattr('key', 'match', '^ec2_network_interfaces_macs_.*_vpc_ipv4_cidr_block$') | map(attribute='value'))[0] }}"

  - name: "Debug VPC CIDR"
    debug:
      var: vpc_cidr

  - name: "Set VPC facts"
    set_fact:
      vpc_dns_server: '{{ vpc_cidr | ipaddr(2) | ipaddr("address") }}' # ipaddr(2)는 cidr ip의 두번째 값을 의미한다
      vpc_network: '{{ vpc_cidr | ipaddr("network") }}'
      vpc_netmask: '{{ vpc_cidr | ipaddr("netmask") }}'

  - name: "Debug variables"
    debug:
      var: vars
```

→ set_fact 또한 모듈로써 fact를 변수로서 셋팅해주는 것을 의미한다.

vpc_cidr의 다음 식에 대한 부분은 vpc_cidr를 추출하는 정규 표현식을 의미한다.

→ 헤당 라인에서 ipaddr은 의존성을 가지고 있는 module이다. 

[Using the ipaddr filter - Ansible Documentation](https://docs.ansible.com/ansible/latest/collections/ansible/utils/docsite/filters_ipaddr.html)

이는 사전에 `pip install netaddr` 이 시스템에 설치 되어있어야한다.

---

#IaC #Ansible

---
