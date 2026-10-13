<!-- Generated from src/content/bausteine/en/forward-pass-and-loss.mdx by scripts/export-lessons.mjs -- do not edit by hand. -->

# Forward Pass and Loss: How the Model Measures Its Own Error

> Reading copy for GitHub. The full version with interactive demos, animations and recall moments is on the website: **[Forward Pass and Loss: How the Model Measures Its Own Error](https://ki-einfach-verstehen.de/en/lessons/forward-pass-and-loss/)**
>
> Licence: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.en) · Credit it as: KI einfach verstehen, “Forward Pass and Loss: How the Model Measures Its Own Error”, CC BY 4.0, https://ki-einfach-verstehen.de/en/lessons/forward-pass-and-loss/

How a language model’s percentages for the token that actually follows turn into penalty points, how a whole stack of text becomes one single number, and what that number does not measure.

In the previous lesson, a cover card lay on the text. The model guesses the next piece, and the answer lies under the card. On its own, though, a language model does not give a single answer. It spreads percentages across all the [tokens](https://ki-einfach-verstehen.de/en/glossary/token/) it knows. In a test, you get points for right and none for wrong. How do you score a prediction that puts 72 percent on the right word and the rest on others?

The answer lies in the training loop from the lesson on [parameters, training and inference](./parameters-training-inference-hardware.md): compute, compare, adjust. Comparing produces an error number, and there it was called the **[loss](https://ki-einfach-verstehen.de/en/glossary/loss/)**. It is larger the fewer percent the model gave the piece of text that actually follows in the training text. For the made-up apple model, the rule was simple: multiply each deviation by itself. Percentages need a different one. In this lesson, the error number of a single prediction is called penalty points; averaged over all predictions, they give the loss. Before you read on, estimate for yourself who should get more penalty points: a model with 1 percent on the right token or one with 27 percent, and how many more.

## Penalty points for one prediction

Remember the prize wheel from the [probability and softmax](./probability-and-softmax.md) lesson? After “The cat”, [softmax](https://ki-einfach-verstehen.de/en/glossary/softmax/) turned three made-up scores into a wheel: “sat” got a segment of about 72 percent, “slept” about 27, “flew” about 1 percent. Each segment is as large as its [probability](https://ki-einfach-verstehen.de/en/glossary/probability/). In the training text, “sat” follows: this token is the [label](https://ki-einfach-verstehen.de/en/glossary/label/), the answer under the card.

![Prize wheel with one large, one smaller and one hair-thin segment; a lamp lights the large one, next to it a jar with three balls](../../public/bausteine/forward-pass-und-loss/gluecksrad-strafpunkte.webp)

*The wheel after “The cat”: the lamp marks the segment of the token that actually follows in the text; only this segment counts. Large segment, few penalty points in the jar (schematic).*

The rule looks only at its segment: large means few penalty points, small means many. The other segments do not count. Two things do not fit the picture. First, nothing is spun in training; the next token is already in the text. Second, nobody punishes; the model feels nothing. The penalty points, the balls in the jar, are a number the [training algorithm](https://ki-einfach-verstehen.de/en/glossary/training-algorithm/) later tries to shrink by adjusting the [parameters](https://ki-einfach-verstehen.de/en/glossary/parameters/). Unlike a jar, penalty points never fill up: they have no upper limit.

Penalty points are not a percentage, nor do they count the points missing to 100. From 1 to 10 percent the segment grows tenfold, from 90 to 99 percent by only a good tenth, though both are nine points. So the ratio counts. For “sat” with 72 percent, the rule gives 0.33 penalty points. What does a segment half that size cost, 36 percent?

> **Interactive demo:** [try it on the website](https://ki-einfach-verstehen.de/en/lessons/forward-pass-and-loss/)

It is 1.02, so 0.69 more. The rule counts how many halvings take the segment from 100 percent down to its size; the graphic below shows the series. **Every halving of the segment costs about 0.7 penalty points more**, whatever its size before. The 0.7 is the value of one halving in the unit used here. Another unit would scale all values evenly. The 72 percent for “sat” are just under half a halving below 100 percent, hence only 0.33.

The 27 percent of “slept” are just under two halvings below 100 percent and cost 1.31. “Flew”, at 1 percent, is just under seven halvings down and costs 4.61, over three times as much.

![Columns at 100, 50, 25, 12.5, 6.25, 3.1 and 1 percent segment: 0, 0.7, 1.4, 2.1, 2.8, 3.5 and 4.61 penalty points](../../public/bausteine/forward-pass-und-loss/halving.svg)

*Every halving of the segment costs about 0.7 penalty points more. Towards zero, the penalty points grow without limit (calculated).*

Step by step: 50 percent costs 0.7, 25 percent 1.4. That is why confidently wrong is the most expensive. With 98 percent on “flew”, “sat” is left a narrow, expensive strip. A near miss is cheap: with 60 percent on “slept” and 40 on “sat”, the model is wrong and still pays only 0.9. Experts call this rule **[cross-entropy](https://ki-einfach-verstehen.de/en/glossary/loss/)**; it gives one position’s penalty points.

Even the front-runner pays. In the lesson on the [output head](./output-head.md), “Paris” got 47.5 percent after the German “Die Hauptstadt von Frankreich ist”. The English “The capital of France is” splits into other tokens, and Qwen3-0.6B gives “Paris” 34.9 percent, again more than any other token. If “Paris” follows in the text, it costs 1.05. **Every prediction below 100 percent costs something.** This is exactly how the language models behind your chatbots are pretrained; training on conversations follows.

<details>
<summary>One level deeper: the formula behind the penalty points</summary>

The penalty points of a position are

`penalty points = −ln p`

Here p is the probability of the token that actually follows, written as 0.72 instead of 72 percent. ln is the natural logarithm. For numbers below 1 it is negative; the minus makes the penalty points positive: −ln 1 is 0, −ln 0.5 is 0.693.

The logarithm turns multiplying into adding. Halving means multiplying by ½, and that becomes “plus 0.693”, whatever the segment’s size. Hence the series with its 0.7 steps.

The widely used training library PyTorch takes the scores before softmax, the logits, and the label, computes softmax and logarithm in one go and averages over all positions.

</details>

But a sentence has more than one position.

## Forward through the model, one number for the batch

In the lesson on the output head, “The dog chases the cat” ran through the model, each word simplified as one [token](https://ki-einfach-verstehen.de/en/glossary/token/); real tokenization follows. In training, every position delivers its scoreboard, a score for every token in the [vocabulary](https://ki-einfach-verstehen.de/en/glossary/vocabulary/). Four can be checked: “The” should predict “dog”, “dog” the word “chases”, “chases” the word “the”, and “the” the word “cat”. After “cat”, the text ends.

For this, the model takes the path from the topic area “Inside the Model”. Every token fetches its embedding, the blocks mix the context in, layer by layer, the output head fills the boards, and softmax turns each into a wheel. Experts call this path the **[forward pass](https://ki-einfach-verstehen.de/en/glossary/forward-pass/)**. It is the same when answering, because training measures exactly what the model will later output. What is new: in training, the wheels of all positions count, not just the last, and none is spun.

Four words are predicted, each costing penalty points by the segment the position before gave it. Suppose these made-up segments for the right words: “dog” 1 percent, “chases” 25, “the” 50, “cat” 12.5. Most expensive is “dog” at 4.6 penalty points, because almost any word can follow “The”. “Chases” costs 1.4. After “chases”, “the” is obvious and costs only 0.7, and “cat” 2.1.

![The dog chases the cat: under each predicted word the segment from the word before and its penalty points; average 2.2, segments made up](../../public/bausteine/forward-pass-und-loss/positions-loss.svg)

*One forward pass, four predictions: under each predicted word you see how large its segment was after the word before, and what that costs. The sentence gets the average (made-up percentages).*

The four values become one number, the average: 8.8 penalty points divided by four positions gives 2.2, the loss of this sentence with the made-up segments. Why not the sum? Then a long text would get a larger loss just for its length, even with equally good predictions. The average makes texts of different lengths comparable. The loss does not say whether a sentence as a whole is true: it measures how well each token was predicted and only averages at the end.

Qwen3-0.6B, in its openly available base version without chat training, computed exactly this sentence. Its [tokenizer](https://ki-einfach-verstehen.de/en/glossary/tokenizer/), the program that splits text into tokens, cuts it into six: “The”, “dog”, “ch”, “ases”, “the” and “cat”. “The” is not predicted, as nothing precedes it; six tokens give five penalty-point values. Their average is 3.7. Which token likely costs the most?

> **Interactive demo:** [try it on the website](https://ki-einfach-verstehen.de/en/lessons/forward-pass-and-loss/)

The most expensive is “dog” at about 9.5, followed by “ch” at about 6.4. The cheapest is “ases” after “ch” at 0.24: which other piece should follow?

Training does not use single sentences. In the lesson on training, the training algorithm adjusted the parameters once the slopes from a large stack of text were collected. Experts call this stack a **[batch](https://ki-einfach-verstehen.de/en/glossary/batch/)**. In running chatbots, the word means something else: the data center computes many people’s requests together. In training, a batch is the stack of text that becomes one error number. All its sequences run forward through the model, every position gets its penalty points, and the average over all positions of all sequences is the loss of the batch.

GPT-3, an OpenAI language model from 2020, shows how large such a stack is. Per its research paper, the full batch size of the largest GPT-3, with 175 billion parameters, was 3.2 million tokens. At the start of training it was much smaller, 32,000 tokens. It rose linearly to the full value over the first 4 to 12 billion tokens, depending on model size. So millions of penalty points become one number. When answering, the model runs one forward pass per piece of text; in training, the same piece costs about three times as much, as the lesson on training said. This forward pass takes about a third; the way back, the subject of the next lesson, takes two thirds.

## What the loss says and what it does not

A useful reference point is a model that has learned nothing yet. Its parameters have random starting values, chosen so that all token scores are close together. Then softmax spreads the wheel almost evenly: with 151,936 tokens, as in the vocabulary of Qwen3-0.6B, each gets a segment of 1 in 151,936. How many penalty points does each position cost then, whichever token follows?

![Prize wheel with a pointer, divided into very many hair-thin segments of equal width, alternating teal and light](../../public/bausteine/forward-pass-und-loss/untrainiertes-rad.webp)

*Before training: a wheel of nothing but equally narrow segments. Every token costs about 11.9 penalty points (schematic).*

It is about 11.9, roughly 17 halvings from 100 percent down to 1 in 151,936. Careful training starts about here. The real sentence, at 3.7, is far below: same vocabulary, but a model that has learned. OpenAI’s older GPT-2 has a vocabulary of 50,257 tokens, where an even wheel gives 10.8. So the same ignorance gives different numbers, depending on vocabulary size. The text counts too: surprising words cost a lot, predictable ones little, as the real sentence shows. **So loss values are directly comparable only with the same tokenizer and the same text:** penalty points count tokens, and two tokenizers cut the same text differently.

A loss of 0.5 sounds like “half wrong”. That is an easy assumption to make: percentages go in, and many values are between 0 and 1. But the loss is not a share. It has no upper limit, and a single position gets 0.5 with a segment of about 61 percent. For an average, not even that holds: 0.5 also comes from one position at 100 percent and one at about 37 percent. Without a comparison value on the same text, a reported loss says little.

![Scale of 0 to 12 penalty points: one position Paris 1.05; sentence average 3.7; even wheel 10.8 (GPT-2), 11.9 (Qwen3-0.6B)](../../public/bausteine/forward-pass-und-loss/loss-scale.svg)

*Where loss values lie: 0 only with 100 percent for every right token; the value of an even wheel depends on the vocabulary. Values are directly comparable only with the same tokenizer and the same text.*

The loss does not measure whether something is true. Remember “Sydney” from the softmax lesson: suppose many training texts follow “The capital of Australia is” with “Sydney”. Then this point costs fewer penalty points the larger the segment the model gives “Sydney”, even though Canberra is the capital. So a small loss means the model predicts well what is in its training texts. That is one reason a chatbot can phrase something false as smoothly as something true.

Suppose the training text has a typo, say “The cat sat on the sfoa”, and the model gives “sofa” a large segment. Will this position be expensive or cheap?

Expensive. The answer under the card is the typo, which gets only a narrow segment. The model made a sensible prediction and pays anyway. Averaged over millions of positions, one typo hardly matters.

<details>
<summary>One level deeper: perplexity, the loss as a number of options</summary>

Research papers often give the **perplexity** instead of the loss. It comes from the average loss over a text:

`perplexity = e to the power of the loss`

e is the number 2.718…, the base of the natural logarithm. Perplexity translates the loss into a number of equally good options. A model with perplexity 2 is on average as unsure as if it had to choose between two equally large segments at every point. The textbook by Jurafsky and Martin calls it a weighted average branching factor.

For “The dog chases the cat” with 3.7 penalty points on average, that gives e to the power of 3.7, about 40: as if Qwen3-0.6B were choosing between about forty equally large segments each time. An even wheel over 151,936 tokens comes to exactly 151,936, one option per token.

</details>

The loss says how far off the model was, but not why. Which of the 0.6 billion parameters of Qwen3-0.6B contributed how much to the 3.7, and which way must it move to make the number smaller? The next lesson on backpropagation, the way back through the model, and gradients, the slopes for every parameter, answers that.

---

Source: https://ki-einfach-verstehen.de/en/lessons/forward-pass-and-loss/

← Previous: [Text Becomes Many Practice Problems](./text-becomes-many-practice-problems.md) · [All lessons](../../README.md#contents) · Next: [Backpropagation and Gradients: How the Model Knows What to Change](./backpropagation-and-gradients.md) →
