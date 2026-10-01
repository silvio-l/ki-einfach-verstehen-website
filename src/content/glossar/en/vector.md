---
title: 'Vector'
description: 'An ordered list of numbers in which every position is part of the information; a language model fetches one per token from a learned table.'
translationKey: vektor
---

A vector is an ordered list of numbers, such as the temperatures of a week: every number has a fixed place, and the place is part of the information. It has one **axis**; its length is the number of entries. In a language model, the [token ID](/en/glossary/token-id) selects a row of a large table, and that row is the token's learned vector.

Unlike in the weather list, a single number in a token vector usually has no name a person could read off. What the list expresses only emerges from all the numbers together, and it is set during training. Several vectors written one below the other form a [matrix](/en/glossary/matrix), and many matrices stacked form a [tensor](/en/glossary/tensor).

**An example:** For the token “The”, the smallest version of GPT-2 fetches a vector of 768 numbers from its table. The list at the end of the model is a vector too: one [score](/en/glossary/score) per vocabulary entry.

**Not to be confused with the arrow from school:** There, a vector is usually an arrow in a plane or in space, described by two or three numbers. In AI models, it is first of all a list of numbers, and with 768 entries it can no longer be drawn. “768 dimensions” means the length of the list, not the number of its axes.

**Where you'll come across it:** In explanations of how language models turn text into numbers. There, the learned vector of a token is often called an embedding.

Introduced in [Scalar, Vector, Matrix, Tensor: the Building Blocks of Numbers](/en/lessons/scalar-vector-matrix-tensor).
