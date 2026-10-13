---
title: 'Thinking tokens'
description: 'The intermediate steps a model writes as text before its answer.'
translationKey: denk-tokens
---

Thinking tokens are the [tokens](/en/glossary/token) a model writes before it begins its actual answer, and, when it uses [tools](/en/glossary/tool), also between its tool calls. Together they form a line of reasoning made of text. For the model they are text like any other: at the next step it reads them and keeps writing. Often the app does not show them, or shows only a summary. They still count. They take up computing time, use up room in the [context window](/en/glossary/context-window), the limited amount of text a model can process in one conversation, and Anthropic bills them as output, that is, as text the model writes, even if nobody reads them.

**An example (made up):** A calculation with five steps can take several hundred thinking tokens before the answer begins with the result. The answer itself may be two sentences long. Most of the output was then intermediate steps.

**Not to be confused with knowledge:** Thinking tokens are not extra knowledge. They are text the model writes itself in this conversation. A model that has learned nothing about a city does not become more knowledgeable by thinking. More thinking does not replace missing knowledge.

**Where you'll come across it:** In app labels such as “Thinking …”, in the providers' documentation and in billing, where they appear as output. The term is introduced in [How a Model "Thinks": Intermediate Steps It Writes Itself](/en/lessons/how-a-model-thinks).
