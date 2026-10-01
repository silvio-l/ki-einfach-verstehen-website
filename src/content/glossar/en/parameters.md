---
title: 'Parameters'
description: 'The stored, adjustable numerical values a trained model consists of — also called weights.'
translationKey: parameter
---

Parameters (also called weights) are the stored numerical values that a [model's](/en/glossary/model) behavior depends on. A [training algorithm](/en/glossary/training-algorithm) sets them based on training examples, rather than a human deciding each value by hand.

*Mental image: the exact positions of the faders on a mixing desk.* The number and arrangement of the faders (the model's **architecture**, or basic construction plan) stay fixed.

How many parameters a model has and what that means for memory and hardware is shown in [Parameters, Training vs. Inference, Hardware](/en/lessons/parameters-training-inference-hardware). With 2 bytes per number, every billion parameters needs about 2 gigabytes.

**An example:** A simple [spam filter](/en/glossary/spam-filter) stores a number for every word, with made-up values such as +3 for “prize” and −2 for “invoice”. For each email it adds up the numbers of the words that appear and compares the sum with a threshold. Those numbers are its parameters. Change a single one and the filter decides differently, without a single line of program code changing.

**Not to be confused with hyperparameters:** [Hyperparameters](/en/glossary/hyperparameter) are fixed by people before training, such as how many parameters there are in the first place. Only training sets the parameters themselves. And no single parameter is a readable rule: no sentence or fact appears in the numbers as plain text.

**Where you'll come across it:** Often right in a model's name. The “8B” in Llama 3.1 8B stands for 8 billion parameters. News about new AI models also frequently gives the parameter count as a measure of size. If you download a model, you get the parameters as large weight files.

Introduced briefly in [Program, Algorithm, Model Compared](/en/lessons/program-algorithm-model).
