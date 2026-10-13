---
title: 'Chain of thought'
description: 'The method in which a model writes its intermediate steps as text before it gives the answer.'
translationKey: gedankenkette
---

A chain of thought is a line of reasoning made of intermediate steps that a model writes as text before it gives its answer. Each step stays in the [context](/en/glossary/context-window) and serves as the basis for the next one. The term refers to the method as well as to the written text itself. Counted as output, the chain of thought consists of [thinking tokens](/en/glossary/thinking-tokens); one line of it often contains many of them.

**An example (made up):** Start with 3, double the result, add 4, double again, add 1. The chain of thought reads 6, 10, 20, and the answer is 21. The model writes the intermediate results down instead of keeping them in its head. Where each step needs the previous one, this can help. Whether it helps depends on the model: in a 2022 study by Wei and colleagues it only helped models of around 100 billion [parameters](/en/glossary/parameters).

**Not to be confused with proof:** A chain of thought does not prove that the answer is right. A wrong intermediate step becomes text itself, and the next step builds on it as if it were correct. Whether a displayed line of reasoning shows the actual process is a separate question.

**Where you'll come across it:** In research papers since 2022, where it is called chain-of-thought, and in guides on writing prompts. The findings, with numbers and sources, are in the lesson [How a Model "Thinks": Intermediate Steps It Writes Itself](/en/lessons/how-a-model-thinks).
