---
sticker: vault//이미지/개발 로고/TechIconSVG/MySQL.svg

slug: "Table의-대소문자-구분분"
---
MariaDB와 MySQL에서 이러한 동작은 **`lower_case_table_names`** 시스템 변수에 의해 제어됩니다. 이 변수는 파일 시스템의 대소문자 민감도와 관련이 있습니다.
- `lower_case_table_names = 0`: 대소문자를 그대로 유지하며, 비교할 때도 대소문자를 구분합니다. 이는 주로 유닉스 기반 시스템에서 사용됩니다.
- `lower_case_table_names = 1`: 모든 테이블 이름을 소문자로 저장하고, 비교할 때도 소문자로 변환하여 대소문자를 구분하지 않습니다. 이는 주로 윈도우에서 사용됩니다.
- `lower_case_table_names = 2`: 테이블 이름은 그대로 저장하지만, 비교할 때는 소문자로 변환하여 대소문자를 구분하지 않습니다. 이는 macOS에서 사용됩니다.

개발자들의 편의를 위해 때로는 표준을 느슨하게 적용하기도 합니다. `WITH RECURSIVE` 같은 CTE(Common Table Expression) 문법도 표준이지만, 모든 DB가 동일한 방식으로 구현하지는 않습니다.

따라서 쿼리 작성 시 대소문자 구분 문제와 같은 예상치 못한 오류를 피하려면, 아래와 같은 방법을 권장합니다.
- 모든 SQL 예약어는 대문자로 작성합니다.
- 테이블명, 컬럼명은 일관되게 소문자 또는 대문자로 작성합니다.    
- 실행 환경(OS, DB 설정)에 관계없이 동작하도록 **명시적으로 컬럼 별칭을 포함**하는 것이 좋습니다.

결론적으로, 버전의 엄격함이 아니라 **데이터베이스 환경 설정의 차이**가 오류를 발생시킨 것입니다.

실제 문제가 되는 `.xml` 파일을 수정한 수정본

