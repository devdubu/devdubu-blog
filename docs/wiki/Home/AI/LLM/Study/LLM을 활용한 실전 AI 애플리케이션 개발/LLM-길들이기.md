---
sticker: emoji//1f680

slug: "LLM-길들이기"
---
# GPU 효율적인 학습
딥러닝 모델이 입력 데이터를 처리해 결과를 내놓을 때까지 많은 행렬 곱셈 연산을 처리한다. 
행렬 곱셈은 숫자를 곱하고 더하는 단순한 연산을 반복 계산하는 형태인데, GPU(graphic Processing Unit)는 이렇게 단순한 곱셈을 동시에 여러 개 처리하는 데 특화된 처리 장치다. 
따라서 딥러닝 모델의 연산을 빠르게 처리하기 위해 GPU를 많이 활용한다.

GPU는 한정된 메모리를 갖고 있는데, 최근 LLM의 등장과 함께 모델의 크기가 커지면서 하나의 GPU에 모델을 올리지 못하거나 모델의 학습과 추론을 위해 더 많은 GPU가 필요해졌다. 
하지만 GPU는 가격이 비싸기 때문에 일부 기업을 제외하고는 풍부하게 사용 하기 어렵다. 
이런 상황을 개선하고 더 많은 사람이 발전된 AI 기술을 사용할 수 있도록

GPU를 효율적으로 활용할 수 있는 방법을 찾기 위한 기술 발전이 빠르게 이뤄지고 있다.

5장에서는 GPU를 효율적으로 사용해 모델을 학습시키는 다양한 기술을 살펴본다. 
먼저 딥러닝 모델의 저장과 연산에 사용하는 데이터 타입에 대해 알아보고, GPU에서 딥 러닝 연산을 수행할 경우 어떤 데이터가 메모리를 사용하는지 살펴본다. 
다음으로 GPU를 1개 사용할 때도 메모리를 효율적으로 활용할 수 있는 방법인 그레이디언트 누적(gradient accumulation)과 그레이디언트 체크포인팅(gradient Checkpointing)을 알아본다. 
GPU를 여러 개 사용하는 분산 학습에 대해 알아보고, 분산 학습 시 같은 데이터가 여러 GPU에 저장돼 비효율적으로 사용되는 문제를 해결한 마이크로소프트의 딥스피드 제로(Deepspeed Zero)에 대해 살펴본다.

LLM은 모델 파라미터가 많아 모델 전체를 학습시킬 경우 GPU 메모리가 많이 필요한데, 모델을 학습시킬 때 전체 모델을 업데이트하지 않고 모델의 일부만 업데이트하면 서도 뛰어난 학습 성능을 보이는 LORA(Low Rank Adaptaton)에 대해 알아본다. 
마지막으로 LORA에서 한 발 더 나아가 모델을 적은 비트를 사용하는 데이터 타입으로 저장해 메모 리 효율성을 높인Quantized LoRA에 대해 알아본다.

내용을 시작하기 전에 구글 코랩에서 다음 명령을 실행해 이번 장에서 사용할 라이브러리를 설치하자.

```python
pip install transformers<mark>4.50.0 datasets</mark>3.5.0 accelerate<mark>1.6.0 peft</mark>0.15.0 bitsandbytes==0.45.2
```

## GPU에 올라가는 데이터 살펴보기
딥러닝 모델을 학습시키고 추론하기 위해 GPU를 사용할 때 가장 자주 만나는 에러 중 하나는 OOM(Out of Memory) 에러다. 

OOM 에러란, 한정된 GPU 메모리에 데이터가 가득 차 더 이상 새로운 데이터를 추가하지 못해 발생하는 에러다. 
그렇다면 GPU 메모리에 는 어떤 데이터가 올라갈까? 기본적으로 GPU에는 딥러닝 모델 자체가 올라간다. 
딥러닝 모델은 수많은 행렬 곱셈을 위한 파라미터의 집합이다. 

각각의 파라미터는 소수 또 는 정수 형식의 숫자인데, 어떤 형식의 숫자로 모델을 구성하는지 살펴본다. 
또한 모델 의 용량을 줄이기 위한 방법인 양자화에 대해서도 알아본다. 
모델 이외에 어떤 데이터가 GPU에 올라가는지 살펴본 다음, 허깅페이스에서 필요한 메모리 사용량을 계산해 제공 하는 모델 메모리 계산기 기능을 알아보고, 모델의 학습과 추론에 필요한 메모리를 코드로 확인하는 방법을 알아본다.

