---
title: 'Training data'
description: "The examples a training algorithm is applied to in order to set a model's parameters, such as labeled emails or large amounts of text."
translationKey: trainingsdaten
---

Training data is the set of examples a [training algorithm](/en/glossary/training-algorithm) is applied to, in order to set a [model](/en/glossary/model)'s [parameters](/en/glossary/parameters). For a spam filter, that might be thousands of emails already labeled "spam" or "not spam"; for a [language model](/en/glossary/language-model), huge amounts of text.

The model can only learn patterns that its examples reveal. Mistakes get learned too: had every email containing “invoice” been labeled spam, the filter would learn exactly that, with no faulty rule anywhere to fix.

**An example:** For a language model, the right next piece of text is already in the text itself. The sentence “The cat sat on the sofa.” yields several [samples](/en/glossary/sample): the input “The cat sat” gets the [label](/en/glossary/label) “on”, and “The cat sat on” gets the label “the”. Nobody has to label anything by hand.

**Not to be confused with your input during use:** Training data adjusts the parameters while training is running. What you later give a finished model, such as a question to a chatbot, is input: it has no label, and no parameter changes. If a provider later uses such inputs for new training, that's a separate training step.

**Where you'll come across it:** In news about which texts or images a model was trained on, and in the settings and privacy notices of some services that state whether your inputs are used for future training.

Introduced in “[Input and Output: What a Model Does with an Input](/en/lessons/input-and-output)” as a training example; training data is the whole set of these examples. The spam filter case is in “[Program, Algorithm, Model Compared](/en/lessons/program-algorithm-model)”.
