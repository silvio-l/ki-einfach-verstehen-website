---
title: 'Prompt'
description: "The text input you give an AI model — it only works while it is sent along and doesn't change the model's stored parameters."
translationKey: prompt
---

A prompt is the text you give an AI assistant as input: your question, your instruction, your request. The prompt only affects answers whose input contains it. It's [input](/en/glossary/input) for an already fully trained [model](/en/glossary/model), but it doesn't change that model's stored [parameters](/en/glossary/parameters).

**An example:** You type "Explain in three sentences what a tokenizer is." That text goes in as the input for the first round. The model rates which piece of text fits next, one is selected and appended, and the answer grows piece by piece. If you then just type "Shorter?", the chatbot gets what you mean because the conversation so far is sent along again as input with every new message.

**Not to be confused with training:** Even a fixed instruction sent along every time (some providers call this a "system prompt" or "custom instructions") doesn't change the model's parameters. It only takes effect as long as it's part of what gets sent to the model. That's why a new conversation starts without the old history, unless the app itself sends some of it along. Permanently changing a model instead requires **retraining**, so that the stored parameters change.

**Where you'll come across it:** In the input box of every chatbot, in guides to "prompting," and wherever the topic is how to phrase instructions to an AI well. Technically, a long prompt counts: together with the conversation so far, it takes up room in the [context window](/en/glossary/context-window), which only holds a limited number of tokens.

Explained in more depth in ["Input and Output: What a Function Does"](/en/lessons/input-and-output).
