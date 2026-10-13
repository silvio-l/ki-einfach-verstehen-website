---
title: 'Reversal curse'
description: 'The finding that a model often does not answer in reverse a relationship it learned during training.'
translationKey: reversal-curse
---

The reversal curse is a finding by Berglund and colleagues (2024): a model that learned “A is B” during training often does not answer the question “What is B?” or “Who is B?”. The reversal is missing, although it follows logically. In their experiment, the authors fine-tuned two language models, GPT-3 (from OpenAI) and Llama-1 (from Meta), with additional training on invented facts. For those invented facts, the hit rate in the reversal was no better than guessing.

**An example (made up):** Training contains: “Frau Berger is the mother of Jonas.” If you ask who the mother of Jonas is, the model can often answer correctly. If you ask the reverse, whose mother Frau Berger is, it often fails. The information is the same, only the direction changes.

**Not to be confused with missing logic:** If the same sentence stands in the conversation itself, that is, in your message to the model, it can derive the reversal. The finding therefore concerns what the model learned in training, not what it can infer from a text in the conversation. For parents of well-known people, Berglund and colleagues measured for GPT-4 79 percent correct answers to the question about the parent and 33 percent to the reverse question about the child. Whether GPT-4 has seen such pairs in training is unknown, because its training data are not known. The figures are therefore only a hint, not proof. The authors suspect that the model is tuned to protect private individuals and that the figure underestimates its ability.

**Where you will meet the term:** In research since 2023, and in the debate about chatbots getting facts wrong. The finding is in the lesson [Does AI understand what it says?](/en/lessons/does-ai-understand-what-it-says).
