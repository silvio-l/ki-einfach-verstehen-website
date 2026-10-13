---
title: 'Lost in the Middle'
description: 'Finding that information in the middle of long inputs is often used less well than information at the beginning or the end.'
translationKey: lost-in-the-middle
---

"Lost in the Middle" describes a finding by Liu and colleagues from 2024. They asked language models questions about documents in which the relevant information sat at different positions. Performance was often highest when the information was at the beginning or at the end of the [context window](/en/glossary/context-window). It dropped when the information lay in the middle.

**An example:** You upload a long document and ask about a number in the middle section. The whole document lies in the window, and the answer can still be wrong.

**Not to be confused with forgetting in training:** The finding describes how the context is used while an answer is produced. It says nothing about whether the model learned the text during training. The weights are not affected by it.

**Where you meet the term:** In studies of long contexts, for example in [benchmarks](/en/glossary/benchmark) (standardized tests). The results apply to the models and setups that were tested; they cannot simply be transferred to every chat.

The term is introduced in [What a chatbot knows in a conversation: four sources, one context window](/en/lessons/what-a-chatbot-knows-in-a-conversation).
