---
title: 'Language model'
description: 'A model trained on large amounts of text that rates how well each text piece fits next; that is how text emerges piece by piece.'
translationKey: sprachmodell
---

A language model is a [model](/en/glossary/model) whose training is specifically geared toward human language. From patterns in huge amounts of text, it estimates probabilities for which words or word sequences fit a given context. It uses those estimates to continue text piece by piece, for example as an answer to a question.

Its input is text, but its direct output isn't: it's a list of scores over every text piece it knows. Text only comes out of that through a selection step and a loop.

**An example:** You type “The cat sat” into a chatbot. The language model behind it doesn't produce a finished answer. For every text piece ([token](/en/glossary/token)) it knows, it outputs a score for how well that piece fits next. A selection step picks, say, “on”, appends it, and the longer text goes back in. The answer grows piece by piece.

**Not to be confused with a chatbot:** The chatbot is the application you type into; the language model is the model inside it that computes the scores. The conversation so far is sent along as input again every time. Your conversation doesn't change the language model itself: its [parameters](/en/glossary/parameters) stay fixed until someone trains it again.

**Where you'll come across it:** In news about AI chatbots, often as “large language model”, or LLM for short. The word suggestions above some phone keyboards, such as Gboard, come from one too, and some devices run a smaller language model right on the device. Providers usually bill language model use per token.

Explained in more depth in ["Input and Output: What a Function Does"](/en/lessons/input-and-output).
