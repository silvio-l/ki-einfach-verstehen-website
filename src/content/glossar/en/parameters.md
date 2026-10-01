---
title: 'Parameters'
description: 'The stored, adjustable numerical values a trained model consists of — also called weights.'
translationKey: parameter
---

Parameters (also called weights) are the stored numerical values that a [model's](/en/glossary/model) behavior depends on. A [training algorithm](/en/glossary/training-algorithm) sets them based on training examples, rather than a human deciding each value by hand.

*Mental image: the exact positions of the knobs on a mixing desk.* The number and arrangement of the knobs — the model's **architecture**, or basic construction plan — stay fixed.

More parameters require more memory to store and more computation to use. How many parameters a model has and what that means for memory and hardware is shown in [Parameters, Training vs. Inference, Hardware](/en/lessons/parameters-training-inference-hardware). With 2 bytes per number, every billion parameters needs about 2 gigabytes.

Introduced briefly in [Program, Algorithm, Model Compared](/en/lessons/program-algorithm-model)
