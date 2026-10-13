<!-- Generated from src/content/bausteine/en/parameters-training-inference-hardware.mdx by scripts/export-lessons.mjs -- do not edit by hand. -->

# Parameters, Training and Use: How a Model Learns

> Reading copy for GitHub. The full version with interactive demos, animations and recall moments is on the website: **[Parameters, Training and Use: How a Model Learns](https://ki-einfach-verstehen.de/en/lessons/parameters-training-inference-hardware/)**
>
> Licence: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.en) · Credit it as: KI einfach verstehen, “Parameters, Training and Use: How a Model Learns”, CC BY 4.0, https://ki-einfach-verstehen.de/en/lessons/parameters-training-inference-hardware/

What is inside a model file, what people decide before training, how training uses the error to find each fader’s direction and why learning costs more than using.

Some language models are available to download. One is Llama 3.1, released in summer 2024 by Meta, the company behind Facebook. Llama 3.1 is a language model like the one behind ChatGPT. Its smallest version, Llama 3.1 8B, consists mainly of about eight billion numbers.

The numbers in the model file were set by training. Still open: who decided how many there are. How did training know for each number whether it had to go up or down?

## What is inside a model file

Download Llama 3.1 8B and you get mainly two kinds of files. One is tiny and holds a kind of blueprint.

