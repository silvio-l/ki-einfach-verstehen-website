---
title: 'Post-Training'
description: 'The second training after pretraining, which uses examples written or rated by people to teach a model answers that fit a conversation.'
translationKey: nachtraining
---

Post-training is a second training that comes after pretraining. It works with examples that people have written or rated, and it teaches the model which kind of answer fits. A [base model](/en/glossary/base-model) becomes, through it, a model that follows instructions.

**An example:** The InstructGPT paper from 2022 describes the method in three steps. First, the team trained the model with sample answers to about 13,000 [prompts](/en/glossary/prompt). Then a [reward model](/en/glossary/reward-model) learned from rankings of several answers; for this it used about 33,000 prompts. In the third step, the model was adjusted against this reward model, with about 31,000 prompts from the provider’s API. The result is called an [instruction model](/en/glossary/instruction-model).

**Not to be confused with pretraining:** Post-training also adjusts the [parameters](/en/glossary/parameters) step by step, but the error is determined differently. In pretraining the goal was the next piece of text; in post-training it is sample answers and rankings. The rankings train a reward model that compares two answers, and in the third step the model is optimised with reinforcement learning against its rating. Post-training therefore does not replace pretraining; it builds on it.

**Where you’ll come across it:** In model cards and papers that describe methods such as SFT or RLHF. There, further post-training of a base model before its use in conversations is recommended.

Introduced in [From Text Predictor to Assistant: What Post-Training Makes of a Model](/en/lessons/from-text-predictor-to-assistant).
