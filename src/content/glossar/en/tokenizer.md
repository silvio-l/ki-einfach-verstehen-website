---
title: 'Tokenizer'
description: 'The fixed procedure that converts text into tokens and token IDs and assembles IDs back into text.'
translationKey: tokenizer
---

A tokenizer divides text into [tokens](/en/glossary/token) according to fixed rules and assigns them numbers through its [vocabulary](/en/glossary/vocabulary). During decoding, it joins a sequence of those numbers back into text.

A tokenizer and its trained model form a fixed pair. The model receives IDs rather than visible text and learned what each ID means using exactly this tokenizer. Another tokenizer could assign the same number to a different text piece.

**An example:** When you type a question to a chatbot, a tokenizer first splits it into tokens and turns it into a sequence of numbers. Only that sequence goes into the model. The answer also comes out as a sequence of IDs, which the tokenizer turns back into readable text piece by piece. Both directions run with every message.

**Not to be confused with the model:** The tokenizer understands nothing and predicts nothing. It only converts text into IDs and IDs back into text, by fixed rules: the same text gives the same split with the same tokenizer. Which token comes next is decided by the [language model](/en/glossary/language-model) alone. Where the tokenizer splits a word doesn’t follow syllable rules either, but the learned vocabulary, usually made of [subword tokens](/en/glossary/subword-token).

**Where you’ll come across it:** Openly available models you can download explicitly include tokenizer files with vocabulary and rules, because they have to match the model exactly. A new model often comes with its own tokenizer, and the same sentence gives different IDs there. Many providers also offer tools that count the tokens in a text.

Explained in more depth in [Tokenizers: How Text Breaks into Tokens](/en/lessons/tokenizer-ids-vocabulary); encoding and decoding are shown in [Token IDs: How Tokens Become Numbers](/en/lessons/token-ids-and-vocabulary).
