---
title: 'Context Window'
description: 'The limited number of tokens a model can consider in one processing operation.'
translationKey: kontextfenster
---

A model’s context window is the number of [tokens](/en/glossary/token) it can consider at once. Two texts with the same number of words can take up different amounts of the window: the one split into more tokens takes up more space. The limit includes the instructions the chat app adds, the chat history, your new message, and the answer as it is generated.

**An example:** In a long chat, the model receives the history again as [input](/en/glossary/input) each time it responds, so the input grows with every answer. To stay within the window, the chat app can gradually drop the oldest parts of the conversation. The model then seems to have forgotten the beginning.

**Not to be confused with what the model knows:** The context window holds only what the model can use for its current response. What the model learned during training is stored permanently in its [parameters](/en/glossary/parameters), the numerical values produced by that training. If part of the history drops out of the window, the model does not lose anything it learned, but it can no longer see that part of the conversation.

**Where you’ll come across it:** Model descriptions state the size of the context window in tokens. If the input alone is too long, Anthropic rejects the request with an error when a program addresses the model directly (via the API, an interface for developers). In the claude.ai chat, the oldest parts of the history may drop out instead. If too little space remains, the answer often gets cut off. Anthropic’s Claude Opus 5.5 has a context window of about one million tokens.

This lesson introduces the term: [Tokenization Inside the Model: How Your Chat Becomes a Token Sequence](/en/lessons/tokenization-inside-the-model).