```xml
<?xml version="1.0" encoding="UTF-8"?>

<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

  

<mapper namespace="com.hansol.stdweb.user.LoginMapper">

  

<select id="getUserMenuList" parameterType="User" resultType="map">

/* user.LoginMapper.getUserMenuList */

WITH RECURSIVE TREE AS (

SELECT

DISTINCT M.MENU_CD AS MENU_CD

, M.MENU_NM

, M.UPPER_MENU_CD

, M.MENU_ICON

, M.PROGRAM_CD

, M.SYSCD

, M.MENU_DEPTH

, M.MENU_ORD

, M.USE_FL

, M.DEVICE_TYPE

FROM

STD_MENU_TB M

LEFT OUTER JOIN STD_PRGM_TB P

ON P.PROGRAM_CD = M.PROGRAM_CD AND P.SYSCD = M.SYSCD

WHERE

M.MENU_CD IN (

SELECT MENU_CD

FROM STD_MENU_TB

WHERE USE_FL = 'Y'

AND SYSCD = #{SYSCD}

AND (

PROGRAM_CD IN (

SELECT PROGRAM_CD

FROM STD_AUTH_PRGM_MAPPING_TB a

JOIN STD_AUTH_USER_MAPPING_TB b

ON b.AUTH_CD = a.AUTH_CD

and b.USER_ID = #{USER_ID}

<if test=' SINGLE_AUTH == "Y" '>

and a.AUTH_CD = #{AUTH_CD}

</if>

)

OR P.OPEN_ALL_FL = 'Y'

)

)

AND M.SYSCD = #{SYSCD}

UNION ALL

SELECT

DISTINCT M.MENU_CD AS MENU_CD

, M.MENU_NM

, M.UPPER_MENU_CD

, M.MENU_ICON

, M.PROGRAM_CD

, M.SYSCD

, M.MENU_DEPTH

, M.MENU_ORD

, M.USE_FL

, M.DEVICE_TYPE

FROM TREE a

JOIN STD_MENU_TB M

ON M.MENU_CD = a.UPPER_MENU_CD AND M.SYSCD = #{SYSCD}

)

CYCLE MENU_CD, UPPER_MENU_CD, SYSCD RESTRICT

, TREE_FILTERED AS (

SELECT A.MENU_CD

, A.MENU_NM

, A.UPPER_MENU_CD

, A.MENU_ICON

, A.PROGRAM_CD

, A.SYSCD

, A.MENU_DEPTH

, A.MENU_ORD

, A.USE_FL

, A.DEVICE_TYPE

, (CASE WHEN P.PROGRAM_URL IS NULL THEN '#' ELSE P.PROGRAM_URL END) AS PROGRAM_URL

, P.OPEN_ALL_FL

FROM TREE A

LEFT OUTER JOIN STD_PRGM_TB P

ON P.PROGRAM_CD = A.PROGRAM_CD

AND P.SYSCD = #{SYSCD}

WHERE A.USE_FL = 'Y'

AND A.SYSCD = #{SYSCD}

<if test = ' ACC_FROM == null '>

and A.DEVICE_TYPE ='PC'

</if>

<if test = ' ACC_FROM != null '>

and A.DEVICE_TYPE = #{ACC_FROM}

</if>

and (( A.PROGRAM_CD is not null and P.DEL_FL = 'N' and P.USE_FL = 'Y' )

or ( A.PROGRAM_CD is null ))

)

select

A.MENU_CD

, nvl(m2.MENU_NM, A.MENU_NM) AS MENU_NM

, A.UPPER_MENU_CD

, A.MENU_ICON

, A.PROGRAM_CD

, A.SYSCD

, A.MENU_DEPTH

, A.MENU_ORD

, A.PROGRAM_URL

, A.OPEN_ALL_FL

, (CASE WHEN nvl(B.CNT, 0) = 0 THEN 'true' ELSE 'false' END) as LEAF

, nvl(B.CNT, 0) as SUB,

s.MENU_PATH

from TREE_FILTERED A

JOIN (

WITH RECURSIVE ss AS (

SELECT

DISTINCT M.UPPER_MENU_CD

, M.MENU_CD

, M.MENU_NM

, CONCAT(LPAD(M.MENU_ORD, 3, 0), M.MENU_CD) AS MENU_PATH

, M.SYSCD

FROM STD_MENU_TB M

WHERE M.UPPER_MENU_CD IS NULL AND M.SYSCD = #{SYSCD}

UNION ALL

SELECT

DISTINCT M.UPPER_MENU_CD

, M.MENU_CD

, M.MENU_NM

, CONCAT(ss.MENU_PATH, LPAD(M.MENU_ORD, 3, 0), M.MENU_CD) AS MENU_PATH

, M.SYSCD

FROM STD_MENU_TB M

JOIN ss

ON M.UPPER_MENU_CD = ss.MENU_CD and M.SYSCD = #{SYSCD}

)

CYCLE UPPER_MENU_CD, MENU_CD, SYSCD RESTRICT

SELECT

ss.MENU_CD

, ss.MENU_PATH

, ss.SYSCD

FROM ss

) s

ON s.MENU_CD = A.MENU_CD and s.SYSCD = #{SYSCD}

LEFT OUTER JOIN STD_MENU_NM_TB m2

ON m2.SYSCD = #{SYSCD}

AND m2.MENU_CD = A.MENU_CD

AND m2.LANG = #{LANG}

left outer join (

select

UPPER_MENU_CD

, COUNT(*) as CNT

from TREE_FILTERED

group by UPPER_MENU_CD

) B

on B.UPPER_MENU_CD = A.MENU_CD

ORDER BY s.MENU_PATH

</select>

  

<select id="getUserPrgmList" parameterType="User" resultType="map">

/* user.LoginMapper.getUserPrgmList */

select

C.MENU_CD

, C.MENU_NM

, A.PROGRAM_CD

, A.PROGRAM_NM

, A.PROGRAM_URL

, A.OPEN_ALL_FL

, nvl(PROGRAM_MANUAL, D.HELP_URL) as PROGRAM_MANUAL

, B.AUTH_E as "auth-e"

, B.AUTH_D as "auth-d"

, B.AUTH_P as "auth-p"

from STD_PRGM_TB A

left join (

SELECT z.SYSCD, x.PROGRAM_CD, max(AUTH_E) as AUTH_E, max(AUTH_D) as AUTH_D, max(AUTH_P) as AUTH_P

FROM STD_AUTH_MAPPING_TB z, STD_AUTH_PRGM_MAPPING_TB x, STD_AUTH_USER_MAPPING_TB y

WHERE

z.AUTH_CD = x.AUTH_CD and z.AUTH_CD = y.AUTH_CD

and z.SYSCD = #{SYSCD}

and y.USER_ID = #{USER_ID}

<if test=' SINGLE_AUTH == "Y" '>

and z.AUTH_CD = #{AUTH_CD}

</if>

group by z.SYSCD, x.PROGRAM_CD

) B

on

A.SYSCD = B.SYSCD

and A.PROGRAM_CD = B.PROGRAM_CD

left join (

select c1.SYSCD, PROGRAM_CD, c1.MENU_CD, nvl(c2.MENU_NM, c1.MENU_NM) as MENU_NM

from STD_MENU_TB c1 left join STD_MENU_NM_TB c2

on c1.SYSCD = c2.SYSCD and c1.MENU_CD = c2.MENU_CD and c2.LANG = #{LANG}

where USE_FL = 'Y'

) C

on

A.SYSCD = C.SYSCD

and A.PROGRAM_CD = C.PROGRAM_CD

left join STD_HELP_TB D

on

A.SYSCD = D.SYSCD and A.PROGRAM_CD = D.PROGRAM_CD

where

A.SYSCD = #{SYSCD}

and A.USE_FL = 'Y'

and A.DEL_FL = 'N'

and (

A.OPEN_ALL_FL = 'Y' or

(

A.OPEN_ALL_FL = 'N'

and B.PROGRAM_CD is not null

)

)

<if test = ' ACC_FROM == null '>

and A.DEVICE_TYPE ='PC'

</if>

<if test = ' ACC_FROM != null '>

and A.DEVICE_TYPE = #{ACC_FROM}

</if>

</select>

  

<select id="selectPasswdUnchange" parameterType="string" resultType="map">

SELECT ( /* LoginMapper.selectPasswdUnchange */

SUBSTR(

TRUNCATE(ABS(TIMESTAMPDIFF(month,

SYSDATE(),

CASE

WHEN ( SELECT COUNT(*) FROM STD_USER_PW_HIST_TB WHERE USER_ID = #{VALUE} ) = 0

THEN ( SELECT INPUT_DT FROM STD_USER_VW WHERE USER_ID = #{VALUE} )

ELSE (

SELECT UPDATE_DT

FROM STD_USER_PW_HIST_TB

WHERE USER_ID = #{VALUE}

AND PASSWD_CHG_SEQ IN (

SELECT NVL(MAX(PASSWD_CHG_SEQ),0) FROM STD_USER_PW_HIST_TB WHERE USER_ID = #{VALUE}

)

)

END

)),0)

,1

,1

)

) AS UNCHANGE

FROM DUAL

</select>

  

<select id="selectPwRuleChangeDt" parameterType="hashMap" resultType="map">

/* user.LoginMapper.selectPwRuleChangeDt */

SELECT

CODE_CD, ETC_FIELD01 AS VALUE

FROM STD_CODE_TB

WHERE

CODE_GRP_CD = 'SYS00005'

AND CODE_CD = '030'

AND USE_FL = 'Y'

AND SYSCD = #{SYSCD}

AND LANG ='ko_KR'

</select>

  

<select id="selectUserGb" parameterType="string" resultType="map">

/* user.LoginMapper.selectUserGb */

SELECT

USER_GB

FROM STD_USER_VW

WHERE USER_ID = #{VALUE}

</select>

  

<select id="selectUserInfoById" parameterType="User" resultType="User">

/* user.LoginMapper.selectUserInfoById */

select x.*

from (

select

a.USER_ID

, a.LOGIN_ID

, a.SYSCD

, a.USER_NM

, a.PASSWD

, a.COMP_CD

, a.COMP_NM

, a.DEPT_CD

, a.DEPT_NM

, a.GRADE_CD

, a.GRADE_NM

, a.EMAIL

, a.LOCK_FL

, a.USER_GB

, STD_GET_CODE_NM_FN(a.SYSCD, 'SYS00004', a.USER_GB, null) AS USER_GB_NM

, b.DIVISION_CD

, STD_GET_DIVISION_NM_FN(a.SYSCD, b.DIVISION_CD) AS DIVISION_NM

, STD_GET_ADMIN_LEVEL_FN(a.USER_ID, b.AUTH_CD) AS ADMIN_GUBUN

, b.AUTH_CD

from STD_USER_VW a

left join (

<choose>

<when test=' SINGLE_AUTH == "Y" '>

/* 부여된 권한들 중 지정된 부문권한으로 권한 가져오기, 부문 정보 없을 시 사용자별 DEFAULT 권한 가져옴 */

select d3.DIVISION_CD, d3.AUTH_CD, d1.USER_ID, d1.DEFAULT_FL

from

STD_AUTH_USER_MAPPING_TB d1

join STD_AUTH_MASTER_TB d2 on d1.AUTH_CD = d2.AUTH_CD

join STD_AUTH_MAPPING_TB d3 on d1.AUTH_CD = d3.AUTH_CD

where

( d3.DIVISION_CD = #{DIVISION_CD}

or ( #{DIVISION_CD} is null and d1.DEFAULT_FL = 'Y' ))

and d2.USE_FL = 'Y' and d2.DEL_FL = 'N'

</when>

<otherwise>

/* 부여된 권한들 중 임의로 한개의 권한 가져오기 */

select d3.SYSCD, d3.DIVISION_CD, d3.AUTH_CD, d1.USER_ID, d1.DEFAULT_FL

from STD_AUTH_USER_MAPPING_TB d1, STD_AUTH_MASTER_TB d2, STD_AUTH_MAPPING_TB d3

where

d1.AUTH_CD = d2.AUTH_CD and d2.AUTH_CD = d3.AUTH_CD

and d2.USE_FL = 'Y' and d2.DEL_FL = 'N'

</otherwise>

</choose>

) b

on a.USER_ID = b.USER_ID

WHERE

a.LOGIN_ID = #{LOGIN_ID}

and a.SYSCD = #{SYSCD}

AND a.DEL_FL = 'N'

AND a.USE_FL = 'Y'

order by (CASE WHEN DEFAULT_FL = 'Y' THEN 0 ELSE 1 END)

) x

where ROWNUM() = 1

</select>

  

<update id="updatePasswdFailCount" parameterType="hashMap">

/* LoginMapper.updatePasswdFailCount */

UPDATE STD_USER_TB

SET PASSWD_FAIL_CNT = NVL(PASSWD_FAIL_CNT + 1, 1),

LOCK_FL = CASE

WHEN PASSWD_FAIL_CNT >= (SELECT

ETC_FIELD01 AS VALUE FROM STD_CODE_TB WHERE CODE_CD = '040' AND CODE_GRP_CD = 'SYS00005' AND LANG = 'ko_KR' AND SYSCD = #{SYSCD}) - 1

THEN 'Y'

ELSE 'N'

END

WHERE USER_ID = #{USER_ID}

</update>

  

<update id="updateZeroPasswdFailCount" parameterType="string">

/* LoginMapper.updateZeroPasswdFailCount */

UPDATE STD_USER_TB

SET PASSWD_FAIL_CNT = 0

WHERE USER_ID = #{VALUE}

</update>

  

<select id="isPasswordReset" parameterType="string" resultType="short">

/* LoginMapper.isPasswordReset, 비밀번호 초기화 여부 체크 */

select

case when count(*) = 0 then 0

else 1

end as RESULT
from STD_USER_PW_HIST_TB
where USER_ID = #{USER_ID}
and PASSWD_CHG_SEQ = ( select NVL(max(PASSWD_CHG_SEQ),0) from STD_USER_PW_HIST_TB where USER_ID = #{USER_ID})
and RESET_FL = 'Y'
</select>
</mapper>
```