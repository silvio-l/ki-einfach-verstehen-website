---
title: 'Base Model'
description: 'A model after pretraining that has only learned to continue text and is not yet post-trained for conversations.'
translationKey: grundmodell
---

A base model is a [model](/en/glossary/model) after pretraining, but before chat training. It has learned to predict the next piece of a text, and it is not set up for questions. So on a question it often writes further questions, because in texts a next question often follows a question.

**An example:** In the OpenAI paper from 2022, GPT-3 with 175 billion [parameters](/en/glossary/parameters) was given the task of writing a short story in French. GPT-3 wrote no story, but three further tasks of the same kind (arXiv:2203.02155v1, Figure 8, p. 15). The legend says the examples were chosen; for a code question, GPT-3 answered only in about half of the cases. You can picture it as a copy clerk who writes on a half-finished document: she follows the pattern that is common in such documents, and often does not answer the task.

**Not to be confused with a chat model:** A chat model comes about when the base model is post-trained afterwards so that it follows instructions. The model card of Qwen2.5-7B calls the model “the base 7B Qwen2.5 model” and speaks generally of “base language models”. This text uses base model, because the term fits pretraining. A base model is therefore not broken; it has only learned a different goal.

**Where you’ll come across it:** In model cards that advise against using a model for conversations and recommend post-training instead.

Introduced in [From Text Predictor to Assistant: What Post-Training Makes of a Model](/en/lessons/from-text-predictor-to-assistant).
