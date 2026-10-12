<!-- Generated from src/content/bausteine/en/backpropagation-and-gradients.mdx by scripts/export-lessons.mjs -- do not edit by hand. -->

# Backpropagation and Gradients: How the Model Knows What to Change

> Reading copy for GitHub. The full version with interactive demos, animations and recall moments is on the website: **[Backpropagation and Gradients: How the Model Knows What to Change](https://ki-einfach-verstehen.de/en/lessons/backpropagation-and-gradients/)**
>
> Licence: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.en) · Credit it as: KI einfach verstehen, “Backpropagation and Gradients: How the Model Knows What to Change”, CC BY 4.0, https://ki-einfach-verstehen.de/en/lessons/backpropagation-and-gradients/

How training turns a single error number into a direction and a strength for every fader, why one pass backwards through the model is enough, and why no fader moves along the way.

At the end of the forward pass, the computation from the input through all [layers](https://ki-einfach-verstehen.de/en/glossary/layer/) to the output, there is a single number for the whole [batch](https://ki-einfach-verstehen.de/en/glossary/batch/), the big stack of text that training evaluates at once: the [loss](https://ki-einfach-verstehen.de/en/glossary/loss/). It says how wrong the model was across all these examples. It does not say which of the billions of faders contributed how much. The lesson on training made a promise about this: a method called [backpropagation](https://ki-einfach-verstehen.de/en/glossary/backpropagation/) gives the slope for all faders at once, in a single pass backward through the model.

Suppose you want to find out by probing the stair light from the lesson on neural networks which fader changes the error and how strongly. How many extra forward passes through the network would you need? Hold on to your guess.

## A note for every fader

A mixing desk sounds off. Many faders, one bad sound: which one has to go where? You know the mixing desk from the first lessons. Its faders are the model’s [parameters](https://ki-einfach-verstehen.de/en/glossary/parameters/), the weights and [biases](https://ki-einfach-verstehen.de/en/glossary/bias/) that training sets. They are stored and stay as they are as long as nobody turns them.

What is new are the **notes**. After every batch, training uses the loss and the [intermediate values](https://ki-einfach-verstehen.de/en/glossary/intermediate-value/) of the forward pass to compute a note at every fader, with two pieces of information, a direction and a strength: “higher, strongly” on one, “lower, barely” on another. Unlike the faders, the notes are not part of the finished model. They hold for this one batch; for the next one, training computes new ones. A note does not turn a fader either, and it does not say where the right value lies.

![Mixing desk with a note under every fader, each with an arrow pointing up or down](../../public/bausteine/backpropagation-und-gradienten/mischpult-zettel.webp)

*The mixing desk with notes: the signal comes in on the left, small meters above the faders show the intermediate values of the forward pass, and the large meter at the top right shows how wrong the result is. A note with an arrow hangs on every fader: up means “higher”, down means “lower”. The faders themselves are still where they were.*

You already know what is on a note: it is the **slope** from the lesson on training. There, slope meant how strongly the error changes with a tiny turn at exactly one spot. If the error falls when the fader goes up, the note says “higher”. If it rises, the note says “lower”. The apple model had only one fader and therefore only one slope. A language model has billions of faders, and each needs its own. Remember the hillside in the fog? There you felt underfoot which way the ground falls and how steeply. A note measures exactly that for a single fader: how steeply it goes downhill here if only this fader moves.

All the notes together are called the **[gradient](https://ki-einfach-verstehen.de/en/glossary/gradient/)**: the list of the slopes of all faders, a direction and a strength for each. Llama 3.1 8B, the openly released model from the lesson on training, has about eight billion parameters according to its model page. So after every batch it gets about eight billion notes.

Still, backpropagation is often taken as the name for all of learning, because the two are usually mentioned in the same breath. A textbook on neural networks is clear: backpropagation refers only to the method that computes the gradient. Learning is done by another method that uses this gradient. So after backpropagation, every fader is exactly where it was. A separate step then decides whether and how far to turn.

But where do the notes come from? On the stair light, every single one can be worked out by hand.

## Backwards through the stair light

The stair light has two switches; the light is on when exactly one is pressed. [Neurons](https://ki-einfach-verstehen.de/en/glossary/neuron/) A and B see both switches with weight 1 plus their bias: 0 for A, −1 for B. The lower limit from the lesson on neural networks sets negative sums to 0. C takes A times 1, B times −2. Neither, only top, only bottom and both switches give 0, 1, 1, 0.

One fader is set wrong: C’s weight for B is −1 instead of −2. Only “both” goes wrong: A computes 2, B 1, and C 2 minus 1, so 1 instead of 0. As in the apple model, the error is the deviation times itself, so 1. Language models measure it with the loss: the lower the right [token](https://ki-einfach-verstehen.de/en/glossary/token/)’s probability, the more penalty points, at every position. The backward pass does the same steps there, with the slope of the loss. All notes here hold for this case.

The backward pass starts at C’s output. It is not a fader, but the error hangs on it. If it moves up by 0.01 to 1.01, the error grows by about 0.02; divided by 0.01, that is about 2. At a deviation of 0.5 (error 0.25), the same turn would add about 0.01: slope about 1. With “deviation times itself”, this **slope at C** is always twice the deviation. For a fader, positive means “lower”, since turning it up raises the error; negative, “higher”.

If **C’s weight for B** turns a little, C changes by that amount times B’s output, an intermediate value from the forward pass. So its note is 2 times 1: 2. The **weight for A** gets 2 times 2, so 4, and **C’s bias** 2: all three “lower”.

Does the note on B’s weight for the top switch say higher or lower? Think first.

> **Interactive demo:** [try it on the website](https://ki-einfach-verstehen.de/en/lessons/backpropagation-and-gradients/)

For B’s faders, the backward pass first computes the **influence of B**: how strongly the error reacts to B. The one that counts here is C’s weight for B, the wrong one: 2 times −1, so −2. B’s sum was 1; the lower limit passes it, factor 1. The top switch’s weight gets −2 times the pressed switch, 1: note −2, higher. So do the bottom weight and the bias. For A, the influence is 2 times the weight 1; its three faders get 2 each, lower.

| Fader | Calculation (slope at C first) | Note |
|---|---|---|
| C: weight for A | 2 · output of A (2) | 4, lower |
| C: weight for B | 2 · output of B (1) | 2, lower |
| C: bias | 2 · 1 | 2, lower |
| B: both weights, bias | 2 · C’s weight for B (−1) · lower limit (1) · switch or 1 | −2 each, higher |
| A: both weights, bias | 2 · C’s weight for A (1) · lower limit (1) · switch or 1 | 2 each, lower |

Every fader now has a note. But the backward pass misses the wrong one: the largest note, 4, hangs on C’s weight for A, which is correct. A note measures how strongly the error depends on a fader, not who caused it.

Check on the wrong fader: at −1.01, C computes 0.99, and the error drops to about 0.98: slope about 2, as the note says.

![Animation: backward pass through the stair light, a note at every fader](../../public/bausteine/backpropagation-und-gradienten/treppenlicht-rueckweg-en.static.svg)

[▶ watch the animation on the website](https://ki-einfach-verstehen.de/en/lessons/backpropagation-and-gradients/)

*The backward pass in the case “both”, step by step: from the slope at C’s output to the notes at C, then via the influence of B and of A to their faders. Invented network with the weight set wrong to −1.*

The lower limit can also block the backward pass. Suppose C’s bias were 0.5: in the case “neither”, C shows 0.5 instead of 0. B’s sum there is −1, which the lower limit makes 0: even with B’s bias at −0.99, B stays at 0 and C does not change. So B’s faders get no note from this case: the lower limit is a factor of 0.

<details class="verstaendnishilfe">
<summary>Which fader gets a note at all in the case “neither”?</summary>

None. As things stand, this case is right: C computes 0. The deviation is 0, so the slope at C is 0 too, and every note is a multiple of it. If C were wrong there, C’s bias would get a note, but B’s faders would still get none.

</details>

Training your chatbot’s model runs this backward pass through billions of faders after every batch.

## One backward pass instead of billions of probes

This backward pass is called **[backpropagation](https://ki-einfach-verstehen.de/en/glossary/backpropagation/)**, roughly “spreading backwards”: from the error, the calculation goes back [layer](https://ki-einfach-verstehen.de/en/glossary/layer/) by layer to the input, and every fader gets its note. Probing, as in the opening question, means turning a fader a little, running the network forwards and comparing the new error with the old.

> **Interactive demo:** [try it on the website](https://ki-einfach-verstehen.de/en/lessons/backpropagation-and-gradients/)

For the stair light, that is nine extra forward passes, one per fader: turning all at once would not show which fader contributes what. Backpropagation needed a single backward pass.

Why is one enough? B’s influence, the −2, was computed once and used for all three of B’s faders. With another layer before B, the backward pass would compute that layer’s influence from B’s, again only once, and so on back to the input.

![Four meshing gears of different sizes in a row, on the left a large gear with a crank](../../public/bausteine/backpropagation-und-gradienten/getriebe.webp)

*The gear train: how strongly the last gear turns along follows from the ratios along the way, multiplied together. In the network, some ratios are stored weights, others are values of this pass, such as the lower limit.*

The calculation works like a **gear train**: the ratios along the way, multiplied, tell how strongly the last gear turns. For B’s weight for the top switch, these are the four factors from the table: 2, −1, 1 and 1. Multiplied: −2, the note. All of B’s faders share the first ratios; the backward pass computes them once. Unlike a real gear train, not every ratio is fixed: the weights stay put, but the lower limit passes on with 1 or 0, depending on the input.

![Nine probe passes with approximate notes such as 2.01 and 4.04 above one backward pass with the exact notes](../../public/bausteine/backpropagation-und-gradienten/probedrehen-rueckweg-en.svg)

*Probing against the backward pass on the stair light, case “both”: nine extra forward passes, one per fader, against a single backward pass. Both give the same direction and almost the same strength; only the backward pass is exact.*

Does the error flow backwards and repair the faders? No: what runs backwards is a calculation that needs the forward pass’s values: without the 2 from A and the 1 from B, there is no note at C. So training keeps these intermediate values until the backward pass is done, which takes extra memory, as in the lesson on model size.

The backward pass is not free. Forwards, every weight computes once: weight times input. Backwards, twice: influence times input for its own note, influence times weight for the layer before. A 2020 paper from OpenAI, the company behind ChatGPT, turns this into a rule of thumb: the backward pass takes about twice as much compute as the forward pass. Together that is about three times the cost of answering, as in the lesson on training. For Llama 3.1 8B, a training step per token thus costs about three forward passes; probing would need one for each of its eight billion faders.

<details>
<summary>One level deeper: Why can notes vanish or become huge?</summary>

In mathematics, multiplying the ratios is the **chain rule** of calculus. In 1986, David Rumelhart, Geoffrey Hinton and Ronald Williams described the backward pass for neural networks in the journal Nature. Others found it independently around then; efficient uses of the chain rule go back to the 1960s.

If many ratios are below 1, the product shrinks with every layer: 0.5 multiplied ten times gives less than a thousandth. Near the input, the notes then become too small to show a direction. If many ratios are above 1, the product grows quickly, the notes become huge, and learning can become unstable. The textbook on neural networks calls this the problem of vanishing and exploding gradients.

Any very deep network can be hit. Worst are networks that apply the same weights at every step: the same ratio repeats, and even one just below 1 shrinks with every repeat. In networks where values only run forward from layer to layer (feed-forward), every layer has its own weights, and the textbook says even very deep ones can largely avoid the problem. A limit helps against huge notes. GPT-3’s training capped the overall size of the gradient at 1.0: when it was larger, all notes shrank in proportion, keeping their directions.

</details>

## A note only holds here and now

In the case “both”, the note on C’s weight for A is the strongest of all: “lower, 4”. What happens if the weight follows it a long way, from 1 down to 0? Make a guess first.

In the case “both”, C then computes 0 minus 1, so −1, wrong again, just in the other direction. And the cases “only top” and “only bottom”, which were right before, break: A computes 1, B computes 0, and C shows 0 instead of 1. The light would stay dark with exactly one switch pressed.

A note seems to point to the right value. But it only shows the slope at the current spot. As in the fog: you feel the slope under your feet, not the hillside ten steps further on. Take a long stride and you can end up going uphill again. That is why **a note only holds for the setting at which it was computed**.

It also only holds for the case it comes from. In the network with the weight set wrong, the other three cases are right and give 0; averaged over all four cases, the note of 4 shrinks to 1. Other examples give other notes, and they can contradict each other. Suppose only C’s weight for A moves a little, from 1 to 0.9. In the case “only top”, C then shows 0.9 instead of 1, so it is 0.1 too low. The slope at C is 2 times −0.1, so −0.2; times A’s output, 1, the note stays −0.2, so “higher”. The same in the case “only bottom”. In the case “both”, C shows 0.8, 0.8 too high, and the slope is 1.6; times A’s output, 2, that gives 3.2: “lower”.

![Four cases with the notes 0, −0.2, −0.2 and 3.2, combined into the average 0.7, lower](../../public/bausteine/backpropagation-und-gradienten/vier-faelle-zettel-en.svg)

*A batch of four cases, four notes for the same C’s weight for A after it has moved to 0.9: twice “higher”, once “lower”, once nothing. The note for the batch is their average. Invented network, worked out.*

That is why training computes the notes for all examples of a batch and combines them. The loss of a batch is the average over its examples. Each example enters it only with its share, and so does its slope; so every note is also an **average** over all examples’ notes. For C’s weight for A, 0, −0.2, −0.2 and 3.2 add up to 2.8; divided by four, that is 0.7: lower, but much weaker than the 3.2 from the case “both” alone. For GPT-3, a batch grew to millions of tokens during training; each one is such an example. Then training turns the faders a little in the direction of their notes, and the next batch brings new notes.

So far, not a single fader has moved. But the notes are shaky, and the next batch brings different ones. Who decides how far to turn, and what happens to notes that contradict each other from batch to batch? That is the subject of the next lesson, on optimizing the weights.

---

Source: https://ki-einfach-verstehen.de/en/lessons/backpropagation-and-gradients/

← Previous: [Forward Pass and Loss: How the Model Measures Its Own Error](./forward-pass-and-loss.md) · [All lessons](../../README.md#contents) · Next: [Optimization: What Actually Changes the Weights](./optimization-of-the-weights.md) →
