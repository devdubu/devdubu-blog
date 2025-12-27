---
id: docusaurus-guide
title: Docusaurus 사용 가이드
slug: /docusaurus-guide
sidebar_position: 1
---

# 🦕 Docusaurus 사용 가이드

이 문서는 현재 구축된 Docusaurus 위키 시스템을 사용하는 방법과 유용한 문법을 설명합니다.

## 📂 파일 및 폴더 구조

`wiki/docs` 디렉토리가 사이트의 메인 콘텐츠 저장소입니다.

- **폴더 생성**: `docs` 내에 폴더를 만들면 사이드바에 카테고리로 표시됩니다.
- **파일 생성**: `.md` 또는 `.mdx` 파일을 만들면 페이지가 생성됩니다.
- **순서 조정**: 폴더나 파일 앞에 번호(예: `1. App`, `2. Server`)를 붙이면 순서대로 정렬됩니다. 파일 내부의 `sidebar_position` 프론트매터로도 제어 가능합니다.

## 📝 새 문서 작성하기

모든 문서는 상단에 **Frontmatter**를 포함해야 합니다.

```md
---
title: 내 문서 제목
slug: /my-custom-url (선택 사항)
tags: [tag1, tag2]
---

# 제목
내용...
```

## 🎨 주요 문법 가이드

Docusaurus는 Markdown(CommonMark)과 MDX(React 포함 Markdown)를 지원합니다.

### 1. 강조 (Highlights)

Obsidian에서 사용하던 `==텍스트==`는 이제 HTML `<mark>` 태그로 변환되어 표시됩니다.

- 문법: `<mark>중요한 내용</mark>`
- 결과: <mark>중요한 내용</mark>

### 2. 알림 박스 (Admonitions)

Obsidian의 Callout(`> [!NOTE]`)은 Docusaurus의 Admonition으로 변환됩니다.

```md
:::note
이것은 참고 사항입니다.
:::

:::tip
이것은 팁입니다.
:::

:::info
정보 제공용입니다.
:::

:::warning
주의사항입니다.
:::

:::danger
위험 경고입니다.
:::
```

**결과 미리보기:**

:::note
이것은 참고 사항입니다.
:::

### 3. 코드 블록

언어를 명시하여 하이라이팅을 적용할 수 있습니다.

    ```python
    print("Hello Docusaurus")
    ```

제목을 추가할 수도 있습니다:

    ```bash title="install.sh"
    npm install
    ```

### 4. 탭 (Tabs)

여러 언어나 옵션을 보여줄 때 유용합니다.

```jsx
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="apple" label="Apple" default>
    사과는 빨개요.
  </TabItem>
  <TabItem value="orange" label="Orange">
    오렌지는 주황색이에요.
  </TabItem>
</Tabs>
```

### 5. 이미지 추가

이미지는 `wiki/docs/이미지 창고` 또는 해당 문서와 같은 폴더에 둡니다.

```md
![이미지 설명](./my-image.png)
```

## 🚀 사이트 빌드 및 실행

터미널에서 `wiki` 폴더로 이동 후 실행합니다.

### 로컬 실행 (개발용)
실시간으로 수정 사항을 확인하려면:
```bash
npm start
```
`http://localhost:3000` 에서 확인 가능합니다.

### 배포용 빌드
정적 파일을 생성하려면:
```bash
npm run build
```
`build` 폴더에 생성됩니다.

---
궁금한 점이 있다면 Docusaurus 공식 문서를 참고하세요: [https://docusaurus.io/docs](https://docusaurus.io/docs)
