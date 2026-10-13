---
title: 'Prompt injection'
description: 'Hidden instructions in text that a model processes, for example on a web page or in a tool result, that are meant to steer the model.'
translationKey: prompt-injection
---

Prompt injection means that text in a model's context contains instructions that do not come from the user. The model reads everything in the same text: the app's instructions, your question, and the content of a web page or a [tool result](/en/glossary/tool-call). It decides whether to follow an instruction based on this text alone, not on where the text came from.

**An invented example:** An agent is to summarize a web page. On the page is a hidden sentence that asks the model to forget its earlier instructions. The model reads this sentence together with the rest of the page.

**Not to be confused with a bug:** The instruction works because instruction and content stand in the same text. A result from a [tool](/en/glossary/tool) can also contain instructions, even when it looks like pure information.

**Where you'll come across it:** On agents that read web pages, such as a web search in a chat app, every page read can contain such sentences, usually out of sight to you. Whether the model follows them cannot be reliably predicted from outside, even when the page looks harmless. Anthropic, the maker of Claude, calls prompt injection one of the most significant security challenges for browser agents in its post on defenses ([anthropic.com/research/prompt-injection-defenses](https://anthropic.com/research/prompt-injection-defenses)), and says the problem is far from solved. There is no guarantee against it. Check answers that rest on pages you read against the source.

Introduced in [From Chatbot to Agent: How AI Works through a Task](/en/lessons/from-chatbot-to-agent).
