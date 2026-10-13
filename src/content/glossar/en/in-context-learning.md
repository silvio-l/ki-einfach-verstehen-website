---
title: 'In-Context Learning'
description: 'A model picks up a pattern from examples in its input, without its weights changing.'
translationKey: in-context-lernen
---

With in-context learning, the [prompt](/en/glossary/prompt) states a task and usually includes a few examples. The model then solves a new task in the same pattern. Its [parameters](/en/glossary/parameters) do not have to change for this. The examples affect only that one input.

**An example:** You explain an invented word rule in three sentences, showing how a verb becomes a counting word, and then ask for a fourth word. If the model forms it correctly, it has taken the pattern from the [input](/en/glossary/input). It has not learned the rule during training.

**Not to be confused with post-training:** Post-training changes the weights after pretraining. With in-context learning, the weights stay the same. Whether a chat service stores anything extra is a separate question.

**Limits of the claim:** The evidence comes from a 2020 measurement on GPT-3 and a limited set of tasks. It is not a law that holds for every model.

The concept is introduced in [Why Prediction Is More Than Parroting](/en/lessons/why-prediction-is-more-than-parroting).
