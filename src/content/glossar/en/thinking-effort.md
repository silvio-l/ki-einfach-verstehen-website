---
title: 'Thinking effort'
description: 'The computing work a model spends before an answer, measured by its thinking tokens and its passes through the network.'
translationKey: denkaufwand
---

Thinking effort is the amount of computing work a model spends before and during an answer. It is measured mainly by the [thinking tokens](/en/glossary/thinking-tokens) that providers count as output. As a simplification, each token means one pass through the entire stored network. More thinking tokens mean more work and more waiting. Providers often set the effort as a level, such as low, medium or high. At OpenAI the control is called `reasoning_effort`. Anthropic describes thinking as adaptive: the level there is guidance, and the model decides within it whether and how much to think.

**An example (made up):** The same question can be answered at once with little thinking effort. With a lot of thinking effort, the model writes a long line of reasoning before it answers. In both cases the answer can be equally short.

**Not to be confused with quality:** More thinking effort can improve an answer, mainly for tasks made of several steps that build on each other. How much it helps depends on the task; there is no general rule. More thinking is no substitute for knowledge the model lacks. Higher effort does not automatically make the answer correct.

**Where you'll come across it:** In the settings of some chat apps, in the providers' API parameters and in billing, where thinking tokens appear as output. More on this in the lesson [How a Model "Thinks": Intermediate Steps It Writes Itself](/en/lessons/how-a-model-thinks).
