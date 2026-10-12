---
title: 'Self-supervised learning'
description: 'Training in which the answers are already in the data: for a language model, the next token in the text is the answer to every problem.'
translationKey: selbstueberwachtes-lernen
---

Self-supervised learning is a way of training in which nobody has to write down answers, because they are already in the data. A [language model](/en/glossary/language-model) learns this way in its pretraining: every beginning of a text is a question; the [token](/en/glossary/token) that follows is the answer. Think of a cover card laid over a line of text, showing only the start. Unlike a reader, the model does not guess one word after another; it works through all positions in one pass and keeps no answer, it nudges its numbers. A text of 12 tokens therefore yields 11 practice problems, one fewer than it has tokens. Because this holds for every text, trillions of tokens become trillions of problems.

**An example:** In the sentence “The bus leaves again on time”, one problem is “The bus leaves again on”, and its answer is “time”. For this position the model names a guess, which is compared with “time”, and training adjusts the [parameters](/en/glossary/parameters) a little so that “time” becomes more likely next time.

**Not to be confused with learning without answers:** Here, too, every problem has a correct answer, the [label](/en/glossary/label). It just does not come from people but from the text itself. With a spam filter, by contrast, people mark every email by hand. Fine-tuning a chatbot on answers people wrote or rated is not self-supervised learning either.

**Where you'll come across it:** In reports on the pretraining of large language models, and in teaching material on machine learning, often next to supervised and unsupervised learning.

Introduced in [Text Becomes Many Practice Problems](/en/lessons/text-becomes-many-practice-problems).
