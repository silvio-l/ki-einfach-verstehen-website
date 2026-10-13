---
title: 'Tokenizer'
description: 'A fixed process that turns text into tokens and token IDs, then turns those IDs back into text.'
translationKey: tokenizer
---

A tokenizer splits text into [tokens](/en/glossary/token) by fixed rules. Using its [vocabulary](/en/glossary/vocabulary), it gives each piece a number called a [token ID](/en/glossary/token-id). Many tokenizers use [subword tokens](/en/glossary/subword-token), which are pieces of text: common words, parts of words, or single characters. The tokenizer does not split words by syllable. Instead, it uses letter sequences that appeared often in the texts it was built from.

A model needs exactly the tokenizer it was trained with, because it learned its numbers for exactly these [token IDs](/en/glossary/token-id). Several models of one family can share the same tokenizer.

**An example:** When you type a question to a chatbot, the tokenizer turns it into a sequence of numbers. The chat app then adds its instructions and the conversation history before sending the whole sequence to the model. The answer also comes out as IDs, which the tokenizer turns back into text.

**Not to be confused with the model:** The tokenizer follows fixed rules to turn text into IDs and IDs back into text, so it always splits the same text in the same way. The [language model](/en/glossary/language-model), by contrast, gives every piece in its vocabulary a [score](/en/glossary/score), that is, a rating for that piece. A separate step uses those scores to pick the next piece, often with some randomness.

**Where you’ll come across it:** The tokenizer determines how many tokens a text takes up. If you use a model through developer access (an API, an interface for programs), you often pay per token. How quickly a long chat fills the [context window](/en/glossary/context-window) also depends on it.

More on this: [Tokenizers: How Text Breaks into Tokens](/en/lessons/tokenizer-ids-vocabulary). You can see encoding and decoding in [Token IDs: What a Number Means](/en/lessons/token-ids-and-vocabulary).
