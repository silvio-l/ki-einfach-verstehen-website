---
title: 'Quantization'
description: 'Storing a model’s parameters with fewer bits, that is, rounding them more coarsely, so that the model needs less memory.'
translationKey: quantisierung
---

Quantization stores a model’s [parameters](/en/glossary/parameters) with fewer bits than in training, which means rounding them more coarsely. With 8 instead of 16 bits, the memory needed halves; with 4 bits, it shrinks to a quarter. This lets models fit on devices with little [GPU memory](/en/glossary/gpu-memory) or on a phone.

More coarsely rounded numbers can cost some accuracy. How much depends on the method; good methods lose very little.

Introduced in [Parameters, Training vs. Inference, Hardware: How a Model Runs](/en/lessons/parameters-training-inference-hardware).
