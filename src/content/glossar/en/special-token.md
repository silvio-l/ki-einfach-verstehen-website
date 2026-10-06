---
title: 'Special Token'
description: 'A vocabulary entry that stands for structure rather than text: the start, roles, message boundaries or the end of an answer.'
translationKey: spezial-token
---

A special token is an entry in the [vocabulary](/en/glossary/vocabulary) that does not represent a piece of text but a marker. It tells a [language model](/en/glossary/language-model) where a text begins, which role is speaking, where a message ends, or that an answer is finished. Like every [token](/en/glossary/token), it has a fixed [token ID](/en/glossary/token-id). The tokenizer never splits it into smaller pieces.

**An example:** In Llama 3.1, `<|start_header_id|>` and `<|end_header_id|>` enclose the name of a role, and `<|eot_id|>` ends a turn. The chat model learned in training to produce an `<|eot_id|>` itself at the end of its answer. The program around it stops there. Other models use other markers, such as `<|im_start|>` and `<|im_end|>` in Qwen or `<end_of_turn>` in Gemma.

**Not to be confused with special characters in text:** If you type the string `<|eot_id|>` into a chat, it is ordinary text at first. Well-built applications make sure it does not become a real special token, because otherwise a model could be steered through typed markers.

**Where you’ll come across it:** In model descriptions and guides to chat formats, in software libraries as “special tokens”, and in failures where a model does not stop writing or mixes foreign markers into its answer.
