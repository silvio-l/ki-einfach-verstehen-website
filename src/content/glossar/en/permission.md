---
title: 'Permission'
description: 'The rule of a program that decides which tool calls run without a question, which ask first, and which do not run at all.'
translationKey: berechtigung
---

A permission is a rule of the application that decides about [tool calls](/en/glossary/tool-call). It sets what runs without a question, what the program asks you about, and what it refuses. The rules are usually grouped into modes, that is, settings for the degree of approval.

**An example:** In a programming tool, a file in the project can be read without a question. In manual mode (config value default), renaming a file asks. In a mode that refuses everything that would otherwise be asked about, the renaming runs only if a permission rule explicitly allows it.

**Not to be confused with a request in the text:** If the model writes “May I rename the file?”, that is text. The permission is a rule of the program. Instructions in the prompt or in the file CLAUDE.md (a text file with instructions for Claude Code) shape what the model tries to do; they do not change what the program allows. What is allowed is set in the program's settings, for example by a mode or by permission rules.

**Where you'll come across it:** In the settings of programming tools, for example as a mode or as a list of allowed commands. The mode you see there decides for every following call whether the program asks you. For tools of the provider you do not have this switch; the provider decides there.

Introduced in [From chatbot to agent: how AI works through a task](/en/lessons/from-chatbot-to-agent).
