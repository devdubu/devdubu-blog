---
sticker: vault//이미지/개발 로고/TechIconSVG/AWS TechIcon SVG/Resource-Icons_02072025/Res_Artificial-Intelligence/Res-Amazon-SageMaker-Model-48.svg

slug: "Local-LLM-구동을-위한-사전-작업"
---
### M2 맥북에어에서 Anaconda로 Gemma 3 로컬 환경 구축하기 (VRAM 설정 포함)

M2 칩이 탑재된 맥북 에어(16GB 통합 메모리)에서 로컬 대규모 언어 모델(LLM)인 Gemma 3를 실행하기 위한 전체 과정을 안내합니다. Anaconda를 사용하여 가상환경을 구축하고, Hugging Face 라이브러리를 통해 모델을 설정하며, VRAM 사용량을 조절하는 방법까지 상세히 다룹니다.

---

### 1. Anaconda 설치하기 💻

Anaconda는 파이썬과 여러 데이터 사이언스 패키지를 손쉽게 관리할 수 있게 해주는 배포판입니다.
1. **Anaconda 설치 파일 다운로드**: [Anaconda 공식 홈페이지](https://www.anaconda.com/download)에 접속하여 macOS용 그래픽 설치 프로그램(Graphical Installer)을 다운로드합니다. M2 칩이므로 **Apple Silicon (M2/M3)** 버전을 선택해야 합니다.
2. **설치 진행**: 다운로드한 `.pkg` 파일을 실행하고, 화면의 지시에 따라 설치를 진행합니다. "Install for me only" 옵션을 선택하는 것을 권장합니다.
3. **설치 확인 및 초기 설정**: 설치가 완료되면 터미널(Terminal) 앱을 엽니다. `conda --version` 명령어를 입력했을 때 버전 정보가 나오면 성공적으로 설치된 것입니다.
    설치 과정에서 자동으로 `conda init`이 실행되어 쉘 설정 파일(`.zshrc`)에 초기화 코드가 추가됩니다. 터미널을 새로 시작하면 프롬프트 앞에 `(base)`가 표시되는데, 이는 기본 Anaconda 환경이 활성화되었음을 의미합니다.
    

---

### 2. 가상환경 구축 및 패키지 설치 📦

프로젝트별로 독립된 환경을 만들어 패키지 충돌을 방지하는 것이 좋습니다. 여기서는 `gemma-env`라는 이름의 가상환경을 생성하겠습니다.

1. **가상환경 생성**: 터미널에 다음 명령어를 입력하여 Python 3.10 버전의 가상환경을 생성합니다.
```Bash
conda create -n gemma-env python=3.10
```
- 진행 여부를 물으면 `y`를 입력하고 엔터를 누릅니다.
2. **가상환경 활성화**: 생성한 가상환경으로 진입합니다.
```Bash
conda activate gemma-env
```
- 이제 터미널 프롬프트가 `(gemma-env)`로 바뀝니다.
3. **필수 라이브러리 설치**: Hugging Face와 PyTorch를 설치합니다. M2 맥북에서는 Apple Silicon의 GPU(MPS)를 활용하기 위해 PyTorch를 특정 방식으로 설치하는 것이 중요합니다.
```Bash
# PyTorch 설치 (Apple Silicon/MPS 지원), Hugging Face 관련 라이브러리 설치
 pip install torch torchvision torchaudio transformers huggingface_hub accelerate sentencepiece
``` 
- `transformers`: Hugging Face 모델을 쉽게 다룰 수 있게 해주는 핵심 라이브러리입니다.
- `huggingface_hub`: Hugging Face Hub에서 모델을 다운로드하는 데 필요합니다.
- `accelerate`: 모델 로딩 및 실행을 최적화해줍니다.
- `bitsandbytes`: 모델을 4비트 또는 8비트로 양자화(quantization)하여 메모리 사용량을 줄이는 데 사용됩니다.

---

### 3. Gemma 모델 다운로드 및 로컬 실행 🚀

이제 Hugging Face Hub에서 Gemma 모델을 다운로드하여 로컬에서 실행하는 코드를 작성합니다.

1. **Hugging Face 로그인**: 모델에 접근하려면 Hugging Face 계정이 필요하며, 접근 토큰을 발급받아야 합니다.
    - [Hugging Face 웹사이트](https://huggingface.co/settings/tokens)에서 로그인 후 **Access Tokens** 메뉴로 이동하여 새 토큰을 생성합니다.
    - 터미널에 다음 명령어를 입력하고 발급받은 토큰을 붙여넣어 로그인합니다.
        
```Bash
huggingface-cli login
```    
2. **Gemma 모델 사용 동의**: 사용하려는 Gemma 모델 페이지(예: [google/gemma-1.1-7b-it](https://huggingface.co/google/gemma-1.1-7b-it))로 이동하여 라이선스에 동의해야 모델을 다운로드할 수 있습니다.
3. **Python 스크립트 작성**: 원하는 편집기를 사용하여 `run_gemma.py`와 같은 이름의 파이썬 파일을 만들고 아래 코드를 작성합니다. 이 코드는 4비트 양자화를 적용하여 16GB 메모리 환경에서도 원활히 실행되도록 합니다.
    
    
```Python
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
import os

# --- 1. 모델 ID 설정 ---
model_id = "google/gemma-3-4b-it"

# --- 2. 시스템 프롬프트 파일 경로 설정 및 읽기 ---
prompt_file_path = os.path.join("prompt", "Button_prompt_light.md")

try:
	with open(prompt_file_path, "r", encoding="utf-8") as f:
	# 파일 내용을 '시스템 메시지'로 저장합니다.
		system_message = f.read()
	print(f"✅ 성공적으로 '{prompt_file_path}' 파일에서 시스템 프롬프트를 불러왔습니다.")
except FileNotFoundError:
	print(f"❌ 에러: '{prompt_file_path}' 파일을 찾을 수 없습니다.")
	exit()

print("\n모델과 토크나이저를 로딩합니다... (시간이 걸릴 수 있습니다)")

# 토크나이저 로드
tokenizer = AutoTokenizer.from_pretrained(model_id)

# bfloat16 데이터 타입을 사용하여 모델을 로드
model = AutoModelForCausalLM.from_pretrained(
	model_id,
	torch_dtype=torch.bfloat16,
	device_map="auto"
)

print("✅ 모델 로딩 완료! '종료'를 입력하면 대화를 마칩니다.")
print("-" * 30)

# --- 3. 대화 기록을 관리할 리스트 생성 ---

# 시스템 메시지를 첫 번째 'user' 메시지로 넣어 AI의 역할을 정의합니다.

conversation_history = [
	{"role": "user", "content": system_message},
	{"role": "model", "content": "네, 알겠습니다. 주어진 지침에 따라 답변해 드리겠습니다. 무엇을 도와드릴까요?"}
]

# --- 4. 무한 루프를 통해 대화 시작 ---

while True:
	user_input = input("You: ")
	
	if user_input.lower() in ["종료", "exit"]:
		print("대화를 종료합니다.")
		break

  

	# 현재 사용자 입력을 대화 기록에 추가
	conversation_history.append({"role": "user", "content": user_input})
	
	# 전체 대화 기록을 프롬프트로 변환
	
	prompt = tokenizer.apply_chat_template(conversation_history, tokenize=False, add_generation_prompt=True)
	inputs = tokenizer.encode(prompt, add_special_tokens=False, return_tensors="pt")
	inputs = inputs.to(model.device)

  

	print("AI가 생각 중입니다...")
	# 텍스트 생성
	outputs = model.generate(
		input_ids=inputs,
		max_new_tokens=1024,
		do_sample=True,
		top_k=50,
		top_p=0.95
	)

	# 생성된 텍스트에서 AI의 답변만 추출
	full_response = tokenizer.decode(outputs[0], skip_special_tokens=True)
	
	# 마지막 'model' 역할의 응답을 찾아서 분리
	last_model_marker = "<start_of_turn>model"
	model_response_start = full_response.rfind(last_model_marker)
	model_response = full_response[model_response_start + len(last_model_marker):].strip()

	print("\n--- AI 응답 ---")
	print(model_response)
	print("-" * 30)

	# AI의 답변도 대화 기록에 추가하여 다음 대화의 맥락으로 사용
	conversation_history.append({"role": "model", "content": model_response})   
```
4. **스크립트 실행**: 터미널에서 작성한 파이썬 스크립트를 실행합니다.
```Bash
python run_gemma.py
```
- 처음 실행 시에는 모델 파일을 다운로드하므로 시간이 다소 걸릴 수 있습니다.

---

### 4. VRAM 사용량 제한 및 조절하기 (macOS Unified Memory) 🧠

MacBook의 M-시리즈 칩은 CPU와 GPU가 **통합 메모리(Unified Memory)**를 공유합니다. macOS는 자동으로 메모리를 할당하지만, LLM과 같이 GPU 메모리를 많이 사용하는 작업을 위해 할당량을 수동으로 늘릴 수 있습니다.

- **기본 할당량**: 일반적으로 macOS는 전체 통합 메모리의 약 2/3 (16GB 모델의 경우 약 10-11GB)를 GPU(VRAM)용으로 할당합니다.
- **VRAM 할당량 늘리기**: 터미널에 다음 명령어를 입력하여 GPU에 할당되는 메모리 양을 늘릴 수 있습니다. 16GB 메모리 모델의 경우, 시스템 운영에 필요한 최소한의 메모리(예: 4GB)를 남기고 나머지를 할당하는 것이 좋습니다.
    예를 들어, **12GB (12288MB)**를 VRAM으로 할당하려면:
    
    
```Bash
sudo sysctl iogpu.wired_limit_mb=12288
```
- `sudo` 명령어이므로 시스템 암호를 입력해야 합니다.
- 이 설정은 **재부팅하면 초기화**됩니다. 따라서 필요할 때마다 다시 설정해주어야 합니다.
- **주의사항**:
    - 너무 많은 메모리를 VRAM에 할당하면 다른 응용 프로그램의 작동이 느려지거나 시스템이 불안정해질 수 있습니다.
    - 16GB 모델에서는 **12GB ~ 13GB (13312MB)** 사이로 설정하는 것이 안정적입니다.

이 가이드를 통해 M2 맥북 에어에서 Anaconda 환경을 설정하고, 메모리 제약 속에서도 효율적으로 Gemma 모델을 로컬에서 실행할 수 있습니다.


![스크린샷-2025-09-01-오후-12.48.58.png](/img/이미지 창고/스크린샷-2025-09-01-오후-12.48.58.png)

성공!
겁네 오래걸리네 근데 ;; 양자화는 필수인듯;;

## RAG 방식 도입

### 필수 패키지
```bash
pip install sentence-transformers faiss-cpu
```

![스크린샷-2025-09-01-오후-6.41.59.png](/img/이미지 창고/스크린샷-2025-09-01-오후-6.41.59.png)

- RAG을 사용하다보니, 확실히 단순 prompt 작업보다 답변 성능이 비약적으로 상승한다.
- 이제는 속도 보다는 모델 자체가 질문을 했을 때 잘 알아 듣는지에 대한 문제가 발생된다.
  
  gemini는 아래와 같은 데이터가 좋다고 말한다.

```md
... (기존 사용 예제) ...

---

## 자주 묻는 질문 (FAQ)

**Q: 버튼에 아이콘을 어떻게 추가하나요?**
A: `font-icon` prop에 'mdi mdi-content-save'와 같은 MDI 아이콘 코드를 문자열로 전달하여 아이콘을 추가할 수 있습니다. 이미지 아이콘을 사용하려면 `image-icon` prop에 이미지 경로를 제공하세요.

**Q: 버튼을 안 보이게 숨기려면 어떻게 하나요?**
A: `hidden` prop을 `true`로 설정하면 버튼이 화면에 렌더링되지 않습니다.

**Q: 버튼 클릭을 막고 비활성화 상태로 만들고 싶어요.**
A: `disabled` prop을 `true`로 설정하면 사용자가 버튼을 클릭할 수 없으며, 시각적으로 비활성화 상태로 보입니다.
```

RAG 시스템의 검색 정확도를 극한으로 끌어올리는 비밀이 바로 거기에 있습니다.
**기술 문서**보다 **FAQ 형식**이 사용자의 자연어 질문에 대한 검색 정확도가 더 높은 경향이 있습니다.

---

### 왜 FAQ 형식이 더 정확할까요?

이유는 **'의미적 정렬(Semantic Alignment)'** 때문입니다.
- **사용자의 입력:** 대부분 **'질문'**의 형태입니다. (예: "버튼 색상은 어떻게 바꾸나요?")
- **기술 문서:** **'설명'**의 형태입니다. (예: "색상 클래스에는 `btn_primary`가 있습니다.")
- **FAQ 문서:** **'질문과 답변'**의 형태입니다. (예: "Q: 버튼 색상은 어떻게 바꾸나요? A: 색상 클래스를 사용합니다.")

Vector DB는 의미(벡터)가 가장 가까운 것을 찾아옵니다. 당연히 **'질문' 벡터는 '질문' 벡터와 가장 가깝습니다.** 따라서 사용자의 질문은 기술 문서의 설명 부분보다 FAQ의 질문 부분과 훨씬 더 강력하게 일치하게 됩니다.

이는 우리가 구글에서 검색할 때, 단순 정보 페이지보다 다른 사람이 올린 질문과 답변 글(블로그, Stack Overflow 등)이 더 상단에 노출되는 원리와 같습니다.

---

###  기술 문서 vs. FAQ 형식 비교

| 구분         | 기술 문서 형식                 | FAQ 형식                      |
| ---------- | ------------------------ | --------------------------- |
| **목적**     | 체계적인 정보 전달 (A to Z)      | 특정 문제의 신속한 해결               |
| **검색 정확도** | 좋음 (키워드 기반)              | **매우 뛰어남** (사용자 질문과 구조가 일치) |
| **정보의 깊이** | 깊고 체계적임                  | 간결하고 핵심적임                   |
| **장점**     | 전체적인 맥락과 깊은 정보 제공        | 사용자의 질문 의도에 즉각적으로 반응        |
| **단점**     | 자연어 질문에 대한 반응성이 떨어질 수 있음 | 전체적인 맥락이 부족할 수 있음           |

---

### ## 최상의 전략: 두 형식의 장점을 모두 취하는 것

그렇다고 기술 문서를 모두 버리고 FAQ로만 채우는 것은 정답이 아닐 수 있습니다. 왜냐하면 LLM이 풍부하고 깊이 있는 답변을 생성하기 위해서는 FAQ의 간결한 답변뿐만 아니라, 기술 문서의 체계적인 정보(Props 테이블, 상세 설명 등)도 필요하기 때문입니다.

**가장 이상적인 전략은 두 형식을 혼합하는 것입니다.**

**`button_rag.md`의 최종 진화 형태:**

```Markdown
# CButton 컴포넌트

## 개요
- CButton은 Playnut 프레임워크의 표준 버튼 컴포넌트입니다.
- ...

## 주요 속성 (Props)
| 속성 | 설명 | 타입 | 기본값 |
| :--- | :--- | :--- | :--- |
| `text` | 버튼에 표시될 텍스트입니다. | `string` | `''` |
| ... | ... | ... | ... |

## CSS 스타일링
### 색상 클래스
| 클래스명 | 설명 |
| :--- | :--- |
| `btn_primary` | 주요 스타일 |
| ... | ... |

---
## 자주 묻는 질문 (FAQ) - 검색 정확도 담당

**Q: 버튼 색깔은 어떻게 바꾸나요?**
A: `btn_primary`, `btn_main`과 같은 미리 정의된 색상 CSS 클래스를 `class` prop에 추가하여 변경할 수 있습니다. 자세한 목록은 'CSS 스타일링' 섹션을 참고하세요.

**Q: 버튼에 아이콘을 넣고 싶어요.**
A: `font-icon` prop을 사용하여 MDI 아이콘을 추가할 수 있습니다. 예: `<CButton font-icon="mdi mdi-content-save" />`

**Q: 버튼을 클릭할 수 없게 만들려면 어떻게 해야 하나요?**
A: `disabled` prop을 `true`로 설정하면 버튼이 비활성화됩니다.
```

#### 이렇게 구성하면:

1. 사용자가 "버튼 색깔 변경"이라고 질문하면, Retriever는 FAQ의 "Q: 버튼 색깔은 어떻게 바꾸나요?" 부분과 높은 유사도를 감지합니다.
2. 이 질문이 포함된 **문서 청크(Chunk) 전체**가 LLM에게 전달됩니다.
3. LLM은 FAQ의 간결한 답변("색상 CSS 클래스를 사용하세요")과 함께, 같은 청크에 포함된 **'CSS 스타일링' 섹션의 전체 색상 클래스 테이블**까지 참고하여 매우 상세하고 정확한 답변을 생성하게 됩니다.

결론적으로, 기술 문서와 FAQ는 경쟁 관계가 아니라 **서로를 보완하는 최고의 파트너**입니다.
- **FAQ:** 사용자의 질문을 정확하게 낚아채는 '낚싯바늘' 역할
- **기술 문서:** 낚아챈 질문에 대해 풍부한 답변을 제공하는 '지식 본문' 역할

## RAG_PROMPT_TEMPLATE 역할의 중요성


```py
# LLM에게 전달될 최종 프롬프트 템플릿 (개선된 버전)

RAG_PROMPT_TEMPLATE = """
당신은 사용자의 요구사항을 분석하여 코드를 수정하고 생성하는 Vue.js 코드 전문가 어시스턴트입니다.
[제공된 기술 문서]
{context}

[사용자 질문]
{question}
---

[지시사항]
1. 사용자의 [질문] 의도를 파악하여, [제공된 기술 문서]의 예제 코드 중에서 가장 관련 있는 부분만 **추출하거나 재구성**하세요.
2. 예를 들어, "기본 사용법"을 질문했다면 'readonly'나 'disabled' 예제는 결과에 포함하지 마세요.
3. 추출된 `<template>` 부분에 필요한 변수나 함수만 `<script setup>` 부분에 남겨두고, 관련 없는 코드는 제거하세요.
4. **반드시 코드만 간결하게 제공하고, 코드 외의 설명은 덧붙이지 마세요.**

[답변 코드]
"""
```


### RAG 기반 SLM에 History 
이전 대화 내용을 기억하게 만들려면, 즉 **'상태 있음(Stateful)'**으로 만들려면 **'대화 기록(Conversation History)'**을 RAG 파이프라인에 통합해야 합니다.

가장 이상적이고 확실한 방법을 알려드리겠습니다.

---

### ## 해결책: '질문 재작성(Query Rewriting)'을 통한 맥락 이해

사용자가 "버튼은 어때?" 와 같이 대명사나 축약어를 사용한 후속 질문을 했을 때, 검색 시스템이 맥락을 이해하지 못하는 것이 가장 큰 문제입니다. 검색기는 "버튼은 어때?" 라는 문장만으로는 어떤 문서(`button_rag.md`)를 찾아야 할지 모르기 때문이죠.

이 문제를 해결하기 위해, **본격적인 검색(Retrieval)을 시작하기 전에 LLM을 이용해 사용자의 모호한 질문을 맥락에 맞게 명확한 질문으로 재작성**하는 단계를 추가합니다.

#### 작동 방식

1. **사용자 질문**: "버튼은 어때?"
2. **대화 기록**:
    - **User**: "체크박스를 비활성화하려면 어떻게 해?"
    - **Assistant**: "`disabled` prop을 `true`로 설정하면 됩니다..."
3. **질문 재작성 단계 (LLM 1차 호출)**:
    - **입력**: (대화 기록) + "버튼은 어때?"
    - **지시**: "위 대화 내용을 바탕으로, 사용자의 마지막 질문을 독립적인 완전한 질문으로 다시 작성해줘."
    - **결과 (재작성된 질문)**: "**버튼을 비활성화하려면 어떻게 해?**"
4. **RAG 검색**: 재작성된 명확한 질문으로 Vector DB를 검색하여 `button_rag.md`를 정확히 찾아냅니다.
5. **답변 생성 (LLM 2차 호출)**: 찾아낸 문서와 재작성된 질문으로 최종 답변을 만듭니다.

---

### 구현 코드: `rag_core.py` 및 `app.py` 수정

#### 1단계: `rag_core.py` 수정

답변 생성 함수(`get_answer`)가 대화 기록을 인자로 받도록 하고, 내부에 질문 재작성 로직을 추가합니다.

**`rag_core.py` (수정)**

```Python
# ... (파일 상단은 동일) ...

# 질문 재작성을 위한 프롬프트 템플릿 추가
REWRITE_PROMPT_TEMPLATE = """
당신은 사용자의 질문을 명확하게 재작성하는 AI입니다.
주어진 [대화 기록]을 참고하여, 사용자의 마지막 [질문]을 다른 정보 없이도 그 자체로 의미가 명확한 하나의 완전한 질문으로 다시 작성해주세요.

[대화 기록]
{chat_history}

[질문]
{question}

[재작성된 질문]
"""

class RAGSystem:
    # ... (__init__ 및 다른 함수들은 동일) ...

    def get_answer(self, question: str, chat_history: list = []) -> dict:
        """
        사용자 질문과 '대화 기록'을 받아 RAG 파이프라인을 거쳐 답변을 반환합니다.
        """
        # 1. 질문 재작성 (Query Rewriting)
        # 대화 기록이 있을 경우에만 재작성 수행
        if chat_history:
            history_str = "\n".join([f"{msg['role']}: {msg['content']}" for msg in chat_history])
            rewrite_prompt = REWRITE_PROMPT_TEMPLATE.format(chat_history=history_str, question=question)
            
            response = self.llm(
                rewrite_prompt, max_tokens=128, stop=["\n"], echo=False
            )
            rewritten_question = response['choices'][0]['text'].strip()
            print(f"   (질문 재작성: '{question}' -> '{rewritten_question}')")
        else:
            rewritten_question = question

        # 2. 검색 (Retrieve) - 재작성된 질문으로 검색
        query_embedding = self.embedding_model.encode([rewritten_question])
        distances, indices = self.vector_db.search(np.array(query_embedding), k=1)
        
        retrieved_doc = self.docs[indices[0][0]]
        source_file = self.metadata[indices[0][0]]['source']
        
        # 3. 프롬프트 구성 (Augment) - 재작성된 질문 사용
        final_prompt = RAG_PROMPT_TEMPLATE.format(context=retrieved_doc, question=rewritten_question)

        # 4. 답변 생성 (Generate)
        response = self.llm(
            final_prompt, max_tokens=1024, temperature=0.2,
            stop=["[질문]"], echo=False
        )
        answer = response['choices'][0]['text']
        
        return {'answer': answer.strip(), 'source': source_file}

```

#### 2단계: `app.py` 수정

Streamlit의 `session_state`에 저장된 대화 기록을 `get_answer` 함수에 전달하도록 수정합니다.

**`app.py` (수정)**

```Python
# ... (파일 상단은 동일) ...

# 사용자 입력 처리
if prompt := st.chat_input("질문을 입력하세요..."):
    # 사용자 메시지를 대화 기록에 추가하고 화면에 표시
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    # AI 응답 생성 및 표시
    with st.chat_message("assistant"):
        with st.spinner("답변을 생성하는 중입니다..."):
            # get_answer 호출 시, 현재까지의 대화 기록(st.session_state.messages)을 전달
            response = rag_system.get_answer(prompt, chat_history=st.session_state.messages)
            answer = response['answer']
            source = response['source']
            
            full_response = f"{answer}\n\n---\n*참조 문서: `{source}`*"
            st.markdown(full_response)
    
    # AI 메시지를 대화 기록에 추가
    st.session_state.messages.append({"role": "assistant", "content": full_response})

```

---

### ## 요약

1. **`rag_core.py`**에 `REWRITE_PROMPT_TEMPLATE`를 추가하고, `get_answer` 함수가 `chat_history`를 받아 질문 재작성 로직을 수행하도록 수정했습니다.
2. **`app.py`**에서 `rag_system.get_answer()`를 호출할 때, `st.session_state.messages`에 저장된 대화 기록을 함께 전달하도록 수정했습니다.

이제 코드를 다시 빌드하고 실행하면(`docker-compose build && docker-compose up`), AI 어시스턴트는 이전 대화의 맥락을 이해하고 "그건 어때?", "다른 방법은 없어?" 와 같은 후속 질문에도 훨씬 더 똑똑하게 대답할 수 있게 될 것입니다.