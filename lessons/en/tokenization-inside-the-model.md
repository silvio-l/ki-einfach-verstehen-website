<!-- Generated from src/content/bausteine/en/tokenization-inside-the-model.mdx by scripts/export-lessons.mjs -- do not edit by hand. -->

# Tokenization Inside the Model: How Your Chat Becomes a Token Sequence

> Reading copy for GitHub. The full version with interactive demos, animations and recall moments is on the website: **[Tokenization Inside the Model: How Your Chat Becomes a Token Sequence](https://ki-einfach-verstehen.de/en/lessons/tokenization-inside-the-model/)**
>
> Licence: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.en) · Credit it as: KI einfach verstehen, “Tokenization Inside the Model: How Your Chat Becomes a Token Sequence”, CC BY 4.0, https://ki-einfach-verstehen.de/en/lessons/tokenization-inside-the-model/

How a chat with roles becomes a single token sequence, what special tokens are for, and what all has to fit into the context window.

“What is the capital of France?” Six words and a question mark. Beforehand, the chatbot also got the instruction “Answer briefly.” Guess before you read on: how many [tokens](https://ki-einfach-verstehen.de/en/glossary/token/) reach the [model](https://ki-einfach-verstehen.de/en/glossary/model/) when you send this question? Ten? Twenty?

Before a model computes anything, your chat has to become a single sequence of tokens that also records who said what. You know what a [tokenizer](https://ki-einfach-verstehen.de/en/glossary/tokenizer/) does from the lesson on the [tokenizer](./tokenizer-ids-vocabulary.md): it splits text into pieces from a fixed list, the [vocabulary](https://ki-einfach-verstehen.de/en/glossary/vocabulary/), and each piece gets a number. This lesson covers what happens around it.

## Your chat is one long text

A chat window shows separate speech bubbles, as if the model got only the latest one and the roles arrived over separate lines. Neither is true. A [language model](https://ki-einfach-verstehen.de/en/glossary/language-model/) **can do just one thing: continue a sequence of tokens.** So the program around the model has to turn the whole conversation into one sequence.

That is the job of the **[chat template](https://ki-einfach-verstehen.de/en/glossary/chat-template/)**. A model consists not only of the blueprint and numbers from the lesson on [parameters](./parameters-training-inference-hardware.md). It also comes with small accompanying files, and one of them sets how a conversation is turned into text: the chat template, a fixed pattern that lines up the messages with their roles. Common roles are “system” for instructions, “user” for you, and “assistant” for the model. The provider of the chat app writes the hidden system text.

The example is Meta’s Llama 3.1 8B Instruct, the chat version of the model from the parameters lesson. Its template turns the chat from the start into this:

```text
<|begin_of_text|><|start_header_id|>system<|end_header_id|>

Cutting Knowledge Date: December 2023
Today Date: 26 Jul 2024

Answer briefly.<|eot_id|><|start_header_id|>user<|end_header_id|>

What is the capital of France?<|eot_id|><|start_header_id|>assistant<|end_header_id|>

```

Counted with the real tokenizer, that is 45 tokens. Only 10 of them come from the chat: seven from your question and three from the instruction. The template added the other 35: three role names, some line breaks, two lines of text you never wrote, and nine entries in angle brackets.

These nine are **[special tokens](https://ki-einfach-verstehen.de/en/glossary/special-token/)**: they stand for structure, not text. You know one of this kind: the stop marker from the lesson on [input and output](./input-and-output.md), called an **end token** here. It is a vocabulary entry, but no visible character; it shows that a text is over. A conversation with roles needs more such markers.

![Animation: how a chat becomes a token sequence](../../public/bausteine/tokenisierung-im-modell/chat-becomes-sequence.static.svg)

[▶ watch the animation on the website](https://ki-einfach-verstehen.de/en/lessons/tokenization-inside-the-model/)

*With Llama 3.1, two messages with roles become a single sequence of 45 tokens that ends with an open header for the answer.*

![A freight train of many petrol-colored wagons with two amber wagons in between, rounding a curve toward a buffer stop at the end of the track](../../public/bausteine/tokenisierung-im-modell/zug.png)

*The token sequence as a freight train: ordinary wagons for pieces of text, differently colored marker wagons for the special tokens, and a buffer stop for the maximum length that the end of this lesson covers.*

You can picture the finished sequence as a long freight train. Each wagon is a token. Differently colored marker wagons show where a role name stands and where a message ends. At the end of the track is a buffer stop, covered in the last section. The picture has two limits. A wagon carries no meaningful cargo, only a number on its side: its ID in the vocabulary. And the markers only work because the model saw countless trains with exactly these markers in training. If you follow “Paris.” with “And Italy?”, the template rebuilds the whole train with system text, first question, old answer, and new question. The 45 tokens become 60. As in the lesson on input and output, the history goes along with every message, because the model remembers nothing in between.

## Text you never wrote

Two lines in the Llama sequence come from neither you nor the model: “Cutting Knowledge Date: December 2023” and “Today Date: 26 Jul 2024”. The template inserts them itself. The first states the knowledge cutoff: the model saw no texts after December 2023 in training. The second is a preset that applies when the program passes no current date. The model reads them with every request.

How much extra text is added depends on the model. The same chat, run through the official templates of four openly available models, gives between 20 and 84 tokens. Only the addition changes:

![Stacked bar chart, per model from the chat and added by the template: Gemma 3 1B 10 plus 10 equals 20 tokens, no system role; Qwen3-8B 10 plus 13 equals 23, plain role markers; Llama 3.1 8B 10 plus 35 equals 45, inserts two date lines; gpt-oss-20b 10 plus 74 equals 84, puts its own system message in front](../../public/bausteine/tokenisierung-im-modell/four-templates.svg)

*The same chat, four chat templates: the part from the chat stays the same, the template’s addition ranges from 10 to 74 tokens (counted on October 6, 2026).*

The shortest templates only put plain markers around the messages. The longest belongs to gpt-oss, openly available models from OpenAI, the company behind ChatGPT. It prepends a system text of its own. Its markers also look different from Llama’s: each message starts with `<|start|>` and ends with `<|end|>`.

> **Interactive demo:** [try it on the website](https://ki-einfach-verstehen.de/en/lessons/tokenization-inside-the-model/)

So **the template helps decide how long the train gets** and what a request costs when billing is per token. But what do the markers actually do?

## Marker wagons: how the model recognizes roles and endings

![Flag](../../public/bausteine/tokenisierung-im-modell/flagge.svg)

*An end token works like a finish flag: it shows that a turn is over.*

The special tokens in the Llama sequence have fixed jobs. `<|begin_of_text|>` marks the very start. `<|start_header_id|>` and `<|end_header_id|>` enclose a role name: “system”, “user”, or “assistant”; together, the three form the header of a message. `<|eot_id|>` ends a turn; the name stands for “end of turn”. How does the model know to treat the system text differently from your question? From further training, which the lesson on input and output introduced: after basic training on ordinary text, a model is trained further on example conversations to answer like a helpful chatbot. These conversations use exactly this format and these markers. A model that has only had basic training is called a **base model**.

Note how the sequence ends: with an open header for the role “assistant” and nothing after it yet. What happens if this header is missing? Then nothing signals who speaks next, and the model might continue your message instead of answering it. The guide of the Hugging Face platform, which distributes openly available models such as Llama, warns about this. **The open header is a stage direction: from here on, the assistant speaks.**

And how does the model know its answer is done? In the human sense, it does not. Remember the loop: in every round, the model outputs a score list with one score per vocabulary entry, a selection step picks one token, and it is appended. `<|eot_id|>` is such an entry, with its own score. In further training, it ended every answer, so it scores high when an answer seems finished. The program watches for this ID: if the selection step picks it, the program stops, or at a set length limit at the latest.

Llama 3.1 has two different markers for this. Base models end a text with `<|end_of_text|>`, chat models end an answer with `<|eot_id|>`. Training alone taught the model which one to pick. If a program waits for the wrong marker with the chat model, it does not stop: the model writes on past its answer, say an invented next turn, until the length limit kicks in.

That is why a wrong template does so much harm. If a program sends a Llama model the markers of gpt-oss, the Llama tokenizer finds no special entry for `<|start|>`. It splits the string into five ordinary pieces: `<`, `|`, `start`, `|`, and `>`. Five normal wagons replace one marker wagon, and the sequence no longer looks like the training conversations. Hugging Face warns that chat models perform drastically worse with the wrong markers. OpenAI writes that the gpt-oss models only work correctly with their own format.

## How big should the vocabulary be?

So far, a wagon was a token in the sequence. Now it is about how many different wagon types there are: how many cards the card index from the tokenizer lesson holds, each with a text piece and its number. How large should this vocabulary be?

A made-up example: in the tokenizer lesson, a mini vocabulary had five entries, “The”, “␣cat”, “s”, “␣sit”, and “.”. The sign ␣ stands for a space that belongs to the piece. “The cats sit.” becomes five tokens with it. With “␣cats” as a sixth entry, it takes only four. Is the new entry a pure gain?

No, because **every entry takes up space in the model twice**. First at the input: the same number the tokenizer uses to find a text piece is a page number in the model. Remember the reference book from the lesson on [scalar, vector, matrix, and tensor](./scalar-vector-matrix-tensor.md)? It has one page for every entry, and each page holds a list of learned numbers. In the computer, each page is a row of a table, called the **input table** here.

Second at the output: there, the model gives out a [score](https://ki-einfach-verstehen.de/en/glossary/score/) for every entry in every round, usually using a second table, the **output table**, again with one row per entry. The computation ends with intermediate values for the last position, a list of numbers, which the model compares with each entry’s row: the better they match, the higher that entry’s score. The lesson on the model’s exit, the output head, shows how.

![Two cards. Left, a vocabulary with 5 entries: The, space-cat, s, space-sit, period; The cats sit becomes 5 tokens; input and output tables with 5 rows each. Right, a vocabulary with 6 entries, adding space-cats; the sentence becomes 4 tokens; both tables with 6 rows each, the new row highlighted](../../public/bausteine/tokenisierung-im-modell/toy-vocabulary.svg)

*A made-up mini vocabulary: with the sixth entry “␣cats”, the sentence gets one token shorter, but the input and output tables each get one more row.*

In the toy example, give each row four made-up numbers. With five entries, both tables together hold 2 × 5 × 4 = 40 numbers; with six entries, 48. A fifth more numbers for a fifth fewer tokens. But the new row always costs, and it only saves when “cats” appears in the text. In a sentence about dogs, it brings nothing.

## What a large vocabulary costs and saves

![Balance scale](../../public/bausteine/tokenisierung-im-modell/waage.svg)

*Vocabulary size is a trade-off: shorter sequences on one side, larger tables on the other.*

With real models, Meta roughly quadrupled the vocabulary from Llama 2 to its successor Llama 3, on which Llama 3.1 builds: from 32,000 to just over 128,000 entries. Both tables grew fourfold too, to just over a billion numbers, all parameters. At 2 bytes per number, the rule of thumb from the parameters lesson, that is about 2 gigabytes for Llama 3.1. Plus computing work: four times as many scores per round.

Then does the same text need only a quarter of the tokens? Meta promises up to 15 percent fewer. A test shows why the “up to” matters. “The cat is sitting on the windowsill.” takes 9 tokens with both Llama models. An English test paragraph got about a tenth shorter, a German one not at all. As in the toy example, **an entry only saves where its piece appears in the text**.

![Two cards: Llama 2 7B with 32,000 entries, English test paragraph 62 tokens, German 87, input and output tables together 262 million numbers, 2 times 131 million; Llama 3.1 8B with 128,256 entries, English 55, German 87, both tables together 1.05 billion numbers, 2 times 525 million](../../public/bausteine/tokenisierung-im-modell/vocabulary-tradeoff.svg)

*Llama 2 versus Llama 3.1: four times as many entries, somewhat fewer tokens in the English test paragraph, no savings in the German one, but input and output tables together four times as large.*

With both models, the German paragraph also needed clearly more tokens than the English one. That fits the tokenizer lesson: frequent text fits into few tokens, rare text falls apart, and for these vocabularies German words are rarer. Chatting in many languages besides English therefore fills the context window, the maximum length of the sequence, faster and costs more.

> **Interactive demo:** [try it on the website](https://ki-einfach-verstehen.de/en/lessons/tokenization-inside-the-model/)

There is a third price. The larger the vocabulary, the more entries barely appear in training. But an entry’s input row is only adjusted when its token appears, so rare entries get little practice. Researchers found such under-trained entries in widely used models; they can trigger strange behavior. So the best size depends on the model, a 2024 study concludes. A large model trained on lots of text sees even rare entries often enough. For a small one, even a medium-sized vocabulary can be too large.

<details>
<summary>One level deeper: how much of the model sits in the vocabulary</summary>

In Llama 3.1 8B, the input and output tables are separate: 128,256 × 4,096 = 525,336,576 numbers each. Together, 1,050,673,152 are a good 13 percent of the roughly 8 billion parameters. In Llama 2 7B, they came to about 262 million together, just under 4 percent.

In small models, the vocabulary weighs even more. Gemma 3 1B from Google has 262,144 entries with 1,152 numbers each, 301,989,888 numbers in all. Gemma uses this one table for both input and output: the same row serves as a page of the reference book at the input and for computing the score at the output. Even so, according to Google’s technical report, almost a third of the model sits in this table, 302 million of about one billion parameters.

</details>

## The context window is a budget

That leaves the question of where the buffer stop stands. In the tokenizer lesson, this limit was called the [context window](https://ki-einfach-verstehen.de/en/glossary/context-window/): the maximum number of token positions a model can process at once. For GPT-2, the older model you met in the lesson on input and output, it was only 1,024 in 2019. Llama 3.1 holds up to 128,000 tokens, by coincidence almost as many as its vocabulary has entries. The largest current models hold a million and more.

Many assume only your input must fit, since the answer comes afterward. According to Anthropic, the company behind the chatbot Claude, and OpenAI, though, **everything counts**. That includes system text and template additions, descriptions of tools the model may use, such as a web search, attached documents, the history, your new message, and the answer itself. Models that “think” before answering add **thinking tokens**: intermediate steps written as tokens before the actual answer, often invisible to you but taking up space.

![A bar for a context window of 100,000 tokens: system text and tools 3,000, earlier history 87,000, your new message 2,000, free for thinking and answer 8,000](../../public/bausteine/tokenisierung-im-modell/context-budget.svg)

*A made-up example: if system text, history, and the new message take up 92,000 of 100,000 tokens, only 8,000 remain for thinking and answer together.*

Suppose your model’s window holds 100,000 tokens and you have chatted for a long time. System text, tools, history, and your new question take 92,000 together. What happens if the model needed 12,000 tokens for a thorough answer? It has only 8,000, and the thinking tokens come out of that too. If the model reaches the limit while writing, the answer breaks off unfinished.

Here the train picture ends: a real freight train departs fully assembled, while the token train grows at the back as the model answers, until the end token or the buffer stop.

If the input is too long, Anthropic, for example, rejects the request with “prompt is too long”. Chat applications therefore make room: according to Anthropic, claude.ai can let the oldest parts of a conversation drop out bit by bit. That is often why a chatbot seems to forget the start of a long chat: that part no longer rides along.

Two more misunderstandings are common. First, the window is not the length of the answer: GPT-6 Luna, a current OpenAI model, holds just over a million tokens but may answer with only a good tenth of that. Second, a huge window is not a perfect memory. Anthropic itself warns that accuracy and recall degrade as the token count grows.

## In the end there is a sequence of numbers

The chat template assembles system text, history, and your message with special tokens into one text and leaves a header for the answer open. The tokenizer turns it into tokens, and each gets its [token ID](https://ki-einfach-verstehen.de/en/glossary/token-id/). The whole sequence, including the answer, must fit into the context window. And the guess from the start? With Llama 3.1, it came to 45 tokens, only 10 of them from the chat.

The model now has a sequence of numbers. But an ID is only a label, like a barcode: it tells the checkout which item it is, not what is inside. You cannot compute anything meaningful with the 417 that stood for “The” in the mini vocabulary. How it becomes something the model can compute with is the subject of the next lesson.

If you remember one sentence, make it this: Your whole chat becomes a single token sequence with role markers, and this sequence, together with the answer, has to fit into the limited context window.

---

Source: https://ki-einfach-verstehen.de/en/lessons/tokenization-inside-the-model/

← Previous: [What an AI Model Actually Is](./what-an-ai-model-actually-is.md) · [All lessons](../../README.md#contents) · Next: [Embeddings: How a Number Becomes a Meaningful Vector](./embeddings.md) →
