<!-- Generated from src/content/bausteine/en/probability-and-softmax.mdx by scripts/export-lessons.mjs -- do not edit by hand. -->

# Probability and Softmax: How a Model Decides

> Reading copy for GitHub. The full version with interactive demos, animations and recall moments is on the website: **[Probability and Softmax: How a Model Decides](https://ki-einfach-verstehen.de/en/lessons/probability-and-softmax/)**
>
> Licence: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.en) · Credit it as: KI einfach verstehen, “Probability and Softmax: How a Model Decides”, CC BY 4.0, https://ki-einfach-verstehen.de/en/lessons/probability-and-softmax/

How a language model turns its scores into percentages, why it sometimes picks the obvious choice and sometimes not, and what temperature does.

The previous lesson ended with the score vector: one number for each text piece, such as 7.1 or −2.3. Scores like these are not yet probabilities. Even so, a language model has to turn this long list into exactly one text piece in the end.

A small example shows what this is about. You type “The cat”, and the model rates every text piece by how well it fits next. Suppose it knows only three continuations, with made-up scores: “sat” 3.0, “slept” 2.0 and “flew” −1.0. That leaves two questions open. Which piece gets chosen? And why does a chatbot often answer differently when you have it regenerate the answer, even though nothing about your question has changed?

## What a percentage can do that a score cannot

Your weather app shows an 80 percent chance of rain for tomorrow. You know right away what to do with that. According to Germany's national weather service, the DWD, it means: on 8 out of 10 comparable days there was precipitation at that location, meaning rain, snow or something similar. The number does not say how long or how heavy. A number like this is called a **[probability](https://ki-einfach-verstehen.de/en/glossary/probability/)**. It states how often something happens if the same situation repeats very many times, and it always lies between 0 and 100 percent.

For the weather, there are two possibilities here: rain or no rain. If 80 percent stands for rain, 20 percent remain for dry, because there is no more than 100 percent to hand out. A list with one value for each possibility, where every value lies between 0 and 100 percent and all of them together add up to exactly 100, is called a **probability distribution**, or distribution for short.

![Three cats side by side: on the left a large cat sitting upright, in the middle a medium-sized cat curled up asleep, on the right a very small cat hanging in the air from a balloon](../../public/bausteine/wahrscheinlichkeit-und-softmax/drei-kandidaten.png)

*Three possible continuations of “The cat …”: sat, slept, flew. Not all of them are equally plausible.*

Now back to the three candidates for “The cat …”. Their scores are 3.0, 2.0 and −1.0. Suppose you have the answer regenerated a hundred times. Can you read from the scores how often “sat” should come up? Give it a quick try before you read on. “flew” is where it falls apart: a score can be negative, and “flew comes up minus one time in a hundred” makes no sense. The scores have no fixed total either: 3.0 plus 2.0 plus −1.0 makes 4.0, and after a different sentence opening, the total would be something else entirely. A score tells you which candidate is ahead of another and by how much. But it does not tell you directly how often that candidate should come up. That takes one more conversion.

So wherever an AI shows you percentages, it has already converted the scores. Image recognition does not report “cat 6.2” but something like “cat 93%” (a made-up number). The word suggestions above your phone keyboard come from percentages like these, too. Google describes it like this for its Gboard keyboard: a language model calculates how likely each next word is. The most likely word sits in the middle of the suggestion strip, with the second and third most likely to its left and right.

But how do you get from 3.0, 2.0 and −1.0 to percentages?

## From points to shares: softmax

After a quiz night, the scoreboard reads: team A 30 points, team B 20, team C 10. The shares are easy to work out: 60 points in total, and team A has half. Does that work for the scores, too?

The three scores add up to 4.0. “sat” would get 3.0 of 4.0, or 75 percent, “slept” 50 percent and “flew” −25 percent. The total is right, but a negative share is useless. Scores need a different approach.

Language models actually take a three-step approach.

Step 1: Every score becomes a positive number, its weight. A fixed rule applies: a score of 0 gets the weight 1. Every point above that multiplies it by about 2.72, every point below divides it by 2.72. So 3.0 becomes about 20.1, 2.0 about 7.4 and −1.0 about 0.37.

