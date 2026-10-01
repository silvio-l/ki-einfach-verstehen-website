---
title: 'Function'
description: 'A computational step that takes an input and computes an output from it — the same input always produces the same output.'
translationKey: funktion
---

A function is a computational step that takes something in (the [input](/en/glossary/input)) and computes something else from it (the [output](/en/glossary/output)). The same function always produces the same output for the same input.

*Mental image: a calculator* — "2 + 3" is the input, "5" is the output, with a fixed computational path in between.

A trained [model](/en/glossary/model) may be very complex, but its computation and parameters are fixed after training, so the same input always gives the same output: it is a function. Only the computational path in between wasn't hand-written; it was trained. That is where the mental image ends: people designed every step of a calculator.

**An example:** A [spam filter](/en/glossary/spam-filter) adds up the weights of the words in an email. If the same email arrives twice, the same number comes out twice. Its weights change only during training, not while rating.

**Not to be confused with the everyday meaning:** In everyday language, a “function” is often a device feature, like a camera's night mode. Here it means the mathematical sense: a fixed mapping from input to output. A chatbot giving two different answers to the same question doesn't contradict this: the difference almost always comes from picking the next text piece with some randomness ([sampling](/en/glossary/sampling)).

**Where you'll come across it:** In school math as notation like f(x) and in spreadsheet formulas such as SUM: an input goes in, a fixed result comes out. In programming, any named step is called a function, even though not every one returns the same result for the same input.

Explained in more depth in [Input and Output: What a Function Does](/en/lessons/input-and-output).
