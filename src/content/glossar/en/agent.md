---
title: 'Agent'
description: 'A combination of a model and a program that uses tools in a loop: the model writes calls, the program carries them out, and the results come back as text.'
translationKey: agent
---

An agent is the combination of a [language model](/en/glossary/language-model) and a loop that a program runs around it. The model writes [tool calls](/en/glossary/tool-call) in a fixed format. The program carries them out, puts the results into the conversation as text, and lets the model continue. In this way an agent works through a task in several steps until no further call follows.

**An example:** You ask for a file to be renamed. The model first writes a call to list the files in the folder. The program carries it out and puts the list into the conversation as text. Then the model writes the call to rename the file. The program asks for your approval, carries out the renaming, and the model answers you.

**Not to be confused with a program that only follows rules:** The agent does not have a fixed next step. The model writes the sequence, and the program only carries out what its rules allow. The agent does not tell you on its own whether the result is correct. That takes a check by a person or a test.

**Where you'll come across it:** In programming tools such as Claude Code, a program with which Claude reads and changes files in the project folder, an agent works through tasks across several files. Chat apps with web search use the same loop too, usually out of sight.

Introduced in [From chatbot to agent: how AI works through a task](/en/lessons/from-chatbot-to-agent).
