---
title: 'Special Token'
description: 'A vocabulary entry that marks structure rather than text: the start, roles, message boundaries or the end of an answer.'
translationKey: spezial-token
---

A special token is an entry in the [vocabulary](/en/glossary/vocabulary) that acts as a marker instead of representing a piece of text. It tells a [language model](/en/glossary/language-model) where a text begins or a message ends, which role is speaking and when the answer is finished. A chat usually involves three roles: you, the model and the chat app with its instructions. Like every [token](/en/glossary/token), it has a fixed [token ID](/en/glossary/token-id). In normal use, the tokenizer does not split it into smaller pieces.

**An example:** In Llama 3.1, a freely available chat model from Meta, `<|start_header_id|>` and `<|end_header_id|>` come before and after the name of a role. `<|eot_id|>` ends a turn. During training, the chat model learned to produce an `<|eot_id|>` itself at the end of its answer. The tokenizer treats each of these markers as exactly one token with its own vocabulary entry. Such a marker does not stand for text; it marks the structure of the conversation. When the program around the model sees an `<|eot_id|>`, it knows the answer is over and stops. Other models use other markers. Qwen, a chat model from Alibaba, uses `<|im_start|>` and `<|im_end|>`, for example.

**Not to be confused with special characters in text:** The string `<|start|>` is a real marker in the format of gpt-oss, the freely available models from OpenAI. In the vocabulary of Llama 3.1, however, the same string splits into five ordinary pieces of text. There, it is not a special token.

**Where you’ll come across it:** In model descriptions, guides to chat formats and software libraries (ready-made code collections for developers), where these markers are called “special tokens”. The term also comes up when a model does not stop writing or mixes foreign markers into its answer.

Introduced in [Tokenization Inside the Model: How Your Chat Becomes a Token Sequence](/en/lessons/tokenization-inside-the-model).
