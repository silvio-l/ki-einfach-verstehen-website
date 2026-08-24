---
title: 'Tensor'
description: 'An ordered collection of numbers arranged along one or more axes, such as a list, table, or stack of tables.'
translationKey: tensor
---

A tensor is an ordered collection of numbers. Its **dimensions**, or indexing axes, tell you how many position numbers are needed to locate one value. One dimension is a list, two dimensions form a table of rows and columns, and three dimensions form a stack of such tables. The same numbering idea works for more dimensions even when they are hard to picture as a physical object. A [vector](/en/glossary/vector) is the one-dimensional special case.

Language models combine the vectors of many token positions into tensors. This lets complete sequences be processed within a shared data structure.

The transition from IDs to tensors begins in [How Language Becomes Numbers: Tokenizers, IDs, and Vocabulary](/en/lessons/tokenizer-ids-vocabulary).
