---
title: 'Training algorithm'
description: "The fixed procedure applied to training examples that adjusts a model's parameters step by step to reduce its errors."
translationKey: trainingsalgorithmus
---

A training algorithm is a fixed sequence of steps applied to training examples. It produces something new from them: the [parameters](/en/glossary/parameters) of a [model](/en/glossary/model). Unlike many other [algorithms](/en/glossary/algorithm), the result here isn't an immediately readable answer, but numerical values adjusted step by step to reduce the model's errors.

*Mental image: a work plan for a mixing desk. Across many small steps, the controls are adjusted using the training data. The control positions saved at the end are the model.*

**An example:** In a [spam filter](/en/glossary/spam-filter), all weights start at zero. The training algorithm has the filter rate a labeled email and compares its answer with the label. If the filter lets “Free: your prize is waiting” through despite its spam label, the weights of “free” and “prize” move up a little. Then the next example follows, thousands of times.

**Not to be confused with the model's own calculation rule:** A spam filter involves two procedures. One rates an email: add up the weights, compare with the threshold. The training algorithm is the other one. It sets the numbers the first one uses and runs only during training. After that, the parameters stay fixed, and in use ([inference](/en/glossary/inference)) the model calculates only with them.

**Where you'll come across it:** Rarely by name. It usually sits behind phrases like “the model was trained on lots of examples” or “the AI has learned”. Dig deeper and you'll meet settings such as the [learning rate](/en/glossary/learning-rate), which sets how strongly each step adjusts the parameters.

Explained in more depth in [Program, Algorithm, Model Compared](/en/lessons/program-algorithm-model).
