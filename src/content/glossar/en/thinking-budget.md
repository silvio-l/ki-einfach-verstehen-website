---
title: 'Thinking budget'
description: 'A guideline for how much a model should think before it answers, which used to be set as a fixed number.'
translationKey: denkbudget
---

A thinking budget is a guideline for how much a model should think before it answers. Earlier, people set it as a fixed number of [thinking tokens](/en/glossary/thinking-tokens). It is not a hard limit. The only hard limit is the maximum number of tokens the model may write in total. That maximum covers thinking and answer together, because both share the same space.

**An example (made up):** With a limit of 4,000 tokens and a thinking budget of 2,000, only this guideline applies to thinking. If the model thinks more than 2,000 tokens, the answer has less room, because together they may not exceed 4,000. If it thinks less, the answer has more room. If the limit is set too tight, the answer may be cut off before it ends.

**Not to be confused with a promise:** A thinking budget is a frame, not a promise that it will be used up. No setting guarantees that the model thinks at all. With Anthropic's newer models, the model decides for itself how much it thinks, and a simple factual question often gets no thinking section at all, so no step before the answer.

**Where you'll come across it:** In the parameters of providers' programming interfaces (APIs) and in the settings of some apps. Today there is often a level instead of a number, such as low, medium or high; for Claude 4.6 (a version number of Anthropic's models) the fixed number is outdated, and from Claude 4.7 on the interface rejects it. The term is introduced in [How a Model "Thinks": Intermediate Steps It Writes Itself](/en/lessons/how-a-model-thinks).
