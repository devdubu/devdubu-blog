---
slug: "Docker-Image"
---
```dockerfile
FROM Ubuntu

RUN apt-get update && apt-get -y install python

RUN pip install flask flask-mysql

COPY . /opt/source-code

ENTRYPOINT FLASK_APP=/opt/source-code/app.py flask run
```
![Pasted-image-20240118153613.png](/img/이미지 창고/Pasted-image-20240118153613.png)
- 이에 대한 정확한 layer에 용량은 `docker history [이미지 명]`으로 알아낼 수 있습니다.



---

#Container 

---
