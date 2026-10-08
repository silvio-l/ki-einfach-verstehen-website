---
title: 'Inference'
description: 'Using a fully trained model: with its fixed parameters, it computes an output from an input.'
translationKey: inferenz
---

Inference means using a fully trained [model](/en/glossary/model). It receives an [input](/en/glossary/input) and computes an [output](/en/glossary/output) with its fixed [parameters](/en/glossary/parameters). For a language model, every answer to a [prompt](/en/glossary/prompt) is inference.

Unlike in training, nothing is compared and no parameter is adjusted. That is why inference needs far less computing time and memory per request than training does.

*Mental image: the concert after the sound check* — the faders stay put, and the desk processes whatever comes in.

**An example:** A trained [spam filter](/en/glossary/spam-filter) receives a new email and computes a verdict with its weights: spam or inbox. The weights stay unchanged. The same goes for a chatbot: it produces its answer to your question one text piece at a time, and for every piece it computes with the same parameters as for every other request.

**Not to be confused with learning during a conversation:** A chatbot does not learn while you chat with it. During inference, no parameter moves, whatever you type. Whatever it “remembers” within a conversation is sent along as input with every message. And “inference” here does not mean drawing a logical conclusion; it simply means using the model.

**Where you'll come across it:** With providers of AI services, who often bill the use of their models by [tokens](/en/glossary/token). In news about data centers and AI chips that distinguishes hardware for training from hardware for inference. A single request is cheap, but because millions of people ask questions, inference as a whole also needs large data centers.

Introduced in [Parameters, Training and Inference: How a Model Learns](/en/lessons/parameters-training-inference-hardware).
