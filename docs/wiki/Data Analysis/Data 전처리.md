---
sticker: emoji//1f50d

slug: "Data-전처리"
---
# Pandas를 통한 Data Frame 생성

```python
import pandas as pd


# Dictionary 를 통한 DataFrame 생성
# Data Frame 생성
df = pd.DataFrame({'a': [1,2,3], 'b': [4,5,6], 'c':[7,8,9]})

# 위와 동일
dummy = {'a': [1, 2, 3], 'b' : [4, 5, 6], 'c' : [7, 8, 9]}
df2 = pd.DataFrame(dummy)
```

![Screenshot-2025-07-19-at-11.57.56-AM.png](/img/Screenshot%202025%2007%2019%20at%2011.57.56%20AM.png)

```python
import pandas as pd

# List 를 통한 DataFrame 생성
a = [1, 4, 7], [2, 5, 8], [3, 6, 9](1,%204,%207],%20[2,%205,%208],%20[3,%206,%209)
df3 = pd.DataFrame(a)

```

![Screenshot-2025-07-19-at-12.03.34-PM.png](/img/Screenshot%202025%2007%2019%20at%2012.03.34%20PM.png)
```python
# Column 속성 입히기
df3.columns = ['a', 'b', 'c']
```


![Screenshot-2025-07-19-at-12.03.54-PM.png](/img/Screenshot%202025%2007%2019%20at%2012.03.54%20PM.png)