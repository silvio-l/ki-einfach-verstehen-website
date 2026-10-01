---
title: 'Quantization'
description: 'Storing a model’s parameters with fewer bits, that is, rounding them more coarsely, so that the model needs less memory.'
translationKey: quantisierung
---

Quantization stores a model’s [parameters](/en/glossary/parameters) with fewer bits than usual, typically below the 16 bits of the published version, so they are rounded more coarsely. A bit is the smallest yes-or-no unit of memory, and a byte has 8 of them. With 8 instead of 16 bits, the memory needed halves; with 4 bits, it shrinks to a quarter. This lets models fit on devices with little [GPU memory](/en/glossary/gpu-memory) or on a phone.

Coarser numbers can cost some accuracy, depending on the method and the number of bits: at 8 bits the loss is often barely measurable; the fewer bits, the more quality tends to suffer.

**An example:** Apple runs a language model with about 3 billion parameters directly on some phones. At 2 bytes per number it would need about 6 of a phone’s 8 gigabytes of memory. So Apple stores most numbers with just 2 bits, an eighth of the size. That brings it to just over three quarters of a gigabyte.

**Not to be confused with a smaller model:** A quantized model has exactly as many parameters as before. No fader is missing; each position is just written down with fewer digits. A model with fewer parameters is a different, smaller desk with its own training.

**Where you'll come across it:** On download pages that offer the same openly available model with different numbers of bits. In programs for running language models on your own computer, and in news about AI that runs on a phone or laptop rather than in a data center.

Introduced in [Parameters, Training vs. Inference, Hardware: How a Model Runs](/en/lessons/parameters-training-inference-hardware).
