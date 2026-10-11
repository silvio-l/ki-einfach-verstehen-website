---
title: 'Training algorithm'
description: "The fixed procedure applied to training examples that adjusts a model's parameters step by step."
translationKey: trainingsalgorithmus
---

A training algorithm is a fixed sequence of steps applied to training examples. It produces something new from them: the [parameters](/en/glossary/parameters) of a [model](/en/glossary/model). Unlike many other [algorithms](/en/glossary/algorithm), what comes out isn't a finished answer, but a set of adjusted numerical values.

*Mental image: a work plan for a mixing desk. In many small steps, the training examples adjust the controls. The positions saved at the end are the parameters; with the fixed wiring, they make up the model.* The limit of the picture: a real model has billions of controls; most have no nameable task, and nobody sets them by hand.

**An example:** In a [spam filter](/en/glossary/spam-filter), all weights start at zero. The training algorithm has the filter rate a labeled email and compares its answer with the label. If the filter lets “Free: your prize is waiting” through despite its spam label, the weights of “free” and “prize” move up a little, so that a similar email's sum is more likely to cross the threshold next time. Then the next example follows, thousands of times in a row.

**Not to be confused with the model's own fixed calculation:** A spam filter involves two procedures. One rates an email: add up the weights, compare with the threshold. The training algorithm is the other one. It sets the numbers the first one uses and runs only during training. After that, the parameters stay fixed, and in use ([inference](/en/glossary/inference)) the model calculates only with them.

**Where you'll come across it:** Rarely by name. It usually sits behind phrases like “the model was trained on lots of examples” or “the AI has learned”.

Explained in more depth in [Program, Algorithm, Model Compared](/en/lessons/program-algorithm-model).
