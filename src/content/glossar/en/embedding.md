---
title: 'Embedding'
description: 'The learned list of numbers a language model looks up for every token; tokens used in similar ways get similar embeddings.'
translationKey: embedding
---

An embedding is the long list of learned numbers that a [language model](/en/glossary/language-model) uses for a [token](/en/glossary/token), in other words a [vector](/en/glossary/vector). The [token ID](/en/glossary/token-id) only says which piece of text is meant; the model uses it as a row number and fetches the embedding from the [embedding matrix](/en/glossary/embedding-matrix). Before training, that row holds random numbers. Training adjusts them so that predictions fit better, and in the process tokens that appear in similar contexts get similar embeddings. The individual numbers usually have no name.

**An example:** In GPT-2, every embedding has 768 numbers. The nearest neighbors of “apple” are fruit words such as “peach” and “lemon,” while those of “Apple” are “iPhone” and “iOS,” because the capitalized form is a different token.

**Not to be confused with text embeddings for search:** Some models turn a whole text into a single vector, for instance to find similar documents. That is also called an embedding, but it is something different from the row per token at the input of a language model.

**Where you’ll come across it:** In explanations of how language models turn text into numbers, and in descriptions of search features that work “with embeddings.”

Introduced in [Embeddings: How a Number Becomes a Meaningful Vector](/en/lessons/embeddings).
