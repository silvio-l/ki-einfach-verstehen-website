<!-- Generated from src/content/bausteine/en/optimization-of-the-weights.mdx by scripts/export-lessons.mjs -- do not edit by hand. -->

# Optimization: What Actually Changes the Weights

> Reading copy for GitHub. The full version with interactive demos, animations and recall moments is on the website: **[Optimization: What Actually Changes the Weights](https://ki-einfach-verstehen.de/en/lessons/optimization-of-the-weights/)**
>
> Licence: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.en) · Credit it as: KI einfach verstehen, “Optimization: What Actually Changes the Weights”, CC BY 4.0, https://ki-einfach-verstehen.de/en/lessons/optimization-of-the-weights/

How the optimizer turns the notes from backpropagation into real steps: with momentum, with a step size of its own for every fader, with a gentle pull toward zero and on a schedule for the learning rate.

At the end of the last lesson, each of the roughly eight billion faders on Llama 3.1 8B’s mixing desk had a note on it. Backpropagation had worked it out for one [batch](https://ki-einfach-verstehen.de/en/glossary/batch/), a stack of text that the [loss](https://ki-einfach-verstehen.de/en/glossary/loss/) turns into a single error number. Each fader stands for a [parameter](https://ki-einfach-verstehen.de/en/glossary/parameters/), its setting for that parameter’s number. Its note says, for this batch only: up or down, and how strongly. All the notes together are called the gradient. Not a single fader has moved yet.

With the next batch, many notes point a little differently, some the opposite way. What do you think: where does it lead to follow the notes every time?

## Who turns: the optimizer, with momentum

From the lesson on training you know the simplest answer: step equals slope times [learning rate](https://ki-einfach-verstehen.de/en/glossary/learning-rate/). A note is this slope, for each fader separately: which way is downhill, and how steeply. With the made-up apple model and a learning rate of one twenty-fourth, every step halved the rest of the way to the valley. With one sixth, the fader jumped back and forth between 0 and 6. A fixed calculation like this, which turns notes into steps, is called an **[optimizer](https://ki-einfach-verstehen.de/en/glossary/optimizer/)**. In training, the optimizer is what turns the faders, step by step.

Following the simple rule to the letter causes a problem, as a made-up model with two faders shows. Its error forms a foggy hillside, as in the lesson on training, now with two directions: one fader moves you across, the other along. The hillside is a narrow ravine: across, the ground falls steeply toward its middle; along, it only slopes gently downhill. With large steps you land on the opposite side each time, like the apple model at 6, and your path zigzags. Smaller steps stop the jumping, but then you barely progress along the ravine. And the hillside wobbles: every batch delivers slightly different notes.

![Ravine from above: the plain rule jumps from edge to edge, the path with momentum runs calmly down the middle to the valley](../../public/bausteine/optimierung-der-gewichte/ravine-zigzag.svg)

*A made-up ravine seen from above, with the valley on the left. The plain rule follows every note and zigzags from edge to edge; with momentum the path becomes calmer.*

Smooth made-up numbers show what helps. Across, you jump from side to side, so the notes there alternate between +8 and −8. Along, they say 1 every time. The notes only apply to their batch and are gone afterwards. What remains of them from batch to batch is the **momentum**: not physics, but a stored number per fader that takes in a bit of each new note.

The optimizer follows the momentum instead of every note. The new momentum is old momentum and a tenth new note. The step is learning rate times momentum, not times note. What points back and forth across almost cancels out; what always points the same way along accumulates. After twenty notes, the momentum across barely swings around zero, while along it has grown to almost the full note.

![Two charts: across, the notes jump between +8 and −8 and momentum stays near zero; along, momentum rises to almost 0.9](../../public/bausteine/optimierung-der-gewichte/momentum-notes.svg)

*The made-up example from the text: across, the notes almost cancel out in the momentum; along, it builds up to almost the full size of a note.*

Its technical term is **[Momentum](https://ki-einfach-verstehen.de/en/glossary/momentum/)**. A textbook describes it as an average of earlier slopes in which older ones count less and less, and the optimizer keeps moving in their direction. This form of momentum averages: the new note enters with only 10 percent. GPT-3, a forerunner of the models behind ChatGPT, kept these 90 percent in training. The share is chosen, so it is a [hyperparameter](https://ki-einfach-verstehen.de/en/glossary/hyperparameter/).

With this averaging, the path along the ravine stays below the full note. It becomes calmer, so it can take larger steps without building up across.

<details>
<summary>One level deeper: two ways of writing momentum</summary>

The textbook's formula, however, adds up the earlier notes without dividing, and at the same learning rate its steps become up to ten times as large. The main text's form works like this sum with a learning rate ten times smaller. A fader that keeps getting the same note gets a momentum ten times that note in the sum: each new note comes in fully, and the old momentum keeps only 90 percent. The main text's form stays at that note itself, because it takes only 10 percent of the new note. For a comparison, the summing form needs a learning rate ten times smaller. The summing form goes back to Boris Polyak (1964).

</details>

Momentum smooths out the back and forth. But it does nothing about some faders always getting large notes and others tiny ones.

## Every fader its own step size

Earlier lessons said only this: large language models set each fader’s step by how large its slopes have been so far, and keep two helper values per fader for that. What are they for?

Two made-up faders, each with four notes from four batches. Instead of the mixing above, the table simplifies and takes a plain average of the four notes twice: with signs, where plus and minus cancel out, and without signs. The second is called usual size here: how strong the notes are on average, whichever way they point. For P the notes cancel out with signs; without signs each lies between 8 and 11.

| Fader | Notes | Average with signs | Usual size |
|---|---|---|---|
| P | 10, −8, 9, −11 | 0 | about 9.5 |
| Q | 0.1, 0.1, 0.1, 0.1 | 0.1 | 0.1 |

With the plain rule, P’s last note gives a step of 11 times the learning rate, Q’s a step of 0.1 times, a hundred and ten times less. Yet P’s notes contradict each other, while Q always gets the same message, quietly. What do you think: which of the two should take the larger step, though the plain rule has it the other way round?

![A hiker in a foggy gorge; the footprints lie far apart along the floor and short and close together toward the walls](../../public/bausteine/optimierung-der-gewichte/wanderer.webp)

*A step length of its own for every direction: careful where it is steep and restless, bold where it slopes gently and steadily downhill.*

A good hiker in the ravine would choose a step length for each direction, not for each spot: short steps across, where the slope keeps changing, and long strides along, where it is flat but steadily downhill. Where the slope kept flipping during their last steps, they grow more careful. The optimizer has as many directions as there are faders and knows only the notes, so it works out a step length for each of billions of them on its own.

That is what the method **Adam** does, introduced by two researchers in 2014. For each fader it keeps two helper values: the momentum and the usual size of its notes. Its step is learning rate times momentum, divided by the usual size. For P the momentum is almost zero, so there is almost no step. For Q, momentum and usual size are equal, so the step is one full learning rate. Adam divides out the size of the notes: the usual size only measures how strong they are, while the momentum decides whether they point steadily one way.

Still, Adam is no model and learns nothing: it is a fixed calculation with chosen settings. Momentum and usual size are running values of training, not parameters, so the finished model does not need them. GPT-3 was trained with Adam.

<details>
<summary>One level deeper: How Adam measures the usual size</summary>

Adam measures the usual size differently from the table, which only shows the order of magnitude. It multiplies each note by itself, so every value is positive, and keeps a running average of these, which is extended each batch, like the momentum. From this average it takes the square root and gets back to the order of magnitude of the notes. With the simple average from the table, this works out for P like this: 10 times 10 is 100, 8 times 8 is 64, 9 times 9 is 81 and 11 times 11 is 121. Together that is 366; divided by 4, that is 91.5; and its square root is about 9.6, almost the same usual size as in the table.

</details>

<details class="verstaendnishilfe">
<summary>Which fader moves further, P or Q?</summary>

Q. Its steps point the same way each batch and add up: after a hundred such batches, about a hundred learning rates far. P’s steps are tiny and point this way one time and that way the next. They largely cancel out, and P stays roughly where it was.

</details>

> **Interactive demo:** [try it on the website](https://ki-einfach-verstehen.de/en/lessons/optimization-of-the-weights/)

Adam is almost complete. But Meta’s report on the Llama 3 series names something with one more letter: AdamW.

## The W: a gentle pull toward zero

In its research paper, Meta trained the largest Llama 3 model, Llama 3.1 with 405 billion faders, with AdamW. What does the W mean?

![A fader with its cap above a crossbar that stands for zero; a coil spring pulls the cap down toward that crossbar](../../public/bausteine/optimierung-der-gewichte/feder-regler.webp)

*Weight decay is like a small spring on every fader: at every step it pulls the fader a little toward zero, whatever the note says. The crossbar stands for zero.*

Picture a small spring on every fader of the mixing desk that pulls it toward zero. At every step, the optimizer first moves each fader a tiny bit toward zero, in proportion to its value, and then takes the step from momentum and usual size. The spring has no resting point other than zero, and it always pulls, whatever the note says. This pull is called **[weight decay](https://ki-einfach-verstehen.de/en/glossary/weight-decay/)**. No fader is removed in the process, and none jumps to zero.

But what happens to a fader whose note says zero at every batch?

It shrinks, step by step, by the same small share of its value. After many steps it is close to zero. Faders the model needs get notes that keep pushing back against the pull. So faders that contribute nothing stay small, and no fader grows without reason.

Why a letter of its own? Adding the pull to the note would not work: Adam would divide it, together with the note, by the note’s usual size, so for a fader with large notes the pull would become tiny. So in 2017 two researchers proposed applying the pull separately, “decoupled”. The W in AdamW stands for this separate weight decay. The spring’s strength is a chosen number; according to the research paper, GPT-3 used 0.1. Common implementations multiply the pull by the learning rate, so at each step every fader shrinks by learning rate times 0.1 times its value. Large models have tiny learning rates, so that is a small fraction of the value.

That leaves the learning rate itself, fixed so far.

## Up first, then down for a long time: the learning-rate schedule

If so much depends on the learning rate, why not pick a good one and keep it?

> **Interactive demo:** [try it on the website](https://ki-einfach-verstehen.de/en/lessons/optimization-of-the-weights/)

Because training needs different steps at start and end. Toward the end, the model is close to the valley, but the notes keep wobbling, because every batch contains different text. A textbook gives this wobbling as the reason to lower the learning rate with the simple rule: it does not vanish at the lowest point. Adam wobbles for the same reason. With large steps the model would keep being pushed out of the valley, like the apple model that jumped between 0 and 6. Small steps let it come to rest.

At the start, the faders are set at random and the notes are large and wild. From so few notes, Adam estimates the usual size only roughly, so its step sizes swing widely, and some become much larger than needed. With a high learning rate, such steps easily go wrong. A research team proposed that a slow start cushions this uncertainty, and backed it with experiments and theory. So the learning rate starts near zero and is ramped up quickly. This is called **warm-up**. After that, it slowly falls.

This pre-set course is called a **[learning-rate schedule](https://ki-einfach-verstehen.de/en/glossary/learning-rate-schedule/)**. Like the learning rate itself, it is a hyperparameter. For the largest model in this series, Meta reports that it rose for 8,000 steps and then slowly fell over more than a million steps. The chart shows the values. At the end of training, the learning rate fell to zero.

![Llama 3.1 405B learning rate: rises to 0.00008 in 8,000 steps, then falls over 1.2 million steps to zero](../../public/bausteine/optimierung-der-gewichte/learning-rate-schedule-llama3.svg)

*The learning-rate schedule of Llama 3.1 with 405 billion faders according to Meta: on the left the first steps, in which the learning rate ramps up; on the right the whole run, in which the warm-up only shows as a vertical line at the start.*

<details class="verstaendnishilfe">
<summary>What would happen if, toward the end, you suddenly jumped back to the peak learning rate?</summary>

The steps would become large again. Near the valley, the notes still wobble, and every large step pushes the model out, as the apple model did at one sixth. The loss would probably rise again. That is why a schedule ends with small steps and does not jump back.

</details>

<details>
<summary>One level deeper: What the optimizer stores per fader</summary>

The lesson on model size gave you the 16 bytes per [parameter](https://ki-einfach-verstehen.de/en/glossary/parameters/) of a common setup. They come from the ZeRO research paper: 2 bytes for the 16-bit number, 2 bytes for its note and 12 bytes for the optimizer. The 12 bytes are the more precise 32-bit copy of the number plus Adam’s momentum and usual size, 4 bytes each.

So three quarters of what is stored per parameter belongs to the optimizer. Worked out for Llama 3.1 8B, that is about 96 of the 128 gigabytes. That is where ZeRO comes in. When many chips train together, each holds only its share of the optimizer values and turns only those faders. The paper works through an example with 7.5 billion parameters on 64 chips: 120 gigabytes per chip without splitting, 31.4 gigabytes when only the optimizer state is spread out.

</details>

At the start, Llama 3.1 8B’s eight billion faders had notes, and none had moved. Now you know who does the turning. How much text a model sees during training, and how you can tell that it is making progress, is shown in the [next lesson](./batch-epoch-step-token-budget.md).

---

Source: https://ki-einfach-verstehen.de/en/lessons/optimization-of-the-weights/

← Previous: [Backpropagation and Gradients: How the Model Knows What to Change](./backpropagation-and-gradients.md) · [All lessons](../../README.md#contents) · Next: [Batch, Epoch, Step, Token Budget: How Training Progress Is Measured](./batch-epoch-step-token-budget.md) →
