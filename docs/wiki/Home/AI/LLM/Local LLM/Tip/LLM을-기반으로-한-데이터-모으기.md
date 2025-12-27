---
sticker: vault//이미지/개발 로고/TechIconSVG/AWS TechIcon SVG/Resource-Icons_02072025/Res_Artificial-Intelligence/Res-Amazon-SageMaker-Notebook-48.svg

slug: "LLM을-기반으로-한-데이터-모으기"
---
H-STD AI 어시스턴트 구축을 위해 프로젝트 코드와 연관 데이터를 스캔하고, 사용법 및 예시 등을 포함한 모든 정보를 하나의 Markdown 파일로 모으는 자동화 작업은 Gemini API를 활용하여 매우 효과적으로 구현할 수 있습니다.

이러한 자동화 시스템을 구성하는 단계를 자세히 설명해 드릴게요.

### 1단계: 데이터 소스 식별 및 초기 수집 전략

가장 먼저 H-STD AI 어시스턴트가 학습할 데이터를 어디에서 가져올지 정의해야 합니다.

- **코드 리포지토리:** H-STD 프로젝트의 모든 코드 파일 (Python, JavaScript, C#, Java 등).
- **문서 파일:** `README.md`, `CONTRIBUTING.md`, Wiki 페이지, 주석이 잘 정리된 코드 블록.
- **이슈 트래커/컨플루언스:** Jira, GitHub Issues, Confluence 등에 분산된 논의, 결정 사항, 해결책.
- **슬랙/디스코드 대화:** 특정 모듈이나 기능에 대한 논의, 해결 과정 (로그를 추출할 수 있다면).
- **기타 리소스:** 스택 오버플로우, 블로그 포스트 등 외부 자료 중 H-STD와 관련된 것.
    

**초기 수집 전략:**

- **Git 클론/API:** 코드 리포지토리는 `git clone` 명령어를 사용하거나 GitHub/GitLab API를 통해 최신 버전을 로컬에 가져옵니다.
- **파일 시스템 스캔:** 로컬에 클론된 프로젝트 폴더를 순회하며 `.py`, `.md`, `.json` 등 필요한 확장자의 파일을 식별합니다.
- **각 서비스 API:** Jira, Confluence, Slack 등 각 서비스에서 제공하는 API를 사용하여 관련 데이터를 추출합니다.


### 2단계: 데이터 전처리 및 청크 분할

AI 모델에 입력할 데이터를 효율적으로 준비하는 단계입니다.

1. **텍스트 추출:** 이미지나 PDF 등 텍스트가 아닌 형식의 문서에서 텍스트를 추출합니다.
2. **노이즈 제거:** 코드 주석, 불필요한 공백, 마크다운/HTML 태그 등 AI 분석에 방해가 되는 요소를 제거합니다.
3. **의미 단위 분할 (Chunking):** LLM은 입력 토큰(단어) 수에 제한이 있습니다. 따라서 길고 복잡한 문서를 의미 있는 작은 '청크(Chunk)'로 나누어야 합니다.
    - **코드:** 함수, 클래스, 또는 특정 로직 단위로 분할.
    - **문서:** 섹션, 문단, 또는 주제 단위로 분할.
    - **Tip:** 너무 짧지도, 너무 길지도 않게 적절한 길이로 분할하는 것이 중요합니다. 각 청크에 출처(파일 경로, 라인 번호 등)를 함께 저장해두면 나중에 추적하기 용이합니다.

### 3단계: Gemini API를 활용한 정보 추출 및 요약 (핵심 단계)

분할된 각 청크를 Gemini API에 보내어 필요한 정보를 추출하고 재구성하는 단계입니다.

1. **프롬프트 엔지니어링:** Gemini에게 어떤 정보를 추출하고 싶은지 명확하게 지시하는 프롬프트를 만듭니다.
    - **예시 프롬프트:**
```Markdown
이 코드는 H-STD 프로젝트의 일부입니다. 이 코드의 기능, 주요 클래스/함수 설명, 사용 예시를  형식으로 정리해 주세요. 필요한 경우 H-STD의 다른 부분과의 연관성도 언급해 주세요.

---
[여기에 코드 청크 내용 삽입]
---
```

또는
   
```markdown
 다음은 H-STD 프로젝트 관련 문서의 한 부분입니다. 이 내용이 설명하는 개념, 사용법, 그리고 H-STD에서 이 개념이 어떻게 활용되는지 명확하게 설명해주세요. Markdown 형식으로 정리하고, 필요한 경우 예시 코드나 추가 설명을 포함해주세요.

---
[여기에 문서 청크 내용 삽입]
---
```
        
2. **Gemini API 호출:** Python 라이브러리(예: `google-generativeai`)를 사용하여 각 청크와 프롬프트를 Gemini API로 보냅니다.
    - **API Key 관리:** API 키는 환경 변수 등으로 안전하게 관리해야 합니다.
    - **병렬 처리:** 처리할 청크 수가 많을 경우, API 호출을 병렬로 처리하여 시간을 절약할 수 있습니다. (rate limit 고려)
3. **응답 처리:** Gemini로부터 받은 Markdown 형식의 응답을 수집합니다. 각 응답에 해당 청크의 출처 정보를 포함시키면 나중에 문제 발생 시 도움이 됩니다.
    

### 4단계: 정보 통합 및 Markdown 파일 생성

Gemini가 생성한 모든 요약 및 추출된 정보를 하나의 큰 Markdown 파일로 합치는 단계입니다.
1. **구조화:** H-STD AI 어시스턴트가 사용하기 좋도록 일관된 목차와 구조를 설계합니다. 예를 들어, `모듈별`, `개념별`, `사용법별` 등으로 구분할 수 있습니다.
2. **병합:** Gemini로부터 받은 모든 Markdown 조각들을 정해진 구조에 따라 하나의 파일로 병합합니다.
3. **최종 검토 (선택 사항):** 너무 길거나 중복되는 부분이 있는지, 또는 중요한 정보가 누락되었는지 AI 또는 사람이 최종적으로 검토할 수 있습니다. (AI를 통한 최종 검토는 또 다른 Gemini API 호출이 될 수 있습니다.)
    

### 자동화 스크립트의 구성 (예시: Python)

```Python
import google.generativeai as genai
import os
import glob # 파일 검색용

# Gemini API 키 설정 (환경 변수 사용 권장)
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-pro')

def get_files_in_project(project_path, extensions=['.py', '.md', '.js', '.cs']):
    """프로젝트 경로에서 지정된 확장자의 파일 목록을 가져옵니다."""
    file_list = []
    for ext in extensions:
        file_list.extend(glob.glob(os.path.join(project_path, '**', f'*{ext}'), recursive=True))
    return file_list

def chunk_file_content(filepath, chunk_size=1000, overlap=100):
    """파일 내용을 청크로 분할합니다. (간단한 예시)"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    chunks = []
    for i in range(0, len(content), chunk_size - overlap):
        chunk = content[i : i + chunk_size]
        chunks.append({
            "content": chunk,
            "source": f"{filepath}:{i}" # 출처 정보 포함
        })
    return chunks

def process_chunk_with_gemini(chunk_data):
    """Gemini API를 호출하여 청크를 처리하고 정보 추출."""
    prompt = f"""
    아래는 H-STD 프로젝트 관련 코드 또는 문서의 일부입니다. 이 내용이 설명하는 기능, 주요 개념, 사용법 또는 코드 예시를 자세히 설명하고, Markdown 형식으로 정리해 주세요. H-STD의 다른 부분과의 연관성이 있다면 언급해 주세요.
    원본 출처: {chunk_data['source']}

    ---
    {chunk_data['content']}
    ---
    """
    try:
        response = model.generate_content(prompt)
        # response.text에서 마크다운 형식의 결과 추출
        return f"\n\n## {chunk_data['source'].split('/')[-1]} 에서 추출된 정보\n\n" + response.text
    except Exception as e:
        print(f"Error processing chunk from {chunk_data['source']}: {e}")
        return f"\n\n## Error processing {chunk_data['source']}\n\n" # 오류 처리

def main():
    project_root = "./H-STD-project" # H-STD 프로젝트 경로
    output_md_file = "H-STD_AI_Assistant_Knowledge_Base.md"
    
    all_summaries = []
    
    files = get_files_in_project(project_root)
    print(f"총 {len(files)}개의 파일 발견.")

    for i, filepath in enumerate(files):
        print(f"({i+1}/{len(files)}) 처리 중: {filepath}")
        chunks = chunk_file_content(filepath) # 파일 내용 청크 분할
        for chunk in chunks:
            summary = process_chunk_with_gemini(chunk)
            all_summaries.append(summary)
            # API rate limit를 고려하여 적절히 지연 시간을 줄 수 있습니다.
            # import time; time.sleep(1) 

    # 모든 요약된 정보를 하나의 마크다운 파일로 저장
    with open(output_md_file, 'w', encoding='utf-8') as f:
        f.write("# H-STD AI Assistant 지식 베이스\n\n")
        f.write("이 문서는 H-STD 프로젝트의 코드와 문서를 분석하여 자동으로 생성되었습니다.\n\n---\n\n")
        for summary in all_summaries:
            f.write(summary)
            f.write("\n\n---\n\n") # 각 섹션 구분
    
    print(f"자동화 작업 완료! 결과 파일: {output_md_file}")

if __name__ == "__main__":
    main()
```

### 주의사항 및 개선점

- **API 사용량 및 비용:** Gemini API는 사용량에 따라 비용이 발생합니다. 자동화 스크립트를 실행하기 전에 예상 사용량과 비용을 확인하세요.
- **프롬프트 최적화:** Gemini가 원하는 답변을 잘 생성하도록 프롬프트를 계속해서 개선하고 테스트해야 합니다.
- **청크 전략:** 파일 종류(코드, 문서)에 따라 청크를 나누는 전략을 다르게 가져가면 더 효과적입니다. 예를 들어, 코드는 함수 단위로, 문서는 문단 단위로 나눌 수 있습니다.
- **오류 처리:** 네트워크 문제, API 제한 초과 등 다양한 오류 상황에 대비한 견고한 오류 처리 로직을 추가해야 합니다.
- **버전 관리:** 이 자동화 스크립트 자체도 버전 관리 시스템(Git)으로 관리하는 것이 좋습니다.
- **증분 업데이트:** 프로젝트 코드가 변경될 때마다 전체를 다시 스캔하기보다는, 변경된 파일만 식별하여 업데이트하는 `증분 업데이트` 기능을 추가하면 효율적입니다.
- **백터 데이터베이스 (Vector Database):** 이 시스템으로 만든 MD 파일은 "H-STD AI Assistant"의 지식 기반이 됩니다. 나중에 이 AI 어시스턴트가 사용자 질문에 답변할 때는 이 MD 파일을 직접 사용하는 것보다는, RAG(Retrieval Augmented Generation) 패턴을 적용하여 **Vector Database**에 저장한 후 질문과 관련된 정보를 검색하여 Gemini에 프롬프트로 제공하는 방식이 더 효율적입니다.
- **CI/CD 연동:** GitHub Actions나 GitLab CI/CD와 같은 지속적 통합/배포 시스템에 이 스크립트를 연동하여, 코드 푸시 등의 이벤트 발생 시 자동으로 지식 베이스를 업데이트하도록 구성할 수 있습니다.

이러한 단계와 예시 코드를 통해 H-STD AI 어시스턴트를 위한 자동화된 지식 베이스 구축 시스템을 효과적으로 만들어낼 수 있을 것입니다.



그렇다면, Gemini API를 기반으로 H-STD 프로젝트의 개발자 가이드 및 사용 설명서에 대한 문서를 모으는 주제로 해당 구성 방법을 알려줘 아래 절차야
1. playnut이라는 디렉토리는 nuxt 기반 프로젝트야
2. 해당 프로젝트에 *.README.md 파일 있을 것이다. 해당 파일이 주 설명서 섹터가 될 것이다.
3. 해당 md 파일을 기반으로 데이터를 만들 것이라서, 해당 md 파일과 동일 주제인 샘플 코드 및 각 vue 파일의 사용성에 대한 부분을 모은다.
4. 모은 데이터를 slm 이 이해하기 편한 방식(텍스트 나열 또는 F&Q) 형식으로 데이터를 변형후 md 기번에서 `*.README.md` 를 파일명으로 한 후, ./prompt 디렉토리에 저장해줘  


---


### 1. 데이터 수집: 프로젝트 파일 읽기

가장 먼저 `playnut` 디렉토리의 모든 파일들을 스크립트가 읽을 수 있도록 준비해야 합니다.

- **주요 파일 식별:** Python의 `os` 또는 `pathlib` 모듈을 사용하여 `playnut` 디렉토리와 그 하위 디렉토리를 순회하며 `*.README.md` 파일과 모든 `.vue` 파일 경로를 식별합니다.
- **파일 내용 추출:** 식별된 각 파일의 내용을 텍스트 형식으로 읽어들입니다. 이 텍스트는 Gemini API에 전달될 입력 데이터가 됩니다.
- **데이터 구조화:** 이후 작업의 효율성을 위해, 각 파일의 내용과 함께 파일 경로, 유형(README, Vue 등)을 함께 저장하는 딕셔너리 또는 객체 리스트 형태로 데이터를 구성하는 것이 좋습니다.



```Python
import os
import glob

def collect_project_data(base_path):
    data = []
    # 1. README.md 파일 내용 읽기
    readme_path = os.path.join(base_path, 'README.md')
    if os.path.exists(readme_path):
        with open(readme_path, 'r', encoding='utf-8') as f:
            data.append({'type': 'readme', 'content': f.read(), 'path': readme_path})
    
    # 2. 모든 *.vue 파일 내용 읽기
    vue_files = glob.glob(os.path.join(base_path, '**', '*.vue'), recursive=True)
    for file_path in vue_files:
        with open(file_path, 'r', encoding='utf-8') as f:
            data.append({'type': 'vue_component', 'content': f.read(), 'path': file_path})
            
    return data

# 예시:
# project_data = collect_project_data('./playnut')
```

---

### 2. Gemini API를 활용한 데이터 변형

수집한 데이터를 기반으로 Gemini API에 요청을 보내 `SLM(LLM)`이 이해하기 쉬운 형태로 변형하는 핵심 단계입니다.
- **프롬프트 엔지니어링:** 각 파일의 역할을 명확히 지시하는 프롬프트를 작성합니다.
    - **`.vue` 파일용 프롬프트:** `*.vue` 파일의 코드와 마크업을 분석하여, 해당 컴포넌트의 기능, 사용된 Props 및 이벤트, 예시 코드 등을 추출하고 Markdown 형식으로 정리해달라고 요청합니다.
    - **전체 문서 통합용 프롬프트:** 모든 파일의 내용을 하나로 합쳐서, `FAQ`나 `주제별 요약` 등 사용자가 요청한 형식으로 최종 문서를 생성해달라고 요청합니다.
- **API 호출:** 수집한 각 파일의 내용을 Gemini API로 보냅니다. 파일이 많을 경우, 개별적으로 호출하기보다는 여러 파일의 내용을 하나의 청크로 합쳐서 보내는 것이 효율적일 수 있습니다.

**예시: `.vue` 파일 분석 프롬프트 및 호출**



```Python
import google.generativeai as genai
# API 키 설정
# genai.configure(api_key=...)

def analyze_vue_file_with_gemini(file_content):
    prompt = f"""
    아래는 Nuxt.js 기반의 Vue 컴포넌트 코드입니다. 이 컴포넌트의 목적과 사용 방법을 개발자를 위한 가이드 문서 형식으로 정리해 주세요. 다음 정보를 반드시 포함해 주세요:
    - **컴포넌트의 주요 기능 및 목적**
    - **사용 가능한 Props, Emit 등 외부 통신 방법**
    - **사용 예시(템플릿 코드)**
    - **관련된 로직(스크립트 섹션)에 대한 설명**
    
    결과는 명확한 마크다운 헤더와 코드 블록을 사용하여 보기 쉽게 정리해 주세요.
    ---
    {file_content}
    ---
    """
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content(prompt)
    return response.text

# 예시:
# vue_summary = analyze_vue_file_with_gemini(data['content'])
```

---

### 3. 최종 문서 생성: MD 파일로 저장

Gemini API가 생성한 모든 결과물을 하나로 모아 최종 `README.md` 파일을 만드는 단계입니다.

1. **초기 내용 설정:** `playnut` 프로젝트의 기존 `README.md` 내용을 최종 문서의 가장 상단에 배치합니다.
2. **모듈별 정리:** Gemini가 분석한 각 `.vue` 파일의 결과물(사용법, 예시 등)을 컴포넌트 이름별로 분류하여 기존 `README.md` 내용 아래에 순서대로 추가합니다.
3. **FAQ/주제별 변형:** (선택 사항) 만약 F&Q 형식으로 변형하고 싶다면, 모든 내용을 한데 모은 후 **한 번 더 Gemini API를 호출**하여 F&Q 형식으로 변환을 요청할 수 있습니다.
4. **파일 저장:** 모든 내용이 완성되면 `./prompt` 디렉토리를 생성하고, `*.README.md` 파일로 저장합니다. 이 파일은 H-STD AI 어시스턴트의 학습 데이터로 사용될 것입니다.

**예시: 최종 문서 저장 스크립트**



```Python
def save_final_documentation(final_content, output_dir='./prompt', filename='README.md'):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    output_path = os.path.join(output_dir, filename)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(final_content)
    
    print(f"최종 문서가 '{output_path}'에 저장되었습니다.")

# 예시:
# final_document_content = "..." # 모든 내용을 합친 문자열
# save_final_documentation(final_document_content)
```

이러한 자동화 시스템을 구축하면, H-STD 프로젝트에 새로운 컴포넌트가 추가되거나 기존 코드가 변경될 때마다 CI/CD 파이프라인에 이 스크립트를 연결하여 **지속적으로 최신 문서가 자동 업데이트되도록** 할 수 있습니다.


---


아래는 `.ts` 파일 참조를 추가하여 업데이트된 자동화 절차입니다.

### 1. 데이터 수집: `.vue`와 `.ts` 파일 읽기

가장 먼저 `playnut` 디렉토리와 그 하위 디렉토리에서 모든 `.vue` 및 `.ts` 파일을 식별하고 그 내용을 읽어들여야 합니다. 이 단계에서 각 파일의 유형을 명확히 구분하는 것이 중요합니다.



```Python
import os
import glob

def collect_project_data(base_path):
    data = []
    # 1. README.md 파일 내용 읽기
    readme_path = os.path.join(base_path, 'README.md')
    if os.path.exists(readme_path):
        with open(readme_path, 'r', encoding='utf-8') as f:
            data.append({'type': 'readme', 'content': f.read(), 'path': readme_path})
    
    # 2. 모든 *.vue 및 *.ts 파일 내용 읽기
    target_extensions = ['*.vue', '*.ts']
    for ext in target_extensions:
        file_list = glob.glob(os.path.join(base_path, '**', ext), recursive=True)
        for file_path in file_list:
            file_type = 'vue_component' if ext == '*.vue' else 'typescript_logic'
            with open(file_path, 'r', encoding='utf-8') as f:
                data.append({'type': file_type, 'content': f.read(), 'path': file_path})
            
    return data

# 예시:
# project_data = collect_project_data('./playnut')
```

---

### 2. Gemini API를 활용한 데이터 변형 및 통합

수집된 파일의 유형에 따라 적절한 프롬프트를 사용하여 Gemini API를 호출합니다. `.ts` 파일의 경우, `.vue` 파일과는 다른 관점에서 분석을 요청해야 합니다.
- **`.vue` 파일용 프롬프트:** (이전과 동일) 컴포넌트의 기능, Props, 사용 예시 등을 중심으로 요청합니다.
- **`.ts` 파일용 프롬프트:** 이 파일이 정의하는 **함수, 클래스, 인터페이스의 역할과 목적**을 설명해달라고 요청합니다. 또한, **어떤 `.vue` 컴포넌트와 연관되어 사용될 수 있는지**에 대한 설명도 함께 요청하여 문서의 연관성을 높입니다.

**예시: `.ts` 파일 분석 프롬프트 및 호출**

```Python
import google.generativeai as genai
# API 키 설정
# genai.configure(api_key=...)

def analyze_ts_file_with_gemini(file_content):
    prompt = f"""
    아래는 H-STD 프로젝트의 TypeScript 로직 파일입니다. 이 코드가 수행하는 주요 역할과 기능을 개발자 가이드 문서 형식으로 설명해주세요. 다음 정보를 반드시 포함해 주세요:
    - **파일의 주요 목적 및 기능**
    - **주요 함수/클래스/인터페이스에 대한 설명**
    - **다른 컴포넌트나 로직과 어떻게 상호작용하는지**
    - **사용 예시**
    
    결과는 명확한 마크다운 헤더와 코드 블록을 사용하여 보기 쉽게 정리해 주세요.
    ---
    {file_content}
    ---
    """
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content(prompt)
    return response.text

# 예시:
# ts_summary = analyze_ts_file_with_gemini(data['content'])
```

---

### 3. 최종 문서 생성: MD 파일로 저장

모든 `.vue`와 `.ts` 파일의 분석 결과가 준비되면, 이들을 최종 `README.md` 파일로 합치는 작업이 필요합니다.

1. **초기 내용 설정:** 기존 `README.md` 내용을 최종 문서의 상단에 배치합니다.
2. **분류 및 병합:** Gemini가 분석한 `.vue`와 `.ts` 파일의 결과물을 **주제별** 또는 **모듈별**로 분류하여 기존 `README.md` 내용 아래에 순서대로 추가합니다.
3. **파일 저장:** 완성된 문서를 `./prompt` 디렉토리에 `README.md` 파일로 저장합니다.

이러한 구성은 H-STD 프로젝트의 코드와 로직을 모두 아우르는 포괄적인 개발자 가이드를 자동으로 생성하는 데 큰 도움이 될 것입니다.