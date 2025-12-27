---
slug: "Ansible-기초"
---
- [앤서블 공식 문서](#앤서블 공식 문서)
- [서버 형상 관리(Server Configuration Management)](#서버 형상 관리(Server Configuration Management))
- [앤서블의 유즈케이스](#앤서블의 유즈케이스)
- [왜 앤서블?](#왜 앤서블?)
	- [Ansible](#왜 앤서블?#Ansible)
# Ansible 기초
# 앤서블 공식 문서

[Ansible Documentation - Ansible Documentation](https://docs.ansible.com/ansible/latest/)

# 서버 형상 관리(Server Configuration Management)

서버 운영체제 상에 필요한 소프트웨어를 설치하고 원하는 설정으로 관리하는 것 → 이를 통해서 Git Ops 가 가능해진다.

대표적인 형상관리 도구 Ansible, Puppet, Chef, Salt Stack 등등

# 앤서블의 유즈케이스

- Configuration Management - 서버 구성 관리
- Security Compliance - 보안 점검 관리
- Provisioning
- Continuous Delivery
- Application Delpoyment

# 왜 앤서블?

이러한 형상 관리가 없었을 때는 Shell Script를 이용해서 이러한 서버 환경 셋팅을 진행을 했다.

```
which=`which mongod 2>&1 >/dev/null`
	if[$? -eq 0]; then
		if["$INSTALLED_MONGO" == "$MONGO_VERSION" ]; then
		echo "Mongo Server version is current and up to date"
	fi
	if ["$INSTALLED_MONGO" != "$MONGO_VERSION" ]; then
		remove_mongo_server
		install_mongo_server
	fi
	else
		install_mongo_server
	fi
```

왼쪽에 보이는 코드는 shell script를 이용해서 mongodb를 설치하는 코드 이다.

많은 조건문이 보여진다 → 이는 멱등성 을 위함이라고 보면 된다.

즉, 수많은 반복이 생겨도 항상 결과는 동일한 것들을 말한다.

## Ansible

```yaml
-name: install mongodb
	yum: name=mongodb-server-2.6 state=installed
```

왼쪽의 코드는 위에 있는 shell script와 동일한 코드이다.

- 간단한 YAML 문법
- 멱등성을 보장하여 여러번 실행해도 안전하다.
- ssh / win_rm 기반으로 통신한다. 대상 서버에 에이전트 설치가 필요하지 않는다.
- 여러 서버를 대상으로 동시 실행
- 특정 서버들을 타겟팅 할 수 있다.
- 버전 관리에 용이하다.

---

#IaC #Ansible 

---