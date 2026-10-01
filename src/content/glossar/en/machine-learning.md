---
title: 'Machine learning'
description: "The umbrella term for methods where a training algorithm sets a model's parameters from examples, instead of a human writing decision rules by hand."
translationKey: maschinelles-lernen
---

Machine learning is the umbrella term for methods where a [training algorithm](/en/glossary/training-algorithm) sets a [model](/en/glossary/model)'s [parameters](/en/glossary/parameters) from examples — instead of a human writing the rules a decision is based on by hand, in code.

The name is a little misleading: a model doesn't "learn" in the human sense. A mathematical optimization process adjusts its parameters step by step so that its errors on the training examples become smaller. Exactly how that process works is the topic of a later, dedicated part of the site.

**An example:** A spam filter stores a number, a weight, for every word. It's trained on thousands of emails people have marked as spam or normal mail. Whenever the filter gets an example wrong, the training algorithm nudges the weights involved a small step in the direction that shrinks the error. In the end, typical advertising words have high values, without anyone writing down “prize is suspicious”.

**Not to be confused with AI as a whole:** [AI](/en/glossary/ai) is the broader term. Systems built from hand-written rules, such as early [expert systems](/en/glossary/expert-systems), count as AI too. Machine learning is the part of AI where behavior comes from examples. And learning only happens during training: a finished model stays unchanged in use until someone retrains it.

**Where you'll come across it:** In reporting on AI, in job ads, often abbreviated as ML, and on product pages for software that “learns” or “adapts”. Spam filters and recommendations on streaming services usually rely on a model trained this way, too.

Explained in more depth in ["Program, Algorithm, Model Compared"](/en/lessons/program-algorithm-model).
