---
title: 'World model'
description: 'An inner representation of how things stand in relation to each other, which a model could use to answer questions about a world.'
translationKey: weltmodell
---

In research, a world model is an inner representation that depicts a section of the world so that a system can answer questions that go beyond simply recognizing word sequences. For a game board, that would be the position of all the pieces; for a city, the layout of the streets and their directions. The term is vague, and that is exactly why it is disputed: whoever uses it should say which section is meant and how to test it.

**An example (made up):** A model reliably says which move is legal on a board. Has it learned a representation of the board that it uses comprehensively, or does a collection of rules for move sequences suffice? Both can give good predictions, and only a test with situations that were rare or absent in training tells them apart.

**Not to be confused with a map:** A finding that makes places or times readable is not yet a world model in the full sense. Gurnee and Tegmark (2024) state explicitly that their findings do not imply that the model actually uses these representations. Conversely, Vafa and colleagues (2024) show: a model predicted taxi rides in New York well, and yet a city map could be reconstructed from these predictions that barely resembles Manhattan. So good predictions alone do not prove a world model.

**Where you will meet the term:** In debates about language models and in research on interpretability. The findings are in the lesson [Does AI Understand What It Says?](/en/lessons/does-ai-understand-what-it-says).
