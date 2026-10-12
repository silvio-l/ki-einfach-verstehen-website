---
title: 'Batch'
description: 'A batch is a set of examples in training, averaged into one error number; in inference, many requests computed together.'
translationKey: batch
---

In training, a batch is a set of examples that run through the [model](/en/glossary/model) together. All their predictions become a single number, the [loss](/en/glossary/loss) of the batch. Then the [training algorithm](/en/glossary/training-algorithm) adjusts the [parameters](/en/glossary/parameters) once, and the next batch comes up.

In language models, a batch consists of many text sequences. Every position of every sequence delivers its penalty points, and the average over all positions of all sequences is the loss. Because the average counts and not the sum, large and small batches stay comparable.

**An example:** For the largest GPT-3 model, a language model released by the company OpenAI in 2020 with 175 billion parameters, the research paper reports a full batch of 3.2 million tokens; at the start the batch was much smaller (32,000 tokens) and grew to that value over the first billions of tokens. 

**Not to be confused with a batch in inference:** When a chatbot is running, batch means something else. There, the data center computes the requests of many people together, and how large that batch is depends on how many are asking at the same moment. There is no label, no loss and no change to the parameters.

**Where you come across the term:** Reports on training large models often list the batch size in a table next to the number of parameters, sometimes in tokens, sometimes in text sequences. In guides to training a model yourself, the setting is usually called “batch size.”

Introduced in [Forward Pass and Loss: How the Model Measures Its Own Error](/en/lessons/forward-pass-and-loss).
