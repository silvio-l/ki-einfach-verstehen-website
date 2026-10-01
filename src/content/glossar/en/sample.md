---
title: 'Sample (Example)'
description: 'A matched pair of input and expected output that a model is trained on, also called a training example.'
translationKey: beispiel
---

A sample (also called an **example**) is a matched pair of [input](/en/glossary/input) and expected [output](/en/glossary/output) used to train a model. The expected output is called the [label](/en/glossary/label). Many samples together make up the [training data](/en/glossary/training-data).

**An example:** For a [spam filter](/en/glossary/spam-filter), one sample is a single email together with the information of whether it was spam. People supplied that marking. For a language model, a sample comes from cutting a sentence at one point instead: everything before the cut becomes the input, the next piece of text after it becomes the label. One sentence like “The cat sat on the sofa.” yields several samples, such as “The cat sat” → “on” and “The cat sat on” → “the.” Nobody assigns these labels by hand; they are already in the text.

**Not to be confused with sampling:** Despite the similar word, [sampling](/en/glossary/sampling) has nothing to do with training examples. It's the step in which a finished language model picks the next piece of text by weighted chance. Samples only exist in training, because only there is it known which output would have been correct. When you ask a chatbot a question, the model gets input without a label.

**Where you'll come across it:** You'll read “sample” in technical texts and reports about training AI models, often when the amount and quality of training data are discussed. You may even create one yourself: when you mark an email as spam, it can become material for a later training step.

Explained in more depth in [Input and Output: What a Function Does](/en/lessons/input-and-output).
