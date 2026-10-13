---
title: 'Memorization'
description: 'When a model has learned a training text so well that it can later reproduce it word for word.'
translationKey: memorierung
---

Memorization means that a [model](/en/glossary/model) has learned a training text so that it later reproduces it word for word or almost word for word. It is a special case of learning, not a separate store: the model holds no text file, but its [parameters](/en/glossary/parameters) can be set so that a continuation fits one particular sentence exactly.

Memorization is not always harmful. Common phrases or formulas should be reproducible word for word. It becomes a problem with texts that may not be freely reused, and with names, phone numbers or addresses.

**An example:** A poem appears on several web pages. A model that has seen it many times can continue the next lines word for word when it is given the first ones.

**Not to be confused with a copy:** Memorization is not the same as a stored file. Whether it legally counts as a reproduction is an open question that courts will decide. For the assessment, it helps to separate collecting the texts, training and the model's answer.

**Where you'll come across it:** In research on [training data](/en/glossary/training-data), in court cases about AI training, and in reports on whether a model can disclose personal details.

Introduced in “[Training Data: Copyright and Privacy](/en/lessons/training-data-copyright-and-privacy)” in the section on the model. How the parameters get their settings is explained in “[What an AI Model Actually Is](/en/lessons/what-an-ai-model-actually-is)”.
