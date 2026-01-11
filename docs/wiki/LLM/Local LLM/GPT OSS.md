---
aliases:
  - GPT-OSS
sticker: vault//이미지/개발 로고/TechIconSVG/AWS TechIcon SVG/Resource-Icons_02072025/Res_Artificial-Intelligence/Res-Amazon-SageMaker-Model-48.svg
---

## Llama2를 기반으로 한 아키텍처

### 1. Hugging Face 공식 모델 페이지 (가장 확실한 출처)

Hugging Face는 AI 모델들의 '허브' 같은 곳으로, 모델의 상세 스펙(설계도)이 담긴 `config.json` 파일을 직접 볼 수 있습니다.
- **링크**: **[unsloth/gpt-oss-20b Hugging Face 페이지](https://huggingface.co/unsloth/gpt-oss-20b)**
    
- **확인 방법**:
    1. 위 링크로 접속하여 'Files and versions' 탭을 클릭합니다.
    2. `config.json` 파일을 클릭해서 내용을 확인합니다.
    3. 파일 내용 중 `"architectures": [ "LlamaForCausalLM" ]` 라는 부분을 찾을 수 있습니다.
        - `LlamaForCausalLM`은 이 모델이 **Llama 아키텍처**를 사용하는 Causal LM(인과 관계 언어 모델)이라는 것을 명시하는, 기술적으로 가장 정확한 표현입니다.


이 파일은 모델의 공식적인 신분증이나 마찬가지이므로 가장 신뢰할 수 있는 출처입니다.

### 2. Unsloth AI 공식 블로그 및 문서

Unsloth는 `gpt-oss` 모델을 누구나 쉽게 사용할 수 있도록 튜닝하고 배포한 회사입니다. 이들의 블로그에는 모델을 어떻게 다루었고 어떤 문제를 해결했는지 상세히 기술되어 있습니다.

- **링크**: **[Fine-tune gpt-oss with Unsloth (공식 블로그)](https://unsloth.ai/blog/gpt-oss)**
    
- **내용 요약**: 블로그 포스트를 보면 Unsloth가 gpt-oss 모델을 4-bit로 양자화(quantization)하고, 더 적은 VRAM에서 미세조정(fine-tuning)할 수 있도록 **기존 아키텍처를 변환**하는 과정을 설명합니다. 이 모든 과정은 모델이 근본적으로 Llama의 구조를 가지고 있다는 것을 전제로 합니다. 또한, `llama.cpp` 같은 도구로 변환이 가능하다는 점 자체가 Llama 계열 아키텍처라는 강력한 증거입니다.
    

이 두 가지 출처를 통해 `gpt-oss-20b`가 이름과 달리 Llama-2 아키텍처에 뿌리를 두고 있다는 사실을 명확하게 확인하실 수 있습니다.