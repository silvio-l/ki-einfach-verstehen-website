---
title: 'Tensor'
description: 'A block of numbers with any number of axes (a scalar has none), used as the data structure for model calculations.'
translationKey: tensor
---

In machine learning libraries, a tensor is a block of numbers with a uniform number type. The number of its **axes** tells you how many position numbers you need to find one entry in it: in a list, the position is enough. In a table, you need row and column. In a stack of tables, you need stack number, row and column. Four axes simply need a fourth number, such as "group 2, table 5, row 1, column 3". You do not have to picture a four-dimensional object; all that matters is the four-part address. A [scalar](/en/glossary/scalar), a [vector](/en/glossary/vector) and a [matrix](/en/glossary/matrix) are the special cases with zero, one and two axes. The **shape** gives the length of each axis, for example 3 × 4 × 7.

Language models combine the vectors of many token positions into tensors. This lets complete sequences be processed within a shared data structure.

Introduced in [Scalar, Vector, Matrix, Tensor: the Building Blocks of Numbers](/en/lessons/scalar-vector-matrix-tensor).
