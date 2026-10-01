---
title: 'Spam filter'
description: 'A trained model that classifies an email as spam or not spam, often expressed as a probability such as "92% spam".'
translationKey: spamfilter
---

A spam filter is a trained [model](/en/glossary/model) that takes an email as input and computes a judgment from it: "spam" or "not spam", often as a probability like "92% spam". The [training algorithm](/en/glossary/training-algorithm) sets the [parameters](/en/glossary/parameters) using thousands of emails already marked by people as spam or not spam; no human needs to write down in advance which features indicate spam.

**An example:** The filter has stored a learned weight for each word, say "prize" +3, "free" +2 and "invoice" −2 (made-up values). For the email "Free: your prize is waiting" it adds up the weights and gets 5. Only the comparison with a fixed threshold, here 2, turns that into the verdict "spam". If the same email arrives a second time, the result is 5 again, because the filter learns nothing while rating.

**Not to be confused with a rule filter:** A classic [program](/en/glossary/program) works through a list of rules written by people, such as "If the subject contains the word 'prize', move it to spam". Rules like that are easy to get around; "PR1ZE" already slips through. In a trained spam filter, the behavior lives in adjusted numbers rather than readable rules. That puts it on the same principle as an [image classifier](/en/glossary/image-classifier) or a [language model](/en/glossary/language-model), just with emails as [training data](/en/glossary/training-data).

**Where you'll come across it:** In your inbox's spam folder. When you report an email as spam, that can feed into a later training step. The filter rating an email, on the other hand, doesn't change it.

Explained in more depth in [Input and Output: What a Function Does](/en/lessons/input-and-output).
