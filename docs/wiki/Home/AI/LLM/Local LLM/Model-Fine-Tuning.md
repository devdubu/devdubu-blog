---
slug: "Model-Fine-Tuning"
---
GPT-oss-20B 모델을 기반으로 한 미세 조정(Fine-tuning) 과정에 대한 순서와 예시 코드를 알려드릴게요.

시작하기 전에, 20B 모델은 GPU 메모리를 많이 사용하므로, 튜닝을 위해서는 **최소 24GB 이상의 VRAM을 가진 GPU**가 필요하며, 경우에 따라 더 높은 사양을 요구할 수 있습니다. 아래 코드는 `Hugging Face`의 `Transformers` 라이브러리를 사용한 가장 기본적인 미세 조정 예시입니다.

---

### 1단계: 환경 설정 및 라이브러리 설치

미세 조정을 위해 필요한 파이썬 라이브러리들을 설치합니다. `transformers`가 핵심이며, `datasets`는 학습 데이터셋 관리에, `accelerate`는 훈련 속도를 높이는 데 사용됩니다.

```Bash
pip install transformers datasets accelerate torch
```

---

### 2단계: 데이터셋 준비

미세 조정은 '질문-정답' 쌍으로 이루어진 데이터가 필요합니다. `instruction` (명령), `input` (입력), `output` (출력) 형식의 JSONL 파일을 만듭니다. `input`은 필수가 아니므로 없는 경우도 많습니다.

`vue_finetuning_data.jsonl` 파일 생성 예시:

```JSON
{"instruction": "Vue 3에서 v-for 디렉티브를 사용하여 리스트를 렌더링하는 방법을 알려줘.", "input": "", "output": "v-for 디렉티브는 배열의 각 요소를 순회하며 템플릿의 내용을 렌더링합니다. 각 요소에 고유한 key를 바인딩하는 것이 중요합니다.\n\n예시:\n<template>\n  <ul>\n    <li v-for=\"item in items\" :key=\"item.id\">{{ item.name }}</li>\n  </ul>\n</template>\n\n<script setup>\nimport { ref } from 'vue';\nconst items = ref([{id: 1, name: 'Apple'}, {id: 2, name: 'Banana'}]);\n</script>"}
{"instruction": "아래 Vue 컴포넌트의 목적을 설명하고 Props 사용법을 알려줘.", "input": "<template>\n  <button :class=\"type\" @click=\"handleClick\">{{ label }}</button>\n</template>\n\n<script setup>\nimport { defineProps } from 'vue';\n\nconst props = defineProps({ \n  label: String,\n  type: { type: String, default: 'primary' }\n});\n\nconst emit = defineEmits(['click']);\n\nconst handleClick = () => {\n  emit('click');\n};\n</script>", "output": "이 컴포넌트는 재사용 가능한 버튼 컴포넌트입니다. props를 통해 버튼의 텍스트(label)와 스타일(type)을 설정할 수 있습니다.\n\nProps:\n- `label`: 버튼에 표시될 텍스트입니다. (타입: String)\n- `type`: 버튼의 스타일을 결정합니다. 기본값은 'primary'입니다. (타입: String)\n\n사용법:\n<MyButton label=\"클릭하세요\" type=\"secondary\" @click=\"handleButtonClick\" />"}
```

---

### 3단계: 미세 조정 훈련 스크립트 작성

이제 `transformers`의 `Trainer` API를 사용해 실제 훈련 스크립트를 작성합니다. 이 스크립트가 학습 데이터를 모델에 주입하고 오차를 계산해 가중치를 업데이트합니다.

`finetune_script.py` 파일 생성 예시:

```Python
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, TrainingArguments, Trainer
from datasets import load_dataset

# 1. 모델과 토크나이저 로딩
# 'gpt-oss-20b'는 예시 모델 이름입니다. 실제 사용 시 Hugging Face 모델 허브의 모델 이름을 사용하세요.
model_name = "gpt-oss-20b" 
model = AutoModelForCausalLM.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)

# 패딩 토큰 설정 (GPT 계열 모델은 보통 패딩 토큰이 없습니다.)
if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token

# 2. 데이터셋 로딩 및 전처리
# 위에서 만든 JSONL 파일을 불러옵니다.
dataset = load_dataset("json", data_files="vue_finetuning_data.jsonl")

# 학습을 위해 프롬프트를 토큰화하는 함수
def tokenize_function(examples):
    # 'instruction'과 'input', 'output'을 하나의 문장으로 결합
    text = []
    for i in range(len(examples['instruction'])):
        input_text = examples['input'][i] if examples['input'][i] else ""
        full_text = f"### Instruction:\n{examples['instruction'][i]}\n\n### Input:\n{input_text}\n\n### Response:\n{examples['output'][i]}"
        text.append(full_text)
    
    # 토크나이저로 텍스트를 숫자로 변환
    return tokenizer(text, max_length=512, truncation=True)

tokenized_datasets = dataset.map(tokenize_function, batched=True)

# 3. 훈련 파라미터 설정
training_args = TrainingArguments(
    output_dir="./vue_finetuned_model",  # 훈련된 모델이 저장될 경로
    per_device_train_batch_size=1,       # GPU 당 배치 크기 (메모리에 따라 조절)
    gradient_accumulation_steps=8,       # 그래디언트 누적 스텝
    num_train_epochs=3,                  # 전체 데이터셋을 훈련시킬 횟수
    learning_rate=2e-5,                  # 학습률 (매우 중요)
    save_strategy="epoch",               # 에포크마다 모델 저장
    logging_steps=100,                   # 100 스텝마다 로그 출력
    fp16=True,                           # 혼합 정밀도 훈련 (메모리 절약)
    report_to="tensorboard",             # TensorBoard로 훈련 과정 시각화
)

# 4. Trainer 인스턴스 생성 및 훈련 시작
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_datasets["train"],
)

print("훈련 시작...")
trainer.train()

# 5. 훈련된 모델 저장
trainer.save_model("./vue_finetuned_model")
print("훈련 완료! 모델이 저장되었습니다.")
```

---

### 4단계: 훈련 시작 및 결과 확인

위 스크립트를 저장하고 터미널에서 아래 명령어를 실행하면 훈련이 시작됩니다.

```Bash
python finetune_script.py
```

훈련이 완료되면 `vue_finetuned_model`이라는 새로운 폴더에 **Vue.js에 특화된 새로운 모델 파일들**이 저장됩니다. 이 모델은 이제 H-STD 프로젝트에 대한 답변을 Gemini보다 더 정확하게 생성할 수 있습니다.

이 코드는 가장 기본적인 미세 조정 예시이므로, 실제 프로젝트에서는 **LoRA (Low-Rank Adaptation)**와 같은 고급 기술을 사용해 GPU 메모리를 더 효율적으로 사용하고 훈련 시간을 단축할 수 있습니다.

궁금한 점이 있다면 언제든지 다시 물어보세요!