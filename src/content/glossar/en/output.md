---
title: 'Output'
description: "The result of a computational step — for a language model, not a finished answer but a list of scores for the next piece of text."
translationKey: output
---

The output is the result a [function](/en/glossary/function) computes from an [input](/en/glossary/input).

For a language model, the immediate output isn't a finished word, let alone a finished sentence — it's a list of [scores](/en/glossary/score), a numeric value for every single piece of text in the entire [vocabulary](/en/glossary/vocabulary), including ones that fit badly. A following selection step uses those scores to choose one concrete piece, either always taking the highest score or allowing some controlled randomness.

**An example:** A [spam filter](/en/glossary/spam-filter) adds up the weights of the words in an email. Its output is first a number, say 5. Only the comparison with a fixed threshold turns that into the verdict “spam.” Image recognition, by contrast, outputs a whole row of numbers, one per class such as cat, dog or car. That whole row together is the one output.

**Not to be confused with the finished answer:** What you read in the chat window is the result of many rounds. In each round, the model outputs a score list, one piece is chosen and appended, and the longer text goes back in. The list itself always has the same length: for the older language model GPT-2, it has 50,257 entries, no matter how short or long the input is.

**Where you'll come across it:** When a chatbot builds its answer almost word by word, you are watching this loop. The word also shows up in the settings of AI services, for example as a length limit on the output.

Explained in more depth in [Input and Output: What a Function Does](/en/lessons/input-and-output).