Step 2: The weights are added up. 20.1 plus 7.4 plus 0.37 makes about 27.8.

Step 3: Each weight is divided by this sum, like a team's points by the total. “sat” gets 20.1 of 27.8, or about 72 percent, “slept” about 27 and “flew” about 1 percent. Together that makes 100 percent.

![Animation: softmax turns the scores 3.0, 2.0 and −1.0 into the probabilities 72, 27 and 1 percent](../../public/bausteine/wahrscheinlichkeit-und-softmax/softmax-steps.static.svg)

[▶ watch the animation on the website](https://ki-einfach-verstehen.de/en/lessons/probability-and-softmax/)

*Softmax in three steps: turn the scores into positive weights, add up the weights, divide each weight by the sum.*

This calculation is called **[softmax](https://ki-einfach-verstehen.de/en/glossary/softmax/)**. It turns any list of scores into a distribution. Three consequences are worth a closer look.

The first: the order is preserved. Whoever has the highest score also gets the largest share.

![On the left, the scores as bars along a zero line: sat 3.0, slept 2.0, flew −1.0 pointing left; an arrow labeled softmax leads to the right to the probabilities 72%, 27% and 1%, 100% in total](../../public/bausteine/wahrscheinlichkeit-und-softmax/points-to-percent.svg)

*Softmax turns points into shares: the order stays the same, and the total is 100%.*

The second concerns the differences. What happens if you add 10 to all three scores, making them 13.0, 12.0 and 9.0? Do the percentages get larger, smaller, or stay the same?

They stay exactly the same: 72, 27 and 1. Ten extra points make all three weights about 22,000 times as large, and their sum as well. Dividing each weight by the sum then gives the same share as before, just as 2 out of 4 is the same half as 20 out of 40. This is where the scoreboard picture ends: if every team there got 10 extra points, the shares would shift. **With scores, all that counts is how far apart they are.**

One point ahead makes a weight about 2.7 times as large, three points about 20 times: the weight of “slept” (7.4) is about 20 times that of “flew” (0.37). A candidate far ahead of all others therefore gets almost everything.

The third: no candidate drops all the way to zero. “flew” keeps about 1 percent, however unsuitable it is. Softmax does not throw anything away, it only distributes.

GPT-2 runs exactly this calculation for every next text piece, only with all 50,257 scores at once. Image recognition usually gets its percentages from softmax, too.

<details>
<summary>One level deeper: the formula behind softmax</summary>

The weight of a score is the number e raised to the power of the score. e is a mathematical constant, about 2.718. The small raised number counts how often e is multiplied: e³ = e · e · e ≈ 20.1 and e² = e · e ≈ 7.4. A negative raised number means dividing: e⁻¹ = 1 ÷ e ≈ 0.37. And e⁰ is 1, just as in the rule from step 1. As a formula for candidate number i:

`Softmax(xᵢ) = eˣⁱ / Σⱼ eˣʲ`

On top is the candidate's weight, below it the sum of all candidates' weights. The Σ is the summation sign.

The name comes from the rule “take the largest”, which gives the winner 100 percent and everyone else zero. Softmax is a soft version of it: the largest gets the most, and the others keep something. The bigger the lead, the closer softmax comes to the hard rule. Experts call the scores before softmax **logits**.

</details>

That is all of softmax: the order stays the same, only the differences count, and no one drops to zero. Now there are percentages. But nothing has been chosen yet.

## Take the favorite or spin the wheel

What do you do with 72, 27 and 1 percent when exactly one text piece has to come out? A picture helps: a prize wheel with three segments. The segment for “sat” takes up 72 percent of the wheel, the one for “slept” 27 percent, and “flew” gets a narrow strip of 1 percent. Softmax has built this wheel from the scores. The distribution is the wheel.

![A prize wheel on a stand with a pointer at the top; a large teal segment takes up about three quarters of the wheel, a medium amber segment about a quarter, with a very narrow light strip between them](../../public/bausteine/wahrscheinlichkeit-und-softmax/gluecksrad.png)

*The prize wheel after softmax: every segment is as large as its probability.*

You already know the simplest option from the lesson on input and output: always take the most likely piece, here “sat” (experts call this **greedy decoding**). On the wheel, you simply point at the largest segment without spinning. Notice one thing, though: softmax does not change the order, so the largest segment always belongs to the highest score. If you only ever take the favorite, you do not need the percentages at all. So why go to all that trouble?

For the second option: the wheel really is spun, and the piece where the pointer stops is taken. This is called **[sampling](https://ki-einfach-verstehen.de/en/glossary/sampling/)**. Over 100 spins, the pointer lands on average about 72 times on “sat”, 27 on “slept” and once on “flew”. Every piece with a share above zero can come up, just not equally often.

![Two rows with three attempts each for the input The cat: the row Always the largest shows sat three times, the row Spin the wheel shows sat, sat and slept](../../public/bausteine/wahrscheinlichkeit-und-softmax/greedy-and-sampling.svg)

*The same input three times: always taking the most likely piece gives “sat” three times. Spinning the wheel gives mostly “sat” and sometimes something else (made-up draws).*

**So chance here does not mean the model takes just any word.** Everyday chance brings to mind a die, where every side comes up equally often. On the wheel, though, the segments differ in size. Because of that, sampled answers usually stay sensible and still vary from one time to the next. Many applications also remove the completely unsuitable pieces first (more on that in the box below).

Why not always take the most likely piece? For short answers such as a number, that works well. Longer texts, however, become bland and easily fall into loops of repeated phrases. This reinforces itself: once a phrase appears twice in the text, repeating it often becomes the most likely continuation, and always taking the favorite never gets out of this rut. This has been studied thoroughly for language models. Sampling brings variety, because now and then the second- or third-best piece comes up.

One correction to the picture: there is not one wheel for the whole answer. For every text piece, the model computes new scores, softmax builds a new wheel from them, and that wheel is spun exactly once. The chosen piece is appended, and the loop from the lesson on input and output starts again. If you have a chatbot regenerate an answer, all the wheels are spun again. If the pointer stops somewhere else early on, say at “slept” instead of “sat”, all following rounds build on that, because nothing gets taken back. That is how the same question gets a completely different answer.

<details>
<summary>One level deeper: tens of thousands of hairline segments</summary>

A real wheel in GPT-2 has not three segments but 50,257, one per vocabulary entry, most of them hairline thin. Together, though, they add up to a lot. A made-up example: besides the three candidates, there are 50,000 unsuitable text pieces scoring −10. Each of them gets only 0.00015 percent, but all of them together get 7.5 percent. With pure sampling, the pointer then lands on an unsuitable piece about every 13th spin. Researchers observed this with GPT-2: pure sampling produced incoherent text.

Many applications therefore cut off this long tail before spinning. **Top-k** keeps only the k most likely pieces, for example the best 50. **Top-p** keeps the smallest group of the most likely pieces that together reach at least a certain share, for example 90 percent. The other segments disappear, and the rest are scaled back up to 100 percent. In the cat example, top-p with 90 percent would remove “flew”; “sat” would then have 73 percent, “slept” 27. Unlike softmax, this step *really does* throw candidates away.

</details>

Can you set how much chance is involved in the spin?

## More or less randomness: temperature

If you build a language model into your own programs through the provider's programming interface, you find a setting called temperature. Behind it is a simple step between the model's scores and softmax: they are divided by a number, the **[temperature](https://ki-einfach-verstehen.de/en/glossary/temperature/)**. At temperature 1, everything stays as it was: 72, 27 and 1 percent.

At temperature 0.5, they are divided by 0.5: softmax now gets 6, 4 and −2 instead of 3, 2 and −1. The differences are now twice as large, and softmax again turns every point ahead into a factor of about 2.7. The result: “sat” 88 percent, “slept” 12 percent, “flew” only 0.03 percent. The wheel gets more lopsided, and the large segment grows even larger.

And at temperature 2? Think about what happens to “flew” before you read on. Divided by 2, softmax gets 1.5, 1 and −0.5. The differences shrink by half, and the segments become more alike: 57, 35 and 8 percent. “flew” now comes up about every 13th spin instead of every hundredth.

![Three groups of bars for sat, slept and flew: at temperature 0.5 88%, 12% and 0.03%, at temperature 1 72%, 27% and 1%, at temperature 2 57%, 35% and 8%](../../public/bausteine/wahrscheinlichkeit-und-softmax/temperature.svg)

*The same scores at three temperatures: a low temperature sharpens the distribution, a high one flattens it.*

The closer the temperature gets to 0, the larger the differences become. At 0.2, “sat” already has over 99 percent. In the end, only the largest segment is left, and spinning turns into taking the most likely piece. You cannot divide by 0 itself. Temperature 0 is therefore a convention: providers then simply take the most likely piece. Even that does not guarantee identical answers, because tiny rounding differences can creep in, as the lesson on input and output describes.

![Thermometer](../../public/bausteine/wahrscheinlichkeit-und-softmax/thermometer.svg)

*Temperature controls how much the differences between the scores count.*

**Temperature changes neither the model nor the scores it computes.** They are only divided afterward. Temperature is not one of the model's parameters, it is not trained, and it can be set differently for every request. It only determines how much the differences between the scores count there. So a high temperature does not make a model smarter. It gives less likely pieces a chance more often, good surprises and nonsense alike.

> **Interactive demo:** [try it on the website](https://ki-einfach-verstehen.de/en/lessons/probability-and-softmax/)

Where temperature can be set, it usually ranges from 0 to 1 or from 0 to 2. Providers recommend low values for tasks with one right answer and higher ones for creative tasks, where there is no one right answer. That does not make the model more creative; it just draws less obvious pieces more often. For some new models, though, it can no longer be changed at all, or the provider advises against it and sets the value itself. Chat apps usually have no setting for it anyway.

## What 72 percent does not mean

So what do the percentages actually say? If a model gives “sat” 72 percent, it is tempting to think it is 72 percent sure that “sat” is correct. **But all it means is the share of the wheel for the next text piece.** It roughly reflects what followed next in similar texts during training, not what is true. Chatbots also get a second round of training, post-training, which tunes the model toward helpful answers in conversation. That shifts the segments too, but does not make them a measure of truth either.

![Umbrella](../../public/bausteine/wahrscheinlichkeit-und-softmax/regenschirm.svg)

*For the weather, real rain is used to check whether the percentages are right.*

This is also where the weather picture ends. The weather service is measured against real rain, over many similar days. Whether a model's percentages match its hit rate has to be checked separately. That works for tasks with a fixed solution, such as a quiz question with the answers A, B, C and D. There, the answer is a single text piece, and each letter has its own segment on the wheel.

If you collect all the questions where the chosen answer's segment is about 72 percent, you can count: if the percentages also worked as a hit rate, about 72 out of 100 would have to be right. Often that does not hold. For GPT-4 it matched well before this post-training, and less well afterward. And because the percentages only say what sounds good next, a chatbot can phrase a wrong answer just as fluently and confidently as a correct one.

That answers the question from the beginning. Softmax turns the scores into a distribution, a wheel with one segment per text piece. Then either the largest segment is taken or the wheel is spun, and temperature decides beforehand how different the segments are in size. Because the wheel is spun, the same question can get different answers. What remains open is what is behind the scores. They are calculated from the model's parameters, and temperature was a first example of a setting that is not trained. The next lesson shows how many parameters a model has, how training sets them, and what happens when a finished model is used.

---

Source: https://ki-einfach-verstehen.de/en/lessons/probability-and-softmax/

← Previous: [Scalar, Vector, Matrix, Tensor: the Building Blocks of Numbers](./scalar-vector-matrix-tensor.md) · [All lessons](../../README.md#contents) · Next: [Parameters, Training vs. Inference, Hardware: How a Model Runs](./parameters-training-inference-hardware.md) →
