---
title: 'Probe'
description: 'A small additional reading device that checks the numbers in a model for whether they contain a particular piece of information.'
translationKey: sonde
---

A probe is a small additional model that is trained on the [intermediate values](/en/glossary/intermediate-value) of a finished model. Intermediate values are the numbers that arise inside the model for each input. The probe receives them and tries to predict a particular piece of information from them, such as the state of a game board or the place a name belongs to. The model itself stays unchanged.

**An example (made up):** A probe is supposed to tell from a model's intermediate values whether a field of a game board is occupied by black or by white. If that works reliably on new positions, the information is readable in the numbers. Whether the model uses it for its answers is a different question, which the probe does not answer.

**Not to be confused with proof of use:** A probe shows that information can be read from the numbers. It does not show that the model relies on it. Whether the probe merely reads the information or computes it itself is shown by a comparison with a network that was not trained: if the probe reads it out there just as well, it computed the information itself. Showing use also takes a test in which individual numbers are deliberately changed and one checks whether the model's answer changes. Gurnee and Tegmark (2024) state explicitly that readable information does not imply that the model uses it.

**Where you will meet the term:** In research on interpretability, that is, on the question of what the numbers in a model contain. The findings, with sources, are in the lesson [Does AI Understand What It Says?](/en/lessons/does-ai-understand-what-it-says).