The other kind consists of large files totaling about 16 gigabytes (the box below shows where that figure comes from). They contain only numbers called [parameters](https://ki-einfach-verstehen.de/en/glossary/parameters/): values set by training, similar to the weights the spam filter stores for every word: one number per word that sets how strongly the word counts. You will find no readable sentence in them.

![On the left a small blueprint under one kilobyte, on the right a large block of numbers: about eight billion parameters, about 16 gigabytes](../../public/bausteine/parameter-training-inferenz-hardware/model-file.svg)

*A downloaded model consists of two parts: a small blueprint and billions of numbers.*

The “8B” in the name stands for 8 billion parameters. The B stands for “billion”, here a thousand million.

<details>
<summary>One level deeper: where the 16 gigabytes come from</summary>

Each of these numbers takes 2 bytes of memory. Memory is measured in bytes, and a gigabyte is a billion bytes. So the 16 gigabytes come about like this: eight billion times 2 bytes is 16 billion bytes, which is 16 gigabytes. The next lesson shows why it is 2 bytes and whether fewer would do.

A byte consists of eight yes-or-no bits. Each bit is either off (0) or on (1). Eight such bits can form 256 different patterns, and each pattern can stand for a number or a letter. That is how a computer stores everything it calculates or shows.

</details>

![Mixing desk with several faders](../../public/bausteine/parameter-training-inferenz-hardware/mischpult.svg)

*The blueprint determines how the desk is built. The parameters record where its faders sit.*

On the mixing desk from the first lesson, each fader is a parameter and its position a number. The small file is the blueprint: it describes the type of model and its size, that is, how many [layers](https://ki-einfach-verstehen.de/en/glossary/layer/) (computing stages) it has. The large files record where each fader sits. Some of these faders belong to the text pieces the tokenizer splits the text into. Each text piece has its own list of learned numbers; such a list is called a vector, which you know from the lesson on vectors and matrices. The blueprint sets how many such lists there are and how long they are. Each of these numbers is the position of one fader. Unlike a real desk, none has a label.

What do you think: if two models have exactly the same blueprint, do they also behave the same? Guess before you read on.

Not necessarily. Meta also offers a second version, Llama 3.1 8B Instruct. Both share the same blueprint and number of parameters. The base version has only been through pretraining, where it learned to predict the next text piece. From “The cat sat”, it learns that “on” comes next. The Instruct version was then trained further to answer questions and instructions like a chatbot. The two differ in the values of their numbers. On download pages, the suffix “Instruct” marks the chat version.

But who decided that Llama 3.1 8B has eight and not nine billion faders?

## What people decide before training

Training does not make that decision. It sets the faders but does not build a new desk. Before training starts, people decide how many layers the model has, how wide each layer is and how large the vocabulary becomes. The number of parameters follows from that.

In the tokenizer lesson, [Byte Pair Encoding](https://ki-einfach-verstehen.de/en/glossary/byte-pair-encoding/) (BPE) ran until the [vocabulary](https://ki-einfach-verstehen.de/en/glossary/vocabulary/) (the fixed list of pieces a tokenizer knows) reached its preset size. The context window—the number of text pieces the model can process at once—is fixed too. It is set in the blueprint before anyone asks the chatbot a question.

Such settings are called **[hyperparameters](https://ki-einfach-verstehen.de/en/glossary/hyperparameter/)**. Training does not change them; it sets the parameters. They include choices about the size of the blueprint and about the training run itself, such as how much text the model sees.

The [temperature](https://ki-einfach-verstehen.de/en/glossary/temperature/) from the previous lesson is not trained either. It sets how much chance plays a part in the selection step. So is it a hyperparameter?

No. Hyperparameters are fixed before training and help determine which numbers end up in the file. Temperature is chosen only when the finished model is used, and it can be set for every request. It only determines how the [scores](https://ki-einfach-verstehen.de/en/glossary/score/) (the ratings for each possible next text piece; for “The cat sat”, a made-up score of 8.1 for “on”) become percentages, and it changes no number in the file. A chat app can therefore run the same model with a low or a high temperature.

![Timeline: people fix the hyperparameters beforehand, training sets the parameters, and during use you pick the temperature](../../public/bausteine/parameter-training-inferenz-hardware/who-sets-what.svg)

*Hyperparameters are fixed before training, training sets the parameters, and the temperature is chosen only during use.*

<details>
<summary>One level deeper: how GPT-3 was set up</summary>

GPT-3 from the first lesson, a predecessor of ChatGPT’s models, has about 175 billion parameters. Its 2020 paper lists, among others, these hyperparameters for the largest model:

- **96 layers.** A layer is a stage that processes the previous result.
- **12,288 numbers per text piece.** The vector that represents each text piece on its way through the layers; they are computed anew for every input.
- **A context window of 2,048 text pieces.**
- **A learning rate of at most 0.00006.** The learning rate sets how far each fader turns per step. Its course was fixed in advance: ramped up at the start, then lowered.
- **A batch of 3.2 million text pieces.** The corrections from this much text are collected and applied once.

None of these values was learned. Layer count, vector length and vocabulary size set how large the desk is: together with the structure of each layer, they give about 175 billion parameters. Learning rate and batch set how training runs.

</details>

Once everything is fixed, training begins.

## How does training know the direction?

With the spam filter from the first lesson, the training algorithm nudged the weights a small step after every error, toward a smaller error. There, you could still guess the direction. When a real email with “prize” in the subject wrongly landed in spam, the weight of “prize” was too high. With eight billion unlabeled faders, nobody can work out every direction. So how does training know where each one should go?

First, the error becomes a number. The training algorithm compares the model’s prediction with the right answer and works out how far off it is. This error number is called **loss**. For a language model, the loss is larger the lower the percentage the model gives to the text piece that actually follows, such as “on” after “The cat sat”.

A made-up mini model with one fader predicts apple prices: prediction equals fader setting times kilos. The fader therefore represents the price per kilo. This toy model only shows how the error reveals the right direction. Three made-up purchases serve as the example. They are listed in a small table below this paragraph, with the columns kilos and euros.

| Kilos | Euros |
|---|---|
| 1 | 2 |
| 1 | 4 |
| 2 | 6 |

There are no percentages here, so the apple model needs its own rule for its error: multiply each deviation by itself and add everything up. That way, too much counts as much as too little, and large deviations weigh more.

The fader starts at zero, like the spam filter’s weights. At zero, the model predicts zero euros for every purchase.

The deviations are 2, 4 and 6 euros. Squared and added, they give an error of 56.

Does it get smaller when the fader is at 1? Yes, it drops to 26.

At 1, the model predicts 1 euro for the first purchase, 1 euro for the second and 2 euros for the third.

Each deviation is the price minus the prediction. So they are 1, 3 and 4 euros; squared and added, they give 26. The fader therefore has to go up.

At 3 the error is at its smallest, and at 4 it rises again. It never reaches zero, because the two one-kilo purchases contradict each other.

The toy does not show whether a real model with billions of faders has just one lowest point.

![Error as a valley over the fader setting: 56 at 0, 26 at 1, 8 at 2, bottom 2 at 3; the steps shrink from 30 through 18 to 6](../../public/bausteine/parameter-training-inferenz-hardware/error-curve.svg)

*The error of the made-up apple model at every fader setting: far from the bottom it falls steeply with each euro, close to it hardly at all.*

The error drops less and less from one setting to the next. How steep the error is at one spot, like a hillside, is called the **slope**. You measure it with a tiny turn of the fader and scale the change in error up to one euro. The slope tells the direction. If the error falls when you turn the fader up, it must go higher; if it rises, lower. Its size tells the distance: steep means the bottom is still far away.

You are standing on a hillside in thick fog and want to reach the valley. You see nothing, but you feel underfoot which way the ground falls and how steeply. The valley is the fader setting with the smallest error. In the picture, the hillside is the error curve. Training has to calculate the slope at every spot.

In the fog you would stride down steep slopes and go carefully near the valley. Training must do the same: make each step depend on the slope.

## How far a step goes

In the apple model, each step equals the slope times the learning rate. The **[learning rate](https://ki-einfach-verstehen.de/en/glossary/learning-rate/)** is a number people choose before training, a hyperparameter. It determines how far the fader turns in each step: the larger it is, the longer the step. In the example it is one twenty-fourth, which lets you work out the first steps by hand.

Turn the fader by one hundredth; the error falls by just under 0.36.

Scaled up to a whole euro, that is a hundredfold: the slope at zero is about 36. A whole euro lowers the error by only 30, from 56 to 26, because the curve flattens. The error shows the direction: if it falls when you turn the fader up, the step goes up.

The first step is therefore 36 divided by 24, or 1.5.

The fader moves from zero to 1.5. There the bottom at 3 is only half as far away, so the slope is half as large.

The next step is therefore half as long and leads to 2.25.

Each further step halves the rest of the way down.

What happens with a learning rate four times as large, that is one sixth? Before you read on, consider where the fader jumps to.

The step is 36 divided by 6, so six euros. The fader jumps over the bottom to the other side of the valley. There the error is just as large as at the start, because the curve is symmetric around the bottom at 3.

At six the slope is just as large as at 0, only reversed: there the error rises as the fader turns up.

The next step is therefore again six euros long, but backward: 36 divided by 6. The fader lands back on 0 and jumps back and forth without ever reaching the bottom. If the learning rate is tiny, training hardly makes progress. Finding a suitable learning rate often takes several training runs.

![Two error curves: on the left ever shorter steps from 0 via 1.5 and 2.25 to the bottom at 3, on the right jumps from 0 to 6 and back](../../public/bausteine/parameter-training-inferenz-hardware/learning-rate.svg)

*The same error curve, two learning rates: with one twenty-fourth, each step halves what is left to the valley; with one sixth, the fader jumps back and forth between 0 and 6.*

> **Interactive demo:** [try it on the website](https://ki-einfach-verstehen.de/en/lessons/parameters-training-inference-hardware/)

A real model has billions of faders. Turning each one and re-measuring the error would mean computing the whole model billions of times per step. Instead, a method called **backpropagation** gives the slope for all faders at once, in a single pass backward through the model. Each fader then moves downhill, toward where the error falls, as in the apple model. “How Learning Works” explains how backpropagation finds these slopes.

GPT-3 was trained with the method Adam, which works out the step length of each fader from the current and earlier slopes; the learning rate remains the control knob.

The spam filter worked the same way. For a genuine message with “prize” in its subject, a higher weight would have increased the error and a lower one would have decreased it, so the weight moved down.

## Learning costs more than using

An answer appears in the chat window after a few seconds. According to Meta, training Llama 3.1 8B took 1.46 million hours of computing time, added up across all AI chips working at the same time. It ran on graphics processors, which carry out many similar calculations in parallel.

At the sound check before a concert, the band plays a few bars. The sound engineer listens and pushes the faders until it sounds right. During the concert, the desk processes whatever comes in. The sound check stands for training. Using the finished model is called **[inference](https://ki-einfach-verstehen.de/en/glossary/inference/)** and corresponds to the concert. Every question you ask a chatbot triggers inference.

![From behind: a sound engineer reaches for a fader on a large mixing desk, in front of her empty rows of seats and a band on stage](../../public/bausteine/parameter-training-inferenz-hardware/soundcheck.webp)

*The sound check before the concert: first the faders are set, then they stay put.*

The picture falls short in two places, though. In training, nobody pushes faders by ear. Backpropagation calculates for all faders where they should go. And at a real desk, the engineer still steps in during the concert. **During inference, no fader moves at all, whatever you type.** What a chatbot “remembers” from your conversation is included in the input with every message; the lesson on input and output explains how. New versions of a model only come from later training runs.

Before you read on: what does the model compute for each text piece when it answers, and what does training add?

During inference, the model uses its fixed numbers to compute once per text piece: the input goes in, a list of scores comes out. Training starts with the same computation. Then the training algorithm compares the prediction with the actual next text piece and measures the loss. Next, backpropagation gives each of the eight billion faders its slope. Finally, it adjusts the faders once the batch’s slopes are collected.

![Top, training as a loop: compute, compare with the correct text piece, adjust. Bottom, inference: compute with fixed parameters](../../public/bausteine/parameter-training-inferenz-hardware/training-inference.svg)

*Training is a loop of computing, comparing and adjusting. Inference is only the first step, with fixed numbers.*

Per text piece, training takes about three times as much computing as inference, because the slopes add. The amount makes the difference: an answer works through roughly a few hundred text pieces, while Meta gives about 15 trillion text pieces for training Llama 3.1, which is many billions of times as many.

For the 8-billion version, one chip would need about 167 years (1.46 million hours divided by 8,760 hours per year). That is why many chips share the work at once.

<details>
<summary>One level deeper: how much computing time the largest Llama 3.1 needed</summary>

Meta’s model card gives about 30.8 million hours on H100 chips for the largest Llama 3.1, the version with 405 billion parameters. An H100 is a graphics chip for AI calculations. A single chip would need about 3,500 years for that. Meta therefore spread the work across more than 16,000 H100 chips, cutting the time to just under three months. This is only a rough estimate, because the chips do not compute all the time and some time is lost to coordination between them. The basic idea stays: many chips share one calculation, so that it finishes in months instead of millennia. This effort is made once per version.

</details>

But because millions of people ask questions, using the models also requires large data centers.

Back to the start: people fix the blueprint and its size beforehand. Training adjusts each of the eight billion numbers according to its slope. How much memory that takes, and whether it fits on a phone, is the subject of the next lesson, [Model Size and Hardware: Where a Model Fits](./model-size-and-hardware.md).

---

Source: https://ki-einfach-verstehen.de/en/lessons/parameters-training-inference-hardware/

← Previous: [Probability and Softmax: How a Model Decides](./probability-and-softmax.md) · [All lessons](../../README.md#contents) · Next: [Model Size and Hardware: Where a Model Fits](./model-size-and-hardware.md) →
