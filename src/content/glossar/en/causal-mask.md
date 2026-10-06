---
title: 'Causal mask'
description: 'The block in a language model’s attention that lets every token see only itself and earlier tokens.'
translationKey: causal-mask
---

The causal mask makes sure that in a language model every position sees only itself and the positions before it, never those after it. To do this, the [score](/en/glossary/score) of every later position is set to minus infinity before [softmax](/en/glossary/softmax). Softmax turns that into a weight of exactly 0. So nothing flows in from later tokens during [attention](/en/glossary/attention).

The reason lies in training: the model learns to predict the next [token](/en/glossary/token) at every position. If it could look ahead, the solution would already be there. When an answer is generated, the later tokens do not exist yet anyway. With seven tokens, 28 of the 49 possible pairs are allowed; the allowed cells form a triangle.

**An example:** In “I sit on the bank in the park”, “bank” cannot look at “park”. “park”, on the other hand, sees “bank”, and later positions get information from both words.

**Not to be confused with the attention mask for padding:** That mask of 1s and 0s marks padding tokens used to bring shorter texts in a batch to the same length. The causal mask instead blocks real tokens as soon as they come later in the text.

**Where you'll come across it:** In technical texts about language models, also as “masked self-attention”. Models that work this way are often called “causal language models” or “decoder models”.
