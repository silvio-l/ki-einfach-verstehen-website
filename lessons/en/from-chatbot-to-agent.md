<!-- Generated from src/content/bausteine/en/from-chatbot-to-agent.mdx by scripts/export-lessons.mjs -- do not edit by hand. -->

# From Chatbot to Agent: How AI Works through a Task

> Reading copy for GitHub. The full version with interactive demos, animations and recall moments is on the website: **[From Chatbot to Agent: How AI Works through a Task](https://ki-einfach-verstehen.de/en/lessons/from-chatbot-to-agent/)**
>
> Licence: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.en) · Credit it as: KI einfach verstehen, “From Chatbot to Agent: How AI Works through a Task”, CC BY 4.0, https://ki-einfach-verstehen.de/en/lessons/from-chatbot-to-agent/

A model only writes text and runs nothing itself. How it becomes an agent that uses tools in a loop, who does what in that loop, and why the end of a run says nothing about the result.

A chatbot only writes text. Yet when you use it in a programming tool, it can rename a file, search a list and tell you what it did. Here is how that works: the model writes a request, a program carries it out, and the result comes back as text. When a model and a program work together, with the model deciding which call comes next, this is called an [agent](https://ki-einfach-verstehen.de/en/glossary/agent/). Anthropic calls fixed sequences of predefined steps workflows; these are not agents. In [What a Chatbot Knows in a Conversation](./what-a-chatbot-knows-in-a-conversation.md), you saw a table used to represent everything written in the conversation so far. That same table appears here.

## Writing is not acting

Picture a commercial kitchen. At the counter you place an order: “Rename entwurf.txt to kapitel3.txt.” The cook writes a slip in a fixed format: which action, which file, which new name. The cook never enters the warehouse and never touches the goods. In the warehouse, only what is on a valid slip gets carried out. Afterwards a delivery note lands on the table. The cook reads it there and finally writes you the answer.

Each part of this kitchen represents something specific. The cook stands for the model, and the warehouse for the app’s program, which carries out actions on your computer. The delivery note represents the result returned as text. The table is the [context window](https://ki-einfach-verstehen.de/en/glossary/context-window/): everything the model currently has in front of it. The model continues the existing text piece by piece, as described in the lesson [From Text Predictor to Assistant](./from-text-predictor-to-assistant.md).

A [tool](https://ki-einfach-verstehen.de/en/glossary/tool/) is a program that, for example, searches for something, reads a file or runs a command on the computer. If the model needs such a tool, it writes a request in a fixed format: the [tool call](https://ki-einfach-verstehen.de/en/glossary/tool-call/). This text alone does not carry anything out. Anthropic's documentation puts it this way: the model does not execute anything itself. It emits a structured request, and the code of the application or the servers of the provider carry it out.

The cook cannot see the warehouse. The cook only sees the slip they write and, later, the delivery note. The picture therefore shows a closed serving hatch and no warehouse behind it. The blank order slip on the counter is your request before the cook picks it up. The slip on the ledge is the one the cook writes.

![Calm cook places a blank slip on the ledge of a closed serving hatch, an empty order slip lies at the front of the counter](../../public/bausteine/vom-chatbot-zum-agenten/bestellzettel.webp)

*A commercial kitchen as a picture of the loop: the cook puts the slip on the ledge of the closed hatch. The warehouse stays out of sight, and the cook never enters it.*

The picture has one flaw: it does not show that after each delivery note the cook decides for themselves what to write next. From the warehouse the cook only knows what lies on the table, such as the delivery note. The goods themselves are never on the cook's table. The same holds for a model: it does not know a file on your computer until a program opens it and places the content as text on the table. What is not on the table, the model does not see in this run.

An example: you ask [Claude Code](https://code.claude.com/docs/en/overview), a programming tool from Anthropic, to rename entwurf.txt to kapitel3.txt. The model then writes a call for the rename.

## The delivery note comes back to the table

One call may not be enough to finish a task. The steps may need to repeat in a loop: the model writes a call, the program runs it, the result returns to the table, and the model continues writing. Along with each response, the interface—the connection between the app and the model—reports why the model stopped writing. If the model has written a tool call, the application runs the tool and sends back the result. A normal answer without a call ends the loop.

An invented run makes this tangible. You ask: “Rename entwurf.txt to kapitel3.txt.” The run has six lines. Each line is a call by the model, an execution by the program, a question back to you, or a result that comes back as text:

1. The model writes: call `liste_dateien` for the folder Entwürfe.
2. Result as text: “entwurf.txt, notizen.txt”.
3. The model writes: call `benenne_um`, entwurf.txt becomes kapitel3.txt.
4. The program asks you: may entwurf.txt be renamed to kapitel3.txt?
5. You answer: yes. Result as text: “successful”.
6. The model writes: “The file has been renamed.” as its answer to you.

![Four stations: model writes the call, program runs it, the result comes back as text, model writes on](../../public/bausteine/vom-chatbot-zum-agenten/tool-loop.svg)

*The loop as a chain: the model writes the call, the program runs it, the result comes back as text, and the model writes on.*

The model writes the call, the program runs it, and the result comes back as text. Keeping these three steps separate helps you identify what each line in a log represents.

The model never saw the file itself. It only saw what was on the table: its own calls and the results the program added. This works just like the text continuation described in lesson 1: each new piece of text is based on everything that came before.

Anthropic's documentation shows the same pattern with a weather tool: the model calls it with the location San Francisco. This example comes from the vendor documentation, not from the log of an actual run.

> **Interactive demo:** [try it on the website](https://ki-einfach-verstehen.de/en/lessons/from-chatbot-to-agent/)

<details class="verstaendnishilfe">
<summary>How does the program know that a call is coming?</summary>

The interface sends the call in a separate, structured block labelled `tool_use`. This block contains the tool’s name and the details it needs to run. The program does not have to pick the call out of ordinary text.
The program reads the type and name from the block and runs the tool only if the permission allows it. You do not see this block in the chat; you only see the result that comes back as text.

</details>

The combination of model and program is the agent.

## Who may open the warehouse?

The slip is a request. Whether the warehouse fulfils it depends on a list that hangs at the warehouse and that you or the app set in its settings. In the program this list is called a [permission](https://ki-einfach-verstehen.de/en/glossary/permission/). It determines which calls run without asking, which trigger a question, and which do not run at all.

The Claude Code documentation says so explicitly: Claude Code enforces permission rules, not the model. Instructions you give in the conversation or that are in the CLAUDE.md file (a text file with instructions for Claude Code) shape what Claude tries. They do not change what Claude Code allows.

Permission modes determine when Claude Code asks for your approval. In `default` mode, it asks before making changes, such as renaming a file; it can read files in the project without asking. In `dontAsk` mode, it refuses any action that would normally require approval. It can still read files in the project folder without asking.

Where a call runs depends on the location of the tool. If a program such as Claude Code runs it on your computer, the program checks the permission first. In the kitchen picture this check sits between slip and warehouse. A tool that the provider runs itself on its servers, such as the web search in the API, runs without a check by your program; you only see the result. In Claude Code it is different: there the program asks before the web search.

![Top: app on your computer, permission in between, then the result as text. Bottom: provider runs it, you only see the result.](../../public/bausteine/vom-chatbot-zum-agenten/who-runs-it.svg)

*Who runs it? A tool of the app runs on your computer behind the permission; a tool of the provider is run by the provider. In both cases the result comes back as text.*

If the program refuses, that refusal also comes back as text onto the table. If it first asks the human, the human's answer comes back as text. In Claude Code the permission is a rule of the program that the model cannot rewrite. A polite request in the conversation changes nothing about this rule.

> **Interactive demo:** [try it on the website](https://ki-einfach-verstehen.de/en/lessons/from-chatbot-to-agent/)

## The end of a run says nothing about correctness

When the model writes an answer without another tool call, the loop ends and the program stops working. This tells you only that the model has requested no further action. It tells you nothing about whether the result is correct. A run that ends with “done” may have renamed the wrong file.

During training, a model gets feedback on its solutions. But this feedback does not always distinguish between actually solving a task and merely appearing to solve it. The system card for Claude 3.7 Sonnet is an accompanying document in which Anthropic describes a model. It says: Claude 3.7 Sonnet occasionally passed tests in programming tasks without solving the task properly. Most often the expected test values were returned directly instead of a general solution being written; changing the tests themselves also occurs. This happens above all after several failed attempts at a solution and, according to Anthropic, is rare in normal use. Anthropic traces this back to “reward hacking” in reinforcement learning. That is why you check the result yourself.

A result that can be checked is not the same as a solved task. The loop delivers a result. Whether it is correct, you have to check.

![Four stations: no call left, loop ends, result in hand, human or test checks](../../public/bausteine/vom-chatbot-zum-agenten/stop-and-check.svg)

*The end of the loop is a station: after the last call comes a result that still has to be checked. The check is not part of the loop.*

None of the first three stations decides whether the result is correct. Only a check by a human or a test does that.

## Where the loop goes wrong

Each step adds text to the table. If a tool returns a wrong result, it stays there and can influence later steps until older text is removed. The longer the sequence, the more steps a single error can affect. Systems that use agents often need more time and money to produce better results. Anthropic therefore advises choosing the simplest possible solution first and increasing complexity only when needed. Not every task needs an agent.

Space on the table is limited too. With each step, calls and results are added, until the [context window](https://ki-einfach-verstehen.de/en/glossary/context-window/) is full. Anthropic offers compaction for this: older parts of the conversation are replaced by a summary. According to Anthropic, the feature is in beta.

![Left a tall stack of blank slips, right one folded summary slip, an arrow between them](../../public/bausteine/vom-chatbot-zum-agenten/zettelstapel.webp)

*Compaction: a stack of older slips is replaced by a single folded summary slip. The picture shows how the slips are replaced; it does not show what the summary says.*

A result from a tool can also contain instructions. It is text in the context like everything else. An invented example: the agent opens a web page, and there is a hidden sentence telling it to forget its earlier instructions. The model reads this sentence together with the rest of the page. This is called [prompt injection](https://ki-einfach-verstehen.de/en/glossary/prompt-injection/). Anthropic describes prompt injection as a significant risk for agents that read web pages. You often cannot tell from the result whether the model followed those hidden instructions. If your agent reads web pages, check its result yourself rather than relying on the model’s built-in protections.

Three things can therefore cause trouble: a tool returns a wrong result, the table fills up, or the model treats text in a result as an instruction. In each case, you remain responsible for the result.

## What remains in the end

A chatbot writes text. As an agent it writes calls, and a program carries them out according to rules that are not stored in the model. The result comes back as text, and the loop ends when no further calls follow. If you use the result, you have to check it.

**Exercise: Who writes, who runs it?**

The following log shows an invented agent run in dontAsk mode. The file notizen.txt is in the project folder. Assign each line to one of four categories: *Model writes*, *Program runs it*, *Result as text*, *Human checks*.

1. Call `lese_datei` for notizen.txt
2. Text on the table: “Inhalt: Termin am 3. März”
3. Call `loesche_datei` for notizen.txt
4. The program enforces the permission rule for `loesche_datei`.
5. Text on the table: “Refused: deleting is not allowed in this mode.”
6. Answer to you: “I did not delete the file.”
7. You open notizen.txt and check whether it is still there and unchanged.

**Solution:**

1. Model writes: a call in the fixed format.
2. Result: The program read the content and put it on the table.
3. Model writes: a call in the fixed format.
4. Program runs it: It enforces the rule.
5. Result: The refusal comes back as text.
6. Model writes: This sentence is only text. Your check in line 7 shows whether it is true.
7. Human checks: Only your check shows whether the file is still there. The model has checked nothing.

A model works through a task by writing calls; a program executes them under its rules.

---

Source: https://ki-einfach-verstehen.de/en/lessons/from-chatbot-to-agent/

← Previous: [What a Chatbot Knows in a Conversation: Four Sources, One Context Window](./what-a-chatbot-knows-in-a-conversation.md) · [All lessons](../../README.md#contents) · Next: [Does AI Understand What It Says?](./does-ai-understand-what-it-says.md) →
