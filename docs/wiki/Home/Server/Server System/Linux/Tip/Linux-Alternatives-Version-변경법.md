---
sticker: vault//이미지/개발 로고/TechIconSVG/Linux.svg

slug: "Linux-Alternatives-Version-변경법"
---
# 기존 Java Alternatives 에 등록하기
```shell
sudo alternatives --install /usr/bin/java java /opt/jdk-21/bin/java 2100

# alternatives 목록 및 설정하기
sudo alternatives --config java

```

- **`<우선순위>`** 는 JDK 21이므로 `2100`으로 설정하여 JDK 17의 `1700`보다 높은 우선순위를 부여하겠습니다.

기본적으로 `$PATH`에 jdk 버전이 고정되어있다면 우선순위 때문에 사용이 불가 하다.
그렇기 때문에 `$PATH` 를 모두 제거해야한다.

아래 3가지의 요소를 모두 확인해야한다.
- `~/.bashrc`
- `~/.bash_profile`
- `/etc/profile`
- `/etc/bashrc`
- `~/.profile`
	- 거의 없긴 하다 혹시라도 한번 더 확인이 필요하면 확인하기

여기서 java path는 모두 지우면 된다.



