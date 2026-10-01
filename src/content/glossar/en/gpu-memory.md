---
title: 'GPU memory'
description: 'The fast memory right next to a graphics chip, also called VRAM. For a model to run quickly, its parameters must fit into it.'
translationKey: grafikspeicher
---

GPU memory (often called VRAM) is the fast memory right next to a graphics chip. The chip computes fastest with numbers stored there. For a model to run quickly, all its [parameters](/en/glossary/parameters) must therefore fit into it. If a model does not fit on one chip, it is spread across several.

Rule of thumb: billions of parameters times bytes per number gives at least the memory needed in gigabytes; with 2 bytes per number, that is twice the parameter count.

**An example:** A gaming graphics card like the GeForce RTX 4090 has 24 gigabytes of GPU memory. Llama 3.1 8B needs about 16 gigabytes at 2 bytes per parameter, so it fits. The largest version, Llama 3.1 405B, comes to about 810 gigabytes. Even a data-center chip like Nvidia’s H100 holds only 80 gigabytes in its common version, so this model needs several chips. The first limit is space, not speed.

**Not to be confused with RAM:** A computer’s or phone’s main memory (RAM) is shared by the system and all apps. A phone has no GPU memory of its own, so a model there must fit into that shared memory. The storage where the model file is saved doesn’t count either: computing starts only once the numbers are loaded into fast memory.

**Where you'll come across it:** On spec sheets for graphics cards, usually listed as “VRAM” in gigabytes. And wherever you read about running a language model on your own computer, where it decides which model sizes are possible. [Quantization](/en/glossary/quantization) can shrink the requirement.

Introduced in [Parameters, Training vs. Inference, Hardware: How a Model Runs](/en/lessons/parameters-training-inference-hardware).
