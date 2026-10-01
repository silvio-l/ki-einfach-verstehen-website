---
title: 'GPU memory'
description: 'The fast memory right next to a graphics chip, also called VRAM. For a model to run quickly, its parameters must fit into it.'
translationKey: grafikspeicher
---

GPU memory (often called VRAM) is the fast memory right next to a graphics chip. The chip computes fastest with numbers stored there. For a model to run quickly, all of its [parameters](/en/glossary/parameters) must therefore fit into it. If a model does not fit on one chip, it is spread across several.

Rule of thumb: billions of parameters times bytes per number gives at least the memory needed in gigabytes; with 2 bytes per number, that is twice the parameter count.

Introduced in [Parameters, Training vs. Inference, Hardware: How a Model Runs](/en/lessons/parameters-training-inference-hardware).
