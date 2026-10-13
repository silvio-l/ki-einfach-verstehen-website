---
title: 'Tool'
description: 'A function that a program carries out so that a chatbot can fetch information or complete tasks.'
translationKey: werkzeug
---

A tool is a function that runs outside the model. The model can request it, for example a web search or a search through earlier chats. However, it is carried out by the application or, for server tools such as web search, by the provider's servers, not by the model itself. The result comes back into the conversation as text, [in the context](/en/lessons/what-a-chatbot-knows-in-a-conversation), and then lies in the [context window](/en/glossary/context-window) until the conversation discards it.

**An example:** You ask about the weather in Leipzig. The app has web search switched on. The search returns pages with current information, whose text is loaded into the conversation. The model then answers on the basis of this text. The answer does not check whether the page is correct.

**Not to be confused with the model's knowledge:** A tool adds text; it does not change the [parameters](/en/glossary/parameters). What the model learned in training stays the same.

**Where you'll come across it:** In chat apps a tool call often appears as its own step, for example “Searching the web”. The application describes each tool with a name and a description so that the model can request it. Whether the app asks you first is its own decision; for server tools such as web search you only see the result. How this becomes an [agent](/en/glossary/agent) is shown in the lesson “From chatbot to agent”.

Introduced in [What a chatbot knows in a conversation: four sources, one context window](/en/lessons/what-a-chatbot-knows-in-a-conversation).
