---
title: 'Matrix'
description: 'A matrix is a table of numbers with two axes, rows and columns, in which every number has a fixed address.'
translationKey: matrix
---

A matrix is a table of numbers with two **axes**: rows and columns. Finding a number in it takes two pieces of information, such as city and day in a weather table. Its **shape** gives the length of both axes, for example 4 × 7 for four cities and seven days.

Each row of a matrix is a [vector](/en/glossary/vector). In a language model, a sentence becomes a matrix with one row per [token](/en/glossary/token). Several matrices of the same shape can be stacked into a [tensor](/en/glossary/tensor).

**An example:** Suppose your sentence “The cats sit.” is split into five tokens, as in the tokenizer lesson. In the smallest version of GPT-2, each token brings a vector of 768 numbers. Written one below the other, they form a matrix of shape 5 × 768: 3,840 numbers. For a model, a color photo is made of matrices too, one each for red, green and blue.

**Not to be confused with just any table:** In a spreadsheet, names, dates and numbers can sit side by side, and some cells stay empty. A matrix holds only numbers of the same kind, and every row has the same length. That is what gives every number a fixed address made of row and column.

**Where you'll come across it:** In math class and in explanations of why graphics processors handle such blocks of numbers in parallel. In everyday life, the same principle is behind any table of numbers with fixed rows and columns, such as a weather forecast for several cities or a distance chart between cities.

Introduced in [Scalar, Vector, Matrix, Tensor: the Building Blocks of Numbers](/en/lessons/scalar-vector-matrix-tensor).
