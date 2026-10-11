---
title: 'Language model'
description: 'A model trained on large amounts of text that scores how well each text piece it knows fits next. This is how text emerges, one piece at a time.'
translationKey: sprachmodell
---

A language model is a [model](/en/glossary/model) trained on huge amounts of text written in human languages. From this text, it learns how likely each piece is to come next, whether it is a whole word, part of a word, or punctuation mark. It can then continue a text one piece at a time.

The language model receives the text as a sequence of numbers. Its immediate result, or output, is not a finished answer but a list of scores, one for every text piece it knows. A separate selection step uses these scores to choose the next piece of text.

**An example:** You type “The cat sat” into a chatbot. The language model behind it gives every text piece ([token](/en/glossary/token)) it knows a score for how well it would fit next. A selection step might pick “on” and add it to the text. The longer text then goes back into the model, which assigns a fresh set of scores.

**Not to be confused with a chatbot:** The chatbot is the application you type into; the language model inside it computes the scores. Each time, the whole conversation is sent back to the language model as input. Your conversation doesn't change the language model itself: its [parameters](/en/glossary/parameters), the numbers stored in the model, stay fixed until someone trains it again.

**Where you'll come across it:** In news about AI chatbots, you'll often see the term “large language model”, or LLM for short.

The term is introduced in ["Input and Output: What a Function Does"](/en/lessons/input-and-output).
