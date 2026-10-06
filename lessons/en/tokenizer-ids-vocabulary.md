<!-- Generated from src/content/bausteine/en/tokenizer-ids-vocabulary.mdx by scripts/export-lessons.mjs -- do not edit by hand. -->

# Tokenizers: How Language Becomes Numbers

> Reading copy for GitHub. The full version with interactive demos, animations and recall moments is on the website: **[Tokenizers: How Language Becomes Numbers](https://ki-einfach-verstehen.de/en/lessons/tokenizer-ids-vocabulary/)**
>
> Licence: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.en) · Credit it as: KI einfach verstehen, “Tokenizers: How Language Becomes Numbers”, CC BY 4.0, https://ki-einfach-verstehen.de/en/lessons/tokenizer-ids-vocabulary/

Shows how a tokenizer splits text into reusable pieces, numbers them through a fixed vocabulary, and turns them into the numerical input of a language model.

Before you read on, split this word into pieces in your head: **“unbelievable.”** One piece, three parts such as “un–believ–able,” or every letter on its own? All three could serve as input for a computer, but they lead to very different lists of numbers. This is exactly the decision a **[tokenizer](https://ki-einfach-verstehen.de/en/glossary/tokenizer/)** makes.

In the previous lesson, the **[input](https://ki-einfach-verstehen.de/en/glossary/input/)** of a **[language model](https://ki-einfach-verstehen.de/en/glossary/language-model/)** was still a sequence of “text pieces”. Now you see what happens in between: the text is cut into pieces, and every piece gets a number. Only this sequence of whole numbers goes into the **[model](https://ki-einfach-verstehen.de/en/glossary/model/)**.

## A model never gets to see text

Your screen might show “The cats sit.” To you, that is words, spaces, and a period. The model needs something else: a fixed list of text pieces that does not keep growing. You know why from the previous lesson: a language model outputs its own score for every text piece it knows. That only works if it is settled which text pieces exist and how many. And since every chosen piece is appended, the input uses this list too. Any text must therefore first be translated into these pieces.

The split decides how long the input is for the model: one visible word can become one, two, or many pieces. They are called **[tokens](https://ki-einfach-verstehen.de/en/glossary/token/)**. How text is split is fixed by the tokenizer before the model calculates anything.

The tokenizer does not understand the sentence; it works by fixed rules. So the same text gives the same token sequence with the same tokenizer. A different tokenizer may split it differently.

![The sentence The cats sit, split into five colored text pieces (The, space-cat, s, space-sit, period) and next to them the five numerical IDs 417, 82, 903, 771, 13](../../public/bausteine/tokenizer-ids-vokabular/text-to-ids.svg)

*A sentence is first split into text pieces, then turned into numerical IDs (invented example). The symbol ␣ marks a space that belongs to the piece.*

## Why not simply number every word?

The most obvious idea: take a dictionary and give every word a number, “The” 417, say, and “cats” 982. For a limited collection of texts, that works; for open-ended language, it does not.

Would the list need “friend,” “friendly,” “unfriendly,” “unfriendliness,” and every similar word? Plus names, typos, forms such as “learns” and “learned,” and words coined tomorrow. A list can grow large, but it stays limited, while language keeps forming new character sequences.

Unknown words could share a single placeholder, “unknown.” But then a chatbot would see nothing but “unknown” for every new name.

## Why not take every letter on its own?

At the other end lies an equally simple solution: every letter and punctuation mark becomes a token. Then almost any word can be assembled, even a new one, and for a single alphabet, the list of pieces stays small. “Cats,” however, now takes four tokens instead of perhaps one or two.

Every token takes up its own place in the input, called a position. In a long document, this multiplies the positions, and a model can only process a limited number of them at once. With spaces and the period, “The cats sit.” already has 13 character positions. A chatbot would also need a separate round of the loop from the previous lesson for every letter of its answer: output the score list, pick a piece, append it.

Single characters also carry very little. The model would have to rebuild frequent sequences such as “ing”, “tion”, or “str” from many positions. Whole words are too coarse; single characters are flexible but needlessly fine-grained. A workable middle ground is needed.

![Three possible splits of the word learning: as a whole word, into word pieces, and into single characters](../../public/bausteine/tokenizer-ids-vokabular/granularity.svg)

*The same character sequence, split three times at different levels of detail.*

## The useful middle ground: reusable word pieces

![A wooden building set on a table: in front, a long row of a few large blocks, filled up at the end with small blocks; behind it, a box with sorted large blocks and many small ones](../../public/bausteine/tokenizer-ids-vokabular/baukasten.webp)

*Subword tokens work like a building set: a few large finished pieces for frequent things, small parts for the rest.*

Many modern text tokenizers therefore use **[subword tokens](https://ki-einfach-verstehen.de/en/glossary/subword-token/)**: a token can be a frequent whole word, a recurring word part, or a single character. It works like a building set: frequent things come as large finished pieces, rare things you assemble from small parts, if need be from single characters. The tokenizers behind well-known chatbots such as ChatGPT work this way, too. “Learning,” for example, might split into “learn” and “ing.”

Which pieces exist depends on the text material and the procedure that built the **[vocabulary](https://ki-einfach-verstehen.de/en/glossary/vocabulary/)**, the fixed list of all pieces a tokenizer knows. And “unbelievable” from the start? A subword tokenizer might keep it whole or take two or three frequent pieces. Which ones is decided not by syllable rules but by what the tokenizer has learned from text.

The middle ground has a downside, though: frequent patterns fit into a few tokens, while an unusual spelling can fall apart into many small pieces. So the token count is not the word count. Even capitalization or an accent can change the split.

That leaves the question of where the pieces come from. Unlike in a building set, nobody designed them.

## Where the pieces come from: counting and merging

The previous lesson mentioned the language model GPT-2: it knows 50,257 text pieces, and its score list has one entry for each. No person picked these pieces. GPT-2’s tokenizer learned them with a procedure called **[byte pair encoding](https://ki-einfach-verstehen.de/en/glossary/byte-pair-encoding/)**, BPE for short. “Learned” means something different here than for the spam filter in the first lesson: there is no error and no weights get adjusted. It only counts.

At the start, the vocabulary consists only of single characters. First, count how often each two pieces stand side by side in a large practice text. Second, the most frequent pair is merged into a new piece, a new vocabulary entry. Third, everything starts over, now with the new piece. Each merge is noted as a numbered rule, readable like a recipe step, unlike a model’s numbers. This goes on until the vocabulary reaches a preset size, for real tokenizers tens of thousands of entries.

A made-up practice text of 24 short sentences such as “The cats laugh.” shows how it works; the counting is real. Which pair do you think stands side by side most often? It is “h” + “e”, 27 times: in “the,” “he,” “she,” and many more. So “he” becomes rule 1. Next comes a space followed by “l”, 17 times: rule 2. Then “a” + “r” with 16, rule 3. A few rounds later, the rules for space + “t” and then “ t” + “he” make “ the” a single piece. A procedure that only counts has found the most common English word without knowing what a word is.

![Three boxes: count pairs, merge the most frequent, repeat. Below, the word then with a leading space in four rows: first five single characters, after rule 1 (h plus e, counted 27 times while learning) with the piece he, after rule 4 (space plus t, 13 times) as space-t, he, n, after rule 8 (space-t plus he, 11 times) as space-the and n](../../public/bausteine/tokenizer-ids-vokabular/bpe-merges.svg)

*Top: how BPE learns. Below: learned rules replayed on the new word “then” with its leading space, without counting again. The numbers are real counts in the made-up practice text. The symbol ␣ marks a space.*

And how does the finished tokenizer split a new sentence? First, it breaks it into single characters. Then it replays its rules in exactly the learned order: first “h” + “e” to “he” everywhere, then space + “l”, then “a” + “r”, and so on through all the rules. After rule 8, “ then”, missing from the practice text, has become “ the” + “n”. Whatever no rule covers stays a small piece. Finally, it looks up each piece in the vocabulary. Because the rules and their order are fixed, the same text always gives the same pieces.

The whole chain: when learning, count, merge the most frequent pair, repeat. When splitting, replay the rules in the same order, then look up. Since single characters can always be left over, such a tokenizer needs the “unknown” placeholder only for characters that never occurred in the practice text.

<details>
<summary>One level deeper: how BPE does without “unknown”</summary>

The name gives away its origin: byte pair encoding began as a data compression method that replaces frequent pairs of **bytes** with a single new symbol. A byte is a small numeric unit in computer memory; every visible character is stored as one or more bytes, an accented letter or an emoji as several. For machine translation, BPE was adapted to merge characters instead of bytes.

A tokenizer that starts with characters has a gap: a character that never occurred in the practice text is not in the base vocabulary and stays “unknown.” All the world’s characters as base units would take over 130,000 entries. Byte-level BPE, as in GPT-2, therefore starts with bytes. There are only 256 different ones, and all of them fit into the base vocabulary. Even a never-seen character can be assembled from bytes this way. The finished vocabulary is the size of this base vocabulary plus the number of learned rules.

</details>

> **Interactive demo:** [try it on the website](https://ki-einfach-verstehen.de/en/lessons/tokenizer-ids-vocabulary/)

## Keeping token, tokenizer, and vocabulary apart

How does the tokenizer know that “ cat” is a piece and “ caz” is not? Suppose “ cat” came up often enough in the counting and “ caz” never did. When splitting, three things are involved that are easy to confuse. A **token** is a single unit, for example “ cat” (with a space in front, more on that shortly), “s”, or “.”. The **vocabulary** assigns an ID to every permitted unit. The **[tokenizer](https://ki-einfach-verstehen.de/en/glossary/tokenizer/)** is the procedure, including rules and vocabulary, that splits text into these units and joins them back into text.

Picture the vocabulary as a card index: each card holds a text piece and an identifying number. The tokenizer splits your sentence into pieces by its rules, finds the card for each piece, and outputs their numbers. On the way back, it looks up the numbers and joins the pieces again. Both directions run with every chatbot message: there with your question, back with every piece of the answer.

The picture has a limit: the tokenizer does not pick cards that fit the meaning. Its learned rules alone decide which pieces come out. And the card with “ cat” holds no definition of a cat, only a sequence of characters. What the model later connects with this card emerges only through its trained **[parameters](https://ki-einfach-verstehen.de/en/glossary/parameters/)**.

![Vocabulary card index with five cards: The 417, space-cat 82, s 903, space-sit 771, period 13](../../public/bausteine/tokenizer-ids-vokabular/vocabulary-cards.svg)

*The vocabulary as a card index: every text piece with a fixed identifying number.*

## An ID is a label, not a meaning

Each text piece in the vocabulary has a whole number, its **[token ID](https://ki-einfach-verstehen.de/en/glossary/token-id/)**. Suppose “The” carries ID 417. This number measures neither meaning nor frequency nor importance. It is just the number on an index card. So when a chatbot continues “The” sensibly, that is due to what its model learned, not to the 417.

![A label tag](../../public/bausteine/tokenizer-ids-vokabular/etikett.svg)

*An ID is only a label – a number that says nothing about the content.*

That is why a token ID is ambiguous without its tokenizer. In another vocabulary, 417 can stand for “and,” part of a word, or a special character. In the model, the same number serves as an address for a list of learned numbers. You know this from the spam filter: there, each word had a weight, in the made-up example “prize” +3. In a language model, each ID has a whole list instead of one number; the ID only says which list.

![From token ID 417, one arrow leads to the tokenizer’s vocabulary (417 stands for The) and a separate arrow leads to the model’s table (417 addresses learned numbers)](../../public/bausteine/tokenizer-ids-vokabular/id-path.svg)

*In the tokenizer, ID 417 is the number of the text piece “The”; in the model, the same ID is the address of learned numbers. The model itself only sees the number.*

## A complete toy example

Here is an invented mini vocabulary; a real tokenizer splits differently.

| Token ID | Text piece |
| ---: | :--- |
| 417 | “The” |
| 82 | “ cat” |
| 903 | “s” |
| 771 | “ sit” |
| 13 | “.” |

During **[encoding](https://ki-einfach-verstehen.de/en/glossary/tokenizer/)**, the tokenizer receives the text “The cats sit.” With this mini vocabulary, there is exactly one split: “The” + “ cat” + “s” + “ sit” + “.”, because “ cats” is not in the list. Looking the pieces up in the vocabulary gives the sequence 417, 82, 903, 771, 13. These five numbers are the model’s input.

In a real vocabulary, there would also be single characters such as “c”, “a”, and “t”. Which pieces come out is then decided by the learned rules: if there is a rule for “ cat” but none for “ cats”, it stays “ cat” + “s”.

During **[decoding](https://ki-einfach-verstehen.de/en/glossary/tokenizer/)**, the mapping runs backwards: the tokenizer looks up each ID and joins the five stored pieces in the same order. Because two tokens already carry their leading space, the result is “The cats sit.” again.

The example also shows why order matters. 417, 82, 903 is “The cats”; 82, 903, 417 gives “ catsThe”. From such sequences, a language model later learns which token is likely next.

For a tokenizer, spaces are characters like any other, as “ cat” and “ sit” show. Line breaks and punctuation also become tokens or part of larger ones. Paste a table with lots of blank lines into a chatbot, and those characters count, too.

> **Interactive demo:** [try it on the website](https://ki-einfach-verstehen.de/en/lessons/tokenizer-ids-vocabulary/)

Which numbers come out is set by the vocabulary of this one tokenizer alone. What happens if a model is fed with the wrong vocabulary?

## Why the tokenizer and the model form a fixed pair

The model was trained with exactly one mapping. For input 417, it draws on the list of learned numbers, parameters adjusted for entry 417 during training. Swap only the tokenizer, and the model receives valid numbers but the wrong symbols. It is as if someone had renumbered the index cards: 417 now says “and,” but the model expects what it learned for “The”.

![Two index cards numbered 1 and 2, with two arrows above them swapping the numbers](../../public/bausteine/tokenizer-ids-vokabular/kartei-neu-verteilt.svg)

*A foreign tokenizer renumbers the index cards – under familiar numbers, the model gets unfamiliar text pieces.*

So every model comes with exactly its own tokenizer, including vocabulary and learned rules, and the two are always passed on together. If a newly trained model gets a new tokenizer, the same sentence gives different IDs there and often a different number of tokens.

![Tokenizer and model with ID 417: “The” at the tokenizer, learned numbers at the model, connected by a shared vocabulary](../../public/bausteine/tokenizer-ids-vokabular/fixed-tokenizer.svg)

*Tokenizer and model form a fixed pair: for both, the same ID must point to the same vocabulary entry.*

## Why you notice tokens in everyday use

In a long chat with an AI assistant, the model eventually seems to forget the beginning. Or a service reports that your text is too long, although it is only a few pages. In both cases, the issue is not words but tokens.

Models process only a limited number of token positions at once. Depending on the system, this **[context window](https://ki-einfach-verstehen.de/en/glossary/context-window/)** covers the input and the generated **[output](https://ki-einfach-verstehen.de/en/glossary/output/)**. One reason for the forgetting is familiar from the previous lesson: in a chat, the whole conversation goes back into the model every round and grows with each answer. Once it no longer fits, the system has to leave something out, and usually the very start is what goes.

Some texts split into especially many tokens: an unusual product code, a long string of digits, or a language the vocabulary covers less compactly. They use more positions than familiar text of the same length. Some services even bill per token. Rules of thumb such as “one token is about four characters” are rough; only the model’s own tokenizer counts exactly.

## What the tokenizer does not do

The tokenizer recognizes neither word meanings nor grammar nor intention. Sometimes its boundaries look linguistically sensible — such as “learn” and “ing.” That is because such sequences were frequent in the counting, not because of any language analysis. A token may cut right through a syllable, an ending, or a name.

Nor does the tokenizer decide which token comes next. It converts existing text into IDs and generated IDs back into text. Prediction happens in the model.

A common misconception: a model “understands” a word if it is a single token; if the word falls apart into many tokens, the model understands it less well or not at all. That sounds plausible, because one compact unit seems more complete than several fragments.

In fact, the model learned patterns across whole token sequences during training and can combine information from several positions. So you cannot infer understanding from the token count. Still, the split has consequences: for some tasks, such as arithmetic with multi-digit numbers, performance measurably depends on how the digits are divided into tokens.

![The tokenizer splits and numbers text into IDs; the model predicts the next ID based on learned patterns](../../public/bausteine/tokenizer-ids-vokabular/split-jobs.svg)

*The tokenizer splits and numbers text – prediction is the model’s job alone.*

## The numbers are only the beginning

The complete path so far: visible text → tokenizer rules → token sequence → vocabulary lookup → sequence of token IDs. The text is numbered, but not yet in a form in which the **[model](https://ki-einfach-verstehen.de/en/glossary/model/)** can calculate similarities and relationships.

In the next step, every ID serves as the address of a long list of learned numbers. What exactly is such a list, and how do you organize many of them, one per token? That is the topic of the next lesson: scalar, **[vector](https://ki-einfach-verstehen.de/en/glossary/vector/)**, matrix, and **[tensor](https://ki-einfach-verstehen.de/en/glossary/tensor/)**.

If you remember only one sentence, make it this one: **A token is a reusable text piece, its ID is only its number in the vocabulary, and only the model links that number to a list of learned numbers.**

---

Source: https://ki-einfach-verstehen.de/en/lessons/tokenizer-ids-vocabulary/

← Previous: [Input and Output: What a Function Does](./input-and-output.md) · [All lessons](../../README.md#contents) · Next: [Scalar, Vector, Matrix, Tensor: the Building Blocks of Numbers](./scalar-vector-matrix-tensor.md) →
