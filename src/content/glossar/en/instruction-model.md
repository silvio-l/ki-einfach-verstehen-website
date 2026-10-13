---
title: 'Instruction Model'
description: 'A model that results from post-training and is meant to follow instructions and react to questions with answers.'
translationKey: instruktionsmodell
---

An instruction model is the result of [post-training](/en/glossary/post-training), and it is meant to follow instructions. The name describes this goal: the model is meant to follow instructions that stand before it as text. It comes from the same [base model](/en/glossary/base-model), which was trained further with other examples and a different rating. The parameters are adjusted step by step in the same way, but the error is determined differently, as described under post-training.

**An example:** In the 2022 paper, the base model GPT-3 continued a task with further tasks. The result of post-training, InstructGPT, was preferred by the contractors over the answers of GPT-3 on a test set of prompts from held-out API customers who were not part of the training data, although it was clearly smaller with 1.3 billion [parameters](/en/glossary/parameters). What was measured was the preference in this test, not performance in all tasks. Exactly this adjustment to instructions is the goal of post-training.

**Not to be confused with every chat model:** Not every model that answers in a chat is an instruction model in the same sense. The term describes the goal of post-training, not the exact methods of a particular provider. The word also says nothing about whether an answer is correct.

**Where you’ll come across it:** In model names with an addition such as “Instruct”, for example Qwen2.5-7B-Instruct, and in descriptions of post-training.

Introduced in [From Text Predictor to Assistant: What Post-Training Makes of a Model](/en/lessons/from-text-predictor-to-assistant).
