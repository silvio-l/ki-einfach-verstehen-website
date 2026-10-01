---
title: 'Model'
description: 'A calculation whose behavior additionally depends on stored, trained numerical values (parameters).'
translationKey: modell
---

A model is a calculation whose behavior additionally depends on stored numerical values — its [parameters](/en/glossary/parameters). A [training algorithm](/en/glossary/training-algorithm), meaning a fixed sequence of steps for learning from examples, sets those values; no human decides them one by one.

*Mental image: a mixing desk with a huge number of knobs.* The number and arrangement of the knobs (the model's **architecture**, or basic construction plan) are fixed. Their exact positions (the parameters) only emerge from training.

Once trained, a model behaves like a [program](/en/glossary/program) again in operation: it takes an input and produces an output.

**An example:** A simple spam filter stores a weight for every word, say +3 for “prize” and −2 for “invoice” (made-up values). For each email, it adds up the weights of its words and compares the sum with a threshold. That calculation says nothing about spam. Which words are suspicious lives in the numbers alone. Change one and the filter decides differently.

**Not to be confused with a rulebook:** In a classic program, you can find the line that triggered a decision and change it. A trained model has no such line, only numbers. In large models there are so many that no single parameter means anything you could put into words.

**Where you'll come across it:** In chat apps, where you can often choose between different models, in news about new model versions, and on product pages that name the model behind a feature. A [language model](/en/glossary/language-model) is a model trained specifically on text.

Explained in more depth in [Program, Algorithm, Model Compared](/en/lessons/program-algorithm-model).
