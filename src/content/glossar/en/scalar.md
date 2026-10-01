---
title: 'Scalar'
description: 'A scalar is a single number with no place in a list or table, the simplest block of numbers, with no axis at all.'
translationKey: skalar
---

A scalar is a single number, such as today's noon temperature: 18 degrees. It has no **axis**, because it does not extend in any direction.

In machine learning libraries a scalar counts as a [tensor](/en/glossary/tensor) with no axis. Several scalars in a fixed order form a [vector](/en/glossary/vector).

**An example:** At the very end, a language model rates every possible next text piece with a single number, its [score](/en/glossary/score). Each of these scores on its own is a scalar, say 7.1 for a likely piece or −2.3 for an unsuitable one. Only all the scores together, in a fixed order, make up a list and therefore a vector.

**Not to be confused with a small or simple number:** Whether something is a scalar depends not on its value but on how it is arranged. 0.5 is just as much a scalar as 50,257. Nor does it refer to “scaling” models, meaning making them bigger. It only says: this number stands on its own, without a place in a list or table.

**Where you'll come across it:** You may know it from physics class as a quantity without direction, such as temperature or mass. Explanations of AI usually start the series scalar, vector, matrix, tensor with it, and the documentation of machine learning libraries treats it as a tensor with no axis. In everyday life, every single reading is a scalar: your phone's battery level, a price, the temperature in your weather app.

Introduced in [Scalar, Vector, Matrix, Tensor: the Building Blocks of Numbers](/en/lessons/scalar-vector-matrix-tensor).
