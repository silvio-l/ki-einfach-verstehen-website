---
title: 'Sample (Example)'
description: 'A matched input-output pair used to train a model.'
translationKey: beispiel
---

A sample (also called an **example**) is a matched pair of [input](/en/glossary/input) and expected [output](/en/glossary/output) used to train a model. For a spam filter, one sample is a single email together with the information of whether it actually was spam or not.

For a language model, a single sample comes from cutting a sentence at one point: everything before the cut becomes the input, the next piece of text after it becomes the [label](/en/glossary/label). Moving the cut one piece at a time creates several pairs from one sentence: “The” → “cat,” then “The cat” → “sits.”

Many samples together make up a training dataset.

Explained in more depth in [Input and Output: How a Function "Thinks"](/en/lessons/input-and-output).
