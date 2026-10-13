---
title: 'Knowledge cutoff'
description: "The point in time up to which a model's training data reaches. The model does not know from its weights what happened after it."
translationKey: wissensstichtag
---

The knowledge cutoff is the point in time up to which a model's training data reaches. Events that took place later could not be captured by training. The knowledge is stored in the [parameters](/en/glossary/parameters), the numerical values that training set. They do not change during a conversation.

**An example:** A model with a June cutoff has not seen an election from September in its training. If you ask about it, the model can only answer from text that lies in the conversation, for example from a search. Without a search it guesses or falls back on older knowledge.

**Not to be confused with a hard cut:** For the current Claude models Anthropic gives June 2026 for two things: the date up to which the knowledge is most extensive and reliable, and the broader training data.

**Where you meet the term:** Model overviews from providers usually state a date for the knowledge.

The term is introduced in [What a chatbot knows in a conversation: four sources, one context window](/en/lessons/what-a-chatbot-knows-in-a-conversation).
