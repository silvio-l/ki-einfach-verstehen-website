<!-- Generated from src/content/bausteine/en/probability-and-softmax.mdx by scripts/export-lessons.mjs -- do not edit by hand. -->

# Probability and Softmax: How a Model Decides

> Reading copy for GitHub. The full version with interactive demos, animations and recall moments is on the website: **[Probability and Softmax: How a Model Decides](https://ki-einfach-verstehen.de/en/lessons/probability-and-softmax/)**
>
> Licence: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.en) · Credit it as: KI einfach verstehen, “Probability and Softmax: How a Model Decides”, CC BY 4.0, https://ki-einfach-verstehen.de/en/lessons/probability-and-softmax/

How a language model turns its scores into shares, why it sometimes picks the obvious choice and sometimes something else, and how temperature changes that.

When you have a chatbot regenerate an answer, you often get a different one, even though your question stayed the same. As the lesson on input and output showed, the same input gives, in principle, the same [score](https://ki-einfach-verstehen.de/en/glossary/score/) list. That list rates each [token](https://ki-einfach-verstehen.de/en/glossary/token/) (a piece of text) by how well it fits next. A separate step makes the choice, and that is where chance comes in. Scores like 7.1 or −2.3 are not yet probabilities. How does the model choose exactly one token from them?

You type “The cat”. For this example, we assume only three possible continuations: “sat” with the score 3.0, “slept” with 2.0 and “flew” with −1.0. These scores are made up. A person set them; nothing was trained. A real model gives a score to every token in its [vocabulary](https://ki-einfach-verstehen.de/en/glossary/vocabulary/) (the fixed list of all pieces into which the model splits a text). For example, GPT-2, an older forerunner of the models behind ChatGPT, has about 50,000 tokens. It computes each score from its [parameters](https://ki-einfach-verstehen.de/en/glossary/parameters/), the numbers set during training. With these made-up scores, you can only work through how a token is chosen. They do not tell you which continuation a real model prefers after “The cat”.

## How often should “sat” come up?

Suppose the model has to choose the next token after “The cat” a hundred times. How often should “sat” come up, and how often “flew”? Try to read it off the scores before you read on.

If the selection step always takes the highest score, as in the lesson on input and output, “sat” comes up a hundred times, and regenerating would in principle give you nothing else. If “slept” should come up now and then too, the scores do not say how often. “flew” is where it breaks down: its score is negative, and a share of minus one percent does not exist. A score only shows which token is ahead, and by how much, not how often it should come up.

![Three cats: on the left a large one sitting, in the middle a medium-sized one asleep, on the right a tiny one hanging from a balloon](../../public/bausteine/wahrscheinlichkeit-und-softmax/drei-kandidaten.png)

*Three possible continuations of “The cat …”: sat, slept, flew. The cat for “sat” is largest because that continuation is most likely; the tiny cat on the balloon is the least likely.*

As on a prize wheel, each token gets a segment whose size tells you how often it comes up over many tries. The larger a segment, the more often the pointer stops there. On average, the pointer lands on a segment covering a quarter of the wheel once every four spins. A segment’s share of the wheel is called its **[probability](https://ki-einfach-verstehen.de/en/glossary/probability/)**. Here the word means only this size, not the model’s certainty. It always lies between 0 and 100 percent, never more or less.

All shares together make exactly 100 percent. This list is called a **distribution**. A chatbot needs such a wheel for every token it adds to an answer. So how do you build a wheel from 3.0, 2.0 and −1.0?

## From points to shares: softmax

After a quiz night, the scoreboard hangs on the wall. Team A has 30 points, team B 20, team C 10. So team A has half of all 60 points.

That approach fails for these scores: dividing each by their sum, 4.0, “flew” gets −1.0 : 4.0, or −25 percent. A wheel cannot have a negative segment.

So softmax first turns each score into a positive number, its **strength**. Think of each token as a team and its strength as the team’s points. Scores can be negative; strengths never are.

A fixed rule, which training does not change, applies to every score: a score of 0 gets strength 1. Each point above 0 multiplies the strength by 2.718, each point below 0 divides it by 2.718. Softmax then divides each strength by the sum of all strengths, as you work out each team’s share of the points.

The number 2.718 is called e, a constant of mathematics that nobody chose.

For “sat”, three points above zero means 2.718 · 2.718 · 2.718. “slept” has two points, and “flew” sits one point below zero. The strengths are about 20.1 for “sat”, about 7.4 for “slept” and about 0.37 for “flew”, together about 27.8. Divide each by 27.8, and “sat” gets roughly 72 percent, “slept” roughly 27 and “flew” roughly 1 percent. This calculation is called **[softmax](https://ki-einfach-verstehen.de/en/glossary/softmax/)**: it turns any score list into a wheel.

![Animation: softmax turns the scores 3.0, 2.0 and −1.0 into the probabilities 72, 27 and 1 percent](../../public/bausteine/wahrscheinlichkeit-und-softmax/softmax-steps.static.svg)

[▶ watch the animation on the website](https://ki-einfach-verstehen.de/en/lessons/probability-and-softmax/)

*Softmax in three steps: turn scores into positive strengths, add up the strengths, divide each strength by the sum. The scores are made up.*

Suppose you add 10 to all three scores: 13.0, 12.0 and 9.0. Do the percentages get larger, smaller, or stay the same?

They stay the same: adding ten points multiplies every strength and their sum by the same factor. When you divide, that factor cancels out. A different sentence beginning can shift the whole list of scores up or down. The scoreboard breaks down here: 10 extra points per team would shift the shares, but scores would not. **With scores, all that matters is how far apart they are.**

On the wheel, the highest score always gets the largest segment. Each point of lead multiplies the strength by about 2.7; two points mean about seven times as much. A token far ahead therefore gets almost the whole wheel. Softmax gives every token a share above zero: even “flew” keeps about 1 percent.

![Scores sat 3.0, slept 2.0, and flew −1.0 become 72%, 27%, and 1% via softmax, together 100%](../../public/bausteine/wahrscheinlichkeit-und-softmax/points-to-percent.svg)

*Softmax turns made-up scores into shares: the order stays the same, and the sum is 100%.*

## The same calculation for image recognition

The image recognition from the lesson on input and output usually does the same calculation: softmax. For a photo, it outputs scores: cat 6.2, dog 2.9, fox 1.4 and car −3.0.

The cat is a good three points ahead of the dog and therefore gets almost the whole wheel, about 96 percent. The dog, fox and car share the rest; the car keeps a tiny remainder above zero. A language model like GPT-2, a predecessor of the models behind ChatGPT, runs the same calculation before every new token, over all scores of its vocabulary.

<details>
<summary>One level deeper: the formula behind softmax</summary>

A score’s strength is e raised to the power of the score. For whole-number exponents, the small number counts how often e multiplies itself: e³ = e · e · e ≈ 20.1 and e² = e · e ≈ 7.4. A negative whole-number exponent means dividing: e⁻¹ = 1 ÷ e ≈ 0.37. For decimal exponents, use a calculator’s eˣ key. And e⁰ is 1. For candidate number i, the formula is:

`Softmax(xᵢ) = eˣⁱ / Σⱼ eˣʲ`

Above the line is the candidate’s strength; below it, the summation sign Σ stands for the sum of all candidates’ strengths.

Here, the strengths are e^6.2 ≈ 493 (cat), e^2.9 ≈ 18 (dog), e^1.4 ≈ 4 (fox) and e^−3.0 ≈ 0.05 (car). Together about 515, of which 493 for the cat: about 96 percent.

The name comes from the hard rule “take the largest” (max). Softmax is its soft version: the largest gets the most, the others keep something, and the larger the lead, the closer it comes to the hard rule. In technical language, the scores before softmax are called **logits**.

</details>

## Take the favorite or spin the wheel

Softmax has built the wheel: “sat” has 72 percent, “slept” 27 percent, “flew” a thin strip. Nothing has been chosen yet. In the lesson on input and output, the selection step took the highest-scoring token, “on” with 8.1 after “The cat sat”. The wheel is not spun at all; the pointer points to the largest segment. This kind of selection is called **greedy decoding** (“greedy” means: it always grabs the biggest bite). Since softmax keeps the order, the largest segment always belongs to the highest score, so greedy decoding would not need softmax.

![Prize wheel: teal segment roughly three quarters, amber one roughly a quarter, a thin strip between them (schematic).](../../public/bausteine/wahrscheinlichkeit-und-softmax/gluecksrad.png)

*The prize wheel after softmax: each segment is as large as its probability. The sizes are schematic.*

You only need the wheel to choose at random: it is really spun, and the token under the pointer is chosen. This is called **[sampling](https://ki-einfach-verstehen.de/en/glossary/sampling/)**. To “sample” means to draw one choice from all the segments. Chance can look like a fair die. But “flew” does not come up as often as “sat”: large segments come up often, thin ones rarely. Over 100 spins, the pointer lands on average about 72 times on “sat”, 27 times on “slept” and once on “flew”. With sampling, answers therefore differ from one time to the next. Nothing is arbitrary, though: large segments still come up more often.

![Three attempts for The cat: Always the largest gives sat three times, Spin the wheel gives sat, sat, and slept](../../public/bausteine/wahrscheinlichkeit-und-softmax/greedy-and-sampling.svg)

*The same input three times: always taking the most likely gives “sat” three times. Spinning the wheel gives “sat” most of the time and sometimes something else (made-up draw).*

So why doesn’t a chatbot always take the largest segment? For short answers like a number, that works well. Longer texts that always pick the most likely continuation turn bland and often repeat the same phrases. Holtzman et al. (2019) find the same pattern for beam search, which looks for the overall most likely continuation. Sampling brings in variety, because the second- or third-best token sometimes comes up.

A wheel applies only to one token. Before every new token, the model computes a new score list, softmax builds a new wheel from it, and that wheel is spun exactly once. The model adds the chosen token to the text, then starts the process again.

Regenerating an answer spins all the wheels again. But if the first pointer stops somewhere else, say on “slept” instead of “sat”, all following rounds continue from that token, since it normally stays in place. That is how the same question gets a different answer.

Try it: regenerate a short answer three or four times and watch where the versions part ways.

The three segments simplify things: a real wheel has one segment per token, most of them hair-thin. How strongly chance acts when spinning can also be adjusted.

## More or less randomness: temperature

Tasks tolerate different amounts of chance. If a program must pull the same date from an email, any deviation is a problem; for ten title suggestions, variety is welcome. If your own program uses a language model, many models accept a value called **[temperature](https://ki-einfach-verstehen.de/en/glossary/temperature/)** with every request. Temperature acts in the selection step, dividing the scores before softmax. At temperature 1, the shares stay at 72, 27 and 1 percent. Dividing by 1 changes nothing.

At temperature 0.5, dividing by 0.5 means multiplying by 2. So 3, 2 and −1 become 6, 4 and −2, so all gaps are twice as large. Because every gap multiplies the strength, “sat” now lies two points above “slept”. Two points mean 2.718 times 2.718, so about 7.4 times as much. With “slept” as 1, that gives 7.4 for “sat”, 8.4 together. Divided through, “sat” gets about 88 percent (7.4 of 8.4), “slept” roughly 12. “flew” lies eight points below “sat” and stays practically empty.

At temperature 2, the scores are divided by 2. Think about what happens to the thin segment for “flew”.

> **Interactive demo:** [try it on the website](https://ki-einfach-verstehen.de/en/lessons/probability-and-softmax/)

Halving the gaps makes the segments even out. From 3, 2 and −1 they become 1.5, 1 and −0.5. The strength for “sat” at 1.5 points is e to the power 1.5. That is e · e to the power 0.5, and e to the power 0.5 is the square root of e, about 1.65. So the strength of “sat” is e · 1.65, about 4.5. For “slept” at 1 point it is e, about 2.7. For “flew” at −0.5 points it is 1 divided by 1.65, about 0.6. Together about 7.8. Of that, “flew” gets about 8 percent instead of 1, and over 100 spins it comes up about eight times instead of once.

![sat, slept, flew at temperature 0.5: 88, 12, below 1%; at 1: 72, 27, 1%; at 2: 57, 35, 8%](../../public/bausteine/wahrscheinlichkeit-und-softmax/temperature.svg)

*The same made-up scores at three temperatures: low makes the largest share dominate, high brings the shares closer together.*

The closer the temperature gets to 0, the larger the gaps become, until practically only the largest segment is left. You cannot divide by 0 itself. At temperature 0, many programs take the largest segment without spinning. That is greedy decoding.

![Thermometer with a scale; it stands for the temperature setting.](../../public/bausteine/wahrscheinlichkeit-und-softmax/thermometer.svg)

*The temperature sets how strongly the gaps between the scores count. The thermometer stands for the temperature setting.*

Temperature changes neither the model nor its scores. It is a per-request setting, not trained. Changing the temperature does not make the model smarter. A high setting makes answers more varied: rare tokens get more chances, fitting and unfitting ones alike. A low setting makes them more predictable. Whether a chat app offers a temperature slider depends on the provider. A large segment says that a word is likely, not that it is right in this answer.

## What 72 percent does not mean

If a model gives “sat” 72 percent, it is tempting to think it is 72 percent sure that “sat” is correct. **But all it means is the size of the segment on the wheel for the next token.** The pretraining from the lesson on input and output explains where this size comes from: there, the label was always the token that really followed in the text.

Suppose that in the training texts, “The cat” is followed seven times by “sat” and three times by “slept”. Each example nudges the parameters so that its label’s score rises relative to the others. The further ahead the right token already sits, the smaller its correction. “sat” is the label more often, so its score rises more often.

After ideal training, softmax turns the scores after “The cat” into roughly 70 and 30 percent. A “sat” example raises its score more when “sat” has a smaller share. A “slept” example lowers the “sat” score more when “sat” has a larger share. With a 7-to-3 split, those corrections balance when “sat” reaches exactly 70 percent. This ratio belongs only to this example, not to the 72 percent from above. Ideally, the model approximates how often a continuation followed the same start. Pretraining does not check whether the continuation is true. A later round of training for a helpful chatbot shifts the scores again. Even then, the segments are no reliable measure of whether an answer is correct.

Suppose many training texts continue “The capital of Australia is” with “Sydney”. Then “Sydney” gets a large segment, even though Canberra is the capital. A chatbot then phrases a wrong answer as fluently as a right one. A later lesson on convincingly wrong answers shows how often that happens.

The model computes the scores from its parameters. Unlike the temperature, training sets these parameters.

Back to the start: if the app uses sampling, the different answer when regenerating comes from a new spin of the same first wheel. The parameters of the model have not changed.

---

Source: https://ki-einfach-verstehen.de/en/lessons/probability-and-softmax/

← Previous: [Scalar, Vector, Matrix, Tensor: the Building Blocks of Numbers](./scalar-vector-matrix-tensor.md) · [All lessons](../../README.md#contents) · Next: [Parameters, Training and Use: How a Model Learns](./parameters-training-inference-hardware.md) →
