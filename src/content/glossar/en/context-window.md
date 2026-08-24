---
title: 'Context Window'
description: 'The limited number of token positions a model can consider in one processing operation.'
translationKey: kontextfenster
---

The context window describes how many [tokens](/en/glossary/token) a model can consider during one operation. It contains a fixed number of token positions, much like a row with a limited number of boxes. Depending on the system, the input and generated output share those boxes.

Text containing many small tokens uses more space in the context window than text with the same visible number of characters but fewer, larger tokens. Word and character counts therefore do not determine context use exactly.

Explained in more depth in [Tokenizers: How Language Becomes Numbers](/en/lessons/tokenizer-ids-vocabulary).
