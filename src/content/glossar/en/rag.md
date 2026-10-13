---
title: 'RAG'
description: 'Retrieval-augmented generation: suitable passages are searched for and placed in the context before the answer.'
translationKey: rag
---

RAG stands for retrieval-augmented generation. A system searches for text passages that fit a question in a collection, such as documents or earlier conversations. These passages go into the [context](/en/lessons/what-a-chatbot-knows-in-a-conversation), so that the model can use them when answering. Lewis and colleagues described the method in 2020.

**An example:** You ask for a detail from a manual with several hundred pages. The system finds the three sections that match the question and places them in the [context window](/en/glossary/context-window). The model then answers on the basis of these three sections.

**Not to be confused with a model of its own:** When used in chat, RAG is not a new model and not training. The weights do not change. What is found depends on the search: what the search does not find never gets into the context window.

**Where you meet the term:** The search in earlier chats of Claude works with this method, according to the provider's help page. Company knowledge bases often use it as well.

The term is introduced in [What a Chatbot Knows in a Conversation: Four Sources, One Context Window](/en/lessons/what-a-chatbot-knows-in-a-conversation).