### 딥러닝 모델의 데이터 타입
컴퓨터에서는 일반적으로 소수 연산을 위해 32비트 부동소수점(1oa(32)을 사용한다. 
만약 더 세밀한 계산이 필요하다면 64비트 부동소수점(oat64)을 사용한다. 부동소수점을 나타내는 비트의 수가 커질수록 표현할 수 있는 수의 범위나 세밀한 정도가 달라진다.

딥러닝 모델은 입력한 데이터를 최종 결과로 산출할 때까지 많은 행렬 곱셈에 사용하는 파라미터로 구성된다. 
예를 들어, 파라미터가 70억 개인 LLM에는 행렬 연산에 사용되는 70억 개의 수가 저장돼 있다. 
따라서 LLM 모델의 용량은 모델을 몇 비트의 데이터 형식 으로 표현하는지에 따라 달라진다.

과거에는 딥러닝 모델을 32비트(4바이트) 부동소수점 형식을 사용해 저장 했다. 
하지만 성능을 높이기 위해 점점 더 파라미터가 많은 모델을 사용하기 시작했고 모델의 용량이 너무 커 하나의 GPU에 올리지 못하거나 계산이 너무 오래 걸리는 문제가 발생했다. 
이런 문제를 해결하기 위해 성능은 유지하면서 점점 더 적은 비트의 데이터 타입을 사용 하는 방향으로 딥러닝 분야가 발전했다.

최근에는 주로 16비트로 수를 표현하는 fp16 또는(brain float 16)을 주로 사용한다

그림 5.1에서 fp32와 fp16, bf16을 비교하고 있다. 
fp32는 32비트를 사용해 수를 표현 하는데, 그림에서 S는 부호(sign), E는 (지수exponent), M은 가수(mantissa)를 의미한다. 
지수는 수를 표현할 수 있는 범위의 크기를 결정하고 가수는 표현할 수 있는 수의 촘촘함을 결정한다. 
fp32는 지수로 8비트, 가수로 23비트를 사용하는데, fp32를 사용하면 넓은 범위를 촘촘하게 표현할 수 있다. 

반면, fp16 또는 bf16 형식은 사용하는 비트를 절반으 로 줄였기 때문에 fp32에 비해 표현할 수 있는 범위나 세밀함이 제한된다. 
fp16은 지수 로 5비트, 가수로 10비트를 사용하기 때문에 fp32에 비해 표현할 수 있는 범위도 좁고 세밀함도 떨어진다. 
fp16이 표현할 수 있는 수의 범위가 좁아 딥러닝 연산 과정에서 수 를 제대로 표현하지 못하는 문제가 발생했다. 

bf16은 이런 문제를 줄이기 위해 지수에 fp32와 같이 8비트를 사용하고 가수에 7비트만 사용하도록 개발됐다.
![스크린샷-2025-06-09-오전-8.53.46.png](/img/이미지 창고/스크린샷-2025-06-09-오전-8.53.46.png)
딥러닝 모델은 학습과 추론 같은 모델 연산 과정에서 GPU 메모리에 올라가기 때문에, 모델의 용량이 얼마인지가 GPU 메모리 사용량을 체크할 때 중요하다. 
딥러닝 모델의 용량은 파라미터의 수에 파라미터당 비트(또는 바이트) 수를 곱하면 된다. 

예를 들어, 파라미터가 10억 개인 모델이 fp16 형식으로 저장돼 있다면 총 20억 바이트가 된다. 
20억 바이트를 기가바이트 단위로 표현하려면 1024로 세 번 나눠줘야 하는데, 10억이 1024 를 세 번 곱한 값과 가깝기 때문에 간단히 계산하면 모델의 용량은 2GB라고 할 수 있다. 

최근 LLM은 모델이 커지면서 7B 모델과 같이 10억을 의미하는 BolLon를 단위로 사용하는데, B를 지우고 모델의 데이터 타입 바이트 수를 곱하면 모델의 용량이 된다.

예를 들어, 파라미터가 70억 개인 7B 모델이 16비트(2바이트) 데이터 형식으로 저장된 다면 모델의 용량은 7X2 = 14GB가 된다.

### 양자화로 모델 용량 줄이기
모델 파라미터의 데이터 타입이 더 많은 비트를 사용할수록 모델의 용량이 커지기 때문에 더 적은 비트로 모델을 표현하는 양자화(quantization) 기술이 개발됐다. 
예를 들어 fp32로 저장하던 모델을 fp16 형식으로 저장하면 모델의 용량은 절반이 된다. 하지만 fp32가

fp16에 비해 더 넓은 범위의 수를 더 세밀하게 표현할 수 있기 때문에 fp16으로 변환하 면 fp32의 수가 담고 있던 정보가 소실될 수 있는데, 이런 이유로 양자화를 수행하면 딥러닝 모델의 성능이 저하된다. 

따라서 양자화 기술에서는 더 적은 비트를 사용하면서도 원본 데이터의 정보를 최대한 소실 없이 유지하는 것이 핵심 과제라고 할 수 있다.

원본 데이터의 정보를 최대한 유지하면서 더 적은 용량의 데이터 형식으로 변환하려면, 변환하려는 데이터 형식의 수를 최대한 낭비하지 않고 사용해야 한다. 

예를 들어 그림5.2와 같이 fp32의 데이터를 int8로 변환한다고 할 때, fp32는 하나의 수를 표현하기 위해 32비트나 사용하지만 int8은 8비트만 사용하기 때문에 사용할 수 있는 수가 훨씬 적다. 

int8의 경우 256개의 수(-128~127)만 표현할 수 있기 때문에 256개 수 가운데 사용 되지 않는 수를 줄여야 한다. 
그림 5.2에서는 두 데이터 형식의 최댓값을 각각 대응시키 고 최솟값을 각각 대응시키는 가장 간단한 양자화 방식을 사용했다. 
그림에서 fp32 범 위의 양쪽 끝에는 데이터가 없는데, 서로 최대와 최소를 대응시키는 경우 int8의 양쪽 끝 수는 사용하는 데이터가 없이 존재해 낭비되는 문제가 발생한다.

![스크린샷-2025-06-09-오전-8.55.34.png](/img/이미지 창고/스크린샷-2025-06-09-오전-8.55.34.png)
그림 5.2와 같은 낭비를 줄이기 위해 그림 5.3과 같이 데이터 형식 자체의 최대/최소 를 대응시키는 것이 아니라 존재하는 데이터의 최댓값 범위로 양자화하는 방법도 있다. 
그림에서 absmax는 절대 최댓값을 말하는데, 양수와 음수를 통틀어 가장 크기가 큰 값을 찾는다. 
예를 들어, 데이터에서 가장 큰 수가 15이고 가장 작은 수가 17이라면 absmax는 17이 된다. 이와 같은 양자화 방식을 사용할 경우 그림 5.2에서 int8 값을 낭비하던 문제를 해결할 수 있다.
![스크린샷-2025-06-09-오전-8.56.06.png](/img/이미지 창고/스크린샷-2025-06-09-오전-8.56.06.png)

하지만 그림 53의 절대 최댓값을 활용한 방법도 문제를 완전히 해결하지는 못한다. 
이 방법은 대부분의 경우 잘 동작하지만 이상치(outler)가 있는 경우 취약하다. 
예를 들어, 그림 5.4와 같이 데이터에 이상치가 있는 경우 절대 최댓값이 이상치에 의해 정해지기 때문에 대부분의 데이터가 중앙에 모여 있고 int8의 범위 양쪽 수를 사용하지 못하는 낭비 가 발생하게 된다.
![스크린샷-2025-06-09-오전-8.56.40.png](/img/이미지 창고/스크린샷-2025-06-09-오전-8.56.40.png)
그렇다면 어떻게 이상치의 영향을 줄이고 int8 형식의 낭비를 줄일 수 있을까? 
먼저, 전체 데이터에 동일한 변환을 수행하는 것이 아니라 K개의 데이터를 묶은 블록이(block)단위 로 양자화를 수행하는 방법이 있다. 

만약 그림 5.4에서 전체 데이터에 대해 절대 최댓값을 구하고 양자화를 수행하는 것이 아니라, 3개씩 데이터를 묶어 그 안에서 절대 최댓값 을 구하고 변환을 수행한다면, 이상치와 함께 블록으로 묶인 3개의 데이터에만 이상치 의 영향이 미친다. 

중앙에 모여 있는 대부분의 데이터는 int8 형식을 낭비하지 않고 양 자화를 수행하게 된다.

또 다른 방법으로 퀸타일(quantile) 방식이 있다. 

절대 최댓값(absmax)만 보는 것이 아니라 입력 데이터를 크기순으로 등수를 매겨 int8 값에 동일한 개수의 fp32 값이 대응되도록 배치하는 방식이다. 

그림 5.5에서는 각 int8 값에 fp32 값 1개가 대응되도록 변환하고 있다. 

실제로는 1개의 입력 데이터가 아니라 훨씬 많은 데이터가 하나의 값에 대응되지만, 표현의 편의상 1개의 값만 대응된다고 가정했다. 
이 방식은 int8 값의 낭비는 없지만 매번 모든 입력 데이터의 등수를 확인하고 배치해야 하기 때문에 계산량도 많고 그 순 서를 기억 해야 하기 때문에 별도로 메모리를 사용 해야 한다는 단점이 있다.

![스크린샷-2025-06-09-오전-8.58.19.png](/img/이미지 창고/스크린샷-2025-06-09-오전-8.58.19.png)

지금까지 더 적은 비트를 사용하는 데이터 타입으로 변환하면서도 원본 데이터의 정보 를 최대한 유지한다는 양자화의 목표와 여러 접근 방법에 대해 알아봤다. 
양자화는 모 델을 효율적으로 사용하는 다양한 기술에서 활용되는데, 여기서는 기본 개념의 이해를 돕기 위한 내용만 다뤘다. 
앞으로 55절과 7장에서 더 상세한 활용 기술을 살펴본다. 하지만 언제나 목표는 동일하다는 사실을 명심하자.

### GPU 메모리 분석하기
GPU를 효율적으로 사용하는 방법을 알아보기 전에 GPU에 어떤 데이터가 올라가서 메 모리를 차지하는지 알아보자. GPU 메모리에는 크게 다음과 같은 데이터가 저장된다.
- ﻿﻿모델 파라미터
- ﻿﻿그레이디언트(gradient)
- ﻿﻿옵티마이저 상태(optimizer state)
- ﻿﻿순전파 상태 (forward activation)

딥러닝 학습 과정을 간단히 요약하면, 먼저 순전파를 수행하고 그때 계산한 손실로부터 역전파를 수행하고 마지막으로 옵티마이저를 통해 모델을 업데이트한다. 
역전파는 순 전파의 결과를 바탕으로 수행하는데, 이때 역전파를 수행하기 위해 저장하고 있는 값들 이 순전파 상태 값이다. 그레이디언트는 역전파 결과 생성된다.

fp16 모델을 기준으로 하고 AdamW와 같은 옵티마이저를 사용한다고 할 때 학습에 필요한 최소한의 메모리는 다음과 같다. 이때 모델의 용량을 (GB)이라고 하자.

- ﻿﻿모델 파라미터: 2바이트 X 파라미터 수(B, 10억 개) = N
- ﻿﻿그레이디언트: 2바이트 x 파라미터 수(B, 10억 개) = I
- ﻿﻿옵티마이저 상태: 2바이트 x 파라미터 수(B, 10억 개) X 2(상태 수) = 2N

모두 합치면 대략 4N의 메모리가 기본적으로 필요하고, 이 외에도 순전파 상태(배치 크 기, 시퀀스 길이, 잠재 상태 크기에 따라 달라짐)를 저장하기 위한 메모리가 추가로 필요하다.

사용하려는 모델마다 학습과 추론에 어느 정도의 GPU 메모리가 필요한지 계산하기 어려울 수 있는데, 허깅페이스는 [모델 메모리 계산기](https://huggingface.co/spaces/hf-accelerate/model-memory-usage)를 제공해 허깅페이스 모델 허브의 모델을 활용 할 때 GPU 메모리가 얼마나 필요한지 알려주고 있다. 그림 5.6과 같이 사용하려는 모델을 입력하고 모델의 데이터 타입을 설정하면 모델의 파라미터 수에 따라 모델의 크 기, 학습에 필요한 메모리를 제공해 준다. 

이번 절에서는 다양한 오픈소스 모델을 제공 하는 비영리 단체인 EleutherAI가 제공하는 [한국어 모델인 BleutherAl/polygot-ko-1.3b](https://huggingface.co/EleutherAl/polyglot-ko-1.3b)를 활용하는데, 모델 메모리 계산기에서 제공하는 추정치는 모델 크기가 2.37GB, 학습에 필요한 메모리는 9.49GB 이다.

![스크린샷-2025-06-09-오전-9.00.34.png](/img/이미지 창고/스크린샷-2025-06-09-오전-9.00.34.png)
이번 장에서는 실제로 코드를 통해 모델을 불러오고 학습을 수행하면서 얼마나 많은 GPU 메모리를 사용하는지 확인해 본다. 
그러기 위해 예제 5.1과 같이 파이토치의 메모리 확인 함수인 `torch.cuda.memory_allocated()`를 사용해 메모리 사용량을 기가바이트 단위 로 반환하는 함수인 `print_gpu_utilization`을 정의한다. 

구글 코랩에서 예제 5.1을 실행 하면 출력 결과와 같이 현재 GPU 메모리를 사용하고 있지 않다는 것을 확인할 수 있다.

```python
# 메모리 사용량 측정을 위한 함수 구현
import torch
def print_gpu_utilization():
	if torch.cuda.is_available():
		used_memory = torch.cuda.memory_allocated() / 1024**3
		print(f"GPU 메모리 사용량: {used_memory: 3f} GB")
	else:
		print ("런타임 유형을 GPU로 변경하세요")
print_gpu_utilization( )

# 출력 결과
# GPU 메모리 사용량: 0.000 GB
```

다음으로 모델과 토크나이저를 불러오는 `Load_model_and_tokenizer`를 정의한다. 
이 함수는 사용할 모델과 토크나이저의 아이디(modeL_id)와 효율적인 모델 학습을 사용 할지와 어떤 방식을 사용할지 입력받는 peft 인자를 받는다. 
받은 `model_id`를 통해 `AutoTokenizer`와 `AutoModeLForCausalLM` 클래스의 `from_pretrained()` 메서드로 대응하는 모델과 토크나이저를 내려받는다. 

peft 인자는 이후 5.3절과 5.4절에서 GPU 메모리 효율적인 학습 방법을 알아보면서 추가로 알아보고 지금은 peft 인자에 기본값인 None 을 전달한다. 
예제 5.2를 실행하면 GPU 메모리 사용량은 2.599GB이고 모델 파라미터 의 데이터 타입은 torch.float 16임을 확인할 수 있다. 
앞서 모델 메모리 계산기에서는 모델 크기를 2.37GB로 추정했는데, 이 모델의 경우 다소 큰 오차가 있지만 대부분의 경 우 거의 정확한 추정치를 제공한다.

```python
# 모델을 불러오고 GPU 메모리와 데이터 타입 확인
from transformers import AutoModelForCausalLM, AutoTokenizer

def load_model _and_tokenizer (model_id, peft=None):
	tokenizer = AutoTokenizer. from_pretrained(model_id)
	if peft is None:
		model = AutoModelForCausalLM. from_pretrained(model_id, torch_dtype="auto" , device_map={"" 0})
		print_gpu_utilization( )
	return model, tokenizer
model_id = "EleutherAI/polyglot-ko-1.3b"
model, tokenizer = Load_modeL_and_tokenizer(model_id) # GPU 메모리 사용량: 2.599 GB 
print ("모델 파라미터 데이터 타입: ", model.dtype) # torch.float16
```

GPU 메모리에는 모델, 그레이디언트, 옵티마이저 상태, 순전파 상태가 저장된다고 했 는데, 예제 5.2에서 모델의 메모리 사용량을 확인하는 코드를 작성했다. 
예제 5.3에서는 그레이디언트의 메모리 사용량을 확인하는 `estimate_memory_of_gradients` 함수와 옵티 마이저 상태의 메모리 사용량을 확인하는 `estimate_memory_of_optimizer` 함수를 정의 한다. 

`estimate_memory_of_gradients` 함수는 인자로 모델을 받아 모델에 저장된 그레이 디언트 값의 수(`param.grad.nelement`)와 값의 데이터 크기(`param.grad.eLement_size`)를 통해 전체 메모리 사용량을 계산한다. 
`estimate_memory_of_optimizer` 함수는 인자로 옵티 마이저를 받아 옵티마이저에 저장된 값의 수(`w.nelement`)와 값의 데이터 크기(`w.element_size`)를 곱해 전체 메모리 사용량을 계산 한다.

>그레이디언트와 옵티마이저 상태의 메모리 사용량을 계산하는 함수
```python
from torch.optim import Adamw from torch.utils.data import DataLoader
	def estimate_memory_of_gradients(model):
		total_memory = 0
		for param in model. parameters ):
			if param.grad is not None:
				total_memory += param.grad.nelement() * param.grad.element_size()
		return total_memory
	
	def estimate_memory_of_optimizer(optimizer):
		total_memory = 0
			for state in optimizer.state.values():
				for k, v in state. items( ): if torch. is_tensor(v):
					total_memory += v.nelement) * v.element_size( )
		return total_memory
```

다음으로 예제 5.4에서 모델을 학습시키며 중간에 메모리 사용량을 확인하는 train model 함수를 정의한다. 
함수의 내용은 3장에서 허깅페이스 트랜스포머의 Trainer API 없이 모델을 학습시킬 때 사용했던 코드와 유사하다. 
1 에서 `training.args.gradient_checkpointing` 설정이 있는데, 
이 부분은 5.2절에서 다룰 그레이디언트 체크포인팅 기능을 사용할지 설정하는 부분으로 설정에 True 또는 False를 입력해 켜고 끌 수 있다.

기본값은 사용하지 않는 False이다. 
2의 `training_args.gradient_accumulation_steps` 설정은 역시 5.2절에서 살펴볼 그레이디언트 누적 기능을 사용할지 결정하는 설정인데, 누적할 스텝 수에 따라 2 또는 4 등으로 설정하면 된다. 

여기서는 우선 기본값인 1로 진행한다. 2에서 그레이디언트와 옵티마이저의 메모리 사용량과 전체 메모리 사용량을 출력한다.

>모델의 학습 과정에서 메모리 사용량을 확인하는 train_model 정의
```python
def train model(model, dataset, training_args):
	if training_args.gradient_checkpointing: # 1
		model.gradient_checkpointing_enable()
	
	train_dataloader = DataLoader (dataset, batch_size=training_args.per_device_train_
	batch_size)
	optimizer = AdamW( model.parameters())
	model.train()
	
	gpu_utilization_printed = False
	
	for step, batch in enumerate(train_dataloader, start=1):
		batch = {k: v. to(model.device) for k, v in batch. items ( )}
		
		outputs = model (**batch)
		loss = outputs. loss
		loss = loss / training_args gradient_accumulation_ steps
		loss. backward()
		
		if step % training_args. gradient_accumulation_steps == 0: 0
			optimizer. step()
			gradients_memory = estimate_memory_of_gradients(model) ®
			optimizer_memory = estimate_memory_of_optimizer (optimizer) ®
			if not gpu_utilization printed: print_gpu_utilization() ®
				gpu_utilization_printed = True
			optimizer. zero_grad()
		print(f"옵티마이저 상태의 메모리 사용량: {optimizer memory /(1024 ** 3):.3f} GB")
		print(f"그레이디언트 메모리 사용량: {gradients_memory /(1024 ** 3): 3f} GB")
```

모델을 학습시키기 위해서는 데이터가 필요한데, 학습 과정에서 필요한 메모리 사용량에 집중하기 위해 예제 5.5와 같이 랜덤 데이터를 생성하는 `make_dunimy_dataset` 함수를 정의한다.

`make_dummy_dataset` 함수에서는 텍스트의 길이가 256이고 데이터가 64개인 더미 데이터를 생성하고 datasets 라이브러리의 Dataset 형태로 변환해 반환한다.

>랜덤 데이터셋을 생성하는 make_dummy_dataset 정의
```python
import numpy as np 
from datasets import Dataset

def make_dummy_dataset( ):
	seq_len, dataset_size = 256, 64
	dummy_data = {
		"input_ids": np. random. randint(100, 30000, (dataset_size, seq_len)),
		"labels" : np. random. randint(100, 30000, (dataset_size, seq_len)),
	}
	
	dataset = Dataset.from_dict(dummy_data)
	dataset.set_format("pt")
	return dataset
```

다음으로 예제 5.6에서 GPU 메모리의 데이터를 삭제하는 cLeanup 함수를 정의한다.

cLeanup 함수에서는 전역 변수 중 GPU 메모리에 올라가는 모델의 변수(modeL)와 데이터 셋 변수(dataset)를 삭제하고 gc.colLect 함수를 통해 사용하지 않는 메모리를 회수하는 가비지 컬렉션(garbage collection)을 수동으로 수행한다. `torch.cuda.empty_cache()` 함수는 더 이상 사용하지 않는 GPU 메모리를 반환한다.

```python
import gc

def cleanup( ):
	if 'model' in globals( ): 
		del globals( )[ 'model'] 
	if 'dataset' in globals(): 
		del globals( )['dataset']
	gc.collect()
	torch.cuda.empty_cache()
```

마지막으로 예제 5.7에서 앞서 정의한 함수를 종합해 배치 크기, 그레이디언트 누적, 그레이디언트 체크포인팅, peft 설정 등에 따라 GPU 사용량을 확인하는 `gpu_memory_ experiment` 함수를 정의한다. 

먼저, 1 에서 `load_model_and_tokenizer` 함수와 `make_ dummy_dataset` 함수로 모델, 토크나이저, 데이터셋을 불러온다. 

다음으로 실험하려는 설정에 따라 학습에 사용할 인자를 설정한다.2 
모델, 데이터셋, 학습 인자 준비를 마쳤으 니 train_model 함수를 통해 학습을 진행하면서 GPU 메모리 사용량을 확인한다 3. 
마지막으로 실험이 끝난 모델과 데이터셋을 삭제하고 사용하지 않는 GPU 메모리를 반환한다.

> GPU 사용량을 확인하는 `gpu_memory_experiment` 함수 정의

```python
from transformers import TrainingArguments, Trainer
	def gpu memory_experiment(batch_size, gradient_accumulation_steps=1, gradient_checkpointing=False, model_id="EleutherAI/polyglot-ko-1.3b", peft=None):
	print(f"배치 크기: {batch_size}" )
	model, tokenizer = load _model_and_tokenizer(model_id, peft=peft)
	if gradient_checkpointing <mark> True or peft </mark> 'qlora' :
		model.config.use_cache = False

	dataset = make_dummy_dataset() # 1
	
	training_args = TrainingArguments( per_device_train_batch_size=batch_size, gradient_accumulation_steps=gradient_accumulation_steps, gradient_checkpointing=gradient_checkpointing, output_dir="./result", num_train_epochs=1
	) # 2
	try:
		train_mode(model, dataset, traning_args) # 3
	except RuntimeError as e:
		if "CUDA out of memory in str(e)"
			print(e)
		else:
		 raise e
	finally:
		del model, dataset # 4
		gc.collect()
		torch.cuda.empty_cache()
		print_gpu_utilization()

```
이제 예제 5.8의 코드를 실행해 배치 크기를 4에서 16까지 늘리면서 GPU 메모리 사용량이 어떻게 변하는지 확인해 보자. 
`gpu_memory_experiment` 함수에 batch_size를 변경 하면서 입력하면 배치 크기에 따른 메모리 사용량을 확인할 수 있다. 
실험을 진행하기에 앞서 cleanup 함수와 `print_gpu_utilization` 함수로 GPU에서 불필요한 데이터를 삭제하고 메모리를 사용하지 않고 있음을 확인한다.

> 배치 크기를 변경하며 메모리 사용량 측정
```python
cleanup()
print_gpu_utilization()

for batch_size in [4, 8, 16]:
	gpu_memory_experiment (batch_size)
	torch.cuda.empty_cache()
```

배치 크기를 변경하면서 실행했을 때 출력된 결과를 정리하면 표 5.1과 같다. 
배치 크기 가 증가해도 모델, 그레이디언트, 옵티마이저 상태를 저장하는 데 필요한 GPU 메모리는 동일하다. 
총 메모리가 증가하는 것을 통해 순전파 상태의 계산에 필요한 메모리가 증가한다는 사실을 확인할 수 있다.

| 배치 크기 | 모델 크기 (GB) | 그레이디언트(GB) | 옵티마이저 상태(GB) | 총 메모리(GB) |
| ----- | ---------- | ---------- | ------------ | --------- |
| 4     | 2.615      | 2.481      | 4.961        | 10.586    |
| 8     | 2.615      | 2.481      | 4.961        | 11.228    |
| 16    | 2.615      | 2.481      | 4.961        | OOM       |
지금까지 GPU 메모리 사용량을 코드를 통해 확인하기 위해 필요한 함수를 정의하고 배 치 크기를 변경하면서 GPU 메모리 사용량을 확인했다. 
이제부터는 단일 GPU를 사용하 면서 GPU를 더 효율적으로 사용할 수 있는 그레이디언트 누적과 그레이디언트 체크포 인팅에 대해 알아보자.

## 단일 GPU 효율적으로 활용하기

GPU의 메모리는 크기가 제한적이기 때문에 올릴 수 있는 모델의 크기도, 학습에 사용 할 수 있는 배치 크기도 제한된다.
이번 절에서는 GPU를 1개만 사용할 때도 GPU의 메 모리를 효율적으로 사용할 수 있는 그레이디언트 누적과 그레이디언트 체크포인팅에 대해 살펴본다. 
그레이디언트 누적이란, 딥러닝 모델을 학습시킬 때 각 배치마다 모델을 업데이트하지 않고 여러 배치의 학습 데이터를 연산한 후 모델을 업데이트해 마치 더 큰 배치 크기를 사용하는 것 같은 효과를 내는 방법을 말한다. 
다음으로 그레이디언트 체크포인팅은 순전파의 계산 결과를 모두 저장하지 않고 일부만 저장해 학습 중 GPU 메모리의 사용량을 줄이는 학습 방법이다. 
두 방법 모두 모델 학습 시에 배치 크기를 키 워 모델의 학습을 더 빠르고 안정적으로 만들어 준다. 
이제부터 하나씩 살펴보자.

### 그레이디언트 누적
학습 과정에서 배치 크기를 크게 가져가면 더 빠르게 수렴하고 성능이 높아지는 효과가 있다. 
하지만 이전 절에서 확인한 대로 배치 크기를 키우면 순전파 상태 저장에 필요한 메모리가 증가하면서 OOM 에러가 발생한다. 
그레이디언트 누적(gradient accumulation)은 제한된 메모리 안에서 배치 크기를 키우는 것과 동일한 효과를 얻는 방법이다. 

예제 5.4의 `trainmodel` 함수에서 그레이디언트 누적과 관련된 부분을 가져오면 예제 59와 같다.

학습 인자(`training_args`)에서 그레이디언트 누적 횟수(`gradient_accumulation_steps`) 설정 을 4로 두면, 손실을 4로 나눠서 역전파를 수행하고, 4번의 스텝마다 모델을 업데이트 한다. 
이를 통해 마치 배치 크기가 4배로 커진 것과 동일한 효과를 얻을 수 있다

> 예제 5.4에서 그레이디언트 누적과 관련된 부분 설명
```python
def train _model (model, dataset, training_args):
	if training_args.gradient_checkpointing:
		model. gradient_checkpointing_enable()

		train_dataloader = DataLoader(dataset, batch_size=training_args.per_device_train_
batch_size)
		optimizer = Adamw(model.parameters())
		model.train()
		gpu_utilization_printed = False
		
		for step, batch in enumerate(train_dataloader, start=1):
			batch = {k: v. to(model.device) for k, v in batch. items ( )}
			
			outputs = model (**batch)
			loss = outputs. loss
			loss = loss / training_args.gradient_accumulation_steps • loss. backward()
			if step & training args. gradient_accumulation steps == 0:
				optimizer.step()
				gradients_memory = estimate_memory_of_gradients(model)
				optimizer_memory = estimate_memory_of_optimizer(optimizer)
				if not gpu_utilization_printed:
					print_gpu_utilization( )
					gpu_utilization_printed = True
					optimizer.zero_grad()
```

예제 5.8에서 배치 크기를 16으로 설정했을 때 OOM 에러가 발생했다. 
예제 5.10에서는 배치 크기를 4, 그레이디언트 누적 스텝 수를 4로 설정해 실행했다. 
출력 결과를 확인하면 GPU 메모리 사용량은 10.586GB로 성공적으로 실행되면서도 배치 크기가 16일 때와 같은 효과를 얻을 수 있다. 
그레이디언트 누적을 사용하는 경우 적은 GPU 메모리로도 더 큰 배치 크기와 같은 효과를 얻을 수 있지만, 추가적인 순전파 및 역전파 연산을 수행하기 때문에 학습 시간이 증가된다.

> 그레이디언트 누적을 적용했을 때의 메모리 사용량

```python
cleanup()
print_gpu_utilization()
gpu_memory_experiment(batch_size=4, gradient_accumulation_steps=4)
torch. cuda.empty_cache()

# 출력 결과
# GPU 메모리 사용량: 2.615 GB
# GPU 메모리 사용량: 10.586 GB
# 옵티마이저 상태의 메모리 사용량: 4.961 GB
# 그레이디언트 메모리 사용량: 2.481 GB
```

### 그레이디언트 체크 포인트

딥러닝 모델에서는 모델 업데이트를 위한 그레이디언트를 계산하기 위해 순전파와 역전파를 수행하는데, 이때 역전파 계산을 위해 순전파의 결과를 저장하고 있어야 한다.
가장 기본적인 저장 방식은 모두' 저장하는 것이다. 
그림 5.7에는 오른쪽으로 진행하는 순전파와 왼쪽으로 진행하는 역전파가 있는데, 녹색이 값을 저장하고 있는 상태이고 흰색이 저장하지 않은 상태다. 
그림에서는 역전파 계산을 위해 순전파 데이터를 모두 저장하고 있는데 (그림 5.7(a)의 첫째 줄 녹색 원 5개) 이렇게 되면 GPU 메모리를 많이 차지하게 된다. 역전파를 진행하면서 메모리를 절약하기 위해 사용이 끝난 데이터는 삭제한다
![Screenshot-2025-06-12-at-10.05.49-PM.png](/img/이미지 창고/Screenshot-2025-06-12-at-10.05.49-PM.png)

다음으로 메모리를 가장 절약하는 방법은 그림 5.8과 같이 역전파를 계산할 때 필요한 최소 데이터만 저장하고 나머지는 필요할 때 다시 계산하는 방식이다. 
그림 5.8(a)에서 볼 수 있듯이, 메모리 효율성을 높이기 위해 순전파 과정에서는 중간 데이터를 삭제하면서 진행한다. 
결국 마지막 데이터만 남긴 상태로 손실을 계산한다. 그리고 역전파 계산을 위해 순전파 상태가 필요해지면 다시 순전파를 처음부터 계산한다. 
이 방식은 메모리를 효율적으로 쓸 수 있다는 장점이 있지만 한 번의 역전파를 위해 순전파를 반복적으로 계산해야 한다는 단점이 있다.
![Screenshot-2025-06-12-at-10.06.25-PM.png](/img/이미지 창고/Screenshot-2025-06-12-at-10.06.25-PM.png)
앞에서 설명한 두 가지 방식을 절충하기 위한 방법이 그레이디언트 체크포인팅(gradient checkpointng)이다. 
순전파의 전체를 저장하거나 마지막만 저장하는 게 아니라, 중간중간 에 값들을 저장(체크포인트)해서 메모리 사용을 줄이고 필요한 경우 체크 포인트부터 다 시 계산해 순전파 계산량도 줄인다. 
그림 5.9(a)에서 세 번째 노드의 순전파 데이터를 저장한다면, 순전파가 완료됐을 때 그림 5.9(b)와 같이 세 번째 노드와 마지막 노드의 값이 저장된다. 
그리고 역전파 계산을 위해 네 번째 노드의 값이 필요해지면 저장해 둔 세 번째 노드에서부터 순전파를 계산한다.
![Screenshot-2025-06-12-at-10.07.03-PM.png](/img/이미지 창고/Screenshot-2025-06-12-at-10.07.03-PM.png)

역전파 시점의 세 가지 그림을 비교해 보면, 모두 저장하는 방식은 6개의 데이터가 저장 돼 있고, 마지막만 저장하는 방식은 4개, 그레이디언트 체크포인팅의 경우 5개의 노드 데이터가 저장된 것을 확인할 수 있다. 
그레이디언트 체크포인팅은 추가적인 순전파 계산이 필요하기 때문에 메모리 사용량은 줄지만 학습 시간이 증가한다는 단점도 있다.

그레이디언트 체크포인트는 예제 5.11과 같이 체크포인트 사용 설정만 변경해 줌으로 써 활용할 수 있다. 
예제 5.7에서는 배치 크기가 16일 때 OOM 에러가 발생했지만 그레이디언트 체크포인팅을 사용하자 GPU 메모리 사용량이 10.29GB로 줄어들고 성공적으로 실행된 것을 확인할 수 있다. GPU 메모리를 효율적으로 사용함으로써 동일한 GPU에서 더 큰 배치 크기로 모델 훈련이 가능해진 것이다.

> 그레이디언트 체크포인팅 사용 시 메모리 사용량|
```python
cleanup( )
print_gpu_utilization()
gpu_memory_experiment(batch_size=16, gradient_checkpointing=True)
torch. cuda. empty_cache()
# 출력 결과||
# GPU 메모리 사용량: 10.290 GB||
# 옵티마이저 상태의 메모리 사용량: 4.961 GB
# 그레이디언트 메모리 사용량: 2.481 GB
```


그레이디언트 누적과 그레이디언트 체크포인팅은 GPU를 1개 사용하는 학습에서도 적용할 수 있는 GPU 효율화 기법이다.
GPU 메모리가 부족한 경우 가장 직접적인 해결책은 더 많은 GPU를 사용해 GPU 메모리의 총량을 늘리는 것인데, 2개 이상의 GPU를 사 용해 모델을 학습시키는 방법을 분산 학습(distributed training) 이라고 한다. 
이제부터 분산 학습과 분산 학습에서 GPU를 더 효율적으로 사용하는 방법을 알아보자.

## 분산 학습과 ZeRo
### 분산 학습
분산 학습은 GPU를 여러 개 활용해 딥러닝 모델을 학습시키는 것을 말한다. 

분산 학습 의 목적은 크게 두 가지인데, 모델 학습 속도를 높이는 것과 1개의 GPU로 학습이 어려 운 모델을 다루는 것이다. 
모델이 작아 하나의 GPU에 올릴 수 있는 경우 여러 GPU에 각각 모델을 올리고 학습 데이터를 병렬로 처리해 학습 속도를 높일 수 있다. 
이를 데이터 병렬화(data parallelism) 라고 한다. 

그림 5.10과 같이 모델을 4개의 GPU에 각각 올리고 학 습 데이터를 4개 묶음으로 나눠 동시에 학습을 수행하면 학습 속도를 4배 가까이 높일 수 있다.

![Screenshot-2025-06-12-at-10.09.58-PM.png](/img/이미지 창고/Screenshot-2025-06-12-at-10.09.58-PM.png)

다음으로 하나의 GPU에 올리기 어려운 큰 모델의 경우 모델 병렬화(model parallelism)를 사용한다. 
이름 그대로 모델을 여러 개의 GPU에 나눠서 올리는 방식인데, 크게는 딥러닝 모델의 층layer 별로 나눠 GPU에 올리는 파이프라인 병렬화(Dipeline parallelism) 와  층의 모델도 나눠서 GPU에 올리는 텐서 병렬화(tensor parallelism)가 있다. 그림 5.11에서 모델을 그림의 상하로 나누면(머신 1, 2와 머신 3, 4로 구분) 파이프라인 병렬화이고 좌우로 나누면(머 신 1, 3과 머신 2, 4로 구분) 텐서 병렬화에 해당한다.

그림 5.11에서 파이프라인 병렬화의 경우 딥러닝 모델의 각 층별로 나눠 GPU에 올리기 때문에 딥러닝 모델의 층 순서에 맞춰 순차적으로 연산하면 결과를 얻을 수 있다고 쉽게 생각할 수 있다. 
하지만 텐서 병렬화의 경우 하나의 층을 나눠 서로 다른 GPU에 올리기 때문에 어떻게 병렬화 전과 후에 동일한 결과를 구할지 의문이 들 수 있다. 
텐서 병렬화를 사용할 경우 그림 5.12와 같이 행렬을 분리해도 동일한 결과를 얻을 수 있도록 행렬 곱셈을 적용한다. 
그림 5.12(a)에는 입력 $X$와 모델 가중치 $A$를 곱해 결과 $V$가 되는 기본 연산이 있다. 
여기서 모델의 가중치를 한 열씩 분리하는 경우 그림 5.12(b)와 같이 입력 $X$와 모델 가중치를 분리한 $A_\{1}$, $A_\{2}$를 곱하고 그 결과인 $Y_\{1}$과 $Y_\{2}$를 하나로 연결해 기존의 결과와 동일하게 만들 수 있다. 

그림 5.12(c)는 모델 가중치를 행 방향으로 분리한 경우인데, 이때는 입력 $X$와 모델 가중치 $A$를 모두 분리해 $X_\{1}$ 과 $A_\{1}$,을 곱하고 $X_\{2}$ 와 $A_\{2}$를 곱해 더함으로써 기존과 동일한 연산을 수행할 수 있다.

![Screenshot-2025-06-12-at-10.12.57-PM.png](/img/이미지 창고/Screenshot-2025-06-12-at-10.12.57-PM.png)
그림 5.12에서 하나의 행렬 곱셈을 동일하게 수행할 수 있는 병렬화 방식을 살펴봤다 면, 이 방식이 실제 딥러닝 모델 연산에 어떻게 적용되는지 나타낸 그림이 바로 그림 5.13이다. 

그림 5.13(a)는 MLP(Multi-Layer Perceptron) 층에서 서 병렬화를 수행한 그림으로, 왼쪽에서는 가중치 행렬 $A$를 열 방향으로 나눠(그림 5.12(b)) 행렬 곱셈을 수행하고 오른쪽에서는 입력인 $V_\{1}$과 $V_\{2}$가 열 방향으로 나눠져 있으므로 가중치 행렬 B를 행방향 으로 나눠(그림 5.12(c)) 행렬 곱셈을 수행한다. 

그림 5.13(b)는 트랜스포머 모델의 근간이 되는 셀프 어텐션 연산에서 병렬화를 적용한 그림이다. 
쿼리query, 키Key, 값value 가 중치 행렬을 열 방향으로 나눠서 행렬 곱셈을 수행하는데, 3개의 가중치가 나온다는 점 을 제외하고는 위쪽의 MLP 모델에서와 동일한 과정을 밟는다.

![Screenshot-2025-06-12-at-10.14.29-PM.png](/img/이미지 창고/Screenshot-2025-06-12-at-10.14.29-PM.png)

분산 학습을 사용하는 경우 모델이 작으면 데이터 병렬화를 통해 모델 학습 속도를 높 일 수 있고, 모델이 클 경우 모델을 여러 GPU에 올려 하나의 GPU로는 불가능했던 학습을 가능하게 만들 수 있다. 

데이터 병렬화를 사용하는 경우 동일한 모델을 여러 GPU 에 올리기 때문에 중복으로 모델을 저장하면서 메모리 낭비가 발생한다. 
이제부터 데이 터 병렬화의 메모리 낭비를 줄이는 방법을 알아보자.

### 데이터 병렬화에서 중복 저장 줄이기(ZeRo)

앞서 데이터 병렬화의 경우 모델을 각 GPU에 올리고 학습 데이터를 나눠 동시에 학습 해서 학습 속도를 높인다고 설명했다. 이 방식의 경우 속도를 높일 수 있다는 장점이 있 지만, 동일한 모델을 여러 GPU에 올려 중복으로 메모리를 차지하기 때문에 메모리 관 점에서는 비효율적이다. 모델이 크다면 각각의 GPU에 온전히 하나의 모델을 올리는 것 이 더욱 비효율적이다.

2019년 마이크로소프트에서 개발한 [ZeROZero Redundancy optimizer 「ZeRO: Memory Optimizations Toward Training Trillion Parameter Models(ZeRO: 조 단위의 파라미터 모델 학습을 위한 메모리 효율화)」,](https://arxiv.org/pdf/1910.02054.pdf)는 이런 비효율을 해결 하기 위해 개발됐다. 하나의 모델을 하나의 GPU에 올리지 않고 마치 모델 병렬화처럼 모델을 나눠 여러 GPU에 올리고 각 GPU에서는 자신의 모델 부분의 연산만 수행하고 그 상태를 저장하면 메모리를 효율적으로 사용하면서 속도도 빠르게 유지할 수 있다는 것이 ZeRO의 컨셉이다. 그림 5.14에서 기존(베이스라인)에는 각 GPU마다 모델 파라미 터(p), 그레이디언트(g), 옵티마이저 상태(os)를 저장하는 비효율이 있었는데, ZeRO는 각 GPU가 모델을 부분적으로 가지고, 필요한 순간에만 모델 파라미터를 복사해 연산을 수행하는 방식으로 메모리를 효율적으로 사용한다.

![Screenshot-2025-06-12-at-10.16.09-PM.png](/img/이미지 창고/Screenshot-2025-06-12-at-10.16.09-PM.png)

ZeRO는 GPU를 많이 사용할수록 각 GPU당 사용하는 메모리가 줄어든다. 

그림 5.14 에서 64개의 GPU로 7.5B의 모델을 학습시키는 경우 GPU당 1.9GB만이 필요한데, 기존에는 120GB의 메모리가 필요했던 것에 비하면 1/60 수준으로 떨어진 것을 확인할 수 있다. 

허깅페이스 트랜스포머에서는 ZeRO를 쉽게 사용할 수 있는 기능을 지원한다. 
이 책에서는 GPU를 1개만 사용할 수 있는 구글 코랩을 실습 환경으로 사용하기 때 문에 분산 학습과 ZeRO의 실습은 진행하지 않는다. 

허깅페이스 트랜스포머에서 ZeRO를 사용하는 방법은 [Accelerate의 딥스피드 사용 가이드](https://huggingface.co/docs/accelerate/usageguides/deepspeed)에서 더 확인할 수 있다.

## 효율적인 학습 방법(PEFT) : LoRA
LLM과 같은 기반 모델의 크기가 커지면서 하나의 GPU를 사용해 모든 파라미터를 학습하는 전체 미세 조정(full fine-tuning)을 수행하기 어려워졌다. 
하지만 대부분의 개인과 조직은 여러 GPU를 사용해 모델을 학습시키기 어렵기 때문에 일부 파라미터만 학습하는 PEFT(Parameter Ettcient Fine-Tuning) 방법 연구가 활발히 이뤄지고 있다. 
그중에서도 오픈소스 LLM 학습에서 가장 주목받고 많이 활용되는 학습 방법은 모델에 일부 파라미터를 추가하고 그 부분만 학습하는 LORA(Low-Rank Adaptation) 학습 방식이다. 

이번 절에서는 LORA 학습 방법에 대해 알아보고, 이어지는 절에서 LORA에서 한발 더 나아가 모델 파라미터 를 양자화하는 QLORA(Quantized LORA)에 대해 알아본다.

### 모델 파라미터의 일부만 재구성해 학습하는 LoRA
LORA는 큰 모델을 학습시켜야 하는 LLM 시대에 가장 사랑받는 PEFT 방법 중 하나다.

LORA는 모델 파라미터를 재구성(reparameterization) 해 더 적은 파라미터를 학습함으로써 GPU 메모리 사용량을 줄인다. 
LORA에서 파라미터 재구성은 행렬을 더 작은 2개의 행렬의 곱으로 표현해 전체 파라미터를 수정하는 것이 아니라 더 작은 2개의 행렬을 수정 하는 것을 의미한다. 
예를 들어, 그림 5.15에서 파라미터 $W$로 구성된 딥러닝 모델을 학습시킨다고 해보자. 

이 딥러닝 모델은 d차원인 입력 $X$와 파라미터 $W$를 곱해 최종적으로 d차원인 출력 h를 생성한다. 
그리고 파라미터 W는 dX d차원이다. 만약 d가 100이라면, 전체 파라미터 W를 학습시키기 위해서는 10,000개의 파라미터를 학습시켜야 한다.

![Screenshot-2025-06-12-at-10.23.11-PM.png](/img/이미지 창고/Screenshot-2025-06-12-at-10.23.11-PM.png)
하지만 그림 5.16과 같이 파라미터 $W$를 학습시키는 것이 아니라 파라미터 $W$는 고정하고 차원이 (d,r)인 행렬 A와 차원이 (r, d)인 행렬 $B$의 곱을 학습시킬 수 있다. 

행렬의 곱 셈에서 (d,r)차원인 행렬과 (r, d)차원인 행렬이 곱해지면 (d, a)차원이 된다. 

행렬을 2개 학습하지만 r을 d보다 작은 수로 설정하는 경우 파라미터 $W$를 학습시킬 때보다 훨씬 적은 파라미터 업데이트로 모델을 학습시킬 수 있다. 
예를 들어 r이 4라면, 행렬$A$의 파 라미터 400개(100 x4), 행렬 B의 파라미터 400개(100 x4)로 총 800개의 파라미터만 학습시키면서도 파라미터 W를 변경하는 것 같은 효과를 얻을 수 있다. 
파라미터 재구성을 통해 학습할 파라미터 수를 8% 수준으로 낮춘 것이다. 
일반적으로 100보다 더 큰 d 값을 사용하기 때문에 실제로는 1% 미만의 파라미터를 학습하는 경우도 많다.

그림 5.16에서 기존 파라미터 $W$에 새로운 행렬 $A$와 $B$를 추가해 학습 하는데 왜 GPU 메모리 사용량이 줄어드는지 궁금할 수 있다. 
행렬 $A$와 $B$가 파라미터 $W$에 비해 훨씬 작 다고는 하더라도 파라미터가 추가되는 것이기 때문에 모델 파라미터 용량 자체는 아주 작게 증가한다. 
하지만 앞서 GPU 메모리에는 모델 파라미터뿐만 아니라, 그레이디언트 와 옵티마이저 상태가 저장된다고 설명했었다.
그림 5.17은 전체 미세 조정과 LORA를 비교한 그림인데, 오른쪽의 LORA에는 왼쪽에 없는 어댑터가 추가된 것을 확인할 수 있다. 

여기서 어댑터가 그림 5.16의 행렬 A와 B인데, 행렬 A와 B는 파라미터 W에 비해 훨 씬 작기 때문에 그림에서 어댑터가 작게 표현된 것을 확인할 수 있다. 
학습하는 파라미 터의 수가 줄어들면 모델 업데이트에 사용하는 옵티마이저 상태의 데이터가 줄어드는 데, LORA를 통해 GPU 메모리 사용량이 줄어드는 부분은 바로 그레이디언트와 옵티마 이저 상태를 저장하는 데 필요한 메모리가 줄어들기 때문이다.

![스크린샷-2025-06-13-오후-8.07.17.png](/img/이미지 창고/스크린샷-2025-06-13-오후-8.07.17.png)
![스크린샷-2025-06-13-오후-8.07.30.png](/img/이미지 창고/스크린샷-2025-06-13-오후-8.07.30.png)

### LoRA 설정 살펴보기

모델 학습에 LORA를 적용할 때 결정해야 할 사항은 크게 세 가지다. 먼저 그림 5.16에 서 파라미터 W에 더할 행렬 A와 B를 만들 때 차원 r을 몇으로 할지 정해야 한다. r을 작 게 설정하면 학습시켜야 하는 파라미터의 수가 줄어들기 때문에 GPU 메모리 사용량을 더 줄일 수 있다. 하지만 이 작아질 경우 그만큼 모델이 학습할 수 있는 용량capacily이 작아지기 때문에 학습 데이터의 패턴을 충분히 학습하지 못할 수 있다. 따라서 실험을 통해 적절한 값을 설정해야 한다.

다음으로 추가한 파라미터를 기존 파라미터에 얼마나 많이 반영할지 결정하는 알파리pha 가 있다. 그림 5.16에서 행렬 A와 B를 추가한 상태에서 추론할 때 행렬 A와 B를 곱한 부분을 기존 파라미터 W와 동일하게 더해줄 수도 있지만, 행렬 A와 B를 더 중요하게 고려할 수도 있다. LORA에서는 행렬 A와 B 부분을 (알파/r)만큼의 비중으로 기존 파라 미터 W에 더해준다. 예를 들어, 알파가 16이고 r이 8이라면 행렬 A와 B에 2(= 16/8)를 곱해 기존 파라미터에 더해준다. 즉 알파가 커질수록 새롭게 학습한 파라미터의 중요성 을 크게 고려한다고 볼 수 있다. 학습 데이터에 따라 적절한 알파 값도 달라지기 때문에 실험을 통해 r 값과 함께 적절히 설정해야 한다.

마지막으로, 모델에 있는 많은 파라미터 중에서 어떤 파라미터를 재구성할지 결정 해야 한다. 일반적으로 그림 5.18에서 표 시한 것과 같이 셀프 어텐션 연산의 쿼리 피드 포워드 층(query), 키(Key), 값(value) 가중치와 같이 선형 연산의 가중 치를 재구성한다. 이 중에서 특정 가중치 에만 LORA를 적용할 수도 있고 전체 선형 층에 LORA를 적용할 수도 있다. 보통 전체 선형 층에 LORA를 적용한 경우 성 능이 가장 좋다고 알려져 있는데, 이 부분 또한 실험을 통해 적절히 선택해야 한다.
![스크린샷-2025-06-13-오후-8.10.08.png](/img/이미지 창고/스크린샷-2025-06-13-오후-8.10.08.png)

### 코드로 LoRA 학습 사용하기
지금까지 파라미터 재구성을 통해 GPU 메모리 사용량을 줄이면서도 전체 미세 조정과 거의 동일한 성능을 내는 LORA 학습 방법에 대해 알아봤다. 
허깅페이스는 peft 라이브 러리를 통해 LORA와 같은 효율적인 학습 방식을 쉽게 활용할 수 있는 기능을 제공한다.

예제 5.12에는 앞서 예제 5.2에서 정의했던 `load_model_and_tokenizer` 함수에 peft 인 자를 'lora'로 설정할 경우 모델에 LORA를 적용하는 부분을 추가했다(새롭게 추가한 부 분은 굵은 글꼴로 표시했다). 
peft 라이브러리에서 LoraConfig 클래스를 사용하면 LORA를 적용할 때 사용할 설정을 정의할 수 있다. 

(1) 에서 보면, 앞서 살펴봤던 r 값을 8로, 알 파 값을 32로, LORA를 어떤 가중치에 적용할지 정하는 `target_modules`는 퀴리, 키, 값 가중치("query_key_value")로 설정했다. 
(2) 다음으로 불러온 모델에 Lora_config를 적용해 파라미터를 재구성하는 `get_peft_model` 함수를 호출하고 

(3) 모델 재구성 후에 학습 파라 미터의 수와 비중을 확인하는 `print_trainable_parameters()` 메서드를 호출한다.

> 모델을 불러오면서 LORA 적용하기(예제 5.2에 굵은 글꼴로 표시한 부분 추가) 
```python
from transformers import AutoModelForCausalLM, AutoTokenizer 
from peft import LoraConfig, get_peft_model

def load_model_and_tokenizer(model_id, peft=None) :
	tokenizer = AutoTokenizer. from_pretrained(model_id)
	
	if peft is None:
		model = AutoModelForCausalLM. from_pretrained(model_id, torch_dtype="auto", device_map={"": 0})

	elif peft == 'lora':
		model = AutoModelForCausalLM. from_pretrained(model_id, torch_dtype="auto", device_map={"™:0})
		lora_config = LoraConfig( r=8, lora_alpha=32, target _modules=["query_key_value"], lora_dropout=0.05, bias="none", task_type="CAUSAL_LM")
		model = get_peft_model(model, lora_config)
		model.print_trainable_parameters) ®
	print_ gpu_utilization()
	return model, tokenizer

```

이제 예제 5.13을 실행해 LORA를 적용했을 때 GPU 메모리 사용량이 어떻게 달라지 는지 확인해 보자. 
출력 결과를 확인하면, LORA를 적용하면서 학습 가능한 파라미터가 전체 파라미터 대비 0.117%로 훨씬 줄어들었다. 
모델을 불러왔을 때 메모리 사용량은 2.602GB로 이전과 거의 동일한데, 옵티마이저 상태의 메모리 사용량과 그레이디언트 메모리 사용량이 각각 0.006GB와 0.003GB로 현저히 줄어들었다. 
전체 파라미터를 학 습하는 것이 아니라 전체의 0.117%만 학습하기 때문이다.

> LORA를 적용했을 때 GPU 메모리 사용량 확인

```python
cleanup( )
print_gpu_utilization()
gpu_memory_experiment(batch_size=16, peft='lora')
torch. cuda.empty_cache()
# trainable params: 1,572,864 || all params: 1,333,383,168 || trainable%:
0.11796039111242178
# GPU 메모리 사용량: 2.602 GB
# GPU 메모리 사용량: 4.732 GB
# 옵티마이저 상태의 메모리 사용량: 0.006 GB
# 그레이디언트 메모리 사용량: 0.003 GB
```

LORA는 예제 5.13에서 확인할 수 있듯이 모델의 일부만 학습함으로써 필요한 GPU 메모리 사용량을 줄여 더 효율적인 모델 학습을 가능하게 만든다. 
그러면서도 전체 미세 조정과 거의 동일한 성능을 달성할 수 있기 때문에 많이 사용되고 있다. 
다음으로 LORA에 모델 양자화를 추가한 OLORA를 살펴보자.

## 효율적인 학습 방법(PEFT): QLoRA
2023년 5월 워싱턴대학교의 팀 데트머스Tim Dettmers와 알티도로 팩노니Artidoro Pagnoni가 발표한 [OLORA(「OLORA: Efficient Finetuning of Quantized LLMs(QLORA: 양자화된 LIM의 효율적인 미세 조정)](https://arxiv.org/pdf/2305.14314.pdf)는 LORA에 양자화를 추가해 메모리 효율성을 한 번 더 높인 학습 방법이다. 
양자화란 기존 데이터를 더 적은 메모리 를 사용하는 데이터 형식으로 변환하는 방법을 말한다. 
그림 5.19에서 QLORA와 LORA 를 비교하고 있는데, 16비트로 모델을 저장하고 있는 LORA와 달리 QLORA는 4비트 형식으로 모델을 저장한다. 
또한 그림 오른쪽에 CPU 메모리가 함께 표시되어 있는데 QLORA는 학습 도중 OOMout of Memory 에러가 발생하지 않고 안정적으로 진행할 수 있 도록 페이지 옵티마이저paged optimizer 기능을 활용했다. 
OLORA는 대형 언어 모델을 최 대한 효율적으로 다룰 수 있도록 여러 기법을 적용했기 때문에 메모리 효율화를 이해하 기 위한 좋은 참고 자료이기도 하다. 
OLORA를 이해하기 위한 개념을 하나씩 살펴보자.
![스크린샷-2025-06-13-오후-8.18.04.png](/img/이미지 창고/스크린샷-2025-06-13-오후-8.18.04.png)

### 4비트 양자화와 2차 양자화
앞서 5.1절에서 여러 양자화 방식을 살펴봤다. 
양자화의 핵심 과제는 기존 데이터의 정 보를 최대한 유지하면서 더 적은 비트를 사용하는 데이터 형식으로 변환하는 것이다.

특히 변환하려는 데이터 타입의 경우 적은 비트 수를 사용하기 때문에 하나하나의 수가 낭비되지 않고 사용되는 것이 좋은데, 이를 위해 기존 데이터의 순위대로 새로운 데이 터 형식에 매핑하는 방법을 사용할 수 있었다. 
하지만 데이터의 순서를 사용하는 경우 데이터를 정렬해야 하고 어떤 데이터가 몇 번째 순위에 있었는지 저장해야 하기 때문에 연산량이 많고 순위를 저장하기 위해 메모리를 사용한다는 단점이 있다.

만약 기존 데이터의 분포를 알고 있다면 많은 연산이나 메모리 사용 없이도 빠르게 데 이터의 순위를 정할 수 있다. 예를 들어, 입력 데이터가 정규 분포를 따른다는 걸 알고있다면 데이터를 균등하게 분리하기

정규분포 퀀타일 구분

위해 사용할 경곗값을 그림 5.20과 같 이 쉽게 계산할 수 있다. 그림 5.20에 서는 정규 분포를 따르는 데이터를 균 등하게 10등분할 수 있는 경곗값을 찾 아 분할했다. 만약 변환하려는 데이 터 타입이 4비트만 사용해 16개의 수 를 사용한다면, 그림 5.20에서 면적을 16등분할 수 있는 경값을 찾고 입력 데이터가 경값을 기준으로 큰지 작 그림 5.20 입력 데이터가 정규 분포를 따를 경우 쉽게 경곗값을 기준으로 큰지 작은지에 따라 0~15까지 적절히 배정면 된다.
![스크린샷-2025-06-13-오후-8.19.58.png](/img/이미지 창고/스크린샷-2025-06-13-오후-8.19.58.png)
이때 그림 5.20에서 영역을 구분하는 경값은 다음과 같은 코드로 간단히 구할 수 있다.
코드에서 `quantile_normal` 함수는 정규 분포 그래프 아래 면적의 p%가 몇 이하에 존재하는지 구한다. 
예를 들어 `quantile_normal`에 0.5를 입력하면 0을 출력하는데, 정규 분포의 50%의 데이터가 0보다 작은 영역에 있다는 의미다. 
0.6을 입력하면 0.2533을 출력하는데, 60%의 데이터가 0.2533보다 작은 영역에 있다. 
두 값의 차이를 통해 10% 의 데이터가 (0, 0.2533)의 범위에 있다는 사실을 알 수 있다.

```python
from scipy.stats import norm
def quantile_normal(p):
	return norm.ppf(p)
print( quantile_normal (0.5)) # 0
print(quantile_normal (0.6)) # 0.25334710313579971
```

앞서 데이터가 정규 분포를 따른다면 이런 계산이 가능하다고 했는데, 학습된 모델 파라미터는 거의 정규 분포에 가깝다고 알려져 있다. 
실제로 QLORA 논문을 쓴 팀 데트머스와 알티도로 팩노니가 메타의 라마 LaMa 모델을 확인했을 때 92.5% 정도의 모델 파라미터가 정규 분포를 따랐다. 
따라서 입력이 정규 분포라는 가정을 활용하면 모델의성능을 거의 유지하면서도 빠른 양자화가 가능해진다. 
OLORA 논문에서는 위에서 설명한 방식에 따라 양자화를 수행한 4비트 부동소수점 데이터 형식인 `NF4Normal Float 4-bit`를 제안했다.

논문에서는 4비트 양자화에서 한 발 더 나아가 2차 양자화(double quantization)도 수행한다.
2차 양자화는 NF4 양자화 과정에서 생기는 32비트 상수도 효율적으로 저장하고자 한다. 
NF4는 그림 5.21과 같이 64개의 모델 파라미터를 하나의 블록으로 묶어 양자화를 수행한다. 
따라서 64개의 모델 파라미터마다 1개의 상수(정규 분포의 표준편차)를 저장해야 한다. 
이때 다시 256개의 양자화 상수를 하나의 블록으로 묶어 8비트 양자화를 수행하면 상수 저장에 필요한 메모리도 절약할 수 있다. 
2차 양자화를 수행하면 이전에는 양자화 상수를 저장하기 위해 32비트 데이터 256개를 저장했지만 이후에는 8비트 데이터 256개와 양자화 상수 c를 저장하기 위한 32비트 데이터 1개만 저장하면 된다.

![스크린샷-2025-07-03-오전-10.04.46.png](/img/이미지 창고/스크린샷-2025-07-03-오전-10.04.46.png)
### 페이지 옵티마이저
OLORA 논문에서는 그레이디언트 체크포인팅 과정에서 발생할 수 있는 OOM 에러를방지하기 위해 페이지 옵티마이저(paged optimizer)를 활용한다. 
이 부분을 이해하기 위해 앞에서 본 그레이디언트 체크포인팅 그림을 다시 한번 살펴보고, 엔비디아NVIDIA의 통합 메모리(unifiedmemory)에 대해 알아보자.
그레이디언트 체크포인팅을 사용하는 그림 5.22(a)에서 순전파를 수행할 때는 3개의 노드 데이터만 저장하고 있지만, 그림 5.22(b)에서 역전파를 수행할 때는 5개의 노드 데이터를 저장해야 한다. 
이렇게 일시적으로 메모리 사용량이 커지는 지점들이 생기는데, 이때 OOM 에러가 발생할 수 있다. 
이런 순간에 대응하기 위해 OLORA 논문에서는페이지 옵티마이저를 사용한다.
![스크린샷-2025-07-03-오전-10.05.59.png](/img/이미지 창고/스크린샷-2025-07-03-오전-10.05.59.png)
페이지 옵티마이저란, 엔비디아의 통합 메모리를 통해 GPU가 CPU 메모리(RAM)를 공유하는 것을 말한다. 
엔비디아의 통합 메모리는 컴퓨터의 가상 메모리 시스템과 유사한 개념을 GPU 메모리 관리에 적용한 기술이다. 

가상 메모리는 램과 디스크를 사용해 컴퓨터가 더 많은 메모리를 가진 것처럼 작동하게 해준다. 
마찬가지로, 통합 메모리는 CPU와 GPU가 메모리를 공유해 더 많은 GPU 메모리가 있는 것처럼 동작한다.

가상 메모리에서 운영체제는 램이 가득 차면 일부 데이터를 디스크로 옮기고 필요할 때다시 램으로 데이터를 불러오는데, 이 과정을 페이징Paging이라고 한다. 
엔비디아의 통합메모리도 이와 유사하게 작동한다. GPU가 처리해야 할 데이터가 많을 때 모든 데이터를 GPU 메모리에 담을 수 없다면, 일부 데이터를 CPU의 메모리에 보관한다. 
CPU에 있 는 데이터가 필요해지면, 그때 해당 데이터를 CPU 메모리에서 GPU 메모리로 옮겨 처리한다.

지금까지 QLoRA를 이해하는 데 꼭 필요한 4비트 양자화와 페이지 옵티마이저에 대해 설명했다. 
5.4절에서 살펴본 LORA까지 더하면 OLoRA의 모든 핵심 개념을 이해한 것이다.

### 코드로 QLoRa 모델 활용하기
이제 허깅페이스 코드를 통해 OLORA 학습을 진행하는 방법을 알아보자. 
예제 5.14와 같이 허깅페이스와 통합돼 있는 bitsandbytes 라이브러리를 활용하면 모델을 불러올 때 4비트 양자화를 간단히 수행할 수 있다. 
`BitsAndBytesConfig` 클래스에 4비트로 불러올 지 여부(Load_in_4bit), 4비트 데이터 타입(bnb_4bit_quant_type), 2차 양자화를 수행할지 여부(bnb_4bit_use_double_quant), 계산할 때 사용할 데이터 형식(bnb_4bit_compute_dtype) 을 지정하면 된다. 
우리는 논문의 내용을 이해했기 때문에 코드를 보면 각각의 설정이 어떤 의미인지 쉽게 이해할 수 있다.

> 4비트 양자화 모델 불러오기
```python
from transformers import BitsAndBytesConfig

nf4_config = BitsAndBytesConfig(
load_in_4bit=True, bnb_4bit_quant_type="nf4",
bnb_4bit_use_double_quant=True,
bb_4bit_compute_dtype=torch.bf loat16)

model _nf4 = AutoModelForCausalLM. from_pretrained(model_id, quantization_config=nf4_config)
```

마지막으로 예제 5.12에서 LORA 모델 설정을 추가했던 것에 이어 QLoRA 모델을 불러오 는 부분도 추가하면, 예제 5.15와 같다. 
새롭게 추가한 부분은 굵은 글꼴로 표시했다. 
1. 예제 5.15에서는 4비트 양자화와 2차 양자화를 수행하기 위해 `BitsAndBytesConfig` 클래스 를 사용해 양자화 설정을 정의했다. 
2. 다음으로 양자화 설정인 `bnb_config`를 사용해 모델을 불러오고 모델을 학습시키기 위한 준비 과정으로 `prepare_model_for_kbit_training` 함수를 호출한다.
3. 마지막으로 LORA 설정을 적용하기 위해 `get_peft_model` 함수를 호 출하고, 학습 가능한 파라미터 수를 확인하기 위해 `print_trainable_parameters()` 메서드를 사용한다

> 예제 5.11에서 QLORA 모델을 불러오는 부분 추가
```python
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig 
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training

def load model_and_tokenizer (model_id, peft=None) :
	tokenizer = AutoTokenizer. from_pretrained(model_id)
	if peft is None:
		model = AutoModelForCausalLM. from_pretrained(model_id, torch_dtype="auto", device_map={"" :0})	
	elif peft == 'lora':
		model = AutoModelForCausalLM. from_pretrained(model_id, torch_dtype="auto", device_map={"" :0})
		
		lora_config = LoraConfig( r=8, lora_alpha=32, target_modules=["query_key_value"], Lora dropout=0.05, bias="none", task_type="CAUSAL_LM")
		model = get_peft_model (model, lora _config)
		model. print_trainable_parameters()
	elif peft == 'qlora':
		lora_config = LoraConfig( 
			r=8, 
			lora_alpha=32, 
			target_modules = ["query_key_value"], 
			lora_dropout=0.05, bias="none", 
			task_type="CAUSAL_LM"
		)
		bnb_config = BitsAndBytesConfig( # 1
			load_in_4bit=True, 
			bnb_4bit_use_double_quant=True, 
			bnb_4bit_quant_type="nf4", 
			bnb_4bit_compute_dtype=torch.float16
		)

		model = AutoModelForCausalLM.from_pretrained(
			model_id, 
			quantization_config=bb_config, 
			device_map={"'":0}
		) # 2
		model. gradient_checkpointing_enable()
		model = prepare_model_for_kbit_training (model)
		model = get_peft_model (model, lora_config) # 3
		model. print_trainable_parameters() # 3

	print_gpu_utilization()
	return model, tokenizer
```
예제 5.16을 실행해 새롭게 추가한 `Load_modeL_and_tokenizer` 함수로 QLoRA 모델을 불러와 배치 크기 16일 때 메모리 사용량을 확인하면 예제 5.16과 같다. 
기존에는 모델 을 불러올 때 2.6GB가 필요했지만, OLoRA를 사용할 경우 메모리 사용량이 절반 이하인 1.183GB로 떨어졌다. 
또한 그레이디언트와 옵티마이저 상태를 저장하는 데 필요한 메모리도 감소하면서 총 GPU 메모리 사용량이 1.722GB로 크게 감소한 것을 확인할 수 있다.

> QLORA를 적용했을 때의 GPU 메모리 사용량 확인
```python
cleanup()
print_gpu_utilization( )
gpu_memory_experiment(batch_size=16, peft='qlora' )
torch.cuda. empty_cache( )

# 출력 결과
# GPU 메모리 사용량: 1.183 GB
# GPU 메모리 사용량: 1.722 GB
# 옵티마이저 상태의 메모리 사용량: 0.012 GB
# 그레이디언트 메모리 사용량: 0.006 GB
```

# sLLM 학습하기
범용적인 성능이 뛰어난 상업용 LLM에 비해 비용 효율적이면서 특정 작업 또는 도메 인에 특화된 sLLM이 주목받고 있다. 이번 장에서는 실습으로 자연어 요청으로부터 적 합한 SQL(Structured Query Language)을생성하는 Text2SOL(NL2SQL) sLLM을 만들어 본다.

SQL은 관계형 데이터베이스Relational Database, RDB에서 데이터를 생성, 조회, 업데이트, 삭 제(CRUD)하기 위해 사용하는 언어로, 데이터 분석에 필수적으로 활용된다.

Text2SOL은 그림 6.1과 같이 사용자가 얻고 싶은 데이터에 대한 요청을 자연어로 작성 하면 LLM이 요청에 맞는 SOL을 생성하는 작업을 말한다. 

기업 내에서는 일반적으로 데이터 팀이나 팀 내에 있는 데이터 인력이 마케팅, 운영, 사업 등 여러 부서에서 알고 싶은 정보를 추출해서 전달하는 방식으로 데이터를 활용하고 있다. 
자동 완성, 코드 리뷰 등으로 개발자의 생산성을 높여주는 깃허브 코파일럿Github Copilot은 LLM을 활용한 제품 중 가장 성공적인 제품으로 꼽힌다. 

SQL 생성을 LLM이 보조할 수 있다면 데이터 인력 의 생산성을 높일 수 있을 뿐만 아니라 현업 구성원의 SQL 진입 장벽을 낮출 수 있다는 점에서 중요한 과제라고 할 수 있다.
![스크린샷-2025-07-03-오전-10.25.08.png](/img/이미지 창고/스크린샷-2025-07-03-오전-10.25.08.png)
이번 장에서는 먼저 Text2SQL SLLM의 미세 조정에 사용할 수 있는 데이터셋을 살펴본다. 
대표적인 영어 데이터셋과 한국어 데이터셋을 살펴보고 실습에서 사용할 합성 데이 터셋을 소개한다. 
다음으로 모델이 잘 학습되고 있는지 평가할 때 사용할 평가 파이프 라인을 만든다. 

Text2SOL 모델을 평가할 수 있는 다양한 방법이 있지만 이번 실습에서 는 GPT-4 모델을 활용해 SOL이 잘 생성됐는지 확인하는 방식을 사용한다. 
마지막으로 준비한 학습 데이터로 SLLM의 미세 조정을 수행 하는데, 데이터셋의 크기를 바꾸거나 데 이터 정제를 추가로 수행하거나 기초 모델을 변경하는 등 다양한 실험을 추가해 sLLM 을 학습시키는 과정에 익숙해질 수 있도록 실습을 구성했다.


이번 장의 실습을 마치고 나면 Text2SOL이 아닌 다른 작업에서도 SLLM 학습을 기획하고 실행할 수 있는 준비가 될 것이다. 
이제 본격적으로 실습을 진행하기 전에 다음 명령 을 실행해 실습에 필요한 라이브러리를 설치하자.

```shell
!pip install transformers<mark>4.40.1 bitsandbytes</mark>0.43.1 accelerate==0.29.3
datasets<mark>2.19.0 tiktoken</mark>0.6.0 -qqq
!pip install huggingface_hub<mark>0.22.2 autotrain-advanced</mark>0.7.77 -qqq
```

설치가 끝났다면, Text2SOL SLLM 학습에 사용할 데이터셋을 살펴보면서 실습을 시작해 보자.

## Text2SQL 데이터 셋
이번 장의 실습에서는 사전에 구축된 데이터셋을 사용하지 않고 내가 직접 생성한 합성 데이터셋을 사용한다. 
실습에서 사용할 데이터셋을 살펴보기 전에, Text2SOL 작업을 위해 구축된 대표적인 데이터셋을 살펴본다. 

먼저 대표적인 영어 데이터셋과 그 형태를 살펴보고, 사용할 수 있는 한국어 데이터셋이 있는지 알아본 후 실습에서 사용할 합성 데이터셋과 그 형태를 알아본다.

### 대표적인 Text2SQL 데이터셋
대표적인 Text2SQL 데이터셋으로는 WikiSOL과 Spider가 있다. 
SOL을 생성하기 위해 서는 크게 두 가지 데이터가 필요하다. 
먼저, 어떤 데이터가 있는지 알 수 있는 데이터베이스 정보(테이블과 컬럼)가 필요하다. 

다음으로 어떤 데이터를 추출하고 싶은지 나타낸 요청사항(request) 또는 (question)이 필요하다. 
WikiSQL 데이터를 예시로 살펴보면 예제 6.1과 같다. 

테이블(table) 항목에 테이블 이름, 컬럼 이름(header), 컬럼 형식(types)이 있고 요청(question) 항목으로 어떤 데이터가 필요한지 요청사항이 적혀 있다. 
마지막으로 SQL 항목에 정답 SQL데이터가 있다

> WikiSQL 데이터셋 예시
```python
# WikiSQL 예시
table: {
	"name": "table_1000181_1",
	"header": [ "State/territory", "Text/background colour", "Format", "Current slogan", "Current series", "Notes"],
	"types" : ["text", "text", "text", "text", "text", "text" ],
	"id" : "1-1000181-1" 
	}
question: "Tell me what the notes are for South Australia"	
sql:{ 
	"human_readable" : "SELECT Notes FROM table WHERE Current slogan = SOUTH AUSTRALIA"
}
```

WikisOL은 하나의 테이블만 사용하고 SELECT 문에 컬럼을 1개만 사용하거나 조건 (WHERE)절에 최대 3개의 조건만 사용하는 등 비교적 쉬운 SQL 문으로 구성돼 있다.

Spider는 좀 더 현실적인 문제 해결을 위해 구축된 데이터셋으로 `ORDER BY`, `GROUP BY`, `HAVING`, `JOIN` 등 비교적 복잡한 SQL 문도 포함하고 있다. 
하지만 두 데이터셋 모두 요청사항이 영어로 되어 있어 한국어 실습을 위한 데이터셋으로는 적합하지 않다. 
Spider 데이터셋에 관한 더 자세한 사항은 [Spider 데이터셋 소개 페이지](https://yale-lily github.io/spider)에서 확인할 수 있다.

### 한국어 데이터 셋
한국어 Text2SQL 데이터셋으로는 AI 허브에서 구축한 자연어 기반 질의(NI2SQL) 검 색 생성 데이터가 있고, AI 허브 NL2SOL [데이터셋 페이지 링크](htps://www.aihub.or.kr/aihubdata/data/view.do?currMenu=115&topMenu=100&aihubDataSe=data&dataSetSn=71351)에서 자세한 정보를 확인할 수 있다. 

하지만 이 책을 쓰는 시점(2023년 12월) 에 데이터 보완 작업을 위해 공개가 중단돼 있고 AI 허브에서 구축한 데이터셋은 모델 학습을 위한 목적으로 활용할 수 있으나 데이터를 직접 지면에 실을 수 없다는 한계가 있어 이번 실습에서는 활용하지 않는다. 

이번 실습에서 활용한 코드를 사용해 이후에 Al 허브의 데이터로도 학습을 진행한다면 좋은 연습이 될 것이다.

### 합성 데이터 활용
기존에 구축된 대표성 있는 데이터셋을 활용한다면 좋겠지만, 현재는 한국어 Text2SOL 작업을 위해 활용할 수 있는 데이터셋이 없기 때문에 실습에서 활용할 데이터셋을 GPT-3.5와 GPT-4를 활용해 생성했다. 

데이터셋은 허깅페이스의 [실습 데이터셋 페이지](https://huggingface.co/datasets/shangrilar/ko_text2sql)에서 확인할 수 있다.

생성한 데이터셋은 그림 6.2와 같이 db_id, context, question, answer 4개의 컬럼으로 구성돼 있다. 
db_id는 테이블이 포함된 데이터베이스의 아이디로, 동일한 db_id를 갖는 테이블은 같은 도메인을 공유한다. 

예를 들어 db_id가 1인 테이블은 분야(도메인)가 '게 임'인 상황을 가정하고 생성한 테이블이다. 

context 컬럼은 SOL 생성에 사용할 테이블 정보를 갖고 있다. 
question 컬럼은 데이터 요청사항을, answer 컬럼은 요청에 대한 SOL 정답을 담고 있다.

![스크린샷-2025-07-03-오전-10.55.39.png](/img/이미지 창고/스크린샷-2025-07-03-오전-10.55.39.png)
이해를 돕기 위해 예시 데이터를 살펴보면 그림 6.3과 같다. 

db_id가 1인 경우 게임 도메인을 가정하고 테이블을 생성했는데, context 컬럼에서 pLayers라는 테이블의 DDL(Data Defnition Language)을 통해 테이블 이름, 컬럼 이름, 컬럼 형식을 확인할 수 있다.

question 컬럼의 값으로는 모든 플레이어 정보를 조회해 줘"라는 요청이 있고 answer 컬럼에는 `SELECT* FROM players;` 라는 SOL 정답이 있다.

![스크린샷-2025-07-03-오전-10.56.26.png](/img/이미지 창고/스크린샷-2025-07-03-오전-10.56.26.png)
전체 데이터셋이 약 38,000개 정도인데, 시간 제약상 모든 데이터를 검수할 수 없어 최초 생성한 45,000개에서 규칙 기반으로 간단한 데이터 정제를 수행 했다. 
따라서 학습 데이터에 잘못 생성된 데이터가 포함되어 있을 수 있다.

## 성능 평가 파이프라인 준비하기
머신러닝 모델을 학습시킬 때는 학습이 잘 진행된 것인지 판단할 수 있도록 성능 평가 방식을 미리 정해야 한다. 
이번 절에서는 Text2SQL 작업을 평가할 때 사용할 수 있 는 평가 방식을 소개한다. 

우리는 실습에서 일반적으로 사용되는 Tex12SOL 평가 방식 을 사용하지 않고 GPT-4를 사용해 생성된 SOL이 정답인지 판단하는 방식을 사용한다.

GPT-4와 같이 뛰어난 성능의 LLM을 평가자로 활용하면 빠르게 평가를 수행하면서도 신뢰할 수 있는 평가 결과를 기대할 수 있다. 
GPT-4를 활용해 평가하기 위해 필요한 평 가 데이터셋과 프롬프트를 준비하고 여러 번의 GPT-4 API 호출을 빠르게 수행할 수 있 는 방법을 알아본다.

### Text2SQL 평가 방식
LIM 모델을 개발하는 데 있어 성능 평가는 가장 어려운 부분 중 하나다.  Text2SQL 작업 평가에서도 마찬가지다. 

일반적으로 사용하는 평가 방법은 생성한 SQL이 문자열 그 대로 동일한지 확인하는 EM(Exact Match) 방식과 쿼리를 수행할 수 있는 데이터베이스를 만들고 프로그래밍 방식으로 SOL 쿼리를 수행해 정답과 일치하는지 확인하는 실행 정 확도Execution Accuracy, EX 방식이 있다. 하지만 EM 방식은 그림 6.4와 같이 의미상으로 동 일한 SOL 쿼리가 다양하게 나올 수 있는데 문자열이 동일하지 않으면 다르다고 판단한다는 문제가 있고, 실행 정확도 방식의 경우 쿼리를 실행할 수 있는 데이터베이스를 추 가로 준비해야 하기 때문에 이번 실습에서는 두 방식 모두 사용하지 않는다

![스크린샷-2025-07-23-오전-9.00.30.png](/img/이미지 창고/스크린샷-2025-07-23-오전-9.00.30.png)
최근 LLM을 활용해 LLM의 생성 결과를 평가하는 방식이 활발히 연구되고 있고 폭넓게 이용되고 있다. 
생성 결과를 정량적으로 평가하기 어려운 작업이 많고 사람이 직접 평 가를 수행하기에는 시간과 비용이 많이 들어 개발 사이클을 늦춘다는 한계가 있기 때문이다. 
이번 실습에서는 그림 6.5와 같이 LLM이 생성한 SOL이 데이터 요청을 잘 해결하 는지 GPT-4를 사용해 확인한다. LLM을 활용해 다른 LLM을 평가하는 방식에 대해서는

13장에서 더 자세히 살펴본다

![스크린샷-2025-07-23-오전-9.01.01.png](/img/이미지 창고/스크린샷-2025-07-23-오전-9.01.01.png)
GPT를 활용한 성능 평가 파이프라인을 준비하기 위해서는 세 가지가 필요하다. 
먼저 평가 데이터셋을 구축해야 한다. 다음으로 LLM이 SOL을 생성할 때 사용할 프롬프트를 준비한다. 
마지막으로, GPT 평가에 사용할 프롬프트와 GPT-4 API 요청을 빠르게 수행 할 수 있는 코드를 작성한다. 
하나씩 진행해 보자.

### 평가 데이터 셋 구축

실습에 사용할 합성 데이터셋은 8개 데이터베이스(도메인)에 대해 생성했다. 
모델의 일 반화 성능을 확인하기 위해 7개의 데이터베이스 데이터는 학습에 사용하고 1개의 데 이터베이스는 평가에 사용한다. 
`db_id`가 1인 데이터는 게임 도메인을 가정하고 만든 데이터베이스인데, 게임 도메인의 경우 테이블 이름이 다른 도메인과 달리 플레이어 (players), 퀘스트(quests), 장비(equipments)와 같이 특화된 이름을 사용하므로 `db_id`가 1인 데이터를 평가 데이터셋으로 활용한다.

시간 제약상 합성 데이터셋 전부를 직접 검수할 수 없었지만 평가 데이터로 사용할 데 이터의 경우 직접 검수를 통해 112개의 데이터를 준비했다. 
검사 데이터의 수가 많을 수록 더 정확한 성능 평가가 되겠지만, GPT-4를 활용해 평가를 수행할 것이기 때문 에 발생하는 비용을 줄이면서 실습을 수행할 수 있도록 100개 내외의 데이터 만 사용한다. 
평가 데이터셋은 실습 데이터셋의 [test 서브셋 링크](https://huggingface.co/datasets/ shangrilar/ko_text2sql/viewer/defaull/test)에서 확인할 수 있다.

### SQL 생성 프롬프트

LLM SOL을 생성하도록 하기 위해서는 지시사항과 데이터를 포함한 프롬프트prompt 를 준비해야 한다. 
LLM의 경우 학습에 사용한 프롬프트 형식을 추론할 때도 동일하게 사용해야 결과 품질이 좋기 때문에 이번 절에서 준비한 프롬프트 형식은 이어지는 절에 서 모델을 미세 조정할 때도 동일하게 적용한다.

프롬프트는 예제 6.2와 같은 `make_prompt` 함수를 통해 생성한다. 
먼저 SQL을 생성하라 는 명령을 작성하고 필요한 데이터(DDL과 Question)를 입력한 후 정답에 해당하는 SQL 을 마지막에 채워 넣는다. 
학습 데이터에서는 정답이 채워진 형태로 사용하고 SQL을 생 성할 때는 query를 입력하지않아 기본값인 빈 문자열이 들어가도록 한다.

`SQL 프롬프트`
```python
def make_prompt(ddl, question, query="'):
	prompt= f"""당신은 SQL을 생성하는 SQL 봇입니다. DDL의 테이블을 활용한 Question을 해결할 수 있는 SQL 쿼리를 생성하세요.
### DDL:

{ddl}

### Question:

{question}

### SQL:

{query}""

return
```

예제 6.2의 make_prompt 함수를 사용해 생성한 예시 데이터는 예제 6.3과 같다. 
1은 `make_prompt` 함수에 `query`를 입력해 정답 SOL 문이 추가된 형태로 학습에 사용하는 형태다. 
2는 `query`를 입력하지 않아 정답 SQL이 비어 있는 형태로 SQL 생성에 사용하는 형태다. 
정답 SQL을 넣느냐 넣지 않느냐의 차이만 있고 나머지 형태는 동일하다.

`프롬프트 데이터 예시`
```python
# 학습 데이터 예시 1
"""당신은 SOL을 생성하는 SOL 봇입니다. DDL의 테이블을 활용한 Question을 해결할 수 있는 SOL 쿼리를 생성하세요.
### DDL:

CREATE TABLE messages (
"message_id" SERIAL PRIMARY KEY,
"conversation_id" INT NOT NULL,
"sender_id" INT NOT NULL,
"content" TEXT,
"timestamp" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
"read" BOOLEAN DEFAULT FALSE,
FOREIGN KEY ("conversation_id") REFERENCES conversations "conversation_id"),
FOREIGN KEY ("sender_id" ) REFERENCES users("user_id")
);

### Question:
messages 테이블에서 모든 데이터를 조회해 줘

### SQL:
SELECT * FROM messages; """

# 생성 프롬프트 예시 2
"""당신은 SQL을 생성하는 SOL 봇입니다. DDL의 테이블을 활용한 Quest ion을 해결할 수 있는 SQL 쿼리를 생성하세요.

CREATE TABLE messages (
	"message_id" SERIAL PRIMARY KEY,
	"conversation_id" INT NOT NULL,
	"sender_id" INT NOT NULL,
	"content" TEXT,
	"timestamp" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	"read" BOOLEAN DEFAULT FALSE,
	FOREIGN KEY ("conversation_id") REFERENCES conversations "conversation_id"),
	FOREIGN KEY ("sender_id") REFERENCES users( "user_id")
);

### Question：
messages 테이블에서 모든 데이터를 조회해 줘

### SQL：
"""
```

### GPT-4 평가 프롬프트와 코드 준비
마지막으로, GPT-4를 통해 평가를 수행할 때 사용할 프롬프트와 코드를 준비한다.

GPT-4를 사용해 평가를 수행한다면 반복적으로 GPT-4 API 요청을 보내야 한다. 
이번 실습에서는 112개의 평가 데이터를 사용하는데, 112개 수준이라면 for 문을 통해 반 복적인 요청을 수행해도 시간이 오래 걸리지 않는다. 
하지만 평가 데이터셋을 더 늘린 다면 단순 for 문으로는 시간이 오래 걸린다. 
그럴 때는 OpenAl가 [openai-cookbook 깃허브 저장소에서 제공하는 코드](https://github.com/openai/openai-cookbook/blob/ main/examples/api_request_parallel_processor.py)를 활용하면 요청 제한(rate limit)을 관리 하면서 비동기적으로 요청을 보낼 수 있다. 

해당 코드(`apirequest_parallel_processor.py` 스크립트)는 그림 6.6과 같이 요청을 보낼 내용을 저장한 `jsonl` 파일을 읽어 순차적으로 요청을 보낸다. 
중간에 에러가 발생하거나 요청 제한에 걸리면 다시 요청을 보내서 결 과의 누락도 막아준다. `make_requests_for_gpt_evaluation` 함수는 평가 데이터셋을 읽어 GPT-4 API 요청을 보낼 `jsonl` 파일을 생성할 때 사용한다.
![스크린샷-2025-07-23-오전-9.09.24.png](/img/이미지 창고/스크린샷-2025-07-23-오전-9.09.24.png)
먼저 예제 6.4에서 평가 데이터셋에서 요청 `jsonl` 파일을 생성하는 `make_requests_for_gpt_evaluation` 함수를 살펴보자. 
이 코드에서는 입력한 데이터프레임을 순회하면서 평가에 사용할 프롬프트를 생성하고 `jsonl` 파일에 요청할 내용을 기록한다. 
1. 프롬프트에서 는 DDL과 Question을 바탕으로 LLM이 생성한 SQL(`gen_sql`)이 정답 SQL(`gt_sql.ground truth sql`)과 동일한 기능을 하는지 평가하도록 했다. -- 1
2. 판단 결과는 `resolve_yn`이라는 키 에 `"yes"` 또는 `"no"`의 텍스트가 있는 `JSON` 형식으로 반환하도록 했다. 
3. 생성한 평가 프롬 프트는 사용할 모델 이름을 지정해 요청 작업(`jobs`) 변수에 저장한다. -- 2
4. 마지막으로 지정 한 디렉토리 경로와 파일 이름으로 요청 정보를 jsonl 파일 형태로 저장한다 -- 3

`평가를 위한 요청 isonl 작성 함수`
```python
def make_requests_for_gpt_evaluation(df, filename, dir='requests'):
	if not Path(dir).exists():
		Path(dir).mkdir(parents=True)
	prompts = []
	for idx, row in df. iterrows():
		prompts.append("""Based on below DDL and Question, evaluate gen_sql can resolve Question. If gen_sal and gt_sal do equal job, return "yes" else return "no". Output JSON Format: {"resolve_yn": """ + f"""

DDL: {row[ 'context' ]}
Question: {row[' question']} 
gt_sql: {row[' answer' ]}
gen_sql : { row['gen_sql']}"""
)

	jobs = [
		{
			"model": "gpt-4-turbo-preview", 
			"response_format" : { 
				"type": "json_object" 
			}, 
			"messages": [
				{
					"role": "system", 
					"content": prompt
				}
			]
		} for prompt in prompts
	] with open(Path(dir, filename), "w") as f: 
		for job in jobs:
			json_string = json.dumps (job)
			f.write(json_string + "\n")
```

생성한 jsonl 파일은 파라미터로 지정한 `{dir}/(filename)` 위치에 저장된다. 
예제 6.5의 코드를 실행해 OpenAl 북의 비동기 요청 코드를 실행한다. 
1. 중요한 인자를 살펴보면, `requests_filepath`에는 API에 전달할 데이터와 인자를 지정한 파일의 경로를 입력한 다. 
2. 다음으로 `save_filepath`는 요청 결과가 저장되는 파일 경로다. 
3. `request_url`에는 API 의 엔드포인트 URL을 입력한다. 
4. 
`gpt-4-turbo-preview` 모델을 사용하기 위해 `chat/ completions` 경로를 지정했다. 
마지막으로 `max_requests_per_minute`와 `max_tokens_ per_minute`는 OpenAI가 모델마다 정해둔 요청 제한 값을 입력한다.

`비동기 요청 명령`
```python
import os

os.environ["OPENAI_API_KEY"] = "자신의 OpenAI API 키 입력"

python api_request_parallel_processor.py\
	-﻿-requests_filepath {요청 파일 경로} |
	--save_filepath {생성할 결과 파일 경화} 1
	--request_url https://api.openai.com/v1/chat/completions \
	--max_requests_per_minute 300 \
	--max_tokens _per_minute 100000 \
	-﻿-token_encoding _name cl100k _base \
	--max_attempts 5 \
	--logging_level 20
```

OpenAI는 이전 사용량에 따라 사용자의 티어er를 구분하고 사용량 제한에 차등을 두고 있다. 
이 책을 쓰는 시점(2024년 1월)에 `gpt-4-turbo-preview` 모델의 티어 1 요청 및 토큰 제한은 그림 6.7에서와 같이 500RPM(Request Per Minute), 150,000TPM(Tokens Per Minute) 이다. 

자세한 내용은 [OpenAl 요청 제한 페이지](https://platform.openai.com/accoun/limits)에서 확인할 수 있다. 
하지만 최대 요청 제한 값으로 입력할 경우 제한 초과가 빈번히 발생하기 때문에 예제 6.5와 같이 적절히 값을 낮춰 실행하는 걸 추천한다.

![스크린샷-2025-07-23-오전-9.20.29.png](/img/이미지 창고/스크린샷-2025-07-23-오전-9.20.29.png)

다음으로 예제 6.6의 코드로 GPT-4에 요청을 전달해 반환된 평가 결과를 읽어와 csv 파일로 변환하는 `change_jsonl_to_csv` 함수를 정의 한다. 
평가 결과는 앞서 예제 6.4의 `make_requests_for_gpt_evaluation` 함수에서 `save_file` 인자에 지정한 경로에 저장 되는데, `change_jsonl_to.csv` 함수는 결과 파일을 불러와 프롬프트와 판단 결과 데이터를 각 각 prompts, responses 변수에 저장한다. 저장한 데이터는 pd. DataFrame 클래스를 사용 해 판다스 데이터프레임으로 만들고 to_cSV() 메서드를 사용해 csv 파일로 저장한다.

`결과 jsonl` 파일을 `csv`로 변환하는 함수
```python
def change_jsonl_to_csv( input_file, output_file, prompt_column="prompt",
response_column="response"):
	with open( input_file, 'r') as json_file:
		for data in json_file:
			prompts.append( json. loads (data) [0] ['messages'] [0]['content'])
			responses.append (json. loads(data)[1][ 'choices'][0][ 'message'][ 'content' ] )
	df = pd.DataFrame({prompt_column: prompts, response_column: responses})
	df.to_csv(output_file, index=False)
	return df
```
지금까지 실습에서 사용할 성능 평가 파이프라인을 준비했다. 
`GPT-4`를 사용해 평가를 수행하기 때문에 빠르게 개발 사이클을 진행할 수 있다는 장점이 있다. 
이제부터 모델 학습을 진행해 보자.

## 실습 : 미세 조정 수행하기
이번 절에서는 실습에 사용할 기초 모델을 선택하고 앞선 절에서 준비한 학습 데이 터로 미세 조정을 수행한다. 
사용할 수 있는 다양한 기초 모델이 있지만, 이 책을 쓰는 시점(2023년 12월)에 7B 이하 한국어 사전 학습 모델 중 가장 높은 성능을 보이는 `beomi/Yi-Ko-6B` 모델을 사용한다. 
이 모델은 중국의 01.AI가 발표한 영어-중국어 모델인 `01-ai/Yi-6B`를 한국어에 확장한 모델로, 현재 한국어 LLM 리더보드에서 사전 학습 모델 중 1위를 차지하고 있다. 
허깅페이스의 [beomi/Yi-Ko-6B 저장소](https:// huggingface.co/beomi/Yi-Ko-6B)에서 모델에 관한 더 많은 정보를 확인할 수 있다

### 기초 모델 평가하기
먼저 예시 데이터를 입력했을 때 기초 모델이 어떤 결과를 생성하는지 확인해 보자. 
예제 6.7의 코드를 실행하면 기초 모델을 불러와 프롬프트에 대한 결과를 생성한다. 
1. 이 코드에서 `make_inference_pipeline` 함수는 입력한 모델 아이디에 맞춰 토크나이저와 모델 을 불러오고 하나의 파이프라인으로 만들어 반환한다. 
2. `make_inference_pipeline` 함수 를 사용해 `beomi/Yi-Ko-6B` 모델로 파이프라인을 만들고 `hf_pipe` 변수에 저장한다
3. example 데이터를 `hf_pipe`에 입력하고 결과를 확인한다. 
예제의 마지막 부분에서 생성된 결과를 보면 요청에 맞춰 SOL은 잘 생성한 것을 볼 수 있다. 
하지만 SOL을 생성한 후에 반복적으로 'SQL 봇, SQL 봇의 결과'와 같이 추가적인 결과를 생성했다. 

이를 통해 기초 모델도 요청에 따라 SQL을 생성할 수 있는 능력이 있지만 형식에 맞춰 답변하도록 하기 위해서는 추가적인 학습이 필요하다는 점을 확인할 수 있다.

`기초 모델로 생성하기`
```python
import torch
from transformers import pipeline

def make_inference_pipeline(model_id): # 1
	tokenizer = AutoTokenizer. from_pretrained(model_id)
	model = AutoModelForCausalLM. from_pretrained(model_id, device_map="auto",
load_in_4bit=True, bnb_4bit_compute_dtype=torch.float16)
	pipe = pipeline "text-generation", model-model, tokenizer=tokenizer)
	return pipe

model_id = 'beomi/Yi-Ko-6B'

hf_pipe = make_ inference_pipeline(model_id) ®

example ="""당신은 SOL을 생성하는 SOL 봇입니다. DDL의 테이블을 활용한 Question을 해결할 수 있는 SOL 쿼리를 생성하세요.

### DDL：

CREATE TABLE players (
	player_id INT PRIMARY KEY AUTO_INCREMENT, 
	username VARCHAR(255) UNIQUE NOT NULL, 
	email VARCHAR(255) UNIQUE NOT NULL, 
	password_hash VARCHAR( 255) NOT NULL, 
	date_joined DATETIME NOT NULL, 
	last_login DATETIME
);

### Question:
사용자 이름에 'admin'이 포함되어 있는 계정의 수를 알려주세요.

### SQL:
"""

hf_pipe(example, do_sample=False,

return_full_text=False, max_length=1024, truncation=True) ®

# SELECT COUNT(*) FROM players WHERE username LIKE '&admin%';

# ## SQL 봇:
# SELECT COUNT(*) FROM players WHERE username LIKE '%admin%';

### SQL 봇의 결과:
# SELECT COUNT(*) FROM players WHERE username LIKE 'Sadmin%'; (02)
```

다음으로 예제 6.8의 코드로 평가 데이터셋에 대한 SQL 생성을 수행하고, GPT-4를 사용해 평가한다. 
1. 먼저, 평가 데이터셋을 `load_dataset` 함수를 사용해 내려받고 `make-prompt` 함수를 사용해 LLM 추론에 사용할 프롬프트를 생성한다. 
2. 다음으로 `hf_pipe`에 생성한 프롬프트를 입력해 SQL을 생성하고 `gen_sqls` 변수에 저장한다. 
3. 마지막으로, `make_requests_for_gpt_evaluation` 함수를 사용해 평가에 사용할 `jsonl` 파일을 만들고 GPT-4 API에 평가 요청을 전달한다

`기초 모델 성능 측정`
```python
from datasets import load_dataset
# 데이터셋 불러오기
df = load_dataset "shangrilar/ko_text2sql", "origin")['test'] # 1
df = df.to_pandas( )
for idx, row in df.iterrows():
	prompt = make_prompt(row[ 'context'], row[' question' ]) # 1
	df.loc[idx, 'prompt'] = prompt
# Sql 생성
gen_sqls = hf_pipe(df[ 'prompt']. tolist(), do_sample=False, return_full_text=False, max_length=1024, truncation=True)

gen_sqls = [x[0]['generated_text'] for x in gen_sqls]
df['gen_sql'] = gen_sqls

# 평가를 위한 requests.jsont 생성
eval_filepath = "text2sql _evaluation.jsonl"
make_requests_for_gpt_evaluation(df, eval_filepath) # 3

# GPT-4 평가 수행
!python api_request_parallel_processor.py \ # 3
	-﻿-requests_filepath requests/{eval_filepath} \
	-﻿-save_filepath results/{eval_filepath} \
	-﻿-request_url https://api.openai. com/v1/chat/completions \
	-﻿-max_requests_per_minute 2500 \
	-﻿-max_tokens_per_minute 100000 \
	-﻿- token_encoding_name cl100k_base \
	-﻿-max_attempts 5 \
	-﻿- logging_level 20
```

기초 모델에 대한 평가를 진행했을 때 112개의 평가 데이터셋 중 21개를 정답으로 판 단했다. 
18.75%의 정답률로 더 발전할 수 있는 여지가 충분히 있어 보인다.

### 미세 조정 수행
기초 모델의 성능을 확인한 결과 아직 더 개선할 여지가 있어 보이기 때문에 이제 준비한 학습 데이터로 미세 조정을 수행해 본다. 
모델의 미세 조정에는 `autotrain-advanced` 라이브러리를 사용한다. 
`autotrain-advanced` 라이브러리는 허깅페이스에서 trl 라이 브러리를 한 번 더 추상화해 개발한 라이브러리다. 
1. 먼저 예제 6.9의 코드를 실행해 학습 데이터를 내려받고 데이터셋에서 평가에 사용하기로 한 `db_id`가 1인 데이터를 제거한다. 
2. 다음으로 `make_prompt` 함수를 사용해 학습에 사용할 프롬프트를 생성하고
3. data 폴더에 저장 한다

`학습 데이터 불러오기`

```python
from datasets import load_dataset

df_sql = load_dataset ("shangrilar/ko_text2sql", "origin" )["train"] # 1
df_sql = df_sql. to_pandas( )
df_sql = df_sql.dropna(). sample(frac=1, random_state=42)
df_sql = df_sql. query("db_id != 1") # 1

for idx, row in df_sql. iterrows():
	df_sql. loc[idx, 'text'] = make_prompt(row[ 'context'], row[ 'question' ], row[ 'answer']) # 3
	
Imkdir data
df_sql.to_csv( 'data/train.csv', index=False) # 4
```

다음으로 autotrain-advanced 라이브러리를 사용해 지도 미세 조정을 수행한다. 
이때 예제 6.10의 코드에서 기초 모델과 미세 조정 모델 이름을 적절히 지정한다. 
데이터 경로는 앞서 학습 데이터를 저장한 data 폴더를 입력하고, 사용할 컬럼은 프롬프트가 저 장된 text 컬럼으로 지정한다. 
학습에 사용할 하이퍼파라미터는 기본적으로 많이 사용 하는 값을 사용했지만 변경할 수 있다. 
설정 인자에 대한 더 자세한 사항은 [autotrain라이브러리의 LLM 미세 조정 코드 링크](https://github.com/huggingface/autotrain-advanced/blob/main/src/autotrain/cli/run Im.py)에서 확인할 수 있다

`미세 조정 명령어`
```python
base_model = ' beomi/Yi-Ko-6B'
finetuned_model = 'yi-ko-6b-text2sql'

!autotrain lim \
-﻿-train \
-﻿-model {base_model} \
-﻿-project-name finetuned_model,
-﻿-data-path data/ \
-﻿- text-column text \
-﻿- lr 2e-4 \
-﻿-batch-size 8 \
-﻿-epochs 1 \
-﻿-block-size 1024 \
-﻿-warmup-ratio 0.1 \
-﻿-lora-r 16 \
-﻿-lora-alpha 32 \
-﻿- lora-dropout 0.05/
-﻿-weight-decay 0.01 \
-﻿-gradient-accumulation 8 \
-﻿-mixed-precision fp16 \
-﻿-use-peft \
-﻿-quantization int4 \
--trainer sft
```
모델 학습 과정에서 메모리 에러가 발생할 경우 batch_size를 줄여서 다시 시도해 보자.

모델 학습에는 구글 코랩 프로의 A100 GPU 기준으로 약 1시간이 소요된다. 
코랩 무료 버전에서 사용할 수 있는 T4 GPU를 사용하는 경우 A100 대비 약 8~10배의 시간이 소요된다(무료 버전의 코랩은 최대 12시간의 실행 시간을 제공한다). 
학습을 마친 후에는 예제 6.11의 코드를 사용해 LORA 어댑터와 기초 모델을 합치고 원한다면 허깅페이스 허브에 모델을 저장한다

`LoRA 어댑터 결합 및 허깅 페이스 허브 업로드`
```python
import torch

from transformers import AutoModelForCausalLM, AutoTokenizer 
from peft import LoraConfig, PeftModel

model_name = base _model
device_map = {"": 0}

# LORA와 기초 모델 파라미터 합치기
base_model = AutoModelForCausalLM. from_pretrained(
	model_name, 
	low_cpu_mem_usage=True,
	return_dict=True, 
	torch_dtype=torch.float 16,
	device_map=device_map,
)
model = PeftModel.from_pretrained(base_model, finetuned_model)
model = model.merge_and_unload()

# 토크나이저 설정
tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
tokenizer.pad_token = tokenizer.eos_token
tokenizer.padding_side = "right"

# 허깅페이스 허브에 모델 및 토크나이저 저장
model.push_to_hub(finetuned_model, use_temp_dir=False)
tokenizer.push_to_hub(finetuned_model, use_temp_dir=False)
```

학습한 모델의 성능을 확인하기 전에 예제 6.12를 통해 앞서 살펴본 예시 데이터에 대 해 다시 SQL을 생성해 보자. 
모델 ID만 새로 업로드한 모델의 정보로 변경하고 동일한 코드를 실행한다. 
예제의 마지막 부분에서 생성한 SQL 쿼리를 보면 정확한 쿼리를 생성 하면서 기초 모델과 달리 SQL 쿼리만 생성한 것을 확인할 수 있다. 

예제 6.7의 결과와 한번 비교해 보자.
`미세 조정한 모델로 예시 데이터에 대한 SQL 생성`
```python
model_id = "shangrilar/yi-ko-6b-text2sql"
hf_pipe = make_inference_pipeline(model_id)

hf_pipe(example, do_sample=False,
	return_full_text=False, max_length=1024, truncation=True)
# SELECT COUNT(*) FROM players WHERE username LIKE 'sadmin%';
```
마지막으로 학습한 모델에 대한 평가를 수행한다. 
예제 6.13에서 평가를 수행하는 부분 은 기초 모델에서 사용한 예제 6.8의 코드와 동일하다.

`미세 조정한 모델 성능 측정`
```python
# sql 생성 수행
gen_sqls = hf_pipe(df[ 'prompt']. tolist(), do_sample=False, return_full_text=False, max_length=1024, truncation=True)

gen_sqls = [x[0][ 'generated_text'] for x in gen_sqls]
df['gen_sql'] = gen_sqls

# 평가를 위한 requests.jsonL 생성
eval_filepath = "text2sql_evaluation_finetuned.jsonl"
make_requests_for_gpt_evaluation(df, eval_filepath)

# GPT-4 평가 수행
!python api_request_parallel_processor.py \
--requests_filepath requests/{eval_filepath} \
-﻿-save_filepath results/{eval_filepath} \
-﻿-request_url https://api.openai.com/v1/chat/completions \
-﻿-max_requests_per_minute 2500 \
-﻿-max_tokens_per_minute 100000 \
-﻿-token_encoding_name cl100k_base \
-﻿-max_attempts 5 \
-﻿- logging_level 20
```

여러 하이퍼파라미터에서 미세 조정을 수행하면서 GPT-4로 성능을 평가하고 정리한 결과는 표 6.1과 같다. 
LoRA 설정 중 랭크(rank)를 의미하는 lora_r과 LoRA 파라미터의 반영 비율을 결정하는 Lora_alpha 값의 변경에 따라 성능이 변화하는 것을 확인할 수 있다.
LoRA 설정과 성능의 관계는 아직 명확하지 않고 데이터셋에 따라 달라지므로 다양한 실험이 필요하다.
![Pasted-image-20250724064710.png](/img/이미지 창고/Pasted-image-20250724064710.png)
### 학습 데이터 정제와 미세 조정
이전 절에서 사용한 학습 데이터는 GPT-3.5 또는 GPT-4로 생성한 원본 데이터이기 때문에 잘못 생성된 데이터가 상당 부분 섞여 있다. 
데이터 품질을 개선했을 때의 효과 를 확인하기 위해 GPT-4를 활용해 SQL이 맥락(Context)과 요청(question)을 바탕으로 잘 생성됐는지 확인하는 필터링을 수행해 봤다. 

필터링한 데이터는 예제 6.14와 같이 불러올 수 있다. 
원본 데이터 대비 약 만 개의 데이터가 삭제됐다.

`필터링한 데이터 불러오기`
```python
clean _dataset = load _dataset( 'shangrilar/ko_text2sql', 'clean') ['train']
```

정제한 데이터셋으로 미세 조정했을 때 결과는 표 6.2와 같다. 
데이터셋 크기가 약 1/4 정도 줄어들었음에도 불구하고 정제 전의 데이터셋으로 학습했을 때와 동일한 성능을 달성한 것을 확인할 수 있다.
![Screenshot-2025-07-24-at-6.48.37-AM.png](/img/이미지 창고/Screenshot-2025-07-24-at-6.48.37-AM.png)

앞서 데이터 정제를 거쳤을 때 데이터셋 크기가 줄었음에도 성능이 동일한 것이 데이터 셋 정제의 긍정적인 효과인지 아니면 원래 데이터셋의 크기가 달라져도 성능에 영향이 없는지 확인하기 위해 데이터셋의 비율을 20%씩 증가시키면서 성능을 확인해 봤다. 
실험은 표 6.2에서 성능이 가장 높았던 `Lora_r = 64`, `Lora_alpha = 128`로 진행했다. 결과는 표 6.3과 같다.

사용하는 데이터셋이 커지면서 성능이 함께 향상되는 것을 확인할 수 있다. 
이 결과를 통해 학습 데이터 정제 과정에서 데이터셋이 줄었음에도 성능이 유지 되는 것이 정제의 긍정적인 효과임을 짐작해 볼 수 있다.
![Pasted-image-20250724064710.png](/img/이미지 창고/Pasted-image-20250724064710.png)
### 기초 모델 변경
이번 절에서는 지금까지 사용한 기초 모델인 `beomi/Yi-Ko-6B`보다 더 크고 성능 면에서 뛰어난 [`beomi/OPEN-SOLAR-KO-10.7B` 모델](https://huggingface.co/beomi/ OPEN-SOLAR-KO-10.7B)을 사용해 동일한 학습을 수행한다. 

이 모델은 업스테이지 Upstage가 공개해 LLM 리더보드 1위를 달성한 [upstage/SOLAR-10.7B-V1.0 모델](https://huggingface.co/upstage/SOLAR-10.7B-V1.0)을 한국어로 확장한 모델로, 2024 년 1월 기준 한국어 LLM 리더보드에서 기초 모델 중 1위를 차지하고 있다. 

이 모델의 경우 이전 실습에서 사용한 `Yi-Ko-6B` 모델에 비해 두 배 가깝게 크기 때문에 학습에 필요한 GPU 메모리, 학습 시간과 추론 시간 모두 약 2배 증가 한다. 
따라서 무료 버전의 구글 코랩에서 학습 결과를 확인하기 어려울 수 있다.

실습은 동일한 코드에서 기초 모델을 설정하는 부분만 예제 6.15와 같이 새로운 모델 아이디로 변경하면 된다.

`SOLAR 모델을 사용한 실습한 변경사항` 
```python
base_model = 'beomi/OPEN-SOLAR-K0-10.7B'
```

`beomi/OPEN-SOLAR-KO-10.7B` 모델의 학습 수행 전후 성능을 정리하면 표 6.4와 같다. 
Lora_r과 Lora_alpha 값은 이전 절에서 가장 성능이 좋았던 64와 128을 사용했다.

하지만 모델과 데이터에 따라 최적의 하이퍼파라미터가 달라질 수 있으므로 Lora_r과 lora_alpha를 변경하면서 실험하면 더 높은 성능의 모델을 만들 수도 있다. 
다른 하이퍼 파라미터에 대한 실험은 연습문제로 남겨둔다. 
SOLAR 모델은 미세 조정 전에는 정답률 38.4%, 미세 조정 후에는 82.1%의 성능을 보였다. 
미세 조정 전과 후 모두 Yi-Ko-6B 모델에 비해 월등히 높은 성능을 달성했다.
![Screenshot-2025-07-24-at-6.52.46-AM.png](/img/이미지 창고/Screenshot-2025-07-24-at-6.52.46-AM.png)
### 모델 성능 비교

지금까지 Yi-Ko-6B 모델에서 데이터 정제 전후에 다양한 하이퍼파라미터로 실험을  행했고 이전 절에서는 기초 모델을 SOLAR모델로 변경해 학습을 시켜봤다. 상업용 모 델과의 성능 비교를 위해 GPT-4로 SQL을 생성하고 같은 방식으로 평가를 수행했을 때 97개(86.6%)의 정답을 맞췄다. 각 모델의 성능을 비교하면 그림 6.8과 같다. Yi-Ko-6B 모델의 경우 학습을 통해 성능이 약 3.71배 향상됐다. SOLAR 모델도 미세 조정 을 통해 약 2.14배 향상됐고 특히 GPT-4와 정답률 4.5% 정도의 격차로 거의 근접했다.

이번 실습의 결과는 기초 모델이 6~10.7B 정도의 작은 모델이고 GPT를 사용해 합성한 데이터셋으로 A100 GPU 기준 1~1.5시간 정도 학습한 것을 고려했을 때 충분히 인상 적인 결과라고 할 수 있다. 또한 일반화 성능을 확인하기 위해 평가 데이터셋의 도메인 을 학습 데이터와 완전히 구분했는데, 실제 Text2SOL. 모델을 학습시킬 때는 같은 도메 인의 테이블과 컬럼을 사용할 것이므로 GPT-4와의 격차는 더 줄어들 수 있다.


## 정리
이번 장에서는 Text2SOL 작업을 위한 SLLM을 학습시키는 실습을 진행했다. 먼저 Text2SOL 작업을 위한 데이터셋을 구축하고 모델의 성능 평가에 사용할 파이프라인을 만들었다. 한국어 기초 모델을 합성 데이터셋으로 미세 조정했는데, 단순히 한 번 미세 조정을 수행한 것이 아니라 성능을 높이기 위한 다양한 실험도 진행했다. 먼저 원본 학 습 데이터셋으로 하이퍼파라미터를 변경하면서 학습시켜서 성능을 확인한 이후 데이터 정제를 추가로 수행하거나 데이터셋의 크기와 기초 모델을 변경하는 실험도 진행했다.

실습에서 다루지는 않았지만 추가로 연습해 볼 수 있는 요소는 이 장 마지막의 추가 연 습문제 절에서 소개한다.

다음 장부터 2개 장에 걸쳐서는 LLM을 더 효율적으로 추론할 수 있는 다양한 기술을 다 룬다. 먼저 7장에서는 성능을 조금 희생하더라도 효율성을 크게 높일 수 있는 방법을 알 아보고, 8장에서는 성능을 그대로 유지하면서 효율성을 높이는 방법을 소개한다.

# 모델 가볍게 만들기

서비스를 위해 LLM을 배포하는 경우 가장 많은 비용은 GPU 사용에서 발생한다. 
그렇기 때문에 GPU를 가능하면 적게 사용해서 비용을 낮춰야 비용 효율적인 서빙을 할 수 있다. 
LLM은 모델의 크기가 기존 딥러닝 모델에 비해 훨씬 크기 때문에 효율적인 서빙이 더 중요하고 관련 연구도 활발히 진행되고 있다. 
GPU를 효율적으로 활용하는 방식 은 모델의 성능을 약간 희생하더라도 비용을 크게 낮추는 방법과 모델의 성능을 그대로 유지하면서 연산 과정의 비효율을 줄이는 방법으로 구분할 수 있다.

이번 장에서는 모델의 성능을 일부 희생하더라도 비용을 크게 낮출 수 있는 방법을 집중적으로 살펴본다. 
이후 8장에서 성능을 그대로 유지하면서 활용할 수 있는 효율적인 연산 방식에 대해 다룬다.

추론 과정에서 어떻게 GPU를 효율적으로 사용하는지 알기 위해 먼저 LLM의 추론 과정 이 어떻게 진행되는지 살펴본다. LLM의 추론에서는 동일한 연산을 반복적으로 수행하면서 한 토큰씩 생성한다. 
이때 발생하는 동일한 연산을 최대한 줄이기 위해 계산 결과 를 저장하는 KV 캐시(KV cache)를 사용한다. 

KV 캐시는 중복 계산을 줄여 추론 속도를 높이는 데 도움을 주지만 계산 결과를 저장해야 하기 때문에 많은 GPU 메모리를 사용한다. 
GPU를 효율적으로 활용하기 위해서는 한 번에 더 많은 데이터를 처리해야 하는데, KV 캐시와 모델 파라미터를 저장하는 데 많은 GPU 메모리를 사용하면 더 많은 데이터를 처리하지 못한다. 
GPU의 구조와 GPU에 저장되는 데이터를 살펴보며 다양한 추론 효율화 방안을 해석하는 데 도움이 되는 '최적의 배치 크기' 개념을 설명한다. 

또한 KV캐시가 사용하는 메모리를 줄이기 위한 멀티 쿼리 어텐션multrquery attention과 그룹 쿼리 어텐션grouped-query attention에 대해 알아본다.

추론 과정을 살펴본 이후에는 모델을 저장할 때 더 적은 메모리를 사용하도록 데이터 타입을 변환하는 양자화에 대해 알아본다. LLM의 양자화에 많이 활용되는 세 가지 양 자화 방식인 비츠앤바이츠BitsAndBytes 라이브러리의 4비트 및 8비트 양자화, GPTQ6PT Quantization 방식, AWQAcivation-aware Weight Quantization를 알아본다.

다음으로 더 크고 성능이 좋은 선생 모델eacher model의 생성 결과를 활용해 더 작고 효율적인 학생 모델(Student model)을 학습하는 지식 종류(kowledge dilstillation) 방법을 알아본다.

챗GPT 공개 이후로 작은 모델의 학습에 SOTA 모델의 생성 결과를 활용하는 방식이 많 이 활용되고 있고 뛰어난 결과를 보여주고 있다. 내용으로 들어가기 전에 다음 명령을 실행해 이번 장에서 사용하는 라이브러리를 설치 하자.

```shell
pip install transformers<mark>4.40.1 accelerate</mark>0.30.0 bitsandbytes<mark>0.43.1 auto-gptq</mark>0.7.1 autoawq<mark>0.2.5 optimum</mark>1.19.1 -qqq
```

설치를 완료했다면 이제부터 시작해 보자.

## 언어 모델 추론 이해하기
### 언어 모델이 언어를 생성하는 방법

언어 모델은 그림 7.1과 같이 입력한 텍스트 다음에 올 토큰의 확률을 계산하고 그중에 서 가장 확률이 높은 토큰을 입력 텍스트에 추가하면서 한 토큰씩 생성한다. 
그림에서 '검은 고양이가 밥을'이라는 텍스트를 입력했을 때, 다음 토큰으로 '그리고'가 올 확률이 0.001, 마시고'가 올 확률은 0.04, '먹고'가 올 확률이 0.9라고 예측했는데, 이럴 때 가 장 확률이 높은 '먹고를 다음 토큰으로 결정하고 입력한 텍스트에 추가해 '검은 고양이 가 밥을 먹고'라는 텍스트를 생성한다. 

언어 모델이 텍스트 생성을 마치는 이유는 두 가 지로 나눌 수 있다. 먼저, 다음 토큰으로 생성 종료를 의미하는 특수 토큰(예: EOSEnd of Sentence 토큰)을 생성하는 경우 생성을 종료한다. 
다음으로 사용자가 최대 길이로 설정 한 길이에 도달하면 더 이상 생성하지 않고 종료한다. 
두 가지 경우에 해당하기 전까지 는 그림 7.1의 순환loop 화살표와 같이 새로운 토큰을 추가한 텍스트를 다시 모델의 입 력으로 넣는 과정을 반복한다.

![Screenshot-2025-08-04-at-9.55.28-PM.png](/img/이미지 창고/Screenshot-2025-08-04-at-9.55.28-PM.png)

앞서 살펴본 대로 언어 모델이 텍스트를 생성할 때는 한 번에 한 토큰씩만 생성할 수 있고 그림 7.2에 나타낸 것처럼 '검은 고양이가 밥을 을 입력했을 때 다음 토큰과 그다음 토큰을 함께 예측할 수는 없다. 
이처럼 언어 모델은 입력 텍스트를 기반으로 바로 다음 토큰만 예측하는 자기 회귀적(auto-regressive) 특성을 갖는다. 
하지만 새롭게 생성하는 부분 이 아니라 언어 모델에 입력하는 '검은 고양이가 밥을' 같은 프롬프트는 이미 작성된 텍 스트이기 때문에 한 번에 하나씩 토큰을 처리할 필요 없이 동시에 병렬적으로 처리할 수 있다. 
따라서 프롬프트가 길다고 하더라도 다음 토큰 1개를 생성하는 시간과 비슷한 시간이 걸린다. 
이런 이유로 추론 과정을 프롬프트를 처리하는 단계 인 사전 계산 단계prefill phase와 이후에 한 토큰씩 생성하는 디코딩 그림 7.2 언어 모델의 자기 회귀적 성질 단계(decodling phase)로 구분한다.

![Screenshot-2025-08-04-at-9.56.28-PM.png](/img/이미지 창고/Screenshot-2025-08-04-at-9.56.28-PM.png)
그림 7.1에서 텍스트를 종료할 때까지 순환하며 반복 생성하는 과정을 풀어서 나타내면 그림 7.3과 같다. 
검은 고양이가 밥을'이라는 프롬프트를 입력하고 검은 고양이가 밥을 먹고 물을 마신다!'라는 문장을 생성할 때까지 네 번의 생성 과정을 반복한다. 
그림 7.3 을 보면 동일한 텍스트가 반복적으로 모델에 입력되는 것을 볼 수 있다. 
예를 들어, '검은, 고양이가, '밥을'은 네 번의 생성 과정에 모두 동일하게 들어가고, '물을'은 두 번째 부터 네 번째까지 세 번의 생성 과정에 들어간다. 
이렇게 동일한 토큰이 반복해서 입력 으로 들어가면 동일한 연산을 반복적으로 수행하기 때문에 비효율적이다. 
그림 7.3에서 는 네 번의 생성만 수행했지만, 수백에서 수천 토큰을 생성한다면 동일한 연산을 수백~ 수천 번 수행 하게 된다.

![Screenshot-2025-08-04-at-9.57.08-PM.png](/img/이미지 창고/Screenshot-2025-08-04-at-9.57.08-PM.png)
우리는 2장에서 트랜스포머 모델의 기반이 되는 셀프 어텐션 연산을 살펴봤다. 
셀프 어텐션 연산은 입력 텍스트에서 어떤 토큰이 서로 관련되는지 계산해서 그 결과에 따라 토큰 임베딩을 새롭게 조정한다. 
이때 관련도를 계산하기 위해 토큰 임베딩을 쿼리, 키, 값 벡터로 변환하는 선형 변환을 수행했다. 
생성 속도를 높이기 위해 동일한 입력 토큰 에 대해서는 키, 값 벡터로의 변환을 반복해서 수행하지 않고 계산 결과를 저장하고 있다가 다시 사용하는 방법을 사용한다. 
이제부터 이런 동작을 수행하는 KV 캐시에 대해 알아보자.

### 중복 연산을 줄이는 KV 캐시
KV 캐시는 셀프 어텐션 연산 과정에서 동일한 입력 토큰에 대해 중복 계산이 발생하는 비효율을 줄이기 위해 먼저 계산했던 키와 값 결과를 메모리에 저장해 활용하는 방법 을 말한다. 
키와 값 계산 결과를 저장하기 때문에 'KV(Key-Value)' 캐시라는 이름을 붙인 것이다. 
KV 캐시를 사용했을 때와 사용하지 않았을 때의 생성 과정을 비교한 그림이 그림7.4이다. 

그림 7.4에서 '검은 고양이가 밥을 을 입력했을 때 다음 토큰으로 '먹고 가 등장 할 확률이 가장 높아 '검은 고양이가 밥을 먹고 를 생성하고 이제 다음 토큰을 예측하는 중이라고 하자. 
KV 캐시를 사용하지 않는 경우 이전에 수행했던 '검은', '고양이가, 밥 을'을 키와 값 벡터로 변환하는 동일한 연산을 반복해야 한다.
하지만 KV 캐시를 사용한 다면 '검은', '고양이가', '밥을' 부분은 KV 캐시에서 계산 결과를 가져와 사용하고, 새로 운 토큰인 '먹고' 부분만 새롭게 연산한다

![Screenshot-2025-08-04-at-9.58.35-PM.png](/img/이미지 창고/Screenshot-2025-08-04-at-9.58.35-PM.png)

더 빠른 텍스트 생성을 위해 KV 캐시를 사용하면 추론을 수행할 때 키와 값에 대한 계산 결과를 메 모리에 저장하기 때문에 GPU 메모리는 그림 7.5와 같이 모델이 차지하는 부분과 KV 캐시가 차지하는 부분으로 크게 나뉜다. 그림에서 13B 모델을 fp16 데이터 형식으로 불러와 모델 파라미터를 저 장하는 데 26GB의 메모리를 사용하고 순전파 연 산에 필요한 메모리(그림의 기타)를 제외한 나머지

기타

NVIDIA A100 40GB

그림 7.5 KV 캐시를 사용하는 경우 GPU

메모리를 차지하는 데이터(출처: https://

arxiv.org/abs/2309.06180)

는 KV 캐시로 사용한다.

그렇다면 KV 캐시를 저장하기 위해 얼마나 많은 메모리가 필요할까? 간단한 형태의 KV 캐시의 메모리 사용량은 다음 계산식을 통해 구할 수 있다.



