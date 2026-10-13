---
title: 'Tool call'
description: 'The request with which a model wants to use a tool: a piece of text in a fixed format that a program recognizes and carries out.'
translationKey: werkzeugaufruf
---

A tool call is a [model's](/en/glossary/language-model) request to use a [tool](/en/glossary/tool) outside the model, such as a search or reading a file. The model does not write a command that does something. It writes text in a fixed format, usually with the name of the tool and the details for its execution. The program receives the call as a clearly structured block with a name and details and does not have to read it out of the running text.

**An example:** The model writes `liste_dateien` with the folder `Entwürfe`. The program takes up the block, carries out the call on the computer, and puts the result into the conversation as text. The model only sees this text, not the folder itself.

**Not to be confused with the execution:** The call is the request, the result is the answer to the request. A call is not yet an action. Between the two lies the execution. For server tools such as web search, the provider takes over this step, and you only see the result. Tools your program carries out, such as running a command, run wherever the program runs. Whether they ask first is set by the program's permissions (see [permission](/en/glossary/permission)).

**Where you'll come across it:** In chat apps a tool call often appears as its own step, for example “Searching the web”. Whether it is carried out is not decided by the model, even if the model asks politely. For tools your app carries out, the app's [permission](/en/glossary/permission) rules decide whether it asks first; server tools such as web search are carried out by the provider.

Introduced in [From chatbot to agent: how AI works through a task](/en/lessons/from-chatbot-to-agent).
