---
title: 'Context Window'
description: 'The limited number of token positions a model can consider in one processing operation, shared by input and output in many systems.'
translationKey: kontextfenster
---

The context window describes how many [tokens](/en/glossary/token) a model can consider during one operation. It contains a fixed number of token positions, much like a row with a limited number of boxes. Depending on the system, the input and generated output share those boxes.

Text containing many small tokens uses more of the context window than text with the same visible number of characters but fewer, larger tokens. Word and character counts therefore do not determine context use exactly.

**An example:** In a long chat with an AI assistant, the whole conversation goes back into the model as [input](/en/glossary/input) every round and grows with each answer. Once it no longer fits, the system has to drop, shorten, or split part of it. Then the model seems to forget the beginning.

**Not to be confused with what the model knows:** The context window only holds the tokens present in the current operation, such as your chat history. What the model learned in training is stored permanently in its [parameters](/en/glossary/parameters). If part of the chat drops out of the window, nothing learned is lost, but the model no longer sees that part.

**Where you’ll come across it:** In AI providers’ model descriptions, which give its size in tokens, and in messages saying your text is too long. Unusual product codes, long strings of digits, or languages the vocabulary covers less compactly fill the window faster. GPT-2, an early language model from 2019, had 1,024 positions; the largest GPT-3 already had 2,048. Today’s model descriptions usually give far larger values.

Explained in more depth in [Token IDs: How Tokens Become Numbers](/en/lessons/token-ids-and-vocabulary).
