---
title: 'Token ID'
description: 'The fixed number assigned to a token in a particular tokenizer’s vocabulary. The model uses this number instead of the text itself.'
translationKey: token-id
---

A token ID is a whole number permanently assigned to one [token](/en/glossary/token), or piece of text, in the [vocabulary](/en/glossary/vocabulary) of a particular tokenizer (the procedure that splits text into pieces).

The number has no meaning on its own. Different tokenizers can use the same ID for different pieces of text: in an invented mini vocabulary, 417 stands for “The”; in GPT-2 (an OpenAI model), it stands for “el”.

**An example:** ␣ marks a space that is part of the piece. In an invented mini vocabulary, every piece has its own ID. “The cats sit.” splits into five pieces: there is no single “␣cats” piece, only “␣cat” and “s”. This gives the sequence 417, 82, 903, 771, 13. The [model](/en/glossary/model) receives exactly these numbers as input. To produce an answer, it scores the possible next pieces. One of their IDs is then selected, and the [tokenizer](/en/glossary/tokenizer) turns it back into text.

**Not to be confused with a measure of meaning:** 417 measures no meaning. Arithmetic with IDs is pointless: the sum 417 + 82 = 499 means nothing. The associations a model has learned for an ID are stored in its trained [parameters](/en/glossary/parameters). The ID points it to the corresponding group of learned numbers.

**Where you’ll come across it:** In a chat window you usually don’t see token IDs. You are more likely to see them in tools that show how text is split, or in programming, when a program breaks text into tokens.

More on this: [Token IDs: What a Number Means](/en/lessons/token-ids-and-vocabulary).
