---
title: 'Overfitting'
description: 'A model adapts to individual training examples instead of what they have in common, and gets worse on data it does not know.'
translationKey: ueberanpassung
---

Overfitting means a model adapts to individual training examples instead of to what they have in common. It keeps getting better on the examples it knows and worse on ones it does not. Two curves show it: the training loss keeps falling while the [validation loss](/en/glossary/validation-loss) rises again.

**An example:** A [spam filter](/en/glossary/spam-filter) is trained on only a few dozen ad emails, which all happened to arrive on a Tuesday. It may then learn that Tuesday is suspicious and sort out harmless emails from that day. With many different examples, a coincidence like that loses its weight.

**Not to be confused with knowing the held-out text by heart:** A low validation loss does not mean the model knows the held-out text. It has never seen it and predicts it well because the patterns from the [training data](/en/glossary/training-data) also hold there. Overfitting is a risk above all when little text is repeated for many [epochs](/en/glossary/epoch). More varied text pushes it back.

**Where you'll come across it:** It turns up in introductions to [machine learning](/en/glossary/machine-learning), often with a chart of two curves drifting apart. In the GPT-3 research paper, the authors write that they accepted a small amount of overfitting in exchange for repeating high-quality sources more often.

Introduced in [Batch, Epoch, Step, Token Budget: How Training Progress Is Measured](/en/lessons/batch-epoch-step-token-budget).
