---
title: 'System Prompt'
description: 'Instructions at the start of a conversation that reach the model as a message with the system role, before the user’s question.'
translationKey: systemanweisung
---

A system prompt is the set of instructions at the start of a conversation, before the user’s question comes, for example how the model should answer or what today’s date is. It stands in the sequence the model reads, as a message with the role system; for some models the role is called developer. In German it is called Systemanweisung.

**An invented example:** an app writes “Answer briefly and in German.” into the system prompt. Then a person asks about a train connection. The model gets both as text, separated only by the markers of the [chat template](/en/glossary/chat-template). The instruction has an effect because it stands in the [input](/en/glossary/input), not because the model knows it separately.

**Not to be confused with the user’s question:** The system prompt comes from the app or service that uses the model, not from the person who is typing. The model has no separate channel for it. It sees a single sequence of instructions, earlier messages and the new question.

**Where you’ll come across it:** In documentation for programming interfaces, where it appears as a role of its own, and in publications in which providers disclose the instructions of their apps.

Introduced in [From Text Predictor to Assistant: What Post-Training Makes of a Model](/en/lessons/from-text-predictor-to-assistant).
