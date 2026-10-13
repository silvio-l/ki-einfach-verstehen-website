---
title: 'Reward Model'
description: 'A model that learns to predict which of several answers people prefer, and gives each answer a number as its rating.'
translationKey: belohnungsmodell
---

A reward model is a [model](/en/glossary/model) that learns to predict which of several answers people prefer. For every new answer it outputs a number as its rating. In [post-training](/en/glossary/post-training) it sits between the rankings made by people and the model that is to be improved afterwards.

**An example:** In the InstructGPT paper, contractors sorted between four and nine answers to a question by helpfulness. From these rankings the reward model learned which answer a person would prefer. What it learns is therefore a comparison: the answer ranked higher is the preferred one. The team used about 33,000 [prompts](/en/glossary/prompt) for this. Afterwards the reward model can rate new answers with a number, without anyone reading the answer.

**Not to be confused with a judgement at the moment of the answer:** The reward model is itself a model. It imitates the judgements that were collected beforehand, and it does not read along while you receive an answer. So the number measures what was preferred in the collected rankings. It does not measure whether an answer is correct.

**Where you’ll come across it:** In descriptions of post-training, for example in RLHF or in the InstructGPT paper.

Introduced in [From Text Predictor to Assistant: What Post-Training Makes of a Model](/en/lessons/from-text-predictor-to-assistant).
