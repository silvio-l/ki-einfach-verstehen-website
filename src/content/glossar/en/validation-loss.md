---
title: 'Validation loss'
description: 'The loss on held-out text that is never trained on, showing whether a model learns patterns rather than particulars.'
translationKey: validierungs-loss
---

The validation loss is the loss on a held-out text that is set aside before training. This text never goes into training, and no [parameter](/en/glossary/parameters) is ever adjusted on it. At regular intervals the model predicts it, and the loss on it shows how well the model copes with text it does not know.

**An example:** A tiny character model learns from the first 4,000 characters of Kafka’s “The Metamorphosis”, and the last tenth of the story is the held-out text. After nine epochs the validation loss is at its lowest; after that it rises again, even though the training loss keeps falling. With almost the whole story as training text, both values stay close together.

**Not to be confused with the training loss:** The training loss measures how well the model predicts exactly the texts it is learning from. It falls even when the model only adapts to their quirks. Only comparing both curves reveals [overfitting](/en/glossary/overfitting). To keep the held-out text truly unknown, copies of it are removed from the [training data](/en/glossary/training-data) beforehand.

**Where you'll come across it:** In training logs and charts, often as “val loss” or “eval loss” next to “train loss”. In research papers on language models, it is the measure that shows whether a larger model or more text helps.

Introduced in [Batch, Epoch, Step, Token Budget: How Training Progress Is Measured](/en/lessons/batch-epoch-step-token-budget).
