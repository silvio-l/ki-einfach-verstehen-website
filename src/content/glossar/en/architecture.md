---
title: 'Architecture'
description: 'The blueprint of a model: what is computed with the numbers and how many parameters there are for it, regardless of their values.'
translationKey: architektur
---

The architecture is the blueprint of a [model](/en/glossary/model). It determines what is computed, in what order, and how many [parameters](/en/glossary/parameters) there are for it. The values of those parameters are not part of it: training sets them. Two models with the same architecture can therefore behave very differently.

For openly available language models, a small configuration file names the type of build and its dimensions, and the parameters sit in large files next to it.

*Mental image: the mixing desk itself, with the number of its faders and how they are wired* — the fader positions are the parameters.

**An example:** Meta’s language model Llama 3.1 8B comes in two versions. The base version has only been through basic training: predicting the next piece of text. The Instruct version was then trained further so that it responds to questions and instructions like a chatbot. Both have the same architecture and exactly as many parameters. Only the values differ: same desk, different fader positions.

**Not to be confused with the whole model:** An architecture alone does nothing useful; only with trained parameters does it make a model. Nor is it the same as the software that loads a model: the configuration file merely names the blueprint, and the software carries out the computation.

**Where you'll come across it:** On the download pages of open models, such as on Hugging Face, where the configuration file lists dimensions like the number of computing stages or the [vocabulary](/en/glossary/vocabulary) size. News about new models also uses the term for a model’s basic design.

Introduced in [Parameters, Training vs. Inference, Hardware: How a Model Runs](/en/lessons/parameters-training-inference-hardware).
