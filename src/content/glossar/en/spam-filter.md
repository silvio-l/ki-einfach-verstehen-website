---
title: 'Spam filter'
description: 'A trained model that classifies an email as spam or not spam, often as a probability.'
translationKey: spamfilter
---

A spam filter is a trained [model](/en/glossary/model) that takes an email — subject line, body, sender address — as input and computes a judgment from it: "spam" or "not spam", often even as a probability like "92% spam". The [training algorithm](/en/glossary/training-algorithm) sets the [parameters](/en/glossary/parameters) using thousands of emails people already flagged as spam or not spam by hand; no human needs to write down in advance, as a rule, which features actually indicate spam.

A spam filter works on exactly the same principle as an [image classifier](/en/glossary/image-classifier) or a [language model](/en/glossary/language-model) — just with emails instead of images or text as [training data](/en/glossary/training-data).

Explained in more depth in [Input and Output: How a Function "Thinks"](/en/lessons/input-and-output).
