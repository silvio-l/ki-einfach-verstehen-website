<!-- Generated from src/content/bausteine/en/tokenizer-ids-vocabulary.mdx by scripts/export-lessons.mjs -- do not edit by hand. -->

# Tokenizers: How Text Breaks into Tokens

> Reading copy for GitHub. The full version with interactive demos, animations and recall moments is on the website: **[Tokenizers: How Text Breaks into Tokens](https://ki-einfach-verstehen.de/en/lessons/tokenizer-ids-vocabulary/)**
>
> Licence: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.en) · Credit it as: KI einfach verstehen, “Tokenizers: How Text Breaks into Tokens”, CC BY 4.0, https://ki-einfach-verstehen.de/en/lessons/tokenizer-ids-vocabulary/

Shows why a language model splits text into pieces from a fixed list, how a tokenizer learns these pieces by counting, and why the number of tokens is not the number of words.

Before you read on, split this German word into pieces in your head: “unwahrscheinlich”, which means “improbable”. Do you make it a single piece, three parts that make sense to a German speaker, such as “un”, “wahr” (true) and “scheinlich”, or nothing but single letters? Hold on to your choice.

In the previous lesson, a [language model](https://ki-einfach-verstehen.de/en/glossary/language-model/) received the start of a text such as “The cat sat” as [input](https://ki-einfach-verstehen.de/en/glossary/input/) and gave a score to every text piece it knows. That left open how text becomes something a model can calculate with. What exactly is a text piece, and who decided which pieces exist? The next lesson shows how the pieces become numbers.

## Why the model needs a fixed list of pieces

Why doesn’t a language model simply take your text as it comes? The older language model GPT-2 knows 50,257 text pieces, and its score list always has exactly 50,257 entries, one for each piece. It faces the same constraint as the image recognition model from the previous lesson. That model always gives exactly one score each for cat, dog, fox and car, and cannot create a new class. The language model’s output also has a fixed form before it calculates. So the score list can only be built if the list of pieces is fixed in advance.

The same goes for the input. Do you remember the loop? A piece is chosen and appended to the text. The longer text goes back into the model, so it partly consists of chosen pieces. As you saw in the previous lesson, every model calculates only with the kind of input it was built for. The language model can only process pieces from its fixed list, the **[vocabulary](https://ki-einfach-verstehen.de/en/glossary/vocabulary/)**. The score list is different: it is recalculated for every input and has one entry for every piece in the vocabulary. So your question must first be split into pieces from the vocabulary. Each of these pieces is called a **[token](https://ki-einfach-verstehen.de/en/glossary/token/)**.

![Scissors](../../public/bausteine/tokenizer-ids-vokabular/schere.svg)

*Before the model calculates, your text is cut into pieces.*

Before your text goes into the model, a separate program splits it: the **[tokenizer](https://ki-einfach-verstehen.de/en/glossary/tokenizer/)**. Every message you send to a chatbot passes through it first, and every answer consists of its pieces. It does not understand your sentence; it follows fixed rules. So where it cuts is fixed before the model calculates even a single number. Which pieces should its list contain?

## Whole words or single letters?

Making every word a token works for a limited collection of texts, but not for every possible text. The list would need “friend”, “friendly”, “unfriendly” and every other word of that kind, plus inflected forms such as “learn”, “learns” and “learned”, names, typos and words coined tomorrow. It can grow large, but it stays finite. Anything missing could only be represented by the placeholder “unknown”. With the rule filter from the first lesson, the prize rule stopped firing as soon as the subject said “PR1ZE” instead of “prize”. A chatbot with a fixed word list would also see only “unknown” for every new band name.

Another option is to make every letter, space and punctuation mark a token of its own. Then any word can be assembled, even a completely new one, and the list stays small. But the input gets long. The model receives the input as a row of tokens, each in its own place. Each model has a fixed limit on how many places this row can have. More on that in the next lesson. With its spaces and the period, “The cat sat.” takes up 12 places, and even a frequent “ing” takes up three every time. The answer would also arrive letter by letter, with one round of the loop for every character.

**Whole words are too rigid, single characters too fine-grained.** A middle ground is needed.

![Three possible splits of the word learning: as a whole word, into word pieces and into single characters](../../public/bausteine/tokenizer-ids-vokabular/granularity.svg)

*The same word, split three times at different levels of detail. The middle split is only an illustration.*

## The middle ground: reusable word pieces

Many tokenizers therefore work with **[subword tokens](https://ki-einfach-verstehen.de/en/glossary/subword-token/)**, or word pieces. A token can be a frequent whole word, a recurring word part or a single character. The tokenizers behind chatbots such as ChatGPT work this way, too. “Learning” might split into “learn” and “ing”, for example. That is only an illustration; every tokenizer splits differently.

![A wooden building set on a table: in front, a long row of a few large blocks, filled up at the end with small blocks; behind it, a box with sorted large blocks and many small ones](../../public/bausteine/tokenizer-ids-vokabular/baukasten.webp)

*Word pieces work like a building set: a few large finished pieces for frequent things, small parts for the rest.*

It works like a building set. Frequent sequences come ready-made as one large block; rare ones are assembled from small blocks, down to single characters if need be. So no word is left out, and frequent words still take up only a few places. The row you build is the token sequence of your text. A new sequence is created for every text. The box itself, by contrast, always stays the same: it is the vocabulary, the fixed list of all the pieces a tokenizer knows. For GPT-2, these are the 50,257 text pieces for which its score list has one entry each.

The comparison has a limit. With a building set, you choose which block to take. The tokenizer does not choose anything; it follows its rules. And nobody cut the blocks to fit their meaning: a counting procedure determined which pieces are in the box.

## Where the pieces come from: counting and merging

Nobody made up GPT-2’s pieces. Its tokenizer learned them with a procedure called **[byte pair encoding](https://ki-einfach-verstehen.de/en/glossary/byte-pair-encoding/)**, BPE for short. “Learned” means something different here than for the spam filter from the first lesson, whose weights were adjusted after mistakes. BPE knows neither mistakes nor weights. **It only counts.**

At the start, the vocabulary consists only of single characters. First, the procedure counts how often two pieces occur next to each other in a large practice text. Then it merges the most frequent pair into a new piece. It becomes a new vocabulary entry. The merge is recorded as a numbered **rule**. The rule filter from the first lesson had readable rules, but people had written them. The trained spam filter had only weights. Here, counting produces readable rules that no person wrote. So the tokenizer is not a model with weights but a program that applies these rules. Then everything starts over, now with the new piece. In every round, exactly one pair wins: the most frequent. This continues until the vocabulary reaches a preset size. Real tokenizers learn tens of thousands of rules this way; newer ones often learn well over 100,000.

A made-up practice text contains eight words: “playing” and “saying” twice each, “going”, “rain”, “day” and “sing” once each. The words and their frequencies were chosen for the example. But the counting is real, and you can check every count on paper. The procedure only counts pairs within a word. Which pair do you think occurs most often?

It is “i” + “n”, 7 times: twice in “playing”, twice in “saying” and once each in “going”, “rain” and “sing”. So “in” becomes the first rule.

Then the pairs are counted again because the practice text now consists of different pieces. Now the most frequent pair is “in” + “g”, 6 times: in “playing”, “saying”, “going” and “sing”. That becomes the second rule, “ing”. In the third count, “a” + “y” comes out on top, 5 times: in every “playing” and “saying” and in “day”. The third rule merges them into “ay”. Which pair would become the fourth rule? Count for yourself before you read on.

A procedure that only counts has found pieces that look like English word parts. It still does not know what an ending is: “ing” and “ay” became rules because they were frequent.

The fourth rule joins “ay” and “ing”. The pair occurs 4 times, in “playing” and “saying”. Real tokenizers count the same way, only across huge amounts of text. So they end up with different rules from those in this mini example.

<details>
<summary>One level deeper: how BPE does without “unknown”</summary>

Byte pair encoding was originally a data compression method that replaces frequent pairs of **bytes** with a single new symbol. A byte is a small numeric unit in computer memory. Every visible character is represented by one or more bytes; an accented letter or an emoji uses several. For machine translation, BPE was adapted to merge characters instead of bytes.

A tokenizer that starts with characters has a gap. A character that never occurred in the practice text is not in the base vocabulary and stays “unknown”. A base vocabulary with all the world’s written characters would have over 130,000 entries. Byte-level BPE, as in GPT-2, therefore starts with bytes. There are only 256 different ones, and all of them fit into the base vocabulary. Even a character it has never seen can be assembled from bytes this way. The finished vocabulary has as many entries as the base vocabulary, plus one for every learned rule. Sometimes special entries are added.

BPE is not the only method for word pieces. **[SentencePiece](https://ki-einfach-verstehen.de/en/glossary/sentencepiece/)** learns word pieces directly from unaltered sentences, using BPE among other methods. It does not split the sentences at presumed word boundaries first. That helps with languages that, unlike English, do not mark word boundaries with spaces.

</details>

## How the finished tokenizer splits a new word

What does the finished tokenizer do with a word that never occurred in the practice text, such as “laying”? Guess which pieces the three rules split it into before you read on.

The tokenizer does not count again. It splits the word into single characters and replays its three rules in the learned order. First, rule 1 turns “i” + “n” into the piece “in”: l | a | y | in | g. Then rule 2 forms the piece “ing” from “in” + “g”: l | a | y | ing. Finally, rule 3 joins “a” and “y”: l | ay | ing. There is no rule for the “l”; it stays a single character.

![Three boxes: count pairs, merge the most frequent, repeat. Below, the practice text playing twice, saying twice, going, rain, day, sing, and the word laying in four rows: first six single characters, after rule 1 (i plus n, counted 7 times) with the piece in, after rule 2 (in plus g, 6 times) with ing, after rule 3 (a plus y, 5 times) as l, ay, ing](../../public/bausteine/tokenizer-ids-vokabular/bpe-merges.svg)

*Top: how BPE learns. Below: the three rules from the made-up practice text, replayed on the new word “laying”. The numbers in parentheses are the counts during learning; splitting does not count.*

Every character of the practice text was in the vocabulary from the start, so no word made of these characters is left out. Unknown words simply split into smaller pieces. If needed, GPT-2’s tokenizer assembles any character from even smaller building blocks, the bytes a computer uses to store characters (more on this in the box above). So nothing stays unknown. And because the rules and their order are fixed, the same text with the same tokenizer always gives the same tokens. If you send the same question in two new chats, it becomes the same tokens both times. Different answers almost always arise only afterward, in the selection step, which uses some randomness to pick a piece from the model’s score list.

And “unwahrscheinlich” from the start? GPT-2’s real tokenizer turns it into seven pieces: “un”, “w”, “ah”, “r”, “sche”, “in” and “lich”. The boundaries run right through “wahr”, because none of its rules formed “wahr” as a whole. A tokenizer with different rules splits the same word differently.

> **Interactive demo:** [try it on the website](https://ki-einfach-verstehen.de/en/lessons/tokenizer-ids-vocabulary/)

## Why tokens are not words

A chatbot’s limit on how much text it can process at once is measured in tokens, not words. If you use language models directly from your own programs rather than in a chat window, you also pay per token. GPT-2’s real tokenizer splits “The capital of France is” into 5 tokens and the German version, “Die Hauptstadt von Frankreich ist”, into 10. Both sentences have five words. For GPT-2, “France” is a single piece, while “Frankreich” becomes “Frank”, “re” and “ich”.

![Three rows of colored pieces. The capital of France is: 5 words, 5 tokens. Die Hauptstadt von Frankreich ist (German): 5 words, 10 tokens (Die, Hau, pt, stadt, von, Frank, re, ich, is, t). unwahrscheinlich (German for improbable): 1 word, 7 tokens (un, w, ah, r, sche, in, lich)](../../public/bausteine/tokenizer-ids-vokabular/words-and-tokens.svg)

*Three texts, split by GPT-2’s real tokenizer. The color changes with every token. The symbol ␣ marks a space; in GPT-2, it belongs to the following word.*

> **Interactive demo:** [try it on the website](https://ki-einfach-verstehen.de/en/lessons/tokenizer-ids-vocabulary/)

Whatever was frequent during counting became large pieces. GPT-2’s tokenizer was made for a model whose training texts deliberately left out non-English web pages. It probably counted its pairs in similar, mostly English texts. So English letter sequences were far more frequent than German ones in its practice text. English words are therefore often one token, while German ones split more often. Even a typo can raise the count: “Frankkreich”, misspelled with a double k, needs one more piece than “Frankreich”.

More tokens mean the text takes up more places in the input. You often hear that a model understands a word less well if it splits into many tokens. That sounds plausible, because a whole piece seems more complete than fragments. But the model always receives the whole input at once, like “The cat sat on” in the previous lesson, not just the last piece. So “Frank”, “re” and “ich” reach it together, and during training it calculated using exactly such sequences. So **you cannot infer understanding from the number of tokens.** Still, the split has consequences. GPT-2 splits “12345” into “123” and “45”, while “4096” is a single piece. So the digits are not lined up one by one as they are when you add numbers on paper. Studies show that how numbers are split measurably affects how well language models calculate.

The tokenizer does not predict anything either. It splits text into pieces; only the model judges which pieces fit well next.

## Pieces are not numbers yet

Before a language model calculates, its tokenizer splits the text into tokens from a fixed vocabulary. BPE determined which pieces it contains by counting. That is why “unwahrscheinlich” becomes seven pieces and “Frankreich” three, while “France” stays one. The number of tokens is not the number of words.

But the tokens are still text, and a model only calculates with numbers. The next lesson shows which number each piece gets and what that number tells the model: [Token IDs: How Tokens Become Numbers](./token-ids-and-vocabulary.md).

---

Source: https://ki-einfach-verstehen.de/en/lessons/tokenizer-ids-vocabulary/

← Previous: [Input and Output: What a Function Does](./input-and-output.md) · [All lessons](../../README.md#contents) · Next: [Token IDs: How Tokens Become Numbers](./token-ids-and-vocabulary.md) →
