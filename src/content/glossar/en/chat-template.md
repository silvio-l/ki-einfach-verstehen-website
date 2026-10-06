---
title: 'Chat Template'
description: 'The fixed pattern of a chat model that joins messages with roles and special tokens into one single token sequence.'
translationKey: chat-vorlage
---

A chat template defines how a conversation becomes one single sequence of [tokens](/en/glossary/token). A [language model](/en/glossary/language-model) can only continue a sequence; it knows nothing about separate speech bubbles. So the template takes the list of messages, each with its role such as “system”, “user” or “assistant”, and joins them one after another with [special tokens](/en/glossary/special-token) as markers. At the end it opens the assistant’s role so that the model continues there with its answer.

**An example:** From the instruction “Answer briefly.” and the question “What is the capital of France?”, the Llama 3.1 template builds one sequence and even inserts two date lines that nobody typed. For the same short German chat, Llama 3.1 produced 50 tokens, Gemma 3 22 and gpt-oss 86.

**Not to be confused with a text template for prompts:** It is not a sample text you fill in, but the technical format that the program around the model applies to every request. Every chat model learned its own format in training; with a foreign template it answers markedly worse.

**Where you’ll come across it:** In guides for openly available models, in software libraries such as Transformers (where the function is called `apply_chat_template`), and in model descriptions that prescribe a particular “prompt format”.
