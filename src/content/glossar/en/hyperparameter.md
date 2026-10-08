---
title: 'Hyperparameter'
description: 'Settings that people fix before a training run begins, such as the learning rate or the size of the model. Training itself does not change them.'
translationKey: hyperparameter
---

Hyperparameters are settings that people fix before a training run begins. They include values that shape the blueprint, such as the number of computing stages, the size of the [vocabulary](/en/glossary/vocabulary) or the [context window](/en/glossary/context-window), and values that steer training, such as the [learning rate](/en/glossary/learning-rate).

Unlike the [parameters](/en/glossary/parameters), hyperparameters are not trained. Experts often find suitable values by comparing several training runs with different values.

**An example:** Before training GPT-2, its developers decided that its context window would hold 1024 tokens, twice as many as its predecessor’s. That Llama 3.1 8B has about eight and not nine billion parameters is a decision of the same kind. Training sets the faders, but it builds no new desk: how many faders there are is fixed beforehand.

**Not to be confused with settings you choose when using a model:** A language model’s [temperature](/en/glossary/temperature) is set only when the model is used, anew for every request, and leaves the model unchanged. Some people still count it as a hyperparameter. The more important difference: a training setting like the learning rate acts only during training and leaves its traces in the parameters.

**Where you'll come across it:** In research papers and technical reports on new models, which usually list their hyperparameters or put them in a table. The GPT-3 paper, for example, gives the number of layers, the context window and the learning rate. For openly available models, the blueprint’s hyperparameters sit in a small configuration file next to the weight files.

Introduced in [Parameters, Training and Inference: How a Model Learns](/en/lessons/parameters-training-inference-hardware).
