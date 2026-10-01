---
title: 'Input'
description: 'The data fed into a computational step — a number, an image, a text, or many values at once.'
translationKey: input
---

The input is whatever gets fed into a [function](/en/glossary/function). It can be a single number, an image, a text, or many bundled values at once. Every model only works with the kind of input it was built for: a spam filter receives text and could not rate a photo at all.

For a language model, the input at each prediction step is the text written so far. Given “The cat sat,” for example, the model sees only that existing part, not the word that will follow. Before the calculation, a [tokenizer](/en/glossary/tokenizer) follows fixed rules to divide the text into smaller pieces and assign them numbers.

**An example:** For image recognition, the input is a photo, or more precisely, to the model, the brightness and color values of its pixels. For a [spam filter](/en/glossary/spam-filter), it is the words of an email.

**Not to be confused with the prompt:** The [prompt](/en/glossary/prompt) is the text you type into a chatbot. It is the input of the first round, but not the only one. The language model appends each newly chosen text piece, and the longer text becomes the input for the next round. Within the same conversation, the earlier messages are also sent along again every time.

**Where you'll come across it:** Descriptions of AI services use the word constantly, for instance when they state which kinds of input a model accepts: text only, or images as well. Pricing pages also often list input and output separately.

Explained in more depth in [Input and Output: What a Function Does](/en/lessons/input-and-output).
