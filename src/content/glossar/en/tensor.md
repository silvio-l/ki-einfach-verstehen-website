---
title: 'Tensor'
description: 'A block of numbers with any number of axes; scalar, vector and matrix are special cases of it, and AI models compute in such blocks.'
translationKey: tensor
---

In machine learning libraries, a tensor is a block of numbers all of the same kind, such as decimals. The number of its **axes** tells you how many numbers you need to find an entry: in a list, the position is enough. In a table, you need row and column. In a stack of tables, you need stack number, row and column. Four axes simply need a fourth number, such as "group 2, table 5, row 1, column 3". No four-dimensional object needs picturing; only the four-part address matters. A [scalar](/en/glossary/scalar), a [vector](/en/glossary/vector) and a [matrix](/en/glossary/matrix) are the special cases with zero, one and two axes. The **shape** gives the length of each axis, for example 3 × 4 × 7.

In a language model, a sentence becomes a matrix with one row per token. During training, the matrices of many sentences are stacked into a tensor so that the computing chip can process them in one pass.

**An example:** A color photo 400 pixels high and 600 wide becomes three tables for a model: red, green and blue. Stacked, they form a tensor of shape 3 × 400 × 600, or 720,000 numbers.

**Not to be confused with the tensor of physics and mathematics:** There, it names a stricter concept with its own rules. In AI models, it simply means a block of numbers.

**Where you'll come across it:** In the name of the TensorFlow library and in the documentation of other machine learning libraries, which state the shape of almost every block of numbers.

Introduced in [Scalar, Vector, Matrix, Tensor: the Building Blocks of Numbers](/en/lessons/scalar-vector-matrix-tensor).
