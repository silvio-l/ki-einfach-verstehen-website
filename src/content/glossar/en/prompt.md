---
title: 'Prompt'
description: "The text input you give an AI model in a conversation — changes only that one call, not the model's stored parameters."
translationKey: prompt
---

A prompt is the text you give an AI assistant as input — your question, your instruction, your request. The prompt only changes what happens in that one call: it's input for an already fully trained [model](/en/glossary/model), but it doesn't change that model's stored [parameters](/en/glossary/parameters).

That's what clearly separates a prompt from training: even a fixed instruction sent along every time (some providers call this a "system prompt" or "custom instructions") doesn't change the model's parameters — it only takes effect as long as it's part of what gets sent to the model. Permanently changing a model, by contrast, always means retraining it.

Explained in more depth in ["Program, Algorithm, Model — What's the Difference?"](/en/lessons/program-algorithm-model).
