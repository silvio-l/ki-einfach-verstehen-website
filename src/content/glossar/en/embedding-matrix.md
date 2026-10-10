---
title: 'Embedding matrix'
description: 'The large table at the input of a language model, with one row of learned numbers for every token in the vocabulary.'
translationKey: embedding-matrix
---

The embedding matrix is the table from which a [language model](/en/glossary/language-model) fetches the [embeddings](/en/glossary/embedding) of its tokens. It has one row for every token in the [vocabulary](/en/glossary/vocabulary), and every row is as long as an embedding. The [token ID](/en/glossary/token-id) is the row number: the model calculates nothing at this point, it only looks up. The numbers in the table are among the [parameters](/en/glossary/parameters) and are learned in training.

**An example:** In GPT-2, the embedding matrix has 50,257 rows of 768 numbers each, almost 39 million numbers, about a third of the 124 million parameters of the smallest GPT-2 version. Every new entry in the vocabulary adds one more row of the same length, and the table grows accordingly; a vocabulary with more entries therefore needs a larger table with more numbers.

**Not to be confused with the vocabulary:** The vocabulary is the list of text pieces with their numbers and belongs to the tokenizer. The embedding matrix belongs to the model and holds the learned numbers for every token ID. That is why a tokenizer and a model only work together as a fixed pair.

**Where you’ll come across it:** In explanations of how language models are built and in figures on model size, often also called the embedding table or embedding layer.

Introduced in [Embeddings: How a Number Becomes a Learned Vector](/en/lessons/embeddings).
