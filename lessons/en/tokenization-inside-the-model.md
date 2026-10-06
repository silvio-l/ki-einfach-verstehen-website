<!-- Generated from src/content/bausteine/en/tokenization-inside-the-model.mdx by scripts/export-lessons.mjs -- do not edit by hand. -->

# Tokenization Inside the Model: How Your Chat Becomes a Token Sequence

> Reading copy for GitHub. The full version with interactive demos, animations and recall moments is on the website: **[Tokenization Inside the Model: How Your Chat Becomes a Token Sequence](https://ki-einfach-verstehen.de/en/lessons/tokenization-inside-the-model/)**
>
> Licence: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.en) · Credit it as: KI einfach verstehen, “Tokenization Inside the Model: How Your Chat Becomes a Token Sequence”, CC BY 4.0, https://ki-einfach-verstehen.de/en/lessons/tokenization-inside-the-model/

How a chat with roles becomes a single token sequence, what special tokens do along the way, why vocabulary size is a trade-off, and what all has to fit into the context window.

“What is the capital of France?” Six words and a question mark. Beforehand, the chatbot also got the instruction “Answer briefly.” Guess before you read on: how many **[tokens](https://ki-einfach-verstehen.de/en/glossary/token/)** reach the **[model](https://ki-einfach-verstehen.de/en/glossary/model/)** when you send this question? Ten? Twenty?

A model’s knowledge sits in billions of numbers, as the previous lesson showed. Before the model can compute with them, though, your chat has to become one long token sequence that also records who said what. You already know how a **[tokenizer](https://ki-einfach-verstehen.de/en/glossary/tokenizer/)** splits a sentence. This lesson covers everything around it: how several messages become one sequence, how large the **[vocabulary](https://ki-einfach-verstehen.de/en/glossary/vocabulary/)** should be, and how long the sequence may get.

## Your chat is one long text

A chat window shows separate speech bubbles. So it is tempting to think the model gets only the latest bubble, and that the roles “you” and “assistant” arrive separately. Neither is true. A **[language model](https://ki-einfach-verstehen.de/en/glossary/language-model/)** can do just one thing: continue a sequence of tokens. So the program around it has to turn the whole conversation into one sequence.

That is the job of the **[chat template](https://ki-einfach-verstehen.de/en/glossary/chat-template/)**, a fixed pattern every chat model comes with. It lines up the messages, each with its role, in this pattern. Common roles are “system” for instructions, “user” for you, and “assistant” for the model. The system text usually comes from the chat app’s provider, and you normally do not see it. For the chat from the start, the template of Meta’s openly available Llama 3.1 8B produces this text:

```text
<|begin_of_text|><|start_header_id|>system<|end_header_id|>

Cutting Knowledge Date: December 2023
Today Date: 26 Jul 2024

Answer briefly.<|eot_id|><|start_header_id|>user<|end_header_id|>

What is the capital of France?<|eot_id|><|start_header_id|>assistant<|end_header_id|>

```

Counted with the real tokenizer for this lesson, that is 45 tokens. Your question is only seven of them. Nine are **[special tokens](https://ki-einfach-verstehen.de/en/glossary/special-token/)**, the entries in angle brackets. The lesson on the [tokenizer](./tokenizer-ids-vocabulary.md) introduced such structural entries.

![Animation: how a chat becomes a token sequence](../../public/bausteine/tokenisierung-im-modell/chat-becomes-sequence.static.svg)

[▶ watch the animation on the website](https://ki-einfach-verstehen.de/en/lessons/tokenization-inside-the-model/)

*With Llama 3.1, two messages with roles become a single sequence of 45 tokens that ends with an open answer role.*

![A freight train of many petrol-colored wagons with two amber wagons in between, rounding a curve toward a buffer stop at the end of the track](../../public/bausteine/tokenisierung-im-modell/zug.png)

*The token sequence as a freight train: ordinary wagons for pieces of text, differently colored marker wagons for the special tokens, a buffer stop as the limit.*

You can picture the finished sequence as a long freight train. Each wagon is a token. Between the ordinary wagons hang differently colored marker wagons. They show where a role name stands, where a message ends, and where the next one begins. The picture has two limits. A wagon carries no meaningful cargo, only a number on its side: its ID in the vocabulary. And the markers only work because the model saw countless trains with exactly these markers in training.

If you follow the answer “Paris.” with “And Italy?”, the template rebuilds the whole train: system text, first question, old answer, new question, with markers in between. The 45 tokens become 60. As the lesson on [input and output](./input-and-output.md) showed, the history is resent every round.

## Text you never wrote

Two lines in the Llama sequence come from neither you nor the model: “Cutting Knowledge Date: December 2023” and “Today Date: 26 Jul 2024”. The template inserts them itself. The first states the knowledge cutoff: the model saw no texts after December 2023 in training. The second is a preset that applies when the program passes no current date. You never see these lines; the model reads them with every request.

How much is added depends on the model. Run the same chat through the official templates of four openly available models, and the lengths differ widely:

![Bar chart: Gemma 3 1B 20 tokens, no system role; Qwen3-8B 23 tokens, plain role markers; Llama 3.1 8B 45 tokens, inserts two date lines; gpt-oss-20b 84 tokens, puts its own system message in front](../../public/bausteine/tokenisierung-im-modell/four-templates.svg)

*The same chat, four chat templates: between 20 and 84 tokens, depending on what the template adds (counted on October 6, 2026).*

Google’s Gemma 3 comes to 20 tokens. It has no system role at all: its template simply glues “Answer briefly.” in front of your question. Alibaba’s Qwen3 needs 23: it wraps each message in the plain markers `<|im_start|>` plus role name and `<|im_end|>`, nothing more. Llama, with its date lines, lands at 45. OpenAI’s gpt-oss comes to 84, because its template prepends its own system text with a date, a knowledge cutoff, and notes on the answer format.

So what you type is not all that counts: the template helps decide how long the train gets and what a request costs when billing is per token. And the template is no formality, as the next section shows.

So far, then: messages, answers, extra text, and markers all become one sequence. But what do the markers actually do?

## Marker wagons: how the model recognizes roles and endings

![Flag](../../public/bausteine/tokenisierung-im-modell/flagge.svg)

*An end token works like a finish flag: it shows that a turn is over.*

The special tokens in the Llama sequence have fixed jobs. `<|begin_of_text|>` marks the very start. `<|start_header_id|>` and `<|end_header_id|>` enclose a role name: “system”, “user”, or “assistant”. `<|eot_id|>`, short for “end of turn”, ends a turn. The role names, too, are just tokens in the sequence. The model learned to treat system text differently from your question by seeing countless training conversations in exactly this format.

Note how the sequence ends: not right after your question, but with an open header for the role “assistant” and nothing after it. What do you think would happen without this header? The signal for who speaks next would be missing, and the model would have to guess how the sequence continues. It might write the header itself, or do something odd, such as continue your message or invent a new user question. The widely used Transformers library warns about exactly this in its documentation. The open header is a kind of stage direction: from here on, the assistant speaks.

And how does the model know its answer is done? In the human sense, it does not. In its training conversations, every answer ended with `<|eot_id|>`, so it produces this marker at a similar point itself. The program watches for this ID and stops once it appears, or at a set length limit at the latest. In Llama 3.1, the pre-trained base models, not yet fine-tuned for conversations, end text with `<|end_of_text|>`; the chat models use `<|eot_id|>`. Both markers are in the same vocabulary. Training alone taught the model which one to pick. If a program waits for the wrong marker, it does not stop there: the model writes on past the end of its answer, say an invented next turn, until the length limit kicks in.

That is why a wrong template does so much harm. If a program sends a Llama model Gemma’s markers, the tokenizer finds no special tokens for them. It splits `<start_of_turn>` into ordinary text pieces, normal wagons. The sequence then no longer resembles the model’s training conversations. The same Transformers documentation warns that chat models perform drastically worse with the wrong control tokens. OpenAI writes that the gpt-oss models only work correctly with their own format.

<details>
<summary>One level deeper: why gpt-oss knows two different endings</summary>

The tokenizer lesson introduced “harmony”, the gpt-oss conversation format: `<|start|>`, the role, `<|message|>`, the content, and `<|end|>` with ID 200007. During generation, though, a finished answer ends not with `<|end|>` but with `<|return|>`, ID 200002. The program stops at `<|return|>` and, when the model wants to call a tool such as a web search, at `<|call|>`. `<|end|>` is not a stop token.

The reason: one turn of the model can consist of several messages. gpt-oss may first write intermediate reasoning into a channel called “analysis”, then the actual answer into “final”. The first message ends with `<|end|>`, and the model carries on. Only `<|return|>` means the whole answer is done.

When the answer is stored in the history, the program replaces the final `<|return|>` with `<|end|>`. One marker separates messages, the other ends the work.

</details>

## How big should the vocabulary be?

And how many different ordinary wagons should there be? What do you think: if one vocabulary has four times as many entries as another, does the same text need a quarter of the tokens? Five real tokenizers, tested on an English sentence and its German translation:

| Tokenizer | Entries in the vocabulary | Tokens for “The cat is sitting on the windowsill.” | Tokens for “Die Katze sitzt auf dem Fensterbrett.” |
| :--- | ---: | ---: | ---: |
| Llama 2 | 32,000 | 9 | 12 |
| GPT-2 | 50,257 | 9 | 14 |
| Llama 3.1 | 128,256 | 9 | 12 |
| gpt-oss | about 200,000 | 9 | 9 |
| Gemma 3 | 262,144 | 8 | 9 |

![Balance scale](../../public/bausteine/tokenisierung-im-modell/waage.svg)

*Vocabulary size is a trade-off: shorter sequences on one side, larger tables on the other.*

For the English sentence, size hardly matters: its short, common words are whole entries almost everywhere. The German sentence shows differences. Roughly, larger vocabularies make it shorter, but not consistently: GPT-2 has more entries than Llama 2 and still needs more tokens. Savings also depend on the texts a vocabulary was learned from. gpt-oss has “␣Katze” and “␣sitzt” (“cat”, “sits”), with the leading space, as whole entries; smaller vocabularies assemble them from pieces. Shorter sequences mean fewer rounds in the text loop and more text per context window. But the sequence does not shrink to a quarter: with four times the entries, Llama 3.1 needs as many tokens as Llama 2. And a larger vocabulary has a price.

In the lesson on [scalar, vector, matrix, and tensor](./scalar-vector-matrix-tensor.md), you saw that every token ID selects a row in a large table: one row per vocabulary entry, with 4,096 numbers each in Llama 3.1 8B. At the output, the model usually needs a second table of the same size: it gives out a **[score](https://ki-einfach-verstehen.de/en/glossary/score/)** for every entry, computed from that entry’s own row of 4,096 learned numbers. For Llama 2 7B, also with 4,096 numbers per row, that is 32,000 × 4,096, about 131 million numbers per table. For Llama 3.1: 128,256 × 4,096, about 525 million. So every new wagon type enlarges both tables.

![Two cards: Llama 2 7B with 32,000 entries, English test paragraph 62 tokens, German 87, input and output tables 262 million numbers; Llama 3.1 8B with 128,256 entries, English 55, German 87, tables 1.05 billion numbers](../../public/bausteine/tokenisierung-im-modell/vocabulary-tradeoff.svg)

*Llama 2 versus Llama 3.1: four times as many entries, somewhat fewer tokens in the English test paragraph, no savings in the German one, but input and output tables four times as large.*

Meta made this switch from Llama 2 to Llama 3 and reports up to 15 percent fewer tokens. A test paragraph in both languages shows why the “up to” matters. The English one shrank from 62 to 55 tokens, about 11 percent. The German one stayed at 87. And with both models, German needs clearly more tokens than English for the same content. Chatting in German, or in many other languages besides English, therefore fills the context window faster and costs more when billing is per token.

There is a third catch. The larger the vocabulary, the more entries barely appear in training, so their rows are learned less well. A 2024 study concludes that the best size depends on the model. A large model trained on lots of text sees even rare entries often enough. For Llama 2 70B, the authors therefore estimate at least 216,000 entries instead of the actual 32,000. For a small model, though, even a medium-sized vocabulary can be too large.

<details>
<summary>One level deeper: how much of the model sits in the vocabulary</summary>

The tables’ weight shows in their share of all parameters. In Llama 3.1 8B, the input and output tables are separate and equally large. Together that is 2 × 525,336,576 = 1,050,673,152 numbers, a good 13 percent of the model’s roughly 8 billion parameters. In Llama 2 7B, they came to about 262 million, just under 4 percent of its roughly 7 billion. The larger vocabulary more than tripled the share.

In small models, the vocabulary weighs even more. Gemma 3 1B has 262,144 entries with 1,152 numbers each: 301,989,888 numbers. Gemma uses this one table for both input and output. Even so, according to Google’s technical report, almost a third of the whole model sits in it: 302 million of about one billion parameters. In return, the report says, this vocabulary is more balanced for languages other than English. That, too, is part of the trade-off.

</details>

## The context window is a budget

That leaves the question of how long the train may get: where does the buffer stop stand? You know the answer from the tokenizer lesson: as long as the **[context window](https://ki-einfach-verstehen.de/en/glossary/context-window/)**, the maximum number of token positions a model can process at once. In 2019, GPT-2 managed only 1,024 positions. Llama 3.1 reaches up to 128,000 tokens. Anthropic says its Claude Opus 5.5 handles a million.

Many people assume only what you type has to fit into this window. That sounds plausible, since the answer comes afterward. According to Anthropic and OpenAI, though, everything in a request counts: system text and template additions, descriptions of tools the model may use (a web search, say), attached documents, the whole history, your new message, and the answer itself. Models that “think” first add thinking tokens: intermediate steps written before the actual answer. You often do not see them, but they take up space.

![A bar for a context window of 128,000 tokens: system text and tools 3,000, earlier history 115,000, your new message 2,000, free for thinking and answer 8,000](../../public/bausteine/tokenisierung-im-modell/context-budget.svg)

*A made-up example: if system text, history, and the new message take up 120,000 of 128,000 tokens, only 8,000 remain for thinking and answer together.*

Suppose your model’s window holds 128,000 tokens and you have chatted for a long time. System text and tools take 3,000 tokens, the history 115,000, your new question 2,000. What if the model needed 12,000 tokens for a thorough answer? It has only 8,000, thinking tokens included. If it reaches the limit while writing, the answer breaks off. Unlike a household budget, the context window cannot be overdrawn.

Here the train picture hits another limit: a real train is assembled before departure; the token train grows at the back while the model answers, until the end token or the buffer stop.

If the input alone is too long, Claude’s developer API, for example, rejects the request: “prompt is too long”. Chat applications therefore make room beforehand: according to Anthropic, claude.ai can let the oldest parts of a conversation drop out bit by bit; developers can have them summarized instead. That is often why a chatbot seems to forget the start of a long chat: that part no longer rides along. Even what remains gets less reliable attention in very long sequences.

Two more misunderstandings are common. First, the context window is not the length of the answer: OpenAI gives GPT-6 Luna a window of 1,050,000 tokens but at most 128,000 output tokens. Second, a huge window does not mean a perfect memory. Anthropic itself warns that accuracy and recall degrade as the token count grows.

## In the end there is a sequence of numbers

That completes the path from chat window to model. The chat template assembles system text, history, and your message with special tokens into one text and leaves an answer role open. The tokenizer turns it into tokens from a vocabulary of fixed size, and each token gets its **[token ID](https://ki-einfach-verstehen.de/en/glossary/token-id/)**. The whole sequence, including thinking tokens and answer, must fit into the context window. And the guess from the start? Two short sentences became 45 tokens with Llama 3.1 and 84 with gpt-oss.

What the model now holds is a sequence of numbers. But an ID is only a label, like a barcode on a package: it tells the checkout which item it is, not what is inside. You cannot compute anything meaningful with a 128009. How does it become something the model can compute with? That is the next lesson.

If you remember one sentence, make it this: **Your whole chat becomes a single token sequence with role markers, and this sequence, together with the answer, has to fit into the limited context window.**

---

Source: https://ki-einfach-verstehen.de/en/lessons/tokenization-inside-the-model/

← Previous: [What an AI Model Actually Is](./what-an-ai-model-actually-is.md) · [All lessons](../../README.md#contents) · Next: [Embeddings: How a Number Becomes a Meaningful Vector](./embeddings.md) →
