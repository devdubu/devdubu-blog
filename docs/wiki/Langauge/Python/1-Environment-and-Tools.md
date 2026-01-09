---
slug: "1-Environment-and-Tools"
title: "1. 환경 설정 및 도구 (Environment & Tools)"
---

# 환경 설정 및 도구

:::info 개요
Python 개발을 위한 **Anaconda** 가상환경 관리와 **Jupyter Notebook** 설치 및 사용법을 다룹니다.
:::

## 1. Anaconda (Conda)

### 1.1 설치
[Anaconda 공식 홈페이지](https://www.anaconda.com/download)에서 OS에 맞는 버전을 다운로드하여 설치합니다.

### 1.2 주요 명령어

```bash
# 가상환경 생성 (python 3.9 버전)
conda create -n myenv python=3.9

# 가상환경 활성화
conda activate myenv

# 가상환경 비활성화
conda deactivate

# 가상환경 목록 확인
conda env list

# 가상환경 삭제
conda env remove -n myenv
```

---

## 2. Jupyter Notebook

웹 브라우저에서 파이썬 코드를 작성하고 실행할 수 있는 대화형 도구입니다. 데이터 분석 및 시각화에 널리 사용됩니다.

### 2.1 설치

```bash
# pip를 이용한 설치 (Conda 미사용 시)
pip install jupyter

# Conda를 이용한 설치 (권장)
conda install jupyter
```

### 2.2 실행
터미널에서 아래 명령어를 입력하면 브라우저가 실행됩니다.

```bash
jupyter notebook
```
