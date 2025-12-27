---
slug: "AWS-Network-설계"
---
# AWS Network 설계
![스크린샷-2023-03-14-오전-10.19.17.png](/img/이미지 창고/스크린샷-2023-03-14-오전-10.19.17.png)

### RFC1918 표준 사설 IPv4 주소 공간
![스크린샷-2023-03-14-오전-10.23.28.png](/img/이미지 창고/스크린샷-2023-03-14-오전-10.23.28.png)

### 확장성을 고려한 VPC CIDR 설계
#### Secondary CIDR 사용 예시
![스크린샷-2023-03-14-오전-10.24.35.png](/img/이미지 창고/스크린샷-2023-03-14-오전-10.24.35.png)

#### secondary CIDR 미사용
![스크린샷-2023-03-14-오전-10.25.51.png](/img/이미지 창고/스크린샷-2023-03-14-오전-10.25.51.png)

## NACL과 Security Group

![스크린샷-2023-03-14-오전-10.26.52.png](/img/이미지 창고/스크린샷-2023-03-14-오전-10.26.52.png)
### Security Group
- 인스턴스 수준 적용하는 방화벽이다.
- In/Out traffic White list
- 상태 저장(Statefull)
- 모든 규칙 평가 적용
- 연결된 경우에만 적용

### Network ACL
- 서브넷 수준 적용하는 방화벽
- In/Out traffic White/Black list
- 상태 비저장(stateless)
- 번호가 낮은 규칙 기준 우선 순위 적용
- 서브넷 내의 모든 인스턴스 적용



---

#AWS #AWS_VPC #AWS_Network

---

