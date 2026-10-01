---
title: 'Vector'
description: 'An ordered list of numbers through which a model processes properties as one numerical representation.'
translationKey: vektor
---

A vector is an ordered list of numbers, such as the temperatures of a week: every number has a fixed place, and the place is part of the information. It has one **axis**; its length is the number of entries. In a language model, the [token ID](/en/glossary/token-id) selects a row of a large table, and that row is the token's learned vector.

Unlike in the weather list, a single number in a token vector usually has no name a person could read off. The individual numbers, also called **components**, matter together; meaning emerges from how they work together. Together they form a numerical representation the model keeps calculating with. Several vectors can be combined into a [tensor](/en/glossary/tensor).

Introduced in [Scalar, Vector, Matrix, Tensor: the Building Blocks of Numbers](/en/lessons/scalar-vector-matrix-tensor).
